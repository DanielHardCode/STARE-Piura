<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSupplyItemRequest;
use App\Http\Requests\Api\UpdateSupplyItemRequest;
use App\Models\SupplyItem;
use Illuminate\Support\Str;

class SupplyItemController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $items = SupplyItem::orderBy('created_at', 'desc')->get();
        return $this->success($items);
    }

    public function show(string $id)
    {
        $item = SupplyItem::find($id);
        if (!$item) {
            return $this->error('Ítem no encontrado', 404);
        }
        return $this->success($item);
    }

    public function store(StoreSupplyItemRequest $request)
    {
        $item = SupplyItem::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($item);
    }

    public function update(UpdateSupplyItemRequest $request, string $id)
    {
        $item = SupplyItem::find($id);
        if (!$item) {
            return $this->error('Ítem no encontrado', 404);
        }
        $item->update($request->validated());
        return $this->success($item->fresh());
    }

    public function destroy(string $id)
    {
        $item = SupplyItem::find($id);
        if (!$item) {
            return $this->error('Ítem no encontrado', 404);
        }
        $item->delete();
        return $this->noContent();
    }
}
