/* ============================================
   THE ETERNAL ATLAS - Interactive Scripts
   ============================================ */

// ============================================
// LORE DATA
// ============================================
const civilizationsData = {
    valdoria: {
        name: "Valdoria",
        subtitle: "Empire of the Sun",
        emblem: "☀",
        color: "#d4af37",
        overview: `<p>Valdoria stands as the golden beacon of the ancient world, a sprawling empire whose towers pierce the heavens like prayers made solid. Founded in the first dawn of recorded history, this civilization mastered the art of solar alchemy, bending light itself to forge weapons, tools, and the legendary Sunstones that power their eternal flame.</p>
        <p>The capital city of Solaris rises from the desert like a mirage made real, its golden spires visible for a hundred leagues. At its heart burns the Eternal Flame, a fire that has never dimmed since the founding of the empire three millennia past.</p>`,
        history: `<p>The Valdorian Empire was born from the union of twelve sun-worshipping tribes who gathered at the Oasis of First Light in 3000 B.A. Their first High King, Aurelius the Illuminated, received the gift of solar magic from the Sun God Solara herself.</p>
        <p>For a thousand years, Valdoria expanded peacefully, sharing knowledge and trade with neighboring lands. The Age of Conquest brought conflict, but Valdoria's golden legions proved unstoppable, establishing dominion over the central plains.</p>
        <p>The recent Age of Shadows has tested Valdoria's strength. The dark rituals of Khar'zuul have dimmed the sun for days at a time, weakening the solar magic upon which the empire depends.</p>`,
        mythology: `<p>Valdorians worship Solara, the Sun Goddess, who they believe walks among them in the form of the Eternal Flame. Legend tells that Solara wept tears of gold when the first mortals suffered in darkness, and these tears became the first Sunstones.</p>
        <p>The Great Prophecy of Gold speaks of a time when the sun will set forever, and a child born during an eclipse will rise to become the Solar Champion, wielding the legendary Blade of Dawn to restore light to the world.</p>
        <p>The Temple of the First Dawn, located in the sacred mountains north of Solaris, is said to be the spot where Solara first touched the mortal realm.</p>`,
        trade: `<p>Valdoria's economy rests upon three pillars: solar crystals, golden grain, and masterwork metallurgy. Sunstones are the most coveted trade goods in the known world, providing clean energy for heating, lighting, and even seafaring vessels.</p>
        <p>The Gold Road, stretching from Solaris to the trade cities of Meridian, sees thousands of caravans monthly. Valdorian gold is the standard currency across most civilizations.</p>
        <p>Primary exports: Sunstones, gold, enchanted metalwork, solar-powered devices, golden wheat, medicinal sunflowers.</p>`,
        figures: `<p><strong>Emperor Aurelius XXIII</strong> - The current ruler, known as "the Patient." His diplomatic skills have kept Valdoria stable during the turbulent Age of Shadows.</p>
        <p><strong>High Priestess Solaris</strong> - Keeper of the Eternal Flame and leader of the Solar Clergy. She is said to commune directly with Solara.</p>
        <p><strong>General Helios</strong> - Commander of the Golden Legions, undefeated in thirty years of service. His tactical brilliance has preserved Valdoria's borders.</p>`,
        quote: '"In golden light, we find truth eternal." - Valdorian Creed'
    },
    kharzuul: {
        name: "Khar'zuul",
        subtitle: "The Dark Wastes",
        emblem: "◆",
        color: "#9966cc",
        overview: `<p>Khar'zuul exists in perpetual twilight, a realm where the boundaries between the mortal world and the Void have grown thin. Once a thriving kingdom of scholars and mages, a catastrophic ritual gone wrong tore open a rift to the shadow realm, corrupting the land and its people.</p>
        <p>The capital of Voidspire rises from the darkness like a monument to ambition's price - a twisted tower of black stone that seems to absorb light rather than reflect it. Those who dwell here have adapted to the darkness, developing strange abilities and stranger customs.</p>`,
        history: `<p>The Kingdom of Zuul was founded by refugees from the great magical wars of ages past, seeking refuge in the remote northern mountains. They were scholars first, drawn by the unique ley line convergence that made the area ideal for magical research.</p>
        <p>In 1500 B.A., Archmage Khar launched the Great Working, an attempt to access the source of all magical power. The ritual succeeded beyond his darkest fears, opening a permanent rift to the Void and flooding the land with shadow energy.</p>
        <p>The transformed survivors became the Khar'zuul, their bodies and minds altered by prolonged Void exposure. Now they serve the entities beyond the rift, though whether willingly or by compulsion remains a subject of dark debate.</p>`,
        mythology: `<p>The Khar'zuul worship the Great Nothing, an entity that exists beyond existence, a void that hungers for reality itself. They believe that all creation is merely a dream, and the Great Nothing will one day wake and unmake everything.</p>
        <p>The Void Prophets speak of the Coming Silence, when the rift will expand to consume the entire world, merging it with the Void in an act of cosmic liberation.</p>
        <p>Dark rituals are performed at the Nexus, the point where the rift first opened, where the veil between worlds is thinnest and the whispers of the Void can be heard clearly.</p>`,
        trade: `<p>Khar'zuul's economy is built on forbidden goods. Void crystals, shadow silk, and bottled darkness fetch astronomical prices on the black markets. Many civilizations officially condemn trade with Khar'zuul while secretly partaking.</p>
        <p>The Silver Way connects Khar'zuul to Luminara, a route used primarily for the exchange of magical knowledge and rare reagents.</p>
        <p>Primary exports: Void crystals, shadow-infused artifacts, dark elixirs, cursed weapons, forbidden tomes, shadow silk.</p>`,
        figures: `<p><strong>The Faceless One</strong> - The mysterious ruler of Khar'zuul, who may no longer be entirely mortal. No one has seen their true face, and they communicate through shadow proxies.</p>
        <p><strong>Archmage Nihlus</strong> - The last surviving member of the original research team. His body is half-consumed by shadow, and he exists between worlds.</p>
        <p><strong>The Whisper</strong> - An entity from beyond the rift that serves as an oracle. Its prophecies are always accurate but never clear.</p>`,
        quote: '"In the void between stars, truth finds its home." - The Void Prophets'
    },
    luminara: {
        name: "Luminara",
        subtitle: "The Crystal Isles",
        emblem: "✧",
        color: "#7ec8e3",
        overview: `<p>Luminara exists as a realm of impossible beauty, where crystalline spires catch and amplify light in endless prismatic displays. The Crystal Isles float above the eastern sea, held aloft by ancient magic that scholars have studied for centuries without fully understanding.</p>
        <p>The Luminari are an ethereal people, their skin bearing faint luminescent patterns that glow with their emotions. Their capital, Crystallis, is a city grown rather than built, its crystal structures alive and responsive to the inhabitants' needs.</p>`,
        history: `<p>The Luminari claim descent from star-seeds, celestial beings who fell to earth during the Great Conjunction millennia before recorded history. Whether myth or truth, their unique physiology sets them apart from all other peoples.</p>
        <p>For most of history, Luminara remained isolated, content to observe the world from their floating isles. The Age of Conquest changed this, as Valdorian traders made first contact and opened diplomatic relations.</p>
        <p>Now Luminara serves as a center of learning and magical research, its Crystal Academy attracting students from every civilization. The current age has brought new urgency to their studies, as the darkening sun threatens the crystal formations that sustain their isles.</p>`,
        mythology: `<p>The Luminari worship the Star Weavers, celestial beings they believe created the world from crystallized light. Each crystal in their isles contains a fragment of starlight, a gift from their cosmic parents.</p>
        <p>The Great Dream is their central belief - that reality is a song being sung by the universe, and crystals are the frozen notes of that divine melody.</p>
        <p>They await the Harmonic Convergence, when all crystals will resonate together and ascend the Luminari back to the stars from whence they came.</p>`,
        trade: `<p>Luminara trades primarily in knowledge and refined magical components. Crystal lenses, focus gems, and precision instruments are their chief exports, prized by mages and scholars worldwide.</p>
        <p>The Crystal Academy accepts students from all nations, though the tuition is steep - both in gold and in commitment to peaceful pursuits.</p>
        <p>Primary exports: Crystal lenses, focus gems, magical instruments, healing crystals, star charts, enchanted glasswork.</p>`,
        figures: `<p><strong>Archon Crystalia</strong> - The elected leader of Luminara, chosen by the resonance of the Great Crystal. Her mind is said to exist partially in multiple dimensions.</p>
        <p><strong>Master Prism</strong> - The oldest living Luminari, over three centuries old. He remembers the time before contact with the outside world.</p>
        <p><strong>Singer Lyric</strong> - A young prodigy whose crystal-singing can heal wounds and purify corruption. Many believe she is destined for greatness.</p>`,
        quote: '"In crystal clarity, the universe reveals its secrets." - Luminari Wisdom'
    },
    thornhaven: {
        name: "Thornhaven",
        subtitle: "The Wild Reaches",
        emblem: "❦",
        color: "#6aa06e",
        overview: `<p>Thornhaven is a realm where nature reigns supreme, a vast expanse of ancient forests, tangled marshlands, and living wilderness that resists all attempts at taming. The people of Thornhaven live in harmony with the land, their cities built among the branches of colossal trees.</p>
        <p>The capital of Grovesong earns its name from the eternal melody that flows through the forest - a song sung by the trees themselves, harmonizing with the wind and the wildlife. Outsiders find the music unsettling at first, but many come to find it deeply comforting.</p>`,
        history: `<p>The Thornwalkers, as they call themselves, have inhabited the western forests since time immemorial. Their oral histories speak of a time when the entire world was forest, and they are the memory of that green age.</p>
        <p>When the other civilizations built their cities of stone, the Thornwalkers built theirs of living wood, coaxing trees to grow into homes, halls, and temples. This symbiotic relationship has defined their culture.</p>
        <p>The Age of Conquest brought conflict as Valdorian expansion threatened the forest borders. The resulting War of Roots lasted fifty years and ended in stalemate, with the forest proving impregnable to conventional military tactics.</p>`,
        mythology: `<p>The Thornwalkers worship the World Tree, a consciousness they believe exists within all plant life. Every tree, flower, and blade of grass is a thought in the mind of this vast, patient deity.</p>
        <p>The Green Dream is their afterlife - a realm within the World Tree where all living things eventually return, their consciousness merging with the greater whole.</p>
        <p>They fear the Coming Winter, a prophesied time when the World Tree will sleep, and the forests will die, releasing all the stored souls into oblivion.</p>`,
        trade: `<p>Thornhaven trades in the bounty of the forest: rare herbs, enchanted wood, beast pelts, and natural remedies unknown to outside alchemists. The Spirit Path connects them to distant markets.</p>
        <p>The Thornwalkers are selective traders, refusing to deal in anything that involves clear-cutting or forest destruction. This limits their commerce but preserves their principles.</p>
        <p>Primary exports: Rare herbs, medicinal bark, enchanted wood, beast parts, natural poisons, living tools.</p>`,
        figures: `<p><strong>Elder Rootwise</strong> - The oldest of the Grove Speakers, who can commune directly with the World Tree. His counsel shapes all major decisions.</p>
        <p><strong>Thorn Champion Bramble</strong> - Protector of the forest borders, who has personally turned back a dozen incursions. She fights with weapons grown from her own body.</p>
        <p><strong>Seedling</strong> - A mysterious child found in the heart of the forest, said to be a gift from the World Tree itself. Strange powers manifest around her.</p>`,
        quote: '"The forest remembers what stone forgets." - Thornwalker Proverb'
    },
    meridian: {
        name: "Meridian",
        subtitle: "The Trade Cities",
        emblem: "≋",
        color: "#e0a080",
        overview: `<p>Meridian is not a kingdom but a confederation of trading cities, bound together by commerce and mutual benefit rather than blood or conquest. The Merchant Princes rule through wealth and influence, their power measured in gold rather than land.</p>
        <p>The capital of Portum sits at the crossroads of every major trade route, a cosmopolitan metropolis where all cultures mingle. Here, the gold of Valdoria, the crystals of Luminara, the herbs of Thornhaven, and even the forbidden goods of Khar'zuul change hands in a constant flow of commerce.</p>`,
        history: `<p>Meridian began as a single trading post at the confluence of three major rivers. Its strategic location made it inevitable that it would become a center of commerce, but the Merchant Republic that emerged exceeded all expectations.</p>
        <p>The Age of Conquest was Meridian's golden age, as they profited from every conflict by selling to all sides. This neutrality earned them both wealth and resentment, but their economic indispensability protected them from retaliation.</p>
        <p>The current age has brought challenges. Supply chain disruptions and the uncertainty of the dimming sun have shaken confidence in trade. The Merchant Council struggles to maintain stability.</p>`,
        mythology: `<p>Meridians worship Fortuna, the Goddess of Fortune, who they believe tips the scales of fate in favor of the bold. Temples to Fortuna double as banks, and priests serve as financial advisors.</p>
        <p>The Great Exchange is their concept of cosmic balance - every gain requires a loss, every fortune creates a debt. This philosophy justifies both generosity and ruthless business practices.</p>
        <p>They await the Final Audit, when Fortuna will weigh all transactions and settle the ultimate account of the world.</p>`,
        trade: `<p>Meridian IS trade. Every good that moves between civilizations passes through their hands at some point. They take their cut at every stage: shipping, storage, insurance, currency exchange, and "protection."</p>
        <p>The Gold Road and Silver Way both terminate in Meridian territory, making them the gatekeepers of intercontinental commerce.</p>
        <p>Primary exports: Everything. Literally every trade good passes through Meridian at some point. They specialize in logistics, banking, and mercantile services.</p>`,
        figures: `<p><strong>First Merchant Cassius</strong> - The elected leader of the Merchant Council, whose shrewd investments have tripled Meridian's wealth in a decade.</p>
        <p><strong>Banker Aurelia</strong> - Head of the Gold House, the largest banking institution in the known world. Her word can make or break kingdoms.</p>
        <p><strong>Captain Swiftwater</strong> - Commander of the Merchant Fleet, who has mapped every sea lane and established trade routes to distant, uncharted lands.</p>`,
        quote: '"All things have a price; wisdom knows what it is." - Meridian Maxim'
    },
    ashenmoor: {
        name: "Ashenmoor",
        subtitle: "The Cursed Lands",
        emblem: "☠",
        color: "#a08070",
        overview: `<p>Ashenmoor is a land haunted by its own past. Once a great kingdom rivaling Valdoria in power and prestige, it was destroyed in a cataclysm known only as the Burning. Now the land lies grey and ashen, haunted by spirits and the remnants of a civilization that refused to die completely.</p>
        <p>The capital of Ashwatch was rebuilt upon the ruins of the old capital, its inhabitants a mix of descendants who survived the cataclysm and outcasts from other lands who found acceptance among the damned. They are a grim, determined people, shaped by tragedy.</p>`,
        history: `<p>The Ashen Kingdom was once the most advanced civilization in the known world, having unlocked secrets of magic that others hadn't dreamed of. Hubris led to their downfall - a ritual intended to grant immortality instead unleashed a fire that consumed the entire kingdom in a single night.</p>
        <p>Only those outside the capital survived, and they returned to find their civilization reduced to ash and bones. The survivors rebuilt, but the land itself remained scarred, infused with the death-energy of millions.</p>
        <p>The current inhabitants have learned to harness this necromantic energy, using it for defense and industry. Other civilizations view them with fear and suspicion, but Ashenmoor persists, bound to their haunted lands.</p>`,
        mythology: `<p>The Ashenfolk worship the Memory, a collective spirit formed from the souls of those who died in the Burning. They believe their ancestors guide and protect them, and that one day the Memory will reclaim the land.</p>
        <p>The Reckoning is their end-times prophecy - when the Memory will grow strong enough to restore the Ashen Kingdom to its former glory, raising the dead to live again in a land purified by flame.</p>
        <p>They practice ancestor communion, regular rituals where mediums channel the voices of the dead to seek guidance and wisdom.</p>`,
        trade: `<p>Ashenmoor's trade is limited but specialized. They deal in death-related goods: preservation services, funerary items, bone artifacts, and most valuably, communion with the dead.</p>
        <p>Many seek out Ashenmoor mediums to speak with deceased loved ones or ancestors. This trade brings in essential resources, though it disturbs many outsiders.</p>
        <p>Primary exports: Preservation services, funerary goods, bone crafts, death incense, memorial stones, mediumship services.</p>`,
        figures: `<p><strong>Warden Cinder</strong> - Military leader of Ashenmoor, who commands both living soldiers and the spectral guardians that patrol the borders.</p>
        <p><strong>Highborn Ashara</strong> - Descendant of the last royal family, she serves as keeper of the Memory and performs the great communion rituals.</p>
        <p><strong>Scholar Dust</strong> - A brilliant but morbid researcher studying the cataclysm, hoping to find a way to restore the land to life.</p>`,
        quote: '"From ashes, we rose; to ashes, we return." - Ashenmoor Credo'
    }
};

