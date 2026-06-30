<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'distrito' => 'sometimes|string|max:100',
            'target_audience' => 'sometimes|string|max:255',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after_or_equal:start_time',
            'status' => 'sometimes|string|in:programada,en_curso,realizada,cancelada',
            'coordinador_id' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ];
    }
}
