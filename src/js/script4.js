// script.js
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        document.getElementById('error-message').textContent = 'All fields are required!';
        return;
    }

    fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'http://127.0.0.1:5500/src/login';
        } else {
            document.getElementById('error-message').textContent = 'Registration failed. Please try again.';
        }
    })
    .catch(error => {
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
        console.error('Error:', error);
    });
});
