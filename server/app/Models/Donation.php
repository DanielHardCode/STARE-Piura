<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'donor_id', 'donor_nombre', 'tipo', 'medio_pago',
        'monto', 'items', 'descripcion', 'fondo_destino',
        'event_id', 'comprobante_url', 'fecha',
    ];
    protected $casts = [
        'items' => 'array',
        'monto' => 'decimal:2',
    ];
}
