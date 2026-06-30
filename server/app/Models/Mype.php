<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mype extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id', 'razon_social', 'ruc', 'rubro', 'contacto', 'telefono',
        'email', 'distrito', 'activo', 'historial_aportes',
    ];
    protected $casts = [
        'activo' => 'boolean',
        'historial_aportes' => 'decimal:2',
    ];
}
