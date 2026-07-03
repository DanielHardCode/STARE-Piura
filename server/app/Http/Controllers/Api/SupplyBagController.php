<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupplyBagController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    /**
     * Listar todas las bolsas de suministro.
     */
    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('supply_bags', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    /**
     * Mostrar una bolsa específica.
     */
    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('supply_bags', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Bolsa de suministro no encontrada', 404);
        }

        return $this->success($data[0]);
    }

    /**
     * Crear una nueva bolsa de suministro.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'          => 'nullable|string',
            'organization_id'   => 'nullable|string',
            'contenido'         => 'nullable|array',
            'cantidad'          => 'nullable|integer|min:1',
            'status'            => 'nullable|in:pendiente,entregado',
            'entregado_en'      => 'nullable|date',
        ]);

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('supply_bags', [
                'id' => 'bag-' . Str::uuid()->toString(),
                ...$validated,
            ]);

        return $this->created($response->json());
    }

    /**
     * Actualizar una bolsa existente.
     */
    public function update(Request $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('supply_bags', $id);

        if (empty($check->json())) {
            return $this->error('Bolsa de suministro no encontrada', 404);
        }

        $validated = $request->validate([
            'event_id'          => 'sometimes|string|nullable',
            'organization_id'   => 'sometimes|string|nullable',
            'contenido'         => 'sometimes|array',
            'cantidad'          => 'sometimes|integer|min:1',
            'status'            => 'sometimes|in:pendiente,entregado',
            'entregado_en'      => 'sometimes|date|nullable',
        ]);

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('supply_bags', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    /**
     * Eliminar una bolsa.
     */
    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('supply_bags', $id);

        if (empty($response->json())) {
            return $this->error('Bolsa de suministro no encontrada', 404);
        }

        return $this->noContent();
    }
}