import MusicDAO from '../dao/MusicDAO';
import { Song, Playlist, UserProfile } from '../models/MusicModel';

class MusicController {
  private static instance: MusicController;
  private dao = MusicDAO.getInstance();

  private constructor() {}

  static getInstance(): MusicController {
    if (!MusicController.instance) {
      MusicController.instance = new MusicController();
    }
    return MusicController.instance;
  }

  login(email: string, password: string): boolean {
    const user = this.dao.login(email, password);
    if (!user) return false;
    this.dao.saveUser(user);
    return true;
  }

  logout(): void {
    this.dao.clearUser();
  }

  isAuthenticated(): boolean {
    return !!this.dao.getUser();
  }

  getCurrentUser(): UserProfile | null {
    return this.dao.getUser();
  }

  getAllSongs(): Song[] {
    return this.dao.getAllSongs();
  }

  getPopularSongs(limit: number): Song[] {
    return this.dao.getPopularSongs(limit);
  }

  getGenres(): string[] {
    return this.dao.getGenres();
  }

  searchSongs(query: string): Song[] {
    return this.dao.searchSongs(query);
  }

  getRecommendations(limit: number): Song[] {
    const history = this.getHistory();
    if (history.length === 0) return this.getPopularSongs(limit);
    const recommended = this.getAllSongs()
      .filter((s) => !history.some((h) => h.songId === s.id))
      .slice(0, limit);
    return recommended;
  }

  getHistory() {
    return this.dao.getHistory();
  }

  addToHistory(songId: string): void {
    this.dao.addHistory(songId);
  }

  clearHistory(): void {
    this.dao.clearHistory();
  }

  getFavorites(): string[] {
    return this.dao.getFavorites();
  }

  toggleFavorite(songId: string): string[] {
    return this.dao.toggleFavorite(songId);
  }

  getAllPlaylists(): Playlist[] {
    return this.dao.getPlaylists();
  }

  addPlaylist(name: string): void {
    const current = this.getAllPlaylists();
    this.dao.savePlaylists([...current, { id: Date.now().toString(), name, songs: [] }]);
  }

  deletePlaylist(id: string): void {
    const filtered = this.getAllPlaylists().filter((p) => p.id !== id);
    this.dao.savePlaylists(filtered);
  }

  getUserStats() {
    const history = this.dao.getHistory();
    return {
      totalPlays: history.length,
      favoriteGenres: [],
      favoriteArtists: [],
    };
  }
}

export default MusicController;
