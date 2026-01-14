<?php

namespace App\Http\Controllers;

use App\Models\Numbering;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NumberingController extends Controller
{
    public function index(Request $request)
    {
        $numberings = Numbering::query()
            ->when($request->search, fn($q, $s) => $q->where('prefix', 'like', "%{$s}%")->orWhere('document_type', 'like', "%{$s}%"))
            ->orderBy('document_type')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Numberings/Index', [
            'numberings' => $numberings,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Numberings/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prefix' => 'nullable|string|max:20',
            'next_number' => 'required|integer|min:1',
            'document_type' => 'required|string|max:100',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        Numbering::create($validated);

        return redirect('/configuration/numbering')->with('success', 'Numeración creada.');
    }

    public function edit(Numbering $numbering)
    {
        return Inertia::render('Configuration/Numberings/Edit', [
            'numbering' => $numbering,
        ]);
    }

    public function update(Request $request, Numbering $numbering)
    {
        $validated = $request->validate([
            'prefix' => 'nullable|string|max:20',
            'next_number' => 'required|integer|min:1',
            'document_type' => 'required|string|max:100',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $numbering->update($validated);

        return redirect('/configuration/numbering')->with('success', 'Numeración actualizada.');
    }

    public function destroy(Numbering $numbering)
    {
        $numbering->delete();

        return redirect('/configuration/numbering')->with('success', 'Numeración eliminada.');
    }
}
