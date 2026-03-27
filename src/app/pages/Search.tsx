import { useState, useEffect } from 'react';
import { Search as SearchIcon, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { Song } from '../../models/MusicModel';
import MusicController from '../../controllers/MusicController';
import { SongCard } from '../components/SongCard';

interface SearchProps {
  onPlaySong: (song: Song) => void;
}

export function Search({ onPlaySong }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  
  const controller = MusicController.getInstance();

  useEffect(() => {
    const allGenres = controller.getGenres();
    setGenres(allGenres);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = controller.searchSongs(searchQuery);
      setSearchResults(results);
      setSelectedGenre(null);
    } else if (selectedGenre) {
      const results = controller.getSongsByGenre(selectedGenre);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedGenre]);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    setSearchQuery('');
  };

  const genreColors = [
    'from-red-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
  ];

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <motion.h1 
        className="text-2xl md:text-4xl mb-6 md:mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Buscar
      </motion.h1>

      {/* Search Bar */}
      <motion.div 
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="¿Qué quieres escuchar?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
        />
      </motion.div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl mb-6">
            Resultados para "{searchQuery}"
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((song, index) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No se encontraron resultados</p>
            </div>
          )}
        </motion.section>
      )}

      {/* Genres */}
      {!searchQuery && (
        <>
          <h2 className="text-2xl mb-6">Explorar por género</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {genres.map((genre, index) => (
              <motion.div
                key={genre}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group ${
                  selectedGenre === genre ? 'ring-4 ring-purple-500' : ''
                }`}
                onClick={() => handleGenreClick(genre)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genreColors[index % genreColors.length]}`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-white capitalize">
                    {genre}
                  </h3>
                  <Music className="w-12 h-12 md:w-16 md:h-16 text-white/60 self-end transform rotate-12" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Genre Results */}
          {selectedGenre && searchResults.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl mb-6 capitalize">
                {selectedGenre}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map((song, index) => (
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
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
