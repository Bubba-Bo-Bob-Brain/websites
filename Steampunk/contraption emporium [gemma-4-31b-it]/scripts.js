document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');
    const pneumaticTube = document.getElementById('pneumatic-tube');
    const capsule = document.querySelector('.capsule');
    const gearElements = document.querySelectorAll('.gear');

    // --- 1. Pneumatic Dispatch System ---
    // This creates the visual effect of an item being sucked into a tube
    const handleAddToCart = (e, productId, name, price) => {
        const btn = e.target;
        const checkoutPanel = document.querySelector('.checkout-panel');
        
        // Get starting position (the button) and end position (the cart)
        const startRect = btn.getBoundingClientRect();
        const endRect = checkoutPanel.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = endRect.left;
        const endY = endRect.top + (endRect.height / 4);

        // Trigger Capsule Animation
        capsule.style.display = 'block';
        capsule.style.left = `${startX}px`;
        capsule.style.top = `${startY}px`;

        // Use Web Animations API for a smooth, "vacuum-like" path
        capsule.animate([
            { left: `${startX}px`, top: `${startY}px`, scale: 1 },
            { left: `${startX * 1.2}px`, top: `${startY * 0.8}px`, scale: 1.2 }, // Slight curve
            { left: `${endX}px`, top: `${endY}px`, scale: 0.5 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
            fill: 'forwards'
        }).onfinish = () => {
            capsule.style.display = 'none';
            updateCart(productId, name, price);
        };

        // Haptic-like button feedback
        btn.innerText = "DISPATCHING...";
        setTimeout(() => { btn.innerText = "Dispatch to Cart"; }, 800);
    };

    // --- 2. Cart Logic ---
    const updateCart = (id, name, price) => {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        renderCart();
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your manifest is currently void.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>Qty: ${item.quantity}</small>
                    </div>
                    <div>£${(item.price * item.quantity).toFixed(2)}</div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Animate the total price ticker
        animatePrice(cartTotalDisplay, total);
    };

    const animatePrice = (element, targetValue) => {
        const startValue = parseFloat(element.innerText.replace('£ ', '')) || 0;
        const duration = 500;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = startValue + (targetValue - startValue) * progress;
            element.innerText = `£ ${current.toFixed(2)}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    };

    // --- 3. Gear-Sync Scroll Effect ---
    // Gears speed up as you scroll faster
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(st - lastScrollTop);
        
        gearElements.forEach((gear, index) => {
            // Increase rotation speed based on scroll delta
            const extraRotation = scrollDelta * (0.1 + index * 0.05);
            gear.style.transform = `rotate(${extraRotation}deg)`;
        });
        lastScrollTop = st <= 0 ? 0 : st;
    });

    // --- 4. Initialization ---
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.patent-card');
            const id = card.dataset.id;
            const name = card.querySelector('h3').innerText;
            const price = parseFloat(card.querySelector('.amount').dataset.price);
            handleAddToCart(e, id, name, price);
        });
    });

    document.getElementById('finalize-purchase').addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your manifest is empty, traveler.");
            return;
        }
        
        const btn = document.getElementById('finalize-purchase');
        btn.innerText = "PROCESSING GOLD...";
        btn.disabled = true;

        setTimeout(() => {
            alert("Transaction complete. Your contraptions are being prepared for steam-carriage delivery!");
            cart.length = 0;
            renderCart();
            btn.innerText = "Settle Account";
            btn.disabled = false;
        }, 2000);
    });
});