// Script para debug específico del login
const API_BASE_URL = 'http://localhost:7147/api';

async function debugLogin() {
  console.log('🔍 DEBUG: Probando login paso a paso...\n');

  // Datos del usuario que sabemos que existe
  const email = 'test@example.com';
  const password = 'password123';

  try {
    // 1. Verificar si el usuario existe
    console.log('1. Verificando si el usuario existe...');
    const usersResponse = await fetch(`${API_BASE_URL}/Usuario`);
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      const user = users.find(u => u.email === email);
      
      if (user) {
        console.log('✅ Usuario encontrado:', {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rolId: user.rolId
        });
      } else {
        console.log('❌ Usuario no encontrado en la base de datos');
        return;
      }
    } else {
      console.log('❌ Error al obtener usuarios:', usersResponse.status);
      return;
    }

    console.log('\n2. Intentando login...');
    
    // 2. Probar login
    const loginData = {
      email: email,
      password: password
    };

    console.log('📤 Enviando datos de login:', { email: loginData.email, password: '***' });

    const loginResponse = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log('📥 Response status:', loginResponse.status);
    console.log('📥 Response headers:', Object.fromEntries(loginResponse.headers));

    if (loginResponse.ok) {
      const result = await loginResponse.json();
      console.log('✅ Login exitoso!');
      console.log('👤 Usuario:', result.user);
      console.log('🎫 Token generado:', result.token ? 'Sí' : 'No');
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Error en login:');
      console.log('   Status:', loginResponse.status);
      console.log('   Response:', errorText);
      
      // Intentar parsear como JSON si es posible
      try {
        const errorJson = JSON.parse(errorText);
        console.log('   JSON Error:', errorJson);
      } catch {
        console.log('   Raw Error:', errorText);
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('   Stack:', error.stack);
  }
}

// Ejecutar debug
debugLogin();
