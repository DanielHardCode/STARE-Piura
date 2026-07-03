<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SupplyItemSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $eventIds = DB::table('events')->pluck('id', 'title')->toArray();

        $supplyItems = [
            [
                'id' => (string) Str::uuid(),
                'event_id' => $eventIds['Campaña de Salud en Castilla'] ?? '',
                'nombre' => 'Arroz',
                'categoria' => 'víveres',
                'unidad' => 'kg',
                'cantidad_requerida' => 100,
                'cantidad_cubierta' => 60,
                'precio_unitario_estimado' => 3.50,
            ],
            [
                'id' => (string) Str::uuid(),
                'event_id' => $eventIds['Entrega de Víveres en Catacaos'] ?? '',
                'nombre' => 'Leche Evaporada',
                'categoria' => 'víveres',
                'unidad' => 'litro',
                'cantidad_requerida' => 200,
                'cantidad_cubierta' => 200,
                'precio_unitario_estimado' => 4.20,
            ],
            [
                'id' => (string) Str::uuid(),
                'event_id' => $eventIds['Jornada Médica en Chulucanas'] ?? '',
                'nombre' => 'Medicamentos Básicos',
                'categoria' => 'medicina',
                'unidad' => 'kit',
                'cantidad_requerida' => 50,
                'cantidad_cubierta' => 15,
                'precio_unitario_estimado' => 25.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'event_id' => $eventIds['Feria de Apoyo Social en Piura'] ?? '',
                'nombre' => 'Mantas',
                'categoria' => 'abrigo',
                'unidad' => 'unidad',
                'cantidad_requerida' => 80,
                'cantidad_cubierta' => 45,
                'precio_unitario_estimado' => 18.00,
            ],
            [
                'id' => (string) Str::uuid(),
                'event_id' => $eventIds['Jornada Médica en Chulucanas'] ?? '',
                'nombre' => 'Útiles Escolares',
                'categoria' => 'educación',
                'unidad' => 'kit',
                'cantidad_requerida' => 60,
                'cantidad_cubierta' => 0,
                'precio_unitario_estimado' => 12.00,
            ],
        ];

        foreach ($supplyItems as $item) {
            $item['created_at'] = $now;
            DB::table('supply_items')->insert($item);
        }
    }
}
