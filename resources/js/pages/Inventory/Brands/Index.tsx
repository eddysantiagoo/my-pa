import { Head, useForm, router } from '@inertiajs/react'; // Import useForm correctly
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Tag, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Brand {
    id: number;
    name: string;
    products_count: number;
}

interface BrandsPageProps {
    brands: {
        data: Brand[];
        links: any[];
    };
}

export default function BrandsIndex({ brands }: BrandsPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, isDirty, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openCreate = () => {
        setEditingBrand(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setData({ name: brand.name });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBrand) {
            put(route('brands.update', editingBrand.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('brands.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (brand: Brand) => {
        if (brand.products_count > 0) {
            alert("No se puede eliminar una marca con productos asociados.");
            return;
        }
        if (confirm(`¿Eliminar marca ${brand.name}?`)) {
            router.delete(route('brands.destroy', brand.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: 'Marcas', href: '/inventory/brands' }]}>
            <Head title="Marcas" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Tag className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Gestión de Marcas</h1>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Marca
                    </Button>
                </div>

                <div className="bg-card rounded-md border p-4">
                    <div className="flex items-center gap-2 mb-4 w-full md:w-1/3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar marcas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Client side filter or implement server search
                        />
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Productos Asociados</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands.data.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                        No se encontraron marcas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                brands.data
                                    .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="font-medium">{brand.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {brand.products_count} productos
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(brand)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(brand)}
                                                    disabled={brand.products_count > 0}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination if needed */}
                    {brands.links && brands.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 mt-4">
                            {brands.links.map((link, index) => (
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
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingBrand ? 'Editar Marca' : 'Nueva Marca'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
