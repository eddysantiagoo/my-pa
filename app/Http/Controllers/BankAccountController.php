<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    public function index()
    {
        $accounts = \App\Models\BankAccount::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('account_number', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return inertia('Banks/Index', [
            'accounts' => $accounts,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        return inertia('Banks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'type' => 'required|in:Efectivo,Corriente,Ahorros',
            'initial_balance' => 'required|numeric',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date', // For initial balance date? Images show "Fecha"
        ]);

        $account = \App\Models\BankAccount::create($validated);

        return redirect()->route('banks.index')->with('success', 'Cuenta creada exitosamente.');
    }

    public function show(\App\Models\BankAccount $bank)
    {
        return redirect()->route('banks.transactions.index', $bank);
    }

    public function edit(\App\Models\BankAccount $bank)
    {
        return inertia('Banks/Edit', [
            'bank' => $bank
        ]);
    }

    public function update(Request $request, \App\Models\BankAccount $bank)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'type' => 'required|in:Efectivo,Corriente,Ahorros',
            'initial_balance' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $bank->update($validated);

        return redirect()->route('banks.index')->with('success', 'Cuenta actualizada exitosamente.');
    }

    public function destroy(\App\Models\BankAccount $bank)
    {
        $bank->delete();
        return redirect()->route('banks.index')->with('success', 'Cuenta eliminada exitosamente.');
    }
}


