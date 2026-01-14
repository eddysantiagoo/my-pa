import { Head } from '@inertiajs/react';
import { FilePlus2 } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import vouchers from '@/routes/vouchers';

import VoucherForm from './VoucherForm';

export default function Create() {
    const breadcrumbs = [
        { title: 'Comprobantes', href: vouchers.index().url },
        { title: 'Crear', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Comprobante" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500 rounded-lg text-white shadow-sm">
                        <FilePlus2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Nuevo Comprobante de Compra
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Completa la información para crear un nuevo comprobante
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <VoucherForm mode="create" />
                </div>
            </div>
        </AppLayout>
    );
}
