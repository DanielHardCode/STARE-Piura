<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'tipo', 'concepto', 'monto', 'fondo',
        'fecha', 'donation_id',
    ];
    protected $casts = [
        'monto' => 'decimal:2',
    ];
}
