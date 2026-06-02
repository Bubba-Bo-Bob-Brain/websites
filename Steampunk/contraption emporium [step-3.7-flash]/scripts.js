// Aether & Brass - Steampunk E-Commerce JavaScript

class SteampunkShop {
  constructor() {
    this.cart = [];
    this.cartSidebar = null;
    this.cartOverlay = null;
    this.cartItemsContainer = null;
    this.cartTotalAmount = null;
    this.cartCountElement = null;
    this.pneumaticTube = null;
    this.tubeCapsule = null;
    this.toast = null;
    
    this.init();
  }

  init() {
    this.cacheElements();
    this.loadCartFromStorage();
    this.bindEvents();
    this.updateCartUI();
    this.initScrollAnimations();
    this.initTickerAnimation();
    this.initGearAnimations();
  }

  cacheElements() {
    this.cartSidebar = document.querySelector('.cart-sidebar');
    this.cartOverlay = document.querySelector('.cart-overlay');
    this.cartItemsContainer = document.getElementById('cart-items');
    this.cartTotalAmount = document.getElementById('cart-total-amount');
    this.cartCountElement = document.querySelector('.cart-count');
    this.pneumaticTube = document.querySelector('.pneumatic-tube');
    this.tubeCapsule = document.querySelector('.tube-capsule');
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    document.body.appendChild(this.toast);
  }

  bindEvents() {
    // Cart trigger
    const cartTrigger = document.querySelector('.cart-trigger');
    if (cartTrigger) {
      cartTrigger.addEventListener('click', () => this.toggleCart());
    }

    // Close cart
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
      closeCart.addEventListener('click', () => this.closeCart());
    }

