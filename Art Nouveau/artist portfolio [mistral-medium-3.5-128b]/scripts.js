document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Update active link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Whiplash Navigation Curve Effect
    const navCurve = document.querySelector('.nav-curve');
    const navList = document.querySelector('.nav-list');

    navList.addEventListener('mousemove', (e) => {
        const rect = navList.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        navCurve.style.backgroundPosition = `${percentage}% 0%`;
    });

    // Gold Leaf Shimmer Effect on Gallery Items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const goldLeaf = item.querySelector('.gold-leaf-accent');
        if (goldLeaf) {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
                goldLeaf.style.background = `linear-gradient(${angle}deg, transparent 40%, rgba(212, 175, 55, 0.2) 50%, transparent 60%)`;
            });
            item.addEventListener('mouseleave', () => {
                goldLeaf.style.background = 'linear-gradient(135deg, transparent 45%, rgba(212, 175, 55, 0.1) 50%, transparent 55%)';
            });
        }
    });

    // Vine Growth Animation for Ornamental Dividers
    const ornamentalDividers = document.querySelectorAll('.ornamental-divider');
    ornamentalDividers.forEach(divider => {
        const paths = divider.querySelectorAll('path');
        if (paths.length === 0) {
            // Since we're using background-image SVGs, we'll simulate growth with CSS
            divider.style.transition = 'opacity 1s ease-in-out';
            divider.style.opacity = '0';
            setTimeout(() => {
                divider.style.opacity = '1';
            }, 100);
        }
    });

    // Gallery Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img class="lightbox-img" src="" alt="">
            <h3 class="lightbox-title"></h3>
        </div>
        <div class="lightbox-overlay"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        if (img && title) {
            item.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxTitle.textContent = title.textContent;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Animate Vine Frames on Scroll (Intersection Observer)
    const vineFrames = document.querySelectorAll('.vine-frame');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    vineFrames.forEach(frame => {
        frame.style.opacity = '0';
        frame.style.transform = 'translateY(20px)';
        frame.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(frame);
    });

    // Stained Glass Effect Enhancement for Hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const stainedGlass = hero.querySelector('.stained-glass-overlay');
            if (stainedGlass) {
                stainedGlass.style.backgroundPosition = `${x / 20}px ${y / 20}px`;
            }
        });
    }

    // Set first nav link as active on load
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
});