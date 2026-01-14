import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TagCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', color: '#3b82f6' });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/configuration/tags'); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Etiquetas', href: '/configuration/tags' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Etiqueta" />
            <div className="p-6 max-w-2xl mx-auto">
                <Card><CardHeader><CardTitle>Nueva Etiqueta</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="name">Nombre *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="w-16 h-10 p-1" />
                                    <Input value={data.color} onChange={(e) => setData('color', e.target.value)} className="flex-1" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2"><Link href="/configuration/tags"><Button type="button" variant="outline">Cancelar</Button></Link><Button type="submit" disabled={processing}>Guardar</Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
