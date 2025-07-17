const titles = [
    "Top de tops. Sin lugar para los débiles",
    "Los más likeados. El Olimpo de las fobias",
    "Camino al podio de la paranoia",
    "Ranking: porque tus fobias también compiten",
    "Las joyas de la comunidad. Brillan más que tu ansiedad"
];

function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
}

function setRandomTitle() {
    const titleElement = document.getElementById('Title');
    if (titleElement) {
        const randomPhrase = getRandomPhrase();
        titleElement.textContent = randomPhrase;
        console.log("Título actualizado con:", randomPhrase);
    }
}

function createPostCard(post, ranking) {
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
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const postId = this.dataset.id;
            handleShare(postId);
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
        // Like
        button.classList.add('liked');
        likeCount.textContent = currentLikes + 1;
    }
}


function handleComment(postId) {
    console.log(`Comentar en post ${postId}`);
}


function handleShare(postId) {
    console.log(`Compartir post ${postId}`);
    if (navigator.share) {
        navigator.share({
            title: 'Post interesante',
            text: 'Mira este post sobre fobias',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
    }
}

async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error al cargar posts:', error);
        document.getElementById('rankingContainer').innerHTML = 
            '<div class="error">Error al cargar los posts</div>';
    }
}


function loadSamplePosts() {
    const samplePosts = [
        {
            "id": 5,
            "phobia_name": "fobias",
            "description": "testing",
            "creator": "skibidi",
            "likes": 7,
            "date": "2025-07-07"
        },
        {
            "id": 6,
            "phobia_name": "fobias",
            "description": "testing",
            "creator": "skibidi",
            "likes": 0,
            "comments": 0,
            "date": "2025-07-07"
        }
    ];
    
    renderPosts(samplePosts);
}


document.addEventListener('DOMContentLoaded', function() {
    setRandomTitle();
    loadSamplePosts();
});
window.renderPosts = renderPosts;
window.loadPosts = loadPosts;