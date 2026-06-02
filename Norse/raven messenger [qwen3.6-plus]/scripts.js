/* ============================================
   SCRIPTS.JS — Hrafnastafir Messenger Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const messagesContainer = document.getElementById('messages-container');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const realmNameEl = document.getElementById('realm-name');
  const channelItems = document.querySelectorAll('.channel-item');
  const runicToggleBtn = document.getElementById('runic-toggle');
  const ravenFlightOverlay = document.getElementById('raven-flight');
  const bifrostOverlay = document.getElementById('bifrost-overlay');

  // State
  let currentRealm = 'asgard';
  let runicMode = false;

  // Realm Data
  const realmData = {
    asgard: { name: 'Asgard', rune: 'ᚨ', desc: 'The realm of the Æsir — Where the halls of Odin stand eternal', color: '#d4a843' },
    midgard: { name: 'Midgard', rune: 'ᛗ', desc: 'The world of mortals — Connected to Yggdrasil at its heart', color: '#6b8c42' },
    helheim: { name: 'Helheim', rune: 'ᚺ', desc: 'The misty realm of the dead — Where Hel rules over the dishonored departed', color: '#7a6b8a' },
    jotunheim: { name: 'Jötunheim', rune: 'ᛃ', desc: 'The land of the giants — Wild, frozen, and ancient', color: '#4a7a8a' },
    vanaheim: { name: 'Vanaheim', rune: 'ᚹ', desc: 'Home of the Vanir gods — Fertility, wisdom, and prophecy', color: '#8a6b4a' },
    alfheim: { name: 'Álfheim', rune: 'ᚨ', desc: 'The shining realm of the Light Elves — Radiant and ethereal', color: '#b8a4d4' },
    svartalfheim: { name: 'Svartálfaheim', rune: 'ᛊ', desc: 'The underground forges of the Dwarves — Craftsmanship unmatched', color: '#6a6a6a' },
    muspelheim: { name: 'Múspellsheimr', rune: 'ᛗ', desc: 'The realm of fire — Surtr guards the flaming sword of destiny', color: '#c44a2a' },
    niflheim: { name: 'Niflheim', rune: 'ᚾ', desc: 'The world of ice and mist — Ancient, cold, and unforgiving', color: '#4a6a8a' },
    valhalla: { name: 'Valhǫll', rune: 'ᛟ', desc: 'The great hall of fallen warriors — Where Odin feasts with the Einherjar', color: '#d4a843' },
    folkvangr: { name: 'Fólkvangr', rune: 'ᚠ', desc: 'The field of the people — Freyja chooses the slain here first', color: '#c9a84c' }
  };

  // ==========================================
  // Initial Staggered Animation for Messages
  // ==========================================
  const initMessages = () => {
    const messages = document.querySelectorAll('.message');
    messages.forEach((msg, index) => {
      msg.style.animationDelay = `${index * 0.15}s`;
    });
  };

  // ==========================================
  // Sidebar Toggle (Mobile/Responsive)
  // ==========================================
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // ==========================================
  // Realm Channel Switching with Bifrost Effect
  // ==========================================
  channelItems.forEach(item => {
    item.addEventListener('click', () => {
      const realm = item.dataset.realm;
      if (realm === currentRealm) return;

      // Update active state
      channelItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentRealm = realm;

      // Trigger Bifrost transition
      triggerBifrost(realm);
    });
  });

  const triggerBifrost = (realm) => {
    const data = realmData[realm];
    if (!data) return;

    // Show Bifrost overlay
    bifrostOverlay.classList.add('active');
    bifrostOverlay.style.opacity = '1';

    // Update header after short delay
    setTimeout(() => {
      realmNameEl.innerHTML = `<span class="realm-rune">${data.rune}</span> ${data.name}`;
      document.querySelector('.realm-description').textContent = data.desc;
      
      // Clear and simulate realm switch
      messagesContainer.innerHTML = `
        <div class="message system-message">
          <div class="system-rune-divider">
            <span class="divider-rune">ᛊ</span>
            <span class="divider-line"></span>
            <span class="divider-rune">ᛊ</span>
          </div>
          <p class="system-text">Crossing the Bifröst to ${data.name}...</p>
        </div>
      `;
    }, 600);

    // Hide overlay
    setTimeout(() => {
      bifrostOverlay.classList.remove('active');
      bifrostOverlay.style.opacity = '0';
      
      // Simulate loading realm messages (mock)
      setTimeout(() => loadRealmMessages(realm), 200);
    }, 1500);
  };

  const loadRealmMessages = (realm) => {
    // Mock realm-specific messages based on selected realm
    const mockMessages = {
      midgard: [
        { sender: 'odin', name: 'Óðinn', title: 'Allfather', text: 'The mortals prepare their winter stores. I see them from Hliðskjálf.', time: 'Moments ago' },
        { sender: 'thor', name: 'Þórr', title: 'Thunder God', text: 'I shall bless their crops with rain and lightning.', time: 'Moments ago' }
      ],
      helheim: [
        { sender: 'loki', name: 'Loki', title: 'Trickster', text: 'Even the dead hear whispers of Ragnarök. The halls of Hel grow restless.', time: 'Moments ago' }
      ],
      jotunheim: [
        { sender: 'heimdall', name: 'Heimdallr', title: 'Watcher', text: 'Frost giants gather at the border. I see their banners of ice.', time: 'Moments ago' }
      ]
    };

    const messages = mockMessages[realm] || [
      { sender: 'odin', name: 'Óðinn', title: 'Allfather', text: `The ravens bring tidings from ${realm}. The realm holds its breath.`, time: 'Moments ago' }
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => addMessageToUI(msg), i * 200);
    });
  };

  // ==========================================
  // Message Input & Sending
  // ==========================================
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  const sendMessage = () => {
    const text = messageInput.value.trim();
    if (!text) return;

    // Trigger Raven Flight Animation
    triggerRavenFlight();

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Add message after flight animation
    setTimeout(() => {
      addMessageToUI({
        sender: 'you',
        name: 'You',
        title: 'Mortal Messenger',
        text: text,
        time: 'Just now',
        isUser: true
      });
    }, 1500);
  };

  const triggerRavenFlight = () => {
    ravenFlightOverlay.classList.add('active');
    
    // Hide after animation completes
    setTimeout(() => {
      ravenFlightOverlay.classList.remove('active');
    }, 1500);
  };

  const addMessageToUI = (msg) => {
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.dataset.sender = msg.sender || 'you';
    messageEl.dataset.timestamp = 'now';
    messageEl.style.opacity = '0';
    
    if (msg.isUser) {
      messageEl.style.alignSelf = 'flex-end';
      messageEl.style.flexDirection = 'row-reverse';
    }

    messageEl.innerHTML = `
      <div class="message-avatar odin-avatar">
        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#2a1f14" stroke="#6b8c42" stroke-width="2"/>
          <path d="M10 15 Q20 10 30 15" fill="none" stroke="#8a7a6a" stroke-width="1.5"/>
          <circle cx="14" cy="18" r="2.5" fill="#d4c4b0"/>
          <circle cx="26" cy="18" r="2.5" fill="#d4c4b0"/>
          <path d="M12 24 Q20 32 28 24" fill="none" stroke="#8a7a6a" stroke-width="1.5"/>
          <text x="16" y="34" font-size="6" fill="#6b8c42">ᛗ</text>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="sender-name" style="color: #d4c4b0;">${msg.name}</span>
          <span class="sender-title">${msg.title}</span>
          <span class="message-time">${msg.time}</span>
        </div>
        <div class="message-bubble">
          <div class="knotwork-border knotwork-top"></div>
          <p class="message-text ${runicMode ? 'runic-display' : ''}" data-normal="${msg.text}" data-runic="${toRunic(msg.text)}">
            ${runicMode ? toRunic(msg.text) : msg.text}
          </p>
          <div class="knotwork-border knotwork-bottom"></div>
        </div>
        <div class="message-delivered">
          <span class="delivered-icon">🐦‍⬛</span>
          <span class="delivered-text">Delivered by Muninn</span>
        </div>
      </div>
    `;

    messagesContainer.appendChild(messageEl);
    scrollToBottom();

    // Trigger animation
    requestAnimationFrame(() => {
      messageEl.style.animation = 'fadeInMessage 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
    });
  };

  // ==========================================
  // Runic Transliteration Toggle
  // ==========================================
  runicToggleBtn.addEventListener('click', () => {
    runicMode = !runicMode;
    runicToggleBtn.classList.toggle('active', runicMode);
    
    const allMessages = document.querySelectorAll('.message-text');
    allMessages.forEach(el => {
      const normal = el.dataset.normal;
      const runic = el.dataset.runic;
      
      if (normal && runic) {
        el.textContent = runicMode ? runic : normal;
        el.classList.toggle('runic-display', runicMode);
      }
    });
  });

  // Simple mock runic transliteration
  const toRunic = (text) => {
    const runeMap = {
      'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᚲ', 'D': 'ᛞ', 'E': 'ᛖ', 'F': 'ᚠ', 'G': 'ᚷ', 'H': 'ᚺ',
      'I': 'ᛁ', 'J': 'ᛃ', 'K': 'ᚲ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᛟ', 'P': 'ᛈ',
      'Q': 'ᛩ', 'R': 'ᚱ', 'S': 'ᛊ', 'T': 'ᛏ', 'U': 'ᚢ', 'V': 'ᚹ', 'W': 'ᚹ', 'X': 'ᛉ',
      'Y': 'ᛇ', 'Z': 'ᛉ', ' ': ' ', '.': '᛫', ',': '᛬', '!': '‼', '?': '⁇'
    };
    return text.toUpperCase().split('').map(char => runeMap[char] || char).join('');
  };

  // ==========================================
  // Auto-resize Textarea
  // ==========================================
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // ==========================================
  // Reaction Clicks
  // ==========================================
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('reaction')) {
      e.target.style.transform = 'scale(1.2)';
      setTimeout(() => {
        e.target.style.transform = '';
      }, 150);
      
      // Optional: Toggle active state
      e.target.classList.toggle('active-reaction');
    }
  });

  // ==========================================
  // Utility: Scroll to Bottom
  // ==========================================
  const scrollToBottom = () => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  };

  // ==========================================
  // Initialize
  // ==========================================
  initMessages();
  scrollToBottom();

  // Add a subtle ambient sound hint or visual pulse on first load
  setTimeout(() => {
    const titleEl = document.querySelector('.app-title');
    if (titleEl) {
      titleEl.style.textShadow = '0 2px 8px rgba(201, 168, 76, 0.8)';
      setTimeout(() => {
        titleEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.8), 0 0 8px var(--rune-glow)';
      }, 1000);
    }
  }, 2000);
});