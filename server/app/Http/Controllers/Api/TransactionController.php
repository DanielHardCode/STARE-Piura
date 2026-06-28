<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $transactions = Transaction::orderBy('created_at', 'desc')->get();
        return $this->success($transactions);
    }

    public function show(string $id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return $this->error('Transacción no encontrada', 404);
        }
        return $this->success($transaction);
    }

    public function store(StoreTransactionRequest $request)
    {
        $transaction = Transaction::create([
            'id' => (string) Str::uuid(),
            ...$request->validated(),
        ]);

        return $this->created($transaction);
    }

    public function update(Request $request, string $id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return $this->error('Transacción no encontrada', 404);
        }

        $validated = $request->validate([
            'tipo' => 'sometimes|in:ingreso,egreso',
            'concepto' => 'sometimes|string|max:255',
            'monto' => 'sometimes|numeric|min:0',
            'fondo' => 'sometimes|string|max:50',
            'fecha' => 'sometimes|date',
            'donation_id' => 'nullable|string|max:50',
        ]);

        $transaction->update($validated);
        return $this->success($transaction->fresh());
    }

    public function destroy(string $id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return $this->error('Transacción no encontrada', 404);
        }
        $transaction->delete();
        return $this->noContent();
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
