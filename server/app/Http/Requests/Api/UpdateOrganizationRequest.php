<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|string|in:comedor,asilo,albergue,vaso_de_leche,pronoei,otro',
            'direccion' => 'sometimes|string',
            'distrito' => 'sometimes|string|max:100',
            'telefono' => 'nullable|string|max:50',
            'encargado' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'beneficiarios_estimados' => 'sometimes|integer|min:0',
            'necesidades' => 'nullable|array',
            'necesidades.*' => 'string',
            'activo' => 'sometimes|boolean',
        ];
    }
}
