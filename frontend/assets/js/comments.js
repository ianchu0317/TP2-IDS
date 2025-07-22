const API_BASE_URL = 'https://api.fobium.com';

let currentPostData = null;
let currentCommentsData = [];
let currentPhobiaId = null;

function getPhobiaIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const phobiaId = urlParams.get('post');
    
    if (phobiaId) {
        return parseInt(phobiaId, 10);
    }
    
    const pathSegments = window.location.pathname.split('/');
    const postIndex = pathSegments.findIndex(segment => segment === 'post' || segment === 'phobia');
    
    if (postIndex !== -1 && pathSegments[postIndex + 1]) {
        return parseInt(pathSegments[postIndex + 1], 10);
    }
    
    return null;
}

async function fetchPostData(phobiaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}`);
        
        if (response.status === 404) {
            console.warn(`Fobia con ID ${phobiaId} no encontrada`);
            return null;
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

async function fetchComments(phobiaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}/comments`);
        if (response.status === 404) {
            console.log(`No hay comentarios para la fobia ${phobiaId}`);
            return [];
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}


async function postComment(phobiaId, commentText) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                comment: commentText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
}

function renderPost() {
    const postCard = document.getElementById('post-card');
    if (!postCard || !currentPostData) {
        console.error('post-card element not found or no post data');
        return;
    }

    const rawDate = currentPostData.date;
    const author = currentPostData.creator;
    const content = currentPostData.description;
    const phobiaName = currentPostData.phobia_name;

    document.title = `${author} en Fobium: "${content}"`;

    postCard.innerHTML = `
        <div class="post-meta">
            <span class="post-author">${author}</span> · 
            <span class="post-time">${rawDate}</span>
        </div>
        <div class="post">
            <h3 class="post-title">${phobiaName}</h3>
            <p class="post-content">${content}</p>
            <div class="post-stats">
                <span class="likes-count">${currentPostData.likes || 0} likes</span>
            </div>
        </div>
    `;
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const commentTextHtml = comment.comment;
    
    commentDiv.innerHTML = `
        <div class="comment-content">
            <div class="comment-comment">${commentTextHtml}</div>
            <div class="comment-meta">
                <a href="#" class="comment-author">${comment.creator}</a>
                <span class="comment-time">${comment.date}</span>
            </div>
        </div>
    `;
    return commentDiv;
}


function renderComments() {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    const filterSelect = document.getElementById('filter-select');
    
    if (!commentsList) {
        console.error('comments-list element not found');
        return;
    }

    commentsList.innerHTML = '';
    currentCommentsData.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function handleFilterChange() {
    renderComments();
}

async function handleCommentSubmit(commentText) {
    console.log('Handling comment submit:', commentText);
    if (!commentText.trim()) {
        alert('El comentario no puede estar vacío');
        return;
    }

    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
    }
    try {
        newComment = await postComment(currentPhobiaId, commentText);
            
        if (newComment) {
            currentCommentsData = await fetchComments(currentPhobiaId);
            renderComments();
            
            const commentInput = document.getElementById('comment-input');
            if (commentInput) {
                commentInput.value = '';
            }
        } else {
            alert('Error al enviar el comentario. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Error al enviar el comentario. Inténtalo de nuevo.');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar';
        }
    }
}

async function refreshComments() {
    try {
        currentCommentsData = await fetchComments(currentPhobiaId);
        renderComments();
    } catch (error) {
        console.error('Error refreshing comments:', error);
    }
}

async function initializePage() {
    try {
        currentPhobiaId = getPhobiaIdFromUrl();
        console.log('Phobia ID:', currentPhobiaId);

        currentPostData = await fetchPostData(currentPhobiaId);
        if (!currentPostData) {
            throw new Error('No se pudo cargar el post. Verifica que el ID sea correcto.');
        }
        
        console.log('Post data loaded:', currentPostData);

        currentCommentsData = await fetchComments(currentPhobiaId);
        console.log('Comments loaded:', currentCommentsData);

        renderPost();
        renderComments();
        const filterSelect = document.getElementById('filter-select');
        if (filterSelect) {
            filterSelect.value = "all";
            filterSelect.addEventListener('change', handleFilterChange);
        }

        const commentForm = document.getElementById('comment-form');
        const commentInput = document.getElementById('comment-input');
        const submitButton = document.getElementById('submit-btn');

        if (commentForm && commentInput && submitButton) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleCommentSubmit(commentInput.value);
            });

            submitButton.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('Comment form submitted:', commentInput.value);
                await handleCommentSubmit(commentInput.value);
            });
        }
        console.log('Page initialization complete');
    } catch (error) {
        console.error('Error initializing page:', error);
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <p>Error: ${error.message}</p>
                    <p>Por favor, verifica el ID del post y recarga la página.</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', initializePage);