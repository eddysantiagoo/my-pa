import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function UserTypeCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', description: '', is_active: true });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/configuration/user-types'); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Tipos de Usuario', href: '/configuration/user-types' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Tipo de Usuario" />
            <div className="p-6 max-w-2xl mx-auto">
                <Card><CardHeader><CardTitle>Nuevo Tipo de Usuario</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="name">Nombre *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                            <div className="space-y-2"><Label htmlFor="description">Descripción</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} /></div>
                            <div className="flex items-center space-x-2"><Switch id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', c)} /><Label htmlFor="is_active">Activo</Label></div>
                            <div className="flex justify-end gap-2"><Link href="/configuration/user-types"><Button type="button" variant="outline">Cancelar</Button></Link><Button type="submit" disabled={processing}>Guardar</Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
