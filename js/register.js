const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const registerForm = document.querySelector('#register-form');
const registerMessage = document.querySelector('#register-message');

async function register(event) {
  event.preventDefault();

  registerMessage.textContent = '';
  registerMessage.classList.remove('success');

  // Get the registration details from the form
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;

  try {
    // Send registration details to the API
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, email, password}),
    });

    const data = await response.json();

    // Check if registration was successful
    if (!response.ok || !data.data) {
      throw new Error(data.message || 'Rekisteröinti epäonnistui.');
    }

    // Clear the form and display success message
    registerForm.reset();
    registerMessage.classList.add('success');
    registerMessage.textContent = 'Rekisteröinti onnistui!';
  } catch (error) {
    registerMessage.textContent = error.message;
  }
}

registerForm.addEventListener('submit', register);
