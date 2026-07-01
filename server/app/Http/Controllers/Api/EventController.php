<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEventRequest;
use App\Http\Requests\Api\UpdateEventRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('events', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('events', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Evento no encontrado', 404);
        }

        return $this->success($data[0]);
    }

    public function store(StoreEventRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('events', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    public function update(UpdateEventRequest $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('events', $id);

        if (empty($check->json())) {
            return $this->error('Evento no encontrado', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('events', $id, $request->validated());

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('events', $id);

        if (empty($response->json())) {
            return $this->error('Evento no encontrado', 404);
        }

        return $this->noContent();
    }
}
