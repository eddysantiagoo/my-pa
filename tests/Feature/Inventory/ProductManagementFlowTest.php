<?php

namespace Tests\Feature\Inventory;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductManagementFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_can_create_product_with_aliases_and_locations()
    {
        $this->withoutExceptionHandling();
        $warehouse = Warehouse::create(['name' => 'Main Warehouse', 'is_active' => true]);
        $brand = Brand::create(['name' => 'Test Brand', 'slug' => 'test-brand']);
        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        $application = Application::create(['name' => 'Test App', 'slug' => 'test-app']);

        $data = [
            'name' => 'Test Product',
            'reference' => 'TEST-001',
            'brand_id' => $brand->id,
            'category_id' => $category->id,
            'price' => 1000,
            'stock' => 50,
            'is_inventariable' => true,
            'aliases' => [
                ['alias' => 'ALIAS-1', 'description' => 'Desc 1', 'is_main' => true],
                ['alias' => 'ALIAS-2', 'description' => 'Desc 2', 'is_main' => false],
            ],
            'applications' => [$application->id],
            'storage_locations' => [
                ['warehouse_id' => $warehouse->id, 'location_name' => 'Shelf A1']
            ]
        ];

        $response = $this->post(route('products.store'), $data);
        
        if (session('errors')) {
            file_put_contents(base_path('tests/error_log.txt'), print_r(session('errors')->all(), true));
        }

        $response->assertRedirect(route('products.index'));
        $this->assertDatabaseHas('products', ['reference' => 'TEST-001']);
        
        $product = Product::where('reference', 'TEST-001')->first();
        
        // Check Aliases
        $this->assertCount(2, $product->aliases);
        $this->assertDatabaseHas('product_aliases', ['alias' => 'ALIAS-1', 'product_id' => $product->id]);

        // Check Applications
        $this->assertTrue($product->applications->contains($application));

        // Check Locations
        $this->assertDatabaseHas('product_storage_locations', [
            'product_id' => $product->id, 
            'warehouse_id' => $warehouse->id,
            'location_name' => 'Shelf A1'
        ]);
    }

    public function test_can_update_product_complex_fields()
    {
        $brand = Brand::create(['name' => 'Test Brand', 'slug' => 'test-brand']);
        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        
        $product = Product::create([
            'name' => 'Original Name',
            'reference' => 'REF-001',
            'brand_id' => $brand->id,
            'category_id' => $category->id,
            'purchase_price' => 100,
            'price' => 200,
            'stock' => 10,
            'is_active' => true,
            'is_public' => true,
            'is_inventariable' => true,
            'is_rotative' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $warehouse = Warehouse::create(['name' => 'Main Warehouse', 'is_active' => true]);
        
        $data = [
            'name' => 'Updated Name',
            'reference' => $product->reference,
            'aliases' => [
                ['alias' => 'NEW-ALIAS', 'description' => 'New Desc', 'is_main' => true],
            ],
            'storage_locations' => [
                ['warehouse_id' => $warehouse->id, 'location_name' => 'New Shelf']
            ]
        ];

        $response = $this->put(route('products.update', $product), $data);

        $response->assertRedirect(route('products.index'));

        $this->assertDatabaseHas('product_aliases', ['alias' => 'NEW-ALIAS', 'product_id' => $product->id]);
        $this->assertDatabaseHas('product_storage_locations', ['location_name' => 'New Shelf']);
    }

    public function test_can_create_brand_via_api()
    {
        $response = $this->postJson(route('brands.store'), [
            'name' => 'New API Brand'
        ]);

        $response->assertStatus(200) // or 201
                 ->assertJsonFragment(['name' => 'New API Brand']);
        
        $this->assertDatabaseHas('brands', ['name' => 'New API Brand']);
    }
}
