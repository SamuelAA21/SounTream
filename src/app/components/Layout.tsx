import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { Song } from '../data/mockData';

interface LayoutProps {
  children: ReactNode;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLogout: () => void;
}

export function Layout({ children, currentSong, isPlaying, onPlayPause, onNext, onPrevious, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-xl shadow-lg"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar onLogout={onLogout} />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
              >
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <Sidebar onLogout={onLogout} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-950 via-black to-cyan-950">
          {children}
        </main>
      </div>
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </div>
  );
}