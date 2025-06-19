## 1. Propósito
Contiene instrucciones y referencias para levantar y conectar la DB PostgreSQL que se inicializa con nuestros scripts y credenciales.

## 2. Archivos clave
- `backend/db/Dockerfile`: construye la imagen de Postgres copiando scripts de `init.d/`.
- `backend/db/init.d/*.sql`: scripts SQL que se ejecutan al primer arranque.
- `backend/db/.env`: variables de entorno (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB).
- `backend/docker-compose.yml`: define el servicio `db`.

## 3. Levantar la base
cd backend
docker-compose up -d

