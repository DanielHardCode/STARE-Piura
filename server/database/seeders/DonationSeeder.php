<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DonationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $donorIds = DB::table('donors')->pluck('id', 'nombres')->toArray();
        $eventIds = DB::table('events')->pluck('id', 'title')->toArray();

        $donations = [
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['Luis García Mendoza'] ?? '',
                'donor_nombre' => 'Luis García Mendoza',
                'tipo' => 'monetaria',
                'medio_pago' => 'yape',
                'monto' => 250.00,
                'items' => null,
                'descripcion' => 'Donación voluntaria para la campaña de salud.',
                'fondo_destino' => 'general',
                'event_id' => $eventIds['Campaña de Salud en Castilla'] ?? null,
                'comprobante_url' => null,
                'fecha' => Carbon::now()->subDays(3)->format('Y-m-d'),
            ],
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['María Fernanda López Chiroque'] ?? '',
                'donor_nombre' => 'María Fernanda López Chiroque',
                'tipo' => 'monetaria',
                'medio_pago' => 'plin',
                'monto' => 500.00,
                'items' => null,
                'descripcion' => 'Aporte para la feria de apoyo social.',
                'fondo_destino' => 'salud',
                'event_id' => $eventIds['Feria de Apoyo Social en Piura'] ?? null,
                'comprobante_url' => null,
                'fecha' => Carbon::now()->subDays(15)->format('Y-m-d'),
            ],
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['Cooperativa San Martín de Porres'] ?? '',
                'donor_nombre' => 'Cooperativa San Martín de Porres',
                'tipo' => 'monetaria',
                'medio_pago' => 'transferencia',
                'monto' => 2000.00,
                'items' => null,
                'descripcion' => 'Donación corporativa para programa de alimentación.',
                'fondo_destino' => 'alimentos',
                'event_id' => null,
                'comprobante_url' => 'comprobantes/transferencia_sanmartin.pdf',
                'fecha' => Carbon::now()->subDays(7)->format('Y-m-d'),
            ],
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['Panificadora El Trigal S.R.L.'] ?? '',
                'donor_nombre' => 'Panificadora El Trigal S.R.L.',
                'tipo' => 'especie',
                'medio_pago' => null,
                'monto' => null,
                'items' => json_encode([
                    ['item_nombre' => 'Pan de molde', 'cantidad' => 200, 'unidad' => 'unidad'],
                    ['item_nombre' => 'Galletas', 'cantidad' => 150, 'unidad' => 'paquete'],
                ]),
                'descripcion' => 'Donación de productos de panadería para la entrega de víveres.',
                'fondo_destino' => 'alimentos',
                'event_id' => $eventIds['Entrega de Víveres en Catacaos'] ?? null,
                'comprobante_url' => null,
                'fecha' => Carbon::now()->subDays(2)->format('Y-m-d'),
            ],
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['Carlos Enrique Vílchez Rivera'] ?? '',
                'donor_nombre' => 'Carlos Enrique Vílchez Rivera',
                'tipo' => 'monetaria',
                'medio_pago' => 'efectivo',
                'monto' => 120.00,
                'items' => null,
                'descripcion' => 'Aporte voluntario en la jornada médica.',
                'fondo_destino' => 'salud',
                'event_id' => $eventIds['Jornada Médica en Chulucanas'] ?? null,
                'comprobante_url' => null,
                'fecha' => Carbon::now()->addDays(1)->format('Y-m-d'),
            ],
            [
                'id' => (string) Str::uuid(),
                'donor_id' => $donorIds['Ana Cecilia Tavara Samamé'] ?? '',
                'donor_nombre' => 'Ana Cecilia Tavara Samamé',
                'tipo' => 'especie',
                'medio_pago' => null,
                'monto' => null,
                'items' => json_encode([
                    ['item_nombre' => 'Ropa para niños', 'cantidad' => 30, 'unidad' => 'prenda'],
                    ['item_nombre' => 'Útiles escolares', 'cantidad' => 20, 'unidad' => 'kit'],
                ]),
                'descripcion' => 'Donación de ropa y útiles escolares para el albergue.',
                'fondo_destino' => 'general',
                'event_id' => null,
                'comprobante_url' => null,
                'fecha' => Carbon::now()->subDays(5)->format('Y-m-d'),
            ],
        ];

        foreach ($donations as $donation) {
            $donation['created_at'] = $now;
            DB::table('donations')->insert($donation);
        }
    }
}
