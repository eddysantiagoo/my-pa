import { Head, Link, router } from '@inertiajs/react';
import { Plus, Minus, ArrowRightLeft, ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    description: string | null;
    initial_balance: string;
    // Calculate current balance based on transactions if needed, or pass it from backend
}

interface Transaction {
    id: number;
    transaction_date: string;
    description: string | null;
    beneficiary: string | null;
    booking_text?: string | null; // Optional field for booking text
    category: string | null;
    amount: string;
    type: 'income' | 'expense';
    status: string;
    created_at: string;
}

interface Props {
    bank: BankAccount;
    transactions: {
        data: Transaction[];
        links: any[];
    };
    filters: {
        search: string;
    };
}

export default function BankShow({ bank, transactions, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            `/banks/${bank.id}/transactions`,
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    // Calculate balance logic would normally be on backend. For now showing initial_balance
    // In a real app, $bank->balance attribute should be computed.

    return (
        <AppLayout breadcrumbs={[
            { title: 'Bancos', href: '/banks' },
            { title: bank.name, href: '#' }
        ]}>
            <Head title={`Banco - ${bank.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Banco</h1>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {bank.name}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex gap-2">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Dinero
                        </Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            <Minus className="mr-2 h-4 w-4" /> Retirar Dinero
                        </Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            <ArrowRightLeft className="mr-2 h-4 w-4" /> Transferir
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-indigo-900 hover:bg-indigo-800 text-white">
                                    Más acciones <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Conciliar</DropdownMenuItem>
                                <DropdownMenuItem>Reportes</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            Ir a Pagos
                        </Button>
                        <div className="border border-border px-4 py-2 rounded flex gap-2 items-center bg-card">
                            <span className="font-bold text-muted-foreground">Saldo</span>
                            {/* Display formatted balance */}
                            <span className={`font-bold text-lg ${parseFloat(bank.initial_balance) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                ${new Intl.NumberFormat('es-CO').format(parseFloat(bank.initial_balance))}
                            </span>
                        </div>
                    </div>
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
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Beneficiario</TableHead>
                                    <TableHead>Conciliado</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Salida</TableHead>
                                    <TableHead>Entrada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs hover:bg-primary/90">
                                                    +
                                                </Button>
                                                {tx.transaction_date}
                                            </div>
                                        </TableCell>
                                        <TableCell>{tx.booking_text || tx.description || '-'}</TableCell> {/* beneficiary? */}
                                        <TableCell>{tx.status === 'conciliated' ? 'Si' : 'No'}</TableCell>
                                        <TableCell>{tx.category || '-'}</TableCell>
                                        <TableCell>{tx.status}</TableCell>
                                        <TableCell className="text-right">
                                            {tx.type === 'expense' ? `$${new Intl.NumberFormat('es-CO').format(parseFloat(tx.amount))}` : ''}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {tx.type === 'income' ? `$${new Intl.NumberFormat('es-CO').format(parseFloat(tx.amount))}` : ''}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {transactions.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No se encontraron transacciones.
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
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm">Anterior</Button>
                        <Button variant="secondary" size="sm">1</Button>
                        <Button variant="outline" size="sm">Siguiente</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
