<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contacts\StoreContactRequest;
use App\Http\Requests\Contacts\UpdateContactRequest;
use App\Models\Contact;
use App\Models\Country;
use App\Models\PriceList;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $contacts = Contact::query()
            ->with(['seller:id,name', 'priceList:id,name'])
            ->search($request->search)
            ->when($request->type === 'customer', fn ($q) => $q->customers())
            ->when($request->type === 'supplier', fn ($q) => $q->suppliers())
            ->when($request->category, fn ($q) => $q->where('contact_category', $request->category))
            ->when($request->seller_id, fn ($q) => $q->where('seller_id', $request->seller_id))
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc')
            ->paginate($request->per_page ?? 25)
            ->withQueryString();

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'type', 'category', 'seller_id', 'sort', 'direction', 'per_page']),
            'categories' => Contact::distinct()->pluck('contact_category')->filter()->values(),
            'sellers' => User::whereHas('roles', fn ($q) => $q->whereHas('roleType', fn ($q) => $q->where('code', 'SELLER')))
                ->select('id', 'name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('contacts/create', $this->getFormData());
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $contact = Contact::create(collect($validated)->except(['addresses', 'persons'])->toArray());

            // Create addresses
            if (! empty($validated['addresses'])) {
                foreach ($validated['addresses'] as $addressData) {
                    $contact->addresses()->create($addressData);
                }
            }

            // Create persons
            if (! empty($validated['persons'])) {
                foreach ($validated['persons'] as $personData) {
                    $contact->persons()->create($personData);
                }
            }
        });

        return redirect()->route('contacts.index')->with('success', 'Contacto creado exitosamente.');
    }

    public function show(Contact $contact): Response
    {
        $contact->load([
            'addresses.country',
            'addresses.department',
            'addresses.city',
            'persons',
            'documents',
            'observations.user:id,name',
            'seller:id,name',
            'priceList:id,name,code',
        ]);

        return Inertia::render('contacts/show', [
            'contact' => $contact,
        ]);
    }

    public function edit(Contact $contact): Response
    {
        $contact->load([
            'addresses.country',
            'addresses.department',
            'addresses.city',
            'persons',
            'documents',
        ]);

        return Inertia::render('contacts/edit', array_merge(
            ['contact' => $contact],
            $this->getFormData()
        ));
    }

    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $contact) {
            $contact->update(collect($validated)->except(['addresses', 'persons'])->toArray());

            // Sync addresses
            if (isset($validated['addresses'])) {
                $existingIds = [];
                foreach ($validated['addresses'] as $addressData) {
                    if (! empty($addressData['_delete']) && ! empty($addressData['id'])) {
                        $contact->addresses()->where('id', $addressData['id'])->delete();
                        continue;
                    }

                    if (! empty($addressData['id'])) {
                        $contact->addresses()->where('id', $addressData['id'])->update($addressData);
                        $existingIds[] = $addressData['id'];
                    } else {
                        $newAddress = $contact->addresses()->create($addressData);
                        $existingIds[] = $newAddress->id;
                    }
                }
            }

            // Sync persons
            if (isset($validated['persons'])) {
                foreach ($validated['persons'] as $personData) {
                    if (! empty($personData['_delete']) && ! empty($personData['id'])) {
                        $contact->persons()->where('id', $personData['id'])->delete();
                        continue;
                    }

                    if (! empty($personData['id'])) {
                        $contact->persons()->where('id', $personData['id'])->update($personData);
                    } else {
                        $contact->persons()->create($personData);
                    }
                }
            }
        });

        return redirect()->route('contacts.index')->with('success', 'Contacto actualizado exitosamente.');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return redirect()->route('contacts.index')->with('success', 'Contacto eliminado exitosamente.');
    }

    /**
     * Get common form data for create/edit views.
     */
    private function getFormData(): array
    {
        return [
            'identificationTypes' => Contact::IDENTIFICATION_TYPES,
            'countries' => Country::select('id', 'name', 'phone_code', 'code')->orderBy('name')->get(),
            'priceLists' => PriceList::where('is_active', true)->select('id', 'name', 'code')->get(),
            'sellers' => User::whereHas('roles', fn ($q) => $q->whereHas('roleType', fn ($q) => $q->where('code', 'SELLER')))
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ];
    }
}
