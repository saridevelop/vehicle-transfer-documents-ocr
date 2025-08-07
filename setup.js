#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚗 Configuración inicial de Vehicle Transfer Documents OCR\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('📝 Creando archivo .env.local con valores por defecto...\n');
  
  const envContent = `# OpenAI API Key for OCR processing
OPENAI_API_KEY=sk-your-openai-api-key-here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado');
} else {
  console.log('✅ Archivo .env.local encontrado');
}

// Check if PDF contracts exist
const contractsPath = path.join(process.cwd(), 'public', 'contracts');
const contractFile = path.join(contractsPath, 'contrato-tipo-compra-venta-vehiculos.pdf');
const mod02File = path.join(contractsPath, 'Mod.02-ES.pdf');

if (!fs.existsSync(contractFile)) {
  console.log('❌ Template del contrato de compraventa no encontrado');
  console.log('📂 Ubicación esperada: public/contracts/contrato-tipo-compra-venta-vehiculos.pdf');
} else {
  console.log('✅ Template del contrato de compraventa encontrado');
}

if (!fs.existsSync(mod02File)) {
  console.log('❌ Template Mod.02-ES no encontrado');
  console.log('📂 Ubicación esperada: public/contracts/Mod.02-ES.pdf');
} else {
  console.log('✅ Template Mod.02-ES encontrado');
}

console.log('\n🔧 Configuración necesaria:');
console.log('1. Obtén tu API key de OpenAI desde: https://platform.openai.com/api-keys');
console.log('2. Edita el archivo .env.local y reemplaza "sk-your-openai-api-key-here" con tu API key real');
console.log('3. Asegúrate de que los templates PDF estén en la carpeta public/contracts/');
console.log('\n🚀 Para ejecutar la aplicación:');
console.log('   npm run dev');
console.log('\n📖 Para más información, consulta el README.md');
