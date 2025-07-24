
# TP2-IDS
Trabajo Práctico 2 - Introducción al Desarrollo de Software (Camejo) - FIUBA

## Descripción general

Este proyecto es una aplicación web desarrollada como parte del TP2 de la materia Introducción al Desarrollo de Software. El sistema permite a los usuarios registrarse, loguearse, crear y gestionar "fobias", comentar, y ver rankings, todo a través de una interfaz web conectada a un backend robusto y una base de datos relacional. El objetivo fue aplicar buenas prácticas de desarrollo, trabajo en equipo y uso de herramientas modernas.


## Estructura del proyecto

- **backend/**: Lógica de negocio, API REST (FastAPI), controladores, scripts de base de datos y tests.
- **frontend/**: Sitio web estático, páginas HTML, CSS, JS y recursos multimedia.
- **docs/**: Documentación técnica detallada de API, backend, base de datos y contribución.
- **docker-compose.yml**: Orquestador para levantar toda la app (backend, frontend y base de datos) fácilmente.
- **README.md**: Este archivo, con la guía general y enlaces útiles.


## Tecnologías principales

- **Backend:** Python (FastAPI), PostgreSQL, Docker
- **Frontend:** HTML, CSS, JavaScript puro
- **Control de versiones:** Git & GitHub
- **Testing:** Colecciones Postman
- **Automatización:** Docker Compose


## Instalación y ejecución rápida

1. **Cloná el repo o descargá el ZIP completo.**
2. **Levantá todo el sistema con Docker Compose:**
   ```bash
   docker-compose up --build
   ```
3. **Accedé a la app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend/API: [http://localhost:8000](http://localhost:8000)
   - Base de datos: puerto 5432 (ver credenciales en docs/database.md)


## ¿Dónde está la documentación técnica?

- **API y endpoints:** `docs/api.md`
- **Backend y ejecución:** `docs/backend.md`
- **Base de datos y scripts:** `docs/database.md`
- **Convenciones y contribución:** `docs/contribucion.md`
- **Enunciado y requisitos:** `docs/enunciados.md`


## Organización y trabajo en equipo

- Se trabajó con ramas para cada feature, integrando todo en `dev` y luego a `main`.
- Se usaron pull requests y revisiones cruzadas.
- Cada funcionalidad tiene su propia rama y documentación específica.
- El código está organizado para facilitar el mantenimiento y la escalabilidad.


## Créditos

- **Integrantes:** 
- **Materia:** Introducción al Desarrollo de Software (Camejo) - FIUBA


## Notas finales

- Para detalles de endpoints, estructura de datos, ejemplos de uso y scripts, consultá la documentación específica en la carpeta `/docs`.
- Si encontrás algún error o tenés sugerencias, podés abrir un issue o contactar a los integrantes del grupo.


## Levantado de servicios

Usamos Docker Compose para levantar todos los servicios del proyecto de forma sencilla.

## Accedé a la app

- [https://www.fobium.com/](https://www.fobium.com/)
- O localmente en [http://localhost:3000](http://localhost:3000) (ver instrucciones abajo)

## Notas importantes

- No abusar de la creación de posts, ya que el API de la IA tiene un límite de uso.
- El sistema utiliza Cloudflare, por lo que algunos cambios pueden demorar en reflejarse debido al caché de los servidores DNS.
- Si la página no carga correctamente, intentá refrescar o esperar unos minutos.
- Todo el sistema está funcional, pero seguimos mejorando detalles visuales y de experiencia de usuario.

## Estado actual

- Todas las funcionalidades principales están implementadas y operativas.
- El sistema está en línea en [https://www.fobium.com/](https://www.fobium.com/).
- Próximos pasos: mejoras visuales y pequeños ajustes de UX/UI.

## Contacto

Si encontrás algún problema o tenés sugerencias, podés abrir un issue o contactarnos directamente.

