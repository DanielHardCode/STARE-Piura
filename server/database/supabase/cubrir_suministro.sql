-- ============================================================================
-- cubrir_suministro: Actualización atómica con control de concurrencia
--
-- Problema: Si dos usuarios intentan cubrir la última unidad disponible de un
-- suministro al mismo tiempo, ambos podrían obtener una lectura de la misma
-- cantidad actual y ambos creer que hay disponibilidad.
--
-- Solución: Esta función RPC ejecuta un UPDATE ... RETURNING dentro de una
-- transacción. La cláusula WHERE con la condición cantidad_cubierta <
-- cantidad_requerida garantiza que solo el primer UPDATE en la línea de tiempo
-- se ejecute. El segundo UPDATE no afectará ninguna fila y retornará false.
--
-- Uso desde Laravel:
--   POST /rest/v1/rpc/cubrir_suministro
--   Body: { "p_item_id": "uuid-del-item" }
-- ============================================================================

CREATE OR REPLACE FUNCTION cubrir_suministro(p_item_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  UPDATE supply_items
  SET cantidad_cubierta = cantidad_cubierta + 1
  WHERE id = p_item_id
    AND cantidad_cubierta < cantidad_requerida;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  -- Si se actualizó al menos una fila, retornar true
  RETURN v_updated > 0;
END;
$$;
