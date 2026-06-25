<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|in:comedor,asilo,albergue,vaso_de_leche,pronoei,otro',
            'direccion' => 'required|string',
            'distrito' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:50',
            'encargado' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'beneficiarios_estimados' => 'required|integer|min:0',
            'necesidades' => 'nullable|array',
            'necesidades.*' => 'string',
        ];
    }
}
