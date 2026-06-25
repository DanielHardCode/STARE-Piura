<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplyItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cantidad_cubierta' => 'sometimes|integer|min:0',
            'cantidad_requerida' => 'sometimes|integer|min:1',
            'precio_unitario_estimado' => 'sometimes|numeric|min:0',
        ];
    }
}
