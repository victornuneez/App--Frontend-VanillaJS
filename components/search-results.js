import { initViewDetail } from "./details.js";
import { initViewAddLink } from "./addLink.js"; 
import { initViewUpdate } from "./update.js";
import { getTags, getLinksByTag } from "../api/api.js";

// Funcion que genera la estructura de filtrado y la lista de resultados
const searchComponent = () => {
    return `
    <div id="search-container">
        <div id="tags-filter">
            <!--Aca se inyectan las etiquetas dinamicamente-->
        </div>
        <div id="results-list">
            <ol>
                <!--Aca se mostraran los links filtrados-->
            </ol>
        </div>

        <div id="btn-create">
            <h2>Añadir Enlaces</h2>
            <button class="derived-create">Crear recurso</button> 
        </div>
    </div>
    `;
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
    const container = document.getElementById('tags-filter');
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('tag-button')) {
            const tagID = event.target.dataset.id;
            
            const links = await getLinksByTag(tagID);
            renderResults(links);
        }
        
    })
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
            await initViewDetail(linkID);

        }
        
    });
};


// Funcion que captura los clics en el boton crear enlace.
const captureClicksaddLink = () => {
    const container = document.getElementById("search-container");
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('derived-create')) {
            await initViewAddLink();
        }
        
    });
};



// Funcion que inicializa la estructura principal, obtiene las etiquetas de la db y renderiza los botones de filtrado
const initViewSearch = async () => {
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML = searchComponent();  // Inyectamos nuestro componente base

        // Nos aseguramos de inicialziar los capturadores de eventos despues de crearse la estructura base del contenedor de etiquetas y de los resultados
        captureClicksTags();
        captureClicksSeeMore();
        captureClicksaddLink();
    
        const tags = await getTags();
        if (!tags) {
            throw new Error('Error al obtener las etiquetas');
        }
        
        renderTags(tags);

        const links = await getLinksByTag("Todos");
        renderResults(links);

    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

initViewSearch();

export { initViewSearch };