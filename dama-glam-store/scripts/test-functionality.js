// Script para probar todas las funcionalidades de la aplicación
const API_BASE_URL = 'http://localhost:7147/api';

async function testAllFunctionalities() {
  console.log('🧪 Iniciando pruebas completas de funcionalidades...\n');

  // 1. Probar obtener productos (catálogo)
  await testProductCatalog();
  
  // 2. Probar registro de usuario
  await testUserRegistration();
  
  // 3. Probar login
  await testUserLogin();
  
  // 4. Crear usuario administrador
  await createAdminUser();
  
  // 5. Probar obtener secciones
  await testSections();
  
  console.log('\n🏁 Pruebas completadas!');
}

async function testProductCatalog() {
  console.log('📦 1. PROBANDO CATÁLOGO DE PRODUCTOS');
  console.log('=====================================');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Producto`);
    
    if (response.ok) {
      const productos = await response.json();
      console.log(`✅ Productos obtenidos: ${productos.length}`);
      
      if (productos.length > 0) {
        console.log('🔍 Productos disponibles:');
        productos.forEach((producto, index) => {
          if (index < 3) { // Mostrar solo los primeros 3
            console.log(`   ${index + 1}. ${producto.name || producto.nombre} - $${producto.precio}`);
          }
        });
        if (productos.length > 3) {
          console.log(`   ... y ${productos.length - 3} productos más`);
        }
      }
    } else {
      console.log(`❌ Error al obtener productos: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
}

async function testSections() {
  console.log('📂 5. PROBANDO SECCIONES DE PRODUCTOS');
  console.log('====================================');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Seccion`);
    
    if (response.ok) {
      const secciones = await response.json();
      console.log(`✅ Secciones obtenidas: ${secciones.length}`);
      
      if (secciones.length > 0) {
        console.log('🗂️ Secciones disponibles:');
        secciones.forEach((seccion, index) => {
          console.log(`   ${index + 1}. ${seccion.name || seccion.nombre} - ${seccion.description || seccion.descripcion}`);
        });
      }
    } else {
      console.log(`❌ Error al obtener secciones: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
}

async function testUserRegistration() {
  console.log('👤 2. PROBANDO REGISTRO DE USUARIO');
  console.log('=================================');
  
  // Usar timestamp para hacer el email único
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Usuario Test',
    email: `test${timestamp}@example.com`,
    passwordHash: 'password123',
    telefono: '1234567890',
    direccion: 'Calle Test 123',
    ciudad: 'Ciudad Test',
    pais: 'País Test',
    rolId: 2 // Cliente
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Usuario registrado exitosamente');
      console.log(`📧 Email: ${testUser.email}`);
      console.log(`👤 Nombre: ${testUser.nombre}`);
      
      // Guardar el email para usar en login
      global.testUserEmail = testUser.email;
      global.testUserPassword = testUser.passwordHash;
    } else {
      const errorText = await response.text();
      console.log(`❌ Error en registro: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
}

async function testUserLogin() {
  console.log('🔐 3. PROBANDO LOGIN DE USUARIO');
  console.log('==============================');
  
  const loginData = {
    email: global.testUserEmail || 'test@example.com',
    password: global.testUserPassword || 'password123'
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login exitoso');
      console.log(`🎫 Token obtenido: ${result.token ? 'Sí' : 'No'}`);
      console.log(`👤 Usuario: ${result.user?.name || 'N/A'}`);
      console.log(`📧 Email: ${result.user?.email || 'N/A'}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Error en login: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
}

async function createAdminUser() {
  console.log('👑 4. CREANDO USUARIO ADMINISTRADOR');
  console.log('==================================');
  
  // Usar timestamp para hacer el email único si es necesario
  const timestamp = Date.now();
  const adminUser = {
    nombre: 'Administrador',
    email: 'admin@accesorios.com',
    passwordHash: 'admin123',
    telefono: '0987654321',
    direccion: 'Oficina Central',
    ciudad: 'Ciudad Principal',
    pais: 'Colombia',
    rolId: 1 // Admin
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminUser)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Usuario administrador creado exitosamente');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Password: ${adminUser.passwordHash}`);
      console.log('👑 Rol: Administrador');
    } else {
      const errorText = await response.text();
      if (response.status === 400 && errorText.includes('existe')) {
        console.log('ℹ️ Usuario administrador ya existe');
        console.log(`📧 Email: ${adminUser.email}`);
        console.log(`🔑 Password: ${adminUser.passwordHash}`);
        console.log('👑 Rol: Administrador');
      } else {
        console.log(`❌ Error al crear admin: ${response.status} - ${errorText}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
}

// Ejecutar todas las pruebas
testAllFunctionalities();
