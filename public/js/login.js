document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordBtn = document.querySelector('.toggle-password');

    const passwordInput = document.querySelector('#password');

    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});
