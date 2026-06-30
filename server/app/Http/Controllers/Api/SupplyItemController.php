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
        $item = SupplyItem::findOrFail($id);
        $item->update($request->validated());
        return $this->success($item->fresh());
    }
}
