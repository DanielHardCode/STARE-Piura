<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected string $baseUrl;
    protected string $anonKey;
    protected ?string $serviceRoleKey = null;
    protected ?string $token = null;
    protected bool $useServiceRole = false;
    protected bool $returnRepresentation = false;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.supabase.rest_url'), '/');
        $this->anonKey = config('services.supabase.anon_key');
        $this->serviceRoleKey = config('services.supabase.service_role_key');
    }

    public function withToken(?string $token): static
    {
        $this->token = $token;
        return $this;
    }

    public function asAdmin(): static
    {
        $this->useServiceRole = true;
        return $this;
    }

    public function withRepresentation(): static
    {
        $this->returnRepresentation = true;
        return $this;
    }

    public function get(string $table, string $query = 'select=*'): Response
    {
        return $this->buildRequest()->get("{$this->baseUrl}/{$table}?{$query}");
    }

    public function find(string $table, string $id): Response
    {
        return $this->buildRequest()->get("{$this->baseUrl}/{$table}?id=eq.{$id}&select=*");
    }

    public function create(string $table, array $data): Response
    {
        return $this->buildRequest()->post("{$this->baseUrl}/{$table}", $data);
    }

    public function update(string $table, string $id, array $data): Response
    {
        return $this->buildRequest()->patch("{$this->baseUrl}/{$table}?id=eq.{$id}", $data);
    }

    public function delete(string $table, string $id): Response
    {
        return $this->buildRequest()->delete("{$this->baseUrl}/{$table}?id=eq.{$id}");
    }

    public function raw(string $method, string $uri, array $data = []): Response
    {
        return $this->buildRequest()->{$method}("{$this->baseUrl}/{$uri}", $data);
    }

    protected function buildRequest(): \Illuminate\Http\Client\PendingRequest
    {
        $http = Http::withHeaders([
            'apikey' => $this->anonKey,
            'Accept' => 'application/json',
        ]);

        // Desactivar verificación SSL solo en entorno local (desarrollo)
        if (app()->environment('local')) {
            $http->withOptions(['verify' => false]);
        }

        if ($this->useServiceRole && $this->serviceRoleKey) {
            $http->withToken($this->serviceRoleKey);
        } elseif ($this->token) {
            $http->withToken($this->token);
        } else {
            $http->withHeaders(['Authorization' => "Bearer {$this->anonKey}"]);
        }

        if ($this->returnRepresentation) {
            $http->withHeaders(['Prefer' => 'return=representation']);
        }

        $this->useServiceRole = false;
        $this->token = null;
        $this->returnRepresentation = false;

        return $http;
    }
}