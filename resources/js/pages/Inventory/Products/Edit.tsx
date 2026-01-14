import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/products';
import { Product, Brand, Category, Tag } from '@/types/product';

import { ProductForm } from './Components/ProductForm';


interface Props {
    product: Product;
    brands: Brand[];
    categories: Category[];
    tags: Tag[];
}

export default function Edit({ product, brands, categories, tags }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventario', href: '/inventory/products' },
            { title: 'Editar Producto', href: '#' }
        ]}>
            <Head title={`Editar: ${product.name}`} />
            <div className="p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-muted text-foreground font-bold">
                        📋
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                </div>

                <ProductForm
                    product={product}
                    brands={brands}
                    categories={categories}
                    tags={tags}
                    cancelHref={index.url()}
                />
            </div>
        </AppLayout>
    );
}
