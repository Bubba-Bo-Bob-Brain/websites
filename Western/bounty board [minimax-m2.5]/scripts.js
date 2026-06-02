/* ================================================
OLD WEST BOUNTY BOARD - SCRIPTS.JS
================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initDustParticles();
    initTumbleweed();
    initRevolverNavigation();
    initWantedPosters();
    initModal();
    initScrollEffects();
    initPageTransitions();
    
    console.log('🦅 Silver Creek Bounty Board Loaded - Justice is Coming...');
});

/* ================================================
DUST PARTICLES
================================================ */
function initDustParticles() {
    const dustOverlay = document.getElementById('dustOverlay');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createDustParticle(dustOverlay);
    }
    
    // Add new particles periodically
    setInterval(() => {
        if (document.hidden) return;
        const activeParticles = dustOverlay.querySelectorAll('.dust-particle');
        if (activeParticles.length < 50) {
            createDustParticle(dustOverlay);
        }
    }, 500);
}

function createDustParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dust-particle';
    
    // Random positioning and timing
    const size = Math.random() * 3 + 1;
    const startY = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${startY}vh;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    container.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

/* ================================================
TUMBLEWEED ANIMATION
================================================ */
function initTumbleweed() {
    const container = document.getElementById('tumbleweedContainer');
    
    // Create initial tumbleweeds
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createTumbleweed(container), i * 4000);
    }
    
    // Continuously spawn new tumbleweeds
    setInterval(() => {
        createTumbleweed(container);
    }, 8000);
}

function createTumbleweed(container) {
    const tumbleweed = document.createElement('div');
    tumbleweed.className = 'tumbleweed';
    
    // Random properties
    const duration = Math.random() * 15 + 15;
    const delay = Math.random() * 5;
    const startY = Math.random() * 60 + 20;
    const size = Math.random() * 30 + 40;
    
    tumbleweed.style.cssText = `
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        top: ${startY}%;
        transform: scale(${size / 60});
    `;
    
    container.appendChild(tumbleweed);
    
    // Remove after animation
    setTimeout(() => {
        tumbleweed.remove();
    }, (duration + delay) * 1000);
}

/* ================================================
REVOLVER CYLINDER NAVIGATION
================================================ */
function initRevolverNavigation() {
    const cylinder = document.getElementById('revolverCylinder');
    const chambers = cylinder.querySelectorAll('.cylinder-chamber');
    let currentRotation = 0;
    let isSpinning = false;
    
    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;
            
            // Calculate rotation to bring clicked chamber to top
            const targetRotation = -index * 60;
            const rotationDiff = targetRotation - currentRotation;
            const fullSpins = 3 * 360; // Add 3 full rotations
            const totalRotation = currentRotation + rotationDiff + fullSpins;
            
            cylinder.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            cylinder.style.transform = `rotate(${totalRotation}deg)`;
            currentRotation = totalRotation;
            
            // Play click sound effect (visual feedback)
            playClickFeedback(chamber);
            
            // Navigate to section after spin completes
            setTimeout(() => {
                navigateToSection(chamber.dataset.section);
                isSpinning = false;
            }, 1500);
        });
        
        // Hover effect - slight rotation to highlight chamber
        chamber.addEventListener('mouseenter', () => {
            if (!isSpinning) {
                const hoverRotation = currentRotation + (60 - (index * 60));
                cylinder.style.transition = 'transform 0.3s ease';
                cylinder.style.transform = `rotate(${hoverRotation}deg)`;
            }
        });
        
        chamber.addEventListener('mouseleave', () => {
            if (!isSpinning) {
                cylinder.style.transition = 'transform 0.3s ease';
                cylinder.style.transform = `rotate(${currentRotation}deg)`;
            }
        });
    });
}

function playClickFeedback(chamber) {
    // Visual feedback - flash the chamber
    chamber.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
    setTimeout(() => {
        chamber.style.boxShadow = '';
    }, 300);
}

function navigateToSection(section) {
    const sections = {
        'posters': 'wantedSection',
        'rewards': document.querySelector('.reward-board'),
        'profiles': 'wantedSection',
        'dispatch': document.querySelector('.dispatch-board'),
        'about': document.querySelector('.main-header')
    };
    
    let target;
    if (typeof sections[section] === 'string') {
        target = document.getElementById(sections[section]);
    } else {
        target = sections[section];
    }
    
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        setTimeout(() => {
            target.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
            setTimeout(() => {
                target.style.boxShadow = '';
            }, 1000);
        }, 100);
    }
}

