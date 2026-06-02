/**
 * THE LEDGER OF THE LOST - Script
 * Managing the souls of the doomed.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Character Data (The Roster) ---
    // In a real production environment, this might come from an API/JSON file.
    const characters = [
        {
            name: "Brother Thomas",
            occupation: "Disgraced Monk",
            caste: "Clergy",
            morality: "good",
            stats: { plague: 30, faith: 85, survival: 45 },
            description: "Seeking absolution through suffering, though his prayers go unheard by a silent God.",
            tags: ["🕯️ Devout", "🍷 Weak-bodied"],
            lore: "Once a high scholar in the cathedral of Paris, Thomas fled when the bells began to toll for the dead. He carries a heavy iron cross, not for prayer, but as a weapon against the darkness."
        },
        {
            name: "Malachi Vane",
            occupation: "Plague Doctor",
            caste: "Outcast",
            morality: "neutral",
            stats: { plague: 70, faith: 10, survival: 80 },
            description: "A man of science in an age of superstition. He walks the lines between life and rot.",
            tags: ["🧪 Alchemist", "🎭 Masked"],
            lore: "Malachi doesn't believe in divine wrath. He believes in miasma, humors, and the efficiency of vinegar. His mask is his only friend in a world of screaming patients."
        },
        {
            name: "Sir Alistair",
            occupation: "Broken Knight",
            caste: "Nobility",
            morality: "chaotic",
            stats: { plague: 50, faith: 40, survival: 90 },
            description: "Armor rusted by salt and blood. He fights not for honor, but for the spite of living.",
            tags: ["⚔️ Combatant", "🛡️ Resilient"],
            lore: "His lineage ended with the siege of his home. Now, he wanders the plague-lands, a mercenary with nothing left to lose but his life."
        },
        {
            name: "Elara the Weaver",
            occupation: "Village Herbalist",
            caste: "Serf",
            morality: "good",
            stats: { plague: 60, faith: 30, survival: 75 },
            description: "She knows which roots heal and which ones merely numb the pain of dying.",
            tags: ["🌿 Healer", "🌙 Intuitive"],
            lore: "Elara was accused of witchcraft once. Now, the villagers come to her in secret, terrified of the swellings in their necks but more terrified of the silence of the woods."
        },
        {
            name: "Kaelen the Thief",
            occupation: "Street Urchin",
            caste: "Outcast",
            morality: "chaotic",
            stats: { plague: 40, faith: 5, survival: 85 },
            description: "Small, fast, and utterly devoid of conscience.",
            tags: ["🪙 Nimble", "🐀 Scavenger"],
            lore: "Kaelen learned early that in a dying city, a heavy purse is worth more than a prayer. He moves through the shadows of the alleyways like a ghost."
        },
        {
            name: "Father Benedict",
            occupation: "Inquisitor",
            caste: "Clergy",
            morality: "neutral",
            stats: { plague: 20, faith: 95, survival: 50 },
            description: "He hunts the heretic even as the pestilence hunts the saint.",
            tags: ["🔥 Zealot", "📜 Lawful"],
            lore: "Benedict believes the Black Death is a cleansing fire. To him, the suffering is a necessary ritual to purge the sinful from the earth."
        }
        // ... More characters can be added here following the same structure
    ];

    // --- DOM Elements ---
    const grid = document.getElementById('character-grid');
    const modal = document.getElementById('character-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // --- Initialization ---
    function init() {
        renderCharacters(characters);
        setupEventListeners();
    }

    // --- Core Functions ---

    /**
     * Renders the character cards into the grid
     * @param {Array} charArray 
     */
    function renderCharacters(charArray) {
        grid.innerHTML = ''; // Clear existing
        
        charArray.forEach((char, index) => {
            const card = createCharacterCard(char, index);
            grid.appendChild(card);
        });
    }

    /**
     * Creates the HTML structure for a single character card
     */
    function createCharacterCard(char, index) {
        const article = document.createElement('article');
        article.className = 'character-card';
        article.setAttribute('data-morality', char.morality);
        // Staggered animation delay
        article.style.animationDelay = `${index * 0.1}s`;
        article.style.opacity = '0'; // Start invisible for reveal effect

        article.innerHTML = `
            <div class="card-inner">
                <div class="portrait-container">
                    <div class="portrait-placeholder">
                        <span class="portrait-label">Portrait Missing</span>
                    </div>
                    <div class="caste-badge">${char.caste}</div>
                </div>
                <div class="character-info">
                    <h2 class="char-name">${char.name}</h2>
                    <p class="char-occupation">${char.occupation}</p>
                    
                    <div class="char-stats">
                        <div class="stat-item" title="Plague Resistance">
                            <span class="stat-icon">💀</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${char.stats.plague}%;"></div></div>
                        </div>
                        <div class="stat-item" title="Faith">
                            <span class="stat-icon">🕯️</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${char.stats.faith}%;"></div></div>
                        </div>
                        <div class="stat-item" title="Survival Skill">
                            <span class="stat-icon">🌾</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${char.stats.survival}%;"></div></div>
                        </div>
                    </div>

                    <div class="char-description">
                        "${char.description}"
                    </div>

                    <div class="char-tags">
                        ${char.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        // Trigger the entrance animation
        setTimeout(() => {
            article.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            article.style.opacity = '1';
        }, 50);

        // Click to open modal
        article.addEventListener('click', () => openModal(char));

        return article;
    }

    /**
     * Opens the detailed view modal
     */
    function openModal(char) {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${char.name}</h2>
                <p class="modal-subtitle">${char.occupation} | ${char.caste}</p>
            </div>
            <div class="modal-main">
                <div class="modal-stats-grid">
                    <div class="m-stat">
                        <label>Plague Resistance</label>
                        <div class="m-bar"><div class="m-fill" style="width: ${char.stats.plague}%"></div></div>
                    </div>
                    <div class="m-stat">
                        <label>Faith</label>
                        <div class="m-bar"><div class="m-fill" style="width: ${char.stats.faith}%"></div></div>
                    </div>
                    <div class="m-stat">
                        <label>Survival</label>
                        <div class="m-bar"><div class="m-fill" style="width: ${char.stats.survival}%"></div></div>
                    </div>
                </div>
                <div class="modal-lore">
                    <p>${char.lore}</p>
                </div>
                <div class="modal-tags">
                    ${char.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    /**
     * Closes the modal
     */
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    /**
     * Sets up all click listeners
     */
    function setupEventListeners() {
        closeModal.addEventListener('click', closeModalFunc);
        modalOverlay.addEventListener('click', closeModalFunc);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModalFunc();
            }
        });
    }

    // Run the app
    init();
});