document.addEventListener('DOMContentLoaded', () => {
    // --- Shop State Management ---
    let cart = [];
    const taxRate = 0.10; // 10% Aetheric Tax

    // --- DOM Elements ---
    const productGrid = document.querySelector('.product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cartManifest = document.getElementById('cart-manifest');
    const subtotalVal = document.getElementById('subtotal-val');
    const taxVal = document.getElementById('tax-val');
    const grandTotalVal = document.getElementById('grand-total-val');
    const pneumaticCapsule = document.getElementById('capsule');
    const vacuumTubes = document.querySelectorAll('.vacuum-tube');
    const dispatchLever = document.getElementById('dispatch-lever');
    const leverTrack = document.querySelector('.lever-track');
    const dispatchAlert = document.getElementById('dispatch-alert');
    const closeAlertBtn = document.getElementById('close-alert');
    const alertText = document.getElementById('alert-text');

    // --- Simulating Atmospheric Gauges ---
    const pressureNeedle = document.querySelector('#pressure-gauge .gauge-needle');
    const steamNeedle = document.querySelector('#steam-gauge .gauge-needle');

    function fluctuateGauges() {
        // Generates realistic steam gauge oscillations (ranging from -60 to 60 degrees)
        const pressureAngle = Math.floor(Math.random() * 80) - 40;
        const steamAngle = Math.floor(Math.random() * 100) - 50;

        if (pressureNeedle) pressureNeedle.style.transform = `rotate(${pressureAngle}deg)`;
        if (steamNeedle) steamNeedle.style.transform = `rotate(${steamAngle}deg)`;
    }
    
    // Set periodic fluctuations
    setInterval(fluctuateGauges, 2500);
    fluctuateGauges(); // Initial fire

    // --- Product Filtering Logic ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state of buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            const cards = document.querySelectorAll('.product-card');

            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Cart & Pneumatic Dispatch Logic ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            triggerPneumaticTube(() => {
                addToCart(id, name, price);
            });
        });
    });

    function triggerPneumaticTube(callback) {
        // Prevent overlapping animations
        if (pneumaticCapsule.classList.contains('shoot-capsule')) {
            return;
        }

        pneumaticCapsule.classList.add('shoot-capsule');
        
        // Execute the cart update halfway through the animation sequence
        setTimeout(() => {
            callback();
            updateVacuumTubes();
        }, 900);

        // Reset class after animation finishes
        setTimeout(() => {
            pneumaticCapsule.classList.remove('shoot-capsule');
        }, 1800);
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        renderCart();
        updateVacuumTubes();
    }

    function renderCart() {
        cartManifest.innerHTML = '';

        if (cart.length === 0) {
            cartManifest.innerHTML = '<div class="empty-manifest-notice">No orders logged in manifest. Use dispatch buttons to transmit payloads.</div>';
            subtotalVal.textContent = '0 Sovereigns';
            taxVal.textContent = '0 Sovereigns';
            grandTotalVal.textContent = '0 Sovereigns';
            return;
        }

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemRow = document.createElement('div');
            itemRow.className = 'manifest-item';
            itemRow.innerHTML = `
                <div>
                    <span class="manifest-item-name">${item.name}</span>
                    <span class="manifest-item-qty">x${item.quantity}</span>
                </div>
                <div>
                    <span>${itemTotal} Sov</span>
                    <button class="manifest-item-remove" data-id="${item.id}">×</button>
                </div>
            `;
            cartManifest.appendChild(itemRow);
        });

        // Event listeners for remove buttons
        const removeButtons = cartManifest.querySelectorAll('.manifest-item-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.getAttribute('data-id'));
            });
        });

        const tax = subtotal * taxRate;
        const grandTotal = subtotal + tax;

        subtotalVal.textContent = `${subtotal.toFixed(0)} Sovereigns`;
        taxVal.textContent = `${tax.toFixed(1)} Sovereigns`;
        grandTotalVal.textContent = `${grandTotal.toFixed(1)} Sovereigns`;
    }

    function updateVacuumTubes() {
        // Vacuum tubes light up progressively based on number of distinct products inside cart
        const distinctItems = cart.length;

        vacuumTubes.forEach((tube, index) => {
            if (distinctItems > index) {
                tube.classList.add('active');
            } else {
                tube.classList.remove('active');
            }
        });
    }

    // --- Interactive Lever Checkout Control ---
    let isDragging = false;
    let startX = 0;
    let initialLeft = 2;

    // Mouse and Touch Events for pulling the physical brass lever
    dispatchLever.addEventListener('mousedown', startLeverDrag);
    dispatchLever.addEventListener('touchstart', startLeverDrag, { passive: true });

    document.addEventListener('mousemove', dragLever);
    document.addEventListener('touchmove', dragLever, { passive: false });

    document.addEventListener('mouseup', releaseLever);
    document.addEventListener('touchend', releaseLever);

    function startLeverDrag(e) {
        isDragging = true;
        dispatchLever.style.transition = 'none';
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        initialLeft = parseInt(window.getComputedStyle(dispatchLever).left, 10) || 2;
    }

    function dragLever(e) {
        if (!isDragging) return;
        
        // Prevent scrolling on touch devices during lever manipulation
        if (e.cancelable) e.preventDefault();

        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        
        const trackWidth = leverTrack.clientWidth;
        const handleWidth = dispatchLever.clientWidth;
        const maxLeft = trackWidth - handleWidth - 2;

        let newLeft = initialLeft + deltaX;
        
        // Boundaries
        if (newLeft < 2) newLeft = 2;
        if (newLeft > maxLeft) newLeft = maxLeft;

        dispatchLever.style.left = `${newLeft}px`;
    }

    function releaseLever() {
        if (!isDragging) return;
        isDragging = false;

        const trackWidth = leverTrack.clientWidth;
        const handleWidth = dispatchLever.clientWidth;
        const maxLeft = trackWidth - handleWidth - 2;
        const currentLeft = parseInt(dispatchLever.style.left, 10);

        // If pulled past 80% of the track length, trigger purchase execution!
        if (currentLeft > maxLeft * 0.8) {
            dispatchLever.style.transition = 'left 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            dispatchLever.style.left = `${maxLeft}px`;
            
            setTimeout(() => {
                executeCheckout();
            }, 200);
        } else {
            // Spring back to starting position
            snapBackLever();
        }
    }

    function snapBackLever() {
        dispatchLever.style.transition = 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        dispatchLever.style.left = '2px';
    }

    function executeCheckout() {
        if (cart.length === 0) {
            alertText.textContent = "Your requisition manifest is currently void. Load machinery into the pneumatic dispatcher before pulling the transmission lever.";
            dispatchAlert.classList.add('visible');
            snapBackLever();
            return;
        }

        // Complete successful checkout
        alertText.innerHTML = `
            <strong>TRANSMISSION SUCCESSFUL!</strong><br><br>
            Aether-pressure waves have successfully cataloged your order.<br>
            Your brass artifacts are currently being dispatched via physical aerial-courier network.<br><br>
            <em>Estimated transit time: 2 Business Days (or 4 standard celestial rotations).</em>
        `;
        dispatchAlert.classList.add('visible');

        // Reset Shop Systems
        cart = [];
        renderCart();
        updateVacuumTubes();
        snapBackLever();
    }

    // --- Custom Modal Alerts ---
    closeAlertBtn.addEventListener('click', () => {
        dispatchAlert.classList.remove('visible');
    });
});