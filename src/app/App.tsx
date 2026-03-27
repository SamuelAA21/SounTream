import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { Song } from '../models/MusicModel';
import MusicController from '../controllers/MusicController';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const controller = MusicController.getInstance();

  // Verificar autenticación al cargar
  useEffect(() => {
    if (controller.isAuthenticated()) {
      const currentUser = controller.getCurrentUser();
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = controller.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    controller.logout();
    setUser(null);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      // Agregar al historial
      controller.addToHistory(song.id);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    // Obtener recomendaciones y reproducir la siguiente
    const recommendations = controller.getRecommendations(10);
    if (recommendations.length > 0) {
      const nextSong = recommendations[0];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      controller.addToHistory(nextSong.id);
    }
  };

  const handlePrevious = () => {
    // Obtener historial y reproducir la anterior
    const history = controller.getHistory();
    if (history.length >= 2) {
      const prevSong = history[1]; // La segunda en el historial (la actual es la primera)
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  // Si no está autenticado, mostrar login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onLogout={handleLogout}
        >
          <Home onPlaySong={handlePlaySong} />
        </Layout>
      ),
    },
    {
      path: '/search',
      element: (
        <Layout
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onLogout={handleLogout}
        >
          <Search onPlaySong={handlePlaySong} />
        </Layout>
      ),
    },
    {
      path: '/library',
      element: (
        <Layout
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onLogout={handleLogout}
        >
          <Library onPlaySong={handlePlaySong} />
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
