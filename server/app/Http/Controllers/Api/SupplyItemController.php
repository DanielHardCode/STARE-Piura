<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSupplyItemRequest;
use App\Http\Requests\Api\UpdateSupplyItemRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupplyItemController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    /**
     * Listar todos los ítems de suministro.
     */
    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('supply_items', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    /**
     * Mostrar un ítem específico.
     */
    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('supply_items', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Ítem no encontrado', 404);
        }

        return $this->success($data[0]);
    }

    /**
     * Crear un nuevo ítem de suministro.
     */
    public function store(StoreSupplyItemRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('supply_items', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    /**
     * Actualizar un ítem existente.
     */
    public function update(UpdateSupplyItemRequest $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('supply_items', $id);

        if (empty($check->json())) {
            return $this->error('Ítem no encontrado', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('supply_items', $id, $request->validated());

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    /**
     * Eliminar un ítem.
     */
    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('supply_items', $id);

        if (empty($response->json())) {
            return $this->error('Ítem no encontrado', 404);
        }

        return $this->noContent();
    }

    /**
     * Cubrir una unidad de suministro de forma transaccional.
     *
     * Este método resuelve el problema de concurrencia: si varios
     * usuarios intentan cubrir la última unidad disponible, solo
     * el primero lo conseguirá. Los demás recibirán un error 409.
     */
    public function cubrir(Request $request, string $id)
    {
        // Validar que el ítem existe
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('supply_items', $id);

        if (empty($check->json())) {
            return $this->error('Ítem no encontrado', 404);
        }

        // Llamar a la función RPC transaccional en Supabase
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->raw('POST', 'rpc/cubrir_suministro', [
                'p_item_id' => $id,
            ]);

        $result = $response->json();

        // La función retorna true si se cubrió, false si ya no había disponibilidad
        if ($result === true) {
            return $this->success(['message' => 'Suministro cubierto correctamente.']);
        }

        return $this->error(
            'No se pudo cubrir el suministro. Ya no hay disponibilidad.',
            409 // Conflict
        );
    }
}