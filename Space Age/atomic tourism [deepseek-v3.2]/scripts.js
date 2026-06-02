// scripts.js
// Space Age Vacations - Interactive 1967 Experience

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Space Age Vacations - Systems Go!');

    // ===== PARALLAX STARFIELD =====
    const starfield = document.getElementById('starfield');
    window.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX / window.innerWidth) * 10 - 5;
        const moveY = (e.clientY / window.innerHeight) * 10 - 5;
        starfield.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // ===== MOBILE NAVIGATION TOGGLE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close nav when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ===== ANIMATED COUNTDOWN TIMER =====
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        function updateCountdown() {
            // Set a launch time 4 hours, 32 minutes, 15 seconds from now
            const now = new Date();
            const launchTime = new Date(now.getTime() + (4 * 60 * 60 * 1000) + (32 * 60 * 1000) + (15 * 1000));

            const diff = launchTime - now;
            if (diff <= 0) {
                countdownElement.textContent = '00:00:00';
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ===== INTERACTIVE DESTINATION CARDS =====
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        const planetIcon = card.querySelector('.planet-icon i');
        const cardButton = card.querySelector('.card-button');

        // Planet icon animation on hover
        card.addEventListener('mouseenter', () => {
            if (planetIcon) {
                planetIcon.style.transform = 'rotate(20deg) scale(1.2)';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (planetIcon) {
                planetIcon.style.transform = 'rotate(0) scale(1)';
            }
        });

        // Card button click effect
        if (cardButton) {
            cardButton.addEventListener('click', function(e) {
                e.preventDefault();
                const planet = card.dataset.planet;
                alert(`🚀 Excellent choice! Our ${planet} packages are being transmitted to your console.\n\nA teletype agent will contact you shortly on frequency 143.725 MHz.`);
                // Trigger a fun "transmission" effect on the card
                card.style.boxShadow = '0 0 30px rgba(42, 157, 143, 0.6)';
                setTimeout(() => {
                    card.style.boxShadow = '';
                }, 1000);
            });
        }
    });

    // ===== DEPARTURE BOARD ANIMATIONS =====
    const boardEntries = document.querySelectorAll('.board-entry .status');
    function animateDepartureBoard() {
        boardEntries.forEach(status => {
            // Reset animation
            status.style.animation = 'none';
            setTimeout(() => {
                if (status.classList.contains('status-go')) {
                    status.style.animation = 'pulseGo 2s infinite';
                } else if (status.classList.contains('status-hold')) {
                    status.style.animation = 'pulseHold 1.5s infinite';
                }
            }, 10);
        });

        // Simulate board "flipping" for times
        const timeElements = document.querySelectorAll('.board-entry .time');
        timeElements.forEach(timeEl => {
            const originalTime = timeEl.textContent;
            // Occasionally "update" the time (every 30 seconds)
            setInterval(() => {
                // Add a visual "flip" effect
                timeEl.style.opacity = '0.5';
                setTimeout(() => {
                    // In a real app, you'd fetch new data
                    // For now, just restore original
                    timeEl.textContent = originalTime;
                    timeEl.style.opacity = '1';
                }, 300);
            }, 30000);
        });
    }

    // Add CSS for status animations dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes pulseGo {
            0%, 100% { background-color: rgba(42, 157, 143, 0.2); }
            50% { background-color: rgba(42, 157, 143, 0.4); }
        }
        @keyframes pulseHold {
            0%, 100% { background-color: rgba(231, 111, 81, 0.2); }
            50% { background-color: rgba(231, 111, 81, 0.4); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Initialize board animations
    animateDepartureBoard();

    // ===== MODAL FUNCTIONALITY =====
    const bookingModal = document.getElementById('bookingModal');
    const bookNowButtons = document.querySelectorAll('#bookNowBtn, #finalBookBtn, .cta-hero');
    const closeModalBtn = document.getElementById('closeModalBtn');

    function openModal() {
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // Animate the loading dots
            const dots = document.querySelectorAll('.loading-dot');
            dots.forEach(dot => {
                dot.style.animation = 'loadingBounce 1.4s infinite ease-in-out both';
            });
            // Play a subtle sound effect (optional - using Web Audio API)
            playTeletypeSound();
        }
    }

    function closeModal() {
        if (bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    bookNowButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Teletype sound effect (using Web Audio API)
    function playTeletypeSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio context not supported:', e);
        }
    }

    // ===== ROCKET HERO ANIMATION ON SCROLL =====
    const heroRocket = document.getElementById('heroRocket');
    if (heroRocket) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            heroRocket.style.transform = `translateY(${rate}px) rotate(45deg)`;
        });
    }

    // ===== FACT TICKER PAUSE ON HOVER =====
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        tickerTrack.addEventListener('mouseenter', () => {
            tickerTrack.style.animationPlayState = 'paused';
        });
        tickerTrack.addEventListener('mouseleave', () => {
            tickerTrack.style.animationPlayState = 'running';
        });
    }

    // ===== ATOMIC MOTIF INTERACTION =====
    const atomicMotif = document.querySelector('.atomic-motif');
    if (atomicMotif) {
        atomicMotif.addEventListener('click', function() {
            this.style.opacity = '0.1';
            setTimeout(() => {
                this.style.opacity = '0.03';
            }, 500);
        });
    }

    // ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== INITIALIZE RANDOM "STATIC" ON PAGE LOAD (for retro feel) =====
    function retroStaticEffect() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.background = 'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px)';
        overlay.style.animation = 'staticFlicker 0.2s';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 200);
    }

    // Add static flicker animation
    const staticStyle = document.createElement('style');
    staticStyle.textContent = `
        @keyframes staticFlicker {
            0% { opacity: 0; }
            25% { opacity: 0.03; }
            50% { opacity: 0.01; }
            75% { opacity: 0.04; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(staticStyle);

    // Trigger on load
    window.addEventListener('load', retroStaticEffect);

    // ===== CONSOLE WELCOME MESSAGE =====
    const consoleStyle = 'background: #1a1a2e; color: #2A9D8F; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 14px;';
    const consoleText = `%c🚀 SPACE AGE VACATIONS - SYSTEM ONLINE
    ░░░░░░░░░▄▄░░░░░░░░░░░░░░
    ░░░░░░░░█░░█░░░░░░░░░░░░░
    ░░░░░░░░█░░█░░░░░░░░░░░░░
    ░░░░░░░█░░░█░░░░░░░░░░░░░
    ░░░░░░█░░░░██████▄░░░░░░░
    ████▄▄█░░░░██████▀░░░░░░░
    ▀██████░░░░░░░░░░░░░░░░░░
    ░░░▀▀▀█████████████████▄░
    
    Welcome, Space Traveler! Frequency 143.725 MHz is open.`;
    console.log(consoleText, consoleStyle);
});