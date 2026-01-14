import { Head, useForm, Link } from '@inertiajs/react'; // Link added
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';


interface AdjustmentCreateProps {
    products: Product[]; // Note: These products contain 'stock' global sum. Real stock depends on warehouse.
    warehouses: Warehouse[];
}

export default function AdjustmentCreate({ products, warehouses }: AdjustmentCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
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

    const selectedProduct = useMemo(
        () => products.find(p => p.id.toString() === data.product_id),
        [products, data.product_id]
    );

    useEffect(() => {
        if (!selectedProduct) {
            setCurrentStock(null);
            setData('unit_cost', '');
            return;
        }

        // Nota: hoy usamos stock global del producto (props). Si luego hay stock por bodega,
        // este efecto puede cambiar a un fetch según (warehouse_id + product_id).
        setCurrentStock(typeof selectedProduct.stock === 'number' ? selectedProduct.stock : null);
        setData('unit_cost', selectedProduct.purchase_price?.toString?.() ?? String(selectedProduct.purchase_price ?? ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id]);

    const parsedQty = useMemo(() => {
        const n = Number(data.quantity);
        return Number.isFinite(n) ? n : 0;
    }, [data.quantity]);

    const computedFinalQuantity = useMemo(() => {
        if (currentStock === null) return null;
        const delta = data.type === 'decrement' ? -parsedQty : parsedQty;
        return currentStock + delta;
    }, [currentStock, parsedQty, data.type]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/adjustments');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Ajustes', href: '/inventory/adjustments' }, { title: 'Nuevo', href: '#' }]}>
            <Head title="Nuevo Ajuste" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">Aplicar un Ajuste al Inventario</h1>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-card p-6 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6"
                >

                    {/* Contexto */}
                    <section className="rounded-lg border bg-muted/30 p-4 md:p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Contexto del ajuste</h2>
                                <p className="text-xs text-muted-foreground">Define dónde y a qué ítem le aplicarás el ajuste.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Warehouse */}
                            <div className="grid gap-2">
                                <Label htmlFor="warehouse">Bodega *</Label>
                                <Select onValueChange={(val) => setData('warehouse_id', val)} value={data.warehouse_id}>
                                    <SelectTrigger id="warehouse">
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
                                    <SelectTrigger id="product">
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

                            {/* Date */}
                            <div className="grid gap-2">
                                <Label htmlFor="date">Fecha *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                            </div>

                            {/* Type */}
                            <div className="grid gap-2">
                                <Label className="mb-1">Tipo de ajuste *</Label>
                                <RadioGroup
                                    value={data.type}
                                    onValueChange={(val) => setData('type', val as any)}
                                    className="flex flex-wrap gap-6"
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
                        </div>
                    </section>

                    {/* Detalle */}
                    <section className="rounded-lg border bg-card p-4 md:p-5">
                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Detalle del ajuste</h2>
                            <p className="text-xs text-muted-foreground">El costo se toma del producto; la cantidad final se calcula automáticamente.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Unit Cost */}
                            <div className="grid gap-2">
                                <Label htmlFor="unit_cost">Costo unitario</Label>
                                <Input
                                    id="unit_cost"
                                    type="number"
                                    step="0.01"
                                    value={data.unit_cost}
                                    disabled
                                />
                                <span className="text-xs text-muted-foreground">
                                    Se llena automáticamente con el costo del producto.
                                </span>
                                {errors.unit_cost && <span className="text-sm text-red-500">{errors.unit_cost}</span>}
                            </div>

                            {/* Spacer / small summary */}
                            <div className="hidden md:block rounded-md border bg-muted/20 p-3">
                                <div className="text-xs text-muted-foreground">Producto</div>
                                <div className="text-sm font-medium text-foreground truncate">
                                    {selectedProduct ? `${selectedProduct.name} — ${selectedProduct.reference}` : 'Seleccione un ítem'}
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">Stock mostrado</div>
                                <div className="text-sm font-medium text-foreground">
                                    {currentStock === null ? '-' : currentStock}
                                </div>
                            </div>

                            {/* Quantity Section */}
                            <div className="md:col-span-2 grid gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_stock">Cantidad actual</Label>
                                        <Input id="current_stock" disabled placeholder="-" value={currentStock ?? ''} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="quantity">Cantidad *</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            step="0.01"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {data.type === 'increment' ? 'Se sumará al stock actual.' : 'Se restará del stock actual.'}
                                        </span>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="final_stock">Cantidad final</Label>
                                        <Input
                                            id="final_stock"
                                            disabled
                                            placeholder="-"
                                            value={computedFinalQuantity === null ? '' : computedFinalQuantity}
                                        />
                                    </div>
                                </div>
                                {errors.quantity && <span className="text-sm text-red-500 mt-1">{errors.quantity}</span>}
                            </div>

                            {/* Observations */}
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="observations">Observaciones</Label>
                                <Textarea
                                    id="observations"
                                    value={data.observations}
                                    onChange={(e) => setData('observations', e.target.value)}
                                    rows={3}
                                />
                                {errors.observations && <span className="text-sm text-red-500">{errors.observations}</span>}
                            </div>
                        </div>
                    </section>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/inventory/adjustments">Cancelar</Link>
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
