<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $profile = $request->user() ?? $request->get('auth_profile');

        if (!$profile) {
            logger()->warning('CheckRole: perfil no encontrado en request', [
                'uri' => $request->path(),
                'has_user' => $request->user() !== null,
                'has_auth_profile' => $request->has('auth_profile'),
            ]);

            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $userRole = $profile->role ?? null;

        logger()->debug('CheckRole: verificando permisos', [
            'user_id' => $profile->id ?? null,
            'user_email' => $profile->email ?? null,
            'user_role' => $userRole,
            'roles_requeridos' => $roles,
            'uri' => $request->path(),
        ]);

        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json([
                'error' => 'No tienes permisos para realizar esta acción',
                'user_role' => $userRole,
                'required_roles' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
