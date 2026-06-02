document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Cauldron Loading Screen ---
    const loader = document.getElementById('cauldron-loader');
    
    // Allow the animation to play for at least 2.5 seconds, then fade out
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Remove from DOM after transition to free up resources
        setTimeout(() => {
            loader.remove();
        }, 800);
    }, 2500);

    // --- 2. Theme Toggle (Day/Night) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a little wiggle animation to the toggle knob
        const knob = themeToggle.querySelector('.toggle-knob');
        knob.style.transform = newTheme === 'dark' ? 'translateX(34px) scale(1.1)' : 'translateX(0) scale(1.1)';
        setTimeout(() => {
            knob.style.transform = ''; // Reset to let CSS handle it
        }, 200);
    });

    // --- 3. Scroll Animations (Fade In) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.potion-card, .specimen, .journal-entry');
    
    // Set initial state for animated elements
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // --- 4. Seasonal Wheel Logic (Drag to Spin) ---
    const wheel = document.querySelector('.wheel-inner');
    const wheelInfo = document.getElementById('wheel-detail');
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0; // Keep track of cumulative rotation
    let center = { x: 0, y: 0 };

    // Seasonal Data
    const seasons = [
        { name: 'Spring', text: 'Time for: Nettle tea, planting seeds, and morning dew.', color: '#d4a017' },
        { name: 'Summer', text: 'Time for: Sun tea, harvesting lavender, and long twilight.', color: '#5c6b54' },
        { name: 'Autumn', text: 'Time for: Apple cider, gathering roots, and falling leaves.', color: '#c17c74' },
        { name: 'Winter', text: 'Time for: Firewood, pine needle tea, and star gazing.', color: '#5d4037' }
    ];

    function getAngle(x, y) {
        const rect = wheel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    }

    function updateWheelInfo(rotation) {
        // Normalize rotation to 0-360 range
        let normalizedRotation = rotation % 360;
        if (normalizedRotation < 0) normalizedRotation += 360;
        
        // Determine index based on which segment is at the top (270deg in atan2, or visually adjusted)
        // Our wheel starts with Spring at 0deg (Right). 
        // To get Spring to Top (-90deg visual), we need to rotate -90.
        // Let's simplify: map rotation to the array index.
        // 0 rot: Spring (Right)
        // -90 rot: Summer (Top) ... wait, let's look at CSS conic gradient.
        // CSS: Gold(0-90), Sage(90-180), Rose(180-270), Brown(270-360).
        // If I rotate -90deg, the Sage sector (90-180) moves to 0-90 (Top Right).
        
        // Let's rely on the visual snap points:
        // Snap 0 (Spring Right)
        // Snap -90 (Summer Top)
        // Snap -180 (Autumn Left)
        // Snap -270 (Winter Bottom)
        
        // Actually, let's just detect which 90 degree quadrant the top point falls into.
        // Or simpler: calculate index based on rotation.
        
        // Logic:
        // Rotation 0   -> Spring is at 3 o'clock.
        // Rotation -90 -> Summer is at 12 o'clock.
        
        // Let's map rotation to the "Active" index.
        // We want the season at the TOP (12 o'clock).
        
        // Adjustment: 12 o'clock corresponds to -90deg in standard circle math, 
        // but let's just work with the CSS visual state.
        
        let index = 0;
        // We use modulus to snap to nearest 90 degrees
        const snap = Math.round(rotation / 90) * 90;
        
        // Map specific rotations to seasons based on visual layout
        // Initial State: Spring is roughly at 1 o'clock (45deg).
        // If we rotate -45, Spring is at 12 o'clock.
        
        // Let's refine based on the CSS .season positions:
        // Spring is at 45deg translate.
        // To get Spring to top, container needs -45 rotation.
        
        const relativeRotation = (rotation - 45) % 360;
        
        // Divide by 90 to get index (0, 1, 2, 3)
        // We need to handle negative modulo correctly for JS
        let sector = Math.floor(((relativeRotation % 360) + 360) % 360 / 90);
        
        // Adjust because our array order might differ from visual rotation direction
        // Array: 0:Spring, 1:Summer, 2:Autumn, 3:Winter
        // Rotating counter-clockwise (negative) goes Spring -> Winter -> Autumn...
        // So we reverse the index logic or rotate clockwise.
        
        // Let's try simple mapping based on snap values (Clockwise rotation):
        // -45 (Spring Top) -> Index 0
        // -135 (Summer Top) -> Index 1
        // -225 (Autumn Top) -> Index 2
        // -315 (Winter Top) -> Index 3
        
        const normalizedSnap = (snap - 45) % 360; 
        // This is getting complex. Let's use a simpler "Click to rotate" approach 
        // or map the snap value directly.
        
        let activeIndex = 0;
        if (snap === -45 || snap === 315) activeIndex = 0; // Spring
        else if (snap === -135 || snap === 225) activeIndex = 1; // Summer
        else if (snap === -225 || snap === 135) activeIndex = 2; // Autumn
        else if (snap === -315 || snap === 45) activeIndex = 3; // Winter
        
        // Fallback for 0
        if(snap === 0) activeIndex = 3; // Winter roughly
        
        const data = seasons[activeIndex];
        
        wheelInfo.style.opacity = 0;
        setTimeout(() => {
            wheelInfo.innerHTML = `<strong style="color:${data.color}">${data.name}:</strong> ${data.text}`;
            wheelInfo.style.opacity = 1;
        }, 200);
    }

    // Mouse Events
    wheel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngle(e.clientX, e.clientY) - currentRotation;
        wheel.style.transition = 'none'; // Remove transition for instant drag
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const angle = getAngle(e.clientX, e.clientY);
        currentRotation = angle - startAngle;
        wheel.style.transform = `rotate(${currentRotation}deg)`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        // Snap to nearest 45 degrees (to align seasons to top)
        const snap = Math.round(currentRotation / 90) * 90;
        currentRotation = snap;
        
        wheel.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        updateWheelInfo(currentRotation);
    });

    // Touch Events (Mobile)
    wheel.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startAngle = getAngle(touch.clientX, touch.clientY) - currentRotation;
        wheel.style.transition = 'none';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const angle = getAngle(touch.clientX, touch.clientY);
        currentRotation = angle - startAngle;
        wheel.style.transform = `rotate(${currentRotation}deg)`;
    });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const snap = Math.round(currentRotation / 90) * 90;
        currentRotation = snap;
        wheel.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        updateWheelInfo(currentRotation);
    });

    // Initialize wheel info
    updateWheelInfo(-45); // Start with Spring at top

    // --- 5. Potion Brewing Interactions ---
    const brewBtns = document.querySelectorAll('.brew-btn');
    
    brewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.potion-card');
            const liquid = card.querySelector('.liquid');
            
            // Button feedback
            const originalText = this.innerText;
            this.innerText = "Brewing...";
            this.disabled = true;
            
            // Liquid Effect
            liquid.style.transition = "height 0.5s ease-in-out, background 0.5s";
            liquid.style.height = "95%";
            
            // Simulate brewing process
            setTimeout(() => {
                this.innerText = "Ready!";
                this.style.backgroundColor = "var(--accent-sage)";
                this.style.color = "white";
                this.style.borderColor = "var(--accent-sage)";
                
                // Reset after a while
                setTimeout(() => {
                    this.innerText = originalText;
                    this.disabled = false;
                    this.style.backgroundColor = "";
                    this.style.color = "";
                    this.style.borderColor = "";
                    liquid.style.height = "80%"; // Back to normal
                }, 3000);
            }, 1500);
        });
    });

    // --- 6. Floating Ingredients Parallax (Hero Section) ---
    const heroSection = document.getElementById('hero');
    const ingredients = document.querySelectorAll('.ingredient');
    
    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        ingredients.forEach((ing, index) => {
            const speed = (index + 1) * 2;
            ing.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });
});