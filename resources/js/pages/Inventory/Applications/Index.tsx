import GenericTreePage from '@/Pages/Inventory/Components/GenericTreePage';
import { TreeNode } from '@/Components/TreeSelect';
import { Car } from 'lucide-react';

interface Props {
    applications: TreeNode[];
}

export default function ApplicationsIndex({ applications }: Props) {
    return (
        <GenericTreePage
            title="Aplicaciones"
            description="Gestione la jerarquía de vehículos, marcas y modelos (Ej: Mazda -> CX30 -> 2024)."
            data={applications}
            routes={{
                store: 'applications.store',
                update: 'applications.update',
                destroy: 'applications.destroy',
            }}
            icon={<Car className="h-6 w-6" />}
        />
    );
}
