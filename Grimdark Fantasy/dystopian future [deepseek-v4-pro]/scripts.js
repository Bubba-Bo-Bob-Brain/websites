document.addEventListener('DOMContentLoaded', () => {
  const dateTimeElement = document.getElementById('live-datetime');
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.panel');
  const resistanceMap = document.getElementById('resistance-map');
  const connectionsSvg = document.getElementById('connections-svg');
  const modalOverlay = document.getElementById('node-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const nodes = document.querySelectorAll('.node');

  function updateDateTime() {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' // ').slice(0, 22);
    if (dateTimeElement) {
      dateTimeElement.textContent = formatted;
    }
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  function switchPanel(panelId) {
    panels.forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(`panel-${panelId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    navItems.forEach(item => {
      const itemPanel = item.getAttribute('data-panel');
      if (itemPanel === panelId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const panelId = item.getAttribute('data-panel');
      if (panelId) {
        switchPanel(panelId);
      }
    });
  });

  function drawConnections() {
    if (!resistanceMap || !connectionsSvg) return;
    const mapRect = resistanceMap.getBoundingClientRect();
    const nodeElements = resistanceMap.querySelectorAll('.node');
    const nodePositions = [];

    nodeElements.forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      const centerX = nodeRect.left + nodeRect.width / 2 - mapRect.left;
      const centerY = nodeRect.top + nodeRect.height / 2 - mapRect.top;
      nodePositions.push({ x: centerX, y: centerY });
    });

    let pathData = '';
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (Math.random() > 0.45) {
          pathData += `M${nodePositions[i].x},${nodePositions[i].y} L${nodePositions[j].x},${nodePositions[j].y} `;
        }
      }
    }

    connectionsSvg.innerHTML = `<path d="${pathData}" stroke="#3a5068" stroke-width="1.2" fill="none" opacity="0.5" stroke-dasharray="4 4"/>`;
    connectionsSvg.style.width = mapRect.width + 'px';
    connectionsSvg.style.height = mapRect.height + 'px';
  }

  window.addEventListener('resize', drawConnections);
  setTimeout(drawConnections, 200);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'panel-resistance' && mutation.target.classList.contains('active')) {
        setTimeout(drawConnections, 50);
      }
    });
  });

  const resistancePanel = document.getElementById('panel-resistance');
  if (resistancePanel) {
    observer.observe(resistancePanel, { attributes: true, attributeFilter: ['class'] });
  }

  function openNodeModal(node) {
    const info = node.getAttribute('data-info') || 'UNKNOWN NODE';
    modalBody.textContent = `ACCESSING: ${info} ... CONNECTION ENCRYPTED. SIGNAL TRACE DETECTED.`;
    modalOverlay.classList.add('visible');
  }

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      openNodeModal(node);
    });
  });

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('visible');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('visible');
    }
  });

  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    const tickerItem = tickerTrack.querySelector('.ticker-item');
    if (tickerItem) {
      tickerItem.addEventListener('animationiteration', () => {
        tickerItem.style.animation = 'none';
        tickerItem.offsetHeight;
        tickerItem.style.animation = 'ticker-scroll 14s linear infinite';
      });
    }
  }

  const corruptionTexts = document.querySelectorAll('.data-corruption-effect p');
  corruptionTexts.forEach(text => {
    setInterval(() => {
      const original = text.textContent;
      const chars = original.split('');
      const randomIndex = Math.floor(Math.random() * chars.length);
      if (chars[randomIndex] !== ' ' && chars[randomIndex] !== ':') {
        chars[randomIndex] = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        text.textContent = chars.join('');
        setTimeout(() => {
          text.textContent = original;
        }, 120);
      }
    }, 2200);
  });
});