<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Tag;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
         // Middleware for policies can be applied here or in routes
         // $this->authorizeResource(Product::class, 'product');
    }

    public function index(Request $request)
    {
        $query = Product::with(['brand', 'tags']);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        // Filters
        // ... add filters if needed (category, brand, etc)

        // Pagination
        $products = $query->latest()->paginate($request->input('per_page', 15))->withQueryString();

        return Inertia::render('Inventory/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/Products/Create', [
            'brands' => Brand::all(),
            'categories' => Category::all(),
            'tags' => Tag::all(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->productService->createProduct($request->validated());

        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente.');
    }

    public function show(Product $product)
    {
        $product->load(['brand', 'category', 'tags', 'images', 'equivalencesA', 'equivalencesB', 'priceListItems.priceList']);
        
        // Merge equivalences for display
        $product->equivalences = $product->equivalences; 

        return Inertia::render('Inventory/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $product->load(['tags']);
        
        return Inertia::render('Inventory/Products/Edit', [
            'product' => $product,
            'brands' => Brand::all(),
            'categories' => Category::all(),
            'tags' => Tag::all(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->productService->updateProduct($product, $request->validated());

        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        try {
            $this->productService->deleteProduct($product);
            return redirect()->back()->with('success', 'Producto eliminado.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        
        try {
            $this->productService->bulkDelete($request->ids);
            return redirect()->back()->with('success', 'Productos eliminados.');
        } catch (\Exception $e) {
             return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function generateBarcode(Request $request, Product $product)
    {
        // Simple HTML view for print
        $html = "
        <html>
        <body onload='window.print()'>
            <div style='text-align:center; font-family:sans-serif;'>
                <h3>{$product->name}</h3>
                <img src='https://bwipjs-api.metafloor.com/?bcid=code128&text={$product->reference}&scale=3&includetext' />
                <p>{$product->reference}</p>
                <p style='font-size:10px;'>{$product->brand?->name}</p>
            </div>
        </body>
        </html>
        ";
        
        return response($html);
    }
}
