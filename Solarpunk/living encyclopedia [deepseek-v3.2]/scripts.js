// scripts.js
// Verdant Archive - Solarpunk Wiki JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== Initialize Global Variables =====
    let sunlightIntensity = 0.72; // 0-1 scale
    let activeSection = 'home';
    let seedChart = null;
    
    // ===== DOM Elements =====
    const loadingOverlay = document.getElementById('loadingOverlay');
    const sunlightMeter = document.getElementById('sunlightMeter');
    const meterLevel = document.getElementById('meterLevel');
    const intensityValue = document.getElementById('intensityValue');
    const meterMode = document.getElementById('meterMode');
    const meterToggle = document.getElementById('meterToggle');
    const vineSidebar = document.getElementById('vineSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const searchInput = document.getElementById('searchInput');
    const contributeBtn = document.getElementById('contributeBtn');
    const fab = document.getElementById('fab');
    const infoboxTemplate = document.getElementById('infoboxTemplate');
    const infoboxClose = document.querySelector('.infobox-close');
    const seedChartCanvas = document.getElementById('seedChart');
    const seedCount = document.getElementById('seedCount');
    const ecosystemCount = document.getElementById('ecosystemCount');
    const viabilityRate = document.getElementById('viabilityRate');
    const contributorCount = document.getElementById('contributorCount');
    const articleCount = document.getElementById('articleCount');
    const cardReadmoreButtons = document.querySelectorAll('.card-readmore');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // ===== Photosynthesis Loading Animation =====
    function initLoadingAnimation() {
        // Simulate loading progress
        const chlorophyllProgress = document.querySelector('.chlorophyll-progress');
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            chlorophyllProgress.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                // Fade out loading overlay
                setTimeout(() => {
                    loadingOverlay.style.opacity = '0';
                    loadingOverlay.style.visibility = 'hidden';
                    updateSunlightColors();
                    initSeedChart();
                }, 500);
            }
        }, 100);
    }
    
    // ===== Sunlight Intensity Meter =====
    function initSunlightMeter() {
        // Set initial meter level
        updateMeterDisplay();
        
        // Toggle meter visibility
        meterToggle.addEventListener('click', function() {
            sunlightMeter.style.display = sunlightMeter.style.display === 'none' ? 'block' : 'none';
        });
        
        // Make meter draggable
        makeDraggable(sunlightMeter);
        
        // Click on meter scale to adjust intensity
        const meterScale = document.querySelector('.meter-scale');
        meterScale.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            sunlightIntensity = Math.max(0, Math.min(1, clickPosition));
            updateMeterDisplay();
            updateSunlightColors();
        });
        
        // Random sunlight fluctuations (simulate passing clouds)
        setInterval(() => {
            if (Math.random() > 0.7) {
                const fluctuation = (Math.random() - 0.5) * 0.2;
                sunlightIntensity = Math.max(0.3, Math.min(1, sunlightIntensity + fluctuation));
                updateMeterDisplay();
                updateSunlightColors();
            }
        }, 5000);
    }
    
    function updateMeterDisplay() {
        // Update meter level width
        meterLevel.style.width = `${sunlightIntensity * 100}%`;
        
        // Update intensity value display
        intensityValue.textContent = `${Math.round(sunlightIntensity * 100)}%`;
        
        // Update mode based on intensity
        let mode = '';
        if (sunlightIntensity < 0.2) mode = 'Pre-Dawn';
        else if (sunlightIntensity < 0.4) mode = 'Morning Light';
        else if (sunlightIntensity < 0.6) mode = 'Midday';
        else if (sunlightIntensity < 0.8) mode = 'Golden Hour';
        else mode = 'High Noon';
        
        meterMode.textContent = mode;
        
        // Animate the value change
        intensityValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            intensityValue.style.transform = 'scale(1)';
        }, 200);
    }
    
    function updateSunlightColors() {
        // Update CSS variable
        document.documentElement.style.setProperty('--sunlight-intensity', sunlightIntensity);
        
        // Add subtle pulse animation to meter
        sunlightMeter.style.boxShadow = `0 4px 20px hsla(55, 90%, ${50 + sunlightIntensity * 30}%, 0.3)`;
        
        // Update leaf decorations in sidebar
        updateLeafDecorations();
    }
    
    function updateLeafDecorations() {
        const leafDecorations = document.querySelectorAll('.leaf-decoration');
        leafDecorations.forEach(leaf => {
            leaf.style.backgroundColor = `hsl(135, ${55 + sunlightIntensity * 20}%, ${40 + sunlightIntensity * 30}%)`;
        });
    }
    
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // ===== Vine Navigation =====
    function initNavigation() {
        // Sidebar toggle
        sidebarToggle.addEventListener('click', function() {
            const isCollapsed = vineSidebar.style.width === '80px' || vineSidebar.offsetWidth === 80;
            
            if (isCollapsed) {
                vineSidebar.style.width = '280px';
                // Show text labels
                document.querySelectorAll('.nav-item span, .sidebar-footer span, .stat-label').forEach(el => {
                    el.style.display = 'block';
                });
                // Show leaf decorations
                document.querySelectorAll('.leaf-decoration').forEach(el => {
                    el.style.display = 'block';
                });
                // Expand nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.style.justifyContent = 'flex-start';
                    item.style.padding = 'var(--spacing-sm)';
                });
            } else {
                vineSidebar.style.width = '80px';
                // Hide text labels
                document.querySelectorAll('.nav-item span, .sidebar-footer span, .stat-label').forEach(el => {
                    el.style.display = 'none';
                });
                // Hide leaf decorations
                document.querySelectorAll('.leaf-decoration').forEach(el => {
                    el.style.display = 'none';
                });
                // Center nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.style.justifyContent = 'center';
                    item.style.padding = 'var(--spacing-md)';
                });
            }
        });
        
        // Navigation item clicks
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding section
                showContentSection(section);
                
                // Update breadcrumb
                updateBreadcrumb(section);
                
                // If seedbank section, update chart
                if (section === 'seedbank') {
                    updateSeedChart();
                }
            });
        });
        
        // Animate vines on hover
        const vines = document.querySelectorAll('.vine');
        navItems.forEach((item, index) => {
            item.addEventListener('mouseenter', function() {
                if (vines[index]) {
                    vines[index].style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                    vines[index].style.height = `${250 + Math.random() * 50}px`;
                }
            });
        });
    }
    
    function showContentSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            activeSection = sectionId;
            
            // Scroll to top of section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function updateBreadcrumb(section) {
        const breadcrumbItems = document.querySelectorAll('.bc-item');
        const sectionNames = {
            'home': 'Canopy Home',
            'technologies': 'Sustainable Technologies',
            'communities': 'Cooperative Communities',
            'ecosystems': 'Rewilded Ecosystems',
            'seedbank': 'Seed Bank Index',
            'collaborate': 'Collaborate'
        };
        
        // Update active breadcrumb item
        breadcrumbItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent === sectionNames[section]) {
                item.classList.add('active');
            }
        });
    }
    
    // ===== Search Functionality =====
    function initSearch() {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            // Show search hint if empty
            const searchHint = document.querySelector('.search-hint');
            if (query.length === 0) {
                searchHint.style.opacity = '0.7';
                searchHint.textContent = 'Try "biophilic architecture" or "mycorrhizal networks"';
            } else {
                searchHint.style.opacity = '1';
                searchHint.textContent = `Searching for "${query}"...`;
                
                // In a real app, this would trigger search results
                simulateSearch(query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                performSearch(this.value);
            }
        });
    }
    
    function simulateSearch(query) {
        // Simulate search by highlighting matching terms in cards
        const cards = document.querySelectorAll('.featured-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query) && query.length > 2) {
                card.style.boxShadow = '0 8px 32px hsla(135, 70%, 50%, 0.3)';
                card.style.transform = 'translateY(-5px)';
            } else {
                card.style.boxShadow = '';
                card.style.transform = '';
            }
        });
    }
    
    function performSearch(query) {
        // Show search results modal (simulated)
        alert(`Search functionality would display results for: "${query}"\n\nIn a full implementation, this would show search results from the wiki database.`);
        
        // Animate search input
        searchInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            searchInput.style.transform = 'scale(1)';
        }, 200);
    }
    
    // ===== Seed Bank Chart =====
    function initSeedChart() {
        if (!seedChartCanvas) return;
        
        const ctx = seedChartCanvas.getContext('2d');
        
        // Generate seed data
        const seedCategories = ['Food Crops', 'Native Flora', 'Medicinal', 'Restoration', 'Rare/Endangered'];
        const seedData = seedCategories.map(() => Math.floor(Math.random() * 2000) + 500);
        
        // Update seed count display
        const totalSeeds = seedData.reduce((a, b) => a + b, 0);
        seedCount.textContent = totalSeeds.toLocaleString();
        ecosystemCount.textContent = Math.floor(Math.random() * 50) + 100;
        viabilityRate.textContent = (95 + Math.random() * 5).toFixed(1) + '%';
        
        // Create chart
        seedChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: seedCategories,
                datasets: [{
                    data: seedData,
                    backgroundColor: [
                        'hsl(85, 70%, 60%)',
                        'hsl(135, 70%, 50%)',
                        'hsl(35, 80%, 60%)',
                        'hsl(205, 70%, 60%)',
                        'hsl(325, 70%, 60%)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: "'Space Grotesk', sans-serif",
                                size: 12
                            },
                            color: 'hsl(215, 20%, 25%)',
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: 'hsl(215, 20%, 25%)',
                        bodyColor: 'hsl(215, 20%, 25%)',
                        borderColor: 'hsl(135, 70%, 50%)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = Math.round((value / totalSeeds) * 100);
                                return `${label}: ${value.toLocaleString()} seeds (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
        
        // Add hover effect to chart
        seedChartCanvas.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        seedChartCanvas.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    function updateSeedChart() {
        if (!seedChart) return;
        
        // Update chart with new random data (simulating live updates)
        seedChart.data.datasets[0].data = seedChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 2000) + 500
        );
        
        // Update total seed count
        const totalSeeds = seedChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        seedCount.textContent = totalSeeds.toLocaleString();
        
        // Update chart
        seedChart.update();
        
        // Animate seed stats
        animateCounter(seedCount, 0, totalSeeds, 1500);
        animateCounter(ecosystemCount, 0, parseInt(ecosystemCount.textContent), 1500);
    }
    
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // ===== Wiki Infobox =====
    function initInfobox() {
        // Close infobox
        infoboxClose.addEventListener('click', function() {
            infoboxTemplate.style.display = 'none';
        });
        
        // Show infobox when clicking on cards
        cardReadmoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.featured-card');
                const category = card.getAttribute('data-category');
                const title = card.querySelector('.card-title').textContent;
                
                // Update infobox content
                document.getElementById('infoCategory').textContent = 
                    category === 'technologies' ? 'Sustainable Technology' :
                    category === 'communities' ? 'Cooperative Community' :
                    category === 'ecosystems' ? 'Rewilded Ecosystem' : 'General';
                
                document.getElementById('infoFirstDoc').textContent = 
                    Math.floor(Math.random() * 50) + 2140;
                
                document.getElementById('infoAdoption').textContent = 
                    ['Growing', 'Widespread', 'Experimental', 'Community-Adopted'][Math.floor(Math.random() * 4)];
                
                // Show infobox
                infoboxTemplate.style.display = 'block';
                
                // Position near the clicked card
                const cardRect = card.getBoundingClientRect();
                infoboxTemplate.style.top = `${cardRect.top + window.scrollY}px`;
                infoboxTemplate.style.right = '20px';
                infoboxTemplate.style.transform = 'translateY(0)';
            });
        });
        
        // Close infobox when clicking outside
        document.addEventListener('click', function(e) {
            if (!infoboxTemplate.contains(e.target) && 
                !e.target.closest('.card-readmore') && 
                infoboxTemplate.style.display === 'block') {
                infoboxTemplate.style.display = 'none';
            }
        });
    }
    
    // ===== Contribution System =====
    function initContribution() {
        // Contribute button
        contributeBtn.addEventListener('click', function() {
            showContentSection('collaborate');
            // Highlight the collaborate nav item
            navItems.forEach(item => item.classList.remove('active'));
            document.querySelector('.nav-item[data-section="collaborate"]').classList.add('active');
        });
        
        // Floating Action Button
        fab.addEventListener('click', function() {
            // Quick contribution modal
            const quickContribution = `
                <div class="quick-contribution-modal">
                    <h3>Quick Contribution</h3>
                    <p>Add a brief note, fact, or correction to the archive.</p>
                    <textarea placeholder="Share your knowledge..."></textarea>
                    <div class="modal-buttons">
                        <button class="btn-secondary">Cancel</button>
                        <button class="btn-primary">Submit</button>
                    </div>
                </div>
            `;
            
            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = quickContribution;
            document.body.appendChild(modal);
            
            // Style the modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            
            const modalContent = modal.querySelector('.quick-contribution-modal');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = 'var(--spacing-lg)';
            modalContent.style.borderRadius = 'var(--radius-lg)';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.boxShadow = 'var(--shadow-lg)';
            
            // Close modal when clicking outside or cancel
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.classList.contains('btn-secondary')) {
                    document.body.removeChild(modal);
                }
            });
            
            // Submit button
            modal.querySelector('.btn-primary').addEventListener('click', function() {
                const textarea = modal.querySelector('textarea');
                if (textarea.value.trim()) {
                    alert(`Thank you for your contribution!\n\n"${textarea.value}"\n\nYour submission has been added to the moderation queue.`);
                    document.body.removeChild(modal);
                    
                    // Update contributor count
                    const currentCount = parseInt(contributorCount.textContent.replace(',', ''));
                    contributorCount.textContent = (currentCount + 1).toLocaleString();
                }
            });
        });
        
        // Filter buttons in seedbank
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Animate filter change
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // In a real app, this would filter seed entries
                simulateFilter(this.textContent);
            });
        });
    }
    
    function simulateFilter(filter) {
        const seedbankGrid = document.querySelector('.seedbank-grid');
        if (!seedbankGrid) return;
        
        // Clear existing content
        seedbankGrid.innerHTML = '';
        
        // Generate filtered seed entries
        const seedEntries = [
            { name: 'Heritage Tomato (Solanum lycopersicum)', type: 'Food Crops', region: 'Global' },
            { name: 'Coastal Live Oak (Quercus agrifolia)', type: 'Native Flora', region: 'California' },
            { name: 'Purple Coneflower (Echinacea purpurea)', type: 'Medicinal', region: 'North America' },
            { name: 'Riverbank Lupine (Lupinus rivularis)', type: 'Restoration', region: 'Pacific Northwest' },
            { name: 'Ghost Orchid (Dendrophylax lindenii)', type: 'Rare/Endangered', region: 'Florida' },
            { name: 'Ancient Wheat (Triticum monococcum)', type: 'Food Crops', region: 'Mediterranean' },
            { name: 'Coastal Redwood (Sequoia sempervirens)', type: 'Native Flora', region: 'California' },
            { name: 'Willow Bark (Salix alba)', type: 'Medicinal', region: 'Eurasia' }
        ];
        
        // Filter entries
        const filteredEntries = filter === 'All' ? 
            seedEntries : 
            seedEntries.filter(entry => entry.type === filter);
        
        // Create seed entry cards
        filteredEntries.forEach(entry => {
            const seedCard = document.createElement('div');
            seedCard.className = 'seed-entry';
            seedCard.innerHTML = `
                <div class="seed-entry-content">
                    <h4>${entry.name}</h4>
                    <div class="seed-entry-meta">
                        <span class="seed-type">${entry.type}</span>
                        <span class="seed-region">${entry.region}</span>
                    </div>
                    <div class="seed-entry-viability">
                        <div class="viability-bar">
                            <div class="viability-fill" style="width: ${85 + Math.random() * 15}%"></div>
                        </div>
                        <span class="viability-text">Viability: ${(85 + Math.random() * 15).toFixed(1)}%</span>
                    </div>
                </div>
            `;
            
            // Style the seed card
            seedCard.style.backgroundColor = 'white';
            seedCard.style.borderRadius = 'var(--radius-md)';
            seedCard.style.padding = 'var(--spacing-md)';
            seedCard.style.boxShadow = 'var(--shadow-sm)';
            seedCard.style.border = '1px solid rgba(0, 0, 0, 0.05)';
            seedCard.style.transition = 'all 0.3s ease';
            
            seedCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
            
            seedCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
            
            seedbankGrid.appendChild(seedCard);
        });
        
        // If no entries, show message
        if (filteredEntries.length === 0) {
            seedbankGrid.innerHTML = `
                <div class="no-seeds-message">
                    <i class="fas fa-seedling"></i>
                    <p>No seed entries match the filter "${filter}".</p>
                    <button class="btn-primary">Add Seed Entry</button>
                </div>
            `;
        }
    }
    
    // ===== Live Stats Updates =====
    function initLiveStats() {
        // Simulate live updates to contributor and article counts
        setInterval(() => {
            // Random chance to update stats
            if (Math.random() > 0.8) {
                const currentContributors = parseInt(contributorCount.textContent.replace(',', ''));
                const currentArticles = parseInt(articleCount.textContent.replace(',', ''));
                
                // Small random increments
                contributorCount.textContent = (currentContributors + Math.floor(Math.random() * 3)).toLocaleString();
                articleCount.textContent = (currentArticles + Math.floor(Math.random() * 5)).toLocaleString();
                
                // Animate the update
                contributorCount.style.transform = 'scale(1.2)';
                articleCount.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    contributorCount.style.transform = 'scale(1)';
                    articleCount.style.transform = 'scale(1)';
                }, 300);
            }
        }, 10000); // Every 10 seconds
    }
    
    // ===== Initialize Everything =====
    function init() {
        initLoadingAnimation();
        initSunlightMeter();
        initNavigation();
        initSearch();
        initInfobox();
        initContribution();
        initLiveStats();
        
        // Add texture to cards on load
        setTimeout(() => {
            document.querySelectorAll('.featured-card').forEach(card => {
                card.style.backgroundImage = `linear-gradient(to bottom, transparent, rgba(255,255,255,0.8)), ${getComputedStyle(document.documentElement).getPropertyValue('--texture-plant')}`;
            });
        }, 1000);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Escape to close infobox
            if (e.key === 'Escape' && infoboxTemplate.style.display === 'block') {
                infoboxTemplate.style.display = 'none';
            }
        });
        
        // Add subtle parallax effect to background texture
        window.addEventListener('scroll', function() {
            const textureOverlay = document.querySelector('.texture-overlay');
            const scrollY = window.scrollY;
            textureOverlay.style.transform = `translateY(${scrollY * 0.1}px)`;
        });
    }
    
    // Start the application
    init();
});