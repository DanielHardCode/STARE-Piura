<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_id' => 'required|string|max:50',
            'donor_nombre' => 'required|string|max:255',
            'tipo' => 'required|string|in:monetaria,especie',
            'medio_pago' => 'nullable|string|in:yape,plin,efectivo,transferencia,especie',
            'monto' => 'nullable|numeric|min:0',
            'items' => 'nullable|array',
            'items.*.item_nombre' => 'required_with:items|string',
            'items.*.cantidad' => 'required_with:items|integer|min:1',
            'items.*.unidad' => 'nullable|string',
            'descripcion' => 'nullable|string',
            'fondo_destino' => 'nullable|string|in:caja_chica,fondo_adquisicion',
            'event_id' => 'nullable|string|max:50',
            'comprobante_url' => 'nullable|string',
            'fecha' => 'required|date',
        ];
    }
}
