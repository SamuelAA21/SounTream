import { useState, useEffect } from 'react';
import { Clock, Heart, Music, Plus, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song, Playlist, mockSongs, mockPlaylists } from '../data/mockData';

interface LibraryProps {
  onPlaySong: (song: Song) => void;
}

export function Library({ onPlaySong }: LibraryProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'playlists'>('history');
  const [history, setHistory] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const historyData = JSON.parse(localStorage.getItem('soundwave_history') || '[]');
    setHistory(historyData.map((h: any) => mockSongs.find(s => s.id === h.songId)).filter(Boolean));
    setFavorites(JSON.parse(localStorage.getItem('soundwave_favorites') || '[]').map((id: string) => mockSongs.find(s => s.id === id)).filter(Boolean));
    setPlaylists(mockPlaylists);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      // For simplicity, just close the modal
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    // For simplicity, do nothing
  };

  const handleToggleFavorite = (songId: string) => {
    const favorites = JSON.parse(localStorage.getItem('soundwave_favorites') || '[]');
    const index = favorites.indexOf(songId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(songId);
    }
    localStorage.setItem('soundwave_favorites', JSON.stringify(favorites));
    loadData();
  };

  const handleClearHistory = () => {
    if (confirm('¿Borrar todo el historial?')) {
      localStorage.removeItem('soundwave_history');
      loadData();
    }
  };

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <motion.h1 
        className="text-2xl md:text-4xl mb-6 md:mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Tu Biblioteca
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-white/10 overflow-x-auto">
        <motion.button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ y: -2 }}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Historial
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-4 transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ y: -2 }}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Favoritos
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('playlists')}
          className={`pb-3 px-4 transition-all whitespace-nowrap ${
            activeTab === 'playlists'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ y: -2 }}
        >
          <Music className="w-4 h-4 inline mr-2" />
          Playlists
        </motion.button>
      </div>

      {/* HISTORIAL */}
      {activeTab === 'history' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Escuchado recientemente</h2>
            {history.length > 0 && (
              <motion.button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Limpiar historial
              </motion.button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-20">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
                <Clock className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                <p className="text-xl text-gray-400 mb-2">No hay historial</p>
                <p className="text-sm text-gray-500">
                  Las canciones que reproduzcas aparecerán aquí
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((song, index) => (
                <motion.div
                  key={`${song.id}-${index}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 cursor-pointer group backdrop-blur-xl bg-white/5 border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-14 h-14 rounded-xl cursor-pointer"
                    onClick={() => onPlaySong(song)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{song.title}</div>
                    <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                  </div>
                  <div className="text-sm text-gray-400 hidden md:block">{song.album}</div>
                  <div className="text-sm text-gray-400 hidden sm:block">
                    {formatDuration(song.duration)}
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(song.id);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        controller.isFavorite(song.id)
                          ? 'text-pink-500 fill-pink-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* FAVORITOS */}
      {activeTab === 'favorites' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl mb-6">Canciones favoritas</h2>
          
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
                <Heart className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                <p className="text-xl text-gray-400 mb-2">No tienes favoritos</p>
                <p className="text-sm text-gray-500">
                  Marca canciones como favoritas para verlas aquí
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((song, index) => (
                <motion.div
                  key={song.id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 cursor-pointer group backdrop-blur-xl bg-white/5 border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-14 h-14 rounded-xl cursor-pointer"
                    onClick={() => onPlaySong(song)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{song.title}</div>
                    <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                  </div>
                  <div className="text-sm text-gray-400 hidden md:block">{song.genre}</div>
                  <div className="text-sm text-gray-400 hidden sm:block">
                    {formatDuration(song.duration)}
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(song.id);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* PLAYLISTS */}
      {activeTab === 'playlists' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Tus Playlists</h2>
            <motion.button
              onClick={() => setShowCreatePlaylist(true)}
              className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Nueva Playlist
            </motion.button>
          </div>

          {/* Modal Crear Playlist */}
          <AnimatePresence>
            {showCreatePlaylist && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreatePlaylist(false)}
              >
                <motion.div
                  className="backdrop-blur-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl p-8 border border-white/20 max-w-md w-full"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl">Nueva Playlist</h3>
                    <button
                      onClick={() => setShowCreatePlaylist(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre de la playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-6"
                    autoFocus
                  />
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => setShowCreatePlaylist(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={handleCreatePlaylist}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Crear
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {playlists.length === 0 ? (
            <div className="text-center py-20">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
                <Music className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                <p className="text-xl text-gray-400 mb-2">No tienes playlists</p>
                <p className="text-sm text-gray-500 mb-6">
                  Crea tu primera playlist para organizar tu música
                </p>
                <motion.button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Crear Playlist
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative mb-4">
                    <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Music className="w-12 h-12 text-white" />
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(playlist.id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-400">{playlist.songs.length} canciones</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}
