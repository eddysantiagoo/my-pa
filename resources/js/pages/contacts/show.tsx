import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Copy, Eye, FileText, Pencil, Plus, Upload } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Contact } from '@/types/contact';

const IDENTIFICATION_TYPES: Record<string, string> = {
    CC: 'Cédula de Ciudadanía',
    NIT: 'NIT',
    DIE: 'Documento de Identificación Extranjero',
    CE: 'Cédula de Extranjería',
    PP: 'Pasaporte',
};

export default function ContactShow({ contact }: { contact: Contact }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contactos', href: '/contacts' },
        { title: contact.name, href: `/contacts/${contact.id}` },
    ];

    const [showIdentification, setShowIdentification] = useState(false);
    const primaryAddress = contact.addresses.find((a) => a.is_primary) || contact.addresses[0];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getContactTypeLabel = () => {
        if (contact.is_customer && contact.is_supplier) {
            return 'Cliente/Proveedor';
        }
        if (contact.is_customer) {
            return 'CLIENTE';
        }
        if (contact.is_supplier) {
            return 'PROVEEDOR';
        }
        return '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={contact.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/contacts')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{contact.name}</h1>
                                {contact.contact_category && (
                                    <Badge variant="secondary">{contact.contact_category}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Button variant="default" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear una factura de Venta
                            </Button>
                            <Button variant="default" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear una factura de Compra
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(`/contacts/${contact.id}/edit`)}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Adjuntar Docufile
                        </Button>
                    </div>
                </div>

                {/* Datos Generales */}
                <Card>
                    <CardHeader>
                        <CardTitle>Datos Generales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Nombre:</div>
                                    <div className="flex-1">{contact.name}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Tipo de Identificación:</div>
                                    <div className="flex-1">
                                        {IDENTIFICATION_TYPES[contact.identification_type] || contact.identification_type}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Identificación:</div>
                                    <div className="flex-1 flex items-center gap-2">
                                        {showIdentification ? (
                                            <span>{contact.identification_number}</span>
                                        ) : (
                                            <span>••••••••</span>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => setShowIdentification(!showIdentification)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(contact.identification_number)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Teléfono:</div>
                                    <div className="flex-1">{contact.phone || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Teléfono 2:</div>
                                    <div className="flex-1">{contact.phone2 || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Fax:</div>
                                    <div className="flex-1">{contact.fax || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Celular:</div>
                                    <div className="flex-1">{contact.cellphone || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Dirección:</div>
                                    <div className="flex-1">{primaryAddress?.address || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Ciudad:</div>
                                    <div className="flex-1">
                                        {primaryAddress?.city?.name || primaryAddress?.department?.name || '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Correo Electrónico:</div>
                                    <div className="flex-1">{contact.email || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Observaciones:</div>
                                    <div className="flex-1">{contact.observations || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Tipo de Empresa:</div>
                                    <div className="flex-1">{contact.contact_category || '-'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Tipo de Contacto:</div>
                                    <div className="flex-1">{getContactTypeLabel()}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Lista de Precio Asociada:</div>
                                    <div className="flex-1">{contact.price_list?.name || 'General'}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-48 font-medium text-muted-foreground">Vendedor Asociado:</div>
                                    <div className="flex-1">{contact.seller?.name || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Saldos y Remisiones */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saldos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Por cobrar:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Por cobrar vencido:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Por pagar:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Notas crédito por aplicar:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Notas débito por aplicar:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Remisiones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Por cobrar:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Por cobrar vencido:</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Historial de Transacciones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Transacciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="transactions" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                                <TabsTrigger value="transactions">Transacciones</TabsTrigger>
                                <TabsTrigger value="sales">Facturas de venta</TabsTrigger>
                                <TabsTrigger value="credit-notes">Notas crédito</TabsTrigger>
                                <TabsTrigger value="remittances">Remisiones alternativas</TabsTrigger>
                                <TabsTrigger value="purchase">Facturas de compra</TabsTrigger>
                                <TabsTrigger value="debit-notes">Notas débito</TabsTrigger>
                                <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
                                <TabsTrigger value="orders">Órdenes de compra</TabsTrigger>
                            </TabsList>
                            <TabsContent value="transactions" className="mt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Mostrar</span>
                                            <select className="rounded-md border px-2 py-1 text-sm">
                                                <option>5 Registros por página</option>
                                                <option>10 Registros por página</option>
                                                <option>25 Registros por página</option>
                                                <option>50 Registros por página</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Buscar:</span>
                                            <input
                                                type="text"
                                                className="rounded-md border px-3 py-1 text-sm"
                                                placeholder="Buscar..."
                                            />
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="cursor-pointer">
                                                    Fecha <span className="ml-1">↑↓</span>
                                                </TableHead>
                                                <TableHead className="cursor-pointer">
                                                    Banco <span className="ml-1">↑↓</span>
                                                </TableHead>
                                                <TableHead className="cursor-pointer">
                                                    Detalle <span className="ml-1">↑↓</span>
                                                </TableHead>
                                                <TableHead className="text-right cursor-pointer">
                                                    Salidas <span className="ml-1">↑↓</span>
                                                </TableHead>
                                                <TableHead className="text-right cursor-pointer">
                                                    Entradas <span className="ml-1">↑↓</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    Sin resultados encontrados
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <div className="flex items-center justify-between">
                                        <Button variant="outline" size="sm" disabled>
                                            Anterior
                                        </Button>
                                        <Button variant="outline" size="sm" disabled>
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="sales" className="mt-4">
                                <p className="text-sm text-muted-foreground">Facturas de venta</p>
                            </TabsContent>
                            <TabsContent value="credit-notes" className="mt-4">
                                <p className="text-sm text-muted-foreground">Notas crédito</p>
                            </TabsContent>
                            <TabsContent value="remittances" className="mt-4">
                                <p className="text-sm text-muted-foreground">Remisiones alternativas</p>
                            </TabsContent>
                            <TabsContent value="purchase" className="mt-4">
                                <p className="text-sm text-muted-foreground">Facturas de compra</p>
                            </TabsContent>
                            <TabsContent value="debit-notes" className="mt-4">
                                <p className="text-sm text-muted-foreground">Notas débito</p>
                            </TabsContent>
                            <TabsContent value="quotes" className="mt-4">
                                <p className="text-sm text-muted-foreground">Cotizaciones</p>
                            </TabsContent>
                            <TabsContent value="orders" className="mt-4">
                                <p className="text-sm text-muted-foreground">Órdenes de compra</p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

