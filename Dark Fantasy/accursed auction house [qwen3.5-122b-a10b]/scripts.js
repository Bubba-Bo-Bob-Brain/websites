document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // CONFIGURATION & STATE
    // --------------------------------------------------------------------------
    const AUCTION_DURATION = 3600; // 1 hour in seconds
    let timeLeft = AUCTION_DURATION;
    let isAuctionActive = true;
    
    // Mock Data for Bidding
    const bidders = [
        { name: "Arch-Lich Xal", status: "Watching" },
        { name: "Sister Agatha", status: "Bidding" },
        { name: "The Nameless", status: "Idle" },
        { name: "Lord Moros", status: "Watching" }
    ];

    // --------------------------------------------------------------------------
    // DOM ELEMENTS
    // --------------------------------------------------------------------------
    const countdownDisplay = document.getElementById('countdown');
    const loreModal = document.getElementById('lore-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');
    const biddersList = document.querySelector('.bidders-list');

    // --------------------------------------------------------------------------
    // 1. THE CANDELABRA TIMER
    // --------------------------------------------------------------------------
    function updateTimer() {
        if (!isAuctionActive) return;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Format with leading zeros
        const minStr = minutes.toString().padStart(2, '0');
        const secStr = seconds.toString().padStart(2, '0');

        countdownDisplay.innerHTML = `
            <span class="time-unit">${minStr}</span>
            <span class="separator">:</span>
            <span class="time-unit">${secStr}</span>
        `;

        if (timeLeft <= 0) {
            endAuction();
        } else {
            timeLeft--;
        }
    }

    function endAuction() {
        isAuctionActive = false;
        countdownDisplay.innerHTML = `<span class="time-unit" style="color:var(--color-blood)">CLOSED</span>`;
        countdownDisplay.style.animation = "pulse 0.5s infinite";
        
        // Flash screen red
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0'; flash.style.left = '0';
        flash.style.width = '100%'; flash.style.height = '100%';
        flash.style.background = 'rgba(138, 3, 3, 0.3)';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), 500);
    }

    setInterval(updateTimer, 1000); // Run every second

    // --------------------------------------------------------------------------
    // 2. CURSED SEAL INTERACTION
    // --------------------------------------------------------------------------
    document.querySelectorAll('.cursed-seal').forEach(seal => {
        seal.addEventListener('click', function() {
            if (this.classList.contains('broken')) return;

            this.classList.add('broken');
            this.style.opacity = '0';
            this.style.pointerEvents = 'none';
            
            // Play a subtle "crack" visual effect on the card
            const card = this.closest('.relic-card');
            card.style.transform = "scale(0.98)";
            setTimeout(() => {
                card.style.transform = "scale(1)";
            }, 100);
        });
    });

    // --------------------------------------------------------------------------
    // 3. LORE MODAL SYSTEM
    // --------------------------------------------------------------------------
    window.toggleLore = function(id) {
        const card = document.querySelector(`.relic-card[data-id="${id}"]`);
        const title = card.querySelector('.item-name').innerText;
        const lore = card.querySelector('.item-lore').innerText;

        modalTitle.innerText = title;
        modalBody.innerText = lore;
        
        loreModal.classList.add('active');
        
        // Add a subtle shake to the modal content for "cursed" feel
        modalBody.style.animation = "none";
        modalBody.offsetHeight; /* trigger reflow */
        modalBody.style.animation = "shake 0.5s cubic-bezier(.36,.07,.19,.97) both";
    };

    closeModalBtn.addEventListener('click', () => {
        loreModal.classList.remove('active');
    });

    // Close modal on outside click
    loreModal.addEventListener('click', (e) => {
        if (e.target === loreModal) {
            loreModal.classList.remove('active');
        }
    });

    // --------------------------------------------------------------------------
    // 4. BIDDING LOGIC (The Blood Drip)
    // --------------------------------------------------------------------------
    window.placeBid = function(id) {
        const card = document.querySelector(`.relic-card[data-id="${id}"]`);
        const bidAmountEl = card.querySelector('.current-bid .amount');
        const btn = card.querySelector('.btn-place-bid');
        
        // Parse current souls (remove commas)
        let currentAmount = parseInt(bidAmountEl.innerText.replace(/,/g, ''));
        const increment = 100; // Minimum bid increment
        const newAmount = currentAmount + increment;
        
        // Animate Button
        btn.classList.add('bidding');
        btn.innerHTML = `<span class="btn-text">OFFERING...</span>`;
        
        setTimeout(() => {
            // Update Amount
            bidAmountEl.innerText = newAmount.toLocaleString() + " Souls";
            bidAmountEl.style.color = "#fff";
            setTimeout(() => bidAmountEl.style.color = "var(--color-blood-bright)", 300);

            // Reset Button
            btn.classList.remove('bidding');
            btn.innerHTML = `<span class="btn-text">OFFER SOUL</span><span class="btn-blood-drip"></span>`;

            // Add new bidder to sidebar
            addSpectralBidder();

        }, 800);
    };

    function addSpectralBidder() {
        const newBidder = {
            name: "New Soul",
            status: "Bidding"
        };
        bidders.unshift(newBidder); // Add to top
        
        // Create HTML
        const li = document.createElement('li');
        li.className = 'bidder-entry fade-in-out';
        li.innerHTML = `
            <span class="b-avatar" style="background: var(--color-blood)"></span>
            <span class="b-name">${newBidder.name}</span>
            <span class="b-status ${newBidder.status}">${newBidder.status}</span>
        `;
        
        // Insert at top of list
        biddersList.insertBefore(li, biddersList.firstChild);

        // Remove old bidder if list gets too long
        if (bidders.length > 6) {
            biddersList.removeChild(biddersList.lastChild);
        }
    }

    // --------------------------------------------------------------------------
    // 5. WHISPERING EFFECT (Hover Interactions)
    // --------------------------------------------------------------------------
    document.querySelectorAll('.relic-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Subtle shake to simulate whispering/cursed energy
            card.style.animation = "whisper 0.2s infinite";
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.animation = "none";
        });
    });

    // Add the whisper keyframe dynamically since it wasn't in CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes whisper {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(styleSheet);

    console.log("The Obsidian Bazaar is open. Souls are welcome.");
});