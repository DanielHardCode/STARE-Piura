<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreDonorRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonorController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('donors', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('donors', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Donante no encontrado', 404);
        }

        return $this->success($data[0]);
    }

    public function store(StoreDonorRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('donors', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    public function update(Request $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('donors', $id);

        if (empty($check->json())) {
            return $this->error('Donante no encontrado', 404);
        }

        $validated = $request->validate([
            'nombres' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|string|max:50',
            'documento' => 'sometimes|string|max:20',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'distrito' => 'nullable|string|max:100',
            'mype_id' => 'nullable|string|max:50',
        ]);

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('donors', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('donors', $id);

        if (empty($response->json())) {
            return $this->error('Donante no encontrado', 404);
        }

        return $this->noContent();
    }
}
