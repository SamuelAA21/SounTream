// ============================================
// CONTROLADOR - Lógica de negocio con DAO
// ============================================

import { Song, UserProfile, UserHistory, Playlist } from '../models/MusicModel';
import MusicDAO from '../dao/MusicDAO';

class MusicController {
  private static instance: MusicController;
  private dao: MusicDAO;
  private currentUser: UserProfile | null = null;
  
  private constructor() {
    this.dao = MusicDAO.getInstance();
    this.loadUserFromStorage();
  }

  static getInstance(): MusicController {
    if (!MusicController.instance) {
      MusicController.instance = new MusicController();
    }
    return MusicController.instance;
  }

  // ==================== AUTENTICACIÓN ====================
  
  login(email: string, password: string): boolean {
    if (email === 'demo@soundwave.com' && password === 'demo123') {
      this.currentUser = {
        id: '1',
        email: email,
        favoriteGenres: [],
        favoriteArtists: [],
        history: []
      };
      this.saveUserToStorage();
      return true;
    }
    return false;
  }

  verify2FA(code: string): boolean {
    return code === '123456';
  }

  verifyTwoFactorCode(code: string): { success: boolean; message: string } {
    if (this.verify2FA(code)) {
      return { success: true, message: '' };
    }
    return { success: false, message: 'Código incorrecto. Intenta de nuevo.' };
  }

  logout(): void {
    this.currentUser = null;
    this.dao.deleteUser();
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // ==================== GESTIÓN DE CANCIONES ====================

  getAllSongs(): Song[] {
    return this.dao.getAllSongs();
  }

  getSongById(id: string): Song | undefined {
    return this.dao.getSongById(id);
  }

  getSongsByGenre(genre: string): Song[] {
    return this.dao.getSongsByGenre(genre);
  }

  searchSongs(query: string): Song[] {
    return this.dao.searchSongs(query);
  }

  getGenres(): string[] {
    return this.dao.getGenres();
  }

  // ==================== HISTORIAL ====================

  addToHistory(songId: string): void {
    if (!this.currentUser) return;

    const historyEntry: UserHistory = {
      songId,
      playedAt: new Date()
    };

    this.currentUser.history.unshift(historyEntry);
    
    // Mantener solo las últimas 50 canciones
    if (this.currentUser.history.length > 50) {
      this.currentUser.history = this.currentUser.history.slice(0, 50);
    }

    this.updateUserPreferences();
    this.saveUserToStorage();
  }

  getHistory(): Song[] {
    if (!this.currentUser) return [];

    return this.currentUser.history
      .map(entry => this.getSongById(entry.songId))
      .filter((song): song is Song => song !== undefined);
  }

  clearHistory(): void {
    if (!this.currentUser) return;
    this.currentUser.history = [];
    this.currentUser.favoriteGenres = [];
    this.currentUser.favoriteArtists = [];
    this.saveUserToStorage();
  }

  // ==================== PLAYLISTS ====================

  getAllPlaylists(): Playlist[] {
    return this.dao.getAllPlaylists();
  }

  getPlaylistById(id: string): Playlist | undefined {
    return this.dao.getPlaylistById(id);
  }

  createPlaylist(name: string, songIds: string[] = []): Playlist {
    const songs = songIds
      .map(id => this.getSongById(id))
      .filter((song): song is Song => song !== undefined);

    const playlist: Playlist = {
      id: `pl_${Date.now()}`,
      name,
      songs
    };

    this.dao.savePlaylist(playlist);
    return playlist;
  }

  addSongToPlaylist(playlistId: string, songId: string): boolean {
    const playlist = this.getPlaylistById(playlistId);
    const song = this.getSongById(songId);
    
    if (!playlist || !song) return false;
    
    // Verificar si la canción ya está en la playlist
    if (playlist.songs.some(s => s.id === songId)) {
      return false;
    }

    playlist.songs.push(song);
    this.dao.savePlaylist(playlist);
    return true;
  }

  removeSongFromPlaylist(playlistId: string, songId: string): boolean {
    const playlist = this.getPlaylistById(playlistId);
    
    if (!playlist) return false;

    playlist.songs = playlist.songs.filter(s => s.id !== songId);
    this.dao.savePlaylist(playlist);
    return true;
  }

  deletePlaylist(id: string): void {
    this.dao.deletePlaylist(id);
  }

  renamePlaylist(id: string, newName: string): boolean {
    const playlist = this.getPlaylistById(id);
    if (!playlist) return false;

    playlist.name = newName;
    this.dao.savePlaylist(playlist);
    return true;
  }

  // ==================== BIBLIOTECA (FAVORITOS) ====================

  getFavorites(): Song[] {
    const favoriteIds = this.dao.getFavorites();
    return favoriteIds
      .map(id => this.getSongById(id))
      .filter((song): song is Song => song !== undefined);
  }

  addFavorite(songId: string): void {
    this.dao.addFavorite(songId);
  }

  removeFavorite(songId: string): void {
    this.dao.removeFavorite(songId);
  }

  isFavorite(songId: string): boolean {
    return this.dao.isFavorite(songId);
  }

  toggleFavorite(songId: string): boolean {
    if (this.isFavorite(songId)) {
      this.removeFavorite(songId);
      return false;
    } else {
      this.addFavorite(songId);
      return true;
    }
  }

  // ==================== RECOMENDACIONES ====================

  getRecommendations(limit: number = 10): Song[] {
    if (!this.currentUser || this.currentUser.history.length === 0) {
      return this.getPopularSongs(limit);
    }

    const scores = new Map<string, number>();
    const allSongs = this.getAllSongs();
    
    allSongs.forEach(song => {
      // No recomendar canciones ya escuchadas recientemente (últimas 10)
      const recentHistoryIds = this.currentUser!.history.slice(0, 10).map(h => h.songId);
      if (recentHistoryIds.includes(song.id)) return;
      
      let score = 0;
      
      // Factor 1: Género favorito (40 puntos)
      const genreIndex = this.currentUser!.favoriteGenres.indexOf(song.genre);
      if (genreIndex >= 0) {
        score += 40 - (genreIndex * 10); // Primer género: 40, segundo: 30, tercero: 20
      }
      
      // Factor 2: Artista favorito (30 puntos)
      const artistIndex = this.currentUser!.favoriteArtists.indexOf(song.artist);
      if (artistIndex >= 0) {
        score += 30 - (artistIndex * 10); // Primer artista: 30, segundo: 20, tercero: 10
      }
      
      // Factor 3: Popularidad (20 puntos)
      const maxPlays = 3500000;
      const popularityScore = (song.plays / maxPlays) * 20;
      score += popularityScore;
      
      // Factor 4: Año reciente (10 puntos)
      if (song.releaseYear >= 2020) {
        score += 10;
      }
      
      scores.set(song.id, score);
    });

    // Ordenar por score y devolver las mejores
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.getSongById(id))
      .filter((song): song is Song => song !== undefined);
  }

