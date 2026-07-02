<?php

use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\MypeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SupplyItemController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| STARE Piura — API Routes
|--------------------------------------------------------------------------
|
| Endpoints consumidos por los repositorios SupabaseLaravel del frontend.
| Las lecturas (GET) van directo a Supabase. Este API maneja escrituras.
|
| Todas las rutas requieren autenticación via JWT de Supabase.
| El middleware `auth.supabase` valida el token y carga el perfil.
| El middleware `role` restringe endpoints según el rol del usuario.
|
*/

Route::middleware('auth.supabase')->group(function () {

    // ─── Rutas CRUD principales (coordinador o admin) ──────────────
    Route::middleware('role:admin,coordinador,voluntario')->group(function () {
        Route::apiResource('organizations', OrganizationController::class);
        Route::apiResource('mypes', MypeController::class);
        Route::apiResource('donors', DonorController::class);
        Route::apiResource('donations', DonationController::class);
        Route::apiResource('events', EventController::class);
        Route::apiResource('supply-items', SupplyItemController::class)->parameters(['supply-items' => 'supplyItem']);
        Route::apiResource('supply-bags', \App\Http\Controllers\Api\SupplyBagController::class)->parameters(['supply-bags' => 'supplyBag']);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('notifications', NotificationController::class);

        // ─── Rutas adicionales del módulo financiero y logístico ────
        Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::post('/supply-items/{id}/cubrir', [SupplyItemController::class, 'cubrir']);
    });

    // ─── Rutas exclusivas para admin ────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('/balances', [TransactionController::class, 'getBalances']);
        Route::get('/users', [ProfileController::class, 'index']);
        Route::get('/users/{id}', [ProfileController::class, 'show']);
        Route::put('/users/{id}', [ProfileController::class, 'update']);
    });

});
