document.addEventListener('DOMContentLoaded', function () {
    const rsvpBtn = document.querySelector('.rsvp-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = rsvpBtn.dataset.eventId;
            const action = rsvpBtn.dataset.action;
            fetch(`/events/${eventId}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    const successMessage = data.successMessage;
                    const errorMessage = data.errorMessage;
                    const messageContainer = document.querySelector('.card-body');

                    // Remove existing alert messages
                    const existingAlerts = messageContainer.querySelectorAll('.alert');
                    existingAlerts.forEach(alert => alert.remove());
                    if (successMessage) {
                        const successAlert = document.createElement('div');
                        successAlert.classList.add('alert', 'alert-success');
                        successAlert.textContent = successMessage;
                        messageContainer.insertBefore(successAlert, messageContainer.firstChild);
                        if (action === 'rsvp') {
                            rsvpBtn.textContent = 'Cancel RSVP';
                            rsvpBtn.classList.add('btn-danger');
                            rsvpBtn.dataset.action = 'cancel';
                        } else {
                            rsvpBtn.textContent = 'RSVP';
                            rsvpBtn.classList.remove('btn-danger');
                            rsvpBtn.classList.add('btn-primary');
                            rsvpBtn.dataset.action = 'rsvp';
                        }
                    } else if (errorMessage) {
                        const errorAlert = document.createElement('div');
                        errorAlert.classList.add('alert', 'alert-danger');
                        errorAlert.textContent = errorMessage;
                        messageContainer.insertBefore(errorAlert, messageContainer.firstChild);
                    }
                })
                .catch(error => console.error(error));
        });
    }
});
