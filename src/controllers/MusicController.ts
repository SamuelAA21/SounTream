import MusicDAO from '../dao/MusicDAO';
import { SongFull, Playlist, Profile, PlaylistSongView } from '../models/MusicModel';

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

  // Authentication
  async login(email: string, password: string) {
    return await this.dao.login(email, password);
  }

  async logout() {
    return await this.dao.logout();
  }

  async signUp(email: string, password: string, username: string) {
    return await this.dao.signUp(email, password, username);
  }

  async getCurrentUser() {
    return await this.dao.getCurrentUser();
  }

  // Songs
  async getAllSongs(): Promise<SongFull[]> {
    return await this.dao.getAllSongs();
  }

  async getSongById(id: string): Promise<SongFull | null> {
    return await this.dao.getSongById(id);
  }

  async searchSongs(query: string): Promise<SongFull[]> {
    return await this.dao.searchSongs(query);
  }

  async getPopularSongs(limit: number = 10) {
    return await this.dao.getPopularSongs(limit);
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<SongFull[]> {
    const history = await this.getHistory(userId);
    if (history.length === 0) return await this.getPopularSongs(limit);

    const allSongs = await this.getAllSongs();
    const recommended = allSongs
      .filter((s) => !history.some((h) => h.song_id === s.song_id))
      .slice(0, limit);
    return recommended;
  }

  // History
  async getHistory(userId: string) {
    return await this.dao.getHistory(userId);
  }

  async addToHistory(userId: string, songId: string, playlistId?: string, durationPlayed?: number): Promise<void> {
    return await this.dao.addHistory(userId, songId, playlistId, durationPlayed);
  }

  async clearHistory(userId: string): Promise<void> {
    return await this.dao.clearHistory(userId);
  }

  // Favorites
  async getFavorites(userId: string): Promise<string[]> {
    return await this.dao.getFavorites(userId);
  }

  async toggleFavorite(userId: string, songId: string): Promise<string[]> {
    return await this.dao.toggleFavorite(userId, songId);
  }

  // Playlists
  async getPlaylists(userId: string): Promise<Playlist[]> {
    return await this.dao.getPlaylists(userId);
  }

  async createPlaylist(userId: string, name: string, description?: string, isPublic: boolean = false): Promise<Playlist> {
    return await this.dao.createPlaylist(userId, name, description, isPublic);
  }

  async updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<void> {
    return await this.dao.updatePlaylist(playlistId, updates);
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    return await this.dao.deletePlaylist(playlistId);
  }

  async getPlaylistSongs(playlistId: string): Promise<PlaylistSongView[]> {
    return await this.dao.getPlaylistSongs(playlistId);
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    return await this.dao.addSongToPlaylist(playlistId, songId);
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    return await this.dao.removeSongFromPlaylist(playlistId, songId);
  }

  // User Profile
  async getUserProfile(userId: string): Promise<Profile | null> {
    return await this.dao.getUserProfile(userId);
  }

  async updateUserProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    return await this.dao.updateUserProfile(userId, updates);
  }

  // Utility methods
  async getUserStats(userId: string) {
    const history = await this.getHistory(userId);
    const favorites = await this.getFavorites(userId);
    const playlists = await this.getPlaylists(userId);

    return {
      totalPlays: history.length,
      totalFavorites: favorites.length,
      totalPlaylists: playlists.length,
      favoriteGenres: [], // TODO: implement genre analysis
      favoriteArtists: [], // TODO: implement artist analysis
    };
  }
}

export default MusicController;
