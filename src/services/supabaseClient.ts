import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de variables de entorno
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL no está configurado. ' +
    'Por favor, crea un archivo .env con tu URL de Supabase. ' +
    'Ejemplo: VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY no está configurado. ' +
    'Por favor, agrega tu clave anónima de Supabase al archivo .env. ' +
    'La puedes encontrar en: Supabase Dashboard → Settings → API → Project API keys'
  )
}

// Validación básica de URL
try {
  new URL(supabaseUrl)
} catch {
  throw new Error(
    `VITE_SUPABASE_URL no es una URL válida: "${supabaseUrl}". ` +
    'Debe ser algo como: https://tu-proyecto-id.supabase.co'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)