// Script para probar login con usuario existente que tiene hash
const API_BASE_URL = 'http://localhost:7147/api';

async function testLoginExisting() {
  console.log('🔐 Probando login con usuario existente que tiene hash...\n');

  // Usuario que vemos en la BD que tiene hash (ID 8: debug1752148985655@test.com)
  const loginData = {
    email: 'debug1752148985655@test.com',
    password: 'test123'
  };

  console.log(`📧 Intentando login con: ${loginData.email}`);
  console.log(`🔑 Password: ${loginData.password}`);

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log(`\n📥 Status del login: ${loginResponse.status}`);

    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ LOGIN EXITOSO! 🎉');
      console.log(`👤 Usuario: ${loginResult.user.name}`);
      console.log(`📧 Email: ${loginResult.user.email}`);
      console.log(`🎫 Token: ${loginResult.token ? 'GENERADO' : 'NO GENERADO'}`);
      console.log(`🔑 Token length: ${loginResult.token ? loginResult.token.length : 0} caracteres`);
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Error en login:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📝 Detalle:', errorJson.message);
      } catch {
        console.log('📝 Error raw:', errorText);
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  console.log('\n🏁 Prueba completada!');
}

testLoginExisting();
