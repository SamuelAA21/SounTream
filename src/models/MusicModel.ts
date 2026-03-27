// ============================================
// MODELO - Definición de datos y estructuras
// ============================================

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  genre: string;
  releaseYear: number;
  plays: number;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

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
