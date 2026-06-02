const StarDate = {
  base: 47829.3,
  increment: 0.0001,
  current: 47829.3,

  tick() {
    this.current += this.increment;
    return this.current.toFixed(1);
  },

  format() {
    return this.tick();
  }
};

const UTCTime = {
  year: 2387,
  month: 11,
  day: 14,
  hour: 7,
  min: 42,
  sec: 19,

  tick() {
    this.sec++;
    if (this.sec >= 60) { this.sec = 0; this.min++; }
    if (this.min >= 60) { this.min = 0; this.hour++; }
    if (this.hour >= 24) { this.hour = 0; this.day++; }
    return `${this.year}-${String(this.month).padStart(2,'0')}-${String(this.day).padStart('0',2)} // ${String(this.hour).padStart(2,'0')}:${String(this.min).padStart(2,'0')}:${String(this.sec).padStart(2,'0')} UTC`;
  }
};

function updateClocks() {
  const sdEl = document.getElementById('stardate');
  const utcEl = document.getElementById('utc-time');
  if (sdEl) sdEl.textContent = StarDate.format();
  if (utcEl) utcEl.textContent = UTCTime.tick();
}

const HexMap = {
  rows: 10,
  cols: 18,
  cells: [],
  selectedCell: null,

  types: ['empty', 'friendly', 'hostile', 'neutral', 'contested', 'trade-route', 'anomaly'],
  typeWeights: [30, 20, 15, 20, 5, 5, 5],

  init() {
    const container = document.getElementById('hexmap');
    if (!container) return;
    container.innerHTML = '';
    this.cells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'hex-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        const type = this.randomType();
        if (type !== 'empty') {
          cell.classList.add(type);
        }

        if (Math.random() < 0.15) {
          cell.classList.add('has-fleet');
        }
        if (Math.random() < 0.08) {
          cell.classList.add('has-station');
        }

        cell.addEventListener('click', () => this.selectCell(cell, r, c));
        container.appendChild(cell);
        this.cells.push(cell);
      }
    }

    const selR = Math.floor(Math.random() * this.rows);
    const selC = Math.floor(Math.random() * this.cols);
    const idx = selR * this.cols + selC;
    if (this.cells[idx]) {
      this.cells[idx].classList.add('selected');
      this.selectedCell = this.cells[idx];
    }
  },

  randomType() {
    const total = this.typeWeights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < this.types.length; i++) {
      rand -= this.typeWeights[i];
      if (rand <= 0) return this.types[i];
    }
    return 'empty';
  },

  selectCell(cell, r, c) {
    if (this.selectedCell) {
      this.selectedCell.classList.remove('selected');
    }
    cell.classList.add('selected');
    this.selectedCell = cell;
  },

  pulseRandom() {
    if (this.cells.length === 0) return;
    const idx = Math.floor(Math.random() * this.cells.length);
    const cell = this.cells[idx];
    if (!cell) return;

    if (Math.random() < 0.3) {
      const hadFleet = cell.classList.contains('has-fleet');
      cell.classList.toggle('has-fleet', !hadFleet);
    }
  }
};

