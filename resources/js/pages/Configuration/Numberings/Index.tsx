import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Numbering {
    id: number;
    prefix: string | null;
    next_number: number;
    document_type: string;
    is_active: boolean;
    description: string | null;
}

interface Props {
    numberings: {
        data: Numbering[];
        links: any[];
    };
    filters: { search?: string };
}

export default function NumberingsIndex({ numberings, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/numbering', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta numeración?')) {
            router.delete(`/configuration/numbering/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Numeraciones', href: '#' }]}>
            <Head title="Numeraciones" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Numeraciones</h1>
                    <Link href="/configuration/numbering/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> Nueva</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Prefijo o tipo..." />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prefijo</TableHead>
                                    <TableHead>Siguiente Número</TableHead>
                                    <TableHead>Tipo de Documento</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {numberings.data.map((n) => (
                                    <TableRow key={n.id}>
                                        <TableCell className="font-medium">{n.prefix || '-'}</TableCell>
                                        <TableCell>{n.next_number}</TableCell>
                                        <TableCell>{n.document_type}</TableCell>
                                        <TableCell>
                                            <Badge variant={n.is_active ? 'default' : 'secondary'}>
                                                {n.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/configuration/numbering/${n.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(n.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {numberings.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No se encontraron numeraciones.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
