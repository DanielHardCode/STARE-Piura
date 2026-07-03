<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreMypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'razon_social' => 'required|string|max:255',
            'ruc' => 'required|string|max:20',
            'rubro' => 'required|string|in:Bodega,Panadería,Farmacia,Restaurant,Ferretería,Librería,Textil,Otro',
            'contacto' => 'required|string|max:255',
            'telefono' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'distrito' => 'required|string|max:100',
        ];
    }
}
