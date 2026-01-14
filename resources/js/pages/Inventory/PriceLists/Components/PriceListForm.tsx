import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PriceList } from '@/types/price-list';

interface PriceListFormProps {
    open: boolean;
    onClose: () => void;
    priceList?: PriceList | null;
}

export function PriceListForm({ open, onClose, priceList }: PriceListFormProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        description: '',
        type: 'percentage' as 'base' | 'percentage' | 'fixed',
        percentage: 0,
        is_default: false,
        is_active: true,
    });

    useEffect(() => {
        if (priceList) {
            setData({
                name: priceList.name,
                code: priceList.code,
                description: priceList.description || '',
                type: priceList.type,
                percentage: priceList.percentage,
                is_default: priceList.is_default,
                is_active: priceList.is_active,
            });
        } else {
            reset();
            // Default to percentage if creating new, or base? Logic depends. 
            // Usually Base exists, new ones are Percentage.
        }
        clearErrors();
    }, [priceList, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (priceList) {
            put(`/inventory/price-lists/${priceList.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/inventory/price-lists', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{priceList ? 'Editar Lista de Precios' : 'Nueva Lista de Precios'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid gap-2">
                        <Label className="mb-2">Tipo</Label>
                        <RadioGroup
                            value={data.type}
                            onValueChange={(val) => setData('type', val as any)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="percentage" id="type-percentage" />
                                <Label htmlFor="type-percentage">Porcentaje</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="type-fixed" />
                                <Label htmlFor="type-fixed">Valor Fijo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="base" id="type-base" />
                                <Label htmlFor="type-base">Base</Label>
                            </div>
                        </RadioGroup>
                        {data.type === 'percentage' && (
                            <p className="text-sm text-muted-foreground mt-1">Se calcula con base en el precio indicado en la lista general</p>
                        )}
                        {data.type === 'fixed' && (
                            <p className="text-sm text-muted-foreground mt-1">Indica un precio específico para cada ítem</p>
                        )}
                    </div>

                    {data.type === 'percentage' && (
                        <div className="grid gap-2">
                            <Label htmlFor="percentage">Porcentaje *</Label>
                            <div className="relative">
                                <Input
                                    id="percentage"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.percentage || ''}
                                    onChange={(e) => setData('percentage', e.target.value ? parseFloat(e.target.value) : 0)}
                                    className="pr-8"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                            </div>
                            {errors.percentage && <span className="text-sm text-red-500">{errors.percentage}</span>}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_default"
                                checked={data.is_default}
                                onCheckedChange={(checked) => setData('is_default', !!checked)}
                            />
                            <Label htmlFor="is_default">Lista por defecto</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', !!checked)}
                            />
                            <Label htmlFor="is_active">Activa</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {priceList ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
