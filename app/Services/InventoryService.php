<?php

namespace App\Services;

use App\Models\InventoryAdjustment;
use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseTransfer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    /**
     * Create an inventory adjustment (Increment or Decrement).
     */
    public function createAdjustment(
        Product $product,
        Warehouse $warehouse,
        string $type, // 'increment' or 'decrement'
        float $quantity,
        ?float $unitCost,
        string $date,
        ?string $observations,
        User $user
    ): InventoryAdjustment {
        if ($quantity <= 0) {
            throw new Exception("La cantidad debe ser mayor a 0.");
        }

        return DB::transaction(function () use ($product, $warehouse, $type, $quantity, $unitCost, $date, $observations, $user) {
            
            // 1. Validate Stock for Decrement
            $currentStock = $this->getStock($product, $warehouse);
            
            if ($type === 'decrement') {
                if ($currentStock < $quantity) {
                    throw new Exception("Stock insuficiente. Stock actual: {$currentStock}, Intento de disminución: {$quantity}");
                }
            }

            // 2. Create Adjustment Record
            $adjustment = InventoryAdjustment::create([
                'product_id' => $product->id,
                'warehouse_id' => $warehouse->id,
                'type' => $type,
                'quantity' => $quantity,
                'unit_cost' => $unitCost,
                'date' => $date,
                'observations' => $observations,
                'user_id' => $user->id,
            ]);

            // 3. Update Stock & Create Transaction
            $transactionType = $type === 'increment' ? 'adjustment_in' : 'adjustment_out';
            $stockChange = $type === 'increment' ? $quantity : -$quantity;
            
            $this->updateStock(
                $product, 
                $warehouse, 
                $stockChange, 
                $transactionType, 
                $adjustment, 
                $user
            );

            return $adjustment;
        });
    }

    /**
     * Create a transfer request (Pending state).
     */
    public function createTransfer(
        Warehouse $origin,
        Warehouse $destination,
        array $items, // [['product_id' => 1, 'quantity' => 10]]
        ?string $observations,
        User $user
    ): WarehouseTransfer {
        if ($origin->id === $destination->id) {
            throw new Exception("La bodega de origen y destino no pueden ser la misma.");
        }

        return DB::transaction(function () use ($origin, $destination, $items, $observations, $user) {
            $transfer = WarehouseTransfer::create([
                'origin_warehouse_id' => $origin->id,
                'destination_warehouse_id' => $destination->id,
                'status' => 'pending',
                'observations' => $observations,
                'user_id' => $user->id,
            ]);

            foreach ($items as $item) {
                // Validate availability immediately? Usually better to validate on confirm, 
                // but let's check basic availability now to warn user.
                // For now, we just create the request. Logic can be added to reserve stock if needed.
                
                $transfer->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $transfer;
        });
    }

    /**
     * Confirm a transfer (Move stock).
     */
    public function confirmTransfer(WarehouseTransfer $transfer, User $user): void
    {
        if ($transfer->status !== 'pending') {
            throw new Exception("Solo se pueden confirmar transferencias pendientes.");
        }

        DB::transaction(function () use ($transfer, $user) {
            
            foreach ($transfer->items as $item) {
                $product = $item->product;
                
                // 1. Check Origin Stock
                $originStock = $this->getStock($product, $transfer->originWarehouse);
                if ($originStock < $item->quantity) {
                    throw new Exception("Stock insuficiente en origen para el producto {$product->name}. Requerido: {$item->quantity}, Disponible: {$originStock}");
                }

                // 2. Deduct from Origin
                $this->updateStock(
                    $product,
                    $transfer->originWarehouse,
                    -$item->quantity,
                    'transfer_out',
                    $transfer,
                    $user
                );

                // 3. Add to Destination
                $this->updateStock(
                    $product,
                    $transfer->destinationWarehouse,
                    $item->quantity,
                    'transfer_in',
                    $transfer,
                    $user
                );
            }

            $transfer->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);
        });
    }

    /**
     * Cancel a transfer.
     */
    public function cancelTransfer(WarehouseTransfer $transfer): void
    {
        if ($transfer->status !== 'pending') {
            throw new Exception("Solo se pueden cancelar transferencias pendientes.");
        }

        $transfer->update(['status' => 'cancelled']);
    }

    /**
     * Core stock update method that handles audit logging.
     */
    private function updateStock(
        Product $product, 
        Warehouse $warehouse, 
        float $quantityChange, 
        string $transactionType, 
        Model $reference, 
        User $user
    ): void {
        
        $stockRecord = Stock::firstOrCreate(
            ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
            ['quantity' => 0]
        );

        $previousQty = $stockRecord->quantity;
        $newQty = $previousQty + $quantityChange;

        // Prevent negative stock (Double check, though service logic should catch this)
        if ($newQty < 0) {
             throw new Exception("Error crítico: La operación resultaría en stock negativo para {$product->name} en {$warehouse->name}.");
        }

        $stockRecord->quantity = $newQty;
        $stockRecord->save();

        // Audit Log
        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => $transactionType,
            'quantity' => $quantityChange,
            'previous_quantity' => $previousQty,
            'new_quantity' => $newQty,
            'reference_type' => $reference->getMorphClass(),
            'reference_id' => $reference->id,
            'user_id' => $user->id,
        ]);
        
        // Update Product cached stock (global sum) - Optional but good for performance
        $this->updateProductTotalStock($product);
    }

    public function getStock(Product $product, Warehouse $warehouse): float
    {
        $stock = Stock::where('product_id', $product->id)
                      ->where('warehouse_id', $warehouse->id)
                      ->value('quantity');
        
        return (float) ($stock ?? 0);
    }
    
    private function updateProductTotalStock(Product $product): void 
    {
        $total = Stock::where('product_id', $product->id)->sum('quantity');
        $product->update(['stock' => $total]);
    }
}
