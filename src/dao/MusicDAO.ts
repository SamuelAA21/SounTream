// ============================================
// DAO - Data Access Object (Acceso a Datos)
// ============================================

import { Song, UserProfile, UserHistory, Playlist, musicDatabase } from '../models/MusicModel';

class MusicDAO {
  private static instance: MusicDAO;
  private readonly STORAGE_KEY = 'soundwave_data';

  private constructor() {}

  static getInstance(): MusicDAO {
    if (!MusicDAO.instance) {
      MusicDAO.instance = new MusicDAO();
    }
    return MusicDAO.instance;
  }

  // ==================== SONGS ====================
  
  getAllSongs(): Song[] {
    return musicDatabase;
  }

  getSongById(id: string): Song | undefined {
    return musicDatabase.find(song => song.id === id);
  }

  getSongsByGenre(genre: string): Song[] {
    return musicDatabase.filter(song => song.genre === genre);
  }

  searchSongs(query: string): Song[] {
    const lowerQuery = query.toLowerCase();
    return musicDatabase.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album.toLowerCase().includes(lowerQuery)
    );
  }

  getGenres(): string[] {
    const genres = new Set(musicDatabase.map(song => song.genre));
    return Array.from(genres).sort();
  }

  // ==================== USER ====================

  saveUser(user: UserProfile): void {
    const data = this.loadAllData();
    data.user = user;
    this.saveAllData(data);
  }

  loadUser(): UserProfile | null {
    const data = this.loadAllData();
    return data.user || null;
  }

  deleteUser(): void {
    const data = this.loadAllData();
    data.user = null;
    this.saveAllData(data);
  }

  // ==================== PLAYLISTS ====================

  getAllPlaylists(): Playlist[] {
    const data = this.loadAllData();
    return data.playlists || [];
  }

  getPlaylistById(id: string): Playlist | undefined {
    const playlists = this.getAllPlaylists();
    return playlists.find(p => p.id === id);
  }

  savePlaylist(playlist: Playlist): void {
    const data = this.loadAllData();
    const playlists = data.playlists || [];
    
    const index = playlists.findIndex(p => p.id === playlist.id);
    if (index >= 0) {
      playlists[index] = playlist;
    } else {
      playlists.push(playlist);
    }
    
    data.playlists = playlists;
    this.saveAllData(data);
  }

  deletePlaylist(id: string): void {
    const data = this.loadAllData();
    data.playlists = (data.playlists || []).filter(p => p.id !== id);
    this.saveAllData(data);
  }

  // ==================== LIBRARY (FAVORITOS) ====================

  getFavorites(): string[] {
    const data = this.loadAllData();
    return data.favorites || [];
  }

  addFavorite(songId: string): void {
    const data = this.loadAllData();
    const favorites = data.favorites || [];
    
    if (!favorites.includes(songId)) {
      favorites.push(songId);
      data.favorites = favorites;
      this.saveAllData(data);
    }
  }

  removeFavorite(songId: string): void {
    const data = this.loadAllData();
    data.favorites = (data.favorites || []).filter(id => id !== songId);
    this.saveAllData(data);
  }

  isFavorite(songId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(songId);
  }

  // ==================== PRIVATE METHODS ====================

  private loadAllData(): any {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading data:', error);
      return {};
    }
  }

  private saveAllData(data: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

export default MusicDAO;
