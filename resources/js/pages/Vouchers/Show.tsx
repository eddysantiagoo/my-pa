import { Head } from '@inertiajs/react';
import { FileSearch } from 'lucide-react';

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

interface ShowProps {
    voucher: Voucher;
}

export default function Show({ voucher }: ShowProps) {
    const breadcrumbs = [
        { title: 'Comprobantes', href: vouchers.index().url },
        { title: voucher.document_id || 'Ver', href: `/vouchers/${voucher.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Comprobante ${voucher.document_id || ''}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500 rounded-lg text-white shadow-sm">
                        <FileSearch className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Detalle del Comprobante
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {voucher.document_id
                                ? `Visualizando comprobante ${voucher.document_id}`
                                : 'Información del comprobante'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <VoucherForm mode="view" voucher={voucher} />
                </div>
            </div>
        </AppLayout>
    );
}
