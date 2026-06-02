// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles for champagne bubbles
    initParticles();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Add navigation highlighting
    initNavigation();
    
    // Add article hover effects
    initArticleEffects();
    
    // Add vintage poster interactions
    initPosterEffects();
});

// Initialize champagne bubble particles
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'champagne-bubbles';
    document.body.appendChild(particlesContainer);
    
    // Create 30 bubbles
    for (let i = 0; i < 30; i++) {
        createBubble(particlesContainer);
    }
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Random size and position
    const size = Math.random() * 20 + 5;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.animationDuration = `${duration}s`;
    
    container.appendChild(bubble);
    
    // Remove bubble after animation completes and create a new one
    setTimeout(() => {
        bubble.remove();
        createBubble(container);
    }, duration * 1000);
}

// Scroll animations for sections
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe feature articles and columns
    document.querySelectorAll('.feature-article, .editorial-column, .vintage-poster').forEach(el => {
        observer.observe(el);
    });
}

// Navigation highlighting based on scroll position
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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

// Article hover effects
function initArticleEffects() {
    const articles = document.querySelectorAll('.feature-article');
    
    articles.forEach(article => {
        article.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        article.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Vintage poster interactions
function initPosterEffects() {
    const posters = document.querySelectorAll('.vintage-poster');
    
    posters.forEach(poster => {
        poster.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        poster.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Add animate-in class for entrance animations
document.addEventListener('DOMContentLoaded', function() {
    // Staggered animation for feature articles
    const articles = document.querySelectorAll('.feature-article');
    articles.forEach((article, index) => {
        article.style.transitionDelay = `${index * 0.2}s`;
        article.classList.add('animate-in');
    });
    
    // Staggered animation for editorial columns
    const columns = document.querySelectorAll('.editorial-column');
    columns.forEach((column, index) => {
        column.style.transitionDelay = `${index * 0.3}s`;
        column.classList.add('animate-in');
    });
    
    // Add animation to vintage posters
    const posters = document.querySelectorAll('.vintage-poster');
    posters.forEach((poster, index) => {
        poster.style.transitionDelay = `${index * 0.4}s`;
        poster.classList.add('animate-in');
    });
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Add a special effect when clicking the CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Temporary visual feedback
        this.textContent = 'Coming Right Up!';
        setTimeout(() => {
            this.textContent = 'Read Feature';
        }, 1000);
    });
}