<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Models\TemporaryContact;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemporaryContactController extends Controller
{
    public function index(Request $request): Response
    {
        $temporaryContacts = TemporaryContact::query()
            ->search($request->search)
            ->incomplete()
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate($request->per_page ?? 25)
            ->withQueryString();

        return Inertia::render('contacts/temporary/index', [
            'temporaryContacts' => $temporaryContacts,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        TemporaryContact::create($validated);

        return back()->with('success', 'Contacto temporal creado exitosamente.');
    }

    public function update(Request $request, TemporaryContact $temporaryContact): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $temporaryContact->update($validated);

        return back()->with('success', 'Contacto temporal actualizado.');
    }

    public function destroy(TemporaryContact $temporaryContact): RedirectResponse
    {
        $temporaryContact->update(['status' => TemporaryContact::STATUS_DISCARDED]);
        $temporaryContact->delete();

        return back()->with('success', 'Contacto temporal eliminado.');
    }

    public function convert(Request $request, TemporaryContact $temporaryContact): RedirectResponse
    {
        $validated = $request->validate([
            'identification_type' => ['required', 'string'],
            'identification_number' => ['required', 'string', 'unique:contacts,identification_number'],
            'is_customer' => ['boolean'],
            'is_supplier' => ['boolean'],
        ]);

        $contact = $temporaryContact->convertToContact($validated);

        return redirect()->route('contacts.edit', $contact)
            ->with('success', 'Contacto convertido exitosamente.');
    }
}
