// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Custom Cursor Effects
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Move dot immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        // Smooth trail movement
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Navigation Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Seasonal Anime Tracker
    const seasonButtons = document.querySelectorAll('.season-btn');
    const animeCards = document.querySelectorAll('.anime-card');
    
    seasonButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            seasonButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const season = button.dataset.season;
            
            // Simulate filtering anime cards based on season
            animeCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.5s ease';
                    card.style.opacity = '1';
                }, index * 100);
            });
        });
    });
    
    // Add fadeIn animation for filtering
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Character Carousel
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const characterCards = document.querySelectorAll('.character-card');
    
    let currentIndex = 0;
    const cardWidth = characterCards[0].offsetWidth + 32; // width + gap
    
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < characterCards.length - 3) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Anime Card Hover Effects
    animeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth Scrolling for Navigation Links
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
    
    // Parallax Effect for Hero Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        const speed = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Animated Stats on Scroll
    const stats = document.querySelectorAll('.stat-box h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
    
    function animateNumber(element) {
        const target = parseInt(element.textContent);
        const increment = Math.ceil(target / 50);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = current.toLocaleString();
            }
        }, 20);
    }
    
    // Floating Particles Effect
    function createParticles() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            animation: floatUp 3s ease-out forwards;
        `;
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
    
    setInterval(createParticles, 200);
    
    // Add floatUp animation
    const floatUpStyle = document.createElement('style');
    floatUpStyle.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(floatUpStyle);
    
    // Typing Effect for Hero Title
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let charIndex = 0;
    function typeText() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }
    
    // Trigger typing effect when hero is in view
    const heroSection = document.querySelector('.hero-section');
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(typeText, 500);
            heroObserver.disconnect();
        }
    });
    
    heroObserver.observe(heroSection);
    
    // Interactive Panel Effects
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.transform = 'translateY(-5px)';
            panel.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'translateY(0)';
            panel.style.boxShadow = 'none';
        });
    });
    
    // Anime Card Interactive Effects
    const animePosters = document.querySelectorAll('.anime-poster');
    animePosters.forEach(poster => {
        poster.addEventListener('mouseenter', () => {
            poster.style.transform = 'scale(1.05)';
            poster.style.transition = 'transform 0.3s ease';
        });
        
        poster.addEventListener('mouseleave', () => {
            poster.style.transform = 'scale(1)';
        });
    });
    
    // Dynamic Background Particles
    function createBackgroundParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.5);
            pointer-events: none;
            z-index: 9996;
            animation: particleFloat 4s linear infinite;
        `;
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
    
    setInterval(createBackgroundParticle, 300);
    
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(110vh) translateX(50px); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);
});