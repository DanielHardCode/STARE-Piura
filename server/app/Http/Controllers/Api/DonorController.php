<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreDonorRequest;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonorController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $donors = Donor::orderBy('created_at', 'desc')->get();
        return $this->success($donors);
    }

    public function show(string $id)
    {
        $donor = Donor::find($id);
        if (!$donor) {
            return $this->error('Donante no encontrado', 404);
        }
        return $this->success($donor);
    }

    public function store(StoreDonorRequest $request)
    {
        $donor = Donor::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($donor);
    }

    public function update(Request $request, string $id)
    {
        $donor = Donor::find($id);
        if (!$donor) {
            return $this->error('Donante no encontrado', 404);
        }

        $validated = $request->validate([
            'nombres' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|string|max:50',
            'documento' => 'sometimes|string|max:20',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'distrito' => 'nullable|string|max:100',
            'mype_id' => 'nullable|string|max:50',
        ]);

        $donor->update($validated);
        return $this->success($donor->fresh());
    }

    public function destroy(string $id)
    {
        $donor = Donor::find($id);
        if (!$donor) {
            return $this->error('Donante no encontrado', 404);
        }
        $donor->delete();
        return $this->noContent();
    }
}
