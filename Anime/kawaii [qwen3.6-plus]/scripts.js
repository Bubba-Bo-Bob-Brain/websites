/**
 * KAWAII VERSE - INTERACTIVITY SCRIPT
 * Bringing the moe magic to life ✨
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LOADING SCREEN
    // ==========================================
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after window loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Trigger hero animations after loading
            document.querySelector('.hero-content').style.animationPlayState = 'running';
        }, 1500);
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
    }

    // ==========================================
    // 2. CUSTOM CURSOR & SPARKLE TRAIL
    // ==========================================
    const cursor = document.getElementById('cursor');
    const sparkleContainer = document.getElementById('sparkleContainer');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Smooth cursor follow
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        createSparkle(mouseX, mouseY);
    });

    function animateCursor() {
        // Lerp for smooth following
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Sparkle creation
    function createSparkle(x, y) {
        // Rate limiter
        if (Math.random() > 0.3) return;

        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9998';
        sparkle.style.borderRadius = '50%';
        
        // Random pastel colors
        const colors = ['#ff85b3', '#e0c3fc', '#a8e6cf', '#ffdac1', '#c7ecee'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 8px ${sparkle.style.background}`;
        
        sparkleContainer.appendChild(sparkle);

        // Animate and remove
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1 + Math.random() * 2;
        let opacity = 1;
        let life = 0;

        function animateSparkle() {
            life += 0.02;
            const currentX = parseFloat(sparkle.style.left);
            const currentY = parseFloat(sparkle.style.top);
            
            sparkle.style.left = `${currentX + Math.cos(angle) * velocity}px`;
            sparkle.style.top = `${currentY + Math.sin(angle) * velocity + 0.5}px`; // slight fall
            opacity -= 0.02;
            sparkle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateSparkle);
            } else {
                sparkle.remove();
            }
        }
        requestAnimationFrame(animateSparkle);
    }

    // Cursor hover effect
    const interactiveElements = document.querySelectorAll('a, button, .manga-card, .anime-card, .gacha-card, .community-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ==========================================
    // 3. FLOATING BACKGROUND ELEMENTS
    // ==========================================
    const floatingContainer = document.getElementById('floatingElements');
    const emojis = ['🌸', '✨', '💕', '⭐', '🎀', '🍡', '🍥', '🌙', '💖', '🌷'];
    
    function createFloatingElement() {
        const el = document.createElement('div');
        el.classList.add('floating-item');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random position and size
        const size = 1 + Math.random() * 1.5;
        el.style.fontSize = `${size}rem`;
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${100 + Math.random() * 20}%`; // Start below viewport
        el.style.opacity = 0.3 + Math.random() * 0.4;
        
        // Random animation duration
        const duration = 8 + Math.random() * 12;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${Math.random() * 5}s`;
        
        floatingContainer.appendChild(el);

        // Remove after animation
        setTimeout(() => {
            el.remove();
        }, duration * 1000 + 5000);
    }

    // Create elements periodically
    setInterval(createFloatingElement, 1500);
    // Initial batch
    for(let i = 0; i < 10; i++) createFloatingElement();

    // ==========================================
    // 4. MASCOT COMPANION
    // ==========================================
    const mascot = document.getElementById('mascot');
    const mascotSpeech = document.getElementById('mascotSpeech');
    const mascotText = document.getElementById('mascotText');
    const mascotEyes = document.querySelectorAll('.mascot-eyes .eye');
    
    const messages = [
        "Welcome to KawaiiVerse! ✨",
        "Did you know? Anime is life! 🌸",
        "You look kawaii today! 💖",
        "Keep scrolling for magic! ✨",
        "Nyaa~! Have fun exploring! 🐱",
        "Moe moe kyun! 💕",
        "Don't forget to smile! 🌟"
    ];

    let messageIndex = 0;

    // Toggle speech bubble
    mascot.addEventListener('click', (e) => {
        e.stopPropagation();
        mascotSpeech.classList.toggle('active');
        
        if (mascotSpeech.classList.contains('active')) {
            mascotText.textContent = messages[messageIndex % messages.length];
            messageIndex++;
        }
    });

    // Hide speech when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!mascot.contains(e.target)) {
            mascotSpeech.classList.remove('active');
        }
    });

    // Eyes follow cursor
    document.addEventListener('mousemove', (e) => {
        if (!mascot) return;
        
        const rect = mascot.getBoundingClientRect();
        const mascotCenterX = rect.left + rect.width / 2;
        const mascotCenterY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
        const distance = Math.min(3, Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY) / 20);
        
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        mascotEyes.forEach(eye => {
            eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // ==========================================
    // 5. NAVIGATION
    // ==========================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ==========================================
    // 6. SCROLL ANIMATIONS & COUNTERS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Check for stats counter
                if (entry.target.querySelector('.stat-number')) {
                    animateStats(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('section, .manga-card, .anime-card, .community-card, .gacha-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stat Counter Animation
    function animateStats(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            
            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOut * target);
                
                stat.textContent = currentCount.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateCount);
        });
    }

    // ==========================================
    // 7. GACHA CARDS INTERACTION
    // ==========================================
    const gachaCards = document.querySelectorAll('.gacha-card');
    
    gachaCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add shake animation before flip
            this.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                this.style.animation = '';
                this.classList.toggle('flipped');
                
                // Sparkle burst effect on flip
                if (this.classList.contains('flipped')) {
                    createBurstEffect(this);
                }
            }, 400);
        });
    });

    // Shake keyframes injection
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes shake {
            0%, 100% { transform: rotateY(0) translateX(0); }
            25% { transform: rotateY(0) translateX(-10px) rotate(-5deg); }
            75% { transform: rotateY(0) translateX(10px) rotate(5deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    function createBurstEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = ['#ff85b3', '#e0c3fc', '#a8e6cf', '#ffd700'][Math.floor(Math.random() * 4)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            sparkleContainer.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 5 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            
            function animateParticle() {
                const currentLeft = parseFloat(particle.style.left);
                const currentTop = parseFloat(particle.style.top);
                
                particle.style.left = `${currentLeft + vx}px`;
                particle.style.top = `${currentTop + vy}px`;
                opacity -= 0.02;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            requestAnimationFrame(animateParticle);
        }
    }

    // ==========================================
    // 8. NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = newsletterForm.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        // Loading state
        btn.querySelector('.btn-text').textContent = 'Sending... 💌';
        btn.style.opacity = '0.7';
        
        setTimeout(() => {
            // Success state
            btn.querySelector('.btn-text').textContent = 'Subscribed! ✨';
            btn.style.background = 'linear-gradient(135deg, #6bc9a3, #a8e6cf)';
            
            // Reset form
            newsletterForm.reset();
            
            // Revert after delay
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });

    // ==========================================
    // 9. RANDOM HOVER EFFECTS FOR MANGA/ANIME
    // ==========================================
    // Add a little tilt effect to cards
    const tiltCards = document.querySelectorAll('.manga-card, .anime-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});