import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function SellerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        commission_rate: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuration/sellers');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Vendedores', href: '/configuration/sellers' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Vendedor" />

            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuevo Vendedor</CardTitle>
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
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="commission_rate">Comisión (%)</Label>
                                <Input id="commission_rate" type="number" step="0.01" value={data.commission_rate} onChange={(e) => setData('commission_rate', parseFloat(e.target.value) || 0)} />
                                {errors.commission_rate && <p className="text-sm text-destructive">{errors.commission_rate}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                                <Label htmlFor="is_active">Activo</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/configuration/sellers">
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
