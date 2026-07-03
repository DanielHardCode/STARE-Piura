-- ============================================================
-- STARE Piura — Script para crear la tabla profiles en Supabase
-- Versión corregida (FK, CHECK, RLS)
-- ============================================================

-- 1. Crear la tabla profiles con FK a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'coordinador'
        CHECK (role IN ('admin', 'coordinador', 'voluntario')),
    telefono TEXT,
    avatar_url TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS
-- Cada usuario solo puede ver/actualizar su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Solo se puede insertar el perfil propio
CREATE POLICY "Usuarios pueden insertar su propio perfil"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Opcional: nadie puede eliminar perfiles
CREATE POLICY "No se permite eliminar perfiles"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (false);

-- 4. Trigger opcional (descomentar para que se cree perfil automáticamente al registrar un usuario)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     INSERT INTO public.profiles (id, email, nombre, role)
--     VALUES (
--         NEW.id,
--         NEW.email,
--         COALESCE(NEW.raw_user_meta_data ->> 'nombre', split_part(NEW.email, '@', 1)),
--         COALESCE(NEW.raw_user_meta_data ->> 'role', 'coordinador')
--     );
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION public.handle_new_user();

-- 5. Insertar datos de prueba (ejecutar solo si los usuarios existen en auth.users)
--    Primero crea los usuarios desde Authentication > Users con estos IDs exactos:
-- INSERT INTO public.profiles (id, email, nombre, role, telefono, activo) VALUES
--     ('00000000-0000-0000-0000-000000000001', 'admin@starepiura.org',   'Admin Central',      'admin',       '999888777', TRUE),
--     ('00000000-0000-0000-0000-000000000002', 'coordinador@starepiura.org', 'Coordinador Piura',  'coordinador', '912345678', TRUE),
--     ('00000000-0000-0000-0000-000000000003', 'voluntario@starepiura.org',  'Voluntario Ruta',    'voluntario',  '998877665', TRUE)
-- ON CONFLICT (id) DO NOTHING;

-- 6. Índices recomendados
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
