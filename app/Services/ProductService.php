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

            // Handle Aliases
            if (isset($data['aliases']) && is_array($data['aliases'])) {
                foreach ($data['aliases'] as $aliasData) {
                    if (!empty($aliasData['alias'])) {
                        $product->aliases()->create([
                            'alias' => $aliasData['alias'],
                            'description' => $aliasData['description'] ?? null,
                            'is_main' => $aliasData['is_main'] ?? false,
                        ]);
                    }
                }
            }

            // Handle Applications (Sync IDs)
            if (isset($data['applications']) && is_array($data['applications'])) {
                $product->applications()->sync($data['applications']);
            }

            // Handle Storage Locations
            if (isset($data['storage_locations']) && is_array($data['storage_locations'])) {
                foreach ($data['storage_locations'] as $loc) {
                    if (!empty($loc['warehouse_id']) && !empty($loc['location_name'])) {
                        $product->storageLocations()->create([
                            'warehouse_id' => $loc['warehouse_id'],
                            'location_name' => $loc['location_name'],
                        ]);
                    }
                }
            }

            return $product;
        });
    }

    public function updateProduct(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update($data);

            // Sync Aliases (Delete all and recreate is simplest for now, or sophisticated sync)
            // For now, let's look for IDs to update, or wipe and replace. 
            // Wipe and replace is safer for "edit all" UI.
            if (isset($data['aliases'])) {
                $product->aliases()->delete();
                foreach ($data['aliases'] as $aliasData) {
                    if (!empty($aliasData['alias'])) {
                        $product->aliases()->create([
                            'alias' => $aliasData['alias'],
                            'description' => $aliasData['description'] ?? null,
                            'is_main' => $aliasData['is_main'] ?? false,
                        ]);
                    }
                }
            }

            // Sync Applications
            if (isset($data['applications'])) {
                $product->applications()->sync($data['applications']);
            }

            // Sync Storage Locations
            if (isset($data['storage_locations'])) {
                $product->storageLocations()->delete();
                 foreach ($data['storage_locations'] as $loc) {
                    if (!empty($loc['warehouse_id']) && !empty($loc['location_name'])) {
                        $product->storageLocations()->create([
                            'warehouse_id' => $loc['warehouse_id'],
                            'location_name' => $loc['location_name'],
                        ]);
                    }
                }
            }

            return $product;
        });
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
