/* ============================================
   DUST CREEK COUNTY BOUNTY BOARD
   Interactive Scripts & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initDustParticles();
    initTumbleweeds();
    initNavigation();
    initWantedPosters();
    initModal();
    initScrollAnimations();
    initTypewriterEffects();
});

/* === Dust Particle System === */
function initDustParticles() {
    const dustOverlay = document.getElementById('dustOverlay');
    const particleCount = 50;
    
    // Create dust particles
    for (let i = 0; i < particleCount; i++) {
        createDustParticle(dustOverlay);
    }
    
    // Continuously add new particles
    setInterval(() => {
        if (dustOverlay.children.length < particleCount) {
            createDustParticle(dustOverlay);
        }
    }, 500);
}

function createDustParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dust-particle';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    // Random drift direction
    const driftX = (Math.random() - 0.5) * 400;
    const driftY = -(Math.random() * window.innerHeight + 200);
    
    // Random size
    const size = Math.random() * 4 + 1;
    
    // Random duration
    const duration = Math.random() * 10 + 8;
    
    // Random delay
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size}px;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

/* === Tumbleweed System === */
function initTumbleweeds() {
    const container = document.getElementById('tumbleweedContainer');
    
    // Create initial tumbleweed
    createTumbleweed(container);
    
    // Periodically spawn new tumbleweeds
    setInterval(() => {
        if (Math.random() > 0.6) { // 40% chance every interval
            createTumbleweed(container);
        }
    }, 8000);
}

function createTumbleweed(container) {
    const tumbleweed = document.createElement('div');
    tumbleweed.className = 'tumbleweed';
    
    // Random size variation
    const size = Math.random() * 40 + 40;
    tumbleweed.style.width = `${size}px`;
    tumbleweed.style.height = `${size}px`;
    
    // Random vertical position
    const topPos = Math.random() * 30 + 60;
    tumbleweed.style.animation = `tumbleAcross ${Math.random() * 10 + 12}s linear forwards`;
    tumbleweed.style.top = `${topPos}%`;
    
    // Tumbleweed SVG
    tumbleweed.innerHTML = `
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#8b6914" stroke-width="1.5" opacity="0.7">
                <!-- Main tangle -->
                <ellipse cx="50" cy="50" rx="40" ry="35" />
                <ellipse cx="50" cy="50" rx="35" ry="40" />
                <ellipse cx="50" cy="50" rx="30" ry="28" />
                
                <!-- Branch details -->
                <path d="M20 50 Q35 30 50 35 Q65 30 80 50" />
                <path d="M25 60 Q40 80 50 70 Q60 80 75 60" />
                <path d="M30 40 Q50 20 70 40" />
                <path d="M30 70 Q50 85 70 70" />
                
                <!-- Cross branches -->
                <path d="M15 45 Q30 55 45 45" />
                <path d="M55 45 Q70 55 85 45" />
                <path d="M20 55 Q35 65 50 55" />
                <path d="M50 55 Q65 65 80 55" />
                
                <!-- Inner tangles -->
                <circle cx="40" cy="45" r="8" />
                <circle cx="60" cy="55" r="10" />
                <circle cx="50" cy="50" r="6" />
                
                <!-- Twigs -->
                <line x1="25" y1="35" x2="35" y2="25" />
                <line x1="75" y1="35" x2="65" y2="25" />
                <line x1="20" y1="60" x2="30" y2="70" />
                <line x1="80" y1="60" x2="70" y2="70" />
            </g>
        </svg>
    `;
    
    container.appendChild(tumbleweed);
    
    // Remove after animation
    tumbleweed.addEventListener('animationend', () => {
        tumbleweed.remove();
    });
}

/* === Navigation System === */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Cylinder rotation effect
            animateCylinderRotation(item);
            
            // Switch sections with saloon door effect
            switchSection(targetSection, sections);
        });
    });
}

function animateCylinderRotation(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    const bullet = activeItem.querySelector('.nav-bullet');
    
    // Spin the bullet like a revolver cylinder
    bullet.style.transition = 'transform 0.4s ease';
    bullet.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        bullet.style.transform = 'rotate(0deg)';
    }, 400);
    
    // Add click sound effect (visual feedback)
    activeItem.style.transform = 'scale(0.95)';
    setTimeout(() => {
        activeItem.style.transform = 'scale(1)';
    }, 150);
}

