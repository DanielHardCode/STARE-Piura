<?php

namespace App\Http\Middleware;

use App\Models\Profile;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateSupabase
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token de autenticación no proporcionado'], 401);
        }

        $jwtSecret = env('SUPABASE_JWT_SECRET');

        if (!$jwtSecret) {
            return response()->json(['error' => 'Configuración JWT de Supabase no encontrada'], 500);
        }

        try {
            $payload = JWT::decode($token, new Key($jwtSecret, 'HS256'));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado'], 401);
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
}
