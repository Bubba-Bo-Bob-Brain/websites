// ============================================
// DARK AGES PIXEL ART JAVASCRIPT
// Interactive features for immersive medieval experience
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chronicles of the Dark Ages initialized...');
    
    // Initialize all modules
    initDayNightCycle();
    initBellTolling();
    initKingdomMap();
    initPlagueDoctor();
    initManuscriptPages();
    initSeasonalCycle();
    initModal();
    
    // Add some initial animations
    startAmbientAnimations();
    
    // Add pixel grid effect
    createPixelGrid();
});

// ============================================
// DAY/NIGHT CYCLE FUNCTIONALITY
// ============================================

function initDayNightCycle() {
    const dayBtn = document.getElementById('day-btn');
    const nightBtn = document.getElementById('night-btn');
    const body = document.body;
    
    // Set initial state
    if (!body.classList.contains('night-mode')) {
        body.classList.add('day-mode');
    }
    
    dayBtn.addEventListener('click', function() {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
        dayBtn.classList.add('active');
        nightBtn.classList.remove('active');
        
        // Update sky in map
        const pixelMap = document.querySelector('.pixel-map');
        if (pixelMap) {
            pixelMap.style.backgroundColor = '#87CEEB'; // Day sky blue
        }
        
        console.log('Switched to day mode');
    });
    
    nightBtn.addEventListener('click', function() {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        nightBtn.classList.add('active');
        dayBtn.classList.remove('active');
        
        // Update sky in map
        const pixelMap = document.querySelector('.pixel-map');
        if (pixelMap) {
            pixelMap.style.backgroundColor = '#0c1445'; // Night sky dark blue
        }
        
        // Add stars to night sky
        addStarsToSky();
        
        console.log('Switched to night mode');
    });
}

// ============================================
// BELL TOLLING FUNCTIONALITY
// ============================================

function initBellTolling() {
    const bell = document.getElementById('tolling-bell');
    const tollBtn = document.getElementById('toll-btn');
    let isTolling = false;
    
    tollBtn.addEventListener('click', function() {
        if (isTolling) return;
        
        isTolling = true;
        
        // Add tolling animation class
        bell.style.animation = 'bell-toll 0.5s ease-in-out 3';
        
        // Simulate bell sound with visual feedback
        simulateBellSound();
        
        // Update button text
        const originalText = tollBtn.textContent;
        tollBtn.textContent = 'Tolling...';
        tollBtn.disabled = true;
        
        // Reset after animation
        setTimeout(() => {
            bell.style.animation = 'bell-idle 4s infinite ease-in-out';
            tollBtn.textContent = originalText;
            tollBtn.disabled = false;
            isTolling = false;
        }, 1500);
        
        console.log('Bell tolled thrice');
    });
}

