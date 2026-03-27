import { motion } from 'motion/react';
import { Brain, TrendingUp, Music, Clock, Heart, Zap } from 'lucide-react';
import { Song } from '../data/mockData';

interface RecommendationInsightsProps {
  listeningHistory: Song[];
}

export function RecommendationInsights({ listeningHistory }: RecommendationInsightsProps) {
  if (listeningHistory.length === 0) {
    return null;
  }

  // Análisis de géneros
  const genreCounts: Record<string, number> = {};
  const artistCounts: Record<string, number> = {};
  
  listeningHistory.forEach((song, index) => {
    const timeWeight = Math.pow(0.95, listeningHistory.length - index - 1);
    genreCounts[song.genre] = (genreCounts[song.genre] || 0) + timeWeight;
    artistCounts[song.artist] = (artistCounts[song.artist] || 0) + timeWeight;
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const avgYear = Math.round(listeningHistory.reduce((sum, s) => sum + s.releaseYear, 0) / listeningHistory.length);
  const avgDuration = Math.round(listeningHistory.reduce((sum, s) => sum + s.duration, 0) / listeningHistory.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-6 md:p-8 border border-white/10 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Tu Perfil Musical</h3>
          <p className="text-sm text-gray-400">Análisis inteligente de tus gustos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Géneros favoritos */}
        <motion.div 
          className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-purple-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-purple-400" />
            <h4 className="font-medium">Géneros Favoritos</h4>
          </div>
          <div className="space-y-2">
            {topGenres.map(([genre, weight], index) => {
              const percentage = (weight / topGenres[0][1]) * 100;
              return (
                <div key={genre}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{genre}</span>
                    <span className="text-purple-400">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Artistas favoritos */}
        <motion.div 
          className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-cyan-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-cyan-400" />
            <h4 className="font-medium">Artistas Favoritos</h4>
          </div>
          <div className="space-y-2">
            {topArtists.map(([artist, weight], index) => {
              const percentage = (weight / topArtists[0][1]) * 100;
              return (
                <div key={artist}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 truncate">{artist}</span>
                    <span className="text-cyan-400">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Características promedio */}
        <motion.div 
          className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-pink-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <h4 className="font-medium">Preferencias</h4>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-400">Duración promedio</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {Math.floor(avgDuration / 60)}:{String(avgDuration % 60).padStart(2, '0')}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-400">Época preferida</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {avgYear}s
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Explicación del algoritmo */}
      <motion.div 
        className="mt-6 backdrop-blur-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-xl p-4 border border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-gray-400 leading-relaxed">
          <span className="text-purple-400 font-semibold">Algoritmo Multi-Factor:</span> Analizamos 8 factores clave incluyendo tus géneros favoritos, artistas más escuchados, popularidad de las canciones, similitud en año de lanzamiento, duración, y patrones temporales. Las canciones más recientes que escuchas tienen más peso en nuestras recomendaciones.
        </p>
      </motion.div>
    </motion.div>
  );
}
