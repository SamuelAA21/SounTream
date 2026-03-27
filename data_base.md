-- =============================================================
--  SoundTream — Esquema completo para Supabase (PostgreSQL)
--  Ejecutar en: Supabase Dashboard > SQL Editor
--  Orden de ejecución: este archivo completo, de arriba a abajo
-- =============================================================


-- =============================================================
--  EXTENSIONES
-- =============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- gen para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- funciones criptográficas


-- =============================================================
--  FUNCIÓN GLOBAL: updated_at automático
-- =============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================================
--  TABLA: profiles
--  Supabase maneja auth.users internamente.
--  Esta tabla extiende ese usuario con datos del perfil.
--  La FK apunta a auth.users (tabla interna de Supabase Auth).
-- =============================================================
CREATE TABLE public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  display_name VARCHAR(100),
  avatar_url   VARCHAR(1000),
  bio          TEXT,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_profiles_username ON public.profiles (username);

-- Trigger: crear perfil automáticamente cuando un usuario se registra en Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================================
--  TABLA: artists
-- =============================================================
CREATE TABLE public.artists (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  bio         TEXT,
  avatar_url  VARCHAR(1000),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_name ON public.artists (name);
CREATE INDEX idx_artists_fts  ON public.artists USING GIN (to_tsvector('spanish', name));


-- =============================================================
--  TABLA: albums
-- =============================================================
CREATE TABLE public.albums (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id     UUID         NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  release_date  DATE,
  cover_url     VARCHAR(1000),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_albums_artist_id ON public.albums (artist_id);


-- =============================================================
--  TABLA: songs
--  storage_key: clave en Supabase Storage (bucket/carpeta/archivo)
--  storage_provider: 'supabase' para Storage nativo, 's3' para externo
--  public_url: URL pública del CDN (null si se usa signed URL)
-- =============================================================
CREATE TABLE public.songs (
  id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id                UUID          REFERENCES public.albums(id) ON DELETE SET NULL,
  title                   VARCHAR(255)  NOT NULL,
  duration_seconds        INTEGER       NOT NULL CHECK (duration_seconds > 0),
  storage_key             VARCHAR(1000) NOT NULL UNIQUE,   -- ej: "audio/2024/uuid.mp3"
  storage_provider        VARCHAR(20)   NOT NULL DEFAULT 'supabase'
                            CHECK (storage_provider IN ('supabase', 's3', 'gcs', 'r2', 'local')),
  public_url              VARCHAR(1000),                   -- URL del CDN o null para signed URLs
  file_size_bytes         BIGINT        CHECK (file_size_bytes > 0),
  mime_type               VARCHAR(50)   NOT NULL DEFAULT 'audio/mpeg',
  bitrate_kbps            SMALLINT,
  track_number            SMALLINT      CHECK (track_number > 0),
  is_explicit             BOOLEAN       NOT NULL DEFAULT FALSE,
  play_count              BIGINT        NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_album_id         ON public.songs (album_id);
CREATE INDEX idx_songs_title            ON public.songs (title);
CREATE INDEX idx_songs_storage_provider ON public.songs (storage_provider);
CREATE INDEX idx_songs_fts              ON public.songs USING GIN (to_tsvector('spanish', title));


-- =============================================================
--  TABLA: song_artists  (N:M — colaboraciones y features)
-- =============================================================
CREATE TABLE public.song_artists (
  song_id    UUID        NOT NULL REFERENCES public.songs(id)   ON DELETE CASCADE,
  artist_id  UUID        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  role       VARCHAR(50) NOT NULL DEFAULT 'main'
               CHECK (role IN ('main', 'featured', 'producer', 'composer', 'remixer')),
  PRIMARY KEY (song_id, artist_id)
);

CREATE INDEX idx_song_artists_artist_id ON public.song_artists (artist_id);


-- =============================================================
--  TABLA: playlists
-- =============================================================
CREATE TABLE public.playlists (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  is_public   BOOLEAN      NOT NULL DEFAULT FALSE,
  cover_url   VARCHAR(1000),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_playlists_user_id ON public.playlists (user_id);


-- =============================================================
--  TABLA: playlist_songs  (N:M con orden de reproducción)
-- =============================================================
CREATE TABLE public.playlist_songs (
  playlist_id  UUID      NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id      UUID      NOT NULL REFERENCES public.songs(id)     ON DELETE CASCADE,
  position     SMALLINT  NOT NULL CHECK (position >= 0),
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (playlist_id, song_id),
  UNIQUE (playlist_id, position)
);

CREATE INDEX idx_playlist_songs_song_id  ON public.playlist_songs (song_id);
CREATE INDEX idx_playlist_songs_position ON public.playlist_songs (playlist_id, position);


-- =============================================================
--  TABLA: play_history
--  playlist_id nullable: una canción puede reproducirse fuera de playlist
-- =============================================================
CREATE TABLE public.play_history (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  song_id                 UUID        NOT NULL REFERENCES public.songs(id)     ON DELETE CASCADE,
  playlist_id             UUID                 REFERENCES public.playlists(id) ON DELETE SET NULL,
  duration_played_seconds INTEGER     CHECK (duration_played_seconds >= 0),
  played_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_play_history_user_played   ON public.play_history (user_id, played_at DESC);
CREATE INDEX idx_play_history_song_id       ON public.play_history (song_id);
CREATE INDEX idx_play_history_played_at     ON public.play_history (played_at DESC);


-- =============================================================
--  TABLA: likes  (favoritos usuario ↔ canción)
-- =============================================================
CREATE TABLE public.likes (
  user_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id   UUID        NOT NULL REFERENCES public.songs(id)    ON DELETE CASCADE,
  liked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, song_id)
);

CREATE INDEX idx_likes_song_id ON public.likes (song_id);
CREATE INDEX idx_likes_user_id ON public.likes (user_id);


-- =============================================================
--  TRIGGER: incrementar play_count en songs automáticamente
-- =============================================================
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.songs
  SET play_count = play_count + 1
  WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_play_count
  AFTER INSERT ON public.play_history
  FOR EACH ROW EXECUTE FUNCTION increment_play_count();


-- =============================================================
--  ROW LEVEL SECURITY (RLS) — Supabase lo requiere
--  Cada tabla necesita políticas explícitas de acceso.
-- =============================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfil visible para todos"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuario edita su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- artists (solo lectura pública; escritura solo con rol admin en el futuro)
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artistas visibles para todos"
  ON public.artists FOR SELECT USING (true);


-- albums
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Álbumes visibles para todos"
  ON public.albums FOR SELECT USING (true);


-- songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Canciones visibles para todos"
  ON public.songs FOR SELECT USING (true);


-- song_artists
ALTER TABLE public.song_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Song artists visibles para todos"
  ON public.song_artists FOR SELECT USING (true);


-- playlists: públicas visibles para todos, privadas solo para el dueño
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlists públicas visibles para todos"
  ON public.playlists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Usuario crea sus playlists"
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita sus playlists"
  ON public.playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario elimina sus playlists"
  ON public.playlists FOR DELETE
  USING (auth.uid() = user_id);


-- playlist_songs
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver canciones de playlists accesibles"
  ON public.playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id
        AND (p.is_public = true OR p.user_id = auth.uid())
    )
  );

CREATE POLICY "Agregar canciones a mis playlists"
  ON public.playlist_songs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Eliminar canciones de mis playlists"
  ON public.playlist_songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id AND p.user_id = auth.uid()
    )
  );


