// ==========================================
// THE AETHERIC EMPORIUM — STEAMPUNK JS
// ==========================================

// ---- Product Data ----
const products = [
  {
    id: 1,
    name: "Ætheric Resonance Coil",
    category: "Arcane Curiosity",
    price: 47.50,
    oldPrice: 62.00,
    description: "A hand-wound copper coil said to resonate with the luminiferous æther. Emits a faint harmonic hum detectable by trained ears. Ideal for séances and experimental philosophy.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="none" stroke="#C9A84C" stroke-width="0.8" stroke-dasharray="4,4"/>
      <circle cx="100" cy="100" r="55" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <path d="M100,30 Q130,50 120,80 Q110,110 140,130 Q155,140 150,160" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
      <path d="M100,30 Q70,50 80,80 Q90,110 60,130 Q45,140 50,160" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="8" fill="#C9A84C" opacity="0.3"/>
      <circle cx="100" cy="100" r="4" fill="#C9A84C"/>
      <line x1="60" y1="160" x2="55" y2="175" stroke="#C9A84C" stroke-width="1"/>
      <line x1="140" y1="160" x2="145" y2="175" stroke="#C9A84C" stroke-width="1"/>
      <text x="100" y="190" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">No. 4712</text>
    </svg>`
  },
  {
    id: 2,
    name: "Pneumatic Automaton Arm",
    category: "Mechanical Augmentation",
    price: 124.00,
    oldPrice: null,
    description: "Fully articulated brass limb powered by micro-pneumatic pistons. Seven degrees of freedom. Compatible with most standard shoulder mounts. Includes calibration wrench.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="30" width="60" height="25" rx="4" fill="none" stroke="#C9A84C" stroke-width="1"/>
      <circle cx="85" cy="42" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="42" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="115" cy="42" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="85" y1="55" x2="80" y2="90" stroke="#C9A84C" stroke-width="1.2"/>
      <line x1="100" y1="55" x2="100" y2="95" stroke="#C9A84C" stroke-width="1.2"/>
      <line x1="115" y1="55" x2="120" y2="90" stroke="#C9A84C" stroke-width="1.2"/>
      <rect x="65" y="88" width="70" height="20" rx="3" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="80" y1="108" x2="75" y2="140" stroke="#C9A84C" stroke-width="1"/>
      <line x1="100" y1="108" x2="100" y2="145" stroke="#C9A84C" stroke-width="1"/>
      <line x1="120" y1="108" x2="125" y2="140" stroke="#C9A84C" stroke-width="1"/>
      <rect x="60" y="135" width="80" height="18" rx="3" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="75" cy="144" r="5" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="100" cy="144" r="5" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="125" cy="144" r="5" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <text x="100" y="175" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">MARK IV</text>
    </svg>`
  },
  {
    id: 3,
    name: "Celestial Orrery No. 7",
    category: "Brass Contraption",
    price: 89.75,
    oldPrice: 110.00,
    description: "A mechanical model of the solar system featuring six planets on sprung brass arms. Hand-painted enamel spheres. Sun disc crafted from hammered gold leaf on copper backing.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="12" fill="#C9A84C" opacity="0.4"/>
      <circle cx="100" cy="100" r="10" fill="#E8D5A0" opacity="0.3"/>
      <line x1="100" y1="100" x2="155" y2="45" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="155" cy="45" r="7" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="160" y2="80" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="160" cy="80" r="5" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="145" y2="120" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="145" cy="120" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="60" y2="130" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="60" cy="130" r="6" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="50" y2="95" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="50" cy="95" r="3" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="55" y2="60" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="55" cy="60" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" stroke-width="0.3" stroke-dasharray="2,6"/>
      <text x="100" y="185" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">No. 7 — SIX PLANETS</text>
    </svg>`
  },
  {
    id: 4,
    name: "Chronometric Implant",
    category: "Mechanical Augmentation",
    price: 203.50,
    oldPrice: null,
    description: "A brass timepiece designed for subcutaneous installation. Features a 72-hour power reserve and luminous radium indices. Approved by the Royal College of Surgeons.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="50" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="45" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="100" y1="100" x2="100" y2="60" stroke="#C9A84C" stroke-width="1.2"/>
      <line x1="100" y1="100" x2="130" y2="100" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="100" x2="115" y2="80" stroke="#C9A84C" stroke-width="0.6"/>
      <circle cx="100" cy="100" r="3" fill="#C9A84C"/>
      <circle cx="100" cy="55" r="2" fill="#C9A84C" opacity="0.5"/>
      <circle cx="140" cy="100" r="2" fill="#C9A84C" opacity="0.5"/>
      <path d="M75,65 L70,60" stroke="#C9A84C" stroke-width="0.5"/>
      <path d="M125,135 L130,140" stroke="#C9A84C" stroke-width="0.5"/>
      <text x="100" y="145" text-anchor="middle" font-family="Cormorant Garamond" font-size="7" fill="#C9A84C" opacity="0.6">VII I I I</text>
      <circle cx="100" cy="100" r="50" fill="none" stroke="#C9A84C" stroke-width="0.3" stroke-dasharray="3,3"/>
      <text x="100" y="170" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">CHRONO. IMP.</text>
    </svg>`
  },
  {
    id: 5,
    name: "Vitreous Speculum",
    category: "Arcane Curiosity",
    price: 31.25,
    oldPrice: 40.00,
    description: "A polished brass tube fitted with ground glass lenses. Said to reveal entities invisible to the naked eye. Warning: prolonged use may cause vertigo and existential unease.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="80" height="120" rx="40" fill="none" stroke="#C9A84C" stroke-width="1.2"/>
      <rect x="65" y="45" width="70" height="110" rx="35" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="100" cy="75" r="15" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="75" r="8" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="100" cy="75" r="3" fill="#C9A84C" opacity="0.3"/>
      <circle cx="100" cy="120" r="12" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="120" r="6" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="80" y1="50" x2="80" y2="150" stroke="#C9A84C" stroke-width="0.3" opacity="0.3"/>
      <line x1="90" y1="50" x2="90" y2="150" stroke="#C9A84C" stroke-width="0.3" opacity="0.3"/>
      <line x1="110" y1="50" x2="110" y2="150" stroke="#C9A84C" stroke-width="0.3" opacity="0.3"/>
      <line x1="120" y1="50" x2="120" y2="150" stroke="#C9A84C" stroke-width="0.3" opacity="0.3"/>
      <text x="100" y="175" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">OPTICK TUBE</text>
    </svg>`
  },
  {
    id: 6,
    name: "Pyroxene Crystal Array",
    category: "Arcane Curiosity",
    price: 66.00,
    oldPrice: null,
    description: "Naturally occurring crystals mounted in a brass frame with adjustable focusing lenses. Emits warm infrared radiation. Previously housed in a disused lighthouse.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,30 115,70 140,75 120,100 130,140 100,120 70,140 80,100 60,75 85,70" fill="none" stroke="#C9A84C" stroke-width="1"/>
      <polygon points="100,50 108,70 125,73 112,90 118,115 100,105 82,115 88,90 75,73 92,70" fill="none" stroke="#C9A84C" stroke-width="0.6"/>
      <line x1="60" y1="160" x2="140" y2="160" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="70" y1="165" x2="130" y2="165" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="85" cy="85" r="3" fill="#C9A84C" opacity="0.2"/>
      <circle cx="115" cy="95" r="2" fill="#C9A84C" opacity="0.2"/>
      <circle cx="95" cy="110" r="2.5" fill="#C9A84C" opacity="0.2"/>
      <text x="100" y="185" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">PYROXENE ARRAY</text>
    </svg>`
  },
  {
    id: 7,
    name: "Thermionic Valve Assembler",
    category: "Brass Contraption",
    price: 78.50,
    oldPrice: 95.00,
    description: "A compact apparatus for assembling thermionic valves under vacuum. Features precision brass collets and a magnifying sight. Essential for any respectable laboratory.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="50" width="100" height="80" rx="5" fill="none" stroke="#C9A84C" stroke-width="1"/>
      <rect x="55" y="55" width="90" height="70" rx="3" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="100" cy="90" r="20" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="90" r="12" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="100" y1="70" x2="100" y2="60" stroke="#C9A84C" stroke-width="1"/>
      <line x1="120" y1="90" x2="130" y2="90" stroke="#C9A84C" stroke-width="1"/>
      <line x1="80" y1="90" x2="70" y2="90" stroke="#C9A84C" stroke-width="1"/>
      <rect x="65" y="130" width="70" height="25" rx="3" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="80" y1="130" x2="80" y2="155" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="100" y1="130" x2="100" y2="155" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="120" y1="130" x2="120" y2="155" stroke="#C9A84C" stroke-width="0.5"/>
      <text x="100" y="180" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">VALVE ASSEMBLER</text>
    </svg>`
  },
  {
    id: 8,
    name: "Magnetostrictive Phonograph",
    category: "Brass Contraption",
    price: 156.00,
    oldPrice: null,
    description: "A brass-cased sound reproduction device using magnetostrictive wire instead of conventional stylus. Produces a warm, crackling tone. Includes 12 blank wax cylinders.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="50" width="120" height="90" rx="8" fill="none" stroke="#C9A84C" stroke-width="1.2"/>
      <circle cx="100" cy="95" r="30" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="100" cy="95" r="5" fill="#C9A84C" opacity="0.3"/>
      <path d="M70,95 Q85,80 100,95 Q115,110 130,95" fill="none" stroke="#C9A84C" stroke-width="0.6"/>
      <line x1="100" y1="65" x2="100" y2="55" stroke="#C9A84C" stroke-width="1"/>
      <line x1="85" y1="55" x2="115" y2="55" stroke="#C9A84C" stroke-width="0.8"/>
      <path d="M60,140 L60,155 L140,155 L140,140" fill="none" stroke="#C9A84C" stroke-width="0.8"/>
      <circle cx="80" cy="147" r="4" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="100" cy="147" r="4" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <circle cx="120" cy="147" r="4" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <text x="100" y="180" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">PHONOGRAPH Co.</text>
    </svg>`
  },
  {
    id: 9,
    name: "Dirigible Pressure Gauge",
    category: "Brass Contraption",
    price: 42.75,
    oldPrice: 55.00,
    description: "Precision aneroid barometer housed in a riveted brass case. Dial ranges from 24 to 32 inches of mercury. Calibrated for use aboard hydrogen and helium craft.",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="55" fill="none" stroke="#C9A84C" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <line x1="100" y1="50" x2="100" y2="70" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="100" y1="130" x2="100" y2="150" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="50" y1="100" x2="70" y2="100" stroke="#C9A84C" stroke-width="0.8"/>
      <line x1="130" y1="100" x2="150" y2="100" stroke="#C9A84C" stroke-width="0.8"/>
      <path d="M100,100 L115,80" stroke="#C9A84C" stroke-width="1"/>
      <circle cx="100" cy="100" r="3" fill="#C9A84C"/>
      <path d="M60,100 A40,40 0 0,1 140,100" fill="none" stroke="#C9A84C" stroke-width="0.5" opacity="0.4"/>
      <text x="100" y="105" text-anchor="middle" font-family="Cormorant Garamond" font-size="7" fill="#C9A84C" opacity="0.6">29.92</text>
      <text x="100" y="175" text-anchor="middle" font-family="Cormorant Garamond" font-size="8" fill="#C9A84C" opacity="0.6">PRESS. GAUGE</text>
    </svg>`
  }
];

// ---- Cart State ----
let cart = [];

// ---- DOM Elements ----
const productsGrid = document.getElementById('productsGrid');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartBody = document.getElementById('cartBody');
const cartEmpty = document.getElementById('cartEmpty');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutTotal = document.getElementById('checkoutTotal');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationClose = document.getElementById('confirmationClose');
const orderRef = document.getElementById('orderRef');
const pneumaticContainer = document.getElementById('pneumaticContainer');

// ---- Render Products ----
function renderProducts() {
  productsGrid.innerHTML = '';

  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="card-rivet"></div>
      <div class="card-rivet"></div>
      <div class="card-rivet"></div>
      <div class="card-rivet"></div>
      <div class="card-rivet"></div>
      <div class="card-image">
        ${product.svg}
      </div>
      <div class="card-body">
        <div class="card-category">${product.category}</div>
        <h3 class="card-title">${product.name}</h3>
        <p class="card-description">${product.description}</p>
        <div class="card-price-row">
          <div>
            <span class="card-price">£${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="card-price-old">£${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
        </div>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
          ⚙ ADD TO PNEUMATIC CART ⚙
        </button>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  // Attach event listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
  });
}

// ---- Add to Cart ----
function handleAddToCart(e) {
  const btn = e.currentTarget;
  const id = parseInt(btn.dataset.id);
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price);

  // Check if already in cart
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  // Button feedback
  btn.classList.add('added');
  btn.textContent = '✓ ADDED';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.textContent = '⚙ ADD TO PNEUMATIC CART ⚙';
  }, 1500);

  // Pneumatic tube animation
  launchPneumaticTube(btn);

  // Update cart UI
  updateCart();
}

// ---- Pneumatic Tube Animation ----
function launchPneumaticTube(button) {
  const rect = button.getBoundingClientRect();
  const tube = document.createElement('div');
  tube.className = 'pneumatic-tube';

  tube.style.left = `${rect.left + rect.width / 2 - 10}px`;
  tube.style.top = `${rect.top - 10}px`;

  pneumaticContainer.appendChild(tube);

  // Animate toward cart button position
  tube.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${window.innerWidth - rect.left}px, ${-window.innerHeight * 0.3}px) scale(0.3)`, opacity: 0 }
  ], {
    duration: 600,
    easing: 'ease-in'
  });

  setTimeout(() => tube.remove(), 600);
}

