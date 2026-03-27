// ============================================
// MODELO - Definición de datos y estructuras
// ============================================

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

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface UserHistory {
  songId: string;
  playedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  history: UserHistory[];
}

// Base de datos simulada
export const musicDatabase: Song[] = [
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
    title: 'good 4 u',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Pop Rock',
    releaseYear: 2021,
    plays: 2200000
  },
  {
    id: '4',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: 238,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'Indie',
    releaseYear: 2020,
    plays: 1900000
  },
  {
    id: '5',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    duration: 198,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'R&B',
    releaseYear: 2021,
    plays: 2600000
  },
  {
    id: '6',
    title: 'Montero',
    artist: 'Lil Nas X',
    album: 'MONTERO',
    duration: 137,
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    releaseYear: 2021,
    plays: 2100000
  },
  {
    id: '7',
    title: 'Stay',
    artist: 'The Kid LAROI',
    album: 'F*ck Love 3',
    duration: 141,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2021,
    plays: 2700000
  },
  {
    id: '8',
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    album: 'Equals',
    duration: 230,
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2021,
    plays: 2400000
  },
  {
    id: '9',
    title: 'Shivers',
    artist: 'Ed Sheeran',
    album: 'Equals',
    duration: 207,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2021,
    plays: 1800000
  },
  {
    id: '10',
    title: 'Kiss Me More',
    artist: 'Doja Cat',
    album: 'Planet Her',
    duration: 208,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'R&B',
    releaseYear: 2021,
    plays: 2300000
  },
  {
    id: '11',
    title: 'Happier Than Ever',
    artist: 'Billie Eilish',
    album: 'Happier Than Ever',
    duration: 298,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Alternative',
    releaseYear: 2021,
    plays: 1700000
  },
  {
    id: '12',
    title: 'Industry Baby',
    artist: 'Lil Nas X',
    album: 'MONTERO',
    duration: 212,
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    releaseYear: 2021,
    plays: 2000000
  },
  {
    id: '13',
    title: 'Deja Vu',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 215,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Pop Rock',
    releaseYear: 2021,
    plays: 1600000
  },
  {
    id: '14',
    title: 'Essence',
    artist: 'Wizkid',
    album: 'Made in Lagos',
    duration: 244,
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    genre: 'Afrobeat',
    releaseYear: 2020,
    plays: 1400000
  },
  {
    id: '15',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    genre: 'Pop',
    releaseYear: 2020,
    plays: 2500000
  }
];

export const defaultPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Top Hits 2021',
    songs: [musicDatabase[0], musicDatabase[1], musicDatabase[2]]
  },
  {
    id: 'p2',
    name: 'Chill Vibes',
    songs: [musicDatabase[3], musicDatabase[10], musicDatabase[13]]
  },
  {
    id: 'p3',
    name: 'Party Mix',
    songs: [musicDatabase[5], musicDatabase[6], musicDatabase[11]]
  }
];