-- play_history: solo el propio usuario ve y crea su historial
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve su historial"
  ON public.play_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario registra reproducciones"
  ON public.play_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- likes: el usuario ve y gestiona sus propios likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve sus likes"
  ON public.likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario da like"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario quita like"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Contar likes de una canción (acceso público)
CREATE POLICY "Likes de canciones visibles para todos"
  ON public.likes FOR SELECT
  USING (true);


-- =============================================================
--  VISTAS
-- =============================================================

-- Canción con artista y álbum completo
CREATE OR REPLACE VIEW public.v_songs_full AS
SELECT
  s.id                AS song_id,
  s.title             AS song_title,
  s.duration_seconds,
  s.storage_key,
  s.storage_provider,
  s.public_url,
  s.play_count,
  s.is_explicit,
  al.id               AS album_id,
  al.title            AS album_title,
  al.cover_url        AS album_cover,
  al.release_date,
  ar.id               AS artist_id,
  ar.name             AS artist_name,
  ar.avatar_url       AS artist_avatar,
  sa.role             AS artist_role
FROM public.songs s
LEFT JOIN public.albums al        ON al.id = s.album_id
LEFT JOIN public.song_artists sa  ON sa.song_id = s.id
LEFT JOIN public.artists ar       ON ar.id = sa.artist_id;


-- Canciones de una playlist ordenadas
CREATE OR REPLACE VIEW public.v_playlist_songs AS
SELECT
  p.id             AS playlist_id,
  p.name           AS playlist_name,
  p.user_id        AS owner_id,
  p.is_public,
  ps.position,
  ps.added_at,
  s.id             AS song_id,
  s.title          AS song_title,
  s.duration_seconds,
  s.storage_key,
  s.public_url,
  s.is_explicit,
  ar.name          AS artist_name,
  al.cover_url     AS album_cover
FROM public.playlists p
JOIN public.playlist_songs ps     ON ps.playlist_id = p.id
JOIN public.songs s               ON s.id = ps.song_id
LEFT JOIN public.song_artists sa  ON sa.song_id = s.id AND sa.role = 'main'
LEFT JOIN public.artists ar       ON ar.id = sa.artist_id
LEFT JOIN public.albums al        ON al.id = s.album_id
ORDER BY p.id, ps.position;


