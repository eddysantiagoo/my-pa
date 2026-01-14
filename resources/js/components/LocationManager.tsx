import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { Warehouse } from '@/types/warehouse';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface StorageLocationItem {
    warehouse_id: string; // use string for Select value compatibility
    location_name: string;
}

interface LocationManagerProps {
    value: StorageLocationItem[];
    onChange: (val: StorageLocationItem[]) => void;
    warehouses: Warehouse[];
}

export function LocationManager({ value, onChange, warehouses }: LocationManagerProps) {
    const handleAdd = () => {
        onChange([...value, { warehouse_id: '', location_name: '' }]);
    };

    const handleRemove = (index: number) => {
        const newArr = [...value];
        newArr.splice(index, 1);
        onChange(newArr);
    };

    const updateField = (index: number, field: keyof StorageLocationItem, val: string) => {
        const newArr = [...value];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label>Ubicación Física</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar Ubicación
                </Button>
            </div>

            <div className="grid gap-3">
                {value.length === 0 && (
                    <div className="bg-muted/30 p-4 rounded-md text-center text-sm text-muted-foreground border border-dashed">
                        No hay ubicaciones asignadas. Agregue una para saber dónde encontrar este ítem.
                    </div>
                )}
                {value.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start bg-card p-2 rounded-md border shadow-sm">
                        <div className="mt-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                            <div className="grid gap-1">
                                <Label className="text-xs">Bodega</Label>
                                <Select
                                    value={item.warehouse_id}
                                    onValueChange={(val) => updateField(index, 'warehouse_id', val)}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Seleccione Bodega" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map(w => (
                                            <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-xs">Ubicación (Estante/Cajón)</Label>
                                <Input
                                    className="h-9"
                                    placeholder="Ej: Pasillo 1, Nivel B"
                                    value={item.location_name}
                                    onChange={(e) => updateField(index, 'location_name', e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-6 text-muted-foreground hover:text-red-500"
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
