document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.querySelector('#eventDate');
    const now = new Date();
    const getCurrentDate = () => {
        const year = now.getFullYear();
        const month = (`0${now.getMonth() + 1}`).slice(-2);
        const day = (`0${now.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const currentDate = getCurrentDate();

    dateInput.setAttribute('min', currentDate);

    dateInput.addEventListener('change', (event) => {
        const selectedDate = new Date(event.target.value);

        if (selectedDate < now) {
            alert('Please select a future date');
            event.target.value = currentDate;
        }
    });

    const eventEditSubmitBtn = document.querySelector('.event-edit-submit-btn');
    const eventEditForm = document.querySelector('#edit-event-form');
    if (eventEditSubmitBtn) {
        eventEditSubmitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const formData = new FormData(eventEditForm);
            const selectedCategories = formData.getAll('eventCategory[]');
            const eventId = window.location.pathname.split('/')[2];
            const eventTitle = document.querySelector('#eventTitle').value;
            const eventDate = document.querySelector('#eventDate').value;
            const eventLocation = document.querySelector('#eventLocation').value;
            const eventDescription = document.querySelector('#eventDescription').value;
            formData.append('eventTitle', eventTitle);
            formData.append('eventDate', eventDate);
            formData.append('eventLocation', eventLocation);
            formData.append('eventDescription', eventDescription);
            formData.append('eventTime', eventTime);
            formData.append('eventDuration', eventDuration);
            formData.append('eventMaxCapacity', eventMaxCapacity);
            formData.append('selectedCategories', selectedCategories);
            fetch(`/events/${eventId}/edit`, {
                method: 'PUT',
                body: JSON.stringify({
                    eventTitle: formData.get('eventTitle'),
                    eventDescription: formData.get('eventDescription'),
                    eventLocation: formData.get('eventLocation'),
                    eventDate: formData.get('eventDate'),
                    eventTime: formData.get('eventTime'),
                    eventDuration: formData.get('eventDuration'),
                    eventCategory: selectedCategories,
                    eventMaxCapacity: formData.get('eventMaxCapacity'),
                }),
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
                        window.location.href = `/events/${eventId}`;
                    } else if (errorMessage.text) {
                        localStorage.setItem('alertMessage', JSON.stringify(errorMessage));
                        window.location.reload();
                    }
                })
                .catch(error => console.error(error));
        });
    }
});