import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { SongFull } from '../models/MusicModel';
import MusicController from '../controllers/MusicController';

const controller = MusicController.getInstance();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<SongFull | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await controller.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    await checkAuth();
  };

  const handleLogout = async () => {
    try {
      await controller.logout();
      setUser(null);
      setCurrentSong(null);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePlaySong = async (song: SongFull) => {
    if (currentSong?.song_id === song.song_id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      if (user?.id) {
        await controller.addToHistory(user.id, song.song_id);
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((v) => !v);
  };

  const handleNext = async () => {
    if (!user?.id) return;
    const recommendations = await controller.getRecommendations(user.id, 10);
    if (recommendations.length > 0) {
      const nextSong = recommendations[0];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      await controller.addToHistory(user.id, nextSong.song_id);
    }
  };

  const handlePrevious = async () => {
    if (!user?.id) return;
    const history = await controller.getHistory(user.id);
    if (history.length >= 2) {
      const prev = history[1];
      const allSongs = await controller.getAllSongs();
      const prevSong = allSongs.find((s) => s.song_id === prev.song_id);
      if (prevSong) {
        setCurrentSong(prevSong);
        setIsPlaying(true);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

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

