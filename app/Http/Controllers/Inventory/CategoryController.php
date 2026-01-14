<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        // Recursive load for tree view
        $categories = Category::with('children')->whereNull('parent_id')->orderBy('name')->get();
        return Inertia::render('Inventory/Categories/Index', [
            'categories' => $categories
        ]);
    }
    
    public function list() 
    {
        // Returns all categories for flat select if needed, or tree
        return response()->json(Category::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'],
        ]);

        return redirect()->back()->with('success', 'Categoría creada.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

         if ($validated['parent_id'] == $category->id) {
            return back()->withErrors(['parent_id' => 'No puede ser padre de sí mismo']);
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'],
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'Categoría eliminada.');
    }
}
