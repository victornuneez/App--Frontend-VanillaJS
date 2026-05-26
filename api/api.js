// Funcion que obtiene todas las etiquetas de la DB(backend)
const getTags = async () => {
    try {
        const response = await fetch('http://localhost:3000/app/tags'); 
        // fetch no lanza un error automaticamente solo por un codigo de estado malo, entonces forzamos el error en el caso en que haya un error.
        if(!response.ok) { 
            throw new Error('Error al obtener las etiquetas');
        }

        const tags = await response.json();
        return tags; // array de objetos tags
    
    } catch (error) {
        console.error("Hubo un problema con la peticion: ", error.message);
    }
};


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

// Funcion que obtiene todos los detalles del enlace indicado por el usuario
const getLinkDetailsById = async (linkID) => {
    try {
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

// Funcion auxiliar para votar un enlace, usando la API
const voteLinkByid = async (id) => {
    try {        
        const response = await fetch(`http://localhost:3000/api/vote/${id}`, { method:'PATCH' });
        if(!response.ok) throw new Error('Hubo un problema al votar');

        const updatedVote = await response.json();
        return updatedVote;
        
    }catch (error) {
        console.error("Error al votar: ", error.message);
    }
};

// Funcion auxiliar para comentar los enlaces usando la API.
const addCommentById = async (id, text) => {
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

const deleteLinkById = async(id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/delete/${id}`, { method: "DELETE" });
        if(!response.ok) throw new Error('Hubo un error en la operacion');
        
        const itemDelete = await response.json();
        return itemDelete;
    
    } catch(error) {
        console.error('Hubo un problema al borrar: ', error.message);
    }

};

const updateLinkById = async (id, title, url, description) => {
    try {
        const response = await fetch(`http://localhost:3000/api/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({ title, url, description })
        });
        if(!response.ok) throw new Error('Hubo un problema al actualizar el recurso');

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Hubo un problema: ', error.message);
    }
};

// Funcion auxiliar para enviar los datos del nuevo recurso al backend
const saveLink = async (title, url, description, tag) => {
    try {
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


export { getTags, getLinksByTag, getLinkDetailsById, voteLinkByid, addCommentById, deleteLinkById, updateLinkById, saveLink };