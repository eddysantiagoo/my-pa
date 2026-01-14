import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Product, Brand, Category, Tag } from '@/types/product';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useMemo } from 'react';
import { update, store } from '@/routes/products';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductFormProps {
    product?: Product; // If provided, it's Edit mode
    brands: Brand[];
    categories: Category[];
    tags: Tag[];
    cancelHref: string;
}

export function ProductForm({ product, brands, categories, tags, cancelHref }: ProductFormProps) {
    const [isGeneralOpen, setIsGeneralOpen] = useState(true);
    const [isCommercialOpen, setIsCommercialOpen] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [saveAndCreateAnother, setSaveAndCreateAnother] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm<{
        name: string;
        reference: string;
        brand_id: string;
        category_id: string;
        description: string;
        purchase_price: number;
        price: number;
        tax_rate: number;
        is_inventariable: boolean;
        is_rotative: boolean;
        is_public: boolean;
        quantity: number;
        unit_of_measure: string;
    }>({
        name: product?.name ?? '',
        reference: product?.reference ?? '',
        brand_id: product?.brand?.id ? String(product.brand.id) : '',
        category_id: product?.category?.id ? String(product.category.id) : '',
        description: product?.description ?? '',
        purchase_price: product?.purchase_price ?? 0,
        price: product?.price ?? 0,
        tax_rate: product?.tax_rate ?? 0,
        is_inventariable: product?.is_inventariable ?? true,
        is_rotative: product?.is_rotative ?? false,
        is_public: product?.is_public ?? false,
        quantity: 1,
        unit_of_measure: '',
    });

    // Calcular total con impuesto
    const totalPrice = useMemo(() => {
        const basePrice = data.price || 0;
        const taxAmount = (basePrice * (data.tax_rate || 0)) / 100;
        return basePrice + taxAmount;
    }, [data.price, data.tax_rate]);

    // Formatear número para input de moneda
    const formatCurrencyInput = (value: number): string => {
        if (!value || value === 0) return '';
        return value.toString();
    };

    // Parsear input de moneda a número
    const parseCurrencyInput = (value: string): number => {
        const cleaned = value.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (product) {
            put(update.url({ product: product.id }), {
                onSuccess: () => {
                    if (!saveAndCreateAnother) {
                        window.location.href = cancelHref;
                    }
                },
            });
        } else {
            post(store.url(), {
                onSuccess: () => {
                    if (saveAndCreateAnother) {
                        // Reset form
                        setData({
                            name: '',
                            reference: '',
                            brand_id: '',
                            category_id: '',
                            description: '',
                            purchase_price: 0,
                            price: 0,
                            tax_rate: 0,
                            is_inventariable: true,
                            is_rotative: false,
                            is_public: false,
                            quantity: 1,
                            unit_of_measure: '',
                        });
                    } else {
                        window.location.href = cancelHref;
                    }
                },
            });
        }
    };

    const selectedBrand = brands.find(b => String(b.id) === data.brand_id);
    const selectedCategory = categories.find(c => String(c.id) === data.category_id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-4">
                <form onSubmit={submit} className="space-y-4">
                    {/* Datos Generales */}
                    <Collapsible open={isGeneralOpen} onOpenChange={setIsGeneralOpen}>
                        <Card>
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Datos Generales</h3>
                                    {isGeneralOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nombre <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nombre del producto o servicio"
                                            required
                                            className="bg-background"
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reference">
                                            Referencia <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="reference"
                                                value={data.reference}
                                                onChange={(e) => setData('reference', e.target.value)}
                                                placeholder="Referencia principal"
                                                required
                                                className="bg-background"
                                            />
                                            <Button type="button" variant="outline" size="icon">+</Button>
                                        </div>
                                        {errors.reference && <p className="text-sm text-destructive">{errors.reference}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Cantidad</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', Number(e.target.value))}
                                            className="bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Agrega una descripción del producto o servicio..."
                                            className="bg-background min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand_id">Marca</Label>
                                        <Select value={data.brand_id} onValueChange={(v) => setData('brand_id', v)}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Asignar marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={String(brand.id)}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unit_of_measure">Unidad de medida</Label>
                                        <Select value={data.unit_of_measure} onValueChange={(v) => setData('unit_of_measure', v)}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Selecciona una unidad de medida" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unidad">Unidad</SelectItem>
                                                <SelectItem value="kg">Kilogramo</SelectItem>
                                                <SelectItem value="g">Gramo</SelectItem>
                                                <SelectItem value="l">Litro</SelectItem>
                                                <SelectItem value="ml">Mililitro</SelectItem>
                                                <SelectItem value="m">Metro</SelectItem>
                                                <SelectItem value="cm">Centímetro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            id="is_inventariable"
                                            checked={data.is_inventariable}
                                            onCheckedChange={(c) => setData('is_inventariable', c)}
                                        />
                                        <Label htmlFor="is_inventariable" className="cursor-pointer">
                                            Inventariable
                                        </Label>
                                    </div>
                                    {data.is_inventariable && (
                                        <p className="text-sm text-muted-foreground">
                                            Mantén activada esta opción para llevar el control de costos y cantidades
                                        </p>
                                    )}
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>

                    {/* Información comercial */}
                    <Collapsible open={isCommercialOpen} onOpenChange={setIsCommercialOpen}>
                        <Card>
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Información comercial</h3>
                                    {isCommercialOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Precio base <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="price"
                                                type="text"
                                                value={formatCurrencyInput(data.price)}
                                                onChange={(e) => {
                                                    const numValue = parseCurrencyInput(e.target.value);
                                                    setData('price', numValue);
                                                }}
                                                placeholder="0"
                                                required
                                                className="bg-background pl-7"
                                            />
                                        </div>
                                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tax_rate">
                                            Impuesto <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="flex gap-2 items-center">
                                            <Button type="button" variant="outline" size="icon">+</Button>
                                            <Select
                                                value={data.tax_rate ? String(data.tax_rate) : '0'}
                                                onValueChange={(v) => setData('tax_rate', Number(v))}
                                            >
                                                <SelectTrigger className="bg-background flex-1">
                                                    <SelectValue placeholder="Selecciona un impuesto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0%</SelectItem>
                                                    <SelectItem value="5">5%</SelectItem>
                                                    <SelectItem value="19">19%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <span className="text-muted-foreground">=</span>
                                            <div className="px-3 py-2 bg-muted rounded-md min-w-[80px] text-right">
                                                {formatCurrency((data.price * data.tax_rate) / 100)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="total">
                                            Total <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="total"
                                                type="text"
                                                value={formatCurrencyInput(totalPrice)}
                                                readOnly
                                                className="bg-muted pl-7 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Lista de precios</Label>
                                        <Select>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Selecciona valor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>

                    {/* Detalles del producto */}
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <Card>
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Detalles del producto</h3>
                                    {isDetailsOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Categoria</Label>
                                        <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Imagen principal</Label>
                                        <div className="h-32 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/20">
                                            <span className="text-sm text-muted-foreground">Arrastre o seleccione imagen</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="is_rotative"
                                                checked={data.is_rotative}
                                                onCheckedChange={(c) => setData('is_rotative', c)}
                                            />
                                            <Label htmlFor="is_rotative" className="cursor-pointer">
                                                Producto rotativo
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="is_public"
                                                checked={data.is_public}
                                                onCheckedChange={(c) => setData('is_public', c)}
                                            />
                                            <Label htmlFor="is_public" className="cursor-pointer">
                                                Publicar en la web
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button variant="outline" type="button" onClick={() => window.location.href = cancelHref}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                            {product ? 'Guardar cambios' : 'Crear producto'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-1">
                <Card className="sticky top-4">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            {data.is_inventariable && (
                                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-400 rounded"></div>
                            )}
                            <Badge variant={data.is_inventariable ? 'default' : 'secondary'}>
                                {data.is_inventariable ? 'Inventariable' : 'No inventariable'}
                            </Badge>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-foreground">
                                {data.name || 'Nombre del producto'}
                            </h2>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Referencia:</span>
                                <span className="font-medium text-foreground">{data.reference || '1'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Marca:</span>
                                <span className="font-medium text-foreground">{selectedBrand?.name || '1'}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="font-semibold text-foreground mb-3">Información de precios</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Precio base:</span>
                                    <span className="font-medium text-foreground">{formatCurrency(data.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Impuesto ({formatPercentage(data.tax_rate)}):
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {formatCurrency((data.price * data.tax_rate) / 100)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-border">
                                    <span className="font-semibold text-foreground">Total:</span>
                                    <span className="font-bold text-foreground">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {!product && (
                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="save_and_create"
                                        checked={saveAndCreateAnother}
                                        onCheckedChange={setSaveAndCreateAnother}
                                    />
                                    <Label htmlFor="save_and_create" className="cursor-pointer text-sm">
                                        Guardar y crear otro
                                    </Label>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
