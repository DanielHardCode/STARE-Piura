<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DonorSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $mypeIds = DB::table('mypes')->pluck('id')->toArray();

        $donors = [
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'Luis García Mendoza',
                'tipo' => 'persona',
                'documento' => '45236789',
                'telefono' => '987654321',
                'email' => 'luis.garcia@example.com',
                'distrito' => 'Piura Centro',
                'mype_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'María Fernanda López Chiroque',
                'tipo' => 'persona',
                'documento' => '40329871',
                'telefono' => '976543210',
                'email' => 'maria.lopez@example.com',
                'distrito' => 'Catacaos',
                'mype_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'Cooperativa San Martín de Porres',
                'tipo' => 'empresa',
                'documento' => '20485936174',
                'telefono' => '965432198',
                'email' => 'cooperativa.sanmartin@example.com',
                'distrito' => 'Piura Centro',
                'mype_id' => $mypeIds[1] ?? null,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'Carlos Enrique Vílchez Rivera',
                'tipo' => 'persona',
                'documento' => '41876543',
                'telefono' => '954321876',
                'email' => 'carlos.vilchez@example.com',
                'distrito' => 'Castilla',
                'mype_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'Panificadora El Trigal S.R.L.',
                'tipo' => 'empresa',
                'documento' => '10456328971',
                'telefono' => '968473829',
                'email' => 'donaciones@trigal.com',
                'distrito' => 'Piura Centro',
                'mype_id' => $mypeIds[0] ?? null,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombres' => 'Ana Cecilia Tavara Samamé',
                'tipo' => 'persona',
                'documento' => '43567129',
                'telefono' => '943217865',
                'email' => 'ana.tavara@example.com',
                'distrito' => 'Chulucanas',
                'mype_id' => null,
            ],
        ];

        foreach ($donors as $donor) {
            $donor['created_at'] = $now;
            DB::table('donors')->insert($donor);
        }
    }
}
