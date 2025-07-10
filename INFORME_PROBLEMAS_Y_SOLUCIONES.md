# INFORME DE PROBLEMAS Y SOLUCIONES - SISTEMA DE AUTENTICACIÓN
## Proyecto: Accesorios Lilis v2 (Backend .NET + Frontend React)
### Fecha: 10 de julio de 2025

---

## 📋 RESUMEN EJECUTIVO

Este documento detalla los problemas encontrados en el sistema de autenticación del proyecto "Accesorios Lilis v2" y las soluciones implementadas para corregir el registro y login de usuarios.

**PROBLEMA PRINCIPAL**: Los usuarios se registraban sin hash de contraseña, causando fallos en el login con error 500.

**SOLUCIÓN IMPLEMENTADA**: Corrección del flujo de registro para asegurar el hasheo correcto de contraseñas usando BCrypt.

---

## 🐛 PROBLEMAS IDENTIFICADOS

### 1. ERRORES DE COMPILACIÓN INICIALES
**Descripción**: El backend tenía múltiples errores de compilación que impedían su ejecución.

**Errores específicos**:
- Referencias a clases inexistentes (WhatsApp)
- Métodos duplicados en controladores (`Create`, `Delete`)
- Rutas duplicadas en Swagger
- Falta de atributo `override` en métodos sobrescritos

**Impacto**: Backend no compilaba ni se ejecutaba.

### 2. PROBLEMA CRÍTICO: CONTRASEÑAS SIN HASHEAR
**Descripción**: Los usuarios se registraban pero sus contraseñas no se hasheaban correctamente.

**Síntomas**:
- Campo `PasswordHash` vacío en la base de datos (`''`)
- Error en login: `Invalid salt: salt cannot be null or empty`
- Fallo en verificación BCrypt durante login

**Causa raíz**: 
- Uso del método genérico `Create` en lugar del método específico `RegisterAsync`
- Inconsistencia entre nombres de campos en DTOs (`password` vs `passwordHash`)
- El método genérico no incluía lógica de hasheo de contraseñas

### 3. AMBIGÜEDAD DE RUTAS EN CONTROLADORES
**Descripción**: Múltiples métodos mapeados a la misma ruta HTTP.

**Error específico**:
```
AmbiguousMatchException: The request matched multiple endpoints.
Matches:
- UsuarioController.CreateFromCreateDto (Web)
- UsuarioController.Register (Web)
```

**Causa**: Dos métodos con `[HttpPost("register")]` en el mismo controlador.

### 4. INCONSISTENCIA EN ESTRUCTURA DE DATOS
**Descripción**: Discrepancias entre DTOs, modelos y requests del frontend.

**Problemas**:
- Frontend enviando `password`, backend esperando `passwordHash`
- Diferentes estructuras entre `UsuarioCreateDto` y `RegisterRequest`
- Falta de validación de estructura de datos

---

## 🔧 SOLUCIONES IMPLEMENTADAS

### 1. CORRECCIÓN DE ERRORES DE COMPILACIÓN

**Archivos modificados**:
- `Controllers/Implements/UsuarioController.cs`
- `Business/Implements/UsuarioBusiness.cs`
- Múltiples controladores para eliminar referencias a WhatsApp

**Acciones**:
- ✅ Eliminación de referencias a WhatsApp
- ✅ Corrección de métodos duplicados usando `override`
- ✅ Eliminación de atributos HTTP duplicados
- ✅ Resolución de conflictos de rutas en Swagger

### 2. IMPLEMENTACIÓN DE HASHEO SEGURO DE CONTRASEÑAS

**Archivos clave modificados**:
```
c:\Users\bscl\Desktop\Accesorios_lilis_v2\back_accesorios\Accesorios\
├── Business\Implements\UsuarioBusiness.cs
├── Web\Controllers\Implements\UsuarioController.cs
├── Entity\Dtos\UsuarioDto.cs
└── Utilities\Mappers\Profiles\UsuarioProfile.cs
```

