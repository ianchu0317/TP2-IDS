const inspirationalPhrases = [
    "Advertencia: este post puede causar incomodidad",
    "Leer bajo tu propio riesgo. Nosotros ya lo hicimos y miranos ahora",
    "Comentá, compartí, exorcizá tus traumas",
    "Este post fue aprobado por 4/5 psicólogos imaginarios"
];

const userLikes = new Set();
const userCommentLikes = new Set();

let currentPostId = null;
let currentPost = null;
let postComments = [];

const posts = [
    {
        id: 1,
        text: "Creo que tengo Xantofobia. Estaba viendo Jorge el curioso y ese tipo vestido de amarillo me dio pesadillas",
        author: "the_big_mothergoose",
        timestamp: Date.now() - (6 * 60 * 60 * 1000),
        likes: 214,
        comments: 13
    }
];

function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * inspirationalPhrases.length);
    return inspirationalPhrases[randomIndex];
}

function setRandomTitle() {
    const titleElement = document.getElementById('inspirationalTitle');
    if (titleElement) {
        const randomPhrase = getRandomPhrase();
        titleElement.textContent = randomPhrase;
        console.log("Título actualizado con:", randomPhrase);
    }
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diff < 60 * 1000) {
        return seconds <= 1 ? 'ahora' : `${seconds} segundos`;
    } else if (diff < 60 * 60 * 1000) {
        return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
    } else if (diff < 24 * 60 * 60 * 1000) {
        return hours === 1 ? '1 hora' : `${hours} horas`;
    } else {
        return days === 1 ? '1 día' : `${days} días`;
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

function getPostById(postId) {
    return posts.find(post => post.id === postId);
}

function getCommentsByPostId(postId) {
    return comments.filter(comment => comment.postId === postId);
}

function createPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.className = 'post-container';
    postContainer.dataset.postId = post.id;
    postContainer.dataset.timestamp = post.timestamp;
    
    postContainer.innerHTML = `
        <div class="post-box">
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
            </div>
            <div class="post-content">
                ${post.text}
            </div>
            <div class="post-footer">
                <div class="post-likes likes-btn" data-post-id="${post.id}">
                    <svg class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 14l5-5 5 5"/>
                    </svg>
                    <span class="likes-count">${formatNumber(post.likes)}</span>
                </div>
                <div class="post-comments comments-btn" data-post-id="${post.id}">
                    <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span class="comments-count">${post.comments}</span>
                </div>
            </div>
        </div>
        <div class="comment-box">
            <textarea class="comment-input" placeholder="Escribe un comentario..." maxlength="500"></textarea>
            <div class="comment-actions">
                <button class="comment-btn secondary cancel-btn">Cancelar</button>
                <button class="comment-btn primary submit-btn">Comentar</button>
            </div>
        </div>
        <div class="comments-section">
            <div class="comments-list"></div>
        </div>
    `;
    
    return postContainer;
}

