<?php

namespace Database\Seeders;

use App\Models\PriceList;
use App\Models\Role;
use App\Models\RoleType;
use Illuminate\Database\Seeder;

class RolesAndPriceListsSeeder extends Seeder
{
    public function run(): void
    {
        // Role Types
        $roleTypes = [
            ['code' => 'ADMIN', 'name' => 'Administrador', 'description' => 'Acceso total al sistema'],
            ['code' => 'SELLER', 'name' => 'Vendedor', 'description' => 'Gestión de ventas y clientes'],
            ['code' => 'WAREHOUSE', 'name' => 'Almacén', 'description' => 'Gestión de inventario'],
            ['code' => 'ACCOUNTANT', 'name' => 'Contador', 'description' => 'Gestión contable y financiera'],
            ['code' => 'SUPPORT', 'name' => 'Soporte', 'description' => 'Atención al cliente'],
        ];

        foreach ($roleTypes as $typeData) {
            $roleType = RoleType::create($typeData);

            // Create a default role for each type
            Role::create([
                'role_type_id' => $roleType->id,
                'name' => $typeData['name'],
                'description' => $typeData['description'],
                'permissions' => $this->getDefaultPermissions($typeData['code']),
            ]);
        }

        // Price Lists
        $priceLists = [
            ['code' => 'GENERAL', 'name' => 'General', 'description' => 'Lista de precios estándar', 'is_default' => true],
            ['code' => 'MAYORISTA', 'name' => 'Mayorista', 'description' => 'Precios para mayoristas', 'markup_percentage' => -10],
            ['code' => 'VIP', 'name' => 'VIP', 'description' => 'Precios especiales VIP', 'markup_percentage' => -15],
            ['code' => 'DISTRIBUIDOR', 'name' => 'Distribuidor', 'description' => 'Precios para distribuidores', 'markup_percentage' => -20],
        ];

        foreach ($priceLists as $priceListData) {
            PriceList::create($priceListData);
        }
    }

    private function getDefaultPermissions(string $roleCode): array
    {
        return match ($roleCode) {
            'ADMIN' => ['*'],
            'SELLER' => [
                'contacts.view',
                'contacts.create',
                'contacts.edit',
                'quotes.view',
                'quotes.create',
                'quotes.edit',
                'invoices.view',
                'invoices.create',
            ],
            'WAREHOUSE' => [
                'inventory.view',
                'inventory.create',
                'inventory.edit',
                'contacts.view',
            ],
            'ACCOUNTANT' => [
                'contacts.view',
                'invoices.view',
                'invoices.create',
                'invoices.edit',
                'payments.view',
                'payments.create',
                'reports.view',
            ],
            'SUPPORT' => [
                'contacts.view',
                'contacts.edit',
                'invoices.view',
            ],
            default => [],
        };
    }
}
