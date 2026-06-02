/* ============================================
THE BRASS EMPORIUM - Victorian Steampunk JavaScript
================================================ */

// ============================================
// PRODUCT DATA
const products = [
  {
    id: 1,
    name: "Aetheric Chronometer",
    category: "contraption",
    price: 189.99,
    description: "A brass timepiece that measures not hours, but the flow of aether through the fabric of reality. Patent #1887-A.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23d4a574' stroke='%238b6914' stroke-width='4'/%3E%3Ccircle cx='100' cy='100' r='65' fill='%23f4e4bc' stroke='%23b8860b' stroke-width='2'/%3E%3Ccircle cx='100' cy='100' r='5' fill='%238b6914'/%3E%3Cline x1='100' y1='100' x2='100' y2='50' stroke='%232d1810' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='100' y1='100' x2='140' y2='80' stroke='%232d1810' stroke-width='2' stroke-linecap='round'/%3E%3Ctext x='100' y='145' text-anchor='middle' font-size='10' fill='%232d1810' font-family='serif'%3EAETHERIC%3C/text%3E%3Ctext x='100' y='158' text-anchor='middle' font-size='14' fill='%232d1810' font-family='serif'%3E1887%3C/text%3E%3C/svg%3E"
  },
  {
    id: 2,
    name: "Voltaic Arc Lamp",
    category: "contraption",
    price: 245.00,
    description: "Illuminates with the power of captured lightning. Features hand-blown glass chambers and copper wiring insulation.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='60' y='80' width='80' height='100' fill='%23b87333' stroke='%238b4513' stroke-width='3'/%3E%3Crect x='70' y='90' width='60' height='70' fill='%232d1810'/%3E%3Ccircle cx='100' cy='125' r='20' fill='%237b68ee' opacity='0.8'/%3E%3Cpath d='M100 105 L95 120 L100 118 L105 135 L100 125 L95 125 Z' fill='%23ffffff' opacity='0.9'/%3E%3Crect x='75' y='60' width='50' height='20' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Ccircle cx='100' cy='45' r='8' fill='%23d4a574' stroke='%238b6914' stroke-width='2'/%3E%3C/svg%3E"
  },
  {
    id: 3,
    name: "Pneumatic Message Tube",
    category: "contraption",
    price: 78.50,
    description: "Send missives across your estate with this brass pneumatic tube system. Includes 50ft of copper tubing.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='40' y='85' width='120' height='30' fill='%23b87333' stroke='%238b4513' stroke-width='3'/%3E%3Crect x='35' y='80' width='20' height='40' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Crect x='145' y='80' width='20' height='40' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Cellipse cx='45' cy='100' rx='8' ry='15' fill='%23d4a574'/%3E%3Cellipse cx='155' cy='100' rx='8' ry='15' fill='%23d4a574'/%3E%3Crect x='80' y='88' width='40' height='24' fill='%23f4e4bc' stroke='%23b8860b' stroke-width='1'/%3E%3Ctext x='100' y='105' text-anchor='middle' font-size='10' fill='%232d1810'%3EPNEUMATIC%3C/text%3E%3C/svg%3E"
  },
  {
    id: 4,
    name: "Crystalline Divination Orb",
    category: "curiosity",
    price: 320.00,
    description: "A scrying orb infused with arcane crystals from the Orient. Reveals truths hidden from mortal eyes.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cellipse cx='100' cy='130' rx='50' ry='15' fill='%232d1810'/%3E%3Ccircle cx='100' cy='100' r='50' fill='%237b68ee' opacity='0.6'/%3E%3Ccircle cx='100' cy='100' r='40' fill='%239080e0' opacity='0.7'/%3E%3Ccircle cx='100' cy='100' r='30' fill='%23a9a0f0' opacity='0.8'/%3E%3Ccircle cx='100' cy='100' r='20' fill='%23c0b8ff' opacity='0.9'/%3E%3Cpath d='M70 80 L85 95 L75 110 L90 100' fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.6'/%3E%3Ccircle cx='100' cy='100' r='55' fill='none' stroke='%23b8860b' stroke-width='4'/%3E%3C/svg%3E"
  },
  {
    id: 5,
    name: "Mummified Clockwork Sparrow",
    category: "curiosity",
    price: 156.00,
    description: "An ancient Egyptian artifact fused with Victorian mechanics. Flaps its wings on the hour.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cellipse cx='100' cy='130' rx='40' ry='25' fill='%23d4c4a0' stroke='%238b6914' stroke-width='2'/%3E%3Cellipse cx='60' cy='100' rx='25' ry='12' fill='%23d4c4a0' stroke='%238b6914' stroke-width='2'/%3E%3Cellipse cx='140' cy='100' rx='25' ry='12' fill='%23d4c4a0' stroke='%238b6914' stroke-width='2'/%3E%3Ccircle cx='85' cy='125' r='3' fill='%232d1810'/%3E%3Ccircle cx='90' cy='122' r='3' fill='%238b6914'/%3E%3Ccircle cx='115' cy='125' r='3' fill='%232d1810'/%3E%3Ccircle cx='110' cy='122' r='3' fill='%238b6914'/%3E%3Cline x1='60' y1='100' x2='40' y2='70' stroke='%23b8860b' stroke-width='2'/%3E%3Cline x1='60' y1='100' x2='35' y2='90' stroke='%23b8860b' stroke-width='2'/%3E%3Cline x1='140' y1='100' x2='160' y2='70' stroke='%23b8860b' stroke-width='2'/%3E%3Cline x1='140' y1='100' x2='165' y2='90' stroke='%23b8860b' stroke-width='2'/%3E%3Crect x='95' y='145' width='10' height='20' fill='%23b87333' stroke='%238b4513' stroke-width='1'/%3E%3C/svg%3E"
  },
  {
    id: 6,
    name: "Levitating Mercury Bowl",
    category: "curiosity",
    price: 275.00,
    description: "Contains mercury that defies gravity through unknown forces. Warning: Do not open while indoors.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M70 150 Q100 130 130 150' fill='none' stroke='%23b8860b' stroke-width='3'/%3E%3Ccircle cx='100' cy='100' r='40' fill='%23c0c0c0' stroke='%23808080' stroke-width='2'/%3E%3Ccircle cx='100' cy='100' r='30' fill='%23a9a9a9'/%3E%3Ccircle cx='100' cy='100' r='20' fill='%23808080'/%3E%3Cellipse cx='85' cy='90' rx='8' ry='5' fill='%23ffffff' opacity='0.5'/%3E%3Ccircle cx='100' cy='60' r='8' fill='%23c0c0c0' stroke='%23808080' stroke-width='1'/%3E%3Cline x1='100' y1='68' x2='100' y2='90' stroke='%23808080' stroke-width='1' stroke-dasharray='3,3'/%3E%3Ctext x='100' y='165' text-anchor='middle' font-size='10' fill='%23b8860b'%3ELEVITATION%3C/text%3E%3C/svg%3E"
  },
  {
    id: 7,
    name: "Brass Arm Prosthetic",
    category: "augmentation",
    price: 450.00,
    description: "A fully articulated mechanical arm with pneumatic grip. Suitable for gentlemen who have lost a limb in industrial accidents.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='90' y='30' width='20' height='40' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Ccircle cx='100' cy='30' r='12' fill='%23d4a574' stroke='%238b6914' stroke-width='2'/%3E%3Crect x='70' y='70' width='60' height='15' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Crect x='60' y='85' width='20' height='50' fill='%23b87333' stroke='%238b4513' stroke-width='2'/%3E%3Crect x='80' y='85' width='20' height='50' fill='%23b87333' stroke='%238b4513' stroke-width='2'/%3E%3Crect x='100' y='85' width='20' height='50' fill='%23b87333' stroke='%238b4513' stroke-width='2'/%3E%3Ccircle cx='70' cy='135' r='8' fill='%23d4a574' stroke='%238b6914' stroke-width='1'/%3E%3Ccircle cx='90' cy='135' r='8' fill='%23d4a574' stroke='%238b6914' stroke-width='1'/%3E%3Ccircle cx='110' cy='135' r='8' fill='%23d4a574' stroke='%238b6914' stroke-width='1'/%3E%3C/svg%3E"
  },
  {
    id: 8,
    name: "Optical Enhancement Goggles",
    category: "augmentation",
    price: 185.00,
    description: "Brass-framed goggles with crystalline lenses that allow one to see the invisible aetheric spectrum.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='70' cy='100' r='30' fill='%237b68ee' stroke='%23b8860b' stroke-width='4'/%3E%3Ccircle cx='130' cy='100' r='30' fill='%237b68ee' stroke='%23b8860b' stroke-width='4'/%3E%3Ccircle cx='70' cy='100' r='20' fill='%239080e0'/%3E%3Ccircle cx='130' cy='100' r='20' fill='%239080e0'/%3E%3Cpath d='M40 100 L20 85' stroke='%23b8860b' stroke-width='3'/%3E%3Cpath d='M40 100 L20 115' stroke='%23b8860b' stroke-width='3'/%3E%3Cpath d='M160 100 L180 85' stroke='%23b8860b' stroke-width='3'/%3E%3Cpath d='M160 100 L180 115' stroke='%23b8860b' stroke-width='3'/%3E%3Crect x='85' y='95' width='30' height='10' fill='%23b8860b'/%3E%3C/svg%3E"
  },
  {
    id: 9,
    name: "Mechanical Heart Regulator",
    category: "augmentation",
    price: 520.00,
    description: "A brass device that maintains steady heartbeat. Essential for those with weak constitutions.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L130 50 L130 90 L100 120 L70 90 L70 50 Z' fill='%23b87333' stroke='%238b4513' stroke-width='3'/%3E%3Cpath d='M100 45 L120 58 L120 85 L100 105 L80 85 L80 58 Z' fill='%23da8a67'/%3E%3Ccircle cx='100' cy='75' r='15' fill='%239b111e'/%3E%3Ccircle cx='100' cy='75' r='8' fill='%23ff4444'/%3E%3Crect x='95' y='120' width='10' height='30' fill='%23b8860b' stroke='%238b6914' stroke-width='2'/%3E%3Ccircle cx='100' cy='155' r='10' fill='%23d4a574' stroke='%238b6914' stroke-width='2'/%3E%3C/svg%3E"
  }
];