function simulateBellSound() {
    // Create visual ripple effect instead of actual sound
    const bellContainer = document.querySelector('.bell-container');
    const ripple = document.createElement('div');
    ripple.className = 'bell-ripple';
    ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        border: 3px solid var(--gold-leaf);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.7;
        z-index: -1;
        pointer-events: none;
    `;
    
    bellContainer.appendChild(ripple);
    
    // Animate ripple
    let size = 0;
    let opacity = 0.7;
    const interval = setInterval(() => {
        size += 5;
        opacity -= 0.05;
        ripple.style.width = `${100 + size}px`;
        ripple.style.height = `${100 + size}px`;
        ripple.style.opacity = opacity;
        
        if (opacity <= 0) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 30);
}

// ============================================
// KINGDOM MAP INTERACTIVITY
// ============================================

function initKingdomMap() {
    const villages = document.querySelectorAll('.map-village');
    const villageName = document.getElementById('village-name');
    const villageDesc = document.getElementById('village-description');
    const statPopulation = document.getElementById('stat-population');
    const statDanger = document.getElementById('stat-danger');
    const statResources = document.getElementById('stat-resources');
    
    // Village data
    const villageData = {
        castle: {
            name: "King's Hold",
            description: "The fortified seat of power in Aethelgard. Home to the royal family, their knights, and a small army of servants. Protected by thick stone walls and a deep moat.",
            population: "850",
            danger: "Low",
            resources: "High",
            illustration: "🏰"
        },
        mill: {
            name: "Millford",
            description: "A riverside village centered around the water mill. Farmers bring their grain here to be ground. The miller is one of the wealthiest commoners in the region.",
            population: "120",
            danger: "Medium",
            resources: "Medium",
            illustration: "🌾"
        },
        monastery: {
            name: "St. Cuthbert's Abbey",
            description: "A Benedictine monastery housing 30 monks. They maintain a scriptorium where illuminated manuscripts are copied, a herb garden, and offer shelter to pilgrims.",
            population: "45",
            danger: "Very Low",
            resources: "Medium",
            illustration: "⛪"
        },
        blackforest: {
            name: "Black Forest Outpost",
            description: "A small settlement on the edge of the ominous Black Forest. Hunters and woodcutters live here, constantly wary of wolves, bandits, and rumored supernatural threats.",
            population: "65",
            danger: "Very High",
            resources: "Low",
            illustration: "🌲"
        }
    };
    
    // Add click handlers to each village
    villages.forEach(village => {
        village.addEventListener('click', function() {
            const villageType = this.getAttribute('data-village');
            const data = villageData[villageType];
            
            if (data) {
                // Update info panel
                villageName.textContent = data.name;
                villageDesc.textContent = data.description;
                statPopulation.textContent = data.population;
                statDanger.textContent = data.danger;
                statResources.textContent = data.resources;
                
                // Add visual feedback
                this.style.animation = 'pulse-glow 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
                
                // Open modal with detailed info
                openVillageModal(data);
                
                console.log(`Selected village: ${data.name}`);
            }
        });
    });
    
    // Add hover effects
    villages.forEach(village => {
        village.addEventListener('mouseenter', function() {
            this.style.zIndex = '20';
        });
        
        village.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.zIndex = '10';
            }
        });
    });
}

// ============================================
// PLAGUE DOCTOR ANIMATION
// ============================================

function initPlagueDoctor() {
    const animateBtn = document.getElementById('animate-doctor');
    const doctorCharacter = document.querySelector('.plague-doctor-character');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    // Animate count-up numbers
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        animateCountUp(stat, target, 2000);
    });
    
    // Doctor walk animation
    animateBtn.addEventListener('click', function() {
        // Disable button during animation
        this.disabled = true;
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="btn-pixel"></span> Walking...';
        
        // Add walking animation
        doctorCharacter.style.animation = 'doctor-walk 2s ease-in-out';
        
        // Make doctor "examine" something
        const cane = document.querySelector('.doctor-cane');
        cane.style.transform = 'rotate(-30deg)';
        
        // Add particle effect (simulated herbs)
        createHerbParticles();
        
        // Reset after animation
        setTimeout(() => {
            doctorCharacter.style.animation = '';
            cane.style.transform = 'rotate(-10deg)';
            animateBtn.disabled = false;
            animateBtn.innerHTML = originalText;
        }, 2000);
        
        console.log('Plague doctor animated');
    });
}

function animateCountUp(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

function createHerbParticles() {
    const doctor = document.querySelector('.plague-doctor-character');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: #8fcb9b;
                border-radius: 50%;
                top: 150px;
                left: 50%;
                z-index: 5;
                pointer-events: none;
            `;
            
            doctor.appendChild(particle);
            
            // Animate particle falling
            let posY = 150;
            let posX = 0;
            let opacity = 1;
            
            const fallInterval = setInterval(() => {
                posY += 2;
                posX += (Math.random() - 0.5) * 3;
                opacity -= 0.03;
                
                particle.style.top = `${posY}px`;
                particle.style.left = `calc(50% + ${posX}px)`;
                particle.style.opacity = opacity;
                
                if (opacity <= 0) {
                    clearInterval(fallInterval);
                    particle.remove();
                }
            }, 30);
        }, i * 100);
    }
}

// ============================================
// MANUSCRIPT PAGE FLIPPING
// ============================================

