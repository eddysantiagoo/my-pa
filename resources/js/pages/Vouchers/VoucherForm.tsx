import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Building2,
    CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    CloudUpload,
    DollarSign,
    FileText,
    Hash,
    Package,
    Plus,
    Save,
    StickyNote,
    Tag,
    Truck,
    User,
    UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface VoucherFormProps {
    voucher?: {
        id: number;
        document_id: string;
        provider_json: { name: string; id: string } | null;
        seller_json: { name: string; id: string } | null;
        created_at: string;
        total: string;
        label: string;
        notes: string;
    } | null;
    mode?: 'create' | 'edit' | 'view';
}

export default function VoucherForm({ voucher = null, mode = 'create' }: VoucherFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        document_id: voucher?.document_id || '',
        provider_json: voucher?.provider_json || null,
        seller_json: voucher?.seller_json || null,
        date: voucher?.created_at ? new Date(voucher.created_at) : new Date(),
        total: voucher?.total || '',
        label: voucher?.label || '',
        notes: voucher?.notes || '',
        observations: '',
        has_freight: false,
        has_other: false,
        purchase_document: null as File | null,
        payment_document: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            provider_json: data.provider_json || { name: 'Mock Provider', id: '1' },
            seller_json: data.seller_json || { name: 'Mock Buyer', id: '1' },
        };

        if (mode === 'create') {
            post('/vouchers', payload);
        } else {
            put(`/vouchers/${voucher?.id}`, payload);
        }
    };

    const handleFileChange = (field: 'purchase_document' | 'payment_document', file: File | null) => {
        setData(field, file);
    };

    const isDisabled = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección Principal - Grid de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda - Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card de Información del Documento */}
                    <Card className="border-t-4 border-t-emerald-500">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Información del Documento</CardTitle>
                                    <CardDescription>Datos principales del comprobante</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Número de documento */}
                                <div className="space-y-2">
                                    <Label htmlFor="document_id" className="flex items-center gap-2 text-sm font-medium">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        Número de documento
                                    </Label>
                                    <Input
                                        id="document_id"
                                        placeholder="Ej: FAC-001"
                                        value={data.document_id}
                                        onChange={(e) => setData('document_id', e.target.value)}
                                        disabled={isDisabled}
                                        className="h-10"
                                    />
                                    {errors.document_id && (
                                        <p className="text-sm text-destructive">{errors.document_id}</p>
                                    )}
                                </div>

                                {/* Fecha */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-medium">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        Fecha <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={data.date ? format(data.date, 'yyyy-MM-dd') : ''}
                                            onChange={(e) => {
                                                const dateValue = e.target.value;
                                                if (dateValue) {
                                                    setData('date', new Date(dateValue + 'T00:00:00'));
                                                }
                                            }}
                                            disabled={isDisabled}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Proveedor */}
                                <div className="space-y-2">
                                    <Label htmlFor="provider" className="flex items-center gap-2 text-sm font-medium">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        Proveedor <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(val) => setData('provider_json', { name: val, id: val })}
                                        disabled={isDisabled}
                                    >
                                        <SelectTrigger className="h-10 bg-muted/50">
                                            <SelectValue placeholder="Seleccionar proveedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PROV-001">SERVIELECTRICOS UNIVERSAL</SelectItem>
                                            <SelectItem value="PROV-002">MULTIDIESEL MEDELLIN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {!isDisabled && (
                                        <div className="flex gap-3 pt-1">
                                            <button
                                                type="button"
                                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Crear rápido
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <UserPlus className="h-3 w-3" />
                                                Nuevo contacto
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Comprador */}
                                <div className="space-y-2">
                                    <Label htmlFor="buyer" className="flex items-center gap-2 text-sm font-medium">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Comprador <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(val) => setData('seller_json', { name: val, id: val })}
                                        disabled={isDisabled}
                                    >
                                        <SelectTrigger className="h-10 bg-muted/50">
                                            <SelectValue placeholder="Seleccionar comprador" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BUY-001">Esneider Castañeda</SelectItem>
                                            <SelectItem value="BUY-002">Leonardo Hernandez</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Notas y Observaciones */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <StickyNote className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Notas y Observaciones</CardTitle>
                                    <CardDescription>Información adicional del comprobante</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Observaciones internas
                                    </Label>
                                    <p className="text-xs text-muted-foreground -mt-1">
                                        No visible en el comprobante de pago
                                    </p>
                                    <Textarea
                                        placeholder="Escribe observaciones internas..."
                                        className="min-h-[120px] resize-none"
                                        value={data.observations}
                                        onChange={(e) => setData('observations', e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Notas del comprobante
                                    </Label>
                                    <p className="text-xs text-muted-foreground -mt-1">
                                        Visible en el comprobante de pago
                                    </p>
                                    <Textarea
                                        placeholder="Escribe notas para el comprobante..."
                                        className="min-h-[120px] resize-none"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Documentos Adjuntos */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <CloudUpload className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Documentos Adjuntos</CardTitle>
                                    <CardDescription>Sube los documentos relacionados</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Documento de compra */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Documento de compra
                                    </Label>
                                    <div className="relative group">
                                        <div className="border-2 border-dashed border-border rounded-xl h-36 flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-emerald-300 transition-all">
                                            <Input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileChange('purchase_document', e.target.files?.[0] || null)}
                                                disabled={isDisabled}
                                            />
                                            <CloudUpload className="h-8 w-8 text-muted-foreground/60 mb-2 group-hover:text-emerald-500 transition-colors" />
                                            <p className="text-xs text-muted-foreground text-center px-4">
                                                Arrastra y suelta o haz clic para subir
                                            </p>
                                            {data.purchase_document && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 font-medium">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {data.purchase_document.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Documento de pago */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Documento de pago
                                        <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
                                    </Label>
                                    <div className="relative group">
                                        <div className="border-2 border-dashed border-border rounded-xl h-36 flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-emerald-300 transition-all">
                                            <Input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileChange('payment_document', e.target.files?.[0] || null)}
                                                disabled={isDisabled}
                                            />
                                            <CloudUpload className="h-8 w-8 text-muted-foreground/60 mb-2 group-hover:text-emerald-500 transition-colors" />
                                            <p className="text-xs text-muted-foreground text-center px-4">
                                                Arrastra y suelta o haz clic para subir
                                            </p>
                                            {data.payment_document && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 font-medium">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {data.payment_document.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha - Resumen y Estado */}
                <div className="space-y-6">
                    {/* Card de Valor Total */}
                    <Card className="border-t-4 border-t-slate-800">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800/10 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-slate-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Valor del Comprobante</CardTitle>
                                    <CardDescription>Monto total y opciones</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="total" className="text-sm font-medium">
                                    Valor <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="total"
                                    type="number"
                                    placeholder="0"
                                    value={data.total}
                                    onChange={(e) => setData('total', e.target.value)}
                                    disabled={isDisabled}
                                    className="h-10"
                                />
                            </div>

                            {/* Display del valor formateado */}
                            <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white">
                                <p className="text-xs text-slate-400 mb-1">Total a pagar</p>
                                <p className="text-2xl font-bold tracking-tight">
                                    ${parseFloat(data.total || '0').toLocaleString('es-CO')}
                                </p>
                            </div>

                            {/* Opciones adicionales */}
                            <div className="space-y-3 pt-2">
                                <p className="text-sm font-medium text-muted-foreground">Incluye:</p>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <Checkbox
                                            id="freight"
                                            checked={data.has_freight}
                                            onCheckedChange={(c) => setData('has_freight', !!c)}
                                            disabled={isDisabled}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm">Fletes</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <Checkbox
                                            id="other"
                                            checked={data.has_other}
                                            onCheckedChange={(c) => setData('has_other', !!c)}
                                            disabled={isDisabled}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm">Otros</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Estado/Etiqueta */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Tag className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Estado</CardTitle>
                                    <CardDescription>Etiqueta del comprobante</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Select
                                value={data.label}
                                onValueChange={(val) => setData('label', val)}
                                disabled={isDisabled}
                            >
                                <SelectTrigger className="h-10 bg-muted/50">
                                    <SelectValue placeholder="Seleccionar etiqueta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PAGADA">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            PAGADA
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="PRIORITARIO">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            PRIORITARIO
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="ESPERAR CONFIRMACION">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            ESPERAR CONFIRMACION
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {!isDisabled && (
                                <button
                                    type="button"
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="h-3 w-3" />
                                    Crear nueva etiqueta
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Volver
                </Button>

                {mode !== 'view' && (
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Guardar y crear otra
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white min-w-[120px]"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}