// ---- Update Cart ----
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 4.50 : 0;
  const total = subtotal + shipping;

  cartCount.textContent = totalItems;

  // Show/hide empty state
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.innerHTML = '';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    renderCartItems();
  }

  cartSubtotal.textContent = `£${subtotal.toFixed(2)}`;
  cartTotal.textContent = `£${total.toFixed(2)}`;
  checkoutTotal.textContent = `£${total.toFixed(2)}`;
}

// ---- Render Cart Items ----
function renderCartItems() {
  cartItems.innerHTML = '';

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';

    const product = products.find(p => p.id === item.id);

    itemEl.innerHTML = `
      <div class="cart-item-image">
        ${product ? product.svg.replace(/width="200"/g, 'width="50"').replace(/height="200"/g, 'height="50"') : ''}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">£${item.price.toFixed(2)} × ${item.quantity} = £${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}">Remove</button>
    `;

    cartItems.appendChild(itemEl);
  });

  // Attach remove listeners
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', handleRemoveFromCart);
  });
}

// ---- Remove from Cart ----
function handleRemoveFromCart(e) {
  const id = parseInt(e.currentTarget.dataset.id);
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// ---- Cart Sidebar Toggle ----
function openCart() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---- Checkout Modal ----
checkoutBtn.addEventListener('click', () => {
  closeCart();
  setTimeout(() => {
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 400);
});

checkoutClose.addEventListener('click', () => {
  checkoutModal.classList.remove('open');
  document.body.style.overflow = '';
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Generate order reference
  const ref = Math.random().toString(36).substring(2, 8).toUpperCase();
  orderRef.textContent = ref;

  // Close checkout, open confirmation
  checkoutModal.classList.remove('open');
  setTimeout(() => {
    confirmationModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 400);

  // Clear cart
  cart = [];
  updateCart();
});

// ---- Confirmation Modal ----
confirmationClose.addEventListener('click', () => {
  confirmationModal.classList.remove('open');
  document.body.style.overflow = '';
});

// ---- Price Ticker Animation Enhancement ----
function animateTicker() {
  const tickerContent = document.querySelector('.ticker-content');
  if (!tickerContent) return;

  // Duplicate content for seamless loop
  const clone = tickerContent.innerHTML;
  tickerContent.innerHTML = clone + clone;
}

// ---- Smooth Scroll for Nav Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Keyboard Accessibility ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (confirmationModal.classList.contains('open')) {
      confirmationModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (checkoutModal.classList.contains('open')) {
      checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (cartSidebar.classList.contains('open')) {
      closeCart();
    }
  }
});

// ---- Initialize ----
renderProducts();
animateTicker();

// ---- Ambient Gear Rotation Sync ----
let gearAngle = 0;
function animateGears() {
  gearAngle += 0.1;
  document.querySelectorAll('.gear-bg svg').forEach((svg, i) => {
    const speed = [0.02, -0.03, 0.04][i] || 0.02;
    svg.style.transform = `rotate(${gearAngle * speed * 100}deg)`;
  });
  requestAnimationFrame(animateGears);
}
animateGears();

// ---- Product Card Entrance Animation ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(30px)';
      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach(card => {
  observer.observe(card);
});

// ---- Hover Sound Effect (Visual Only - Steam Effect) ----
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
});

// ---- Rivet Shine Effect ----
setInterval(() => {
  document.querySelectorAll('.card-rivet').forEach(rivet => {
    rivet.style.opacity = rivet.style.opacity === '0.5' ? '1' : '0.5';
  });
}, 2000);