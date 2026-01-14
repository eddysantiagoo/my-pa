import { Head, useForm, Link } from '@inertiajs/react'; // Link added
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Save } from 'lucide-react';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';
import { format } from 'date-fns';

interface AdjustmentCreateProps {
    products: Product[]; // Note: These products contain 'stock' global sum. Real stock depends on warehouse.
    warehouses: Warehouse[];
}

export default function AdjustmentCreate({ products, warehouses }: AdjustmentCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        warehouse_id: '',
        product_id: '',
        type: 'increment' as 'increment' | 'decrement',
        quantity: '',
        unit_cost: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        observations: '',
    });

    const [currentStock, setCurrentStock] = useState<number | null>(null);

    // In a real app with many products/warehouses, we should fetch stock async.
    // However, since we don't have an endpoint for specific stock yet (except accessing the model),
    // and data is passed as props... actually products prop has 'stock' (global).
    // For specific warehouse stock, we might need to rely on the backend validation or add an async check.
    // For now, let's leave "Cantidad Actual" empty or descriptive if we can't get it easily without an extra API call.
    // Ideally, when selecting Product + Warehouse -> Fetch stock.
    // I'll skip the async fetch for now and rely on backend validation, but visual feedback is nice.
    // Let's assume for this MVP we won't show live warehouse-specific stock in the form unless we add an endpoint.

    const selectedProduct = products.find(p => p.id.toString() === data.product_id);
    const finalQuantity = () => {
        const qty = parseFloat(data.quantity) || 0;
        const current = currentStock || 0; // If we had it
        // Since we don't have warehouse-specific stock, we can't show exact final.
        // We can show +/-.
        return null;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('adjustments.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Ajustes', href: '/inventory/adjustments' }, { title: 'Nuevo', href: '#' }]}>
            <Head title="Nuevo Ajuste" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">Aplicar un Ajuste al Inventario</h1>
                </div>

                <form onSubmit={submit} className="bg-card p-6 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Warehouse */}
                    <div className="grid gap-2">
                        <Label htmlFor="warehouse">Bodega *</Label>
                        <Select onValueChange={(val) => setData('warehouse_id', val)} value={data.warehouse_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => (
                                    <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.warehouse_id && <span className="text-sm text-red-500">{errors.warehouse_id}</span>}
                    </div>

                    {/* Product */}
                    <div className="grid gap-2">
                        <Label htmlFor="product">Ítem *</Label>
                        <Select onValueChange={(val) => setData('product_id', val)} value={data.product_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(p => (
                                    <SelectItem key={p.id} value={p.id.toString()}>{p.name} - {p.reference}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <span className="text-sm text-red-500">{errors.product_id}</span>}
                    </div>

                    {/* Type */}
                    <div className="grid gap-2 col-span-1 md:col-span-2">
                        <Label className="mb-2">Tipo de Ajuste *</Label>
                        <RadioGroup
                            value={data.type}
                            onValueChange={(val) => setData('type', val as any)}
                            className="flex gap-8"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="increment" id="r-inc" />
                                <Label htmlFor="r-inc" className="text-green-600 font-medium">Incremento</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="decrement" id="r-dec" />
                                <Label htmlFor="r-dec" className="text-red-600 font-medium">Disminución</Label>
                            </div>
                        </RadioGroup>
                        {errors.type && <span className="text-sm text-red-500">{errors.type}</span>}
                    </div>

                    {/* Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="date">Fecha *</Label>
                        <div className="relative">
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                        </div>
                        {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                    </div>

                    {/* Unit Cost */}
                    <div className="grid gap-2">
                        <Label htmlFor="unit_cost">Costo Unitario (Informativo) *</Label>
                        <Input
                            id="unit_cost"
                            type="number"
                            step="0.01"
                            value={data.unit_cost}
                            onChange={(e) => setData('unit_cost', e.target.value)}
                        />
                        {errors.unit_cost && <span className="text-sm text-red-500">{errors.unit_cost}</span>}
                    </div>

                    {/* Quantity Section */}
                    <div className="grid gap-2 col-span-1 md:col-span-2">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 grid gap-2">
                                <Label htmlFor="current_stock">Cantidad Actual</Label>
                                <Input disabled placeholder="-" value={currentStock ?? ''} />
                            </div>
                            <div className="flex-1 grid gap-2">
                                <Label htmlFor="quantity">Cantidad *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.01"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                />
                            </div>
                            <div className="flex-1 grid gap-2">
                                <Label htmlFor="final_stock">Cantidad Final</Label>
                                <Input disabled placeholder="-" />
                            </div>
                        </div>
                        {errors.quantity && <span className="text-sm text-red-500 mt-1">{errors.quantity}</span>}
                    </div>

                    {/* Observations */}
                    <div className="grid gap-2 col-span-1 md:col-span-2">
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea
                            id="observations"
                            value={data.observations}
                            onChange={(e) => setData('observations', e.target.value)}
                            rows={3}
                        />
                        {errors.observations && <span className="text-sm text-red-500">{errors.observations}</span>}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('adjustments.index')}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
