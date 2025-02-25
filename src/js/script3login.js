document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();  // ป้องกันการโหลดหน้าใหม่

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Login successful') {
            window.location.href = 'http://127.0.0.1:5500/src/profile.html'; 
        } else {
            document.getElementById('error-message').textContent = data;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred';
    });
});
