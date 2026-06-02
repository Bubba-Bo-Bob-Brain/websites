/* ============================================
   CHLORIS — THE LIVING ENCYCLOPEDIA
   JavaScript: Behavior & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    LoadingManager.init();
    ParticleSystem.init();
    SunlightController.init();
    NavigationManager.init();
    ScrollAnimator.init();
    SeedBankFilter.init();
    ArticleViewer.init();
    SearchEngine.init();
    LiveStats.init();
});

/* --- Loading Manager --- */
const LoadingManager = {
    screen: document.getElementById('loading-screen'),
    progressBar: document.querySelector('.loading-progress-bar'),
    app: document.querySelector('.app-container'),
    
    init() {
        // Wait for simulated loading time
        setTimeout(() => {
            this.fadeOut();
        }, 2800);
    },
    
    fadeOut() {
        this.screen.classList.add('hidden');
        
        // Trigger initial scroll animations after loading
        setTimeout(() => {
            ScrollAnimator.observeInitialElements();
        }, 500);
    }
};

/* --- Particle System (Ambient Spores/Pollen) --- */
const ParticleSystem = {
    canvas: document.getElementById('particle-canvas'),
    ctx: null,
    particles: [],
    maxParticles: 60,
    animationId: null,
    width: 0,
    height: 0,
    
    init() {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create initial particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.animate();
    },
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    },
    
    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.3 + 0.1,
            speedX: Math.random() * 0.2 - 0.1,
            opacity: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01
        };
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(p => {
            // Update position
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.pulse) * 0.2;
            p.pulse += p.pulseSpeed;
            
            // Reset if out of bounds
            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;
            
            // Calculate opacity with pulse
            const currentOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
            
            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(120, 160, 100, ${currentOpacity})`;
            this.ctx.fill();
            
            // Add subtle glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(120, 160, 100, ${currentOpacity * 0.2})`;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

/* --- Sunlight Controller --- */
const SunlightController = {
    slider: document.getElementById('sunlight-slider'),
    valueDisplay: document.getElementById('sunlight-value'),
    htmlElement: document.documentElement,
    
    init() {
        if (!this.slider) return;
        
        this.slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.valueDisplay.textContent = `${value}%`;
            this.updatePalette(value);
        });
        
        // Set initial state
        this.updatePalette(parseInt(this.slider.value));
    },
    
    updatePalette(value) {
        let theme;
        if (value < 33) {
            theme = 'dawn';
        } else if (value < 66) {
            theme = 'noon';
        } else {
            theme = 'dusk';
        }
        
        this.htmlElement.setAttribute('data-sunlight', theme);
        
        // Adjust particle opacity based on light
        ParticleSystem.maxParticles = theme === 'noon' ? 80 : theme === 'dusk' ? 40 : 30;
    }
};

/* --- Navigation Manager --- */
const NavigationManager = {
    menuToggle: document.querySelector('.menu-toggle'),
    sidebar: document.getElementById('sidebar'),
    mainContent: document.getElementById('main-content'),
    vineBranches: document.querySelectorAll('.vine-branch'),
    
    init() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Vine branch interactions
        this.vineBranches.forEach(branch => {
            const link = branch.querySelector('.vine-link');
            const subBranch = branch.querySelector('.vine-sub-branch');
            
            if (link && subBranch) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleBranch(branch);
                });
            }
            
            link?.addEventListener('click', (e) => {
                // Handle non-expandable branches (like Featured Article)
                if (!subBranch) {
                    this.setActiveBranch(branch);
                }
            });
        });
    },
    
    toggleSidebar() {
        this.sidebar.classList.toggle('mobile-open');
        
        // Close if open
        if (this.sidebar.classList.contains('mobile-open')) {
            this.sidebar.style.transform = 'translateX(0)';
        } else {
            this.sidebar.style.transform = 'translateX(-100%)';
        }
    },
    
    toggleBranch(branch) {
        const subBranch = branch.querySelector('.vine-sub-branch');
        if (!subBranch) return;
        
        const isExpanded = subBranch.classList.contains('expanded');
        
        // Close all others
        this.vineBranches.forEach(b => {
            const sb = b.querySelector('.vine-sub-branch');
            if (sb) sb.classList.remove('expanded');
            b.classList.remove('vine-branch--active');
        });
        
        // Toggle current
        if (!isExpanded) {
            subBranch.classList.add('expanded');
            branch.classList.add('vine-branch--active');
        }
    },
    
    setActiveBranch(branch) {
        this.vineBranches.forEach(b => b.classList.remove('vine-branch--active'));
        branch.classList.add('vine-branch--active');
    }
};