function switchSection(targetId, sections) {
    sections.forEach(section => {
        if (section.id === targetId) {
            // Saloon door opening effect
            section.style.opacity = '0';
            section.style.transform = 'perspective(1000px) rotateY(-90deg)';
            section.style.display = 'block';
            
            // Trigger reflow
            section.offsetHeight;
            
            // Animate in
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'perspective(1000px) rotateY(0deg)';
            section.classList.add('active');
            
            // Re-trigger animations for visible elements
            setTimeout(() => {
                triggerSectionAnimations(section);
            }, 300);
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });
}

function triggerSectionAnimations(section) {
    // Animate posters sliding in
    const posters = section.querySelectorAll('.wanted-poster');
    posters.forEach((poster, index) => {
        poster.style.opacity = '0';
        poster.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            poster.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            poster.style.opacity = '1';
            poster.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate reward tiers
    const tiers = section.querySelectorAll('.reward-tier');
    tiers.forEach((tier, index) => {
        tier.style.opacity = '0';
        tier.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            tier.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            tier.style.opacity = '1';
            tier.style.transform = 'translateX(0)';
        }, index * 150);
    });
    
    // Animate dispatch entries
    const entries = section.querySelectorAll('.dispatch-entry');
    entries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            entry.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    // Animate profile cards
    const profiles = section.querySelectorAll('.outlaw-profile');
    profiles.forEach((profile, index) => {
        profile.style.opacity = '0';
        profile.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            profile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            profile.style.opacity = '1';
            profile.style.transform = 'scale(1)';
        }, index * 200);
    });
}

