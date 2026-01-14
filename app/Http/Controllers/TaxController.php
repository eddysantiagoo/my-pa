<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaxController extends Controller
{
    public function index(Request $request)
    {
        $taxes = Tax::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Taxes/Index', [
            'taxes' => $taxes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Taxes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Tax::create($validated);

        return redirect('/configuration/taxes')->with('success', 'Impuesto creado.');
    }

    public function edit(Tax $tax)
    {
        return Inertia::render('Configuration/Taxes/Edit', [
            'tax' => $tax,
        ]);
    }

    public function update(Request $request, Tax $tax)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $tax->update($validated);

        return redirect('/configuration/taxes')->with('success', 'Impuesto actualizado.');
    }

    public function destroy(Tax $tax)
    {
        $tax->delete();

        return redirect('/configuration/taxes')->with('success', 'Impuesto eliminado.');
    }
}
