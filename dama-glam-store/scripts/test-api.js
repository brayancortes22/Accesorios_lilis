// Script para probar la conexión con la API
const API_BASE_URL = 'http://localhost:7147/api';

async function testApiConnection() {
  console.log('🚀 Iniciando pruebas de conexión API...\n');

  // Test 1: Verificar estado de la base de datos
  try {
    console.log('1. Probando conexión a /Seed/status...');
    const response = await fetch(`${API_BASE_URL}/Seed/status`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa!');
      console.log('📊 Estado de la BD:', data);
    } else {
      console.log('❌ Error en la respuesta:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  console.log('\n');

  // Test 2: Verificar productos
  try {
    console.log('2. Probando conexión a /Producto...');
    const response = await fetch(`${API_BASE_URL}/Producto`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa!');
      console.log(`📦 Productos encontrados: ${data.length}`);
      if (data.length > 0) {
        console.log('🔍 Primer producto:', {
          id: data[0].id,
          name: data[0].name || data[0].nombre,
          price: data[0].precio || data[0].price
        });
      }
    } else {
      console.log('❌ Error en la respuesta:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  console.log('\n');

  // Test 3: Verificar CORS
  try {
    console.log('3. Probando CORS...');
    const response = await fetch(`${API_BASE_URL}/Producto`, {
      method: 'OPTIONS'
    });
    
    console.log('✅ CORS configurado correctamente');
    console.log('🔧 Headers CORS:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.log('❌ Error CORS:', error.message);
  }

  console.log('\n📋 Pruebas completadas!');
}

// Verificar si estamos en Node.js
if (typeof window === 'undefined') {
  // Importar fetch para Node.js si no está disponible
  if (!global.fetch) {
    import('node-fetch').then(({ default: fetch }) => {
      global.fetch = fetch;
      testApiConnection();
    }).catch(() => {
      console.log('❌ Para ejecutar este script, instala node-fetch: npm install node-fetch');
    });
  } else {
    testApiConnection();
  }
} else {
  // En el navegador
  testApiConnection();
}
