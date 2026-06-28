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

    public function index()
    {
        $mypes = Mype::orderBy('created_at', 'desc')->get();
        return $this->success($mypes);
    }

    public function show(string $id)
    {
        $mype = Mype::find($id);
        if (!$mype) {
            return $this->error('MYPE no encontrada', 404);
        }
        return $this->success($mype);
    }

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
        $mype = Mype::find($id);
        if (!$mype) {
            return $this->error('MYPE no encontrada', 404);
        }
        $mype->update($request->validated());
        return $this->success($mype->fresh());
    }

    public function destroy(string $id)
    {
        $mype = Mype::find($id);
        if (!$mype) {
            return $this->error('MYPE no encontrada', 404);
        }
        $mype->delete();
        return $this->noContent();
    }
}
