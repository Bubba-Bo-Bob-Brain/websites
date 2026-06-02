// ===== DOM ELEMENTS =====
const spellBook = document.querySelector('.spell-book');
const bookPages = document.querySelector('.book-pages');
const pageTurner = document.querySelector('.page-turner');
const healthBarFill = document.querySelector('.bar-fill.hp');
const manaBarFill = document.querySelector('.bar-fill.mp');
const healthBarValue = document.querySelector('.bar-value:nth-of-type(1)');
const manaBarValue = document.querySelector('.bar-value:nth-of-type(2)');
const battleButton = document.createElement('button');
const diceElements = document.querySelectorAll('.d20');
const questPins = document.querySelectorAll('.pin');
const inventorySlots = document.querySelectorAll('.slot:not(.empty)');
const inventoryGrid = document.querySelector('.inventory-grid');
const ambientElements = document.querySelector('.ambient-elements');

// ===== SPELL BOOK PAGE TURNING =====
let currentPage = 0;
const totalPages = 2; // Left and right pages (1 "spread" = 2 pages)

pageTurner.addEventListener('click', () => {
    currentPage = (currentPage + 1) % (totalPages + 1);

    if (currentPage === 0) {
        // Reset to first spread
        bookPages.style.transform = 'translateX(0)';
    } else {
        // Flip to next spread (simulated)
        bookPages.style.transform = `translateX(-100%)`;
        setTimeout(() => {
            // After animation, reset to "first" spread (since we only have 2 pages)
            bookPages.style.transform = 'translateX(0)';
        }, 1000);
    }

    // Visual feedback
    pageTurner.style.transform = 'translateY(-50%) scale(0.95)';
    setTimeout(() => {
        pageTurner.style.transform = 'translateY(-50%) scale(1)';
    }, 150);
});

// ===== DYNAMIC HP/MP BARS (BATTLE SIMULATION) =====
// Add a "Battle" button to the character sheet
const characterSheet = document.querySelector('.character-sheet');
battleButton.textContent = 'Engage in Battle';
battleButton.className = 'battle-button';
characterSheet.appendChild(battleButton);

// Style the battle button
battleButton.style.cssText = `
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background: var(--blood-red);
    color: var(--text-light);
    border: none;
    border-radius: 5px;
    font-family: var(--font-script);
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 4px var(--shadow);
`;
battleButton.addEventListener('mouseenter', () => {
    battleButton.style.background = '#ff3333';
    battleButton.style.transform = 'translateY(-2px)';
});
battleButton.addEventListener('mouseleave', () => {
    battleButton.style.background = 'var(--blood-red)';
    battleButton.style.transform = 'translateY(0)';
});

// Battle simulation
let currentHP = 85;
let currentMP = 60;
let isInBattle = false;

battleButton.addEventListener('click', () => {
    if (isInBattle) return;

    isInBattle = true;
    battleButton.textContent = 'Battle in Progress...';
    battleButton.disabled = true;

    // Simulate battle rounds
    const battleRounds = 3;
    let round = 0;

    const battleInterval = setInterval(() => {
        round++;
        if (round > battleRounds) {
            clearInterval(battleInterval);
            isInBattle = false;
            battleButton.textContent = 'Engage in Battle';
            battleButton.disabled = false;
            return;
        }

        // Random damage/heal
        const hpChange = Math.floor(Math.random() * 20) - 10; // -10 to +10
        const mpChange = Math.floor(Math.random() * 10) - 5; // -5 to +5

        // Update HP (clamp between 0 and 100)
        currentHP = Math.max(0, Math.min(100, currentHP + hpChange));
        healthBarFill.style.width = `${currentHP}%`;
        healthBarValue.textContent = `${currentHP}/100`;

        // Update MP (clamp between 0 and 100)
        currentMP = Math.max(0, Math.min(100, currentMP + mpChange));
        manaBarFill.style.width = `${currentMP}%`;
        manaBarValue.textContent = `${currentMP}/100`;

        // Flash effect for damage/heal
        if (hpChange < 0) {
            healthBarFill.style.background = 'linear-gradient(to right, #ff0000, #ff6666)';
            setTimeout(() => {
                healthBarFill.style.background = 'linear-gradient(to right, var(--blood-red), #ff3333)';
            }, 300);
        } else if (hpChange > 0) {
            healthBarFill.style.background = 'linear-gradient(to right, #00ff00, #66ff66)';
            setTimeout(() => {
                healthBarFill.style.background = 'linear-gradient(to right, var(--blood-red), #ff3333)';
            }, 300);
        }

        if (mpChange < 0) {
            manaBarFill.style.background = 'linear-gradient(to right, #0066ff, #66b3ff)';
        } else if (mpChange > 0) {
            manaBarFill.style.background = 'linear-gradient(to right, #00ff00, #66ff66)';
            setTimeout(() => {
                manaBarFill.style.background = 'linear-gradient(to right, var(--arcane-blue), #66b3ff)';
            }, 300);
        }
    }, 1000);
});

// ===== DICE ROLL SIMULATION =====
diceElements.forEach(die => {
    die.addEventListener('click', () => {
        // Animate roll
        die.style.animation = 'none';
        void die.offsetWidth; // Trigger reflow
        die.style.animation = 'roll 1s ease-in-out';

        // Random result (1-20)
        const roll = Math.floor(Math.random() * 20) + 1;
        showDiceResult(die, roll);
    });
});

