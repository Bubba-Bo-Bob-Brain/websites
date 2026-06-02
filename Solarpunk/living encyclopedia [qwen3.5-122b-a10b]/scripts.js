document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. PHOTOSYNTHESIS LOADER LOGIC
    // =========================================
    const loader = document.getElementById('loader');
    const energyFill = document.querySelector('.energy-fill');
    const loadingText = document.querySelector('.loading-text');
    
    // Simulate data loading and "photosynthesis"
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 100) progress = 100;
        
        energyFill.style.width = `${progress}%`;
        
        if (progress > 30 && progress < 60) {
            loadingText.textContent = "Absorbing Sunlight...";
        } else if (progress >= 60 && progress < 90) {
            loadingText.textContent = "Synthesizing Data...";
        } else if (progress >= 90) {
            loadingText.textContent = "Bloom Complete.";
        }

        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loader.classList.add('loaded');
                // Remove from DOM after transition to allow interaction
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, 100);

    // =========================================
    // 2. SUNLIGHT INTENSITY SYSTEM
    // =========================================
    const sunSlider = document.getElementById('sun-slider');
    const timeDisplay = document.querySelector('.time-display');
    const root = document.documentElement;

    // Function to update theme based on slider (0 = Night, 50 = Dawn/Dusk, 100 = Noon)
    const updateSunlight = (value) => {
        const intensity = value / 100;
        
        // Update CSS Variable
        root.style.setProperty('--sun-intensity', intensity);

        // Update Time Display
        // Map 0-100 slider to a 24h cycle (approx)
        // 0 = 06:00, 50 = 14:00, 100 = 22:00 (for dramatic effect)
        // Let's do a simpler mapping: 0 = 00:00, 100 = 23:59
        const totalMinutes = Math.floor(intensity * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeDisplay.textContent = timeString;

        // Dynamic Icon Rotation
        const sunIcon = document.querySelector('.sun-icon i');
        // Rotate icon based on sun position
        const rotation = intensity * 180; // 0 to 180 degrees arc
        sunIcon.style.transform = `rotate(${rotation}deg)`;
    };

    // Initialize with default value
    if(sunSlider) {
        sunSlider.addEventListener('input', (e) => {
            updateSunlight(e.target.value);
        });
        
        // Set initial state
        updateSunlight(sunSlider.value);
    }

    // =========================================
    // 3. MOBILE NAVIGATION
    // =========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');

    const toggleMenu = () => {
        sidebar.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    };

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    if (closeSidebar) closeSidebar.addEventListener('click', toggleMenu);

    // Close menu if clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        }
    });

    // =========================================
    // 4. SEED BANK INTERACTIVITY
    // =========================================
    const seeds = document.querySelectorAll('.seed-tag');
    
    seeds.forEach(seed => {
        seed.addEventListener('click', function() {
            // Visual feedback
            this.style.transform = 'scale(0.8)';
            setTimeout(() => this.style.transform = 'scale(1.1)', 100);
            
            // Simulate fetching data
            const seedName = this.getAttribute('title');
            alert(`Accessing Seed Bank Archive: ${seedName}\n\nStatus: Viable\nStorage: Cryo-Sector 4\nGermination Rate: 98%`);
        });
    });

    // =========================================
    // 5. SCROLL ANIMATIONS (Intersection Observer)
    // =========================================
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

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.article-body h2, .article-body p, .media-item, .infobox');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // =========================================
    // 6. DYNAMIC BACKGROUND GRADIENT SHIFT
    // =========================================
    // Subtle gradient shift based on time of day
    const updateBackgroundGradient = () => {
        const intensity = parseFloat(root.style.getPropertyValue('--sun-intensity')) || 0.6;
        
        // Calculate a color shift
        // Low intensity (Night): Darker, cooler
        // High intensity (Day): Lighter, warmer
        
        const r = Math.floor(244 + (255 - 244) * intensity);
        const g = Math.floor(241 + (255 - 241) * intensity);
        const b = Math.floor(234 + (255 - 234) * intensity);
        
        // We are using the CSS variables for the main body color, 
        // but let's add a subtle vignette effect via a pseudo-element if we wanted to get fancy.
        // For now, the CSS variable transition handles the main color shift smoothly.
    };

    // Run update on slider change (already handled in updateSunlight)
    // But let's add a gentle "breathing" animation to the background
    let breath = 0;
    const breathe = () => {
        breath += 0.005;
        const intensity = parseFloat(root.style.getPropertyValue('--sun-intensity')) || 0.6;
        // Slight variation in opacity of the noise texture could go here
        requestAnimationFrame(breathe);
    };
    breathe();
});