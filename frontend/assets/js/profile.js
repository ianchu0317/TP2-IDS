const currentUser = {
    username: "juan_perez",
    email: "juan.perez@email.com",
    avatarUrl: "https://pbs.twimg.com/media/ERv_whhXYAAw0rH.jpg",
    coverUrl: "https://aem-all.accor.com/content/dam/all/hubs/americas/latam/generic-images/all-magazine/machu-picchu-todo-lo-que-necesitas-saber-antes-de-viajar-2024-1.jpg"
};

function loadProfile() {
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = currentUser.username;
    }
    const emailElement = document.querySelector('.email');
    if (emailElement) {
        emailElement.textContent = currentUser.email;
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

// Al final del archivo, agregar esto:
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
});