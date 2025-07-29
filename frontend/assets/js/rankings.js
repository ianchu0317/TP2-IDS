const RANDOM_TITLES = [
    "Top de tops. Sin lugar para los débiles",
    "Los más likeados. El Olimpo de las fobias",
    "Camino al podio de la paranoia",
    "Ranking: porque tus fobias también compiten",
    "Las joyas de la comunidad. Brillan más que tu ansiedad"
];

let posts = [];

// Use global config for API base URL
const API_BASE_URL = CONFIG.apiBaseUrl;

function setRandomTitle() {
    const titleElement = document.getElementById('title');
    if (!titleElement) return;
    
    const randomIndex = Math.floor(Math.random() * RANDOM_TITLES.length);
    titleElement.textContent = RANDOM_TITLES[randomIndex];
}

function createPostCard(post, index) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.postId = post.id;
    
    card.innerHTML = `
        <div class="post-title">${post.phobia_name}</div>
        <div class="post-text">${post.description}</div>
        
        <div class="post-info">
            <span class="post-author">${post.creator}</span>
            <span class="post-date">${post.date}</span>
        </div>
        
        <div class="post-stats">
            <div class="stat-item likes-btn" data-post-id="${post.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 14l5-5 5 5"/>
                </svg>
                <span class="like-count">${post.likes}</span>
            </div>
            
            <div class="stat-item comments-btn" data-post-id="${post.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>${post.comments || 0}</span>
            </div>
        </div>
    `;
    
    return card;
}

function renderPosts(posts) {
    const container = document.getElementById('rankingContainer');
    
    container.innerHTML = '';
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No hay posts disponibles</div>';
        return;
    }

    const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
    
    sortedPosts.forEach((post, index) => {
        const card = createPostCard(post, index + 1);
        container.appendChild(card);
    });
}

function setupEventListeners() {
    const container = document.getElementById('rankingContainer');
    if (!container) return;
    
    container.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const likesBtn = e.target.closest('.likes-btn');
        const commentsBtn = e.target.closest('.comments-btn');
        
        if (likesBtn) {
            const postId = likesBtn.dataset.postId;
            console.log(`Click en likes del post ${postId}`);
            handleLike(postId, likesBtn);
        }
        
        if (commentsBtn) {
            const postId = commentsBtn.dataset.postId;
            console.log(`Click en comments del post ${postId}`);
            handleComments(postId);
        }
    });
    
    console.log('Event listeners configurados correctamente para rankings');
}

function handleLike(postId, button) {
    const likeCount = button.querySelector('.like-count');
    let currentLikes = parseInt(likeCount.textContent);
    const isLiked = button.classList.contains('liked');
    
    if (isLiked) {
        button.classList.remove('liked');
        likeCount.textContent = currentLikes - 1;
    } else {
        button.classList.add('liked');
        likeCount.textContent = currentLikes + 1;
    }
}

function handleComments(postId) {
    console.log(`Intentando abrir comentarios para post ${postId}`);
    
    const post = posts.find(p => p.id.toString() === postId.toString());
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        alert('Post no encontrado');
        return;
    }
    
    try {
        console.log(`../../pages/comments.html?post=${encodeURIComponent(postId)}`);
        window.location.href = `../../pages/comments.html?post=${encodeURIComponent(postId)}`;
    } catch (error) {
        console.error('Error al redireccionar a comments.html:', error);
        alert(`Comentarios para "${post.phobia_name}"\n\nEsta funcionalidad requiere el archivo comments.html`);
    }
}

async function loadPosts() {
    try {
        console.log('Cargando posts desde API...');
        const response = await fetch(`${API_BASE_URL}/rankings`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const postsData = await response.json();
        console.log('Posts recibidos de la API:', postsData);
        
        posts = postsData;
        renderPosts(posts);
        
    } catch (error) {
        console.error('Error al cargar posts:', error);
        const container = document.getElementById('rankingContainer');
        container.innerHTML = '<div class="error-message">Error al cargar los posts. Inténtalo de nuevo más tarde.</div>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, inicializando rankings...');
    setRandomTitle();
    setupEventListeners();
    loadPosts();
});