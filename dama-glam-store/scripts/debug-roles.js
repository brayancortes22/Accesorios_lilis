// Script para debuggear la respuesta del login
const API_BASE_URL = 'http://localhost:7147/api';

async function testLogin() {
  console.log('🔍 Debugging Login Response\n');
  
  // Probar con admin
  console.log('👑 Probando login de admin...');
  try {
    const adminResponse = await fetch(`${API_BASE_URL}/Usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'elmundodelanime92@gmail.com',
        password: 'admin123'
      }),
    });

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Respuesta del admin:');
      console.log(JSON.stringify(adminData, null, 2));
      console.log('\n📋 Información del usuario admin:');
      console.log('- ID:', adminData.user?.id);
      console.log('- Nombre:', adminData.user?.name);
      console.log('- Email:', adminData.user?.email);
      console.log('- RolId:', adminData.user?.rolId);
      console.log('- Role:', adminData.user?.role);
    } else {
      console.log('❌ Error en login admin:', adminResponse.status);
    }
  } catch (error) {
    console.log('❌ Error de conexión admin:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Probar con cliente
  console.log('👤 Probando login de cliente...');
  try {
    const clientResponse = await fetch(`${API_BASE_URL}/Usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'bscl2006@gmail.com',
        password: 'admin123'
      }),
    });

    if (clientResponse.ok) {
      const clientData = await clientResponse.json();
      console.log('✅ Respuesta del cliente:');
      console.log(JSON.stringify(clientData, null, 2));
      console.log('\n📋 Información del usuario cliente:');
      console.log('- ID:', clientData.user?.id);
      console.log('- Nombre:', clientData.user?.name);
      console.log('- Email:', clientData.user?.email);
      console.log('- RolId:', clientData.user?.rolId);
      console.log('- Role:', clientData.user?.role);
    } else {
      console.log('❌ Error en login cliente:', clientResponse.status);
    }
  } catch (error) {
    console.log('❌ Error de conexión cliente:', error.message);
  }
}

async function checkDatabaseRoles() {
  console.log('\n🗄️ Verificando roles en la base de datos...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const users = await response.json();
      console.log('✅ Usuarios en la base de datos:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - RolId: ${user.rolId}`);
      });
    } else {
      console.log('❌ No se pudo obtener usuarios');
    }
  } catch (error) {
    console.log('❌ Error al obtener usuarios:', error.message);
  }
}

async function debugRoles() {
  await testLogin();
  await checkDatabaseRoles();
  
  console.log('\n📝 Próximos pasos:');
  console.log('1. Verificar que el backend devuelva el rolId en la respuesta del login');
  console.log('2. Actualizar el frontend para mapear rolId correctamente');
  console.log('3. RolId 1 = admin, RolId 2 = cliente');
}

debugRoles().catch(console.error);