const annotationsData = {
    "sun-temple": {
        title: "Temple of the First Dawn",
        icon: "☽",
        text: "Sacred site where Solara is said to have first touched the mortal realm. Pilgrims journey for months to witness the sunrise from this holy mountain peak, believed to grant visions of the future."
    },
    "void-rift": {
        title: "The Great Rift",
        icon: "✧",
        text: "The tear in reality created during the Great Working. A swirling vortex of shadow and impossibility, it serves as a gateway to the Void. Khar'zuul's most sacred and terrifying site."
    },
    "ancient-library": {
        title: "The Ruins of Portum Major",
        icon: "◈",
        text: "Once the greatest library in the ancient world, now partially ruined. Scholars from Meridian continue to excavate and preserve the knowledge within, recovering texts of immeasurable value."
    },
    "world-tree": {
        title: "Heart of the World Tree",
        icon: "❦",
        text: "The oldest and largest tree in Thornhaven, believed to be the physical manifestation of the World Tree deity. Its roots extend deeper than any mine, and its canopy blocks the sky for leagues."
    }
};

const eraData = {
    0: {
        name: "Age of Dawn",
        years: "3000-2000 B.A.",
        description: "The golden age of discovery and foundation",
        borders: {
            valdoria: { top: "12%", left: "10%", width: "28%", height: "35%" },
            kharzuul: { top: "8%", left: "40%", width: "25%", height: "32%" },
            luminara: { top: "10%", right: "5%", width: "22%", height: "35%" },
            thornhaven: { top: "45%", left: "5%", width: "28%", height: "38%" },
            meridian: { top: "42%", left: "35%", width: "28%", height: "40%" },
            ashenmoor: { top: "15%", left: "70%", width: "22%", height: "30%" }
        }
    },
    1: {
        name: "Age of Conquest",
        years: "2000-1000 B.A.",
        description: "The era of expansion and conflict",
        borders: {
            valdoria: { top: "10%", left: "8%", width: "35%", height: "40%" },
            kharzuul: { top: "5%", left: "42%", width: "30%", height: "38%" },
            luminara: { top: "12%", right: "3%", width: "25%", height: "38%" },
            thornhaven: { top: "48%", left: "3%", width: "25%", height: "35%" },
            meridian: { top: "40%", left: "32%", width: "35%", height: "45%" },
            ashenmoor: { top: "45%", right: "3%", width: "28%", height: "38%" }
        }
    },
    2: {
        name: "Age of Shadows",
        years: "1000-0 A.A.",
        description: "The current age of darkness and uncertainty",
        borders: {
            valdoria: { top: "12%", left: "10%", width: "28%", height: "35%" },
            kharzuul: { top: "8%", left: "40%", width: "30%", height: "38%" },
            luminara: { top: "10%", right: "5%", width: "25%", height: "38%" },
            thornhaven: { top: "45%", left: "5%", width: "30%", height: "40%" },
            meridian: { top: "42%", left: "35%", width: "32%", height: "45%" },
            ashenmoor: { top: "48%", right: "5%", width: "26%", height: "42%" }
        }
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const loadingScreen = document.getElementById('loading-screen');
const dustCanvas = document.getElementById('dust-canvas');
const ctx = dustCanvas.getContext('2d');
const lorePanel = document.getElementById('lore-panel');
const closeLoreBtn = document.getElementById('close-lore');
const tooltip = document.getElementById('annotation-tooltip');
const regions = document.querySelectorAll('.region');
const legendItems = document.querySelectorAll('.legend-item[data-region]');
const eraMarkers = document.querySelectorAll('.era-marker');
const annotationMarkers = document.querySelectorAll('.annotation-marker');
const timelineProgress = document.querySelector('.timeline-progress');
const timelineHandle = document.querySelector('.timeline-handle');

// ============================================
// DUST PARTICLE SYSTEM
// ============================================
let particles = [];
const particleCount = 80;

class DustParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * dustCanvas.width;
        this.y = Math.random() * dustCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.2 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.growing = Math.random() > 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.growing) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 0.6) this.growing = false;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0.1) this.growing = true;
        }

        if (this.x < 0 || this.x > dustCanvas.width || 
            this.y < 0 || this.y > dustCanvas.height) {
            this.reset();
            this.y = 0;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
    }
}

