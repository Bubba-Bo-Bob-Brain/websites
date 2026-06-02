// BRUTALIST WEATHER DATA (MOCK API)
const mockWeatherData = {
  current: {
    temp: 22,
    condition: "SUNNY",
    humidity: 65,
    pressure: 1012,
    windSpeed: 15,
    windDirection: 45
  },
  hourly: [
    { time: "12:00", temp: 22, condition: "SUNNY", wind: 15 },
    { time: "13:00", temp: 24, condition: "SUNNY", wind: 12 },
    { time: "14:00", temp: 26, condition: "CLOUDY", wind: 10 },
    { time: "15:00", temp: 25, condition: "RAIN", wind: 18 },
    { time: "16:00", temp: 23, condition: "STORM", wind: 25 }
  ],
  alert: null
};

// DOM ELEMENTS
const currentTemp = document.getElementById("current-temp");
const currentUnit = document.getElementById("current-unit");
const currentCondition = document.getElementById("current-condition");
const currentHumidity = document.getElementById("current-humidity");
const currentPressure = document.getElementById("current-pressure");
const windSpeed = document.getElementById("wind-speed");
const windDirection = document.getElementById("wind-direction");
const windDirText = document.getElementById("wind-dir-text");
const weatherAlert = document.getElementById("weather-alert");
const hourlyForecast = document.getElementById("hourly-forecast");
const toggleUnitBtn = document.getElementById("toggle-unit");
const refreshDataBtn = document.getElementById("refresh-data");
const lastUpdated = document.getElementById("last-updated");

// STATE
let useCelsius = true;
let weatherData = mockWeatherData;

// INITIALIZE DASHBOARD
function initDashboard() {
  updateCurrentWeather();
  updateHourlyForecast();
  updateWindArrow();
  updateLastUpdated();
}

// UPDATE CURRENT WEATHER (BRUTAL DOM MANIPULATION)
function updateCurrentWeather() {
  const temp = useCelsius
    ? weatherData.current.temp
    : (weatherData.current.temp * 9/5) + 32;
  currentTemp.textContent = Math.round(temp);
  currentUnit.textContent = useCelsius ? "C" : "F";

  currentCondition.textContent = weatherData.current.condition;
  currentCondition.className = `condition-${weatherData.current.condition.toLowerCase()}`;

  currentHumidity.textContent = `HUMIDITY: ${weatherData.current.humidity}%`;
  currentPressure.textContent = `PRESSURE: ${weatherData.current.pressure}hPa`;
  windSpeed.textContent = `${weatherData.current.windSpeed} km/h`;
  windDirText.textContent = `DIR: ${weatherData.current.windDirection}°`;

  // TRIGGER ALERT IF CONDITION IS EXTREME
  if (weatherData.current.condition === "STORM") {
    weatherAlert.textContent = "!!! STORM WARNING !!!";
    weatherAlert.classList.add("active");
  } else {
    weatherAlert.textContent = "!!! NO ALERTS !!!";
    weatherAlert.classList.remove("active");
  }
}

// UPDATE HOURLY FORECAST (RAW TABLE POPULATION)
function updateHourlyForecast() {
  hourlyForecast.innerHTML = "";
  weatherData.hourly.forEach(hour => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${hour.time}</td>
      <td>${hour.temp}°</td>
      <td class="condition-${hour.condition.toLowerCase()}">${hour.condition}</td>
      <td>${hour.wind} km/h</td>
    `;
    hourlyForecast.appendChild(row);
  });
}

// UPDATE WIND ARROW (PURE CSS ROTATION)
function updateWindArrow() {
  const direction = weatherData.current.windDirection;
  windDirection.style.transform = `rotate(${direction}deg)`;
}

// TOGGLE UNITS (°C ↔ °F)
toggleUnitBtn.addEventListener("click", () => {
  useCelsius = !useCelsius;
  updateCurrentWeather();
});

// REFRESH DATA (BRUTAL RELOAD)
refreshDataBtn.addEventListener("click", () => {
  // SIMULATE API CALL (DELAY FOR BRUTAL FEEL)
  setTimeout(() => {
    weatherData = mockWeatherData; // Replace with real API call in production
    initDashboard();
    updateLastUpdated();
  }, 500);
});

// UPDATE LAST UPDATED TIME
function updateLastUpdated() {
  const now = new Date();
  lastUpdated.textContent = `LAST UPDATE: ${now.toLocaleTimeString()}`;
}

// INITIALIZE ON LOAD
window.addEventListener("load", initDashboard);