const Sparkline = {
  generate(width, height, color, points) {
    const data = [];
    let val = 50;
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.48) * 15;
      val = Math.max(5, Math.min(95, val));
      data.push(val);
    }

    const stepX = width / (points - 1);
    let pathD = '';
    const areaD = `M0,${height} `;

    for (let i = 0; i < points; i++) {
      const x = i * stepX;
      const y = height - (data[i] / 100) * height;
      pathD += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
      areaD += 'L' + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    areaD += 'L' + width + ',' + height + ' Z';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#sg)"/>
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },

  render() {
    const configs = [
      { id: 'spark-ti', w: 32, h: 14, color: '#448aff', pts: 12 },
      { id: 'spark-du', w: 32, h: 14, color: '#448aff', pts: 12 },
      { id: 'spark-tr', w: 32, h: 14, color: '#448aff', pts: 12 },
      { id: 'spark-el', w: 32, h: 14, color: '#00e676', pts: 12 },
      { id: 'spark-dm', w: 32, h: 14, color: '#00e676', pts: 12 },
      { id: 'spark-cm', w: 32, h: 14, color: '#00e5ff', pts: 12 },
      { id: 'mkt-ti', w: 30, h: 12, color: '#448aff', pts: 10 },
      { id: 'mkt-du', w: 30, h: 12, color: '#ff1744', pts: 10 },
      { id: 'mkt-tr', w: 30, h: 12, color: '#00e676', pts: 10 },
      { id: 'mkt-el', w: 30, h: 12, color: '#00e676', pts: 10 },
      { id: 'mkt-dm', w: 30, h: 12, color: '#00e676', pts: 10 },
      { id: 'mkt-cm', w: 30, h: 12, color: '#ff1744', pts: 10 },
      { id: 'mkt-en', w: 30, h: 12, color: '#00e676', pts: 10 },
      { id: 'mkt-sp', w: 30, h: 12, color: '#ff1744', pts: 10 },
    ];

    configs.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (el) {
        el.innerHTML = this.generate(cfg.w, cfg.h, cfg.color, cfg.pts);
      }
    });
  }
};

const ResourceTicker = {
  resources: {
    credits: { value: 847.2, change: 12.4, unit: 'M' },
    influence: { value: 14.8, change: 89, unit: 'K' },
    alloy: { value: 312, change: -2.1, unit: 'K' },
    rare: { value: 8429, change: 340, unit: '' },
    elerium: { value: 12.8, change: 120, unit: 'K' }
  },

  tick() {
    const r = this.resources;
    r.credits.value += r.change / 3600;
    r.influence.value += r.change / 3600;
    r.alloy.value += r.change / 3600;
    r.rare.value += r.change / 3600;
    r.elerium.value += r.change / 3600;

    const updatePill = (id, val, unit, change) => {
      const pill = document.getElementById(id);
      if (!pill) return;
      const valEl = pill.querySelector('.res-value');
      const changeEl = pill.querySelector('.res-change');
      if (valEl) {
        if (unit === 'M') valEl.textContent = val.toFixed(1) + 'M';
        else if (unit === 'K') valEl.textContent = val.toFixed(1) + 'K';
        else valEl.textContent = Math.floor(val).toLocaleString();
      }
      if (changeEl) {
        const prefix = change >= 0 ? '+' : '';
        changeEl.textContent = prefix + (unit === 'K' ? change + '/h' : (unit === 'M' ? change + 'M/h' : change + '/h'));
        changeEl.className = 'res-change ' + (change >= 0 ? 'up' : 'down');
      }
    };

    updatePill('res-credits', r.credits.value, 'M', r.credits.change);
    updatePill('res-influence', r.influence.value, 'K', r.influence.change);
    updatePill('res-alloy', r.alloy.value, 'K', r.alloy.change);
    updatePill('res-rare', r.rare.value, '', r.rare.change);
    updatePill('res-elerium', r.elerium.value, 'K', r.elerium.change);
  }
};

