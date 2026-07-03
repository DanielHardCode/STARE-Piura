<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $profiles = [
            [
                'id' => '3c743698-0df0-4158-a1b9-7fcd72633380',
                'email' => 'admin@starepiura.org',
                'nombre' => 'Admin Central',
                'role' => 'admin',
                'telefono' => '999888777',
                'avatar_url' => null,
                'activo' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => (string) Str::uuid(),
                'email' => 'coordinador@starepiura.org',
                'nombre' => 'Coordinador Piura',
                'role' => 'coordinador',
                'telefono' => '912345678',
                'avatar_url' => null,
                'activo' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => (string) Str::uuid(),
                'email' => 'voluntario@starepiura.org',
                'nombre' => 'Voluntario Ruta',
                'role' => 'voluntario',
                'telefono' => '998877665',
                'avatar_url' => null,
                'activo' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('profiles')->insert($profiles);
    }
}
