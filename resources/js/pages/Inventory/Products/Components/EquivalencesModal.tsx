import { useForm } from "@inertiajs/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";


interface EquivalencesModalProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
}

export function EquivalencesModal({ product, open, onClose }: EquivalencesModalProps) {
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        target_product_id: '',
    });

    if (!product) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement async search for products to add
        // For now, this is a placeholder
        console.log("Searching for", search);
    };

    const handleAdd = (id: string) => {
        setData('target_product_id', id);
        // post(route('products.equivalences.store', product.id));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Equivalencias: {product.reference}</DialogTitle>
                    <DialogDescription>
                        Gestionar productos equivalentes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch} size="icon"><Plus className="h-4 w-4" /></Button>
                    </div>
                    {/* List of current equivalences */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Actuales:</p>
                        {/* {product.equivalences?.map(eq => (
                            <div key={eq.id} className="flex items-center justify-between border p-2 rounded">
                                <span>{eq.reference} - {eq.name}</span>
                                <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
                            </div>
                        ))} */}
                        <p className="text-xs text-muted-foreground">No hay equivalencias registradas.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
