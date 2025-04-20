# 📘 Normas de Calidad y Documentación del Proyecto – ConsultProSystem (Backend)

Este documento contiene las instrucciones para iniciar el proyecto y detalla cómo se cumple con las normas **ISO/IEC 25000** en la parte backend del sistema **ConsultProSystem**.

---

## 🚀 Cómo iniciar el proyecto

### 🧰 Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [NestJS CLI](https://docs.nestjs.com/):
  ```bash
  npm install -g @nestjs/cli
  ```
- [PostgreSQL](https://www.postgresql.org/) (v15 o superior)
- [Docker](https://www.docker.com/) (opcional, para despliegue en contenedores)

### 🛠 Instalación del proyecto

1. Clona el repositorio:

   ```bash
   git clone https://github.com/sSharpBlade/consult-pro-system-back
   ```

2. Accede al directorio del backend:

   ```bash
   cd consult-pro-system-back
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

### ⚙ Configuración del entorno

1. Crea un archivo `.env` basado en `.env.example` y configura las variables:
   ```env
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=admin
    DB_NAME=consultpro
    JWT_SECRET=<clave secreta>
   ```

### ▶️ Ejecutar el proyecto

Para desarrollo:

```bash
npm run start:dev
```

Para producción:

```bash
npm run build
npm run start:prod
```

---

## 📁 Estructura del Proyecto

```
src/
├── app.controller.ts        # Controlador principal
├── app.module.ts           # Módulo raíz
├── app.service.ts          # Servicio principal
├── main.ts                 # Punto de entrada
│
├── auth/                   # Autenticación JWT
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── strategies/         # Estrategias de autenticación
│   └── guards/             # Guards de autorización
│
├── user/                   # Gestión de usuarios
│   ├── user.entity.ts
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
│
├── appointment/            # Citas médicas
│   ├── entity/
│   ├── dto/
│   ├── *.controller.ts
│   ├── *.module.ts
│   └── *.service.ts
│
├── clinic/                 # Clínicas
├── doctor/                 # Doctores
├── prescription/           # Recetas médicas
├── secretary/              # Secretarias
└── ...                     # Otros módulos

test/                       # Pruebas E2E
.env                        # Variables de entorno
```

---

## 📐 Cumplimiento de las Normas ISO/IEC 25000

### 1. ✅ ISO/IEC 25010: Calidad del Producto Software

| Criterio           | Implementación                                                                |
| ------------------ | ----------------------------------------------------------------------------- |
| **Funcionalidad**  | Sistema de roles (admin, doctor, secretary) y módulos específicos por entidad |
| **Fiabilidad**     | Manejo de errores con filtros globales y logs detallados                      |
| **Usabilidad**     | API RESTful con documentación Swagger integrada                               |
| **Eficiencia**     | Optimización de queries con TypeORM y cache                                   |
| **Seguridad**      | Autenticación JWT, hashing de contraseñas, protección de rutas                |
| **Compatibilidad** | Compatible con PostgreSQL y MySQL                                             |
| **Mantenibilidad** | Estructura modular con NestJS, código tipado con TypeScript                   |
| **Portabilidad**   | Configuración por environment variables, despliegue en Docker                 |

### 2. ✅ ISO/IEC 25012: Calidad de Datos

- Validación estricta de datos con `class-validator`
- Registro de auditoría en entidades sensibles
- Relaciones bien definidas entre entidades
- Políticas de retención y eliminación de datos

### 3. ✅ ISO/IEC 25023: Medidas de Calidad

- Métricas de performance con `@nestjs/schedule`
- Monitoreo de errores con filtros globales
- Logs estructurados para auditoría

### 4. ✅ ISO/IEC 25040-25044: Proceso de Evaluación

- Pruebas E2E automatizadas
- Documentación técnica de la API
- Checklist de revisión de código

---

## ✅ Recomendaciones para Mantener la Calidad

1. **Documentación**:

   - Documentar decisiones arquitectónicas

2. **Pruebas**:

   - Implementar pruebas de carga

3. **Seguridad**:

   - Auditorías periódicas de seguridad
   - Rotación de claves JWT

4. **Monitorización**:

   - Implementar métricas con Prometheus
   - Configurar alertas tempranas

5. **CI/CD**:
   - Integración continua con checks de calidad
   - Despliegue automatizado con rollback

---

## 👨‍💻 Líder del Proyecto

**Hamilton**
