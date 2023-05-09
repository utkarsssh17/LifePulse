document.addEventListener('DOMContentLoaded', function () {

    const rsvpBtn = document.querySelector('.rsvp-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = rsvpBtn.dataset.eventId;
            fetch(`/events/${eventId}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {

                    localStorage.setItem('messageContainer', '.card-body');
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
                        window.location.reload();
                    } else if (errorMessage.text) {
                        localStorage.setItem('alertMessage', JSON.stringify(errorMessage));
                        window.location.reload();
                    }
                })
                .catch(error => console.error(error));
        });
    }
});