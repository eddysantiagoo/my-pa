<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => ['required', 'string', 'max:255', Rule::unique('products')->ignore($this->route('product'))],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
            'is_public' => ['boolean'],
            'is_inventariable' => ['boolean'],
            'is_rotative' => ['boolean'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'unit_of_measure' => ['nullable', 'string', 'max:50'],
            'stock' => ['nullable', 'numeric', 'min:0'],
            'stock_min' => ['nullable', 'integer', 'min:0'],
            'stock_max' => ['nullable', 'integer', 'min:0'],

            // Complex fields
            'aliases' => ['nullable', 'array'],
            'aliases.*.alias' => ['required', 'string', 'max:255'],
            'aliases.*.description' => ['nullable', 'string'],
            'aliases.*.is_main' => ['boolean'],

            'applications' => ['nullable', 'array'],
            'applications.*' => ['exists:applications,id'],

            'storage_locations' => ['nullable', 'array'],
            'storage_locations.*.warehouse_id' => ['required', 'exists:warehouses,id'],
            'storage_locations.*.location_name' => ['required', 'string', 'max:255'],
        ];
    }
}
