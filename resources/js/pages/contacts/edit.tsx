import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    Contact,
    ContactAddressFormData,
    ContactFormData,
    ContactFormPageProps,
    ContactPersonFormData,
    Department,
    City,
} from '@/types/contact';

export default function ContactEdit({
    contact,
    identificationTypes,
    countries,
    priceLists,
    sellers,
}: ContactFormPageProps & { contact: Contact }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contactos', href: '/contacts' },
        { title: contact.name, href: `/contacts/${contact.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm<ContactFormData>({
        identification_type: contact.identification_type,
        identification_number: contact.identification_number,
        name: contact.name,
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        phone2: contact.phone2 ?? '',
        fax: contact.fax ?? '',
        cellphone: contact.cellphone ?? '',
        is_customer: contact.is_customer,
        is_supplier: contact.is_supplier,
        contact_category: contact.contact_category ?? '',
        credit_term: contact.credit_term?.toString() ?? '',
        credit_limit: contact.credit_limit?.toString() ?? '',
        ecommerce_discount: contact.ecommerce_discount?.toString() ?? '',
        price_list_id: contact.price_list_id?.toString() ?? '',
        seller_id: contact.seller_id?.toString() ?? '',
        observations: contact.observations ?? '',
        addresses: contact.addresses.map((a) => ({
            id: a.id,
            country_id: a.country_id.toString(),
            department_id: a.department_id?.toString() ?? '',
            city_id: a.city_id?.toString() ?? '',
            address: a.address,
            postal_code: a.postal_code ?? '',
            is_primary: a.is_primary,
        })),
        persons: contact.persons.map((p) => ({
            id: p.id,
            name: p.name,
            email: p.email ?? '',
            phone: p.phone ?? '',
            cellphone: p.cellphone ?? '',
            receives_notifications: p.receives_notifications,
        })),
    });

    const [phoneCode, setPhoneCode] = useState('+57');
    const [departmentsByCountry, setDepartmentsByCountry] = useState<Record<number, Department[]>>({});
    const [citiesByDepartment, setCitiesByDepartment] = useState<Record<number, City[]>>({});

    // Load initial departments and cities for existing addresses
    useEffect(() => {
        const loadGeoData = async () => {
            for (const address of contact.addresses) {
                if (address.country_id) {
                    const deptResponse = await fetch(`/api/departments/${address.country_id}`);
                    const departments = await deptResponse.json();
                    setDepartmentsByCountry((prev) => ({ ...prev, [address.country_id]: departments }));

                    if (address.department_id) {
                        const cityResponse = await fetch(`/api/cities/${address.department_id}`);
                        const cities = await cityResponse.json();
                        setCitiesByDepartment((prev) => ({ ...prev, [address.department_id!]: cities }));
                    }
                }
            }
        };
        loadGeoData();
    }, [contact.addresses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/contacts/${contact.id}`);
    };

    const handleCountryChange = async (countryId: string, addressIndex: number) => {
        const country = countries.find((c) => c.id === Number(countryId));
        if (country) setPhoneCode(country.phone_code);

        if (countryId && !departmentsByCountry[Number(countryId)]) {
            const response = await fetch(`/api/departments/${countryId}`);
            const departments = await response.json();
            setDepartmentsByCountry((prev) => ({ ...prev, [Number(countryId)]: departments }));
        }

        const newAddresses = [...data.addresses];
        newAddresses[addressIndex] = {
            ...newAddresses[addressIndex],
            country_id: countryId,
            department_id: '',
            city_id: '',
        };
        setData('addresses', newAddresses);
    };

    const handleDepartmentChange = async (departmentId: string, addressIndex: number) => {
        if (departmentId && !citiesByDepartment[Number(departmentId)]) {
            const response = await fetch(`/api/cities/${departmentId}`);
            const cities = await response.json();
            setCitiesByDepartment((prev) => ({ ...prev, [Number(departmentId)]: cities }));
        }

        const newAddresses = [...data.addresses];
        newAddresses[addressIndex] = {
            ...newAddresses[addressIndex],
            department_id: departmentId,
            city_id: '',
        };
        setData('addresses', newAddresses);
    };

    const addAddress = () => {
        setData('addresses', [
            ...data.addresses,
            { country_id: '', department_id: '', city_id: '', address: '', postal_code: '', is_primary: false },
        ]);
    };

    const removeAddress = (index: number) => {
        const address = data.addresses[index];
        if (address.id) {
            const newAddresses = [...data.addresses];
            newAddresses[index] = { ...newAddresses[index], _delete: true };
            setData('addresses', newAddresses);
        } else {
            setData('addresses', data.addresses.filter((_, i) => i !== index));
        }
    };

    const addPerson = () => {
        setData('persons', [
            ...data.persons,
            { name: '', email: '', phone: '', cellphone: '', receives_notifications: true },
        ]);
    };

    const removePerson = (index: number) => {
        const person = data.persons[index];
        if (person.id) {
            const newPersons = [...data.persons];
            newPersons[index] = { ...newPersons[index], _delete: true };
            setData('persons', newPersons);
        } else {
            setData('persons', data.persons.filter((_, i) => i !== index));
        }
    };

    const updateAddress = (index: number, field: keyof ContactAddressFormData, value: string | boolean) => {
        const newAddresses = [...data.addresses];
        newAddresses[index] = { ...newAddresses[index], [field]: value };
        setData('addresses', newAddresses);
    };

    const updatePerson = (index: number, field: keyof ContactPersonFormData, value: string | boolean) => {
        const newPersons = [...data.persons];
        newPersons[index] = { ...newPersons[index], [field]: value };
        setData('persons', newPersons);
    };

    const handleDelete = () => {
        if (confirm('¿Está seguro de eliminar este contacto?')) {
            router.delete(`/contacts/${contact.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${contact.name}`} />

            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" onClick={() => router.get('/contacts')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <h1 className="text-2xl font-bold">{contact.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="identification_type">Tipo de Identificación *</Label>
                                    <Select
                                        value={data.identification_type}
                                        onValueChange={(v) => setData('identification_type', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(identificationTypes).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.identification_type && (
                                        <p className="text-sm text-destructive">{errors.identification_type}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="identification_number">Identificación *</Label>
                                    <Input
                                        id="identification_number"
                                        value={data.identification_number}
                                        onChange={(e) => setData('identification_number', e.target.value)}
                                    />
                                    {errors.identification_number && (
                                        <p className="text-sm text-destructive">{errors.identification_number}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Contacto *</Label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_customer"
                                                checked={data.is_customer}
                                                onCheckedChange={(checked) => setData('is_customer', checked === true)}
                                            />
                                            <Label htmlFor="is_customer" className="font-normal">Cliente</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_supplier"
                                                checked={data.is_supplier}
                                                onCheckedChange={(checked) => setData('is_supplier', checked === true)}
                                            />
                                            <Label htmlFor="is_supplier" className="font-normal">Proveedor</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_category">Tipo de Empresa</Label>
                                    <Input
                                        id="contact_category"
                                        value={data.contact_category}
                                        onChange={(e) => setData('contact_category', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <div className="flex gap-2">
                                        <div className="w-20 shrink-0">
                                            <Input value={phoneCode} readOnly className="text-center" />
                                        </div>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cellphone">Celular</Label>
                                    <div className="flex gap-2">
                                        <div className="w-20 shrink-0">
                                            <Input value={phoneCode} readOnly className="text-center" />
                                        </div>
                                        <Input
                                            id="cellphone"
                                            value={data.cellphone}
                                            onChange={(e) => setData('cellphone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Commercial Conditions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Condiciones Comerciales</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price_list_id">Lista de Precios</Label>
                                    <Select
                                        value={data.price_list_id}
                                        onValueChange={(v) => setData('price_list_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="General" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priceLists.map((pl) => (
                                                <SelectItem key={pl.id} value={String(pl.id)}>{pl.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seller_id">Vendedor</Label>
                                    <Select
                                        value={data.seller_id}
                                        onValueChange={(v) => setData('seller_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sellers.map((seller) => (
                                                <SelectItem key={seller.id} value={String(seller.id)}>{seller.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="credit_term">Plazo Crédito (días)</Label>
                                    <Input
                                        id="credit_term"
                                        type="number"
                                        min="0"
                                        value={data.credit_term}
                                        onChange={(e) => setData('credit_term', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="credit_limit">Cupo Crédito</Label>
                                    <Input
                                        id="credit_limit"
                                        type="number"
                                        min="0"
                                        value={data.credit_limit}
                                        onChange={(e) => setData('credit_limit', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ecommerce_discount">Descuento E-commerce (%)</Label>
                                    <Input
                                        id="ecommerce_discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.ecommerce_discount}
                                        onChange={(e) => setData('ecommerce_discount', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observations">Observaciones</Label>
                                <Textarea
                                    id="observations"
                                    rows={3}
                                    value={data.observations}
                                    onChange={(e) => setData('observations', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Direcciones</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addAddress}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data.addresses.filter((a) => !a._delete).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No hay direcciones.</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.addresses.map((address, index) =>
                                        address._delete ? null : (
                                            <div key={address.id ?? index} className="rounded-lg border p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={address.is_primary}
                                                            onCheckedChange={(checked) =>
                                                                updateAddress(index, 'is_primary', checked === true)
                                                            }
                                                        />
                                                        <Label className="font-normal">Principal</Label>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAddress(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <Select
                                                        value={address.country_id}
                                                        onValueChange={(v) => handleCountryChange(v, index)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="País" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((country) => (
                                                                <SelectItem key={country.id} value={String(country.id)}>
                                                                    {country.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select
                                                        value={address.department_id}
                                                        onValueChange={(v) => handleDepartmentChange(v, index)}
                                                        disabled={!address.country_id}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Departamento" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(departmentsByCountry[Number(address.country_id)] ?? []).map((dept) => (
                                                                <SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select
                                                        value={address.city_id}
                                                        onValueChange={(v) => updateAddress(index, 'city_id', v)}
                                                        disabled={!address.department_id}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Ciudad" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(citiesByDepartment[Number(address.department_id)] ?? []).map((city) => (
                                                                <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4">
                                                    <div className="col-span-3">
                                                        <Input
                                                            placeholder="Dirección"
                                                            value={address.address}
                                                            onChange={(e) => updateAddress(index, 'address', e.target.value)}
                                                        />
                                                    </div>
                                                    <Input
                                                        placeholder="Código Postal"
                                                        value={address.postal_code}
                                                        onChange={(e) => updateAddress(index, 'postal_code', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Associated Persons */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Personas Asociadas</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addPerson}>
                            <Plus className="mr-2 h-4 w-4" />
                            Asociar Persona
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {data.persons.filter((p) => !p._delete).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay personas asociadas.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre y Apellido</TableHead>
                                        <TableHead>Correo Electrónico</TableHead>
                                        <TableHead>Teléfono</TableHead>
                                        <TableHead>Celular</TableHead>
                                        <TableHead className="text-center">Enviar Notificaciones</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.persons.map((person, index) =>
                                        person._delete ? null : (
                                            <TableRow key={person.id ?? index}>
                                                <TableCell>
                                                    <Input
                                                        value={person.name}
                                                        onChange={(e) => updatePerson(index, 'name', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="email"
                                                        value={person.email}
                                                        onChange={(e) => updatePerson(index, 'email', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={person.phone}
                                                        onChange={(e) => updatePerson(index, 'phone', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={person.cellphone}
                                                        onChange={(e) => updatePerson(index, 'cellphone', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Switch
                                                        checked={person.receives_notifications}
                                                        onCheckedChange={(checked) => updatePerson(index, 'receives_notifications', checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removePerson(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.get('/contacts')}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
