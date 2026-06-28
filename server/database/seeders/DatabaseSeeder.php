<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            ProfileSeeder::class,
            OrganizationSeeder::class,
            MypeSeeder::class,
            DonorSeeder::class,
            EventSeeder::class,
            DonationSeeder::class,
            SupplyItemSeeder::class,
            TransactionSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
