const postData = {
    id: 3,
    content: "No puedo con la gente con nariz grande. Ya lo dije. Me dan ansiedad. No es personal, es nasal.",
    author: "AnonUser",
    timestamp: Date.now() - (4 * 60 * 60 * 1000)
};

const commentsData = [
    {
        id: 1,
        comment: "Acabo de entrar al post y ya me siento atacado 😭",
        creator: "CringePolicía",
        creator_id: 1,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 2,
        comment: "Bro eso no es fobia, eso es superficialidad nivel final boss.",
        creator: "ToontoPolarBear",
        creator_id: 2,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 3,
        comment: "Entonces no veas mi foto de perfil, por tu bien.",
        creator: "DarwinTeMira",
        creator_id: 3,
        phobia_id: 3,
        date: "2025-07-14"
    },
    {
        id: 4,
        comment: "¿Y qué hacés cuando te ves al espejo recién levantadx? ¿Entrás en pánico?",
        creator: "NarizDePayaso",
        creator_id: 4,
        phobia_id: 3,
        date: "2025-07-14"
    }
];

function getCommentsByPostId(postId) {
    return commentsData.filter(comment => comment.phobia_id === postId);
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        return `hace ${diffHours}h`;
    } else {
        return date.toLocaleDateString('es-ES');
    }
}

function dateToTimestamp(dateString) {
    return new Date(dateString).getTime();
}

function sortComments(comments, sortBy = 'newest') {
    const sortedComments = [...comments];

    switch(sortBy) {
        case 'newest':
            return sortedComments.sort((a, b) => dateToTimestamp(b.date) - dateToTimestamp(a.date));
        case 'oldest':
            return sortedComments.sort((a, b) => dateToTimestamp(a.date) - dateToTimestamp(b.date));
        case 'top':
            return sortedComments.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        default:
            return sortedComments.sort((a, b) => dateToTimestamp(b.date) - dateToTimestamp(a.date));
    }
}

function renderPost() {
    const postCard = document.getElementById('post-card');
    if (!postCard) {
        console.error('post-card element not found');
        return;
    }

    const timeAgo = formatTimestamp(postData.timestamp);
    document.title = `${postData.author} en Fobium: "${postData.content}"`;

    postCard.innerHTML = `
        <div class="post-meta">
            <span class="post-author">${postData.author}</span> · 
            <span class="post-time">${timeAgo}</span>
        </div>
        <div class="post">
            <p class="post-content">${postData.content}</p>
        </div>
    `;
}

function processTextWithLinks(text) {
    return text.replace(/\n/g, '<br>');
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const commentTextHtml = processTextWithLinks(comment.comment);
    
    commentDiv.innerHTML = `
        <div class="comment-content">
            <div class="comment-comment">${commentTextHtml}</div>
            <div class="comment-meta">
                <a href="#" class="comment-author">${comment.creator}</a>
                <span class="comment-time">${comment.date}</span>
            </div>
        </div>
    `;
    return commentDiv;
}

function renderComments() {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    const filterSelect = document.getElementById('filter-select');
    
    if (!commentsList) {
        console.error('comments-list element not found');
        return;
    }

    const filterValue = filterSelect ? filterSelect.value : "all";

    commentsList.innerHTML = '';
    let postComments = getCommentsByPostId(postData.id);
    let sortedComments = sortComments(postComments, 'newest');
    
    if (filterValue !== "all") {
        sortedComments = sortedComments.slice(0, parseInt(filterValue, 10));
    }

    if (commentsCount) {
        commentsCount.textContent = `${sortedComments.length} comentarios`;
    }

    sortedComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function handleFilterChange() {
    renderComments();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Verificar que los elementos existen
    const postCard = document.getElementById('post-card');
    const commentsList = document.getElementById('comments-list');
    const filterSelect = document.getElementById('filter-select');
    
    if (!postCard) {
        console.error('Element post-card not found');
        return;
    }
    
    if (!commentsList) {
        console.error('Element comments-list not found');
        return;
    }
    
    if (filterSelect) {
        filterSelect.value = "all";
        filterSelect.addEventListener('change', renderComments);
    }

    renderPost();
    renderComments();
    
    console.log('Comments data:', commentsData);
    console.log('Initialization complete');
});