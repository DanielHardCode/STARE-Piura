<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'nombres', 'tipo', 'documento', 'telefono',
        'email', 'distrito', 'mype_id',
    ];
}
