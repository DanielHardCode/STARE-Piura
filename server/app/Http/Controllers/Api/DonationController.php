<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreDonationRequest;
use App\Http\Requests\Api\UpdateDonationRequest;
use App\Models\Donation;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    use ApiResponse;

    public function store(StoreDonationRequest $request)
    {
        $donation = Donation::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($donation);
    }

    public function update(UpdateDonationRequest $request, string $id)
    {
        $donation = Donation::findOrFail($id);
        $donation->update($request->validated());
        return $this->success($donation->fresh());
    }
}
