import { Head, useForm, Link } from '@inertiajs/react';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';

interface TransferCreateProps {
    products: Product[];
    warehouses: Warehouse[];
}

export default function TransferCreate({ products, warehouses }: TransferCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        origin_warehouse_id: '',
        destination_warehouse_id: '',
        observations: '',
        items: [{ product_id: '', quantity: '' }] // Start with one empty row
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: '' }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = [...data.items];
            newItems.splice(index, 1);
            setData('items', newItems);
        }
    };

    const updateItem = (index: number, field: 'product_id' | 'quantity', value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/transfers');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Transferencias', href: '/inventory/transfers' }, { title: 'Nueva', href: '#' }]}>
            <Head title="Nueva Transferencia" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">Nueva Transferencia</h1>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">

                    {/* Header: Warehouses */}
                    <div className="bg-card p-6 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="origin">Bodega Origen *</Label>
                            <Select onValueChange={(val) => setData('origin_warehouse_id', val)} value={data.origin_warehouse_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Origen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map(w => (
                                        <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.origin_warehouse_id && <span className="text-sm text-red-500">{errors.origin_warehouse_id}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="destination">Bodega Destino *</Label>
                            <Select onValueChange={(val) => setData('destination_warehouse_id', val)} value={data.destination_warehouse_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Destino" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.filter(w => w.id.toString() !== data.origin_warehouse_id).map(w => (
                                        <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.destination_warehouse_id && <span className="text-sm text-red-500">{errors.destination_warehouse_id}</span>}
                        </div>

                        <div className="grid gap-2 col-span-1 md:col-span-2">
                            <Label htmlFor="observations">Observaciones</Label>
                            <Textarea
                                id="observations"
                                value={data.observations}
                                onChange={(e) => setData('observations', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Productos a transferir</h2>
                            <Button type="button" size="sm" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Ítem
                            </Button>
                        </div>

                        {errors.items && <span className="text-sm text-red-500">{errors.items}</span>}

                        <div className="space-y-3">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-1 grid gap-1">
                                        {index === 0 && <Label className="text-xs text-muted-foreground">Producto</Label>}
                                        <Select value={item.product_id} onValueChange={(val) => updateItem(index, 'product_id', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione producto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map(p => (
                                                    <SelectItem key={p.id} value={p.id.toString()}>{p.name} - {p.reference}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {(errors as any)[`items.${index}.product_id`] && (
                                            <span className="text-xs text-red-500">Requerido</span>
                                        )}
                                    </div>

                                    <div className="w-32 grid gap-1">
                                        {index === 0 && <Label className="text-xs text-muted-foreground">Cantidad</Label>}
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="cant."
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                        />
                                        {(errors as any)[`items.${index}.quantity`] && (
                                            <span className="text-xs text-red-500">Requerido</span>
                                        )}
                                    </div>

                                    <div className="pt-1">
                                        {index === 0 && <div className="h-4 mb-1"></div>} {/* Spacer for Label alignment */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500"
                                            onClick={() => removeItem(index)}
                                            disabled={data.items.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/inventory/transfers">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            {processing ? 'Crear Solicitud' : 'Crear Solicitud'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
