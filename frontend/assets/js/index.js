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
        text: "Vivo en Bahia Blanca y creo que desde ahi medio pueblo tiene Uranofobia",
        author: "ashwin_3beauty",
        timestamp: Date.now() - (8 * 60 * 60 * 1000),
        likes: 214,
        comments: 13,
        isPromoted: true
    },
    {
        id: 7,
        text: "Sabían que existe una fobia a las suegras? Penterafobia, no están locos muchachos",
        author: "randomUser",
        timestamp: Date.now() - (9 * 60 * 60 * 1000),
        likes: 89,
        comments: 25
    },
    {
        id:8,
        text: "Test 12 34 5 6 ",
        author: "randomUser",
        timestamp: Date.now(),
        likes: 100,
        comments: 23
    },
    {
        id:9,
        text: "Test 12 34 5 6 ",
        author: "randomUser",
        timestamp: Date.now(),
        likes: 100,
        comments: 23
    }
];

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        return `${days} days ago`;
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
                        <path d="M7 10v12l4-4 4 4V10M7 10l5-6 5 6M7 10H4a2 2 0 00-2 2v3a2 2 0 002 2h3"/>
                    </svg>
                    <span class="likes-count">${formatNumber(post.likes)}</span>
                </div>
                <div class="stat-item comments-btn" data-post-id="${post.id}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span class="comments-count">${post.comments}</span>
                </div>
            </div>
        </div>
    `;
    
    return postCard;
}

function renderPosts() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) {
        console.error('No se encontró el elemento con id "postsGrid"');
        return;
    }
    
    postsGrid.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = createPostCard(post);
        postsGrid.appendChild(postCard);
    });
    
    console.log(`Se renderizaron ${posts.length} posts`);
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
    const likesBtn = document.querySelector(`[data-post-id="${postId}"].likes-btn`);
    const likesCount = document.querySelector(`[data-post-id="${postId}"] .likes-count`);
    const likeIcon = document.querySelector(`[data-post-id="${postId}"] .like-icon`);
    
    if (!post || !likesBtn || !likesCount || !likeIcon) return;
    
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

// Función de utilidad para testing
function testAddPost() {
    addNewPost({
        text: "Post de prueba desde la consola",
        author: "console_user"
    });
}

// INICIALIZACIÓN - Este es el código que faltaba
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando...');
    
    // Configurar título aleatorio
    setRandomTitle();
    
    // Renderizar posts iniciales
    renderPosts();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('Inicialización completada');
});