/* ============================================
   BIOCRAWL CHARACTER DATABASE - SCRIPTS
   Interactive Biopunk Gallery
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initWarningModal();
    initFactionFilters();
    initCardHoverEffects();
    initScanlineEffect();
    initDNAAnimations();
    initStatAnimations();
    initGlitchText();
    initMutationRings();
});

/* ============================================
   WARNING MODAL
   ============================================ */

function initWarningModal() {
    const modal = document.getElementById('warningModal');
    const closeBtn = document.getElementById('modalClose');
    
    // Show modal after 3 seconds
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 3000);
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   FACTION FILTERS
   ============================================ */

function initFactionFilters() {
    const filterButtons = document.querySelectorAll('.faction-btn');
    const characterCards = document.querySelectorAll('.character-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const faction = button.getAttribute('data-faction');
            
            // Filter cards with animation
            characterCards.forEach(card => {
                const cardFaction = card.getAttribute('data-faction');
                
                if (faction === 'all' || cardFaction === faction) {
                    // Show card
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update specimen count
            updateSpecimenCount(faction);
        });
    });
}

function updateSpecimenCount(faction) {
    const visibleCards = document.querySelectorAll('.character-card[style*="display: block"], .character-card:not([style*="display"])');
    const count = faction === 'all' 
        ? visibleCards.length 
        : document.querySelectorAll(`.character-card[data-faction="${faction}"]`).length;
    
    // Update the stat box
    const statValues = document.querySelectorAll('.stat-value');
    statValues[0].textContent = count;
}

/* ============================================
   CARD HOVER EFFECTS
   ============================================ */

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glitch effect on hover
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
            
            // Animate skill bars on hover
            const skillBars = this.querySelectorAll('.skill-fill');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset animations
            const skillBars = this.querySelectorAll('.skill-fill');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('style').match(/--skill:\s*(\d+)/);
                if (width) {
                    bar.style.width = `${width[1]}%`;
                }
            });
        });
    });
}

/* ============================================
   SCANLINE EFFECT ENHANCEMENT
   ============================================ */

function initScanlineEffect() {
    const crtOverlay = document.querySelector('.crt-overlay');
    
    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            crtOverlay.style.background = `
                repeating-linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 0.25),
                    rgba(0, 0, 0, 0.25) 1px,
                    transparent 1px,
                    transparent 2px
                )
            `;
            
            setTimeout(() => {
                crtOverlay.style.background = '';
            }, 50);
        }
    }, 100);
    
    // Flicker effect
    setInterval(() => {
        if (Math.random() > 0.98) {
            document.body.style.opacity = '0.97';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 500);
}

/* ============================================
   DNA ANIMATIONS
   ============================================ */

function initDNAAnimations() {
    const dnaElements = document.querySelectorAll('.dna-sequence');
    
    dnaElements.forEach(dna => {
        const bases = dna.querySelectorAll('span');
        let index = 0;
        
        // Animate bases
        setInterval(() => {
            bases.forEach((base, i) => {
                if (i === index) {
                    base.style.transform = 'scale(1.3)';
                    base.style.color = 'var(--bio-yellow)';
                } else {
                    base.style.transform = '';
                    base.style.color = '';
                }
            });
            
            index = (index + 1) % bases.length;
        }, 200);
    });
}

/* ============================================
   STAT ANIMATIONS
   ============================================ */

function initStatAnimations() {
    // Animate mutation bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const mutationFill = entry.target.querySelector('.mutation-fill');
                const contamFill = entry.target.querySelector('.contam-fill');
                const skillFills = entry.target.querySelectorAll('.skill-fill');
                
                if (mutationFill) {
                    const level = mutationFill.style.getPropertyValue('--level');
                    mutationFill.style.width = '0';
                    setTimeout(() => {
                        mutationFill.style.width = `${level}%`;
                    }, 100);
                }
                
                if (contamFill) {
                    const level = contamFill.style.getPropertyValue('--level');
                    contamFill.style.width = '0';
                    setTimeout(() => {
                        contamFill.style.width = `${level}%`;
                    }, 200);
                }
                
                if (skillFills.length > 0) {
                    skillFills.forEach((fill, index) => {
                        const skill = fill.style.getPropertyValue('--skill');
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = `${skill}%`;
                        }, 300 + (index * 100));
                    });
                }
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });
}

/* ============================================
   GLITCH TEXT EFFECT
   ============================================ */

function initGlitchText() {
    const glitchElement = document.querySelector('.title-glitch');
    
    if (glitchElement) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                glitchElement.style.textShadow = `
                    2px 0 var(--bio-red),
                    -2px 0 var(--bio-blue),
                    0 0 10px var(--bio-green)
                `;
                
                setTimeout(() => {
                    glitchElement.style.textShadow = '';
                }, 100);
            }
        }, 500);
    }
}

/* ============================================
   MUTATION RING ANIMATIONS
   ============================================ */

function initMutationRings() {
    const mutationRings = document.querySelectorAll('.mutation-ring');
    
    mutationRings.forEach(ring => {
        const percent = ring.querySelector('.mutation-percent');
        const fill = ring.querySelector('.ring-fill');
        
        if (percent && fill) {
            // Animate percentage counter
            const target = parseInt(percent.textContent) || 0;
            let current = 0;
            const increment = target / 50;
            
            const animateCounter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(animateCounter);
                }
                
                percent.textContent = Math.floor(current) + '%';
            }, 30);
            
            // Pulse effect for critical rings
            if (ring.classList.contains('critical')) {
                setInterval(() => {
                    ring.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        ring.style.transform = '';
                    }, 200);
                }, 2000);
            }
        }
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

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

// Add random glitch effect to elements
function addRandomGlitch(element) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            element.style.filter = 'hue-rotate(10deg)';
            
            setTimeout(() => {
                element.style.transform = '';
                element.style.filter = '';
            }, 50);
        }
    }, 1000);
}

// Initialize random glitches on cards
document.querySelectorAll('.character-card').forEach(card => {
    addRandomGlitch(card);
});

/* ============================================
   KEYBOARD NAVIGATION ENHANCEMENTS
   ============================================ */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

// Throttle scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Add parallax effects here if needed
            ticking = false;
        });
        ticking = true;
    }
});

// Lazy load images when portraits are added
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ============================================
   CONSOLE WELCOME MESSAGE
   ============================================ */

console.log(`
╔══════════════════════════════════════════════════╗
║             BIOCRAWL DATABASE v2.7.1             ║
║                                                  ║
║  Welcome to the Post-Collapse Character Archive  ║
║                                                  ║
║  Clearance Level: OMEGA                          ║
║  Bioweapon Containment: ACTIVE                   ║
║                                                  ║
║  "In the ruins of the old world, new life crawls"║
╚══════════════════════════════════════════════════╝
`);

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);