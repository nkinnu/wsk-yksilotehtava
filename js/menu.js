const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const accountLink = document.querySelector('.login-button');

// Update navigation if the user is logged in
if (sessionStorage.getItem('token')) {
  accountLink.textContent = 'Oma sivu';
  accountLink.href = 'dashboard.html';
}

// Get the restaurant ID and view type from the URL parameters
const params = new URLSearchParams(window.location.search);

const restaurantId = params.get('id');
const view = params.get('view');

console.log('Ravintolan ID: ', restaurantId);
console.log('Ruokalistan tyyppi: ', view);

// Fetch the restaurant details based on the restaurant ID
async function getRestaurant() {
  try {
    const response = await fetch(`${apiUrl}/restaurants/${restaurantId}`);

    if (!response.ok) {
      throw new Error('Ravintolan hakeminen epäonnistui.');
    }

    const restaurant = await response.json();
    console.log(restaurant);

    const restaurantName = document.querySelector('#restaurant-name');
    restaurantName.textContent = restaurant.name;
  } catch (error) {
    console.error(error);
  }
}

// Fetch the menu based on the restaurant ID and view type
async function getMenu() {
  try {
    let url;

    // Determine the URL based on the view type
    if (view === 'daily') {
      url = `${apiUrl}/restaurants/daily/${restaurantId}/fi`;
    } else if (view === 'weekly') {
      url = `${apiUrl}/restaurants/weekly/${restaurantId}/fi`;
    } else {
      throw new Error('Tuntematon ruokalistan tyyppi.');
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Ruokalistan hakeminen epäonnistui.');
    }

    const menu = await response.json();
    console.log(menu);

    const menuTitle = document.querySelector('#menu-title');

    if (view === 'daily') {
      menuTitle.textContent = 'Päivän ruokalista';
      showDailyMenu(menu.courses);
    } else if (view === 'weekly') {
      menuTitle.textContent = 'Viikon ruokalista';
      showWeeklyMenu(menu.days);
    }
  } catch (error) {
    console.error(error);
  }
}

// Display the daily menu on the menu page
function showDailyMenu(courses) {
  const menuDishes = document.querySelector('#menu-dishes');

  menuDishes.innerHTML = '';

  // Display a message if the menu is empty
  if (courses.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Ruokalistaa ei ole saatavilla.';

    menuDishes.append(message);
    return;
  }

  // Loop through the courses and create elements for each dish
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    const dish = document.createElement('div');
    dish.classList.add('dish');

    const name = document.createElement('h3');
    name.textContent = course.name;

    const price = document.createElement('p');
    price.textContent = course.price;

    const diets = document.createElement('p');
    diets.textContent = course.diets;

    dish.append(name, price, diets);
    menuDishes.append(dish);
  }
}

// Display the weekly menu on the menu page
function showWeeklyMenu(days) {
  const menuDishes = document.querySelector('#menu-dishes');
  menuDishes.innerHTML = '';

  // Display a message if the menu is empty
  if (days.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Viikon ruokalistaa ei ole saatavilla.';

    menuDishes.append(message);
    return;
  }

  // Loop through the days and create elements for each day's menu
  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    const daySection = document.createElement('section');
    daySection.classList.add('menu-day');

    const date = document.createElement('h3');
    date.textContent = day.date;
    daySection.append(date);

    // Loop through the courses for each day and create elements for each dish
    for (let j = 0; j < day.courses.length; j++) {
      const course = day.courses[j];

      const dish = document.createElement('div');
      dish.classList.add('dish');

      const name = document.createElement('h4');
      name.textContent = course.name;

      const price = document.createElement('p');
      price.textContent = course.price;

      const diets = document.createElement('p');
      diets.textContent = course.diets;

      dish.append(name, price, diets);
      daySection.append(dish);
    }

    menuDishes.append(daySection);
  }
}

if (restaurantId) {
  // Update the menu tabs' href attributes based on the restaurant ID and view type
  const dailyTab = document.querySelector('#daily-tab');
  const weeklyTab = document.querySelector('#weekly-tab');

  dailyTab.href = `menu.html?id=${restaurantId}&view=daily`;
  weeklyTab.href = `menu.html?id=${restaurantId}&view=weekly`;

  if (view === 'daily') {
    dailyTab.classList.add('active');
  } else if (view === 'weekly') {
    weeklyTab.classList.add('active');
  }

  getRestaurant();
  getMenu();
}
