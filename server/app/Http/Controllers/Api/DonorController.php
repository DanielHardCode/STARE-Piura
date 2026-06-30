<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreDonorRequest;
use App\Models\Donor;
use Illuminate\Support\Str;

class DonorController extends Controller
{
    use ApiResponse;

    public function store(StoreDonorRequest $request)
    {
        $donor = Donor::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($donor);
    }
}
