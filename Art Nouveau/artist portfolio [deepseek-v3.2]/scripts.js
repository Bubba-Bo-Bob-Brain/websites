// scripts.js

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Éclat Nouveau Portfolio initialized');
    
    // Initialize all components
    initNavigation();
    initGallery();
    initModal();
    initContactForm();
    initScrollAnimations();
    initMouseEffects();
    initArtworkHoverEffects();
    initFilterButtons();
    initGalleryNavigation();
    
    // Initial animations on load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Navigation - Smooth scrolling and active state
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const whiplashNav = document.querySelector('.whiplash-nav');
    
    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Add shadow to nav on scroll
        if (window.scrollY > 50) {
            whiplashNav.style.boxShadow = '0 4px 20px rgba(42, 127, 98, 0.1)';
            whiplashNav.style.backgroundColor = 'rgba(248, 244, 233, 0.95)';
            whiplashNav.style.backdropFilter = 'blur(10px)';
        } else {
            whiplashNav.style.boxShadow = 'none';
            whiplashNav.style.backgroundColor = 'transparent';
            whiplashNav.style.backdropFilter = 'none';
        }
    });
    
    // Initial active link
    navLinks[0].classList.add('active');
}

// Gallery - Filtering and interactions
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const artworkFrames = document.querySelectorAll('.artwork-frame');
    
    // Add data attributes for filtering
    artworkFrames.forEach((frame, index) => {
        frame.dataset.index = index;
        
        // Add click event to view detail buttons
        const viewBtn = frame.querySelector('.view-detail-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openArtworkModal(frame);
            });
        }
        
        // Add click event to entire frame
        frame.addEventListener('click', function() {
            openArtworkModal(this);
        });
    });
}

// Artwork Modal
function initModal() {
    const modal = document.querySelector('.artwork-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevent click inside modal from closing
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function openArtworkModal(frame) {
    const modal = document.querySelector('.artwork-modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalYear = modal.querySelector('.modal-year');
    const modalSize = modal.querySelector('.modal-size');
    const modalMedium = modal.querySelector('.modal-medium');
    const modalStory = modal.querySelector('.modal-story');
    const modalImage = modal.querySelector('.modal-image');
    
    // Get data from artwork frame
    const title = frame.querySelector('.artwork-title').textContent;
    const description = frame.querySelector('.artwork-description').textContent;
    const year = frame.querySelector('.artwork-year').textContent;
    const size = frame.querySelector('.artwork-size').textContent;
    const imageSrc = frame.querySelector('.artwork-image').getAttribute('src');
    const category = frame.dataset.category;
    
    // Set modal content
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalYear.textContent = year;
    modalSize.textContent = size;
    modalMedium.textContent = getMediumFromCategory(category);
    modalStory.textContent = getArtworkStory(title, category);
    modalImage.setAttribute('src', imageSrc);
    modalImage.setAttribute('alt', title);
    
    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    setTimeout(() => {
        modalContent.style.animation = 'fadeInUp 0.6s ease-out';
    }, 10);
}

function closeModal() {
    const modal = document.querySelector('.artwork-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getMediumFromCategory(category) {
    const mediums = {
        'painting': 'Oil, watercolor, and gold leaf',
        'illustration': 'Ink and digital with metallic accents',
        'stained-glass': 'Digital stained glass simulation'
    };
    return mediums[category] || 'Mixed media';
}

function getArtworkStory(title, category) {
    const stories = {
        'The Enchanted Garden': 'Inspired by early morning walks through misty Bohemian forests, this piece captures the moment when sunlight first pierces the canopy, illuminating dewdrops like scattered diamonds. Each flower represents a memory from the artist\'s childhood garden.',
        'Whispers of the Forest': 'Created during a silent retreat in the Black Forest, this illustration translates the subtle sounds of nature—rustling leaves, distant birdsong, trickling streams—into visual form. The intertwined patterns symbolize the interconnectedness of all living things.',
        'Crystalline Bloom': 'A digital exploration of light and transparency, this work simulates the effect of sunlight passing through stained glass. The color transitions represent the changing seasons, from the fresh greens of spring to the deep golds of autumn.',
        'Gilded Reverie': 'An homage to Klimt\'s golden phase, this painting explores the tension between material wealth and spiritual richness. The gold leaf represents not opulence, but the inherent value of nature\'s beauty.'
    };
    
    return stories[title] || `This ${category.replace('-', ' ')} piece embodies the Art Nouveau principles of organic form, flowing lines, and harmony with nature. Each element is carefully composed to create a balanced, aesthetically pleasing whole that invites contemplation.`;
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage('Your message has been sent. Thank you for your interest!', 'success');
            contactForm.reset();
            
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
            
            // Add visual confirmation
            const btnOrnament = submitBtn.querySelector('.btn-ornament');
            btnOrnament.style.backgroundColor = 'var(--color-emerald)';
            btnOrnament.style.transform = 'scale(1.5)';
            
            setTimeout(() => {
                btnOrnament.style.backgroundColor = 'var(--color-ruby)';
                btnOrnament.style.transform = 'scale(1)';
            }, 1000);
        }, 1500);
    });
    
    // Add focus effects to form inputs
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            const path = this.parentElement.querySelector('path');
            if (path) {
                path.style.stroke = 'var(--color-gold)';
                path.style.opacity = '1';
                path.style.strokeWidth = '3';
            }
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
                const path = this.parentElement.querySelector('path');
                if (path) {
                    path.style.stroke = 'var(--color-emerald)';
                    path.style.opacity = '0.5';
                    path.style.strokeWidth = '2';
                }
            }
        });
    });
}

