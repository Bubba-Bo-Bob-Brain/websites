/**
 * CARTOGRAPHICA AETERNA - Interactive Ancient Atlas
 * Master Script for Immersive World Exploration
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // DATA ARCHIVE - The Ancient Knowledge Base
    // ==========================================
    
    const atlasData = {
        regions: {
            aethoria: {
                name: "Aethoria",
                epithet: "The Skyborne Kingdom",
                color: "#4A90E2",
                eras: {
                    dawn: {
                        status: "nascent",
                        description: "Floating islands first torn from the earth by the Wind Titans. The first cloud-weavers establish villages on the drifting crags.",
                        borders: "Contested by mountain clans below"
                    },
                    apex: {
                        status: "golden",
                        description: "The Sky Citadel reaches its zenith. Aethorian airships patrol trade winds, and cloud-farms produce legendary storm-silk.",
                        borders: "Dominion over western skies"
                    },
                    fracture: {
                        status: "declining",
                        description: "The Great Calm grounds the floating isles. Without wind magic, the kingdom crashes to earth, becoming mountain fortresses.",
                        borders: "Besieged by Vyrstamm iron legions"
                    }
                },
                lore: "Born when the Titan of Storms shattered the peaks of Vyrstamm, Aethoria's islands float on captured tempests. The Aethorians are wingless angels who weave clouds into architecture and harvest lightning in crystal jars. Their capital, Stratosphira, never touches ground.",
                trade: [
                    "Storm-silk textiles (lighter than air)",
                    "Captured lightning (energy source)",
                    "Cloud pearls (solidified mist gems)",
                    "Aerial cartography services",
                    "Wind enchantments for ships"
                ],
                mythology: "The Aethorians worship Zephyros, the First Wind, who they believe exhales constantly to keep their islands aloft. They fear the Day of Stillness prophesied in the Scar's whispers.",
                cities: ["Stratosphira", "Cirrus Reach", "Nimbus Hold"],
                mythSites: ["The Titan Gate", "Storm's Cradle"]
            },
            
            kharthoum: {
                name: "Kharthoum",
                epithet: "Empire of Eternal Sands",
                color: "#D4AF37",
                eras: {
                    dawn: {
                        status: "tribal",
                        description: "Nomadic tribes unite under the First Sultan. The discovery of water-magic beneath the dunes allows settlement.",
                        borders: "Shifting tribal territories"
                    },
                    apex: {
                        status: "imperial",
                        description: "The Golden Age. Kharthoum controls the Spice Road. Their librarians preserve knowledge in glass amber, resistant to time.",
                        borders: "From the Jade Delta to the Obsidian Coast"
                    },
                    fracture: {
                        status: "shattered",
                        description: "The Sand Plague turns the capital's libraries to dust. The empire fragments into warring city-states, each hoarding water-magic.",
                        borders: "Isolated oasis strongholds"
                    }
                },
                lore: "Built atop an ocean trapped beneath desert stone, Kharthoum's aqueducts run with water drawn from fossil seas. The Golden Library contains texts written in sunlight on indestructible glass. Their armies ride sand-ships across the dunes.",
                trade: [
                    "Spices (fire-pepper, ghost-cinnamon)",
                    "Glass books and solar inscriptions",
                    "Dune-silk carpets",
                    "Fossil water (purified ancient seas)",
                    "Amber preservation magic"
                ],
                mythology: "They believe the world is a buried ocean and the sky its reflection. Their pharaohs become 'Sand Saints' upon death, their bodies desiccated into guardians of the dunes.",
                cities: ["Aureum", "Glass Library", "The Sinking Oasis"],
                mythSites: ["The Amber Archive", "Sun-Blessed Pyramid"]
            },
            
            vyrstamm: {
                name: "Vyrstamm",
                epithet: "The Iron Peaks",
                color: "#5C5C5C",
                eras: {
                    dawn: {
                        status: "clan-based",
                        description: "Mountain clans mine the first veins of sky-iron. Deep halls carved into the peaks become clanholds.",
                        borders: "Territory measured in vertical fathoms"
                    },
                    apex: {
                        status: "unified",
                        description: "The Mountain King forges the Iron Crown, binding all clans. Their forges create weapons that sing when swung.",
                        borders: "The unbroken spine of the continent"
                    },
                    fracture: {
                        status: "besieged",
                        description: "The Scar's influence awakens stone-giants. Vyrstamm fights a war on two fronts: above against Aethoria, below against the awakening earth.",
                        borders: "Retreating to defensible peaks"
                    }
                },
                lore: "Carved into the bones of the world, Vyrstamm's halls extend miles underground. The Deep Dwarves have bred mushrooms that glow with permanent light and goats that eat stone. Their forges work with metals not found on the surface.",
                trade: [
                    "Sky-iron weapons (never rust)",
                    "Glow-moss lanterns",
                    "Stone-bread (dwarven rations)",
                    "Geothermal heating crystals",
                    "Mountain honey (from cliff bees)"
                ],
                mythology: "They worship the Stone That Sleeps Below, believing mountains are petrified titans. Mining is prayer; forging is worship. They fear the 'Waking' when mountains stand and walk.",
                cities: ["Thrumhold", "Deepreach", "Iron Crown Peak"],
                mythSites: ["The World Tree Roots", "Titan's Toe"]
            },
            
            zhenlu: {
                name: "Zhen'Lu",
                epithet: "Rivers of Jade",
                color: "#2E8B57",
                eras: {
                    dawn: {
                        status: "river kingdoms",
                        description: "Jade empires rise along the great rivers. The first Dragon Empress unites the floating villages.",
                        borders: "Following the river networks"
                    },
                    apex: {
                        status: "prosperous",
                        description: "The Jade Court perfects agriculture. Their rice feeds half the world. The River Dragons are worshipped as bringers of monsoons.",
                        borders: "From source to delta, all waters theirs"
                    },
                    fracture: {
                        status: "corrupted",
                        description: "The Scar poisons the great rivers. The Jade turns black. Zhen'Lu becomes a marsh empire of desperate survival.",
                        borders: "Contaminated territories quarantined"
                    }
                },
                lore: "Where rivers run green with jade sediment, Zhen'Lu's people build floating gardens. They cultivate rice that glows at night and silk from spiders the size of dogs. Their bureaucrats use living jade abacuses that predict crop yields.",
                trade: [
                    "Jade rice (nutrient-dense)",
                    "Spider-silk robes",
                    "Living abacuses (jade calculators)",
                    "Flood prediction services",
                    "River dragon scales (medicinal)"
                ],
                mythology: "The Dragon Emperors are believed to transform into river dragons upon death, guarding the waterways. The Black Water Prophecy warns of the Scar's poison reaching the sea.",
                cities: ["Jade Throne", "Floating Gardens", "Spider Spire"],
                mythSites: ["Dragon Gate", "Jade Spring"]
            },
            
            nordheim: {
                name: "Nordheim",
                epithet: "Realm of Frost",
                color: "#B0E0E6",
                eras: {
                    dawn: {
                        status: "frozen tribes",
                        description: "Survivors of the Long Night form clans. Ice-shamans learn to speak with the aurora borealis.",
                        borders: "The shifting ice shelves"
                    },
                    apex: {
                        status: "crystalline",
                        description: "The Ice Palace stands complete, carved from a single glacier. Their aurora-mages predict the future in northern lights.",
                        borders: "Guardians of the northern passage"
                    },
                    fracture: {
                        status: "retreating",
                        description: "The Scar's heat melts the southern glaciers. Nordheim becomes a nation of refugees, their ice-magic weakening.",
                        borders: "Desperate expansion southward"
                    }
                },
                lore: "In the endless winter, Nordheimers build cities within glaciers. They hunt leviathans beneath ice shelves and weave aurora light into clothing. Their berserkers freeze themselves before battle, thawing only to kill.",
                trade: [
                    "Leviathan ivory",
                    "Aurora cloth (light-emitting fabric)",
                    "Glacier wine (fermented in ice)",
                    "Frost-resistant lumber",
                    "Prophecy readings (aurora interpretation)"
                ],
                mythology: "They believe the world is ending in ice, and the Scar is the 'Wound that Bleeds Heat'—an unnatural aberration. Their shamans seek to freeze the Scar closed.",
                cities: ["Aurora Spire", "Leviathan Port", "Frozen Throne"],
                mythSites: ["The World Tree", "Aurora Well"]
            },
            
            scar: {
                name: "The Scar",
                epithet: "Wound of the World",
                color: "#8B0000",
                eras: {
                    dawn: {
                        status: "sealed",
                        description: "A mere canyon. Nomads avoid it. Whispers of strange dreams near its edges.",
                        borders: "Natural canyon walls"
                    },
                    apex: {
                        status: "awakening",
                        description: "The Scar begins to widen. Nightmares plague nearby kingdoms. First reports of 'void-touched' creatures.",
                        borders: "Expanding exclusion zone"
                    },
                    fracture: {
                        status: "apocalyptic",
                        description: "The Scar yawns open, swallowing armies. Reality frays at its edges. It becomes a realm of madness and impossible geometry.",
                        borders: "None - it consumes all"
                    }
                },
                lore: "A canyon that descends into absolute blackness, where the laws of nature fray. The Scar whispers to sleepers, promising power in exchange for pieces of their souls. Those who enter rarely return, and those who do speak of cities of obsidian glass and inverted stars.",
                trade: [
                    "VOID SILENCE (Trade forbidden)",
                    "Obsidian tears (cursed)",
                    "Whisper-crystals (illegal)",
                    "Soul gems (theoretical)",
                    "Reality maps (useless, as they change)"
                ],
                mythology: "Some say it is where the Creator's sword fell and wounded the world. Others claim it is the mouth of a world-devouring serpent. All agree: it is growing, and it is hungry.",
                cities: ["None (The Hollow City)", "Threshold", "The Breach"],
                mythSites: ["The Void Nexus", "Reality's Edge"]
            }
        },
        
        routes: {
            "spice-road": {
                name: "The Spice Road",
                description: "Caravans traverse the desert edge between Kharthoum and Zhen'Lu. The most profitable route, guarded by sand-ships and merchant princes.",
                goods: "Spices, Jade, Silk, Glass Books",
                danger: "Sand storms, Bandit clans, Scar-creatures (in later eras)"
            },
            "sky-bridge": {
                name: "The Sky Bridges",
                description: "Aethorian sky-ships lower silk ladders to Vyrstamm peaks, trading storm-energy for sky-iron. Only the bravest merchants dare the heights.",
                goods: "Lightning, Iron, Cloud-pearls, Forge-tools",
                danger: "High winds, Lightning storms, Air pirates"
            },
            "iron-path": {
                name: "The Iron Path",
                description: "Mountain tunnels connecting Nordheim to Vyrstamm. Cold iron meets cold ice. Dwarven engineering keeps the passes open year-round.",
                goods: "Ice-wine, Sky-iron, Aurora-cloth, Stone-bread",
                danger: "Avalanches, Ice wraiths, Cave-ins"
            },
            "pilgrims-end": {
                name: "Pilgrim's End",
                description: "The road to The Scar. Technically trade, but more accurately described as 'offerings to the abyss.' Madmen and desperate kings send treasures here to appease the darkness.",
                goods: "Gold, Sacrifices, Prophecies, Desperation",
                danger: "Madness, Reality breaks, Death"
            }
        },
        
        mythSites: {
            "titan-gate": {
                name: "The Titan Gate",
                location: "Between Aethoria and Vyrstamm",
                lore: "Where the Wind Titan and Stone Titan fought. The gate is said to open only when both elements agree, allowing passage between sky and deep earth."
            },
            "world-tree": {
                name: "Yggdrasil's Shadow",
                location: "Nordheim/Vyrstamm border",
                lore: "The roots of the World Tree pierce reality here. Druids and shamans meet in neutral ground to listen to the tree's prophecies."
            },
            "void-nexus": {
                name: "The Void Nexus",
                location: "Heart of The Scar",
                lore: "The absolute center of the wound. Here, gravity reverses, time flows sideways, and the dead speak truths. None return unchanged."
            }
        },
        
        eras: {
            dawn: {
                name: "The Dawn",
                date: "3000 BCE",
                description: "The age of founding. Kingdoms are young, magic is wild and untamed. The Scar is merely a canyon.",
                tradeActivity: 0.3,
                scarThreat: 0.1
            },
            apex: {
                name: "The Apex",
                date: "1200 BCE",
                description: "The golden age of trade and cooperation. All kingdoms connected. The Scar begins to whisper.",
                tradeActivity: 1.0,
                scarThreat: 0.4
            },
            fracture: {
                name: "The Fracture",
                date: "400 BCE",
                description: "War and collapse. The Scar yawns wide. Trade routes become invasion paths. The world edges toward apocalypse.",
                tradeActivity: 0.2,
                scarThreat: 1.0
            }
        }
    };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    let currentState = {
        era: 'apex',
        selectedRegion: null,
        selectedRoute: null,
        isAnimating: true,
        caravanSpeed: 1
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const elements = {
        regions: document.querySelectorAll('.region'),
        routes: document.querySelectorAll('.trade-route'),
        caravans: document.querySelectorAll('.caravan-marker'),
        mythSites: document.querySelectorAll('.myth-site'),
        cities: document.querySelectorAll('.city'),
        legendItems: document.querySelectorAll('.legend-item'),
        eraButtons: document.querySelectorAll('.era-button'),
        tooltip: document.getElementById('map-tooltip'),
        infoPanel: {
            default: document.querySelector('.info-default-state'),
            detail: document.querySelector('.info-detail-state'),
            title: document.querySelector('.info-title'),
            regionName: document.querySelector('.region-name'),
            regionEpithet: document.querySelector('.region-epithet'),
            loreContent: document.querySelector('.lore-content'),
            tradeList: document.querySelector('.trade-list'),
            mythContent: document.querySelector('.myth-content'),
            eraValue: document.querySelector('.era-value')
        },
        modal: document.getElementById('lore-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalSubtitle: document.querySelector('.modal-subtitle'),
        modalText: document.querySelector('.modal-text'),
        modalClose: document.querySelector('.modal-close'),
        timelineProgress: document.querySelector('.timeline-progress')
    };

    // ==========================================
    // CARAVAN ANIMATION SYSTEM
    // ==========================================
    
    class CaravanAnimator {
        constructor() {
            this.caravans = [];
            this.animationFrame = null;
            this.init();
        }

        init() {
            elements.caravans.forEach((caravan, index) => {
                const routeId = caravan.getAttribute('data-route');
                const routeElement = document.getElementById(routeId.replace('route-', 'route-'));
                
                if (routeElement) {
                    this.caravans.push({
                        element: caravan,
                        path: routeElement,
                        length: routeElement.getTotalLength(),
                        progress: Math.random() * 100, // Random start position
                        speed: 0.2 + (Math.random() * 0.1), // Varied speeds
                        direction: 1
                    });
                }
            });
            
            this.animate();
        }

        animate() {
            if (!currentState.isAnimating) return;
            
            this.caravans.forEach(caravan => {
                // Update progress
                caravan.progress += caravan.speed * caravan.direction * currentState.caravanSpeed;
                
                // Loop around
                if (caravan.progress > 100) {
                    caravan.progress = 0;
                } else if (caravan.progress < 0) {
                    caravan.progress = 100;
                }
                
                // Calculate position
                const point = caravan.path.getPointAtLength(
                    (caravan.progress / 100) * caravan.length
                );
                
                // Update position
                caravan.element.setAttribute('cx', point.x);
                caravan.element.setAttribute('cy', point.y);
                
                // Add slight bobbing motion
                const bobbing = Math.sin(Date.now() / 500 + caravan.progress) * 2;
                caravan.element.style.transform = `translateY(${bobbing}px)`;
            });
            
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }

        setSpeed(multiplier) {
            currentState.caravanSpeed = multiplier;
        }

        pause() {
            currentState.isAnimating = false;
            cancelAnimationFrame(this.animationFrame);
        }

        resume() {
            currentState.isAnimating = true;
            this.animate();
        }
    }

    // ==========================================
    // INTERACTION HANDLERS
    // ==========================================
    
    function initInteractions() {
        // Region Interactions
        elements.regions.forEach(region => {
            region.addEventListener('click', handleRegionClick);
            region.addEventListener('mouseenter', handleRegionHover);
            region.addEventListener('mouseleave', handleRegionLeave);
            region.addEventListener('mousemove', updateTooltipPosition);
        });

        // Trade Route Interactions
        elements.routes.forEach(route => {
            route.addEventListener('click', handleRouteClick);
            route.addEventListener('mouseenter', handleRouteHover);
            route.addEventListener('mouseleave', handleRouteLeave);
        });

        // Myth Site Interactions
        elements.mythSites.forEach(site => {
            site.addEventListener('click', handleMythClick);
            site.addEventListener('mouseenter', (e) => {
                const mythId = e.currentTarget.getAttribute('data-myth');
                const myth = atlasData.mythSites[mythId];
                showTooltip(e, myth.name, "Click to reveal sacred knowledge");
            });
            site.addEventListener('mouseleave', hideTooltip);
        });

        // Legend Interactions
        elements.legendItems.forEach(item => {
            item.addEventListener('click', () => {
                const regionId = item.getAttribute('data-region');
                const regionElement = document.getElementById(`region-${regionId}`);
                if (regionElement) {
                    regionElement.dispatchEvent(new Event('click'));
                    regionElement.classList.add('active');
                    setTimeout(() => regionElement.classList.remove('active'), 2000);
                }
            });
            
            item.addEventListener('mouseenter', () => {
                const regionId = item.getAttribute('data-region');
                highlightRegion(regionId, true);
            });
            
            item.addEventListener('mouseleave', () => {
                const regionId = item.getAttribute('data-region');
                highlightRegion(regionId, false);
            });
        });

        // Era Controls
        elements.eraButtons.forEach(button => {
            button.addEventListener('click', () => {
                const era = button.getAttribute('data-era');
                changeEra(era);
            });
        });

        // Modal Close
        elements.modalClose.addEventListener('click', closeModal);
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    function handleRegionClick(e) {
        const regionId = e.target.getAttribute('data-region');
        const regionData = atlasData.regions[regionId];
        
        if (!regionData) return;
        
        currentState.selectedRegion = regionId;
        
        // Update visual state
        elements.regions.forEach(r => r.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update info panel with animation
        updateInfoPanel(regionData);
        
        // If The Scar is clicked, add special effect
        if (regionId === 'scar') {
            document.body.style.filter = 'hue-rotate(180deg) contrast(1.2)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 500);
        }
    }

    function handleRegionHover(e) {
        const regionId = e.target.getAttribute('data-region');
        const region = atlasData.regions[regionId];
        const eraData = region.eras[currentState.era];
        
        showTooltip(e, region.name, eraData.description.substring(0, 80) + "...");
    }

    function handleRegionLeave() {
        hideTooltip();
    }

    function handleRouteClick(e) {
        e.stopPropagation();
        const routeId = e.target.getAttribute('data-route');
        const routeData = atlasData.routes[routeId];
        
        if (routeData) {
            openModal(routeData.name, `Trade Route: ${routeData.name}`, 
                `<strong>Goods:</strong> ${routeData.goods}<br><br>
                 <strong>Dangers:</strong> ${routeData.danger}<br><br>
                 ${routeData.description}`);
        }
    }

    function handleRouteHover(e) {
        const routeId = e.target.getAttribute('data-route');
        const route = atlasData.routes[routeId];
        showTooltip(e, route.name, route.description.substring(0, 60) + "...");
    }

    function handleRouteLeave() {
        hideTooltip();
    }

    function handleMythClick(e) {
        e.stopPropagation();
        const mythId = e.currentTarget.getAttribute('data-myth');
        const myth = atlasData.mythSites[mythId];
        
        openModal(myth.name, `Sacred Site: ${myth.location}`, myth.lore);
    }

    // ==========================================
    // UI UPDATES
    // ==========================================
    
    function updateInfoPanel(regionData) {
        const panel = elements.infoPanel;
        const eraData = regionData.eras[currentState.era];
        
        // Fade out default state
        panel.default.style.opacity = '0';
        setTimeout(() => {
            panel.default.classList.add('hidden');
            panel.detail.classList.remove('hidden');
            
            // Update content
            panel.title.textContent = 'Kingdom Chronicle';
            panel.regionName.textContent = regionData.name;
            panel.regionEpithet.textContent = regionData.epithet;
            panel.eraValue.textContent = atlasData.eras[currentState.era].name;
            
            // Lore with era-specific context
            panel.loreContent.innerHTML = `
                <em>Status: ${eraData.status.toUpperCase()}</em><br><br>
                ${eraData.description}<br><br>
                <strong>Historical Record:</strong><br>
                ${regionData.lore}
            `;
            
            // Trade goods
            panel.tradeList.innerHTML = regionData.trade.map(good => 
                `<li>${good}</li>`
            ).join('');
            
            // Mythology
            panel.mythContent.textContent = regionData.mythology;
            
            // Trigger reflow for animation
            panel.detail.style.opacity = '0';
            panel.detail.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                panel.detail.style.transition = 'all 0.5s ease';
                panel.detail.style.opacity = '1';
                panel.detail.style.transform = 'translateY(0)';
            });
        }, 300);
    }

    function resetInfoPanel() {
        const panel = elements.infoPanel;
        panel.detail.classList.add('hidden');
        panel.default.classList.remove('hidden');
        panel.default.style.opacity = '1';
        elements.infoPanel.title.textContent = 'Select a Region';
    }

    function changeEra(era) {
        if (currentState.era === era) return;
        
        currentState.era = era;
        
        // Update buttons
        elements.eraButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.getAttribute('data-era') === era) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });
        
        // Update timeline progress bar
        const progress = era === 'dawn' ? '33%' : era === 'apex' ? '66%' : '100%';
        elements.timelineProgress.style.setProperty('--progress-width', progress);
        elements.timelineProgress.querySelector('::after') || 
        elements.timelineProgress.style.setProperty('--after-width', progress);
        
        // Actually update the pseudo element via inline style workaround
        elements.timelineProgress.style.background = 
            `linear-gradient(to right, var(--bronze) ${progress}, var(--dark-parchment) ${progress})`;
        
        // Update regions visual states based on era
        updateEraVisuals(era);
        
        // Adjust caravan speed based on era trade activity
        const tradeMultiplier = atlasData.eras[era].tradeActivity;
        caravanAnimator.setSpeed(tradeMultiplier);
        
        // If a region is selected, update its info
        if (currentState.selectedRegion) {
            updateInfoPanel(atlasData.regions[currentState.selectedRegion]);
        }
        
        // Trigger atmospheric changes
        applyEraAtmosphere(era);
    }

    function updateEraVisuals(era) {
        elements.regions.forEach(region => {
            const regionId = region.getAttribute('data-region');
            const data = atlasData.regions[regionId];
            const eraData = data.eras[era];
            
            // Adjust opacity based on era status
            let opacity = 0.6;
            if (eraData.status === 'declining' || eraData.status === 'shattered') opacity = 0.4;
            if (eraData.status === 'golden' || eraData.status === 'imperial') opacity = 0.9;
            
            region.style.fillOpacity = opacity;
            
            // Add visual effects for The Scar in later eras
            if (regionId === 'scar') {
                if (era === 'fracture') {
                    region.style.filter = 'drop-shadow(0 0 20px #DC143C) brightness(1.3)';
                } else if (era === 'apex') {
                    region.style.filter = 'drop-shadow(0 0 10px #8B0000)';
                } else {
                    region.style.filter = 'none';
                }
            }
        });
        
        // Show/hide trade routes based on era
        elements.routes.forEach(route => {
            const routeId = route.getAttribute('data-route');
            const routeData = atlasData.routes[routeId];
            const activity = atlasData.eras[era].tradeActivity;
            
            route.style.opacity = activity > 0.5 ? '0.8' : '0.3';
            route.style.strokeWidth = activity > 0.5 ? '3' : '2';
        });
    }

    function applyEraAtmosphere(era) {
        const body = document.body;
        body.classList.remove('era-dawn', 'era-apex', 'era-fracture');
        body.classList.add(`era-${era}`);
        
        // Adjust grain intensity
        const grain = document.querySelector('.grain-overlay');
        if (era === 'fracture') {
            grain.style.opacity = '0.08';
            grain.style.filter = 'contrast(1.5)';
        } else if (era === 'dawn') {
            grain.style.opacity = '0.02';
            grain.style.filter = 'sepia(0.5)';
        } else {
            grain.style.opacity = '0.04';
            grain.style.filter = 'none';
        }
    }

    function highlightRegion(regionId, active) {
        const region = document.getElementById(`region-${regionId}`);
        if (region) {
            if (active) {
                region.style.filter = 'drop-shadow(0 0 10px currentColor) brightness(1.2)';
                region.style.transform = 'scale(1.02)';
                region.style.transformOrigin = 'center';
            } else {
                region.style.filter = '';
                region.style.transform = '';
            }
        }
    }

    // ==========================================
    // TOOLTIP SYSTEM
    // ==========================================
    
    function showTooltip(e, title, description) {
        const tooltip = elements.tooltip;
        tooltip.querySelector('.tooltip-title').textContent = title;
        tooltip.querySelector('.tooltip-desc').textContent = description;
        tooltip.classList.add('visible');
        updateTooltipPosition(e);
    }

    function hideTooltip() {
        elements.tooltip.classList.remove('visible');
    }

    function updateTooltipPosition(e) {
        const tooltip = elements.tooltip;
        const rect = tooltip.getBoundingClientRect();
        const x = e.clientX + 15;
        const y = e.clientY - rect.height - 10;
        
        // Boundary checks
        const finalX = Math.min(x, window.innerWidth - rect.width - 20);
        const finalY = Math.max(y, 10);
        
        tooltip.style.left = `${finalX}px`;
        tooltip.style.top = `${finalY}px`;
    }

    // ==========================================
    // MODAL SYSTEM
    // ==========================================
    
    function openModal(title, subtitle, content) {
        elements.modalTitle.textContent = title;
        elements.modalSubtitle.textContent = subtitle;
        elements.modalText.innerHTML = content;
        elements.modal.showModal();
        
        // Animate content in
        elements.modal.querySelector('.modal-content').style.animation = 'fadeIn 0.4s ease';
    }

    function closeModal() {
        elements.modal.close();
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    let caravanAnimator;
    
    function init() {
        // Initialize caravan animation
        caravanAnimator = new CaravanAnimator();
        
        // Set up interactions
        initInteractions();
        
        // Set initial era
        changeEra('apex');
        
        // Add cuneiform text to borders (decorative)
        const cuneiformText = '𒀭𒂗𒆳𒆳𒊏𒆠𒀭𒈹𒍣𒊏𒆳𒆳𒊏';
        document.querySelectorAll('.cuneiform-border').forEach(border => {
            border.textContent = cuneiformText.repeat(10);
        });
        
        console.log('🗺️ Cartographica Aeterna initialized. The world awaits.');
    }

    // Start the atlas
    init();
    
    // Expose to global for debugging (remove in production)
    window.atlasData = atlasData;
    window.atlasState = currentState;
});