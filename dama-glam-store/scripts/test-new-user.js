// Script para probar registro y login con las correcciones
const testUser = {
    nombre: 'Usuario Nuevo',
    email: `nuevo${timestamp}@test.com`,
    passwordHash: 'password123', // Campo correcto para el DTO
    telefono: '1234567890',
    direccion: 'Calle Nueva 123',
    ciudad: 'Ciudad Nueva',
    pais: 'Colombia',
    rolId: 2 // Cliente
  };
//   bar registro y login con las correcciones
const API_BASE_URL = 'http://localhost:7147/api';

async function testRegistrationAndLogin() {
  console.log('🧪 Probando registro y login con correcciones...\n');

  // Crear un usuario nuevo con timestamp para evitar conflictos
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Usuario Nuevo',
    email: `nuevo${timestamp}@test.com`,
    password: 'password123', // Campo correcto para UsuarioCreateDto
    telefono: '1234567890',
    direccion: 'Calle Nueva 123',
    ciudad: 'Ciudad Nueva',
    pais: 'Colombia',
    rolId: 2 // Cliente
  };

  try {
    // 1. Registrar nuevo usuario
    console.log('1. 👤 REGISTRANDO NUEVO USUARIO...');
    console.log(`📧 Email: ${testUser.email}`);
    
    const registerResponse = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const result = await registerResponse.json();
      console.log('✅ Usuario registrado exitosamente');
      console.log(`👤 ID: ${result.id}`);
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Error en registro:', registerResponse.status, errorText);
      return;
    }

    console.log('\n2. 🔍 VERIFICANDO USUARIO EN BASE DE DATOS...');
    
    // 2. Verificar que el usuario se creó correctamente
    const usersResponse = await fetch(`${API_BASE_URL}/Usuario`);
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      const newUser = users.find(u => u.email === testUser.email);
      
      if (newUser) {
        console.log('✅ Usuario encontrado en BD');
        console.log(`📧 Email: ${newUser.email}`);
        console.log(`🔒 PasswordHash: ${newUser.passwordHash ? 'SÍ TIENE HASH' : 'NO TIENE HASH'}`);
      } else {
        console.log('❌ Usuario no encontrado en BD');
        return;
      }
    }

    console.log('\n3. 🔐 PROBANDO LOGIN...');
    
    // 3. Probar login con el usuario recién creado
    const loginData = {
      email: testUser.email,
      password: 'password123'
    };

    const loginResponse = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log(`📥 Status del login: ${loginResponse.status}`);

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

// Ejecutar la prueba
testRegistrationAndLogin();
