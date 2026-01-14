import { Head } from '@inertiajs/react';

import AppLayout from '@/Layouts/app-layout';
import vouchers from '@/routes/vouchers';

import VoucherForm from './VoucherForm';


export default function Create() {
    const breadcrumbs = [
        { title: 'Comprobantes', href: vouchers.index().url },
        { title: 'Crear', href: '#' },
    ];

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
        >
            <Head title="Crear Comprobante" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-3xl font-light">+</span> Agregar Comprobante de Compras
                            </h1>
                        </div>

                        <VoucherForm mode="create" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
