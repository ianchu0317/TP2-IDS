const profileImages = {
    avatars: [
        "https://tienda.ximenaclavelli.com/wp-content/uploads/2021/05/carpincho_gordo_feliz.jpg",
        "https://i.pinimg.com/736x/22/ba/9d/22ba9dde2b619be0a6c4609cc5e74c00.jpg",
        "https://sm.ign.com/t/ign_latam/screenshot/default/donkey-looking-up-in-shrek-3_ygqm.1280.jpg",
        "https://cdn.milenio.com/uploads/media/2022/01/15/pitbull-es-originario-de-cuba.jpg",
        "https://pbs.twimg.com/media/EIW55xzXsAAxVRH.jpg:large",
        "../images/avatar.png"
    ],
    headers: [
        "https://i.pinimg.com/1200x/5a/0f/19/5a0f19e56192d5af11740c0687b7362b.jpg",
        "https://i.pinimg.com/736x/71/13/fc/7113fcaceeec72ef46612da32fb2265e.jpg",
        "https://i.pinimg.com/736x/8d/24/28/8d2428b557a076fb3bb23461357ab91f.jpg",
        "https://i.pinimg.com/1200x/12/44/00/1244001b46621d3ea128fbcf2bf706df.jpg",
        "https://i.pinimg.com/1200x/9a/26/f1/9a26f1d7fa00223cd4cf46c601ac52b2.jpg",
        "../images/header.png"
    ]
};

let posts = [];
let currentUser = null;

