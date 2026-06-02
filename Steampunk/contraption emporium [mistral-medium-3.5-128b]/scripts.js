// ===== DOM Elements =====
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartFinalTotal = document.getElementById('cartFinalTotal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const productCards = document.querySelectorAll('.product-card');

// ===== Cart State =====
let cart = [];

// ===== Constants =====
const TAX_RATE = 0.12; // 12% Aetheric Tax
const PNEUMATIC_TUBE_DURATION = 1000; // 1 second

// ===== Initialize Cart =====
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is as empty as a boiler without steam.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" data-name="${item.name}">&times;</button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-name');
                removeFromCart(itemName);
            });
        });
    }

    // Calculate and update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    cartSubtotal.textContent = `£${subtotal.toFixed(2)}`;
    cartTax.textContent = `£${tax.toFixed(2)}`;
    cartFinalTotal.textContent = `£${total.toFixed(2)}`;
    cartTotal.textContent = `£${total.toFixed(2)}`;
}

// ===== Add to Cart =====
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartDisplay();
    saveCartToLocalStorage();

    // Trigger pneumatic tube animation
    const button = document.querySelector(`.add-to-cart[data-name="${name}"]`);
    const rect = button.getBoundingClientRect();
    const tube = document.createElement('div');
    tube.className = 'pneumatic-tube';
    tube.style.left = `${rect.left + rect.width / 2 - 15}px`;
    tube.style.top = `${rect.top}px`;
    document.body.appendChild(tube);

    // Animate the tube to the cart icon
    const cartIconRect = cartToggle.getBoundingClientRect();
    setTimeout(() => {
        tube.style.left = `${cartIconRect.left + cartIconRect.width / 2 - 15}px`;
        tube.style.top = `${cartIconRect.top}px`;
        tube.style.transform = 'scale(0.5)';
        tube.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        tube.remove();
    }, PNEUMATIC_TUBE_DURATION);

    // Play a subtle sound (optional, if we had audio)
    playSteampunkSound();
}

// ===== Remove from Cart =====
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartDisplay();
    saveCartToLocalStorage();
    playSteampunkSound();
}

// ===== Local Storage =====
function saveCartToLocalStorage() {
    localStorage.setItem('steampunkCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('steampunkCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// ===== Event Listeners =====
// Toggle cart sidebar
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    playSteampunkSound();
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    playSteampunkSound();
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
});

// Add to cart buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        addToCart(name, price);
    });
});

// Checkout overlay
document.querySelector('.checkout-button').addEventListener('click', () => {
    if (cart.length > 0) {
        checkoutOverlay.classList.add('open');
        playSteampunkSound();
    } else {
        alert('Your cart is empty! Add some marvels before checking out.');
    }
});

closeCheckout.addEventListener('click', () => {
    checkoutOverlay.classList.remove('open');
    playSteampunkSound();
});

// Close checkout when clicking outside
checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) {
        checkoutOverlay.classList.remove('open');
    }
});

// Form submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const method = document.getElementById('method').value;

    if (!name || !email || !address || !method) {
        alert('Please fill in all fields, good sir/madam!');
        return;
    }

    // Simulate order processing
    const orderNumber = Math.floor(Math.random() * 1000000);
    alert(`Order #${orderNumber} placed successfully!\nYour mechanical marvels will be dispatched via pneumatic tube shortly.\nThank you for your patronage, ${name}!`);

    // Clear cart and form
    cart = [];
    updateCartDisplay();
    checkoutForm.reset();
    checkoutOverlay.classList.remove('open');
    localStorage.removeItem('steampunkCart');
    playSteampunkSound();
});

// ===== Steampunk Sound Effect (Optional) =====
// Since we can't embed audio directly, this is a placeholder for a function
// that would play a steampunk-themed sound (e.g., gear turning, hissing steam).
function playSteampunkSound() {
    // In a real implementation, you might use:
    // const audio = new Audio('steampunk-sound.mp3');
    // audio.play().catch(e => console.log("Audio play failed:", e));
    // For now, we'll just log to the console for demonstration.
    console.log('*Steampunk sound effect plays*');
}

// ===== Gear Animation Enhancements =====
// Add subtle gear rotations on hover for product cards
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const rivets = card.querySelector('.product-rivets');
        if (rivets) {
            rivets.style.transform = 'rotate(10deg)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const rivets = card.querySelector('.product-rivets');
        if (rivets) {
            rivets.style.transform = 'rotate(0deg)';
        }
    });
});

// ===== Initialize on Load =====
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();

    // Add a subtle "gear" cursor for the entire page
    document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'8\' fill=\'%23b8860b\'/%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'4\' fill=\'%235a3e2b\'/%3E%3C/svg%3E"), auto';
});