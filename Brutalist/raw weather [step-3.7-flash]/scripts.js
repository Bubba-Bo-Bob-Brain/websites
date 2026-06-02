const tempDisplay = document.querySelector('.temp-value');
const sysTime = document.querySelector('.sys-time');
const refreshBtn = document.querySelector('.sys-refresh');
const statusDot = document.querySelector('.status-dot');
const hourlyRows = document.querySelectorAll('.hourly-table tbody tr');
const windArrows = document.querySelectorAll('.wind-arrow-item');
const alertStrip = document.querySelector('.alert-strip');
const gridRefs = document.querySelectorAll('.grid-ref');
const tempDisplayPanel = document.querySelector('.temp-display');
const lastSyncTime = document.querySelector('.system-footer time');

let counterAnimationId = null;

function animateTemperatureCounter(targetTemp) {
  if (counterAnimationId) cancelAnimationFrame(counterAnimationId);
  let currentTemp = 0;
  const totalSteps = 20;
  const stepValue = targetTemp / totalSteps;
  const stepInterval = 1000 / totalSteps;

  function updateStep() {
    currentTemp += stepValue;
    if (currentTemp >= targetTemp) {
      tempDisplay.textContent = `${Math.round(targetTemp)}°`;
      counterAnimationId = null;
      return;
    }
    tempDisplay.textContent = `${Math.round(currentTemp)}°`;
    counterAnimationId = setTimeout(() => requestAnimationFrame(updateStep), stepInterval);
  }
  updateStep();
}

function updateSystemClock() {
  const now = new Date();
  const timeOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  };
  const formattedTime = now.toLocaleString('en-US', timeOptions).replace(/,/g, '');
  sysTime.textContent = `${formattedTime} EST`;
  lastSyncTime.textContent = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' });
}

function handleRefresh() {
  refreshBtn.textContent = '[REFRESHING...]';
  refreshBtn.disabled = true;
  statusDot.style.animation = 'none';
  statusDot.style.background = '#ff0000';
  statusDot.style.opacity = '1';

  tempDisplayPanel.style.background = '#ffffff';
  setTimeout(() => { tempDisplayPanel.style.background = ''; }, 100);

  setTimeout(() => {
    const newTemp = Math.floor(Math.random() * 20) + 65;
    const newHumidity = Math.floor(Math.random() * 40) + 30;
    const newWindSpeed = Math.floor(Math.random() * 20) + 5;
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const newWindDir = windDirections[Math.floor(Math.random() * windDirections.length)];
    const newFeelsLike = newTemp + Math.floor(Math.random() * 5) - 2;
    const newHigh = newTemp + Math.floor(Math.random() * 8) + 2;
    const newLow = newTemp - Math.floor(Math.random() * 15) - 5;

    tempDisplay.dataset.target = newTemp;
    animateTemperatureCounter(newTemp);
    document.querySelector('.temp-feels').textContent = `FEELS LIKE ${newFeelsLike}°`;
    document.querySelector('.temp-range').textContent = `H:${newHigh}° / L:${newLow}°`;
    document.querySelector('.condition-item:nth-child(2) .cond-value').textContent = `${newWindDir} ${newWindSpeed} MPH`;
    document.querySelector('.condition-item:first-child .cond-value').textContent = `${newHumidity}%`;

    refreshBtn.textContent = '[REFRESH]';
    refreshBtn.disabled = false;
    statusDot.style.animation = 'blink 2s steps(1) infinite';
    statusDot.style.background = '#00ff00';
    updateSystemClock();
  }, 1500);
}

function updateCurrentHourHighlight() {
  const now = new Date();
  let currentHour = now.getHours();
  let hour12 = currentHour % 12;
  hour12 = hour12 ? hour12 : 12;
  const ampm = currentHour >= 12 ? 'PM' : 'AM';
  const currentTimeString = `${hour12}:00 ${ampm}`;

  hourlyRows.forEach(row => {
    const rowTime = row.cells[0].textContent;
    row.classList.toggle('current-hour', rowTime === currentTimeString);
  });
}

windArrows.forEach(arrow => {
  const pointer = arrow.querySelector('.arrow-pointer');
  arrow.addEventListener('mouseenter', () => {
    pointer.style.transition = 'transform 0.3s steps(4)';
    pointer.style.transform = `rotate(calc(var(--dir) + 360deg))`;
  });
  arrow.addEventListener('mouseleave', () => {
    pointer.style.transition = 'transform 0.3s steps(4)';
    pointer.style.transform = `rotate(var(--dir))`;
  });
});

alertStrip.addEventListener('mouseenter', () => {
  document.querySelector('.alert-marquee').style.animationPlayState = 'paused';
});
alertStrip.addEventListener('mouseleave', () => {
  document.querySelector('.alert-marquee').style.animationPlayState = 'running';
});

gridRefs.forEach(ref => {
  ref.addEventListener('mouseenter', () => {
    const randomOffset = (Math.random() * 4 - 2).toFixed(1);
    ref.style.transform = `translateX(${randomOffset}px)`;
    ref.style.color = '#ff0000';
    setTimeout(() => {
      ref.style.transform = 'translateX(0)';
      ref.style.color = '';
    }, 100);
  });
});

hourlyRows.forEach(row => {
  row.addEventListener('click', () => {
    row.classList.toggle('selected');
  });
});

const selectedRowStyle = document.createElement('style');
selectedRowStyle.textContent = `
  .hourly-table tr.selected {
    background: var(--info) !important;
    color: #ffffff !important;
    outline: 3px solid var(--fg);
    outline-offset: -3px;
  }
`;
document.head.appendChild(selectedRowStyle);

refreshBtn.addEventListener('click', handleRefresh);

document.addEventListener('DOMContentLoaded', () => {
  const initialTarget = parseInt(tempDisplay.dataset.target);
  animateTemperatureCounter(initialTarget);
  updateSystemClock();
  setInterval(updateSystemClock, 1000);
  updateCurrentHourHighlight();
  setInterval(updateCurrentHourHighlight, 60000);
});