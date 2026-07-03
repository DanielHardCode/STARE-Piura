<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'descripcion' => 'sometimes|string',
            'comprobante_url' => 'nullable|string',
            'event_id' => 'nullable|string|max:50',
        ];
    }
}