/* === Wanted Poster Interactions === */
function initWantedPosters() {
    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(poster => {
        // Parallax tilt effect on mouse move
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            poster.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        
        poster.addEventListener('mouseleave', () => {
            poster.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Click to open modal
        poster.addEventListener('click', () => {
            const outlawId = poster.dataset.outlaw;
            openOutlawModal(outlawId);
        });
        
        // Paper rustle effect on hover
        poster.addEventListener('mouseenter', () => {
            createPaperRustleEffect(poster);
        });
    });
}

function createPaperRustleEffect(poster) {
    // Add subtle rotation animation
    const content = poster.querySelector('.poster-content');
    content.style.transition = 'transform 0.1s ease';
    
    // Quick micro-rotation
    const rotations = [-0.5, 0.5, -0.3, 0.3, 0];
    let i = 0;
    
    const rustle = setInterval(() => {
        if (i >= rotations.length) {
            clearInterval(rustle);
            return;
        }
        content.style.transform = `rotate(${rotations[i]}deg)`;
        i++;
    }, 50);
}

/* === Modal System === */
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    closeBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openOutlawModal(outlawId) {
    const overlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    const outlawData = getOutlawData(outlawId);
    
    if (!outlawData) return;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h3>${outlawData.name}</h3>
            <p class="modal-aka">${outlawData.aka}</p>
        </div>
        <div class="modal-reward-banner">
            <span class="modal-reward-label">BOUNTY</span>
            <span class="modal-reward-amount">${outlawData.reward}</span>
        </div>
        <div class="modal-details">
            <div class="modal-detail-row">
                <span class="detail-key">Crimes:</span>
                <span class="detail-value">${outlawData.crimes}</span>
            </div>
            <div class="modal-detail-row">
                <span class="detail-key">Last Known Location:</span>
                <span class="detail-value">${outlawData.lastSeen}</span>
            </div>
            <div class="modal-detail-row">
                <span class="detail-key">Danger Level:</span>
                <span class="detail-value danger-${outlawData.danger}">${outlawData.danger.toUpperCase()}</span>
            </div>
        </div>
        <div class="modal-description">
            <h4>Intelligence Report</h4>
            <p>${outlawData.description}</p>
        </div>
        <div class="modal-warning">
            <span class="warning-icon">⚠</span>
            <span class="warning-text">${outlawData.warning}</span>
        </div>
    `;
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add modal-specific styles
    addModalStyles();
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function getOutlawData(id) {
    const outlaws = {
        blackjack: {
            name: 'BLACKJACK McCOY',
            aka: 'aka "The Phantom"',
            reward: '$5,000',
            crimes: 'Train Robbery, Murder (3 counts), Assault on Federal Officers',
            lastSeen: 'Tombstone, Arizona Territory',
            danger: 'extreme',
            description: 'Former Confederate cavalry officer turned outlaw after the War Between the States. Known for meticulous planning and leaving no witnesses. Has successfully evaded capture in three states and territories. Believed to lead a gang of eight to twelve men. Expert marksman and horseman. Considered the most dangerous outlaw operating in the Arizona Territory.',
            warning: 'SHOOT ON SIGHT — Do not attempt to apprehend alone. Armed with twin Colt revolvers and a Winchester rifle.'
        },
        scarlett: {
            name: 'SCARLETT VALE',
            aka: 'aka "The Widow"',
            reward: '$3,500',
            crimes: 'Bank Fraud, Poisoning (suspected), Grand Larceny',
            lastSeen: 'Dodge City, Kansas',
            danger: 'high',
            description: 'Con artist and suspected serial poisoner. Has been married four times — each husband deceased under mysterious circumstances within months of the wedding. Inherited considerable wealth totaling over $50,000. Known to use her considerable charm and beauty to gain trust before executing her schemes. May be traveling with an accomplice.',
            warning: 'EXTREMELY DANGEROUS — Known to carry concealed weapons and arsenic-based poisons. Do not accept food or drink.'
        },
        dustdevil: {
            name: 'DUST DEVIL JONES',
            aka: 'aka "The Cyclone"',
            reward: '$2,000',
            crimes: 'Stagecoach Robbery (4 counts), Cattle Rustling, Assault',
            lastSeen: 'Deadwood, Dakota Territory',
            danger: 'high',
            description: 'Leader of a small but violent gang known as "The Cyclones." Specializes in stagecoach robberies along remote stretches of the Deadwood Trail. Known for his unpredictable temperament and tendency to fire warning shots before engaging. Has wounded three stagecoach drivers in the past year.',
            warning: 'ARMED AND DANGEROUS — Known to carry a sawed-off shotgun. Approach with extreme caution.'
        },
        coyote: {
            name: 'COYOTE PETE',
            aka: 'aka "The Howler"',
            reward: '$1,500',
            crimes: 'Cattle Rustling, Arson, Horse Theft',
            lastSeen: 'Abilene, Texas',
            danger: 'medium',
            description: 'Cattle rustler and suspected arsonist who operates along the Chisholm Trail. Known for his distinctive howl-like call used to coordinate with his gang. Has burned two ranch houses in retaliation for resistance from ranchers. Often works in conjunction with Blackjack McCoy\'s gang.',
            warning: 'ARMED — Known to carry multiple firearms. Gang may be nearby.'
        },
        ironhorse: {
            name: 'IRON HORSE HANK',
            aka: 'aka "The Locomotive"',
            reward: '$7,500',
            crimes: 'Train Robbery (7 counts), Murder, Kidnapping',
            lastSeen: 'Cheyenne, Wyoming Territory',
            danger: 'extreme',
            description: 'Former railroad worker who turned to crime after being cheated of wages during the transcontinental railroad construction. Now leads the largest outlaw gang in the territory — "The Jones Gang" — numbering between twelve and twenty men. Has successfully robbed seven Union Pacific trains, making off with an estimated $100,000 in gold and currency. Known for wearing an engineer\'s cap during heists as a trademark.',
            warning: 'MOST WANTED — Gang is heavily armed with rifles and dynamite. Do NOT engage without a full posse. Wanted DEAD or ALIVE.'
        },
        mescalero: {
            name: 'MESCALERO MIGUEL',
            aka: 'aka "El Espíritu"',
            reward: '$1,000',
            crimes: 'Horse Theft, Burglary, Resisting Arrest',
            lastSeen: 'Santa Fe, New Mexico Territory',
            danger: 'medium',
            description: 'Horse thief and burglar who operates along the border regions. Known for his ability to move silently and evade tracking dogs. Has escaped custody twice — once from the county jail in Las Cruces and once from a federal marshal\'s transport. Believed to have connections to buyers across the Mexican border.',
            warning: 'ARMED — Known knife fighter. May attempt to flee across the border.'
        }
    };
    
    return outlaws[id];
}

function addModalStyles() {
    // Check if modal styles already exist
    if (document.getElementById('modalDynamicStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'modalDynamicStyles';
    style.textContent = `
        .modal-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--parchment-aged);
        }
        
        .modal-header h3 {
            font-family: var(--font-display);
            font-size: 1.8rem;
            color: var(--ink-dark);
            letter-spacing: 3px;
            margin-bottom: 5px;
        }
        
        .modal-aka {
            font-family: var(--font-body);
            font-style: italic;
            color: var(--ink-faded);
        }
        
        .modal-reward-banner {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 15px;
            margin-bottom: 20px;
            background: linear-gradient(180deg, rgba(201, 162, 39, 0.15) 0%, rgba(139, 105, 20, 0.2) 100%);
            border: 2px solid var(--gold-dark);
        }
        
        .modal-reward-label {
            font-family: var(--font-body);
            font-size: 0.9rem;
            letter-spacing: 3px;
            color: var(--ink-faded);
        }
        
        .modal-reward-amount {
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--ink-dark);
        }
        
        .modal-details {
            margin-bottom: 20px;
        }
        
        .modal-detail-row {
            display: flex;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px dashed var(--parchment-aged);
        }
        
        .detail-key {
            font-family: var(--font-typewriter);
            font-size: 0.85rem;
            color: var(--ink-faded);
            min-width: 150px;
        }
        
        .detail-value {
            font-family: var(--font-typewriter);
            font-size: 0.85rem;
            color: var(--ink-dark);
        }
        
        .danger-extreme {
            color: var(--blood-red);
            font-weight: bold;
        }
        
        .danger-high {
            color: var(--rust-red);
            font-weight: bold;
        }
        
        .danger-medium {
            color: var(--sunset-orange);
            font-weight: bold;
        }
        
        .modal-description {
            margin-bottom: 20px;
        }
        
        .modal-description h4 {
            font-family: var(--font-display);
            font-size: 1rem;
            color: var(--ink-dark);
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .modal-description p {
            font-family: var(--font-body);
            font-size: 0.95rem;
            line-height: 1.7;
            color: var(--ink-brown);
        }
        
        .modal-warning {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: rgba(139, 37, 0, 0.1);
            border: 2px solid var(--rust-red);
            border-left: 6px solid var(--blood-red);
        }
        
        .warning-icon {
            font-size: 1.5rem;
        }
        
        .warning-text {
            font-family: var(--font-typewriter);
            font-size: 0.85rem;
            color: var(--blood-red);
            font-weight: bold;
        }
    `;
    
    document.head.appendChild(style);
}

/* === Scroll Animations === */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.wanted-poster, .reward-tier, .outlaw-profile, .dispatch-entry').forEach(el => {
        observer.observe(el);
    });
}

/* === Typewriter Effects === */
function initTypewriterEffects() {
    // Add typewriter cursor effect to dispatch entries
    const dispatchTexts = document.querySelectorAll('.entry-text');
    
    dispatchTexts.forEach(text => {
        const originalText = text.textContent;
        
        // Only apply to first visible entry
        if (text.closest('.dispatch-entry') === document.querySelector('.dispatch-entry')) {
            // Typewriter effect on scroll into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typewriterEffect(text, originalText);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(text.closest('.dispatch-entry'));
        }
    });
}

function typewriterEffect(element, text) {
    element.textContent = '';
    element.style.borderRight = '2px solid var(--ink-dark)';
    
    let i = 0;
    const speed = 20;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

/* === Utility Functions === */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Random number generator
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Lerp (linear interpolation)
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/* === Ambient Sound Effects (Visual Indicators) === */
// Add visual "sound" indicators for atmosphere
function addAmbientEffects() {
    // Occasional "creek" sound indicator
    setInterval(() => {
        if (Math.random() > 0.95) {
            showSoundIndicator('🪵 *creak*');
        }
    }, 5000);
    
    // Wind gust indicator
    setInterval(() => {
        if (Math.random() > 0.9) {
            showSoundIndicator('💨 *whoooosh*');
        }
    }, 8000);
}

function showSoundIndicator(text) {
    const indicator = document.createElement('div');
    indicator.className = 'sound-indicator';
    indicator.textContent = text;
    indicator.style.cssText = `
        position: fixed;
        top: ${random(20, 80)}%;
        left: ${random(10, 90)}%;
        font-family: var(--font-typewriter);
        font-size: 0.8rem;
        color: var(--ink-light);
        opacity: 0;
        pointer-events: none;
        z-index: 500;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(indicator);
    
    // Fade in
    setTimeout(() => {
        indicator.style.opacity = '0.5';
    }, 100);
    
    // Fade out
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
    
    // Remove
    setTimeout(() => {
        indicator.remove();
    }, 2500);
}

