const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const logoutButton = document.querySelector('#logout-button');
const favoriteForm = document.querySelector('#favorite-form');
const favoriteSelect = document.querySelector('#favorite-select');
const favoriteGrid = document.querySelector('.favorites-grid');
const favoriteMessage = document.querySelector('#favorite-message');

let restaurants = [];

// Check if the user is logged in
async function checkLogin() {
  const token = sessionStorage.getItem('token');

  // Reditect to login page if not logged in
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  let user;

  try {
    // Get the current user from the API
    const response = await fetch(`${apiUrl}/users/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    user = await response.json();
  } catch (error) {
    // Remove invalid token and redirect to login
    sessionStorage.removeItem('token');
    window.location.href = 'login.html';
    return;
  }

  // Load restaurants after successful login
  await getRestaurants(user.favouriteRestaurant);
}

// Fetch restaurants and fill the select menu
async function getRestaurants(favoriteId) {
  try {
    const response = await fetch(`${apiUrl}/restaurants`);

    if (!response.ok) {
      throw new Error('Ravintoloiden hakeminen epäonnistui.');
    }

    restaurants = await response.json();

    restaurants.sort((a, b) => {
      return a.name.localeCompare(b.name, 'fi');
    });

    // Add restaurants to the select menu
    for (const restaurant of restaurants) {
      const option = document.createElement('option');
      option.value = restaurant._id;
      option.textContent = restaurant.name;
      favoriteSelect.append(option);
    }

    // Find and display the users saved favorite
    const favorite = restaurants.find((restaurant) => {
      return restaurant._id === favoriteId;
    });

    showFavorite(favorite);
  } catch (error) {
    favoriteMessage.textContent = error.message;
  }
}

// Display the favorite restaurant on the dashboard
function showFavorite(restaurant) {
  favoriteGrid.innerHTML = '';

  if (!restaurant) {
    favoriteGrid.textContent = 'Et ole vielä valinnut suosikkiravintolaa.';
    return;
  }

  favoriteSelect.value = restaurant._id;

  // Create a restaurant card
  const card = document.createElement('article');
  card.classList.add('restaurant-card');

  const name = document.createElement('h3');
  name.textContent = restaurant.name;

  const address = document.createElement('p');
  address.textContent = `${restaurant.address}, ${restaurant.city}`;

  const dailyLink = document.createElement('a');
  dailyLink.textContent = 'Päivän ruokalista \u2192';
  dailyLink.href = `menu.html?id=${restaurant._id}&view=daily`;

  const weeklyLink = document.createElement('a');
  weeklyLink.textContent = 'Viikon ruokalista \u2192';
  weeklyLink.href = `menu.html?id=${restaurant._id}&view=weekly`;

  card.append(name, address, dailyLink, weeklyLink);
  favoriteGrid.append(card);
}

// Save the selected favorite restaurant
async function saveFavorite(event) {
  event.preventDefault();

  const token = sessionStorage.getItem('token');
  const favoriteId = favoriteSelect.value;

  try {
    // Update the users favorite restaurant in the API
    const response = await fetch(`${apiUrl}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({favouriteRestaurant: favoriteId}),
    });

    if (!response.ok) {
      throw new Error('Suosikkiravintolan tallentaminen epäonnistui.');
    }

    // Update the displayed favorite restaurant
    const favorite = restaurants.find((restaurant) => {
      return restaurant._id === favoriteId;
    });

    showFavorite(favorite);
    favoriteMessage.textContent = 'Suosikkiravintola tallennettu!';
  } catch (error) {
    favoriteMessage.textContent = error.message;
  }
}

// Log out the user
function logout() {
  sessionStorage.removeItem('token');
  window.location.href = '../index.html';
}

favoriteForm.addEventListener('submit', saveFavorite);
logoutButton.addEventListener('click', logout);

checkLogin();
