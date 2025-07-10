// Script para actualizar contraseñas de usuarios existentes
const API_BASE_URL = 'http://localhost:7147/api';

async function updateUserPasswords() {
  console.log('🔐 Actualizando contraseñas de usuarios existentes...\n');

  try {
    // Obtener todos los usuarios
    console.log('1. Obteniendo usuarios existentes...');
    const usersResponse = await fetch(`${API_BASE_URL}/Usuario`);
    
    if (!usersResponse.ok) {
      console.log('❌ Error al obtener usuarios:', usersResponse.status);
      return;
    }

    const users = await usersResponse.json();
    console.log(`✅ Encontrados ${users.length} usuarios`);

    // Definir contraseñas por usuario
    const userPasswords = {
      'test@example.com': 'password123',
      'admin@accesorios.com': 'admin123'
    };

    // Actualizar cada usuario
    for (const user of users) {
      const password = userPasswords[user.email];
      
      if (password) {
        console.log(`\n2. Actualizando usuario: ${user.email}`);
        
        // Crear UsuarioUpdateDto
        const updateData = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
          direccion: user.direccion,
          ciudad: user.ciudad,
          pais: user.pais,
          rolId: user.rolId,
          activo: user.activo || true,
          // La nueva contraseña se enviará por separado
          nuevaPassword: password
        };

        const updateResponse = await fetch(`${API_BASE_URL}/Usuario/${user.id}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevaPassword: password })
        });

        if (updateResponse.ok) {
          console.log(`✅ Contraseña actualizada para ${user.email}`);
        } else {
          const errorText = await updateResponse.text();
          console.log(`❌ Error actualizando ${user.email}: ${updateResponse.status} - ${errorText}`);
        }
      } else {
        console.log(`⚠️ No hay contraseña definida para: ${user.email}`);
      }
    }

    console.log('\n🎯 Proceso de actualización completado!');
    console.log('\n📋 Credenciales actualizadas:');
    console.log('   👤 Cliente: test@example.com / password123');
    console.log('   👑 Admin: admin@accesorios.com / admin123');

  } catch (error) {
    console.log('❌ Error durante la actualización:', error.message);
  }
}

// Ejecutar actualización
updateUserPasswords();
