const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const profileForm = document.querySelector('#profile-form');
const profileMessage = document.querySelector('#profile-message');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');

// Get the current users profile information
async function getProfile() {
  const token = sessionStorage.getItem('token');

  // Redirect to login if no token is found
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/users/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Käyttäjätietojen hakeminen epäonnistui.');
    }

    const user = await response.json();
    usernameInput.value = user.username;
    emailInput.value = user.email;
  } catch (error) {
    profileMessage.textContent = error.message;
  }
}

// Update the users profile information
async function updateProfile(event) {
  event.preventDefault();

  const token = sessionStorage.getItem('token');

  // Get the updated information from the form
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();

  try {
    // Send updated inforation to the API
    const response = await fetch(`${apiUrl}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({username, email}),
    });

    const data = await response.json();

    // Check if the update was successful
    if (!response.ok) {
      throw new Error(data.message || 'Tietojen päivitys epäonnistui.');
    }

    profileMessage.textContent = 'Tiedot päivitetty onnistuneesti!';
  } catch (error) {
    profileMessage.textContent = error.message;
  }
}

profileForm.addEventListener('submit', updateProfile);

getProfile();
