import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, ArrowRightLeft, Check, X, Eye } from 'lucide-react';
import { WarehouseTransfer } from '@/types/transfer';
import { Badge } from '@/components/ui/badge';

interface TransferIndexPageProps {
    transfers: {
        data: WarehouseTransfer[];
        links: any[];
    };
}

export default function TransferIndex({ transfers }: TransferIndexPageProps) {

    const handleConfirm = (transfer: WarehouseTransfer) => {
        if (confirm('¿Confirmar transferencia y mover stock? Esta acción no se puede deshacer.')) {
            router.post(route('transfers.confirm', transfer.id));
        }
    };

    const handleCancel = (transfer: WarehouseTransfer) => {
        if (confirm('¿Cancelar esta transferencia?')) {
            router.post(route('transfers.cancel', transfer.id));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
            case 'confirmed': return <Badge variant="default" className="bg-green-600">Confirmada</Badge>;
            case 'cancelled': return <Badge variant="destructive">Cancelada</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Transferencias', href: '/inventory/transfers' }]}>
            <Head title="Transferencias" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <ArrowRightLeft className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Transferencias entre Bodegas</h1>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href={route('transfers.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Transferencia
                        </Link>
                    </Button>
                </div>

                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Origen</TableHead>
                                <TableHead>Destino</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Responsable</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No hay transferencias registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transfers.data.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>{new Date(transfer.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>{transfer.origin_warehouse?.name}</TableCell>
                                        <TableCell>{transfer.destination_warehouse?.name}</TableCell>
                                        <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {transfer.user?.name}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {/* Logic for Confirm/Cancel only if Pending */}
                                            {transfer.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleConfirm(transfer)}
                                                        title="Confirmar"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleCancel(transfer)}
                                                        title="Cancelar"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {transfers.links && transfers.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {transfers.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
