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
        $org = Organization::findOrFail($id);
        $org->update($request->validated());
        return $this->success($org->fresh());
    }

    public function destroy(string $id)
    {
        Organization::findOrFail($id)->delete();
        return $this->noContent();
    }
}
