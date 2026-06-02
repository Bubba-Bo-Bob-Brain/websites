// scripts.js

class SolarcoreWiki {
    constructor() {
        this.currentSection = 'overview';
        this.sunIntensity = 50;
        this.isLoading = false;
        this.articles = [
            {
                id: 1,
                title: "Solar Panel Integration in Urban Design",
                excerpt: "How photovoltaic systems are being seamlessly integrated into building materials and urban infrastructure.",
                author: "Dr. Elena Verde",
                date: "2024-01-15",
                category: "Technology",
                content: "Modern urban architecture is embracing solar integration like never before. From solar windows that generate power while maintaining transparency to building facades that double as energy collectors, the possibilities are endless. The key innovation lies in perovskite solar cells that can be applied as coatings to existing surfaces, transforming entire city blocks into power-generating networks."
            },
            {
                id: 2,
                title: "Mycelium Networks: The Internet of the Forest",
                excerpt: "Exploring how fungal networks can serve as living data transmission systems.",
                author: "Marcus Fern",
                date: "2024-01-10",
                category: "Ecosystems",
                content: "Mycelium, the vast underground network of fungal threads, has long been nature's internet. Recent research shows that these networks can transmit electrical signals and share information between plants. Scientists are now developing methods to interface these natural networks with digital systems, creating hybrid bio-digital communication networks that could revolutionize how we think about data transmission."
            },
            {
                id: 3,
                title: "Community Solar Gardens",
                excerpt: "Decentralized energy production through shared solar infrastructure.",
                author: "Isabella Sun",
                date: "2024-01-08",
                category: "Communities",
                content: "Community solar gardens represent a paradigm shift in energy distribution. Instead of individual rooftop installations, these shared solar farms allow entire neighborhoods to benefit from renewable energy. Members purchase shares in the garden and receive credits on their energy bills, making solar power accessible to those who cannot install panels on their own properties."
            },
            {
                id: 4,
                title: "Rewilded Cityscapes",
                excerpt: "Transforming urban environments into thriving ecosystems.",
                author: "Dr. James Wildwood",
                date: "2024-01-05",
                category: "Ecosystems",
                content: "Rewilding urban areas involves more than just planting trees. It's about creating self-sustaining ecosystems that can support biodiversity while providing ecosystem services. Green corridors connect fragmented habitats, allowing species to migrate and adapt. Rooftop gardens become wildlife sanctuaries, and abandoned lots transform into native plant meadows that clean the air and manage stormwater naturally."
            },
            {
                id: 5,
                title: "Water Harvesting Innovations",
                excerpt: "Advanced systems for capturing and storing atmospheric moisture.",
                author: "Chen Waterwise",
                date: "2024-01-03",
                category: "Technologies",
                content: "New atmospheric water generation systems can extract liters of water from thin air, even in arid climates. These systems combine fog collection, condensation, and advanced filtration to provide clean water without depleting groundwater resources. Integration with solar power makes these systems completely sustainable, offering hope for water-stressed regions worldwide."
            },
            {
                id: 6,
                title: "Permaculture Design Principles",
                excerpt: "Creating sustainable human settlements modeled after natural ecosystems.",
                author: "Agnes Earth",
                date: "2023-12-28",
                category: "Design",
                content: "Permaculture is based on three core ethics: care for the earth, care for people, and fair share. By observing natural ecosystems, permaculture designers create human settlements that are not only sustainable but regenerative. Food forests, keyline plowing, and integrated animal systems work together to create landscapes that produce abundance while improving soil health and biodiversity."
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startPhotosynthesisLoader();
        this.setupSunMeter();
        this.renderArticles();
        this.loadContent('overview');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                if (section) {
                    this.loadContent(section);
                    this.updateActiveNav(link);
                }
            });
        });

        // Sub-navigation
        document.querySelectorAll('.sub-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section || link.textContent.toLowerCase().replace(/\s+/g, '-');
                this.loadContent(section);
                this.updateActiveNav(link);
                
                // Close mobile menu if open
                document.querySelector('.sidebar').classList.remove('active');
            });
        });

        // Sun meter interaction
        const meterTrack = document.querySelector('.meter-track');
        if (meterTrack) {
            meterTrack.addEventListener('click', (e) => {
                this.adjustSunIntensity(e);
            });
        }

        // FAB
        const fab = document.getElementById('add-article-btn');
        if (fab) {
            fab.addEventListener('click', () => this.addNewArticle());
        }

        // Infobox refresh
        document.querySelectorAll('.infobox-refresh').forEach(button => {
            button.addEventListener('click', () => this.refreshInfobox());
        });

        // Window resize handler for sun meter position
        window.addEventListener('resize', () => {
            this.updateSunMeterPosition();
        });
    }

    startPhotosynthesisLoader() {
        const loader = document.getElementById('photosynthesis-loader');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Animate completion
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 800);
            }
            
            this.updateProgressRing(progress);
        }, 200);
    }

    updateProgressRing(percentage) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        const fill = document.querySelector('.progress-fill');
        const percentText = document.querySelector('.progress-percent');
        
        if (fill) fill.style.strokeDashoffset = offset;
        if (percentText) percentText.textContent = Math.round(percentage) + '%';
    }

    setupSunMeter() {
        this.updateSunMeterPosition();
        this.updateIntensityDisplay();
        
        // Simulate changing sunlight throughout the day
        setInterval(() => {
            if (!this.isLoading) {
                this.simulateSunMovement();
            }
        }, 30000); // Change every 30 seconds
    }

    simulateSunMovement() {
        // Simulate sun movement across the sky
        const randomChange = (Math.random() - 0.5) * 20;
        this.sunIntensity = Math.max(10, Math.min(100, this.sunIntensity + randomChange));
        this.updateSunMeterPosition();
        this.updateIntensityDisplay();
        this.updatePagePalette();
    }

    updateSunMeterPosition() {
        const knob = document.getElementById('meter-knob');
        if (knob) {
            knob.style.left = this.sunIntensity + '%';
        }
    }

    updateIntensityDisplay() {
        const display = document.getElementById('intensity-display');
        if (!display) return;
        
        let intensityLevel = 'LOW';
        let intensityClass = 'low';
        
        if (this.sunIntensity > 66) {
            intensityLevel = 'HIGH';
            intensityClass = 'high';
        } else if (this.sunIntensity > 33) {
            intensityLevel = 'MEDIUM';
            intensityClass = 'medium';
        }
        
        display.textContent = intensityLevel;
        display.className = `intensity-display ${intensityClass}`;
        
        // Update meter fill width
        const meterFill = document.getElementById('meter-fill');
        if (meterFill) {
            meterFill.style.width = this.sunIntensity + '%';
        }
        
        // Update page palette based on intensity
        this.updatePagePalette();
    }

    updatePagePalette() {
        const intensity = this.sunIntensity;
        let rootStyles = '';
        
        if (intensity > 66) {
            // High intensity - warm, golden tones
            rootStyles = `
                --color-warm-beige: #FFF8DC;
                --color-cream: #FFFDD0;
                --color-sky-blue: #87CEEB;
                --color-emerald: #7CCD7C;
            `;
        } else if (intensity > 33) {
            // Medium intensity - balanced
            rootStyles = `
                --color-warm-beige: #F5F5DC;
                --color-cream: #FFFDD0;
                --color-sky-blue: #87CEEB;
                --color-emerald: #50C878;
            `;
        } else {
            // Low intensity - cooler, more shaded
            rootStyles = `
                --color-warm-beige: #F0F0F0;
                --color-cream: #F5F5F5;
                --color-sky-blue: #87CEFA;
                --color-emerald: #4CAF50;
            `;
        }
        
        document.documentElement.style.cssText = rootStyles;
    }

    adjustSunMeterPosition(e) {
        const track = document.querySelector('.meter-track');
        if (!track) return;
        
        const rect = track.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        
        this.sunIntensity = Math.max(10, Math.min(100, percentage));
        this.updateSunMeterPosition();
        this.updateIntensityDisplay();
    }

    loadContent(section) {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const contentArea = document.getElementById('dynamic-content');
        const title = document.getElementById('page-title');
        const subtitle = document.getElementById('page-subtitle');
        const breadcrumb = document.getElementById('breadcrumb-current');
        
        // Show loading state
        contentArea.innerHTML = `
            <div class="loading-state" style="text-align: center; padding: 4rem 0;">
                <div class="sun-core" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
                <p style="font-family: var(--font-cursive); color: var(--color-moss);">Photosynthesizing content...</p>
            </div>
        `;
        
        // Simulate network delay
        setTimeout(() => {
            const content = this.getContentData(section);
            if (content) {
                title.textContent = content.title;
                subtitle.textContent = content.subtitle;
                breadcrumb.textContent = content.breadcrumb;
                
                contentArea.innerHTML = `
                    <article class="content-article">
                        <h2>${content.title}</h2>
                        <p class="lead">${content.lead}</p>
                        <div class="article-body">
                            ${content.body}
                        </div>
                        <div class="article-tags">
                            ${content.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </article>
                `;
                
                // Animate content in
                const article = contentArea.querySelector('.content-article');
                if (article) {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        article.style.transition = 'all 0.6s ease';
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                this.currentSection = section;
            }
            
            this.isLoading = false;
        }, 600 + Math.random() * 400);
    }

    getContentData(section) {
        const contentMap = {
            overview: {
                title: "Overview",
                subtitle: "Welcome to Solarcore - Your Guide to Sustainable Futures",
                breadcrumb: "Overview",
                lead: "Explore a world where technology and nature exist in perfect harmony.",
                body: `
                    <p>Solarcore is a comprehensive encyclopedia dedicated to documenting sustainable technologies, cooperative communities, and rewilded ecosystems in a thriving solarpunk future. Our mission is to preserve and share knowledge about the innovative solutions that make sustainable living possible.</p>
                    <p>From advanced renewable energy systems to community-based governance models, every entry in this wiki represents a step toward a more sustainable and equitable world. We believe that by sharing knowledge and fostering cooperation, we can create resilient systems that work with nature rather than against it.</p>
                    <p>The content here is organized into several key areas, each exploring different aspects of the solarpunk vision. Navigate through the sections to discover the technologies, communities, and ecosystems that make up this vibrant future.</p>
                `,
                tags: ["sustainability", "overview", "introduction"]
            },
            welcome: {
                title: "Welcome to Solarcore",
                subtitle: "A New Era of Sustainable Living",
                breadcrumb: "Overview > Welcome",
                lead: "Discover the principles that guide our sustainable future.",
                body: `
                    <p>Welcome to Solarcore, where the future is being written today. This living document evolves with our collective understanding of what it means to live sustainably in harmony with our planet.</p>
                    <p>Our approach is rooted in three fundamental principles:</p>
                    <ul>
                        <li><strong>Regeneration:</strong> Systems that restore and enhance natural resources</li>
                        <li><strong>Cooperation:</strong> Communities working together for mutual benefit</li>
                        <li><strong>Innovation:</strong> Creative solutions that respect planetary boundaries</li>
                    </ul>
                    <p>Each principle is reflected in the technologies, communities, and ecosystems documented within these pages.</p>
                `,
                tags: ["welcome", "principles", "introduction"]
            },
            principles: {
                title: "Core Principles",
                subtitle: "The Foundation of Sustainable Design",
                breadcrumb: "Overview > Principles",
                lead: "Guiding philosophies that shape our sustainable future.",
                body: `
                    <p>Our principles serve as the compass for all sustainable innovation. They are the foundation upon which resilient systems are built.</p>
                    <div class="principles-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
                        <div style="padding: 1.5rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid var(--color-emerald);">
                            <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--color-forest-dark);">Circular Systems</h3>
                            <p style="font-size: 0.95rem; color: var(--color-moss);">Eliminate waste by design, keeping materials in use at their highest value.</p>
                        </div>
                        <div style="padding: 1.5rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid var(--color-emerald);">
                            <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--color-forest-dark);">Energy Democracy</h3>
                            <p style="font-size: 0.95rem; color: var(--color-moss);">Empower communities to generate, manage, and benefit from their own energy.</p>
                        </div>
                        <div style="padding: 1.5rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid var(--color-emerald);">
                            <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--color-forest-dark);">Regenerative Design</h3>
                            <p style="font-size: 0.95rem; color: var(--color-moss);">Go beyond sustainability to actively restore and improve ecosystems.</p>
                        </div>
                    </div>
                `,
                tags: ["principles", "philosophy", "design"]
            },
            manifesto: {
                title: "Solarpunk Manifesto",
                subtitle: "A Declaration of Hope and Action",
                breadcrumb: "Overview > Manifesto",
                lead: "Articulating the vision for a better world.",
                body: `
                    <p>The solarpunk movement is not just about technology—it's a cultural and philosophical shift in how we imagine and create our future. It's a rejection of dystopian narratives and a commitment to building what we can't yet fully imagine.</p>
                    <blockquote style="margin: 2rem 0; padding: 1.5rem; background: rgba(244, 196, 77, 0.2); border-left: 4px solid var(--color-solar-gold); font-style: italic; color: var(--color-forest-dark);">
                        "We are not waiting for the future—we are building it, one sustainable choice at a time."
                    </blockquote>
                    <p>This manifesto calls us to action: to redesign our systems, to rebuild our communities, and to reimagine our relationship with the natural world. It's a call for creativity, compassion, and courage in the face of unprecedented challenges.</p>
                `,
                tags: ["manifesto", "vision", "philosophy"]
            }
        };
        
        return contentMap[section] || contentMap.overview;
    }

    renderArticles() {
        const grid = document.querySelector('.articles-grid');
        if (!grid) return;
        
        grid.innerHTML = this.articles.map(article => `
            <article class="article-card" data-id="${article.id}">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span>By ${article.author}</span>
                    <span>${article.date}</span>
                </div>
            </article>
        `).join('');
        
        // Add click handlers to article cards
        grid.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('click', () => {
                const articleId = parseInt(card.dataset.id);
                const article = this.articles.find(a => a.id === articleId);
                if (article) {
                    this.loadArticleDetail(article);
                }
            });
        });
    }

    loadArticleDetail(article) {
        const contentArea = document.getElementById('dynamic-content');
        contentArea.innerHTML = `
            <article class="content-article">
                <h2>${article.title}</h2>
                <div class="article-meta" style="margin-bottom: 2rem;">
                    <span>By ${article.author}</span>
                    <span>${article.date}</span>
                    <span>${article.category}</span>
                </div>
                <div class="article-body">
                    <p>${article.content}</p>
                </div>
                <div class="article-tags">
                    ${article.category.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                </div>
                <button class="back-button" style="margin-top: 2rem; padding: 0.5rem 1rem; background: var(--color-solar-gold); border: none; border-radius: var(--border-radius-sm); cursor: pointer; font-family: var(--font-body);">
                    ← Back to Articles
                </button>
            </article>
        `;
        
        // Add back button handler
        const backButton = contentArea.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.renderArticles();
                this.loadContent('overview');
            });
        }
    }

    refreshInfobox() {
        const infobox = document.querySelector('.infobox');
        if (!infobox) return;
        
        // Add refresh animation
        infobox.style.transform = 'scale(0.95)';
        infobox.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            infobox.style.transform = 'scale(1)';
            
            // Update content
            const contents = [
                "In solarpunk communities, mycelium networks serve as living data infrastructure, connecting decentralized nodes through fungal communication patterns.",
                "Solar windows generate power while maintaining transparency, transforming entire city blocks into power-generating networks.",
                "Community solar gardens allow entire neighborhoods to benefit from renewable energy through shared infrastructure.",
                "Rewilded urban corridors connect fragmented habitats, allowing species to migrate and adapt to changing climates."
            ];
            
            const randomContent = contents[Math.floor(Math.random() * contents.length)];
            const contentElement = document.getElementById('infobox-content');
            if (contentElement) {
                contentElement.textContent = randomContent;
            }
            
            const dateElement = infobox.querySelector('.infobox-date');
            if (dateElement) {
                dateElement.textContent = `Updated: ${new Date().toLocaleDateString()}`;
            }
        }, 300);
    }

    addNewArticle() {
        // Simulate adding a new article
        const newArticle = {
            id: Date.now(),
            title: "New Sustainable Innovation",
            excerpt: "Latest breakthrough in sustainable technology...",
            author: "Research Team",
            date: new Date().toISOString().split('T')[0],
            category: "Technology",
            content: "This represents a new advancement in sustainable practices..."
        };
        
        this.articles.unshift(newArticle);
        this.renderArticles();
        
        // Show confirmation
        const originalText = document.querySelector('.fab .plus').textContent;
        const fab = document.querySelector('.fab .plus');
        fab.textContent = '✓';
        
        setTimeout(() => {
            fab.textContent = originalText;
        }, 2000);
    }
}

// Initialize the wiki when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SolarcoreWiki();
});

// Handle scroll effects
window.addEventListener('scroll', () => {
    const sunMeter = document.querySelector('.sun-meter');
    if (sunMeter) {
        const scrollY = window.scrollY;
        sunMeter.style.opacity = Math.max(0.3, 1 - scrollY / 500);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open submenus
        document.querySelectorAll('.sub-nav').forEach(subnav => {
            subnav.style.display = 'none';
        });
    }
});