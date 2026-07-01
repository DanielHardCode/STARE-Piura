<?php

namespace App\Http\Middleware;

use App\Services\SupabaseService;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateSupabase
{
    public function __construct(
        protected SupabaseService $supabase,
    ) {}

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
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                throw new \Exception('Formato de token inválido');
            }

            $header = JWT::jsonDecode(JWT::urlsafeB64Decode($parts[0]));
            $kid = $header->kid ?? null;

            if (!$kid) {
                throw new \Exception('Token sin identificador de clave (kid)');
            }

            $keys = $this->getJwksKeys($supabaseUrl, $anonKey);

            if (!isset($keys[$kid])) {
                Cache::store('file')->forget('supabase_jwks');
                $keys = $this->getJwksKeys($supabaseUrl, $anonKey);
            }

            if (!isset($keys[$kid])) {
                throw new \Exception('Clave pública no encontrada para el kid del token');
            }

            $payload = JWT::decode($token, $keys[$kid]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado: ' . $e->getMessage()], 401);
        }

        $userId = $payload->sub ?? null;

        if (!$userId) {
            return response()->json(['error' => 'Token sin identificador de usuario'], 401);
        }

        // Buscar perfil en Supabase REST API (no en base de datos local)
        $profileResponse = $this->supabase
            ->withToken($token)   // usar el token del usuario, no service_role
            ->find('profiles', $userId);

        $profileData = $profileResponse->json();

        //dd($profileData);

        // Verificar que la respuesta sea un array y tenga al menos un elemento
        if (!is_array($profileData) || count($profileData) === 0) {
            return response()->json(['error' => 'Perfil de usuario no encontrado en Supabase'], 403);
        }

        $profile = $profileData[0];

        if (!($profile['activo'] ?? false)) {
            return response()->json(['error' => 'Usuario inactivo'], 403);
        }

        // Guardar el perfil como atributo (sin afectar los inputs de la request)
        $request->attributes->set('auth_profile', (object) $profile);
        $request->setUserResolver(fn () => (object) $profile);

        return $next($request);
    }

    private function getJwksKeys(string $supabaseUrl, string $anonKey): array
    {
        $cache = Cache::store('file');
        $cacheKey = 'supabase_jwks';

        $jwksArray = $cache->get($cacheKey);

        if ($jwksArray !== null) {
            return JWK::parseKeySet($jwksArray, 'ES256');
        }

        $baseUrl = rtrim(trim($supabaseUrl), '/');
        $jwksUrl = "{$baseUrl}/auth/v1/.well-known/jwks.json";

        $isLocal = app()->environment('local') || config('app.debug');

        $http = Http::timeout(5)->withHeaders(['apikey' => $anonKey]);

        if ($isLocal) {
            $http->withOptions(['verify' => false]);
        }

        $response = $http->get($jwksUrl);

        if (!$response->successful()) {
            throw new \Exception(
                'Error al obtener JWKS de Supabase: HTTP ' . $response->status()
            );
        }

        $jwksArray = $response->json();

        $cache->put($cacheKey, $jwksArray, 86400);

        return JWK::parseKeySet($jwksArray, 'ES256');
    }
}