// ============================================
// STATE
var cart = [];
var currentFilter = 'all';

// ============================================
// DOM ELEMENTS
var productsGrid = document.getElementById('productsGrid');
var cartCount = document.getElementById('cartCount');
var cartItems = document.getElementById('cartItems');
var cartTotal = document.getElementById('cartTotal');
var cartSidebar = document.getElementById('cartSidebar');
var cartOverlay = document.getElementById('cartOverlay');
var cartButton = document.getElementById('cartButton');
var cartClose = document.getElementById('cartClose');
var checkoutButton = document.getElementById('checkoutButton');
var checkoutOverlay = document.getElementById('checkoutOverlay');
var checkoutModal = document.getElementById('checkoutModal');
var checkoutClose = document.getElementById('checkoutClose');
var checkoutSubtotal = document.getElementById('checkoutSubtotal');
var checkoutTotal = document.getElementById('checkoutTotal');
var confirmPurchase = document.getElementById('confirmPurchase');
var successOverlay = document.getElementById('successOverlay');
var successModal = document.getElementById('successModal');
var successClose = document.getElementById('successClose');
var pneumaticTube = document.getElementById('pneumaticTube');
var filterButtons = document.querySelectorAll('.filter-btn');

// ============================================
// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartUI();
  startTickerUpdates();
});

