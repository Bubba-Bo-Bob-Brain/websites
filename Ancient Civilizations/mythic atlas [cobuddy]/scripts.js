// scripts.js

// ===== LORE DATA =====
const civilizationData = {
    sundaran: {
        name: "The Sundaran Empire",
        cuneiform: "𒀭𒂗𒆤",
        lore: [
            "Born in the furnace of the Crimson Wastes, the Sundaran Empire rose when the first priest-kings drew fire from the earth itself. Their ziggurats pierce the sky like accusing fingers, and their astronomers chart the movements of twin moons with uncanny precision.",
            "The Great Bazaar of Zar'Ahk is said to host ten thousand merchants beneath its bronze dome, trading spices that grow nowhere else on Khaendar. Slaves of the deep desert whisper that the Empress drinks from a chalice filled with starlight.",
            "Their legions march in perfect geometric formations, each soldier trained since childhood in the Six Schools of the Sun. The Sundaran do not conquer — they illuminate, and those who resist are left in shadow."
        ],
        trade: ["Silk & Spices from Yunmai", "Obsidian from Pyrithian", "Timber from Umbrath", "Gold from Velkhar mines"],
        myth: "The Sundaran believe the sun is a cracked egg, and when it finally hatches, the world will end in flame. Their priests maintain the Great Firewall — a ring of eternal fire around the capital — to delay the hatching.",
        symbol: "☀"
    },
    velkhar: {
        name: "The Velkhar Confederacy",
        cuneiform: "𒀀𒈗𒉈",
        lore: [
            "Carved from the bones of the Iron Mountains, the Velkhar are a union of thirteen dwarf-clans who swore an oath of eternal brotherhood beneath the Stone Throne. Their forges produce weapons that sing when drawn, and their walls are said to weep with centuries of grief.",
            "Grimthar, the Confederacy's capital, sits inside a hollowed mountain whose peak glows with captured lightning. The Velkhar do not farm — they mine, and their granaries are filled with crystallized minerals that sustain their bodies when no other food is available.",
            "Their diplomats are feared across Khaendar, for a Velkhar envoy always arrives with a gift — and the gift is always a reminder of what was lost."
        ],
        trade: ["Iron & Steel to all nations", "Lightning Crystals to Thalassian", "Gemstones to Sundaran", "Ale to Yunmai"],
        myth: "The Velkhar believe the mountains were once gods who refused to bow. The gods were petrified, and their hearts still beat — deep underground, in a rhythm that shakes the world.",
        symbol: "⛰"
    },
    thalassian: {
        name: "The Thalassian League",
        cuneiform: "𒁹𒈠𒀭",
        lore: [
            "Masters of the deep blue, the Thalassian League controls every harbor from the Shattered Coast to the Edge of the World. Their fleet of glass-bottomed ships sails waters no other people dare enter, for the ocean floor is littered with the ruins of a civilization older than memory.",
            "Ondessa, the League's floating capital, is a city built on the back of a dead leviathan. Its streets are canals, its buildings are coral, and its laws are written in salt water that only the initiated can read.",
            "The Thalassian are the world's greatest cartographers, but they keep their own maps hidden. Every map they sell contains a single deliberate error — a trap for those who would follow their routes."
        ],
        trade: ["Pearls & Coral to all nations", "Sea Salt to Yunmai", "Fish Oil to Pyrithian", "Shipwrights to Sundaran"],
        myth: "The Thalassian believe the ocean was once a woman who wept so much her tears became the sea. When her last tear falls, the waters will rise and swallow the mountains.",
        symbol: "⚓"
    },
    yunmai: {
        name: "The Yunmai Dynasty",
        cuneiform: "𒀭𒂗𒆤𒀀",
        lore: [
            "Guardians of the Great River, the Yunmai Dynasty has ruled the central valley for longer than any other civilization can remember. Their capital, Xi'anmere, sits at the confluence of three rivers, and its bridges are older than the concept of roads.",
            "The Yunmai are scholars, poets, and philosophers. Their libraries contain texts written on leaves, bark, silk, and — most remarkably — on water, preserved in sealed glass chambers. Their examinations for civil service are so rigorous that the failure rate has remained at 97% for three thousand years.",
            "They do not wage war. They simply outlast. Every empire that has threatened the Yunmai has eventually become a footnote in Yunmai history textbooks."
        ],
        trade: ["Rice & Tea to all nations", "Philosophy to Velkhar", "Silk to Sundaran", "Ink to Thalassian"],
        myth: "The Yunmai believe the Great River is the spine of the sleeping dragon beneath the world. If the river dries, the dragon will wake — and the world will be reshaped by its turning.",
        symbol: "龍"
    },
    umbrath: {
        name: "The Umbrath Dominion",
        cuneiform: "𒂗𒉈𒁹",
        lore: [
            "In the whispering forests where sunlight never reaches the ground, the Umbrath Dominion thrives in eternal twilight. Their cities are grown, not built — vast fungal cathedrals that pulse with bioluminescent veins.",
            "Veyl'kor, the capital, is a city that moves. Its buildings shift and rearrange according to the moods of the Elder Council, who communicate through chemical signals released from their skin. Outsiders report feelings of peace, terror, and inexplicable hunger upon entering.",
            "The Umbrath are healers of extraordinary skill, but their medicine comes at a price. Every ailment they cure leaves the patient subtly changed — a new fear, a forgotten name, a fondness for mushrooms."
        ],
        trade: ["Medicines & Mushrooms to all nations", "Bioluminescent Dyes to Thalassian", "Wood to Velkhar", "Poisons to Pyrithian"],
        myth: "The Umbrath believe the forest is a single dreaming entity, and every tree is a thought. When the forest dreams of fire, the Pyrithian volcanoes erupt.",
        symbol: "🌿"
    },
    pyrithian: {
        name: "The Pyrithian Order",
        cuneiform: "𒀀𒈗𒉈𒁹",
        lore: [
            "Cradled by fire, the Pyrithian Order is both a nation and a religion. Their priests — called Ashwalkers — walk barefoot on magma flows as an act of devotion, their feet burning away sins with each step. Pyralis, their capital, sits in the caldera of a dormant volcano, its streets paved with cooled obsidian.",
            "The Pyrithian are the world's greatest metallurgists. Their blades hold an edge sharper than any other, and their armor is lighter than silk. They trade these wonders eagerly, but always demand a story in return — and the story must be true.",
            "Their great library, the Ash Archive, burns continuously. Scribes work in shifts, copying texts as they ignite, ensuring that knowledge is both preserved and destroyed in equal measure."
        ],
        trade: ["Obsidian & Steel to all nations", "Volcanic Glass to Sundaran", "Heat Stones to Yunmai", "Ash to Umbrath"],
        myth: "The Pyrithian believe they were forged, not born. When the last star cooled, it broke apart, and each shard became a Pyrithian soul. When all souls reunite, the star will reignite.",
        symbol: "🔥"
    }
};

