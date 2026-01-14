import { User } from '.';

export interface Contact {
    id: number;
    identification_type: 'CC' | 'NIT' | 'DIE' | 'CE' | 'PP';
    identification_number: string;
    name: string;
    email: string | null;
    phone: string | null;
    phone2: string | null;
    fax: string | null;
    cellphone: string | null;
    is_customer: boolean;
    is_supplier: boolean;
    contact_category: string | null;
    credit_term: number | null;
    credit_limit: number | null;
    ecommerce_discount: number | null;
    price_list_id: number | null;
    seller_id: number | null;
    observations: string | null;
    seller?: Pick<User, 'id' | 'name'>;
    price_list?: PriceList;
    addresses: ContactAddress[];
    persons: ContactPerson[];
    documents: ContactDocument[];
    created_at: string;
    updated_at: string;
}

export interface ContactAddress {
    id: number;
    contact_id: number;
    country_id: number;
    department_id: number | null;
    city_id: number | null;
    address: string;
    postal_code: string | null;
    is_primary: boolean;
    country?: Country;
    department?: Department;
    city?: City;
    full_address?: string;
}

export interface ContactPerson {
    id: number;
    contact_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    cellphone: string | null;
    receives_notifications: boolean;
}

export interface ContactDocument {
    id: number;
    contact_id: number;
    document_type: string;
    disk: string;
    file_path: string;
    original_name: string;
    mime_type: string | null;
    size: number | null;
    url: string;
}

export interface ContactObservation {
    id: number;
    contact_id: number;
    user_id: number;
    content: string;
    user?: Pick<User, 'id' | 'name'>;
    created_at: string;
}

export interface TemporaryContact {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    status: 'incomplete' | 'converted' | 'discarded';
    converted_to: number | null;
    created_at: string;
    updated_at: string;
}

export interface Country {
    id: number;
    code: string;
    name: string;
    phone_code: string;
}

export interface Department {
    id: number;
    country_id: number;
    code: string;
    name: string;
}

export interface City {
    id: number;
    department_id: number;
    code: string | null;
    name: string;
}

export interface PriceList {
    id: number;
    code: string;
    name: string;
    description: string | null;
    markup_percentage: number;
    is_default: boolean;
    is_active: boolean;
}

export interface ContactFormData {
    identification_type: string;
    identification_number: string;
    name: string;
    email: string;
    phone: string;
    phone2: string;
    fax: string;
    cellphone: string;
    is_customer: boolean;
    is_supplier: boolean;
    contact_category: string;
    credit_term: string;
    credit_limit: string;
    ecommerce_discount: string;
    price_list_id: string;
    seller_id: string;
    observations: string;
    addresses: ContactAddressFormData[];
    persons: ContactPersonFormData[];
}

export interface ContactAddressFormData {
    id?: number;
    country_id: string;
    department_id: string;
    city_id: string;
    address: string;
    postal_code: string;
    is_primary: boolean;
    _delete?: boolean;
}

export interface ContactPersonFormData {
    id?: number;
    name: string;
    email: string;
    phone: string;
    cellphone: string;
    receives_notifications: boolean;
    _delete?: boolean;
}

export type IdentificationTypes = Record<string, string>;

export interface ContactsPageProps {
    contacts: {
        data: Contact[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        type?: string;
        category?: string;
        seller_id?: string;
        sort?: string;
        direction?: string;
        per_page?: string;
    };
    categories: string[];
    sellers: Pick<User, 'id' | 'name'>[];
}

export interface ContactFormPageProps {
    contact?: Contact;
    identificationTypes: IdentificationTypes;
    countries: Country[];
    priceLists: PriceList[];
    sellers: Pick<User, 'id' | 'name'>[];
}
