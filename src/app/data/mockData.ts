export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  genre: string;
  releaseYear: number;
  plays: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  followers: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
  creator: string;
}

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2020,
    plays: 3500000
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2020,
    plays: 2800000
  },
  {
    id: '3',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2020,
    plays: 3200000
  },
  {
    id: '4',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 167,
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2022,
    plays: 4100000
  },
  {
    id: '5',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 200,
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2022,
    plays: 3900000
  },
  {
    id: '6',
    title: 'One Dance',
    artist: 'Drake',
    album: 'Views',
    duration: 173,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    releaseYear: 2016,
    plays: 3300000
  },
  {
    id: '7',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 230,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'R&B',
    releaseYear: 2016,
    plays: 2900000
  },
  {
    id: '8',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    duration: 200,
    cover: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2023,
    plays: 3700000
  },
  {
    id: '9',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: 233,
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2017,
    plays: 3600000
  },
  {
    id: '10',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    duration: 198,
    cover: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2021,
    plays: 2700000
  },
  {
    id: '11',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep',
    duration: 194,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Alternative',
    releaseYear: 2019,
    plays: 3100000
  },
  {
    id: '12',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2019,
    plays: 2600000
  },
  {
    id: '13',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 354,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Rock',
    releaseYear: 1975,
    plays: 2100000
  },
  {
    id: '14',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: 301,
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
    genre: 'Rock',
    releaseYear: 1991,
    plays: 1900000
  },
  {
    id: '15',
    title: 'Lose Yourself',
    artist: 'Eminem',
    album: '8 Mile Soundtrack',
    duration: 326,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    releaseYear: 2002,
    plays: 2300000
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Pop/R&B',
    followers: 85000000
  },
  {
    id: '2',
    name: 'Taylor Swift',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    genre: 'Pop',
    followers: 92000000
  },
  {
    id: '3',
    name: 'Drake',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    followers: 78000000
  },
  {
    id: '4',
    name: 'Harry Styles',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    genre: 'Pop',
    followers: 45000000
  },
  {
    id: '5',
    name: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Alternative',
    followers: 67000000
  },
  {
    id: '6',
    name: 'Dua Lipa',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Pop',
    followers: 54000000
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Éxitos del Momento',
    description: 'Las canciones más populares ahora mismo',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    songs: mockSongs.slice(0, 5),
    creator: 'Spotify'
  },
  {
    id: '2',
    name: 'Clásicos Pop',
    description: 'Los mejores hits pop de todos los tiempos',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    songs: mockSongs.slice(5, 10),
    creator: 'Spotify'
  },
  {
    id: '3',
    name: 'Workout Mix',
    description: 'Música energética para tu rutina de ejercicio',
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    songs: mockSongs.slice(2, 7),
    creator: 'Spotify'
  },
  {
    id: '4',
    name: 'Chill Vibes',
    description: 'Relájate con estas canciones suaves',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    songs: mockSongs.slice(8, 13),
    creator: 'Spotify'
  },
  {
    id: '5',
    name: 'Rock Legends',
    description: 'Las leyendas del rock que nunca pasan de moda',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
    songs: mockSongs.filter(s => s.genre === 'Rock'),
    creator: 'Spotify'
  }
];

