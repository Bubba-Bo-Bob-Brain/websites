// Dark Ages Chronicles - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoadingScreen();
    initializeParticles();
    initializeDayNightCycle();
    initializeNavigation();
    initializeMapInteractions();
    initializePlagueDoctor();
    initializeBells();
    initializeScrollAnimations();
});

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 200);
}

// Particle System
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 20 : 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    // Add some ember particles
    for (let i = 0; i < 10; i++) {
        createParticle(particlesContainer, true);
    }
}

function createParticle(container, isEmber = false) {
    const particle = document.createElement('div');
    particle.className = `particle ${isEmber ? 'ember' : 'dust'}`;
    
    // Random position and animation properties
    const size = isEmber ? Math.random() * 6 + 4 : Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 15;
    
    particle.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container, isEmber);
    }, (delay + duration) * 1000);
}

// Day/Night Cycle
function initializeDayNightCycle() {
    const toggle = document.getElementById('dayNightToggle');
    const body = document.body;
    const overlay = document.getElementById('dayNightOverlay');
    
    // Set initial state based on time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        body.classList.add('day-mode');
        body.classList.remove('night-mode');
    } else {
        body.classList.add('night-mode');
        body.classList.remove('day-mode');
    }
    
    // Toggle functionality
    toggle.addEventListener('click', () => {
        body.classList.toggle('day-mode');
        body.classList.toggle('night-mode');
        
        // Add transition effect
        overlay.style.opacity = '0.8';
        setTimeout(() => {
            overlay.style.opacity = '';
        }, 300);
        
        // Update particle colors based on mode
        updateParticleColors(body.classList.contains('day-mode'));
    });
    
    // Initialize particle colors
    updateParticleColors(body.classList.contains('day-mode'));
}

function updateParticleColors(isDay) {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        if (isDay) {
            particle.style.background = particle.classList.contains('ember') 
                ? '#ff9500' 
                : '#f5e6c8';
        } else {
            particle.style.background = particle.classList.contains('ember') 
                ? '#ff6b35' 
                : '#d4af37';
        }
    });
}

// Navigation System
function initializeNavigation() {
    const tabs = document.querySelectorAll('.scroll-tab');
    const sections = document.querySelectorAll('.content-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.getAttribute('data-section');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                    
                    // Scroll to section
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Trigger animations for the new section
                    animateSection(section);
                }
            });
        });
    });
}

