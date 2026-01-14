import { Head, Link, router } from '@inertiajs/react';
import { Plus, History, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { InventoryAdjustment } from '@/types/adjustment';
import { PageProps } from '@/types/warehouse';

interface AdjustmentIndexPageProps {
    adjustments: {
        data: InventoryAdjustment[];
        links: any[];
    };
}

export default function AdjustmentIndex({ adjustments }: AdjustmentIndexPageProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Ajustes', href: '/inventory/adjustments' }]}>
            <Head title="Ajustes de Inventario" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <History className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Ajustes de Inventario</h1>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/inventory/adjustments/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Ajuste
                        </Link>
                    </Button>
                </div>

                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Producto</TableHead>
                                <TableHead>Bodega</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Costo Unit.</TableHead>
                                <TableHead>Responsable</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No hay ajustes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                adjustments.data.map((adj) => (
                                    <TableRow key={adj.id}>
                                        <TableCell>{adj.date}</TableCell>
                                        <TableCell className="font-medium">
                                            {adj.product?.name}
                                            <div className="text-xs text-muted-foreground">{adj.product?.reference}</div>
                                        </TableCell>
                                        <TableCell>{adj.warehouse?.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {adj.type === 'increment' ? (
                                                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                <span className={adj.type === 'increment' ? 'text-green-600' : 'text-red-600 font-medium'}>
                                                    {adj.type === 'increment' ? 'Incremento' : 'Disminución'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold">{adj.quantity}</TableCell>
                                        <TableCell>${Number(adj.unit_cost).toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {adj.user?.name}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination links would go here similar to ProductsIndex */}
                {adjustments.links && adjustments.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {adjustments.links.map((link, index) => (
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
