document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, togglePassword);
    });
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevenir envío normal del form
        
        // Obtener datos del formulario
        const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            // Enviar request a tu API
            const response = await fetch(`${CONFIG.apiBaseUrl}/login`, {
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
                // Redirigir a la página principal
                window.location.href = '../index.html';
                
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

function togglePasswordVisibility(input, toggleIcon) {
    if (input.type === 'password') {
        input.type = 'text';
        toggleIcon.classList.add('show');
    } else {
        input.type = 'password';
        toggleIcon.classList.remove('show');
    }
}