const eraDescriptions = [
    "In the beginning, the Great River split the land, and the First Peoples emerged from the Sacred Caves to walk beneath twin suns.",
    "The age of expansion saw caravans cross every desert, ships round every cape, and armies push beyond the known horizon. Borders shifted like sand.",
    "Centuries of trade and war brought the civilizations together. Alliances formed, broke, and reformed. The Great Compact united six nations beneath one council.",
    "The age of dusk descends. Empires fracture, knowledge is lost, and the stars grow dim. But in the cracks, new stories are being written."
];

const eraLabels = ["Age of Genesis", "Age of Expansion", "Age of Convergence", "Age of Dusk"];

// Region geometry per era
const eraBorders = {
    0: {
        sundaran: "M180,280 L350,200 L420,260 L440,380 L360,440 L200,400 Z",
        velkhar: "M300,60 L550,40 L620,100 L580,200 L420,260 L350,200 L180,280 L200,180 Z",
        thalassian: "M580,200 L720,160 L800,200 L820,320 L760,380 L680,360 L620,300 L580,200 Z",
        yunmai: "M420,260 L580,200 L620,300 L680,360 L640,480 L520,520 L400,480 L360,440 L440,380 Z",
        umbrath: "M60,200 L180,280 L200,180 L200,60 L140,40 L60,100 Z",
        pyrithian: "M360,440 L440,380 L400,480 L520,520 L560,620 L440,680 L320,640 L280,560 Z"
    },
    1: {
        sundaran: "M160,260 L360,180 L440,240 L460,400 L380,460 L200,420 Z",
        velkhar: "M320,50 L570,30 L640,110 L600,210 L440,270 L380,210 L200,200 L220,120 Z",
        thalassian: "M600,190 L740,150 L830,210 L850,340 L780,400 L700,380 L640,320 L600,190 Z",
        yunmai: "M440,270 L600,210 L640,320 L700,380 L660,500 L540,540 L420,500 L380,460 L460,400 Z",
        umbrath: "M50,190 L200,200 L220,120 L220,50 L140,30 L50,90 Z",
        pyrithian: "M380,460 L460,400 L420,500 L540,540 L580,650 L460,700 L340,660 L300,580 Z"
    },
    2: {
        sundaran: "M170,270 L370,190 L450,250 L470,410 L390,470 L210,430 Z",
        velkhar: "M330,55 L580,35 L650,115 L610,220 L450,280 L390,220 L210,210 L230,125 Z",
        thalassian: "M610,200 L750,160 L840,220 L860,350 L790,410 L710,390 L650,330 L610,200 Z",
        yunmai: "M450,280 L610,220 L650,330 L710,390 L670,510 L550,550 L430,510 L390,470 L470,410 Z",
        umbrath: "M40,195 L210,210 L230,125 L230,55 L130,35 L40,95 Z",
        pyrithian: "M390,470 L470,410 L430,510 L550,550 L570,660 L470,710 L350,670 L310,590 Z"
    },
    3: {
        sundaran: "M190,290 L380,200 L460,260 L480,420 L400,480 L220,440 Z",
        velkhar: "M340,70 L590,50 L660,120 L620,230 L460,290 L400,230 L220,220 L240,130 Z",
        thalassian: "M620,210 L760,170 L850,230 L870,360 L800,420 L720,400 L660,340 L620,210 Z",
        yunmai: "M460,290 L620,210 L660,340 L720,400 L680,520 L560,560 L440,520 L400,480 L480,420 Z",
        umbrath: "M30,205 L220,220 L240,130 L240,65 L130,45 L30,100 Z",
        pyrithian: "M400,480 L480,420 L440,520 L560,560 L580,670 L480,720 L360,680 L320,600 Z"
    }
};

