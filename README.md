# SoundTream

Una aplicación de streaming de música moderna construida con React, Vite, TypeScript y Supabase.

## 🚀 Características

- **Autenticación completa** con Supabase Auth
- **Base de datos PostgreSQL** con Row Level Security (RLS)
- **Arquitectura MVC** limpia y escalable
- **UI moderna** con Tailwind CSS y Motion
- **Búsqueda en tiempo real** de canciones
- **Playlists personalizadas**
- **Historial de reproducción**
- **Sistema de favoritos**
- **Responsive design**

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS, Motion
- **Icons**: Lucide React
- **Routing**: React Router

## 📋 Prerrequisitos

- Node.js 18+
- Una cuenta de Supabase

## 🚀 Instalación y Configuración

### 1. Clona el repositorio
```bash
git clone <repository-url>
cd soundtream
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura Supabase

#### Crea un proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se configure

#### Configura las variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

Puedes encontrar estos valores en:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon public

#### Ejecuta el esquema de la base de datos
1. Ve al SQL Editor en tu dashboard de Supabase
2. Copia y pega el contenido completo del archivo `data_base.md`
3. Ejecuta el script

Esto creará:
- Todas las tablas (profiles, artists, albums, songs, etc.)
- Políticas de Row Level Security
- Funciones y triggers
- Buckets de storage
- Datos de ejemplo

### 4. Ejecuta la aplicación
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes de UI
│   ├── pages/         # Páginas principales
│   └── data/          # Datos mock (para desarrollo)
├── controllers/       # Lógica de negocio (MVC)
├── dao/              # Data Access Objects
├── models/           # Interfaces y tipos
└── services/         # Servicios externos (Supabase)
```

## 🏗️ Arquitectura MVC

### Modelo (Models)
- Definición de interfaces TypeScript
- Alineadas con el esquema de Supabase

### Vista (Components/Pages)
- Componentes React funcionales
- UI moderna con Tailwind CSS

### Controlador (Controllers)
- Lógica de negocio
- Coordinación entre DAO y componentes

### DAO (Data Access Objects)
- Interacción directa con Supabase
- Consultas y mutaciones de datos

## 🔐 Autenticación

La aplicación usa Supabase Auth con:
- Registro e inicio de sesión
- Perfiles de usuario extendidos
- Row Level Security para datos privados

## 📊 Base de Datos

### Tablas principales
- `profiles` - Perfiles de usuario
- `artists` - Artistas
- `albums` - Álbumes
- `songs` - Canciones
- `playlists` - Listas de reproducción
- `play_history` - Historial de reproducción
- `likes` - Canciones favoritas

### Vistas
- `v_songs_full` - Canciones con artista y álbum
- `v_playlist_songs` - Canciones de playlists ordenadas
- `v_top_songs` - Canciones más populares

## 🎵 Storage

- **Audio**: Bucket privado para archivos de música
- **Imágenes**: Bucket público para portadas y avatares

## 🚀 Despliegue

### Build de producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Si tienes preguntas o problemas:
1. Revisa la documentación de Supabase
2. Verifica las variables de entorno
3. Revisa los logs de la consola del navegador

---

¡Disfruta creando música con SoundTream! 🎵