/* =========================================
   NEXUS COMMAND // INTERACTIVITY SCRIPTS
   Version: 4.7.2
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. SYSTEM CLOCK ---
  function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}:${seconds} UTC`;
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- 2. BOOT ANIMATIONS ---
  function initAnimations() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
      // Set initial state via JS to ensure it's only hidden if JS runs
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(20px) scale(0.98)';
      panel.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      
      // Staggered reveal
      setTimeout(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0) scale(1)';
      }, 100 + (index * 60));
    });

    // Animate the fleet markers
    const markers = document.querySelectorAll('.fleet-marker');
    markers.forEach((marker, index) => {
      marker.style.animationDelay = `${index * 0.5}s`;
    });
  }

  // --- 3. STAR MAP INTERACTIVITY (TOOLTIPS) ---
  function initMapInteractivity() {
    const starNodes = document.querySelectorAll('.star-node');
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'star-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(3, 6, 18, 0.95);
      border: 1px solid var(--cyan);
      padding: 8px 12px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: var(--text-main);
      pointer-events: none;
      z-index: 1000;
      display: none;
      box-shadow: 0 0 15px var(--cyan-glow);
      backdrop-filter: blur(4px);
      border-radius: 2px;
    `;
    document.body.appendChild(tooltip);

    starNodes.forEach(node => {
      const sector = node.dataset.sector;
      
      node.addEventListener('mouseenter', (e) => {
        // Randomize data for simulation
        const status = node.classList.contains('allied') ? 'SECURE' : 
                       node.classList.contains('contested') ? 'CONTESTED' : 'HOSTILE';
        const pop = Math.floor(Math.random() * 500000).toLocaleString();
        
        tooltip.innerHTML = `
          <div style="color:var(--cyan); font-weight:bold; margin-bottom:4px;">SECTOR ${sector}</div>
          <div>STATUS: <span style="color:${status === 'SECURE' ? 'var(--green)' : status === 'CONTESTED' ? 'var(--amber)' : 'var(--red)'}">${status}</span></div>
          <div>POP: ${pop}</div>
          <div>RESOURCES: ${['High', 'Medium', 'Low', 'Trace'][Math.floor(Math.random() * 4)]}</div>
        `;
        tooltip.style.display = 'block';
        node.style.zIndex = '10';
      });

      node.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
      });

      node.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        node.style.zIndex = '2';
      });
    });
  }

  // --- 4. LIVE DATA SIMULATION ---
  function initDataSimulation() {
    // Simulate fluctuating resource rates
    const resourceRates = document.querySelectorAll('.resource-rate');
    
    setInterval(() => {
      // Pick a random resource to update
      const randomRate = resourceRates[Math.floor(Math.random() * resourceRates.length)];
      
      // Parse current value
      const text = randomRate.textContent;
      const val = parseInt(text.replace(/[^0-9-]/g, ''));
      
      // Random fluctuation
      const fluctuation = Math.floor(Math.random() * 200) - 100;
      const newVal = val + fluctuation;
      
      // Update DOM
      const isPositive = newVal >= 0;
      randomRate.textContent = `${isPositive ? '+' : ''}${newVal.toLocaleString()}/h`;
      randomRate.className = `resource-rate ${isPositive ? 'positive' : 'negative'}`;
      
      // Flash effect
      randomRate.style.textShadow = isPositive ? '0 0 5px var(--green)' : '0 0 5px var(--red)';
      setTimeout(() => {
        randomRate.style.textShadow = 'none';
      }, 500);
      
    }, 2000);

    // Simulate Market Board price changes
    const marketRows = document.querySelectorAll('.market-table tbody tr');
    
    setInterval(() => {
      const randomRow = marketRows[Math.floor(Math.random() * marketRows.length)];
      const priceCell = randomRow.querySelector('td:nth-child(2)');
      const changeCell = randomRow.querySelector('td:nth-child(3)');
      
      // Parse price
      const currentPrice = parseFloat(priceCell.textContent.replace('₮', ''));
      const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
      const newPrice = currentPrice * (1 + changePercent / 100);
      
      // Update
      priceCell.textContent = `₮${newPrice.toFixed(1)}`;
      const isUp = changePercent > 0;
      
      changeCell.textContent = `${isUp ? '▲' : '▼'}${Math.abs(changePercent).toFixed(1)}%`;
      changeCell.className = isUp ? 'up' : 'down';
      
      // Flash row
      randomRow.style.backgroundColor = isUp ? 'rgba(5, 255, 161, 0.1)' : 'rgba(255, 0, 60, 0.1)';
      setTimeout(() => {
        randomRow.style.backgroundColor = '';
      }, 800);
      
    }, 3500);

    // Simulate Fleet HP changes
    const fleetHpBars = document.querySelectorAll('.fleet-card .hp-fill');
    
    setInterval(() => {
      fleetHpBars.forEach(bar => {
        // Only update if deployed
        if (bar.closest('.deployed')) {
          let currentWidth = parseInt(bar.style.width);
          // Random small damage or repair
          const change = Math.random() > 0.7 ? -2 : 0; 
          if (change < 0 && currentWidth > 10) {
            bar.style.width = (currentWidth + change) + '%';
            // Update text
            const hpTextEl = bar.parentElement.nextElementSibling;
            if(hpTextEl) hpTextEl.textContent = (currentWidth + change) + '%';
          }
        }
      });
    }, 5000);
  }

  // --- 5. UI INTERACTIONS ---
  function initTabSwitching() {
    // Map Buttons
    const mapBtns = document.querySelectorAll('.map-btn');
    mapBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mapBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Leaderboard Tabs
    const lbTabs = document.querySelectorAll('.lb-tab');
    lbTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        lbTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
    
    // Pause Ticker on Hover
    const ticker = document.querySelector('.ticker-track');
    if (ticker) {
      ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
      });
      ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
      });
    }
  }

});