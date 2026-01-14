import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Archive, DollarSign, Tag, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// Components
import { TreeSelect, TreeNode } from '@/Components/TreeSelect';
import { AliasManager, AliasItem } from '@/Components/AliasManager';
import { LocationManager, StorageLocationItem } from '@/Components/LocationManager';
import { CreatableSelect, Option } from '@/Components/CreatableSelect';

interface ProductCreateProps {
    brands: Option[];
    categories: TreeNode[];
    applications: TreeNode[];
    warehouses: any[];
    tags: any[];
}

export default function ProductCreate({ brands, categories, applications, warehouses, tags }: ProductCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        reference: '',
        name: '',
        description: '',
        brand_id: '' as string | number,
        category_id: '' as string | number, // One category
        unit_of_measure: 'UNID',
        purchase_price: '',
        price: '',
        tax_rate: '0',
        stock: 0, // Initial stock usually blocked or 0
        is_active: true,
        is_public: true,
        is_inventariable: true,
        is_rotative: true,
        main_image: null as File | null,

        // New Relationships
        aliases: [] as AliasItem[],
        applications: [] as number[], // IDs
        storage_locations: [] as StorageLocationItem[],
    });

    const [brandOptions, setBrandOptions] = useState(brands);

    const handleCreateBrand = async (name: string) => {
        try {
            const res = await axios.post(route('brands.store'), { name });
            const newBrand = res.data;
            setBrandOptions(prev => [...prev, newBrand]);
            return newBrand;
        } catch (error) {
            console.error(error);
            alert("Error al crear la marca");
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Nuevo Producto', href: '#' }]}>
            <Head title="Nuevo Producto" />

            <form onSubmit={submit} className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Crear Nuevo Producto</h1>
                        <p className="text-muted-foreground mt-1">Configure los detalles del ítem, inventario y relaciones.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <Link href={route('products.index')}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing} size="lg" className="bg-primary shadow-lg hover:shadow-xl transition-all">
                            {processing ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - Main Info */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. General Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" /> Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reference">Código Principal / SKU *</Label>
                                        <Input
                                            id="reference"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            placeholder="EJ-001"
                                            required
                                            className="font-mono"
                                        />
                                        {errors.reference && <p className="text-sm text-red-500">{errors.reference}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Marca</Label>
                                        <CreatableSelect
                                            options={brandOptions}
                                            value={data.brand_id}
                                            onChange={(opt) => setData('brand_id', opt.id)}
                                            onCreate={handleCreateBrand}
                                            placeholder="Seleccionar o Crear Marca"
                                        />
                                        {errors.brand_id && <p className="text-sm text-red-500">{errors.brand_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Producto *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Filtro de Aceite Heavy Duty"
                                        required
                                        className="text-lg"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción Detallada</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <AliasManager
                                    aliases={data.aliases}
                                    onChange={(val) => setData('aliases', val)}
                                    error={errors.aliases ? "Revise los alias" : undefined}
                                />
                            </CardContent>
                        </Card>

                        {/* 2. Categorization & Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-primary" /> Clasificación
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Categoría</Label>
                                        <TreeSelect
                                            data={categories}
                                            value={data.category_id ? Number(data.category_id) : null}
                                            onChange={(val) => setData('category_id', val as number)}
                                            placeholder="Seleccionar Categoría..."
                                        />
                                        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Aplicaciones (Vehículos/Maquinaria)</Label>
                                        <TreeSelect
                                            data={applications}
                                            value={data.applications}
                                            onChange={(val) => setData('applications', val as number[])}
                                            placeholder="Seleccionar Aplicaciones..."
                                            multiple={true}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Switch
                                            checked={data.is_rotative}
                                            onCheckedChange={(checked) => setData('is_rotative', checked)}
                                            id="is_rotative"
                                        />
                                        <Label htmlFor="is_rotative" className="ml-2">Ítem Rotativo (Alta demanda)</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-primary" /> Precios y Costos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase_price">Costo Unitario ($)</Label>
                                        <Input
                                            id="purchase_price"
                                            type="number"
                                            step="0.01"
                                            value={data.purchase_price}
                                            onChange={(e) => setData('purchase_price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.purchase_price && <p className="text-sm text-red-500">{errors.purchase_price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Precio de Venta Base ($) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className="text-lg font-bold text-green-700"
                                            required
                                        />
                                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tax_rate">Impuesto (%)</Label>
                                        <Input
                                            id="tax_rate"
                                            type="number"
                                            step="0.01"
                                            value={data.tax_rate}
                                            onChange={(e) => setData('tax_rate', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Inventory & Media */}
                    <div className="space-y-6">

                        {/* 3. Logic & Inventory */}
                        <Card className={data.is_inventariable ? 'border-primary/50 bg-primary/5' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Archive className="w-5 h-5 text-primary" /> Configuración de Stock
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Maneja Inventario</Label>
                                        <CardDescription>Activar seguimiento de stock</CardDescription>
                                    </div>
                                    <Switch
                                        checked={data.is_inventariable}
                                        onCheckedChange={(checked) => setData('is_inventariable', checked)}
                                    />
                                </div>

                                {data.is_inventariable && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="uom">Unidad de Medida</Label>
                                            <Input
                                                id="uom"
                                                value={data.unit_of_measure}
                                                onChange={(e) => setData('unit_of_measure', e.target.value)}
                                                placeholder="UNID, KG, MT..."
                                            />
                                        </div>

                                        <Separator />

                                        <LocationManager
                                            value={data.storage_locations}
                                            onChange={(val) => setData('storage_locations', val)}
                                            warehouses={warehouses}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 4. Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" /> Multimedia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <Input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setData('main_image', e.target.files ? e.target.files[0] : null)}
                                        accept="image/*"
                                    />
                                    {data.main_image ? (
                                        <div className="text-sm font-medium text-primary">
                                            {data.main_image.name}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Click para subir imagen principal</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={data.is_public}
                                        onCheckedChange={(checked) => setData('is_public', checked)}
                                        id="is_public"
                                    />
                                    <Label htmlFor="is_public">Visible en Tienda / Publico</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                        id="is_active"
                                    />
                                    <Label htmlFor="is_active">Producto Activo</Label>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
