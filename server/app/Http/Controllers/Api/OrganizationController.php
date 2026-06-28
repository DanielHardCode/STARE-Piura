<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrganizationRequest;
use App\Http\Requests\Api\UpdateOrganizationRequest;
use App\Models\Organization;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $organizations = Organization::orderBy('created_at', 'desc')->get();
        return $this->success($organizations);
    }

    public function show(string $id)
    {
        $org = Organization::find($id);
        if (!$org) {
            return $this->error('Organización no encontrada', 404);
        }
        return $this->success($org);
    }

    public function store(StoreOrganizationRequest $request)
    {
        $org = Organization::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
            'necesidades' => $request->input('necesidades', []),
        ]);

        return $this->created($org);
    }

    public function update(UpdateOrganizationRequest $request, string $id)
    {
        $org = Organization::find($id);
        if (!$org) {
            return $this->error('Organización no encontrada', 404);
        }
        $org->update($request->validated());
        return $this->success($org->fresh());
    }

    public function destroy(string $id)
    {
        $org = Organization::find($id);
        if (!$org) {
            return $this->error('Organización no encontrada', 404);
        }
        $org->delete();
        return $this->noContent();
    }
}
