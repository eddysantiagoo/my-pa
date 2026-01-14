import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ProductForm } from './Components/ProductForm';
import { Brand, Category, Tag } from '@/types/product';
import { index } from '@/routes/products';

interface Props {
    brands: Brand[];
    categories: Category[];
    tags: Tag[];
}

export default function Create({ brands, categories, tags }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventario', href: '/inventory/products' },
            { title: 'Nuevo Producto', href: '#' }
        ]}>
            <Head title="Nuevo Producto" />
            <div className="p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-6 text-foreground">Nuevo Producto</h1>
                <ProductForm
                    brands={brands}
                    categories={categories}
                    tags={tags}
                    cancelHref={index.url()}
                />
            </div>
        </AppLayout>
    );
}