const IntelFeed = {
  entries: [
    { time: '07:20:44', tag: 'defense', tagLabel: 'DEFENSE', text: 'Perimeter sensors recalibrated. Detection range increased by 8%.', type: '' },
    { time: '07:19:31', tag: 'colony', tagLabel: 'COLONY', text: 'Keth-3 mining colony reports equipment malfunction in shaft 7.', type: 'warning' },
    { time: '07:17:58', tag: 'exploration', tagLabel: 'EXPLORE', text: 'Anomalous gravitational readings detected near Sector 44Z.', type: '' },
    { time: '07:16:22', tag: 'economy', tagLabel: 'ECONOMY', text: 'Global alloy prices stabilized after market correction.', type: 'positive' },
    { time: '07:14:45', tag: 'diplomacy', tagLabel: 'DIPLOMACY', text: 'Neutral Zone Council proposes trade negotiations. Awaiting response.', type: '' },
    { time: '07:12:03', tag: 'combat', tagLabel: 'COMBAT', text: 'Beta Patrol Wing reports clearing Sector 3A of hostile scouts.', type: 'positive' },
    { time: '07:10:37', tag: 'research', tagLabel: 'RESEARCH', text: 'Antimatter Lance efficiency tests exceeded expectations by 12%.', type: 'positive' },
    { time: '07:08:55', tag: 'fleet', tagLabel: 'FLEET', text: 'Gamma Defense fleet completed resupply at Kepler-4.', type: '' },
    { time: '07:06:12', tag: 'market', tagLabel: 'MARKET', text: 'Crystal Matrix supply shortage detected. Prices expected to rise.', type: 'warning' },
    { time: '07:04:28', tag: 'piracy', tagLabel: 'PIRACY', text: 'Pirate activity decreased in Sector 15C following patrol increase.', type: 'positive' },
  ],

  addEntry() {
    const feed = document.getElementById('intel-feed');
    if (!feed) return;

    const entry = this.entries[Math.floor(Math.random() * this.entries.length)];
    const now = UTCTime;
    const timeStr = `${String(now.hour).padStart(2,'0')}:${String(now.min).padStart(2,'0')}:${String(now.sec).padStart(2,'0')}`;

    const item = document.createElement('div');
    item.className = 'intel-item' + (entry.type ? ' ' + entry.type : '');
    item.innerHTML = `
      <span class="intel-time">${timeStr}</span>
      <span class="intel-tag ${entry.tag}">${entry.tagLabel}</span>
      <span class="intel-text">${entry.text}</span>
    `;

    feed.insertBefore(item, feed.firstChild);

    while (feed.children.length > 20) {
      feed.removeChild(feed.lastChild);
    }

    item.style.animation = 'none';
    item.offsetHeight;
    item.style.animation = '';
  }
};

const FleetCardAnimator = {
  tick() {
    const fills = document.querySelectorAll('.fleet-card .bar-fill');
    fills.forEach(fill => {
      const currentWidth = parseFloat(fill.style.width);
      if (isNaN(currentWidth)) return;

      let delta = (Math.random() - 0.5) * 3;
      if (fill.classList.contains('shield')) delta = (Math.random() - 0.45) * 4;
      if (fill.classList.contains('fuel')) delta = -Math.random() * 0.5;

      let newWidth = currentWidth + delta;
      newWidth = Math.max(5, Math.min(100, newWidth));
      fill.style.width = newWidth + '%';

      const span = fill.closest('.fleet-bar')?.querySelector('span');
      if (span) span.textContent = Math.round(newWidth) + '%';
    });
  }
};

const ResearchAnimator = {
  tick() {
    const activeFills = document.querySelectorAll('.research-fill:not(.queued)');
    activeFills.forEach(fill => {
      const currentWidth = parseFloat(fill.style.width);
      if (isNaN(currentWidth) || currentWidth >= 100) return;

      const increment = 0.01 + Math.random() * 0.02;
      let newWidth = Math.min(100, currentWidth + increment);
      fill.style.width = newWidth + '%';

      const pctEl = fill.closest('.research-item')?.querySelector('.research-pct');
      if (pctEl) {
        const baseText = pctEl.textContent;
        const timeMatch = baseText.match(/— (.+?) remaining/);
        const timeStr = timeMatch ? ' — ' + timeMatch[1] + ' remaining' : '';
        pctEl.textContent = Math.round(newWidth) + '%' + timeStr;
      }
    });
  }
};

