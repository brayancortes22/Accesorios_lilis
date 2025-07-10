// Script para verificar la conectividad con el backend
const API_BASE_URL = 'http://localhost:7147/api';

async function checkBackendConnection() {
  console.log('🔍 Verificando conexión con el backend...');
  console.log(`📍 URL del backend: ${API_BASE_URL}`);
  
  try {
    // Verificar si el servidor está corriendo
    const response = await fetch(`${API_BASE_URL}/Usuario/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ Backend está funcionando correctamente');
      return true;
    } else {
      console.log(`❌ Backend respondió con status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al backend');
    console.log('Error:', error.message);
    console.log('\n📋 Checklist para solucionar:');
    console.log('1. ¿Está corriendo el backend en el puerto 7147?');
    console.log('2. ¿El proyecto backend está compilado y ejecutándose?');
    console.log('3. ¿Hay algún firewall bloqueando el puerto?');
    console.log('4. ¿El endpoint /api/Usuario/test existe?');
    return false;
  }
}

async function testProductsEndpoint() {
  console.log('\n🛍️ Verificando endpoint de productos...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Producto`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const products = await response.json();
      console.log(`✅ Endpoint de productos funciona - ${products.length || 0} productos encontrados`);
      return true;
    } else {
      console.log(`❌ Endpoint de productos falló con status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error al acceder a productos:', error.message);
    return false;
  }
}

async function runDiagnostics() {
  console.log('🚀 Diagnóstico del Frontend - Dama Glam Store\n');
  
  const backendOk = await checkBackendConnection();
  
  if (backendOk) {
    await testProductsEndpoint();
    console.log('\n✅ El frontend está listo para funcionar!');
    console.log('\n📝 Para iniciar el desarrollo:');
    console.log('1. npm install (si no está hecho)');
    console.log('2. npm run dev');
    console.log('3. Abrir http://localhost:8080');
  } else {
    console.log('\n⚠️ Necesitas iniciar el backend primero');
    console.log('\n📝 Para iniciar el backend:');
    console.log('1. Ve a la carpeta back_accesorios/Accesorios');
    console.log('2. Ejecuta: dotnet run --project Web');
    console.log('3. Verifica que esté corriendo en puerto 7147');
  }
}

// Ejecutar diagnósticos
runDiagnostics().catch(console.error);
