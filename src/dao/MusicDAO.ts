import { supabase } from '../services/supabaseClient';
import {
  SongFull,
  Playlist,
  PlaylistSongView,
  PlayHistory,
  Like,
  TopSong,
  Profile
} from '../models/MusicModel';

export default class MusicDAO {
  private static instance: MusicDAO;

  private constructor() {}

  static getInstance(): MusicDAO {
    if (!MusicDAO.instance) {
      MusicDAO.instance = new MusicDAO();
    }
    return MusicDAO.instance;
  }

  // Songs
  async getAllSongs(): Promise<SongFull[]> {
    const { data, error } = await supabase
      .from('v_songs_full')
      .select('*')
      .order('song_title');

    if (error) throw error;
    return data || [];
  }

  async getSongById(id: string): Promise<SongFull | null> {
    const { data, error } = await supabase
      .from('v_songs_full')
      .select('*')
      .eq('song_id', id)
      .single();

    if (error) return null;
    return data;
  }

  async searchSongs(query: string): Promise<SongFull[]> {
    const { data, error } = await supabase
      .from('v_songs_full')
      .select('*')
      .textSearch('song_title', query, { config: 'spanish' });

    if (error) throw error;
    return data || [];
  }

  async getPopularSongs(limit: number = 10): Promise<TopSong[]> {
    const { data, error } = await supabase
      .from('v_top_songs')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Play History
  async getHistory(userId: string): Promise<PlayHistory[]> {
    const { data, error } = await supabase
      .from('play_history')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  async addHistory(userId: string, songId: string, playlistId?: string, durationPlayed?: number): Promise<void> {
    const { error } = await supabase
      .from('play_history')
      .insert({
        user_id: userId,
        song_id: songId,
        playlist_id: playlistId,
        duration_played_seconds: durationPlayed
      });

    if (error) throw error;
  }

  async clearHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('play_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Favorites (Likes)
  async getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('likes')
      .select('song_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(like => like.song_id) || [];
  }

  async toggleFavorite(userId: string, songId: string): Promise<string[]> {
    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('song_id')
      .eq('user_id', userId)
      .eq('song_id', songId)
      .single();

    if (existing) {
      // Remove like
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('song_id', songId);
    } else {
      // Add like
      await supabase
        .from('likes')
        .insert({ user_id: userId, song_id: songId });
    }

    return this.getFavorites(userId);
  }

  // Playlists
  async getPlaylists(userId: string): Promise<Playlist[]> {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPlaylist(userId: string, name: string, description?: string, isPublic: boolean = false): Promise<Playlist> {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<void> {
    const { error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', playlistId);

    if (error) throw error;
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw error;
  }

  async getPlaylistSongs(playlistId: string): Promise<PlaylistSongView[]> {
    const { data, error } = await supabase
      .from('v_playlist_songs')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('position');

    if (error) throw error;
    return data || [];
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    // Get current max position
    const { data: existing } = await supabase
      .from('playlist_songs')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = existing?.[0]?.position ? existing[0].position + 1 : 0;

    const { error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId,
        position: nextPosition
      });

    if (error) throw error;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_id', songId);

    if (error) throw error;
  }

  // User Profile
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  }

  // Authentication (moved from authService)
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (error) throw error;
    return data;
  }
}