// Initialize ambient effects
setTimeout(addAmbientEffects, 3000);

/* === Saloon Door Page Load Animation === */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initial animation for visible elements
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        triggerSectionAnimations(activeSection);
    }
});

/* === Wagon Wheel Loading (for future use) === */
function showLoadingWheel() {
    const wheel = document.createElement('div');
    wheel.className = 'loading-wheel';
    wheel.innerHTML = `
        <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--wood-mid)" stroke-width="4"/>
            <line x1="50" y1="10" x2="50" y2="90" stroke="var(--wood-dark)" stroke-width="2"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke="var(--wood-dark)" stroke-width="2"/>
            <line x1="22" y1="22" x2="78" y2="78" stroke="var(--wood-dark)" stroke-width="2"/>
            <line x1="78" y1="22" x2="22" y2="78" stroke="var(--wood-dark)" stroke-width="2"/>
            <circle cx="50" cy="50" r="8" fill="var(--wood-mid)"/>
        </svg>
    `;
    wheel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3000;
        animation: spin 2s linear infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(wheel);
    
    return wheel;
}

/* === Console Easter Egg === */
console.log('%c🌵 DUST CREEK COUNTY BOUNTY BOARD 🌵', 
    'font-size: 20px; font-weight: bold; color: #8b6914; text-shadow: 2px 2px #4a3728;');
console.log('%c"Justice rides on swift horses"', 
    'font-style: italic; color: #5c4033;');
console.log('%c⚠ Wanted: Dead or Alive', 
    'color: #8b2500; font-weight: bold;');