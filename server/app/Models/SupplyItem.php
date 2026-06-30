<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplyItem extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'event_id', 'nombre', 'categoria', 'unidad',
        'cantidad_requerida', 'cantidad_cubierta', 'precio_unitario_estimado',
    ];
    protected $casts = [
        'cantidad_requerida' => 'integer',
        'cantidad_cubierta' => 'integer',
        'precio_unitario_estimado' => 'decimal:2',
    ];
}
