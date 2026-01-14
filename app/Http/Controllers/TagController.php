<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $tags = Tag::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Configuration/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Tags/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]);

        Tag::create($validated);

        return redirect('/configuration/tags')->with('success', 'Etiqueta creada.');
    }

    public function edit(Tag $tag)
    {
        return Inertia::render('Configuration/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]);

        $tag->update($validated);

        return redirect('/configuration/tags')->with('success', 'Etiqueta actualizada.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect('/configuration/tags')->with('success', 'Etiqueta eliminada.');
    }
}
