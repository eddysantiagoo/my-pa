import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    Folder,
    FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TreeNode } from '@/Components/TreeSelect';

interface TreeManagerItemProps {
    node: TreeNode;
    level?: number;
    onAddChild: (parentId: number) => void;
    onEdit: (node: TreeNode) => void;
    onDelete: (node: TreeNode) => void;
}

const TreeManagerItem = ({ node, level = 0, onAddChild, onEdit, onDelete }: TreeManagerItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div>
            <div
                className={cn(
                    "flex items-center py-2 px-3 hover:bg-accent/50 rounded-md group transition-colors",
                    "border-b border-border/40 last:border-0"
                )}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                <div className="mr-2 text-muted-foreground">
                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-transparent text-muted-foreground"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                    ) : (
                        <div className="w-6" /> // Spacer
                    )}
                </div>

                <div className="mr-3 text-primary/70">
                    {expanded || !hasChildren ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                </div>

                <span className="flex-1 font-medium text-sm text-foreground">
                    {node.name}
                </span>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => onAddChild(node.id)} title="Agregar Sub-item">
                        <Plus className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAddChild(node.id)}>
                                <Plus className="mr-2 h-4 w-4" /> Agregar Hijo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(node)}>
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(node)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {hasChildren && expanded && (
                <div className="relative">
                    {/* Vertical guideline */}
                    <div
                        className="absolute w-px bg-border/50 h-full"
                        style={{ left: `${level * 24 + 23}px` }}
                    />
                    {node.children!.map((child) => (
                        <TreeManagerItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface TreeManagerProps {
    data: TreeNode[];
    onAddRoot: () => void;
    onAddChild: (parentId: number) => void;
    onEdit: (node: TreeNode) => void;
    onDelete: (node: TreeNode) => void;
    title?: string;
}

export function TreeManager({ data, onAddRoot, onAddChild, onEdit, onDelete, title }: TreeManagerProps) {
    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <h3 className="font-semibold text-lg">{title || 'Estructura'}</h3>
                <Button size="sm" onClick={onAddRoot}>
                    <Plus className="mr-1 h-3 w-3" /> Agregar Principal
                </Button>
            </div>
            <div className="p-2">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No hay elementos. Comience agregando uno principal.
                    </div>
                ) : (
                    data.map(node => (
                        <TreeManagerItem
                            key={node.id}
                            node={node}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
