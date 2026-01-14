import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';

interface AuthUser { id: number; name: string; email: string; }

export default function ProfileIndex({ user }: { user: AuthUser }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/configuration/profile'); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Mi Perfil', href: '#' }]}>
            <Head title="Mi Perfil" />
            <div className="p-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-full"><User className="h-6 w-6 text-primary" /></div>
                            <div><CardTitle>Mi Perfil</CardTitle><CardDescription>Actualiza tu información personal</CardDescription></div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Información Personal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}</div>
                                </div>
                            </div>
                            <hr />
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Cambiar Contraseña</h3>
                                <div className="space-y-2"><Label htmlFor="current_password">Contraseña Actual</Label><Input id="current_password" type="password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />{errors.current_password && <p className="text-sm text-destructive">{errors.current_password}</p>}</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="password">Nueva Contraseña</Label><Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />{errors.password && <p className="text-sm text-destructive">{errors.password}</p>}</div>
                                    <div className="space-y-2"><Label htmlFor="password_confirmation">Confirmar Contraseña</Label><Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} /></div>
                                </div>
                            </div>
                            <div className="flex justify-end"><Button type="submit" disabled={processing}>Guardar Cambios</Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
