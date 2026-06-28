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

    public function index()
    {
        $donations = Donation::orderBy('created_at', 'desc')->get();
        return $this->success($donations);
    }

    public function show(string $id)
    {
        $donation = Donation::find($id);
        if (!$donation) {
            return $this->error('Donación no encontrada', 404);
        }
        return $this->success($donation);
    }

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
        $donation = Donation::find($id);
        if (!$donation) {
            return $this->error('Donación no encontrada', 404);
        }
        $donation->update($request->validated());
        return $this->success($donation->fresh());
    }

    public function destroy(string $id)
    {
        $donation = Donation::find($id);
        if (!$donation) {
            return $this->error('Donación no encontrada', 404);
        }
        $donation->delete();
        return $this->noContent();
    }
}
