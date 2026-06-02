/**
 * THE OSSUARY - Ritual Logic
 * Orchestrating the descent into madness.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE MANAGEMENT ---
    const state = {
        isSealBroken: false,
        currentBids: [
            { id: 'hero', value: 4200, label: 'Souls' },
            { id: 'eye-of-azathoth', value: 850, label: 'Souls' },
            { id: 'void-bell', value: 1200, label: 'Souls' },
            { id: 'shadow-mantle', value: 3400, label: 'Souls' }
        ],
        bidders: [
            { name: "The Nameless King", action: "offered", val: "500 Souls" },
            { name: "Wraith of the Ninth", action: "offered", val: "450 Souls" },
            { name: "The Crimson Cult", action: "offered", val: "900 Souls" }
        ]
    };

    // --- DOM ELEMENTS ---
    const seal = document.getElementById('breaking-seal');
    const sealOverlay = document.getElementById('curse-overlay');
    const bidHistoryList = document.getElementById('bid-history');
    const loreModal = document.getElementById('lore-modal');
    const modalClose = document.querySelector('.modal-close');
    const relicCards = document.querySelectorAll('.relic-card');
    const loreButtons = document.querySelectorAll('.btn-card-lore');

    // --- INITIALIZATION ---
    init();

    function init() {
        setupSeal();
        setupTimers();
        setupEventListeners();
        simulateSpectralActivity();
    }

    // --- 1. THE RITUAL GATE (SEAL) ---
    function setupSeal() {
        seal.addEventListener('click', () => {
            // Add a "shatter" effect via CSS class
            seal.classList.add('shattered');
            
            // Play sound if available (placeholder logic)
            console.log("The seal breaks... the void opens.");

            // Fade out the overlay
            setTimeout(() => {
                sealOverlay.classList.add('hidden');
                state.isSealBroken = true;
            }, 1000);
        });
    }

    // --- 2. THE CHRONOS RITUAL (TIMERS) ---
    function setupTimers() {
        // We set a target time for the hero relic
        const heroTimerElement = document.getElementById('hero-timer');
        let totalSeconds = 3600 + 15 * 60; // 1 hour, 15 mins

        const updateTimer = () => {
            if (totalSeconds <= 0) return;
            totalSeconds--;

            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            heroTimerElement.innerHTML = `
                <span class="time-unit">${String(h).padStart(2, '0')}</span>:
                <span class="time-unit">${String(m).padStart(2, '0')}</span>:
                <span class="time-unit">${String(s).padStart(2, '0')}</span>
            `;
        };

        setInterval(updateTimer, 1000);
    }

    // --- 3. THE SPECTRAL LEDGER (LIVE BIDS) ---
    function simulateSpectralActivity() {
        // Periodically add a "ghostly" bidder to the list
        setInterval(() => {
            if (!state.isSealBroken) return;

            const names = ["Shadow Weaver", "The Pale Monk", "Void Walker", "Soul Eater", "Eldritch Eye"];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomVal = Math.floor(Math.random() * 500) + 100;

            addBidToLedger(randomName, randomVal);
        }, 8000);
    }

    function addBidToLedger(name, value) {
        const li = document.createElement('li');
        li.className = 'bid-entry';
        li.innerHTML = `
            <span class="bidder-name">${name}</span>
            <span class="bid-action">offered</span>
            <span class="bid-val">${value} Souls</span>
        `;

        // Insert at the top
        bidHistoryList.insertBefore(li, bidHistoryList.firstChild);

        // Remove old entries to prevent DOM bloat
        if (bidHistoryList.children.length > 15) {
            bidHistoryList.removeChild(bidHistoryList.lastChild);
        }

        // If it's a high bid, trigger a "blood drip" visual effect on the screen
        if (value > 400) {
            triggerBloodDrip();
        }
    }

    function triggerBloodDrip() {
        // Create a temporary blood drip element
        const drip = document.createElement('div');
        drip.style.cssText = `
            position: fixed;
            top: 0;
            left: ${Math.random() * 100}%;
            width: 2px;
            height: 0;
            background: var(--color-blood-bright);
            z-index: 100;
            transition: height 2s ease-in;
        `;
        document.body.appendChild(drip);

        // Animate drip
        setTimeout(() => {
            drip.style.height = '100vh';
        }, 10);

        // Cleanup
        setTimeout(() => {
            drip.remove();
        }, 2100);
    }

    // --- 4. THE LORE VAULT (MODAL) ---
    function setupEventListeners() {
        // Close modal on button click
        modalClose.addEventListener('click', closeModal);

        // Close modal on clicking overlay
        document.querySelector('.modal-overlay').addEventListener('click', closeModal);

        // Open lore modal
        loreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.relic-card');
                const title = card.querySelector('.card-title').innerText;
                const lore = card.querySelector('.card-lore').innerText;
                
                openLore(title, lore);
            });
        });

        // Bid Trigger
        document.getElementById('bid-trigger').addEventListener('click', () => {
            if (!state.isSealBroken) {
                alert("You must break the seal to interact with the Ossuary.");
                return;
            }
            
            const bidVal = document.getElementById('hero-bid');
            // Simulate a bid increase
            let current = parseInt(bidVal.innerText.replace(/[^0-9]/g, ''));
            current += 150;
            bidVal.innerText = `${current.toLocaleString()} Souls`;
            bidVal.style.color = 'var(--color-blood-bright)';
            
            // Pulse effect
            bidVal.animate([
                { transform: 'scale(1)', color: 'var(--color-blood-bright)' },
                { transform: 'scale(1.2)', color: 'white' },
                { transform: 'scale(1)', color: 'var(--color-blood-bright)' }
            ], { duration: 500 });
        });
    }

    function openLore(title, lore) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-full-lore').innerText = 
            `${lore} This relic has been documented in the Forbidden Archives. To touch it is to invite the gaze of the Old Ones. Use caution, for the price is never merely gold, but the very essence of your being.`;
        
        loreModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeModal() {
        loreModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});