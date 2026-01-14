export interface PriceList {
    id: number;
    name: string;
    code: string;
    description?: string;
    type: 'base' | 'percentage' | 'fixed';
    percentage: number;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
