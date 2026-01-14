import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentTerm {
    id: number;
    name: string;
    days: number;
    description: string | null;
}

export default function PaymentTermEdit({ term }: { term: PaymentTerm }) {
    const { data, setData, put, processing, errors } = useForm({
        name: term.name,
        days: term.days,
        description: term.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/configuration/payment-terms/${term.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Términos de pago', href: '/configuration/payment-terms' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Término de Pago" />

            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar Término de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="days">Días *</Label>
                                <Input id="days" type="number" value={data.days} onChange={(e) => setData('days', parseInt(e.target.value) || 0)} />
                                {errors.days && <p className="text-sm text-destructive">{errors.days}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/configuration/payment-terms">
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
