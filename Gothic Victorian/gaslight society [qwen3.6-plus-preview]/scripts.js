/* =========================================
   THE ORDER OF THE VEILED SUN — SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    const app = new OccultApp();
    app.init();
});

class OccultApp {
    constructor() {
        this.audioCtx = null;
        this.elements = {
            envelopeWrapper: document.getElementById('envelopeWrapper'),
            entranceOverlay: document.getElementById('entranceOverlay'),
            mainContent: document.getElementById('mainContent'),
            navLinks: document.querySelectorAll('.nav-link'),
            sections: document.querySelectorAll('.section'),
            hourHand: document.getElementById('hourHand'),
            minuteHand: document.getElementById('minuteHand'),
            clockTime: document.getElementById('clockTime'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            memberCards: document.querySelectorAll('.member-card'),
            circleLayers: document.querySelectorAll('.circle-layer'),
            circleDetails: document.querySelectorAll('.circle-detail'),
            pendulum: document.getElementById('pendulum')
        };
        
        this.state = {
            isEntered: false,
            audioEnabled: false,
            currentSection: 'hierarchy'
        };
    }

    init() {
        this.setupEnvelope();
        this.setupNavigation();
        this.setupFilters();
        this.setupHierarchy();
        this.setupClock();
        this.setupScrollAnimations();
        this.setupHoverSounds();
    }

    /* ---------- ENVELOPE MECHANIC ---------- */
    setupEnvelope() {
        this.elements.envelopeWrapper.addEventListener('click', () => {
            if (this.state.isEntered) return;
            this.state.isEntered = true;

            // Resume audio context on user interaction
            this.initAudio();

            // Animation sequence
            this.elements.envelopeWrapper.classList.add('open');

            // Wait for envelope animation, then transition to main content
            setTimeout(() => {
                this.elements.entranceOverlay.classList.add('hidden');
                this.elements.mainContent.style.opacity = '1';
                this.elements.mainContent.style.transform = 'translateY(0)';
                
                // Trigger initial animations
                document.body.classList.add('entered');
                this.startClock();
            }, 1500);
        });
    }

    /* ---------- AUDIO SYSTEM ---------- */
    initAudio() {
        if (this.state.audioEnabled) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.state.audioEnabled = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playTick() {
        if (!this.state.audioEnabled || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.03);

        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1;

        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
    }

    playHoverSound() {
        if (!this.state.audioEnabled || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        // Subtle "whisper" or rustle
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(300, this.audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.005, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
    }

    setupHoverSounds() {
        const interactiveElements = document.querySelectorAll('.member-card, .nav-link, .filter-btn, .circle-layer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.playHoverSound());
        });
    }

    /* ---------- NAVIGATION ---------- */
    setupNavigation() {
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.dataset.section;
                
                if (this.state.currentSection === target) return;
                
                this.state.currentSection = target;
                
                // Update active link
                this.elements.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Switch sections
                this.elements.sections.forEach(section => {
                    if (section.id === target) {
                        section.classList.add('active');
                        section.style.animation = 'none';
                        section.offsetHeight; /* trigger reflow */
                        section.style.animation = 'fadeIn 0.6s ease forwards';
                    } else {
                        section.classList.remove('active');
                    }
                });

                // Scroll to top of content smoothly
                this.elements.mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    /* ---------- MEMBER FILTERS ---------- */
    setupFilters() {
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                this.elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                this.elements.memberCards.forEach(card => {
                    const cardCircle = card.dataset.circle;
                    if (filter === 'all' || filter === cardCircle) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ---------- HIERARCHY INTERACTION ---------- */
    setupHierarchy() {
        this.elements.circleLayers.forEach(layer => {
            layer.addEventListener('mouseenter', () => {
                const circle = layer.dataset.circle;
                
                // Highlight corresponding detail
                this.elements.circleDetails.forEach(detail => {
                    if (detail.dataset.detail === circle) {
                        detail.style.transform = 'translateX(10px)';
                        detail.style.boxShadow = 'var(--shadow-gaslight)';
                        detail.style.borderColor = 'var(--color-gold)';
                    } else {
                        detail.style.opacity = '0.5';
                        detail.style.transform = 'translateX(0)';
                    }
                });
            });

            layer.addEventListener('mouseleave', () => {
                this.elements.circleDetails.forEach(detail => {
                    detail.style.transform = 'translateX(0)';
                    detail.style.boxShadow = 'none';
                    detail.style.borderColor = '';
                    detail.style.opacity = '1';
                });
            });
        });
    }

    /* ---------- GRANDFATHER CLOCK ---------- */
    setupClock() {
        // Pendulum swing is handled by CSS animation
        // JS handles time updates
    }

    startClock() {
        this.updateClock();
        let lastSecond = new Date().getSeconds();
        
        setInterval(() => {
            const now = new Date();
            if (now.getSeconds() !== lastSecond) {
                this.playTick();
                lastSecond = now.getSeconds();
            }
            this.updateClock();
        }, 100); // Check frequently for precision
    }

    updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        
        // Calculate degrees
        const secondDeg = (seconds / 60) * 360;
        const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
        const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;
        
        // Apply rotation
        this.elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        this.elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;
        
        // Digital display
        const displayH = hours.toString().padStart(2, '0');
        const displayM = minutes.toString().padStart(2, '0');
        this.elements.clockTime.textContent = `${displayH}:${displayM}`;
    }

    /* ---------- SCROLL ANIMATIONS ---------- */
    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for reveal
        const revealTargets = document.querySelectorAll('.member-card, .circle-detail, .event-item, .admonition');
        revealTargets.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index % 4 * 0.1}s, transform 0.6s ease ${index % 4 * 0.1}s`;
            observer.observe(el);
        });

        // Add CSS class for revealed state via JS injection or assume CSS handles it
        // Since I can't modify CSS here, I'll inject a style rule
        const style = document.createElement('style');
        style.textContent = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}