// ===== DOM ELEMENTS =====
const eraSlider = document.getElementById("eraSlider");
const eraDescription = document.getElementById("eraDescription");
const eraLabelsContainer = document.querySelector(".era-labels");
const regions = document.querySelectorAll(".region");
const legendItems = document.querySelectorAll(".legend-item");
const lorePanel = document.getElementById("lorePanel");
const lorePanelInner = document.getElementById("lorePanelInner");
const loreClose = document.getElementById("loreClose");
const loreTitle = document.getElementById("loreTitle");
const loreBody = document.getElementById("loreBody");
const loreCuneiform = document.getElementById("loreCuneiform");
const loreCuneiform2 = document.getElementById("loreCuneiform2");
const tradeInfo = document.getElementById("tradeInfo");
const tooltip = document.getElementById("tooltip");
const caravanElements = document.querySelectorAll(".caravan");
const mythAnnotations = document.querySelectorAll(".myth-marker");

// ===== STATE =====
let currentEra = 0;
let activeRegion = null;

// ===== TOOLTIP =====
document.addEventListener("mousemove", (e) => {
    if (tooltip.classList.contains("visible")) {
        tooltip.style.left = e.clientX + 16 + "px";
        tooltip.style.top = e.clientY - 10 + "px";
    }
});

// ===== REGION HOVER TOOLTIP =====
regions.forEach(region => {
    region.addEventListener("mouseenter", (e) => {
        const name = region.dataset.name;
        tooltip.textContent = name;
        tooltip.classList.add("visible");
    });

    region.addEventListener("mousemove", (e) => {
        tooltip.style.left = e.clientX + 16 + "px";
        tooltip.style.top = e.clientY - 10 + "px";
    });

    region.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
    });
});