function initDustCanvas() {
    dustCanvas.width = window.innerWidth;
    dustCanvas.height = window.innerHeight;
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new DustParticle());
    }
}

function animateDust() {
    ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateDust);
}

// ============================================
// LOADING SCREEN
// ============================================
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);
}

// ============================================
// LORE PANEL FUNCTIONS
// ============================================
function openLorePanel(regionId) {
    const data = civilizationsData[regionId];
    if (!data) return;

    document.getElementById('lore-title').textContent = data.name;
    document.getElementById('lore-subtitle').textContent = data.subtitle;
    document.getElementById('overview-text').innerHTML = data.overview;
    document.getElementById('history-text').innerHTML = data.history;
    document.getElementById('mythology-text').innerHTML = data.mythology;
    document.getElementById('trade-text').innerHTML = data.trade;
    document.getElementById('figures-text').innerHTML = data.figures;
    document.getElementById('footer-quote').textContent = data.quote;

    const emblem = document.querySelector('.civilization-emblem');
    emblem.textContent = data.emblem;
    emblem.style.background = `radial-gradient(ellipse at center, ${data.color} 0%, ${adjustColor(data.color, -40)} 100%)`;

    lorePanel.classList.remove('panel-collapsed');
    lorePanel.classList.add('panel-open');

    regions.forEach(r => r.classList.remove('active'));
    document.getElementById(`region-${regionId}`)?.classList.add('active');

    legendItems.forEach(item => {
        item.classList.toggle('active', item.dataset.region === regionId);
    });
}

