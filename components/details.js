import { initViewSearch } from './search-results.js'
import { initViewUpdate } from './update.js';
import { getLinkDetailsById, addCommentById, deleteLinkById, voteLinkByid } from '../api/api.js';

// Funcion que genera la estructura base del componente de detalles
const detailsComponent = () => {
    return `
    <div id="information-link">
        <button id="btn-back" class="btn-secondary">Volver</button>

        <div id="details-container">
            <!--Aca se inyectan las info detalladas dinamicamente-->        
        </div>
    </div>
    `
};


// Funcion auxiliar que crea y devuelve la lista de comentarios que tiene cada enlace.
const displayComments = (comments) => {
    if(comments.length === 0) {
        return [];
    }

    const result = comments.map(comment => `
        <p>${comment}</p>
        `).join('');

    return result;
}

// Funcion que renderiza la vista de detalles del enlace seleccionado
const renderDetails = (link) => {
    const container = document.getElementById('details-container');

    if(!link) {
        container.innerHTML = "<p>No se encontraron informacion detallada sobre este enlace"
    }

    const detailHTML = `
        <div class="see-more-card">
            <h3>${link.title}</h3>
            <p>Description: ${link.description}</p>
            <p>Enlace: ${link.url}</p>
            <div class="actions">
                <button class="btn-vote" data-id="${link._id}">
                    Votar ${link.vote}
                </button>

                <button class="btn-update" data-id="${link._id}">
                    Editar 
                </button> 

                <button class="btn-delete" data-id="${link._id}">
                    Eliminar 
                </button>
            </div>

            <div class="comments-section">
                <h4>Comentarios</h4>
                <div id="comments-list">
                    ${displayComments(link.comments)}
                </div>
                <textarea id="comment-text" placeholder="Escribe un comentario"></textarea>
                <button class="btn-comment" data-id="${link._id}">Enviar comentario</button>
            </div>
        </div>
        `;
    
    container.innerHTML = detailHTML;
}


// Funcion que captura los clicks en boton de volver y renderiza de nuevo la vista de busqueda por filtros.
const captureClicksBack = async () => {
    const container = document.getElementById('information-link');
    
    container.addEventListener('click', (event) => {

        if(event.target.classList.contains('btn-secondary')) {
            initViewSearch();
        }
    })
};


// Funcion que captura los clicks para votar un enlace y agregar comentarios.
const captureClicksDetails = () => {
    const container = document.getElementById('details-container');
    
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-vote')) {
            const id = event.target.dataset.id
            
            const updateVote = await voteLinkByid(id);
            event.target.textContent = `Votar ${updateVote.vote}`
        }

        if (event.target.classList.contains('btn-comment')) {
            const id = event.target.dataset.id;
            const text = document.getElementById('comment-text').value;
            
            const updateComment = await addCommentById(id, text);
            const lastComment = updateComment.comments.at(-1); // Toma de la lista de comentarios el ultimo comentario agregado. 
            
            // insertamos el ultimo comentario agregado en la lista de comentarios.
            // Solo actualizamos el comentario agregado en el DOM.
            const list = document.getElementById('comments-list');
            list.insertAdjacentHTML('beforeend', `<p>${lastComment}</p>`);
            
            // Limpia el texto del comentario agregado en el formulario.
            const textarea = document.getElementById('comment-text');
            textarea.value= '';
        }
    });
};

const captureClickDelete = () => {
    const container = document.getElementById("details-container");
    container.addEventListener('click', async (event) => {

        if(event.target.classList.contains('btn-delete')) {
            const id = event.target.dataset.id;
            const result = await deleteLinkById(id);

            if(result) {
                alert('Recurso eliminado correctamente')
                initViewSearch();
            
            } else {
                alert('Hubo problemas para eliminar el recurso')
            }
        }
    });
};

// Funcion que captura los clics en el boton de editar y pasa el id del recurso a editar.
const captureClicksUpdate = () => {
    const container = document.getElementById("details-container");
    container.addEventListener('click', async (event) => {

        if (event.target.classList.contains('btn-update')) {
            const linkID = event.target.dataset.id;
            await initViewUpdate(linkID);

        }
        
    });
};



// Funcion que inicia la vista de detalles y al capturador de clics de votar, comentar. 
const initViewDetail = async (linkID) => {
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML = detailsComponent();  // Inyectamos nuestro componente base
    
        // funcion que debe obtener toda la informacion de un link por medio de su ID.
        const link = await getLinkDetailsById(linkID);

        if(!link) {
            throw new Error('Error al obtener los detalles');
        }
        
        renderDetails(link); // renderizar la informacion detallada del item seleccionado
        captureClicksDetails();
        captureClicksBack();
        captureClickDelete();
        captureClicksUpdate();
    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

export { initViewDetail };