const CommChannels = {
  currentChannel: 'ALLIANCE',
  messages: {
    ALLIANCE: [
      { sender: 'admiral', name: 'ADM. KIRA SOLEN', text: 'Maintain defensive formation at 7G. Await orders.' },
      { sender: 'ally', name: 'CMDR. TORVEX (Sol Conf)', text: 'Carrier groups en route. ETA 45 min.' },
      { sender: 'ally', name: 'CMDR. NEXUS (Andromeda)', text: 'Science team assigned to Precursor signal.' },
    ],
    FEDERATION: [
      { sender: 'command', name: 'FEDERATION HQ', text: 'Weekly objectives updated. Check mission board.' },
      { sender: 'admiral', name: 'GRAND ADM. THANE', text: 'All admirals: Strategic briefing at 1400 hours.' },
      { sender: 'ally', name: 'SENATOR VEX', text: 'Defense budget approved. +15% ship production.' },
    ],
    TRADE: [
      { sender: 'trade', name: 'TRADE GUILD', text: 'Elerium prices spiking. Sell now.' },
      { sender: 'trade', name: 'MARKET MAKER', text: 'New trade route TF-9901 available: Kepler to Rim.' },
      { sender: 'trade', name: 'BROKER XAN', text: 'Crystal Matrix futures up 22%. Strong buy signal.' },
    ],
    INTEL: [
      { sender: 'intel', name: 'INTEL OPS', text: 'Velari fleet composition: 2 DN, 8 CR, 22 FR, 16 CV.' },
      { sender: 'intel', name: 'DEEP SCAN', text: 'Unidentified signal pattern detected in Sector 44Z.' },
      { sender: 'intel', name: 'SIGINT', text: 'Decrypted Velari comms suggest planned offensive in 48h.' },
    ],
    COMMAND: [
      { sender: 'command', name: 'FLEET CMD', text: 'Alpha Strike Group shields at 45%. Requesting support.' },
      { sender: 'command', name: 'NAVY OPS', text: 'All ships: Update navigation charts to v4.7.2.' },
      { sender: 'command', name: 'LOGISTICS', text: 'Fuel reserves at 73%. Recommend conservation protocols.' },
    ]
  },

  init() {
    const tabs = document.querySelectorAll('.channel-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentChannel = tab.textContent.trim();
      });
    });

    const sendBtn = document.getElementById('comm-send');
    const input = document.getElementById('comm-input');

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => this.sendMessage(input));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.sendMessage(input);
      });
    }
  },

  sendMessage(input) {
    const text = input.value.trim();
    if (!text) return;

    const feed = document.getElementById('comm-messages');
    if (!feed) return;

    const now = UTCTime;
    const timeStr = `${String(now.hour).padStart(2,'0')}:${String(now.min).padStart(2,'0')}`;

    const msg = document.createElement('div');
    msg.className = 'comm-msg';
    msg.innerHTML = `
      <span class="comm-time">${timeStr}</span>
      <span class="comm-sender admiral">CMDR. VEX ATHREN:</span>
      <span class="comm-text">${text}</span>
    `;
    feed.appendChild(msg);
    feed.scrollTop = feed.scrollHeight;
    input.value = '';

    setTimeout(() => this.autoReply(feed), 1000 + Math.random() * 2000);
  },

  autoReply(feed) {
    const channelMsgs = this.messages[this.currentChannel];
    if (!channelMsgs || channelMsgs.length === 0) return;
    const reply = channelMsgs[Math.floor(Math.random() * channelMsgs.length)];

    const now = UTCTime;
    const timeStr = `${String(now.hour).padStart(2,'0')}:${String(now.min).padStart(2,'0')}`;

    const msg = document.createElement('div');
    msg.className = 'comm-msg';
    msg.innerHTML = `
      <span class="comm-time">${timeStr}</span>
      <span class="comm-sender ${reply.sender}">${reply.name}:</span>
      <span class="comm-text">${reply.text}</span>
    `;
    feed.appendChild(msg);
    feed.scrollTop = feed.scrollHeight;
  },

  addRandomMessage() {
    const channels = Object.keys(this.messages);
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const msgs = this.messages[channel];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];

    const feed = document.getElementById('comm-messages');
    if (!feed) return;

    const now = UTCTime;
    const timeStr = `${String(now.hour).padStart(2,'0')}:${String(now.min).padStart(2,'0')}`;

    const el = document.createElement('div');
    el.className = 'comm-msg';
    el.innerHTML = `
      <span class="comm-time">${timeStr}</span>
      <span class="comm-sender ${msg.sender}">${msg.name}:</span>
      <span class="comm-text">${msg.text}</span>
    `;
    feed.appendChild(el);
    feed.scrollTop = feed.scrollHeight;

    while (feed.children.length > 12) {
      feed.removeChild(feed.firstChild);
    }
  }
};

