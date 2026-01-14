import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Company {
    id: number;
    name: string;
    nit: string;
    type: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
}

interface Props {
    companies: { data: Company[]; links: any[] };
    filters: { search?: string };
}

export default function CompaniesIndex({ companies, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/company', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta empresa?')) {
            router.delete(`/configuration/company/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Empresa', href: '#' }]}>
            <Head title="Empresa" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Empresas</h1>
                    <Link href="/configuration/company/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> Nueva</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Nombre o NIT..." />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>NIT</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.data.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="font-medium">{company.name}</TableCell>
                                        <TableCell>{company.nit}</TableCell>
                                        <TableCell>{company.type || '-'}</TableCell>
                                        <TableCell>{company.phone || '-'}</TableCell>
                                        <TableCell>{company.email || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/configuration/company/${company.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(company.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {companies.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No se encontraron empresas.
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
