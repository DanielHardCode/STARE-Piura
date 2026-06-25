<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'user_id', 'tipo', 'title', 'message',
        'read', 'data',
    ];
    protected $casts = [
        'read' => 'boolean',
        'data' => 'array',
    ];
}
