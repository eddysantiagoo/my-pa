
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, CloudUpload, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';



export default function VoucherForm({ voucher = null, mode = 'create' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        document_id: voucher?.document_id || '',
        provider_json: voucher?.provider_json || null,
        seller_json: voucher?.seller_json || null,
        date: voucher?.created_at ? new Date(voucher.created_at) : new Date(),
        total: voucher?.total || '',
        label: voucher?.label || '',
        notes: voucher?.notes || '',
        observations: '', // Not in DB schema explicitly, maybe notes? distinguishing for UI
        has_freight: false,
        has_other: false,
        purchase_document: null,
        payment_document: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Transformation for backend
        const payload = {
            ...data,
            // Mocking JSON structures for now if empty
            provider_json: data.provider_json || { name: 'Mock Provider', id: 1 },
            seller_json: data.seller_json || { name: 'Mock Buyer', id: 1 },
        };

        if (mode === 'create') {
            post('/vouchers', payload);
        } else {
            put(`/vouchers/${voucher.id}`, payload);
        }
    };

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="document_id">Numero de documento</Label>
                        <Input
                            id="document_id"
                            value={data.document_id}
                            onChange={e => setData('document_id', e.target.value)}
                            disabled={mode === 'view'}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="provider">Proveedor *</Label>
                        <Select onValueChange={(val) => setData('provider_json', { name: val, id: val })} disabled={mode === 'view'}>
                            <SelectTrigger className="bg-gray-200 border-none">
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PROV-001">SERVIELECTRICOS UNIVERSAL</SelectItem>
                                <SelectItem value="PROV-002">MULTIDIESEL MEDELLIN</SelectItem>
                            </SelectContent>
                        </Select>
                        {mode !== 'view' && (
                            <div className="flex gap-4 text-sm text-green-600 font-medium cursor-pointer">
                                <span className="hover:underline flex items-center"><PlusIcon className="w-3 h-3 mr-1" /> Crear rápido</span>
                                <span className="hover:underline flex items-center"><UserPlus className="w-3 h-3 mr-1" /> Nuevo Contacto</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Fecha *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    disabled={mode === 'view'}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date ? format(data.date, "dd-MM-yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={data.date}
                                    onSelect={(date) => setData('date', date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="buyer">Comprador *</Label>
                        <Select onValueChange={(val) => setData('seller_json', { name: val, id: val })} disabled={mode === 'view'}>
                            <SelectTrigger className="bg-gray-200 border-none">
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUY-001">Esneider Castañeda</SelectItem>
                                <SelectItem value="BUY-002">Leonardo Hernandez</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="total">Valor *</Label>
                        <Input
                            id="total"
                            type="number"
                            value={data.total}
                            onChange={e => setData('total', e.target.value)}
                            disabled={mode === 'view'}
                        />
                        <div className="p-4 bg-gray-200 text-right font-bold text-lg rounded-sm text-gray-700">
                            ${parseFloat(data.total || 0).toLocaleString('es-CO')}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="freight" checked={data.has_freight} onCheckedChange={(c) => setData('has_freight', c)} disabled={mode === 'view'} />
                            <label htmlFor="freight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Fletes
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="other" checked={data.has_other} onCheckedChange={(c) => setData('has_other', c)} disabled={mode === 'view'} />
                            <label htmlFor="other" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Otros
                            </label>
                        </div>
                    </div>

                </div>
            </div>

            {/* Notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label>Observaciones <span className="text-xs text-gray-500 font-normal">No visible en el comprobante de pago</span></Label>
                    <Textarea
                        className="min-h-[100px]"
                        value={data.observations}
                        onChange={e => setData('observations', e.target.value)}
                        disabled={mode === 'view'}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Notas del comprobante <span className="text-xs text-gray-500 font-normal">Visible en el comprobante de pago</span></Label>
                    <Textarea
                        className="min-h-[100px]"
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        disabled={mode === 'view'}
                    />
                </div>
            </div>

            {/* Estado */}
            <div className="space-y-2 max-w-md">
                <Label>Etiqueta de estado</Label>
                <Select onValueChange={(val) => setData('label', val)} disabled={mode === 'view'}>
                    <SelectTrigger className="bg-gray-200 border-none">
                        <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PAGADA">PAGADA</SelectItem>
                        <SelectItem value="PRIORITARIO">PRIORITARIO</SelectItem>
                        <SelectItem value="ESPERAR CONFIRMACION">ESPERAR CONFIRMACION</SelectItem>
                    </SelectContent>
                </Select>
                {mode !== 'view' && (
                    <p className="text-sm text-green-600 font-medium cursor-pointer hover:underline text-right">Crear nueva etiqueta</p>
                )}
            </div>

            {/* Archivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-2">
                    <Label className="font-bold text-base">Documento de compra</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-48 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <Input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange('purchase_document', e.target.files[0])}
                            disabled={mode === 'view'}
                        />
                        <CloudUpload className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">Arrastra y suelta un archivo aquí o haz click</p>
                        {data.purchase_document && <p className="text-sm text-green-600 mt-2 font-medium">{data.purchase_document.name}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="font-bold text-base">Documento Pago (Opcional)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-48 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <Input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange('payment_document', e.target.files[0])}
                            disabled={mode === 'view'}
                        />
                        <CloudUpload className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">Arrastra y suelta un archivo aquí o haz click</p>
                        {data.payment_document && <p className="text-sm text-green-600 mt-2 font-medium">{data.payment_document.name}</p>}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
                {mode !== 'view' && (
                    <>
                        <Button type="button" variant="ghost" className="bg-slate-900 text-white hover:bg-slate-800" disabled={processing}>
                            Guardar y crear otra
                        </Button>
                        <Button type="button" variant="ghost" className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => window.history.back()}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[100px]" disabled={processing}>
                            Guardar
                        </Button>
                    </>
                )}
                {mode === 'view' && (
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Volver
                    </Button>
                )}
            </div>
        </form>
    );
}

function PlusIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
