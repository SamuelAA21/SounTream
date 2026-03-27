import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Playlist } from '../data/mockData';

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay: () => void;
}

export function PlaylistCard({ playlist, onPlay }: PlaylistCardProps) {
  return (
    <motion.div
      className="backdrop-blur-xl bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group border border-white/10"
      onClick={onPlay}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img src={playlist.cover} alt={playlist.name} className="w-full aspect-square object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <motion.button 
          className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-3 opacity-0 group-hover:opacity-100 shadow-lg shadow-purple-500/50"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          <Play className="w-5 h-5 text-white" fill="white" />
        </motion.button>
      </div>
      <div className="truncate mb-1">{playlist.name}</div>
      <div className="text-sm text-gray-400 line-clamp-2">{playlist.description}</div>
    </motion.div>
  );
}