/* ================================================
WANTED POSTERS INTERACTIONS
================================================ */
function initWantedPosters() {
    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach((poster, index) => {
        // Add staggered animation
        poster.style.opacity = '0';
        poster.style.animation = `fadeInUp 0.6s ease forwards`;
        poster.style.animationDelay = `${0.1 + index * 0.1}s`;
        
        // Hover interactions
        poster.addEventListener('mouseenter', () => {
            poster.querySelector('.outlaw-photo').style.transform = 'scale(1.1)';
        });
        
        poster.addEventListener('mouseleave', () => {
            poster.querySelector('.outlaw-photo').style.transform = '';
        });
        
        // Click to open modal
        poster.addEventListener('click', (e) => {
            if (!e.target.closest('.wanted-poster')) return;
            openOutlawModal(poster);
        });
        
        // Add "seen" tracking
        poster.addEventListener('click', () => {
            trackPosterView(poster);
        });
    });
    
    // Add random "bounty updated" flash effect
    setInterval(() => {
        const randomPoster = posters[Math.floor(Math.random() * posters.length)];
        randomPoster.style.filter = 'brightness(1.2) sepia(50%)';
        setTimeout(() => {
            randomPoster.style.filter = '';
        }, 500);
    }, 10000);
}

function trackPosterView(poster) {
    const outlaw = poster.dataset.outlaw;
    const views = JSON.parse(localStorage.getItem('bountyViews') || '{}');
    views[outlaw] = (views[outlaw] || 0) + 1;
    localStorage.setItem('bountyViews', JSON.stringify(views));
    
    // Update view count in UI
    const viewCount = poster.querySelector('.view-count');
    if (viewCount) {
        viewCount.textContent = `Viewed ${views[outlaw]} times`;
    }
}

/* ================================================
MODAL SYSTEM
================================================ */
function initModal() {
    const modal = document.getElementById('outlawModal');
    const closeBtn = document.getElementById('modalClose');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openOutlawModal(poster) {
    const modal = document.getElementById('outlawModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalReward = document.getElementById('modalReward');
    const modalDetails = document.getElementById('modalDetails');
    
    // Get data from poster
    const photo = poster.querySelector('.outlaw-photo');
    const name = poster.querySelector('.outlaw-name');
    const reward = poster.querySelector('.reward-amount').textContent;
    const description = poster.querySelector('.poster-description');
    
    // Populate modal
    modalImage.src = photo.src;
    modalImage.alt = photo.alt;
    modalName.textContent = name.textContent;
    modalReward.textContent = `★ REWARD: ${reward} ★`;
    modalDetails.innerHTML = description.innerHTML;
    
    // Add wanted poster to modal
    modalDetails.innerHTML += `<p style="margin-top: 10px; font-style: italic;">"This outlaw is wanted for multiple crimes against the frontier. Approach with extreme caution."</p>`;
    
    // Show modal
    modal.classList.add('active');
    
    // Play opening sound (visual)
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('outlawModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ================================================
SCROLL EFFECTS
================================================ */
function initScrollEffects() {
    // Parallax effect for background
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.dispatch-entry, .reward-tier, .wanted-poster').forEach(el => {
        observer.observe(el);
    });
    
    // Add parallax to elements
    document.querySelectorAll('.wanted-poster').forEach((poster, index) => {
        poster.style.setProperty('--parallax-offset', `${index * 20}px`);
    });
}

function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Subtle parallax for header
    document.querySelector('.main-header').style.backgroundPositionY = `${scrolled * 0.5}px`;
    
    // Parallax for wanted posters
    document.querySelectorAll('.wanted-poster').forEach((poster, index) => {
        const offset = (scrolled * 0.1 * (index % 2 === 0 ? 1 : -1));
        poster.style.transform = `translateY(${offset}px)`;
    });
}

/* ================================================
PAGE TRANSITIONS
================================================ */
function initPageTransitions() {
    // Saloon door transition effect (can be triggered)
    window.triggerSaloonTransition = function(callback) {
        const wrapper = document.getElementById('pageWrapper');
        wrapper.style.transition = 'opacity 0.5s ease';
        wrapper.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
            wrapper.style.opacity = '1';
        }, 500);
    };
    
    // Add transition on link hover
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.style.cursor = 'pointer';
        });
        link.addEventListener('mouseleave', () => {
            document.body.style.cursor = 'default';
        });
    });
}

/* ================================================
ADDITIONAL FEATURES
================================================ */

