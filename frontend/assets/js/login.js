document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevenir envío normal del form
        
        // Obtener datos del formulario
        const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            // Enviar request a tu API
            const response = await fetch('https://api.fobium.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                
                // Guardar el token en localStorage
                localStorage.setItem('access_token', result.access_token.token);
                
                alert('Login exitoso!');
                // Redirigir al dashboard o página principal
                window.location.href = '../index.html'; // o la página que quieras
                
            } else {
                const error = await response.json();
                alert('Error: ' + error.detail);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });
});