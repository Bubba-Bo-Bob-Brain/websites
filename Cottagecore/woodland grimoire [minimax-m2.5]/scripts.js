/**
 * ========================================
 * THE WHISTLING KETTLE - HERBALIST'S GRIMOIRE
 * Interactive JavaScript
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoader();
    initThemeToggle();
    initPotionFiltering();
    initSeasonalWheel();
    initParticles();
    initRemedyForm();
    initSmoothScroll();
    initScrollAnimations();
    initMothAnimation();
});

/**
 * ========================================
 * LOADER - Bubbling Cauldron
 * ========================================
 */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 2000); // Show loader for 2 seconds minimum
    });
}

/**
 * ========================================
 * THEME TOGGLE - Day/Night Mode
 * ========================================
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to day
    const savedTheme = localStorage.getItem('theme') || 'day';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update particles for night mode
        updateParticlesForTheme(newTheme);
    });
}

/**
 * ========================================
 * PARTICLES - Floating Botanical Elements
 * ========================================
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const theme = document.documentElement.getAttribute('data-theme') || 'day';
    const particleCount = 15;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, theme);
    }
    
    // Continuously add new particles
    setInterval(function() {
        if (particlesContainer.children.length < 25) {
            createParticle(particlesContainer, theme);
        }
    }, 2000);
}

function createParticle(container, theme) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    
    // Particle shapes (petals, leaves, stars)
    const shapes = ['50%', '30% 70% 70% 30% / 30% 30% 70% 70%', '50% 0% 50% 100% / 25% 75% 25% 75%'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Colors based on theme
    const colors = theme === 'night' 
        ? ['#C9A86C', '#D4A574', '#8B7355', '#FFD700']
        : ['#D4A574', '#9BB5A2', '#C9A86C', '#7B9E87'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        border-radius: ${shape};
        background: ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(function() {
        particle.remove();
    }, (duration + delay) * 1000);
}

function updateParticlesForTheme(theme) {
    const particles = document.querySelectorAll('.particle');
    const colors = theme === 'night' 
        ? ['#C9A86C', '#D4A574', '#8B7355', '#FFD700']
        : ['#D4A574', '#9BB5A2', '#C9A86C', '#7B9E87'];
    
    particles.forEach(particle => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
    });
}

/**
 * ========================================
 * POTION FILTERING
 * ========================================
 */
function initPotionFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const potionCards = document.querySelectorAll('.potion-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter potions
            potionCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * ========================================
 * SEASONAL WHEEL
 * ========================================
 */
function initSeasonalWheel() {
    const seasonSegments = document.querySelectorAll('.season-segment');
    const seasonDetails = document.querySelectorAll('.season-details');
    const currentSeasonEl = document.getElementById('currentSeason');
    
    // Determine current season
    const month = new Date().getMonth();
    let currentSeason;
    if (month >= 2 && month <= 4) currentSeason = 'spring';
    else if (month >= 5 && month <= 7) currentSeason = 'summer';
    else if (month >= 8 && month <= 10) currentSeason = 'autumn';
    else currentSeason = 'winter';
    
    // Set initial season
    setSeason(currentSeason);
    
    // Click handlers for wheel segments
    seasonSegments.forEach(segment => {
        segment.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            setSeason(season);
        });
    });
    
    function setSeason(season) {
        // Update wheel segments
        seasonSegments.forEach(seg => {
            seg.classList.remove('active');
            if (seg.getAttribute('data-season') === season) {
                seg.classList.add('active');
            }
        });
        
        // Update current season text
        const seasonNames = {
            'spring': 'Spring',
            'summer': 'Summer',
            'autumn': 'Autumn',
            'winter': 'Winter'
        };
        currentSeasonEl.textContent = seasonNames[season];
        
        // Update seasonal content
        seasonDetails.forEach(detail => {
            detail.classList.remove('active');
            if (detail.getAttribute('data-season') === season) {
                detail.classList.add('active');
            }
        });
    }
}

/**
 * ========================================
 * REMEDY FORM
 * ========================================
 */
