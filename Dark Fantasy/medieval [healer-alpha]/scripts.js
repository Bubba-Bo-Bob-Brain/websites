/* ============================================================
   THE BLACKENED CHRONICLE — Scripts
   A Medieval Dark Fantasy Archive
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    DustParticles.init();
    Navigation.init();
    ScrollReveal.init();
    TorchEffects.init();
    MapInteractivity.init();
    ModalSystem.init();
    ParallaxEffects.init();
    RandomAmbientEffects.init();
});

/* === DUST PARTICLES SYSTEM === */
const DustParticles = {
    canvas: null,
    ctx: null,
    particles: [],
    particleCount: 80,
    
    init() {
        this.canvas = document.getElementById('dust-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    },
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward drift
                opacity: Math.random() * 0.5 + 0.1,
                flickerSpeed: Math.random() * 0.02 + 0.005,
                flickerOffset: Math.random() * Math.PI * 2
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        
        this.particles.forEach(particle => {
            // Update position with subtle movement
            particle.x += particle.speedX + Math.sin(time + particle.flickerOffset) * 0.1;
            particle.y += particle.speedY + Math.cos(time * 0.5 + particle.flickerOffset) * 0.05;
            
            // Wrap around screen edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Flickering opacity
            const flicker = Math.sin(time * particle.flickerSpeed * 10 + particle.flickerOffset);
            const currentOpacity = particle.opacity * (0.7 + flicker * 0.3);
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(212, 184, 150, ${currentOpacity})`;
            this.ctx.fill();
            
            // Add subtle glow
            if (particle.size > 1) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 184, 150, ${currentOpacity * 0.1})`;
                this.ctx.fill();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
};

/* === NAVIGATION SYSTEM === */
const Navigation = {
    navbar: null,
    navLinks: [],
    sections: [],
    lastScrollY: 0,
    scrollDirection: 'up',
    ticking: false,
    
    init() {
        this.navbar = document.getElementById('navbar');
        if (!this.navbar) return;
        
        this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
        this.sections = Array.from(document.querySelectorAll('section, header'));
        
        // Set up scroll event
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        
        // Set up click events for smooth scrolling
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        // Initial state
        this.updateActiveLink();
    },
    
    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.handleScroll();
                this.ticking = false;
            });
            this.ticking = true;
        }
    },
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollY > this.lastScrollY) {
            this.scrollDirection = 'down';
        } else {
            this.scrollDirection = 'up';
        }
        
        // Hide/show navbar based on scroll direction
        if (this.scrollDirection === 'down' && currentScrollY > 100) {
            this.navbar.classList.add('hidden');
        } else {
            this.navbar.classList.remove('hidden');
        }
        
        // Update active link based on scroll position
        this.updateActiveLink();
        
        this.lastScrollY = currentScrollY;
    },
    
    updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        // Find the section that is currently in view
        let currentSection = this.sections[0];
        
        for (const section of this.sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
                break;
            }
        }
        
        // Update active state on nav links
        this.navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Smooth scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, null, `#${targetId}`);
        }
    }
};

/* === SCROLL REVEAL ANIMATIONS === */
const ScrollReveal = {
    elements: [],
    observer: null,
    
    init() {
        this.elements = Array.from(document.querySelectorAll('.reveal-text'));
        
        // Set up Intersection Observer for scroll-triggered animations
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            }
        );
        
        // Observe all elements
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
        
        // Also handle elements that might be in view on load
        setTimeout(() => this.checkInitialVisibility(), 100);
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on element position
                const delay = Array.from(this.elements).indexOf(entry.target) * 50;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, Math.min(delay, 500));
                
                // Unobserve after revealing
                this.observer.unobserve(entry.target);
            }
        });
    },
    
    checkInitialVisibility() {
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight * 0.9 &&
                rect.bottom > 0
            );
            
            if (isVisible) {
                element.classList.add('revealed');
            }
        });
    }
};

