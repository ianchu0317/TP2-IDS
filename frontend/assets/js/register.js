document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevenir envío normal del form
        
        // Obtener datos del formulario
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: parseInt(document.getElementById('phone').value),
            password: document.getElementById('password').value
        };

        try {
            // Enviar request a tu API
            const response = await fetch('https://api.fobium.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Usuario registrado exitosamente!');
                // Redirigir al login
                window.location.href = 'login.html';
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