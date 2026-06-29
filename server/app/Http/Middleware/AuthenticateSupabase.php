<?php

namespace App\Http\Middleware;

use App\Models\Profile;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateSupabase
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token de autenticación no proporcionado'], 401);
        }

        $supabaseUrl = config('services.supabase.url');
        $anonKey = config('services.supabase.anon_key');

        if (!$supabaseUrl) {
            return response()->json(['error' => 'Configuración de Supabase no encontrada (SUPABASE_URL)'], 500);
        }

        if (!$anonKey) {
            return response()->json(['error' => 'Configuración de Supabase no encontrada (SUPABASE_ANON_KEY)'], 500);
        }

        try {
            // 1. Extraer kid del header del token sin verificar firma
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                throw new \Exception('Formato de token inválido');
            }

            $header = JWT::jsonDecode(JWT::urlsafeB64Decode($parts[0]));
            $kid = $header->kid ?? null;

            if (!$kid) {
                throw new \Exception('Token sin identificador de clave (kid)');
            }

            // 2. Obtener JWKS (cacheado 24h) y parsear claves
            $keys = $this->getJwksKeys($supabaseUrl, $anonKey);

            // 3. Buscar clave por kid
            if (!isset($keys[$kid])) {
                // Rotación de claves: re-consultar JWKS
                Cache::forget('supabase_jwks');
                $keys = $this->getJwksKeys($supabaseUrl, $anonKey);
            }

            if (!isset($keys[$kid])) {
                throw new \Exception('Clave pública no encontrada para el kid del token');
            }

            // 4. Verificar token con la clave pública ES256
            $payload = JWT::decode($token, $keys[$kid]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado: ' . $e->getMessage()], 401);
        }

        $userId = $payload->sub ?? null;

        if (!$userId) {
            return response()->json(['error' => 'Token sin identificador de usuario'], 401);
        }

        $profile = Profile::find($userId);

        if (!$profile) {
            return response()->json(['error' => 'Perfil de usuario no encontrado'], 403);
        }

        if (!$profile->activo) {
            return response()->json(['error' => 'Usuario inactivo'], 403);
        }

        $request->merge(['auth_profile' => $profile]);
        $request->setUserResolver(fn () => $profile);

        return $next($request);
    }

    private function getJwksKeys(string $supabaseUrl, string $anonKey): array
    {
        $fromCache = true;

        $jwksArray = Cache::remember('supabase_jwks', 86400, function () use ($supabaseUrl, $anonKey, &$fromCache) {
            $fromCache = false;

            $baseUrl = rtrim(trim($supabaseUrl), '/');
            $jwksUrl = "{$baseUrl}/auth/v1/.well-known/jwks.json";

            $isLocal = app()->environment('local') || config('app.debug');

            $http = Http::timeout(5)->withHeaders(['apikey' => $anonKey]);

            if ($isLocal) {
                $http->withOptions(['verify' => false]);
                logger()->warning('Verificación SSL desactivada para petición JWKS a Supabase (entorno local).');
            }

            logger()->info('Consultando JWKS de Supabase', ['url' => $jwksUrl]);

            $response = $http->get($jwksUrl);

            if (!$response->successful()) {
                throw new \Exception(
                    'Error al obtener JWKS de Supabase: HTTP ' . $response->status()
                );
            }

            return $response->json();
        });

        logger()->debug($fromCache ? 'JWKS obtenido desde caché' : 'JWKS obtenido desde endpoint');

        return JWK::parseKeySet($jwksArray ?? ['keys' => []], 'ES256');
    }
}
