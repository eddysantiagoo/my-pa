import { Head, Link } from '@inertiajs/react';
import { Package, ChevronDown, MessageSquare } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/products';
import { Product } from '@/types/product';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/format';

interface Props {
    product: Product;
}

export default function Show({ product }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventario', href: '/inventory/products' },
            { title: product.name, href: '#' }
        ]}>
            <Head title={product.name} />

            <div className="p-4 max-w-7xl mx-auto w-full space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">{product.name}</h1>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="bg-primary hover:bg-primary/90">
                                Acciones <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={edit.url({ product: product.id })}>Editar producto</Link>
                            </DropdownMenuItem>
                            {/* Add other actions */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Details */}
                    <div className="md:col-span-2 space-y-0 text-sm">
                        <div className="bg-muted/50 border border-border rounded-t-lg p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Código</span>
                            <span className="col-span-2 font-bold text-foreground">{product.id}</span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Referencia</span>
                            <span className="col-span-2 text-foreground">{product.reference}</span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Equivalencias</span>
                            <span className="col-span-2 text-muted-foreground italic">
                                {/* Use merged equivalences if available */}
                                {(product as any).equivalences?.length ?
                                    (product as any).equivalences.map((e: any) => e.reference).join(', ')
                                    : 'Sin equivalencias'}
                            </span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Nombre</span>
                            <span className="col-span-2 text-foreground">{product.name}</span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Precio de Venta</span>
                            <span className="col-span-2 font-bold text-foreground">
                                {formatCurrency(product.price)} <span className="text-muted-foreground font-normal text-xs">General</span>
                            </span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Impuesto</span>
                            <span className="col-span-2 text-foreground">
                                {product.tax_rate > 0 ? formatPercentage(product.tax_rate) : 'Ninguno (0%)'}
                            </span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Marca</span>
                            <span className="col-span-2 text-foreground">{product.brand?.name ?? 'N/A'}</span>
                        </div>
                        <div className="bg-card border-x border-b border-border p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Categoria</span>
                            <span className="col-span-2 text-foreground">{product.category?.name ?? 'ACTIVOS'}</span>
                        </div>
                        <div className="bg-card border-x border-b border-border rounded-b-lg p-3 grid grid-cols-3 gap-4">
                            <span className="font-semibold text-muted-foreground">Stock actual</span>
                            <span className="col-span-2 font-bold text-foreground">{formatNumber(product.stock, 0)}</span>
                        </div>
                    </div>

                    {/* Right Column: Main Image */}
                    <div className="md:col-span-1">
                        <div className="border border-border rounded-lg p-4 h-full flex items-center justify-center bg-card relative">
                            {product.main_image_path ? (
                                <img src={product.main_image_path} alt={product.name} className="max-w-full max-h-64 object-contain" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <p className="text-xs uppercase tracking-widest font-bold">Gestor de Partes</p>
                                    <p className="mt-2 text-lg font-bold">IMAGEN NO DISPONIBLE</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Extra Images */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3">
                        <CardTitle className="text-lg font-bold text-foreground">Imagenes Extras</CardTitle>
                        <Button variant="ghost" size="icon"><MessageSquare className="h-5 w-5" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/30 h-48">
                            <p className="text-lg font-medium text-foreground">Suelte imágenes aquí o haga clic para subirlas</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                (El máximo de imágenes subidas es de 10. Las imágenes no deben pesar mas de 2Mb y deben estar entre los formatos correctos .png .jpg .gif .bmp .jpeg.)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="ventas" className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b border-border h-auto p-0 rounded-none">
                        <TabsTrigger value="ventas" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Facturas de venta</TabsTrigger>
                        <TabsTrigger value="compras" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Facturas de compra</TabsTrigger>
                        <TabsTrigger value="cotizaciones" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Cotizaciones</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ventas" className="p-4 border border-border rounded-b-lg mt-0 bg-card min-h-[200px] flex flex-col items-center justify-center">
                        <Input placeholder="Buscar (Enter)" className="max-w-xs mb-4" />
                        <p className="text-muted-foreground text-sm">Sin resultados encontrados</p>
                    </TabsContent>
                    <TabsContent value="compras" className="p-4 border border-border rounded-b-lg mt-0 bg-card min-h-[200px]">
                        <p className="text-muted-foreground text-sm text-center">Sin resultados encontrados</p>
                    </TabsContent>
                    <TabsContent value="cotizaciones" className="p-4 border border-border rounded-b-lg mt-0 bg-card min-h-[200px]">
                        <p className="text-muted-foreground text-sm text-center">Sin resultados encontrados</p>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
