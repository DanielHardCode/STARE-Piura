<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    use ApiResponse;

    public function store(StoreTransactionRequest $request)
    {
        $transaction = Transaction::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($transaction);
    }

    public function getBalances()
    {
        $cajaChica = Transaction::where('fondo', 'caja_chica')
            ->get()
            ->sum(fn ($t) => $t->tipo === 'ingreso' ? $t->monto : -$t->monto);

        $fondoAdquisicion = Transaction::where('fondo', 'fondo_adquisicion')
            ->get()
            ->sum(fn ($t) => $t->tipo === 'ingreso' ? $t->monto : -$t->monto);

        return $this->success([
            'caja_chica' => max(0, $cajaChica),
            'fondo_adquisicion' => max(0, $fondoAdquisicion),
        ]);
    }
}
