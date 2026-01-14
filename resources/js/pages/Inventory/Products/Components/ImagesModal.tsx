import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { useForm } from "@inertiajs/react";
import { Image, X } from "lucide-react";
import { useState } from "react";

interface ImagesModalProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
}

export function ImagesModal({ product, open, onClose }: ImagesModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
    });

    if (!product) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Placeholder for upload logic
        // post(route('products.images.store', product.id));
        alert("Implementar carga de imagen");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Imágenes: {product.reference}</DialogTitle>
                    <DialogDescription>
                        Gestionar imágenes adicionales.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/20">
                        <Image className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground mb-2">Seleccionar imagen</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    <Button onClick={handleUpload} disabled={!data.image || processing}>Subir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
