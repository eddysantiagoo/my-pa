<?php

namespace App\Http\Controllers;

use App\Models\Withholding;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WithholdingController extends Controller
{
    public function index(Request $request)
    {
        $withholdings = Withholding::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Withholdings/Index', [
            'withholdings' => $withholdings,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Withholdings/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'min_base' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        Withholding::create($validated);

        return redirect('/configuration/withholdings')->with('success', 'Retención creada.');
    }

    public function edit(Withholding $withholding)
    {
        return Inertia::render('Configuration/Withholdings/Edit', [
            'withholding' => $withholding,
        ]);
    }

    public function update(Request $request, Withholding $withholding)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'min_base' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $withholding->update($validated);

        return redirect('/configuration/withholdings')->with('success', 'Retención actualizada.');
    }

    public function destroy(Withholding $withholding)
    {
        $withholding->delete();

        return redirect('/configuration/withholdings')->with('success', 'Retención eliminada.');
    }
}
