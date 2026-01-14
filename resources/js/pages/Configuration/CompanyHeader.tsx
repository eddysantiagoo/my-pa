import { Card, CardContent } from '@/components/ui/card';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

interface CompanyInfo {
    name: string;
    nit: string;
    type: string;
    phone: string;
    address: string;
    email: string;
    logo_url: string;
}

export default function CompanyHeader({ company }: { company: CompanyInfo }) {
    return (
        <Card className="mb-6 border-none shadow-sm bg-card">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-border overflow-hidden">
                        {/* Placeholder for Logo if not real */}
                        <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-foreground">Empresa: {company.name}</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Número De Identificación Tributaria (NIT): <span className="text-foreground">{company.nit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Tipo De Persona: <span className="font-medium text-foreground">{company.type}</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 text-emerald-600" />
                            {company.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                            {company.address}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 justify-center md:justify-start">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        Correo Electrónico: {company.email}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
