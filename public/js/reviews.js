document.addEventListener('DOMContentLoaded', function () {
    const reviewBtn = document.querySelector('.add-review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const reviewForm = document.getElementById('add-review-form');
            const reviewHeading = document.getElementById('review-heading');
            reviewHeading.style.display = 'none';
            reviewForm.style.display = 'block';
            reviewBtn.style.display = 'none';
        });
    }

    const cancelReviewBtn = document.querySelector('.cancel-review-btn');
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const reviewForm = document.getElementById('add-review-form');
            const reviewHeading = document.getElementById('review-heading');
            reviewHeading.style.display = 'block';
            reviewForm.style.display = 'none';
            reviewBtn.style.display = 'block';
        });
    }

    const reviewSubmitBtn = document.querySelector('.review-submit-btn');
    if (reviewSubmitBtn) {
        reviewSubmitBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = reviewSubmitBtn.dataset.eventId;
            const reviewRating = document.querySelector('#review-rating').value;
            const reviewContent = document.querySelector('#review-content').value;
            fetch(`/events/${eventId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reviewRating, reviewContent })
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('messageContainer', '.review-card');
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

    const editReviewBtn = document.querySelector('.edit-review-btn');
    const saveReviewBtn = document.querySelector('#save-review-btn');
    const deleteReviewBtn = document.querySelector('#delete-review-btn');
    const cancelEditReviewBtn = document.querySelector('#cancel-edit-review-btn');

    if (editReviewBtn) {
        editReviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const reviewId = event.target.dataset.reviewId;
            const ratingDisplay = document.querySelector(`#review-${reviewId} #rating-display`);
            const reviewDisplay = document.querySelector(`#review-${reviewId} #review-display`);
            const editReviewForm = document.querySelector(`#review-${reviewId} #edit-review-form`);
            const editReviewBtn = document.querySelector(`#review-${reviewId} .edit-review-btn`);
            const saveReviewBtn = document.querySelector(`#review-${reviewId} #save-review-btn`);
            const deleteReviewBtn = document.querySelector(`#review-${reviewId} #delete-review-btn`);
            const ratingInput = document.querySelector(`#review-${reviewId} #rating-input`);
            let rating = ratingInput.getAttribute('data-rating');

            ratingDisplay.style.display = 'none';
            reviewDisplay.style.display = 'none';
            editReviewForm.style.display = 'block';
            editReviewBtn.style.display = 'none';
            saveReviewBtn.style.display = 'block';
            deleteReviewBtn.style.display = 'block';
            ratingInput.value = ratingDisplay.textContent;
            const starElems = document.querySelectorAll('#rating-input .star');
            starElems.forEach((starElem, index) => {
                starElem.addEventListener('click', () => {
                    rating = index + 1;
                    starElems.forEach((starElem, i) => {
                        if (i <= index) {
                            starElem.classList.add('active');
                        } else {
                            starElem.classList.remove('active');
                        }
                    });
                    ratingInput.setAttribute('data-rating', rating);
                });
                starElem.addEventListener('mouseover', () => {
                    starElems.forEach((starElem, i) => {
                        if (i <= index) {
                            starElem.classList.add('active');
                        } else {
                            starElem.classList.remove('active');
                        }
                    });
                });
                starElem.addEventListener('mouseleave', () => {
                    starElems.forEach((starElem, i) => {
                        if (i < rating) {
                            starElem.classList.add('active');
                        } else {
                            starElem.classList.remove('active');
                        }
                    });
                });
            });
        });
    }

    if (saveReviewBtn) {
        saveReviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = window.location.pathname.split('/')[2];
            const reviewId = event.target.dataset.reviewId;
            const ratingInput = document.querySelector(`#review-${reviewId} #rating-input`);
            const reviewRating = ratingInput.getAttribute('data-rating');
            const reviewContent = document.querySelector(`#review-${reviewId} #edit-review-textarea`).value;
            fetch(`/events/${eventId}/review/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reviewRating, reviewContent })
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('messageContainer', `#review-${reviewId}`);
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

    if (deleteReviewBtn) {
        deleteReviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = window.location.pathname.split('/')[2];
            const reviewId = deleteReviewBtn.dataset.reviewId;
            fetch(`/events/${eventId}/review/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('messageContainer', '.review-card');
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

    if (cancelEditReviewBtn) {
        cancelEditReviewBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const reviewId = event.target.dataset.reviewId;
            const ratingDisplay = document.querySelector(`#review-${reviewId} #rating-display`);
            const reviewDisplay = document.querySelector(`#review-${reviewId} #review-display`);
            const editReviewForm = document.querySelector(`#review-${reviewId} #edit-review-form`);
            const editReviewBtn = document.querySelector(`#review-${reviewId} .edit-review-btn`);
            const saveReviewBtn = document.querySelector(`#review-${reviewId} #save-review-btn`);
            const deleteReviewBtn = document.querySelector(`#review-${reviewId} #delete-review-btn`);
            ratingDisplay.style.display = 'block';
            reviewDisplay.style.display = 'block';
            editReviewForm.style.display = 'none';
            editReviewBtn.style.display = 'block';
            saveReviewBtn.style.display = 'none';
            deleteReviewBtn.style.display = 'none';
        });
    }
});