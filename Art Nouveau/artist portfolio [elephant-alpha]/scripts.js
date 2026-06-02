// scripts.js

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initNavigation();
    initGalleryFilters();
    initGoldHoverEffects();
    initScrollAnimations();
    initContactForm();
    initVineAnimations();
});

// Navigation smooth scrolling and active state
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Gallery filtering functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create filter buttons if they don't exist
    if (filterButtons.length === 0) {
        createFilterButtons();
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Create filter buttons dynamically
function createFilterButtons() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.cssText = `
        text-align: center;
        margin-bottom: 3rem;
    `;
    
    const buttons = [
        { value: 'all', label: 'All Works' },
        { value: 'portrait', label: 'Portraits' },
        { value: 'landscape', label: 'Landscapes' },
        { value: 'abstract', label: 'Abstract' }
    ];
    
    buttons.forEach((btn, index) => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-filter', btn.value);
        button.textContent = btn.label;
        button.style.cssText = `
            background: transparent;
            border: 2px solid var(--color-mucha-gold);
            color: var(--color-mucha-gold);
            padding: 0.8rem 1.5rem;
            margin: 0 0.5rem;
            border-radius: 30px;
            cursor: pointer;
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.9rem;
            transition: var(--transition-hover);
            position: relative;
            overflow: hidden;
        `;
        
        button.addEventListener('mouseenter', function() {
            this.style.background = 'var(--color-mucha-gold)';
            this.style.color = 'var(--color-cream)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'transparent';
                this.style.color = 'var(--color-mucha-gold)';
            }
        });
        
        if (index === 0) {
            button.classList.add('active');
            button.style.background = 'var(--color-mucha-gold)';
            button.style.color = 'var(--color-cream)';
        }
        
        filterContainer.appendChild(button);
    });
    
    gallery.insertBefore(filterContainer, gallery.firstChild);
}

// Gold leaf hover effects enhancement
function initGoldHoverEffects() {
    const goldElements = document.querySelectorAll('.item-frame, .stained-glass-pane, .contact-details');
    
    goldElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Scroll animations for parallax effects
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe gallery items and sections
    const elementsToObserve = document.querySelectorAll('.gallery-item, .stained-glass-pane');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Contact form handling
function initContactForm() {
    const contactDetails = document.querySelectorAll('.contact-details');
    
    contactDetails.forEach(detail => {
        detail.addEventListener('click', function() {
            // Add a subtle animation when clicking contact info
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Visual feedback for gold effect
            const originalBorder = this.style.border;
            this.style.border = '2px solid var(--color-mucha-gold)';
            setTimeout(() => {
                this.style.border = originalBorder;
            }, 300);
        });
    });
}

// Vine animation system
function initVineAnimations() {
    const vines = document.querySelectorAll('.vine-leaf');
    
    vines.forEach((vine, index) => {
        // Randomize animation timing for organic feel
        const duration = 3 + (index * 0.5);
        const delay = index * 0.2;
        
        vine.style.animation = `vineSway ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    // Add vine sway animation to stylesheet
    if (!document.querySelector('#vine-animation')) {
        const style = document.createElement('style');
        style.id = 'vine-animation';
        style.textContent = `
            @keyframes vineSway {
                0%, 100% { 
                    transform: rotate(45deg) translateY(0px);
                }
                25% { 
                    transform: rotate(42deg) translateY(-5px);
                }
                50% { 
                    transform: rotate(48deg) translateY(0px);
                }
                75% { 
                    transform: rotate(42deg) translateY(-3px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add interactive background effect
function initInteractiveBackground() {
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Subtle parallax effect on decorative elements
        const heroDecoration = document.querySelector('.hero-decoration');
        if (heroDecoration) {
            heroDecoration.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
        }
    });
    
    hero.addEventListener('mouseleave', function() {
        const heroDecoration = document.querySelector('.hero-decoration');
        if (heroDecoration) {
            heroDecoration.style.transform = 'translate(0, 0)';
        }
    });
}

// Initialize background effects
initInteractiveBackground();

// Add some dynamic decorative elements
function createDynamicDecorations() {
    const body = document.querySelector('body');
    
    // Create floating particles effect
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--color-mucha-gold);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.3;
            z-index: -1;
            animation: floatParticle ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
        `;
        
        // Add particle animation to stylesheet
        if (!document.querySelector('#particle-animation')) {
            const style = document.createElement('style');
            style.id = 'particle-animation';
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.5);
                        opacity: 0.1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        body.appendChild(particle);
    }
}

// Initialize decorations after a short delay
setTimeout(createDynamicDecorations, 1000);

// Typing effect for hero title enhancement (optional enhancement)
function enhanceHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.style.cssText = `
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid var(--color-mucha-gold);
            animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
        `;
        
        // Add typing animation styles
        if (!document.querySelector('#typing-animation')) {
            const style = document.createElement('style');
            style.id = 'typing-animation';
            style.textContent = `
                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }
                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: var(--color-mucha-gold); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Reset after typing animation
        setTimeout(() => {
            heroTitle.style.borderRight = 'none';
        }, 2000);
    }
}

// Initialize enhanced title after page load
setTimeout(enhanceHeroTitle, 1000);