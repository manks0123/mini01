// Simple login validation
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const validUsername = "admin";
    const validPassword = "123456";

    if (username === validUsername && password === validPassword) {
        alert('Login successful!');

        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
});
