/* Baroque Opera House - JavaScript */
/* Interactive elements, animations, and immersive effects */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 La Scala d\'Oro Baroque Opera House initialized');
    
    // ============================================
    // 1. CURTAIN REVEAL ANIMATION
    // ============================================
    
    const leftCurtain = document.querySelector('.left-curtain');
    const rightCurtain = document.querySelector('.right-curtain');
    const curtainOverlay = document.querySelector('.curtain-overlay');
    const mainContainer = document.querySelector('.main-container');
    const curtainPull = document.querySelector('.curtain-pull');
    
    // Animate curtain opening
    function openCurtains() {
        // Add slight delay for dramatic effect
        setTimeout(() => {
            leftCurtain.style.transform = 'translateX(-100%) rotateY(-20deg)';
            rightCurtain.style.transform = 'translateX(100%) rotateY(20deg)';
            
            // Animate curtain pull tassel
            curtainPull.style.animation = 'pullUp 2s ease 1s forwards';
            
            // Remove curtain overlay after animation completes
            setTimeout(() => {
                curtainOverlay.style.opacity = '0';
                curtainOverlay.style.pointerEvents = 'none';
                
                // Enable scrolling
                document.body.style.overflow = 'auto';
                
                // Start chandelier animations
                startChandelierEffects();
                
                // Start dynamic lighting
                startDynamicLighting();
                
            }, 2000);
        }, 1500);
    }
    
    // Start curtain animation on page load
    setTimeout(openCurtains, 1000);
    
    // ============================================
    // 2. CHANDELIER ANIMATIONS & LIGHTING EFFECTS
    // ============================================
    
    const chandelierArms = document.querySelectorAll('.chandelier-arm');
    const chandelierCrystals = document.querySelectorAll('.crystal');
    const chandelierLight = document.querySelector('.chandelier-light');
    const lightRays = document.querySelector('.light-rays');
    const dynamicShadows = document.querySelector('.dynamic-shadows');
    
    function startChandelierEffects() {
        // Animate chandelier arms (gentle sway)
        chandelierArms.forEach((arm, index) => {
            arm.style.animation = `armSway ${3 + index * 0.5}s ease-in-out infinite alternate`;
        });
        
        // Animate crystals (sparkle effect)
        chandelierCrystals.forEach((crystal, index) => {
            crystal.style.animation = `crystalSparkle ${2 + index * 0.3}s ease-in-out infinite alternate`;
        });
        
        // Enhance light pulse animation
        chandelierLight.style.animation = 'lightPulseEnhanced 5s ease-in-out infinite';
        
        // Create dynamic light rays movement
        createMovingLightPatterns();
    }
    
    // Create moving light patterns from chandelier
    function createMovingLightPatterns() {
        const lightOverlay = document.querySelector('.global-light-overlay');
        
        // Add multiple light circles for dynamic effect
        for (let i = 0; i < 5; i++) {
            const lightCircle = document.createElement('div');
            lightCircle.className = 'light-circle';
            lightCircle.style.cssText = `
                position: absolute;
                width: ${200 + i * 50}px;
                height: ${200 + i * 50}px;
                background: radial-gradient(circle, 
                    rgba(232, 223, 202, ${0.05 - i * 0.01}) 0%, 
                    transparent 70%);
                border-radius: 50%;
                top: ${100 + i * 40}px;
                left: ${(i % 3) * 30}%;
                animation: lightFloat ${8 + i * 2}s ease-in-out infinite alternate;
                pointer-events: none;
                z-index: 1;
            `;
            lightOverlay.appendChild(lightCircle);
        }
    }
    
    // ============================================
    // 3. PERFORMANCE CARDS INTERACTIVITY
    // ============================================
    
    const performanceCards = document.querySelectorAll('.performance-card');
    const viewDetailButtons = document.querySelectorAll('.view-details-btn');
    
    // Add interactive effects to performance cards
    performanceCards.forEach(card => {
        const cardSpotlight = card.querySelector('.card-spotlight');
        
        // Mouse move spotlight effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            cardSpotlight.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
        });
        
        // Touch interaction for mobile
        card.addEventListener('touchmove', (e) => {
            const rect = card.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            cardSpotlight.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
            cardSpotlight.style.opacity = '0.5';
        });
        
        // Add subtle glow on touch end
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                cardSpotlight.style.opacity = '0';
            }, 300);
        });
        
        // View details button interaction
        const viewBtn = card.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPerformanceDetails(card.dataset.performance);
        });
    });
    
    // Performance details modal
    function showPerformanceDetails(performanceId) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'performance-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="performance-modal">
                <div class="modal-frame">
                    <div class="frame-corner tl"></div>
                    <div class="frame-corner tr"></div>
                    <div class="frame-corner bl"></div>
                    <div class="frame-corner br"></div>
                </div>
                <div class="modal-content">
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                    <h3>Performance Details</h3>
                    <p>Detailed information for performance ${performanceId} would appear here.</p>
                    <div class="modal-actions">
                        <button class="btn-gilded">Purchase Tickets</button>
                        <button class="btn-velvet">Add to Calendar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Add styles for modal
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .performance-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.5s ease;
            }
            
            .performance-modal {
                position: relative;
                background: linear-gradient(to bottom, #3d2b1f, #5d4037);
                width: 90%;
                max-width: 600px;
                padding: 2rem;
                border: 4px solid #d4af37;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                animation: modalAppear 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            
            .modal-frame {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
            }
            
            .modal-frame .frame-corner {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 2px solid #d4af37;
            }
            
            .modal-frame .tl {
                top: 0;
                left: 0;
                border-right: none;
                border-bottom: none;
                border-radius: 8px 0 0 0;
            }
            
            .modal-frame .tr {
                top: 0;
                right: 0;
                border-left: none;
                border-bottom: none;
                border-radius: 0 8px 0 0;
            }
            
            .modal-frame .bl {
                bottom: 0;
                left: 0;
                border-right: none;
                border-top: none;
                border-radius: 0 0 0 8px;
            }
            
            .modal-frame .br {
                bottom: 0;
                right: 0;
                border-left: none;
                border-top: none;
                border-radius: 0 0 8px 0;
            }
            
            .modal-content {
                position: relative;
                z-index: 2;
                color: #f8f4e9;
            }
            
            .modal-close {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 40px;
                height: 40px;
                background: #8b1e3f;
                color: #f8f4e9;
                border: 2px solid #d4af37;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #d4af37;
                color: #3d2b1f;
                transform: rotate(90deg);
            }
            
            .modal-content h3 {
                font-family: 'Cinzel', serif;
                font-size: 2rem;
                color: #d4af37;
                margin-bottom: 1rem;
            }
            
            .modal-content p {
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
            }
            
            .btn-gilded, .btn-velvet {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 4px;
                font-family: 'Cinzel', serif;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .btn-gilded {
                background: linear-gradient(to bottom, #d4af37, #c19a3e);
                color: #3d2b1f;
            }
            
            .btn-velvet {
                background: linear-gradient(to bottom, #8b1e3f, #6d0d1f);
                color: #f8f4e9;
            }
            
            .btn-gilded:hover, .btn-velvet:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            }
            
            @keyframes modalAppear {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        
        document.head.appendChild(modalStyles);
        
        // Close modal functionality
        const closeBtn = modalOverlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                modalOverlay.remove();
                modalStyles.remove();
            }, 500);
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    modalOverlay.remove();
                    modalStyles.remove();
                }, 500);
            }
        });
        
        // Add fadeOut animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }
    
    // ============================================
    // 4. SEATING CHART INTERACTIVITY
    // ============================================
    
    const seatingTiers = document.querySelectorAll('.seating-tier');
    const seats = document.querySelectorAll('[data-seat]');
    const infoCards = document.querySelectorAll('.info-card');
    const stageCurtains = document.querySelectorAll('.stage-curtain');
    
    // Highlight tier on hover
    seatingTiers.forEach(tier => {
        tier.addEventListener('mouseenter', () => {
            const tierType = tier.dataset.tier;
            highlightTier(tierType);
        });
        
        tier.addEventListener('mouseleave', () => {
            removeTierHighlight();
        });
    });
    
    // Seat selection
    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            // Remove existing selection
            seats.forEach(s => s.classList.remove('selected'));
            
            // Select this seat
            this.classList.add('selected');
            
            // Get tier from seat class
            let tier = 'box';
            if (this.classList.contains('seat-dress')) tier = 'dress';
            if (this.classList.contains('seat-gallery')) tier = 'gallery';
            
            // Update info card highlight
            updateSelectedTier(tier);
            
            // Animate stage curtains slightly
            animateStageCurtains();
            
            // Play subtle selection sound (simulated)
            playSelectionSound();
        });
    });
    
    // Highlight tier function
    function highlightTier(tier) {
        seatingTiers.forEach(t => {
            if (t.dataset.tier === tier) {
                t.style.boxShadow = '0 0 0 2px #d4af37, 0 10px 30px rgba(0, 0, 0, 0.5)';
                t.style.transform = 'translateY(-5px)';
            } else {
                t.style.opacity = '0.7';
            }
        });
    }
    
    // Remove tier highlight
    function removeTierHighlight() {
        seatingTiers.forEach(t => {
            t.style.boxShadow = '';
            t.style.transform = '';
            t.style.opacity = '1';
        });
    }
    
    // Update selected tier in info cards
    function updateSelectedTier(tier) {
        infoCards.forEach(card => {
            card.classList.remove('selected');
            
            // Simple tier detection from card content
            const cardTitle = card.querySelector('h4').textContent.toLowerCase();
            if (cardTitle.includes(tier) || 
                (tier === 'box' && cardTitle.includes('princely')) ||
                (tier === 'dress' && cardTitle.includes('dress')) ||
                (tier === 'gallery' && cardTitle.includes('royal'))) {
                card.classList.add('selected');
            }
        });
    }
    
    // Animate stage curtains
    function animateStageCurtains() {
        stageCurtains[0].style.transform = 'rotateY(-10deg)';
        stageCurtains[1].style.transform = 'rotateY(10deg)';
        
        setTimeout(() => {
            stageCurtains[0].style.transform = 'rotateY(0deg)';
            stageCurtains[1].style.transform = 'rotateY(0deg)';
        }, 500);
    }
    
    // Simulated selection sound
    function playSelectionSound() {
        // Create a subtle audio context click for feedback
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 523.25; // C5 note
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }
    
    // ============================================
    // 5. PERFORMER PROFILES INTERACTIVITY
    // ============================================
    
    const performerProfiles = document.querySelectorAll('.performer-profile');
    
    performerProfiles.forEach(profile => {
        const portraitSpotlight = profile.querySelector('.portrait-spotlight');
        
        // Follow mouse with spotlight
        profile.addEventListener('mousemove', (e) => {
            const rect = profile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            portraitSpotlight.style.transform = `translate(${x - 100}px, ${y - 100}px)`;
        });
        
        // Add click effect
        profile.addEventListener('click', function() {
            const performerName = this.querySelector('.performer-name').textContent;
            const performerRole = this.querySelector('.performer-role').textContent;
            
            // Create a spotlight focus effect
            this.style.zIndex = '10';
            this.style.boxShadow = '0 0 60px rgba(212, 175, 55, 0.6)';
            
            // Briefly enlarge
            this.style.transform = 'scale(1.05)';
            
            // Show performer name in console
            console.log(`🎤 Selected performer: ${performerName} - ${performerRole}`);
            
            // Reset after delay
            setTimeout(() => {
                this.style.zIndex = '';
                this.style.boxShadow = '';
                this.style.transform = '';
            }, 1000);
        });
    });
    
    // ============================================
    // 6. NAVIGATION SCROLL EFFECTS
    // ============================================
    
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    
    // Smooth scrolling for navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close any open modals
                const openModal = document.querySelector('.performance-modal-overlay');
                if (openModal) openModal.remove();
                
                // Scroll to section with offset for header
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Add visual feedback on nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Highlight nav item based on scroll position
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
    
    // ============================================
    // 7. DYNAMIC LIGHTING & SHADOW EFFECTS
    // ============================================
    
    function startDynamicLighting() {
        // Create floating dust particles effect
        createDustParticles();
        
        // Create occasional "spotlight" flashes
        setInterval(createRandomSpotlight, 8000);
        
        // Update shadows based on scroll position
        window.addEventListener('scroll', updateDynamicShadows);
    }
    
    // Create floating dust particles in light beams
    function createDustParticles() {
        const lightOverlay = document.querySelector('.global-light-overlay');
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            const left = Math.random() * 100;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(232, 223, 202, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                top: -10px;
                left: ${left}%;
                animation: dustFloat ${duration}s linear ${delay}s infinite;
                pointer-events: none;
                z-index: 1;
            `;
            
            lightOverlay.appendChild(particle);
        }
        
        // Add dust animation to CSS
        const dustAnimation = document.createElement('style');
        dustAnimation.textContent = `
            @keyframes dustFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.5 + 0.2};
                }
                90% {
                    opacity: ${Math.random() * 0.3 + 0.1};
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
            
            @keyframes armSway {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(5deg); }
            }
            
            @keyframes crystalSparkle {
                0% { opacity: 0.5; transform: scale(1); }
                100% { opacity: 0.9; transform: scale(1.1); }
            }
            
            @keyframes lightPulseEnhanced {
                0%, 100% { opacity: 0.1; transform: scale(1); }
                50% { opacity: 0.25; transform: scale(1.05); }
            }
            
            @keyframes lightFloat {
                0% { transform: translateX(0) translateY(0); }
                100% { transform: translateX(${Math.random() * 100 - 50}px) translateY(${Math.random() * 50 - 25}px); }
            }
            
            @keyframes pullUp {
                0% { transform: translate(-50%, -50%); }
                100% { transform: translate(-50%, -200%); opacity: 0; }
            }
        `;
        document.head.appendChild(dustAnimation);
    }
    
    // Create random spotlight flashes
    function createRandomSpotlight() {
        const spotlight = document.createElement('div');
        spotlight.className = 'random-spotlight';
        
        const left = Math.random() * 80 + 10;
        const width = Math.random() * 100 + 50;
        
        spotlight.style.cssText = `
            position: fixed;
            top: 0;
            left: ${left}%;
            width: ${width}px;
            height: 100%;
            background: linear-gradient(to bottom, 
                transparent,
                rgba(232, 223, 202, 0.05) 10%,
                transparent);
            pointer-events: none;
            z-index: 0;
            animation: spotlightFlash 2s ease;
        `;
        
        document.body.appendChild(spotlight);
        
        setTimeout(() => {
            spotlight.remove();
        }, 2000);
        
        // Add spotlight flash animation
        if (!document.querySelector('#spotlight-animation')) {
            const spotlightStyle = document.createElement('style');
            spotlightStyle.id = 'spotlight-animation';
            spotlightStyle.textContent = `
                @keyframes spotlightFlash {
                    0% { opacity: 0; }
                    20% { opacity: 0.3; }
                    80% { opacity: 0.1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(spotlightStyle);
        }
    }
    
    // Update dynamic shadows based on scroll
    function updateDynamicShadows() {
        const scrollY = window.pageYOffset;
        const shadowIntensity = Math.min(scrollY / 1000, 0.6);
        
        if (dynamicShadows) {
            dynamicShadows.style.opacity = 0.3 + shadowIntensity;
        }
        
        // Parallax effect for chandelier
        const chandelierContainer = document.querySelector('.chandelier-container');
        if (chandelierContainer) {
            chandelierContainer.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
        }
    }
    
    // ============================================
    // 8. PATRONAGE BUTTON INTERACTION
    // ============================================
    
    const patronBtn = document.querySelector('.patron-btn');
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    
    if (patronBtn) {
        patronBtn.addEventListener('click', function() {
            // Create a luxurious patronage inquiry effect
            this.innerHTML = '<i class="fas fa-crown"></i> Inquiring...';
            this.style.background = 'linear-gradient(to bottom, #c19a3e, #d4af37)';
            
            // Simulate server request
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
                this.style.background = 'linear-gradient(to bottom, #6d0d1f, #8b1e3f)';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    this.innerHTML = 'Inquire About Patronage';
                    this.style.background = 'transparent';
                }, 3000);
            }, 1500);
            
            // Log patronage inquiry
            console.log('🏛️ Patronage inquiry initiated');
        });
    }
    
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            const performancesSection = document.querySelector('#performances');
            if (performancesSection) {
                window.scrollTo({
                    top: performancesSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // ============================================
    // 9. KEYBOARD SHORTCUTS & ACCESSIBILITY
    // ============================================
    
    document.addEventListener('keydown', function(e) {
        // Escape key closes any open modal
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.performance-modal-overlay');
            if (openModal) {
                openModal.remove();
            }
        }
        
        // Spacebar pauses/resumes animations
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            toggleAnimations();
        }
        
        // Number keys 1-4 select performance cards
        if (e.key >= '1' && e.key <= '4') {
            const cardIndex = parseInt(e.key) - 1;
            const performanceCards = document.querySelectorAll('.performance-card');
            if (performanceCards[cardIndex]) {
                showPerformanceDetails(performanceCards[cardIndex].dataset.performance);
            }
        }
    });
    
    // Toggle animations on/off
    function toggleAnimations() {
        const allAnimatedElements = document.querySelectorAll('*');
        const isPaused = document.body.classList.toggle('animations-paused');
        
        if (isPaused) {
            allAnimatedElements.forEach(el => {
                const animation = getComputedStyle(el).animation;
                if (animation && animation !== 'none') {
                    el.style.animationPlayState = 'paused';
                }
            });
            console.log('⏸️ Animations paused');
        } else {
            allAnimatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
            console.log('▶️ Animations resumed');
        }
    }
    
    // ============================================
    // 10. INITIALIZATION COMPLETE
    // ============================================
    
    console.log('✨ Baroque Opera House experience fully loaded');
    
    // Add a subtle welcome message in the console
    console.log(`
        %c🎭 Welcome to La Scala d'Oro 🎭
        %cExperience the opulence of Baroque theatre.
        Keyboard shortcuts:
        - Space: Toggle animations
        - 1-4: View performance details
        - Escape: Close modals
    `, 
    'color: #d4af37; font-size: 16px; font-weight: bold;',
    'color: #f8f4e9; font-size: 12px;'
    );
});