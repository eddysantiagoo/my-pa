export interface Brand {
    id: number;
    name: string;
    slug: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id?: number;
}

export interface Tag {
    id: number;
    name: string;
    color: string;
}

export interface ProductImage {
    id: number;
    path: string;
    is_main: boolean;
}

export interface Product {
    id: number;
    reference: string;
    name: string;
    description?: string;
    brand?: Brand;
    category?: Category;
    tags?: Tag[];
    purchase_price: number;
    price: number;
    stock: number;
    is_active: boolean;
    is_public: boolean;
    is_inventariable: boolean;
    is_rotative: boolean;
    main_image_path?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ProductFilters {
    search?: string;
    per_page?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    // Add other filters as needed
}

export interface ProductPageProps {
    products: {
        data: Product[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            from: number;
            to: number;
        };
    };
    filters: ProductFilters;
}
