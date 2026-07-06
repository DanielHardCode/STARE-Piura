<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class EvidenceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request, string $eventId)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('visit_evidences', "select=*&event_id=eq.{$eventId}&order=created_at.desc");

        return $this->success($response->json(), $response->status());
    }

    public function store(Request $request, string $eventId)
    {
        $validated = $request->validate([
            'evidences' => 'required|array|min:1|max:20',
            'evidences.*.tipo' => 'required|string|in:foto_canasta,foto_evidencia,firma',
            'evidences.*.url' => 'required|string|max:2048',
            'evidences.*.descripcion' => 'nullable|string|max:500',
        ]);

        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('events', $eventId);

        if (empty($check->json())) {
            return $this->error('Evento no encontrado', 404);
        }

        $created = [];

        foreach ($validated['evidences'] as $evidence) {
            $response = $this->supabase
                ->withToken($request->bearerToken())
                ->withRepresentation()
                ->create('visit_evidences', [
                    'event_id' => $eventId,
                    'tipo' => $evidence['tipo'],
                    'url' => $evidence['url'],
                    'descripcion' => $evidence['descripcion'] ?? null,
                ]);

            $result = $response->json();

            if (isset($result[0])) {
                $created[] = $result[0];
            } elseif (isset($result['id'])) {
                $created[] = $result;
            }
        }

        return $this->created($created);
    }

    public function complete(Request $request, string $eventId)
    {
        $validated = $request->validate([
            'evidences' => 'sometimes|array|min:1|max:20',
            'evidences.*.tipo' => 'required_with:evidences|string|in:foto_canasta,foto_evidencia,firma',
            'evidences.*.url' => 'required_with:evidences|string|max:2048',
            'evidences.*.descripcion' => 'nullable|string|max:500',
        ]);

        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('events', $eventId);

        if (empty($check->json())) {
            return $this->error('Evento no encontrado', 404);
        }

        $created = [];

        if (!empty($validated['evidences'])) {
            foreach ($validated['evidences'] as $evidence) {
                $response = $this->supabase
                    ->withToken($request->bearerToken())
                    ->withRepresentation()
                    ->create('visit_evidences', [
                        'event_id' => $eventId,
                        'tipo' => $evidence['tipo'],
                        'url' => $evidence['url'],
                        'descripcion' => $evidence['descripcion'] ?? null,
                    ]);

                $result = $response->json();

                if (isset($result[0])) {
                    $created[] = $result[0];
                } elseif (isset($result['id'])) {
                    $created[] = $result;
                }
            }
        }

        $updateResponse = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('events', $eventId, [
                'status' => 'realizada',
            ]);

        $updated = $updateResponse->json();

        return $this->success([
            'event' => $updated[0] ?? $check->json()[0],
            'evidences' => $created,
        ]);
    }
}
