# Documentación del API

**Documentación de librerías utilizadas**

- https://www.psycopg.org/psycopg3/docs/ (psycopg)

- https://fastapi.tiangolo.com/learn/ (FastAPI)

**Iniciar servicio**

Para iniciar los servicios se debe correr `docker compose pu` y levantar junto a la base de datos.

---

## Autenticación de usuarios

### `POST /register`

**Formato request**
```js
{
    "username": "skibidi",
    "email": "skibidi@gmail.com",
    "phone": 123456,
    "password": "123"
}
```

**Si hubo error** devuelve código 400 Bad request 
```js
{
    "detail": "Datos inválidos (o usuario ya existe)"
}
```

**Si todo sale bien**

Si todo sale bien devuelve `código 201` creado y devuelve datos ingresados
```
{
    "username": "skibidi",
    "email": "skibidi@gmail.com",
    "phone": 123456,
    "date": "2025-07-11"
}
```


### `POST /login`

**Request**
```
{
    "email": "ianchu0317@gmail.com",
    "password": "1234"
}
```

**Respuesta (bien)**

Devuelve token para utilizar en el header de las otras requests
```js
{
    "access_token": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJpYW5jaHUwMzE3IiwiaWF0IjoxNzUxOTE0Njg1LCJleHAiOjE3NTE5MTU4ODV9.YpHgj4GH1NrzEpbe06nu9HQSgHb2csVZX-6k_uwJP9g",
        "token_type": "bearer"
    }
}
```

**Respuesta (mal)**

Si datos ingresados no existen en db, entonces devuelve `401 (unauthorized)`:
```js
{
    "detail": "Datos inválidos"
}
```


### `GET /profile`

Mandar token en header con la request

**Respuesta**
```js
{
    "username": "ianchu0317",
    "email": "ianchu0317@gmail.com",
    "phone": 123456,
    "date": "2025-07-07"
}
```

<br>

---

<br>

## CRUD Fobias

### `POST /phobias/`

**Request**
```js
{
    "phobia_name": "turtufobia",
    "description": "tengo miedo a las tortugas" 
}
```


**Respuesta**

Devuelve código 201 con el siguiente contenido
```
{
    "id": null,
    "phobia_name": "turtufobia",
    "description": "tengo miedo a las turtugas",
    "creator_id": 1,
    "likes": 0,
    "date": null
}
```

Devuelve 400 si hubo error creando


### `GET /phobias`

Obtener lista de fobias

**Respuesta**
```js
[
    {
        "id": 3,
        "phobia_name": "fobias",
        "description": "testing",
        "creator": "usuario 2",
        "likes": 0,
        "comments", 0
        "date": "2025-07-07"
    },
    {
        "id": 7,
        "phobia_name": "fobias",
        "description": "color blanco",
        "creator": "usuario 1",
        "likes": 0,
        "comments": 3,
        "date": "2025-07-07"
    },
]
```


### `GET /phobias/{phobia_id}`

**Respuesta**
```js
{
    "id": 4,
    "phobia_name": "eres un cute skibdii",
    "description": "me gustan los skibidis con cabesita de pochoclo",
    "creador": "skibidi",
    "likes": 0,
    "comments": 3
    "date": "2025-07-07"
}
```

Si no existe código 404
```
{
    "detail": "Fobia no encontrada"
}
```

### `PUT /phobias/{phobia_id}/like`

Actualizar un like más al contenido. No devuelve nada, sólo coidgo 200 OK.

### `PUT /phobias/{phobia_id}`

**Request**
```js
{
    "phobia_name": "eres un cute skibdii",
    "description": "me gustan los skibidis con cabesita de pochoclo" 
}
```

- Devuelve código 204 sin nada si se hizo con éxito.

- Devuelve 404 si fobia a actualizar no existe 

- Devuelve 403 si no es usuario creador

- Devuelve 400 si hubo error en servidor


### `DELETE /phobias/{phobia_id}`

Eliminar una fobia. sólo el creador puede eliminar.

- Devuelve 204 si se elimina

- Devuelve 404 si no existe el que quiero eliminar

- Devuelve 403 si no es usuario creador

- Devuelve 400 si hubo error en servidor

<br>

---

<br>

## Comentarios

### POST /phobias/{phobia_id}/comments

**Request**
```js
{
    "comment": "testing comment"
}
```

**Response**
```js
{
    "id": null,
    "comment": "testing comment",
    "creator_id": 1,
    "phobia_id": 3,
    "likes": 0,
    "date": null
}
```

### GET /phobias/{phobia_id}/comments
Ver comentarios de una fobia

**Response**
```js
[
    {
        "comment": "blabla 1",
        "creator": "skibidi 1",
        "date": "2025-07-07"
    },
    {
        "comment": "comentario 2",
        "creator": "skibidi 2",
        "date": "2025-07-07"
    },
    {
        "comment": "comentario 3",
        "creator": "skibidi 3",
        "date": "2025-07-07"
    }
]
```

### GET /rankings

Ver rankings de las fobias
```js
[
    {
        "id": 5,
        "phobia_name": "fobias",
        "description": "testing",
        "creator": "skibidi",
        "likes": 7,
        "date": "2025-07-07"
    },
    {
        "id": 6,
        "phobia_name": "fobias",
        "description": "testing",
        "creator": "skibidi",
        "likes": 0,
        "comments": 0,
        "date": "2025-07-07"
    },
    {
        "id": 4,
        "phobia_name": "eres un cute skibdii",
        "description": "me gustan los skibidis con cabesita de pochoclo",
        "creator": "skibidi",
        "likes": 0,
        "comments": 0,
        "date": "2025-07-07"
    },
    {
        "id": 8,
        "phobia_name": "fobias",
        "description": "walkers",
        "creator": "skibidi",
        "likes": 0,
        "comments": 0,
        "date": "2025-07-07"
    }
]
```
