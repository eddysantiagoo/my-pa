import { Head, router, useForm } from '@inertiajs/react';
import { ArrowRightLeft, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { TemporaryContact } from '@/types/contact';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contactos', href: '/contacts' },
    { title: 'Contactos Temporales', href: '/temporary-contacts' },
];

interface Props {
    temporaryContacts: {
        data: TemporaryContact[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
    };
}

export default function TemporaryContactsIndex({ temporaryContacts, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<TemporaryContact | null>(null);

    const createForm = useForm({
        name: '',
        phone: '',
        email: '',
    });

    const convertForm = useForm({
        identification_type: 'CC',
        identification_number: '',
        is_customer: true,
        is_supplier: false,
    });

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            const timeoutId = setTimeout(() => {
                router.get(
                    '/temporary-contacts',
                    { ...filters, search: value },
                    { preserveState: true, replace: true }
                );
            }, 300);
            return () => clearTimeout(timeoutId);
        },
        [filters]
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/temporary-contacts', {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContact) return;
        convertForm.post(`/temporary-contacts/${selectedContact.id}/convert`, {
            onSuccess: () => {
                setShowConvertModal(false);
                convertForm.reset();
            },
        });
    };

    const handleDelete = (contact: TemporaryContact) => {
        if (confirm('¿Está seguro de eliminar este contacto temporal?')) {
            router.delete(`/temporary-contacts/${contact.id}`);
        }
    };

    const openConvertModal = (contact: TemporaryContact) => {
        setSelectedContact(contact);
        setShowConvertModal(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos Temporales" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserPlus className="h-6 w-6 text-orange-500" />
                        <h1 className="text-2xl font-bold">Contactos Temporales</h1>
                        <span className="text-sm text-muted-foreground">
                            (Prospectos sin completar)
                        </span>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Prospecto
                    </Button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, teléfono o correo..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha de Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {temporaryContacts.data.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                    <TableCell>{contact.email ?? '-'}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            Incompleto
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(contact.created_at).toLocaleDateString('es-CO')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openConvertModal(contact)}
                                            >
                                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                                Convertir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(contact)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {temporaryContacts.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No hay contactos temporales.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {temporaryContacts.links && temporaryContacts.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {temporaryContacts.links.map((link, index) => (
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

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nuevo Prospecto</DialogTitle>
                        <DialogDescription>
                            Registre un contacto rápido con información mínima.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono *</Label>
                                <Input
                                    id="phone"
                                    value={createForm.data.phone}
                                    onChange={(e) => createForm.setData('phone', e.target.value)}
                                />
                                {createForm.errors.phone && (
                                    <p className="text-sm text-destructive">{createForm.errors.phone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo (opcional)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Convert Modal */}
            <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convertir a Contacto Formal</DialogTitle>
                        <DialogDescription>
                            Complete los datos requeridos para convertir "{selectedContact?.name}" en un contacto formal.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConvert}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="identification_type">Tipo de Identificación *</Label>
                                <Select
                                    value={convertForm.data.identification_type}
                                    onValueChange={(v) => convertForm.setData('identification_type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                        <SelectItem value="NIT">NIT</SelectItem>
                                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                        <SelectItem value="PP">Pasaporte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="identification_number">Número de Identificación *</Label>
                                <Input
                                    id="identification_number"
                                    value={convertForm.data.identification_number}
                                    onChange={(e) => convertForm.setData('identification_number', e.target.value)}
                                />
                                {convertForm.errors.identification_number && (
                                    <p className="text-sm text-destructive">
                                        {convertForm.errors.identification_number}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowConvertModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={convertForm.processing}>
                                Convertir
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
