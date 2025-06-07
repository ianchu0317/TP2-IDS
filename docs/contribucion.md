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

<br>

--- 

<br>

## Flujo de trabajo, Ramas y Commits

Básicamente, mantener siempre la rama main con cosas funcionales. 

**Favor de no mergear nada sin revisión**.

Las principales ramas serían:

```
TP2-NOMBRE-TP/
├── main
├── dev
│   ├── frontend
│   ├── backend
```
Sobre esta estructura, vamos a trabajar siempre sobre la rama `dev`. De cada rama podría tener más subramas dependiendo de lo que esté compuesto y la cantidad de funcionalidades a tener. Por ejemplo la rama `dev/backend` podría tener dos subramas `dev/backend/database-config` o `dev/backend/endpoint-login` o la cantidad de cosas (features) que pueden surgir. 

(_otra opción es usar solo `dev` y la vida es más fácil_)

Entonces, una vez que se termine mi trabajo en una rama hay que pushearlo al repositorio y abrir un _Pull Request_ de **mergear a su rama padre** indicando la funcionalidad y lo que se hizo. Por ejemplo si terminé de configurar `dev/backend/database-config` abrir un PR a `dev/backend/` para revisión y no mergear nada 🙏

<br>

--- 

<br>

## PRs e Issues

El formato de PR ya se mencionó anterior y cómo utilizarlo. 

Para cada feature va a haber un Issue abierto probablemente diciendo acerca de qué se quiere organizar y capaz un poco de cómo implementar lógicamente la funcionalidad. Esto permite que se lleve en el historial el trabajo que se va realizando.

Los issues pueden ser manejados por Github Projects para tenerlos visualmente. Se cierran luego de mergear la funcionalidad y de documentar.

<br>

---

<br>

## Documentación





