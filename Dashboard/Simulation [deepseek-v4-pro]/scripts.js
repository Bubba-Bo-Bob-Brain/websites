(function() {
  'use strict';

  const dataPingsContainer = document.getElementById('dataPingsContainer');
  const activeNodesSpan = document.getElementById('activeNodes');
  const alertCountSpan = document.getElementById('alertCount');
  const globalPopSpan = document.getElementById('globalPop');
  const simTimeSpan = document.getElementById('simTime');
  const tickerTrack = document.getElementById('tickerTrack');

  function createDataPings() {
    if (!dataPingsContainer) return;
    dataPingsContainer.innerHTML = '';
    for (let i = 0; i < 28; i++) {
      const ping = document.createElement('div');
      ping.className = 'ping';
      const x = Math.random() * 90 + 5;
      const y = Math.random() * 90 + 5;
      ping.style.left = x + '%';
      ping.style.top = y + '%';
      ping.style.animationDelay = Math.random() * 2 + 's';
      ping.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      dataPingsContainer.appendChild(ping);
    }
  }

  function updateDynamicValues() {
    if (activeNodesSpan) {
      const base = 1280;
      const variation = Math.floor(Math.random() * 20 - 10);
      activeNodesSpan.textContent = (base + variation).toLocaleString();
    }
    if (alertCountSpan) {
      const baseAlert = 42;
      const variationAlert = Math.floor(Math.random() * 6 - 2);
      alertCountSpan.textContent = baseAlert + variationAlert;
    }
    if (globalPopSpan) {
      const basePop = 11842901332;
      const growth = Math.floor(Math.random() * 500 + 100);
      const newPop = basePop + Math.floor(Date.now() / 1000) % 10000 + growth;
      globalPopSpan.textContent = newPop.toLocaleString();
    }
  }

  function updateSimTime() {
    if (!simTimeSpan) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    simTimeSpan.textContent = hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  }

  function duplicateTickerContent() {
    if (!tickerTrack) return;
    const originalHTML = tickerTrack.innerHTML;
    tickerTrack.innerHTML = originalHTML + originalHTML;
  }

  function initializeDashboard() {
    createDataPings();
    duplicateTickerContent();
    updateDynamicValues();
    updateSimTime();
    setInterval(updateDynamicValues, 3200);
    setInterval(updateSimTime, 80);
    setInterval(createDataPings, 12000);
  }

  window.addEventListener('DOMContentLoaded', initializeDashboard);
})();