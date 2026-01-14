import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ChevronDown,
    Download,
    Eye,
    FileText,
    Filter,
    Plus,
    Receipt,
    Search,
} from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import vouchersRoutes from '@/routes/vouchers';

interface Voucher {
    id: number;
    document_id: string;
    seller_json: { name: string } | null;
    provider_json: { name: string } | null;
    type_voucher_id: string | null;
    created_at: string;
    total: string;
    label: string;
}

interface VouchersData {
    data: Voucher[];
}

interface IndexProps {
    vouchers: VouchersData;
}

export default function Index({ vouchers }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'pagada':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'prioritario':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'esperar confirmacion':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    const getStatusDot = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'pagada':
                return 'bg-emerald-500';
            case 'prioritario':
                return 'bg-red-500';
            case 'esperar confirmacion':
                return 'bg-blue-500';
            default:
                return 'bg-slate-400';
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Comprobantes', href: vouchersRoutes.index().url },
    ];

    const filteredVouchers = vouchers.data.filter((voucher) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            voucher.document_id?.toLowerCase().includes(search) ||
            voucher.seller_json?.name?.toLowerCase().includes(search) ||
            voucher.provider_json?.name?.toLowerCase().includes(search)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comprobantes" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500 rounded-lg text-white shadow-sm">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Comprobantes de compra
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Gestiona tus comprobantes y pagos
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link href={vouchersRoutes.create().url}>
                            <Button className="gap-2 shadow-sm">
                                <Plus className="h-4 w-4" />
                                Crear comprobante
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    Acciones
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Filter className="h-4 w-4" />
                                    Filtrar por etiqueta
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Download className="h-4 w-4" />
                                    Exportar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-lg border bg-card p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por documento, proveedor o comprador..."
                            className="pl-10 max-w-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                            {filteredVouchers.length} comprobante{filteredVouchers.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-semibold w-[120px]">Documento</TableHead>
                                <TableHead className="font-semibold">Comprador</TableHead>
                                <TableHead className="font-semibold">Proveedor</TableHead>
                                <TableHead className="font-semibold">Tipo</TableHead>
                                <TableHead className="font-semibold">Fecha</TableHead>
                                <TableHead className="font-semibold text-right">Total</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="font-semibold w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVouchers.map((voucher) => (
                                <TableRow
                                    key={voucher.id}
                                    className={`cursor-pointer transition-colors ${
                                        voucher.label === 'PAGADA'
                                            ? 'bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20'
                                            : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => (window.location.href = `/vouchers/${voucher.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                <FileText className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="font-medium text-foreground">
                                                {voucher.document_id || '---'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {voucher.seller_json?.name || '---'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {voucher.provider_json?.name || '---'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {voucher.type_voucher_id || 'Pago PV'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {voucher.created_at
                                            ? format(new Date(voucher.created_at), 'dd/MM/yyyy')
                                            : '---'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-foreground">
                                            ${parseFloat(voucher.total).toLocaleString('es-CO')}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {voucher.label && (
                                            <Badge
                                                variant="outline"
                                                className={`font-medium ${getStatusColor(voucher.label)}`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${getStatusDot(voucher.label)}`} />
                                                {voucher.label}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/vouchers/${voucher.id}`;
                                            }}
                                        >
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredVouchers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Receipt className="h-8 w-8 text-muted-foreground/50" />
                                            <p>No se encontraron comprobantes</p>
                                            {searchTerm && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => setSearchTerm('')}
                                                >
                                                    Limpiar búsqueda
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