/* === TORCH FLICKER EFFECTS === */
const TorchEffects = {
    torches: [],
    
    init() {
        this.torches = Array.from(document.querySelectorAll('.torch'));
        if (this.torches.length === 0) return;
        
        // Create random flicker variations for each torch
        this.torches.forEach((torch, index) => {
            const flame = torch.querySelector('.flame-core');
            if (!flame) return;
            
            // Set up random flicker
            this.randomFlicker(flame, index);
            
            // Occasionally add a "flare" effect
            setInterval(() => {
                if (Math.random() > 0.7) {
                    this.flareEffect(flame);
                }
            }, 3000 + Math.random() * 5000);
        });
    },
    
    randomFlicker(flame, index) {
        const flicker = () => {
            // Random scale variations
            const scaleX = 0.9 + Math.random() * 0.2;
            const scaleY = 0.9 + Math.random() * 0.2;
            
            // Random skew for more natural flame movement
            const skewX = (Math.random() - 0.5) * 5;
            const skewY = (Math.random() - 0.5) * 3;
            
            flame.style.transform = `
                translateX(-50%) 
                scale(${scaleX}, ${scaleY}) 
                skew(${skewX}deg, ${skewY}deg)
            `;
            
            // Random intensity variation
            const brightness = 0.8 + Math.random() * 0.4;
            flame.style.filter = `brightness(${brightness})`;
            
            // Schedule next flicker
            const nextFlicker = 50 + Math.random() * 150;
            setTimeout(flicker, nextFlicker);
        };
        
        // Start flickering
        flicker();
    },
    
    flareEffect(flame) {
        // Create a brief, intense flare
        const originalTransform = flame.style.transform;
        const originalFilter = flame.style.filter;
        
        // Intensify
        flame.style.transform = 'translateX(-50%) scale(1.3, 1.4)';
        flame.style.filter = 'brightness(1.5)';
        flame.style.transition = 'all 0.1s ease-out';
        
        // Return to normal
        setTimeout(() => {
            flame.style.transform = originalTransform || 'translateX(-50%)';
            flame.style.filter = originalFilter || 'brightness(1)';
            flame.style.transition = 'all 0.3s ease-in';
        }, 150);
    }
};

