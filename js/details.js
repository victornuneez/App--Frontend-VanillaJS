import { initSearch } from './search-results.js'

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
const renderDetails = (linkDetails) => {
    const container = document.getElementById('details-container');

    if(linkDetails.length === 0) {
        container.innerHTML = "<p>No se encontraron informacion detallada sobre este enlace"
    }

    const detailHTML = `
        <div class="see-more-card">
            <h3>${linkDetails.title}</h3>
            <p>Description: ${linkDetails.description}</p>
            <p>Enlace: ${linkDetails.url}</p>
            <div class="actions">
                <button class="btn-vote" data-id="${linkDetails._id}">
                    Votar ${linkDetails.vote}
                </button>
            </div>

            <div class="comments-section">
                <h4>Comentarios</h4>
                <div id="comments-list">
                    ${displayComments(linkDetails.comments)}
                </div>
                <textarea id="comment-text" placeholder="Escribe un comentario"></textarea>
                <button class="btn-comment" data-id="${linkDetails._id}">Enviar comentario</button>
            </div>
        </div>
        `;
    
    container.innerHTML = detailHTML;
}

// Funcion que obtiene todos los detalles del enlace indicado por el usuario
const getLink = async (linkID) => {
    try {
        if(!linkID) {
            throw new Error('Hubo un error con el linkID')
        }

        const response = await fetch(`http://localhost:3000/app/details/${linkID}`);
        if(!response.ok) {
            throw new Error('Hubo un error al obtener los detalles del link');
        }

        const details = await response.json();
        return details;

    } catch (error) {
        console.error('Hubo un error: ', error.message);
    }

}; 


// Funcion que captura los clicks en boton de volver y renderiza de nuevo la vista de busqueda por filtros.
const captureClicksBack = async () => {
    const container = document.getElementById('information-link');
    
    container.addEventListener('click', (event) => {

        if(event.target.classList.contains('btn-secondary')) {
            initSearch();
        }
    })
};


// Funcion que captura los clicks para votar un enlace y agregar comentarios.
const captureClicksDetails = () => {
    const container = document.getElementById('details-container');
    
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-vote')) {
            const id = event.target.dataset.id
            
            const updateVote = await vote(id);
            event.target.textContent = `Votar ${updateVote.vote}`
        }

        if (event.target.classList.contains('btn-comment')) {
            const id = event.target.dataset.id;
            const text = document.getElementById('comment-text').value;
            
            const updateComment = await addComment(id, text);
            const lastComment = updateComment.comments.at(-1);
            const list = document.getElementById('comments-list');
            list.insertAdjacentHTML('beforeend', `<p>${lastComment}`);
            const textarea = document.getElementById('comment-text');
            textarea.value= '';
        }
    });
};


// Funcion auxiliar para votar un enlace, usando la API
const vote = async (id) => {
    try {
        if(!id) {
            throw new Error('Hubo un problema con el id para votar');
        }
        
        const response = await fetch(`http://localhost:3000/api/vote/${id}`, { method:'PATCH' });
        if(!response.ok) throw new Error('Hubo un problema al votar');

        const updatedVote = await response.json();
        return updatedVote;
        
    }catch (error) {
        console.error("Error al votar: ", error.message);
    }
};

// Funcion auxiliar para comentar los enlaces usando la API.
const addComment = async (id, text) => {
    try {
        if(!id || !text) {
            throw new Error('Hubo un problema, falta el id o el texto')
        }

        const response = await fetch(`http://localhost:3000/api/comment/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({text: text}) // enviamos el texto en el body
        });
        
        if(!response.ok) throw new Error('Hubo un problema al agregar el comentario');
        const newComment = await response.json();

        return newComment;
        
    } catch (error) {
        console.error('Hubo un error al comentar', error.message);
    }
}

// Funcion que inicia la vista de detalles y al capturador de clics de votar, comentar.
const initDetail = async (linkID) => {
    try {
        const app = document.getElementById('app'); // obtenemos el contenedor donde insertaremos nuestros componentes
        app.innerHTML = detailsComponent();  // Inyectamos nuestro componente base
    
        // funcion que debe obtener toda la informacion de un link por medio de su ID.
        const links = await getLink(linkID);

        if (!links) {
            throw new Error('Error al obtener los detalles');
        }
        
        renderDetails(links); // renderizar la informacion detallada del item seleccionado
        captureClicksDetails();
        captureClicksBack();
    } catch (error) {
        console.error("Hubo un problema: ", error.message);
    }
};

export { initDetail };