    // Cart overlay
    if (this.cartOverlay) {
      this.cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        this.addToCart(card);
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterProducts(btn.dataset.filter);
      });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.processCheckout());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCart();
      }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  addToCart(productCard) {
    const productId = parseInt(productCard.dataset.id);
    const productName = productCard.dataset.name;
    const productPrice = parseFloat(productCard.dataset.price);
    const productCategory = productCard.dataset.category;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        category: productCategory,
        quantity: 1
      });
    }

    this.saveCartToStorage();
    this.updateCartUI();
    this.animatePneumaticTube();
    this.showToast(`Added ${productName} to cart`);
    
    // Button feedback
    const btn = productCard.querySelector('.add-to-cart-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCartToStorage();
    this.updateCartUI();
  }

  updateQuantity(productId, change) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCartToStorage();
        this.updateCartUI();
      }
    }
  }

  updateCartUI() {
    this.updateCartCount();
    this.renderCartItems();
    this.updateCartTotal();
    this.updateCheckoutButton();
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCountElement) {
      this.cartCountElement.textContent = totalItems;
      
      // Animate count change
      this.cartCountElement.style.transform = 'scale(1.3)';
      setTimeout(() => {
        this.cartCountElement.style.transform = 'scale(1)';
      }, 200);
    }
  }

  renderCartItems() {
    if (!this.cartItemsContainer) return;

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some wares to get started!</p>';
      return;
    }

    this.cartItemsContainer.innerHTML = this.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="shop.updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="shop.updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item-remove" onclick="shop.removeFromCart(${item.id})" aria-label="Remove item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `).join('');
  }

  updateCartTotal() {
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Animate total change
    this.animateValue(this.cartTotalAmount, total);
    
    // Also update the checkout section total if it exists
    const checkoutTotal = document.getElementById('cart-total-amount');
    if (checkoutTotal) {
      checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  animateValue(element, newValue) {
    const currentText = element.textContent.replace('$', '');
    const current = parseFloat(currentText) || 0;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = current + (newValue - current) * easeOut;
      
      element.textContent = `$${value.toFixed(2)}`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  updateCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
    }
  }

  toggleCart() {
    if (this.cartSidebar) {
      this.cartSidebar.classList.toggle('open');
      if (this.cartOverlay) {
        this.cartOverlay.classList.toggle('active');
      }
      
      // Prevent body scroll when cart is open
      document.body.style.overflow = this.cartSidebar.classList.contains('open') ? 'hidden' : '';
    }
  }

  closeCart() {
    if (this.cartSidebar) {
      this.cartSidebar.classList.remove('open');
      if (this.cartOverlay) {
        this.cartOverlay.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  }

  animatePneumaticTube() {
    if (!this.pneumaticTube || !this.tubeCapsule) return;

    // Reset animation
    this.tubeCapsule.style.animation = 'none';
    this.tubeCapsule.offsetHeight; // Trigger reflow
    this.tubeCapsule.style.animation = 'pneumatic-travel 1.5s ease-in forwards';
    
    // Add steam particles
    this.createSteamParticles();
  }

  createSteamParticles() {
    const tube = this.pneumaticTube;
    if (!tube) return;

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'steam-particle';
        particle.style.left = `${45 + Math.random() * 10}%`;
        particle.style.top = `${30 + Math.random() * 20}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        tube.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 3000);
      }, i * 100);
    }
  }

  showToast(message) {
    if (!this.toast) return;

    this.toast.textContent = message;
    this.toast.classList.add('show');

    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }

  filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach((product, index) => {
      const productCategory = product.dataset.category;
      
      if (category === 'all' || productCategory === category) {
        product.style.display = '';
        product.style.animation = 'none';
        product.offsetHeight; // Trigger reflow
        product.style.animation = `fade-in-up 0.6s ease-out forwards`;
        product.style.animationDelay = `${index * 0.1}s`;
      } else {
        product.style.display = 'none';
      }
    });
  }

  processCheckout() {
    if (this.cart.length === 0) return;

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create checkout confirmation
    const confirmation = document.createElement('div');
    confirmation.className = 'checkout-confirmation';
    confirmation.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: var(--parchment); border: 4px solid var(--brass-dark); 
                  padding: 3rem; border-radius: 12px; z-index: 10000; text-align: center;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.5); max-width: 500px;">
        <h3 style="font-family: var(--font-display); font-size: 2rem; color: var(--ink); margin-bottom: 1rem;">
          ⚙ Order Confirmed ⚙
        </h3>
        <p style="font-family: var(--font-body); font-size: 1.1rem; color: var(--ink-light); margin-bottom: 2rem;">
          Thank you for your purchase! Your order totaling <strong>$${total.toFixed(2)}</strong> 
          will be delivered via pneumatic post within 3-5 business days.
        </p>
        <button onclick="this.closest('.checkout-confirmation').remove()" 
                style="font-family: var(--font-heading); background: var(--brass-gradient); 
                       border: 2px solid var(--brass-dark); padding: 0.75rem 2rem; 
                       cursor: pointer; border-radius: 4px; font-size: 1rem;">
          Continue Shopping
        </button>
      </div>
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                  background: rgba(0,0,0,0.7); z-index: 9999;" 
           onclick="this.closest('.checkout-confirmation').remove()"></div>
    `;
    
    document.body.appendChild(confirmation);
    
    // Clear cart
    this.cart = [];
    this.saveCartToStorage();
    this.updateCartUI();
    this.closeCart();
  }

  saveCartToStorage() {
    localStorage.setItem('aetherAndBrassCart', JSON.stringify(this.cart));
  }

  loadCartFromStorage() {
    const savedCart = localStorage.getItem('aetherAndBrassCart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
      observer.observe(card);
    });

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  initTickerAnimation() {
    const ticker = document.querySelector('.ticker-content span');
    if (ticker) {
      // Duplicate content for seamless loop
      ticker.textContent = ticker.textContent + ' ★ ' + ticker.textContent;
    }
  }

  initGearAnimations() {
    // Add random rotation speeds to decorative gears
    document.querySelectorAll('.hero-gear, .ticker-gear, .gear-decoration').forEach(gear => {
      const randomDuration = 15 + Math.random() * 20;
      gear.style.animationDuration = `${randomDuration}s`;
    });

    // Create floating gear particles
    this.createFloatingGears();
  }

  createFloatingGears() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    setInterval(() => {
      if (document.hidden) return; // Don't create particles when tab is hidden
      
      const gear = document.createElement('div');
      gear.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.2">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
          <path d="M19.4 15C19.2669 15.5196 19.1592 16.0488 19.078 16.5859C18.8694 17.9217 17.9217 18.8694 16.5859 19.078C16.0488 19.1592 15.5196 19.2669 15 19.4C14.4804 19.5331 13.9512 19.6408 13.4141 19.722C12.0783 19.9306 11.1306 20.8783 10.922 22.2141C10.8408 22.7512 10.7331 23.2804 10.6 23.8C10.4669 23.2804 10.3592 22.7512 10.278 22.2141C10.0694 20.8783 9.12166 19.9306 7.78594 19.722C7.24883 19.6408 6.71958 19.5331 6.2 19.4C5.68042 19.2669 5.15117 19.1592 4.61406 19.078C3.27828 18.8694 2.3306 17.9217 2.12199 16.5859C2.04083 16.0488 1.93312 15.5196 1.8 15C1.66688 14.4804 1.55917 13.9512 1.47801 13.4141C1.2694 12.0783 2.21712 11.1306 3.55284 10.922C4.08994 10.8408 4.61919 10.7331 5.13877 10.6C5.65835 10.4669 6.1876 10.3592 6.72471 10.278C8.06049 10.0694 9.00817 9.12166 9.21678 7.78594C9.29794 7.24883 9.40565 6.71958 9.53877 6.2C9.67189 5.68042 9.7796 5.15117 9.86076 4.61406C10.0694 3.27828 11.0171 2.3306 12.3528 2.12199C12.8899 2.04083 13.4192 1.93312 13.9388 1.8C14.4584 1.66688 14.9876 1.55917 15.5247 1.47801C16.8605 1.2694 17.8082 2.21712 18.0168 3.55284C18.0979 4.08994 18.2056 4.61919 18.3388 5.13877C18.4719 5.65835 18.5796 6.1876 18.6608 6.72471C18.8694 8.06049 17.9217 9.00817 16.5859 9.21678C16.0488 9.29794 15.5196 9.40565 15 9.53877C14.4804 9.67189 13.9512 9.7796 13.4141 9.86076C12.0783 10.0694 11.1306 11.0171 10.922 12.3528C10.8408 12.8899 10.7331 13.4192 10.6 13.9388C10.4669 14.4584 10.3592 14.9876 10.278 15.5247C10.0694 16.8605 9.12166 17.8082 7.78594 18.0168C7.24883 18.0979 6.71958 18.2056 6.2 18.3388C5.68042 18.4719 5.15117 18.5796 4.61406 18.6608C3.27828 18.8694 2.3306 17.9217 2.12199 16.5859C2.04083 16.0488 1.93312 15.5196 1.8 15Z"/>
        </svg>
      `;
      
      gear.style.position = 'absolute';
      gear.style.left = `${Math.random() * 100}%`;
      gear.style.top = '-50px';
      gear.style.color = 'var(--brass-dark)';
      gear.style.pointerEvents = 'none';
      gear.style.zIndex = '0';
      gear.style.animation = `gear-spin ${10 + Math.random() * 10}s linear infinite, float-down ${8 + Math.random() * 4}s ease-in forwards`;
      
      hero.appendChild(gear);

      setTimeout(() => {
        gear.remove();
      }, 12000);
    }, 2000);
  }

  // Utility method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

// Add floating animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes float-down {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize the shop when DOM is ready
let shop;
document.addEventListener('DOMContentLoaded', () => {
  shop = new SteampunkShop();
});

// Add some interactive sound-like visual feedback
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.add-to-cart-btn')) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 20px;
      height: 20px;
      background: var(--brass-light);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.6;
      animation: ripple-effect 0.6s ease-out forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Easter egg: Konami code for special message
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Activate easter egg
      document.body.style.animation = 'rainbow-glow 2s ease-in-out';
      shop.showToast('⚙ Aetheric Boost Activated! ⚙');
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow-glow {
    0%, 100% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(180deg); }
  }
`;
document.head.appendChild(rainbowStyle);