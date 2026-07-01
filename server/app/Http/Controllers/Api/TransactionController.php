<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTransactionRequest;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SupabaseService $supabase,
    ) {}

    public function index(Request $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->get('transactions', 'select=*&order=created_at.desc');

        return $this->success($response->json(), $response->status());
    }

    public function show(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->find('transactions', $id);

        $data = $response->json();

        if (empty($data)) {
            return $this->error('Transacción no encontrada', 404);
        }

        return $this->success($data[0]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->create('transactions', [
                'id' => (string) Str::uuid(),
                ...$request->validated(),
            ]);

        return $this->created($response->json());
    }

    public function update(Request $request, string $id)
    {
        $check = $this->supabase
            ->withToken($request->bearerToken())
            ->find('transactions', $id);

        if (empty($check->json())) {
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

        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->update('transactions', $id, $validated);

        return $this->success($response->json()[0] ?? $check->json()[0]);
    }

    public function destroy(Request $request, string $id)
    {
        $response = $this->supabase
            ->withToken($request->bearerToken())
            ->withRepresentation()
            ->delete('transactions', $id);

        if (empty($response->json())) {
            return $this->error('Transacción no encontrada', 404);
        }

        return $this->noContent();
    }

    public function getBalances(Request $request)
    {
        $transactions = $this->supabase
            ->withToken($request->bearerToken())
            ->get('transactions', 'select=tipo,monto,fondo');

        $all = $transactions->json();

        $cajaChica = collect($all)
            ->where('fondo', 'caja_chica')
            ->sum(fn ($t) => $t['tipo'] === 'ingreso' ? $t['monto'] : -$t['monto']);

        $fondoAdquisicion = collect($all)
            ->where('fondo', 'fondo_adquisicion')
            ->sum(fn ($t) => $t['tipo'] === 'ingreso' ? $t['monto'] : -$t['monto']);

        return $this->success([
            'caja_chica' => max(0, $cajaChica),
            'fondo_adquisicion' => max(0, $fondoAdquisicion),
        ]);
    }
}
