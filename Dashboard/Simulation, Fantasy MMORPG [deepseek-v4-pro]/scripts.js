(function() {
  const hexMap = document.getElementById('hexMap');
  const activityFeed = document.getElementById('activityFeed');
  const tooltip = document.getElementById('global-tooltip');
  const aetheriumCount = document.getElementById('aetherium-count');

  function generateHexMap() {
    if (!hexMap) return;
    const factions = ['iron', 'shadow', 'celestial', 'wild', 'contested'];
    const emojis = ['⚔️', '🛡️', '🏹', '🧙', '🐺', '👑', '💀', '🔥', '🌲', '🗡️'];
    const rows = 9;
    const cols = 12;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = document.createElement('div');
        tile.className = 'hex-tile';
        const faction = factions[Math.floor(Math.random() * factions.length)];
        tile.classList.add(faction);
        tile.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        tile.addEventListener('mouseenter', (e) => {
          tooltip.classList.remove('hidden');
          tooltip.textContent = `${faction.toUpperCase()} Territory (${r},${c}) | Influence: ${Math.floor(Math.random()*100)}%`;
          tooltip.style.left = e.clientX + 15 + 'px';
          tooltip.style.top = e.clientY + 15 + 'px';
        });
        tile.addEventListener('mouseleave', () => {
          tooltip.classList.add('hidden');
        });
        tile.addEventListener('mousemove', (e) => {
          tooltip.style.left = e.clientX + 15 + 'px';
          tooltip.style.top = e.clientY + 15 + 'px';
        });
        hexMap.appendChild(tile);
      }
    }
  }

  function simulateActivityFeed() {
    if (!activityFeed) return;
    const events = [
      { type: 'legendary', text: '🌟 <strong>Thrain</strong> discovered <span class="item-link">[Helm of Domination]</span> in the Lich King\'s Crypt!' },
      { type: 'rare', text: '⚔️ <strong>Silvermoon Ascendancy</strong> has declared war on <strong>Crimson Reavers</strong>!' },
      { type: 'common', text: '💀 <strong>Fenris</strong> was ambushed by <strong>Shadowmere</strong> agents in Duskwood.' },
      { type: 'epic', text: '🐉 <strong>World Boss:</strong> Ancient Dragon enraged! 12% health remaining.' },
      { type: 'rare', text: '🏆 <strong>Arcane Consortium</strong> completed the Grand Library research.' },
      { type: 'common', text: '📈 <strong>Trade:</strong> Moonleaf Herb supply shortage in Stormwind.' },
      { type: 'legendary', text: '👑 <strong>King\'s Council</strong> called an emergency summit in Ironforge.' },
      { type: 'rare', text: '🛡️ <strong>Iron Wolves</strong> successfully defended Stonewatch Keep.' }
    ];
    let index = 0;
    setInterval(() => {
      const event = events[index % events.length];
      const feedItem = document.createElement('div');
      feedItem.className = `feed-item ${event.type}`;
      feedItem.innerHTML = event.text;
      activityFeed.prepend(feedItem);
      if (activityFeed.children.length > 25) {
        activityFeed.removeChild(activityFeed.lastChild);
      }
      index++;
    }, 3200);
  }

  function updateAetherium() {
    if (!aetheriumCount) return;
    let count = 1247889;
    setInterval(() => {
      count += Math.floor(Math.random() * 120) - 30;
      aetheriumCount.textContent = count.toLocaleString();
    }, 2100);
  }

  function simulateMarketFluctuation() {
    const prices = document.querySelectorAll('.item-price');
    if (!prices.length) return;
    setInterval(() => {
      prices.forEach(price => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable';
        price.classList.remove('up', 'down', 'stable');
        price.classList.add(change);
      });
    }, 5000);
  }

  function animateSiegeBars() {
    const defenseBars = document.querySelectorAll('.defense-fill');
    setInterval(() => {
      defenseBars.forEach(bar => {
        const currentWidth = parseFloat(bar.style.width) || 50;
        const newWidth = Math.min(100, Math.max(5, currentWidth + (Math.random() * 8 - 4)));
        bar.style.width = newWidth + '%';
      });
    }, 4000);
  }

  function setupPanelInteraction() {
    document.querySelectorAll('.panel').forEach(panel => {
      panel.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN' || e.target.tagName === 'BUTTON') return;
        panel.style.borderColor = 'var(--gold)';
        setTimeout(() => { panel.style.borderColor = 'var(--border-dim)'; }, 300);
      });
    });
  }

  function initializeNodeTooltips() {
    document.querySelectorAll('.node').forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        tooltip.classList.remove('hidden');
        tooltip.textContent = node.textContent.replace(/\n/g, ' ') + ' | Diplomatic Status';
        tooltip.style.left = e.clientX + 15 + 'px';
        tooltip.style.top = e.clientY + 15 + 'px';
      });
      node.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
      node.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 15 + 'px';
        tooltip.style.top = e.clientY + 15 + 'px';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    generateHexMap();
    simulateActivityFeed();
    updateAetherium();
    simulateMarketFluctuation();
    animateSiegeBars();
    setupPanelInteraction();
    initializeNodeTooltips();
  });
})();