**Método `RegisterAsync` corregido**:
```csharp
public async Task<UsuarioDto> RegisterAsync(UsuarioCreateDto usuarioCreateDto)
{
    // Validar que el email sea único
    if (await _usuarioData.ExistsByEmailAsync(usuarioCreateDto.Email))
        throw new BusinessException("Ya existe un usuario con este email");

    // CRÍTICO: Hashear la contraseña ANTES de crear el objeto
    var hashedPassword = HashPassword(usuarioCreateDto.PasswordHash);
    
    // Crear el Usuario MANUALMENTE para evitar problemas con AutoMapper
    var usuario = new Usuario
    {
        Nombre = usuarioCreateDto.Nombre,
        Email = usuarioCreateDto.Email,
        PasswordHash = hashedPassword, // ← AQUÍ SE ASIGNA EL HASH
        Telefono = usuarioCreateDto.Telefono,
        Direccion = usuarioCreateDto.Direccion,
        // ... otros campos
    };

    return await _usuarioData.SaveAsync(usuario);
}
```

**Método `HashPassword` implementado**:
```csharp
private string HashPassword(string password)
{
    return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt());
}
```

### 3. RESOLUCIÓN DE AMBIGÜEDAD DE RUTAS

**Problema**: Dos métodos con `[HttpPost("register")]`

**Solución**: Consolidación en un solo método optimizado:
```csharp
[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] UsuarioCreateDto createDto)
{
    // Validación y registro usando RegisterAsync
    var usuarioCreado = await _usuarioBusiness.RegisterAsync(createDto);
    
    // Respuesta estructurada
    var response = new
    {
        user = new { id = usuarioCreado.Id, name = usuarioCreado.Nombre, ... },
        message = "Usuario registrado exitosamente"
    };
    
    return Ok(response);
}
```

### 4. ESTANDARIZACIÓN DE ESTRUCTURA DE DATOS

**UsuarioCreateDto final**:
```csharp
public class UsuarioCreateDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // ← Nombre consistente
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? Pais { get; set; }
    public int RolId { get; set; } = 2;
    public bool Activo { get; set; } = true;
}
```

**Scripts de frontend actualizados**:
```javascript
const testUser = {
    nombre: 'Usuario Test',
    email: 'test@example.com',
    passwordHash: 'password123', // ← Campo consistente con DTO
    telefono: '1234567890',
    // ... otros campos
};
```

---

## 🧪 PRUEBAS Y VALIDACIÓN

### Scripts de Prueba Creados

1. **`debug-registration.js`**: Prueba individual del registro
2. **`test-login-simple.js`**: Prueba individual del login  
3. **`test-new-user.js`**: Prueba completa registro + login
4. **`test-functionality.js`**: Prueba integral del sistema

### Resultados de Pruebas

**✅ REGISTRO EXITOSO**:
```json
{
  "user": {
    "id": "15",
    "name": "Test Debug",
    "email": "debug1752150596065@test.com",
    "phone": "1234567890",
    "address": "Test Address"
  },
  "message": "Usuario registrado exitosamente"
}
```

**✅ LOGIN EXITOSO**:
```json
{
  "user": {
    "id": "15",
    "name": "Test Debug",
    "email": "debug1752150596065@test.com",
    "phone": "1234567890",
    "token": "[JWT_TOKEN_GENERADO]"
  }
}
```

**✅ VERIFICACIÓN EN BASE DE DATOS**:
- Usuario ID 15: `PasswordHash = $2a$11$[HASH_BCRYPT_VÁLIDO]`
- Campo no vacío, formato BCrypt correcto

---

## 🧪 GUÍA COMPLETA: PRUEBAS CON SCRIPTS DESDE EL FRONTEND

### 📋 INTRODUCCIÓN A LAS PRUEBAS CON SCRIPTS

Los scripts de prueba desde el frontend son herramientas fundamentales para:
- ✅ **Validar APIs** sin interfaz gráfica
- ✅ **Automatizar pruebas** de integración
- ✅ **Debuggear problemas** de conectividad
- ✅ **Simular usuarios** reales
- ✅ **Probar flujos completos** de manera rápida

### 🛠️ CONFIGURACIÓN DEL ENTORNO DE PRUEBAS

