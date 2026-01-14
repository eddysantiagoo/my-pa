import { User } from './adjustment';
import { Product } from './product';
import { Warehouse } from './warehouse';

export interface WarehouseTransferItem {
    id: number;
    transfer_id: number;
    product_id: number;
    quantity: number;
    product?: Product;
}

export interface WarehouseTransfer {
    id: number;
    origin_warehouse_id: number;
    destination_warehouse_id: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    observations?: string;
    user_id: number;
    confirmed_at?: string;
    created_at: string;

    origin_warehouse?: Warehouse;
    destination_warehouse?: Warehouse;
    items?: WarehouseTransferItem[];
    user?: User;
}
