<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $orgIds = DB::table('organizations')->pluck('id', 'nombre')->toArray();

        $events = [
            [
                'id' => (string) Str::uuid(),
                'organization_id' => $orgIds['Comedor Popular San José'] ?? null,
                'organization_nombre' => 'Comedor Popular San José',
                'title' => 'Campaña de Salud en Castilla',
                'description' => 'Jornada de atención médica general y entrega de medicamentos básicos para adultos mayores y niños.',
                'distrito' => 'Castilla',
                'target_audience' => 'Adultos mayores y niños de la zona',
                'start_time' => Carbon::now()->addDays(5)->format('Y-m-d 09:00:00'),
                'end_time' => Carbon::now()->addDays(5)->format('Y-m-d 15:00:00'),
                'status' => 'pendiente',
                'coordinador_id' => null,
                'notes' => 'Se requiere apoyo de 2 médicos voluntarios.',
            ],
            [
                'id' => (string) Str::uuid(),
                'organization_id' => $orgIds['Comedor Virgen del Carmen'] ?? null,
                'organization_nombre' => 'Comedor Virgen del Carmen',
                'title' => 'Entrega de Víveres en Catacaos',
                'description' => 'Reparto de canastas básicas de alimentos para familias en situación de vulnerabilidad.',
                'distrito' => 'Catacaos',
                'target_audience' => 'Familias del distrito de Catacaos',
                'start_time' => Carbon::now()->addDays(12)->format('Y-m-d 10:00:00'),
                'end_time' => Carbon::now()->addDays(12)->format('Y-m-d 14:00:00'),
                'status' => 'pendiente',
                'coordinador_id' => null,
                'notes' => 'Coordinado con la Municipalidad de Catacaos.',
            ],
            [
                'id' => (string) Str::uuid(),
                'organization_id' => $orgIds['Albergue Infantil Santa Rosa'] ?? null,
                'organization_nombre' => 'Albergue Infantil Santa Rosa',
                'title' => 'Feria de Apoyo Social en Piura',
                'description' => 'Evento multisectorial con servicios de salud, orientación legal y distribución de ropa y juguetes.',
                'distrito' => 'Piura Centro',
                'target_audience' => 'Público en general de Piura Centro',
                'start_time' => Carbon::now()->subDays(10)->format('Y-m-d 08:00:00'),
                'end_time' => Carbon::now()->subDays(10)->format('Y-m-d 17:00:00'),
                'status' => 'completado',
                'coordinador_id' => null,
                'notes' => 'Participaron 15 voluntarios. Se atendió a más de 300 personas.',
            ],
            [
                'id' => (string) Str::uuid(),
                'organization_id' => $orgIds['Albergue María Auxiliadora'] ?? null,
                'organization_nombre' => 'Albergue María Auxiliadora',
                'title' => 'Jornada Médica en Chulucanas',
                'description' => 'Atención médica especializada en pediatría y medicina general para la comunidad.',
                'distrito' => 'Chulucanas',
                'target_audience' => 'Niños y madres gestantes de Chulucanas',
                'start_time' => Carbon::now()->addDays(20)->format('Y-m-d 09:30:00'),
                'end_time' => Carbon::now()->addDays(20)->format('Y-m-d 16:00:00'),
                'status' => 'pendiente',
                'coordinador_id' => null,
                'notes' => 'En colaboración con la posta médica de Chulucanas.',
            ],
        ];

        foreach ($events as $event) {
            $event['created_at'] = $now;
            $event['updated_at'] = $now;
            DB::table('events')->insert($event);
        }
    }
}
