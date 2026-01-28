# Backend – Plataforma Buscador de Cursos

## Descripción general

Este proyecto corresponde al **backend de una plataforma web de búsqueda y derivación de cursos**, desarrollada con **NestJS** y **MySQL**.

La aplicación tiene como objetivo centralizar la oferta de cursos dictados por **entidades externas** (universidades, consejos profesionales, institutos, estudios, etc.) y permitir que los usuarios:

- Busquen y exploren cursos por distintas temáticas
- Accedan al detalle de cada curso
- Inicien el proceso de inscripción desde la plataforma

La inscripción final **no se realiza en esta aplicación**, sino que el backend registra el evento y redirige al usuario hacia la página oficial del emisor del curso.

Este backend expone una **API REST** que será consumida por un **frontend en Next.js**.

---

## Contexto funcional

La plataforma funciona como un **agregador / buscador de cursos**, similar conceptualmente a un marketplace educativo, pero sin procesar pagos ni inscripciones internas.

Las responsabilidades principales del backend son:

- Administrar cursos y entidades emisoras
- Proveer endpoints de consulta pública
- Registrar leads (usuarios que iniciaron una inscripción)
- Servir como fuente de datos para el frontend

Los cursos son cargados manualmente por un **usuario administrador (superadmin)** desde herramientas internas.

---

## Arquitectura general

- **Framework**: NestJS (TypeScript)
- **Base de datos**: MySQL
- **ORM**: TypeORM
- **Estilo de API**: REST
- **Documentación**: Swagger

Arquitectura modular siguiendo las buenas prácticas de NestJS.

---

## Modelo de datos (resumen)

El backend trabaja con las siguientes entidades principales:

- **Users**: usuarios del sistema (opcional para navegación)
- **Roles**: control de permisos (superadmin, admin, user)
- **Organizations**: entidades que dictan los cursos
- **Courses**: cursos publicados en la plataforma
- **Categories**: temáticas (tributario, laboral, etc.)
- **CourseImages**: imágenes asociadas a cursos
- **CourseLeads**: registros de usuarios que iniciaron inscripción

El diseño permite registrar leads tanto de **usuarios autenticados** como de **visitantes anónimos**.

---

## Flujo principal de uso

1. El **superadmin** carga:
    - Organizaciones
    - Cursos
    - Categorías

2. El **frontend (Next.js)** consume la API para:
    - Listar cursos
    - Mostrar detalles
    - Filtrar por categoría, entidad o año

3. Cuando un usuario hace click en **"Iniciar inscripción"**:
    - El frontend llama a `POST /course-leads`
    - El backend registra el lead
    - El frontend redirige al usuario al `enrollment_url` externo

---

## Relación con el Frontend (Next.js)

Este backend está diseñado para ser consumido por un frontend desarrollado en **Next.js + TypeScript + Tailwind CSS**.

El frontend se encarga de:

- Renderizar la UI
- Manejar la navegación
- Ejecutar las llamadas a la API

Mientras que el backend se encarga de:

- Persistencia de datos
- Lógica de negocio
- Seguridad y control de acceso
- Registro de métricas (leads)

---

## Endpoints principales

### Cursos

- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id` (soft delete)

### Organizaciones

- `GET /api/organizations`
- `GET /api/organizations/:id`

### Categorías

- `GET /api/categories`

### Leads

- `POST /api/course-leads`

---

## Seguridad

- Acceso público para consultas
- Acceso restringido para:
    - Crear, editar y eliminar cursos

- Control de acceso inicial mediante **guard simple** (superadmin hardcodeado)
- Preparado para integrar autenticación real (JWT / OAuth) en etapas futuras

---

## Configuración del entorno

Variables de entorno necesarias:

```env
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=cursos_platform
```

Notas:

- La base de datos debe existir previamente
- `synchronize` está deshabilitado

---

## Documentación API

Swagger disponible en:

```
/api/docs
```

Incluye todos los endpoints, DTOs y modelos de datos.

---

## Objetivo del proyecto

Este backend no es un prototipo descartable, sino una **base sólida y escalable** pensada para evolucionar hacia:

- Autenticación real de usuarios
- Panel de administración completo
- Métricas avanzadas
- Monetización por visibilidad de cursos

---

## Ejecución en desarrollo

```bash
npm install
npm run start:dev
```

El servidor quedará disponible por defecto en:

```
http://localhost:3000/api
```

---

## Notas finales

Este README está pensado no solo como documentación técnica, sino también como **contexto semántico** para herramientas como **Cursor AI**, de modo que puedan comprender correctamente:

- El propósito del backend
- Su relación con el frontend
- Las decisiones de arquitectura tomadas
