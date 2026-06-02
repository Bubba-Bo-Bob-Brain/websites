// ===== REGION DATA =====
const regionData = {
    thalassar: {
        name: "Thalassar",
        emblem: "⚓",
        culture: "Maritime Republic",
        lore: "The jewel of the Sapphire Sea, Thalassar has been a beacon of naval power and trade for three millennia. Its white-marbled capital of Aethon rises from sea-cliffs like a crown of pearls, home to the legendary Lighthouse of Pelagios—one of the Seven Wonders of the Ancient World. The Thalassari are master shipbuilders and navigators, their purple-sailed galleys crossing every known sea.",
        resources: ["Pearls", "Salt", "Coral", "Fish", "Ship Timber", "Purple Dye"],
        deity: "Pelagios, the Tide Father — Lord of oceans, storms, and maritime fortune. His temples are built upon sea-stacks, and his priestesses read the future in tidal patterns.",
        myths: [
            "The Drowned Fleet of Admiral Xanthos, said to rise from the waves during tempests, still fighting a battle lost a thousand years ago",
            "The Pearl of Eternity, a gem of impossible size hidden in the deepest trench, granting dominion over all seas to its finder",
            "The Sirens of Cape Thessaly, whose song can be heard on moonless nights, luring the unwary to blissful oblivion"
        ]
    },
    pyrrhon: {
        name: "Pyrrhon",
        emblem: "🔥",
        culture: "Theocratic Empire",
        lore: "Forged in fire and tempered by ash, the Pyrrhonian Empire controls the volcanic heartlands of central Aetheria. The twin peaks of Mount Pyrrax and Mount Ashara provide the empire with obsidian, sulfur, and geothermal power. The Pyrrhonians worship flame itself, maintaining eternal fires in their great temple-complexes. Their legions, clad in blackened bronze, are feared across the continent.",
        resources: ["Obsidian", "Sulfur", "Iron", "Gemstones", "Volcanic Glass", "Geothermal Energy"],
        deity: "Pyrrax the Eternal Flame — God of fire, destruction, and rebirth. He is believed to sleep beneath Mount Pyrrax, his dreams causing the eruptions that shape the land.",
        myths: [
            "The Dragon's Maw, a volcanic caldera where the first dragon is said to have been born from pure magma",
            "The Forge of the Gods, hidden deep within Mount Ashara, where divine weapons are still crafted",
            "The Ashen King, a ruler who displeased Pyrrax and was turned to volcanic glass, his statue still visible in the high craters"
        ]
    },
    sylvanheim: {
        name: "Sylvanheim",
        emblem: "🌳",
        culture: "Elven Confederacy",
        lore: "The ancient forests of Sylvanheim have never known the axe or the torch. The Sylvani, an elder race of forest-dwellers, have protected these woods since the Dawn Age, their magic woven into every root and branch. Their cities are grown, not built—living architecture of shaped wood and flowering vines. At the heart of the deepest glade stands Yggdrasil's Echo, a tree so vast its canopy blots out the sky.",
        resources: ["Ancient Timber", "Herbs", "Honey", "Living Wood", "Moonflowers", "Forest Gems"],
        deity: "Verdania, the Green Mother — Goddess of nature, growth, and the eternal cycle. She is not worshipped but communed with, every tree a fragment of her consciousness.",
        myths: [
            "Yggdrasil's Echo, the World Tree's reflection in mortal soil, whose roots reach into the realm of the dead",
            "The Wild Hunt, a spectral procession led by the Horned King that rides when the forest is threatened",
            "The Singing Glades, meadows where the flowers hum lullabies that can grant prophetic dreams to those who sleep among them"
        ]
    },
    zephyria: {
        name: "Zephyria",
        emblem: "☁",
        culture: "Magocratic Republic",
        lore: "High in the eastern mountains where the air itself shimmers with arcane energy, the Zephyrians have mastered the art of wind and sky. Their capital, Aeropolis, is said to float above the clouds, held aloft by ancient spells of levitation. The Zephyrian mages are the foremost scholars of the arcane arts, their academies producing wizards whose fame reaches every corner of the known world.",
        resources: ["Crystals", "Spices", "Silk", "Windstone", "Arcane Tomes", "Sky Metal"],
        deity: "Aeolus the Whisperer — God of wind, knowledge, and magic. His voice is heard in every breeze, and his followers believe that all magic is merely the manipulation of his breath.",
        myths: [
            "The Floating Isles, remnants of an ancient city destroyed in the Mage Wars, still drifting through the upper atmosphere",
            "The Storm Library, a collection of all knowledge ever lost, hidden within a perpetual thundercloud",
            "The Wind Walkers, spectral beings who traverse the sky on invisible paths, guiding lost souls to the afterlife"
        ]
    },
    nordanheim: {
        name: "Nordanheim",
        emblem: "❄",
        culture: "Norse Kingdoms",
        lore: "Beyond the Frostspine Mountains lies Nordanheim, a land of eternal winter where only the hardiest souls dare to dwell. The Nordan clans are fierce warriors and master sailors, their longships cutting through frozen seas to raid and trade. The Eternal Storm that rages above their northern coast has never ceased since the world was young, and the Nordan believe it guards the entrance to the realm of the gods.",
        resources: ["Furs", "Whale Oil", "Amber", "Ice Crystal", "Frost Iron", "Walrus Ivory"],
        deity: "Thundrak the Storm Lord — God of thunder, war, and honor. His hammer-strikes are the thunderclaps, and those who die in battle feast eternally in his frozen hall.",
        myths: [
            "The Eternal Storm, a tempest that has raged for ten thousand years, guarding the gates of Asgård",
            "The World Serpent Jörmungandr, whose coils encircle the frozen seas, waiting for Ragnarök",
            "The Berserker's Curse, said to transform warriors into unstoppable beasts, but at the cost of their humanity"
        ]
    },
    umbrath: {
        name: "Umbrath",
        emblem: "🌑",
        culture: "Shadow Theocracy",
        lore: "The eastern marches of Umbrath exist in perpetual twilight, where the sun hangs low and the shadows stretch long. The Umbrathi are a secretive people, ruled by a council of shadow-priests who claim to hear the whispers of Nyx, goddess of darkness. Their capital, Nyxos, is a city of black stone where light itself seems reluctant to tread. Visitors speak of eyes watching from every shadow, and of secrets traded in whispers.",
        resources: ["Nightshade", "Shadow Silk", "Dark Crystals", "Mushrooms", "Bat Guano", "Obsidian"],
        deity: "Nyx the Veiled One — Goddess of darkness, secrets, and the hidden truths. She is not evil, but neutral—darkness is merely the absence of light, and in darkness, all things are equal.",
        myths: [
            "The Shadow Gate, a portal to the Plane of Shadow that opens only during eclipses",
            "The Nightwalkers, beings of living darkness who serve as Nyx's messengers and enforcers",
            "The Obsidian Throne, said to grant its sitter the ability to see all secrets hidden in shadow"
        ]
    },
    lyonesse: {
        name: "Lyonesse",
        emblem: "🏝",
        culture: "Island Kingdom",
        lore: "The blessed isle of Lyonesse floats like a green jewel upon the Sapphire Sea, its shores lined with white sand and its interior lush with tropical bounty. The Lyonesseans are a peaceful people, their culture centered around music, art, and the worship of beauty. Their capital, Elysium, is said to be the most beautiful city in the world, with gardens that bloom in every season.",
        resources: ["Tropical Fruits", "Spices", "Jade", "Pearls", "Exotic Birds", "Healing Springs"],
        deity: "Elysia the Radiant — Goddess of beauty, art, and paradise. Her followers believe that Lyonesse is a fragment of the heavenly realm, a paradise given to mortals.",
        myths: [
            "The Sunken City beneath the waves, ruins of a civilization that existed before the isle rose from the sea",
            "The Fountain of Youth, hidden in the island's interior, whose waters can restore youth to the aged",
            "The Siren's Lament, a melody played by the sea itself on moonlit nights, said to heal any sorrow"
        ]
    },
    luminaar: {
        name: "Luminaar",
        emblem: "✨",
        culture: "Celestial Order",
        lore: "The tiny island of Luminaar punches far above its weight in influence. Home to the Celestial Observatory, the greatest astronomical institution in the ancient world, Luminaar's scholars have mapped every star and predicted every eclipse for a thousand years. The island glows at night, its white stone buildings reflecting moonlight like a beacon upon the Silent Strait.",
        resources: ["Star Charts", "Telescopes", "Lenses", "Astronomical Texts", "Lunar Crystals", "Navigation Tools"],
        deity: "Celestia the Star Weaver — Goddess of stars, fate, and cosmic order. Her followers believe that each star is a thread in the tapestry of destiny.",
        myths: [
            "The Star Map Prophecy, a celestial alignment that occurs once every millennium, foretelling the fate of nations",
            "The Moonwell, a pool that reflects not the sky above but the realm of the gods",
            "The Astral Walkers, mystics who can project their consciousness to walk among the stars"
        ]
    },
    nocthis: {
        name: "Nocthis",
        emblem: "🌙",
        culture: "Mystic Enclave",
        lore: "The smallest of the known islands, Nocthis is shrouded in mystery. Few outsiders have set foot upon its shores, and those who return speak of impossible things—gardens that grow in moonlight, rivers that flow uphill, and a civilization that exists outside of time itself. The Nocthi are said to be master illusionists, their entire island perhaps nothing more than a magnificent mirage.",
        resources: ["Illusion Dust", "Dream Herbs", "Phantom Silk", "Memory Crystals", "Time Sand", "Mirage Glass"],
        deity: "Morpheus the Dreamer — God of dreams, illusions, and the boundary between real and unreal. His followers question whether reality itself is merely a shared dream.",
        myths: [
            "The Timeless City, a metropolis that exists in all times simultaneously",
            "The Dream Market, where memories and experiences are bought and sold",
            "The Island's True Form, which some believe shifts between states of existence"
        ]
    }
};

