import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import { Song } from '../data/mockData';
import { WaveformVisualizer } from './AudioVisualizer';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Player({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }: PlayerProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onNext();
            return 0;
          }
          return prev + (100 / currentSong.duration);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, onNext]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = currentSong ? Math.floor((progress / 100) * currentSong.duration) : 0;

  if (!currentSong) {
    return (
      <div className="h-20 md:h-28 bg-gradient-to-r from-purple-950/80 to-black/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm md:text-lg mb-1">Selecciona una canción</p>
          <p className="text-xs md:text-sm text-gray-600">Tu música sonará aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-20 md:h-28 bg-gradient-to-r from-purple-950/80 to-black/95 backdrop-blur-xl border-t border-white/10 px-2 md:px-6 flex items-center justify-between gap-2">
      {/* Song Info */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <motion.img 
          src={currentSong.cover} 
          alt={currentSong.title} 
          className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
        />
        <div className="flex-1 min-w-0">
          <motion.div 
            className="truncate text-sm md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentSong.title}
          </motion.div>
          <div className="text-xs md:text-sm text-gray-400 truncate">{currentSong.artist}</div>
        </div>
        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-1 md:p-2 rounded-lg ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isLiked ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 max-w-2xl px-2 md:px-8">
        <div className="flex items-center justify-center gap-2 md:gap-6 mb-2">
          <motion.button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`hidden md:block p-2 rounded-lg transition-colors ${isShuffle ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Shuffle className="w-4 h-4" />
          </motion.button>
          
          <motion.button 
            onClick={onPrevious} 
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
          
          <motion.button
            onClick={onPlayPause}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full p-2 md:p-3 shadow-lg shadow-purple-500/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />}
          </motion.button>
          
          <motion.button 
            onClick={onNext} 
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
          
          <motion.button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`hidden md:block p-2 rounded-lg transition-colors ${isRepeat ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Repeat className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-400">
          <span className="w-8 md:w-10 text-right text-xs">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className="w-8 md:w-10 text-xs">{formatTime(currentSong.duration)}</span>
        </div>
      </div>

      {/* Volume & Visualizer */}
      <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
        <div className="hidden lg:block">
          <WaveformVisualizer isPlaying={isPlaying} />
        </div>
        <Volume2 className="w-5 h-5 text-gray-400" />
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  );
}
