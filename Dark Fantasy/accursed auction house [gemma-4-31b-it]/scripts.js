/* THE OBSIDIAN VAULT - SCRIPTING
   Functionality: Spectral presence, Seal breaking, Blood-bidding, and Occult timers.
*/

document.addEventListener('DOMContentLoaded', () => {
    initSpectralObservers();
    initSealBreaking();
    initTimers();
    initDustParticles();
});

/**
 * 1. Spectral Observers
 * Creates a haunting list of entities watching the auction.
 */
function initSpectralObservers() {
    const bidderList = document.getElementById('bidder-list');
    const ghostlyNames = [
        "The Pale King", "Sorrow-Weaver", "Void-Walker", "Lady of Ash", 
        "The Blind Seer", "Kaelthas the Damned", "Malphas", "The Silent Choir", 
        "Obscurus", "The Weeping Monk", "Xul'Thraxis", "The Forgotten Heir"
    ];

    function spawnGhost() {
        const name = ghostlyNames[Math.floor(Math.random() * ghostlyNames.length)];
        const li = document.createElement('li');
        li.className = 'bidder-name';
        li.innerText = name;
        
        bidderList.appendChild(li);

        // Fade in
        setTimeout(() => li.classList.add('visible'), 100);

        // Fade out and remove after a few seconds
        setTimeout(() => {
            li.classList.remove('visible');
            setTimeout(() => li.remove(), 1000);
        }, 4000 + Math.random() * 3000);
    }

    // Start the cycle of ghosts
    setInterval(spawnGhost, 2000);
    // Initial spawn
    for(let i=0; i<3; i++) spawnGhost();
}

/**
 * 2. Seal Breaking
 * Handles the interaction of unlocking a relic for bidding.
 */
function initSealBreaking() {
    const seals = document.querySelectorAll('.curse-seal');
    
    seals.forEach(seal => {
        seal.addEventListener('click', function() {
            // Play a "crack" effect (simulated via class)
            this.classList.add('broken');
            
            // Create a small "shatter" visual effect via JS for added polish
            const rect = this.getBoundingClientRect();
            for(let i=0; i<8; i++) {
                createShatterPiece(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    });
}

function createShatterPiece(x, y) {
    const piece = document.createElement('div');
    piece.style.position = 'fixed';
    piece.style.width = '10px';
    piece.style.height = '10px';
    piece.style.backgroundColor = 'var(--dried-blood)';
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    piece.style.zIndex = '101';
    piece.style.pointerEvents = 'none';
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 5;
    let posX = x;
    let posY = y;
    let opacity = 1;

    const anim = setInterval(() => {
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity;
        opacity -= 0.05;
        piece.style.left = posX + 'px';
        piece.style.top = posY + 'px';
        piece.style.opacity = opacity;

        if(opacity <= 0) {
            clearInterval(anim);
            piece.remove();
        }
    }, 16);
}

/**
 * 3. Candelabra Timers
 * Manages the countdowns for each item.
 */
function initTimers() {
    const timers = [
        { id: 'timer-1', time: 3600 * 2 }, // 2 hours
        { id: 'timer-2', time: 3600 * 5 }, // 5 hours
        { id: 'timer-3', time: 600 }       // 10 mins
    ];

    timers.forEach(t => {
        const display = document.querySelector(`#${t.id} .timer-display`);
        let timeLeft = t.time;

        const update = () => {
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            
            display.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            
            if(timeLeft > 0) {
                timeLeft--;
                setTimeout(update, 1000);
            } else {
                display.innerText = "SOLD";
                display.style.color = "var(--blood-bright)";
            }
        };
        update();
    });
}

/**
 * 4. Bidding Logic
 * Handles bid increments and the "Blood-Drip" animation.
 */
window.placeBid = function(itemId) {
    const input = document.getElementById(`input-${itemId}`);
    const amountDisplay = document.getElementById(`bid-amount-${itemId}`);
    const history = document.getElementById(`history-${itemId}`);
    const amountValue = parseInt(input.value);
    const currentAmount = parseInt(amountDisplay.innerText.replace(/,/g, ''));

    if(isNaN(amountValue) || amountValue <= currentAmount) {
        alert("The Vault rejects your meager offering. Bid higher.");
        return;
    }

    // Blood-Drip Animation Effect
    amountDisplay.style.color = 'var(--blood-bright)';
    amountDisplay.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        amountDisplay.innerText = `${amountValue.toLocaleString()} Blood Shards`;
        amountDisplay.style.color = 'var(--gold-bright)';
        amountDisplay.style.transform = 'scale(1)';
    }, 300);

    // Add to History
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `<span>Anonymous Soul</span> <span>${amountValue.toLocaleString()}</span>`;
    history.prepend(entry);

    // Clear input
    input.value = '';
};

/**
 * 5. Visual Flourish: Dust Particles
 * Adds floating particles to create a sense of thick, dusty air.
 */
function initDustParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for(let i=0; i<particleCount; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '2px';
        p.style.height = '2px';
        p.style.background = 'rgba(200, 200, 200, 0.3)';
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        
        // Random drift animation
        const duration = 10 + Math.random() * 20;
        const xMove = (Math.random() - 0.5) * 100;
        const yMove = (Math.random() - 0.5) * 100;

        p.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: 0.5, offset: 0.5 },
            { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        container.appendChild(p);
    }
}