function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    commentElement.dataset.commentId = comment.id;
    commentElement.dataset.timestamp = comment.timestamp;
    
    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${formatTimeAgo(comment.timestamp)}</span>
        </div>
        <div class="comment-content">
            ${comment.text}
        </div>
        <div class="comment-footer">
            <div class="comment-likes comment-like-btn" data-comment-id="${comment.id}">
                <svg class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 14l5-5 5 5"/>
                </svg>
                <span class="comment-likes-count">${formatNumber(comment.likes)}</span>
            </div>
        </div>
    `;
    
    return commentElement;
}

function renderPost(postId) {
    const post = getPostById(postId);
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        return;
    }
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('No se encontró el contenedor principal');
        return;
    }
    
    currentPost = post;
    currentPostId = postId;

    const existingPost = mainContent.querySelector('.post-container');
    if (existingPost) {
        existingPost.remove();
    }
    const postElement = createPostElement(post);
    mainContent.appendChild(postElement);
    
    renderComments(postId);
    
    console.log(`Post ${postId} renderizado`);
}

function renderComments(postId) {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    postComments = getCommentsByPostId(postId);
    commentsList.innerHTML = '';
    
    if (postComments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</div>';
        return;
    }
    
    // Ordenar comentarios por likes (más populares primero)
    postComments.sort((a, b) => b.likes - a.likes);
    
    postComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
    
    console.log(`${postComments.length} comentarios renderizados`);
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const likesBtn = document.querySelector(`[data-post-id="${postId}"].likes-btn`);
    const likesCount = document.querySelector(`[data-post-id="${postId}"] .likes-count`);
    const likeIcon = likesBtn?.querySelector('svg');
    
    if (!likesBtn || !likesCount || !likeIcon) return;
    
    const isCurrentlyLiked = userLikes.has(postId);
    
    if (isCurrentlyLiked) {
        userLikes.delete(postId);
        post.likes -= 1;
        likesBtn.classList.remove('liked');
        likeIcon.setAttribute('fill', 'none');
    } else {
        userLikes.add(postId);
        post.likes += 1;
        likesBtn.classList.add('liked');
        likeIcon.setAttribute('fill', 'currentColor');
    }
    
    likesCount.textContent = formatNumber(post.likes);
    likesBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        likesBtn.style.transform = 'scale(1)';
    }, 150);
    
    console.log(`Post ${postId} ${isCurrentlyLiked ? 'unliked' : 'liked'}. Total: ${post.likes}`);
}

function toggleCommentLike(commentId) {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    const likesBtn = document.querySelector(`[data-comment-id="${commentId}"].comment-like-btn`);
    const likesCount = document.querySelector(`[data-comment-id="${commentId}"] .comment-likes-count`);
    const likeIcon = likesBtn?.querySelector('svg');
    
    if (!likesBtn || !likesCount || !likeIcon) return;
    
    const isCurrentlyLiked = userCommentLikes.has(commentId);
    
    if (isCurrentlyLiked) {
        userCommentLikes.delete(commentId);
        comment.likes -= 1;
        likesBtn.classList.remove('liked');
        likeIcon.setAttribute('fill', 'none');
    } else {
        userCommentLikes.add(commentId);
        comment.likes += 1;
        likesBtn.classList.add('liked');
        likeIcon.setAttribute('fill', 'currentColor');
    }
    
    likesCount.textContent = formatNumber(comment.likes);
    
    // Animación
    likesBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        likesBtn.style.transform = 'scale(1)';
    }, 150);
    
    console.log(`Comentario ${commentId} ${isCurrentlyLiked ? 'unliked' : 'liked'}. Total: ${comment.likes}`);
}

function addComment(postId, text, author = 'anonymous') {
    if (!text.trim()) return;
    
    const newComment = {
        id: Date.now(),
        postId: postId,
        text: text.trim(),
        author: author,
        timestamp: Date.now(),
        likes: 0
    };
    
    comments.push(newComment);
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments += 1;
        const commentsCount = document.querySelector(`[data-post-id="${postId}"] .comments-count`);
        if (commentsCount) {
            commentsCount.textContent = post.comments;
        }
    }
    
    // Re-renderizar comentarios
    renderComments(postId);
    
    console.log(`Comentario agregado al post ${postId}`);
}

function updateTimeAgo() {
    // Actualizar tiempo del post
    const postContainer = document.querySelector('.post-container');
    if (postContainer) {
        const timestamp = Number(postContainer.dataset.timestamp);
        const timeElement = postContainer.querySelector('.post-time');
        if (timestamp && timeElement) {
            timeElement.textContent = formatTimeAgo(timestamp);
        }
    }
    
    // Actualizar tiempo de comentarios
    const commentItems = document.querySelectorAll('.comment-item');
    commentItems.forEach(item => {
        const timestamp = Number(item.dataset.timestamp);
        const timeElement = item.querySelector('.comment-time');
        if (timestamp && timeElement) {
            timeElement.textContent = formatTimeAgo(timestamp);
        }
    });
}

function setupEventListeners() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    mainContent.addEventListener('click', (e) => {
        // Manejar likes de posts
        const likesBtn = e.target.closest('.likes-btn');
        if (likesBtn) {
            const postId = parseInt(likesBtn.dataset.postId);
            toggleLike(postId);
            return;
        }
        
        // Manejar likes de comentarios
        const commentLikeBtn = e.target.closest('.comment-like-btn');
        if (commentLikeBtn) {
            const commentId = parseInt(commentLikeBtn.dataset.commentId);
            toggleCommentLike(commentId);
            return;
        }
        
        // Manejar botón de comentar
        const submitBtn = e.target.closest('.submit-btn');
        if (submitBtn) {
            const commentInput = document.querySelector('.comment-input');
            if (commentInput && currentPostId) {
                const text = commentInput.value.trim();
                if (text) {
                    addComment(currentPostId, text);
                    commentInput.value = '';
                }
            }
            return;
        }
        
        // Manejar botón de cancelar
        const cancelBtn = e.target.closest('.cancel-btn');
        if (cancelBtn) {
            const commentInput = document.querySelector('.comment-input');
            if (commentInput) {
                commentInput.value = '';
            }
            return;
        }
    });
    
    // Manejar tecla Enter en el textarea
    mainContent.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('comment-input') && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando vista de post individual...');
    
    // Configurar título aleatorio
    setRandomTitle();
    
    // Obtener ID del post desde URL
    const postId = getPostIdFromUrl();
    console.log(`ID del post desde URL: ${postId}`);
    
    // Renderizar post
    renderPost(postId);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar tiempos cada minuto
    setInterval(updateTimeAgo, 60 * 1000);
    
    console.log('Inicialización completada');
});