function initManuscriptPages() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageSpan = document.querySelector('.current-page');
    const totalPagesSpan = document.querySelector('.total-pages');
    const manuscriptTexts = document.querySelectorAll('.manuscript-text');
    const pageTitle = document.querySelector('.page-title');
    const pageNumber = document.querySelector('.page-number');
    
    let currentPage = 1;
    const totalPages = 3;
    
    totalPagesSpan.textContent = totalPages;
    
    // Manuscript content for different pages
    const manuscriptContent = [
        {
            title: "Codex Aethelredi",
            texts: [
                "In the year of our Lord 878, King Alfred defended Wessex against the Great Heathen Army. The kingdom stood at the brink of destruction, yet through faith and fortitude, the Saxon line endured.",
                "Monasteries became centers of learning amidst the chaos, preserving knowledge through beautifully illuminated manuscripts that blended Christian iconography with intricate Celtic knotwork."
            ],
            pageNum: "Folio XII"
        },
        {
            title: "The Monastic Hours",
            texts: [
                "Life in the monastery followed the Divine Office: eight prayer times beginning with Matins at 2 AM. Between prayers, monks copied manuscripts, tended gardens, and brewed ale.",
                "The scriptorium was the heart of monastic learning. Here, scribes worked by candlelight, creating elaborate initials decorated with gold leaf and vibrant pigments made from crushed minerals and plants."
            ],
            pageNum: "Folio XIII"
        },
        {
            title: "Feudal Obligations",
            texts: [
                "Under the feudal system, peasants (villeins) worked their lord's land three days a week. In return, they received protection and the right to farm their own strips in the open field system.",
                "The three-field rotation—spring planting, autumn planting, fallow—prevented soil exhaustion. Yet famine remained a constant threat, especially when harvests failed or armies requisitioned grain."
            ],
            pageNum: "Folio XIV"
        }
    ];
    
    function updatePageContent() {
        const content = manuscriptContent[currentPage - 1];
        
        // Update title
        pageTitle.textContent = content.title;
        
        // Update texts
        manuscriptTexts.forEach((textElem, index) => {
            if (content.texts[index]) {
                textElem.textContent = content.texts[index];
            }
        });
        
        // Update page number
        pageNumber.textContent = content.pageNum;
        
        // Update page indicator
        currentPageSpan.textContent = currentPage;
        
        // Update knight illustration for different pages
        updateKnightIllustration(currentPage);
    }
    
    function updateKnightIllustration(page) {
        const knight = document.querySelector('.pixel-knight');
        const shield = document.querySelector('.knight-shield');
        const caption = document.querySelector('.illustration-caption');
        
        if (page === 1) {
            shield.style.backgroundColor = 'var(--blood-red)';
            caption.textContent = 'A Knight of Wessex';
        } else if (page === 2) {
            shield.style.backgroundColor = 'var(--herb-green)';
            caption.textContent = 'A Monk Scribe';
            // Change knight to monk
            const helmet = document.querySelector('.knight-helmet');
            if (helmet) helmet.style.backgroundColor = 'var(--stone-gray)';
        } else if (page === 3) {
            shield.style.backgroundColor = 'var(--gold-leaf)';
            caption.textContent = 'A Feudal Lord';
        }
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePageContent();
            animatePageTurn('left');
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageContent();
            animatePageTurn('right');
        }
    });
    
    // Initialize with first page
    updatePageContent();
}

function animatePageTurn(direction) {
    const manuscriptPage = document.querySelector('.manuscript-page');
    
    // Create page turn effect
    manuscriptPage.style.transform = direction === 'right' 
        ? 'perspective(1000px) rotateY(-10deg)' 
        : 'perspective(1000px) rotateY(10deg)';
    
    manuscriptPage.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        manuscriptPage.style.transform = 'perspective(1000px) rotateY(0deg)';
    }, 300);
}

// ============================================
// SEASONAL CYCLE FUNCTIONALITY
// ============================================

