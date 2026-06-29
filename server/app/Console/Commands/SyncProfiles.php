<?php

namespace App\Console\Commands;

use App\Models\Profile;
use Illuminate\Console\Command;

class SyncProfiles extends Command
{
    protected $signature = 'sync:profiles
        {id? : UUID del usuario en Supabase Auth}
        {email? : Email del usuario}
        {--nombre= : Nombre del perfil}
        {--role=coordinador : Rol del usuario (admin|coordinador|voluntario)}
        {--telefono= : Teléfono del usuario}
        {--list : Listar todos los perfiles en la base de datos local}';

    protected $description = 'Sincroniza un perfil desde Supabase hacia la base de datos local';

    public function handle(): int
    {
        if ($this->option('list')) {
            return $this->listProfiles();
        }

        $id = $this->argument('id');
        $email = $this->argument('email');

        if (!$id || !$email) {
            $this->error('Debes proporcionar el UUID y el email del usuario.');
            $this->newLine();
            $this->info('Uso: php artisan sync:profiles {uuid} {email} [--role=] [--nombre=] [--telefono=]');
            $this->info('Ejemplo: php artisan sync:profiles 3c743698-0df0-4158-a1b9-7fcd72633380 admin@starepiura.org --role=admin --nombre="Admin Central"');
            return Command::INVALID;
        }

        $data = [
            'id' => $id,
            'email' => $email,
            'nombre' => $this->option('nombre') ?? $email,
            'role' => $this->option('role'),
            'telefono' => $this->option('telefono'),
        ];

        $profile = Profile::updateOrCreate(['id' => $id], $data);

        $action = $profile->wasRecentlyCreated ? 'Creado' : 'Actualizado';
        $this->info("{$action} perfil: {$profile->email} (role: {$profile->role})");

        return Command::SUCCESS;
    }

    private function listProfiles(): int
    {
        $profiles = Profile::all(['id', 'email', 'nombre', 'role', 'activo']);

        if ($profiles->isEmpty()) {
            $this->warn('No hay perfiles en la base de datos local.');
            return Command::SUCCESS;
        }

        $this->table(['UUID', 'Email', 'Nombre', 'Rol', 'Activo'], $profiles->toArray());

        return Command::SUCCESS;
    }
}
