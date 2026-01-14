import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Eye,
    Pencil,
    Plus,
    Search,
    Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Contact, ContactsPageProps } from '@/types/contact';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contactos', href: '/contacts' },
];

export default function ContactsIndex({
    contacts,
    filters,
    categories,
    sellers,
}: ContactsPageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            // Debounce search
            const timeoutId = setTimeout(() => {
                router.get(
                    '/contacts',
                    { ...filters, search: value },
                    { preserveState: true, replace: true }
                );
            }, 300);
            return () => clearTimeout(timeoutId);
        },
        [filters]
    );

    const handleSort = (column: string) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/contacts',
            { ...filters, sort: column, direction },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/contacts',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort !== column) return null;
        return filters.direction === 'asc' ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">Contactos</h1>
                        <span className="text-sm text-muted-foreground">
                            ({contacts.data.length} de {contacts.meta?.total ?? contacts.data.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/contacts/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear contacto
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, NIT, correo o teléfono..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select
                        value={filters.type ?? 'all'}
                        onValueChange={(v) => handleFilter('type', v)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="customer">Clientes</SelectItem>
                            <SelectItem value="supplier">Proveedores</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.category ?? 'all'}
                        onValueChange={(v) => handleFilter('category', v)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.seller_id ?? 'all'}
                        onValueChange={(v) => handleFilter('seller_id', v)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Vendedor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {sellers.map((seller) => (
                                <SelectItem key={seller.id} value={String(seller.id)}>
                                    {seller.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.per_page ?? '25'}
                        onValueChange={(v) => handleFilter('per_page', v)}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Nombre <SortIcon column="name" />
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort('identification_number')}
                                >
                                    Identificación <SortIcon column="identification_number" />
                                </TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Tipo Empresa</TableHead>
                                <TableHead>Tipo Contacto</TableHead>
                                <TableHead>Vendedor</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.data.map((contact: Contact) => (
                                <TableRow
                                    key={contact.id}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>
                                        {contact.identification_type} {contact.identification_number}
                                    </TableCell>
                                    <TableCell>{contact.phone ?? contact.cellphone ?? '-'}</TableCell>
                                    <TableCell>{contact.email ?? '-'}</TableCell>
                                    <TableCell>{contact.contact_category ?? '-'}</TableCell>
                                    <TableCell>
                                        {contact.is_customer && contact.is_supplier
                                            ? 'Cliente/Proveedor'
                                            : contact.is_customer
                                                ? 'Cliente'
                                                : contact.is_supplier
                                                    ? 'Proveedor'
                                                    : '-'}
                                    </TableCell>
                                    <TableCell>{contact.seller?.name ?? '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.get(`/contacts/${contact.id}`);
                                                }}
                                                title="Ver contacto"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.get(`/contacts/${contact.id}/edit`);
                                                }}
                                                title="Editar contacto"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {contacts.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No se encontraron contactos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {contacts.links && contacts.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {contacts.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