#### 1. **Estructura de Archivos**
```
dama-glam-store/
├── scripts/
│   ├── debug-registration.js     # Prueba individual de registro
│   ├── test-login-simple.js      # Prueba individual de login
│   ├── test-new-user.js          # Flujo completo registro+login
│   ├── test-functionality.js     # Prueba integral del sistema
│   ├── init-db.js                # Inicialización de datos
│   └── fix-passwords.js          # Utilidades de mantenimiento
├── package.json                  # Scripts NPM definidos
└── src/
    └── services/
        └── api.ts                # Cliente HTTP reutilizable
```

#### 2. **Scripts NPM Configurados**
En `package.json`:
```json
{
  "scripts": {
    "test:api": "node scripts/test-functionality.js",
    "test:registration": "node scripts/debug-registration.js",
    "test:login": "node scripts/test-login-simple.js",
    "test:new-user": "node scripts/test-new-user.js",
    "init:db": "node scripts/init-db.js"
  }
}
```

**Ejecutar scripts**:
```bash
npm run test:api          # Prueba completa
npm run test:registration # Solo registro
npm run test:login        # Solo login
npm run test:new-user     # Flujo registro+login
npm run init:db           # Inicializar datos
```

### 📝 TIPOS DE SCRIPTS DE PRUEBA

#### 1. **SCRIPT DE PRUEBA INDIVIDUAL (Registro)**

**Archivo**: `scripts/debug-registration.js`

```javascript
// Script simple para debug del registro
const API_BASE_URL = 'http://localhost:7147/api';

async function debugRegistration() {
  console.log('🔍 DEBUG: Registro paso a paso...\n');

  // Generar datos únicos para evitar conflictos
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Test Debug',
    email: `debug${timestamp}@test.com`,
    passwordHash: 'test123', // Campo que espera el backend
    telefono: '1234567890',
    direccion: 'Test Address',
    ciudad: 'Test City',
    pais: 'Test Country',
    rolId: 2,    // 2 = Cliente
    activo: true
  };

  console.log('📤 Datos a enviar:');
  console.log(JSON.stringify(testUser, null, 2));

  try {
    // Realizar petición HTTP
    const response = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    console.log(`\n📥 Response Status: ${response.status}`);
    console.log(`📥 Response Headers:`, Object.fromEntries(response.headers));

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Respuesta exitosa:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('\n❌ Error Response:');
      console.log(errorText);
    }

  } catch (error) {
    console.log(`\n❌ Error de conexión: ${error.message}`);
  }
}

// Ejecutar la función
debugRegistration();
```

**Ejecutar**:
```bash
node scripts/debug-registration.js
```

**Salida esperada**:
```
🔍 DEBUG: Registro paso a paso...

📤 Datos a enviar:
{
  "nombre": "Test Debug",
  "email": "debug1752150596065@test.com",
  "passwordHash": "test123",
  "telefono": "1234567890",
  "direccion": "Test Address",
  "ciudad": "Test City",
  "pais": "Test Country",
  "rolId": 2,
  "activo": true
}

📥 Response Status: 200
📥 Response Headers: {
  'content-type': 'application/json; charset=utf-8',
  'date': 'Thu, 10 Jul 2025 12:29:57 GMT',
  'server': 'Kestrel'
}

✅ Respuesta exitosa:
{
  "user": {
    "id": "15",
    "name": "Test Debug",
    "email": "debug1752150596065@test.com",
    "phone": "1234567890",
    "address": "Test Address",
    "country": "Colombia",
    "city": "Bogotá",
    "createdAt": "2025-07-10T12:29:57.2604609Z"
  },
  "message": "Usuario registrado exitosamente"
}
```

#### 2. **SCRIPT DE PRUEBA INDIVIDUAL (Login)**

**Archivo**: `scripts/test-login-simple.js`

```javascript
// Script simple para probar login
const API_BASE_URL = 'http://localhost:7147/api';

async function testLogin() {
  console.log('🔐 Probando login...\n');

  // Usar credenciales de usuario existente
  const loginData = {
    email: 'debug1752150596065@test.com', // Email del usuario creado
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
      
      // Guardar token para uso posterior
      const token = result.token;
      console.log(`\n🎫 Token guardado: ${token ? 'SÍ' : 'NO'}`);
      
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
```

