// verificar token usuario
function checkLogin() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Debes iniciar sesión para crear un post');
        window.location.href = 'login.html';
        return false;
    }
    return token;
}

//  verificar login cuando carga pagina
document.addEventListener('DOMContentLoaded', function() {
    if (!checkLogin()) {
        return;
    }
    
    const form = document.getElementById('createPostForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const token = localStorage.getItem('access_token');
        const phobiaName = document.getElementById('phobia_name').value;
        const description = document.getElementById('description').value;
        
        const postData = {
            phobia_name: phobiaName,
            description: description
        };
        
        try {
            const response = await fetch('https://api.fobium.com/phobias', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            
            if (response.ok) {
                alert('Post creado exitosamente!');
                window.location.href = 'profile.html';
            } else {
                alert('Error al crear el post');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
});