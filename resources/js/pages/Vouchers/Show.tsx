import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';

import VoucherForm from './VoucherForm';

export default function Show({ voucher }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Comprobantes', href: '/vouchers' }, { title: 'Ver', href: `/vouchers/${voucher?.id}` }]}>
            <Head title="Ver Comprobante" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                👁️ Ver Comprobante {voucher.document_id}
                            </h1>
                        </div>

                        <VoucherForm mode="view" voucher={voucher} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
