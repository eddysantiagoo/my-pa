import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Seller {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    commission_rate: number;
    is_active: boolean;
}

interface Props {
    sellers: { data: Seller[]; links: any[] };
    filters: { search?: string };
}

export default function SellersIndex({ sellers, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/sellers', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este vendedor?')) {
            router.delete(`/configuration/sellers/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Vendedores', href: '#' }]}>
            <Head title="Vendedores" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Vendedores</h1>
                    <Link href="/configuration/sellers/create">
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Comisión</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellers.data.map((seller) => (
                                    <TableRow key={seller.id}>
                                        <TableCell className="font-medium">{seller.name}</TableCell>
                                        <TableCell>{seller.email || '-'}</TableCell>
                                        <TableCell>{seller.phone || '-'}</TableCell>
                                        <TableCell>{seller.commission_rate}%</TableCell>
                                        <TableCell>
                                            <Badge variant={seller.is_active ? 'default' : 'secondary'}>
                                                {seller.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/configuration/sellers/${seller.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(seller.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sellers.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No se encontraron vendedores.
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
