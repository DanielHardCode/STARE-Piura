<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id', 'organization_id', 'organization_nombre', 'title',
        'description', 'distrito', 'target_audience', 'start_time',
        'end_time', 'status', 'coordinador_id', 'notes',
    ];
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];
}
