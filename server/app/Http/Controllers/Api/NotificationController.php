<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $notifications = Notification::orderBy('created_at', 'desc')->get();
        return $this->success($notifications);
    }

    public function show(string $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return $this->error('Notificación no encontrada', 404);
        }
        return $this->success($notification);
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

        $notification = Notification::create([
            'id' => (string) Str::uuid(),
            ...$validated,
        ]);

        return $this->created($notification);
    }

    public function update(Request $request, string $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return $this->error('Notificación no encontrada', 404);
        }

        $validated = $request->validate([
            'tipo' => 'sometimes|string|max:50',
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'read' => 'sometimes|boolean',
            'data' => 'nullable|array',
        ]);

        $notification->update($validated);
        return $this->success($notification->fresh());
    }

    public function destroy(string $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return $this->error('Notificación no encontrada', 404);
        }
        $notification->delete();
        return $this->noContent();
    }

    public function markAsRead(string $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return $this->error('Notificación no encontrada', 404);
        }
        $notification->update(['read' => true]);
        return $this->success($notification->fresh());
    }

    public function markAllAsRead()
    {
        Notification::where('read', false)->update(['read' => true]);
        return $this->success(['message' => 'Todas las notificaciones marcadas como leídas']);
    }
}
