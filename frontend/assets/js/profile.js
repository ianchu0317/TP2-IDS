const currentUser = {
    name: "Juan Perez",
    username: "juan_perez",
    avatarUrl: "../assets/images/avatar.png",
    coverUrl: "../assets/images/header.png"
};

function loadProfile() {

    document.title = `${currentUser.name} (@${currentUser.username}) / TuApp`;
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = currentUser.username;
    }
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        nameElement.textContent = currentUser.name;
    }
    
    const avatarElement = document.querySelector('.avatar');
    if (avatarElement && currentUser.avatarUrl) {
        avatarElement.src = currentUser.avatarUrl;
    }
    const coverElement = document.querySelector('.cover-img');
    if (coverElement && currentUser.coverUrl) {
        coverElement.src = currentUser.coverUrl;
    }
    
    const userPosts = posts.filter(post => post.user === currentUser.username);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    
    console.log(`Posts del usuario: ${userPosts.length}`);
    console.log(`Total de likes: ${totalLikes}`);
}

document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
});