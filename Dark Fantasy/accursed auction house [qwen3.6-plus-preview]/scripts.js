/* ============================================
   THE OBSIDIAN EXCHANGE — JAVASCRIPT MASTER
   Dark Fantasy Auction House
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- STATE MANAGEMENT ----------
  const state = {
    userBalance: 2450,
    activeFilter: 'all',
    activeSort: 'ending',
    modalOpen: false,
    currentItem: null,
    timers: {},
    bidders: [
      'Morwen the Soulless', 'Xarathos the Undying', 'Lady Nyx of the Shadow Court',
      'Grimwald the Cursed', 'Seraphine Blackthorn', 'Azrael', 'Wraith of the Veil',
      'Death\'s Herald', 'The Hollow One', 'Phantom of the Abyss', 'Specter of Lost Hope',
      'Kael\'thas the Betrayer', 'Vespera Nightshade', 'Thorne of the Blackwood'
    ],
    items: [
      { id: 1, title: 'The Soul-Drinker\'s Blade', category: 'weapons', currentBid: 1247, minIncrement: 50, endTime: null, rarity: 'legendary', curseLevel: 5, icon: '⚔️', topBidder: 'Morwen the Soulless' },
      { id: 2, title: 'The Whispering Crown of the Mad King', category: 'artifacts', currentBid: 2891, minIncrement: 100, endTime: null, rarity: 'mythical', curseLevel: 4, icon: '👑', topBidder: 'Xarathos the Undying' },
      { id: 3, title: 'Candelabra of the Seventh Circle', category: 'relics', currentBid: 892, minIncrement: 25, endTime: null, rarity: 'rare', curseLevel: 3, icon: '🕯️', topBidder: 'Lady Nyx' },
      { id: 4, title: 'Eye of the Void Serpent', category: 'relics', currentBid: 3456, minIncrement: 150, endTime: null, rarity: 'legendary', curseLevel: 5, icon: '👁️', topBidder: 'Grimwald the Cursed' },
      { id: 5, title: 'Necromancer\'s Grimoire of the Flesh-Weaver', category: 'tomes', currentBid: 4201, minIncrement: 200, endTime: null, rarity: 'mythical', curseLevel: 5, icon: '📖', topBidder: 'Seraphine Blackthorn' },
      { id: 6, title: 'Blood-Infused Phylactery of Lord Vexis', category: 'relics', currentBid: 1678, minIncrement: 75, endTime: null, rarity: 'rare', curseLevel: 2, icon: '💎', topBidder: 'Kael\'thas' },
      { id: 7, title: 'Dagger of Betrayal', category: 'weapons', currentBid: 987, minIncrement: 50, endTime: null, rarity: 'legendary', curseLevel: 4, icon: '🗡️', topBidder: 'Vespera Nightshade' },
      { id: 8, title: 'Orb of Forgotten Souls', category: 'artifacts', currentBid: 5432, minIncrement: 250, endTime: null, rarity: 'mythical', curseLevel: 5, icon: '🔮', topBidder: 'Thorne' }
    ]
  };

  // Initialize end times (randomized for demo)
  const now = Date.now();
  state.items.forEach((item, index) => {
    // Spread end times: 30m to 12h
    const randomMinutes = 30 + Math.floor(Math.random() * 700);
    item.endTime = new Date(now + randomMinutes * 60000);
  });

  // ---------- DOM ELEMENTS ----------
  const els = {
    sealOverlay: document.getElementById('curse-seal-overlay'),
    breakSealBtn: document.getElementById('break-seal-btn'),
    nav: document.getElementById('main-nav'),
    hero: document.getElementById('hero'),
    grid: document.getElementById('auction-grid'),
    filterBtns: document.querySelectorAll('.filter-btn[data-filter]'),
    sortBtns: document.querySelectorAll('.sort-btn[data-sort]'),
    modal: document.getElementById('item-modal'),
    modalBackdrop: document.querySelector('.modal-backdrop'),
    modalClose: document.querySelector('.modal-close'),
    modalContent: document.querySelector('.modal-content'),
    toast: document.getElementById('notification-toast'),
    toastTitle: document.getElementById('toast-title'),
    toastMessage: document.getElementById('toast-message'),
    currencyDisplay: document.getElementById('soul-shards'),
    bloodDripContainer: document.getElementById('blood-drip-container'),
    embersContainer: document.querySelector('.embers-container')
  };

  // ---------- INITIALIZATION ----------
  function init() {
    setupSeal();
    setupAtmosphere();
    setupNavigation();
    setupFilters();
    setupGridInteractions();
    setupModal();
    setupBidding();
    startTimers();
    observeScrollAnimations();
  }

  // ---------- CURSE SEAL ----------
  function setupSeal() {
    els.breakSealBtn.addEventListener('click', () => {
      // Blood drip effect on click
      createBloodDrips(window.innerWidth / 2, window.innerHeight / 2, 10);
      
      // Play sound (optional/simulated visually)
      els.sealOverlay.classList.add('broken');
      
      // Reveal content
      setTimeout(() => {
        els.sealOverlay.style.display = 'none';
        els.hero.classList.add('visible');
        els.nav.classList.add('visible');
        document.body.style.overflow = 'auto';
      }, 1200);
    });

    // Prevent scroll initially
    document.body.style.overflow = 'hidden';
  }

  // ---------- ATMOSPHERE EFFECTS ----------
  function setupAtmosphere() {
    // Generate embers
    for (let i = 0; i < 15; i++) {
      const ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = Math.random() * 100 + '%';
      ember.style.animationDuration = (10 + Math.random() * 10) + 's';
      ember.style.animationDelay = Math.random() * 10 + 's';
      els.embersContainer.appendChild(ember);
    }
  }

  function createBloodDrips(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      const drip = document.createElement('div');
      drip.className = 'blood-drip';
      const offsetX = x + (Math.random() - 0.5) * 50;
      drip.style.left = offsetX + 'px';
      drip.style.top = y + 'px';
      drip.style.animationDuration = (1 + Math.random()) + 's';
      els.bloodDripContainer.appendChild(drip);
      setTimeout(() => drip.remove(), 2500);
    }
  }

  // ---------- NAVIGATION ----------
  function setupNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---------- FILTERS & SORTING ----------
  function setupFilters() {
    // Category filters
    els.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        els.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.dataset.filter;
        renderGrid();
      });
    });

    // Sort filters
    els.sortBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        els.sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSort = btn.dataset.sort;
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const items = state.items.filter(item => 
      state.activeFilter === 'all' || item.category === state.activeFilter
    );

    // Sort items
    if (state.activeSort === 'ending') {
      items.sort((a, b) => a.endTime - b.endTime);
    } else if (state.activeSort === 'price-high') {
      items.sort((a, b) => b.currentBid - a.currentBid);
    } else if (state.activeSort === 'newest') {
      items.sort((a, b) => b.id - a.id); // Higher ID = newer in this demo
    }

    // Reorder DOM elements
    items.forEach(item => {
      const el = document.querySelector(`[data-id="${item.id}"]`);
      if (el) els.grid.appendChild(el);
    });

    // Trigger visibility check
    setTimeout(observeScrollAnimations, 50);
  }

  // ---------- GRID INTERACTIONS ----------
  function setupGridInteractions() {
    // Card hover effects
    document.querySelectorAll('.auction-item').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        createBloodDrips(rect.left + rect.width / 2, rect.bottom, 1);
      });
    });
  }

  // ---------- MODAL ----------
  function setupModal() {
    // Open modal on "Lore" or card click
    document.querySelectorAll('.lore-btn, .item-card').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (e.target.closest('.bid-btn')) return; // Don't open if clicking bid button
        const id = parseInt(trigger.dataset.itemId || trigger.closest('.auction-item').dataset.id);
        openModal(id);
      });
    });

    // Close modal
    els.modalClose.addEventListener('click', closeModal);
    els.modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.modalOpen) closeModal();
    });
  }

  function openModal(itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    state.currentItem = item;
    state.modalOpen = true;

    // Populate modal
    document.getElementById('modal-icon').textContent = item.icon;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-category').textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    document.getElementById('modal-rarity').textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
    document.getElementById('modal-rarity').className = `meta-value rarity-${item.rarity}`;
    document.getElementById('modal-curse-level').querySelector('.curse-dots').textContent = '⛧'.repeat(item.curseLevel);
    document.getElementById('modal-lot').textContent = `Lot #00${item.id}`;
    
    updateModalBidDisplay();
    updateModalCountdown();

    // Reset bid input
    const input = document.getElementById('bid-input');
    input.value = '';
    input.min = item.currentBid + item.minIncrement;
    input.placeholder = `Min ${item.currentBid + item.minIncrement}`;

    // Generate random lore snippet if not present (for demo purposes, though HTML has static text)
    // In a real app, this would fetch from API. Here we just show the modal.

    els.modal.classList.remove('hidden');
    // Force reflow for transition
    void els.modal.offsetWidth;
    els.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Generate spectral bidders
    generateSpectralBidders();
  }

  function closeModal() {
    els.modal.classList.remove('active');
    setTimeout(() => {
      els.modal.classList.add('hidden');
      state.modalOpen = false;
      state.currentItem = null;
      document.body.style.overflow = 'auto';
    }, 300);
  }

  function updateModalBidDisplay() {
    const item = state.currentItem;
    document.querySelector('#modal-current-bid .amount').textContent = item.currentBid.toLocaleString();
    document.getElementById('modal-top-bidder').innerHTML = `Held by: <em>${item.topBidder}</em>`;
  }

  function updateModalCountdown() {
    const item = state.currentItem;
    if (!item) return;

    const diff = item.endTime - Date.now();
    if (diff <= 0) {
      document.getElementById('modal-hours').textContent = '00';
      document.getElementById('modal-minutes').textContent = '00';
      document.getElementById('modal-seconds').textContent = '00';
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('modal-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('modal-minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('modal-seconds').textContent = String(s).padStart(2, '0');
  }

  function generateSpectralBidders() {
    const container = document.getElementById('spectral-bidders-list');
    container.innerHTML = '';
    const count = 4 + Math.floor(Math.random() * 4);
    const shuffled = [...state.bidders].sort(() => 0.5 - Math.random()).slice(0, count);
    
    shuffled.forEach((name, i) => {
      const bidder = document.createElement('div');
      bidder.className = 'spectral-bidder';
      bidder.style.animationDelay = `${i * 0.2}s`;
      bidder.innerHTML = `
        <span class="spectral-avatar">${Math.random() > 0.5 ? '💀' : '👻'}</span>
        <span class="spectral-name">${name}</span>
      `;
      container.appendChild(bidder);
    });
  }

  // ---------- BIDDING ----------
  function setupBidding() {
    // Bid button on grid cards
    document.querySelectorAll('.bid-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.itemId);
        quickBid(id);
      });
    });

    // Submit bid in modal
    document.getElementById('bid-submit-btn').addEventListener('click', submitModalBid);
  }

  function quickBid(itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    const bidAmount = item.currentBid + item.minIncrement;
    if (state.userBalance < bidAmount) {
      showToast('Insufficient Soul Shards', 'You lack the currency to place this bid.');
      return;
    }

    // Simulate processing
    btn = document.querySelector(`.bid-btn[data-item-id="${itemId}"]`);
    btn.classList.add('blood-spread-effect');
    createBloodDrips(window.innerWidth / 2, window.innerHeight / 2, 5);
    
    processBid(item, bidAmount, () => {
      btn.classList.remove('blood-spread-effect');
      showToast('Bid Accepted', `You are now the highest bidder for ${item.title}.`);
      updateGridCard(item);
    });
  }

  function submitModalBid() {
    const item = state.currentItem;
    if (!item) return;

    const input = document.getElementById('bid-input');
    const amount = parseInt(input.value);

    if (isNaN(amount) || amount < item.currentBid + item.minIncrement) {
      showToast('Invalid Bid', `Minimum bid is ${item.currentBid + item.minIncrement} Soul Shards.`);
      input.style.borderColor = 'var(--blood)';
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }

    if (state.userBalance < amount) {
      showToast('Insufficient Soul Shards', 'You lack the currency to place this bid.');
      return;
    }

    // Effects
    createBloodDrips(window.innerWidth / 2, window.innerHeight / 2, 8);
    document.getElementById('bid-submit-btn').classList.add('blood-spread-effect');
    
    processBid(item, amount, () => {
      document.getElementById('bid-submit-btn').classList.remove('blood-spread-effect');
      updateModalBidDisplay();
      addBidToHistory(item.title, amount);
      showToast('Bid Confirmed', `Your offering of ${amount} Soul Shards has been accepted.`);
      
      // Reset input for next bid
      input.value = '';
      input.min = item.currentBid + item.minIncrement;
      input.placeholder = `Min ${item.currentBid + item.minIncrement}`;
    });
  }

  function processBid(item, amount, callback) {
    state.userBalance -= amount;
    item.currentBid = amount;
    item.topBidder = 'You';
    
    // Update UI
    els.currencyDisplay.textContent = state.userBalance.toLocaleString();
    
    // Simulate network delay
    setTimeout(() => {
      callback();
    }, 600);
  }

  function updateGridCard(item) {
    const card = document.querySelector(`[data-id="${item.id}"]`);
    if (!card) return;
    
    const bidEl = card.querySelector('.bid-value');
    bidEl.textContent = item.currentBid.toLocaleString();
    bidEl.style.color = 'var(--gold)';
    setTimeout(() => bidEl.style.color = '', 1000);
  }

  function addBidToHistory(title, amount) {
    const list = document.getElementById('bid-history-list');
    const newBid = document.createElement('div');
    newBid.className = 'bid-history-item';
    newBid.innerHTML = `
      <span class="bidder-avatar">👤</span>
      <div class="bidder-info">
        <span class="bidder-name">You</span>
        <span class="bid-time">Just now</span>
      </div>
      <span class="bid-amount">☠ ${amount.toLocaleString()}</span>
    `;
    newBid.style.opacity = '0';
    newBid.style.transform = 'translateY(-10px)';
    
    list.prepend(newBid);
    
    // Animate in
    requestAnimationFrame(() => {
      newBid.style.transition = 'all 0.4s ease-out';
      newBid.style.opacity = '1';
      newBid.style.transform = 'translateY(0)';
    });
  }

  // ---------- TOAST NOTIFICATIONS ----------
  function showToast(title, message, duration = 4000) {
    els.toastTitle.textContent = title;
    els.toastMessage.textContent = message;
    els.toast.classList.remove('hidden');
    
    // Force reflow
    void els.toast.offsetWidth;
    els.toast.classList.add('active');

    setTimeout(() => {
      els.toast.classList.remove('active');
      setTimeout(() => els.toast.classList.add('hidden'), 300);
    }, duration);
  }

  // ---------- TIMERS ----------
  function startTimers() {
    // Update all timers every second
    setInterval(() => {
      const now = Date.now();
      
      state.items.forEach(item => {
        const diff = item.endTime - now;
        
        // Update modal timer if open
        if (state.modalOpen && state.currentItem.id === item.id) {
          updateModalCountdown();
        }

        // Update grid card timers
        const card = document.querySelector(`[data-id="${item.id}"]`);
        if (card) {
          const timerEl = card.querySelector('.countdown-timer');
          if (diff <= 0) {
            timerEl.querySelectorAll('.time-value').forEach(el => el.textContent = '00');
            card.classList.add('ended');
          } else {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            timerEl.querySelectorAll('.time-value')[0].textContent = String(h).padStart(2, '0');
            timerEl.querySelectorAll('.time-value')[1].textContent = String(m).padStart(2, '0');
            timerEl.querySelectorAll('.time-value')[2].textContent = String(s).padStart(2, '0');
          }
        }
      });
    }, 1000);
  }

  // ---------- SCROLL ANIMATIONS ----------
  function observeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered delay based on index
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.auction-item').forEach(item => {
      observer.observe(item);
    });
  }

  // ---------- RUN ----------
  init();
});