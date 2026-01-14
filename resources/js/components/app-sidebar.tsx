import { Link } from '@inertiajs/react';
import { BookOpen, Folder, Landmark, LayoutGrid, Package, ReceiptText, ShoppingCart, Truck, Users } from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as contacts } from '@/routes/contacts';
import banks from '@/routes/banks';
import { index as productsIndex } from '@/routes/products';
import { index as warehousesIndex } from '@/routes/warehouses';
import { index as priceListsIndex } from '@/routes/price-lists';
import { index as adjustmentsIndex } from '@/routes/adjustments';
import { index as transfersIndex } from '@/routes/transfers';
import vouchers from '@/routes/vouchers';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Bancos',
        icon: Landmark,
        items: [
            {
                title: 'Cuentas',
                href: banks.index(),
                icon: Landmark,
            },
            {
                title: 'Nuevo banco',
                href: banks.create(),
                icon: Landmark,
            },
        ],
    },
    {
        title: 'Inventario',
        icon: Package,
        items: [
            {
                title: 'Items en venta',
                href: productsIndex(),
                icon: Package,
            },
            {
                title: 'Bodegas',
                href: warehousesIndex(),
                icon: Package,
            },
            {
                title: 'Listas de precio',
                href: priceListsIndex(),
                icon: Package,
            },
            {
                title: 'Ajustes de inventario',
                href: adjustmentsIndex(),
                icon: Package,
            },
            {
                title: 'Transferencias de bodegas',
                href: transfersIndex(),
                icon: Package,
            },
        ],
    },
    {
        title: 'Comprobantes',
        icon: ReceiptText,
        items: [
            {
                title: 'Todos los comprobantes',
                href: vouchers.index(),
                icon: ReceiptText,
            },
            {
                title: 'Nuevo comprobante',
                href: vouchers.create(),
                icon: ReceiptText,
            },
        ],
    },
    {
        title: 'Contactos',
        icon: Users,
        items: [
            {
                title: 'Todos los contactos',
                href: contacts(),
                icon: Users,
            },
            {
                title: 'Solo clientes',
                href: contacts({ query: { type: 'customer' } }),
                icon: ShoppingCart,
            },
            {
                title: 'Solo proveedores',
                href: contacts({ query: { type: 'supplier' } }),
                icon: Truck,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
