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

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('supply_items', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

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
}
