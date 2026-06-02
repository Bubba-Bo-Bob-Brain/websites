// ===== STEAMPUNK E-COMMERCE SHOP =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== STATE =====
  const state = {
    cart: [],
    products: [
      { id: 'p1', name: 'Telegraphic Resonator', price: 125.99 },
      { id: 'p2', name: 'Clockwork Canary', price: 89.50 },
      { id: 'p3', name: 'Aetheric Lantern', price: 210.75 },
      { id: 'p4', name: 'Mechanical Spider', price: 45.20 }
    ]
  };

  // ===== DOM ELEMENTS =====
  // Cart Elements
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartToggle = document.getElementById('cart-indicator');
  const cartContent = document.getElementById('cart-content');
  const cartCount = document.getElementById('cart-count');
  const cartTotalItems = document.getElementById('cart-total-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');

  // Product Elements
  const productCards = document.querySelectorAll('.product-card');
  const levers = document.querySelectorAll('[data-add-to-cart]');
  const gearTickers = document.querySelectorAll('.gear-ticker__display');

  // Pneumatic Tube
  const pneumaticTube = document.getElementById('pneumatic-tube');

  // ===== UTILITIES =====
  /**
   * Convert decimal price to £/s/d format.
   * @param {number} price - Decimal price (e.g., 125.99).
   * @returns {string} Formatted price (e.g., "£125.19s.11d").
   */
  const formatPrice = (price) => {
    const pounds = Math.floor(price);
    const shillings = Math.floor((price - pounds) * 20);
    const pence = Math.round(((price - pounds) * 20 - shillings) * 12);
    return `£${pounds}.${shillings}s.${pence}d`;
  };

  /**
   * Update the cart UI.
   */
  const updateCartUI = () => {
    // Update cart count
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotalItems.textContent = totalItems;

    // Update lantern flame
    const lanternFlame = document.querySelector('.lantern__flame');
    if (lanternFlame) {
      lanternFlame.style.height = `${0.5 + totalItems * 0.1}rem`;
      lanternFlame.style.opacity = 0.5 + totalItems * 0.1;
    }

    // Update cart content
    if (state.cart.length === 0) {
      cartContent.innerHTML = '<p class="cart-empty">Your cart is currently empty. Pull a lever to begin!</p>';
    } else {
      cartContent.innerHTML = state.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item__divider"></div>
          <div class="cart-item__name">${item.name} <span class="cart-item__quantity">×${item.quantity}</span></div>
          <div class="cart-item__price">${formatPrice(item.price * item.quantity)}</div>
          <button class="cart-item__remove" data-remove-id="${item.id}">×</button>
        </div>
      `).join('');
    }

    // Update total
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);

    // Add event listeners to remove buttons
    document.querySelectorAll('[data-remove-id]').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-remove-id');
        removeFromCart(id);
      });
    });
  };

  /**
   * Add an item to the cart.
   * @param {string} id - Product ID.
   */
  const addToCart = (id) => {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    // Check if item already in cart
    const existingItem = state.cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({ ...product, quantity: 1 });
    }

    // Update UI
    updateCartUI();

    // Trigger animations
    animateGearTicker(id);
    animatePneumaticTube();
    playLeverSound();
  };

  /**
   * Remove an item from the cart.
   * @param {string} id - Product ID.
   */
  const removeFromCart = (id) => {
    state.cart = state.cart.filter(item => {
      if (item.id === id) {
        return item.quantity > 1 ? (item.quantity -= 1, true) : false;
      }
      return true;
    });
    updateCartUI();
    animateGearTicker(id);
  };

  // ===== ANIMATIONS =====
  /**
   * Animate the gear ticker for a product.
   * @param {string} id - Product ID.
   */
  const animateGearTicker = (id) => {
    const ticker = document.querySelector(`.product-card[data-id="${id}"] .gear-ticker__display`);
    if (!ticker) return;

    const gearLarge = ticker.previousElementSibling;
    gearLarge.style.animation = 'none';
    void gearLarge.offsetWidth; // Trigger reflow
    gearLarge.style.animation = 'spin 0.5s linear';

    // Update displayed price
    const item = state.cart.find(item => item.id === id);
    const totalPrice = item ? item.price * item.quantity : state.products.find(p => p.id === id).price;
    ticker.textContent = formatPrice(totalPrice);
  };

  /**
   * Animate the pneumatic tube.
   */
  const animatePneumaticTube = () => {
    pneumaticTube.style.display = 'block';
    const tubePath = document.querySelector('.tube__path');
    const tubeCartridge = document.querySelector('.tube__cartridge');

    // Reset animations
    tubePath.style.animation = 'none';
    tubeCartridge.style.animation = 'none';
    void tubePath.offsetWidth;
    void tubeCartridge.offsetWidth;

    // Trigger animations
    tubePath.style.animation = 'tube-bend 0.5s forwards';
    tubeCartridge.style.animation = 'tube-shoot 1s forwards ease-in';

    // Hide tube after animation
    setTimeout(() => {
      pneumaticTube.style.display = 'none';
    }, 1000);
  };

  /**
   * Play a lever "clank" sound.
   */
  const playLeverSound = () => {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-old-style-door-lock-2153.mp3');
    audio.volume = 0.3;
    audio.play();
  };

  // ===== EVENT LISTENERS =====
  // Product Levers
  levers.forEach(lever => {
    lever.addEventListener('click', (e) => {
      const id = e.currentTarget.closest('.product-card').getAttribute('data-id');
      addToCart(id);
    });
  });

  // Cart Toggle
  cartToggle.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
  });

  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target) && cartSidebar.classList.contains('open')) {
      cartSidebar.classList.remove('open');
    }
  });

  // Checkout Button
  checkoutButton.addEventListener('click', () => {
    alert(`Proceeding to checkout with total: ${cartTotal.textContent}\n(Backend integration coming soon!)`);
  });

  // Initialize cart
  updateCartUI();
});