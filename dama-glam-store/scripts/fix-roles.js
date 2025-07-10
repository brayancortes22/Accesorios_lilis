// Script para arreglar los roles y usuarios
const API_BASE_URL = 'http://localhost:7147/api';

async function fixUserRoles() {
  console.log('🔧 Arreglando roles de usuarios...\n');

  // 1. Crear un usuario cliente (RolId = 2)
  console.log('👤 Creando usuario cliente...');
  try {
    const clientUser = {
      nombre: 'Cliente Test',
      email: 'cliente@test.com',
      passwordHash: 'cliente123',
      telefono: '123-456-7890',
      direccion: 'Dirección Cliente',
      activo: true,
      rolId: 2 // Rol de cliente
    };

    const clientResponse = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientUser),
    });

    if (clientResponse.ok) {
      console.log('✅ Usuario cliente creado exitosamente');
      console.log('📧 Email: cliente@test.com');
      console.log('🔑 Contraseña: cliente123');
    } else {
      const error = await clientResponse.text();
      console.log('❌ Error al crear cliente:', error);
    }
  } catch (error) {
    console.log('❌ Error de conexión al crear cliente:', error.message);
  }

  // 2. Probar login simple con diferentes credenciales
  console.log('\n🧪 Probando diferentes credenciales de login...');
  
  const testCredentials = [
    { email: 'admin@glamstore.com', password: 'admin123', name: 'Admin por defecto' },
    { email: 'elmundodelanime92@gmail.com', password: 'admin123', name: 'Admin existente' },
    { email: 'bscl2006@gmail.com', password: 'admin123', name: 'Usuario bscl' },
    { email: 'cliente@test.com', password: 'cliente123', name: 'Cliente nuevo' }
  ];

  for (const creds of testCredentials) {
    try {
      console.log(`\n🔍 Probando ${creds.name}:`);
      const response = await fetch(`${API_BASE_URL}/Usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Login exitoso para ${creds.email}`);
        console.log(`   - Nombre: ${data.user?.name || 'N/A'}`);
        console.log(`   - RolId: ${data.user?.rolId || 'N/A'}`);
        console.log(`   - Role: ${data.user?.role || 'N/A'}`);
        console.log(`   - Token: ${data.token ? 'Generado' : 'No generado'}`);
      } else {
        console.log(`❌ Error ${response.status} para ${creds.email}`);
        if (response.status === 401) {
          console.log('   - Credenciales incorrectas');
        } else if (response.status === 500) {
          console.log('   - Error interno del servidor');
        }
      }
    } catch (error) {
      console.log(`❌ Error de conexión para ${creds.email}:`, error.message);
    }
  }
}

async function listAllUsers() {
  console.log('\n📋 Lista completa de usuarios:');
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario`);
    if (response.ok) {
      const users = await response.json();
      console.log('✅ Usuarios encontrados:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 RolId: ${user.rolId} (${user.rolId === 1 ? 'Admin' : 'Cliente'})`);
        console.log(`   📱 Teléfono: ${user.telefono || 'N/A'}`);
        console.log(`   🏠 Dirección: ${user.direccion || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No se pudo obtener la lista de usuarios');
    }
  } catch (error) {
    console.log('❌ Error al obtener usuarios:', error.message);
  }
}

async function main() {
  console.log('🚀 Script de Reparación de Roles y Login\n');
  
  await fixUserRoles();
  await listAllUsers();
  
  console.log('\n📝 Resumen:');
  console.log('1. Verifica que se haya creado el usuario cliente');
  console.log('2. Prueba hacer login con las credenciales que funcionaron');
  console.log('3. Si sigue dando error 500, revisa los logs del backend');
  console.log('4. Usa las credenciales exitosas en el frontend');
}

main().catch(console.error);
