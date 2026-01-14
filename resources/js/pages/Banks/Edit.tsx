import { Head } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import BankForm from './bank-form';

interface Props {
    bank: any;
}

export default function BankEdit({ bank }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Bancos', href: '/banks' },
            { title: 'Modificar Banco', href: '#' }
        ]}>
            <Head title="Modificar Banco" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <h1 className="text-2xl font-bold tracking-tight">Modificar Cuenta: {bank.name}</h1>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BankForm mode="edit" bank={bank} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
