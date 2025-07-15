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

const posts = [];
let currentUser = null;


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

function createNoPostsElement() {
    const noPostsDiv = document.createElement('div');
    noPostsDiv.className = 'no-posts';
    
    noPostsDiv.innerHTML = `
        <div class="no-posts-content">
            <img src="../assets/images/no-posts.png" alt="No posts" class="no-posts-avatar" onerror="this.src='../assets/images/avatar.png'">
            <h3>No hay posts todavía</h3>
            <p>¡${currentUser.username} aún no ha publicado nada!</p>
            <p>Cuando lo haga, sus posts aparecerán aquí.</p>
        </div>
    `;
    
    return noPostsDiv;
}

function loadUserPosts() {
    const userPosts = posts.filter(post => post.user === currentUser.username);
    const postsContainer = document.querySelector('.posts-container');
    
    if (!postsContainer) {
        console.error('No se encontró el contenedor de posts');
        return userPosts;
    }
    postsContainer.innerHTML = '';
    
    if (userPosts.length === 0) {
        const noPostsElement = createNoPostsElement();
        postsContainer.appendChild(noPostsElement);
        console.log('No hay posts para mostrar');
    } else {
        const postsMessage = document.createElement('div');
        postsMessage.innerHTML = `<p>El usuario tiene ${userPosts.length} posts</p>`;
        postsContainer.appendChild(postsMessage);
    }
    
    return userPosts;
}

function loadProfile() {

    const randomImages = getRandomProfileImages(currentUser.username);
    currentUser.avatarUrl = randomImages.avatar;
    currentUser.coverUrl = randomImages.header;

    document.title = `(@${currentUser.username}) / Fobium`;
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = currentUser.username;
    }
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        nameElement.textContent = currentUser.name;
    }

    const emailElement = document.querySelector('.email');
    if (emailElement) {
        emailElement.textContent = currentUser.email;
    }
    
    const avatarElement = document.querySelector('.avatar');
    if (avatarElement) {
        avatarElement.src = currentUser.avatarUrl;
        avatarElement.onerror = function() {
            this.src = "../assets/images/avatar.png";
        };
    }

    const phoneElement = document.querySelector('.phone');
    if (phoneElement) {
        phoneElement.textContent = currentUser.phone;
    }

    const dateElement = document.querySelector('.date');
    if (dateElement) {
        dateElement.textContent = new Date(currentUser.date).toLocaleDateString();
    }

    const coverElement = document.querySelector('.cover-img');
    if (coverElement) {
        coverElement.src = currentUser.coverUrl;
        coverElement.onerror = function() {
            this.src = "../assets/images/header.png";
        };
    }
    
    const userPosts = posts.filter(post => post.user === currentUser.username);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    
    console.log(`Posts del usuario: ${userPosts.length}`);
    console.log(`Total de likes: ${totalLikes}`);
    loadUserPosts();
}

function applyRandomImagesToUser(user) {
    const randomImages = getRandomProfileImages(user.username);
    return {
        ...user,
        avatarUrl: randomImages.avatar,
        coverUrl: randomImages.header
    };
}

document.addEventListener('DOMContentLoaded', function() {
    currentUser = {
    "username": "ianchu0317",
    "email": "ianchu0317@gmail.com",
    "phone": 123456,
    "date": "2025-07-07"
    };
    loadProfile();
});