<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => 'required|string|in:ingreso,egreso',
            'concepto' => 'required|string',
            'monto' => 'required|numeric|min:0',
            'fondo' => 'required|string|in:caja_chica,fondo_adquisicion',
            'fecha' => 'required|date',
            'donation_id' => 'nullable|string|exists:donations,id',
        ];
    }
}
