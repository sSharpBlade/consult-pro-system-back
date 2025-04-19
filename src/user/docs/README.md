# Módulo de Gestión de Usuarios - ConsultSystemPro

## 1. Descripción General

El módulo de gestión de usuarios proporciona las funcionalidades necesarias para administrar los usuarios del sistema ConsultSystemPro. Este documento detalla la estructura del módulo, sus componentes, y cómo debe ser utilizado desde el frontend según los estándares de calidad del proyecto.

## 2. Estructura del Módulo

La estructura del módulo de usuarios está organizada de la siguiente manera:

```
user/
├── dto/                   # Objetos de Transferencia de Datos
│   ├── create-user.dto.ts # DTO para creación de usuarios
│   └── update-user.dto.ts # DTO para actualización de usuarios
├── entity/
│   └── user.entity.ts     # Modelo de datos para usuarios
├── docs/                  # Documentación del módulo
│   └── README.md          # Este documento
├── user.controller.ts     # Controlador HTTP con endpoints
├── user.module.ts         # Módulo NestJS para inyección de dependencias
└── user.service.ts        # Servicios de lógica de negocio
```

## 3. Modelo de Datos (User Entity)

La entidad User representa el modelo de datos de un usuario en el sistema y contiene los siguientes campos:

| Campo        | Tipo                                     | Descripción                                    | Auditoría |
|--------------|------------------------------------------|------------------------------------------------|-----------|
| id           | number                                   | Identificador único autogenerado               | No        |
| dni          | string                                   | Documento de identidad (máx. 10 caracteres)    | No        |
| name         | string                                   | Nombre completo (máx. 100 caracteres)          | No        |
| email        | string                                   | Correo electrónico único (máx. 100 caracteres) | No        |
| password     | string                                   | Contraseña encriptada                          | No        |
| role         | 'admin' \| 'patient' \| 'doctor' \| 'secretary' | Rol del usuario en el sistema           | No        |
| createdAt    | Date                                     | Fecha de creación (automática)                 | No        |
| deletedAt    | Date                                     | Fecha de eliminación (soft delete)             | No        |
| createdBy    | string                                   | ID del usuario que creó el registro            | Sí        |
| lastModified | Date                                     | Última modificación (automática)               | Sí        |
| deletedBy    | string                                   | ID del usuario que eliminó el registro         | Sí        |

## 4. Endpoints de la API

La API de usuarios expone los siguientes endpoints, todos protegidos por autenticación JWT y control de acceso basado en roles:

| Método HTTP | Endpoint            | Descripción                  | Roles permitidos | Formato de respuesta |
|-------------|---------------------|------------------------------|------------------|----------------------|
| POST        | /users              | Crear un nuevo usuario       | admin            | User                 |
| GET         | /users              | Listar todos los usuarios    | admin            | User[]               |
| GET         | /users/:id          | Obtener un usuario específico| admin            | User                 |
| PUT         | /users/:id          | Actualizar un usuario        | admin            | User                 |
| DELETE      | /users/:id          | Eliminar un usuario          | admin            | (No content)         |
| POST        | /users/:id/restore  | Restaurar un usuario eliminado | admin          | (No content)         |

## 5. Formato de Datos para el Frontend

### 5.1 Creación de Usuario (POST /users)

```json
{
  "dni": "72845163",
  "name": "Nombre Completo",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "role": "patient"
}
```

### 5.2 Actualización de Usuario (PUT /users/:id)

```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo_email@example.com",
  "role": "doctor"
}
```

> **Nota**: El campo `password` es opcional al actualizar. Si no se incluye, se mantiene la contraseña actual.

## 6. Integración con el Frontend

### 6.1 Autenticación

Todas las solicitudes a estos endpoints deben incluir un token JWT válido en el encabezado de autorización:

```typescript
// Ejemplo con axios
const apiCall = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

### 6.2 Ejemplos de Uso

#### Listar todos los usuarios (solo administradores)

```typescript
// Usando Axios
async function getAllUsers() {
  try {
    const response = await apiCall.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}
```

#### Crear un nuevo usuario (solo administradores)

```typescript
// Usando Axios
async function createUser(userData) {
  try {
    const response = await apiCall.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}
```

#### Actualizar un usuario (solo administradores)

```typescript
// Usando Axios
async function updateUser(userId, userData) {
  try {
    const response = await apiCall.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario ${userId}:`, error);
    throw error;
  }
}
```

#### Eliminar un usuario (solo administradores)

```typescript
// Usando Axios
async function deleteUser(userId) {
  try {
    await apiCall.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar usuario ${userId}:`, error);
    throw error;
  }
}
```

## 7. Auditoría y Trazabilidad

El sistema registra automáticamente información de auditoría para cada operación:

- **Creación**: Se registra el ID del usuario que creó el registro en `createdBy`.
- **Modificación**: Se registra automáticamente la fecha de modificación en `lastModified`.
- **Eliminación**: Se registra el ID del usuario que eliminó el registro en `deletedBy`.

Estos datos de auditoría no deben ser manipulados desde el frontend.

## 8. Manejo de Errores

| Código HTTP | Descripción                                                 |
|------------|-------------------------------------------------------------|
| 400        | Bad Request - El formato de datos enviado es incorrecto     |
| 401        | Unauthorized - No se proporcionó token o el token expiró    |
| 403        | Forbidden - No tiene permisos para acceder a este recurso   |
| 404        | Not Found - El usuario solicitado no existe                 |
| 500        | Internal Server Error - Error en el servidor                |

## 9. Consideraciones de Seguridad

1. Nunca almacenar el token JWT en localStorage para implementaciones de producción, usar cookies HttpOnly.
2. No exponer información sensible en los logs o interfaces de usuario.
3. Las contraseñas nunca deben ser visibles en las respuestas de la API.
4. Implementar timeout de sesión y rotación de tokens para mejorar la seguridad.

## 10. Control de Versiones

Este documento corresponde a la versión 1.0.0 del módulo de usuarios de ConsultSystemPro.

- Fecha de última actualización: 18 de abril de 2025
- Autor: Equipo de Desarrollo ConsultSystemPro

**Estado**: Aprobado para producción de acuerdo al estándar ISO 9001:2015, sección 7.5.3 "Control de la información documentada".