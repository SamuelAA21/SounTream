import { Song, Playlist, UserProfile, UserHistory } from '../models/MusicModel';
import { mockSongs, mockPlaylists } from '../app/data/mockData';

const USER_KEY = 'soundwave_user';
const HISTORY_KEY = 'soundwave_history';
const FAVORITES_KEY = 'soundwave_favorites';
const PLAYLISTS_KEY = 'soundwave_playlists';

export default class MusicDAO {
  private static instance: MusicDAO;

  private constructor() {}

  static getInstance(): MusicDAO {
    if (!MusicDAO.instance) {
      MusicDAO.instance = new MusicDAO();
    }
    return MusicDAO.instance;
  }

  getAllSongs(): Song[] {
    return [...mockSongs];
  }

  getSongById(id: string): Song | undefined {
    return mockSongs.find((song) => song.id === id);
  }

  getGenres(): string[] {
    return Array.from(new Set(mockSongs.map((s) => s.genre))).sort();
  }

  searchSongs(query: string): Song[] {
    const low = query.toLowerCase();
    return mockSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(low) ||
        song.artist.toLowerCase().includes(low) ||
        song.album.toLowerCase().includes(low)
    );
  }

  getPopularSongs(limit: number): Song[] {
    return [...mockSongs].sort((a, b) => b.plays - a.plays).slice(0, limit);
  }

  getHistory(): UserHistory[] {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  }

  addHistory(songId: string): void {
    const history = this.getHistory();
    history.unshift({ songId, playedAt: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }

  getFavorites(): string[] {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  }

  toggleFavorite(songId: string): string[] {
    const fav = this.getFavorites();
    const idx = fav.indexOf(songId);
    if (idx >= 0) fav.splice(idx, 1);
    else fav.push(songId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(fav));
    return fav;
  }

  getPlaylists(): Playlist[] {
    const stored = JSON.parse(localStorage.getItem(PLAYLISTS_KEY) || 'null');
    return stored || [...mockPlaylists];
  }

  savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }

  login(email: string, password: string): UserProfile | null {
    if (email === 'demo@soundwave.com' && password === 'demo123') {
      return {
        id: '1',
        email,
        favoriteGenres: [],
        favoriteArtists: [],
        history: [],
      };
    }
    return null;
  }

  saveUser(user: UserProfile): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): UserProfile | null {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}
