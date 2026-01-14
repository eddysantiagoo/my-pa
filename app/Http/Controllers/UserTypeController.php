<?php

namespace App\Http\Controllers;

use App\Models\UserType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTypeController extends Controller
{
    public function index(Request $request)
    {
        $types = UserType::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/UserTypes/Index', [
            'types' => $types,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/UserTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        UserType::create($validated);

        return redirect('/configuration/user-types')->with('success', 'Tipo de usuario creado.');
    }

    public function edit(UserType $userType)
    {
        return Inertia::render('Configuration/UserTypes/Edit', [
            'type' => $userType,
        ]);
    }

    public function update(Request $request, UserType $userType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $userType->update($validated);

        return redirect('/configuration/user-types')->with('success', 'Tipo de usuario actualizado.');
    }

    public function destroy(UserType $userType)
    {
        $userType->delete();

        return redirect('/configuration/user-types')->with('success', 'Tipo de usuario eliminado.');
    }
}
