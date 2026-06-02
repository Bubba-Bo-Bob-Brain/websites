(function() {
  const cart = [];
  const productGrid = document.getElementById('productGrid');
  const cartCountSpan = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShipping = document.getElementById('cartShipping');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const checkoutPanel = document.getElementById('checkoutPanel');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const cartToggle = document.getElementById('cartToggle');
  const closePanel = document.getElementById('closePanel');
  const checkoutButton = document.getElementById('checkoutButton');
  const tubeContainer = document.getElementById('tubeContainer');
  const capsule = document.getElementById('capsule');

  function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-message">The cart is currently empty. Wind it up with some curiosities.</p>';
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span>£${item.price} × ${item.quantity}</span>
          </div>
          <button class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name}">✕</button>
        </div>
      `).join('');

      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          removeFromCart(id);
        });
      });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = cart.length > 0 ? 5 : 0;
    cartSubtotal.textContent = `£${subtotal}`;
    cartShipping.textContent = `£${shipping}`;
    cartGrandTotal.textContent = `£${subtotal + shipping}`;
  }

  function addToCart(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: productId, name, price, quantity: 1 });
    }
    updateCartDisplay();
    triggerTubeAnimation(card);
  }

  function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
    }
    updateCartDisplay();
  }

  function triggerTubeAnimation(cardElement) {
    if (!tubeContainer || !capsule) return;
    tubeContainer.style.opacity = '1';
    capsule.classList.remove('animate-capsule');
    void capsule.offsetWidth;
    capsule.classList.add('animate-capsule');

    const style = document.createElement('style');
    style.textContent = `
      .animate-capsule {
        animation: shootCapsule 0.9s cubic-bezier(0.15, 0.8, 0.3, 1) forwards;
      }
      @keyframes shootCapsule {
        0% { transform: translateY(60px) scale(0.6); opacity: 0.7; }
        30% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => {
      tubeContainer.style.opacity = '0';
      capsule.classList.remove('animate-capsule');
      style.remove();
    }, 1000);
  }

  function openCart() {
    checkoutPanel.classList.add('open');
    checkoutOverlay.classList.add('active');
  }

  function closeCart() {
    checkoutPanel.classList.remove('open');
    checkoutOverlay.classList.remove('active');
  }

  productGrid.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;
    const productId = button.getAttribute('data-id');
    addToCart(productId);
  });

  cartToggle.addEventListener('click', openCart);
  closePanel.addEventListener('click', closeCart);
  checkoutOverlay.addEventListener('click', closeCart);

  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some brass contraptions first.');
      return;
    }
    alert('Thank you for your patronage! An automaton will deliver your receipt via pneumatic tube shortly.');
    cart.length = 0;
    updateCartDisplay();
    closeCart();
  });

  updateCartDisplay();
})();