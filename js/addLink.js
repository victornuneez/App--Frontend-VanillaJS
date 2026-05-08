
// Funcion para crear el componente del formulario para agregar enlaces.

import { initSearch } from "./search-results.js";

// NOTA: En la categoria deberia poder elegirse de los existentes o agregar uno nuevo.
const addLinkComponent = () => {
    return `
    <div id="addlink-container">
        <button id="btn-back" class="btn-secondary">Volver</button>
            <h2>Agregar un nuevo Recurso para la comunidad</h2>
            <form id="link-form">
                <label for="title">Titulo:</label><br>
                <input type="text" id="title" placeholder="Titulo del recurso" maxlength="30" required><br>
                
                <label for="url">Enlace:</label><br>
                <input type="text" id="url" placeholder="Ej: https://.." maxlength="50" required><br>
                
                <label for="description">Descripcion:</label><br>
                <textarea id="description"></textarea placeholder="Descripcion breve" maxlength="40" required><br>

                <label for="tag">Categoria:</label><br>
                <input type="text" id="tag" placeholder="Ej: JavaScript" maxlength="20" required><br>

                <button type="submit" id="btn-submit">Guardar</button>
                
            </form>
    </div>
    `;
};

// Funcion auxiliar para enviar los datos del nuevo recurso al backend
const saveLink = async (title, url, description, tag) => {
    try {
        if(!title || !url || !description || !tag) {
            throw new Error('Hubo un problema, faltan campos requeridos')
        }

        const response = await fetch(`http://localhost:3000/api/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({ title, url, description, tag }) // enviamos el nuevo contenido en el body. 
        });
        
        if(!response.ok) throw new Error('Hubo un problema al enviar los datos del nuevo recurso');
        const newLink = await response.json();

        return newLink;
        
    } catch (error) {
        console.error('Hubo un error al comentar', error.message);
    }
};

// Funcion que captura los clicks para crear un nuevo enlace.
const captureClicksAddLink = () => {
    const container = document.getElementById('link-form');
    
    container.addEventListener('submit', async (event) => {
        event.preventDefault();

            const title = document.getElementById('title').value;
            const url = document.getElementById('url').value;
            const description = document.getElementById('description').value;
            const tag = document.getElementById('tag').value;
            
            const result = await saveLink(title, url, description, tag);

            if (result) {
                alert("Recurso agregado con exito")
                container.reset();
    
            } else {
                alert("Hubo un error al guardar el recurso")
            }
    })
};

// Funcion que captura los clicks en boton de volver y renderiza de nuevo la vista de busqueda por filtros.
const captureClicksBack = async () => {
    const container = document.getElementById('addlink-container');
    
    container.addEventListener('click', (event) => {

        if(event.target.classList.contains('btn-secondary')) {
            initSearch();
        }
    })
};


// Funcion que inicia la vista del formulario de agregar enlaces.
const initAddLink = async () => {
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML = addLinkComponent();  // Inyectamos nuestro componente base
    
        captureClicksAddLink();
        captureClicksBack();

    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

export { initAddLink }