// ============================================
// CHAMPAGNE BUBBLE PARTICLES
// ============================================

const bubbleContainer = document.getElementById('bubbleContainer');

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 8 + 3;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 2;

    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = startX + 'px';
    bubble.style.animationDuration = duration + 's';
    bubble.style.animationDelay = delay + 's';

    bubbleContainer.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, (duration + delay) * 1000);
}

// Create bubbles periodically
let bubbleInterval = setInterval(createBubble, 400);

// Create initial batch
for (let i = 0; i < 15; i++) {
    setTimeout(createBubble, i * 200);
}

// Adjust bubble frequency on resize
window.addEventListener('resize', () => {
    const newStartX = Math.random() * window.innerWidth;
    // Bubbles will continue from their current positions
});

// ============================================
// HERO PARALLAX SCROLL
// ============================================

const heroParallax = document.querySelector('.hero-parallax');
const heroSunburst = document.getElementById('heroSunburst');
const heroContent = document.querySelector('.hero-content');

let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrollY < heroHeight) {
                const parallaxFactor = scrollY / heroHeight;
                heroSunburst.style.transform = `translate(-50%, -50%) rotate(${parallaxFactor * 30}deg) scale(${1 + parallaxFactor * 0.1})`;
                heroContent.style.transform = `translateY(${parallaxFactor * 30}px)`;
                heroContent.style.opacity = 1 - parallaxFactor * 0.6;
            }
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// ============================================
// SCROLL-TRIGGERED FADE-IN ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger children
            const children = entry.target.querySelectorAll('.article-excerpt, .article-continue');
            children.forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(15px)';
                child.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, 100);
            });
        }
    });
}, observerOptions);

// Observe all articles
document.querySelectorAll('.feature-article, .editorial-article').forEach(article => {
    article.classList.add('fade-in-up');
    observer.observe(article);
});

// Observe sidebar items
document.querySelectorAll('.ad-card, .sidebar-box, .quote-box').forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
});

// ============================================
// MASTHEAD TITLE TYPEWRITER GLOW EFFECT
// ============================================

const mastheadTitle = document.getElementById('mastheadTitle');

// Add subtle glow pulse
setInterval(() => {
    mastheadTitle.style.textShadow = `
        0 0 40px rgba(201, 168, 76, ${0.2 + Math.random() * 0.15}),
        0 2px 4px rgba(0,0,0,0.5)
    `;
}, 2000);

// Reset after pulse
setTimeout(() => {
    mastheadTitle.style.textShadow = '0 0 40px rgba(201, 168, 76, 0.3), 0 2px 4px rgba(0,0,0,0.5)';
}, 2000);

// ============================================
// NAV LINK ACTIVE STATE ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id], article[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// GOLD DIVIDER ANIMATION ON SCROLL
// ============================================

const svgDivider = document.querySelector('.svg-divider');

if (svgDivider) {
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                svgDivider.style.animation = 'dividerSlide 1s ease forwards';
                svgDivider.style.opacity = '1';
            }
        });
    }, { threshold: 0.5 });

    dividerObserver.observe(svgDivider);
}

// Add keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes dividerSlide {
        from {
            opacity: 0;
            transform: scaleX(0);
        }
        to {
            opacity: 0.6;
            transform: scaleX(1);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ARTICLE HOVER — GLOW BORDER ANIMATION
// ============================================

document.querySelectorAll('.feature-article, .editorial-article').forEach(article => {
    article.addEventListener('mouseenter', function () {
        this.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        this.style.boxShadow = '0 0 40px rgba(201, 168, 76, 0.12), inset 0 0 40px rgba(201, 168, 76, 0.03)';
        this.style.borderColor = 'rgba(201, 168, 76, 0.4)';
    });

    article.addEventListener('mouseleave', function () {
        this.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.08), inset 0 0 30px rgba(201, 168, 76, 0.02)';
        this.style.borderColor = 'rgba(201, 168, 76, 0.15)';
    });
});

// ============================================
// DROP CAP — LARGEST-LETTER DRIP EFFECT
// ============================================

document.querySelectorAll('.drop-cap').forEach(cap => {
    const text = cap.textContent;
    cap.textContent = '';
    cap.style.display = 'inline-block';
    cap.style.width = '1em';
    cap.style.height = '1em';
    cap.style.overflow = 'hidden';
    cap.style.verticalAlign = 'text-top';
    cap.style.position = 'relative';

    const span = document.createElement('span');
    span.textContent = text;
    span.style.fontSize = '4em';
    span.style.lineHeight = '0.75';
    span.style.fontWeight = '900';
    span.style.color = 'var(--gold-primary)';
    span.style.textShadow = '0 0 20px rgba(201, 168, 76, 0.3)';
    span.style.position = 'absolute';
    span.style.top = '0';
    span.style.left = '0';

    cap.appendChild(span);

    // Animate in
    setTimeout(() => {
        span.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        span.style.transform = 'translateY(0) scale(1)';
        span.style.opacity = '1';
    }, 300);
});

