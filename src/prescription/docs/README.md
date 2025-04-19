# Módulo de Gestión de Prescripciones - ConsultSystemPro

## 1. Descripción General

El módulo de gestión de prescripciones proporciona las funcionalidades necesarias para administrar las prescripciones médicas en el sistema ConsultSystemPro. Este documento detalla la estructura del módulo, sus componentes, y cómo debe ser utilizado desde el frontend según los estándares de calidad del proyecto.

## 2. Estructura del Módulo

La estructura del módulo de prescripciones está organizada de la siguiente manera:

```
prescription/
├── dto/                           # Objetos de Transferencia de Datos
│   ├── create-prescription.dto.ts # DTO para creación de prescripciones
│   └── update-prescription.dto.ts # DTO para actualización de prescripciones
├── entity/
│   └── prescription.entity.ts     # Modelo de datos para prescripciones
├── docs/                          # Documentación del módulo
│   └── README.md                  # Este documento
├── prescription.controller.ts     # Controlador HTTP con endpoints
├── prescription.module.ts         # Módulo NestJS para inyección de dependencias
└── prescription.service.ts        # Servicios de lógica de negocio
```

## 3. Modelo de Datos (Prescription Entity)

La entidad Prescription representa el modelo de datos de una prescripción médica en el sistema y contiene los siguientes campos:

| Campo        | Tipo        | Descripción                                       | Auditoría |
|-------------|-------------|---------------------------------------------------|-----------|
| id          | number      | Identificador único autogenerado                  | No        |
| document    | text        | Contenido de la prescripción médica               | No        |
| createdAt   | Date        | Fecha de creación (automática)                    | No        |
| createdBy   | string      | ID del usuario que creó el registro               | Sí        |
| lastModified| Date        | Última modificación (automática)                  | Sí        |
| deletedAt   | Date        | Fecha de eliminación (soft delete)                | No        |
| deletedBy   | string      | ID del usuario que eliminó el registro            | Sí        |
| appointment | Appointment | Relación: Cita médica asociada a esta prescripción| No        |
| doctor      | Doctor      | Relación: Doctor que generó la prescripción       | No        |

## 4. Endpoints de la API

La API de prescripciones expone los siguientes endpoints, todos protegidos por autenticación JWT y control de acceso basado en roles:

| Método HTTP | Endpoint                      | Descripción                          | Roles permitidos  | Formato de respuesta |
|-------------|-------------------------------|--------------------------------------|--------------------|----------------------|
| POST        | /prescriptions                | Crear una nueva prescripción         | admin, doctor      | Prescription         |
| GET         | /prescriptions                | Listar todas las prescripciones      | Todos              | Prescription[]       |
| GET         | /prescriptions?appointmentId=X| Listar por cita médica              | Todos              | Prescription[]       |
| GET         | /prescriptions/:id            | Obtener una prescripción específica  | Todos              | Prescription         |
| PUT         | /prescriptions/:id            | Actualizar una prescripción          | admin, doctor      | Prescription         |
| DELETE      | /prescriptions/:id            | Eliminar una prescripción            | admin, doctor      | (No content)         |
| POST        | /prescriptions/:id/restore    | Restaurar una prescripción eliminada | admin, doctor      | (No content)         |

## 5. Formato de Datos para el Frontend

### 5.1 Creación de Prescripción (POST /prescriptions)

```json
{
  "document": "Diagnóstico: Gripe estacional. Tratamiento: Paracetamol 500mg cada 8 horas durante 3 días...",
  "appointmentId": 123,
  "doctorId": 456
}
```

### 5.2 Actualización de Prescripción (PUT /prescriptions/:id)

```json
{
  "document": "Diagnóstico actualizado: Infección viral respiratoria. Tratamiento: Paracetamol 500mg cada 8 horas durante 5 días...",
  "doctorId": 456
}
```

> **Nota**: El campo `appointmentId` no puede ser modificado una vez creada la prescripción, ya que una prescripción está vinculada a una cita específica.

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

#### Listar prescripciones por cita médica

```typescript
// Usando Axios
async function getPrescriptionsByAppointment(appointmentId) {
  try {
    const response = await apiCall.get(`/prescriptions?appointmentId=${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener prescripciones:', error);
    throw error;
  }
}
```

#### Crear una nueva prescripción

```typescript
// Usando Axios
async function createPrescription(prescriptionData) {
  try {
    const response = await apiCall.post('/prescriptions', prescriptionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear prescripción:', error);
    throw error;
  }
}
```

#### Actualizar una prescripción

```typescript
// Usando Axios
async function updatePrescription(prescriptionId, prescriptionData) {
  try {
    const response = await apiCall.put(`/prescriptions/${prescriptionId}`, prescriptionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar prescripción ${prescriptionId}:`, error);
    throw error;
  }
}
```

#### Eliminar una prescripción

```typescript
// Usando Axios
async function deletePrescription(prescriptionId) {
  try {
    await apiCall.delete(`/prescriptions/${prescriptionId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar prescripción ${prescriptionId}:`, error);
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
| 404        | Not Found - La prescripción solicitada no existe            |
| 409        | Conflict - Ya existe una prescripción para esa cita         |
| 500        | Internal Server Error - Error en el servidor                |

## 9. Consideraciones de Seguridad

1. Nunca almacenar el token JWT en localStorage para implementaciones de producción, usar cookies HttpOnly.
2. No exponer información sensible en los logs o interfaces de usuario.
3. Verificar que solo el doctor que atendió la cita o un administrador pueda modificar una prescripción.
4. Las prescripciones contienen información médica sensible que debe ser tratada de acuerdo a regulaciones como HIPAA o GDPR.

## 10. Control de Versiones

Este documento corresponde a la versión 1.0.0 del módulo de prescripciones de ConsultSystemPro.

- Fecha de última actualización: 19 de abril de 2025
- Autor: Equipo de Desarrollo ConsultSystemPro

**Estado**: Aprobado para producción de acuerdo al estándar ISO 9001:2015, sección 7.5.3 "Control de la información documentada".