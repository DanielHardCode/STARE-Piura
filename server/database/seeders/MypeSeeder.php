<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MypeSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $mypes = [
            [
                'id' => (string) Str::uuid(),
                'razon_social' => 'Panificadora El Trigal S.R.L.',
                'ruc' => '10456328971',
                'rubro' => 'alimentos',
                'contacto' => 'Miguel Ángel Chiroque',
                'telefono' => '968473829',
                'email' => 'panificadora.trigal@example.com',
                'distrito' => 'Piura Centro',
                'activo' => true,
                'historial_aportes' => 2850.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'razon_social' => 'Transportes Norte Express E.I.R.L.',
                'ruc' => '20567389012',
                'rubro' => 'transporte',
                'contacto' => 'Rosa Elena Neyra García',
                'telefono' => '965432109',
                'email' => 'transportes.norte@example.com',
                'distrito' => 'Sullana',
                'activo' => true,
                'historial_aportes' => 4200.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'razon_social' => 'Farmacia San Martín S.A.C.',
                'ruc' => '10678451230',
                'rubro' => 'farmacia',
                'contacto' => 'Luis Alberto Palacios',
                'telefono' => '974561230',
                'email' => 'farmacia.sanmartin@example.com',
                'distrito' => 'Paita',
                'activo' => true,
                'historial_aportes' => 1950.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'razon_social' => 'Ferretería El Constructor S.R.L.',
                'ruc' => '20345678123',
                'rubro' => 'ferretería',
                'contacto' => 'Julio César Ramos Cruz',
                'telefono' => '967892345',
                'email' => 'ferre.construccion@example.com',
                'distrito' => 'Talara',
                'activo' => true,
                'historial_aportes' => 3150.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'razon_social' => 'Bodega Mayorista Los Andes S.A.',
                'ruc' => '10789562341',
                'rubro' => 'abastos',
                'contacto' => 'Patricia Saavedra Lozano',
                'telefono' => '961234567',
                'email' => 'bodega.andes@example.com',
                'distrito' => 'Piura Centro',
                'activo' => true,
                'historial_aportes' => 5600.00,
            ],
        ];

        foreach ($mypes as $mype) {
            $mype['created_at'] = $now;
            $mype['updated_at'] = $now;
            DB::table('mypes')->insert($mype);
        }
    }
}
