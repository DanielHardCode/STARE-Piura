<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreDonationRequest;
use App\Http\Requests\Api\UpdateDonationRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('donations', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('donations', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Donación no encontrada', 404);
        }

        return $this->success($data[0]);
    }

    public function store(StoreDonationRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('donations', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    public function update(UpdateDonationRequest $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('donations', $id);

        if (empty($check->json())) {
            return $this->error('Donación no encontrada', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('donations', $id, $request->validated());

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('donations', $id);

        if (empty($response->json())) {
            return $this->error('Donación no encontrada', 404);
        }

        return $this->noContent();
    }
}
