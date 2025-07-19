const RANDOM_TITLES = [
    "Top de tops. Sin lugar para los débiles",
    "Los más likeados. El Olimpo de las fobias",
    "Camino al podio de la paranoia",
    "Ranking: porque tus fobias también compiten",
    "Las joyas de la comunidad. Brillan más que tu ansiedad"
];

const API_BASE_URL = 'https://api.fobium.com';

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
            <div class="stat-item likes-btn" data-id="${post.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 14l5-5 5 5"/>
                </svg>
                <span class="like-count">${post.likes}</span>
            </div>
            
            <div class="stat-item comments-btn" data-id="${post.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.likes-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const postId = this.dataset.id;
            handleLike(postId, this);
        });
    });
    document.querySelectorAll('.comments-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const postId = this.dataset.id;
            handleComment(postId);
        });
    });
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

function handleComment(postId) {
    console.log(`Redirigiendo a comentarios del post ${postId}`);
    window.location.href = `comments.html?id=${postId}`;
}

async function loadPosts() {
    try {
        console.log('Cargando posts desde API...');
        const response = await fetch(`${API_BASE_URL}/rankings`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log('Posts recibidos de la API:', posts);
        renderPosts(posts);
        
    } catch (error) {
        console.error('Error al cargar posts:', error);
        const container = document.getElementById('rankingContainer');
        container.innerHTML = '<div class="error-message">Error al cargar los posts. Inténtalo de nuevo más tarde.</div>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setRandomTitle();
    loadPosts();
});