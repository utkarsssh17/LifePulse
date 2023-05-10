document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', () => {
        const containerName = localStorage.getItem('messageContainer');
        const container = document.querySelector(containerName);
        const alertMessage = JSON.parse(localStorage.getItem('alertMessage'));
        if (!container) return;
        if (!alertMessage) return;
        const alert = document.createElement('div');
        alert.classList.add('alert');
        if (alertMessage.type === 'success') {
            alert.classList.add('alert-success');
        } else if (alertMessage.type === 'error') {
            alert.classList.add('alert-danger');
        }
        alert.textContent = alertMessage.text;
        container.insertBefore(alert, container.firstChild);
        localStorage.removeItem('messageContainer');
        localStorage.removeItem('alertMessage');
    });
});