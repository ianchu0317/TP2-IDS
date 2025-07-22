document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotForm');

    forgotForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!username || !email || !phone) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }

        try {
            const response = await fetch('https://api.fobium.com/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    phone: phone
                })
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                localStorage.setItem('resetData', JSON.stringify({
                    username: username,
                    email: email,
                    phone: phone
                }));
                window.location.href = 'reset-password.html';
            } else {
                showMessage(data.detail || 'Los datos no coinciden con ningún usuario registrado', 'error');
            }
        } catch (error) {
            console.error('Error completo:', error);
            showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        }
    });
});

function showMessage(message, type) {
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = type === 'error' ? 'error-message' : 'success-message';
    messageElement.textContent = message;

    const form = document.getElementById('forgotForm');
    const button = form.querySelector('.btn');
    form.insertBefore(messageElement, button);

    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}