// ===== ERA DATA =====
const eraData = [
    {
        name: "Dawn Age",
        years: "Before Year 0",
        description: "The mythic age before recorded history. The gods walked the earth, and the elder races—the Sylvani, the Draconic, and the Primordials—shaped the world. Great magical works were accomplished, and the foundations of civilization were laid. This age ended with the Sundering, when the gods withdrew from mortal affairs."
    },
    {
        name: "Age of Heroes",
        years: "0–300 AT",
        description: "Mortal civilizations rose from the ashes of the Dawn Age. Great heroes walked the land—warriors, mages, and kings whose deeds became legend. The nations of Aetheria were founded, borders drawn in blood and magic. This was an age of war, but also of wonder, as mortals learned to harness the magic left behind by the gods."
    },
    {
        name: "Golden Era",
        years: "300–800 AT",
        description: "The height of civilization in Aetheria. Trade flourishes between all nations, and the great cities reach their zenith of power and culture. The Marble Compact, a treaty of peace between the major nations, has held for centuries. Scholars, artists, and mages create works of unparalleled beauty and wisdom."
    },
    {
        name: "Age of Shadows",
        years: "800–1100 AT",
        description: "Darkness creeps from the east as the Shadow Gate in Umbrath weakens. Strange creatures emerge from the Plane of Shadow, and the nations must unite against a common foe. Wars are fought not for territory, but for survival. Ancient alliances are tested, and new heroes must rise to face the gathering storm."
    },
    {
        name: "Twilight Era",
        years: "1100 AT–Present",
        description: "The current age. The Shadow War has ended, but at great cost. Nations are rebuilding, old wounds healing slowly. The Shadow Gate was sealed, but at what price? Rumors speak of prophecies yet unfulfilled, and some believe the world stands on the brink of another Sundering. The future of Aetheria hangs in the balance."
    }
];

