import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TreeNode {
    id: number;
    name: string;
    children?: TreeNode[];
    parent_id?: number | null;
}

interface TreeSelectProps {
    data: TreeNode[];
    value?: number | null | number[]; // Single ID or array of IDs
    onChange: (value: number | number[]) => void;
    placeholder?: string;
    multiple?: boolean;
}

const TreeNodeItem = ({
    node,
    level = 0,
    selectedIds,
    onSelect
}: {
    node: TreeNode;
    level?: number;
    selectedIds: number[];
    onSelect: (id: number) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedIds.includes(node.id);

    return (
        <div>
            <div
                className={cn(
                    "flex items-center py-1 px-2 hover:bg-accent rounded-sm cursor-pointer select-none",
                    isSelected && "bg-accent text-accent-foreground font-medium"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={(e) => {
                    // prevent triggering if clicking expand icon specifically? 
                    // No, usually click row selects, arrow expands.
                    onSelect(node.id);
                }}
            >
                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 mr-1 p-0 hover:bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                    >
                        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                ) : (
                    <span className="w-5" /> // Spacer
                )}
                <span className="flex-1 truncate text-sm">{node.name}</span>
                {isSelected && <Check className="h-3 w-3 ml-2 text-primary" />}
            </div>
            {hasChildren && expanded && (
                <div>
                    {node.children!.map((child) => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedIds={selectedIds}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function TreeSelect({ data, value, onChange, placeholder = "Seleccionar...", multiple = false }: TreeSelectProps) {
    const [open, setOpen] = useState(false);

    const selectedIds = Array.isArray(value) ? value : (value ? [value] : []);

    const handleSelect = (id: number) => {
        if (multiple) {
            if (selectedIds.includes(id)) {
                onChange(selectedIds.filter(i => i !== id));
            } else {
                onChange([...selectedIds, id]);
            }
        } else {
            onChange(id);
            setOpen(false);
        }
    };

    // Find selected names for display
    const findNodeName = (nodes: TreeNode[], id: number): string | null => {
        for (const node of nodes) {
            if (node.id === id) return node.name;
            if (node.children) {
                const found = findNodeName(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    let displayValue = placeholder;
    if (selectedIds.length > 0) {
        if (multiple) {
            displayValue = `${selectedIds.length} seleccionados`;
        } else {
            displayValue = findNodeName(data, selectedIds[0]) || placeholder;
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
                    {displayValue}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <ScrollArea className="h-[300px] p-2">
                    {data.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">No data</div>
                    ) : (
                        data.map((node) => (
                            <TreeNodeItem
                                key={node.id}
                                node={node}
                                selectedIds={selectedIds}
                                onSelect={handleSelect}
                            />
                        ))
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
