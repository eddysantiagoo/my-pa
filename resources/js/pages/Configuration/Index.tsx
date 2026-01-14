import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ConfigurationCard from './ConfigurationCard';
import CompanyHeader from './CompanyHeader';
import { Settings } from 'lucide-react';

interface Option {
    name: string;
    status: boolean;
    type?: string;
}

interface Props {
    configurations: Record<string, Option[]>;
    company: any;
}

export default function ConfigurationIndex({ configurations, company }: Props) {

    // Ordered keys to match the grid layout in the image roughly
    const orderedModules = [
        'Empresa', 'Facturación', 'Facturación POS', 'Compras',
        'Documentos Soporte', 'Impuestos', 'Contactos', 'Campos Extras Inventario',
        'Planes', 'Contabilidad', 'Sedes', 'CRM',
        'Nómina', 'Tracking (Seguimiento)', 'Inventario', 'Columnas De Tabla'
    ];

    const handleToggle = (module: string, optionIndex: number) => {
        const options = [...configurations[module]];
        options[optionIndex].status = !options[optionIndex].status;

        router.post(route('configuration.update', module), {
            options: JSON.stringify(options),
        }, {
            preserveScroll: true,
            preserveState: true,
            only: ['configurations', 'flash'],
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '#' }]}>
            <Head title="Configuración" />

            <div className="flex flex-col gap-6 p-6 bg-background min-h-screen">

                {/* Header Banner */}
                <div className="rounded-lg p-4 flex items-center gap-4 border border-border bg-card">
                    <div className="p-2 bg-emerald-500 rounded-md text-primary-foreground">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Configuración</h1>
                        <p className="text-sm text-muted-foreground">Parametriza aspectos para tu empresa</p>
                    </div>
                </div>

                <CompanyHeader company={company} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {orderedModules.map((moduleName) => {
                        const options = configurations[moduleName];
                        if (!options) return null;

                        return (
                            <ConfigurationCard
                                key={moduleName}
                                title={moduleName}
                                options={options}
                                onToggle={(idx) => handleToggle(moduleName, idx)}
                            />
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
