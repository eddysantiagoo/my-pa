import GenericTreePage from '@/Pages/Inventory/Components/GenericTreePage';
import { TreeNode } from '@/Components/TreeSelect';
import { FolderTree } from 'lucide-react';

interface Props {
    categories: TreeNode[];
}

export default function CategoriesIndex({ categories }: Props) {
    return (
        <GenericTreePage
            title="Categorías"
            description="Gestione la jerarquía de categorías para organizar sus productos."
            data={categories}
            routes={{
                store: 'categories.store',
                update: 'categories.update',
                destroy: 'categories.destroy',
            }}
            icon={<FolderTree className="h-6 w-6" />}
        />
    );
}