#### 3. **SCRIPT DE FLUJO COMPLETO (Registro + Login)**

**Archivo**: `scripts/test-new-user.js`

```javascript
// Script para probar registro y login completo
const API_BASE_URL = 'http://localhost:7147/api';

async function testRegistrationAndLogin() {
  console.log('🧪 Probando registro y login completo...\n');

  // 1. CREAR USUARIO ÚNICO
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Usuario Nuevo',
    email: `nuevo${timestamp}@test.com`,
    passwordHash: 'password123',
    telefono: '1234567890',
    direccion: 'Calle Nueva 123',
    ciudad: 'Ciudad Nueva',
    pais: 'Colombia',
    rolId: 2
  };

  let registrationSuccess = false;
  let userEmail = testUser.email;

  try {
    // PASO 1: REGISTRAR USUARIO
    console.log('1. 👤 REGISTRANDO NUEVO USUARIO...');
    console.log(`📧 Email: ${userEmail}`);
    
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
      console.log(`👤 ID: ${result.user.id}`);
      registrationSuccess = true;
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Error en registro:', registerResponse.status, errorText);
      return;
    }

    // PASO 2: INTENTAR LOGIN
    console.log('\n2. 🔐 PROBANDO LOGIN...');
    
    const loginData = {
      email: userEmail,
      password: 'password123' // Contraseña original (sin hash)
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
      
      // PASO 3: VERIFICAR DATOS DEL USUARIO
      console.log('\n3. 🔍 VERIFICANDO DATOS DEL USUARIO...');
      console.log(`🆔 ID: ${loginResult.user.id}`);
      console.log(`📱 Teléfono: ${loginResult.user.phone}`);
      console.log(`🏠 Dirección: ${loginResult.user.address}`);
      console.log(`🌍 País: ${loginResult.user.country}`);
      
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
```

#### 4. **SCRIPT DE PRUEBA INTEGRAL DEL SISTEMA**

**Archivo**: `scripts/test-functionality.js`

```javascript
// Script completo para probar todas las funcionalidades
const API_BASE_URL = 'http://localhost:7147/api';

async function testSystemFunctionality() {
  console.log('🧪 PRUEBA INTEGRAL DEL SISTEMA\n');
  console.log('=' .repeat(50));

  // Test 1: Conectividad básica
  await testConnectivity();
  
  // Test 2: Endpoints públicos
  await testPublicEndpoints();
  
  // Test 3: Registro de usuario
  const newUser = await testUserRegistration();
  
  // Test 4: Login
  if (newUser) {
    await testUserLogin(newUser.email, newUser.password);
  }
  
  // Test 5: Endpoints protegidos (si hay token)
  // await testProtectedEndpoints(token);

  console.log('\n🏁 PRUEBA INTEGRAL COMPLETADA');
}

async function testConnectivity() {
  console.log('\n1. 🌐 PROBANDO CONECTIVIDAD...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Producto`, { method: 'GET' });
    console.log(`✅ Conectividad OK (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ Error de conectividad: ${error.message}`);
    return false;
  }
}

