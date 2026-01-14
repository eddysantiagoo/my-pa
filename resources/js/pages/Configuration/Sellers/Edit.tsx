import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface Seller {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    commission_rate: number;
    is_active: boolean;
}

export default function SellerEdit({ seller }: { seller: Seller }) {
    const { data, setData, put, processing, errors } = useForm({
        name: seller.name,
        email: seller.email || '',
        phone: seller.phone || '',
        commission_rate: seller.commission_rate,
        is_active: seller.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/configuration/sellers/${seller.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Vendedores', href: '/configuration/sellers' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Vendedor" />

            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar Vendedor</CardTitle>
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
                                <Button type="submit" disabled={processing}>Actualizar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
