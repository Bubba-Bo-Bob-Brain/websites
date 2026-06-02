/**
 * METEOROLOGICAL DATA TERMINAL - CONTROLLER
 * v3.1.7 // BRUTALIST BUILD
 * 
 * Simulates raw meteorological data streams and renders
 * them to the DOM with intentional digital artifacts.
 */

'use strict';

const Dashboard = {
  state: {
    temp: 14.2,
    humidity: 72,
    pressure: 1013.2,
    windSpeed: 34,
    windGust: 52,
    windDir: 245,
    visibility: 12.4,
    uvIndex: 3,
    condition: 'OVERCAST',
    history: {
      pressure: []
    }
  },

  elements: {
    tempValue: document.getElementById('tempValue'),
    tempF: document.getElementById('tempF'),
    tempFeels: document.getElementById('tempFeels'),
    tempMin: document.getElementById('tempMin'),
    tempMax: document.getElementById('tempMax'),
    conditionIcon: document.getElementById('conditionIcon'),
    conditionText: document.getElementById('conditionText'),
    windArrow: document.getElementById('windArrow'),
    windSpeed: document.getElementById('windSpeed'),
    windDir: document.getElementById('windDir'),
    windSustained: document.getElementById('windSustained'),
    windGust: document.getElementById('windGust'),
    beaufort: document.getElementById('beaufort'),
    windChill: document.getElementById('windChill'),
    pressureVal: document.getElementById('pressure'),
    pressureTrend: document.getElementById('pressureTrend'),
    humidityVal: document.getElementById('humidity'),
    dewPointVal: document.getElementById('dewPoint'),
    visibilityVal: document.getElementById('visibility'),
    uvVal: document.getElementById('uvIndex'),
    uvFill: document.getElementById('uvFill'),
    hourlyBody: document.getElementById('hourlyBody'),
    extendedGrid: document.getElementById('extendedGrid'),
    pressureCanvas: document.getElementById('pressureCanvas'),
    aqiValue: document.getElementById('aqiValue'),
    aqiStatus: document.getElementById('aqiStatus'),
    aqiMarker: document.getElementById('aqiMarker'),
    timestamp: document.getElementById('liveTimestamp'),
    packetsRx: document.getElementById('packetsRx'),
    lastParse: document.getElementById('lastParse')
  },

  init() {
    console.log('[SYS] INITIALIZING METEOROLOGICAL TERMINAL...');
    this.generateInitialData();
    this.startClock();
    this.startDataSimulation();
    this.render();
    this.setupInteractions();
    console.log('[SYS] ONLINE. LISTENING FOR DATA STREAMS.');
  },

  generateInitialData() {
    // Seed pressure history for the chart
    let p = 1015.0;
    for (let i = 0; i < 24; i++) {
      p += (Math.random() - 0.55) * 1.5;
      this.state.history.pressure.push(p);
    }
    this.state.pressure = p;
  },

  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.elements.timestamp.textContent = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC';
      this.elements.lastParse.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    };
    updateTime();
    setInterval(updateTime, 1000);
  },

  startDataSimulation() {
    // Update data every 6 seconds (simulating raw feed)
    setInterval(() => {
      this.simulateDataFluctuation();
      this.render();
      this.updatePackets();
    }, 6000);

    // Glitch effect on temperature every ~15 seconds
    setInterval(() => {
      if (Math.random() > 0.6) {
        this.triggerGlitch(this.elements.tempValue);
      }
    }, 15000);
  },

  simulateDataFluctuation() {
    // Random walk for variables
    this.state.temp += (Math.random() - 0.5) * 0.4;
    this.state.humidity = Math.max(20, Math.min(100, this.state.humidity + (Math.random() - 0.5) * 2));
    this.state.pressure += (Math.random() - 0.5) * 0.8;
    this.state.history.pressure.push(this.state.pressure);
    if (this.state.history.pressure.length > 24) this.state.history.pressure.shift();
    
    this.state.windSpeed = Math.max(0, this.state.windSpeed + (Math.random() - 0.5) * 5);
    this.state.windGust = this.state.windSpeed + 10 + Math.random() * 10;
    this.state.windDir = (this.state.windDir + (Math.random() - 0.5) * 15) % 360;
  },

  updatePackets() {
    const count = Math.floor(Math.random() * 9000) + 1000;
    this.elements.packetsRx.textContent = count.toLocaleString();
  },

  render() {
    // Temperature
    this.animateNumber(this.elements.tempValue, this.state.temp, 1);
    this.elements.tempF.textContent = (this.state.temp * 1.8 + 32).toFixed(1) + '°F';
    this.elements.tempFeels.textContent = `FEELS LIKE: ${(this.state.temp - 2.1).toFixed(1)}°C`;
    this.elements.tempMin.textContent = (this.state.temp - 4.5).toFixed(1);
    this.elements.tempMax.textContent = (this.state.temp + 3.2).toFixed(1);

    // Wind
    this.elements.windArrow.style.transform = `rotate(${this.state.windDir}deg)`;
    this.elements.windSpeed.textContent = Math.round(this.state.windSpeed);
    this.elements.windDir.textContent = `${Math.round(this.state.windDir)}° ${this.getCardinal(this.state.windDir)}`;
    this.elements.windSustained.textContent = `${Math.round(this.state.windSpeed)} KPH`;
    this.elements.windGust.textContent = `${Math.round(this.state.windGust)} KPH`;
    this.elements.beaufort.textContent = this.getBeaufort(this.state.windSpeed);
    this.elements.windChill.textContent = `${(this.state.temp - (this.state.windSpeed * 0.1)).toFixed(1)}°C`;

    // Atmosphere
    this.elements.pressureVal.textContent = this.state.pressure.toFixed(1) + ' hPa';
    const trend = this.state.history.pressure[this.state.history.pressure.length - 1] - this.state.history.pressure[this.state.history.pressure.length - 2];
    this.elements.pressureTrend.textContent = trend > 0 ? '▲' : (trend < 0 ? '▼' : '—');
    this.elements.humidityVal.textContent = Math.round(this.state.humidity) + '%';
    this.elements.dewPointVal.textContent = (this.state.temp - ((100 - this.state.humidity) / 5)).toFixed(1) + '°C';
    this.elements.visibilityVal.textContent = (10 + Math.random() * 5).toFixed(1) + ' KM';

    // UV
    this.elements.uvVal.textContent = `${this.state.uvIndex} ${this.getUVText(this.state.uvIndex)}`;
    this.elements.uvFill.style.width = `${(this.state.uvIndex / 11) * 100}%`;

    // Charts & Tables
    this.drawPressureChart();
    this.renderHourlyTable();
    this.renderExtendedForecast();
  },

  renderHourlyTable() {
    // Only regenerate if empty or every 60 seconds to avoid DOM thrashing, 
    // but for this demo we'll just do it once or if it looks too static.
    // In a real app, we'd diff the DOM. Here, we just fill it if empty.
    if (this.elements.hourlyBody.children.length > 0) return;

    const tbody = this.elements.hourlyBody;
    const conditions = ['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'RA', 'TS', 'SN'];
    const icons = ['☀', '⛅', '☁', '🌧', '⛈', '❄'];

    for (let i = 0; i < 24; i++) {
      const hour = (new Date().getHours() + i) % 24;
      const temp = this.state.temp + Math.sin(i / 4) * 5 + (Math.random() - 0.5) * 2;
      const condIdx = Math.floor(Math.random() * conditions.length);
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${hour.toString().padStart(2, '0')}:00</td>
        <td>${temp.toFixed(1)}</td>
        <td>${(temp - 1.5).toFixed(1)}</td>
        <td>${Math.round(this.state.windSpeed + Math.random() * 10)}</td>
        <td>${Math.round(this.state.windGust + Math.random() * 5)}</td>
        <td>${Math.round(this.state.windDir)}°</td>
        <td>${Math.round(this.state.humidity + Math.random() * 10)}</td>
        <td>${Math.floor(Math.random() * 80)}%</td>
        <td>${(Math.random() * 2).toFixed(1)}</td>
        <td>${Math.floor(Math.random() * 100)}%</td>
        <td>${(8 + Math.random() * 5).toFixed(1)}</td>
        <td>${Math.floor(Math.random() * 6)}</td>
        <td>${icons[Math.floor(Math.random() * icons.length)]} ${conditions[condIdx]}</td>
      `;
      tbody.appendChild(tr);
    }
  },

  renderExtendedForecast() {
    if (this.elements.extendedGrid.children.length > 0) return;

    const grid = this.elements.extendedGrid;
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const icons = ['☀', '⛅', '☁', '🌧', '⛈', '❄'];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = days[date.getDay()];
      const high = this.state.temp + Math.random() * 6 - 2;
      const low = high - 8 - Math.random() * 4;

      const div = document.createElement('div');
      div.className = 'ext-day';
      div.innerHTML = `
        <span class="ext-day-name">${i === 0 ? 'TODAY' : dayName}</span>
        <span class="ext-day-icon">${icons[Math.floor(Math.random() * icons.length)]}</span>
        <div class="ext-day-temps">
          <span style="color: var(--c-text)">${Math.round(high)}°</span> / 
          <span style="color: var(--c-text-dim)">${Math.round(low)}°</span>
        </div>
        <div class="ext-day-precip">💧 ${Math.floor(Math.random() * 60)}%</div>
      `;
      grid.appendChild(div);
    }
  },

  drawPressureChart() {
    const canvas = this.elements.pressureCanvas;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Handle resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    const data = this.state.history.pressure;
    
    if (data.length < 2) return;

    const min = Math.min(...data) - 2;
    const max = Math.max(...data) + 2;
    const range = max - min;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Line
    ctx.strokeStyle = '#d4ff00';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    data.forEach((p, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Area under
    ctx.fillStyle = 'rgba(212, 255, 0, 0.05)';
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
  },

  // Utilities
  animateNumber(el, target, decimals) {
    // Simple instant update for brutalism, or we could animate
    el.textContent = target.toFixed(decimals);
  },

  getCardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  },

  getBeaufort(kph) {
    if (kph < 2) return '0 - CALM';
    if (kph < 6) return '1 - LIGHT AIR';
    if (kph < 12) return '2 - LIGHT BREEZE';
    if (kph < 20) return '3 - GENTLE BREEZE';
    if (kph < 29) return '4 - MODERATE BREEZE';
    if (kph < 39) return '5 - FRESH BREEZE';
    if (kph < 50) return '6 - STRONG BREEZE';
    if (kph < 62) return '7 - HIGH WIND';
    if (kph < 75) return '8 - GALE';
    return '9 - STRONG GALE';
  },

  getUVText(idx) {
    if (idx <= 2) return 'LOW';
    if (idx <= 5) return 'MODERATE';
    if (idx <= 7) return 'HIGH';
    if (idx <= 10) return 'VERY HIGH';
    return 'EXTREME';
  },

  triggerGlitch(el) {
    el.classList.add('glitching');
    const original = el.textContent;
    const chars = '0123456789ABCDEF';
    
    let iterations = 0;
    const interval = setInterval(() => {
      el.textContent = original.split('').map((char, index) => {
        if (char === '.') return '.';
        if (index < iterations) return original[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      
      iterations += 1 / 3;
      if (iterations >= original.length) {
        clearInterval(interval);
        el.textContent = original; // Ensure final match
        el.classList.remove('glitching');
      }
    }, 30);
  },

  setupInteractions() {
    // Click on temp block to force refresh
    document.getElementById('tempBlock').addEventListener('click', () => {
      console.log('[USR] MANUAL REFREQ REQUESTED');
      this.triggerGlitch(this.elements.tempValue);
      this.simulateDataFluctuation();
      this.render();
      this.updatePackets();
    });
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => Dashboard.init());