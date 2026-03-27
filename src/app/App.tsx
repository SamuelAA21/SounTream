import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { Song } from '../models/MusicModel';
import MusicController from '../controllers/MusicController';

const controller = MusicController.getInstance();

export default function App() {
  const [user, setUser] = useState(controller.getCurrentUser());
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setUser(controller.getCurrentUser());
  }, []);

  const handleLoginSuccess = () => {
    setUser(controller.getCurrentUser());
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
      controller.addToHistory(song.id);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((v) => !v);
  };

  const handleNext = () => {
    const recommendations = controller.getRecommendations(10);
    if (recommendations.length > 0) {
      const nextSong = recommendations[0];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      controller.addToHistory(nextSong.id);
    }
  };

  const handlePrevious = () => {
    const history = controller.getHistory();
    if (history.length >= 2) {
      const prev = history[1];
      const prevSong = controller.getAllSongs().find((s) => s.id === prev.songId);
      if (prevSong) {
        setCurrentSong(prevSong);
        setIsPlaying(true);
      }
    }
  };

  if (!controller.isAuthenticated() || !user) {
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