// ============================================
// RENDER PRODUCTS
function renderProducts() {
  var filteredProducts = currentFilter === 'all' ? products : products.filter(function(p) {
    return p.category === currentFilter;
  });
  
  productsGrid.innerHTML = filteredProducts.map(function(product, index) {
    return '<article class="product-card" data-id="' + product.id + '" style="animation-delay: ' + (index * 0.1) + 's">' +
      '<div class="rivet rivet-tl"></div>' +
      '<div class="rivet rivet-tr"></div>' +
      '<div class="rivet rivet-bl"></div>' +
      '<div class="rivet rivet-br"></div>' +
      '<div class="product-image-container">' +
        '<img src="' + product.image + '" alt="' + product.name + '" class="product-image">' +
        '<span class="patent-badge">PAT. PENDING</span>' +
      '</div>' +
      '<div class="product-info">' +
        '<span class="product-category">' + getCategoryLabel(product.category) + '</span>' +
        '<h3 class="product-name">' + product.name + '</h3>' +
        '<p class="product-description">' + product.description + '</p>' +
        '<div class="product-footer">' +
          '<span class="product-price">£' + product.price.toFixed(2) + '</span>' +
          '<button class="add-to-cart-btn" data-id="' + product.id + '">' +
            '<span>Add to Cart</span>' +
            '<span class="add-icon">+</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  // Add event listeners to add to cart buttons
  var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  for (var i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', handleAddToCart);
  }
}

function getCategoryLabel(category) {
  var labels = {
    contraption: '⚙ Brass Contraption',
    curiosity: '◈ Arcane Curiosity',
    augmentation: '✦ Mechanical Augmentation'
  };
  return labels[category] || category;
}

// ============================================
// CART FUNCTIONS
function handleAddToCart(e) {
  var productId = parseInt(e.currentTarget.dataset.id);
  var product = findProductById(productId);
  if (product) {
    triggerPneumaticTube();
    setTimeout(function() {
      addToCart(product);
    }, 800);
  }
}

function findProductById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
  return null;
}

function addToCart(product) {
  var existingItem = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      existingItem = cart[i];
      break;
    }
  }
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  }
  updateCartUI();
  
  if (cart.length === 1) {
    openCart();
  }
}

