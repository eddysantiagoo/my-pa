<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('nit', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Companies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nit' => 'required|string|max:50|unique:companies,nit',
            'type' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        Company::create($validated);

        return redirect('/configuration/company')->with('success', 'Empresa creada.');
    }

    public function edit(Company $company)
    {
        return Inertia::render('Configuration/Companies/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nit' => 'required|string|max:50|unique:companies,nit,' . $company->id,
            'type' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        $company->update($validated);

        return redirect('/configuration/company')->with('success', 'Empresa actualizada.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect('/configuration/company')->with('success', 'Empresa eliminada.');
    }
}
