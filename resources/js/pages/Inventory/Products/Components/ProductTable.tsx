import { router } from '@inertiajs/react';

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { show } from '@/routes/products';
import { Product } from '@/types/product';
import { formatCurrency, formatNumber } from '@/utils/format';

import { ProductActionsDropdown } from './ProductActionsDropdown';

interface ProductTableProps {
    products: Product[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectRow: (id: number, checked: boolean) => void;
    onDelete: (product: Product) => void;
    onGenerateBarcode: (product: Product) => void;
    onEquivalences: (product: Product) => void;
    onImages: (product: Product) => void;
}

export function ProductTable({
    products,
    selectedIds,
    onSelectAll,
    onSelectRow,
    onDelete,
    onGenerateBarcode,
    onEquivalences,
    onImages
}: ProductTableProps) {

    // Check if handling the "all" check
    const allSelected = products.length > 0 && products.every(p => selectedIds.includes(p.id));
    const someSelected = products.some(p => selectedIds.includes(p.id));

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={(checked) => onSelectAll(!!checked)}
                            />
                        </TableHead>
                        <TableHead>Referencia</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Compra</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Disp.</TableHead>
                        <TableHead>Web</TableHead>
                        <TableHead>Prom.</TableHead>
                        <TableHead>Etiqueta</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id} className={!product.is_active ? 'bg-muted/50 opacity-60' : ''}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(product.id)}
                                        onCheckedChange={(checked) => onSelectRow(product.id, !!checked)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{product.reference}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto font-semibold text-foreground underline-offset-4 hover:underline"
                                        onClick={() => router.get(show.url({ product: product.id }))}
                                    >
                                        {product.name}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-foreground">{formatCurrency(product.purchase_price)}</TableCell>
                                <TableCell className="text-foreground font-medium">{formatCurrency(product.price)}</TableCell>
                                <TableCell>
                                    <span className={
                                        product.stock > 0 ? "text-green-600 dark:text-green-400 font-bold" :
                                            product.stock < 0 ? "text-red-600 dark:text-red-400 font-bold" :
                                                "text-muted-foreground"
                                    }>
                                        {product.stock == 0 ? "N/A" : formatNumber(product.stock, 0)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {product.is_public ? (
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Publicado</span>
                                    ) : (
                                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">Privado</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-foreground">{formatCurrency(0)}</TableCell> {/* Prom. placeholder as per UI if logic not specified, or use avg cost */}
                                <TableCell>
                                    {product.tags && product.tags.length > 0 ? (
                                        <div className="flex gap-1">
                                            {product.tags.map(tag => (
                                                <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + '40' }}>
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <Badge variant="outline">Etiqueta</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ProductActionsDropdown
                                        product={product}
                                        onDelete={onDelete}
                                        onGenerateBarcode={onGenerateBarcode}
                                        onEquivalences={onEquivalences}
                                        onImages={onImages}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
