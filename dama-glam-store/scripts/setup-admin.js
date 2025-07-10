// Script para crear un usuario administrador por defecto
const API_BASE_URL = 'http://localhost:7147/api';

async function createDefaultAdmin() {
  try {
    console.log('🔧 Creando usuario administrador por defecto...');
    
    const adminUser = {
      nombre: 'Administrador',
      email: 'admin@glamstore.com',
      passwordHash: 'admin123',
      telefono: '123-456-7890',
      direccion: 'Dirección Admin',
      activo: true,
      rolId: 1 // 1 para admin
    };

    const response = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminUser),
    });

    if (response.ok) {
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@glamstore.com');
      console.log('🔑 Contraseña: admin123');
      console.log('\n⚠️ IMPORTANTE: Cambia estas credenciales después del primer login');
    } else {
      const error = await response.text();
      console.log('❌ Error al crear administrador:', error);
      console.log('💡 Es posible que el usuario ya exista');
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el backend esté corriendo');
  }
}

// Función para probar el login del admin
async function testAdminLogin() {
  try {
    console.log('\n🧪 Probando login de administrador...');
    
    const response = await fetch(`${API_BASE_URL}/Usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@glamstore.com',
        password: 'admin123'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login de administrador exitoso');
      console.log('👤 Usuario:', data.user?.name || 'N/A');
      console.log('🔑 Token generado:', data.token ? 'Sí' : 'No');
    } else {
      console.log('❌ Error en login de administrador');
    }
  } catch (error) {
    console.log('❌ Error al probar login:', error.message);
  }
}

async function setupAdmin() {
  console.log('🚀 Configuración de Administrador - Dama Glam Store\n');
  
  await createDefaultAdmin();
  await testAdminLogin();
  
  console.log('\n📝 Instrucciones:');
  console.log('1. Usa las credenciales admin@glamstore.com / admin123');
  console.log('2. Después del login, verás el ícono de configuración en la navegación');
  console.log('3. Haz clic en el ícono de configuración para acceder al panel de admin');
  console.log('4. Cambia las credenciales por seguridad');
}

setupAdmin().catch(console.error);
