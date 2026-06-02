// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Navigation system with scroll spy
    const sections = document.querySelectorAll('.scroll-section');
    const seals = document.querySelectorAll('.seal');
    const scrollContainer = document.querySelector('.scroll-content');
    
    // Initialize first section as active
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }
    
    // Seal click navigation
    seals.forEach(seal => {
        seal.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active seal
            seals.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to target section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active section
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                targetElement.classList.add('active');
            }
        });
    });
    
    // Scroll-based navigation highlighting
    let currentActive = 0;
    
    function updateActiveSection() {
        let index = sections.length;
        
        while (index--) {
            const section = sections[index];
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Check if section is in viewport
            if (rect.top <= windowHeight * 0.3) {
                if (currentActive !== index) {
                    // Remove active class from all sections
                    sections.forEach(sec => sec.classList.remove('active'));
                    // Add active class to current section
                    section.classList.add('active');
                    
                    // Update seal states
                    seals.forEach(seal => seal.classList.remove('active'));
                    const targetSeal = document.querySelector(`.seal[data-section="${section.id}"]`);
                    if (targetSeal) {
                        targetSeal.classList.add('active');
                    }
                    
                    currentActive = index;
                }
            }
        }
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
    }
    
    function resetTick() {
        ticking = false;
    }
    
    // Add scroll listener
    scrollContainer.addEventListener('scroll', function() {
        requestTick();
    }, { passive: true });
    
    // Initial check
    updateActiveSection();
    
    // Add scroll progress indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollContainer.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight - this.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Update scroll hint animation
            const hint = this.querySelector('.scroll-hint');
            if (hint) {
                hint.style.animationDelay = `${scrollPercent * 0.05}s`;
            }
        });
    }
    
    // Add dynamic qi flow animation based on scroll position
    function updateQiFlow() {
        const scrollTop = scrollContainer.scrollTop;
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollPercent = Math.min(scrollTop / maxScroll, 1);
        
        // Update qi particles based on scroll
        const particles = document.querySelectorAll('.qi-particle');
        particles.forEach((particle, index) => {
            const delay = index * 1;
            particle.style.animationDelay = `-${scrollPercent * 3 + delay}s`;
        });
        
        // Update meridian glow based on scroll
        const meridianLine = document.querySelector('.meridian-line');
        if (meridianLine) {
            const intensity = 0.3 + (scrollPercent * 0.7);
            meridianLine.style.opacity = intensity;
        }
        
        requestAnimationFrame(updateQiFlow);
    }
    
    // Start qi flow animation
    updateQiFlow();
    
    // Add subtle interactive effects
    const techniqueCards = document.querySelectorAll('.technique-card');
    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    const branchElements = document.querySelectorAll('.branch');
    branchElements.forEach(branch => {
        branch.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        branch.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add decorative floating particles
    function createFloatingParticles() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--gold-accent);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
            animation: floatParticle 6s ease-in-out infinite;
            z-index: 100;
        `;
        
        // Add keyframes for particle animation
        if (!document.querySelector('#particle-keyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'particle-keyframes';
            keyframes.textContent = `
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
                    50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
                }
            `;
            document.head.appendChild(keyframes);
        }
        
        document.body.appendChild(particle);
        
        // Animate particle horizontally
        let pos = 0;
        const direction = 1;
        const speed = 0.5;
        
        function animateParticle() {
            pos += speed * direction;
            particle.style.left = pos + 'px';
            particle.style.top = (20 + Math.sin(pos * 0.05) * 20) + 'px';
            
            if (pos > window.innerWidth + 20) {
                pos = -20;
            }
            
            requestAnimationFrame(animateParticle);
        }
        
        animateParticle();
    }
    
    // Initialize floating particles after a delay
    setTimeout(createFloatingParticles, 1000);
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        const currentActiveSection = document.querySelector('.scroll-section.active');
        const currentIndex = Array.from(sections).indexOf(currentActiveSection);
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            sections[prevIndex].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'Home') {
            e.preventDefault();
            sections[0].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            sections[sections.length - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Add scroll snap effect
    scrollContainer.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const sectionHeight = window.innerHeight;
        
        // Calculate which section should be active based on scroll position
        const targetIndex = Math.round(scrollTop / sectionHeight);
        
        if (targetIndex >= 0 && targetIndex < sections.length) {
            // Smooth scroll adjustment for snap effect
            const targetPosition = targetIndex * sectionHeight;
            if (Math.abs(scrollTop - targetPosition) > 5) {
                this.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});