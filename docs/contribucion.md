# Contribuciones

Este documento trata acerca de cómo contribuir en el proyecto y de algunas convenciones para mantener un entorno organizado y que no sea un dolor de cabeza :)

## Tabla de contenidos


<br>

---

<br>

## Estructura de proyecto

La estructura general del proyecto tendrá la siguiente forma
```
TP2-NOMBRE-TP/
├── docs/                    <-- Archivos de Frontend
├── backend/                 <-- Solo backend
├── frontend/                <-- Solo frontend
├── docker-compose.yml       <-- Para levantar toda la app
├── README.md                <-- Instrucciones de ejecución + Redirección de documentación
├── .gitignore
```

El archivo `README.md` principal se incluyen: capturas y videos, tecnologías utilizadas, estructuras del proyecto, instrucciones de ejecución y redirección a la documentación.

Luego, en cada carpeta se organizarían a su manera de acuerdo a su función.

(_Favor de nombrar los archivos en inglés pero el contenido puede estar en español_)


### **`docs/`**

En esta carpeta irían todos los documentos en formato `.md` o `.pdf`. 

Van las documentaciones de código como también las ideas, organizaciones y diseños.

``` 
TP2-NOMBRE-TP/
├── docs/ 
│   ├── api.md            <-- Rutas (endpoints, formato de querys y respuestas)
│   ├── db.md             <-- Esquemas de tablas, credenciales de base de datos, conexión, etc
│   ├── frontend/
│   ├── design/           <-- Acá van los diseños
│   ├── ideas.md          <-- Acá van las ideas del proyecto cuando la tengamos?
│   ├── contribucion.md   <-- Este documento de convenciones de contribución :)
│   ├── enunciado.md      <-- Enunciado del TP
```

Dentro de `docs/design/` se pueden incluir sketch y diseños de frontend, diseños de backend o database a mano, entre otras cosas mientras tengan que ver con diseño. Se admiten `jpg`.

### **`backend/`**

En este directorio van los archivos relacionados al Backend. Principalmente será compuesto por una API que recibirá peticiones web y de una base de datos SQL como pide el enunciado del TP.
(_Dependiendo de la idea a definir, la estructura puede variar_)

```
TP2-NOMBRE-TP/
├── backend/ 
│   ├── api/
│       ├── main.py  (index.js) --> Archivo principal
│       ├── schemas.py       --> Estructura de query y base de datos
│       ├── controller.py    --> Controlador de lógica
│   ├── db/                --> Configuración inicial de base de datos
│   ├── docker-compose.yml --> Para levantar sólo backend (incluye api y db)
```

### **`frontend/`**

(No tengo idea odio frontend). 

```
TP2-NOMBRE-TP/
├── frontend/ 
|   ├── src/
│       ├── styles.css 
│       ├── index.js 
│   ├── index.html --> archivo principal
│   ├── docker-compose.yml --> Para levantar sólo frontend
```

Depende del framework y el que sepa codear frontend sabrá cómo organizar.

--- 

## Ramas y commits


## PRs e Issues


## Flujo de trabajo

## Documentación





