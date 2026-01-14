import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { PriceList } from '@/types/price-list';
import { PageProps } from '@/types/warehouse'; // Resuse PageProps or generic
import { PriceListForm } from './Components/PriceListForm';
import { Badge } from '@/components/ui/badge';

interface PriceListPageProps {
    priceLists: PriceList[];
}

export default function PriceListIndex({ priceLists }: PriceListPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);

    const handleCreate = () => {
        setEditingPriceList(null);
        setIsModalOpen(true);
    };

    const handleEdit = (priceList: PriceList) => {
        setEditingPriceList(priceList);
        setIsModalOpen(true);
    };

    const handleDelete = (priceList: PriceList) => {
        if (priceList.type === 'base') {
            alert("No se puede eliminar la lista base.");
            return;
        }
        if (confirm(`¿Estás seguro de eliminar la lista ${priceList.name}?`)) {
            router.delete(route('price-lists.destroy', priceList.id));
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'base': return 'Base';
            case 'percentage': return 'Porcentaje';
            case 'fixed': return 'Valor Fijo';
            default: return type;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Listas de Precios', href: '/inventory/price-lists' }]}>
            <Head title="Listas de Precios" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Tag className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Listas de Precios</h1>
                    </div>
                    <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Lista
                    </Button>
                </div>

                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>% / Valor</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {priceLists.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No hay listas de precios registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                priceLists.map((list) => (
                                    <TableRow key={list.id}>
                                        <TableCell className="font-medium">
                                            {list.name}
                                            {list.is_default && (
                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                    Default
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{list.code}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{getTypeName(list.type)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {list.type === 'percentage' ? `${list.percentage}%` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={list.is_active ? 'default' : 'outline'}>
                                                {list.is_active ? 'Activa' : 'Inactiva'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(list)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(list)}
                                                disabled={list.type === 'base'}
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

            <PriceListForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                priceList={editingPriceList}
            />
        </AppLayout>
    );
}
