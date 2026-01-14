<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    public function index()
    {
        // Fetch full tree for UI
        $applications = Application::with('children')->whereNull('parent_id')->orderBy('order')->orderBy('name')->get();
        return Inertia::render('Inventory/Applications/Index', [
            'applications' => $applications
        ]);
    }

    public function list()
    {
        // Return flattened list or tree for selects
        return response()->json(Application::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:applications,id',
            'order' => 'nullable|integer',
        ]);

        Application::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'],
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Aplicación creada.');
    }

    public function update(Request $request, Application $application)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:applications,id',
            'order' => 'nullable|integer',
        ]);

        // Prevent circular dependency if moving to own child
        if ($validated['parent_id'] == $application->id) {
            return back()->withErrors(['parent_id' => 'No puede ser padre de sí mismo']);
        }

        $application->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'],
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Aplicación actualizada.');
    }

    public function destroy(Application $application)
    {
        $application->delete();
        return redirect()->back()->with('success', 'Aplicación eliminada.');
    }
}
