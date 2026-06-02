document.addEventListener('DOMContentLoaded', () => {
    /* --- STATE MANAGEMENT --- */
    const state = {
        cart: [],
        isCartOpen: false,
        currency: '£'
    };

    /* --- DOM ELEMENTS --- */
    const elements = {
        cartBtn: document.getElementById('cart-btn'),
        cartDrawer: document.getElementById('cart-drawer'),
        closeCartBtn: document.getElementById('close-cart'),
        cartItemsList: document.getElementById('cart-items'),
        cartTotal: document.getElementById('cart-total'),
        cartCount: document.getElementById('cart-count'),
        cartNeedle: document.getElementById('cart-needle'),
        addToCartBtns: document.querySelectorAll('.add-btn'),
        checkoutBtn: document.getElementById('checkout-btn'),
        sortSelect: document.getElementById('sort-select'),
        productGrid: document.getElementById('product-list'),
        toast: document.getElementById('toast'),
        toastMsg: document.querySelector('.toast-message')
    };

    /* --- AUDIO CONTEXT (Optional Steam Hiss) --- */
    // Creating a simple synthesized sound effect using Web Audio API for immersion
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSteamHiss() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    function playClickClack() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    /* --- CORE FUNCTIONS --- */

    function formatCurrency(amount) {
        return parseFloat(amount).toFixed(2) + ' ' + state.currency;
    }

    function updateCartUI() {
        // Clear current list
        elements.cartItemsList.innerHTML = '';

        let total = 0;
        let itemCount = 0;

        if (state.cart.length === 0) {
            elements.cartItemsList.innerHTML = '<li class="empty-msg">The pneumatic tube is empty.</li>';
        } else {
            state.cart.forEach(item => {
                total += item.price * item.quantity;
                itemCount += item.quantity;

                const li = document.createElement('li');
                li.className = 'manifest-item';
                li.innerHTML = `
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">x${item.quantity}</span>
                    </div>
                    <div class="item-total">
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                        <span class="remove-item" data-id="${item.id}">[VOID]</span>
                    </div>
                `;
                elements.cartItemsList.appendChild(li);
            });
        }

        // Update Total Display
        elements.cartTotal.textContent = formatCurrency(total);
        elements.cartCount.textContent = itemCount;

        // Animate Gauge Needle
        // Max items for full gauge = 5
        const maxItems = 5;
        const percentage = Math.min(itemCount, maxItems) / maxItems;
        // Rotate from -135deg to 135deg (Total 270 range)
        const rotation = -135 + (percentage * 270);
        elements.cartNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    function addToCart(id, name, price, btnElement) {
        const existingItem = state.cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ id, name, price, quantity: 1 });
        }

        updateCartUI();
        triggerPneumaticAnimation(btnElement);
        showToast(`Added: ${name}`);
        playSteamHiss();
    }

    function removeFromCart(id) {
        const index = state.cart.findIndex(item => item.id === id);
        if (index !== -1) {
            if (state.cart[index].quantity > 1) {
                state.cart[index].quantity--;
            } else {
                state.cart.splice(index, 1);
            }
        }
        playClickClack();
        updateCartUI();
    }

    function triggerPneumaticAnimation(startElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = elements.cartBtn.getBoundingClientRect();

        // Create a "capsule"
        const capsule = document.createElement('div');
        capsule.style.position = 'fixed';
        capsule.style.width = '12px';
        capsule.style.height = '12px';
        capsule.style.background = '#ffcc66';
        capsule.style.borderRadius = '50%';
        capsule.style.border = '2px solid #b87333';
        capsule.style.zIndex = '2000';
        capsule.style.left = `${startRect.left + startRect.width / 2}px`;
        capsule.style.top = `${startRect.top}px`;
        capsule.style.pointerEvents = 'none';
        capsule.style.boxShadow = '0 0 10px #ffcc66';
        
        document.body.appendChild(capsule);

        // Animate
        const animation = capsule.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.2)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });

        animation.onfinish = () => {
            capsule.remove();
            // Shake the cart button slightly
            elements.cartBtn.animate([
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(-10deg)' },
                { transform: 'rotate(10deg)' },
                { transform: 'rotate(0deg)' }
            ], { duration: 200 });
        };
    }

    function showToast(message) {
        elements.toastMsg.textContent = message;
        elements.toast.classList.add('show');
        
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    function toggleCart() {
        state.isCartOpen = !state.isCartOpen;
        if (state.isCartOpen) {
            elements.cartDrawer.classList.add('open');
            playClickClack();
        } else {
            elements.cartDrawer.classList.remove('open');
        }
    }

    function handleCheckout() {
        if (state.cart.length === 0) {
            showToast("Manifest is empty!");
            return;
        }
        
        // Simulate processing
        const btnOriginalText = elements.checkoutBtn.innerHTML;
        elements.checkoutBtn.innerHTML = '<span class="btn-text">TRANSMITTING...</span>';
        elements.checkoutBtn.disabled = true;

        setTimeout(() => {
            state.cart = [];
            updateCartUI();
            toggleCart();
            elements.checkoutBtn.innerHTML = btnOriginalText;
            elements.checkoutBtn.disabled = false;
            
            // Show success modal or alert
            alert("ORDER CONFIRMED\n\nYour contraptions are being loaded into the pneumatic tubes.\nDelivery expected within 3 fortnights.");
        }, 1500);
    }

    function sortProducts(sortType) {
        const cards = Array.from(elements.productGrid.children);
        
        cards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price-tag').getAttribute('data-value'));
            const priceB = parseFloat(b.querySelector('.price-tag').getAttribute('data-value'));

            if (sortType === 'price-asc') {
                return priceA - priceB;
            } else if (sortType === 'price-desc') {
                return priceB - priceA;
            } else {
                // Default: Original order (using a data-index if we had one, but here just appendChild usually keeps DOM order if not shuffled)
                // Since we are re-ordering, 'default' is tricky without original index. 
                // Let's just reverse the shuffle or do nothing.
                return 0; 
            }
        });

        elements.productGrid.innerHTML = '';
        cards.forEach(card => {
            // Add fade in effect
            card.style.opacity = '0';
            elements.productGrid.appendChild(card);
            setTimeout(() => card.style.opacity = '1', 50);
        });
    }

    /* --- EVENT LISTENERS --- */

    // Add to Cart Buttons
    elements.addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            addToCart(id, name, price, btn);
        });
    });

    // Cart Toggle
    elements.cartBtn.addEventListener('click', toggleCart);
    elements.closeCartBtn.addEventListener('click', toggleCart);

    // Remove from Cart (Event Delegation)
    elements.cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.getAttribute('data-id');
            removeFromCart(id);
        }
    });

    // Checkout
    elements.checkoutBtn.addEventListener('click', handleCheckout);

    // Sorting
    elements.sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (state.isCartOpen && 
            !elements.cartDrawer.contains(e.target) && 
            !elements.cartBtn.contains(e.target)) {
            toggleCart();
        }
    });

    // Initialize UI
    updateCartUI();
});