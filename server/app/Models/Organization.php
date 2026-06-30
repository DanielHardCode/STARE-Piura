<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id', 'nombre', 'tipo', 'direccion', 'distrito', 'telefono',
        'encargado', 'email', 'beneficiarios_estimados', 'necesidades', 'activo',
    ];
    protected $casts = [
        'necesidades' => 'array',
        'activo' => 'boolean',
        'beneficiarios_estimados' => 'integer',
    ];
}
