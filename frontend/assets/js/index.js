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

const posts = [
    {
        id: 1,
        text: "Creo que tengo Xantofobia. Estaba viendo Jorge el curioso y ese tipo vestido de amarillo me dio pesadillas",
        author: "the_big_mothergoose",
        timestamp: Date.now() - (6 * 60 * 60 * 1000),
        likes: 214,
        comments: 13
    },
    {
        id: 2,
        text: "Ayuda creo que me da miedo la gente fea",
        author: "bwe_ahki",
        timestamp: Date.now() - (45 * 60 * 1000),
        likes: 100,
        comments: 10
    },
    {
        id: 3,
        text: "La Omfalofobia es un problema serio, le vi el ombligo a Tini y supe mi condición",
        author: "JoergS",
        timestamp: Date.now() - (7 * 60 * 60 * 1000),
        likes: 70,
        comments: 2
    },
    {
        id: 4,
        text: "Fui a la juntada de Cordoba sobre los pelados y no esperaba que me generara un trauma, busco psicologo",
        author: "satosaison",
        timestamp: Date.now() - (7 * 60 * 60 * 1000),
        likes: 214,
        comments: 13
    },
    {
        id: 5,
        text: "Alguien más con Gefirofobia?",
        author: "IHaeTypos",
        timestamp: Date.now() - (8 * 60 * 60 * 1000),
        likes: 214,
        comments: 13
    },
    {
        id: 6,
        text: "Vivo en Bahia Blanca y creo que desde ahi medio pueblo tiene Uranofobia.",
        author: "ashwin_3beauty",
        timestamp: Date.now() - (8 * 60 * 60 * 1000),
        likes: 214,
        comments: 13,
    },
    {
        id: 7,
        text: "Sabían que existe una fobia a las suegras? Penterafobia, no están locos muchachos",
        author: "randomUser",
        timestamp: Date.now() - (9 * 60 * 60 * 1000),
        likes: 89,
        comments: 25
    }
];

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diff < 60 * 1000) { // Menos de 1 minuto
        return seconds <= 1 ? 'ahora' : `${seconds} segundos`;
    } else if (diff < 60 * 60 * 1000) { // Menos de 1 hora
        return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
    } else if (diff < 24 * 60 * 60 * 1000) { // Menos de 1 día
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

function updateTimeAgoInCards() {
    const postCards = document.querySelectorAll('.post-card');

    postCards.forEach(card => {
        const timestamp = Number(card.dataset.timestamp);
        const timeElement = card.querySelector('.post-time');
        if (timestamp && timeElement) {
            const newTime = formatTimeAgo(timestamp);
            console.log(`Actualizando card ${card.dataset.postId}: ${newTime}`);
            timeElement.textContent = newTime;
        }
    });
}

function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;
    postCard.dataset.timestamp = post.timestamp;
    
    const promotedTag = post.isPromoted ? '<span class="promoted-tag">promoted by</span>' : '';
    
    postCard.innerHTML = `
        <div class="post-content">
            <p class="post-text">${post.text}</p>
            ${promotedTag}
        </div>
        <div class="post-meta">
            <div class="post-info">
                <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
                <span class="post-author">by ${post.author}</span>
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

function addNewPost(postData) {
    const newPost = {
        id: Date.now(),
        text: postData.text,
        author: postData.author || 'anonymous',
        timestamp: Date.now(),
        likes: 0,
        comments: 0
    };
    
    posts.unshift(newPost);
    
    renderPosts();
    
    const postsGrid = document.getElementById('postsGrid');
    if (postsGrid) {
        postsGrid.scrollTop = 0;
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

function setupEventListeners() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.addEventListener('click', (e) => {
        const likesBtn = e.target.closest('.likes-btn');
        const commentsBtn = e.target.closest('.comments-btn');
        
        if (likesBtn) {
            const postId = parseInt(likesBtn.dataset.postId);
            toggleLike(postId);
        }
        
        if (commentsBtn) {
            const postId = parseInt(commentsBtn.dataset.postId);
            console.log(`Abrir comentarios para post ${postId}`);
        }
    });
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
        
        likesBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            likesBtn.style.transform = 'scale(1)';
        }, 150);
        
    } else {
        userLikes.add(postId);
        post.likes += 1;
        likesBtn.classList.add('liked');
        likeIcon.setAttribute('fill', 'currentColor');
        likesBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            likesBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    likesCount.textContent = formatNumber(post.likes);
    
    console.log(`Post ${postId} ${isCurrentlyLiked ? 'unliked' : 'liked'}. Total: ${post.likes}`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando aplicación optimizada...');
    setRandomTitle();
    renderPosts();
    setupEventListeners();
    setupInfiniteScroll();
    setInterval(updateTimeAgoInCards, 60 * 1000);
    console.log('Inicialización completada con optimizaciones');
    console.log(`Posts por página: ${POSTS_PER_PAGE}`);
    console.log(`Posts renderizados inicialmente: ${renderedPosts.size}`);
});