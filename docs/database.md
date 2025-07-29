## 1. Propósito
Contiene instrucciones y referencias para levantar y conectar la DB PostgreSQL que se inicializa con nuestros scripts y credenciales.

## 2. Archivos clave
- `backend/db/Dockerfile`: construye la imagen de Postgres copiando scripts de `init.d/`.
- `backend/db/init.d/*.sql`: scripts SQL que se ejecutan al primer arranque.
- `backend/db/.env`: variables de entorno (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB).
- `backend/docker-compose.yml`: define el servicio `db`.

## 3. Levantar la base

```
cd backend
docker-compose up -d
```

## 4. Conexión base de datos

**Credenciales**
```
usuario: fobias
contraseña: fobias
```

**Conexión**
```
psql --host localhost -U fobias -d tp2
```

## 5. Estructura de base de datos

**users**

| field  | datatype | description                  |
|--------|--------------|------------------------------|
| id     | INTEGER      |    User unique ID  |
| username  | TEXT         |    Username      |
| email  | TEXT   |   User email  |
| phone  | TEXT   |   User phone  |
| hashed_password  | TEXT   |   User hashed password  |
| register_date  | TEXT   |   User register date  |


**phobias**

| field  | datatype | description                  |
|--------|--------------|------------------------------|
| id     | INTEGER      |    Phobia unique ID  |
| phobia_name  | TEXT         |    Phobia name      |
| description  | TEXT         |    Phobia description      |
| creator_id  | TIMESTAMP    |    Creator user id in db      |
| likes  | TIMESTAMP    |    Number of likes      |
| date  | TIMESTAMP    |    Creation date      |

**comments**
| field  | datatype | description                  |
|--------|--------------|------------------------------|
| id     | INTEGER      |    Comment unique ID  |
| content  | TEXT         |    Comment content      |
| author_id  | INTEGER    |    Author user ID      |
| phobia_id  | INTEGER    |    Phobia ID      |
| date  | TIMESTAMP    |    Creation date      |