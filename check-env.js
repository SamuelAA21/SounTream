#!/usr/bin/env node

// Script para verificar la configuración de Supabase
console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar si existe el archivo .env
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env');
  console.log('💡 Solución: Copia .env.example a .env y configura tus credenciales');
  process.exit(1);
}

console.log('✅ Archivo .env encontrado');

// Leer el contenido del .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

const envVars = {};
envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Verificar variables requeridas
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
let allValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];

  if (!value) {
    console.error(`❌ ${varName} no está definido`);
    allValid = false;
    return;
  }

  if (value.includes('your') || value.includes('here') || value === 'tu-proyecto-id.supabase.co' || value === 'tu-clave-anonima-aqui') {
    console.error(`❌ ${varName} tiene un valor placeholder: "${value}"`);
    console.log(`💡 Reemplaza con tu valor real de Supabase`);
    allValid = false;
    return;
  }

  // Validar URL para SUPABASE_URL
  if (varName === 'VITE_SUPABASE_URL') {
    try {
      const url = new URL(value);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Protocolo inválido');
      }
      if (!value.includes('.supabase.co')) {
        console.warn(`⚠️  ${varName} no parece una URL de Supabase: "${value}"`);
        console.log('💡 Debe terminar con .supabase.co');
      } else {
        console.log(`✅ ${varName} parece válido: ${value.replace(/https?:\/\//, '').split('.')[0]}...`);
      }
    } catch {
      console.error(`❌ ${varName} no es una URL válida: "${value}"`);
      allValid = false;
    }
  } else {
    // Para la clave, solo verificar que no esté vacía y tenga longitud razonable
    if (value.length < 50) {
      console.warn(`⚠️  ${varName} parece muy corta (${value.length} caracteres)`);
      console.log('💡 Las claves de Supabase suelen tener ~100+ caracteres');
    } else {
      console.log(`✅ ${varName} configurada (${value.length} caracteres)`);
    }
  }
});

if (allValid) {
  console.log('\n🎉 ¡Configuración de Supabase correcta!');
  console.log('🚀 Puedes ejecutar: npm run dev');
} else {
  console.log('\n❌ Configuración incompleta. Sigue estos pasos:');
  console.log('1. Ve a https://supabase.com/dashboard');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Settings → API');
  console.log('4. Copia Project URL y anon public key');
  console.log('5. Actualiza el archivo .env');
  process.exit(1);
}