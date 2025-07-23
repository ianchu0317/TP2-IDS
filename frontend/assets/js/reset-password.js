document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const resetData = localStorage.getItem('resetData');
    if (!resetData) {
        window.location.href = 'forgot-password.html';
        return;
    }

    const userData = JSON.parse(resetData);
    document.getElementById('displayUsername').textContent = userData.username;
    document.getElementById('displayEmail').textContent = userData.email;

    togglePassword1.addEventListener('click', function() {
        togglePasswordVisibility(newPasswordInput, togglePassword1);
    });

    togglePassword2.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, togglePassword2);
    });

    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!newPassword || !confirmPassword) {
            showMessage('Por favor, completa ambos campos de contraseña', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        const submitBtn = resetForm.querySelector('.btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cambiando...';

        try {
            const response = await fetch('https://api.fobium.com/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    phone: userData.phone,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Contraseña cambiada exitosamente. Redirigiendo al login...', 'success');
                
                localStorage.removeItem('resetData');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(data.detail || 'Error al cambiar la contraseña', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Cambiar Contraseña';
            }
        } catch (error) {
            showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Cambiar Contraseña';
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

function showMessage(message, type) {
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = type === 'error' ? 'error-message' : 'success-message';
    messageElement.textContent = message;

    const form = document.getElementById('resetForm');
    const button = form.querySelector('.btn');
    form.insertBefore(messageElement, button);

    if (type === 'error') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}