document.addEventListener('DOMContentLoaded', function () {

    const deleteEventButton = document.querySelector('.delete-event-btn');

    if (deleteEventButton) {
        deleteEventButton.addEventListener('click', () => {
            const eventId = deleteEventButton.dataset.eventId;
            fetch(`/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('messageContainer', '.event-row');
                    const successMessage = {
                        text: data.successMessage,
                        type: 'success'
                    }
                    const errorMessage = {
                        text: data.errorMessage,
                        type: 'error'
                    }
                    if (successMessage.text) {
                        localStorage.setItem('alertMessage', JSON.stringify(successMessage));
                        window.location.href = '/';
                    } else if (errorMessage.text) {
                        localStorage.setItem('alertMessage', JSON.stringify(errorMessage));
                        window.location.reload();
                    }
                })
                .catch(error => console.error(error));
        });
    }

    const editEventButton = document.querySelector('.edit-event-btn');
    if (editEventButton) {
        editEventButton.addEventListener('click', () => {
            const eventId = editEventButton.dataset.eventId;
            window.location.href = `/events/${eventId}/edit`;
        });
    }

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