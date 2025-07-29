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
let userLikes = new Set();

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return 'Fecha no disponible';
    
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return dateString;
    }
}

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

function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;
    
    const isLiked = userLikes.has(post.id);
    const likeClass = isLiked ? 'liked' : '';
    
    postCard.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${post.phobia_name || post.title || 'Fobia sin nombre'}</h3>
        </div>
        <div class="post-description">
            <p class="post-text">${post.description || 'Sin descripción'}</p>
        </div>
        <div class="post-footer">
            <div class="post-meta-info">
                <span class="post-author">${post.creator || post.author || currentUser?.username}</span>
                <span class="post-date">${formatDate(post.date || post.created_at)}</span>
            </div>
            <div class="post-actions">
                <div class="action-item likes-btn ${likeClass}" data-post-id="${post.id}">
                    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 14l5-5 5 5"/>
                    </svg>
                    <span class="action-count">${formatNumber(post.likes || 0)}</span>
                </div>
                <div class="action-item comments-btn" data-post-id="${post.id}">
                    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span class="action-count">${post.comments || 0}</span>
                </div>
            </div>
        </div>
    `;
    
    return postCard;
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

function showErrorMessage(message) {
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

function setupPostEventListeners() {
    document.querySelectorAll('.likes-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            toggleLike(postId);
        });
    });
    document.querySelectorAll('.comments-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            handleComments(postId);
        });
    });
}

function toggleLike(postId) {
    const likeBtn = document.querySelector(`[data-post-id="${postId}"].likes-btn`);
    const likesCount = likeBtn.querySelector('.action-count');
    
    if (userLikes.has(postId)) {
        userLikes.delete(postId);
        likeBtn.classList.remove('liked');
        const currentCount = parseInt(likesCount.textContent) || 0;
        likesCount.textContent = formatNumber(Math.max(0, currentCount - 1));
    } else {
        userLikes.add(postId);
        likeBtn.classList.add('liked');
        const currentCount = parseInt(likesCount.textContent) || 0;
        likesCount.textContent = formatNumber(currentCount + 1);
    }
}

function handleComments(postId) {
    console.log(`Intentando abrir comentarios para post ${postId}`);
    
    const post = posts.find(p => p.id.toString() === postId.toString());
    if (!post) {
        console.error(`Post con ID ${postId} no encontrado`);
        alert('Post no encontrado. Tal vez lo soñaste, tal vez fue real. Nunca lo sabremos');
        return;
    }
    
    try {
        console.log(`../comments.html?post=${encodeURIComponent(postId)}`);
        window.location.href = `../../pages/comments.html?post=${encodeURIComponent(postId)}`;
    } catch (error) {
        console.error('Error al redireccionar a comments.html:', error);
    }
}

function loadUserPosts() {
    console.log('loadUserPosts called');
    console.log('Current posts:', posts);
    console.log('Current user:', currentUser);
    
    const postsContainer = document.querySelector('.posts-container');
    
    if (!postsContainer) {
        console.error('No se encontró el contenedor de posts');
        return [];
    }
    
    postsContainer.innerHTML = '';
    
    let userPosts = [];
    if (posts && posts.length > 0) {
        if (currentUser && currentUser.username) {
            userPosts = posts.filter(post => 
                post.creator === currentUser.username || 
                post.author === currentUser.username ||
                post.user_id === currentUser.id
            );
        } else {
            userPosts = posts;
        }
    }
    
    console.log(`Posts filtrados: ${userPosts.length}`);
    
    if (userPosts.length === 0) {
        const noPostsElement = createNoPostsElement();
        postsContainer.appendChild(noPostsElement);
        console.log('No hay posts para mostrar');
    } else {
        userPosts.forEach((post, index) => {
            console.log(`Creando post ${index + 1}:`, post);
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
    
    safeUpdateElement('#user-username', 'usuario');
    safeUpdateElement('#user-email', 'email@ejemplo.com');
    
    safeUpdateElement('#avatar', "../assets/images/avatar.png", true);
    safeUpdateElement('#cover-img', "../assets/images/header.png", true);
    
    setupImageErrorHandler('#avatar', "../assets/images/avatar.png");
    setupImageErrorHandler('#cover-img', "../assets/images/header.png");
    
    showNoPostsMessage();
    
    console.log('Perfil por defecto cargado');
}

function loadProfile() {
    console.log('loadProfile called with user:', currentUser);
    
    if (!currentUser) {
        console.warn('No hay usuario para cargar, mostrando perfil por defecto');
        loadDefaultProfile();
        return;
    }

    const randomImages = getRandomProfileImages(currentUser.username);
    currentUser.avatarUrl = randomImages.avatar;
    currentUser.coverUrl = randomImages.header;

    document.title = `(@${currentUser.username}) / Fobium`;
    
    safeUpdateElement('#user-username', currentUser.username);
    safeUpdateElement('#user-email', currentUser.email || 'Email no disponible');
    
    safeUpdateElement('#avatar', currentUser.avatarUrl, true);
    safeUpdateElement('#cover-img', currentUser.coverUrl, true);
    
    setupImageErrorHandler('#avatar', "../assets/images/avatar.png");
    setupImageErrorHandler('#cover-img', "../assets/images/header.png");
    
    loadUserPosts();
}

function checkAuthentication() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        console.log('No token found, redirecting to login');
        alert('¿Perfil? Sin login sos solo un ente navegando sin propósito.');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('Token found:', token.substring(0, 20) + '...');
    return token;
}

function handleAuthError(response) {
    if (response.status === 401) {
        alert('Tu sesión tuvo un ataque de pánico y se fue. Iniciá sesión otra vez, con calma.');
        localStorage.removeItem('access_token');
        window.location.href = 'login.html';
        return true;
    }
    return false;
}

async function fetchUserProfile() {
    try {
        const token = checkAuthentication();
        if (!token) return null;
        
        console.log('Fetching user profile...');
        
        const response = await fetch(`${CONFIG.apiBaseUrl}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Profile response status:', response.status);
        
        if (!response.ok) {
            if (handleAuthError(response)) return null;
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('User data received:', userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

async function fetchUserPhobias() {
    try {
        const token = checkAuthentication();
        if (!token) return [];
        
        console.log('Fetching user phobias...');
        
        const response = await fetch(`${CONFIG.apiBaseUrl}/profile/phobias`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Phobias response status:', response.status);
        
        if (!response.ok) {
            if (handleAuthError(response)) return [];
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const phobias = await response.json();
        console.log('Phobias data received:', phobias);
        return phobias;
    } catch (error) {
        console.error('Error fetching user phobias:', error);
        return [];
    }
}

async function loadProfileFromAPI() {
    try {
        console.log('Starting loadProfileFromAPI...');
        
        if (!checkAuthentication()) {
            return;
        }
        
        const [userData, phobias] = await Promise.all([
            fetchUserProfile(),
            fetchUserPhobias()
        ]);
        
        console.log('API responses received:', { userData, phobias });
        
        if (!userData) {
            console.log('No user data, loading default profile');
            loadDefaultProfile();
            return;
        }
        
        currentUser = userData;
        posts = phobias || [];
        
        console.log('Data loaded successfully:', { 
            user: userData, 
            postsCount: posts.length,
            posts: posts 
        });
        
        loadProfile();
    } catch (error) {
        console.error('Error loading profile from API:', error);
        showErrorMessage('Error al cargar el perfil. Por favor, inténtalo de nuevo.');
        loadDefaultProfile();
    }
}

function initProfile() {
    console.log('Initializing profile...');
    
    if (!checkAuthentication()) {
        return;
    }
    
    loadDefaultProfile();
    loadProfileFromAPI();
}

function logout() {
    localStorage.removeItem('access_token');
    alert('Sesión cerrada con éxito. Tu yo digital está en modo fetal.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting profile initialization...');
    
    if (checkAuthentication()) {
        initProfile();
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});