function initSeasonalCycle() {
    const seasonButtons = document.querySelectorAll('.season-btn');
    const seasonDisplays = document.querySelectorAll('.season-display');
    const currentSeasonElem = document.getElementById('current-season');
    const seasonDetailsElem = document.getElementById('season-details');
    const seasonActivitiesElem = document.getElementById('season-activities');
    const body = document.body;
    
    // Season data
    const seasonData = {
        spring: {
            name: "Spring",
            details: "Spring in medieval Europe marked the end of winter scarcity. Fields were plowed and sown, and Lenten restrictions gave way to Easter celebrations. The risk of famine receded as new growth emerged.",
            activities: [
                "Plowing and sowing fields",
                "Lambing season",
                "Easter celebrations",
                "Repairing winter damage"
            ],
            color: "#8fcb9b"
        },
        summer: {
            name: "Summer",
            details: "Long days meant intense agricultural labor. Haymaking in June, followed by the wheat harvest in July-August. Villages held summer fairs and festivals on saints' days.",
            activities: [
                "Haymaking and harvesting",
                "Summer fairs and markets",
                "Pilgrimages to holy sites",
                "Maintenance of tools and buildings"
            ],
            color: "#ffd166"
        },
        autumn: {
            name: "Autumn",
            details: "The final harvest of grains, fruits, and vegetables. Animals were slaughtered and meat preserved for winter. Michaelmas (September 29) marked the end of the harvest and beginning of autumn.",
            activities: [
                "Final grain harvest",
                "Slaughtering and preserving meat",
                "Gathering nuts and berries",
                "Preparing for winter"
            ],
            color: "#bc6c25"
        },
        winter: {
            name: "Winter",
            details: "A time of scarcity and indoor work. Christmas provided a break with 12 days of feasting. Spinning, weaving, and tool repair occupied the dark hours. Survival depended on stored food.",
            activities: [
                "Indoor crafts and tool repair",
                "Christmas feasting (12 days)",
                "Spinning wool and weaving",
                "Tending to livestock indoors"
            ],
            color: "#a0d2db"
        }
    };
    
    // Set initial season
    setSeason('spring');
    
    // Add event listeners to season buttons
    seasonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Update active states
            seasonButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            seasonDisplays.forEach(display => {
                display.classList.remove('active');
                if (display.getAttribute('data-season') === season) {
                    display.classList.add('active');
                }
            });
            
            // Set season
            setSeason(season);
            
            console.log(`Season changed to: ${season}`);
        });
    });
    
    // Add click handlers to season displays
    seasonDisplays.forEach(display => {
        display.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Update button states
            seasonButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-season') === season) {
                    btn.classList.add('active');
                }
            });
            
            // Update display states
            seasonDisplays.forEach(disp => disp.classList.remove('active'));
            this.classList.add('active');
            
            // Set season
            setSeason(season);
        });
    });
    
    function setSeason(season) {
        // Update CSS variable for season accent
        document.documentElement.style.setProperty('--season-accent', seasonData[season].color);
        
        // Update body class
        body.className = '';
        body.classList.add(season);
        if (body.classList.contains('night-mode')) {
            body.classList.add('night-mode');
        }
        
        // Update season info
        currentSeasonElem.textContent = seasonData[season].name;
        seasonDetailsElem.textContent = seasonData[season].details;
        
        // Update activities list
        seasonActivitiesElem.innerHTML = '';
        seasonData[season].activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            seasonActivitiesElem.appendChild(li);
        });
        
        // Animate progress bars
        animateSeasonProgress(season);
        
        // Update map visuals based on season
        updateMapForSeason(season);
    }
    
    function animateSeasonProgress(season) {
        const progressBars = document.querySelectorAll('.season-progress');
        
        progressBars.forEach(bar => {
            const targetSeason = bar.parentElement.getAttribute('data-season');
            const progress = bar.getAttribute('data-progress');
            
            // Reset width
            bar.style.width = '0%';
            
            // Animate to target width with delay based on season match
            setTimeout(() => {
                if (targetSeason === season) {
                    bar.style.width = `${progress}%`;
                    bar.style.transition = `width 1.5s ease ${progress/100}s`;
                } else {
                    bar.style.width = '0%';
                }
            }, 300);
        });
    }
    
    function updateMapForSeason(season) {
        const map = document.querySelector('.pixel-map');
        const river = document.querySelector('.map-river');
        
        if (!map || !river) return;
        
        // Change map colors based on season
        switch(season) {
            case 'spring':
                map.style.backgroundColor = '#a8e6cf';
                river.style.backgroundColor = '#1e90ff';
                break;
            case 'summer':
                map.style.backgroundColor = '#ffd3b6';
                river.style.backgroundColor = '#00bfff';
                break;
            case 'autumn':
                map.style.backgroundColor = '#ffaaa5';
                river.style.backgroundColor = '#8b4513';
                break;
            case 'winter':
                map.style.backgroundColor = '#dcedc1';
                river.style.backgroundColor = '#4682b4';
                // Add snow effect
                addSnowEffect();
                break;
        }
    }
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================

