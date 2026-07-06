-- =============================================================================
-- STARE Piura — Infraestructura de Evidencias de Visitas de Campo
-- =============================================================================
-- Ejecutar en el SQL Editor de Supabase (Dashboard → SQL Editor)
--
-- Este script crea:
--   1. La tabla `visit_evidences` para registrar fotos y firmas por evento.
--   2. El bucket `visitas` en Storage para almacenar archivos.
--   3. Políticas RLS para la tabla y el bucket.
-- =============================================================================

-- ─── 1. Tabla visit_evidences ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.visit_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('foto_canasta', 'foto_evidencia', 'firma')),
    url TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para búsquedas por evento
CREATE INDEX IF NOT EXISTS idx_visit_evidences_event_id ON public.visit_evidences(event_id);

-- ─── 2. Row Level Security ────────────────────────────────────────────────────

ALTER TABLE public.visit_evidences ENABLE ROW LEVEL SECURITY;

-- Política: INSERT permitido para cualquier usuario autenticado
-- (el backend Laravel valida el rol vía middleware antes de llamar a la API REST)
CREATE POLICY "visit_evidences_insert_authenticated"
    ON public.visit_evidences
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Política: SELECT permitido para admin y coordinador
-- Usa una subconsulta a la tabla profiles para verificar el rol
CREATE POLICY "visit_evidences_select_admin_coordinador"
    ON public.visit_evidences
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.activo = true
            AND profiles.role IN ('admin', 'coordinador')
        )
    );

-- Política: SELECT adicional: el voluntario que creó la evidencia también puede verla
CREATE POLICY "visit_evidences_select_owner"
    ON public.visit_evidences
    FOR SELECT
    TO authenticated
    USING (
        -- Como no tenemos user_id en la tabla, confiamos en que el backend
        -- filtra por event_id. Esta política permite SELECT a todos los
        -- usuarios autenticados para el endpoint GET del backend.
        auth.role() = 'authenticated'
    );

-- ─── 3. Storage Bucket "visitas" ──────────────────────────────────────────────

-- Crear bucket (requiere la extensión storage; ya viene habilitada en Supabase)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'visitas',
    'visitas',
    true,
    5242880, -- 5 MB por archivo
    ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ─── 4. Políticas del Storage Bucket ──────────────────────────────────────────

-- SELECT: cualquier usuario autenticado puede ver/descargar archivos
CREATE POLICY "visitas_select_authenticated"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'visitas');

-- INSERT: cualquier usuario autenticado puede subir archivos al bucket
CREATE POLICY "visitas_insert_authenticated"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'visitas');

-- UPDATE: el propietario del archivo puede sobrescribirlo
CREATE POLICY "visitas_update_owner"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'visitas' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'visitas' AND owner = auth.uid());

-- DELETE: el propietario del archivo puede eliminarlo
CREATE POLICY "visitas_delete_owner"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'visitas' AND owner = auth.uid());
