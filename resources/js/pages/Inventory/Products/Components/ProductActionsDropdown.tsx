import { router } from "@inertiajs/react";
import { MoreHorizontal, Eye, Edit, Ban, CheckCircle, Trash2, Printer, ArrowRightLeft, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { update, show, edit } from '@/routes/products';
import { Product } from "@/types/product";



interface ProductActionsDropdownProps {
    product: Product;
    onDelete: (product: Product) => void;
    onGenerateBarcode: (product: Product) => void;
    onEquivalences: (product: Product) => void;
    onImages: (product: Product) => void;
}

export function ProductActionsDropdown({
    product,
    onDelete,
    onGenerateBarcode,
    onEquivalences,
    onImages
}: ProductActionsDropdownProps) {

    const handleToggleActive = () => {
        router.patch(update.url({ product: product.id }), {
            is_active: !product.is_active
        }, {
            preserveScroll: true
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                {/* 1. Ver ítem */}
                <DropdownMenuItem onClick={() => router.get(show.url({ product: product.id }))}>
                    <Eye className="mr-2 h-4 w-4" /> Ver ítem
                </DropdownMenuItem>

                {/* 2. Editar ítem */}
                <DropdownMenuItem onClick={() => router.get(edit.url({ product: product.id }))}>
                    <Edit className="mr-2 h-4 w-4" /> Editar ítem
                </DropdownMenuItem>

                {/* 3. Desactivar / Activar ítem */}
                <DropdownMenuItem onClick={handleToggleActive}>
                    {product.is_active ? (
                        <>
                            <Ban className="mr-2 h-4 w-4" /> Desactivar ítem
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Activar ítem
                        </>
                    )}
                </DropdownMenuItem>

                {/* 5. Imprimir código de barras */}
                <DropdownMenuItem onClick={() => onGenerateBarcode(product)}>
                    <Printer className="mr-2 h-4 w-4" /> Imprimir código de barras
                </DropdownMenuItem>

                {/* 6. Añadir equivalencias */}
                <DropdownMenuItem onClick={() => onEquivalences(product)}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Añadir equivalencias
                </DropdownMenuItem>

                {/* 7. Agregar imágenes */}
                <DropdownMenuItem onClick={() => onImages(product)}>
                    <Image className="mr-2 h-4 w-4" /> Agregar imágenes
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* 4. Eliminar ítem */}
                {product.stock <= 0 && (
                    <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar ítem
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
