<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('profiles', 'select=id,email,nombre,role,activo,created_at&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('profiles', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Perfil no encontrado', 404);
        }

        return $this->success($data[0]);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'role' => 'sometimes|string|in:admin,coordinador,voluntario',
            'activo' => 'sometimes|boolean',
            'telefono' => 'nullable|string|max:50',
        ]);

        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('profiles', $id);

        if (empty($check->json())) {
            return $this->error('Perfil no encontrado', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('profiles', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }
}
