// Script simple para probar login
const API_BASE_URL = 'http://localhost:7147/api';

async function testLogin() {
  console.log('🔐 Probando login...\n');

  // Usar el email del usuario que acabamos de crear
  const loginData = {
    email: 'debug1752150596065@test.com',
    password: 'test123'
  };

  console.log('📤 Datos de login:');
  console.log(JSON.stringify(loginData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log(`\n📥 Response Status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ LOGIN EXITOSO! 🎉');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('\n❌ Error en login:');
      console.log(errorText);
    }

  } catch (error) {
    console.log(`\n❌ Error de conexión: ${error.message}`);
  }
}

testLogin();
