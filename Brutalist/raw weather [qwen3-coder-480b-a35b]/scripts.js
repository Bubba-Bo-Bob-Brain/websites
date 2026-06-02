// Brutal Weather Dashboard Scripts

// DOM Elements
const tempElement = document.getElementById('current-temp');
const feelsLikeElement = document.getElementById('feels-like');
const conditionElement = document.getElementById('weather-condition');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const windDirectionElement = document.getElementById('wind-direction');
const pressureElement = document.getElementById('pressure');
const visibilityElement = document.getElementById('visibility');
const hourlyBody = document.getElementById('hourly-body');
const alertSection = document.getElementById('alert-section');
const alertText = document.getElementById('alert-text');
const updateTimeElement = document.getElementById('update-time');
const locationSelect = document.getElementById('location-select');

// Sample weather data for different locations
const weatherData = {
  nyc: {
    temp: 72,
    feelsLike: 75,
    condition: 'PARTLY CLOUDY',
    humidity: 65,
    windSpeed: 8,
    windDirection: 120, // degrees
    pressure: 30.12,
    visibility: 10,
    alerts: ['SEVERE THUNDERSTORM WARNING UNTIL 6PM'],
    hourly: [
      { time: '11 AM', temp: 72, condition: 'Cloudy', precip: '10%' },
      { time: '12 PM', temp: 74, condition: 'Sunny', precip: '0%' },
      { time: '1 PM', temp: 76, condition: 'Sunny', precip: '0%' },
      { time: '2 PM', temp: 78, condition: 'Partly Cloudy', precip: '5%' },
      { time: '3 PM', temp: 77, condition: 'Partly Cloudy', precip: '15%' },
      { time: '4 PM', temp: 75, condition: 'Rain', precip: '80%' },
      { time: '5 PM', temp: 73, condition: 'Thunderstorms', precip: '95%' },
      { time: '6 PM', temp: 71, condition: 'Thunderstorms', precip: '90%' }
    ]
  },
  london: {
    temp: 57,
    feelsLike: 55,
    condition: 'RAIN',
    humidity: 85,
    windSpeed: 15,
    windDirection: 240,
    pressure: 29.85,
    visibility: 6,
    alerts: [],
    hourly: [
      { time: '11 AM', temp: 57, condition: 'Rain', precip: '90%' },
      { time: '12 PM', temp: 58, condition: 'Rain', precip: '85%' },
      { time: '1 PM', temp: 59, condition: 'Light Rain', precip: '70%' },
      { time: '2 PM', temp: 59, condition: 'Overcast', precip: '20%' },
      { time: '3 PM', temp: 58, condition: 'Cloudy', precip: '10%' },
      { time: '4 PM', temp: 57, condition: 'Cloudy', precip: '5%' },
      { time: '5 PM', temp: 56, condition: 'Partly Cloudy', precip: '0%' },
      { time: '6 PM', temp: 55, condition: 'Clear', precip: '0%' }
    ]
  },
  tokyo: {
    temp: 82,
    feelsLike: 88,
    condition: 'HUMID',
    humidity: 78,
    windSpeed: 5,
    windDirection: 90,
    pressure: 30.02,
    visibility: 12,
    alerts: ['HEAT ADVISORY UNTIL 8PM'],
    hourly: [
      { time: '11 AM', temp: 82, condition: 'Sunny', precip: '0%' },
      { time: '12 PM', temp: 84, condition: 'Sunny', precip: '0%' },
      { time: '1 PM', temp: 86, condition: 'Sunny', precip: '0%' },
      { time: '2 PM', temp: 88, condition: 'Sunny', precip: '0%' },
      { time: '3 PM', temp: 89, condition: 'Sunny', precip: '0%' },
      { time: '4 PM', temp: 87, condition: 'Partly Cloudy', precip: '0%' },
      { time: '5 PM', temp: 85, condition: 'Partly Cloudy', precip: '0%' },
      { time: '6 PM', temp: 83, condition: 'Clear', precip: '0%' }
    ]
  },
  sydney: {
    temp: 68,
    feelsLike: 68,
    condition: 'CLEAR',
    humidity: 55,
    windSpeed: 12,
    windDirection: 310,
    pressure: 30.25,
    visibility: 15,
    alerts: [],
    hourly: [
      { time: '11 AM', temp: 68, condition: 'Clear', precip: '0%' },
      { time: '12 PM', temp: 70, condition: 'Sunny', precip: '0%' },
      { time: '1 PM', temp: 72, condition: 'Sunny', precip: '0%' },
      { time: '2 PM', temp: 74, condition: 'Sunny', precip: '0%' },
      { time: '3 PM', temp: 73, condition: 'Partly Cloudy', precip: '0%' },
      { time: '4 PM', temp: 71, condition: 'Partly Cloudy', precip: '0%' },
      { time: '5 PM', temp: 69, condition: 'Clear', precip: '0%' },
      { time: '6 PM', temp: 67, condition: 'Clear', precip: '0%' }
    ]
  }
};

// Initialize the dashboard
function initDashboard() {
  updateWeatherData('nyc');
  setupEventListeners();
  updateTime();
  
  // Update time every minute
  setInterval(updateTime, 60000);
}

// Update weather data based on selected location
function updateWeatherData(location) {
  const data = weatherData[location];
  
  // Update current weather
  tempElement.textContent = data.temp;
  feelsLikeElement.textContent = `${data.feelsLike}°F`;
  conditionElement.textContent = data.condition;
  humidityElement.textContent = `${data.humidity}%`;
  windSpeedElement.textContent = `${data.windSpeed} MPH`;
  pressureElement.textContent = `${data.pressure} IN`;
  visibilityElement.textContent = `${data.visibility} MI`;
  
  // Update wind direction arrow
  windDirectionElement.style.transform = `rotate(${data.windDirection}deg)`;
  
  // Update hourly forecast
  renderHourlyForecast(data.hourly);
  
  // Handle alerts
  if (data.alerts.length > 0) {
    alertText.textContent = data.alerts[0];
    alertSection.style.display = 'block';
  } else {
    alertSection.style.display = 'none';
  }
}

// Render hourly forecast table
function renderHourlyForecast(hourlyData) {
  hourlyBody.innerHTML = '';
  
  hourlyData.forEach(hour => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${hour.time}</td>
      <td>${hour.temp}°</td>
      <td>${hour.condition}</td>
      <td>${hour.precip}</td>
    `;
    
    hourlyBody.appendChild(row);
  });
}

// Update the "last updated" time
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  updateTimeElement.textContent = timeString;
}

// Set up event listeners
function setupEventListeners() {
  locationSelect.addEventListener('change', function() {
    updateWeatherData(this.value);
  });
  
  // Add brutal click effect to temperature display
  tempElement.addEventListener('click', function() {
    this.classList.add('clicked');
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 300);
  });
}

// Add some random brutal effects periodically
function addRandomEffects() {
  const elements = document.querySelectorAll('.stat-card, .weather-meta, .alert-banner');
  
  setInterval(() => {
    if (elements.length > 0) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      randomElement.style.transform = `rotate(${Math.floor(Math.random() * 6) - 3}deg)`;
    }
  }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
  addRandomEffects();
});