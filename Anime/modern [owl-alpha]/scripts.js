/* ============================================
   MANGA NEO - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSpeedLines();
    initScrollAnimations();
    initCarousel();
    initNavigation();
    initSeasonTabs();
    initTrackButtons();
    initParallaxEffects();
    initHoverEffects();
});

/* ============================================
   SPEED LINES CANVAS ANIMATION
   ============================================ */

function initSpeedLines() {
    const canvas = document.getElementById('speedLines');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let lines = [];
    const lineCount = 50;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function createLine() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 3 + 1,
            opacity: Math.random() * 0.3 + 0.1,
            angle: Math.random() * Math.PI * 0.1 - Math.PI * 0.05
        };
    }
    
    function init() {
        resize();
        lines = [];
        for (let i = 0; i < lineCount; i++) {
            lines.push(createLine());
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        lines.forEach(line => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 255, ${line.opacity})`;
            ctx.lineWidth = 1;
            
            const endX = line.x + Math.cos(line.angle) * line.length;
            const endY = line.y + Math.sin(line.angle) * line.length;
            
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            line.y += line.speed;
            line.x += Math.sin(line.angle) * line.speed * 0.5;
            
            if (line.y > height + line.length) {
                line.y = -line.length;
                line.x = Math.random() * width;
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    init();
    draw();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    const header = document.querySelector('.header');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============================================
   CHARACTER CAROUSEL
   ============================================ */

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const cards = document.querySelectorAll('.character-card');
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    
    function getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function getCardWidth() {
        if (cards.length === 0) return 0;
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        return cardWidth + gap;
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const offset = -currentIndex * getCardWidth();
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
    }
    
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex);
        }
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
        createDots();
        goToSlide(Math.min(currentIndex, maxIndex));
    });
    
    createDots();
    
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    track.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/* ============================================
   SEASON TABS
   ============================================ */

function initSeasonTabs() {
    const tabs = document.querySelectorAll('.season-tab');
    const seasonalCards = document.querySelectorAll('.seasonal-card');
    
    const seasonData = {
        winter: [
            { title: 'Solo Leveling', progress: 67, episodes: '8/12', day: 'Sundays', time: '00:00 JST', tracked: true },
            { title: "Frieren: Beyond Journey's End", progress: 85, episodes: '23/28', day: 'Fridays', time: '23:00 JST', tracked: true },
            { title: 'Blue Lock Season 2', progress: 25, episodes: '1/12', day: 'Saturdays', time: '00:30 JST', tracked: false },
            { title: 'Dandadan', progress: 50, episodes: '3/6', day: 'Thursdays', time: '01:00 JST', tracked: false }
        ],
        spring: [
            { title: 'My Hero Academia S7', progress: 0, episodes: '0/24', day: 'Saturdays', time: '17:00 JST', tracked: false },
            { title: 'Kaiju No. 8', progress: 0, episodes: '0/12', day: 'Saturdays', time: '23:00 JST', tracked: false },
            { title: 'Wind Breaker', progress: 0, episodes: '0/13', day: 'Thursdays', time: '00:00 JST', tracked: false },
            { title: 'Go! Go! Loser Ranger!', progress: 0, episodes: '0/12', day: 'Sundays', time: '01:00 JST', tracked: false }
        ],
        summer: [
            { title: 'Delicious in Dungeon', progress: 0, episodes: '0/24', day: 'Thursdays', time: '00:00 JST', tracked: false },
            { title: 'Tower of God S2', progress: 0, episodes: '0/13', day: 'Sundays', time: '00:00 JST', tracked: false },
            { title: 'The Elusive Samurai', progress: 0, episodes: '0/12', day: 'Saturdays', time: '01:30 JST', tracked: false },
            { title: 'No Longer Allowed in Another World', progress: 0, episodes: '0/12', day: 'Tuesdays', time: '00:00 JST', tracked: false }
        ],
        fall: [
            { title: 'Dragon Ball Daima', progress: 0, episodes: '0/20', day: 'Fridays', time: '23:40 JST', tracked: false },
            { title: 'Re:Zero S3', progress: 0, episodes: '0/16', day: 'Wednesdays', time: '00:00 JST', tracked: false },
            { title: 'Bleach: TYBW S3', progress: 0, episodes: '0/14', day: 'Saturdays', time: '23:00 JST', tracked: false },
            { title: 'Ranma 1/2 (2024)', progress: 0, episodes: '0/12', day: 'Saturdays', time: '00:00 JST', tracked: false }
        ]
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const season = tab.dataset.season;
            const data = seasonData[season];
            
            seasonalCards.forEach((card, index) => {
                if (data[index]) {
                    const cardData = data[index];
                    card.querySelector('h3').textContent = cardData.title;
                    card.querySelector('.tracker-progress').style.width = `${cardData.progress}%`;
                    card.querySelector('.tracker-text').textContent = `${cardData.episodes} Episodes Watched`;
                    card.querySelector('.airing-day').textContent = `📅 ${cardData.day}`;
                    card.querySelector('.airing-time').textContent = `🕐 ${cardData.time}`;
                    
                    const trackBtn = card.querySelector('.btn-track');
                    trackBtn.dataset.tracked = cardData.tracked;
                    trackBtn.querySelector('.track-icon').textContent = cardData.tracked ? '✓' : '+';
                    trackBtn.querySelector('.track-text').textContent = cardData.tracked ? 'Tracking' : 'Track';
                    
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        });
    });
}

/* ============================================
   TRACK BUTTONS
   ============================================ */

function initTrackButtons() {
    document.addEventListener('click', (e) => {
        const trackBtn = e.target.closest('.btn-track');
        if (trackBtn) {
            const isTracked = trackBtn.dataset.tracked === 'true';
            trackBtn.dataset.tracked = !isTracked;
            
            const icon = trackBtn.querySelector('.track-icon');
            const text = trackBtn.querySelector('.track-text');
            
            if (!isTracked) {
                icon.textContent = '✓';
                text.textContent = 'Tracking';
                trackBtn.style.background = 'rgba(0, 245, 255, 0.2)';
                
                showNotification('Added to tracking list!');
            } else {
                icon.textContent = '+';
                text.textContent = 'Track';
                trackBtn.style.background = '';
                
                showNotification('Removed from tracking list');
            }
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: linear-gradient(135deg, #00f5ff, #ff00ff);
        color: #0a0a0f;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 10px 30px rgba(0, 245, 255, 0.4);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */

function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    const panels = document.querySelectorAll('.panel');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        if (scrollY < window.innerHeight) {
            panels.forEach((panel, index) => {
                const speed = 0.1 + (index * 0.05);
                panel.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }, { passive: true });
}

/* ============================================
   HOVER EFFECTS
   ============================================ */

function initHoverEffects() {
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
    
    const mangaItems = document.querySelectorAll('.manga-item');
    
    mangaItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = 'var(--neon-magenta)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        });
    });
}

/* ============================================
   DYNAMIC BACKGROUND EFFECTS
   ============================================ */

function createFloatingParticles() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.insertBefore(container, document.body.firstChild);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? 'var(--neon-cyan)' : 'var(--neon-magenta)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

createFloatingParticles();

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.click();
    }
});

/* ============================================
   LOADING ANIMATION
   ============================================ */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const heroElements = document.querySelectorAll('.panel');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 200);
    });
});

/* ============================================
   SMOOTH REVEAL ON SCROLL
   ============================================ */

const revealOnScroll = () => {
    const elements = document.querySelectorAll('.section-header, .featured-grid, .carousel-container, .seasonal-grid, .manga-layout, .news-grid');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.classList.add('animate-in');
        }
    });
};

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();

/* ============================================
   SEARCH FUNCTIONALITY (Placeholder)
   ============================================ */

const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        showNotification('Search feature coming soon!');
    });
}

/* ============================================
   NEWS CARD INTERACTIONS
   ============================================ */

const newsLinks = document.querySelectorAll('.news-link');
newsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Full article coming soon!');
    });
});

/* ============================================
   MANGA READ BUTTON
   ============================================ */

const readButtons = document.querySelectorAll('.btn-small');
readButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('Opening manga reader...');
    });
});