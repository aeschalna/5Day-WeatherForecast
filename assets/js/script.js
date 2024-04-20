

// add variables to represent DOM elements
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');

// fetch weather using provided cityInput
function fetchWeather(city) {
    const APIkey = "6691a129dbf2864d60d7414c7fbc73e6";
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`

    fetch(currentWeatherURL)
        // {
        //     method: "GET",
        //     headers: { Authorization: APIkey }
        // }
        .then(response => {
            if (!response.ok) {
                throw new Error('Server response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.log('No results found.');
            } else {
                console.log(data);
                displaycurrentWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching data', error);
            currentWeatherEl.innerHTML = '<h3> Error fetching data, please try a new search. </h3>';
        });
}

// Function to display current weather data
function displaycurrentWeather(data) {
    currentWeatherEl.innerHTML = '';
    // Create element to hold weather data info
    const weatherData = document.createElement('div');

    // Select desired properties from object array
    const date = new Date(data.dt * 1000);
    // convert timestamp to date
    const weatherIcon = data.weather[0].main;
    // convert temperature from Kelvin to Fahrenheit
    const tempK = data.main.temp;
    const temperature = ((tempK - 273.15) * 9 / 5) + 32;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    // Use dot notation to access specific property

    // Display selected properties
    weatherData.innerHTML = `<p>Date: ${date.toLocaleDateString()}</p>
    <p>Weather: ${weatherIcon}</p>
    <p>Temperature: ${temperature.toFixed(1)} °F</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    <p>Humidity: ${humidity}%</p>`;
    // Specify location on index based on time (high point ~ 2-3pm)
    // Loop through array using comparison operators

    currentWeatherEl.appendChild(weatherData);
}

// Function to set search data in localStorage
function saveSearchtoStorage(city) {
    let searchHistory = getSearchesfromStorage();
    searchHistory.push(city);
    localStorage.setItem('savedCities', JSON.stringify(searchHistory));
}

// Retrieve search data from localStorage
function getSearchesfromStorage() {
    let searchHistory = JSON.parse(localStorage.getItem('savedCities'));
    if (!searchHistory) {
        searchHistory = [];
    }
    return searchHistory;
}

// Function to display saved cities searched
function displaySavedSearches() {
    // retrieve cities searched
    const searches = getSearchesfromStorage();
    // set var for container where history will display
    const citiesEl = document.getElementById('search-history');
    // clear any existing content
    citiesEl.innerHTML = '';
    // loop through array
    searches.forEach(city => {
        const result = document.createElement("li");
        result.textContent = city;

        citiesEl.appendChild(result);
    })
}

// Function to fetch 5 day forecast
function fetchForecast(city) {
    const APIkey = "6691a129dbf2864d60d7414c7fbc73e6";
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`

    fetch(forecastURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.log('No results found.');
            } else {
                console.log(data);
                renderForecast(data);
            }
        })
        .catch(error => {
            console.error('Error fetching data', error);
            forecastEl.innerHTML = '<h3> Error fetching data, please try a new search. </h3>';
        });
}

function renderForecast(data) {
    forecastEl.innerHTML = '';
    // Loop through first 5 objects in the data array (each represents a 3-hour interval)
    for (let i = 0; i < 5; i++) {
        // 3 hour intervals * 8 = 24/24 hours daily
        const forecast = data.list[i * 8];
        const date = new Date(forecast.dt * 1000);
        const weatherIcon = forecast.weather[0].main;
        // Convert temp
        const tempK = forecast.main.temp;
        const temperature = ((tempK - 273.15) * 9 / 5) + 32;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        // Create a card element for each day's forecast
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `<p>Date: ${date.toLocaleDateString()}</p>
    <p>Weather: ${weatherIcon}</p>
    <p>Temperature: ${temperature.toFixed(1)} °F</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    <p>Humidity: ${humidity}%</p>`;

        forecastEl.appendChild(forecastCard);
    }
}
//     const weatherCard = document.createElement('div');
//     weatherCard.classList.add('card');
//     // Set the content of the card using the forecast data
//     weatherCard.innerHTML = `
//     <h2>${date.toDateString()}</h2>
//     <p>Weather: ${weatherIcon}</p>
//     <p>Temperature: ${temperature} °F</p>
//     <p>Wind Speed: ${windSpeed} MPH</p>
//     <p>Humidity: ${humidity}%</p>`;
//     // Append the card
//     forecastData.appendChild(weatherCard);
//     // Append data to cards
//     forecastEl.appendChild(forecastData);
// }

// Create cards using 5 day forecast
// function addWeatherCard(weather) {
//     const weatherCard = document.createElement("div");
//     let weather = {
//         // date: datepicker or autofill current date
//         // icon: ⛅(cloudy), 🔆(sunny), 🌧️(rain), 🌨️(snow), ☃️(cold)
//         // temperature: (current) in °F
//         // wind: (current) in MPH
//         // humidity:   %
//     }
//     weatherCard.appendChild(weather);
//     forecast.appendChild(weatherCard);
// }

// // Function to add searches as li
// function listSearchHistory() {
//     const citySearched = document.createElement("div");
// }
// Update localStorage

// Add event listeners - define city here
const submitSearch = document.getElementById('search');
submitSearch.addEventListener('click', function (event) {
    event.preventDefault();
    // Global variable for form inputs
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();

    fetchWeather(city);
    saveSearchtoStorage(city);
    fetchForecast(city);
    displaySavedSearches();

    // Sanity check
    console.log(city);
});

displaySavedSearches()