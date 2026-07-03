<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $donationIds = DB::table('donations')->pluck('id', 'donor_nombre')->toArray();

        $transactions = [
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'ingreso',
                'concepto' => 'Donación de Luis García para campaña de salud',
                'monto' => 250.00,
                'fondo' => 'general',
                'fecha' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'donation_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'ingreso',
                'concepto' => 'Donación de Cooperativa San Martín',
                'monto' => 2000.00,
                'fondo' => 'alimentos',
                'fecha' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'donation_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'egreso',
                'concepto' => 'Compra de arroz para canastas básicas',
                'monto' => 350.00,
                'fondo' => 'alimentos',
                'fecha' => Carbon::now()->subDays(6)->format('Y-m-d'),
                'donation_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'ingreso',
                'concepto' => 'Donación de María López para feria social',
                'monto' => 500.00,
                'fondo' => 'salud',
                'fecha' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'donation_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'egreso',
                'concepto' => 'Compra de medicamentos para jornada médica',
                'monto' => 750.00,
                'fondo' => 'salud',
                'fecha' => Carbon::now()->subDays(4)->format('Y-m-d'),
                'donation_id' => null,
            ],
            [
                'id' => (string) Str::uuid(),
                'tipo' => 'egreso',
                'concepto' => 'Compra de mantas para campaña de abrigo',
                'monto' => 810.00,
                'fondo' => 'general',
                'fecha' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'donation_id' => null,
            ],
        ];

        foreach ($transactions as $transaction) {
            $transaction['created_at'] = $now;
            DB::table('transactions')->insert($transaction);
        }
    }
}
