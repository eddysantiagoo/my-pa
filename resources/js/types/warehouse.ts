export interface Warehouse {
    id: number;
    name: string;
    code: string;
    address?: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PageProps<T> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    warehouses: T[];
    flash: {
        success?: string;
        error?: string;
    };
}