function safeUpdateElement(selector, content, isImage = false) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element with selector "${selector}" not found`);
        return false;
    }
    
    if (isImage) {
        element.src = content;
    } else {
        element.textContent = content;
    }
    return true;
}

function setupImageErrorHandler(selector, fallbackSrc) {
    const element = document.querySelector(selector);
    if (element) {
        element.onerror = function() {
            this.src = fallbackSrc;
        };
    }
}

function getRandomIndex(username, arrayLength) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash) % arrayLength;
}

function getRandomProfileImages(username) {
    const avatarIndex = getRandomIndex(username + "_avatar", profileImages.avatars.length);
    const headerIndex = getRandomIndex(username + "_header", profileImages.headers.length);
    
    return {
        avatar: profileImages.avatars[avatarIndex],
        header: profileImages.headers[headerIndex]
    };
}


let userLikes = new Set();

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

function createPostElement(post) {
    return createPostCard(post);
}

function createNoPostsElement() {
    const noPostsDiv = document.createElement('div');
    noPostsDiv.className = 'no-posts';
    
    noPostsDiv.innerHTML = `
        <div class="no-posts-content">
            <img src="../assets/images/no-posts.png" alt="No posts" class="no-posts-avatar" onerror="this.src='../assets/images/avatar.png'">
            <h3>No hay posts todavía</h3>
            <p>¡${currentUser?.username || 'El usuario'} aún no ha publicado nada!</p>
            <p>Cuando lo haga, sus posts aparecerán aquí.</p>
        </div>
    `;
    
    return noPostsDiv;
}

function showNoPostsMessage() {
    const postsContainer = document.querySelector('.posts-container');
    
    if (!postsContainer) {
        console.error('No se encontró el contenedor de posts');
        return;
    }
    
    postsContainer.innerHTML = '';
    const noPostsElement = createNoPostsElement();
    postsContainer.appendChild(noPostsElement);
    console.log('Mostrando mensaje de no posts');
}

async function fetchPhobias() {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch('/phobias', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const phobias = await response.json();
        return phobias;
    } catch (error) {
        console.error('Error fetching phobias:', error);
        return [];
    }
}

function loadUserPosts() {
    const userPosts = posts.filter(post => post.creator === currentUser?.username);
    const postsContainer = document.querySelector('.posts-container');
    
    if (!postsContainer) {
        console.error('No se encontró el contenedor de posts');
        return userPosts;
    }
    postsContainer.innerHTML = '';
    if (userPosts.length === 0 || !currentUser) {
        const noPostsElement = createNoPostsElement();
        postsContainer.appendChild(noPostsElement);
        console.log('No hay posts para mostrar');
    } else {
        userPosts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
        console.log(`Mostrando ${userPosts.length} posts del usuario`);
        setupPostEventListeners();
    }
    
    return userPosts;
}

function loadDefaultProfile() {
    document.title = "Perfil / Fobium";
    
    safeUpdateElement('.username', 'usuario');
    safeUpdateElement('.name', 'Nombre del Usuario');
    safeUpdateElement('.email', 'email@ejemplo.com');
    
    safeUpdateElement('.avatar', "../assets/images/avatar.png", true);
    safeUpdateElement('.cover-img', "../assets/images/header.png", true);
    
    setupImageErrorHandler('.avatar', "../assets/images/avatar.png");
    setupImageErrorHandler('.cover-img', "../assets/images/header.png");
    
    showNoPostsMessage();
    
    console.log('Perfil por defecto cargado');
}

function loadProfile() {
    if (!currentUser) {
        console.warn('No hay usuario para cargar, mostrando perfil por defecto');
        loadDefaultProfile();
        return;
    }

    const randomImages = getRandomProfileImages(currentUser.username);
    currentUser.avatarUrl = randomImages.avatar;
    currentUser.coverUrl = randomImages.header;

    document.title = `(@${currentUser.username}) / Fobium`;
    
    safeUpdateElement('.username', currentUser.username);
    safeUpdateElement('.name', currentUser.name || currentUser.username);
    safeUpdateElement('.email', currentUser.email || 'Email no disponible');
    
    safeUpdateElement('.avatar', currentUser.avatarUrl, true);
    safeUpdateElement('.cover-img', currentUser.coverUrl, true);
    
    setupImageErrorHandler('.avatar', "../assets/images/avatar.png");
    setupImageErrorHandler('.cover-img', "../assets/images/header.png");
    
    const userPosts = posts.filter(post => post.creator === currentUser.username);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    
    console.log(`Posts del usuario: ${userPosts.length}`);
    console.log(`Total de likes: ${totalLikes}`);
    
    loadUserPosts();
}

async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch('/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

async function loadProfileFromAPI() {
    try {
        const [userData, phobias] = await Promise.all([
            fetchUserProfile(),
            fetchPhobias()
        ]);
        
        currentUser = userData;
        posts = phobias;
        
        console.log('Datos cargados:', { user: userData, posts: phobias.length });
        loadProfile();
    } catch (error) {
        console.error('Error loading profile from API:', error);
        showErrorMessage('Error al cargar el perfil. Por favor, inténtalo de nuevo.');
        loadDefaultProfile();
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.profile-container') || document.body;
    container.insertBefore(errorDiv, container.firstChild);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function applyRandomImagesToUser(user) {
    const randomImages = getRandomProfileImages(user.username);
    return {
        ...user,
        avatarUrl: randomImages.avatar,
        coverUrl: randomImages.header
    };
}

function initProfile() {
    loadDefaultProfile();
    loadProfileFromAPI();
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatPostDate(date) {
    return date || 'Fecha no disponible';
}

function setupPostEventListeners() {
    document.querySelectorAll('.likes-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = parseInt(this.dataset.postId);
            handleLike(postId);
        });
    });
    
    document.querySelectorAll('.comments-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = parseInt(this.dataset.postId);
            handleComments(postId);
        });
    });
}

function handleLike(postId) {
    console.log(`Intentando dar like al post ${postId}`);
    toggleLike(postId);
}

function handleComments(postId) {
    console.log(`Intentando abrir comentarios para post ${postId}`);
    viewComments(postId);
}


async function toggleLike(postId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/phobias/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const post = posts.find(p => p.id === postId);
            if (post) {
                // Toggle like state
                if (userLikes.has(postId)) {
                    userLikes.delete(postId);
                    post.likes = Math.max(0, post.likes - 1);
                } else {
                    userLikes.add(postId);
                    post.likes += 1;
                }
                const likesCountElement = document.querySelector(`[data-post-id="${postId}"] .likes-count`);
                if (likesCountElement) {
                    likesCountElement.textContent = formatNumber(post.likes);
                }
                
                // Actualizar clase de like
                const likesBtn = document.querySelector(`[data-post-id="${postId}"] .likes-btn`);
                if (likesBtn) {
                    if (userLikes.has(postId)) {
                        likesBtn.classList.add('liked');
                    } else {
                        likesBtn.classList.remove('liked');
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

function viewComments(postId) {
    console.log(`Intentando abrir comentarios para post ${postId}`);
    
    const post = posts.find(p => p.id === postId);
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        alert('Post no encontrado');
        return;
    }
    
    try {
        window.location.href = `comments.html?post=${postId}`;
    } catch (error) {
        console.error('Error al redireccionar a comments.html:', error);
        
        alert(`Comentarios para "${post.phobia_name}"\n\nEsta funcionalidad requiere el archivo comments.html`);
        
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initProfile();
});