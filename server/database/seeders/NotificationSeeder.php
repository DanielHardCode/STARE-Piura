<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $notifications = [
            [
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'tipo' => 'success',
                'title' => 'Nueva donación recibida',
                'message' => 'Luis García ha donado S/ 250.00 para la Campaña de Salud en Castilla.',
                'read' => false,
                'data' => json_encode(['donor_nombre' => 'Luis García', 'monto' => 250.00]),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'tipo' => 'info',
                'title' => 'Visita programada',
                'message' => 'La Campaña de Salud en Castilla está programada para el ' . Carbon::now()->addDays(5)->format('d/m/Y') . '.',
                'read' => false,
                'data' => json_encode(['event_id' => null, 'event_title' => 'Campaña de Salud en Castilla']),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'tipo' => 'warning',
                'title' => 'Bajo stock de víveres',
                'message' => 'El Comedor Popular San José tiene menos del 30% de víveres disponibles.',
                'read' => false,
                'data' => json_encode(['organization_id' => null, 'organizacion' => 'Comedor Popular San José']),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'tipo' => 'success',
                'title' => 'Donación corporativa recibida',
                'message' => 'Cooperativa San Martín ha donado S/ 2,000.00 para el programa de alimentación.',
                'read' => true,
                'data' => json_encode(['donor_nombre' => 'Cooperativa San Martín', 'monto' => 2000.00]),
            ],
            [
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'tipo' => 'info',
                'title' => 'Jornada médica completada',
                'message' => 'La Feria de Apoyo Social en Piura se completó exitosamente con más de 300 asistentes.',
                'read' => true,
                'data' => json_encode(['event_id' => null, 'asistentes' => 300]),
            ],
        ];

        foreach ($notifications as $notification) {
            $notification['created_at'] = $now;
            DB::table('notifications')->insert($notification);
        }
    }
}
