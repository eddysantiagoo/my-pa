import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface User { id: number; name: string; email: string; }

interface Props { users: { data: User[]; links: any[] }; filters: { search?: string }; }

export default function UsersIndex({ users, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/users', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) { router.delete(`/configuration/users/${id}`); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Usuarios', href: '#' }]}>
            <Head title="Usuarios" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <Link href="/configuration/users/create"><Button><Plus className="mr-2 h-4 w-4" /> Nuevo</Button></Link>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Nombre o email..." />
                </div>
                <Card><CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {users.data.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/configuration/users/${u.id}/edit`}><Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.data.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No se encontraron usuarios.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent></Card>
            </div>
        </AppLayout>
    );
}
