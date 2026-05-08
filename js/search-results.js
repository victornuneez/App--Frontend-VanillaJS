import { initDetail } from "./details.js";
import { initAddLink } from "./addLink.js"; 
import { initUpdate } from "./update.js";

// Funcion que genera la estructura de filtrado y la lista de resultados
const searchComponent = () => {
    return `
    <div id="search-container">
        <div id="tags-filter">
            <!--Aca se inyectan las etiquetas dinamicamente-->
        </div>
        <div id="results-list">
            <!--Aca se mostraran los links filtrados-->
        </div>

        <div id="btn-create">
            <h2>Añadir Enlaces</h2>
            <button class="derived-create">Crear recurso</button> 
        </div>
    </div>
    `;
};


// Funcion que obtiene todas las etiquetas de la DB(backend)
const getTags = async () => {
    try {
        const response = await fetch('http://localhost:3000/app/tags'); 
        // fetch no lanza un error automaticamente aunque falle la peticion, entonces forzamos el error en el caso en que haya un error.
        if(!response.ok) { 
            throw new Error('Error al obtener las etiquetas');
        }

        const tags = await response.json();
        return tags; // array de objetos tags
    
    } catch (error) {
        console.error("Hubo un problema con la peticion: ", error.message);
    }
};



// Funcion para renderizar las etiquetas de filtro e insertarlas en su contenedor
const renderTags = (tags) => {
    
    const tagsContainer = document.getElementById("tags-filter");
    // Usamos atributos personalizados 
    const buttons = tags.map(tag => `
        <button 
            class="tag-button" 
            data-id="${tag._id}"
            data-name="${tag.name}">
            ${tag.name}
        </button>
        `).join('');

    tagsContainer.innerHTML = `
    <button class="tag-button" data-id="Todos" data-name="Todos">Todos</button>
    ${buttons}
    `;
};


// Funcion para escuchar los clics que se hagan en las etiquetas de filtro.(Delegacion de eventos).
// Vigilamos los clicks en la etiqueta padre porque eso nos permite saber cual etiqueta hija se clickeo no importa cuantas etiquetas haya
const captureClicksTags = () => {
    let tagID;
    const container = document.getElementById('tags-filter');
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('tag-button')) {
            tagID = event.target.dataset.id;
            
            const links = await getLinksByTag(tagID);
            renderResults(links);
        }
        
    })
}


// Funcion que obtiene los enlaces de la DB por ID de la etiqueta seleccionada.
const getLinksByTag = async(tagID) => {
    let url;
    
    try {
        if(tagID !== "Todos") {
            url = `http://localhost:3000/app/links?id=${tagID}`; 
        
        }else {
            url = 'http://localhost:3000/app/links' 
        }

        const response = await fetch(url);
        if(!response.ok) throw new Error('Error al obtener los links'); 

        const links = await response.json();
        return links;
    
    } catch (error) {
        console.error("Error en el filtrado: ", error.message);
    }
};


// Funcion que renderiza los resultados
const renderResults = (links) => {
    const resultsContainer = document.getElementById('results-list');

    resultsContainer.innerHTML= ""; // limpiamos el contenedor

    if(links.length === 0) {
        resultsContainer.innerHTML = '<p>No hay resultados para esta categoria</p>';
        return;
    }

    const linksHTML = links.map(link => `
        <div class="link-card">
            <h3>${link.title}</h3>
            <p>${link.description}</p>
            <button class="btn-details" data-id="${link._id}">
                Ver mas 
            </button>
            
            <button class="btn-update" data-id="${link._id}">
                Editar 
            </button> 

            <button class="btn-delete" data-id="${link._id}">
                Eliminar 
            </button> 
        </div>
        `).join('');    // EL BOTON VER MAS ES EL EVENTO QUE DEBEMOS CAPTURAR PARA RENDERIZAR LA VISTA DE DETALLES DEL ARCHIVO DE DETAILS.JS
        
    resultsContainer.innerHTML = linksHTML;
};

// Funcion que captura los clics en el boton de ver mas.
const captureClicksSeeMore = () => {
    const container = document.getElementById("results-list");
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('btn-details')) {
            const linkID = event.target.dataset.id;
            await initDetail(linkID);

        }
        
    });
};

const captureClickDelete = () => {
    const container = document.getElementById("search-container");
    container.addEventListener('click', async (event) => {

        if(event.target.classList.contains('btn-delete')) {
            const id = event.target.dataset.id;
            const result = await deleteLink(id);

            if(result) {
                alert('Recurso eliminado correctamente')
                initSearch();
            
            } else {
                alert('Hubo problemas para eliminar el recurso')
            }
        }
    });
};

// Funcion que captura los clics en el boton de editar y pasa el id del recurso a editar.
const captureClicksUpdate = () => {
    const container = document.getElementById("search-container");
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('btn-update')) {
            const linkID = event.target.dataset.id;
            await initUpdate(linkID);

        }
        
    });
};

// Funcion que captura los clics en el boton crear enlace.
const captureClicksaddLink = () => {
    const container = document.getElementById("search-container");
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('derived-create')) {
            await initAddLink();
        }
        
    });
};

const deleteLink = async(id) => {
    try {
        if(!id) {
            throw new Error('Faltan datos para realizar la operacion');
        };

        const response = await fetch(`http://localhost:3000/api/delete/${id}`, { method: "DELETE" });
        if(!response.ok) throw new Error('Hubo un error en la operacion');
        
        const itemDelete = response.json();
        return itemDelete;
    
    } catch(error) {
        console.error('Hubo un problema al borrar: ', error.message);
    }

};

// Funcion que inicializa la estructura principal, obtiene las etiquetas de la db y renderiza los botones de filtrado
const initSearch = async () => {
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML = searchComponent();  // Inyectamos nuestro componente base

        // Nos aseguramos de inicialziar los capturadores de eventos despues de crearse la estructura base del contenedor de etiquetas y de los resultados
        captureClicksTags();
        captureClicksSeeMore();
        captureClicksaddLink();
        captureClickDelete();
        captureClicksUpdate();
    
        const tags = await getTags();
        
    
        if (!tags) {
            throw new Error('Error al obtener las etiquetas');
        }
        
        renderTags(tags);
    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

initSearch();

export { initSearch };