function initModal() {
    const modal = document.getElementById('village-modal');
    const closeBtn = document.getElementById('modal-close');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

function openVillageModal(villageData) {
    const modal = document.getElementById('village-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalIllustration = document.querySelector('.modal-illustration');
    const modalStats = document.querySelector('.modal-stats');
    
    // Populate modal with village data
    modalTitle.textContent = villageData.name;
    modalDescription.textContent = villageData.description;
    modalIllustration.innerHTML = villageData.illustration;
    
    // Create stats for modal
    modalStats.innerHTML = `
        <div class="stat">
            <span class="stat-label">Population:</span>
            <span class="stat-value">${villageData.population}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Danger Level:</span>
            <span class="stat-value">${villageData.danger}</span>
        </div>
        <div class="stat">
            <span class="stat-label">Resources:</span>
            <span class="stat-value">${villageData.resources}</span>
        </div>
    `;
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('village-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ============================================
// AMBIENT EFFECTS & UTILITIES
// ============================================

function startAmbientAnimations() {
    // Animate castle flag continuously
    const flag = document.querySelector('.flag-cloth');
    if (flag) {
        setInterval(() => {
            flag.style.animation = 'flag-wave 3s infinite ease-in-out';
        }, 3000);
    }
    
    // River flow animation
    const river = document.querySelector('.map-river');
    if (river) {
        river.style.backgroundSize = '200px 100%';
        river.style.backgroundImage = 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.3) 50%)';
        river.style.backgroundRepeat = 'repeat-x';
        river.style.animation = 'river-flow 10s infinite linear';
    }
    
    // Subtle pixel grid pulse
    const pixelGrid = document.querySelector('.pixel-grid');
    if (pixelGrid) {
        setInterval(() => {
            pixelGrid.style.opacity = Math.random() * 0.2 + 0.3;
        }, 3000);
    }
}

function createPixelGrid() {
    const gridContainer = document.querySelector('.map-grid');
    if (!gridContainer) return;
    
    // Create more detailed pixel grid for map
    const gridSize = 20;
    const gridWidth = gridContainer.clientWidth;
    const gridHeight = gridContainer.clientHeight;
    
    for (let x = 0; x < gridWidth; x += gridSize) {
        for (let y = 0; y < gridHeight; y += gridSize) {
            // Occasionally add a "pixel" for texture
            if (Math.random() > 0.95) {
                const pixel = document.createElement('div');
                pixel.style.cssText = `
                    position: absolute;
                    width: ${gridSize}px;
                    height: ${gridSize}px;
                    background-color: rgba(0,0,0,0.1);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                gridContainer.appendChild(pixel);
            }
        }
    }
}

function addStarsToSky() {
    const pixelMap = document.querySelector('.pixel-map');
    if (!pixelMap) return;
    
    // Remove existing stars
    const existingStars = pixelMap.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());
    
    // Add new stars for night mode
    if (document.body.classList.contains('night-mode')) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 3 + 1}px;
                    height: ${Math.random() * 3 + 1}px;
                    background-color: white;
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.7 + 0.3};
                    pointer-events: none;
                    animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
                `;
                pixelMap.appendChild(star);
            }, i * 30);
        }
        
        // Add CSS for twinkling animation
        if (!document.querySelector('#star-animations')) {
            const style = document.createElement('style');
            style.id = 'star-animations';
            style.textContent = `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function addSnowEffect() {
    const pixelMap = document.querySelector('.pixel-map');
    if (!pixelMap) return;
    
    // Remove existing snow
    const existingSnow = pixelMap.querySelectorAll('.snowflake');
    existingSnow.forEach(flake => flake.remove());
    
    // Add snowflakes for winter season
    if (document.body.classList.contains('winter')) {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 5 + 2}px;
                    height: ${Math.random() * 5 + 2}px;
                    background-color: white;
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: ${Math.random() * 0.7 + 0.3};
                    pointer-events: none;
                    filter: blur(${Math.random() * 1}px);
                `;
                pixelMap.appendChild(snowflake);
                
                // Animate snowflake falling
                animateSnowflake(snowflake);
            }, i * 200);
        }
    }
}

