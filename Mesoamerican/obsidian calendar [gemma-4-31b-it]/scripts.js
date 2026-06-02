/**
 * The Obsidian Codex - Ceremonial Logic
 * Handles the celestial wheel rotation, ritual synchronization, and atmospheric timers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Data: The Sacred Cycles ---
    const ritualCycles = [
        { name: "The Awakening of the Ocelot", desc: "A time of fierce strength and territorial expansion. The jungle whispers secrets of power.", tributes: ["Jaguar Pelt", "Obsidian Blade", "Raw Cacao"] },
        { name: "The Breath of the Wind", desc: "The spirit of Ehecatl clears the path. Ideal for communication and spiritual cleansing.", tributes: ["White Incense", "Bird Feathers", "Pure Water"] },
        { name: "The Foundation of the House", desc: "Focus on ancestry, stability, and the protection of the hearth.", tributes: ["Corn Meal", "Clay Pottery", "Copper Rings"] },
        { name: "The Shedding of the Lizard", desc: "A period of regeneration and hidden knowledge. The old skin falls away.", tributes: ["Dried Herbs", "Jade Dust", "Honey"] },
        { name: "The Coil of the Serpent", desc: "Wisdom flows through the earth. A day for divination and strategic planning.", tributes: ["Emerald Stones", "Sandalwood", "Gold Leaf"] },
        { name: "The Descent into Death", desc: "Mictlāntēcutli demands silence. A ritual of remembrance and transition.", tributes: ["Marigolds", "Skull Carvings", "Black Salt"] },
        { name: "The Flight of the Deer", desc: "Harmony with nature and the pursuit of agility and grace.", tributes: ["Forest Berries", "Deer Antlers", "Amber"] },
        { name: "The Moon-Rabbit's Dream", desc: "A cycle of fertility, intuition, and the mysteries of the night sky.", tributes: ["Silver Coins", "Milk", "White Flowers"] },
        { name: "The Flow of the Eternal Water", desc: "Purification of the soul. The tides bring news from distant lands.", tributes: ["Pearls", "Sea Shells", "Blue Pigment"] },
        { name: "The Howl of the Dog", desc: "Loyalty and guardianship. Protecting the gateway between worlds.", tributes: ["Dried Meat", "Leather Straps", "Bone Flutes"] },
        { name: "The Trickster's Gambit", desc: "Chaos and creativity. The Monkey deity challenges the status quo.", tributes: ["Bright Fruit", "Mirrors", "Colorful Beads"] },
        { name: "The Growth of the Sacred Grass", desc: "Abundance and the harvest. Celebrating the generosity of the earth.", tributes: ["Golden Grain", "Papyrus", "Green Jade"] }
    ];

    // --- State Management ---
    let currentRotation = 0;
    let currentStep = 0; // 0 to 11
    const stepAngle = 30; // 360 / 12 glyphs

    // DOM Elements
    const outerRing = document.getElementById('ring-outer');
    const innerRing = document.getElementById('ring-inner');
    const activeRitualText = document.getElementById('active-ritual');
    const ritualDescText = document.getElementById('ritual-description');
    const tributeList = document.getElementById('tribute-list');
    const btnNext = document.getElementById('rotate-next');
    const btnPrev = document.getElementById('rotate-prev');
    const timerClock = document.getElementById('timer-clock');

    // --- Core Functions ---

    /**
     * Rotates the wheel and updates the ritual data
     * @param {number} direction - 1 for clockwise, -1 for counter-clockwise
     */
    function rotateWheel(direction) {
        // Update state
        currentStep += direction;
        
        // Wrap around logic (Circular array)
        if (currentStep > 11) currentStep = 0;
        if (currentStep < 0) currentStep = 11;

        currentRotation += (direction * stepAngle);

        // Apply rotation to the rings
        outerRing.style.transform = `rotate(${currentRotation}deg)`;
        innerRing.style.transform = `rotate(${currentRotation * 0.5}deg)`; // Inner ring rotates slower for parallax

        // Visual "Lock" effect
        triggerLockEffect();
        
        // Update the UI panels
        updateRitualDisplay();
    }

    /**
     * Updates the ritual and tribute panels based on the current glyph
     */
    function updateRitualDisplay() {
        const ritual = ritualCycles[currentStep];
        
        // Fade out effect
        const panel = document.getElementById('ritual-panel');
        panel.style.opacity = '0';
        
        setTimeout(() => {
            activeRitualText.innerText = ritual.name;
            ritualDescText.innerText = ritual.desc;
            
            // Rebuild tribute list
            tributeList.innerHTML = '';
            ritual.tributes.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item}</span> <span class="amount">Required</span>`;
                tributeList.appendChild(li);
            });
            
            panel.style.opacity = '1';
        }, 300);
    }

    /**
     * Creates a physical sensation of the stone locking into place
     */
    function triggerLockEffect() {
        document.body.style.animation = 'none';
        void document.body.offsetWidth; // Trigger reflow
        document.body.style.animation = 'shake 0.2s ease-in-out';
    }

    /**
     * Blood-Moon Countdown Logic
     */
    function startBloodMoonTimer() {
        // Set a target date (e.g., 30 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerClock.innerText = 
                `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // --- Event Listeners ---

    btnNext.addEventListener('click', () => rotateWheel(1));
    btnPrev.addEventListener('click', () => rotateWheel(-1));

    // Allow clicking on glyphs directly
    document.querySelectorAll('.glyph-slot').forEach((slot, index) => {
        slot.addEventListener('click', () => {
            // Calculate how many steps to move to reach this index
            const diff = index - currentStep;
            // This is a simplified version; in a real app we'd calculate shortest path
            currentStep = index;
            currentRotation = index * stepAngle * -1; // Align glyph to top (needle)
            
            outerRing.style.transform = `rotate(${currentRotation}deg)`;
            innerRing.style.transform = `rotate(${currentRotation * 0.5}deg)`;
            
            triggerLockEffect();
            updateRitualDisplay();
        });
    });

    // Initializations
    startBloodMoonTimer();
    updateRitualDisplay();
});

// Add a dynamic shake animation via JS to avoid adding it to CSS if not needed
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0% { transform: translate(0,0); }
        25% { transform: translate(2px, -2px); }
        50% { transform: translate(-2px, 2px); }
        75% { transform: translate(2px, 2px); }
        100% { transform: translate(0,0); }
    }
`;
document.head.appendChild(style);