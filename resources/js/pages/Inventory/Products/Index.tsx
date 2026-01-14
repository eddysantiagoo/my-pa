import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Package,
    ChevronDown,
} from 'lucide-react';
import { useCallback, useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index, create, bulkDestroy, destroy, barcode } from '@/routes/products';
import { Product, ProductPageProps } from '@/types/product';

import { EquivalencesModal } from './Components/EquivalencesModal';
import { ImagesModal } from './Components/ImagesModal';
import { ProductTable } from './Components/ProductTable';


export default function ProductsIndex({
    products,
    filters,
}: ProductPageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEquivalences, setShowEquivalences] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                router.get(
                    index.url({ query: { ...filters, search: value } }),
                    { ...filters, search: value },
                    { preserveState: true, replace: true }
                );
            }, 300);
        },
        [filters]
    );

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleFilter = (key: string, value: string) => {
        router.get(
            index.url({ query: { ...filters, [key]: value } }),
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(products.data?.map(p => p.id) ?? []);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(pid => pid !== id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`¿Estás seguro de eliminar ${selectedIds.length} productos? Solamente se eliminarán los que no tengan stock.`)) {
            router.delete(bulkDestroy.url(), {
                data: { ids: selectedIds },
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    const handleSingleDelete = (product: Product) => {
        if (confirm(`¿Eliminar producto ${product.name}?`)) {
            router.delete(destroy.url({ product: product.id }));
        }
    };

    const handleGenerateBarcode = (product: Product) => {
        const url = barcode.url({ product: product.id });
        window.open(url, '_blank');
    };
    const handleEquivalences = (product: Product) => {
        setSelectedProduct(product);
        setShowEquivalences(true);
    };
    const handleImages = (product: Product) => {
        setSelectedProduct(product);
        setShowImages(true);
    };


    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }]}>
            <Head title="Inventario" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear producto
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default">
                                    Acciones <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                                    Eliminar seleccionados
                                </DropdownMenuItem>
                                {/* Add other bulk actions here */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                        Total Productos: <span className="text-primary font-bold">{products.meta?.total ?? products.data?.length ?? 0}</span>
                    </p>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            Lista de precios
                            {/* Help icon? */}
                        </span>
                        <Select defaultValue="general">
                            <SelectTrigger className="w-[180px] h-8 bg-background">
                                <SelectValue placeholder="Lista de precios" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Mostrar
                        <Input
                            className="w-16 h-8 text-center"
                            value={filters.per_page ?? '15'}
                            onChange={(e) => handleFilter('per_page', e.target.value)}
                        />
                        registros
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Global Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 w-[300px]"
                            />
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <Checkbox
                                id="selectAll"
                                checked={(products.data?.length ?? 0) > 0 && selectedIds.length === (products.data?.length ?? 0)}
                                onCheckedChange={(c) => handleSelectAll(!!c)}
                            />
                            <label htmlFor="selectAll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Seleccionar todo
                            </label>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1">
                    <ProductTable
                        products={products.data ?? []}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectRow={handleSelectRow}
                        onDelete={handleSingleDelete}
                        onGenerateBarcode={handleGenerateBarcode}
                        onEquivalences={handleEquivalences}
                        onImages={handleImages}
                    />
                </div>

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {products.links.map((link, index) => (
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

            <EquivalencesModal
                product={selectedProduct}
                open={showEquivalences}
                onClose={() => { setShowEquivalences(false); setSelectedProduct(null); }}
            />

            <ImagesModal
                product={selectedProduct}
                open={showImages}
                onClose={() => { setShowImages(false); setSelectedProduct(null); }}
            />
        </AppLayout>
    );
}