// ===== TRADE ROUTE ANIMATION =====
class TradeRouteAnimator {
    constructor() {
        this.routes = [];
        this.animationFrameId = null;
        this.init();
    }

    init() {
        const routeData = [
            { path: 'route-amber', dot: 0, speed: 0.003, direction: 1 },
            { path: 'route-iron', dot: 1, speed: 0.004, direction: 1 },
            { path: 'route-silk', dot: 2, speed: 0.0035, direction: 1 },
            { path: 'route-twilight', dot: 3, speed: 0.005, direction: 1 },
            { path: 'route-pearl', dot: 4, speed: 0.004, direction: 1 },
            { path: 'route-frost', dot: 5, speed: 0.0045, direction: 1 },
            { path: 'route-sea', dot: 6, speed: 0.0025, direction: 1 }
        ];

        routeData.forEach(data => {
            const pathElement = document.getElementById(data.path);
            const dotElements = document.querySelectorAll('.route-dot');
            
            if (pathElement && dotElements[data.dot]) {
                this.routes.push({
                    path: pathElement,
                    dot: dotElements[data.dot],
                    progress: Math.random(),
                    speed: data.speed,
                    direction: data.direction
                });
            }
        });

        this.animate();
    }

    animate() {
        this.routes.forEach(route => {
            const pathLength = route.path.getTotalLength();
            
            route.progress += route.speed * route.direction;
            
            if (route.progress >= 1) {
                route.progress = 0;
            } else if (route.progress < 0) {
                route.progress = 1;
            }

            const point = route.path.getPointAtLength(route.progress * pathLength);
            route.dot.setAttribute('cx', point.x);
            route.dot.setAttribute('cy', point.y);
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// ===== MAIN APPLICATION =====
class AetherianAtlas {
    constructor() {
        this.currentRegion = null;
        this.currentEra = 2;
        this.tradeAnimator = null;
        
        this.init();
    }

    init() {
        this.setupRegions();
        this.setupTimeline();
        this.setupSidebar();
        this.setupModal();
        this.tradeAnimator = new TradeRouteAnimator();
        
        // Show welcome panel by default
        this.showWelcomePanel();
    }

    // ===== REGION INTERACTIONS =====
    setupRegions() {
        const regions = document.querySelectorAll('.region');
        
        regions.forEach(region => {
            region.addEventListener('click', (e) => {
                const regionId = region.dataset.region;
                this.selectRegion(regionId);
            });

            region.addEventListener('mouseenter', (e) => {
                this.highlightRegion(region, true);
            });

            region.addEventListener('mouseleave', (e) => {
                this.highlightRegion(region, false);
            });
        });
    }

    highlightRegion(region, highlight) {
        const land = region.querySelector('.region-land');
        if (land) {
            if (highlight) {
                land.style.filter = 'brightness(1.15) drop-shadow(0 0 8px rgba(184, 134, 11, 0.5))';
            } else {
                land.style.filter = '';
            }
        }
    }

    selectRegion(regionId) {
        // Remove active class from all regions
        document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
        
        // Add active class to selected region
        const selectedRegion = document.getElementById(regionId);
        if (selectedRegion) {
            selectedRegion.classList.add('active');
        }

        // Get region data
        const data = regionData[regionId];
        if (data) {
            this.currentRegion = regionId;
            this.showRegionPanel(data);
        }
    }

    // ===== SIDEBAR MANAGEMENT =====
    setupSidebar() {
        const closeBtn = document.getElementById('sidebar-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.showWelcomePanel();
                document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
            });
        }
    }

    showWelcomePanel() {
        const welcomePanel = document.getElementById('panel-welcome');
        const detailPanel = document.getElementById('panel-detail');
        
        if (welcomePanel) welcomePanel.classList.remove('hidden');
        if (detailPanel) detailPanel.classList.add('hidden');
        
        this.currentRegion = null;
    }

    showRegionPanel(data) {
        const welcomePanel = document.getElementById('panel-welcome');
        const detailPanel = document.getElementById('panel-detail');
        
        if (welcomePanel) welcomePanel.classList.add('hidden');
        if (detailPanel) detailPanel.classList.remove('hidden');

        // Update panel content
        this.updateElement('panel-emblem', data.emblem);
        this.updateElement('panel-title', data.name);
        this.updateElement('panel-culture', data.culture);
        this.updateElement('panel-lore', data.lore);
        this.updateElement('panel-deity', data.deity);

        // Update resources
        const resourceList = document.getElementById('panel-resources');
        if (resourceList) {
            resourceList.innerHTML = data.resources.map(r => 
                `<span class="resource-tag">${r}</span>`
            ).join('');
        }

        // Update myths
        const mythList = document.getElementById('panel-myths');
        if (mythList) {
            mythList.innerHTML = data.myths.map(m => 
                `<li>${m}</li>`
            ).join('');
        }

        // Animate panel appearance
        detailPanel.style.animation = 'none';
        detailPanel.offsetHeight; // Trigger reflow
        detailPanel.style.animation = 'panelSlideIn 0.4s ease';
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // ===== TIMELINE FUNCTIONALITY =====
    setupTimeline() {
        const slider = document.getElementById('era-slider');
        const eraLabels = document.querySelectorAll('.era-label');
        const tooltip = document.getElementById('era-tooltip');

        if (slider) {
            slider.addEventListener('input', (e) => {
                const era = parseInt(e.target.value);
                this.selectEra(era);
            });

            slider.addEventListener('mouseenter', () => {
                if (tooltip) tooltip.classList.add('visible');
            });

            slider.addEventListener('mouseleave', () => {
                if (tooltip) tooltip.classList.remove('visible');
            });
        }

        // Era label click handlers
        eraLabels.forEach(label => {
            label.addEventListener('click', () => {
                const era = parseInt(label.dataset.era);
                this.selectEra(era);
                if (slider) slider.value = era;
            });
        });

        // Initialize with current era
        this.selectEra(this.currentEra);
    }

    selectEra(eraIndex) {
        this.currentEra = eraIndex;
        const era = eraData[eraIndex];
        
        if (!era) return;

        // Update era labels
        document.querySelectorAll('.era-label').forEach((label, index) => {
            label.classList.toggle('active', index === eraIndex);
        });

        // Update tooltip
        this.updateElement('era-tooltip-name', era.name);
        this.updateElement('era-tooltip-years', era.years);

        // Update description
        this.updateElement('era-description', era.description);

        // Update map based on era (visual changes)
        this.updateMapForEra(eraIndex);
    }

    updateMapForEra(eraIndex) {
        const map = document.getElementById('world-map');
        if (!map) return;

        // Apply era-specific visual effects
        const filters = {
            0: 'sepia(0.3) brightness(0.9)', // Dawn Age - ancient
            1: 'sepia(0.15) contrast(1.05)', // Age of Heroes - heroic
            2: 'none', // Golden Era - bright
            3: 'brightness(0.85) contrast(1.1) saturate(0.8)', // Age of Shadows - dark
            4: 'sepia(0.2) brightness(0.95)' // Twilight Era - faded
        };

        map.style.filter = filters[eraIndex] || 'none';
        map.style.transition = 'filter 0.5s ease';
    }

    // ===== MODAL FUNCTIONALITY =====
    setupModal() {
        const overlay = document.getElementById('era-modal-overlay');
        const closeBtn = document.getElementById('modal-close');
        const eraLabels = document.querySelectorAll('.era-label');

        // Double-click on era label opens modal
        eraLabels.forEach(label => {
            label.addEventListener('dblclick', () => {
                const era = parseInt(label.dataset.era);
                this.showEraModal(era);
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEraModal());
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideEraModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEraModal();
            }
        });
    }

    showEraModal(eraIndex) {
        const overlay = document.getElementById('era-modal-overlay');
        const era = eraData[eraIndex];
        
        if (!overlay || !era) return;

        this.updateElement('modal-title', era.name);
        this.updateElement('modal-years', era.years);
        this.updateElement('modal-description', era.description);

        overlay.classList.add('visible');
    }

    hideEraModal() {
        const overlay = document.getElementById('era-modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }
}

// ===== ADDITIONAL ANIMATIONS =====
// Add CSS animation for panel slide-in
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes panelSlideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.atlas = new AetherianAtlas();
});

// ===== ADDITIONAL ENHANCEMENTS =====
// Parallax effect on map frame
document.addEventListener('mousemove', (e) => {
    const mapFrame = document.querySelector('.map-frame');
    if (!mapFrame) return;

    const rect = mapFrame.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    const rotateX = deltaY * -2;
    const rotateY = deltaX * 2;
    
    mapFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Reset transform when mouse leaves
document.addEventListener('mouseleave', () => {
    const mapFrame = document.querySelector('.map-frame');
    if (mapFrame) {
        mapFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
});

// Smooth transition for map frame
const mapFrame = document.querySelector('.map-frame');
if (mapFrame) {
    mapFrame.style.transition = 'transform 0.1s ease-out';
}