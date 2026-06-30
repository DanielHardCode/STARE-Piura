<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMypeRequest;
use App\Http\Requests\Api\UpdateMypeRequest;
use App\Models\Mype;
use Illuminate\Support\Str;

class MypeController extends Controller
{
    use ApiResponse;

    public function store(StoreMypeRequest $request)
    {
        $mype = Mype::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($mype);
    }

    public function update(UpdateMypeRequest $request, string $id)
    {
        $mype = Mype::findOrFail($id);
        $mype->update($request->validated());
        return $this->success($mype->fresh());
    }
}