  getPopularSongs(limit: number = 10): Song[] {
    return [...this.getAllSongs()]
      .sort((a, b) => b.plays - a.plays)
      .slice(0, limit);
  }

  // ==================== ESTADÍSTICAS ====================

  getUserStats(): {
    totalPlays: number;
    favoriteGenres: { genre: string; count: number }[];
    favoriteArtists: { artist: string; count: number }[];
  } {
    if (!this.currentUser) {
      return { totalPlays: 0, favoriteGenres: [], favoriteArtists: [] };
    }

    const genreCounts = new Map<string, number>();
    const artistCounts = new Map<string, number>();

    this.currentUser.history.forEach(entry => {
      const song = this.getSongById(entry.songId);
      if (song) {
        genreCounts.set(song.genre, (genreCounts.get(song.genre) || 0) + 1);
        artistCounts.set(song.artist, (artistCounts.get(song.artist) || 0) + 1);
      }
    });

    const favoriteGenres = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const favoriteArtists = Array.from(artistCounts.entries())
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      totalPlays: this.currentUser.history.length,
      favoriteGenres,
      favoriteArtists
    };
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private updateUserPreferences(): void {
    if (!this.currentUser) return;

    const genreCounts = new Map<string, number>();
    const artistCounts = new Map<string, number>();

    // Analizar últimas 20 canciones
    const recentHistory = this.currentUser.history.slice(0, 20);
    
    recentHistory.forEach(entry => {
      const song = this.getSongById(entry.songId);
      if (song) {
        genreCounts.set(song.genre, (genreCounts.get(song.genre) || 0) + 1);
        artistCounts.set(song.artist, (artistCounts.get(song.artist) || 0) + 1);
      }
    });

    // Actualizar géneros favoritos (top 3)
    this.currentUser.favoriteGenres = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // Actualizar artistas favoritos (top 3)
    this.currentUser.favoriteArtists = Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([artist]) => artist);
  }

  private saveUserToStorage(): void {
    if (this.currentUser) {
      this.dao.saveUser(this.currentUser);
    }
  }

  private loadUserFromStorage(): void {
    this.currentUser = this.dao.loadUser();
  }
}

export default MusicController;