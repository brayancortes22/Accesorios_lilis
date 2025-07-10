# 🧪 GUÍA DE PRUEBAS MANUALES - Accesorios Lilis

## ✅ Estado Actual
- ✅ **Backend**: Funcionando en http://localhost:7147
- ✅ **Frontend**: Funcionando en http://localhost:8080  
- ✅ **Base de datos**: Poblada con datos de prueba
- ⚠️ **Login**: Error 500 (en investigación)

---

## 📝 PRUEBAS A REALIZAR

### 1. 🏠 **PÁGINA PRINCIPAL**
- [ ] Ir a: `http://localhost:8080`
- [ ] Verificar que se muestra el header con logo y navegación
- [ ] Verificar que se muestran productos destacados
- [ ] Verificar que el diseño es responsive

### 2. 📦 **CATÁLOGO DE PRODUCTOS**
- [ ] Hacer clic en "Catálogo" o ir a `/catalog`
- [ ] Verificar que se muestran los 9 productos de prueba:
  - Pulsera con Charms - $55,000
  - Collar de Cadena Dorada - $65,000
  - Anillo de Compromiso - $180,000
  - Y 6 productos más
- [ ] Verificar filtros por sección (Aretes, Collares, Pulseras, etc.)
- [ ] Verificar búsqueda por nombre

### 3. 👤 **REGISTRO DE USUARIO**
- [ ] Ir a `/register` o hacer clic en "Registrarse"
- [ ] Llenar el formulario:
  - Nombre: Tu nombre
  - Email: tu-email@test.com
  - Contraseña: password123
  - Teléfono: 123456789
  - Dirección: Tu dirección
- [ ] Hacer clic en "Registrarse"
- [ ] Verificar que se muestra mensaje de éxito

### 4. 🔐 **LOGIN** (Problema conocido)
❌ **Actualmente con error 500**
- [ ] Ir a `/login` o hacer clic en "Iniciar Sesión"
- [ ] Intentar con credenciales:
  - Email: `admin@accesorios.com`
  - Contraseña: `admin123`
- **Resultado esperado**: Error 500 (estamos trabajando en esto)

### 5. 🛒 **CARRITO DE COMPRAS**
- [ ] En el catálogo, hacer clic en "Agregar al carrito" en cualquier producto
- [ ] Verificar que aparece el ícono del carrito con contador
- [ ] Ir a `/cart` o hacer clic en el ícono del carrito
- [ ] Verificar que se muestra el producto agregado
- [ ] Probar cambiar cantidades
- [ ] Probar eliminar productos

### 6. 🗂️ **SECCIONES**
Las siguientes secciones deberían estar disponibles:
- [ ] **Aretes** - Aretes y pendientes
- [ ] **Collares** - Collares y cadenas  
- [ ] **Pulseras** - Pulseras y brazaletes
- [ ] **Anillos** - Anillos de diferentes estilos
- [ ] **Bolsas** - Bolsas y carteras
- [ ] **Relojes** - Relojes para dama
- [ ] **Gafas** - Gafas de sol

### 7. 📱 **NAVEGACIÓN MÓVIL**
- [ ] Reducir el tamaño de la ventana del navegador
- [ ] Verificar que aparece la navegación móvil en la parte inferior
- [ ] Probar navegación entre páginas

### 8. 👑 **ADMIN (Cuando se arregle el login)**
**Credenciales de administrador**:
- Email: `admin@accesorios.com`
- Contraseña: `admin123`

Una vez que funcione el login:
- [ ] Iniciar sesión como admin
- [ ] Ir a `/admin`
- [ ] Verificar panel de administración
- [ ] Probar gestión de productos
- [ ] Probar gestión de usuarios

---

## 🐛 PROBLEMAS CONOCIDOS

### ❌ **Error 500 en Login**
**Descripción**: El endpoint `/Auth/login` devuelve error 500
**Estado**: En investigación
**Workaround**: Las demás funcionalidades funcionan sin autenticación

### ⚠️ **Dependencias**
- BCrypt.Net agregado al backend
- JWT configurado correctamente
- Base de datos poblada

---

## 📊 DATOS DE PRUEBA DISPONIBLES

### **Usuarios**
```
- test@example.com / password123 (Cliente)
- admin@accesorios.com / admin123 (Admin)
```

### **Productos (9 disponibles)**
```
- Aretes Dorados Elegantes - $45,000
- Aretes de Perla - $35,000  
- Collar de Cadena Dorada - $65,000
- Pulsera con Charms - $55,000
- Anillo de Compromiso - $180,000
- Y 4 productos más...
```

---

## ✅ RESULTADOS ESPERADOS

1. ✅ **Catálogo**: Debe mostrar 9 productos
2. ✅ **Registro**: Debe funcionar correctamente
3. ❌ **Login**: Error 500 (en corrección)
4. ✅ **Carrito**: Debe funcionar sin autenticación
5. ✅ **Navegación**: Debe ser fluida y responsive

---

**💡 Nota**: Mientras solucionamos el problema del login, todas las demás funcionalidades de la tienda (catálogo, carrito, navegación) deberían funcionar perfectamente.
