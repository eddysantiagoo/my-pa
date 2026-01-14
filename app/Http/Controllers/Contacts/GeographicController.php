<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\Department;
use Illuminate\Http\JsonResponse;

class GeographicController extends Controller
{
    public function countries(): JsonResponse
    {
        return response()->json(
            Country::select('id', 'name', 'code', 'phone_code')
                ->orderBy('name')
                ->get()
        );
    }

    public function departments(Country $country): JsonResponse
    {
        return response()->json(
            $country->departments()
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get()
        );
    }

    public function cities(Department $department): JsonResponse
    {
        return response()->json(
            $department->cities()
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get()
        );
    }
}
