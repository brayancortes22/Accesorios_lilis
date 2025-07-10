# migraciones metase al web
dotnet ef migrations add InitialCreate --project ../Entity/ --startup-project .
# Aplicar la migración y crear la base de datos en MySQL/MariaDB.
dotnet ef database update --project ../Entity/ --startup-project .

# estructura de la base de datos

## Esquema de la base de datos (Markdown)

### Usuarios
| Campo           | Tipo      | Restricciones         |
|-----------------|-----------|----------------------|
| id              | int       | PK, auto-increment   |
| name            | varchar   |                      |
| description     | varchar   |                      |
| email           | varchar   | único                |
| password_hash   | varchar   |                      |
| telefono        | varchar   |                      |
| direccion       | varchar   |                      |
| fecha_registro  | datetime  |                      |
| rol_id          | int       | FK -> roles.id       |
| activo          | bool      |                      |

### Roles
| Campo       | Tipo      | Restricciones       |
|-------------|-----------|--------------------|
| id          | int       | PK, auto-increment |
| name        | varchar   |                    |
| description | varchar   |                    |

### Secciones
| Campo       | Tipo      | Restricciones       |
|-------------|-----------|--------------------|
| id          | int       | PK, auto-increment |
| name        | varchar   |                    |
| description | varchar   |                    |

### Productos
| Campo        | Tipo      | Restricciones         |
|--------------|-----------|----------------------|
| id           | int       | PK, auto-increment   |
| name         | varchar   |                      |
| description  | varchar   |                      |
| precio       | decimal   |                      |
| stock        | int       |                      |
| imagen_url   | varchar   |                      |
| seccion_id   | int       | FK -> secciones.id   |
| es_encargo   | bool      |                      |

### Carritos
| Campo        | Tipo      | Restricciones         |
|--------------|-----------|----------------------|
| id           | int       | PK, auto-increment   |
| name         | varchar   |                      |
| description  | varchar   |                      |
| usuario_id   | int       | FK -> usuarios.id    |
| estado       | varchar   |                      |

### Carrito_Productos
| Campo           | Tipo      | Restricciones           |
|-----------------|-----------|------------------------|
| id              | int       | PK, auto-increment     |
| name            | varchar   |                        |
| description     | varchar   |                        |
| carrito_id      | int       | FK -> carritos.id      |
| producto_id     | int       | FK -> productos.id     |
| cantidad        | int       |                        |
| detalle_encargo | varchar   |                        |

### Pedidos
| Campo            | Tipo      | Restricciones         |
|------------------|-----------|----------------------|
| id               | int       | PK, auto-increment   |
| name             | varchar   |                      |
| description      | varchar   |                      |
| usuario_id       | int       | FK -> usuarios.id    |
| fecha_pedido     | datetime  |                      |
| total            | decimal   |                      |
| estado           | varchar   |                      |
| whatsapp_enviado | bool      |                      |
| metodo_pago      | varchar   |                      |
| direccion_entrega| varchar   |                      |
| comentarios      | varchar   |                      |

### Pedido_Productos
| Campo           | Tipo      | Restricciones           |
|-----------------|-----------|------------------------|
| id              | int       | PK, auto-increment     |
| name            | varchar   |                        |
| description     | varchar   |                        |
| pedido_id       | int       | FK -> pedidos.id       |
| producto_id     | int       | FK -> productos.id     |
| cantidad        | int       |                        |
| detalle_encargo | varchar   |                        |

### Whatsapp_Mensajes
| Campo         | Tipo      | Restricciones           |
|---------------|-----------|------------------------|
| id            | int       | PK, auto-increment     |
| name          | varchar   |                        |
| description   | varchar   |                        |
| pedido_id     | int       | FK -> pedidos.id       |
| mensaje       | varchar   |                        |
| fecha_envio   | datetime  |                        |
| estado_envio  | varchar   |                        |