function removeFromCart(productId) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  updateCartUI();
}

function updateQuantity(productId, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += delta;
      if (cart[i].quantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartUI();
      }
      break;
    }
  }
}

function updateCartUI() {
  // Update cart count
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }
  cartCount.textContent = count;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty"><p>Your cart awaits additions...</p></div>';
  } else {
    var itemsHTML = '';
    for (var j = 0; j < cart.length; j++) {
      var item = cart[j];
      itemsHTML += '<div class="cart-item">' +
        '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-image">' +
        '<div class="cart-item-details">' +
          '<h4 class="cart-item-name">' + item.name + '</h4>' +
          '<p class="cart-item-price">£' + item.price.toFixed(2) + '</p>' +
          '<div class="cart-item-controls">' +
            '<button class="quantity-btn" onclick="updateQuantity(' + item.id + ', -1)">−</button>' +
            '<span class="cart-item-quantity">' + item.quantity + '</span>' +
            '<button class="quantity-btn" onclick="updateQuantity(' + item.id + ', 1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">×</button>' +
      '</div>';
    }
    cartItems.innerHTML = itemsHTML;
  }

  // Update total
  var total = 0;
  for (var k = 0; k < cart.length; k++) {
    total += cart[k].price * cart[k].quantity;
  }
  cartTotal.textContent = '£' + total.toFixed(2);
}

// ============================================
// CART SIDEBAR
function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
}

cartButton.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ============================================
// CHECKOUT
function openCheckout() {
  closeCart();
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].quantity;
  }
  var shipping = 5.00;
  var total = subtotal + shipping;
  checkoutSubtotal.textContent = '£' + subtotal.toFixed(2);
  checkoutTotal.textContent = '£' + total.toFixed(2);
  checkoutOverlay.classList.add('active');
  checkoutModal.classList.add('active');
}

function closeCheckout() {
  checkoutOverlay.classList.remove('active');
  checkoutModal.classList.remove('active');
}

checkoutButton.addEventListener('click', openCheckout);
checkoutClose.addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// ============================================
// PURCHASE CONFIRMATION
confirmPurchase.addEventListener('click', function() {
  closeCheckout();
  setTimeout(function() {
    successOverlay.classList.add('active');
    successModal.classList.add('active');
    cart = [];
    updateCartUI();
  }, 300);
});

successClose.addEventListener('click', function() {
  successOverlay.classList.remove('active');
  successModal.classList.remove('active');
});

successOverlay.addEventListener('click', function() {
  successOverlay.classList.remove('active');
  successModal.classList.remove('active');
});

// ============================================
// PNEUMATIC TUBE ANIMATION
function triggerPneumaticTube() {
  pneumaticTube.classList.add('active');
  var capsule = document.getElementById('capsule');
  capsule.style.animation = 'none';
  capsule.offsetHeight; // Trigger reflow
  capsule.style.animation = 'capsuleTravel 1.5s ease-in-out forwards';
  setTimeout(function() {
    pneumaticTube.classList.remove('active');
  }, 1800);
}

// ============================================
// FILTER FUNCTIONALITY
for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function() {
    // Update active state
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove('active');
    }
    this.classList.add('active');
    
    // Update filter
    currentFilter = this.dataset.category;
    renderProducts();
  });
}

// ============================================
// PRICE TICKER UPDATES
function startTickerUpdates() {
  setInterval(function() {
    var tickerItems = document.querySelectorAll('.ticker-item');
    for (var i = 0; i < tickerItems.length; i++) {
      var item = tickerItems[i];
      var currentText = item.textContent;
      var match = currentText.match(/[£:](\d+\.?\d*)/);
      if (match) {
        var value = parseFloat(match[1]);
        value += (Math.random() - 0.5) * 2;
        value = Math.max(0.01, value);
        var unit = currentText.indexOf('PSI') > -1 ? 'PSI' : currentText.indexOf('UNITS') > -1 ? 'UNITS' : '';
        var prefix = currentText.indexOf('£') > -1 ? '£' : '';
        var baseText = currentText.replace(/[£:](\d+\.?\d*)\s*(▲|▼)/, '');
        var direction = Math.random() > 0.3 ? '▲' : '▼';
        item.textContent = baseText + prefix + value.toFixed(2) + ' ' + unit + ' ' + direction;
      }
    }
  }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
var anchorLinks = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < anchorLinks.length; i++) {
  anchorLinks[i].addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ============================================
// KEYBOARD ACCESSIBILITY
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
    successOverlay.classList.remove('active');
    successModal.classList.remove('active');
  }
});

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;