document.addEventListener('DOMContentLoaded', () => {
    const completeProfileForm = document.getElementById('edit-profile-form');
    completeProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(completeProfileForm);

        try {
            // Make first request to the /user/username/edit route
            await fetch(`/user/${formData.get('username')}/edit`, {
                method: 'POST',
                body: JSON.stringify({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    username: formData.get('username'),
                    email: formData.get('email'),
                    dob: formData.get('dob'),
                    location: formData.get('location'),
                    bio: formData.get('bio')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Make second request to the /images/upload route 
            const file = formData.get('image');
            if (file && file.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('image', file);

                await fetch('/images/upload', {
                    method: 'POST',
                    body: imageFormData
                });
            }

            // Redirect to profile page
            window.location.href = `/user/profile`;
        } catch (error) {
            console.error(error);
        }
    });
});