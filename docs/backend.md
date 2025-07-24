# Documentación Backend

## Ejecución de backend

Dentro de la carpeta `/backend` correr:

```sh
docker compose up -d
```

Con este comando se levanta tanto el `api` como el `db`.

## Conexiones

### API

Para usar el api por defecto la ruta base es localhost con puerto 8000

```
http://127.0.0.1:8000/
```


### DB

**Credenciales**
```
usuario: fobias
contraseña: fobias
```

**Conexión**

puerto `5432`

```
psql --host localhost -U fobias -d tp2
```


## API

### Instalación de dependencias
Ubicarse dentro de la carpeta `/backend/api`
```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requeriments.txt
```
