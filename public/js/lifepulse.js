document.addEventListener('DOMContentLoaded', () => {
    const completeProfileForm = document.getElementById('complete-profile-form');
    completeProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(completeProfileForm);

        try {
            // Make first request to the /complete-profile route
            await fetch('/user/complete-profile', {
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
            const imageFormData = new FormData();
            imageFormData.append('image', formData.get('image'));

            await fetch('/images/upload', {
                method: 'POST',
                body: imageFormData
            });

            // Redirect to profile page
            window.location.href = `/user/${formData.get('username')}`;
        } catch (error) {
            console.error(error);
        }
    });
});