-- Top 50 canciones más reproducidas (útil para sección "Trending")
CREATE OR REPLACE VIEW public.v_top_songs AS
SELECT
  s.id,
  s.title,
  s.play_count,
  s.duration_seconds,
  s.public_url,
  s.storage_key,
  ar.name AS artist_name,
  al.cover_url
FROM public.songs s
LEFT JOIN public.song_artists sa ON sa.song_id = s.id AND sa.role = 'main'
LEFT JOIN public.artists ar      ON ar.id = sa.artist_id
LEFT JOIN public.albums al       ON al.id = s.album_id
ORDER BY s.play_count DESC
LIMIT 50;


-- =============================================================
--  SUPABASE STORAGE — Configuración del bucket de audio
--  Ejecutar en SQL Editor de Supabase
-- =============================================================

-- Crear bucket para archivos de audio (privado por defecto)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  false,                          -- privado: acceso via signed URLs
  52428800,                       -- 50 MB por archivo máximo
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/flac', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- Crear bucket para imágenes (portadas, avatares) — público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,                           -- público: URL directa sin expiración
  5242880,                        -- 5 MB por imagen
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política storage: usuarios autenticados pueden leer audio
CREATE POLICY "Usuarios autenticados leen audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- Política storage: solo service_role sube audio (desde backend Node.js)
CREATE POLICY "Solo backend sube audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.role() = 'service_role');

-- Política storage: imágenes públicas para todos
CREATE POLICY "Imágenes públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Política storage: usuarios autenticados suben sus imágenes
CREATE POLICY "Usuarios suben imágenes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');


-- =============================================================
--  DATOS SEMILLA (seed para desarrollo)
-- =============================================================

-- Artista de prueba
INSERT INTO public.artists (name, bio, avatar_url) VALUES
  ('The Demo Band', 'Banda de prueba para desarrollo local de SoundTream.', NULL),
  ('DJ Seed', 'Artista electrónico de prueba.', NULL);

-- Álbum de prueba
INSERT INTO public.albums (artist_id, title, release_date)
  SELECT id, 'Demo Album Vol. 1', '2024-01-15'
  FROM public.artists WHERE name = 'The Demo Band';

-- Canciones de prueba (storage_key apunta a Supabase Storage)
INSERT INTO public.songs (album_id, title, duration_seconds, storage_key, storage_provider, mime_type, track_number)
  SELECT
    a.id,
    unnest(ARRAY['Demo Track 1', 'Demo Track 2', 'Demo Track 3']),
    unnest(ARRAY[213, 187, 254]),
    unnest(ARRAY['audio/demo/track1.mp3', 'audio/demo/track2.mp3', 'audio/demo/track3.mp3']),
    'local',
    'audio/mpeg',
    unnest(ARRAY[1, 2, 3]::SMALLINT[])
  FROM public.albums a WHERE a.title = 'Demo Album Vol. 1';

-- Relación song_artists para las canciones semilla
INSERT INTO public.song_artists (song_id, artist_id, role)
  SELECT s.id, ar.id, 'main'
  FROM public.songs s
  JOIN public.albums al ON al.id = s.album_id
  JOIN public.artists ar ON ar.name = 'The Demo Band'
  WHERE al.title = 'Demo Album Vol. 1';


-- =============================================================
--  NOTAS DE IMPLEMENTACIÓN EN NODE.JS
-- =============================================================
--
--  1. OBTENER URL DE AUDIO (signed URL desde backend):
--
--     const { data } = await supabase.storage
--       .from('audio')
--       .createSignedUrl(song.storage_key, 3600); // expira en 1 hora
--     // data.signedUrl → enviar al cliente para reproducir
--
--  2. SUBIR ARCHIVO DE AUDIO (desde backend con service_role):
--
--     const { data, error } = await supabase.storage
--       .from('audio')
--       .upload(`audio/${Date.now()}-${filename}`, fileBuffer, {
--         contentType: 'audio/mpeg',
--         upsert: false
--       });
--     // Guardar data.path como storage_key en tabla songs
--
--  3. REGISTRAR REPRODUCCIÓN:
--
--     await supabase.from('play_history').insert({
--       user_id: user.id,
--       song_id: song.id,
--       playlist_id: currentPlaylist?.id ?? null,
--       duration_played_seconds: secondsPlayed
--     });
--     // El trigger incrementa play_count automáticamente
--
--  4. BUSCAR CANCIONES (full-text):
--
--     const { data } = await supabase
--       .from('v_songs_full')
--       .select('*')
--       .textSearch('song_title', query, { config: 'spanish' });
-- =============================================================