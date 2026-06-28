<?php

use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\MypeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrganizationController;
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
| Recursos CRUD — cada apiResource registra:
|   GET    /{resource}        → index()
|   GET    /{resource}/{id}   → show()
|   POST   /{resource}        → store()
|   PUT    /{resource}/{id}   → update()
|   DELETE /{resource}/{id}   → destroy()
|
*/

Route::apiResource('organizations', OrganizationController::class);
Route::apiResource('mypes', MypeController::class);
Route::apiResource('donors', DonorController::class);
Route::apiResource('donations', DonationController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('supply-items', SupplyItemController::class)->parameters(['supply-items' => 'supplyItem']);
Route::apiResource('transactions', TransactionController::class);
Route::apiResource('notifications', NotificationController::class);

// ─── Rutas adicionales no cubiertas por apiResource ────────────────
Route::get('/balances', [TransactionController::class, 'getBalances']);
Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