function closeLorePanel() {
    lorePanel.classList.remove('panel-open');
    lorePanel.classList.add('panel-collapsed');
    regions.forEach(r => r.classList.remove('active'));
    legendItems.forEach(item => item.classList.remove('active'));
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// ============================================
// TIMELINE FUNCTIONS
// ============================================
let currentEra = 0;

function switchEra(eraIndex) {
    if (eraIndex === currentEra) return;
    currentEra = eraIndex;
    const era = eraData[eraIndex];

    eraMarkers.forEach((marker, index) => {
        marker.classList.toggle('active', index === eraIndex);
    });

    const progressPercent = (eraIndex / 2) * 100;
    timelineProgress.style.setProperty('--progress', `${progressPercent}%`);
    timelineHandle.style.left = `${progressPercent}%`;

    Object.entries(era.borders).forEach(([regionId, position]) => {
        const region = document.getElementById(`region-${regionId}`);
        if (region) {
            Object.entries(position).forEach(([prop, value]) => {
                region.style[prop] = value;
            });
        }
    });
}

// ============================================
// ANNOTATION TOOLTIP FUNCTIONS
// ============================================
function showAnnotationTooltip(annotationId, event) {
    const data = annotationsData[annotationId];
    if (!data) return;

    document.querySelector('.tooltip-icon').textContent = data.icon;
    document.querySelector('.tooltip-title').textContent = data.title;
    document.querySelector('.tooltip-text').textContent = data.text;

    tooltip.classList.remove('hidden');
    
    const rect = event.target.getBoundingClientRect();
    const mapRect = document.getElementById('map-frame').getBoundingClientRect();
    
    tooltip.style.left = `${rect.left - mapRect.left + 30}px`;
    tooltip.style.top = `${rect.top - mapRect.top - 10}px`;
}

function hideAnnotationTooltip() {
    tooltip.classList.add('hidden');
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    closeLoreBtn.addEventListener('click', closeLorePanel);

    regions.forEach(region => {
        region.addEventListener('click', () => {
            const regionId = region.dataset.region;
            if (regionId) openLorePanel(regionId);
        });

        region.addEventListener('mouseenter', () => {
            region.style.transform = 'scale(1.02)';
            region.style.transition = 'transform 0.3s ease';
        });

        region.addEventListener('mouseleave', () => {
            region.style.transform = 'scale(1)';
        });
    });

    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            const regionId = item.dataset.region;
            if (regionId) openLorePanel(regionId);
        });
    });

    eraMarkers.forEach((marker, index) => {
        marker.addEventListener('click', () => switchEra(index));
    });

    annotationMarkers.forEach(marker => {
        const annotationId = marker.dataset.annotation;
        
        marker.addEventListener('mouseenter', (e) => {
            showAnnotationTooltip(annotationId, e);
        });

        marker.addEventListener('mouseleave', hideAnnotationTooltip);

        marker.addEventListener('click', (e) => {
            showAnnotationTooltip(annotationId, e);
        });
    });

    timelineHandle.addEventListener('click', () => {
        const nextEra = (currentEra + 1) % 3;
        switchEra(nextEra);
    });

    window.addEventListener('resize', () => {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLorePanel();
            hideAnnotationTooltip();
        }
    });
}

