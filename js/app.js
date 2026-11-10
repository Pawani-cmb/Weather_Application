const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const API_KEY = "f31b6904d5e14e6d86c110715261210";

const cityName = document.getElementById("cityName");
const weatherDate = document.getElementById("weatherDate");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

searchBtn.addEventListener("click", function () {

    let city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);

});

async function getWeather(city) {

    const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

    try {

        const response = await fetch(URL);
        const data = await response.json();

        if (data.error) {
            alert(data.error.message);
            return;
        }

        cityName.textContent = data.location.name + ", " + data.location.country;

        weatherDate.textContent = data.location.localtime;

        temperature.textContent = data.current.temp_c + "°";

        condition.textContent = data.current.condition.text;

        feelsLike.textContent = data.current.feelslike_c + "°";

        humidity.textContent = data.current.humidity + "%";

        wind.textContent = data.current.wind_kph + " km/h";

        console.log(data);

        console.log("City:", data.location.name);
        console.log("Temperature:", data.current.temp_c);
        console.log("Condition:", data.current.condition.text);
        console.log("Humidity:", data.current.humidity);
        console.log("Wind:", data.current.wind_kph);

    } catch (error) {

        console.log("Error:", error);

    }

}

const map = L.map('map').setView([7.8731, 80.7718], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker = null;

map.on('click', async function (e) {

    let lat = e.latlng.lat;
    let lon = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map);

    const cityName = await getCityFromCordinates(lat, lon);
    if (cityName) {
        getWeather(cityName);
    }
});

async function getCityFromCordinates(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        const data = await response.json();

        const address = data.address;
        const cityName = address.city || address.town || address.village || address.suburb || address.country;
        return cityName;
    } catch (error) {
        return null;
    }
}
