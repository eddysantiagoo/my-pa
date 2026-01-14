import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

export interface AliasItem {
    alias: string;
    description: string;
    is_main: boolean;
}

interface AliasManagerProps {
    aliases: AliasItem[];
    onChange: (aliases: AliasItem[]) => void;
    error?: string;
}

export function AliasManager({ aliases, onChange, error }: AliasManagerProps) {
    const handleAdd = () => {
        onChange([...aliases, { alias: '', description: '', is_main: false }]);
    };

    const handleRemove = (index: number) => {
        const newArr = [...aliases];
        newArr.splice(index, 1);
        onChange(newArr);
    };

    const handleChange = (index: number, field: keyof AliasItem, value: any) => {
        const newArr = [...aliases];
        newArr[index] = { ...newArr[index], [field]: value };
        onChange(newArr);
    };

    const handleSetMain = (index: number) => {
        const newArr = aliases.map((a, i) => ({ ...a, is_main: i === index }));
        onChange(newArr);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Alias / Referencias Adicionales</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2 border rounded-md p-2 bg-muted/20">
                {aliases.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-2">
                        No hay referencias adicionales.
                    </div>
                )}
                {aliases.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", item.is_main ? "text-yellow-500" : "text-muted-foreground")}
                            onClick={() => handleSetMain(index)}
                            title="Marcar como principal (visual)"
                        >
                            <Star className={cn("h-4 w-4", item.is_main && "fill-current")} />
                        </Button>

                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Referencia / SKU"
                                value={item.alias}
                                onChange={(e) => handleChange(index, 'alias', e.target.value)}
                                className="h-8"
                            />
                            <Input
                                placeholder="Descripción (Opcional)"
                                value={item.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                className="h-8"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleRemove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