/* --- Scroll Animator (Intersection Observer) --- */
const ScrollAnimator = {
    observer: null,
    
    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntry(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe initial elements
        this.observeInitialElements();
    },
    
    observeInitialElements() {
        const elements = document.querySelectorAll(
            '.article-card, .community-card, .timeline-entry, .seed-card, .almanac-card, .section-header'
        );
        
        elements.forEach((el, index) => {
            // Add staggered animation delay via inline style
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            
            this.observer.observe(el);
        });
    },
    
    animateEntry(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
};

/* --- Seed Bank Filter --- */
const SeedBankFilter = {
    filterBtns: document.querySelectorAll('.filter-btn'),
    seedCards: document.querySelectorAll('.seed-card'),
    
    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveButton(btn);
                this.filterCards(filter);
            });
        });
    },
    
    setActiveButton(activeBtn) {
        this.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        activeBtn.classList.add('filter-btn--active');
    },
    
    filterCards(category) {
        this.seedCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = '';
                // Trigger reflow for animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
};

/* --- Article Viewer --- */
const ArticleViewer = {
    articleCards: document.querySelectorAll('.article-card'),
    detailView: document.getElementById('article-detail'),
    backBtn: document.getElementById('article-back-btn'),
    mainSections: document.querySelectorAll('section:not(#article-detail)'),
    
    init() {
        this.articleCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showDetail(card.dataset.article);
            });
        });
        
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.hideDetail());
        }
    },
    
    showDetail(articleId) {
        // In a real app, we'd load content based on articleId.
        // Here we just show the static detail view for demonstration.
        if (this.detailView) {
            this.mainSections.forEach(s => s.style.display = 'none');
            this.detailView.classList.add('active');
            this.detailView.style.display = 'block';
            
            // Scroll to top of detail
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Observe elements inside detail view for animation
            setTimeout(() => {
                const detailElements = this.detailView.querySelectorAll('h2, p, ul, blockquote, .wiki-infobox');
                detailElements.forEach((el, i) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 100);
                });
            }, 300);
        }
    },
    
    hideDetail() {
        if (this.detailView) {
            this.detailView.classList.remove('active');
            this.detailView.style.display = 'none';
            this.mainSections.forEach(s => s.style.display = '');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

/* --- Search Engine --- */
const SearchEngine = {
    input: document.getElementById('search-input'),
    suggestions: document.getElementById('search-suggestions'),
    articles: [
        'Bio-Solar Integration',
        'Mycelium Communication Networks',
        'Atmospheric Water Harvesting',
        'Kinetic Pathway Systems',
        'Bioluminescent Urban Lighting',
        'Living Building Materials',
        'The Mycorrhizal Collective',
        'Canopy Villages',
        'River Basin Councils',
        'The Great Rewilding',
        'Coral Resurgence',
        'Urban Forest Corridors'
    ],
    
    init() {
        if (!this.input || !this.suggestions) return;
        
        this.input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterSuggestions(query);
        });
        
        this.input.addEventListener('focus', () => {
            if (this.suggestions.children.length > 0) {
                this.suggestions.classList.add('active');
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.suggestions.classList.remove('active');
            }
        });
    },
    
    filterSuggestions(query) {
        this.suggestions.innerHTML = '';
        
        if (!query) {
            this.suggestions.classList.remove('active');
            return;
        }
        
        const matches = this.articles.filter(title => 
            title.toLowerCase().includes(query)
        );
        
        if (matches.length > 0) {
            matches.forEach(title => {
                const item = document.createElement('a');
                item.href = '#';
                item.className = 'search-suggestion-item';
                item.textContent = title;
                item.style.display = 'block';
                item.style.padding = '0.75rem 1rem';
                item.style.color = 'var(--text-primary)';
                item.style.transition = 'background 0.2s';
                item.addEventListener('mouseenter', () => {
                    item.style.background = 'var(--bg-primary)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                });
                
                this.suggestions.appendChild(item);
            });
            
            this.suggestions.classList.add('active');
        } else {
            this.suggestions.classList.remove('active');
        }
    }
};

/* --- Live Stats (Dynamic Updates) --- */
const LiveStats = {
    articleCount: document.getElementById('article-count'),
    
    init() {
        if (!this.articleCount) return;
        
        // Simulate growth
        setInterval(() => {
            const current = parseInt(this.articleCount.textContent.replace(/,/g, ''));
            if (Math.random() > 0.7) { // 30% chance to increment
                this.articleCount.textContent = (current + 1).toLocaleString();
                
                // Flash effect
                this.articleCount.style.color = 'var(--accent-gold)';
                this.articleCount.style.transform = 'scale(1.1)';
                this.articleCount.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    this.articleCount.style.color = '';
                    this.articleCount.style.transform = '';
                }, 500);
            }
        }, 5000);
    }
};