import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Withholding {
    id: number;
    name: string;
    rate: number;
    type: string;
    min_base: number | null;
    is_active: boolean;
    description: string | null;
}

interface Props {
    withholdings: { data: Withholding[]; links: any[] };
    filters: { search?: string };
}

export default function WithholdingsIndex({ withholdings, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/withholdings', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta retención?')) {
            router.delete(`/configuration/withholdings/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Retenciones', href: '#' }]}>
            <Head title="Retenciones" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Retenciones</h1>
                    <Link href="/configuration/withholdings/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> Nueva</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Nombre..." />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tasa</TableHead>
                                    <TableHead>Base Mínima</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withholdings.data.map((wh) => (
                                    <TableRow key={wh.id}>
                                        <TableCell className="font-medium">{wh.name}</TableCell>
                                        <TableCell>{wh.type === 'percentage' ? `${wh.rate}%` : `$${wh.rate}`}</TableCell>
                                        <TableCell>{wh.min_base ? `$${new Intl.NumberFormat('es-CO').format(wh.min_base)}` : '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={wh.is_active ? 'default' : 'secondary'}>
                                                {wh.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/configuration/withholdings/${wh.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(wh.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {withholdings.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No se encontraron retenciones.
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