/* === MAP INTERACTIVITY === */
const MapInteractivity = {
    mapPins: [],
    tooltip: null,
    modal: null,
    locationData: {
        'mordenthvale': {
            name: 'Mordenthvale',
            subtitle: 'The Fallen Capital',
            description: 'Once the crown jewel of the realm, now a silent necropolis. The great spires of the Cathedral of the Eternal Flame still stand, though their light extinguished decades ago. The Hollow King\'s throne lies beneath the central plaza, accessible only through the catacombs that stretch for leagues beneath the city.',
            status: 'FALLEN — Entry Forbidden'
        },
        'dunhallow': {
            name: 'Dunhallow',
            subtitle: 'The Ghost Quarter',
            description: 'The old artisan district, now home to the Hollow Wraiths. The buildings remain remarkably intact, as if their occupants simply vanished mid-step. Investigators report hearing whispered names and feeling an unnatural cold that seeps into the bones.',
            status: 'ABANDONED — Spectral Activity'
        },
        'greyhollow': {
            name: 'Greyhollow',
            subtitle: 'The Blighted Woods',
            description: 'Once a royal hunting ground of breathtaking beauty. The corruption transformed the ancient oaks into sentient, malevolent entities. The Thornbeasts roam here, and the very soil has turned black. Those who enter often emerge years later, aged and mad.',
            status: 'CORRUPTED — Extreme Danger'
        },
        'blackthorn': {
            name: 'Blackthorn Gates',
            subtitle: 'The Northern Pass',
            description: 'The only passage through the Dragon\'s Tooth Mountains. When the corruption spread, the gates were sealed with wards of ancient magic. The wards held for seven years before failing. What lies beyond is marked only as "Lost to the Waking Dark."',
            status: 'SEALED — Wards Failed'
        },
        'ashenmere': {
            name: 'Ashenmere',
            subtitle: 'The Drowned Lake',
            description: 'A once-pristine mountain lake that now runs backward to its source. The water has turned the color of ash and emits a faint, phosphorescent glow at night. Fishermen who cast nets here pull up only bones and strange, eyeless creatures.',
            status: 'ANOMALOUS — Reality Warped'
        },
        'obsidian': {
            name: 'The Obsidian Throne',
            subtitle: '???',
            description: 'The epicenter of the corruption. Ancient texts describe it as a seat of power carved from a single piece of volcanic glass, older than the kingdom itself. The Obsidian Wyrm coils around its roots. The final expedition reported the throne "breathing" before all contact was lost.',
            status: 'CLASSIFIED — EXTREME HAZARD'
        }
    },
    
    init() {
        this.mapPins = Array.from(document.querySelectorAll('.map-pin'));
        this.tooltip = document.getElementById('map-tooltip');
        this.modal = document.getElementById('location-modal');
        
        if (this.mapPins.length === 0 || !this.tooltip) return;
        
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        this.mapPins.forEach(pin => {
            const locationId = pin.getAttribute('data-location');
            
            // Hover effects
            pin.addEventListener('mouseenter', (e) => this.showTooltip(e, locationId));
            pin.addEventListener('mousemove', (e) => this.moveTooltip(e));
            pin.addEventListener('mouseleave', () => this.hideTooltip());
            
            // Click to open modal
            pin.addEventListener('click', () => this.openModal(locationId));
        });
        
        // Close modal when clicking backdrop
        if (this.modal) {
            const backdrop = this.modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeModal());
            }
            
            // Close button
            const closeBtn = this.modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.closeModal();
                }
            });
        }
    },
    
    showTooltip(event, locationId) {
        const data = this.locationData[locationId];
        if (!data) return;
        
        const titleEl = this.tooltip.querySelector('.tooltip-title');
        const descEl = this.tooltip.querySelector('.tooltip-desc');
        
        titleEl.textContent = data.name;
        descEl.textContent = data.status;
        
        this.tooltip.classList.add('visible');
        this.moveTooltip(event);
    },
    
    moveTooltip(event) {
        const rect = document.getElementById('map-canvas').getBoundingClientRect();
        const x = event.clientX - rect.left + 15;
        const y = event.clientY - rect.top - 10;
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    },
    
    hideTooltip() {
        this.tooltip.classList.remove('visible');
    },
    
    openModal(locationId) {
        const data = this.locationData[locationId];
        if (!data || !this.modal) return;
        
        const titleEl = this.modal.querySelector('.modal-title');
        const bodyEl = this.modal.querySelector('.modal-body');
        
        titleEl.textContent = `${data.name} — ${data.subtitle}`;
        
        bodyEl.innerHTML = `
            <p>${data.description}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><em>Source: Last Expedition Report, Year 1347</em></p>
        `;
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

/* === MODAL SYSTEM === */
const ModalSystem = {
    init() {
        // Additional modal functionality can be added here
        // For now, handled by MapInteractivity
    }
};

/* === PARALLAX EFFECTS === */
const ParallaxEffects = {
    heroSection: null,
    torches: [],
    scrollIndicator: null,
    
    init() {
        this.heroSection = document.querySelector('.hero-section');
        this.torches = Array.from(document.querySelectorAll('.torch'));
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (!this.heroSection) return;
        
        window.addEventListener('scroll', () => this.updateParallax(), { passive: true });
        this.updateParallax(); // Initial call
    },
    
    updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Only apply parallax if hero is in view
        if (scrollY < windowHeight * 1.5) {
            const parallaxFactor = scrollY * 0.4;
            
            // Move torches slightly with scroll
            this.torches.forEach((torch, index) => {
                const direction = index === 0 ? -1 : 1;
                torch.style.transform = `translateY(${parallaxFactor * 0.2 * direction}px)`;
            });
            
            // Fade out scroll indicator
            if (this.scrollIndicator) {
                const opacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.3)));
                this.scrollIndicator.style.opacity = opacity;
            }
            
            // Subtle movement of hero content
            const heroContent = this.heroSection.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallaxFactor * 0.1}px)`;
            }
        }
    }
};

/* === RANDOM AMBIENT EFFECTS === */
const RandomAmbientEffects = {
    init() {
        // Add occasional random effects for atmosphere
        
        // Random page "age" spots on the grimoire
        this.addRandomGrimoireMarks();
        
        // Random torch flare
        this.randomTorchFlare();
        
        // Random sound-like visual effects
        this.randomAmbientPulse();
    },
    
    addRandomGrimoireMarks() {
        const grimoirePages = document.querySelectorAll('.book-page');
        
        grimoirePages.forEach(page => {
            // Add a random age spot
            if (Math.random() > 0.7) {
                const spot = document.createElement('div');
                spot.className = 'random-age-spot';
                
                const size = 20 + Math.random() * 60;
                const top = 10 + Math.random() * 80;
                const left = 10 + Math.random() * 80;
                const opacity = 0.02 + Math.random() * 0.05;
                
                spot.style.cssText = `
                    position: absolute;
                    top: ${top}%;
                    left: ${left}%;
                    width: ${size}px;
                    height: ${size * (0.8 + Math.random() * 0.4)}px;
                    background: radial-gradient(ellipse, rgba(90, 58, 26, ${opacity}) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: rotate(${Math.random() * 360}deg);
                    filter: blur(${2 + Math.random() * 3}px);
                    pointer-events: none;
                `;
                
                page.appendChild(spot);
            }
        });
    },
    
    randomTorchFlare() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                const torches = document.querySelectorAll('.torch-flame');
                if (torches.length > 0) {
                    const randomTorch = torches[Math.floor(Math.random() * torches.length)];
                    const flameCore = randomTorch.querySelector('.flame-core');
                    
                    if (flameCore) {
                        // Brief intense flare
                        const originalBoxShadow = flameCore.style.boxShadow;
                        flameCore.style.boxShadow = `
                            0 0 20px #ffaa33,
                            0 0 40px #ff6600,
                            0 0 80px rgba(255, 102, 0, 0.5)
                        `;
                        flameCore.style.transition = 'box-shadow 0.1s ease-out';
                        
                        setTimeout(() => {
                            flameCore.style.boxShadow = originalBoxShadow || '';
                            flameCore.style.transition = 'box-shadow 1s ease-in';
                        }, 200);
                    }
                }
            }
        }, 8000);
    },
    
    randomAmbientPulse() {
        // Create subtle ambient pulses in the background
        setInterval(() => {
            if (Math.random() > 0.9) {
                const sections = document.querySelectorAll('.section');
                if (sections.length > 0) {
                    const randomSection = sections[Math.floor(Math.random() * sections.length)];
                    
                    // Create a subtle pulse overlay
                    const pulse = document.createElement('div');
                    pulse.style.cssText = `
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(
                            ellipse at ${Math.random() * 100}% ${Math.random() * 100}%,
                            rgba(139, 26, 26, 0.03) 0%,
                            transparent 50%
                        );
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 2s ease-in-out;
                        z-index: 1;
                    `;
                    
                    randomSection.style.position = 'relative';
                    randomSection.appendChild(pulse);
                    
                    // Fade in and out
                    setTimeout(() => {
                        pulse.style.opacity = '1';
                        setTimeout(() => {
                            pulse.style.opacity = '0';
                            setTimeout(() => pulse.remove(), 2000);
                        }, 1000);
                    }, 100);
                }
            }
        }, 15000);
    }
};

/* === UTILITY FUNCTIONS === */
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Random integer between min and max
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

/* === PERFORMANCE OPTIMIZATION === */
// Use passive event listeners for scroll events
const passiveSupported = (() => {
    let passive = false;
    try {
        const options = {
            get passive() {
                passive = true;
                return false;
            }
        };
        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
    } catch (e) {
        passive = false;
    }
    return passive;
})();

const passiveOption = passiveSupported ? { passive: true } : false;

// Apply passive listeners to scroll events
window.addEventListener('scroll', () => {}, passiveOption);