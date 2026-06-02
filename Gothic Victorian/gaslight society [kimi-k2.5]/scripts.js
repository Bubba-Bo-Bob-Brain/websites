/**
 * The Order of the Amber Lantern - Arcane Scripts
 * Interactive functionality for the Victorian Occult Society Registry
 */

document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════════════════
    // DOM Element References
    // ═══════════════════════════════════════════════════════════════
    const invitationOverlay = document.getElementById('invitation-overlay');
    const breakSealBtn = document.getElementById('break-seal');
    const waxSeal = document.getElementById('wax-seal');
    const mainSanctum = document.getElementById('main-sanctum');
    
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');
    
    const mysticalCircles = document.querySelectorAll('.mystical-circle');
    const seanceButtons = document.querySelectorAll('.request-attendance');
    
    const navRunes = document.querySelectorAll('.nav-rune');
    const flickerOverlay = document.querySelector('.flicker-overlay');
    
    // ═══════════════════════════════════════════════════════════════
    // 1. The Sealed Invitation - Portal Entry
    // ═══════════════════════════════════════════════════════════════
    function breakTheSeal() {
        if (!invitationOverlay) return;
        
        // Add broken animation class to wax seal
        if (waxSeal) waxSeal.classList.add('broken');
        
        // Open envelope flap
        invitationOverlay.classList.add('open');
        
        // Play subtle tick acceleration (visual only, implied)
        document.body.style.cursor = 'wait';
        
        // Transition timing
        setTimeout(() => {
            invitationOverlay.style.opacity = '0';
            invitationOverlay.style.visibility = 'hidden';
            invitationOverlay.style.pointerEvents = 'none';
            
            // Reveal the sanctum
            mainSanctum.classList.remove('hidden');
            mainSanctum.setAttribute('aria-hidden', 'false');
            
            // Trigger entrance animation
            requestAnimationFrame(() => {
                mainSanctum.classList.add('visible');
            });
            
            // Start atmospheric effects
            initializeAtmosphericEffects();
            
        }, 800); // Match CSS transition time
        
        // Final cleanup
        setTimeout(() => {
            invitationOverlay.style.display = 'none';
            document.body.style.cursor = '';
        }, 1500);
    }
    
    if (breakSealBtn) {
        breakSealBtn.addEventListener('click', breakTheSeal);
    }
    
    if (waxSeal) {
        waxSeal.addEventListener('click', breakTheSeal);
        waxSeal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                breakTheSeal();
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 2. The Grandfather Clock - Temporal Keeper
    // ═══════════════════════════════════════════════════════════════
    function updateClock() {
        if (!hourHand || !minuteHand || !secondHand) return;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        
        // Smooth movement calculations
        const secondDegrees = ((seconds + milliseconds / 1000) / 60) * 360;
        const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
        const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;
        
        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        
        requestAnimationFrame(updateClock);
    }
    
    // Start clock
    requestAnimationFrame(updateClock);
    
    // ═══════════════════════════════════════════════════════════════
    // 3. Arcane Navigation - Smooth Scrolling with Easing
    // ═══════════════════════════════════════════════════════════════
    navRunes.forEach(rune => {
        rune.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = rune.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed elements if any
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add glow effect to target section briefly
                targetSection.style.transition = 'box-shadow 0.5s';
                targetSection.style.boxShadow = 'inset 0 0 50px rgba(212,175,55,0.1)';
                setTimeout(() => {
                    targetSection.style.boxShadow = '';
                }, 1000);
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 4. The Directory Filters - Tier Sorting
    // ═══════════════════════════════════════════════════════════════
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter with animation
            memberCards.forEach((card, index) => {
                const cardTier = card.getAttribute('data-tier');
                const shouldShow = filterValue === 'all' || cardTier === filterValue;
                
                // Staggered animation delay
                const delay = index * 50;
                
                if (shouldShow) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Initialize card states for filtering
    memberCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 5. Mystical Circles - Interactive Hierarchy
    // ═══════════════════════════════════════════════════════════════
    mysticalCircles.forEach(circle => {
        circle.addEventListener('mouseenter', () => {
            // Create ripple effect on siblings
            mysticalCircles.forEach(sibling => {
                if (sibling !== circle) {
                    sibling.style.opacity = '0.6';
                    sibling.style.filter = 'grayscale(0.3)';
                }
            });
            circle.style.transform = 'scale(1.05)';
            circle.style.zIndex = '10';
        });
        
        circle.addEventListener('mouseleave', () => {
            mysticalCircles.forEach(sibling => {
                sibling.style.opacity = '';
                sibling.style.filter = '';
            });
            circle.style.transform = '';
            circle.style.zIndex = '';
        });
        
        // Keyboard accessibility
        circle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Focus animation
                circle.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    circle.style.animation = '';
                }, 600);
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 6. Seance Attendance Requests
    // ═══════════════════════════════════════════════════════════════
    seanceButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled || this.classList.contains('sealed')) return;
            
            const originalText = this.querySelector('.btn-text').textContent;
            const originalRune = this.querySelector('.btn-rune').textContent;
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Change state
            this.querySelector('.btn-text').textContent = 'Request Sent';
            this.querySelector('.btn-rune').textContent = '✓';
            this.style.borderColor = '#4a7c59';
            this.style.color = '#4a7c59';
            this.disabled = true;
            
            // Create ephemeral confirmation message
            showEphemeralMessage('Your request has been inscribed in the ledger...', this);
            
            // Revert after 3 seconds (for demo purposes)
            setTimeout(() => {
                this.querySelector('.btn-text').textContent = originalText;
                this.querySelector('.btn-rune').textContent = originalRune;
                this.style.borderColor = '';
                this.style.color = '';
                this.disabled = false;
            }, 5000);
        });
    });
    
    function showEphemeralMessage(text, anchorElement) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: absolute;
            background: rgba(74, 0, 0, 0.9);
            border: 1px solid #D4AF37;
            color: #F4E4BC;
            padding: 8px 16px;
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 0.9rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
            white-space: nowrap;
        `;
        
        document.body.appendChild(msg);
        
        const rect = anchorElement.getBoundingClientRect();
        msg.style.left = `${rect.left + rect.width/2 - msg.offsetWidth/2}px`;
        msg.style.top = `${rect.top - 40}px`;
        
        // Animate in
        requestAnimationFrame(() => {
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(-5px)';
        });
        
        // Fade out
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 300);
        }, 2500);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 7. Daguerreotype Interactive Parallax
    // ═══════════════════════════════════════════════════════════════
    const daguerreotypes = document.querySelectorAll('.daguerreotype-container');
    
    daguerreotypes.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const img = container.querySelector('.daguerreotype-portrait');
            if (img) {
                img.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
            
            // Move silver sheen based on mouse position
            const sheen = container.querySelector('.silver-sheen');
            if (sheen) {
                const sheenX = (x / rect.width) * 100;
                sheen.style.background = `linear-gradient(${45 + rotateY}deg, transparent ${sheenX - 20}%, rgba(192,192,192,0.15) ${sheenX}%, transparent ${sheenX + 20}%)`;
            }
        });
        
        container.addEventListener('mouseleave', () => {
            const img = container.querySelector('.daguerreotype-portrait');
            if (img) {
                img.style.transform = '';
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 8. Atmospheric Effects - Gaslight Flicker & Ambient Motion
    // ═══════════════════════════════════════════════════════════════
    function initializeAtmosphericEffects() {
        // Random flickering intervals
        function randomFlicker() {
            if (!flickerOverlay) return;
            
            const duration = Math.random() * 100 + 50;
            const opacity = Math.random() * 0.3;
            
            flickerOverlay.style.transition = 'none';
            flickerOverlay.style.opacity = opacity;
            
            setTimeout(() => {
                flickerOverlay.style.transition = 'opacity 0.1s';
                flickerOverlay.style.opacity = 0;
            }, duration);
            
            // Schedule next flicker
            const nextFlicker = Math.random() * 4000 + 1000;
            setTimeout(randomFlicker, nextFlicker);
        }
        
        // Start flickering after entrance
        setTimeout(randomFlicker, 2000);
        
        // Mouse-following ambient light
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });
        
        function updateAmbientLight() {
            // Smooth lerp
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            const gaslight = document.querySelector('.ambient-gaslight');
            if (gaslight) {
                const moveX = (currentX - 0.5) * 10;
                const moveY = (currentY - 0.5) * 5;
                gaslight.style.transform = `translate(${moveX}%, ${moveY}%)`;
            }
            
            requestAnimationFrame(updateAmbientLight);
        }
        
        updateAmbientLight();
        
        // Dust particle speed based on scroll velocity
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        
        window.addEventListener('scroll', () => {
            scrollVelocity = Math.abs(window.scrollY - lastScrollY);
            lastScrollY = window.scrollY;
            
            const dust = document.querySelector('.dust-particles');
            if (dust) {
                const speed = Math.min(scrollVelocity * 0.5, 20);
                dust.style.animationDuration = `${20 - speed}s`;
            }
        }, { passive: true });
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 9. Scroll-Triggered Reveals
    // ═══════════════════════════════════════════════════════════════
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for entrance
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(section);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 10. Keyboard Shortcuts & Accessibility
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // ESC to return to top
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Number keys for quick filtering
        if (e.key >= '1' && e.key <= '5') {
            const index = parseInt(e.key) - 1;
            if (filterButtons[index]) {
                filterButtons[index].click();
            }
        }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 11. Initialization Console Art
    // ═══════════════════════════════════════════════════════════════
    console.log('%c⚜ The Order of the Amber Lantern ⚜', 'color: #D4AF37; font-size: 14px; font-family: serif;');
    console.log('%cPrivate Registry Initialized', 'color: #8B0000; font-style: italic;');
    console.log('%c"Lux in Tenebris Lucet"', 'color: #F4E4BC; font-style: italic;');
});