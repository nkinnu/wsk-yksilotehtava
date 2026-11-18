const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

// Fetch the list of restaurants and display them on the index page
async function getRestaurants() {
  try {
    const response = await fetch(`${apiUrl}/restaurants`);

    if (!response.ok) {
      throw new Error('Ravintoloiden hakeminen epäonnistui.');
    }

    const restaurants = await response.json();

    restaurants.sort((a, b) => {
      return a.name.localeCompare(b.name, 'fi');
    });

    // Show the first 4 restaurants
    showRestaurants(restaurants, 4);

    // Add cities to the select menu
    fillCities(restaurants);

    const showAllButton = document.querySelector('#show-all-button');
    const restaurantDialog = document.querySelector('#restaurant-dialog');
    const dialogTitle = document.querySelector('#dialog-title');
    const searchForm = document.querySelector('.search-form');

    // Open the dialog with all restaurants
    showAllButton.addEventListener('click', () => {
      dialogTitle.textContent = `Kaikki ravintolat (${restaurants.length})`;

      showRestaurantDialog(restaurants);
      restaurantDialog.showModal();
    });

    // Search restaurants by name and city
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const results = filterRestaurants(restaurants);

      dialogTitle.textContent = `Hakutulokset (${results.length})`;

      showRestaurantDialog(results);
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

function fillCities(restaurants) {
  const citySelect = document.querySelector('#city');
  const cities = [];

  // Collect unique cities from the restaurants
  for (let i = 0; i < restaurants.length; i++) {
    const city = restaurants[i].city;
    if (city && !cities.includes(city)) {
      cities.push(city);
    }
  }

  // Sort the cities alphabetically
  cities.sort();

  // Add cities to search element
  for (let i = 0; i < cities.length; i++) {
    const option = document.createElement('option');
    option.value = cities[i];
    option.textContent = cities[i];
    citySelect.append(option);
  }
}

// Filter the list of restaurants based on the search text and selected city
function filterRestaurants(restaurants) {
  const searchText = document
    .querySelector('#restaurant-search')
    .value.trim()
    .toLowerCase();

  const selectedCity = document.querySelector('#city').value;

  const filteredRestaurants = [];

  // Loop through the restaurants and check if they match the search text and selected city
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];

    const nameMatch = restaurant.name.toLowerCase().includes(searchText);

    const cityMatch = selectedCity === '' || restaurant.city === selectedCity;

    if (nameMatch && cityMatch) {
      filteredRestaurants.push(restaurant);
    }
  }

  return filteredRestaurants;
}

// Display the list of restaurants in a dialog on the index page
function showRestaurantDialog(restaurants) {
  const restaurantList = document.querySelector('#all-restaurants-list');
  restaurantList.innerHTML = '';

  if (restaurants.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Ei hakutuloksia.';
    restaurantList.append(message);

    return;
  }

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
