// ========== STEAMPUNK EMPORIUM JAVASCRIPT ==========
// Brass & Cogs - Interactive Shopping Experience

document.addEventListener('DOMContentLoaded', function() {
  // ========== STATE MANAGEMENT ==========
  const state = {
    cart: [],
    isCartOpen: false,
    currentFilter: 'all'
  };

  // Load cart from localStorage if available
  const savedCart = localStorage.getItem('brassAndCogsCart');
  if (savedCart) {
    state.cart = JSON.parse(savedCart);
    updateCartUI();
  }

  // ========== DOM ELEMENTS ==========
  const cartToggle = document.getElementById('cart-toggle');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.querySelector('.cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const checkoutTotalAmount = document.getElementById('checkout-total-amount');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  const pneumaticCapsule = document.getElementById('pneumatic-capsule');
  const tubeContainer = document.querySelector('.tube-container');

  // ========== CART FUNCTIONS ==========
  function addToCart(productId, productName, productPrice) {
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        quantity: 1,
        image: getProductImage(productId)
      });
    }
    
    saveCart();
    updateCartUI();
    triggerPneumaticAnimation(productName);
    
    // Brief cart open to show item added
    if (!state.isCartOpen) {
      openCart();
      setTimeout(() => {
        if (state.isCartOpen) closeCart();
      }, 2000);
    }
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
  }

  function updateCartUI() {
    // Update cart count badge
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items list
    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some wondrous contraptions!</p>';
    } else {
      cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">£${item.price.toFixed(2)} × ${item.quantity}</div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          removeFromCart(id);
        });
      });
    }
    
    // Update total
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `£${total.toFixed(2)}`;
  }

  function updateCheckoutSummary() {
    if (state.cart.length === 0) {
      checkoutItemsContainer.innerHTML = '<p>Your cart is empty</p>';
      checkoutTotalAmount.textContent = '£0.00';
      return;
    }
    
    checkoutItemsContainer.innerHTML = state.cart.map(item => `
      <div class="checkout-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>£${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotalAmount.textContent = `£${total.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem('brassAndCogsCart', JSON.stringify(state.cart));
  }

  function getProductImage(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
      const img = card.querySelector('.patent-drawing');
      return img ? img.src : 'https://via.placeholder.com/60x60?text=Brass';
    }
    return 'https://via.placeholder.com/60x60?text=Brass';
  }

  // ========== PNEUMATIC TUBE ANIMATION ==========
  function triggerPneumaticAnimation(productName) {
    // Position capsule near the "Add to Cart" button that was clicked
    const activeButton = document.querySelector('.add-to-cart-btn:active');
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const tubeRect = tubeContainer.getBoundingClientRect();
      
      // Calculate position relative to tube container
      const leftPos = rect.left + rect.width / 2 - tubeRect.left - 20;
      tubeContainer.style.left = `${leftPos}px`;
    }
    
    // Show the tube container
    tubeContainer.classList.add('active');
    
    // Start capsule movement
    pneumaticCapsule.classList.remove('moving');
    void pneumaticCapsule.offsetWidth; // Trigger reflow
    pneumaticCapsule.classList.add('moving');
    
    // Show text after capsule starts moving
    setTimeout(() => {
      pneumaticCapsule.classList.add('show-text');
      pneumaticCapsule.querySelector('.capsule-content').textContent = 'Added!';
    }, 300);
    
    // Hide after animation completes
    setTimeout(() => {
      tubeContainer.classList.remove('active');
      pneumaticCapsule.classList.remove('moving', 'show-text');
    }, 2500);
  }

  // ========== CART SIDEBAR FUNCTIONS ==========
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    state.isCartOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    state.isCartOpen = false;
    document.body.style.overflow = '';
  }

  // ========== CHECKOUT FUNCTIONS ==========
  function openCheckout() {
    if (state.cart.length === 0) {
      // Shake the checkout button to indicate no items
      checkoutBtn.style.animation = 'pulse 0.5s ease 3';
      setTimeout(() => {
        checkoutBtn.style.animation = '';
      }, 1500);
      return;
    }
    
    updateCheckoutSummary();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Simulate order processing
    const submitBtn = checkoutForm.querySelector('.submit-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Clear cart
      state.cart = [];
      saveCart();
      updateCartUI();
      
      // Show success message
      submitBtn.textContent = 'Order Placed!';
      submitBtn.style.background = 'linear-gradient(145deg, #2ecc71, #27ae60)';
      
      setTimeout(() => {
        closeCheckout();
        checkoutForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        
        // Show confirmation in cart
        cartItemsContainer.innerHTML = '<p style="text-align:center;color:var(--gold-accent);font-style:italic;margin-top:2rem;">Order successfully placed! Thank you for your patronage.</p>';
        setTimeout(() => {
          cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some wondrous contraptions!</p>';
        }, 4000);
      }, 1500);
    }, 2000);
  }

  // ========== PRODUCT FILTER FUNCTIONS ==========
  function filterProducts(category) {
    state.currentFilter = category;
    
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Staggered reveal animation
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, Array.from(productCards).indexOf(card) * 100);
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update active filter button
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      }
    });
  }

  // ========== GEAR ANIMATIONS ==========
  function animateGearsOnScroll() {
    const gears = document.querySelectorAll('.gear, .gear-bg');
    
    gears.forEach(gear => {
      const speed = gear.classList.contains('left-gear') ? 20 : 
                    gear.classList.contains('right-gear') ? 25 :
                    gear.classList.contains('gear-1') ? 60 :
                    gear.classList.contains('gear-2') ? 80 : 100;
      
      gear.style.animationDuration = `${speed}s`;
    });
  }

  // ========== PRICE TICKER ENHANCEMENT ==========
  function enhancePriceTicker() {
    const ticker = document.querySelector('.ticker-move');
    if (!ticker) return;
    
    // Clone content for seamless loop
    const originalContent = ticker.innerHTML;
    ticker.innerHTML = originalContent + originalContent;
    
    // Add hover pause
    const tickerWrap = document.querySelector('.ticker-wrap');
    tickerWrap.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    tickerWrap.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close cart if open
          if (state.isCartOpen) closeCart();
        }
      });
    });
  }

  // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
  function setupScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe product cards
    productCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
    
    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ========== RIVET EFFECT ON CARDS ==========
  function addRivetEffects() {
    const cards = document.querySelectorAll('.card-inner');
    
    cards.forEach(card => {
      // Add additional rivets at corners
      const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      corners.forEach(corner => {
        const rivet = document.createElement('div');
        rivet.className = `rivet ${corner}`;
        rivet.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle at 30% 30%, var(--brass-light), var(--brass-dark));
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.5);
          ${corner === 'top-left' ? 'top: 6px; left: 6px;' : ''}
          ${corner === 'top-right' ? 'top: 6px; right: 6px;' : ''}
          ${corner === 'bottom-left' ? 'bottom: 6px; left: 6px;' : ''}
          ${corner === 'bottom-right' ? 'bottom: 6px; right: 6px;' : ''}
          z-index: 10;
        `;
        card.appendChild(rivet);
      });
    });
  }

  // ========== FORM VALIDATION & ENHANCEMENT ==========
  function setupFormEnhancements() {
    const inputs = checkoutForm.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add floating label effect
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
      
      // Check if already has value on load
      if (input.value) {
        input.parentElement.classList.add('focused');
      }
    });
    
    // Add CSS for floating labels
    const style = document.createElement('style');
    style.textContent = `
      .form-group {
        position: relative;
        margin-bottom: 1.5rem;
      }
      .form-group label {
        position: absolute;
        left: 0.75rem;
        top: 0.75rem;
        color: var(--brass-dark);
        pointer-events: none;
        transition: all 0.2s ease;
        background: var(--parchment);
        padding: 0 0.25rem;
      }
      .form-group.focused label,
      .form-group input:not(:placeholder-shown) + label,
      .form-group textarea:not(:placeholder-shown) + label,
      .form-group select:not([value=""]) + label {
        top: -0.5rem;
        left: 0.5rem;
        font-size: 0.8rem;
        color: var(--copper-main);
      }
      .form-group input,
      .form-group textarea,
      .form-group select {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  // ========== PARALLAX EFFECT FOR HERO ==========
  function setupParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${rate}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
      }
    });
  }

  // ========== CURSOR EFFECTS ==========
  function setupCustomCursor() {
    // Only on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--brass-dark);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, border-color 0.3s ease;
        mix-blend-mode: difference;
      `;
      document.body.appendChild(cursor);
      
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
      });
      
      // Hover effects for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .product-card');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(1.5)';
          cursor.style.borderColor = 'var(--copper-main)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          cursor.style.borderColor = 'var(--brass-dark)';
        });
      });
    }
  }

  // ========== SOUND EFFECTS (Optional) ==========
  function playSound(soundName) {
    // Create audio context on first user interaction
    if (!window.audioContext) {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = window.audioContext;
    
    // Simple synthesizer sounds
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch(soundName) {
      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'cart':
        oscillator.frequency.value = 400;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
    }
  }

  // ========== INITIALIZE EVERYTHING ==========
  function init() {
    // Setup event listeners
    cartToggle.addEventListener('click', () => {
      playSound('click');
      state.isCartOpen ? closeCart() : openCart();
    });
    
    closeCartBtn.addEventListener('click', () => {
      playSound('click');
      closeCart();
    });
    
    cartOverlay.addEventListener('click', closeCart);
    
    checkoutBtn.addEventListener('click', () => {
      playSound('click');
      openCheckout();
    });
    
    closeCheckoutBtn.addEventListener('click', () => {
      playSound('click');
      closeCheckout();
    });
    
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    
    // Add to cart buttons
    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.getAttribute('data-id');
        const productName = btn.getAttribute('data-name');
        const productPrice = btn.getAttribute('data-price');
        
        playSound('cart');
        addToCart(productId, productName, productPrice);
      });
    });
    
    // Filter buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const filter = btn.getAttribute('data-filter');
        filterProducts(filter);
      });
    });
    
    // Close modal on overlay click
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        playSound('click');
        closeCheckout();
      }
    });
    
    // Escape key to close modals/sidebars
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        playSound('click');
        if (state.isCartOpen) closeCart();
        if (checkoutModal.classList.contains('active')) closeCheckout();
      }
    });
    
    // Initialize all enhancements
    enhancePriceTicker();
    setupSmoothScrolling();
    setupScrollAnimations();
    addRivetEffects();
    setupFormEnhancements();
    setupParallax();
    animateGearsOnScroll();
    setupCustomCursor();
    
    // Initial filter (show all)
    filterProducts('all');
    
    console.log('⚙️ Brass & Cogs Emporium initialized successfully!');
    console.log('🛒 Cart items loaded:', state.cart.length);
  }
  
  // Start the engine!
  init();
});