const apiKey = '08a5add86b784671680b941ca1abb177'; 
const lat = '8.4333';
const lon = '99.9667'; 

function fetchWeatherData() {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const tempInCelsius = data.main.temp - 273.15;

            document.getElementById('location').textContent = data.name;
            document.getElementById('temperature').textContent = `Temperature: ${tempInCelsius.toFixed(2)} °C`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity} %`;
            document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}

//footer
fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });

window.onload = fetchWeatherData;
