/**
 * Art Nouveau Portfolio - Interactive Scripts
 * Bringing the gilded dreams to life
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initParticles();
    initNavigation();
    initScrollEffects();
    initGallery();
    initLightbox();
    initContactForm();
    initBackToTop();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            
            // Start animations after preloader hides
            setTimeout(function() {
                document.body.classList.add('loaded');
                initScrollReveal();
            }, 600);
        }, 1500);
    });
}

/**
 * Floating Particles
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 20 + 10;
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Gold gradient colors
    const colors = ['#D4A853', '#F0D78C', '#B8860B', '#F5E6D3'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
    `;
    
    container.appendChild(particle);
}

/**
 * Navigation
 */
function initNavigation() {
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate menu lines
            const lines = menuToggle.querySelectorAll('.menu-line');
            if (nav.classList.contains('active')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                
                const lines = menuToggle.querySelectorAll('.menu-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    // Add scroll reveal to various elements
    const revealElements = document.querySelectorAll('.section-header, .gallery-item, .exhibition-card, .about-container, .contact-content');
    
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Process steps animation
    const processSteps = document.querySelectorAll('.process-step');
    
    const animateProcessSteps = function() {
        processSteps.forEach((step, index) => {
            const stepTop = step.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (stepTop < windowHeight - 150) {
                setTimeout(() => {
                    step.classList.add('visible');
                }, index * 200);
            }
        });
    };
    
    // Initial check
    animateProcessSteps();
    
    // Check on scroll
    window.addEventListener('scroll', animateProcessSteps);
}

/**
 * Gallery
 */
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add hover effects to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Lightbox
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!lightbox || !galleryItems.length) return;
    
    // Open lightbox when clicking on gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't open if clicking on buttons/links
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            const title = this.querySelector('.artwork-title');
            const meta = this.querySelector('.artwork-meta');
            
            if (title) {
                lightbox.querySelector('.lightbox-title').textContent = title.textContent;
            }
            
            if (meta) {
                lightbox.querySelector('.lightbox-meta').textContent = meta.textContent;
            }
            
            // Set placeholder icon based on artwork
            const icon = this.querySelector('.artwork-icon');
            if (icon) {
                lightbox.querySelector('.lightbox-icon').textContent = icon.textContent;
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
    
    // Add focus effects to form inputs
    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Add filled class if has value
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Add to form
    const form = document.getElementById('contactForm');
    form.appendChild(messageElement);
    
    // Style based on type
    if (type === 'error') {
        messageElement.style.cssText = `
            color: #C4887A;
            background: rgba(122, 59, 78, 0.1);
            border: 1px solid rgba(122, 59, 78, 0.3);
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
            text-align: center;
        `;
    } else {
        messageElement.style.cssText = `
            color: #2D6B4F;
            background: rgba(45, 107, 79, 0.1);
            border: 1px solid rgba(45, 107, 79, 0.3);
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
            text-align: center;
        `;
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        messageElement.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Utility Functions
 */
// Debounce function for scroll events
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS transitions for gallery filtering
const style = document.createElement('style');
style.textContent = `
    .gallery-item {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .form-group.focused .form-label {
        color: #F0D78C;
        transform: translateY(-2px);
    }
    
    .form-group.filled .form-label {
        color: #D4A853;
    }
    
    .form-message {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Add parallax effect to hero section
const heroSection = document.getElementById('hero');
if (heroSection) {
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const heroContent = heroSection.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }, 16));
}

// Add hover effect to exhibition cards
const exhibitionCards = document.querySelectorAll('.exhibition-card');
exhibitionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add animation to vine decorations on scroll
const vineDecorations = document.querySelectorAll('.vine-decoration');
if (vineDecorations.length > 0) {
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        
        vineDecorations.forEach(vine => {
            const rect = vine.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollProgress = 1 - (rect.top / window.innerHeight);
                vine.style.transform = `translateY(${scrollProgress * 20}px)`;
            }
        });
    }, 16));
}

// Initialize signature animation on scroll
const signaturePath = document.querySelector('.signature-path');
if (signaturePath) {
    const pathLength = signaturePath.getTotalLength();
    
    // Set up initial state
    signaturePath.style.strokeDasharray = pathLength;
    signaturePath.style.strokeDashoffset = pathLength;
    
    window.addEventListener('scroll', function() {
        const signatureSection = document.querySelector('.about-signature');
        if (!signatureSection) return;
        
        const rect = signatureSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 100) {
            // Calculate scroll progress
            const scrollProgress = 1 - ((rect.top - windowHeight + 200) / 200);
            const drawLength = pathLength * Math.min(1, Math.max(0, scrollProgress));
            
            signaturePath.style.strokeDashoffset = pathLength - drawLength;
        }
    });
}

console.log('Art Nouveau Portfolio initialized successfully');