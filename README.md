# Cinevo Admin — Angular + Node.js + MongoDB

Este proyecto adapta el backend Node.js y el frontend Angular entregados. El backend original solo respondía `Hello World`, y `database.js` estaba vacío; por eso se añadió una API REST de catálogo y la conexión configurable con MongoDB. El frontend reemplaza la pantalla inicial de Angular por un panel administrativo oscuro/morado.

## Requisitos
- Node.js LTS instalado.
- MongoDB instalado y ejecutándose localmente, o una URI de MongoDB Atlas.
- npm.

## 1. Configurar MongoDB y backend
1. Abre una terminal en la carpeta `Backend`.
2. Instala dependencias: `npm install`.
3. Copia `.env.example` a `.env`.
   - En Windows CMD: `copy .env.example .env`
   - En PowerShell: `Copy-Item .env.example .env`
4. Si MongoDB está instalado localmente, la URI de ejemplo funciona si el servicio está iniciado: `mongodb://127.0.0.1:27017/cinevo`.
5. Si usas MongoDB Atlas, reemplaza `MONGODB_URI` por la cadena de conexión de tu clúster. No compartas credenciales ni subas `.env` a Git.
6. Inicia la API: `npm run dev`.
7. Comprueba en navegador o Postman: `http://localhost:3000/api/health`. Debe indicar `api: ok` y `database: connected`.

MongoDB creará la base `cinevo` y la colección `movies` automáticamente al guardar el primer registro. No se necesita importar un SQL.

## 2. Ejecutar Angular
Abre otra terminal en `Backend/frontend`:
1. `npm install`
2. `npm start`
3. Abre `http://localhost:4200`.

El servicio Angular consume `http://localhost:3000/api/movies`. Si cambias el puerto del backend, actualiza `frontend/src/app/services/movie.service.ts` y la variable `FRONTEND_ORIGIN` del `.env`.

## 3. Endpoints implementados
- `GET /api/health` — estado API/base de datos.
- `GET /api/movies` — lista; acepta `?search=batman`.
- `GET /api/movies/:id` — detalle.
- `POST /api/movies` — crear.
- `PUT /api/movies/:id` — actualizar.
- `DELETE /api/movies/:id` — eliminar.

Ejemplo POST JSON:
```json
{
  "title": "Interstellar",
  "description": "Una misión más allá de la Tierra.",
  "year": 2014,
  "genre": "Ciencia ficción",
  "posterUrl": "",
  "rating": 8.7,
  "status": "Publicado",
  "type": "Película"
}
```

## Estado y siguientes pasos
- CRUD de películas/series básico conectado a MongoDB.
- Interfaz de dashboard, búsqueda, paginación y formulario de alta/edición.
- La sección visual todavía no implementa CRUD de usuarios, roles, canales, listas, home sections ni autenticación de administradores.
- **Antes de exponer el backend a internet, implementar autenticación/autorización de administrador, validación reforzada, límites de peticiones y configuración segura de CORS.** Esta versión está pensada para desarrollo local.
- No hay datos de prueba precargados; el catálogo comienza vacío.
