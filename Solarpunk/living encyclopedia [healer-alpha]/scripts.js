/* ═══════════════════════════════════════════════════════════════
   SOLARIS WIKI — Interactive Systems
   The living brain of the encyclopedia
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Article Content Database ────────────────────────────────
    const articles = {
        'mycoremediation': {
            title: 'Mycoremediation',
            badge: 'Technology',
            status: 'Active Research',
            domain: 'Bioremediation',
            complexity: 'Low–Medium',
            scale: 'Site to Watershed',
            species: '<em>Pleurotus ostreatus</em>,<br><em>Trametes versicolor</em>,<br><em>Stropharia rugosoannulata</em>',
            updated: 'March 2024',
            contributors: '23 gardeners',
            related: [
                { name: 'Forest Networks', article: 'forest-networks' },
                { name: 'Soil Regeneration', article: null },
                { name: 'Bioremediation', article: null },
                { name: 'Mycelium Materials', article: null }
            ],
            seedBank: [
                'Forest Networks',
                'Soil Regeneration', 
                'Bioremediation',
                'Mycelium Materials',
                'Carbon Sequestration',
                'Soil Microbiome'
            ],
            content: `
                <h2>What is Mycoremediation?</h2>
                <p>Mycoremediation is a form of bioremediation that uses fungi to degrade or sequester contaminants in the environment. Fungi, particularly mycelium, possess remarkable enzymatic capabilities to break down complex organic compounds that many other organisms cannot digest.</p>
                
                <p>This process leverages the natural metabolic processes of fungi, which evolved to decompose lignin and cellulose in wood—complex polymers that are structurally similar to many persistent organic pollutants.</p>

                <div class="article-callout">
                    <p>"Fungi are the grand recyclers of the planet, the digestive system of the earth." — Paul Stamets</p>
                </div>

                <h2>How It Works</h2>
                <p>The mycelial network secretes enzymes that break down target compounds into simpler, less harmful substances. These enzymes include:</p>
                <ul>
                    <li><strong>Laccases</strong> — oxidize phenolic compounds</li>
                    <li><strong>Peroxidases</strong> — break down lignin and related pollutants</li>
                    <li><strong>Cytochrome P450</strong> — metabolize a wide range of compounds</li>
                </ul>

                <p>The fungi can be introduced to contaminated sites through various methods:</p>
                <ul>
                    <li>Inoculated wood chips or straw spread over the site</li>
                    <li>Mycelial mats placed in contaminated soil</li>
                    <li>Fungal bioreactors for water treatment</li>
                </ul>

                <h3>Applications in Practice</h3>
                <p>Mycoremediation has been successfully applied to:</p>
                <ul>
                    <li><strong>Oil spills</strong> — Oyster mushrooms (<em>Pleurotus ostreatus</em>) can break down petroleum hydrocarbons</li>
                    <li><strong>Heavy metal contamination</strong> — Certain fungi accumulate or immobilize metals like lead, mercury, and cadmium</li>
                    <li><strong>Pesticide residues</strong> — White rot fungi degrade organochlorine pesticides</li>
                    <li><strong>Plastic pollution</strong> — Some species show ability to break down polyurethane and polyethylene</li>
                </ul>

                <h2>Case Study: The Prestressed Concrete Plane</h2>
                <p>In 1998, after the Exxon Valdez oil spill, Paul Stamets' company Fungi Perfecti deployed mycelium-infused mats to clean contaminated beaches in Alaska. The oyster mushrooms broke down the hydrocarbons in the diesel oil, and within two months, the beach soil showed 95% reduction in petroleum compounds.</p>

                <p>The project also demonstrated the cascading benefits: the fungi enriched the soil, attracting insects, which attracted birds, beginning the process of ecological succession.</p>

                <h2>Integration with Other Systems</h2>
                <p>Mycoremediation works best as part of an integrated ecological approach:</p>
                <ul>
                    <li><strong>Phytoremediation</strong> — Plants and fungi work synergistically; mycorrhizal networks help plants access nutrients while breaking down contaminants</li>
                    <li><strong>Constructed wetlands</strong> — Fungal communities enhance the water purification capacity of wetland systems</li>
                    <li><strong>Companion planting</strong> — Certain plant-fungi combinations accelerate remediation</li>
                </ul>

                <h2>Limitations and Considerations</h2>
                <p>While promising, mycoremediation has limitations:</p>
                <ul>
                    <li>Time-intensive — fungal degradation can take months to years</li>
                    <li>Site-specific — different contaminants require different fungal species</li>
                    <li>Environmental conditions must be carefully managed (moisture, pH, temperature)</li>
                    <li>May not be suitable for high concentrations of certain pollutants</li>
                </ul>

                <h2>Future Directions</h2>
                <p>Research is expanding into:</p>
                <ul>
                    <li>Genetic engineering of fungi for enhanced degradation capabilities</li>
                    <li>Consortium approaches using multiple fungal species</li>
                    <li>Nanotechnology-fungal hybrid systems</li>
                    <li>Application to emerging contaminants like pharmaceuticals and microplastics</li>
                </ul>

                <p>Mycoremediation represents a beautiful example of working with nature's existing processes rather than imposing industrial solutions. It reminds us that the most sophisticated waste management systems have been evolving for millions of years in forest ecosystems.</p>
            `
        },
        'forest-networks': {
            title: 'Forest Networks',
            badge: 'Ecosystem',
            status: 'Active Research',
            domain: 'Forest Ecology',
            complexity: 'High',
            scale: 'Ecosystem to Biome',
            species: '<em>Amanita muscaria</em>,<em>Betula pendula</em>,<em>Picea abies</em>',
            updated: 'February 2024',
            contributors: '34 gardeners',
            related: [
                { name: 'Mycorrhizal Symbiosis', article: null },
                { name: 'Mycelium Networks', article: null },
                { name: 'Carbon Sequestration', article: null },
                { name: 'Old-Growth Forests', article: null }
            ],
            seedBank: [
                'Mycorrhizal Fungi',
                'Tree Communication',
                'Carbon Sequestration',
                'Soil Food Web',
                'Old-Growth Forests',
                'Forest Bathing'
            ],
            content: `
                <h2>The Wood-Wide Web</h2>
                <p>Beneath every forest lies an extraordinary network of communication and resource sharing—a biological internet connecting trees through mycorrhizal fungi. This "wood-wide web" challenges our understanding of forests as collections of individual trees, revealing them instead as cooperative superorganisms.</p>

                <p>The network consists of thread-like fungal hyphae that form symbiotic relationships with tree roots, creating a vast underground marketplace where nutrients, water, and even chemical signals are exchanged.</p>

                <h2>How It Works</h2>
                <p>Mycorrhizal fungi colonize plant roots, extending the root system's reach by up to 700 times. In exchange for sugars from photosynthesis, the fungi provide:</p>
                <ul>
                    <li><strong>Nutrients</strong> — Phosphorus, nitrogen, and micronutrients extracted from soil minerals</li>
                    <li><strong>Water</strong> — Enhanced drought resistance through expanded absorption area</li>
                    <li><strong>Protection</strong> — Chemical defenses against pathogens and herbivores</li>
                </ul>

                <p>But the most remarkable discovery is that trees use these networks to communicate and support each other:</p>

                <h3>Resource Sharing</h3>
                <p>Mother trees, the largest and oldest in the forest, distribute nutrients to younger seedlings through the network. Carbon, nitrogen, and water flow from abundance to need, maintaining forest resilience.</p>

                <h3>Chemical Signaling</h3>
                <p>When attacked by insects, trees send chemical warnings through the fungal network. Neighboring trees receive these signals and preemptively produce defensive compounds before the pests arrive.</p>

                <h3>Recognition and Preference</h3>
                <p>Trees recognize their kin through root exudates and preferentially share resources with their offspring. They also maintain relationships with specific fungal partners, creating consistent trading networks over decades.</p>

                <div class="article-callout">
                    <p>"A forest is much more than what you see. The most productive, cooperative, and complex part of the forest is underground." — Dr. Suzanne Simard</p>
                </div>

                <h2>The Role of Old-Growth Forests</h2>
                <p>Mature and old-growth forests develop the most complex networks. These ancient ecosystems:</p>
                <ul>
                    <li>Store 50% more carbon than younger forests</li>
                    <li>Support greater biodiversity through structural complexity</li>
                    <li>Maintain more stable microclimates and water cycles</li>
                    <li>Contain the largest "mother trees" that serve as network hubs</li>
                </ul>

                <h2>Implications for Conservation</h2>
                <p>Understanding forest networks transforms conservation strategy:</p>
                <ul>
                    <li><strong>Protecting mother trees</strong> is critical for network integrity</li>
                    <li><strong>Selective logging</strong> can fragment networks, reducing forest resilience</li>
                    <li><strong>Reforestation</strong> should prioritize diverse species mixtures to build robust networks</li>
                    <li><strong>Forest connectivity</strong> is as important as area preservation</li>
                </ul>

                <h2>Human Applications</h2>
                <p>We're learning to work with these networks rather than against them:</p>
                <ul>
                    <li><strong>Forest farming</strong> — Cultivating crops under forest canopies using natural nutrient cycles</li>
                    <li><strong>Ecological restoration</strong> — Inoculating plantings with appropriate mycorrhizal fungi</li>
                    <li><strong>Sustainable forestry</strong> — Managing forests as interconnected systems rather than tree plantations</li>
                </ul>

                <p>The discovery of forest networks invites a fundamental shift in perspective: from seeing nature as a collection of resources to recognizing it as a community of relationships. This understanding forms the ecological foundation of solarpunk philosophy.</p>
            `
        },
        'solar-pv': {
            title: 'Solar Photovoltaics',
            badge: 'Technology',
            status: 'Mature Technology',
            domain: 'Renewable Energy',
            complexity: 'Medium–High',
            scale: 'Individual to Grid',
            species: 'Silicon-based, Perovskite, Organic PV, CIGS',
            updated: 'April 2024',
            contributors: '42 gardeners',
            related: [
                { name: 'Energy Storage', article: null },
                { name: 'Smart Grids', article: null },
                { name: 'Building-Integrated PV', article: null },
                { name: 'Photosynthesis Comparison', article: null }
            ],
            seedBank: [
                'Energy Storage',
                'Smart Grids',
                'Building-Integrated PV',
                'Photosynthesis',
                'Perovskite Solar Cells',
                'Community Solar'
            ],
            content: `
                <h2>Beyond Silicon: Next-Generation Solar</h2>
                <p>While silicon solar panels have dominated the market for decades, a new generation of photovoltaic technologies is emerging that promises higher efficiency, lower costs, and greater integration with the built environment.</p>

                <p>These innovations draw inspiration from nature itself—particularly from the very process that powers most life on Earth: photosynthesis.</p>

                <h2>Bio-Inspired Designs</h2>
                <p>Researchers are developing solar cells that mimic natural light-harvesting systems:</p>

                <h3>Artificial Photosynthesis</h3>
                <p>These systems use catalysts and light absorbers to split water into hydrogen and oxygen, creating storable solar fuel. Unlike conventional PV, which produces electricity only when the sun shines, artificial photosynthesis stores energy in chemical bonds.</p>

                <h3>Leaf-Inspired Architectures</h3>
                <p>Leaf-like structures with hierarchical light-trapping features increase absorption across a broader spectrum. Some designs incorporate "leaf venation" patterns for efficient charge collection.</p>

                <h3>Chloroplast Mimicry</h3>
                <p>Researchers are creating synthetic versions of chloroplasts—the organelles where photosynthesis occurs—using self-assembling nanomaterials that capture light and convert it to energy with remarkable efficiency.</p>

                <h2>Perovskite Solar Cells</h2>
                <p>Perhaps the most promising recent development, perovskite solar cells offer:</p>
                <ul>
                    <li><strong>Higher theoretical efficiency</strong> — Up to 31% compared to silicon's 29%</li>
                    <li><strong>Lower manufacturing costs</strong> — Can be printed like newspaper</li>
                    <li><strong>Flexibility</strong> — Can be applied to curved surfaces</li>
                    <li><strong>Tunable properties</strong> — Can be engineered for specific light wavelengths</li>
                </ul>

                <p>Perovskites are crystalline materials that efficiently convert photons to electrons. Their name comes from their crystal structure, similar to the mineral perovskite (calcium titanium oxide).</p>

                <h2>Building-Integrated Photovoltaics (BIPV)</h2>
                <p>The future of solar isn't just on rooftops—it's in the very materials of our buildings:</p>
                <ul>
                    <li><strong>Solar windows</strong> — Transparent or semi-transparent PV that generates electricity while allowing light</li>
                    <li><strong>Solar facades</strong> — Building skins that generate power</li>
                    <li><strong>Solar roof tiles</strong> — Aesthetic alternatives to rack-mounted panels</li>
                    <li><strong>Solar roads and pavements</strong> — Generating power from infrastructure</li>
                </ul>

                <div class="article-callout">
                    <p>"The sun delivers more energy to Earth in one hour than humanity uses in a year. The challenge isn't the resource—it's our harvesting technology."</p>
                </div>

                <h2>Energy Storage Integration</h2>
                <p>Pairing solar with storage solves intermittency:</p>
                <ul>
                    <li><strong>Battery systems</strong> — Lithium-ion, flow batteries, and emerging solid-state designs</li>
                    <li><strong>Hydrogen production</strong> — Using excess solar to produce green hydrogen</li>
                    <li><strong>Thermal storage</strong> — Storing heat for later use</li>
                    <li><strong>Pumped hydro</strong> — Using solar to pump water uphill for later generation</li>
                </ul>

                <h2>Community Solar Models</h2>
                <p>Democratizing solar access through:</p>
                <ul>
                    <li><strong>Community gardens</strong> — Shared solar installations with subscriber models</li>
                    <li><strong>Solar cooperatives</strong> — Member-owned generation projects</li>
                    <li><strong>Virtual net metering</strong> — Allowing off-site participation</li>
                </ul>

                <h2>The Photosynthesis Connection</h2>
                <p>Interestingly, the most efficient solar cells now approach the theoretical maximum efficiency of natural photosynthesis (about 11%). Yet plants achieve something remarkable: they create their own structure, repair themselves, and reproduce—all while capturing carbon.</p>

                <p>This comparison inspires the next frontier: "living" solar cells that incorporate biological components or biomimetic self-repair mechanisms.</p>

                <p>As solar technology advances, it moves beyond mere energy generation toward integration with ecological systems—creating energy landscapes that power human civilization while enhancing rather than diminishing the living world.</p>
            `
        }
    };

    // ─── DOM Elements ────────────────────────────────────────────
    const loadingScreen = document.getElementById('loading-screen');
    const sunlightMeter = document.getElementById('sunlight-meter');
    const meterFill = document.getElementById('meter-fill');
    const meterHandle = document.getElementById('meter-handle');
    const searchInput = document.getElementById('search-input');
    const homeView = document.getElementById('home-view');
    const articleView = document.getElementById('article-view');
    const articleContent = document.getElementById('article-content');
    const articleBreadcrumbTitle = document.getElementById('article-breadcrumb-title');
    const infoboxTitle = document.getElementById('infobox-title');
    const infoboxBadge = document.getElementById('infobox-badge');
    const infoboxStatus = document.getElementById('infobox-status');
    const infoboxDomain = document.getElementById('infobox-domain');
    const infoboxComplexity = document.getElementById('infobox-complexity');
    const infoboxScale = document.getElementById('infobox-scale');
    const infoboxSpecies = document.getElementById('infobox-species');
    const infoboxRelated = document.getElementById('infobox-related');
    const infoboxUpdated = document.getElementById('infobox-updated');
    const infoboxContributors = document.getElementById('infobox-contributors');
    const seedList = document.getElementById('seed-list');
    const heroSun = document.getElementById('hero-sun');
    const ambientParticles = document.getElementById('ambient-particles');

    // ─── State ────────────────────────────────────────────────────
    let sunlightLevel = 0.65;
    let isDraggingMeter = false;

    // ─── Initialization ───────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        // Hide loading screen after a delay
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            initializeScrollReveal();
            createAmbientLeaves();
        }, 2200);

        // Initialize sunlight meter
        initializeSunlightMeter();
        
        // Initialize search shortcut
        initializeSearch();
        
        // Initialize sidebar interactions
        initializeSidebar();
        
        // Initialize scroll-based header effects
        initializeScrollEffects();
    });

    // ─── Sunlight Meter System ────────────────────────────────────
    function initializeSunlightMeter() {
        // Set initial position
        updateSunlightUI(sunlightLevel);
        
        // Mouse events
        sunlightMeter.addEventListener('mousedown', startMeterDrag);
        document.addEventListener('mousemove', dragMeter);
        document.addEventListener('mouseup', stopMeterDrag);
        
        // Touch events
        sunlightMeter.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startMeterDrag(e.touches[0]);
        });
        document.addEventListener('touchmove', (e) => {
            if (isDraggingMeter) {
                e.preventDefault();
                dragMeter(e.touches[0]);
            }
        });
        document.addEventListener('touchend', stopMeterDrag);
        
        // Keyboard control
        sunlightMeter.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                sunlightLevel = Math.max(0, sunlightLevel - 0.05);
                updateSunlightUI(sunlightLevel);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                sunlightLevel = Math.min(1, sunlightLevel + 0.05);
                updateSunlightUI(sunlightLevel);
            }
        });
        
        // Click to set
        sunlightMeter.addEventListener('click', (e) => {
            if (!isDraggingMeter) {
                const rect = sunlightMeter.querySelector('.meter-track').getBoundingClientRect();
                const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                sunlightLevel = percentage;
                updateSunlightUI(sunlightLevel);
            }
        });
    }

    function startMeterDrag(e) {
        isDraggingMeter = true;
        sunlightMeter.style.cursor = 'grabbing';
    }

    function dragMeter(e) {
        if (!isDraggingMeter) return;
        
        const track = sunlightMeter.querySelector('.meter-track');
        const rect = track.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        sunlightLevel = percentage;
        updateSunlightUI(sunlightLevel);
    }

    function stopMeterDrag() {
        isDraggingMeter = false;
        sunlightMeter.style.cursor = '';
    }

    function updateSunlightUI(level) {
        // Update meter UI
        meterFill.style.width = `${level * 100}%`;
        meterHandle.style.left = `${level * 100}%`;
        
        // Update ARIA
        sunlightMeter.setAttribute('aria-valuenow', Math.round(level * 100));
        
        // Update CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--sunlight', level);
        document.documentElement.style.setProperty('--warmth', level * 0.8);
        document.documentElement.style.setProperty('--brightness', 0.95 + level * 0.1);
        
        // Update sun illustration
        if (heroSun) {
            const scale = 0.8 + level * 0.4;
            const opacity = 0.3 + level * 0.7;
            heroSun.style.transform = `scale(${scale})`;
            heroSun.style.opacity = opacity;
            
            // Update sun glow
            const sunBody = heroSun.querySelector('.sun-body');
            if (sunBody) {
                sunBody.style.boxShadow = `
                    0 0 ${40 + level * 40}px rgba(232, 168, 56, ${0.3 + level * 0.3}),
                    0 0 ${80 + level * 60}px rgba(232, 168, 56, ${0.1 + level * 0.15})
                `;
            }
        }
    }

    // ─── Search System ────────────────────────────────────────────
    function initializeSearch() {
        // Focus search with / key
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Clear search with Escape
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.blur();
                searchInput.value = '';
            }
        });
        
        // Search functionality (basic demo)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                // In a real app, this would search articles
                console.log(`Searching for: ${query}`);
                // For now, just show a subtle animation
                searchInput.style.boxShadow = '0 0 0 3px rgba(122, 182, 72, 0.2)';
                setTimeout(() => {
                    searchInput.style.boxShadow = '';
                }, 300);
            }
        });
    }

    // ─── Sidebar Navigation ───────────────────────────────────────
    function initializeSidebar() {
        // Set first section as active
        const firstToggle = document.querySelector('.vine-toggle');
        if (firstToggle) {
            firstToggle.setAttribute('aria-expanded', 'true');
        }
    }

    // Make toggleSection available globally for onclick handlers
    window.toggleSection = function(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        
        // Update active state for toggles
        document.querySelectorAll('.vine-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        button.classList.add('active');
    };

    // ─── View Switching ───────────────────────────────────────────
    window.showHome = function() {
        homeView.classList.add('active');
        articleView.classList.remove('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav-link[data-view="home"]').classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.showArticle = function(articleId) {
        const article = articles[articleId];
        if (!article) return;
        
        // Hide home view, show article view
        homeView.classList.remove('active');
        articleView.classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Update breadcrumb
        articleBreadcrumbTitle.textContent = article.title;
        
        // Update infobox
        infoboxTitle.textContent = article.title;
        infoboxBadge.textContent = article.badge;
        infoboxStatus.innerHTML = `<span class="status-dot"></span> ${article.status}`;
        infoboxDomain.textContent = article.domain;
        infoboxComplexity.textContent = article.complexity;
        infoboxScale.textContent = article.scale;
        infoboxSpecies.innerHTML = article.species;
        infoboxUpdated.textContent = article.updated;
        infoboxContributors.textContent = article.contributors;
        
        // Update related links
        infoboxRelated.innerHTML = article.related.map(item => 
            item.article 
                ? `<a href="#" class="cross-ref" data-article="${item.article}" onclick="showArticle('${item.article}'); return false;">${item.name}</a>`
                : `<span class="cross-ref">${item.name}</span>`
        ).join(', ');
        
        // Update seed bank
        seedList.innerHTML = article.seedBank.map(item => 
            `<a href="#" class="seed-item" onclick="return false;">
                <span class="seed-dot"></span>
                ${item}
            </a>`
        ).join('');
        
        // Update article content
        articleContent.innerHTML = article.content;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update sidebar active state
        document.querySelectorAll('.vine-link').forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim() === article.title) {
                link.classList.add('active');
            }
        });
        
        // Re-initialize scroll reveals for new content
        setTimeout(initializeScrollReveal, 100);
    };

    // Make scrollToSection available globally
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Make sure we're on home view
            showHome();
            
            // Scroll to section
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector(`.nav-link[data-view="${sectionId}"]`).classList.add('active');
            }, 100);
        }
    };

    // ─── Scroll Reveal Animations ─────────────────────────────────
    function initializeScrollReveal() {
        // Add reveal class to cards and sections
        const revealElements = document.querySelectorAll('.article-card, .section-header, .hero-text, .hero-actions');
        
        revealElements.forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });
        
        // Create intersection observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // ─── Ambient Floating Leaves ──────────────────────────────────
    function createAmbientLeaves() {
        if (!ambientParticles) return;
        
        // Create initial batch of leaves
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createLeaf();
            }, i * 800);
        }
        
        // Continue creating leaves periodically
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                createLeaf();
            }
        }, 3000);
    }

    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        leaf.style.left = `${startX}px`;
        leaf.style.top = '-20px';
        
        // Random size
        const size = 8 + Math.random() * 12;
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        
        // Random animation duration
        const duration = 15 + Math.random() * 20;
        leaf.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 2;
        leaf.style.animationDelay = `${delay}s`;
        
        // Random color variation
        const hue = 90 + Math.random() * 30; // Green hues
        const saturation = 40 + Math.random() * 30;
        const lightness = 30 + Math.random() * 20;
        leaf.style.setProperty('--leaf-color', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        
        // Override the ::before color
        leaf.innerHTML = `<div style="
            width: 100%;
            height: 100%;
            border-radius: 0 50% 50% 50%;
            background: var(--leaf-color, var(--leaf-light));
            opacity: 0.35;
        "></div>`;
        
        ambientParticles.appendChild(leaf);
        
        // Remove leaf after animation completes
        setTimeout(() => {
            if (leaf.parentNode) {
                leaf.parentNode.removeChild(leaf);
            }
        }, (duration + delay) * 1000);
    }

    // ─── Scroll-Based Effects ─────────────────────────────────────
    function initializeScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Parallax effect on hero sun
            if (heroSun) {
                const scrollRatio = Math.min(scrollTop / 500, 1);
                heroSun.style.transform = `translateY(${scrollRatio * 30}px) scale(${0.8 + sunlightLevel * 0.4})`;
            }
            
            // Header shadow on scroll
            const header = document.querySelector('.site-header');
            if (header) {
                if (scrollTop > 10) {
                    header.style.boxShadow = '0 2px 12px rgba(44, 36, 22, 0.08)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // ─── Card Hover Effects ───────────────────────────────────────
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.article-card');
        if (card) {
            // Create subtle particle effect on hover
            const rect = card.getBoundingClientRect();
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--leaf-light);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.6;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                animation: particleFade 1s ease-out forwards;
                z-index: 10;
            `;
            card.style.position = 'relative';
            card.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    });

    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFade {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ─── Initialize Active States ─────────────────────────────────
    // Set first article link as active
    const firstArticleLink = document.querySelector('.vine-link');
    if (firstArticleLink) {
        firstArticleLink.classList.add('active');
    }

})();