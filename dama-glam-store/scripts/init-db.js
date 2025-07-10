// Script para inicializar la base de datos con datos de prueba
const API_BASE_URL = 'http://localhost:7147/api';

async function initializeDatabase() {
  console.log('🗄️ Inicializando base de datos...\n');

  try {
    // Verificar estado actual
    console.log('1. Verificando estado actual de la BD...');
    const statusResponse = await fetch(`${API_BASE_URL}/Seed/status`);
    
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('📊 Estado actual:', status);
      
      const isEmpty = status.roles === 0 && status.secciones === 0 && status.productos === 0;
      
      if (isEmpty) {
        console.log('📦 Base de datos vacía, procediendo con la inicialización...\n');
        
        // Inicializar BD
        console.log('2. Ejecutando inicialización...');
        const initResponse = await fetch(`${API_BASE_URL}/Seed/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (initResponse.ok) {
          const result = await initResponse.json();
          console.log('✅ Inicialización exitosa!');
          console.log('📝 Resultado:', result.message);
          
          // Verificar estado después de la inicialización
          console.log('\n3. Verificando estado después de la inicialización...');
          const newStatusResponse = await fetch(`${API_BASE_URL}/Seed/status`);
          if (newStatusResponse.ok) {
            const newStatus = await newStatusResponse.json();
            console.log('📊 Nuevo estado:', newStatus);
          }
          
        } else {
          const errorText = await initResponse.text();
          console.log('❌ Error en la inicialización:', initResponse.status, initResponse.statusText);
          console.log('📝 Detalle del error:', errorText);
        }
        
      } else {
        console.log('✅ La base de datos ya contiene datos. No es necesario inicializar.');
      }
      
    } else {
      console.log('❌ No se pudo verificar el estado de la BD:', statusResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Error durante la inicialización:', error.message);
  }
  
  console.log('\n🏁 Proceso completado!');
}

// Ejecutar el script
initializeDatabase();
