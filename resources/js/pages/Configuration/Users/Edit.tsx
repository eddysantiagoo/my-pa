import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User { id: number; name: string; email: string; }

export default function UserEdit({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm({ name: user.name, email: user.email, password: '', password_confirmation: '' });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/configuration/users/${user.id}`); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Usuarios', href: '/configuration/users' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Usuario" />
            <div className="p-6 max-w-2xl mx-auto">
                <Card><CardHeader><CardTitle>Editar Usuario</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="name">Nombre *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                            <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}</div>
                            <div className="space-y-2"><Label htmlFor="password">Nueva Contraseña (dejar vacío para mantener)</Label><Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />{errors.password && <p className="text-sm text-destructive">{errors.password}</p>}</div>
                            <div className="space-y-2"><Label htmlFor="password_confirmation">Confirmar Contraseña</Label><Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} /></div>
                            <div className="flex justify-end gap-2"><Link href="/configuration/users"><Button type="button" variant="outline">Cancelar</Button></Link><Button type="submit" disabled={processing}>Actualizar</Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