// Show dice result as a tooltip
function showDiceResult(die, result) {
    const tooltip = document.createElement('div');
    tooltip.className = 'dice-tooltip';
    tooltip.textContent = `d20: ${result}`;
    tooltip.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--parchment);
        color: var(--text-dark);
        padding: 5px 10px;
        border: 1px solid var(--wood-dark);
        border-radius: 5px;
        font-family: var(--font-script);
        font-size: 0.9rem;
        box-shadow: 0 2px 4px var(--shadow);
        z-index: 10;
        pointer-events: none;
    `;
    die.appendChild(tooltip);

    // Remove tooltip after 2 seconds
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// Add roll animation to keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes roll {
        0% { transform: rotate(0deg) translateY(0); }
        25% { transform: rotate(90deg) translateY(-10px); }
        50% { transform: rotate(180deg) translateY(0); }
        75% { transform: rotate(270deg) translateY(10px); }
        100% { transform: rotate(360deg) translateY(0); }
    }
`;
document.head.appendChild(style);

// ===== QUEST PIN INTERACTIONS =====
questPins.forEach(pin => {
    const pinBody = pin.querySelector('.pin-body');
    const pinFooter = pin.querySelector('.pin-footer');

    pin.addEventListener('click', () => {
        // Toggle "accepted" state
        if (pin.classList.contains('accepted')) {
            pin.classList.remove('accepted');
            pin.classList.add('completed');
            pinFooter.textContent += ' ✓ Completed';
        } else if (pin.classList.contains('completed')) {
            pin.classList.remove('completed');
            pinFooter.textContent = pinFooter.textContent.replace(' ✓ Completed', '');
        } else {
            pin.classList.add('accepted');
            pinFooter.textContent += ' ✓ Accepted';
        }
    });

    // Style changes for accepted/completed quests
    pin.addEventListener('mouseenter', () => {
        pin.style.transform = 'rotate(0deg) scale(1.05)';
    });
    pin.addEventListener('mouseleave', () => {
        if (pin.classList.contains('accepted')) {
            pin.style.transform = 'rotate(1deg) scale(1)';
        } else if (pin.classList.contains('completed')) {
            pin.style.transform = 'rotate(-1deg) scale(1)';
        } else {
            pin.style.transform = pin.classList.contains('pin:nth-child(even)') ? 'rotate(2deg)' : 'rotate(-2deg)';
        }
    });
});

// ===== INVENTORY DRAG-AND-DROP =====
let draggedItem = null;

inventorySlots.forEach(slot => {
    slot.addEventListener('dragstart', (e) => {
        draggedItem = slot;
        e.dataTransfer.setData('text/plain', slot.innerHTML);
        slot.style.opacity = '0.5';
    });

    slot.addEventListener('dragend', () => {
        slot.style.opacity = '1';
        draggedItem = null;
    });

    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== slot) {
            // Swap content
            const temp = slot.innerHTML;
            slot.innerHTML = draggedItem.innerHTML;
            draggedItem.innerHTML = temp;

            // Update classes for styling
            slot.className = draggedItem.className;
            draggedItem.className = 'slot ' + (temp.includes('Empty') ? 'empty' : '');
        }
    });
});

// Make inventory slots draggable
inventorySlots.forEach(slot => {
    slot.draggable = true;
});

// ===== AMBIENT SOUND EFFECTS (OPTIONAL) =====
// Only enable if user has interacted with the page (autoplay restrictions)
let hasInteracted = false;
document.addEventListener('click', () => {
    hasInteracted = true;
    playAmbientSounds();
}, { once: true });

function playAmbientSounds() {
    if (!hasInteracted) return;

    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Candle crackle sound (white noise with low-pass filter)
    const candleNoise = audioContext.createBufferSource();
    const candleBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const candleData = candleBuffer.getChannelData(0);
    for (let i = 0; i < candleData.length; i++) {
        candleData[i] = Math.random() * 2 - 1;
    }
    candleNoise.buffer = candleBuffer;
    candleNoise.loop = true;

    const candleFilter = audioContext.createBiquadFilter();
    candleFilter.type = 'lowpass';
    candleFilter.frequency.value = 2000;

    const candleGain = audioContext.createGain();
    candleGain.gain.value = 0.1;

    candleNoise.connect(candleFilter);
    candleFilter.connect(candleGain);
    candleGain.connect(audioContext.destination);
    candleNoise.start();

    // Randomly modulate the filter for a "flickering" effect
    setInterval(() => {
        candleFilter.frequency.value = 1500 + Math.random() * 1000;
    }, 200 + Math.random() * 300);
}

// ===== PARALLAX EFFECT ON SCROLL =====
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const ambientElementsChildren = ambientElements.children;

    // Move ambient elements at different speeds for depth
    for (let i = 0; i < ambientElementsChildren.length; i++) {
        const speed = 0.1 + (i * 0.05);
        ambientElementsChildren[i].style.transform += ` translateY(${scrollPosition * speed}px)`;
    }
});

// ===== CANDLELIGHT FLICKER EFFECT (HEADER) =====
const header = document.querySelector('.header');
function flickerCandlelight() {
    const flickerIntensity = 0.95 + Math.random() * 0.1;
    header.style.filter = `brightness(${flickerIntensity})`;
    setTimeout(flickerCandlelight, 100 + Math.random() * 200);
}
flickerCandlelight();

// ===== INITIALIZE =====
// Set initial drag-and-drop for inventory
inventorySlots.forEach(slot => {
    slot.addEventListener('dragstart', handleDragStart);
});

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.setData('text/plain', this.innerHTML);
    this.style.opacity = '0.5';
}