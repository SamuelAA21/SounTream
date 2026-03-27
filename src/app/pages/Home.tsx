import { useState, useEffect } from 'react';
import { Play, TrendingUp, Music, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { SongFull } from '../../models/MusicModel';
import { SongCard } from '../components/SongCard';
import { PlaylistCard } from '../components/PlaylistCard';
import MusicController from '../../controllers/MusicController';

interface HomeProps {
  onPlaySong: (song: SongFull) => void;
}

export function Home({ onPlaySong }: HomeProps) {
  const [recommendations, setRecommendations] = useState<SongFull[]>([]);
  const [popularSongs, setPopularSongs] = useState<SongFull[]>([]);
  const [stats, setStats] = useState({ totalPlays: 0, totalFavorites: 0, totalPlaylists: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const controller = MusicController.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const user = await controller.getCurrentUser();
      if (!user?.id) return;

      const [recs, popular, userStats] = await Promise.all([
        controller.getRecommendations(user.id, 10),
        controller.getPopularSongs(6),
        controller.getUserStats(user.id)
      ]);

      setRecommendations(recs);
      setPopularSongs(popular);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 pt-16 md:pt-8">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

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
            key={song.song_id}
            className="backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 rounded-2xl flex items-center gap-4 hover:from-white/20 hover:to-white/10 transition-all cursor-pointer group border border-white/10 overflow-hidden"
            onClick={() => onPlaySong(song)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={song.album_cover || '/placeholder.jpg'} alt={song.song_title} className="w-20 h-20" />
            <div className="flex-1 truncate pr-4">
              <div className="truncate font-medium">{song.song_title}</div>
              <div className="text-sm text-gray-400 truncate">{song.artist_name}</div>
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
              key={song.song_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SongCard song={song} onPlay={onPlaySong} />
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
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Canciones favoritas</div>
                <div className="text-5xl bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {stats.totalFavorites}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Playlists creadas</div>
                <div className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stats.totalPlaylists}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}