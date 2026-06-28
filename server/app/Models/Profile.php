<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id', 'email', 'nombre', 'role', 'telefono',
        'avatar_url', 'activo',
    ];
    protected $casts = [
        'activo' => 'boolean',
    ];
}
