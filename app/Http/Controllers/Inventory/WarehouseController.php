<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Warehouses/Index', [
            'warehouses' => Warehouse::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses,code',
            'address' => 'nullable|string|max:255',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            Warehouse::where('is_default', true)->update(['is_default' => false]);
        }

        Warehouse::create($validated);

        return redirect()->back()->with('success', 'Bodega creada exitosamente.');
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses,code,' . $warehouse->id,
            'address' => 'nullable|string|max:255',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (($validated['is_default'] ?? false) && !$warehouse->is_default) {
            Warehouse::where('is_default', true)->update(['is_default' => false]);
        }

        $warehouse->update($validated);

        return redirect()->back()->with('success', 'Bodega actualizada exitosamente.');
    }

    public function destroy(Warehouse $warehouse)
    {
        if ($warehouse->is_default) {
            return redirect()->back()->with('error', 'No se puede eliminar la bodega por defecto.');
        }

        // Check for stocks
        if ($warehouse->stocks()->where('quantity', '>', 0)->exists()) {
             return redirect()->back()->with('error', 'No se puede eliminar una bodega con existencias.');
        }

        $warehouse->delete();

        return redirect()->back()->with('success', 'Bodega eliminada exitosamente.');
    }
}
