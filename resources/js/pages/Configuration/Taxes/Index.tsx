import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tax {
    id: number;
    name: string;
    rate: number;
    type: string;
    is_active: boolean;
    description: string | null;
}

interface Props {
    taxes: { data: Tax[]; links: any[] };
    filters: { search?: string };
}

export default function TaxesIndex({ taxes, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/taxes', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este impuesto?')) {
            router.delete(`/configuration/taxes/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Impuestos', href: '#' }]}>
            <Head title="Impuestos" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Impuestos</h1>
                    <Link href="/configuration/taxes/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> Nuevo</Button>
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
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxes.data.map((tax) => (
                                    <TableRow key={tax.id}>
                                        <TableCell className="font-medium">{tax.name}</TableCell>
                                        <TableCell>{tax.type === 'percentage' ? `${tax.rate}%` : `$${tax.rate}`}</TableCell>
                                        <TableCell>{tax.type === 'percentage' ? 'Porcentaje' : 'Fijo'}</TableCell>
                                        <TableCell>
                                            <Badge variant={tax.is_active ? 'default' : 'secondary'}>
                                                {tax.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/configuration/taxes/${tax.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(tax.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {taxes.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No se encontraron impuestos.
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
