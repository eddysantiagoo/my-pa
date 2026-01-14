import { Head } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import BankForm from './bank-form';

export default function BankCreate() {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Bancos', href: '/banks' },
            { title: 'Nuevo Banco', href: '/banks/create' }
        ]}>
            <Head title="Nuevo Banco" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <h1 className="text-2xl font-bold tracking-tight">Nuevo Banco</h1>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BankForm mode="create" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
