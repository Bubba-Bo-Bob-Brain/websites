document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATASETS ---
    
    // The 20 Day Signs (Tonalpohualli)
    const daySigns = [
        { 
            name: "Cipactli", 
            meaning: "Crocodile", 
            glyph: "𓃻", 
            deity: "Tonacatecuhtli", 
            domain: "Lord of Sustenance",
            lore: "The primordial earth monster floating in the primordial waters. A day of creation and new beginnings.",
            tribute: ["Maize", "Jade", "Water"]
        },
        { 
            name: "Ehecatl", 
            meaning: "Wind", 
            glyph: "𓇬", 
            deity: "Quetzalcoatl", 
            domain: "The Feathered Serpent",
            lore: "The breath of life. Unpredictable and invisible. It brings change and sweeps away the old.",
            tribute: ["Copal Smoke", "Feathers", "Wind Chimes"]
        },
        { 
            name: "Calli", 
            meaning: "House", 
            glyph: "⌂", 
            deity: "Tepeyollotl", 
            domain: "Heart of the Mountain",
            lore: "A day of rest and family. The sanctuary where one finds protection from the chaos outside.",
            tribute: ["Wood", "Stone", "Food"]
        },
        { 
            name: "Cuetzpalin", 
            meaning: "Lizard", 
            glyph: "𓆓", 
            deity: "Huehuecoyotl", 
            domain: "The Old Coyote",
            lore: "Agility and quickness. A day to be cautious of deception, but to embrace flexibility.",
            tribute: ["Insects", "Small Gems", "Agave"]
        },
        { 
            name: "Coatl", 
            meaning: "Serpent", 
            glyph: "𓆙", 
            deity: "Chalchiuhtlicue", 
            domain: "Jade Skirt",
            lore: "The serpent is the connection between the earth and the sky. A day of duality and wisdom.",
            tribute: ["Serpent Stones", "Water", "Red Paint"]
        },
        { 
            name: "Miquiztli", 
            meaning: "Death", 
            glyph: "💀", 
            deity: "Tecciztecatl", 
            domain: "Moon God",
            lore: "Not an end, but a transformation. The skull represents the seeds of life waiting to bloom.",
            tribute: ["Obsidian", "Bone", "Marigolds"]
        },
        { 
            name: "Mazatl", 
            meaning: "Deer", 
            glyph: "🦌", 
            deity: "Tlalzolteotl", 
            domain: "Eater of Filth",
            lore: "The deer is the stag of the forest. A day of hunting, speed, and the Prowess of the warrior.",
            tribute: ["Venison", "Hide", "Antlers"]
        },
        { 
            name: "Tochtli", 
            meaning: "Rabbit", 
            glyph: "🐇", 
            deity: "Mayahuel", 
            domain: "Goddess of Maguey",
            lore: "Fertility and abundance. The rabbit represents the moon's excess. A day for celebration.",
            tribute: ["Pulque", "Roots", "Flowers"]
        },
        { 
            name: "Atl", 
            meaning: "Water", 
            glyph: "🌊", 
            deity: "Xiuhtecuhtli", 
            domain: "Lord of Fire/Year",
            lore: "Water that cleanses and water that destroys. A volatile day of purification and instability.",
            tribute: ["Springs", "Shells", "Coral"]
        },
        { 
            name: "Itzcuintli", 
            meaning: "Dog", 
            glyph: "🐕", 
            deity: "Mictlantecuhtli", 
            domain: "Lord of the Dead",
            lore: "The faithful companion who guides the soul through the underworld. Loyalty above all.",
            tribute: ["Bones", "Meat", "Ashes"]
        },
        { 
            name: "Ozomatli", 
            meaning: "Monkey", 
            glyph: "🐒", 
            deity: "Xochipilli", 
            domain: "Prince of Flowers",
            lore: "The trickster, the artist, the dancer. A day of play, music, and unrestrained creativity.",
            tribute: ["Fruit", "Bright Feathers", "Music"]
        },
        { 
            name: "Malinalli", 
            meaning: "Grass", 
            glyph: "🌾", 
            deity: "Patecatl", 
            domain: "God of Medicine",
            lore: "Grass that is trampled but rises again. A day of perseverance and healing herbs.",
            tribute: ["Herbs", "Tobacco", "Woven Mats"]
        },
        { 
            name: "Acatl", 
            meaning: "Reed", 
            glyph: "🎋", 
            deity: "Itztlacoliuhqui", 
            domain: "Curved Obsidian Knife",
            lore: "Reeds are used to make arrows and darts. A day of order, authority, and justice.",
            tribute: ["Reed Arrows", "Paper", "Ink"]
        },
        { 
            name: "Ocelotl", 
            meaning: "Jaguar", 
            glyph: "🐆", 
            deity: "Tlazolteotl", 
            domain: "Goddess of Birth",
            lore: "The supreme night predator. The Jaguar Sun rules the underworld. A day of bravery.",
            tribute: ["Jaguar Pelts", "Claws", "Teeth"]
        },
        { 
            name: "Cuauhtli", 
            meaning: "Eagle", 
            glyph: "🦅", 
            deity: "Xipe Totec", 
            domain: "The Flayed One",
            lore: "The eagle soaring high, seeing all. A day of freedom and vision for warriors.",
            tribute: ["Eagle Feathers", "Gold", "Sunstones"]
        },
        { 
            name: "Cozcacuauhqui", 
            meaning: "Buzzard", 
            glyph: "🦅", 
            deity: "Chantico", 
            domain: "Goddess of Hearth",
            lore: "The ancient sun that was thrown down. A day to reflect on the past and old wisdom.",
            tribute: ["Old Wood", "Ashes", "Cinders"]
        },
        { 
            name: "Ollin", 
            meaning: "Movement", 
            glyph: "☸", 
            deity: "Tezcatlipoca", 
            domain: "Smoking Mirror",
            lore: "The day of the sun's motion. Earthquakes and change. This is a day of fate and destiny.",
            tribute: ["Obsidian Mirrors", "Flint", "Blood"]
        },
        { 
            name: "Tecpatl", 
            meaning: "Flint", 
            glyph: "🗡", 
            deity: "Chalchiuhtotolin", 
            domain: "Jade Turkey",
            lore: "The blade of sacrifice and technology. A day of trials, sharpness, and cutting ties.",
            tribute: ["Flint Knives", "Thorns", "Red Ochre"]
        },
        { 
            name: "Quiahuitl", 
            meaning: "Rain", 
            glyph: "🌧", 
            deity: "Tonatiuh", 
            domain: "Sun God",
            lore: "The fire rain. A day of conflict and storms, but necessary for the growth of maize.",
            tribute: ["Rain Water", "Lightning Stones", "Thunder"]
        },
        { 
            name: "Xochitl", 
            meaning: "Flower", 
            glyph: "✿", 
            deity: "Xochiquetzal", 
            domain: "Flower Feather",
            lore: "The beauty of life and the fragility of existence. A day of love, art, and pleasure.",
            tribute: ["Flowers", "Cacao", "Perfume"]
        }
    ];

    // State
    let state = {
        dayIndex: 3, // Start on a specific day (e.g., 4-Movement/Ollin roughly)
        numberIndex: 3,
        totalDays: 260
    };

    // --- DOM ELEMENTS ---
    const ringDays = document.getElementById('ring-days');
    const ringNumbers = document.getElementById('ring-numbers');
    const centerNumber = document.querySelector('.day-number');
    const centerSign = document.querySelector('.day-sign');
    
    const deityName = document.getElementById('deity-name');
    const deityDomain = document.getElementById('deity-domain');
    const deityLore = document.getElementById('deity-lore');
    const tributeList = document.getElementById('tribute-list');
    const deityIcon = document.querySelector('.deity-glyph');

    const tooltip = document.getElementById('glyph-tooltip');
    const tooltipTitle = document.querySelector('.tooltip-title');
    const tooltipDesc = document.querySelector('.tooltip-desc');

    // --- INITIALIZATION ---

    function init() {
        setupWheel();
        updateCalendar();
        startCountdown();
        setupTooltips();
    }

    // --- WHEEL LOGIC ---

    function setupWheel() {
        // Distribute Day Signs
        const daySlots = document.querySelectorAll('.ring-outer .glyph-slot');
        const anglePerSign = 360 / daySigns.length;
        
        daySlots.forEach((slot, index) => {
            // Apply data attributes dynamically if needed, though HTML has some
            // Position radially
            // Rotate the slot to angle, push out by radius, rotate back to keep upright
            const radius = 220; // slightly less than wheel size to fit
            const angle = index * anglePerSign;
            slot.style.transform = `rotate(${angle}deg) translate(0, -220px) rotate(-${angle}deg)`;
            
            // Ensure data matches array
            const data = daySigns[index];
            slot.setAttribute('data-sign', data.name);
            slot.setAttribute('data-meaning', data.meaning);
            slot.querySelector('.glyph').textContent = data.glyph;
        });

        // Distribute Numbers
        const numberSlots = document.querySelectorAll('.ring-mid .number-dot');
        const anglePerNum = 360 / numberSlots.length;
        const radius = 130; // Mid ring radius

        numberSlots.forEach((slot, index) => {
            const angle = index * anglePerNum;
            slot.style.transform = `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`;
            slot.textContent = '•'.repeat(index + 1); // Visual dots
            if(index === 12) slot.textContent = '☥'; // 13th symbol
        });
    }

    function updateCalendar() {
        const dayData = daySigns[state.dayIndex];
        const currentNum = state.numberIndex + 1;

        // 1. Rotate Rings
        // We rotate the ring container so the current index is at the TOP (12 o'clock / 0deg)
        const anglePerSign = 360 / daySigns.length;
        const anglePerNum = 360 / 13;

        // To bring index X to top (0deg), we rotate backwards by X * step
        const dayRotation = -(state.dayIndex * anglePerSign);
        const numRotation = -(state.numberIndex * anglePerNum);

        ringDays.style.transform = `translate(-50%, -50%) rotate(${dayRotation}deg)`;
        ringNumbers.style.transform = `translate(-50%, -50%) rotate(${numRotation}deg)`;

        // 2. Update Center Stone
        centerNumber.textContent = currentNum;
        centerSign.textContent = dayData.name;

        // 3. Update Deity Panel
        updateDeityPanel(dayData);

        // 4. Highlight Active Slots (Visual Feedback)
        highlightActiveSlots();
    }

    function updateDeityPanel(data) {
        // Add fade out effect
        const panel = document.getElementById('deity-display');
        panel.style.opacity = 0;

        setTimeout(() => {
            deityName.textContent = data.deity;
            deityDomain.textContent = data.domain;
            deityLore.textContent = data.lore;
            deityIcon.textContent = data.glyph; // Using glyph as deity icon representation

            // Update Tribute List
            tributeList.innerHTML = '';
            data.tribute.forEach(item => {
                const li = document.createElement('li');
                // Simple icon mapping based on item text for flavor
                let icon = '📦';
                if(item.includes('Jade')) icon = '💎';
                if(item.includes('Blood') || item.includes('Obsidian')) icon = '🔮';
                if(item.includes('Fire')) icon = '🔥';
                if(item.includes('Water')) icon = '💧';
                if(item.includes('Feather')) icon = '🪶';
                if(item.includes('Flower')) icon = '🌺';
                
                li.innerHTML = `<span class="item-icon">${icon}</span> ${item}`;
                tributeList.appendChild(li);
            });

            panel.style.opacity = 1;
        }, 300);
    }

    function highlightActiveSlots() {
        // Reset all
        document.querySelectorAll('.glyph-slot').forEach(el => el.classList.remove('active-glyph'));
        document.querySelectorAll('.number-dot').forEach(el => el.classList.remove('active-num'));

        // Set Active
        const activeDay = ringDays.children[state.dayIndex];
        const activeNum = ringNumbers.children[state.numberIndex];

        if(activeDay) activeDay.classList.add('active-glyph');
        if(activeNum) activeNum.classList.add('active-num');
    }

    function navigate(direction) {
        if (direction === 'next') {
            state.dayIndex = (state.dayIndex + 1) % 20;
            state.numberIndex = (state.numberIndex + 1) % 13;
        } else {
            state.dayIndex = (state.dayIndex - 1 + 20) % 20;
            state.numberIndex = (state.numberIndex - 1 + 13) % 13;
        }
        updateCalendar();
    }

    // --- EVENT LISTENERS ---

    document.getElementById('btn-next').addEventListener('click', () => navigate('next'));
    document.getElementById('btn-prev').addEventListener('click', () => navigate('prev'));

    // Allow clicking directly on a glyph to jump to it
    document.querySelectorAll('.glyph-slot').forEach((slot, index) => {
        slot.addEventListener('click', () => {
            state.dayIndex = index;
            // Calculate corresponding number? 
            // In a real Tonalpohualli, the numbers cycle 1-13 continuously. 
            // For simplicity in this UI, we just rotate the day ring and leave number ring relative 
            // OR we reset the math. Let's just rotate to the day for visual exploration.
            updateCalendar();
        });
    });

    // --- TOOLTIP SYSTEM ---

    function setupTooltips() {
        const slots = document.querySelectorAll('.glyph-slot');
        
        slots.forEach(slot => {
            slot.addEventListener('mouseenter', (e) => {
                const name = slot.getAttribute('data-sign');
                const meaning = slot.getAttribute('data-meaning');
                
                tooltipTitle.textContent = name;
                tooltipDesc.textContent = meaning;
                tooltip.classList.remove('hidden');
                tooltip.classList.add('visible');
            });

            slot.addEventListener('mousemove', (e) => {
                const x = e.clientX;
                const y = e.clientY;
                
                // Prevent overflow
                const xOffset = x > window.innerWidth - 220 ? -220 : 20;
                const yOffset = y > window.innerHeight - 100 ? -100 : 20;

                tooltip.style.left = `${x + xOffset}px`;
                tooltip.style.top = `${y + yOffset}px`;
            });

            slot.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                tooltip.classList.add('hidden');
            });
        });
    }

    // --- COUNTDOWN TIMER ---
    
    function startCountdown() {
        // Set a fake date 4 days, 12 hours from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 4);
        targetDate.setHours(targetDate.getHours() + 12);

        function updateTimer() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                // Reset or stop
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('c-days').textContent = String(days).padStart(2, '0');
            document.getElementById('c-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('c-mins').textContent = String(mins).padStart(2, '0');
        }

        setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    // --- AMBIENT PARTICLE SYSTEM (SMOKE/EMBER) ---
    // Optional visual flair to maximize immersiveness
    function createEmber() {
        const ember = document.createElement('div');
        ember.classList.add('ember');
        document.body.appendChild(ember);

        // Random start position near center bottom
        const startX = window.innerWidth / 2 + (Math.random() * 100 - 50);
        const startY = window.innerHeight - 100;
        
        ember.style.left = `${startX}px`;
        ember.style.top = `${startY}px`;
        
        // Random drift
        const duration = Math.random() * 5000 + 3000;
        const xDrift = Math.random() * 200 - 100;

        const animation = ember.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0 },
            { transform: `translate(${xDrift}px, -100px) scale(1.5)`, opacity: 0.8, offset: 0.2 },
            { transform: `translate(${xDrift * 2}px, -300px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out'
        });

        animation.onfinish = () => ember.remove();
    }

    // Generate an ember every 400ms
    setInterval(createEmber, 400);

    // Start everything
    init();

});