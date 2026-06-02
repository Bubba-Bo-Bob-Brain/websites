// --- THE GILDED COG: MAIN SCRIPT ---

// 1. Data: The Inventory
const inventory = [
    {
        id: 1,
        name: "Aetheric Compass",
        price: 45.00,
        specs: "Brass casing, Glowing needle, Vacuum sealed.",
        image: "https://images.unsplash.com/photo-1626125345510-47039751d7b6?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        name: "Chronos Pocket Watch",
        price: 120.50,
        specs: "18k Gold plating, Triple timezone, Steam wound.",
        image: "https://images.unsplash.com/photo-1509048191900-102032e735e8?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        name: "Ocular Monocle v4",
        price: 85.00,
        specs: "5x Zoom, Thermal overlay, Leather strap.",
        image: "https://images.unsplash.com/photo-1589939705384-59a8fae8e696?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        name: "Tesla Coil Miniature",
        price: 210.00,
        specs: "Generates 5000V arcs, Glass base, Copper wiring.",
        image: "https://images.unsplash.com/photo-1563206767-5b1d972e813e?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        name: "Mechanical Spider",
        price: 35.00,
        specs: "Wind-up motor, Steel legs, Decorative only.",
        image: "https://images.unsplash.com/photo-1535581652167-3d6b98c36cd9?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        name: "Steam Gauge Cluster",
        price: 65.00,
        specs: "Calibrated for pressure, Brass finish, Wall mountable.",
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&q=80&w=600"
    }
];

// 2. State Management
let cart = JSON.parse(localStorage.getItem('gildedCogCart')) || [];

// 3. DOM Elements
const productContainer = document.getElementById('product-container');
const cartModalOverlay = document.getElementById('cart-modal-overlay');
const cartToggleBtn = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal-price');
const taxEl = document.getElementById('tax-price');
const totalEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const toastContainer = document.getElementById('toast-container');

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// 5. Render Functions
function renderProducts() {
    productContainer.innerHTML = '';
    
    inventory.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        
        // Constructing the HTML with rivets and blueprint styling
        card.innerHTML = `
            <div class="card-rivet top-left"></div>
            <div class="card-rivet top-right"></div>
            <div class="card-rivet bottom-left"></div>
            <div class="card-rivet bottom-right"></div>
            
            <div class="image-frame">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-specs">${product.specs}</p>
                <div class="price-tag">£${product.price.toFixed(2)}</div>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    Add to Manifest
                </button>
            </div>
        `;
        
        productContainer.appendChild(card);
    });
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="gear-icon static" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <p>Your pneumatic tube is empty.</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const product = inventory.find(p => p.id === item.id);
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>Qty: ${item.qty} x £${product.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
}

// 6. Logic Functions
window.addToCart = (id) => {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ id: id, qty: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast(`Added to manifest: ${inventory.find(p => p.id === id).name}`);
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('gildedCogCart', JSON.stringify(cart));
}

function updateCartUI() {
    renderCartItems();
    
    // Calculate totals
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => {
        const product = inventory.find(p => p.id === item.id);
        return acc + (product.price * item.qty);
    }, 0);
    
    const tax = subtotal * 0.05; // 5% Steam Tax
    const total = subtotal + tax;
    
    // Update DOM
    cartCountEl.textContent = totalQty;
    subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
    taxEl.textContent = `£${tax.toFixed(2)}`;
    totalEl.textContent = `£${total.toFixed(2)}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast steam-puff';
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 7. Event Listeners
cartToggleBtn.addEventListener('click', () => {
    cartModalOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModalOverlay.classList.remove('active');
});

// Close modal when clicking outside
cartModalOverlay.addEventListener('click', (e) => {
    if (e.target === cartModalOverlay) {
        cartModalOverlay.classList.remove('active');
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Manifest empty! Add items first.");
        return;
    }
    
    // Simulate processing
    checkoutBtn.textContent = "PROCESSING...";
    checkoutBtn.style.opacity = "0.7";
    
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        cartModalOverlay.classList.remove('active');
        checkoutBtn.textContent = "INITIATE TRANSFER";
        checkoutBtn.style.opacity = "1";
        showToast("Transfer Complete! Goods en route.");
    }, 1500);
});