// Use global config for API base URL
const API_BASE_URL = CONFIG.apiBaseUrl;

let currentPostData = null;
let currentPhobiaId = null;

function getPhobiaIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const phobiaId = urlParams.get('post');
    
    if (phobiaId) {
        return parseInt(phobiaId, 10);
    }
    
    const pathSegments = window.location.pathname.split('/');
    const editIndex = pathSegments.findIndex(segment => segment === 'edit_post');
    
    if (editIndex !== -1 && pathSegments[editIndex + 1]) {
        return parseInt(pathSegments[editIndex + 1], 10);
    }
    
    return null;
}

async function fetchPostData(phobiaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}`);
        
        if (response.status === 404) {
            throw new Error('El post no existe');
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching post data:', error);
        throw error;
    }
}

async function updatePost(phobiaId, phobiaName, description) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                phobia_name: phobiaName,
                description: description
            })
        });

        if (response.status === 204) {
            return { success: true };
        } else if (response.status === 404) {
            throw new Error('El post no existe o ya fue eliminado');
        } else if (response.status === 403) {
            throw new Error('No tienes permisos para editar este post');
        } else if (response.status === 400) {
            throw new Error('Error en el servidor al actualizar el post');
        } else {
            throw new Error(`Error inesperado: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

function populateForm() {
    if (!currentPostData) {
        console.error('No post data available');
        return;
    }

    const phobiaNameInput = document.getElementById('phobia_name');
    const descriptionInput = document.getElementById('description');

    if (phobiaNameInput) {
        phobiaNameInput.value = currentPostData.phobia_name || '';
    }

    if (descriptionInput) {
        descriptionInput.value = currentPostData.description || '';
    }
    document.title = `Editar: ${currentPostData.phobia_name || 'Post'}`;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const phobiaNameInput = document.getElementById('phobia_name');
    const descriptionInput = document.getElementById('description');
    const submitBtn = document.querySelector('.btn');
    
    const phobiaName = phobiaNameInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!phobiaName) {
        alert('El título de la fobia es obligatorio');
        phobiaNameInput.focus();
        return;
    }
    
    if (!description) {
        alert('La descripción es obligatoria');
        descriptionInput.focus();
        return;
    }
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Actualizando...';

    try {
        await updatePost(currentPhobiaId, phobiaName, description);
        
        alert('Post actualizado exitosamente');
        window.location.href = `../../pages/comments.html?post=${currentPhobiaId}`;
        
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        alert(`Error al actualizar el post: ${error.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showLoading() {
    const form = document.getElementById('editPostForm');
    if (form) {
        form.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>Cargando datos del post...</p>
            </div>
        `;
    }
}

async function initializeEditPage() {
    try {
        currentPhobiaId = getPhobiaIdFromUrl();
        
        if (!currentPhobiaId) {
            throw new Error('ID del post no encontrado en la URL');
        }
        
        console.log('Phobia ID:', currentPhobiaId);
        showLoading();
        currentPostData = await fetchPostData(currentPhobiaId);
        console.log('Post data loaded:', currentPostData);
        const container = document.querySelector('.edit_post-container');
        container.innerHTML = `
            <form class="edit_post-form" id="editPostForm">
                <h2>Editar Fobia</h2>

                <div class="form-group">
                    <input type="text" id="phobia_name" placeholder="Fobia" required>
                </div>

                <div class="form-desc">
                    <input type="text" id="description" placeholder="Descripcion de la Fobia" required>
                </div>

                <button type="submit" class="btn">Actualizar Post</button>
            </form>
        `;

        populateForm();
        
        const editForm = document.getElementById('editPostForm');
        if (editForm) {
            editForm.addEventListener('submit', handleFormSubmit);
        }
        
        console.log('Edit page initialization complete');
    } catch (error) {
        console.error('Error initializing edit page:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeEditPage);