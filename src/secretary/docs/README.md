# Módulo de Gestión de Secretarias - ConsultSystemPro

## 1. Descripción General

El módulo de gestión de secretarias proporciona las funcionalidades necesarias para administrar las secretarias del sistema ConsultSystemPro. Este documento detalla la estructura del módulo, sus componentes, y cómo debe ser utilizado desde el frontend según los estándares de calidad del proyecto.

## 2. Estructura del Módulo

La estructura del módulo de secretarias está organizada de la siguiente manera:

```
secretary/
├── dto/                       # Objetos de Transferencia de Datos
│   ├── create-secretary.dto.ts # DTO para creación de secretarias
│   └── update-secretary.dto.ts # DTO para actualización de secretarias
├── entity/
│   └── secretary.entity.ts     # Modelo de datos para secretarias
├── docs/                      # Documentación del módulo
│   └── README.md              # Este documento
├── secretary.controller.ts     # Controlador HTTP con endpoints
├── secretary.module.ts         # Módulo NestJS para inyección de dependencias
└── secretary.service.ts        # Servicios de lógica de negocio
```

## 3. Modelo de Datos (Secretary Entity)

La entidad Secretary representa el modelo de datos de una secretaria en el sistema y contiene los siguientes campos:

| Campo           | Tipo      | Descripción                                       | Auditoría |
|-----------------|-----------|---------------------------------------------------|-----------|
| id              | number    | Identificador único autogenerado                  | No        |
| name            | string    | Nombre completo de la secretaria                  | No        |
| phone           | string    | Número de teléfono de contacto                    | No        |
| email           | string    | Correo electrónico                                | No        |
| isActive        | boolean   | Estado de actividad (por defecto: true)           | No        |
| created_at      | Date      | Fecha de creación (automática)                    | No        |
| createdBy       | string    | ID del usuario que creó el registro               | Sí        |
| lastModified    | Date      | Última modificación (automática)                  | Sí        |
| deletedBy       | string    | ID del usuario que inactivó la secretaria         | Sí        |
| doctors         | Doctor[]  | Relación: Doctores asociados a esta secretaria    | No        |
| secretaryDoctors| SecretaryDoctor[] | Relación: Asociación M:M con doctores     | No        |

## 4. Endpoints de la API

La API de secretarias expone los siguientes endpoints, todos protegidos por autenticación JWT y control de acceso basado en roles:

| Método HTTP | Endpoint                | Descripción                      | Roles permitidos           | Formato de respuesta |
|-------------|-------------------------|----------------------------------|----------------------------|----------------------|
| POST        | /secretaries            | Crear una nueva secretaria       | admin, doctor              | Secretary            |
| GET         | /secretaries            | Listar todas las secretarias     | admin, secretary, doctor   | Secretary[]          |
| GET         | /secretaries/:id        | Obtener una secretaria específica| admin, secretary, doctor   | Secretary            |
| PATCH       | /secretaries/:id        | Actualizar una secretaria        | admin, doctor              | Secretary            |
| DELETE      | /secretaries/:id        | Inactivar una secretaria         | admin, doctor              | Secretary            |

## 5. Formato de Datos para el Frontend

### 5.1 Creación de Secretaria (POST /secretaries)

```json
{
  "name": "Nombre Completo",
  "phone": "912345678",
  "email": "secretaria@example.com",
  "doctorIds": [1, 2, 3]
}
```

### 5.2 Actualización de Secretaria (PATCH /secretaries/:id)

```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo_email@example.com",
  "phone": "987654321",
  "doctorIds": [2, 4]
}
```

> **Nota**: El campo `doctorIds` es opcional al actualizar. Si no se incluye, se mantienen las asociaciones actuales con doctores.

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

#### Listar todas las secretarias

```typescript
// Usando Axios
async function getAllSecretaries() {
  try {
    const response = await apiCall.get('/secretaries');
    return response.data;
  } catch (error) {
    console.error('Error al obtener secretarias:', error);
    throw error;
  }
}
```

#### Crear una nueva secretaria

```typescript
// Usando Axios
async function createSecretary(secretaryData) {
  try {
    const response = await apiCall.post('/secretaries', secretaryData);
    return response.data;
  } catch (error) {
    console.error('Error al crear secretaria:', error);
    throw error;
  }
}
```

#### Actualizar una secretaria

```typescript
// Usando Axios
async function updateSecretary(secretaryId, secretaryData) {
  try {
    const response = await apiCall.patch(`/secretaries/${secretaryId}`, secretaryData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar secretaria ${secretaryId}:`, error);
    throw error;
  }
}
```

#### Eliminar una secretaria (inactivar)

```typescript
// Usando Axios
async function deleteSecretary(secretaryId) {
  try {
    await apiCall.delete(`/secretaries/${secretaryId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar secretaria ${secretaryId}:`, error);
    throw error;
  }
}
```

## 7. Auditoría y Trazabilidad

El sistema registra automáticamente información de auditoría para cada operación:

- **Creación**: Se registra el ID del usuario que creó el registro en `createdBy`.
- **Modificación**: Se registra automáticamente la fecha de modificación en `lastModified`.
- **Eliminación**: Se registra el ID del usuario que inactivó la secretaria en `deletedBy`.

Estos datos de auditoría no deben ser manipulados desde el frontend.

## 8. Manejo de Errores

| Código HTTP | Descripción                                                 |
|------------|-------------------------------------------------------------|
| 400        | Bad Request - El formato de datos enviado es incorrecto     |
| 401        | Unauthorized - No se proporcionó token o el token expiró    |
| 403        | Forbidden - No tiene permisos para acceder a este recurso   |
| 404        | Not Found - La secretaria solicitada no existe              |
| 500        | Internal Server Error - Error en el servidor                |

## 9. Consideraciones de Seguridad

1. Nunca almacenar el token JWT en localStorage para implementaciones de producción, usar cookies HttpOnly.
2. No exponer información sensible en los logs o interfaces de usuario.
3. Implementar timeout de sesión y rotación de tokens para mejorar la seguridad.
4. Validar que los doctores asociados existan y tengan permisos adecuados.

## 10. Control de Versiones

Este documento corresponde a la versión 1.0.0 del módulo de secretarias de ConsultSystemPro.

- Fecha de última actualización: 19 de abril de 2025
- Autor: Equipo de Desarrollo ConsultSystemPro

**Estado**: Aprobado para producción de acuerdo al estándar ISO 9001:2015, sección 7.5.3 "Control de la información documentada".