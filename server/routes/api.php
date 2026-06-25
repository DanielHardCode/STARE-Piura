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
*/

Route::post('/organizations', [OrganizationController::class, 'store']);
Route::put('/organizations/{id}', [OrganizationController::class, 'update']);
Route::delete('/organizations/{id}', [OrganizationController::class, 'destroy']);

Route::post('/mypes', [MypeController::class, 'store']);
Route::put('/mypes/{id}', [MypeController::class, 'update']);

Route::post('/donors', [DonorController::class, 'store']);

Route::post('/donations', [DonationController::class, 'store']);
Route::put('/donations/{id}', [DonationController::class, 'update']);

Route::post('/events', [EventController::class, 'store']);
Route::put('/events/{id}', [EventController::class, 'update']);

Route::post('/supply-items', [SupplyItemController::class, 'store']);
Route::put('/supply-items/{id}', [SupplyItemController::class, 'update']);

Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/balances', [TransactionController::class, 'getBalances']);

Route::post('/notifications', [NotificationController::class, 'store']);
Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
