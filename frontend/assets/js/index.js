const inspirationalPhrases = [
    "Insertar algo inspirador",
    "Confirmado: miedo irracional, pero estético",
    "No es cringe si es compartido",
    "Respirá hondo. Hay arañas en todos lados igual",
    "La terapia es cara. Postear es gratis",
    "Fobia desbloqueada: esta página",
    "¿Es raro tenerle miedo al algodón? Preguntando por un amigo",
    "Venías por memes, te fuiste con traumas nuevos",
    "Fobia al vacío… como tu inbox",
    "Fobia al compromiso, pero acá todos los días",
    "Este sitio está certificado libre de juicio. Y de serpientes",
    "Spoiler: nadie te entiende. Pero nosotros sí",
    "Fobia al silencio incómodo. ¿Cómo venís con eso?",
];

const userLikes = new Set();
const renderedPosts = new Set();

const POSTS_PER_PAGE = 20;
let currentPage = 0;
let isLoading = false;
let posts = [];

const API_BASE_URL = 'https://api.fobium.com';

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


function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;
    
    const isLiked = userLikes.has(post.id);
    const likeClass = isLiked ? 'liked' : '';
    const fillAttribute = isLiked ? 'fill="currentColor"' : 'fill="none"';

    postCard.innerHTML = `
        <div class="post-content">
        <h3 class="post-title">${post.phobia_name}</h3>
        <p class="post-text">${post.description}</p>
        </div>
        <div class="post-meta">
            <div class="post-info">
                <span class="post-date">${(post.date)}</span>
                <span class="post-author">by ${post.creator}</span>
            </div>
            <div class="post-stats">
                <div class="stat-item likes-btn" data-post-id="${post.id}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 14l5-5 5 5"/>
                    </svg>
                    <span class="likes-count">${formatNumber(post.likes)}</span>
                </div>
                <div class="stat-item comments-btn" data-post-id="${post.id}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span class="comments-count">${post.comments}</span>
                </div>
            </div>
        </div>
    `;
    
    return postCard;
}

function getShuffledPosts(postsArray) {
    const shuffled = [...postsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getPostsForPage(page = 0) {
    const startIndex = page * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    if (page === 0) {
        const shuffledPosts = getShuffledPosts(posts);
        return shuffledPosts.slice(startIndex, endIndex);
    }
    const pagePosts = posts.slice(startIndex, endIndex);
    return getShuffledPosts(pagePosts);
}

function renderPosts(loadMore = false) {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) {
        console.error('No se encontró el elemento con id "postsGrid"');
        return;
    }
    if (!loadMore) {
        postsGrid.innerHTML = '';
        renderedPosts.clear();
        currentPage = 0;
    }
    
    const pagePosts = getPostsForPage(currentPage);
    const fragment = document.createDocumentFragment();
    let newPostsCount = 0;
    
    pagePosts.forEach(post => {
        if (!renderedPosts.has(post.id)) {
            const postCard = createPostCard(post);
            fragment.appendChild(postCard);
            renderedPosts.add(post.id);
            newPostsCount++;
        }
    });
    if (newPostsCount > 0) {
        postsGrid.appendChild(fragment);
        updateTimeAgoInCards();
        console.log(`Se renderizaron ${newPostsCount} posts nuevos (página ${currentPage})`);
    }
    
    currentPage++;
    return newPostsCount;
}

async function fetchPhobias() {
    try {
        console.log('Fetching phobias from API...');
        const response = await fetch(`${API_BASE_URL}/phobias`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos de la API:', data);
        
        posts = data;
        renderPosts();
        
    } catch (error) {
        console.error("Error al cargar fobias:", error);
    }
}

function loadMorePosts() {
    if (isLoading) return;
    
    isLoading = true;
    const newPostsCount = renderPosts(true);
    setTimeout(() => {
        isLoading = false;
        if (newPostsCount === 0) {
            console.log('No hay más posts para cargar');
        }
    }, 100);
}

function setupInfiniteScroll() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = postsGrid;
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
            loadMorePosts();
        }
    });
}

function handleComments(postId) {
    console.log(`Intentando abrir comentarios para post ${postId}`);
    
    const post = posts.find(p => p.id === postId);
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        alert('Post no encontrado');
        return;
    }
    
    try {
        window.location.href = `pages/comments.html?post=${postId}`;
    } catch (error) {
        console.error('Error al redireccionar a comments.html:', error);
        
        alert(`Comentarios para "${post.phobia_name}"\n\nEsta funcionalidad requiere el archivo comments.html`);
        
    }
}

function setupEventListeners() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const likesBtn = e.target.closest('.likes-btn');
        const commentsBtn = e.target.closest('.comments-btn');
        
        if (likesBtn) {
            const postId = parseInt(likesBtn.dataset.postId);
            console.log(`Click en likes del post ${postId}`);
            toggleLike(postId, likesBtn);
        }
        
        if (commentsBtn) {
            const postId = parseInt(commentsBtn.dataset.postId);
            console.log(`Click en comments del post ${postId}`);
            handleComments(postId);
        }
    });
    
    console.log('Event listeners configurados correctamente');
}


async function toggleLike(postId, likesBtn) {
    const post = posts.find(p => p.id === postId);
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        return;
    }

    const likesCount = likesBtn.querySelector('.likes-count');
    const likeIcon = likesBtn.querySelector('svg path');

    if (!likesCount || !likeIcon) {
        console.error(`Elementos internos no encontrados en post ${postId}`);
        return;
    }

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
    likesBtn.style.transform = isCurrentlyLiked ? 'scale(0.9)' : 'scale(1.1)';
    setTimeout(() => {
        likesBtn.style.transform = 'scale(1)';
    }, 150);

    likesCount.textContent = formatNumber(post.likes);
    console.log(`Post ${postId} ${isCurrentlyLiked ? 'unliked' : 'liked'}. Total: ${post.likes}`);
        try {
            const response = await fetch(`${API_BASE_URL}/phobias/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Like enviado exitosamente al backend para post ${postId}`);
        } catch (error) {
            console.error("Error al enviar el like al backend:", error);
            if (isCurrentlyLiked) {
                userLikes.add(postId);
                post.likes += 1;
                likesBtn.classList.add('liked');
                likeIcon.setAttribute('fill', 'currentColor');
            } else {
                userLikes.delete(postId);
                post.likes -= 1;
                likesBtn.classList.remove('liked');
                likeIcon.setAttribute('fill', 'none');
            }
            
            likesCount.textContent = formatNumber(post.likes);
            console.log(`Like revertido debido al error. Total: ${post.likes}`);
    }
}


function updateTimeAgoInCards() {
    console.log('Actualizando timestamps...');
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando aplicación optimizada...');
    setRandomTitle();
    fetchPhobias();
    setupEventListeners();
    setupInfiniteScroll();
    setInterval(updateTimeAgoInCards, 60 * 1000);
    console.log('Inicialización completada con optimizaciones');
    console.log(`Posts por página: ${POSTS_PER_PAGE}`);
    console.log(`Posts renderizados inicialmente: ${renderedPosts.size}`);
});