// Base de datos simulada usando localStorage como JSON
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  preferences: {
    theme: string;
    language: string;
  };
  listeningHistory: string[];
  playlists: string[];
  createdAt: string;
}

interface Session {
  userId: string;
  token: string;
  expiresAt: string;
}

const DB_KEY = 'musicstream_db';
const SESSION_KEY = 'musicstream_session';

// Inicializar base de datos
function initDB() {
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    const initialDB = {
      users: [],
      sessions: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  }
}

// Obtener base de datos
function getDB() {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEY) || '{"users":[],"sessions":[]}');
}

// Guardar base de datos
function saveDB(db: any) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Generar código 2FA de 6 dígitos
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Registrar usuario
export function registerUser(email: string, password: string, name: string): { success: boolean; message: string; code?: string } {
  const db = getDB();
  
  // Verificar si el usuario ya existe
  const existingUser = db.users.find((u: User) => u.email === email);
  if (existingUser) {
    return { success: false, message: 'El correo ya está registrado' };
  }

  // Generar código 2FA
  const twoFactorCode = generateTwoFactorCode();

  // Crear nuevo usuario
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password, // En producción, esto debería estar hasheado
    name,
    twoFactorEnabled: true,
    twoFactorSecret: twoFactorCode,
    preferences: {
      theme: 'dark',
      language: 'es'
    },
    listeningHistory: [],
    playlists: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  // Simular envío de código por email
  console.log(`Código 2FA para ${email}: ${twoFactorCode}`);

  return { success: true, message: 'Usuario registrado exitosamente', code: twoFactorCode };
}

// Login paso 1: verificar credenciales
export function loginStep1(email: string, password: string): { success: boolean; message: string; requiresTwoFactor?: boolean; code?: string } {
  const db = getDB();
  
  const user = db.users.find((u: User) => u.email === email);
  if (!user) {
    return { success: false, message: 'Credenciales incorrectas' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Credenciales incorrectas' };
  }

  if (user.twoFactorEnabled) {
    // Generar nuevo código 2FA
    const twoFactorCode = generateTwoFactorCode();
    user.twoFactorSecret = twoFactorCode;
    saveDB(db);

    // Simular envío de código
    console.log(`Código 2FA para ${email}: ${twoFactorCode}`);

    return { 
      success: true, 
      message: 'Código 2FA enviado', 
      requiresTwoFactor: true,
      code: twoFactorCode 
    };
  }

  // Si no tiene 2FA, crear sesión directamente
  return createSession(user);
}

// Login paso 2: verificar código 2FA
export function loginStep2(email: string, code: string): { success: boolean; message: string; user?: any; token?: string } {
  const db = getDB();
  
  const user = db.users.find((u: User) => u.email === email);
  if (!user) {
    return { success: false, message: 'Usuario no encontrado' };
  }

  if (user.twoFactorSecret !== code) {
    return { success: false, message: 'Código incorrecto' };
  }

  return createSession(user);
}

// Crear sesión
function createSession(user: User): { success: boolean; message: string; user?: any; token?: string } {
  const db = getDB();
  
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const session: Session = {
    userId: user.id,
    token,
    expiresAt: expiresAt.toISOString()
  };

  db.sessions.push(session);
  saveDB(db);

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  const { password, twoFactorSecret, ...userWithoutSecrets } = user;
  return { 
    success: true, 
    message: 'Login exitoso', 
    user: userWithoutSecrets,
    token 
  };
}

// Obtener sesión actual
export function getCurrentSession(): Session | null {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  const session = JSON.parse(sessionData);
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);

  if (now > expiresAt) {
    logout();
    return null;
  }

  return session;
}

// Obtener usuario actual
export function getCurrentUser(): User | null {
  const session = getCurrentSession();
  if (!session) return null;

  const db = getDB();
  const user = db.users.find((u: User) => u.id === session.userId);
  
  if (user) {
    const { password, twoFactorSecret, ...userWithoutSecrets } = user;
    return userWithoutSecrets as any;
  }

  return null;
}

// Cerrar sesión
export function logout() {
  const session = getCurrentSession();
  if (session) {
    const db = getDB();
    db.sessions = db.sessions.filter((s: Session) => s.token !== session.token);
    saveDB(db);
  }

  localStorage.removeItem(SESSION_KEY);
}

// Verificar si hay sesión activa
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

// Actualizar historial de escucha
export function updateListeningHistory(songId: string) {
  const session = getCurrentSession();
  if (!session) return;

  const db = getDB();
  const user = db.users.find((u: User) => u.id === session.userId);
  
  if (user) {
    if (!user.listeningHistory) {
      user.listeningHistory = [];
    }
    user.listeningHistory.push(songId);
    saveDB(db);
  }
}

// Obtener historial de escucha
export function getListeningHistory(): string[] {
  const session = getCurrentSession();
  if (!session) return [];

  const db = getDB();
  const user = db.users.find((u: User) => u.id === session.userId);
  
  return user?.listeningHistory || [];
}
