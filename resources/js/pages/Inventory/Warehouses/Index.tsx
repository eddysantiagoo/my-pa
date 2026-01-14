import { Head, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import { useState } from 'react';

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
import { Warehouse, PageProps } from '@/types/warehouse';

import { WarehouseForm } from './Components/WarehouseForm';


export default function WarehouseIndex({ warehouses }: PageProps<Warehouse>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

    const handleCreate = () => {
        setEditingWarehouse(null);
        setIsModalOpen(true);
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setIsModalOpen(true);
    };

    const handleDelete = (warehouse: Warehouse) => {
        if (warehouse.is_default) {
            alert("No se puede eliminar la bodega por defecto.");
            return;
        }
        if (confirm(`¿Estás seguro de eliminar la bodega ${warehouse.name}?`)) {
            router.delete(`/inventory/warehouses/${warehouse.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Bodegas', href: '/inventory/warehouses' }]}>
            <Head title="Bodegas" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <WarehouseIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Bodegas</h1>
                    </div>
                    <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Bodega
                    </Button>
                </div>

                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {warehouses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No hay bodegas registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                warehouses.map((warehouse) => (
                                    <TableRow key={warehouse.id}>
                                        <TableCell className="font-medium">
                                            {warehouse.name}
                                            {warehouse.is_default && (
                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                    Default
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{warehouse.code}</TableCell>
                                        <TableCell>{warehouse.address || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={warehouse.is_active ? 'default' : 'outline'}>
                                                {warehouse.is_active ? 'Activa' : 'Inactiva'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(warehouse)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(warehouse)}
                                                disabled={warehouse.is_default}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <WarehouseForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                warehouse={editingWarehouse}
            />
        </AppLayout>
    );
}
