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
    "username": "test",
    "email": "testing@gmail.com",
    "phone": 123456,
    "password": "1234"
}
```

**Si hubo error**
```js
{
    "detail": "Datos inválidos"
}
```

**Si todo sale bien**

Si todo sale bien devuelve `código 201` creado y no devuelve nada


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

Devuelve código 401 con siguiente mensaje:
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

---

## CRUD Fobias

### `POST /phobias/{phobia_id}/comments`

**Request**
```js
{
    "phobia_name": "fobias",
    "description": "Pene blanco" 
}
```


**Respuesta**

Devuelve código 201 con el siguiente contenido
```
{
    "id": null,
    "phobia_name": "fobias",
    "description": "walkers",
    "creator_id": 1,
    "likes": 0,
    "date": null
}
```


### `GET /phobias`

Obtener lista de fobias

**Respuesta**
```js
[
    {
        "id": 3,
        "phobia_name": "fobias",
        "description": "testing",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 7,
        "phobia_name": "fobias",
        "description": "color blanco",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 4,
        "phobia_name": "eres un cute skibdii",
        "description": "me gustan los skibidis con cabesita de pochoclo",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    }
]
```

### `GET /phobias/{phobia_id}`

**Respuesta**
```
{
    "id": 4,
    "phobia_name": "eres un cute skibdii",
    "description": "me gustan los skibidis con cabesita de pochoclo",
    "creator_id": 1,
    "likes": 0,
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

### `DELETE /phobias/{phobia_id}`

Eliminar una fobia. sólo el creador puede eliminar.

---

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
        "id": 1,
        "comment": "testing comment",
        "creator_id": 1,
        "phobia_id": 3,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 2,
        "comment": "testing comment",
        "creator_id": 1,
        "phobia_id": 3,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 3,
        "comment": "testing comment",
        "creator_id": 1,
        "phobia_id": 3,
        "likes": 0,
        "date": "2025-07-07"
    }
]
```

### GET /rankings

Ver rankings de las fobias
```
[
    {
        "id": 5,
        "phobia_name": "fobias",
        "description": "testing",
        "creator_id": 1,
        "likes": 7,
        "date": "2025-07-07"
    },
    {
        "id": 6,
        "phobia_name": "fobias",
        "description": "testing",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 4,
        "phobia_name": "eres un cute skibdii",
        "description": "me gustan los skibidis con cabesita de pochoclo",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    },
    {
        "id": 8,
        "phobia_name": "fobias",
        "description": "walkers",
        "creator_id": 1,
        "likes": 0,
        "date": "2025-07-07"
    }
]
```
