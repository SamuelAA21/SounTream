import { useState, useEffect } from 'react';
import { Play, TrendingUp, Music, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Song, mockSongs, mockPlaylists, getRecommendations } from '../data/mockData';
import { SongCard } from '../components/SongCard';
import { PlaylistCard } from '../components/PlaylistCard';

interface HomeProps {
  onPlaySong: (song: Song) => void;
}

export function Home({ onPlaySong }: HomeProps) {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState({ totalPlays: 0, favoriteGenres: [], favoriteArtists: [] });

  useEffect(() => {
    // Cargar recomendaciones
    const history = JSON.parse(localStorage.getItem('soundwave_history') || '[]');
    const recs = getRecommendations(history.map((h: any) => mockSongs.find(s => s.id === h.songId)).filter(Boolean));
    setRecommendations(recs);

    // Cargar canciones populares
    const popular = [...mockSongs].sort((a, b) => b.plays - a.plays).slice(0, 6);
    setPopularSongs(popular);

    // Cargar estadísticas
    const userStats = { totalPlays: history.length, favoriteGenres: [], favoriteArtists: [] };
    setStats(userStats);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      {/* Greeting */}
      <motion.h1 
        className="text-2xl md:text-4xl mb-6 md:mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {getGreeting()}
      </motion.h1>

      {/* Quick Picks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {popularSongs.map((song, index) => (
          <motion.div
            key={song.id}
            className="backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 rounded-2xl flex items-center gap-4 hover:from-white/20 hover:to-white/10 transition-all cursor-pointer group border border-white/10 overflow-hidden"
            onClick={() => onPlaySong(song)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={song.cover} alt={song.title} className="w-20 h-20" />
            <div className="flex-1 truncate pr-4">
              <div className="truncate font-medium">{song.title}</div>
              <div className="text-sm text-gray-400 truncate">{song.artist}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended for you */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Play className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl">
            Recomendado para ti
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recommendations.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SongCard song={song} onPlay={onPlaySong} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl">Tus géneros favoritos</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.favoriteGenres.map((genreData, index) => (
            <motion.div
              key={genreData.genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10"
            >
              <Music className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-xl font-semibold capitalize">{genreData.genre}</div>
              <div className="text-sm text-gray-400">{genreData.count} canciones</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Listening Stats */}
      {stats.totalPlays > 0 && (
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl mb-6">Tu resumen musical</h2>
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Canciones escuchadas</div>
                <div className="text-5xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stats.totalPlays}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Género favorito</div>
                <div className="text-5xl bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent capitalize">
                  {stats.favoriteGenres[0]?.genre || 'Pop'}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Artista top</div>
                <div className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stats.favoriteArtists[0]?.artist || 'N/A'}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}