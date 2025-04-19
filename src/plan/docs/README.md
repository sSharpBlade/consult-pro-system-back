# Módulo de Gestión de Planes - ConsultSystemPro

## 1. Descripción General

El módulo de gestión de planes proporciona las funcionalidades necesarias para administrar los planes de suscripción en el sistema ConsultSystemPro. Este documento detalla la estructura del módulo, sus componentes, y cómo debe ser utilizado desde el frontend según los estándares de calidad del proyecto.

## 2. Estructura del Módulo

La estructura del módulo de planes está organizada de la siguiente manera:

```
plan/
├── dto/                   # Objetos de Transferencia de Datos
│   ├── create-plan.dto.ts # DTO para creación de planes
│   └── update-plan.dto.ts # DTO para actualización de planes
├── entity/
│   └── plan.entity.ts     # Modelo de datos para planes
├── docs/                  # Documentación del módulo
│   └── README.md          # Este documento
├── plan.controller.ts     # Controlador HTTP con endpoints
├── plan.module.ts         # Módulo NestJS para inyección de dependencias
└── plan.service.ts        # Servicios de lógica de negocio
```

## 3. Modelo de Datos (Plan Entity)

La entidad Plan representa el modelo de datos de un plan de suscripción en el sistema y contiene los siguientes campos:

| Campo        | Tipo      | Descripción                                       | Auditoría |
|-------------|-----------|---------------------------------------------------|-----------|
| id          | number    | Identificador único autogenerado                  | No        |
| name        | string    | Nombre del plan (máx. 50 caracteres)              | No        |
| maxDoctors  | number    | Número máximo de doctores permitidos en el plan   | No        |
| price       | numeric   | Precio del plan (precisión 10, escala 2)          | No        |
| createdBy   | string    | ID del usuario que creó el registro               | Sí        |
| lastModified| Date      | Última modificación (automática)                  | Sí        |
| deletedAt   | Date      | Fecha de eliminación (soft delete)                | No        |
| deletedBy   | string    | ID del usuario que eliminó el registro            | Sí        |
| clinics     | Clinic[]  | Relación: Clínicas asociadas a este plan          | No        |

## 4. Endpoints de la API

La API de planes expone los siguientes endpoints, todos protegidos por autenticación JWT y control de acceso basado en roles:

| Método HTTP | Endpoint              | Descripción                        | Roles permitidos | Formato de respuesta |
|-------------|------------------------|------------------------------------|--------------------|----------------------|
| POST        | /plans                | Crear un nuevo plan                | admin              | Plan                 |
| GET         | /plans                | Listar todos los planes            | Todos              | Plan[]               |
| GET         | /plans/:id            | Obtener un plan específico         | Todos              | Plan                 |
| PUT         | /plans/:id            | Actualizar un plan                 | admin              | Plan                 |
| DELETE      | /plans/:id            | Eliminar un plan                   | admin              | (No content)         |
| POST        | /plans/:id/restore    | Restaurar un plan eliminado        | admin              | (No content)         |

## 5. Formato de Datos para el Frontend

### 5.1 Creación de Plan (POST /plans)

```json
{
  "name": "Plan Básico",
  "maxDoctors": 5,
  "price": 99.99
}
```

### 5.2 Actualización de Plan (PUT /plans/:id)

```json
{
  "name": "Plan Premium",
  "maxDoctors": 10,
  "price": 149.99
}
```

> **Nota**: Todos los campos son opcionales al actualizar. Solo se modificarán los campos incluidos en la solicitud.

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

#### Listar todos los planes

```typescript
// Usando Axios
async function getAllPlans() {
  try {
    const response = await apiCall.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Error al obtener planes:', error);
    throw error;
  }
}
```

#### Crear un nuevo plan

```typescript
// Usando Axios
async function createPlan(planData) {
  try {
    const response = await apiCall.post('/plans', planData);
    return response.data;
  } catch (error) {
    console.error('Error al crear plan:', error);
    throw error;
  }
}
```

#### Actualizar un plan

```typescript
// Usando Axios
async function updatePlan(planId, planData) {
  try {
    const response = await apiCall.put(`/plans/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar plan ${planId}:`, error);
    throw error;
  }
}
```

#### Eliminar un plan

```typescript
// Usando Axios
async function deletePlan(planId) {
  try {
    await apiCall.delete(`/plans/${planId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar plan ${planId}:`, error);
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
| 404        | Not Found - El plan solicitado no existe                    |
| 500        | Internal Server Error - Error en el servidor                |

## 9. Consideraciones de Seguridad

1. Nunca almacenar el token JWT en localStorage para implementaciones de producción, usar cookies HttpOnly.
2. No exponer información sensible en los logs o interfaces de usuario.
3. Implementar validaciones para evitar la manipulación de precios o límites desde el frontend.
4. Verificar los permisos del usuario antes de permitir operaciones de creación, modificación o eliminación.

## 10. Control de Versiones

Este documento corresponde a la versión 1.0.0 del módulo de planes de ConsultSystemPro.

- Fecha de última actualización: 19 de abril de 2025
- Autor: Equipo de Desarrollo ConsultSystemPro

**Estado**: Aprobado para producción de acuerdo al estándar ISO 9001:2015, sección 7.5.3 "Control de la información documentada".