// ============================================
// TRADE ROUTE ANIMATION
// ============================================
function initTradeRouteAnimation() {
    const routes = document.querySelectorAll('.trade-route');
    
    routes.forEach((route, index) => {
        const length = route.getTotalLength ? route.getTotalLength() : 100;
        route.style.strokeDasharray = `${length}`;
        route.style.strokeDashoffset = `${length}`;
        
        setTimeout(() => {
            route.style.transition = 'stroke-dashoffset 2s ease-in-out';
            route.style.strokeDashoffset = '0';
            
            setInterval(() => {
                route.style.strokeDashoffset = `${length}`;
                setTimeout(() => {
                    route.style.strokeDashoffset = '0';
                }, 100);
            }, 4000 + index * 1000);
        }, 500 + index * 300);
    });
}

// ============================================
// COMPASS ROSE ANIMATION
// ============================================
function initCompassAnimation() {
    const needle = document.querySelector('.compass-needle');
    let angle = 0;
    
    function wobbleCompass() {
        angle += (Math.random() - 0.5) * 5;
        angle = Math.max(-15, Math.min(15, angle));
        needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
        
        setTimeout(wobbleCompass, 2000 + Math.random() * 2000);
    }
    
    wobbleCompass();
}

// ============================================
// SEA TEXTURE ANIMATION
// ============================================
function initSeaAnimation() {
    const seaWaves = document.querySelectorAll('.sea-texture path');
    
    seaWaves.forEach((wave, index) => {
        let offset = 0;
        const speed = 0.5 + index * 0.2;
        
        function animateWave() {
            offset += speed;
            wave.style.transform = `translateX(${Math.sin(offset * 0.02) * 10}px)`;
            requestAnimationFrame(animateWave);
        }
        
        animateWave();
    });
}

// ============================================
// MAP ZOOM AND PAN (Bonus Feature)
// ============================================
let mapScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function initMapInteraction() {
    const mapFrame = document.getElementById('map-frame');
    const worldMap = document.getElementById('world-map');

    mapFrame.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        mapScale = Math.max(0.8, Math.min(2, mapScale + delta));
        worldMap.style.transform = `scale(${mapScale}) translate(${translateX}px, ${translateY}px)`;
    });

    mapFrame.addEventListener('mousedown', (e) => {
        if (e.target.closest('.region') || e.target.closest('.annotation-marker')) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        mapFrame.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        worldMap.style.transform = `scale(${mapScale}) translate(${translateX}px, ${translateY}px)`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        mapFrame.style.cursor = 'default';
    });
}

// ============================================
// INITIALIZE
// ============================================
function init() {
    initDustCanvas();
    animateDust();
    hideLoadingScreen();
    initEventListeners();
    initTradeRouteAnimation();
    initCompassAnimation();
    initSeaAnimation();
    initMapInteraction();
    
    switchEra(0);
}

document.addEventListener('DOMContentLoaded', init);