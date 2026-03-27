import { motion } from 'motion/react';
import { Artist } from '../data/mockData';

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
  return (
    <motion.div
      className="backdrop-blur-xl bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/10"
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative mb-4">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full border-4 border-white/10"
        />
      </div>
      <div className="text-center">
        <div className="truncate mb-1">{artist.name}</div>
        <div className="text-sm text-gray-400">{artist.genre}</div>
      </div>
    </motion.div>
  );
}