// Blighted Chronicle - Interactive Features

// Utility function to safely get elements
function getElement(id) {
    return document.getElementById(id);
}

// Create animated particles for hero section
function createParticles() {
    const container = document.querySelector('.hero');
    if (!container) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size (1-4px)
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration (2-6s)
        const duration = 2 + Math.random() * 4;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        particle.style.position = 'absolute';
        particle.style.backgroundColor = 'rgba(139, 0, 0, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.animation = 'float linear infinite';
        
        container.appendChild(particle);
    }
}

// Update the hero stats with random fluctuations
function updateHeroStats() {
    const daysSinceDawn = document.getElementById('daysSinceDawn');
    const soulsClaimed = document.getElementById('soulsClaimed');
    
    if (daysSinceDawn) {
        setInterval(() => {
            const currentDays = parseInt(daysSinceDawn.textContent.replace(/,/g, ''));
            if (!isNaN(currentDays)) {
                const newDays = currentDays + 1;
                daysSinceDawn.textContent = newDays.toLocaleString();
            }
        }, 30000);
    }
    
    if (soulsClaimed) {
        setInterval(() => {
            const currentSouls = parseInt(soulsClaimed.textContent.replace(/,/g, ''));
            if (!isNaN(currentSouls)) {
                const newSouls = currentSouls + Math.floor(Math.random() * 10) + 1;
                soulsClaimed.textContent = newSouls.toLocaleString();
            }
        }, 5000);
    }
}

// Animate misery gauge
function animateGauge() {
    const gauge = document.querySelector('.gauge-fill');
    if (!gauge) return;
    
    let currentValue = 78;
    setInterval(() => {
        const fluctuation = (Math.random() - 0.5) * 4;
        currentValue = Math.max(60, Math.min(95, currentValue + fluctuation));
        gauge.style.width = `${currentValue}%`;
        
        const valueDisplay = document.querySelector('.gauge-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(currentValue)}%`;
        }
    }, 2000);
}

// Animate artifact cards
function animateArtifacts() {
    const cards = document.querySelectorAll('.artifact-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
}

// Handle scroll events for navigation
function handleScroll() {
    const nav = document.querySelector('.nav-bar');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Add smooth reveal on scroll
function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    animateArtifacts();
    updateStats();
    revealOnScroll();
    handleNavigation();
    
    // Add cursor tracking for interactive elements
    const cards = document.querySelectorAll('.artifact-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Clean up function (optional, for SPA usage)
function destroy() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
}