async function testPublicEndpoints() {
  console.log('\n2. 🔓 PROBANDO ENDPOINTS PÚBLICOS...');
  
  const endpoints = [
    { name: 'Productos', url: '/Producto' },
    { name: 'Secciones', url: '/Seccion' },
    { name: 'Usuarios', url: '/Usuario' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length : 'OK'} registros`);
      } else {
        console.log(`❌ ${endpoint.name}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

async function testUserRegistration() {
  console.log('\n3. 👤 PROBANDO REGISTRO DE USUARIO...');
  
  const timestamp = Date.now();
  const newUser = {
    nombre: 'Test Integral',
    email: `integral${timestamp}@test.com`,
    passwordHash: 'test123',
    telefono: '1234567890',
    direccion: 'Test Address',
    ciudad: 'Test City',
    pais: 'Test Country',
    rolId: 2,
    activo: true
  };

  try {
    const response = await fetch(`${API_BASE_URL}/Usuario/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Usuario registrado: ID ${result.user.id}`);
      return { email: newUser.email, password: 'test123' };
    } else {
      console.log(`❌ Error en registro: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error en registro: ${error.message}`);
    return null;
  }
}

async function testUserLogin(email, password) {
  console.log('\n4. 🔐 PROBANDO LOGIN DE USUARIO...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Login exitoso: ${result.user.name}`);
      console.log(`🎫 Token generado: ${result.token ? 'SÍ' : 'NO'}`);
      return result.token;
    } else {
      console.log(`❌ Error en login: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error en login: ${error.message}`);
    return null;
  }
}

// Ejecutar prueba integral
testSystemFunctionality();
```

### 🎯 TÉCNICAS AVANZADAS DE PRUEBAS

#### 1. **Manejo de Tokens JWT**

```javascript
// Guardar token para peticiones autenticadas
let authToken = null;

async function authenticatedRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return fetch(url, {
    ...options,
    headers
  });
}

// Ejemplo de uso
const response = await authenticatedRequest(`${API_BASE_URL}/Usuario/profile`, {
  method: 'GET'
});
```

#### 2. **Validación de Datos de Respuesta**

```javascript
function validateUserResponse(user) {
  const requiredFields = ['id', 'name', 'email'];
  const missingFields = requiredFields.filter(field => !user[field]);
  
  if (missingFields.length > 0) {
    console.log(`❌ Campos faltantes: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    console.log(`❌ Email inválido: ${user.email}`);
    return false;
  }
  
  console.log(`✅ Usuario válido: ${user.name} (${user.email})`);
  return true;
}
```

#### 3. **Pruebas de Performance**

```javascript
async function performanceTest(url, iterations = 10) {
  console.log(`⏱️ Probando performance de ${url} (${iterations} iteraciones)`);
  
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    
    try {
      const response = await fetch(url);
      const end = Date.now();
      
      if (response.ok) {
        times.push(end - start);
        console.log(`Iteración ${i + 1}: ${end - start}ms`);
      } else {
        console.log(`Iteración ${i + 1}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`Iteración ${i + 1}: Error ${error.message}`);
    }
  }
  
  if (times.length > 0) {
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    console.log(`📊 Resultados:`);
    console.log(`   Promedio: ${average.toFixed(2)}ms`);
    console.log(`   Mínimo: ${min}ms`);
    console.log(`   Máximo: ${max}ms`);
  }
}
```

### 🚀 EJECUCIÓN DE PRUEBAS

#### **Método 1: Comandos NPM (Recomendado)**
```bash
# Prueba completa del sistema
npm run test:api

# Prueba específica de registro
npm run test:registration

# Prueba específica de login
npm run test:login

# Flujo completo registro+login
npm run test:new-user
```

#### **Método 2: Node.js Directo**
```bash
# Ejecutar script específico
node scripts/debug-registration.js

# Ejecutar con output detallado
node --trace-warnings scripts/test-functionality.js

# Ejecutar múltiples scripts en secuencia
node scripts/debug-registration.js && node scripts/test-login-simple.js
```

#### **Método 3: Desde PowerShell (Windows)**
```powershell
# Cambiar al directorio del frontend
cd "c:\Users\bscl\Desktop\Accesorios_lilis_v2\dama-glam-store"

# Ejecutar script
node scripts/debug-registration.js

# Ejecutar con timeout
timeout 30 node scripts/test-functionality.js
```

### 📊 INTERPRETACIÓN DE RESULTADOS

#### **✅ Resultado Exitoso**
```
🔍 DEBUG: Registro paso a paso...

📤 Datos a enviar:
{
  "nombre": "Test Debug",
  "email": "debug1752150596065@test.com",
  "passwordHash": "test123"
}

📥 Response Status: 200
✅ Respuesta exitosa:
{
  "user": {
    "id": "15",
    "name": "Test Debug",
    "email": "debug1752150596065@test.com"
  },
  "message": "Usuario registrado exitosamente"
}
```

#### **❌ Resultado con Error**
```
🔍 DEBUG: Registro paso a paso...

📥 Response Status: 500
❌ Error Response:
{
  "message": "Error interno del servidor"
}
```
