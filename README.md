# Frontend Vanilla JS

Interfaz de usuario construida con **HTML**, **CSS** y **JavaScript puro (ES6+)**. Sin frameworks, sin magia. Solo la lógica al desnudo, tal como lo exige el gato.

---

## 📋 Descripción

Una SPA (Single Page Application) que permite navegar, crear, editar, votar y comentar enlaces. Toda la navegación entre vistas se maneja dinámicamente manipulando el DOM, sin recargar la página.

---

## 🛠️ Tecnologías

| Herramienta | Uso |
|---|---|
| HTML5 | Estructura base |
| CSS3 | Estilos |
| JavaScript ES6+ | Lógica, módulos, fetch API |

> No requiere instalación de dependencias ni herramienta de build. Se ejecuta directamente en el navegador.

---

## 📁 Estructura del proyecto

```
frontend-vanilla/
├── index.html
└── js/
    ├── search-results.js   # Vista principal: filtros y lista de enlaces
    ├── details.js          # Vista de detalle: votos, comentarios, eliminar
    ├── addLink.js          # Vista de formulario para crear enlace
    └── update.js           # Vista de formulario para editar enlace
```

---

## ⚙️ Instalación y uso

### Requisito previo

Tener el **backend corriendo** en `http://localhost:3000`. Ver el README del backend para instrucciones.

### Opción 1 — Abrir directamente

Abrir el archivo `index.html` en el navegador. En algunos navegadores los módulos ES6 requieren servir el archivo desde un servidor local.

### Opción 2 — Servidor local con VS Code (recomendado)

Instalar la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), hacer clic derecho sobre `index.html` y seleccionar **"Open with Live Server"**.

### Opción 3 — Servidor local con Node.js

```bash
npx serve .
```

Luego abrir `http://localhost:3000` (o el puerto que indique la terminal).

---

## 🧭 Arquitectura y flujo de navegación

La app no usa ningún router externo. La navegación se logra reemplazando el contenido del elemento `#app` con el HTML de la vista correspondiente.

```
index.html
└── #app  ←  punto de montaje único
      ├── search-results.js  →  vista inicial (lista + filtros)
      │         ↓ click "Ver más"
      ├── details.js         →  vista de detalle del enlace
      │         ↓ click "Editar"
      ├── update.js          →  formulario de edición
      │         ↓ click "Crear recurso"
      └── addLink.js         →  formulario de creación
```

Cada módulo exporta una función `init*` que construye e inyecta su HTML, registra los listeners de eventos y consume la API del backend.

---

## 📌 Módulos

### `search-results.js`

- Renderiza los botones de filtro por etiqueta obtenidos desde el backend.
- Muestra la lista de enlaces (todos o filtrados).
- Delegación de eventos en el contenedor padre para manejar clicks en etiquetas, botones "Ver más" y "Crear recurso".
- Exporta `initSearch()` — función de entrada de la app, se llama automáticamente al cargar.

### `details.js`

- Muestra título, descripción, URL, votos y comentarios de un enlace.
- Permite votar, comentar, editar y eliminar.
- Actualiza el DOM en tiempo real sin recargar los datos completos.
- Exporta `initDetail(linkID)`.

### `addLink.js`

- Formulario para crear un nuevo recurso (título, URL, descripción, etiqueta).
- La etiqueta se escribe como texto libre; el backend la crea si no existe.
- Exporta `initAddLink()`.

### `update.js`

- Formulario pre-cargado con los datos actuales del enlace a editar.
- Envía los cambios con `PUT` al backend.
- Exporta `initUpdate(id)`.

---

## 🔌 Conexión al backend

Todas las llamadas a la API usan la `Fetch API` nativa. La URL base está hardcodeada en cada módulo:

```js
http://localhost:3000
```

Si el backend corre en otro puerto o dominio, actualizar las URLs en cada archivo `.js`.

---

## 📌 Notas

- Los módulos JS usan `type="module"`, por lo que requieren ser servidos sobre HTTP (no `file://`).
- La navegación entre vistas es instantánea ya que no hay recarga de página.
- Si el backend no está disponible, la app mostrará errores en consola pero no se romperá completamente.

---

*© Todos los derechos reservados — Victor Nunez*
