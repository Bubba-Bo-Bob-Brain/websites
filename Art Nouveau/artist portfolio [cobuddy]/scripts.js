// ============================================
// Eloïse Maren — Art Nouveau Portfolio
// Interactive Script
// ============================================

(function() {

    // ---------- Custom Cursor ----------
    const cursor = document.querySelector('.custom-cursor');
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateCursor() {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .piece-frame');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // ---------- Navigation Scroll Effect ----------
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // ---------- Smooth Scroll for Nav Links ----------
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---------- Gallery Filter ----------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';

                    // Staggered reveal
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // ---------- Gallery Piece Modal ----------
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalInfo = document.getElementById('modal-info');
    const modalClose = document.querySelector('.modal-close');

    const pieceData = {
        'The Fleur-de-Lis Reverie': {
            description: 'A luminous meditation on botanical symmetry, where irises cascade in golden light across a field of muted teal. Gold leaf veins trace the paths of ancient vines.',
            gradient: 'linear-gradient(135deg, var(--color-teal-deep) 0%, var(--color-sage) 40%, var(--color-gold) 100%)'
        },
        'Dame aux Iris': {
            description: 'Inspired by Mucha\'s iconic poster women, this portrait captures the quiet dignity of a figure framed by blooming irises. Each petal rendered in delicate gouache and hand-applied gold.',
            gradient: 'linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-dusty-rose) 40%, var(--color-gold) 100%)'
        },
        'Whiplash Nocturne': {
            description: 'Bold whiplash curves collide with geometric abstraction in this striking night scene. Metallic pigments catch light from unseen sources, creating an otherworldly glow.',
            gradient: 'linear-gradient(135deg, var(--color-amber-deep) 0%, var(--color-teal) 40%, var(--color-burgundy) 100%)'
        },
        'Vine of Whispers': {
            description: 'Tendrils of ink and gold trace whispered conversations between roots and branches. A meditation on the quiet intelligence of the natural world.',
            gradient: 'linear-gradient(135deg, var(--color-sage) 0%, var(--color-teal-deep) 40%, var(--color-gold) 100%)'
        },
        'Salon Mémoire': {
            description: 'A grand mural commission bringing the splendor of the Belle Époque into a contemporary Parisian salon. Floor-to-ceiling botanical frames envelop the room in living gold.',
            gradient: 'linear-gradient(135deg, var(--color-dusty-rose) 0%, var(--color-amber) 40%, var(--color-burgundy) 100%)'
        },
        'Evening in the Garden': {
            description: 'The last light of day filters through lily pads and rose arbors. Watercolor washes blend with metallic accents to capture the fleeting magic of twilight.',
            gradient: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-gold) 40%, var(--color-dusty-rose) 100%)'
        }
    };

    galleryItems.forEach(item => {
        const expandBtn = item.querySelector('.piece-expand');
        const title = item.querySelector('.piece-title').textContent;

        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const data = pieceData[title];
            if (!data) return;

            modalImage.style.background = data.gradient;
            modalImage.innerHTML = item.querySelector('.piece-illustration').outerHTML;

            modalInfo.innerHTML = `
                <h3>${title}</h3>
                <p class="piece-medium">${item.querySelector('.piece-medium').textContent}</p>
                <p class="piece-dimensions">${item.querySelector('.piece-dimensions').textContent}</p>
                <p style="margin-top: 1rem; font-style: italic; color: var(--color-ink-light); line-height: 1.7;">${data.description}</p>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Also open on clicking the piece itself
        item.addEventListener('click', () => {
            const expandBtn = item.querySelector('.piece-expand');
            expandBtn.click();
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ---------- Scroll Reveal Animations ----------
    const revealElements = document.querySelectorAll('.gallery-item, .exhibition-item, .about-content, .section-header, .contact-content, .contact-info');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('reveal');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Staggered Gallery Reveal on Load ----------
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 600 + index * 100);
    });

    // ---------- Form Submission ----------
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                <path d="M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M12,2 A10,10 0 0,1 22,12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30" stroke-dashoffset="0"/>
            </svg>
            <span>Sending...</span>
        `;

        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                    <path d="M20,6 L9,17 L4,12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Message Sent</span>
            `;
            submitBtn.style.background = 'var(--color-sage)';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 2000);
    });

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ---------- Parallax on Hero Vines ----------
    const heroVines = document.querySelector('.hero-vines');
    if (heroVines) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            const vineOffset = scrolled / heroHeight;

            heroVines.style.transform = `translateY(${vineOffset * 20}px) rotate(${vineOffset * 2}deg)`;
            heroVines.style.opacity = Math.max(0, 1 - vineOffset * 2);
        });
    }

    // ---------- Floating Navigation with Vine Trail ----------
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Any additional scroll-based effects
        }, 100);
    });

    // ---------- Iris Divider Animation on Scroll ----------
    const irisDivider = document.getElementById('divider-1');
    const lilyDivider = document.getElementById('divider-2');

    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'dividerReveal 1.5s ease forwards';
            }
        });
    }, { threshold: 0.5 });

    [irisDivider, lilyDivider].forEach(div => {
        if (div) {
            div.style.opacity = '0';
            div.style.transform = 'translateY(20px)';
            div.style.transition = 'opacity 1s ease, transform 1s ease';
            dividerObserver.observe(div);
        }
    });

    // Add divider reveal animation
    const dividerStyle = document.createElement('style');
    dividerStyle.textContent = `
        @keyframes dividerReveal {
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
    document.head.appendChild(dividerStyle);

    // ---------- Exhibit Items Stagger on Scroll ----------
    const exhibitionItems = document.querySelectorAll('.exhibition-item');

    exhibitionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    });

    const exhibitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                exhibitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    exhibitionItems.forEach(item => exhibitObserver.observe(item));

    // ---------- About Stats Counter Animation ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    let current = 0;
                    const increment = target / 40;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 40);
                });
            }
        });
    }, { threshold: 0.5 });

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) statsObserver.observe(aboutStats);

    // ---------- Keyboard Navigation for Modal ----------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // ---------- Page Load Animation ----------
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        // Animate hero elements in sequence
        const heroElements = document.querySelectorAll('.hero-subtitle, .hero-title, .hero-divider, .hero-tagline, .hero-scroll');
        heroElements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s ease ${0.3 + i * 0.2}s, transform 0.8s ease ${0.3 + i * 0.2}s`;

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    });

    // ---------- About Section Reveal ----------
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateY(30px)';
        aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        aboutObserver.observe(aboutContent);
    }

    // ---------- Gold Leaf Hover Sound Effect (Visual Only - Gold Pulse) ----------
    const pieceFrames = document.querySelectorAll('.piece-frame');

    pieceFrames.forEach(frame => {
        frame.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 40px rgba(201, 168, 76, 0.15), 0 0 20px rgba(201, 168, 76, 0.05)';
        });

        frame.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // ---------- Contact Form Input Animations ----------
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

})();