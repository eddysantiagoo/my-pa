<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ProductService
{
    public function createProduct(array $data, ?UploadedFile $mainImage = null): Product
    {
        return DB::transaction(function () use ($data, $mainImage) {
            $product = Product::create($data);

            if ($mainImage) {
                $path = $mainImage->store('products/' . $product->id, 'public');
                $product->update(['main_image_path' => $path]);
                
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'is_main' => true,
                ]);
            }

            return $product;
        });
    }

    public function updateProduct(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }

    public function deleteProduct(Product $product): void
    {
        // Policy check should happen in Controller, but double check here
        if ($product->stock > 0) {
            throw new \Exception('No se puede eliminar productos con stock.');
        }
        $product->delete();
    }

    public function bulkDelete(array $ids): void
    {
        // Enforce the check for ALL items
        $products = Product::whereIn('id', $ids)->get();
        
        foreach ($products as $product) {
            if ($product->stock > 0) {
                throw new \Exception("El producto {$product->reference} tiene stock y no puede ser eliminado.");
            }
        }
        
        Product::whereIn('id', $ids)->delete();
    }

    public function addEquivalence(Product $referenceProduct, Product $targetCode): void
    {
        // Bidirectional check
        if ($referenceProduct->id === $targetCode->id) {
            throw new \Exception('No puede ser equivalente a sí mismo.');
        }

        // Check availability
        $exists = DB::table('product_equivalences')
            ->where(function($q) use ($referenceProduct, $targetCode) {
                $q->where('product_a_id', $referenceProduct->id)->where('product_b_id', $targetCode->id);
            })
            ->orWhere(function($q) use ($referenceProduct, $targetCode) {
                $q->where('product_a_id', $targetCode->id)->where('product_b_id', $referenceProduct->id);
            })
            ->exists();

        if (!$exists) {
            // Standardize: Smaller ID first to avoid duplicates if we were just using one table, 
            // but we want exact A->B record or bi-directional insert?
            // The requirement says "Relationship is BIDIRECTIONAL". 
            // We usually store one record `min_id, max_id` and look up both ways, OR store two records.
            // Let's store one normalized record.
            
            $first = $referenceProduct->id < $targetCode->id ? $referenceProduct->id : $targetCode->id;
            $second = $referenceProduct->id < $targetCode->id ? $targetCode->id : $referenceProduct->id;
            
            DB::table('product_equivalences')->insert([
                'product_a_id' => $first,
                'product_b_id' => $second,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function removeEquivalence(Product $productA, Product $productB): void
    {
         DB::table('product_equivalences')
            ->where(function($q) use ($productA, $productB) {
                $q->where('product_a_id', $productA->id)->where('product_b_id', $productB->id);
            })
            ->orWhere(function($q) use ($productA, $productB) {
                $q->where('product_a_id', $productB->id)->where('product_b_id', $productA->id);
            })
            ->delete();
    }
}
