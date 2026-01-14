<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InventoryAdjustmentController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        $adjustments = InventoryAdjustment::with(['product', 'warehouse', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Inventory/Adjustments/Index', [
            'adjustments' => $adjustments
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/Adjustments/Create', [
            'products' => Product::where('is_active', true)->select('id', 'name', 'reference', 'stock')->get(), // stock here is global, frontend might fetch specific
            'warehouses' => Warehouse::where('is_active', true)->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'type' => 'required|in:increment,decrement',
            'quantity' => 'required|numeric|min:0.01',
            'unit_cost' => 'nullable|numeric|min:0',
            'date' => 'required|date',
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $product = Product::findOrFail($validated['product_id']);
            $warehouse = Warehouse::findOrFail($validated['warehouse_id']);

            $this->inventoryService->createAdjustment(
                $product,
                $warehouse,
                $validated['type'],
                $validated['quantity'],
                $validated['unit_cost'] ?? 0,
                $validated['date'],
                $validated['observations'],
                Auth::user()
            );

            return redirect()->route('inventory.adjustments.index')
                ->with('success', 'Ajuste de inventario registrado correctamente.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