// Dynamic dispatch log updates
function addDispatchEntry(message, author, isImportant = false) {
    const dispatchLog = document.querySelector('.dispatch-log');
    const now = new Date();
    
    const entry = document.createElement('div');
    entry.className = `dispatch-entry${isImportant ? ' important' : ''}`;
    entry.innerHTML = `
        <span class="dispatch-time">${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span class="dispatch-date">${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <p class="dispatch-message">${message}</p>
        <span class="dispatch-author">— ${author}</span>
    `;
    entry.style.animation = 'fadeInUp 0.5s ease';
    
    dispatchLog.insertBefore(entry, dispatchLog.firstChild);
    
    // Auto-remove old entries
    if (dispatchLog.children.length > 10) {
        dispatchLog.lastChild.remove();
    }
}

// Simulate occasional dispatch updates
setInterval(() => {
    const messages = [
        'New bounty posted for a stagecoach robber...',
        'Deputy reports sighting near the saloon...',
        'Reward increased for dangerous outlaws...',
        'Sheriff to hold town meeting at noon...',
        'Bank robbery plot thwarted in Dodge City...',
        'Possibly related to the Ghost gang...'
    ];
    const authors = ['Deputy Cole', 'Sheriff Billings', 'Town Crier', 'Deputy Hoskins', 'Sheriff Garrett'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const isImportant = Math.random() > 0.7;
    
    addDispatchEntry(randomMessage, randomAuthor, isImportant);
}, 30000);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const posters = document.querySelectorAll('.wanted-poster');
    const currentIndex = Array.from(posters).findIndex(p => p === document.activeElement);
    
    if (e.key === 'ArrowRight' && currentIndex < posters.length - 1) {
        posters[currentIndex + 1].focus();
    }
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        posters[currentIndex - 1].focus();
    }
    if (e.key === 'Enter' && document.activeElement.classList.contains('wanted-poster')) {
        openOutlawModal(document.activeElement);
    }
});

// Add "Wanted" stamp effect on posters
const posters = document.querySelectorAll('.wanted-poster');
posters.forEach(poster => {
    poster.addEventListener('click', createStampEffect);
});

function createStampEffect(e) {
    const poster = e.currentTarget;
    const rect = poster.getBoundingClientRect();
    
    const stamp = document.createElement('div');
    stamp.style.cssText = `
        position: fixed;
        left: ${e.clientX - 50}px;
        top: ${e.clientY - 25}px;
        font-family: 'Rye', serif;
        font-size: 1.5rem;
        color: rgba(139, 0, 0, 0.8);
        border: 3px solid rgba(139, 0, 0, 0.8);
        padding: 5px 15px;
        transform: rotate(-15deg);
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
    `;
    stamp.textContent = '★ SEEN ★';
    
    document.body.appendChild(stamp);
    
    // Animate stamp
    stamp.animate([
        { opacity: 0, transform: 'rotate(-15deg) scale(2)' },
        { opacity: 1, transform: 'rotate(-15deg) scale(1)' },
        { opacity: 0.8, transform: 'rotate(-15deg) scale(1)' }
    ], {
        duration: 800,
        easing: 'ease-out'
    });
    
    setTimeout(() => stamp.remove(), 800);
}

// Initialize tooltips for reward tiers
document.querySelectorAll('.reward-tier').forEach(tier => {
    tier.addEventListener('mouseenter', (e) => {
        const label = tier.querySelector('.tier-label');
        showTooltip(e, label.textContent);
    });
    tier.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(e, text) {
    const existing = document.querySelector('.custom-tooltip');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        left: ${e.clientX + 10}px;
        top: ${e.clientY - 30}px;
        background: #2C1810;
        color: #D4C4A8;
        padding: 5px 10px;
        font-size: 0.7rem;
        border-radius: 3px;
        z-index: 1000;
        pointer-events: none;
        font-family: 'Special Elite', cursive;
    `;
    
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const existing = document.querySelector('.custom-tooltip');
    if (existing) existing.remove();
}

// Add sound effects (visual feedback)
function playSound(type) {
    const sounds = {
        click: () => {
            // Visual click feedback
        },
        swoosh: () => {
            // Visual swoosh feedback
        },
        ding: () => {
            // Visual ding feedback - flash screen edge
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 4px solid transparent;
                pointer-events: none;
                z-index: 5000;
            `;
            document.body.appendChild(flash);
            
            flash.animate([
                { borderColor: 'transparent' },
                { borderColor: 'rgba(212, 175, 55, 0.5)' },
                { borderColor: 'transparent' }
            ], { duration: 300 });
            
            setTimeout(() => flash.remove(), 300);
        }
    };
    
    if (sounds[type]) sounds[type]();
}

// Export for potential use
window.BountyBoard = {
    addDispatchEntry: addDispatchEntry,
    openOutlawModal: openOutlawModal,
    closeModal: closeModal
};