// ===== REGION CLICK - LORE PANEL =====
regions.forEach(region => {
    region.addEventListener("click", () => {
        const civKey = region.dataset.civilization;
        const data = civilizationData[civKey];

        // Remove previous active
        regions.forEach(r => r.classList.remove("active"));
        legendItems.forEach(l => l.classList.remove("highlight"));

        // Set active
        region.classList.add("active");
        activeRegion = civKey;

        // Find matching legend item and highlight
        const matchingLegend = document.querySelector(`.legend-item[data-civ="${civKey}"]`);
        if (matchingLegend) {
            matchingLegend.classList.add("highlight");
        }

        // Populate lore panel
        loreCuneiform.textContent = data.cuneiform;
        loreCuneiform2.textContent = data.cuneiform;
        loreTitle.textContent = data.name;

        const randomLore = data.lore[Math.floor(Math.random() * data.lore.length)];
        loreBody.innerHTML = `
            <p>${randomLore}</p>
            <p style="margin-top: 20px; padding: 12px; background: rgba(42,26,10,0.06); border-left: 3px solid var(--gold-accent); font-style: italic; color: var(--text-secondary);">
                ✦ Myth: ${data.myth}
            </p>
        `;

        tradeInfo.innerHTML = `
            <h4>Trade & Exchange</h4>
            <ul>
                ${data.trade.map(t => `<li>${t}</li>`).join("")}
            </ul>
        `;

        lorePanel.classList.add("open");
    });
});

// ===== LORE PANEL CLOSE =====
loreClose.addEventListener("click", () => {
    lorePanel.classList.remove("open");
    regions.forEach(r => r.classList.remove("active"));
    legendItems.forEach(l => l.classList.remove("highlight"));
    activeRegion = null;
});

// Close on escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        lorePanel.classList.remove("open");
        regions.forEach(r => r.classList.remove("active"));
        legendItems.forEach(l => l.classList.remove("highlight"));
        activeRegion = null;
    }
});

// ===== LEGEND CLICK =====
legendItems.forEach(item => {
    item.addEventListener("click", () => {
        const civKey = item.dataset.civ;
        if (!civKey) return;

        // Remove previous
        regions.forEach(r => r.classList.remove("active"));
        legendItems.forEach(l => l.classList.remove("highlight"));

        // Highlight region and legend
        const region = document.getElementById(`region-${civKey}`);
        if (region) {
            region.classList.add("active");
            activeRegion = civKey;
        }
        item.classList.add("highlight");

        // Show lore panel
        const data = civilizationData[civKey];
        loreCuneiform.textContent = data.cuneiform;
        loreCuneiform2.textContent = data.cuneiform;
        loreTitle.textContent = data.name;

        const randomLore = data.lore[Math.floor(Math.random() * data.lore.length)];
        loreBody.innerHTML = `
            <p>${randomLore}</p>
            <p style="margin-top: 20px; padding: 12px; background: rgba(42,26,10,0.06); border-left: 3px solid var(--gold-accent); font-style: italic; color: var(--text-secondary);">
                ✦ Myth: ${data.myth}
            </p>
        `;

        tradeInfo.innerHTML = `
            <h4>Trade & Exchange</h4>
            <ul>
                ${data.trade.map(t => `<li>${t}</li>`).join("")}
            </ul>
        `;

        lorePanel.classList.add("open");
    });
});

// ===== ERA SLIDER =====
eraSlider.addEventListener("input", (e) => {
    const newEra = parseInt(e.target.value);
    if (newEra === currentEra) return;
    currentEra = newEra;

    // Update era labels
    document.querySelectorAll(".era-label").forEach(label => {
        label.classList.remove("active");
        if (parseInt(label.dataset.era) === newEra) {
            label.classList.add("active");
        }
    });

    // Update description
    eraDescription.style.opacity = 0;
    setTimeout(() => {
        eraDescription.textContent = eraDescriptions[newEra];
        eraDescription.style.opacity = 1;
    }, 300);

    // Animate borders
    animateEraTransition();
});

// ===== ERA TRANSITION ANIMATION =====
function animateEraTransition() {
    regions.forEach(region => {
        const civKey = region.dataset.civilization;
        const newPath = eraBorders[currentEra][civKey];
        region.classList.add("era-transition");

        // Morph path
        const startPath = region.getAttribute("d");
        const endPath = newPath;

        // Simple approach: set new path with transition
        region.style.transition = "d 0.8s ease-in-out";
        region.setAttribute("d", endPath);

        setTimeout(() => {
            region.classList.remove("era-transition");
            region.style.transition = "";
        }, 800);
    });

    // Update sea labels position slightly
    updateEraDetails();
}