function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'error' ? 'var(--color-ruby)' : 'var(--color-emerald)'};
        color: var(--color-ivory);
        border-radius: var(--border-radius-organic);
        z-index: 1000;
        box-shadow: var(--shadow-medium);
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 500);
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Special animations for different elements
                if (entry.target.classList.contains('artwork-frame')) {
                    animateArtworkFrame(entry.target);
                }
                
                if (entry.target.classList.contains('section-title')) {
                    animateTitleUnderline(entry.target);
                }
                
                if (entry.target.classList.contains('bio-paragraph')) {
                    animateParagraph(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.artwork-frame, .section-title, .bio-paragraph, .info-item, .form-group'
    );
    animatedElements.forEach(el => observer.observe(el));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        // Animate stained glass overlay on scroll
        const glassPanels = document.querySelectorAll('.glass-panel');
        glassPanels.forEach((panel, index) => {
            const speed = 0.1 + (index * 0.05);
            panel.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function animateArtworkFrame(frame) {
    const delay = frame.dataset.index * 100;
    
    setTimeout(() => {
        frame.style.opacity = '0';
        frame.style.transform = 'translateY(30px)';
        frame.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        requestAnimationFrame(() => {
            frame.style.opacity = '1';
            frame.style.transform = 'translateY(0)';
        });
    }, delay);
}

function animateTitleUnderline(title) {
    const underline = title.nextElementSibling;
    if (underline && underline.classList.contains('title-underline')) {
        const path = underline.querySelector('path');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `drawUnderline 1.5s ease-out forwards`;
        }
    }
}

function animateParagraph(paragraph) {
    // Staggered fade-in for paragraphs
    const index = Array.from(paragraph.parentElement.children).indexOf(paragraph);
    const delay = index * 200;
    
    setTimeout(() => {
        paragraph.style.opacity = '0';
        paragraph.style.transform = 'translateX(-20px)';
        
        requestAnimationFrame(() => {
            paragraph.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            paragraph.style.opacity = '1';
            paragraph.style.transform = 'translateX(0)';
        });
    }, delay);
}

// Mouse Effects
function initMouseEffects() {
    const goldLeafSparkles = document.querySelectorAll('.gold-leaf-sparkle');
    
    // Track mouse position for gold leaf sparkle effect
    document.addEventListener('mousemove', function(e) {
        goldLeafSparkles.forEach(sparkle => {
            const rect = sparkle.parentElement.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            sparkle.style.setProperty('--mouse-x', `${x}%`);
            sparkle.style.setProperty('--mouse-y', `${y}%`);
        });
    });
    
    // Custom cursor effect (optional - can be enabled if desired)
    /*
    const cursor = document.createElement('div');
    cursor.className = 'art-nouveau-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
    */
}

// Artwork Hover Effects
function initArtworkHoverEffects() {
    const artworkFrames = document.querySelectorAll('.artwork-frame');
    
    artworkFrames.forEach(frame => {
        const vineFrame = frame.querySelector('.vine-frame');
        const frameBorder = vineFrame.querySelector('.frame-border');
        const tendrils = vineFrame.querySelectorAll('.frame-tendril');
        
        frame.addEventListener('mouseenter', () => {
            // Animate frame border
            frameBorder.style.stroke = 'var(--color-gold)';
            frameBorder.style.opacity = '1';
            frameBorder.style.filter = 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))';
            
            // Animate tendrils
            tendrils.forEach((tendril, index) => {
                tendril.style.stroke = 'var(--color-amber)';
                tendril.style.opacity = '0.8';
                tendril.style.animation = `pulseTendril 2s infinite ${index * 0.2}s`;
            });
            
            // Add CSS animation for tendrils
            if (!document.querySelector('#tendril-animation')) {
                const style = document.createElement('style');
                style.id = 'tendril-animation';
                style.textContent = `
                    @keyframes pulseTendril {
                        0%, 100% { stroke-width: 2; opacity: 0.8; }
                        50% { stroke-width: 3; opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        });
        
        frame.addEventListener('mouseleave', () => {
            // Reset frame border
            frameBorder.style.stroke = 'var(--color-emerald)';
            frameBorder.style.opacity = '0.7';
            frameBorder.style.filter = 'none';
            
            // Reset tendrils
            tendrils.forEach(tendril => {
                tendril.style.stroke = 'var(--color-amber)';
                tendril.style.opacity = '0.5';
                tendril.style.animation = 'none';
            });
        });
    });
}

// Filter Buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artworkFrames = document.querySelectorAll('.artwork-frame');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter artwork
            artworkFrames.forEach(frame => {
                if (filter === 'all' || frame.dataset.category === filter) {
                    frame.style.display = 'block';
                    
                    // Animate in
                    setTimeout(() => {
                        frame.style.opacity = '0';
                        frame.style.transform = 'scale(0.9)';
                        
                        requestAnimationFrame(() => {
                            frame.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                            frame.style.opacity = '1';
                            frame.style.transform = 'scale(1)';
                        });
                    }, 10);
                } else {
                    // Animate out
                    frame.style.opacity = '0';
                    frame.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        frame.style.display = 'none';
                    }, 500);
                }
            });
            
            // Animate filter button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Gallery Navigation
function initGalleryNavigation() {
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dots = document.querySelectorAll('.dot');
    const artworkFrames = document.querySelectorAll('.artwork-frame');
    let currentIndex = 0;
    
    // Update dots based on visible artworks
    function updateDots() {
        const visibleFrames = Array.from(artworkFrames).filter(frame => 
            frame.style.display !== 'none'
        );
        
        dots.forEach((dot, index) => {
            if (index < visibleFrames.length) {
                dot.style.display = 'block';
                if (index === currentIndex % visibleFrames.length) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            } else {
                dot.style.display = 'none';
            }
        });
    }
    
    // Navigate to specific artwork
    function goToArtwork(index) {
        const visibleFrames = Array.from(artworkFrames).filter(frame => 
            frame.style.display !== 'none'
        );
        
        if (visibleFrames.length === 0) return;
        
        currentIndex = (index + visibleFrames.length) % visibleFrames.length;
        
        // Scroll to artwork
        visibleFrames[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        updateDots();
    }
    
    // Event listeners
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            goToArtwork(currentIndex - 1);
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            goToArtwork(currentIndex + 1);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToArtwork(index);
        });
    });
    
    // Initialize dots
    updateDots();
    
    // Auto-rotate gallery (optional)
    /*
    setInterval(() => {
        if (document.querySelector('.gallery-section').getBoundingClientRect().top < window.innerHeight) {
            goToArtwork(currentIndex + 1);
        }
    }, 5000);
    */
}

// Additional CSS animations for JS
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes drawUnderline {
            to {
                stroke-dashoffset: 0;
            }
        }
        
        .art-nouveau-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--color-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        }
        
        .form-group.focused .input-line path,
        .form-group.focused .textarea-border path {
            stroke: var(--color-gold) !important;
            opacity: 1 !important;
            stroke-width: 3 !important;
        }
        
        .in-view {
            animation-play-state: running;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
injectDynamicStyles();

// Window load event for final touches
window.addEventListener('load', function() {
    // Animate hero elements on load
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroOrnament = document.querySelector('.hero-ornament');
    
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInUp 1s ease-out 0.2s both';
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.5s both';
    }
    
    if (heroOrnament) {
        heroOrnament.style.animation = 'fadeInUp 1s ease-out 0.8s both';
    }
    
    // Initialize scroll position for animations
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});