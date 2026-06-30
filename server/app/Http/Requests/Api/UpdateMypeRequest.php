<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'razon_social' => 'sometimes|string|max:255',
            'ruc' => 'sometimes|string|max:20|unique:mypes,ruc,' . $this->route('id'),
            'rubro' => 'sometimes|string|in:Bodega,Panadería,Farmacia,Restaurant,Ferretería,Librería,Textil,Otro',
            'contacto' => 'sometimes|string|max:255',
            'telefono' => 'sometimes|string|max:50',
            'email' => 'nullable|email|max:255',
            'distrito' => 'sometimes|string|max:100',
            'activo' => 'sometimes|boolean',
            'historial_aportes' => 'sometimes|numeric|min:0',
        ];
    }
}