// ===== ERA DETAIL UPDATES =====
function updateEraDetails() {
    const mythTexts = [
        ["The Void Where The First Dragon Slept", "Pillars of the Drowned Kingdom", "Stormwatcher's Perch"],
        ["The Cracked Egg of the Sun", "The Mountain Gods' Hearts", "The Weeping Woman's Last Tear"],
        ["The River Dragon's Spine", "The Star That Broke", "The Dreaming Forest's Fire"],
        ["The Fading Star's Reunion", "The Last Caravan", "The Sleeping Leviathan Stirs"]
    ];

    const annotations = document.querySelectorAll(".myth-marker text");
    const eraMyths = mythTexts[currentEra];

    annotations.forEach((text, i) => {
        if (eraMyths[i]) {
            const lines = eraMyths[i].split(" ");
            if (text.textContent.includes("Void") || text.textContent.includes("Pillars") || text.textContent.includes("Storm")) {
                text.textContent = "✦ " + eraMyths[i] + " ✦";
            }
        }
    });
}

// ===== ERA LABEL CLICK =====
document.querySelectorAll(".era-label").forEach(label => {
    label.addEventListener("click", () => {
        const era = parseInt(label.dataset.era);
        eraSlider.value = era;
        eraSlider.dispatchEvent(new Event("input"));
    });
});

// ===== CARAVAN PAUSE ON HOVER =====
const tradeRoutesContainer = document.getElementById("tradeRoutes");
tradeRoutesContainer.addEventListener("mouseenter", () => {
    caravanElements.forEach(caravan => {
        caravan.style.animationPlayState = "paused";
    });
});

tradeRoutesContainer.addEventListener("mouseleave", () => {
    caravanElements.forEach(caravan => {
        caravan.style.animationPlayState = "running";
    });
});

// ===== MYTH ANNOTATION HOVER =====
mythAnnotations.forEach(marker => {
    marker.style.cursor = "pointer";
    marker.style.transition = "opacity 0.3s";

    marker.addEventListener("mouseenter", () => {
        marker.style.opacity = "1";
        marker.querySelectorAll("text").forEach(t => {
            t.style.fontSize = "10px";
            t.style.fill = "#8b1a1a";
        });
    });

    marker.addEventListener("mouseleave", () => {
        marker.style.opacity = "0.6";
        marker.querySelectorAll("text").forEach(t => {
            t.style.fontSize = "8px";
            t.style.fill = "#8b1a1a";
        });
    });

    marker.addEventListener("click", () => {
        const mythTexts = [
            "In the age before ages, a dragon of immeasurable size slept beneath the earth. Its breath warmed the deserts and its dreams shaped the mountains. When it stirs, the world will remember what it means to be small.",
            "Beneath the waves lies the kingdom of Aethon, drowned when the moon fell from the sky. Its towers still gleam in the deep, and its bells ring on nights when the sea is calm and the fishermen are wise enough to listen.",
            "The highest peak of the world is not a mountain but a perch — the roost of Stormwatcher, an ancient bird whose wings create the winds. Sailors leave offerings at its base, and those who climb too high are never seen again."
        ];

        loreCuneiform.textContent = "✦";
        loreCuneiform2.textContent = "✦";
        loreTitle.textContent = "Ancient Myth";
        loreBody.innerHTML = `
            <p style="font-style: italic; color: var(--crimson); line-height: 1.9;">${mythTexts[currentEra]}</p>
            <p style="margin-top: 16px; font-size: 0.9rem; color: var(--text-secondary); padding: 10px; border-top: 1px solid var(--ink-light);">
                — From the Codex of Unspoken Things, transcribed by an unknown hand
            </p>
        `;
        tradeInfo.innerHTML = "";
        lorePanel.classList.add("open");
    });
});

// ===== INIT =====
// Set initial era label
document.querySelector(`.era-label[data-era="0"]`).classList.add("active");

// Animate myth annotations on load
mythAnnotations.forEach((marker, i) => {
    marker.style.opacity = "0";
    marker.style.transition = "opacity 1s ease-in-out";
    setTimeout(() => {
        marker.style.opacity = "0.6";
    }, 1000 + i * 200);
});

// Add subtle parallax to map on mouse move
const mapContainer = document.querySelector(".map-inner");
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    mapContainer.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    mapContainer.style.transition = "transform 0.3s ease-out";
});

// Tooltip styling updates
tooltip.style.fontFamily = "var(--font-heading)";