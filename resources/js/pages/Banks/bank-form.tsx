import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BankAccount {
    id?: number;
    name: string;
    account_number: string | null;
    type: string;
    initial_balance: string;
    description: string | null;
    transaction_date?: string; // For initial balance date
}

interface BankFormProps {
    bank?: BankAccount;
    mode: 'create' | 'edit';
}

export default function BankForm({ bank, mode }: BankFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: bank?.name || '',
        account_number: bank?.account_number || '',
        type: bank?.type || '',
        initial_balance: bank?.initial_balance || '',
        description: bank?.description || '',
        transaction_date: bank?.transaction_date || new Date().toISOString().split('T')[0],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/banks');
        } else {
            put(`/banks/${bank?.id}`);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Tipo de la Cuenta <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.type}
                        onValueChange={(value) => setData('type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                            <SelectItem value="Corriente">Corriente</SelectItem>
                            <SelectItem value="Ahorros">Ahorros</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Cuenta <span className="text-red-500">*</span></Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej. Banco Davivienda"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="account_number">Número de la Cuenta</Label>
                    <Input
                        id="account_number"
                        value={data.account_number}
                        onChange={(e) => setData('account_number', e.target.value)}
                        placeholder="Ej. 1234567890"
                    />
                    {errors.account_number && <p className="text-sm text-red-500">{errors.account_number}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="initial_balance">Saldo inicial <span className="text-red-500">*</span></Label>
                    <Input
                        id="initial_balance"
                        type="number"
                        step="0.01"
                        value={data.initial_balance}
                        onChange={(e) => setData('initial_balance', e.target.value)}
                        placeholder="0"
                    />
                    {errors.initial_balance && <p className="text-sm text-red-500">{errors.initial_balance}</p>}
                </div>
                {/* Only show date on create or if needed? Image shows "Fecha" */}
                <div className="space-y-2">
                    <Label htmlFor="transaction_date">Fecha <span className="text-red-500">*</span></Label>
                    <Input
                        id="transaction_date"
                        type="date"
                        value={data.transaction_date}
                        onChange={(e) => setData('transaction_date', e.target.value)}
                    />
                    {errors.transaction_date && <p className="text-sm text-red-500">{errors.transaction_date}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <p className="text-sm text-muted-foreground">Los campos marcados con <span className="text-red-500">*</span> son obligatorios</p>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white">
                    Guardar
                </Button>
            </div>
        </form>
    );
}
