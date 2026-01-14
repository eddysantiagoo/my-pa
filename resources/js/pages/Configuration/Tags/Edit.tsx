import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Tag { id: number; name: string; color: string | null; }

export default function TagEdit({ tag }: { tag: Tag }) {
    const { data, setData, put, processing, errors } = useForm({ name: tag.name, color: tag.color || '#3b82f6' });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/configuration/tags/${tag.id}`); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Etiquetas', href: '/configuration/tags' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Etiqueta" />
            <div className="p-6 max-w-2xl mx-auto">
                <Card><CardHeader><CardTitle>Editar Etiqueta</CardTitle></CardHeader>
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
                            <div className="flex justify-end gap-2"><Link href="/configuration/tags"><Button type="button" variant="outline">Cancelar</Button></Link><Button type="submit" disabled={processing}>Actualizar</Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
