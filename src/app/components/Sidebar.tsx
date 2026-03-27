import { Home, Search, Library, Heart, Plus, Music, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gradient-to-b from-purple-950/50 to-black/95 backdrop-blur-xl text-white flex flex-col h-full border-r border-white/10">
      {/* Logo */}
      <div className="p-6">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gradient-to-br from-purple-500 to-cyan-500 p-2 rounded-xl">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            VibeStream
          </h1>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <Link
          to="/"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
            isActive('/') 
              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </Link>

        <Link
          to="/search"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
            isActive('/search') 
              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Buscar</span>
        </Link>

        <Link
          to="/library"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
            isActive('/library') 
              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Tu Biblioteca</span>
        </Link>

        <div className="mt-6 mb-2">
          <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
            <Plus className="w-5 h-5" />
            <span>Crear playlist</span>
          </button>

          <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
            <Heart className="w-5 h-5" />
            <span>Canciones favoritas</span>
          </button>
        </div>

        {/* Playlists */}
        <div className="border-t border-white/10 mt-4 pt-4">
          <div className="px-4 text-gray-400 text-xs mb-2 uppercase tracking-wider">TUS PLAYLISTS</div>
          <div className="space-y-1">
            {['Mix Diario', 'Descubrimiento Semanal', 'Rock Clásico', 'Chill Vibes', 'Workout'].map(
              (playlist) => (
                <button
                  key={playlist}
                  className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm"
                >
                  {playlist}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </motion.button>
      </div>
    </div>
  );
}