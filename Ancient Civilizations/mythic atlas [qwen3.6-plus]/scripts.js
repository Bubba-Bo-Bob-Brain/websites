/* ============================================
   CODEX ANTIQUA — INTERACTIVE SCRIPTS
   Brings the ancient atlas to life
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // DATA STORES
    // ============================================

    const regionLore = {
        valtheria: {
            name: 'Valtheria',
            title: 'Kingdom of Iron & Gold',
            sections: [
                { heading: 'History', text: 'Rising from the jagged peaks of the Iron Spine, Valtheria was forged by the exiled clans of the northern wastes. In the Dawn Age, these hardened folk discovered veins of celestial gold beneath the mountains—metal said to fall from the stars in ages forgotten. The kingdom grew from scattered holds into a fortified realm of unparalleled might.' },
                { heading: 'Culture', text: 'Valtherians revere strength and craftsmanship above all. Their smiths produce blades that never dull and armor that turns aside dragon-fire. Society is governed by the Conclave of Forgemasters, each representing one of the Seven Great Mines. Festivals are marked by the Ringing of the Anvil, where hammers strike in unison across every settlement.' },
                { heading: 'Trade', text: 'The kingdom exports refined iron, enchanted gold, and the legendary Valtherian steel. In exchange, they receive grain from the Verdant Expanse, silk from the Jade Empire, and exotic spices from Qar-Zen.' },
                { heading: 'Legends', text: 'It is said that beneath the highest peak lies the First Forge, where the mountain god Khar-Mogun hammered the world into shape. Pilgrims who reach its rumored entrance hear the eternal ringing of his hammer.' }
            ]
        },
        qarzen: {
            name: 'The Sulthanate of Qar-Zen',
            title: 'Empire of Endless Sands',
            sections: [
                { heading: 'History', text: 'Once a collection of warring nomadic tribes, the desert peoples were united by the prophet-sultan Rashid al-Qari, who received visions from the Djinn of the Deep Sands. Under his banner, they carved an empire from the dunes, building oases into cities of breathtaking beauty.' },
                { heading: 'Culture', text: 'Qar-Zeni society is woven around the concepts of hospitality, scholarship, and celestial navigation. Their libraries hold the accumulated knowledge of a thousand caravans. The Great Bazaar serves as both marketplace and parliament, where merchants and scholars debate beneath silk canopies.' },
                { heading: 'Trade', text: 'The Sulthanate controls the vital crossroads of eastern and western trade. They traffic in rare spices, glasswork, enchanted textiles, and the coveted desert pearls found in hidden aquifers.' },
                { heading: 'Legends', text: 'Beneath the shifting dunes lies the City of Brass, sealed since the time of the First Sultan. Some say it holds the Djinn\'s original bargain—a source of power that could reshape the world or consume it entirely.' }
            ]
        },
        verdant: {
            name: 'The Verdant Expanse',
            title: 'Heart of the Ancient Groves',
            sections: [
                { heading: 'History', text: 'The Verdant Expanse is the oldest continuously inhabited land in the known world. Its people, the Sylvari, do not build upon the land but grow their cities from living trees, shaping wood and vine through ancient harmonics known only to their druid-caste.' },
                { heading: 'Culture', text: 'Sylvari society operates in perfect harmony with the forest. There are no written laws—the Great Root, a living network of trees connecting all settlements, transmits knowledge through dreams. Their calendar is marked not by seasons but by the blooming cycles of sacred flora.' },
                { heading: 'Trade', text: 'The Expanse exports medicinal herbs, living wood that can be shaped after harvesting, rare fruits, and enchanted seeds. They import metal goods and crafted items, which they trade for at the forest\'s edge rather than bringing outsiders within.' },
                { heading: 'Legends', text: 'At the center of the Expanse grows the World-Tree, Aethelwyn, whose roots are said to touch every corner of the mortal realm. It is believed that when Aethelwyn blooms with silver flowers, a new age dawns.' }
            ]
        },
        aethelgard: {
            name: 'Aethelgard',
            title: 'Lords of the Western Sea',
            sections: [
                { heading: 'History', text: 'Born from the collision of seafaring raiders and coastal settlers, Aethelgard grew from a loose confederation of harbor-towns into a maritime empire. Their longships once dominated every coast from the Frost Wastes to the Sunken Isles.' },
                { heading: 'Culture', text: 'Aethelgardians are governed by the Tide Council, elected from among the most successful ship-captains and harbor-masters. Their culture celebrates exploration, navigation, and the telling of sea-sagas. Every child learns to swim before they learn to walk.' },
                { heading: 'Trade', text: 'The kingdom\'s wealth flows from maritime commerce: salt, dried fish, shipbuilding timber, and the legendary Aethelgardian compasses that point not to magnetic north but to places the holder most desires.' },
                { heading: 'Legends', text: 'Old sailors speak of the Ghost Armada—a fleet of spectral ships that appears during the greatest storms, crewed by the souls of sailors lost to the sea. To see them is both an omen of death and a promise of safe harbor.' }
            ]
        },
        koldun: {
            name: 'The Frost Wastes of Koldun',
            title: 'Domain of Eternal Winter',
            sections: [
                { heading: 'History', text: 'The Frost Wastes are not merely cold—they are alive with ancient magic. The Kolduni, hardy descendants of the first humans, learned to harness the aurora and bind ice into permanent structures. Their ice-cities have stood for millennia, gleaming beneath the perpetual twilight.' },
                { heading: 'Culture', text: 'Kolduni society is organized around the Great Hearths—magical flames that never extinguish, each tended by a lineage of Frost-Keepers. Knowledge is preserved in ice-scrolls that can only be read when held to the light of the aurora.' },
                { heading: 'Trade', text: 'Despite their isolation, the Kolduni trade in ice-gems (frozen magic given physical form), rare furs, aurora-dust (used in enchantments), and the services of their ice-shapers, who can raise walls or bridges in hours.' },
                { heading: 'Legends', text: 'Deep within the northernmost glacier sleeps the Frost Wyrm, an ancient being of living ice. The Kolduni believe it dreams the winter into existence each year, and that its waking would bring an ice age that would swallow the world.' }
            ]
        },
        xian: {
            name: 'The Jade Empire of Xian',
            title: 'The Jade Throne Eternal',
            sections: [
                { heading: 'History', text: 'The Jade Empire traces its lineage directly to the Celestial Dragon, said to have descended from the heavens and shaped the first emperor from clay and jade. For over three thousand years, the same dynasty has ruled from the Jade Capital, an unbroken chain of divine mandate.' },
                { heading: 'Culture', text: 'Xianese culture is the pinnacle of refinement: poetry, calligraphy, tea ceremony, and martial arts are practiced with religious devotion. Society is structured around the Nine Virtues, and advancement is determined by rigorous examinations testing wisdom, compassion, and artistic mastery.' },
                { heading: 'Trade', text: 'The Empire exports jade artifacts, silk, porcelain, tea, and scrolls of power containing bound spirits. They are selective in their imports, accepting only the finest goods and raw materials for their artisans.' },
                { heading: 'Legends', text: 'The Celestial Dragon is said to sleep beneath the Jade Capital, and the Emperor serves as its earthly voice. When the dragon stirs, the earth trembles and jade glows with inner light. Some prophecies claim the dragon will one day wake and reshape the world.' }
            ]
        },
        mareth: {
            name: 'The Sunken Isles of Mareth',
            title: 'Where the Ocean Remembers',
            sections: [
                { heading: 'History', text: 'Once the crown jewel of the ancient world, Mareth was a civilization of unparalleled maritime achievement. In a single night, during the cataclysm known as the Great Submersion, the isles sank beneath the waves—yet did not perish. The Marethen people adapted, building their cities beneath the surface.' },
                { heading: 'Culture', text: 'Modern Marethen society exists in the twilight between land and sea. They breathe water through enchanted gill-pearls and communicate through bioluminescent signals. Their architecture combines coral growth with carved stone, creating cities that pulse with living light.' },
                { heading: 'Trade', text: 'The Marethen trade in rare pearls, underwater gems, preserved ancient artifacts, and secrets of the deep. Few merchants venture to their floating markets, and those who do return changed, carrying the ocean\'s song in their hearts.' },
                { heading: 'Legends', text: 'At the bottom of Leviathan\'s Trench lies the Original Mareth—the first city, perfectly preserved. It is said to contain the knowledge of the First Age, guarded by the Leviathan itself, the oldest living creature in the world.' }
            ]
        },
        obsidian: {
            name: 'The Obsidian Dominion',
            title: 'Born of Fire and Glass',
            sections: [
                { heading: 'History', text: 'The Obsidian Dominion emerged from volcanic activity that shaped the Glass Mountains. The first inhabitants, survivors of a cataclysmic eruption, discovered that the volcanic glass held magical properties. They learned to shape it, sing to it, and eventually weaponize it.' },
                { heading: 'Culture', text: 'Dominion society is militaristic and hierarchical, ruled by the Glass Lords who can manipulate obsidian with their minds. Their warriors wield glass blades sharper than any steel, and their fortresses are grown from flowing lava cooled by song.' },
                { heading: 'Trade', text: 'The Dominion trades in obsidian weapons, volcanic glass artifacts, fire-enchanted items, and rare minerals found only in active calderas. Other nations regard them with wary respect—their military might is unmatched.' },
                { heading: 'Legends', text: 'The Phoenix Roost atop the tallest volcano is said to be the nesting ground of the World Phoenix, a creature that dies and is reborn with each age. Its tears are said to grant immortality, and many have sought the Roost. None have returned.' }
            ]
        }
    };

    const mythData = {
        'sea-serpent': {
            title: 'The Sea Serpent of the Western Deep',
            text: 'A creature of immense size said to coil around the foundations of the world. Sailors report hearing its song—a haunting melody that can calm storms or summon them, depending on the serpent\'s mood.'
        },
        'colossus': {
            title: 'The Wandering Colossus',
            text: 'A giant of living stone that roams the borderlands between civilizations. Ancient texts claim it was built by the gods as a guardian, but it lost its purpose and now walks eternally, searching for meaning.'
        },
        'phoenix': {
            title: 'The Phoenix Roost',
            text: 'Perched atop the highest volcano of the Obsidian Dominion, this legendary site is where the World Phoenix returns to die and be reborn. The air shimmers with heat even in winter, and glass flowers grow in its shadow.'
        },
        'leviathan': {
            title: 'Leviathan\'s Trench',
            text: 'An impossibly deep chasm in the ocean floor near the Sunken Isles. The Marethen believe the Leviathan sleeps there, and its dreams shape the currents of the world. Disturbing it is said to be the greatest sin.'
        },
        'whispering': {
            title: 'The Whispering Dunes',
            text: 'A region of the Qar-Zen desert where the wind carries voices of the ancient dead. Pilgrims journey here to hear counsel from ancestors, but many return changed—or not at all, seduced by the desert\'s eternal song.'
        }
    };

    // ============================================
    // DOM REFERENCES
    // ============================================

    const worldMap = document.getElementById('worldMap');
    const lorePanel = document.getElementById('lorePanel');
    const loreTitle = document.getElementById('loreTitle');
    const loreBody = document.getElementById('loreBody');
    const closeLorePanel = document.getElementById('closeLorePanel');
    const timelineSlider = document.getElementById('timelineSlider');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineEraName = document.getElementById('timelineEraName');
    const timelineYear = document.getElementById('timelineYear');
    const mythTooltip = document.getElementById('mythTooltip');
    const mythTooltipTitle = document.getElementById('mythTooltipTitle');
    const mythTooltipText = document.getElementById('mythTooltipText');
    const mapArea = document.getElementById('mapArea');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');

    // ============================================
    // STATE
    // ============================================

    let currentEra = 1;
    let currentZoom = 1;
    let selectedRegion = null;
    let lorePanelOpen = false;

    // ============================================
    // LORE PANEL FUNCTIONALITY
    // ============================================

    function openLorePanel(regionId) {
        const lore = regionLore[regionId];
        if (!lore) return;

        loreTitle.textContent = lore.name;
        
        // Build lore content
        let contentHTML = '';
        lore.sections.forEach(section => {
            contentHTML += `
                <h3>${section.heading}</h3>
                <p>${section.text}</p>
            `;
        });
        
        // Add era-specific note
        const eraNames = {
            1: 'The Dawn Age',
            2: 'The Golden Century', 
            3: 'The Sundering',
            4: 'The Twilight Era'
        };
        contentHTML += `<p class="era-note"><em>This lore reflects the region as known during ${eraNames[currentEra]}.</em></p>`;
        
        loreBody.innerHTML = contentHTML;
        
        // Animate panel open
        lorePanel.style.opacity = '1';
        lorePanel.style.transform = 'translateX(0)';
        lorePanelOpen = true;
        selectedRegion = regionId;

        // Update region visual state
        updateRegionHighlights(regionId);
    }

    function closeLorePanelFn() {
        lorePanel.style.opacity = '0';
        lorePanel.style.transform = 'translateX(20px)';
        lorePanelOpen = false;
        selectedRegion = null;
        clearRegionHighlights();
    }

    function updateRegionHighlights(regionId) {
        // Dim all regions, highlight selected
        document.querySelectorAll('.region').forEach(r => {
            r.style.opacity = '0.4';
            r.querySelector('.region-path').style.fillOpacity = '0.2';
        });
        const selected = document.querySelector(`[data-region="${regionId}"]`);
        if (selected) {
            selected.style.opacity = '1';
            selected.querySelector('.region-path').style.fillOpacity = '0.8';
        }
    }

    function clearRegionHighlights() {
        document.querySelectorAll('.region').forEach(r => {
            r.style.opacity = '1';
            r.querySelector('.region-path').style.fillOpacity = '0.6';
        });
    }

    // Event Listeners for Regions
    document.querySelectorAll('.region').forEach(region => {
        region.addEventListener('click', (e) => {
            e.preventDefault();
            const regionId = region.dataset.region;
            if (selectedRegion === regionId) {
                closeLorePanelFn();
            } else {
                openLorePanel(regionId);
            }
        });
    });

    closeLorePanel.addEventListener('click', closeLorePanelFn);

    // ============================================
    // TIMELINE FUNCTIONALITY
    // ============================================

    const eraNames = {
        1: 'The Dawn Age',
        2: 'The Golden Century',
        3: 'The Sundering',
        4: 'The Twilight Era'
    };

    const eraYears = {
        1: '1200',
        2: '1450',
        3: '1680',
        4: '1900'
    };

    function updateEra(era) {
        currentEra = parseInt(era);
        
        // Update slider
        timelineSlider.value = currentEra;
        
        // Update progress bar
        const progress = ((currentEra - 1) / 3) * 100;
        timelineProgress.style.width = `${progress}%`;
        
        // Update era info
        timelineEraName.textContent = eraNames[currentEra];
        timelineYear.textContent = `Anno Mundi ${eraYears[currentEra]}`;
        
        // Update era markers
        document.querySelectorAll('.timeline-era').forEach(el => {
            const elEra = parseInt(el.dataset.era);
            if (elEra <= currentEra) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // Update region states based on era
        updateRegionsForEra(currentEra);
        
        // If lore panel is open, update it
        if (selectedRegion && regionLore[selectedRegion]) {
            openLorePanel(selectedRegion);
        }
    }

    function updateRegionsForEra(era) {
        document.querySelectorAll('.region').forEach(region => {
            const regionEraState = region.dataset[`era${era}`];
            const path = region.querySelector('.region-path');
            
            // Reset styles
            region.style.opacity = '1';
            path.style.fillOpacity = '0.6';
            path.style.strokeDasharray = '';
            path.style.strokeDashoffset = '';
            
            // Apply era-specific styling
            switch(regionEraState) {
                case 'emerging':
                    path.style.fillOpacity = '0.3';
                    path.style.strokeDasharray = '8 4';
                    break;
                case 'active':
                    path.style.fillOpacity = '0.6';
                    break;
                case 'expanded':
                    path.style.fillOpacity = '0.8';
                    path.style.strokeWidth = '3';
                    break;
                case 'declining':
                    path.style.fillOpacity = '0.4';
                    path.style.strokeDasharray = '4 6';
                    break;
                case 'ruins':
                    path.style.fillOpacity = '0.2';
                    path.style.strokeDasharray = '2 8';
                    break;
                case 'fragmented':
                    path.style.fillOpacity = '0.35';
                    path.style.strokeDasharray = '6 3';
                    break;
                case 'legend':
                    path.style.fillOpacity = '0.15';
                    path.style.strokeDasharray = '3 5';
                    break;
            }
        });

        // Update trade routes based on era
        document.querySelectorAll('.trade-route').forEach(route => {
            const routePath = route.querySelector('.route-path');
            if (era >= 3) {
                routePath.style.opacity = era === 3 ? '0.3' : '0.1';
                routePath.style.animation = era === 3 ? 'none' : '';
            } else {
                routePath.style.opacity = '0.7';
            }
        });
    }

    timelineSlider.addEventListener('input', (e) => {
        updateEra(e.target.value);
    });

    // Click on era markers to jump to that era
    document.querySelectorAll('.timeline-era').forEach(el => {
        el.addEventListener('click', () => {
            updateEra(el.dataset.era);
        });
    });

    // ============================================
    // MYTH TOOLTIP FUNCTIONALITY
    // ============================================

    let tooltipVisible = false;

    function showMythTooltip(mythId, x, y) {
        const myth = mythData[mythId];
        if (!myth) return;

        mythTooltipTitle.textContent = myth.title;
        mythTooltipText.textContent = myth.text;
        
        // Position tooltip
        const tooltipRect = mythTooltip.getBoundingClientRect();
        let left = x + 15;
        let top = y - 10;
        
        // Keep tooltip on screen
        if (left + 280 > window.innerWidth) {
            left = x - 290;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = y - tooltipRect.height - 10;
        }
        
        mythTooltip.style.left = `${left}px`;
        mythTooltip.style.top = `${top}px`;
        mythTooltip.classList.add('visible');
        tooltipVisible = true;
    }

    function hideMythTooltip() {
        mythTooltip.classList.remove('visible');
        tooltipVisible = false;
    }

    document.querySelectorAll('.myth-annotation').forEach(ann => {
        ann.addEventListener('mouseenter', (e) => {
            const mythId = ann.dataset.myth;
            const rect = ann.getBoundingClientRect();
            showMythTooltip(mythId, rect.right, rect.top);
        });
        
        ann.addEventListener('mouseleave', hideMythTooltip);
    });

    // ============================================
    // CITY MARKER TOOLTIPS
    // ============================================

    const cityData = {
        'ironhold': 'Capital of Valtheria. Home to the Great Forge and the Hall of Anvils.',
        'golden-bazaar': 'The greatest marketplace in the known world. Trade never sleeps.',
        'salt-harbor': 'Aethelgard\'s principal port and shipbuilding center.',
        'jade-capital': 'Seat of the Jade Emperor, built upon the back of the sleeping dragon.',
        'pearl-reef': 'Floating city of the Marethen, where sea meets sky.',
        'ember-keep': 'Volcanic fortress of the Obsidian Dominion, forged in living lava.'
    };

    document.querySelectorAll('.city-marker').forEach(marker => {
        marker.addEventListener('mouseenter', (e) => {
            const cityId = marker.dataset.city;
            const cityInfo = cityData[cityId];
            if (!cityInfo) return;
            
            // Reuse myth tooltip for simplicity
            mythTooltipTitle.textContent = marker.querySelector('.city-label').textContent;
            mythTooltipText.textContent = cityInfo;
            
            const rect = marker.getBoundingClientRect();
            let left = rect.right + 10;
            let top = rect.top - 5;
            
            if (left + 280 > window.innerWidth) {
                left = rect.left - 290;
            }
            
            mythTooltip.style.left = `${left}px`;
            mythTooltip.style.top = `${top}px`;
            mythTooltip.classList.add('visible');
        });
        
        marker.addEventListener('mouseleave', hideMythTooltip);
    });

    // ============================================
    // MAP ZOOM CONTROLS
    // ============================================

    function updateZoom(newZoom) {
        currentZoom = Math.max(0.5, Math.min(2.5, newZoom));
        worldMap.style.transform = `scale(${currentZoom})`;
        worldMap.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        worldMap.style.transformOrigin = 'center center';
    }

    zoomInBtn.addEventListener('click', () => updateZoom(currentZoom + 0.25));
    zoomOutBtn.addEventListener('click', () => updateZoom(currentZoom - 0.25));
    resetViewBtn.addEventListener('click', () => updateZoom(1));

    // Mouse wheel zoom
    mapArea.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
        updateZoom(currentZoom + zoomDelta);
    });

    // ============================================
    // INITIAL SETUP
    // ============================================

    // Initialize timeline
    updateEra(1);
    
    // Initial lore panel state
    lorePanel.style.opacity = '0';
    lorePanel.style.transform = 'translateX(20px)';
    lorePanel.style.transition = 'all 0.4s ease';

    // Add ambient animation to compass rose
    const compassRose = document.querySelector('.compass-rose');
    if (compassRose) {
        let compassAngle = 0;
        setInterval(() => {
            compassAngle += 0.02;
            const wobble = Math.sin(compassAngle) * 1;
            compassRose.style.transform = `translate(1100px, 100px) rotate(${wobble}deg)`;
        }, 50);
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lorePanelOpen) {
            closeLorePanelFn();
        }
        if (e.key === 'ArrowRight' && currentEra < 4) {
            updateEra(currentEra + 1);
        }
        if (e.key === 'ArrowLeft' && currentEra > 1) {
            updateEra(currentEra - 1);
        }
    });

    // ============================================
    // PAGE LOAD ANIMATION
    // ============================================

    const header = document.getElementById('atlasHeader');
    const container = document.getElementById('atlasContainer');
    
    // Staggered fade-in
    header.style.opacity = '0';
    header.style.transform = 'translateY(-30px)';
    header.style.transition = 'all 1s ease 0.2s';
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'all 1s ease 0.5s';
    
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
});