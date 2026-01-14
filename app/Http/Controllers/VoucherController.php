<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    protected $voucherService;

    public function __construct(VoucherService $voucherService)
    {
        $this->voucherService = $voucherService;
    }

    public function index(Request $request)
    {
        $query = Voucher::query()->with('files');

        if ($request->has('search')) {
            $search = $request->input('search');
            // Add search logic for buyer/provider/id
        }

        $vouchers = $query->latest()->paginate(15);

        return Inertia::render('Vouchers/Index', [
            'vouchers' => $vouchers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vouchers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_json' => 'required|array',
            'seller_json' => 'required|array',
            'total' => 'required|numeric',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            // Add other validations
        ]);
        
        // Map frontend fields to DB fields if names differ
        // e.g. date might map to created_at or a specific date field? 
        // Schema has created_at, updated_at. If user picks a date, we might override created_at or need a `date` field.
        // The schema requested "created_at" mapped to "Creación", so we'll use standard timestamps.
        // However, if the user explicitly inputs a date, we should probably respect it or add a specific date field.
        // Re-checking requirements: "Fields (Mapped Directly)... created_at". 
        // But the form has "Fecha *". 
        // I will adhere to use `created_at` for now effectively, or add a `date` column if strictly needed.
        // User said: "date *" in form. I'll stick to schema for now (no extra fields), so maybe I save it in `created_at` or `notes`?
        // Actually, "Fields: ... created_at". I will assume `created_at` acts as the document date.

        $validated['company_id'] = auth()->user()->company_id ?? 1; // Fallback or strict
        $validated['user_created_json'] = auth()->user();

        $voucher = $this->voucherService->createVoucher($validated);

        // Handle files if uploaded in same request or separate
        if ($request->hasFile('purchase_document')) {
             $this->voucherService->handleFileUpload($voucher, $request->file('purchase_document'), 'vouchers');
        }

        return redirect()->route('vouchers.index');
    }

    public function show(Voucher $voucher)
    {
        $voucher->load('files');
        return Inertia::render('Vouchers/Show', [
            'voucher' => $voucher
        ]);
    }

    public function edit(Voucher $voucher)
    {
        $voucher->load('files');
        return Inertia::render('Vouchers/Edit', [
            'voucher' => $voucher
        ]);
    }

    public function update(Request $request, Voucher $voucher)
    {
        // Validation & Update logic
        return redirect()->route('vouchers.index');
    }
}
