import { initSearch } from "./search-results.js";

const updateComponent = () => {
    return `
    <div id="update-container">
        <button id="btn-back" class="btn-secondary">Volver</button>
            <h2>Ingresa los nuevos datos</h2>
            <form id="newlink-form">
                <label for="title">Titulo:</label><br>
                <input type="text" id="title" placeholder="Nuevo titulo del recurso" maxlength="30" required><br>
                
                <label for="url">Enlace:</label><br>
                <input type="text" id="url" placeholder="Nuevo enlace, Ej: https://.." maxlength="50" required><br>
                
                <label for="description">Descripcion:</label><br>
                <textarea id="description"></textarea placeholder="Descripcion breve" maxlength="40" required><br>

                <button type="submit" id="btn-submit">Guardar</button>
                
            </form>
    </div>
    `;
};

const updateLink = async (id, title, url, description) => {
    try {
        if(!title || !url || !description) {
            throw new Error('Faltan datos requeridos')
        }

        const response = await fetch(`http://localhost:3000/api/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({ title, url, description })
        });
        if(!response.ok) throw new Error('Hubo un problema al actualizar el recurso');

        const result = response.json();
        return result;

    } catch (error) {
        console.error('Hubo un problema: ', error.message);
    }
};

// Funcion que captura los clicks para editar un enlace.
const captureClicksUpdate = (id) => {
    const idUpdate = id;
    const container = document.getElementById('newlink-form');
    
    container.addEventListener('submit', async (event) => {
        event.preventDefault();

            const title = document.getElementById('title').value;
            const url = document.getElementById('url').value;
            const description = document.getElementById('description').value;
            
            const result = await updateLink(idUpdate, title, url, description);

            if (result) {
                alert("Recurso actualizado con exito")
                container.reset();
    
            } else {
                alert("Hubo un error al actualizar el recurso")
            }
    })
};

// Funcion que captura los clicks en boton de volver y renderiza de nuevo la vista de busqueda por filtros.
const captureClicksBack = async () => {
    const container = document.getElementById('update-container');
    
    container.addEventListener('click', (event) => {

        if(event.target.classList.contains('btn-secondary')) {
            initSearch();
        }
    })
};

// Funcion que inicia la vista de actualizar un recurso
const initUpdate = async (id) => {
    const idUpdate = id;
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML =  updateComponent(); // Inyectamos nuestro componente base
    
        captureClicksUpdate(idUpdate);
        captureClicksBack();

    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

export { initUpdate };