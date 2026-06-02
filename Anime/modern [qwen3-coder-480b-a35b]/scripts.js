// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Character Spotlight Carousel
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    // Initialize carousel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        
        // Update active item
        carouselItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Next button click
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    // Previous button click
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    // Auto-rotate carousel
    let carouselInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000);

    // Pause auto-rotate on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 5000);
    });

    // Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function highlightNav() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Tab filtering for seasonal anime
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // In a real implementation, this would filter the anime list
            // For demo purposes, we'll just show a message
            console.log(`Filtering by: ${tab.textContent}`);
        });
    });

    // Hover effects for manga cards
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    });

    // Hover effects for anime cards
    const animeCards = document.querySelectorAll('.anime-card');
    animeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow)';
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // In a real implementation, this would search the database
            alert(`Searching for: ${query}`);
            searchInput.value = '';
        }
    }

    // Hero panel animations
    const panels = document.querySelectorAll('.manga-panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.transform = 'scale(1.05)';
            panel.style.zIndex = '10';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'scale(1)';
            panel.style.zIndex = '1';
        });
    });

    // Add dynamic background effects
    createSpeedLines();
    
    function createSpeedLines() {
        const speedLines = document.querySelector('.speed-lines');
        const lineCount = 20;
        
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.top = `${Math.random() * 100}%`;
            line.style.left = '-100px';
            line.style.width = `${Math.random() * 200 + 100}px`;
            line.style.height = `${Math.random() * 2 + 1}px`;
            line.style.background = `rgba(255, 46, 99, ${Math.random() * 0.5 + 0.1})`;
            line.style.animation = `moveLine ${Math.random() * 10 + 5}s linear infinite`;
            line.style.animationDelay = `${Math.random() * 5}s`;
            speedLines.appendChild(line);
        }
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes moveLine {
                0% { transform: translateX(-100px); }
                100% { transform: translateX(calc(100vw + 100px)); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const hero = document.querySelector('.hero');
        const panels = document.querySelectorAll('.manga-panel');
        
        // Parallax effect for hero panels
        panels.forEach((panel, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrollPosition * speed);
            panel.style.transform = `translateY(${yPos}px)`;
        });
        
        // Fade out hero content on scroll
        const opacity = 1 - Math.min(scrollPosition / 300, 1);
        hero.style.opacity = opacity;
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .tab, .prev-btn, .next-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            0% {
                width: 0;
                height: 0;
                opacity: 0.7;
            }
            100% {
                width: 500px;
                height: 500px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});