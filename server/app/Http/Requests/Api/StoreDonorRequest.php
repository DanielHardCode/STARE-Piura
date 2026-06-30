<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombres' => 'required|string|max:255',
            'tipo' => 'required|string|in:persona_natural,empresa',
            'documento' => 'required|string|max:20',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'distrito' => 'nullable|string|max:100',
            'mype_id' => 'nullable|string|exists:mypes,id',
        ];
    }
}
