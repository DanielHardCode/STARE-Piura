<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $organizations = [
            [
                'id' => (string) Str::uuid(),
                'nombre' => 'Comedor Popular San José',
                'tipo' => 'comedor',
                'direccion' => 'Av. Principal 123, Piura Centro',
                'distrito' => 'Piura Centro',
                'telefono' => '973456789',
                'encargado' => 'Rosa María Castillo',
                'email' => 'comedor.sanjose@example.com',
                'beneficiarios_estimados' => 180,
                'necesidades' => json_encode(['víveres', 'menestras', 'aceite', 'arroz', 'fideos']),
                'activo' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombre' => 'Albergue Infantil Santa Rosa',
                'tipo' => 'albergue',
                'direccion' => 'Jr. Las Flores 456, Castilla',
                'distrito' => 'Castilla',
                'telefono' => '974567890',
                'encargado' => 'Pedro Huamán Vilchez',
                'email' => 'albergue.santarosa@example.com',
                'beneficiarios_estimados' => 65,
                'necesidades' => json_encode(['pañales', 'leche fórmula', 'ropa', 'útiles escolares', 'medicinas']),
                'activo' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombre' => 'Asilo San Francisco de Asís',
                'tipo' => 'asilo',
                'direccion' => 'Calle Los Olivos 789, Veintiséis de Octubre',
                'distrito' => 'Veintiséis de Octubre',
                'telefono' => '975678901',
                'encargado' => 'Carmen Gutiérrez López',
                'email' => 'asilo.sanfrancisco@example.com',
                'beneficiarios_estimados' => 45,
                'necesidades' => json_encode(['medicinas', 'pañales para adulto', 'colchones', 'sillas de ruedas', 'abrigo']),
                'activo' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombre' => 'Comedor Virgen del Carmen',
                'tipo' => 'comedor',
                'direccion' => 'Prolongación Grau 321, Catacaos',
                'distrito' => 'Catacaos',
                'telefono' => '976789012',
                'encargado' => 'Juan Carlos Meza Sandoval',
                'email' => 'comedor.virgencarmen@example.com',
                'beneficiarios_estimados' => 220,
                'necesidades' => json_encode(['arroz', 'fideos', 'aceite', 'conservas', 'menestras']),
                'activo' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'nombre' => 'Albergue María Auxiliadora',
                'tipo' => 'albergue',
                'direccion' => 'Av. Circunvalación 654, Chulucanas',
                'distrito' => 'Chulucanas',
                'telefono' => '977890123',
                'encargado' => 'María Elena Palomino',
                'email' => 'albergue.mariaauxiliadora@example.com',
                'beneficiarios_estimados' => 90,
                'necesidades' => json_encode(['víveres', 'ropa', 'medicinas', 'útiles de aseo', 'colchones']),
                'activo' => true,
            ],
        ];

        foreach ($organizations as $org) {
            $org['created_at'] = $now;
            $org['updated_at'] = $now;
            DB::table('organizations')->insert($org);
        }
    }
}
