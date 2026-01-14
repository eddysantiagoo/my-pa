import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function WithholdingCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rate: 0,
        type: 'percentage',
        min_base: '',
        is_active: true,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuration/withholdings');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Retenciones', href: '/configuration/withholdings' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Retención" />

            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Retención</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rate">Tasa *</Label>
                                    <Input id="rate" type="number" step="0.01" value={data.rate} onChange={(e) => setData('rate', parseFloat(e.target.value) || 0)} />
                                    {errors.rate && <p className="text-sm text-destructive">{errors.rate}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                            <SelectItem value="fixed">Valor Fijo ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="min_base">Base Mínima</Label>
                                <Input id="min_base" type="number" step="0.01" value={data.min_base} onChange={(e) => setData('min_base', e.target.value)} placeholder="Opcional" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                                <Label htmlFor="is_active">Activo</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/configuration/withholdings">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>Guardar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
