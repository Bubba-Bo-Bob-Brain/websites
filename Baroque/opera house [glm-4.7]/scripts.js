document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. The Grand Curtain Reveal --- */
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');
    const loadingText = document.querySelector('.loading-text');
    const overlay = document.getElementById('curtain-overlay');

    // Allow the browser to render the initial state before opening
    setTimeout(() => {
        curtainLeft.classList.add('open');
        curtainRight.classList.add('open');
        loadingText.style.opacity = '0';
        
        // Play a subtle sound effect if audio context were allowed (optional placeholder)
        // For now, we rely on the visual impact.
    }, 800);

    // Remove overlay from DOM after animation completes to allow clicks
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2800);


    /* --- 2. Chiaroscuro Spotlight (Mouse Follow) --- */
    const ambientLight = document.querySelector('.ambient-light');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Update the radial gradient center based on mouse position
        // We use requestAnimationFrame for performance
        requestAnimationFrame(() => {
            ambientLight.style.background = `radial-gradient(
                circle at ${x * 100}% ${y * 100}%, 
                rgba(80, 10, 10, 0.2) 0%, 
                rgba(20, 0, 0, 0.85) 60%,
                rgba(0, 0, 0, 0.98) 100%
            )`;
        });
    });


    /* --- 3. Scroll Reveal Animation (Staggered) --- */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index to create a cascade effect
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100); // 100ms stagger
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.event-card, .section-header, .hero-content');
    
    revealElements.forEach(el => {
        // Set initial state via JS to ensure fallback if CSS fails
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        observer.observe(el);
    });

    // Define the revealed class behavior
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    /* --- 4. Seating Chart Interaction --- */
    const availableSeats = document.querySelectorAll('.box.available, .seat.available');
    let totalCost = 0;

    // Inject Price Display dynamically
    const theatreLayout = document.querySelector('.theatre-layout');
    const priceDisplay = document.createElement('div');
    priceDisplay.className = 'price-display';
    priceDisplay.innerHTML = 'Total Tribute: <span class="amount">0</span> Gold Coins';
    
    // Styles for the dynamic price display
    priceDisplay.style.cssText = `
        margin-top: 2rem;
        font-family: 'Cinzel Decorative', cursive;
        font-size: 1.5rem;
        color: var(--color-gold);
        background: rgba(0,0,0,0.6);
        padding: 1rem 2rem;
        border: 1px solid var(--color-gold-dim);
        display: inline-block;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    theatreLayout.appendChild(priceDisplay);
    
    // Trigger reflow to ensure transition works
    setTimeout(() => { priceDisplay.style.opacity = '1'; }, 100);

    availableSeats.forEach(seat => {
        seat.addEventListener('click', function() {
            const price = parseInt(this.getAttribute('data-price'));
            
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                totalCost -= price;
            } else {
                // Select
                this.classList.add('selected');
                totalCost += price;
                
                // Add a tiny glow animation to the price display
                priceDisplay.style.textShadow = "0 0 10px var(--color-gold)";
                setTimeout(() => {
                    priceDisplay.style.textShadow = "none";
                }, 300);
            }
            
            // Update text with counting animation logic
            const amountEl = priceDisplay.querySelector('.amount');
            animateValue(amountEl, parseInt(amountEl.innerText), totalCost, 300);
        });
    });

    // Helper function to animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }


    /* --- 5. Interactive Chandelier (Dim Lights) --- */
    const chandelier = document.querySelector('.chandelier-body');
    let lightsDimmed = false;

    chandelier.style.cursor = 'pointer';
    chandelier.title = "Click to dim the house lights";

    chandelier.addEventListener('click', () => {
        lightsDimmed = !lightsDimmed;
        
        if (lightsDimmed) {
            // Dim the house
            document.body.style.transition = "filter 1.5s ease";
            document.body.style.filter = "brightness(0.4) sepia(0.3)";
            
            // Dim the chandelier candles themselves
            document.querySelectorAll('.candle').forEach(candle => {
                candle.style.boxShadow = "0 0 5px rgba(255, 170, 0, 0.3)";
                candle.style.background = "#666";
            });
        } else {
            // Restore lights
            document.body.style.filter = "none";
            
            // Brighten candles
            document.querySelectorAll('.candle').forEach(candle => {
                candle.style.boxShadow = "";
                candle.style.background = "";
            });
        }
    });
});