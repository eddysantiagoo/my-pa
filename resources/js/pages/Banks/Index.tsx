import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

interface BankAccount {
    id: number;
    name: string;
    account_number: string | null;
    type: string;
    initial_balance: string;
    description: string | null;
    created_at: string;
}

interface Props {
    accounts: {
        data: BankAccount[];
        links: any[];
    };
    filters: {
        search: string;
    };
}


function BalanceRevealer({ balance }: { balance: string }) {
    const [show, setShow] = useState(false);

    return (
        <Button
            variant="secondary"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700 min-w-[120px]"
            onClick={() => setShow(!show)}
        >
            <Eye className="mr-2 h-4 w-4" />
            {show ? `$ ${new Intl.NumberFormat('es-CO').format(parseFloat(balance))}` : 'Ver saldo'}
        </Button>
    );
}

export default function BankIndex({ accounts, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            '/banks',
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Bancos', href: '/banks' }]}>
            <Head title="Bancos" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Bancos</h1>
                    </div>
                    <Link href="/banks/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Banco
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <span className="font-medium">10</span>
                        <span className="text-sm text-muted-foreground">Registros por página</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Buscar:</span>
                        <Input
                            className="w-64"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre de la Cuenta</TableHead>
                                    <TableHead>Número de la Cuenta</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Saldo</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.data.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="font-medium">{account.name}</TableCell>
                                        <TableCell>{account.account_number || '-'}</TableCell>
                                        <TableCell>{account.description || '-'}</TableCell>
                                        <TableCell>{account.initial_balance}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <BalanceRevealer balance={account.initial_balance} />
                                                <Link href={`/banks/${account.id}/transactions`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 border-green-600 hover:bg-green-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/banks/${account.id}/edit`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 border-green-600 hover:bg-green-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {accounts.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No se encontraron bancos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Mostrando páginas 1 de 1
                    </span>
                    {/* Add Pagination Links Here if needed */}
                </div>
            </div>
        </AppLayout>
    );
}
