# Módulo de Relación Secretaria-Doctor - ConsultSystemPro

## 1. Descripción General

El módulo de relación Secretaria-Doctor gestiona la asociación entre secretarias y doctores en el sistema ConsultSystemPro. Esta entidad proporciona una tabla de unión para implementar la relación muchos a muchos entre secretarias y doctores. Este documento detalla la estructura del módulo, sus componentes, y cómo debe ser utilizado desde el frontend según los estándares de calidad del proyecto.

## 2. Estructura del Módulo

La estructura del módulo de relación Secretaria-Doctor está organizada de la siguiente manera:

```
secretaryDoctor/
├── dto/                           # Objetos de Transferencia de Datos
│   ├── create-secretaryDoctor.dto.ts # DTO para creación de relaciones
│   └── update-secretaryDoctor.dto.ts # DTO para actualización de relaciones
├── entity/
│   └── secretaryDoctor.entity.ts  # Modelo de datos para la relación
├── docs/                          # Documentación del módulo
│   └── README.md                  # Este documento
├── secretaryDoctor.controller.ts  # Controlador HTTP con endpoints
├── secretaryDoctor.module.ts      # Módulo NestJS para inyección de dependencias
└── secretaryDoctor.service.ts     # Servicios de lógica de negocio
```

## 3. Modelo de Datos (SecretaryDoctor Entity)

La entidad SecretaryDoctor representa el modelo de datos de la relación entre secretarias y doctores en el sistema y contiene los siguientes campos:

| Campo        | Tipo      | Descripción                                       | Auditoría |
|-------------|-----------|---------------------------------------------------|-----------|
| id          | number    | Identificador único autogenerado                  | No        |
| deletedAt   | Date      | Fecha de eliminación (soft delete)                | No        |
| doctor      | Doctor    | Relación: Doctor asociado                         | No        |
| secretary   | Secretary | Relación: Secretaria asociada                     | No        |

## 4. Endpoints de la API

La API de relaciones Secretaria-Doctor puede accederse a través de los endpoints de Secretarias y Doctores:

| Método HTTP | Endpoint                | Descripción                               | Roles permitidos           |
|-------------|-------------------------|-------------------------------------------|----------------------------|
| GET         | /secretaries/:id        | Obtener secretaria con doctores asociados | admin, secretary, doctor   |
| GET         | /doctors/:id            | Obtener doctor con secretarias asociadas  | admin, secretary, doctor   |
| PATCH       | /secretaries/:id        | Actualizar doctores de una secretaria     | admin, doctor              |
| PATCH       | /doctors/:id            | Actualizar secretarias de un doctor       | admin                      |

## 5. Formato de Datos para el Frontend

### 5.1 Asignación de Doctores a una Secretaria (PATCH /secretaries/:id)

```json
{
  "doctorIds": [1, 2, 3]
}
```

### 5.2 Asignación de Secretarias a un Doctor (PATCH /doctors/:id)

```json
{
  "secretaryIds": [1, 2]
}
```

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

#### Obtener secretaria con sus doctores asociados

```typescript
// Usando Axios
async function getSecretaryWithDoctors(secretaryId) {
  try {
    const response = await apiCall.get(`/secretaries/${secretaryId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener secretaria con doctores:', error);
    throw error;
  }
}
```

#### Actualizar doctores de una secretaria

```typescript
// Usando Axios
async function updateSecretaryDoctors(secretaryId, doctorIds) {
  try {
    const response = await apiCall.patch(`/secretaries/${secretaryId}`, {
      doctorIds: doctorIds
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar doctores de secretaria:', error);
    throw error;
  }
}
```

## 7. Manejo de Errores

| Código HTTP | Descripción                                                 |
|------------|-------------------------------------------------------------|
| 400        | Bad Request - El formato de datos enviado es incorrecto     |
| 401        | Unauthorized - No se proporcionó token o el token expiró    |
| 403        | Forbidden - No tiene permisos para acceder a este recurso   |
| 404        | Not Found - La secretaria o doctor solicitado no existe     |
| 500        | Internal Server Error - Error en el servidor                |

## 8. Consideraciones de Seguridad

1. Verificar los permisos del usuario antes de permitir la asignación o desasignación de doctores/secretarias.
2. Validar que los IDs de doctores y secretarias existan antes de crear relaciones.
3. Implementar lógica de negocio para prevenir asignaciones no autorizadas o inconsistentes.

## 9. Control de Versiones

Este documento corresponde a la versión 1.0.0 del módulo de relación Secretaria-Doctor de ConsultSystemPro.

- Fecha de última actualización: 19 de abril de 2025
- Autor: Equipo de Desarrollo ConsultSystemPro

**Estado**: Aprobado para producción de acuerdo al estándar ISO 9001:2015, sección 7.5.3 "Control de la información documentada".