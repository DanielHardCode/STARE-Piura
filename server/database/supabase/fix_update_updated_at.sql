-- ============================================================================
-- fix_update_updated_at: Función segura para tablas con y sin updated_at
--
-- Problema original: La función update_updated_at() usaba:
--   NEW.updated_at = NOW();
-- Esto fallaba en tablas que NO tienen la columna updated_at (ej: donors,
-- donations, notifications, supply_items, transactions en el modelo original).
--
-- Solución: Verificar si la columna existe antes de asignar.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo actualizar updated_at si la columna existe en la tabla afectada
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = TG_TABLE_NAME
      AND column_name = 'updated_at'
  ) THEN
    NEW.updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;
