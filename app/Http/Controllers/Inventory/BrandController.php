<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    // API/JSON List for Selects
    public function list(Request $request)
    {
        $query = Brand::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('name')->limit(50)->get());
    }

    // Inertia Page for Management
    public function index()
    {
        return Inertia::render('Inventory/Brands/Index', [
            'brands' => Brand::withCount('products')->orderBy('name')->paginate(15)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        $brand = Brand::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        if ($request->wantsJson()) {
            return response()->json($brand);
        }

        return redirect()->back()->with('success', 'Marca creada exitosamente.');
    }

    public function update(Request $request, Brand $brand)
    {
         $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
        ]);

        $brand->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Marca actualizada.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->products()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar la marca porque tiene productos asociados.');
        }

        $brand->delete();

        return redirect()->back()->with('success', 'Marca eliminada.');
    }
}