// Función para obtener recomendaciones basadas en preferencias del usuario
export function getRecommendations(listeningHistory: Song[]): Song[] {
  if (listeningHistory.length === 0) {
    // Si no hay historial, devolver canciones populares
    return [...mockSongs].sort((a, b) => b.plays - a.plays).slice(0, 10);
  }

  // 1. ANÁLISIS DE PREFERENCIAS CON PESOS TEMPORALES
  // Las canciones más recientes tienen más peso en el análisis
  const genreCounts: Record<string, number> = {};
  const artistCounts: Record<string, number> = {};
  const albumCounts: Record<string, number> = {};
  
  listeningHistory.forEach((song, index) => {
    // Peso temporal: las canciones más recientes tienen más peso (decay exponencial)
    const timeWeight = Math.pow(0.95, listeningHistory.length - index - 1);
    
    genreCounts[song.genre] = (genreCounts[song.genre] || 0) + timeWeight;
    artistCounts[song.artist] = (artistCounts[song.artist] || 0) + timeWeight;
    albumCounts[song.album] = (albumCounts[song.album] || 0) + timeWeight;
  });

  // Obtener top preferencias
  const favoriteGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const favoriteArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([artist]) => artist);

  const favoriteAlbums = Object.entries(albumCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([album]) => album);

  // 2. CALCULAR PROMEDIO DE CARACTERÍSTICAS DEL USUARIO
  const avgYear = listeningHistory.reduce((sum, s) => sum + s.releaseYear, 0) / listeningHistory.length;
  const avgDuration = listeningHistory.reduce((sum, s) => sum + s.duration, 0) / listeningHistory.length;

  // 3. FILTRAR CANCIONES NO ESCUCHADAS
  const historyIds = new Set(listeningHistory.map(s => s.id));
  const candidateSongs = mockSongs.filter(song => !historyIds.has(song.id));

  // 4. ALGORITMO DE SCORING MULTI-FACTOR
  const scoredSongs = candidateSongs.map(song => {
    let score = 0;
    
    // Factor 1: Género favorito (ponderado por posición)
    const genreIndex = favoriteGenres.indexOf(song.genre);
    if (genreIndex !== -1) {
      score += (3 - genreIndex) * 10; // 30, 20, 10 puntos
    }
    
    // Factor 2: Artista favorito (muy importante)
    const artistIndex = favoriteArtists.indexOf(song.artist);
    if (artistIndex !== -1) {
      score += (5 - artistIndex) * 8; // Hasta 40 puntos
    }
    
    // Factor 3: Álbum conocido
    if (favoriteAlbums.includes(song.album)) {
      score += 15;
    }
    
    // Factor 4: Similitud en año de lanzamiento (preferencia temporal)
    const yearDiff = Math.abs(song.releaseYear - avgYear);
    score += Math.max(0, 10 - yearDiff / 2);
    
    // Factor 5: Similitud en duración
    const durationDiff = Math.abs(song.duration - avgDuration);
    score += Math.max(0, 8 - durationDiff / 30);
    
    // Factor 6: Popularidad normalizada (importante pero no decisivo)
    const popularityScore = (song.plays / 5000000) * 12; // Hasta 12 puntos
    score += Math.min(popularityScore, 12);
    
    // Factor 7: Diversidad (pequeño bonus para géneros diferentes pero relacionados)
    if (!favoriteGenres.includes(song.genre)) {
      // Bonus por exploración (ayuda a descubrir música nueva)
      score += 2;
    }
    
    // Factor 8: Factor de frescura (canciones más recientes)
    const freshness = Math.max(0, (song.releaseYear - 2000) / 23 * 5);
    score += freshness;
    
    return { song, score };
  });

  // 5. ESTRATEGIA DE DIVERSIFICACIÓN
  // Ordenar por score y aplicar diversificación
  const sortedSongs = scoredSongs.sort((a, b) => b.score - a.score);
  
  const recommendations: Song[] = [];
  const usedGenres = new Set<string>();
  const usedArtists = new Set<string>();
  
  // Primera pasada: tomar top matches con diversidad
  for (const item of sortedSongs) {
    if (recommendations.length >= 10) break;
    
    const genreCount = Array.from(usedGenres).filter(g => g === item.song.genre).length;
    const artistUsed = usedArtists.has(item.song.artist);
    
    // Evitar saturación de un solo género o artista
    if (genreCount < 4 && !artistUsed) {
      recommendations.push(item.song);
      usedGenres.add(item.song.genre);
      usedArtists.add(item.song.artist);
    }
  }
  
  // Segunda pasada: completar si faltan canciones
  if (recommendations.length < 10) {
    for (const item of sortedSongs) {
      if (recommendations.length >= 10) break;
      if (!recommendations.includes(item.song)) {
        recommendations.push(item.song);
      }
    }
  }

  return recommendations;
}

// Función para obtener artistas similares
export function getSimilarArtists(artistName: string): Artist[] {
  const artist = mockArtists.find(a => a.name === artistName);
  if (!artist) return [];

  return mockArtists
    .filter(a => a.name !== artistName && a.genre === artist.genre)
    .slice(0, 5);
}

// Función para obtener playlists recomendadas
export function getRecommendedPlaylists(listeningHistory: Song[]): Playlist[] {
  if (listeningHistory.length === 0) {
    return mockPlaylists.slice(0, 4);
  }

  const genreCounts: Record<string, number> = {};
  listeningHistory.forEach(song => {
    genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
  });

  const favoriteGenre = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Filtrar playlists que contengan canciones del género favorito
  const scoredPlaylists = mockPlaylists.map(playlist => {
    const genreMatches = playlist.songs.filter(s => s.genre === favoriteGenre).length;
    return { playlist, score: genreMatches };
  });

  return scoredPlaylists
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.playlist);
}