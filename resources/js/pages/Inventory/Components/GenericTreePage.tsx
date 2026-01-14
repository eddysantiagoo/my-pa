import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { TreeNode } from '@/Components/TreeSelect';
import { TreeManager } from '@/Components/TreeManager';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TreePageProps {
    title: string;
    description: string;
    data: TreeNode[];
    routes: {
        store: string;
        update: string;
        destroy: string;
    };
    icon: React.ReactNode;
}

export default function GenericTreePage({ title, description, data, routes, icon }: TreePageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
    const [parentId, setParentId] = useState<number | null>(null);

    const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        parent_id: '',
        order: 0,
    });

    const handleAddRoot = () => {
        setEditingNode(null);
        setParentId(null);
        setData({ name: '', parent_id: '', order: 0 });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleAddChild = (pId: number) => {
        setEditingNode(null);
        setParentId(pId);
        setData({ name: '', parent_id: pId.toString(), order: 0 }); // Pre-fill parent
        clearErrors();
        setIsModalOpen(true);
    };

    const handleEdit = (node: TreeNode) => {
        setEditingNode(node);
        setParentId(node.parent_id || null);
        setData({
            name: node.name,
            parent_id: node.parent_id ? node.parent_id.toString() : '',
            order: 0
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleDelete = (node: TreeNode) => {
        if (node.children && node.children.length > 0) {
            alert('No se puede eliminar un elemento que tiene hijos.');
            return;
        }
        if (confirm(`¿Eliminar ${node.name}?`)) {
            router.delete(route(routes.destroy, node.id));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingNode) {
            put(route(routes.update, editingNode.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            // For store, we ensure parent_id is set
            post(route(routes.store), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    // Find parent name for display in modal
    const findNodeName = (nodes: TreeNode[], id: number): string => {
        for (const n of nodes) {
            if (n.id === id) return n.name;
            if (n.children) {
                const f = findNodeName(n.children, id);
                if (f) return f;
            }
        }
        return '';
    };

    const parentName = parentId ? findNodeName(data, parentId) : 'Raíz (Principal)';

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario', href: '/inventory/products' }, { title: title, href: '#' }]}>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3 bg-card p-4 rounded-lg border shadow-sm mb-4">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>

                <TreeManager
                    data={data}
                    onAddRoot={handleAddRoot}
                    onAddChild={handleAddChild}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    title={`Árbol de ${title}`}
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingNode ? 'Editar Elemento' : 'Nuevo Elemento'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Padre</Label>
                            <div className="p-2 bg-muted rounded-md text-sm font-medium">
                                {parentName}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
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
