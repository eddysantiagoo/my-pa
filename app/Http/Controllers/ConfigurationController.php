<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    public function index()
    {
        $configurations = \App\Models\Configuration::all()->keyBy('module');

        // Default configurations if not present (Mocking the structure from the image)
        $defaultModules = [
            'Empresa' => [
                ['name' => 'Empresa', 'type' => 'route', 'href' => '/configuration/company', 'status' => true],
                ['name' => 'Usuarios', 'type' => 'route', 'href' => '/configuration/users', 'status' => true],
                ['name' => 'Tipos de Usuario', 'type' => 'route', 'href' => '/configuration/user-types', 'status' => true],
                ['name' => 'Mi perfil', 'type' => 'route', 'href' => '/configuration/profile', 'status' => true],
                ['name' => 'Seguridad', 'type' => 'route', 'href' => '/configuration/security', 'status' => true],
                ['name' => 'Etiquetas', 'type' => 'route', 'href' => '/configuration/tags', 'status' => true],
            ],
            'Facturación' => [
                ['name' => 'Términos de pago', 'type' => 'route', 'href' => '/configuration/payment-terms', 'status' => true],
                ['name' => 'Numeraciones', 'type' => 'route', 'href' => '/configuration/numbering', 'status' => true],
                ['name' => 'Datos generales', 'type' => 'route', 'href' => '/configuration/general-data', 'status' => true],
                ['name' => 'Vendedores', 'type' => 'route', 'href' => '/configuration/sellers', 'status' => true],
                ['name' => 'Habilitar Facturación a terceros', 'type' => 'toggle', 'status' => false],
                ['name' => 'Marca de agua', 'type' => 'route', 'href' => '/configuration/watermark', 'status' => true],
                ['name' => 'Factura de exportación', 'type' => 'toggle', 'status' => false],
                ['name' => 'Configurar TRM Manual', 'type' => 'toggle', 'status' => false],
                ['name' => 'Bloqueos Especiales', 'type' => 'toggle', 'status' => false],
                ['name' => 'Deshabilitar Remision alternativa', 'type' => 'toggle', 'status' => false],
                ['name' => 'Habilitar saldo pendientes en pdf', 'type' => 'toggle', 'status' => false],
                ['name' => 'Deshabilitar Módulo Remision Alternativas', 'type' => 'toggle', 'status' => false],
                ['name' => 'Habilitar Campo Placa en Factura de Venta', 'type' => 'toggle', 'status' => false],
            ],
            'Facturación POS' => [
                ['name' => 'Términos de pago', 'type' => 'route', 'href' => '/configuration/payment-terms', 'status' => true],
                ['name' => 'Numeraciones', 'type' => 'route', 'href' => '/configuration/numbering', 'status' => true],
                ['name' => 'Datos generales (Tirilla)', 'type' => 'route', 'href' => '/configuration/pos-general', 'status' => true],
                ['name' => 'Deshabilitar Facturación POS', 'type' => 'toggle', 'status' => false],
                ['name' => 'Habilitar Pagos Recibidos POS', 'type' => 'toggle', 'status' => true],
            ],
            'Compras' => [
                ['name' => 'Deshabilitar Módulo de Comprobantes', 'type' => 'toggle', 'status' => false],
                ['name' => 'Deshabilitar Módulo Remisión de proveedores', 'type' => 'toggle', 'status' => false],
            ],
            'Documentos Soporte' => [
                ['name' => 'Deshabilitar documentos soporte', 'type' => 'toggle', 'status' => false],
                ['name' => 'Numeraciones', 'type' => 'route', 'href' => '/configuration/numbering', 'status' => true],
            ],
            'Impuestos' => [
                ['name' => 'Impuestos', 'type' => 'route', 'href' => '/configuration/taxes', 'status' => true],
                ['name' => 'Retenciones', 'type' => 'route', 'href' => '/configuration/withholdings', 'status' => true],
            ],
            'Contactos' => [
                ['name' => 'Tipos de Contactos', 'type' => 'route', 'href' => '/configuration/contact-types', 'status' => true],
                ['name' => 'Asociar Guias de Envio', 'type' => 'toggle', 'status' => false],
            ],
            'Inventario' => [
                ['name' => 'Pantilla de código de barras', 'type' => 'route', 'href' => '/configuration/barcodes', 'status' => true],
            ],
            'Campos Extras Inventario' => [
                ['name' => 'Campos', 'type' => 'route', 'href' => '/configuration/inventory-fields', 'status' => true],
                ['name' => 'Habilitar Campos extras', 'type' => 'toggle', 'status' => true],
            ],
            'Planes' => [
                ['name' => 'Pagos de Suscripción', 'type' => 'route', 'href' => '/configuration/subscription-payments', 'status' => true],
                ['name' => 'Plan personalizado', 'type' => 'route', 'href' => '/configuration/custom-plan', 'status' => true],
                ['name' => 'Planes', 'type' => 'route', 'href' => '/configuration/plans', 'status' => true],
                ['name' => 'Metodos de pago', 'type' => 'route', 'href' => '/configuration/payment-methods', 'status' => true],
            ],
            'Contabilidad' => [
                ['name' => 'Gestionar Categorías', 'type' => 'route', 'href' => '/configuration/categories', 'status' => true],
                ['name' => 'Asociar PUC a movimientos', 'type' => 'route', 'href' => '/configuration/puc', 'status' => true],
            ],
            'Sedes' => [
                ['name' => 'Crear Sede', 'type' => 'route', 'href' => '/configuration/locations/create', 'status' => true],
                ['name' => 'Ver Sedes', 'type' => 'route', 'href' => '/configuration/locations', 'status' => true],
            ],
            'CRM' => [
                ['name' => 'Metas por vendedor', 'type' => 'route', 'href' => '/configuration/seller-goals', 'status' => true],
                ['name' => 'Etiquetas de estado', 'type' => 'route', 'href' => '/configuration/crm-tags', 'status' => true],
                ['name' => 'Marca de agua', 'type' => 'route', 'href' => '/configuration/watermark', 'status' => false],
                ['name' => 'Compradores', 'type' => 'route', 'href' => '/configuration/buyers', 'status' => true],
            ],
            'Nómina' => [
                ['name' => 'Deshabilitar nómina', 'type' => 'toggle', 'status' => false],
                ['name' => 'Preferencias de pago', 'type' => 'route', 'href' => '/configuration/payment-preferences', 'status' => true],
                ['name' => 'Numeraciones', 'type' => 'route', 'href' => '/configuration/numbering', 'status' => true],
                ['name' => 'Calculos fijos', 'type' => 'route', 'href' => '/configuration/fixed-calculations', 'status' => true],
                ['name' => 'Asistente de habilitación DIAN', 'type' => 'route', 'href' => '/configuration/dian-assistant', 'status' => true],
                ['name' => 'Reduccion Jornada Laboral', 'type' => 'toggle', 'status' => false],
                ['name' => 'Planes de Suscripción', 'type' => 'route', 'href' => '/configuration/subscription-plans', 'status' => true],
            ],
            'Tracking (Seguimiento)' => [
                ['name' => 'Deshabilitar tracking', 'type' => 'toggle', 'status' => false],
            ],
            'Columnas De Tabla' => [
                ['name' => 'Columnas', 'type' => 'route', 'href' => '/configuration/table-columns', 'status' => true],
            ],
        ];

        // Merge DB configurations with Defaults
        $finalConfigs = [];
        foreach ($defaultModules as $module => $options) {
            if ($configurations->has($module)) {
                $finalConfigs[$module] = $configurations[$module]->options;
            } else {
                $finalConfigs[$module] = $options;
            }
        }

        return inertia('Configuration/Index', [
            'configurations' => $finalConfigs,
            'company' => [ // Mocked company info from image
                'name' => 'GESTOR DE PARTES S.A.S.',
                'nit' => '901548158 -6',
                'type' => 'Jurídica',
                'phone' => '+57 4481642',
                'address' => 'CL 32C 66C 64, Belén, Medellín, Antioquia',
                'email' => 'Contabilidad@Gestordepartes.Com',
                'logo_url' => '/images/logo-placeholder.png' // Ensure this exists or use placeholder
            ]
        ]);
    }

    public function update(Request $request, $module)
    {
        $request->validate([
            'options' => 'required|array',
        ]);

        \App\Models\Configuration::updateOrCreate(
            ['module' => $module],
            ['options' => $request->options]
        );

        return back()->with('success', 'Configuración actualizada correctamente.');
    }
}