const MarketTicker = {
  tick() {
    const sparkCells = document.querySelectorAll('.spark-cell');
    sparkCells.forEach(cell => {
      if (!cell.querySelector('svg')) return;
      const paths = cell.querySelectorAll('path');
      if (paths.length < 2) return;

      const linePath = paths[0];
      const d = linePath.getAttribute('d');
      if (!d) return;

      const nums = d.match(/[\d.]+/g);
      if (!nums || nums.length < 4) return;

      const shifted = [];
      for (let i = 0; i < nums.length; i += 2) {
        const x = parseFloat(nums[i]);
        let y = parseFloat(nums[i + 1]);
        y += (Math.random() - 0.48) * 3;
        y = Math.max(2, Math.min(12, y));
        shifted.push(x.toFixed(1), y.toFixed(1));
      }

      let newD = 'M' + shifted[0] + ',' + shifted[1];
      for (let i = 2; i < shifted.length; i += 2) {
        newD += ' L' + shifted[i] + ',' + shifted[i + 1];
      }
      linePath.setAttribute('d', newD);
    });
  }
};

const BarAnimator = {
  tick() {
    const miniFills = document.querySelectorAll('.mini-fill');
    miniFills.forEach(fill => {
      const current = parseFloat(fill.style.width);
      if (isNaN(current)) return;
      const delta = (Math.random() - 0.48) * 2;
      const newWidth = Math.max(5, Math.min(100, current + delta));
      fill.style.width = newWidth + '%';
    });

    const defenseFills = document.querySelectorAll('.defense-fill');
    defenseFills.forEach(fill => {
      const current = parseFloat(fill.style.width);
      if (isNaN(current)) return;
      let delta = (Math.random() - 0.5) * 1;
      if (fill.classList.contains('shield')) delta = (Math.random() - 0.45) * 0.8;
      const newWidth = Math.max(5, Math.min(100, current + delta));
      fill.style.width = newWidth + '%';
    });

    const qFills = document.querySelectorAll('.q-fill:not(.complete)');
    qFills.forEach(fill => {
      const current = parseFloat(fill.style.width);
      if (isNaN(current)) return;
      const increment = 0.005 + Math.random() * 0.01;
      const newWidth = Math.min(100, current + increment);
      fill.style.width = newWidth + '%';
    });

    const objFills = document.querySelectorAll('.obj-fill');
    objFills.forEach(fill => {
      const current = parseFloat(fill.style.width);
      if (isNaN(current)) return;
      const increment = Math.random() * 0.005;
      const newWidth = Math.min(100, current + increment);
      fill.style.width = newWidth + '%';
    });
  }
};

const TickerDup = {
  init() {
    const ticker = document.getElementById('ticker');
    if (!ticker) return;
    const items = ticker.innerHTML;
    ticker.innerHTML = items + items;
  }
};

function init() {
  HexMap.init();
  Sparkline.render();
  TickerDup.init();
  CommChannels.init();

  setInterval(updateClocks, 1000);
  setInterval(() => ResourceTicker.tick(), 5000);
  setInterval(() => HexMap.pulseRandom(), 2000);
  setInterval(() => FleetCardAnimator.tick(), 3000);
  setInterval(() => ResearchAnimator.tick(), 5000);
  setInterval(() => BarAnimator.tick(), 4000);
  setInterval(() => MarketTicker.tick(), 3000);
  setInterval(() => IntelFeed.addEntry(), 8000);
  setInterval(() => CommChannels.addRandomMessage(), 12000);

  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.color = '#00e5ff';
      setTimeout(() => { this.style.color = ''; }, 300);
    });
  });

  setInterval(() => {
    Sparkline.render();
  }, 30000);
}

document.addEventListener('DOMContentLoaded', init);