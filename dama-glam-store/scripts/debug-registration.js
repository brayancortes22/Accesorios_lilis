// Script simple para debug del registro
const API_BASE_URL = 'http://localhost:7147/api';

async function debugRegistration() {
  console.log('🔍 DEBUG: Registro paso a paso...\n');

  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test Debug',
    email: `debug${timestamp}@test.com`,
    password: 'test123', // Campo correcto para el endpoint /register
    telefono: '1234567890',
    direccion: 'Test Address',
    ciudad: 'Test City',
    pais: 'Test Country',
    rolId: 2,
    activo: true
  };

  console.log('📤 Datos a enviar:');
  console.log(JSON.stringify(testUser, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    console.log(`\n📥 Response Status: ${response.status}`);
    console.log(`📥 Response Headers:`, Object.fromEntries(response.headers));

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Respuesta exitosa:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('\n❌ Error Response:');
      console.log(errorText);
    }

  } catch (error) {
    console.log(`\n❌ Error de conexión: ${error.message}`);
  }
}

debugRegistration();
