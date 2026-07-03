<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrganizationRequest;
use App\Http\Requests\Api\UpdateOrganizationRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('organizations', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('organizations', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Organización no encontrada', 404);
        }

        return $this->success($data[0]);
    }

    public function store(StoreOrganizationRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('organizations', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    public function update(UpdateOrganizationRequest $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('organizations', $id);

        if (empty($check->json())) {
            return $this->error('Organización no encontrada', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('organizations', $id, $request->validated());

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('organizations', $id);

        if (empty($response->json())) {
            return $this->error('Organización no encontrada', 404);
        }

        return $this->noContent();
    }
}
