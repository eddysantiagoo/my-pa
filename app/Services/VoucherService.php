<?php

namespace App\Services;

use App\Models\Voucher;
use App\Models\VoucherFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VoucherService
{
    public function createVoucher(array $data): Voucher
    {
        // Generate UUID if not present (handled by model trait usually, but good to be explicit if needed)
        // $data['id'] = Str::uuid();
        
        // Handle logic for document_id generation if needed, or assume it's passed
        if (empty($data['document_id'])) {
            // Simple auto-increment fallback or leave null logic
             $data['document_id'] = 'DOC-' . time(); 
        }

        $voucher = Voucher::create($data);

        return $voucher;
    }

    public function handleFileUpload(Voucher $voucher, UploadedFile $file, string $type): VoucherFile
    {
        $path = $file->store('vouchers/' . $voucher->id, 'public');

        return $voucher->files()->create([
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'type_file' => $type,
            'status_file' => 'PENDING',
        ]);
    }

    public function updateVoucher(Voucher $voucher, array $data): Voucher
    {
        $voucher->update($data);
        return $voucher;
    }
}
