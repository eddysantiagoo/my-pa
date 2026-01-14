import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function Placeholder({ title }: { title: string }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title, href: '#' }]}>
            <Head title={title} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">This module is under construction.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
