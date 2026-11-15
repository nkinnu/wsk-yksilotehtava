const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

// Fetch the list of restaurants and display them on the index page
async function getRestaurants() {
  try {
    const response = await fetch(`${apiUrl}/restaurants`);

    if (!response.ok) {
      throw new Error('Ravintoloiden hakeminen epäonnistui.');
    }

    const restaurants = await response.json();
    console.log(restaurants);

    // Show the first 4 restaurants
    showRestaurants(restaurants, 4);

    // Show all restaurants in a dialog
    showRestaurantDialog(restaurants);

    const showAllButton = document.querySelector('#show-all-button');
    const restaurantDialog = document.querySelector('#restaurant-dialog');

    // Open the dialog when the button is clicked
    showAllButton.addEventListener('click', () => {
      restaurantDialog.showModal();
    });
  } catch (error) {
    console.error(error);
  }
}

// Display the list of restaurants on the index page
function showRestaurants(restaurants, limit) {
  const restaurantGrid = document.querySelector('.restaurant-grid');

  restaurantGrid.innerHTML = '';

  // Limit the number of displayed restaurants to 4
  for (let i = 0; i < restaurants.length; i++) {
    if (i === limit) {
      break;
    }

    const restaurant = restaurants[i];

    // Create a card for each restaurant
    const card = document.createElement('article');
    card.classList.add('restaurant-card');

    const name = document.createElement('h3');
    name.textContent = restaurant.name;

    const dailyLink = document.createElement('a');
    dailyLink.textContent = 'Päivän ruokalista \u2192';
    dailyLink.href = `pages/menu.html?id=${restaurant._id}&view=daily`;

    const weeklyLink = document.createElement('a');
    weeklyLink.textContent = 'Viikon ruokalista \u2192';
    weeklyLink.href = `pages/menu.html?id=${restaurant._id}&view=weekly`;

    card.append(name, dailyLink, weeklyLink);
    restaurantGrid.append(card);
  }
}

// Display the list of restaurants in a dialog on the index page
function showRestaurantDialog(restaurants) {
  const restaurantList = document.querySelector('#all-restaurants-list');
  restaurantList.innerHTML = '';

  // Loop through the restaurants and create elements for each restaurant
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];

    const item = document.createElement('div');
    item.classList.add('dialog-restaurant');

    const name = document.createElement('h3');
    name.textContent = restaurant.name;

    const city = document.createElement('p');
    city.textContent = restaurant.city;

    const dailyLink = document.createElement('a');
    dailyLink.textContent = 'Päivän ruokalista \u2192';
    dailyLink.href = `pages/menu.html?id=${restaurant._id}&view=daily`;

    const weeklyLink = document.createElement('a');
    weeklyLink.textContent = 'Viikon ruokalista \u2192';
    weeklyLink.href = `pages/menu.html?id=${restaurant._id}&view=weekly`;

    item.append(name, city, dailyLink, weeklyLink);
    restaurantList.append(item);
  }
}

getRestaurants();
