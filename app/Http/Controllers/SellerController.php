<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index(Request $request)
    {
        $sellers = Seller::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Sellers/Index', [
            'sellers' => $sellers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Sellers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        Seller::create($validated);

        return redirect('/configuration/sellers')->with('success', 'Vendedor creado.');
    }

    public function edit(Seller $seller)
    {
        return Inertia::render('Configuration/Sellers/Edit', [
            'seller' => $seller,
        ]);
    }

    public function update(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        $seller->update($validated);

        return redirect('/configuration/sellers')->with('success', 'Vendedor actualizado.');
    }

    public function destroy(Seller $seller)
    {
        $seller->delete();

        return redirect('/configuration/sellers')->with('success', 'Vendedor eliminado.');
    }
}
