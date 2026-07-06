<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
            'nombre' => 'required|string|max:255',
            'role' => 'required|string|in:coordinador,voluntario',
            'telefono' => 'nullable|string|max:50',
        ]);

        $supabaseUrl = rtrim(config('services.supabase.url'), '/');
        $anonKey = config('services.supabase.anon_key');
        $serviceRoleKey = config('services.supabase.service_role_key');

        $http = Http::withHeaders([
            'apikey' => $anonKey,
            'Accept' => 'application/json',
        ])->withToken($serviceRoleKey);

        if (app()->environment('local')) {
            $http->withOptions(['verify' => false]);
        }

        $authResponse = $http->post("{$supabaseUrl}/auth/v1/admin/users", [
            'email' => $validated['email'],
            'password' => $validated['password'],
            'email_confirm' => true,
            'user_metadata' => [
                'nombre' => $validated['nombre'],
                'role' => $validated['role'],
                'telefono' => $validated['telefono'] ?? '',
            ],
        ]);

        if ($authResponse->failed()) {
            $errorBody = $authResponse->json();
            $msg = $errorBody['msg'] ?? $errorBody['message'] ?? 'Error al crear usuario en Supabase Auth';
            return $this->error($msg, $authResponse->status());
        }

        $authUser = $authResponse->json();
        $authUserId = $authUser['id'] ?? null;

        if (!$authUserId) {
            return $this->error('No se pudo obtener el ID del usuario creado', 500);
        }

        $profileResponse = $this->supabase
            ->asAdmin()
            ->withRepresentation()
            ->create('profiles', [
                'id' => $authUserId,
                'email' => $validated['email'],
                'nombre' => $validated['nombre'],
                'role' => $validated['role'],
                'telefono' => $validated['telefono'] ?? null,
                'activo' => true,
            ]);

        if ($profileResponse->failed()) {
            return $this->error('Error al crear perfil: ' . ($profileResponse->body()), 500);
        }

        $profileData = $profileResponse->json();

        return $this->created([
            'id' => $authUserId,
            'email' => $validated['email'],
            'nombre' => $validated['nombre'],
            'role' => $validated['role'],
            'telefono' => $validated['telefono'] ?? null,
            'activo' => true,
            'created_at' => $profileData[0]['created_at'] ?? now()->toIso8601String(),
        ]);
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
            ->asAdmin()
            ->find('profiles', $id);

        if (empty($check->json())) {
            return $this->error('Perfil no encontrado', 404);
        }

        $response = $this->supabase
            ->asAdmin()
            ->withRepresentation()
            ->update('profiles', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }
}
