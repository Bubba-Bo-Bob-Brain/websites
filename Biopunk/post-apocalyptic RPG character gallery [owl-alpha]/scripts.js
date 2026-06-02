document.addEventListener('DOMContentLoaded', () => {
    initializeScanlines();
    initializeFilterSystem();
    initializeCardAnimations();
    initializePortraitEffects();
    initializeDNAStrand();
    initializeTypingEffects();
    initializeGlitchEffects();
});

function initializeScanlines() {
    const scanlineIntensity = 0.02;
    const scanlines = document.getElementById('scanlines');
    
    if (scanlines) {
        scanlines.style.opacity = scanlineIntensity;
    }
    
    let flickerInterval = setInterval(() => {
        if (Math.random() > 0.98) {
            document.body.style.opacity = '0.97';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(flickerInterval);
    }, 30000);
}

function initializeFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.char-card');
    const charCountDisplay = document.getElementById('char-count');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            characterCards.forEach((card, index) => {
                const cardClass = card.getAttribute('data-class');
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardClass === filterValue) {
                        card.classList.remove('filtered-out');
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = `cardFadeIn 0.5s ease forwards`;
                    } else {
                        card.classList.add('filtered-out');
                    }
                }, index * 50);
            });
            
            updateCharacterCount(filterValue);
        });
    });
    
    function updateCharacterCount(filter) {
        const visibleCards = document.querySelectorAll(`.char-card[data-class="${filter}"], .char-card${filter === 'all' ? ':not(.filtered-out)' : ''}`);
        const count = filter === 'all' ? characterCards.length : visibleCards.length;
        charCountDisplay.textContent = String(count).padStart(3, '0');
    }
}

function initializeCardAnimations() {
    const cards = document.querySelectorAll('.char-card');
    
    cards.forEach((card, index) => {
        card.setAttribute('--char-index', index);
        
        card.addEventListener('mouseenter', () => {
            animateMutationBar(card);
            animateStatBars(card);
        });
        
        card.addEventListener('mousemove', (e) => {
            applyTiltEffect(card, e);
        });
        
        card.addEventListener('mouseleave', () => {
            resetTilt(card);
        });
    });
}

function animateMutationBar(card) {
    const mutationFill = card.querySelector('.mutation-fill');
    if (mutationFill) {
        const targetWidth = mutationFill.style.width;
        mutationFill.style.width = '0%';
        
        setTimeout(() => {
            mutationFill.style.width = targetWidth;
        }, 100);
    }
}

function animateStatBars(card) {
    const statFills = card.querySelectorAll('.stat-fill');
    statFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 150 + (index * 100));
    });
}

function applyTiltEffect(card, event) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -5;
    const rotateY = (mouseX / (rect.width / 2)) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
}

function resetTilt(card) {
    card.style.transform = '';
}

function initializePortraitEffects() {
    const portraits = document.querySelectorAll('.portrait-placeholder');
    
    portraits.forEach(portrait => {
        portrait.addEventListener('mouseenter', () => {
            const scan = portrait.querySelector('.portrait-scan');
            if (scan) {
                scan.style.animationPlayState = 'running';
            }
        });
        
        portrait.addEventListener('mouseleave', () => {
            const scan = portrait.querySelector('.portrait-scan');
            if (scan) {
                scan.style.animationPlayState = 'paused';
            }
        });
    });
}

function initializeDNAStrand() {
    const dnaDividers = document.querySelectorAll('.dna-divider svg, .footer-dna svg');
    
    dnaDividers.forEach(svg => {
        const nodes = svg.querySelectorAll('.dna-node');
        nodes.forEach((node, index) => {
            node.style.animationDelay = `${index * 0.3}s`;
        });
    });
}

function initializeTypingEffects() {
    const descriptions = document.querySelectorAll('.char-desc');
    
    descriptions.forEach(desc => {
        const originalText = desc.textContent;
        desc.textContent = '';
        desc.style.opacity = '1';
        
        let charIndex = 0;
        let isTyping = false;
        
        desc.parentElement.parentElement.addEventListener('mouseenter', () => {
            if (!isTyping && charIndex === 0) {
                isTyping = true;
                typeText();
            }
        });
        
        function typeText() {
            if (charIndex < originalText.length) {
                desc.textContent += originalText[charIndex];
                charIndex++;
                setTimeout(typeText, 15);
            } else {
                isTyping = false;
            }
        }
        
        desc.parentElement.parentElement.addEventListener('mouseleave', () => {
            setTimeout(() => {
                charIndex = 0;
                desc.textContent = '';
                isTyping = false;
            }, 2000);
        });
    });
}

function initializeGlitchEffects() {
    const characterNames = document.querySelectorAll('.char-name');
    
    characterNames.forEach(name => {
        name.addEventListener('mouseenter', () => {
            applyGlitch(name);
        });
    });
    
    function applyGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        let glitchIterations = 0;
        
        const glitchInterval = setInterval(() => {
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.7) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
            glitchIterations++;
            
            if (glitchIterations > 10) {
                clearInterval(glitchInterval);
                element.textContent = originalText;
            }
        }, 50);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes cardFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.char-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

function createParticleEffect(event) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-amber);
        pointer-events: none;
        z-index: 9999;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        border-radius: 50%;
        opacity: 1;
        transition: all 0.5s ease;
    `;
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
        particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
        particle.style.opacity = '0';
    });
    
    setTimeout(() => {
        particle.remove();
    }, 500);
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.char-card') || e.target.closest('.filter-btn')) {
        createParticleEffect(e);
    }
});

const headerStats = document.querySelectorAll('.stat-value');
let lastUpdate = Date.now();

function updateStats() {
    const now = Date.now();
    if (now - lastUpdate > 5000) {
        headerStats.forEach(stat => {
            if (stat.textContent.includes('SEVERE')) {
                const levels = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'CRITICAL'];
                const randomLevel = levels[Math.floor(Math.random() * levels.length)];
                stat.textContent = randomLevel;
            }
        });
        lastUpdate = now;
    }
}

setInterval(updateStats, 10000);