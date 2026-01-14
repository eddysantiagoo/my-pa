import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Tag { id: number; name: string; color: string | null; }

interface Props { tags: { data: Tag[]; links: any[] }; filters: { search?: string }; }

export default function TagsIndex({ tags, filters }: Props) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/configuration/tags', { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta etiqueta?')) { router.delete(`/configuration/tags/${id}`); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración', href: '/configuration' }, { title: 'Etiquetas', href: '#' }]}>
            <Head title="Etiquetas" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Etiquetas</h1>
                    <Link href="/configuration/tags/create"><Button><Plus className="mr-2 h-4 w-4" /> Nueva</Button></Link>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input className="w-64" defaultValue={filters.search || ''} onChange={handleSearch} placeholder="Nombre..." />
                </div>
                <Card><CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Color</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {tags.data.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.name}</TableCell>
                                    <TableCell>
                                        {tag.color ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }}></span>{tag.color}</span> : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/configuration/tags/${tag.id}/edit`}><Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(tag.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tags.data.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No se encontraron etiquetas.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent></Card>
            </div>
        </AppLayout>
    );
}
