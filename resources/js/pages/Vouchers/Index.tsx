import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import vouchersRoutes from '@/routes/vouchers';

export default function Index({ vouchers }) {
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pagada':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'prioritario':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'esperar confirmacion':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Comprobantes', href: vouchersRoutes.index().url },
    ];

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
        >
            <Head title="Comprobantes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <span className="mr-2">🧾</span> Comprobantes de compra
                            </h1>
                            <div className="flex gap-2">
                                <Link href={vouchersRoutes.create().url}>
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear comprobante
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-emerald-400 text-black hover:bg-emerald-500 border-none">
                                            Acciones <ChevronDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Filtrar por etiqueta</DropdownMenuItem>
                                        <DropdownMenuItem>Exportar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="mb-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar comprobantes..."
                                className="pl-9 max-w-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-slate-900">
                                    <TableRow className="hover:bg-slate-900">
                                        <TableHead className="text-white w-[50px]">#</TableHead>
                                        <TableHead className="text-white">Comprador</TableHead>
                                        <TableHead className="text-white">Proveedor</TableHead>
                                        <TableHead className="text-white">Tipo</TableHead>
                                        <TableHead className="text-white">Creación</TableHead>
                                        <TableHead className="text-white">Total</TableHead>
                                        <TableHead className="text-white">Etiqueta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vouchers.data.map((voucher) => (
                                        <TableRow
                                            key={voucher.id}
                                            className={`cursor-pointer hover:bg-slate-50 ${voucher.label === 'PAGADA' ? 'bg-green-50' : ''}`}
                                            onClick={() => (window.location.href = `/vouchers/${voucher.id}`)}
                                        >
                                            <TableCell className="font-medium">
                                                <Plus className="w-4 h-4 inline mr-1 text-slate-800" />
                                                {voucher.document_id || '---'}
                                            </TableCell>
                                            <TableCell>{voucher.seller_json?.name || '---'}</TableCell>
                                            <TableCell>{voucher.provider_json?.name || '---'}</TableCell>
                                            <TableCell>{voucher.type_voucher_id || 'pago pv'}</TableCell>
                                            <TableCell>
                                                {voucher.created_at ? format(new Date(voucher.created_at), 'dd-MM-yyyy HH:mm a') : '---'}
                                            </TableCell>
                                            <TableCell>
                                                ${parseFloat(voucher.total).toLocaleString('es-CO')}
                                            </TableCell>
                                            <TableCell>
                                                {voucher.label && (
                                                    <Badge className={getStatusColor(voucher.label)}>
                                                        {voucher.label}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {vouchers.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                No se encontraron comprobantes
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
