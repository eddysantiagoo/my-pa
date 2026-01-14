import { Product } from './product';
import { Warehouse } from './warehouse';

export interface User {
    id: number;
    name: string;
}

export interface InventoryAdjustment {
    id: number;
    product_id: number;
    warehouse_id: number;
    type: 'increment' | 'decrement';
    quantity: number;
    unit_cost: number;
    date: string; // YYYY-MM-DD
    observations?: string;
    user_id: number;
    created_at: string;

    product?: Product;
    warehouse?: Warehouse;
    user?: User;
}
