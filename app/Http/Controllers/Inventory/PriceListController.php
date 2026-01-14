<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\PriceList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriceListController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/PriceLists/Index', [
            'priceLists' => PriceList::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:price_lists,code',
            'description' => 'nullable|string|max:500',
            'type' => 'required|in:base,percentage,fixed',
            'percentage' => 'nullable|numeric|min:0',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            PriceList::where('is_default', true)->update(['is_default' => false]);
        }

        PriceList::create($validated);

        return redirect()->back()->with('success', 'Lista de precios creada exitosamente.');
    }

    public function update(Request $request, PriceList $priceList)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:price_lists,code,' . $priceList->id,
            'description' => 'nullable|string|max:500',
            'type' => 'required|in:base,percentage,fixed',
            'percentage' => 'nullable|numeric|min:0',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (($validated['is_default'] ?? false) && !$priceList->is_default) {
            PriceList::where('is_default', true)->update(['is_default' => false]);
        }

        $priceList->update($validated);

        return redirect()->back()->with('success', 'Lista de precios actualizada exitosamente.');
    }

    public function destroy(PriceList $priceList)
    {
        if ($priceList->type === 'base') {
            return redirect()->back()->with('error', 'No se puede eliminar la lista base.');
        }

        $priceList->delete();

        return redirect()->back()->with('success', 'Lista de precios eliminada exitosamente.');
    }
}
