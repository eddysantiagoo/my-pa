import { Head } from '@inertiajs/react';
import { FileEdit } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import vouchers from '@/routes/vouchers';

import VoucherForm from './VoucherForm';

interface Voucher {
    id: number;
    document_id: string;
    provider_json: { name: string; id: string } | null;
    seller_json: { name: string; id: string } | null;
    created_at: string;
    total: string;
    label: string;
    notes: string;
}

interface EditProps {
    voucher: Voucher;
}

export default function Edit({ voucher }: EditProps) {
    const breadcrumbs = [
        { title: 'Comprobantes', href: vouchers.index().url },
        { title: voucher.document_id || 'Editar', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Comprobante ${voucher.document_id || ''}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500 rounded-lg text-white shadow-sm">
                        <FileEdit className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Editar Comprobante
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {voucher.document_id
                                ? `Modificando comprobante ${voucher.document_id}`
                                : 'Modifica la información del comprobante'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <VoucherForm mode="edit" voucher={voucher} />
                </div>
            </div>
        </AppLayout>
    );
}
