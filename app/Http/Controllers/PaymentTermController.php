<?php

namespace App\Http\Controllers;

use App\Models\PaymentTerm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentTermController extends Controller
{
    public function index(Request $request)
    {
        $terms = PaymentTerm::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/PaymentTerms/Index', [
            'terms' => $terms,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/PaymentTerms/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        PaymentTerm::create($validated);

        return redirect('/configuration/payment-terms')->with('success', 'Término de pago creado.');
    }

    public function edit(PaymentTerm $paymentTerm)
    {
        return Inertia::render('Configuration/PaymentTerms/Edit', [
            'term' => $paymentTerm,
        ]);
    }

    public function update(Request $request, PaymentTerm $paymentTerm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $paymentTerm->update($validated);

        return redirect('/configuration/payment-terms')->with('success', 'Término de pago actualizado.');
    }

    public function destroy(PaymentTerm $paymentTerm)
    {
        $paymentTerm->delete();

        return redirect('/configuration/payment-terms')->with('success', 'Término de pago eliminado.');
    }
}
