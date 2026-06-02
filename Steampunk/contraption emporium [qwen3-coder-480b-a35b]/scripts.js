// scripts.js

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const shoppingCart = document.getElementById('shoppingCart');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const exploreBtn = document.querySelector('.explore-btn');

// Cart state
let cart = [];
let total = 0;

// Product data
const products = [
    {
        id: 1,
        name: "Mechanical Pocket Chronometer",
        price: 42.50,
        image: "https://images.unsplash.com/photo-1542903660-e0c3b5d7f0a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Steam-Powered Desk Automaton",
        price: 125.00,
        image: "https://images.unsplash.com/photo-1605902397093-aa89655ff6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Aetherial Vision Spectacles",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Clockwork Forearm Augmentation",
        price: 210.00,
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            
            // Pneumatic tube animation effect
            animateAddToCart(this);
        });
    });
    
    // Explore button animation
    exploreBtn.addEventListener('click', function() {
        this.textContent = "Entering Workshop...";
        this.style.background = "linear-gradient(to bottom, #da8a67, #b87333)";
        
        setTimeout(() => {
            this.textContent = "Workshop Entered!";
            this.style.transform = "scale(1.05)";
        }, 1000);
        
        setTimeout(() => {
            this.textContent = "Explore More Inventions";
            this.style.background = "linear-gradient(to bottom, var(--brass-medium), var(--brass-dark))";
            this.style.transform = "scale(1)";
        }, 2000);
    });
});

// Toggle cart visibility
function toggleCart() {
    shoppingCart.classList.toggle('open');
}

// Add item to cart
function addToCart(productId) {
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    // Update cart count
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty. Add some marvelous inventions!</div>';
        totalPriceElement.textContent = '₤0.00';
        return;
    }
    
    // Calculate total
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `₤${total.toFixed(2)}`;
    
    // Render cart items
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">₤${item.price.toFixed(2)}</div>
                <div class="item-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// Pneumatic tube animation for adding to cart
function animateAddToCart(button) {
    // Create animation element
    const animationElement = document.createElement('div');
    animationElement.className = 'pneumatic-tube-animation';
    animationElement.innerHTML = '⚙';
    
    // Position animation at button location
    const rect = button.getBoundingClientRect();
    animationElement.style.position = 'fixed';
    animationElement.style.left = `${rect.left + rect.width / 2}px`;
    animationElement.style.top = `${rect.top + rect.height / 2}px`;
    animationElement.style.zIndex = '1000';
    animationElement.style.fontSize = '2rem';
    animationElement.style.color = '#d4af37';
    animationElement.style.pointerEvents = 'none';
    
    document.body.appendChild(animationElement);
    
    // Animate to cart
    const cartRect = cartToggle.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width / 2;
    const targetY = cartRect.top + cartRect.height / 2;
    
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
    const duration = Math.min(1500, Math.max(800, distance / 2));
    
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (targetX - startX) * easeProgress;
        const currentY = startY + (targetY - startY) * easeProgress;
        
        animationElement.style.left = `${currentX}px`;
        animationElement.style.top = `${currentY}px`;
        animationElement.style.opacity = `${1 - progress}`;
        animationElement.style.transform = `scale(${1 + progress}) rotate(${progress * 360}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(animationElement);
            
            // Add bounce effect to cart
            cartToggle.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartToggle.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    requestAnimationFrame(animate);
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    if (shoppingCart.classList.contains('open') && 
        !shoppingCart.contains(event.target) && 
        event.target !== cartToggle &&
        !cartToggle.contains(event.target)) {
        shoppingCart.classList.remove('open');
    }
});