<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('notifications', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('notifications', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Notificación no encontrada', 404);
        }

        return $this->success($data[0]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|string|max:50',
            'tipo' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('notifications', [
                'id' => (string) Str::uuid(),
                'read' => false,
                ...$validated,
            ]);

        return $this->created($response->json());
    }

    public function update(Request $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('notifications', $id);

        if (empty($check->json())) {
            return $this->error('Notificación no encontrada', 404);
        }

        $validated = $request->validate([
            'tipo' => 'sometimes|string|max:50',
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'read' => 'sometimes|boolean',
            'data' => 'nullable|array',
        ]);

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('notifications', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('notifications', $id);

        if (empty($response->json())) {
            return $this->error('Notificación no encontrada', 404);
        }

        return $this->noContent();
    }

    public function markAsRead(Request $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('notifications', $id);

        if (empty($check->json())) {
            return $this->error('Notificación no encontrada', 404);
        }

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('notifications', $id, ['read' => true]);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function markAllAsRead(Request $request)
    {
        $this->supabase
            ->withToken($request->bearerToken())
            ->raw('patch', 'notifications?read=eq.false', ['read' => true]);

        return $this->success(['message' => 'Todas las notificaciones marcadas como leídas']);
    }
}
