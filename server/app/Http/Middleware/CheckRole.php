<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $profile = $request->get('auth_profile');

        if (!$profile) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        if (!in_array($profile->role, $roles)) {
            return response()->json(['error' => 'No tienes permisos para realizar esta acción'], 403);
        }

        return $next($request);
    }
}
