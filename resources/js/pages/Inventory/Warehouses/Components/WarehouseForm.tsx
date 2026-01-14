import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InputError } from '@/components/ui/input-error'; // Assuming this exists or I'll use simple text
import { Warehouse } from '@/types/warehouse';

interface WarehouseFormProps {
    open: boolean;
    onClose: () => void;
    warehouse?: Warehouse | null;
}

export function WarehouseForm({ open, onClose, warehouse }: WarehouseFormProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        address: '',
        is_default: false,
        is_active: true,
    });

    useEffect(() => {
        if (warehouse) {
            setData({
                name: warehouse.name,
                code: warehouse.code,
                address: warehouse.address || '',
                is_default: warehouse.is_default,
                is_active: warehouse.is_active,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [warehouse, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (warehouse) {
            put(route('warehouses.update', warehouse.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('warehouses.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{warehouse ? 'Editar Bodega' : 'Nueva Bodega'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Código *</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                        />
                        {errors.code && <span className="text-sm text-red-500">{errors.code}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && <span className="text-sm text-red-500">{errors.address}</span>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_default"
                            checked={data.is_default}
                            onCheckedChange={(checked) => setData('is_default', !!checked)}
                        />
                        <Label htmlFor="is_default">Bodega por defecto</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', !!checked)}
                        />
                        <Label htmlFor="is_active">Activa</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {warehouse ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
