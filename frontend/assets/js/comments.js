const commentsData = [
    {
        id: 1,
        text: "Acabo de entrar al post y ya me siento atacado 😭",
        author: "CringePolicía",
        timeAgo: "3 hours ago",
        timestamp: Date.now() - (3 * 60 * 60 * 1000),
        links: []
    },
    {
        id: 2,
        text: "Bro eso no es fobia, eso es superficialidad nivel final boss.",
        author: "ToontoPolarBear",
        timeAgo: "3 hours ago",
        timestamp: Date.now() - (3 * 60 * 60 * 1000),
        links: []
    },
    {
        id: 3,
        text: "Entonces no veas mi foto de perfil, por tu bien.",
        author: "DarwinTeMira",
        timeAgo: "2 hours ago",
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        links: []
    },
    {
        id: 4,
        text: "¿Y qué hacés cuando te ves al espejo recién levantadx? ¿Entrás en pánico?",
        author: "NarizDePayaso",
        timeAgo: "2 hours ago",
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        links: []
    },
    {
        id: 5,
        text: "¡Alerta! Post que se va a arrepentir en 3... 2... 1...",
        author: "PsicoLicenciadoEnYouTube",
        timeAgo: "2 hours ago",
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        links: []
    },
    {
        id: 6,
        text: "La belleza es subjetiva, pero tu comentario es objetivamente un llamado de atención.",
        author: "ShrekFanPage",
        timeAgo: "2 hours ago",
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        links: ["https://ar.pinterest.com/pin/290693350965105609/"]
    },
    {
        id: 7,
        text: "A mí me pasa pero con la gente que no entiende memes. Cuestión de prioridades.",
        author: "CriterioEstéticoViciado",
        timeAgo: "2 hours ago",
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        links: []
    }
];

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

function sortComments(comments, sortBy = 'newest') {
    const sortedComments = [...comments];

    switch(sortBy) {
        case 'newest':
            return sortedComments.sort((a, b) => b.timestamp - a.timestamp);
        case 'oldest':
            return sortedComments.sort((a, b) => a.timestamp - b.timestamp);
        case 'top':
            return sortedComments.sort((a, b) => b.votes - a.votes);
        default:
            return sortedComments.sort((a, b) => b.timestamp - a.timestamp);
    }
}

function formatVotes(votes) {
    if (votes >= 1000) {
        return (votes / 1000).toFixed(1) + 'k';
    }
    return votes.toString();
}

function handleVote(commentId, isUpvote) {
    const comment = commentsData.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.userVoted) {
        comment.votes -= 1;
        comment.userVoted = false;
    } else {
        comment.votes += 1;
        comment.userVoted = true;
    }

    renderComments();
}

function processTextWithLinks(text) {
    return text.replace(/\n/g, '<br>');
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const commentTextHtml = processTextWithLinks(comment.text);
    let linksHtml = '';
    if (comment.links && comment.links.length > 0) {
        linksHtml = comment.links.map(link =>
            `<a href="${link}" class="comment-link" target="_blank">${link}</a>`
        ).join('');
    }
    commentDiv.innerHTML = `
        <div class="comment-content">
            <div class="comment-text">${commentTextHtml}</div>
            ${linksHtml}
            <div class="comment-meta">
                <a href="#" class="comment-author">${comment.author}</a>
                <span class="comment-time">${comment.timeAgo}</span>
            </div>
        </div>
    `;
    return commentDiv;
}

function renderComments() {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    const filterSelect = document.getElementById('filter-select');
    const filterValue = filterSelect ? filterSelect.value : "all";

    commentsList.innerHTML = '';
    let sortedComments = [...commentsData].sort((a, b) => b.timestamp - a.timestamp);
    if (filterValue !== "all") {
        sortedComments = sortedComments.slice(0, parseInt(filterValue, 10));
    }

    commentsCount.textContent = `${sortedComments.length} comments`;
    sortedComments.forEach(comment => {
        comment.timeAgo = getTimeAgo(comment.timestamp);
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function handleFilterChange() {
    renderComments();
}

document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
        filterSelect.value = "all";
        filterSelect.addEventListener('change', handleFilterChange);
    }
    renderComments();
});