function animateSection(section) {
    // Add entrance animations to elements
    const elements = section.querySelectorAll('.column, .timeline-event, .legacy-item, .remedy-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Village Map Interactions
function initializeMapInteractions() {
    const buildings = document.querySelectorAll('.map-building');
    const tooltip = document.getElementById('mapTooltip');
    const tooltipTitle = tooltip.querySelector('.tooltip-title');
    const tooltipInfo = tooltip.querySelector('.tooltip-info');
    
    buildings.forEach(building => {
        building.addEventListener('mouseenter', (e) => {
            const name = building.getAttribute('data-name');
            const info = building.getAttribute('data-info');
            
            tooltipTitle.textContent = name;
            tooltipInfo.textContent = info;
            
            // Position tooltip
            const rect = building.getBoundingClientRect();
            const mapContainer = document.querySelector('.pixel-map-container').getBoundingClientRect();
            
            tooltip.style.left = (rect.left - mapContainer.left + 20) + 'px';
            tooltip.style.top = (rect.top - mapContainer.top - 100) + 'px';
            
            tooltip.classList.add('visible');
        });
        
        building.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
        
        building.addEventListener('click', () => {
            // Add click animation
            building.style.transform = 'scale(1.2)';
            setTimeout(() => {
                building.style.transform = '';
            }, 300);
            
            // Show building details
            showBuildingDetails(building);
        });
    });
    
    // Animate villagers
    animateVillagers();
}

function animateVillagers() {
    const villagers = document.querySelectorAll('.villager');
    
    villagers.forEach(villager => {
        // Random movement
        setInterval(() => {
            const randomX = Math.random() * 100 - 50;
            const randomY = Math.random() * 100 - 50;
            villager.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + Math.random() * 2000);
    });
}

function showBuildingDetails(building) {
    const name = building.getAttribute('data-name');
    const info = building.getAttribute('data-info');
    
    // Create a modal popup with building details
    const modal = document.createElement('div');
    modal.className = 'building-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${name}</h3>
            <p>${info}</p>
            <button class="modal-close">Close</button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: var(--parchment);
        padding: 30px;
        border: 4px solid var(--gold);
        max-width: 500px;
        text-align: center;
        font-family: var(--font-medieval);
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: var(--blood-red);
        color: var(--parchment);
        border: none;
        padding: 10px 20px;
        margin-top: 20px;
        cursor: pointer;
        font-family: var(--font-pixel);
    `;
    
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
    
    document.body.appendChild(modal);
}

// Plague Doctor Interactions
function initializePlagueDoctor() {
    const doctor = document.getElementById('plagueDoctor');
    const dialog = doctor.querySelector('.doctor-dialog');
    const sprite = doctor.querySelector('.plague-doctor-sprite');
    
    const quips = [
        "Bring out your dead!",
        "Try this leech therapy!",
        "The miasma theory is sound!",
        "Wear this protective mask!",
        "Beware the bad air!",
        "A little bloodletting cures all!",
        "Burn the aromatic herbs!"
    ];
    
    let currentQuip = 0;
    
    sprite.addEventListener('click', () => {
        // Cycle through quips
        currentQuip = (currentQuip + 1) % quips.length;
        const quipText = doctor.querySelector('.dialog-text');
        quipText.textContent = quips[currentQuip];
        
        // Show dialog with animation
        dialog.classList.add('visible');
        
        // Hide after 3 seconds
        setTimeout(() => {
            dialog.classList.remove('visible');
        }, 3000);
    });
    
    // Make plague doctor appear on scroll
    window.addEventListener('scroll', () => {
        const doctorSection = document.getElementById('plague');
        const rect = doctorSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.7) {
            doctor.style.animation = 'doctor-float 4s ease-in-out infinite';
        }
    });
}

// Tolling Bells
function initializeBells() {
    const bells = document.querySelectorAll('.bell');
    const tollButton = document.getElementById('tollBell');
    const visualizer = document.getElementById('bellVisualizer');
    
    // Create visualizer bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '10px';
        visualizer.appendChild(bar);
    }
    
    tollButton.addEventListener('click', () => {
        // Ring all bells
        bells.forEach((bell, index) => {
            setTimeout(() => {
                bell.classList.add('ringing');
                
                // Stop after 5 seconds
                setTimeout(() => {
                    bell.classList.remove('ringing');
                }, 5000);
            }, index * 500);
        });
        
        // Animate visualizer
        animateVisualizer();
        
        // Play bell sound (simulated)
        playBellSound();
    });
    
    // Individual bell clicks
    bells.forEach(bell => {
        bell.addEventListener('click', () => {
            bell.classList.add('ringing');
            setTimeout(() => {
                bell.classList.remove('ringing');
            }, 3000);
            
            animateVisualizer(1);
        });
    });
}

function animateVisualizer(count = 3) {
    const bars = document.querySelectorAll('.visualizer-bar');
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            bars.forEach(bar => {
                const height = Math.random() * 40 + 10;
                bar.style.height = height + 'px';
                bar.style.background = `hsl(${40 + Math.random() * 20}, 100%, 50%)`;
            });
            
            // Reset bars
            setTimeout(() => {
                bars.forEach(bar => {
                    bar.style.height = '10px';
                    bar.style.background = 'var(--gold)';
                });
            }, 200);
        }, i * 100);
    }
}

function playBellSound() {
    // Create audio context for bell sounds
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for bell tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440; // A4
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    // Add parallax effect to parchment container
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parchment = document.querySelector('.parchment-container');
        
        if (parchment) {
            parchment.style.transform = `rotate(-0.5deg) translateY(${scrolled * 0.05}px)`;
        }
    });
    
    // Timeline animations
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineEvents.forEach(event => {
        event.style.opacity = '0';
        event.style.transform = 'translateY(30px)';
        event.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(event);
    });
    
    // Legacy items animation
    const legacyItems = document.querySelectorAll('.legacy-item');
    legacyItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add CSS for modals
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .building-modal .modal-content h3 {
        font-family: var(--font-pixel);
        font-size: 1.2rem;
        color: var(--blood-red);
        margin-bottom: 15px;
    }
    
    .building-modal .modal-content p {
        font-family: var(--font-medieval);
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(modalStyles);

// Interactive elements enhancement
document.addEventListener('mousemove', (e) => {
    // Add subtle movement to wax seal
    const waxSeal = document.querySelector('.wax-seal');
    if (waxSeal) {
        const rect = waxSeal.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        waxSeal.style.transform = `rotate(15deg) translate(${x * 0.1}px, ${y * 0.1}px)`;
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const tabs = document.querySelectorAll('.scroll-tab');
    const activeTab = document.querySelector('.scroll-tab.active');
    
    if (!activeTab) return;
    
    const currentIndex = Array.from(tabs).indexOf(activeTab);
    let newIndex;
    
    switch(e.key) {
        case 'ArrowRight':
            newIndex = (currentIndex + 1) % tabs.length;
            break;
        case 'ArrowLeft':
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
        default:
            return;
    }
    
    tabs[newIndex].click();
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Make all elements rainbow colored
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.transition = 'filter 2s ease';
        el.style.filter = 'hue-rotate(360deg)';
    });
    
    // Reset after 5 seconds
    setTimeout(() => {
        allElements.forEach(el => {
            el.style.filter = '';
        });
    }, 5000);
    
    // Show message
    const message = document.createElement('div');
    message.textContent = '🎮 SECRET MODE ACTIVATED! 🏰';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gold);
        color: var(--ink-brown);
        padding: 20px 40px;
        font-family: var(--font-pixel);
        font-size: 1.2rem;
        z-index: 10000;
        border: 4px solid var(--blood-red);
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
        animation: fadeIn 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// Responsive adjustments
window.addEventListener('resize', () => {
    // Adjust particle count on resize
    const particlesContainer = document.getElementById('particles');
    const currentParticles = particlesContainer.querySelectorAll('.particle').length;
    const targetParticles = window.innerWidth < 768 ? 20 : 50;
    
    if (currentParticles < targetParticles) {
        for (let i = 0; i < targetParticles - currentParticles; i++) {
            createParticle(particlesContainer, i < 10);
        }
    }
});