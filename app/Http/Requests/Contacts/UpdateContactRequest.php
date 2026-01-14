<?php

namespace App\Http\Requests\Contacts;

use App\Models\Contact;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $contactId = $this->route('contact')?->id ?? $this->route('contact');

        return [
            'identification_type' => ['required', Rule::in(array_keys(Contact::IDENTIFICATION_TYPES))],
            'identification_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('contacts', 'identification_number')->ignore($contactId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'phone2' => ['nullable', 'string', 'max:30'],
            'fax' => ['nullable', 'string', 'max:30'],
            'cellphone' => ['nullable', 'string', 'max:30'],
            'is_customer' => ['boolean'],
            'is_supplier' => ['boolean'],
            'contact_category' => ['nullable', 'string', 'max:100'],
            'credit_term' => ['nullable', 'integer', 'min:0', 'max:365'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'ecommerce_discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'price_list_id' => ['nullable', 'exists:price_lists,id'],
            'seller_id' => ['nullable', 'exists:users,id'],
            'observations' => ['nullable', 'string', 'max:5000'],

            // Addresses
            'addresses' => ['nullable', 'array'],
            'addresses.*.id' => ['nullable', 'exists:contact_addresses,id'],
            'addresses.*.country_id' => ['required_with:addresses', 'exists:countries,id'],
            'addresses.*.department_id' => ['nullable', 'exists:departments,id'],
            'addresses.*.city_id' => ['nullable', 'exists:cities,id'],
            'addresses.*.address' => ['required_with:addresses', 'string', 'max:500'],
            'addresses.*.postal_code' => ['nullable', 'string', 'max:20'],
            'addresses.*.is_primary' => ['boolean'],
            'addresses.*._delete' => ['boolean'],

            // Persons
            'persons' => ['nullable', 'array'],
            'persons.*.id' => ['nullable', 'exists:contact_persons,id'],
            'persons.*.name' => ['required_with:persons', 'string', 'max:255'],
            'persons.*.email' => ['nullable', 'email', 'max:255'],
            'persons.*.phone' => ['nullable', 'string', 'max:30'],
            'persons.*.cellphone' => ['nullable', 'string', 'max:30'],
            'persons.*.receives_notifications' => ['boolean'],
            'persons.*._delete' => ['boolean'],
        ];
    }
}
