<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\WarehouseTransfer;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WarehouseTransferController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        $transfers = WarehouseTransfer::with(['originWarehouse', 'destinationWarehouse', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Inventory/Transfers/Index', [
            'transfers' => $transfers
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/Transfers/Create', [
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'products' => Product::where('is_active', true)->select('id', 'name', 'reference')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'origin_warehouse_id' => 'required|exists:warehouses,id',
            'destination_warehouse_id' => 'required|exists:warehouses,id|different:origin_warehouse_id',
            'observations' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        try {
            $origin = Warehouse::findOrFail($validated['origin_warehouse_id']);
            $destination = Warehouse::findOrFail($validated['destination_warehouse_id']);

            $this->inventoryService->createTransfer(
                $origin,
                $destination,
                $validated['items'],
                $validated['observations'],
                Auth::user()
            );

            return redirect()->route('inventory.transfers.index')
                ->with('success', 'Transferencia creada exitosamente.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function confirm(WarehouseTransfer $transfer)
    {
        try {
            $this->inventoryService->confirmTransfer($transfer, Auth::user());
            return back()->with('success', 'Transferencia confirmada y stock actualizado.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function cancel(WarehouseTransfer $transfer)
    {
        try {
            $this->inventoryService->cancelTransfer($transfer);
            return back()->with('success', 'Transferencia cancelada.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
