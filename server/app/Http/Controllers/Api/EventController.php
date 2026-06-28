<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEventRequest;
use App\Http\Requests\Api\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Support\Str;

class EventController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $events = Event::orderBy('created_at', 'desc')->get();
        return $this->success($events);
    }

    public function show(string $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return $this->error('Evento no encontrado', 404);
        }
        return $this->success($event);
    }

    public function store(StoreEventRequest $request)
    {
        $event = Event::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($event);
    }

    public function update(UpdateEventRequest $request, string $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return $this->error('Evento no encontrado', 404);
        }
        $event->update($request->validated());
        return $this->success($event->fresh());
    }

    public function destroy(string $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return $this->error('Evento no encontrado', 404);
        }
        $event->delete();
        return $this->noContent();
    }
}
