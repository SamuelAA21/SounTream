// ============================================
// MODELO - Definición de datos y estructuras
// Alineado con el esquema de Supabase
// ============================================

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Album {
  id: string;
  artist_id: string;
  title: string;
  release_date?: string;
  cover_url?: string;
  created_at: string;
}

export interface Song {
  id: string;
  album_id?: string;
  title: string;
  duration_seconds: number;
  storage_key: string;
  storage_provider: string;
  public_url?: string;
  file_size_bytes?: number;
  mime_type: string;
  bitrate_kbps?: number;
  track_number?: number;
  is_explicit: boolean;
  play_count: number;
  created_at: string;
}

export interface SongArtist {
  song_id: string;
  artist_id: string;
  role: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistSong {
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
}

export interface PlayHistory {
  id: string;
  user_id: string;
  song_id: string;
  playlist_id?: string;
  duration_played_seconds?: number;
  played_at: string;
}

export interface Like {
  user_id: string;
  song_id: string;
  liked_at: string;
}

// Views
export interface SongFull {
  song_id: string;
  song_title: string;
  duration_seconds: number;
  storage_key: string;
  storage_provider: string;
  public_url?: string;
  play_count: number;
  is_explicit: boolean;
  album_id?: string;
  album_title?: string;
  album_cover?: string;
  release_date?: string;
  artist_id?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_role?: string;
}

export interface PlaylistSongView {
  playlist_id: string;
  playlist_name: string;
  owner_id: string;
  is_public: boolean;
  position: number;
  added_at: string;
  song_id: string;
  song_title: string;
  duration_seconds: number;
  storage_key: string;
  public_url?: string;
  is_explicit: boolean;
  artist_name?: string;
  album_cover?: string;
}

export interface TopSong {
  id: string;
  title: string;
  play_count: number;
  duration_seconds: number;
  public_url?: string;
  storage_key: string;
  artist_name?: string;
  cover_url?: string;
}

// Legacy interfaces for backward compatibility (to be removed)
export interface UserHistory {
  songId: string;
  playedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  history: UserHistory[];
}