function animateSnowflake(snowflake) {
    let posY = -10;
    let posX = parseFloat(snowflake.style.left);
    const speed = Math.random() * 2 + 1;
    const sway = Math.random() * 2 - 1;
    
    const fallInterval = setInterval(() => {
        posY += speed;
        posX += sway * Math.sin(posY / 20);
        
        snowflake.style.top = `${posY}px`;
        snowflake.style.left = `${posX}%`;
        
        // Remove when out of bounds
        if (posY > 110) {
            clearInterval(fallInterval);
            snowflake.remove();
        }
    }, 50);
}

// ============================================
// ADDITIONAL EVENT LISTENERS
// ============================================

// Update stars when switching to night mode
document.addEventListener('click', function(e) {
    if (e.target.id === 'night-btn') {
        setTimeout(addStarsToSky, 300);
    }
});

// Update snow when switching to winter
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('season-btn') && 
        e.target.getAttribute('data-season') === 'winter') {
        setTimeout(addSnowEffect, 300);
    }
});

// Add scroll-based animations
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Hide scroll indicator when scrolling
    if (scrollIndicator && scrollY > 100) {
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 300);
    }
    
    // Parallax effect for castle
    const castle = document.querySelector('.castle-silhouette');
    if (castle) {
        castle.style.transform = `translateX(-50%) translateY(${scrollY * 0.1}px)`;
    }
});

// Initialize tooltips for village icons
document.querySelectorAll('.village-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        const village = this.closest('.map-village');
        const label = village.querySelector('.village-label');
        label.style.transform = 'scale(1.1)';
        label.style.backgroundColor = 'rgba(245, 238, 220, 0.95)';
    });
    
    icon.addEventListener('mouseleave', function() {
        const village = this.closest('.map-village');
        const label = village.querySelector('.village-label');
        label.style.transform = 'scale(1)';
        label.style.backgroundColor = 'rgba(245, 238, 220, 0.9)';
    });
});

// Add a subtle cursor trail effect for pixel feel
let cursorTrail = [];
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.7) { // Only sometimes create trail
        const trailPixel = document.createElement('div');
        trailPixel.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background-color: var(--gold-leaf);
            border-radius: 50%;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 10000;
            opacity: 0.5;
        `;
        document.body.appendChild(trailPixel);
        
        cursorTrail.push(trailPixel);
        
        // Remove after delay
        setTimeout(() => {
            trailPixel.style.opacity = '0';
            trailPixel.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                trailPixel.remove();
                cursorTrail = cursorTrail.filter(p => p !== trailPixel);
            }, 500);
        }, 100);
    }
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c⚔️ CHRONICLES OF THE DARK AGES ⚔️', 'font-family: "Press Start 2P"; font-size: 16px; color: #8b0000;');
console.log('%cPixel Art Medieval Experience Initialized', 'font-family: monospace; color: #d4af37;');
console.log('%cExplore the interactive kingdom map, animate the plague doctor, and experience the seasonal cycle!', 'font-family: monospace; color: #2d5a27;');