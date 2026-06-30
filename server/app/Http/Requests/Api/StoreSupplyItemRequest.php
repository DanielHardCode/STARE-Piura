<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplyItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => 'required|string|exists:events,id',
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|in:viveres,medicina,abrigo,limpieza,educacion,otro',
            'unidad' => 'required|string|max:50',
            'cantidad_requerida' => 'required|integer|min:1',
            'cantidad_cubierta' => 'nullable|integer|min:0',
            'precio_unitario_estimado' => 'required|numeric|min:0',
        ];
    }
}
