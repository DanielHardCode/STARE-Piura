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
        $event = Event::findOrFail($id);
        $event->update($request->validated());
        return $this->success($event->fresh());
    }
}
