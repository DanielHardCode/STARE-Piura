<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    use ApiResponse;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $notification = Notification::create([
            'id' => (string) Str::uuid(),
            ...$validated,
        ]);

        return $this->created($notification);
    }

    public function markAsRead(string $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read' => true]);
        return $this->success($notification->fresh());
    }

    public function markAllAsRead()
    {
        Notification::where('read', false)->update(['read' => true]);
        return $this->noContent();
    }
}
