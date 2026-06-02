/**
 * MANGA.ME - Ultimate Anime & Manga Hub
 * Interactive JavaScript Module
 * 
 * Features:
 * - Custom cursor with hover effects
 * - Speed lines canvas animation
 * - Character carousel with touch support
 * - Seasonal anime tracker with data management
 * - Manga grid filtering
 * - Theme toggle with persistence
 * - Scroll-triggered animations
 * - Newsletter form handling
 * - Halftone overlay effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate cursor movement
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });
        
        // Smooth follower animation
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .manga-card, .community-card, .character-slide');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ============================================
    // SPEED LINES CANVAS BACKGROUND
    // ============================================
    const speedLinesCanvas = document.getElementById('speedLines');
    if (speedLinesCanvas) {
        const ctx = speedLinesCanvas.getContext('2d');
        let lines = [];
        const lineCount = 50;
        
        function resizeCanvas() {
            speedLinesCanvas.width = window.innerWidth;
            speedLinesCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class SpeedLine {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * speedLinesCanvas.width;
                this.y = Math.random() * speedLinesCanvas.height;
                this.length = Math.random() * 100 + 50;
                this.speed = Math.random() * 2 + 1;
                this.angle = Math.random() * Math.PI * 2;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.width = Math.random() * 2 + 0.5;
            }
            
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                
                if (this.x < -this.length || this.x > speedLinesCanvas.width + this.length ||
                    this.y < -this.length || this.y > speedLinesCanvas.height + this.length) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.strokeStyle = `rgba(255, 42, 109, ${this.opacity})`;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x + Math.cos(this.angle) * this.length,
                    this.y + Math.sin(this.angle) * this.length
                );
                ctx.stroke();
            }
        }
        
        // Initialize lines
        for (let i = 0; i < lineCount; i++) {
            lines.push(new SpeedLine());
        }
        
        function animateSpeedLines() {
            ctx.clearRect(0, 0, speedLinesCanvas.width, speedLinesCanvas.height);
            
            lines.forEach(line => {
                line.update();
                line.draw();
            });
            
            requestAnimationFrame(animateSpeedLines);
        }
        animateSpeedLines();
    }

    // ============================================
    // HALFTONE OVERLAY EFFECT
    // ============================================
    function createHalftoneOverlay(element) {
        const overlay = document.createElement('div');
        overlay.className = 'halftone-overlay';
        const size = 4;
        const dots = [];
        const rect = element.getBoundingClientRect();
        
        for (let x = 0; x < rect.width; x += size) {
            for (let y = 0; y < rect.height; y += size) {
                const dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                dot.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                dot.style.borderRadius = '50%';
                dot.style.pointerEvents = 'none';
                overlay.appendChild(dot);
                dots.push(dot);
            }
        }
        
        element.appendChild(overlay);
        
        // Animate dots on hover
        element.addEventListener('mouseenter', () => {
            dots.forEach(dot => {
                dot.style.transition = 'all 0.3s ease';
                dot.style.transform = `scale(${Math.random() * 1.5 + 0.5})`;
                dot.style.opacity = `${Math.random() * 0.5 + 0.2}`;
            });
        });
        
        element.addEventListener('mouseleave', () => {
            dots.forEach(dot => {
                dot.style.transform = 'scale(1)';
                dot.style.opacity = '0.1';
            });
        });
    }

    // Apply halftone to character slides
    document.querySelectorAll('.character-visual').forEach(createHalftoneOverlay);

    // ============================================
    // CHARACTER CAROUSEL
    // ============================================
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.character-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function showSlide(index) {
        // Remove active classes
        slides.forEach(slide => slide.classList.remove('active', 'prev'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Handle wrap-around
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        // Add active class to current slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Add prev class to previous slide for animation
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        slides[prevIndex].classList.add('prev');
        
        // Animate stat bars
        const statFills = slides[currentSlide].querySelectorAll('.stat-fill');
        statFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Carousel controls
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Touch support for mobile
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }

    // Start autoplay
    if (slides.length > 0) {
        showSlide(0);
        startAutoplay();
        
        // Pause on hover
        carouselTrack.addEventListener('mouseenter', stopAutoplay);
        carouselTrack.addEventListener('mouseleave', startAutoplay);
    }

    // ============================================
    // SEASONAL ANIME TRACKER
    // ============================================
    const seasonalData = {
        winter2024: [
            {
                id: 'frieren',
                title: 'Frieren: Beyond Journey\'s End',
                studio: 'Madhouse',
                image: 'https://picsum.photos/seed/animeA/50/70',
                episodes: 28,
                status: 'Airing',
                statusClass: 'airing',
                score: 9.2
            },
            {
                id: 'sakamoto',
                title: 'Sakamoto Days',
                studio: 'TMS Entertainment',
                image: 'https://picsum.photos/seed/animeB/50/70',
                episodes: 12,
                status: 'Airing',
                statusClass: 'airing',
                score: 8.8
            },
            {
                id: 'heroaca',
                title: 'My Hero Academia S7',
                studio: 'Bones',
                image: 'https://picsum.photos/seed/animeC/50/70',
                episodes: 13,
                status: 'Airing',
                statusClass: 'airing',
                score: 8.6
            },
            {
                id: 'magilumiere',
                title: 'Magilumiere Co. Ltd.',
                studio: 'Maho Film',
                image: 'https://picsum.photos/seed/animeD/50/70',
                episodes: 12,
                status: 'Finished',
                statusClass: 'finished',
                score: 8.4
            },
            {
                id: 'tsukimichi',
                title: 'Tsukimichi: Moonlit Fantasy S2',
                studio: 'Zero-G',
                image: 'https://picsum.photos/seed/animeE/50/70',
                episodes: 12,
                status: 'Airing',
                statusClass: 'airing',
                score: 8.2
            }
        ],
        spring2024: [
            {
                id: 'kaguya-sama',
                title: 'Kaguya-sama: Love is War S3',
                studio: 'A-1 Pictures',
                image: 'https://picsum.photos/seed/spring1/50/70',
                episodes: 13,
                status: 'Airing',
                statusClass: 'airing',
                score: 9.1
            },
            {
                id: ' Vinland',
                title: 'Vinland Saga S2',
                studio: 'MAPPA',
                image: 'https://picsum.photos/seed/spring2/50/70',
                episodes: 12,
                status: 'Finished',
                statusClass: 'finished',
                score: 9.3
            },
            {
                id: 'chainsawman',
                title: 'Chainsaw Man S2',
                studio: 'MAPPA',
                image: 'https://picsum.photos/seed/spring3/50/70',
                episodes: 12,
                status: 'Upcoming',
                statusClass: 'upcoming',
                score: 0
            },
            {
                id: 'jujutsu',
                title: 'Jujutsu Kaisen S3',
                studio: 'MAPPA',
                image: 'https://picsum.photos/seed/spring4/50/70',
                episodes: 12,
                status: 'Upcoming',
                statusClass: 'upcoming',
                score: 0
            },
            {
                id: 'blue-lock',
                title: 'Blue Lock S2',
                studio: 'Eight Bit',
                image: 'https://picsum.photos/seed/spring5/50/70',
                episodes: 12,
                status: 'Upcoming',
                statusClass: 'upcoming',
                score: 0
            }
        ],
        summer2024: [
            {
                id: 'fma',
                title: 'Fullmetal Alchemist: Brotherhood',
                studio: 'Bones',
                image: 'https://picsum.photos/seed/summer1/50/70',
                episodes: 64,
                status: 'Classic',
                statusClass: 'classic',
                score: 9.5
            },
            {
                id: 'cowboy-bebop',
                title: 'Cowboy Bebop',
                studio: ' Sunrise',
                image: 'https://picsum.photos/seed/summer2/50/70',
                episodes: 26,
                status: 'Classic',
                statusClass: 'classic',
                score: 9.4
            },
            {
                id: 'steins-gate',
                title: 'Steins;Gate',
                studio: 'White Fox',
                image: 'https://picsum.photos/seed/summer3/50/70',
                episodes: 24,
                status: 'Classic',
                statusClass: 'classic',
                score: 9.4
            },
            {
                id: 'monster',
                title: 'Monster',
                studio: 'Madhouse',
                image: 'https://picsum.photos/seed/summer4/50/70',
                episodes: 74,
                status: 'Classic',
                statusClass: 'classic',
                score: 9.3
            },
            {
                id: 'death-note',
                title: 'Death Note',
                studio: 'Madhouse',
                image: 'https://picsum.photos/seed/summer5/50/70',
                episodes: 37,
                status: 'Classic',
                statusClass: 'classic',
                score: 9.0
            }
        ]
    };

    function renderAnimeTable(season) {
        const tbody = document.getElementById('animeTableBody');
        if (!tbody) return;
        
        const data = seasonalData[season];
        if (!data) return;
        
        tbody.innerHTML = '';
        
        data.forEach((anime, index) => {
            const row = document.createElement('tr');
            row.dataset.anime = anime.id;
            row.dataset.episodes = anime.episodes;
            row.dataset.score = anime.score;
            
            row.innerHTML = `
                <td class="rank">${index + 1}</td>
                <td class="title">
                    <img src="${anime.image}" alt="${anime.title}" class="anime-poster">
                    <div class="anime-info">
                        <span class="anime-title">${anime.title}</span>
                        <span class="anime-studio">${anime.studio}</span>
                    </div>
                </td>
                <td class="episodes">${anime.episodes}</td>
                <td class="status"><span class="status-badge ${anime.statusClass}">${anime.status}</span></td>
                <td class="score">${anime.score > 0 ? anime.score : '—'}</td>
                <td class="action">
                    <select class="status-select" data-anime-id="${anime.id}">
                        <option value="none" selected>--</option>
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                        <option value="plan-to-watch">Plan to Watch</option>
                        <option value="dropped">Dropped</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Animate table rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    // Season button handlers
    const seasonBtns = document.querySelectorAll('.season-btn');
    seasonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            seasonBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const season = btn.dataset.season;
            renderAnimeTable(season);
        });
    });

    // Initialize with winter2024
    renderAnimeTable('winter2024');

    // Handle status select changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const animeId = e.target.dataset.animeId;
            const status = e.target.value;
            console.log(`User set ${animeId} to ${status}`);
            // Here you would typically save to localStorage or send to server
            localStorage.setItem(`anime-status-${animeId}`, status);
            
            // Visual feedback
            e.target.style.borderColor = 'var(--color-accent-secondary)';
            setTimeout(() => {
                e.target.style.borderColor = '';
            }, 1000);
        }
    });

    // ============================================
    // MANGA GRID FILTERING
    // ============================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const mangaCards = document.querySelectorAll('.manga-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            
            mangaCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // For staggered children
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in-up class
    document.querySelectorAll('.fade-in-up, .stagger-children').forEach(el => {
        observer.observe(el);
    });
    
    // Add fade-in-up to sections as they scroll into view
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in-up');
        observer.observe(section);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            if (!email || !email.includes('@')) {
                emailInput.style.borderColor = '#ff4757';
                emailInput.focus();
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
                return;
            }
            
            // Simulate form submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                Processing...
            `;
            
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Subscribed!
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ============================================
    // MANGA CARD INTERACTIONS
    // ============================================
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.manga-card');
            const title = card.querySelector('.card-title').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="${card.querySelector('.card-image img').src}" alt="${title}">
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p class="modal-author">${card.querySelector('.author').textContent}</p>
                            <div class="modal-stats">
                                <div class="stat">
                                    <span class="stat-value">${card.querySelector('.rating').textContent}</span>
                                    <span class="stat-label">Rating</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value">${card.querySelectorAll('.card-tags span').length}</span>
                                    <span class="stat-label">Tags</span>
                                </div>
                            </div>
                            <p class="modal-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <div class="modal-actions">
                                <button class="btn btn-primary">Read First Chapter</button>
                                <button class="btn btn-secondary">Add to List</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Animate modal in
            setTimeout(() => modal.classList.add('active'), 10);
            
            // Close handlers
            const closeBtn = modal.querySelector('.modal-close');
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    // Add modal styles dynamically
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .quick-view-modal.active {
            opacity: 1;
            pointer-events: all;
        }
        
        .modal-content {
            background: var(--color-bg-card);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-xl);
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .quick-view-modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: var(--space-md);
            right: var(--space-md);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: var(--color-text-primary);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: var(--color-accent-primary);
            transform: rotate(90deg);
        }
        
        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xl);
            padding: var(--space-xl);
        }
        
        .modal-body img {
            width: 100%;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        }
        
        .modal-info h3 {
            font-size: 1.8rem;
            margin-bottom: var(--space-sm);
            background: var(--color-accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .modal-author {
            color: var(--color-text-muted);
            margin-bottom: var(--space-lg);
        }
        
        .modal-stats {
            display: flex;
            gap: var(--space-xl);
            margin-bottom: var(--space-lg);
        }
        
        .modal-stats .stat {
            text-align: center;
        }
        
        .modal-stats .stat-value {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--color-accent-tertiary);
        }
        
        .modal-stats .stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--color-text-muted);
        }
        
        .modal-description {
            line-height: 1.8;
            margin-bottom: var(--space-xl);
        }
        
        .modal-actions {
            display: flex;
            gap: var(--space-md);
            flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
            
            .modal-body img {
                max-height: 300px;
                object-fit: cover;
            }
        }
    `;
    document.head.appendChild(modalStyles);

    // ============================================
    // SEARCH FUNCTIONALITY (Placeholder)
    // ============================================
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Create search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-container">
                    <input type="text" placeholder="Search anime, manga, characters..." autofocus>
                    <button class="search-close">&times;</button>
                    <div class="search-results">
                        <div class="search-suggestion">
                            <span class="suggestion-icon">🔥</span>
                            <span>Trending: Chainsaw Man</span>
                        </div>
                        <div class="search-suggestion">
                            <span class="suggestion-icon">📚</span>
                            <span>Manga: One Piece Chapter 1105</span>
                        </div>
                        <div class="search-suggestion">
                            <span class="suggestion-icon">👤</span>
                            <span>Character: Gojo Satoru</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(searchOverlay);
            document.body.style.overflow = 'hidden';
            
            const input = searchOverlay.querySelector('input');
            const closeBtn = searchOverlay.querySelector('.search-close');
            const closeSearch = () => {
                searchOverlay.classList.remove('active');
                setTimeout(() => {
                    searchOverlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            searchOverlay.classList.add('active');
            input.focus();
            
            closeBtn.addEventListener('click', closeSearch);
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) closeSearch();
            });
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeSearch();
                    document.removeEventListener('keydown', escHandler);
                }
            });
            
            // Search input handling
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const suggestions = searchOverlay.querySelectorAll('.search-suggestion');
                suggestions.forEach(sugg => {
                    const text = sugg.textContent.toLowerCase();
                    sugg.style.display = text.includes(query) ? 'flex' : 'none';
                });
            });
        });
        
        // Add search overlay styles
        const searchStyles = document.createElement('style');
        searchStyles.textContent = `
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.98);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 15vh;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(20px);
            }
            
            .search-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .search-container {
                width: 100%;
                max-width: 600px;
                position: relative;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .search-overlay.active .search-container {
                transform: translateY(0);
            }
            
            .search-container input {
                width: 100%;
                padding: var(--space-xl) var(--space-2xl);
                background: var(--color-bg-tertiary);
                border: 2px solid var(--color-border);
                border-radius: var(--radius-xl);
                color: var(--color-text-primary);
                font-size: 1.2rem;
                font-family: var(--font-body);
                transition: border-color 0.2s ease;
            }
            
            .search-container input:focus {
                outline: none;
                border-color: var(--color-accent-secondary);
                box-shadow: 0 0 0 4px rgba(5, 217, 232, 0.1);
            }
            
            .search-close {
                position: absolute;
                right: -50px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--color-text-secondary);
                font-size: 2rem;
                cursor: pointer;
                transition: color 0.2s ease;
            }
            
            .search-close:hover {
                color: var(--color-accent-primary);
            }
            
            .search-results {
                margin-top: var(--space-lg);
                background: var(--color-bg-card);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                overflow: hidden;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .search-suggestion {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md) var(--space-lg);
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .search-suggestion:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            
            .suggestion-icon {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(searchStyles);
    }

    // ============================================
    // NAVIGATION SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Update active nav link on scroll
    const sectionsForNav = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sectionsForNav.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ============================================
    // MANGA CARD PROGRESS ANIMATION
    // ============================================
    const observerForProgress = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    const width = progressFill.style.width;
                    progressFill.style.width = '0';
                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 300);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.manga-card').forEach(card => {
        observerForProgress.observe(card);
    });

    // ============================================
    // RANDOM MANGA PANEL ROTATION (Hero)
    // ============================================
    const heroPanels = document.querySelectorAll('.manga-panel');
    if (heroPanels.length) {
        setInterval(() => {
            heroPanels.forEach(panel => {
                const currentRotate = parseFloat(panel.style.transform.replace(/[^0-9\-\.]/g, '')) || 0;
                const newRotate = currentRotate + (Math.random() * 2 - 1);
                panel.style.transform = `rotate(${newRotate}deg)`;
            });
        }, 3000);
    }

    // ============================================
    // COMMUNITY CARD INTERACTIONS
    // ============================================
    document.querySelectorAll('.interact').forEach(btn => {
        btn.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            let count = parseFloat(countSpan.textContent.replace('k', ''));
            
            if (this.classList.contains('like')) {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    count -= 0.1;
                    this.style.color = '';
                } else {
                    this.classList.add('active');
                    count += 0.1;
                    this.style.color = '#ff4757';
                }
                countSpan.textContent = count.toFixed(1) + 'k';
            }
        });
    });

    // ============================================
    // INITIALIZATION COMPLETE
    // ============================================
    console.log('MANGA.ME initialized successfully! 🎌');
    
    // Add loading animation complete
    document.body.classList.add('loaded');
});