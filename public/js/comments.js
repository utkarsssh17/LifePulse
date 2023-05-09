document.addEventListener('DOMContentLoaded', function () {
    const commentBtn = document.querySelector('.add-comment-btn');
    if (commentBtn) {
        commentBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const commentForm = document.getElementById('add-comment-form');
            const commentHeading = document.getElementById('comment-heading');
            commentHeading.style.display = 'none';
            commentForm.style.display = 'block';
            commentBtn.style.display = 'none';
        });
    }
    const cancelCommentBtn = document.querySelector('.cancel-comment-btn');
    if (cancelCommentBtn) {
        cancelCommentBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const commentForm = document.getElementById('add-comment-form');
            const commentHeading = document.getElementById('comment-heading');
            commentHeading.style.display = 'block';
            commentForm.style.display = 'none';
            commentBtn.style.display = 'block';
        });
    }

    const commentSubmitBtn = document.querySelector('.comment-submit-btn');
    if (commentSubmitBtn) {
        commentSubmitBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const eventId = commentSubmitBtn.dataset.eventId;
            const commentText = document.querySelector('#comment-content').value;
            fetch(`/events/${eventId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentText })
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('messageContainer', '.comment-card');
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

    const editCommentBtns = document.querySelectorAll('#edit-comment-btn');
    const saveCommentBtns = document.querySelectorAll('#save-comment-btn');
    const deleteCommentBtns = document.querySelectorAll('#delete-comment-btn');
    const cancelEditCommentBtns = document.querySelectorAll('#cancel-edit-comment-btn');

    if (editCommentBtns) {
        editCommentBtns.forEach(editCommentBtn => {
            editCommentBtn.addEventListener('click', function (event) {
                event.preventDefault();
                const commentId = event.target.dataset.commentId;
                const commentDisplay = document.querySelector(`#comment-${commentId} #comment-display`);
                const editCommentForm = document.querySelector(`#comment-${commentId} #edit-comment-form`);
                const editCommentBtn = document.querySelector(`#comment-${commentId} #edit-comment-btn`);
                const saveCommentBtn = document.querySelector(`#comment-${commentId} #save-comment-btn`);
                const deleteCommentBtn = document.querySelector(`#comment-${commentId} #delete-comment-btn`);
                const cancelEditCommentBtn = document.querySelector(`#comment-${commentId} #cancel-edit-comment-btn`);
                commentDisplay.style.display = 'none';
                editCommentForm.style.display = 'block';
                editCommentBtn.style.display = 'none';
                saveCommentBtn.style.display = 'block';
                deleteCommentBtn.style.display = 'block';
                cancelEditCommentBtn.style.display = 'block';
            });
        });
    }

    if (cancelEditCommentBtns) {
        cancelEditCommentBtns.forEach(cancelEditCommentBtn => {
            cancelEditCommentBtn.addEventListener('click', function (event) {
                event.preventDefault();
                const commentId = event.target.dataset.commentId;
                const commentDisplay = document.querySelector(`#comment-${commentId} #comment-display`);
                const editCommentForm = document.querySelector(`#comment-${commentId} #edit-comment-form`);
                const editCommentBtn = document.querySelector(`#comment-${commentId} #edit-comment-btn`);
                const saveCommentBtn = document.querySelector(`#comment-${commentId} #save-comment-btn`);
                const deleteCommentBtn = document.querySelector(`#comment-${commentId} #delete-comment-btn`);
                commentDisplay.style.display = 'block';
                editCommentForm.style.display = 'none';
                editCommentBtn.style.display = 'block';
                saveCommentBtn.style.display = 'none';
                deleteCommentBtn.style.display = 'none';
                cancelEditCommentBtn.style.display = 'none';
            });
        });
    }

    if (saveCommentBtns) {
        saveCommentBtns.forEach(saveCommentBtn => {
            saveCommentBtn.addEventListener('click', function (event) {
                event.preventDefault();
                const eventId = window.location.pathname.split('/')[2];
                const commentId = event.target.dataset.commentId;
                const commentText = document.querySelector(`#comment-${commentId} #edit-comment-textarea`).value;
                fetch(`/events/${eventId}/comment/${commentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ commentText })
                })
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem('messageContainer', `#comment-${commentId}`);
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
        })
    }

    if (deleteCommentBtns) {
        deleteCommentBtns.forEach(deleteCommentBtn => {
            deleteCommentBtn.addEventListener('click', function (event) {
                event.preventDefault();
                const eventId = window.location.pathname.split('/')[2];
                const commentId = event.target.dataset.commentId;
                fetch(`/events/${eventId}/comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem('messageContainer', '.comment-card');
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
        })
    }
});