function initRemedyForm() {
    const form = document.getElementById('remedyForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('remedyTitle').value;
        const ingredients = document.getElementById('remedyIngredients').value;
        const instructions = document.getElementById('remedyInstructions').value;
        
        if (!title || !instructions) {
            alert('Please fill in the remedy name and instructions.');
            return;
        }
        
        // Create new remedy entry
        const remediesContainer = document.querySelector('.remedies-container');
        
        const newRemedy = document.createElement('div');
        newRemedy.className = 'remedy-scroll';
        newRemedy.innerHTML = `
            <div class="scroll-handle top"></div>
            <div class="scroll-paper">
                <article class="remedy-entry">
                    <span class="remedy-date">${getMoonPhase()} Moon</span>
                    <h3 class="remedy-title">${escapeHtml(title)}</h3>
                    <p class="remedy-text">
                        ${ingredients ? '<strong>Ingredients:</strong> ' + escapeHtml(ingredients) + '<br><br>' : ''}
                        ${escapeHtml(instructions)}
                    </p>
                    <span class="remedy-signature">— Your handwritten entry</span>
                </article>
            </div>
            <div class="scroll-handle bottom"></div>
        `;
        
        // Add with animation
        newRemedy.style.opacity = '0';
        newRemedy.style.transform = 'translateY(30px)';
        remediesContainer.appendChild(newRemedy);
        
        setTimeout(() => {
            newRemedy.style.transition = 'all 0.5s ease';
            newRemedy.style.opacity = '1';
            newRemedy.style.transform = 'translateY(0)';
        }, 50);
        
        // Clear form
        form.reset();
        
        // Show success message
        showNotification('Your remedy has been inscribed into the grimoire! ✦');
    });
    
    function getMoonPhase() {
        const phases = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                        'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
        const today = new Date();
        const moonCycle = 29.53;
        const knownNewMoon = new Date('2024-01-11');
        const daysSinceNew = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
        const currentPhase = Math.floor((daysSinceNew % moonCycle) / moonCycle * 8) % 8;
        return phases[currentPhase];
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #6B8E7B 0%, #5A7A64 100%);
            color: #FDF8EF;
            padding: 15px 30px;
            border-radius: 30px;
            font-family: 'Caveat', cursive;
            font-size: 1.2rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideUp 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(30px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(30px); }
    }
`;
document.head.appendChild(style);

/**
 * ========================================
 * SMOOTH SCROLL
 * ========================================
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = 80;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ========================================
 * SCROLL ANIMATIONS
 * ========================================
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
    
    // Observe cards
    document.querySelectorAll('.potion-card, .flower-card, .foraging-item').forEach((card, index) => {
        card.classList.add('fade-in-card');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add CSS for scroll animations
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s ease;
        }
        .fade-in-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .fade-in-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.5s ease;
        }
        .fade-in-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animStyle);
    
    // Trigger initial check
    setTimeout(() => {
        document.querySelectorAll('.fade-in-section, .fade-in-card').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}

/**
 * ========================================
 * MOTH ANIMATION
 * ========================================
 */
function initMothAnimation() {
    const moth = document.querySelector('.moth');
    
    if (moth) {
        // Add subtle random movement
        function animateMoth() {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            const randomRotate = (Math.random() - 0.5) * 15;
            
            moth.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
            
            setTimeout(animateMoth, 2000 + Math.random() * 2000);
        }
        
        // Start animation after a delay
        setTimeout(animateMoth, 3000);
    }
}

/**
 * ========================================
 * PARALLAX EFFECT FOR HERO
 * ========================================
 */
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrollY = window.pageYOffset;
    
    if (hero && scrollY < 500) {
        hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
});

/**
 * ========================================
 * PRESSED FLOWER HOVER EFFECT
 * ========================================
 */
document.querySelectorAll('.pressed-flower').forEach(flower => {
    flower.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    flower.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
    });
});

/**
 * ========================================
 * POTION BOTTLE INTERACTION
 * ========================================
 */
document.querySelectorAll('.potion-bottle').forEach(bottle => {
    bottle.addEventListener('mouseenter', function() {
        const liquid = this.querySelector('.liquid');
        if (liquid) {
            liquid.style.animation = 'liquid-glow 1s ease infinite';
        }
    });
    
    bottle.addEventListener('mouseleave', function() {
        const liquid = this.querySelector('.liquid');
        if (liquid) {
            liquid.style.animation = '';
        }
    });
});

// Add liquid glow animation
const liquidStyle = document.createElement('style');
liquidStyle.textContent = `
    @keyframes liquid-glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
    }
`;
document.head.appendChild(liquidStyle);

/**
 * ========================================
 * KEYBOARD ACCESSIBILITY
 * ========================================
 */
document.addEventListener('keydown', function(e) {
    // Escape to close any open modals or reset
    if (e.key === 'Escape') {
        // Could add modal closing logic here
    }
    
    // Arrow keys for seasonal wheel navigation
    if (document.activeElement.classList.contains('season-segment')) {
        const segments = Array.from(document.querySelectorAll('.season-segment'));
        const currentIndex = segments.indexOf(document.activeElement);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % segments.length;
            segments[nextIndex].focus();
            segments[nextIndex].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prevIndex = (currentIndex - 1 + segments.length) % segments.length;
            segments[prevIndex].focus();
            segments[prevIndex].click();
        }
    }
});

/**
 * ========================================
 * PERSIST USER PREFERENCES
 * ========================================
 */
// Save scroll position
window.addEventListener('beforeunload', function() {
    localStorage.setItem('scrollPosition', window.pageYOffset);
});

// Restore scroll position
window.addEventListener('load', function() {
    const savedScroll = localStorage.getItem('scrollPosition');
    if (savedScroll && savedScroll > 0) {
        // Only restore if not coming from same page
        if (!document.referrer || document.referrer.includes(window.location.hostname)) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScroll));
            }, 100);
        }
    }
});

console.log('✨ The Whistling Kettle Grimoire is now open... ✨');