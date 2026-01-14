import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function NumberingCreate() {
    const { data, setData, post, processing, errors } = useForm({
        prefix: '',
        next_number: 1,
        document_type: '',
        is_active: true,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuration/numbering');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Numeraciones', href: '/configuration/numbering' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Numeración" />

            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Numeración</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="prefix">Prefijo</Label>
                                <Input id="prefix" value={data.prefix} onChange={(e) => setData('prefix', e.target.value)} placeholder="Ej: FV, NC, ND" />
                                {errors.prefix && <p className="text-sm text-destructive">{errors.prefix}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="next_number">Siguiente Número *</Label>
                                <Input id="next_number" type="number" value={data.next_number} onChange={(e) => setData('next_number', parseInt(e.target.value) || 1)} />
                                {errors.next_number && <p className="text-sm text-destructive">{errors.next_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="document_type">Tipo de Documento *</Label>
                                <Input id="document_type" value={data.document_type} onChange={(e) => setData('document_type', e.target.value)} placeholder="Ej: Factura, Nota Crédito" />
                                {errors.document_type && <p className="text-sm text-destructive">{errors.document_type}</p>}
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
                                <Link href="/configuration/numbering">
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
