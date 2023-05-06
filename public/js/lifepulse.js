function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function togglePassword() {
    const passwordInput = document.querySelector('#password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const icon = document.querySelector('.toggle-password i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

document.addEventListener('DOMContentLoaded', () => {
    const dateElements = document.querySelectorAll('.date');
    // Convert date to local date string
    dateElements.forEach((dateElement) => {
        const date = new Date(dateElement.textContent);
        const formattedDate = formatDate(date);
        dateElement.textContent = formattedDate;
    });
});


