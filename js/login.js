const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

async function login(event) {
  event.preventDefault();

  // Get the login credentials from the form
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value;

  try {
    // Send login credentials to the API
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();

    // Check if login was successful
    if (!response.ok || !data.token) {
      throw new Error(data.message || 'Kirjautuminen epäonnistui.');
    }

    // Store the authentication token
    sessionStorage.setItem('token', data.token);

    // Redirect to the dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    loginMessage.textContent = error.message;
  }
}

loginForm.addEventListener('submit', login);
