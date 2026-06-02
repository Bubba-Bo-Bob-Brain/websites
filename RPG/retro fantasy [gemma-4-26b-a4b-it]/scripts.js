/**
 * THE ARCHIVIST'S ENGINE
 * A custom orchestration layer for the Grimoire interface.
 */

class GrimoireEngine {
    constructor() {
        this.container = document.querySelector('.grimoire-container');
        this.parchment = document.querySelector('.parchment-page');
        this.statBlock = document.querySelector('.stat-block');
        this.waxSeal = document.querySelector('.wax-seal');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.content-section');
        
        this.isSealBroken = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.setupInitialState();
        this.setupSealInteraction();
        this.setupNavigationObserver();
        this.setupParallax();
        this.setupCandlelight();
        this.setupQuestInteractions();
        
        // Start the entrance animation
        setTimeout(() => this.revealGrimoire(), 500);
    }

    /**
     * Sets the initial visibility of elements to allow for a choreographed entrance.
     */
    setupInitialState() {
        this.container.style.opacity = '0';
        this.container.style.transform = 'scale(0.95) translateY(20px)';
        this.container.style.transition = 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    /**
     * Animates the container as if the book is being opened.
     */
    revealGrimoire() {
        this.container.style.opacity = '1';
        this.container.style.transform = 'scale(1) translateY(0)';
    }

    /**
     * Handles the wax seal click event.
     */
    setupSealInteraction() {
        this.waxSeal.addEventListener('click', () => {
            if (this.isSealBroken) return;

            this.isSealBroken = true;
            this.waxSeal.style.transform = 'scale(1.5) rotate(15deg)';
            this.waxSeal.style.opacity = '0';
            
            // Add a "shatter" effect via a temporary class
            document.body.classList.add('seal-shattered');
            
            // Reveal the content more aggressively
            this.parchment.style.filter = 'brightness(1.1)';
            setTimeout(() => {
                this.parchment.style.filter = 'brightness(1)';
            }, 500);

            console.log("The Seal of the Archivist has been broken...");
        });
    }

    /**
     * Uses IntersectionObserver to update navigation as the user scrolls.
     */
    setupNavigationObserver() {
        const options = {
            root: this.parchment,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNav(id);
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }

    updateActiveNav(id) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Implements a subtle parallax effect to create depth between layers.
     */
    setupParallax() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Calculate movement offset (-20px to 20px)
            const moveX = (this.mouseX - window.innerWidth / 2) / 50;
            const moveY = (this.mouseY - window.innerHeight / 2) / 50;

            // Parchment moves slightly opposite to mouse for depth
            this.parchment.style.transform = `translate3d(${moveX * -0.5}px, ${moveY * -0.5}px, 0)`;
            
            // Stat block moves with the mouse for a "floating" feel
            this.statBlock.style.transform = `translate3d(${moveX * 0.8}px, ${moveY * 0.8}px, 0)`;
        });
    }

    /**
     * Creates a "candlelight" effect by following the mouse with a radial gradient.
     */
    setupCandlelight() {
        // We create a dynamic light source element
        const light = document.createElement('div');
        light.className = 'candlelight-overlay';
        document.body.appendChild(light);

        window.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth performance
            requestAnimationFrame(() => {
                light.style.left = `${e.clientX}px`;
                light.style.top = `${e.clientY}px`;
            });
        });
    }

    /**
     * Adds subtle micro-interactions to the quest notices.
     */
    setupQuestInteractions() {
        const notices = document.querySelectorAll('.notice-paper');
        notices.forEach(notice => {
            notice.addEventListener('click', () => {
                // A little "shake" animation when clicking a notice
                notice.animate([
                    { transform: 'rotate(-2deg) translateX(0)' },
                    { transform: 'rotate(2deg) translateX(5px)' },
                    { transform: 'rotate(-2deg) translateX(-5px)' },
                    { transform: 'rotate(0deg) translateX(0)' }
                ], {
                    duration: 300,
                    easing: 'ease-in-out'
                });
                
                console.log("Examining quest notice...");
            });
        });
    }
}

// Initialize the engine when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.engine = new GrimoireEngine();
});