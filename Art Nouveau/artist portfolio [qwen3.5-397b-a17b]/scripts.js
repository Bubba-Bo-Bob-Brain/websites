/**
 * Art Nouveau Portfolio - Interactive Logic
 * Handles navigation, gallery filtering, scroll effects, and dynamic styling.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Smooth Scrolling for Navigation ---
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- 2. Gallery Filtering System ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter items with animation
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;

                if (shouldShow) {
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    item.offsetHeight; 
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.9)';
                    // Wait for transition to finish before hiding
                    setTimeout(() => {
                        if (!item.style.opacity || item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // --- 3. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: Stop observing once animated
                // scrollObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const sectionsToAnimate = document.querySelectorAll('.hero-section, .gallery-section, .about-section, .contact-section, .gallery-item');
    sectionsToAnimate.forEach(section => {
        scrollObserver.observe(section);
    });

    // --- 4. Dynamic CSS Injection for Animations ---
    // Injecting keyframes and extra styles dynamically to keep CSS file clean
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .animate-in {
            animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Gallery Item Hover Effects */
        .gallery-item {
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
            transform-origin: center center;
        }

        .gallery-item:hover {
            transform: translateY(-10px) scale(1.02);
            z-index: 10;
        }

        .gallery-item:hover .frame-ornament {
            transform: scale(1.1) rotate(3deg);
            transition: transform 0.4s ease;
        }

        /* Button Shine Effect */
        .submit-button, .cta-button {
            position: relative;
            overflow: hidden;
        }

        .submit-button::after, .cta-button::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }

        .submit-button:hover::after, .cta-button:hover::after {
            left: 100%;
        }

        /* Form Input Focus Animation */
        .form-group input:focus, .form-group textarea:focus {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(201, 169, 98, 0.15);
        }

        /* Lightbox Styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 77, 62, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: lbFadeIn 0.3s ease;
            backdrop-filter: blur(5px);
        }

        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            animation: lbScaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border: 4px solid var(--soft-gold);
            border-radius: 4px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: block;
        }

        .lightbox-info {
            text-align: center;
            color: var(--ivory);
            margin-top: 1.5rem;
            font-family: var(--font-body);
        }

        .lightbox-info h3 {
            font-family: var(--font-display);
            color: var(--soft-gold);
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }

        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            color: var(--soft-gold);
            font-size: 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            line-height: 1;
        }

        .lightbox-close:hover {
            transform: scale(1.2) rotate(90deg);
            color: #fff;
        }

        @keyframes lbFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes lbScaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* Custom Cursor */
        .art-cursor {
            position: fixed;
            width: 24px;
            height: 24px;
            pointer-events: none;
            z-index: 9999;
            color: var(--soft-gold);
            font-size: 1.2rem;
            display: none;
            justify-content: center;
            align-items: center;
            transition: transform 0.15s ease-out;
            mix-blend-mode: difference;
        }

        @media (hover: hover) {
            .art-cursor { display: flex; }
            a, button, .gallery-item, .filter-btn, input, textarea {
                cursor: none;
            }
        }
    `;
    document.head.appendChild(dynamicStyles);

    // --- 5. Form Submission Handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            const originalContent = submitButton.innerHTML;
            
            // Simulate sending state
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.8';

            setTimeout(() => {
                submitButton.innerHTML = '<span>Sent with Grace ✦</span>';
                submitButton.style.background = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';
                
                setTimeout(() => {
                    submitButton.innerHTML = originalContent;
                    submitButton.disabled = false;
                    submitButton.style.background = ''; // Reset to CSS default
                    submitButton.style.opacity = '1';
                    contactForm.reset();
                    alert('Thank you for your correspondence. We shall reply shortly.');
                }, 2000);
            }, 1500);
        });
    }

    // --- 6. Parallax Effect for Hero ---
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = heroSection.querySelector('.hero-content');
            const heroFrame = heroSection.querySelector('.hero-frame');
            
            if (heroContent && scrolled < heroSection.offsetHeight) {
                // Subtle parallax for content
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / (heroSection.offsetHeight * 0.8));
                
                // Reverse parallax for background elements if desired
                if (heroFrame) {
                    heroFrame.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            }
        });
    }

    // --- 7. Custom Cursor Logic ---
    const cursor = document.createElement('div');
    cursor.className = 'art-cursor';
    cursor.innerHTML = '✦'; // Fleur-de-lis or star shape
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover states
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.6) rotate(45deg)';
            cursor.style.color = '#fff';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1) rotate(0deg)';
            cursor.style.color = ''; // Reset to CSS default
        });
    });

    // --- 8. Lightbox Functionality ---
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgElement = this.querySelector('img');
            if (!imgElement) return;

            const title = this.querySelector('.artwork-title') ? this.querySelector('.artwork-title').textContent : 'Artwork';
            const year = this.querySelector('.artwork-year') ? this.querySelector('.artwork-year').textContent : '';
            const medium = this.querySelector('.artwork-medium') ? this.querySelector('.artwork-medium').textContent : '';

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            // Construct inner HTML safely
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <div class="lightbox-close">&times;</div>
                    <img src="${imgElement.src}" alt="${title}">
                    <div class="lightbox-info">
                        <h3>${title}</h3>
                        <p>${year} — ${medium}</p>
                    </div>
                </div>
            `;

            document.body.appendChild(lightbox);

            // Close functionality
            const closeLightbox = () => {
                lightbox.style.animation = 'lbFadeIn 0.3s ease reverse';
                setTimeout(() => lightbox.remove(), 300);
            };

            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            
            // Close on escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') closeLightbox();
                document.removeEventListener('keydown', escapeHandler);
            };
            document.addEventListener('keydown', escapeHandler);
        });
    });

    // Initial load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.2s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});