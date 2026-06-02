document.addEventListener('DOMContentLoaded', () => {
    // --- Data Catalogs ---
    const afflictions = [
        { title: "The Grey Wasting", desc: "A slow decay of the flesh that turns skin to stone and hope to dust.", tag: "Physical" },
        { title: "Whispers of the Void", desc: "Auditory hallucinations that drive victims to madness and self-mutilation.", tag: "Mental" },
        { title: "The Crimson Itch", desc: "A magical rash that burns with the heat of a dying star.", tag: "Magical" },
        { title: "Sorrow's Weight", desc: "An invisible burden that makes every step feel like climbing a mountain.", tag: "Curse" },
        { title: "Bloodblight", desc: "The blood turns acidic, burning from the inside out.", tag: "Biological" },
        { title: "The Hollow Gaze", desc: "Victims lose their reflection, then their shadow, then their soul.", tag: "Existential" }
    ];

    const artifacts = [
        { title: "The Weeping Crown", desc: "A circlet of black iron that forces the wearer to feel the pain of all who died nearby.", tag: "Headgear" },
        { title: "Sorrow's Edge", desc: "A sword that cuts deeper the more regret the wielder holds.", tag: "Weapon" },
        { title: "The Unbound Tome", desc: "A book that writes the reader's future in real-time, always ending in tragedy.", tag: "Relic" },
        { title: "Ashen Hourglass", desc: "Measures not time, but the remaining life of the holder.", tag: "Tool" },
        { title: "The Shattered Lens", desc: "Shows the viewer the worst possible version of themselves.", tag: "Optical" },
        { title: "Chains of the Oathbreaker", desc: "Bind the wearer to promises they can never fulfill.", tag: "Restraint" }
    ];

    const prophecies = [
        { text: "When the twin suns bleed, the Silent King shall wake from his slumber of ages.", source: "The Codex of Endings" },
        { text: "In the city of rust and tears, the last light shall be extinguished by a child's hand.", source: "Whispers of the Damned" },
        { text: "The stars will fall like rotten fruit, and the earth shall drink their poisoned light.", source: "Astral Reckoning" },
        { text: "From the ashes of the old world, a new horror shall rise, born of despair and shadow.", source: "The Final Testament" },
        { text: "Beware the laughter of the dead, for it heralds the coming of the Void.", source: "Mournful Echoes" }
    ];

    const realms = [
        { name: "The Ashlands", status: "Uninhabitable" },
        { name: "The Mire of Sorrows", status: "Dangerous" },
        { name: "The Spire of Silence", status: "Forbidden" },
        { name: "The Guttering Vale", status: "Dying" },
        { name: "The Bone Wastes", status: "Desolate" },
        { name: "The Drowned Citadel", status: "Submerged" }
    ];

    // --- DOM Elements ---
    const miseryFill = document.getElementById('miseryFill');
    const miseryValue = document.getElementById('miseryValue');
    const afflictionGrid = document.querySelector('.affliction-grid');
    const artifactGrid = document.querySelector('.artifact-grid');
    const prophecyScroll = document.querySelector('.prophecy-scroll');
    const realmMap = document.querySelector('.realm-map');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const cards = document.querySelectorAll('.card');

    // --- State ---
    let currentMisery = 78;

    // --- Functions ---

    function updateMisery(amount) {
        currentMisery = Math.min(100, Math.max(0, currentMisery + amount));
        miseryFill.style.width = `${currentMisery}%`;
        miseryValue.textContent = `${Math.round(currentMisery)}%`;
        
        // Visual feedback on high misery
        if (currentMisery > 90) {
            document.body.style.boxShadow = "inset 0 0 100px rgba(138, 28, 28, 0.5)";
        } else {
            document.body.style.boxShadow = "none";
        }
    }

    function createCard(item, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.desc}</p>
            <span class="card-tag">${item.tag || item.status}</span>
        `;
        
        // Add misery interaction
        card.addEventListener('mouseenter', () => updateMisery(0.5));
        card.addEventListener('mouseleave', () => updateMisery(-0.2));
        
        return card;
    }

    function renderContent() {
        // Render Afflictions
        afflictions.forEach(item => {
            afflictionGrid.appendChild(createCard(item));
        });

        // Render Artifacts
        artifacts.forEach(item => {
            artifactGrid.appendChild(createCard(item));
        });

        // Render Prophecies
        prophecies.forEach(item => {
            const div = document.createElement('div');
            div.className = 'prophecy-item';
            div.innerHTML = `
                <p class="prophecy-text">"${item.text}"</p>
                <p class="prophecy-source">— ${item.source}</p>
            `;
            div.addEventListener('mouseenter', () => updateMisery(0.3));
            prophecyScroll.appendChild(div);
        });

        // Render Realms
        realms.forEach(item => {
            const div = document.createElement('div');
            div.className = 'realm-card';
            div.innerHTML = `
                <h3 class="realm-name">${item.name}</h3>
                <p class="realm-status">${item.status}</p>
            `;
            div.addEventListener('mouseenter', () => updateMisery(0.4));
            realmMap.appendChild(div);
        });
    }

    // --- Event Listeners ---

    // Tab Switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            
            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });

            // Small misery bump for navigating
            updateMisery(1);
        });
    });

    // Initialize
    renderContent();
    
    // Ambient misery decay (suffering lessens slightly over time if you stop interacting)
    setInterval(() => {
        if (currentMisery > 50) {
            updateMisery(-0.1);
        }
    }, 2000);
});