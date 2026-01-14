import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserType { id: number; name: string; description: string | null; is_active: boolean; }

interface Props { types: { data: UserType[]; links: any[] }; filters: { search?: string }; }

export default function UserTypesIndex({ types, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/user-types', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este tipo de usuario?')) { router.delete(`/configuration/user-types/${id}`); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Tipos de Usuario', href: '#' }]}>
            <Head title="Tipos de Usuario" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tipos de Usuario</h1>
                    <Link href="/configuration/user-types/create"><Button><Plus className="mr-2 h-4 w-4" /> Nuevo</Button></Link>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Nombre..." />
                </div>
                <Card><CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Descripción</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {types.data.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.name}</TableCell>
                                    <TableCell>{t.description || '-'}</TableCell>
                                    <TableCell><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Activo' : 'Inactivo'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/configuration/user-types/${t.id}/edit`}><Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {types.data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No se encontraron tipos.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent></Card>
            </div>
        </AppLayout>
    );
}
