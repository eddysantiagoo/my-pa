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

        // Map campo `date` del formulario a la columna `created_at` de la tabla,
        // ya que el esquema de `vouchers` no tiene una columna `date`.
        if (isset($validated['date'])) {
            $validated['created_at'] = $validated['date'];
            unset($validated['date']);
        }

        $validated['company_id'] = auth()->user()->company_id ?? 1; // Fallback o estricto
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
