<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Models\ContactDocument;
use App\Models\Contact;
use App\Services\FileStorageInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactDocumentController extends Controller
{
    public function __construct(
        private FileStorageInterface $fileStorage
    ) {}

    public function store(Request $request, Contact $contact): RedirectResponse
    {
        $request->validate([
            'document_type' => ['required', 'string', 'max:100'],
            'file' => ['required', 'file', 'max:10240'], // 10MB max
        ]);

        $file = $request->file('file');
        $path = $this->fileStorage->store($file, 'contact-documents/' . $contact->id);

        $contact->documents()->create([
            'document_type' => $request->document_type,
            'disk' => $this->fileStorage->getDisk(),
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return back()->with('success', 'Documento subido exitosamente.');
    }

    public function destroy(ContactDocument $document): RedirectResponse
    {
        $document->delete(); // File is deleted automatically via model event

        return back()->with('success', 'Documento eliminado exitosamente.');
    }
}
