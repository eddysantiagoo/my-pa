<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BankTransactionController extends Controller
{
    public function index(\App\Models\BankAccount $bank)
    {
        $query = $bank->transactions()
            ->latest('transaction_date');

        if (request('search')) {
            $query->where(function ($q) {
                $q->where('description', 'like', '%' . request('search') . '%')
                    ->orWhere('beneficiary', 'like', '%' . request('search') . '%'); // Assuming beneficiary exists or using category/description
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        return inertia('Banks/Show', [
            'bank' => $bank,
            'transactions' => $transactions,
            'filters' => request()->only(['search']),
        ]);
    }

    public function store(\Illuminate\Http\Request $request, \App\Models\BankAccount $bank)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $bank->transactions()->create($validated);

        return back()->with('success', 'Transacción registrada.');
    }
}