// ============================================
// AD CARD — TILT EFFECT ON MOUSE MOVE
// ============================================

document.querySelectorAll('.ad-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.5s ease';
    });
});

// ============================================
// CHAMPAGNE BUBBLE POP ON CLICK (EASTER EGG)
// ============================================

let clickBubbles = 0;
document.addEventListener('click', (e) => {
    if (clickBubbles > 20) return;

    for (let i = 0; i < 3; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 6 + 2;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (e.clientX + (Math.random() - 0.5) * 40) + 'px';
        bubble.style.bottom = (window.innerHeight - e.clientY) + 'px';
        bubble.style.animationDuration = '2s';
        bubble.style.opacity = '0.8';
        bubbleContainer.appendChild(bubble);

        setTimeout(() => bubble.remove(), 2000);
    }

    clickBubbles++;
});

// ============================================
// PARALLAX SUNBURST HERO ON MOUSE MOVE
// ============================================

const heroSection = document.querySelector('.hero');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;

    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

    const sunburst = document.getElementById('heroSunburst');
    if (sunburst) {
        sunburst.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
    }
});

// ============================================
// ARTICLE REVEAL ANIMATION ON LOAD
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Stagger article reveals
    const articles = document.querySelectorAll('.feature-article, .editorial-article');
    articles.forEach((article, index) => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(30px)';
        article.style.transition = `opacity 0.8s ease ${0.5 + index * 0.3}s, transform 0.8s ease ${0.5 + index * 0.3}s`;

        setTimeout(() => {
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
        }, 600 + index * 300);
    });

    // Sidebar items stagger
    const sidebarItems = document.querySelectorAll('.ad-card, .sidebar-box, .quote-box');
    sidebarItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.8s ease ${0.8 + index * 0.2}s, transform 0.8s ease ${0.8 + index * 0.2}s`;

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 900 + index * 200);
    });
});

// ============================================
// QUOTE BOX — SUBTLE SHIMMER
// ============================================

const quoteBox = document.querySelector('.quote-box');
if (quoteBox) {
    let shimmerAngle = 0;
    setInterval(() => {
        shimmerAngle += 1;
        const shimmer = `linear-gradient(${shimmerAngle}deg, transparent 30%, rgba(201, 168, 76, 0.05) 50%, transparent 70%)`;
        quoteBox.style.background = shimmer;
    }, 50);
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// DYNAMIC CURSOR GLOW (optional enhancement)
// ============================================

const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 168, 76, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
`;
document.body.appendChild(cursorGlow);

let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';

    if (!cursorVisible) {
        cursorGlow.style.opacity = '1';
        cursorVisible = true;
    }
});

// ============================================
// FOOTER ORNAMENT — PULSE
// ============================================

const footerOrnaments = document.querySelectorAll('.footer-ornament');
footerOrnaments.forEach(orn => {
    setInterval(() => {
        orn.style.opacity = orn.style.opacity === '0.6' ? '0.3' : '0.6';
    }, 2000);
});

// ============================================
// GOLD ZIGZAG DIVIDER ANIMATION
// ============================================

document.querySelectorAll('.gold-zigzag').forEach(divider => {
    const originalWidth = divider.offsetWidth;
    divider.style.transition = 'transform 0.6s ease';
    divider.style.transformOrigin = 'left';

    const parentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                divider.style.transform = 'scaleX(1)';
            }
        });
    }, { threshold: 0.5 });

    parentObserver.observe(divider);
});

// ============================================
// MAGAZINE ISSUE DATE — LIVE CLOCK EFFECT
// ============================================

const issueElement = document.querySelector('.hero-issue');
if (issueElement) {
    const issueDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const formatted = `Vol. VII — No. 3 — ${months[issueDate.getMonth()]} ${issueDate.getFullYear()}`;
    issueElement.textContent = formatted;
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c✦ THE GILDED AGE ✦', 'color: #C9A84C; font-size: 24px; font-family: serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c"A journal of modern elegance and extravagance."', 'color: #E8D5A3; font-size: 12px; font-family: serif;');
console.log('%c— Est. 1923 —', 'color: #9A9588; font-size: 10px; font-family: monospace;');