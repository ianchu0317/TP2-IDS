const API_BASE_URL = 'http://localhost:8000';
const USE_HARDCODED_DATA = true;

const hardcodedPostData = {
    id: 3,
    content: "No puedo con la gente con nariz grande. Ya lo dije. Me dan ansiedad. No es personal, es nasal.",
    author: "AnonUser",
    timestamp: Date.now() - (4 * 60 * 60 * 1000)
};

const hardcodedCommentsData = [
    {
        id: 1,
        comment: "Acabo de entrar al post y ya me siento atacado 😭",
        creator: "CringePolicía",
        creator_id: 1,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 2,
        comment: "Bro eso no es fobia, eso es superficialidad nivel final boss.",
        creator: "ToontoPolarBear",
        creator_id: 2,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 3,
        comment: "Entonces no veas mi foto de perfil, por tu bien.",
        creator: "DarwinTeMira",
        creator_id: 3,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 4,
        comment: "¿Y qué hacés cuando te ves al espejo recién levantadx? ¿Entrás en pánico?",
        creator: "NarizDePayaso",
        creator_id: 4,
        phobia_id: 3,
        date: "2025-07-14"
    }
];

let currentPostData = null;
let currentCommentsData = [];
let currentPhobiaId = null;

function getPhobiaIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const phobiaId = urlParams.get('id') || urlParams.get('phobia_id');
    
    if (phobiaId) {
        return parseInt(phobiaId, 10);
    }
    
    const pathSegments = window.location.pathname.split('/');
    const postIndex = pathSegments.findIndex(segment => segment === 'post' || segment === 'phobia');
    
    if (postIndex !== -1 && pathSegments[postIndex + 1]) {
        return parseInt(pathSegments[postIndex + 1], 10);
    }
    
    return hardcodedPostData.id;
}


async function fetchPostData(phobiaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }
}

async function fetchComments(phobiaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}/comments`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}


async function postComment(phobiaId, commentText) {
    try {
        const response = await fetch(`${API_BASE_URL}/phobias/${phobiaId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        return null;
    }
}

async function getPostData(phobiaId) {
    if (USE_HARDCODED_DATA) {
        return hardcodedPostData;
    }
    
    const apiData = await fetchPostData(phobiaId);
    
    if (apiData) {
        return apiData;
    }
    
    console.warn('Using hardcoded post data as fallback');
    return hardcodedPostData;
}


async function getComments(phobiaId) {
    if (USE_HARDCODED_DATA) {
        return hardcodedCommentsData.filter(comment => comment.phobia_id === phobiaId);
    }
    
    const apiComments = await fetchComments(phobiaId);
    
    if (apiComments && apiComments.length > 0) {
        return apiComments;
    }
    
    console.warn('Using hardcoded comments as fallback');
    return hardcodedCommentsData.filter(comment => comment.phobia_id === phobiaId);
}


function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        return `hace ${diffHours}h`;
    } else {
        return date.toLocaleDateString('es-ES');
    }
}

function dateToTimestamp(dateString) {
    return new Date(dateString).getTime();
}

function sortComments(comments, sortBy = 'newest') {
    const sortedComments = [...comments];

    switch(sortBy) {
        case 'newest':
            return sortedComments.sort((a, b) => dateToTimestamp(b.date) - dateToTimestamp(a.date));
        case 'oldest':
            return sortedComments.sort((a, b) => dateToTimestamp(a.date) - dateToTimestamp(b.date));
        case 'top':
            return sortedComments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        default:
            return sortedComments.sort((a, b) => dateToTimestamp(b.date) - dateToTimestamp(a.date));
    }
}

function renderPost() {
    const postCard = document.getElementById('post-card');
    if (!postCard || !currentPostData) {
        console.error('post-card element not found or no post data');
        return;
    }

    const timeAgo = formatTimestamp(currentPostData.timestamp);
    document.title = `${currentPostData.author} en Fobium: "${currentPostData.content}"`;

    postCard.innerHTML = `
        <div class="post-meta">
            <span class="post-author">${currentPostData.author}</span> · 
            <span class="post-time">${timeAgo}</span>
        </div>
        <div class="post">
            <p class="post-content">${currentPostData.content}</p>
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

    const filterValue = filterSelect ? filterSelect.value : "all";

    commentsList.innerHTML = '';
    let sortedComments = sortComments(currentCommentsData, 'newest');
    
    if (filterValue !== "all") {
        sortedComments = sortedComments.slice(0, parseInt(filterValue, 10));
    }

    if (commentsCount) {
        commentsCount.textContent = `${sortedComments.length} comentarios`;
    }

    sortedComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function handleFilterChange() {
    renderComments();
}

async function handleCommentSubmit(commentText) {
    if (!commentText.trim()) {
        alert('El comentario no puede estar vacío');
        return;
    }

    const submitButton = document.getElementById('submit-comment');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
    }

    try {
        if (USE_HARDCODED_DATA) {
            const newComment = {
                id: currentCommentsData.length + 1,
                comment: commentText,
                creator: "Usuario Anónimo",
                creator_id: 999,
                phobia_id: currentPhobiaId,
                date: new Date().toISOString().split('T')[0]
            };
            
            currentCommentsData.push(newComment);
            renderComments();
            const commentInput = document.getElementById('comment-input');
            if (commentInput) {
                commentInput.value = '';
            }
        } else {
            const newComment = await postComment(currentPhobiaId, commentText);
            
            if (newComment) {
                currentCommentsData = await getComments(currentPhobiaId);
                renderComments();
                
                const commentInput = document.getElementById('comment-input');
                if (commentInput) {
                    commentInput.value = '';
                }
            } else {
                alert('Error al enviar el comentario. Inténtalo de nuevo.');
            }
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

async function initializePage() {
    try {
        currentPhobiaId = getPhobiaIdFromUrl();
        console.log('Phobia ID:', currentPhobiaId);

        currentPostData = await getPostData(currentPhobiaId);
        console.log('Post data loaded:', currentPostData);

        currentCommentsData = await getComments(currentPhobiaId);
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
        const submitButton = document.getElementById('submit-comment');

        if (commentForm && commentInput && submitButton) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleCommentSubmit(commentInput.value);
            });

            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleCommentSubmit(commentInput.value);
            });
        }

        console.log('Page initialization complete');
    } catch (error) {
        console.error('Error initializing page:', error);
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <p>Error al cargar el contenido. Por favor, recarga la página.</p>
                </div>
            `;
        }
    }
}


document.addEventListener('DOMContentLoaded', initializePage);

async function refreshComments() {
    try {
        currentCommentsData = await getComments(currentPhobiaId);
        renderComments();
    } catch (error) {
        console.error('Error refreshing comments:', error);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePage,
        refreshComments,
        handleCommentSubmit,
        getPostData,
        getComments
    };
}