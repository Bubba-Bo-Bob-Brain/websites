/* =========================================
   THE SOUL ENGINE (JavaScript)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THE GATEKEEPER (Preloader) ---
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    // Simulate loading assets and connecting to the void
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        // Trigger entrance animations for main content
        document.querySelector('.main-nav').style.animation = 'slideInDown 0.8s ease forwards';
        document.querySelector('.hero-section').style.animation = 'fadeIn 1.5s ease forwards';
    }, 2500); // 2.5s loading time

    // --- 2. THE TIMEKEEPER (Countdowns) ---
    const countdownElements = document.querySelectorAll('.countdown');
    
    // Set random end times for demo purposes (between 15 mins and 2 hours from now)
    const timers = Array.from(countdownElements).map(el => {
        const durationMinutes = Math.floor(Math.random() * 120) + 15;
        return {
            element: el,
            endTime: Date.now() + (durationMinutes * 60 * 1000)
        };
    });

    function updateTimers() {
        const now = Date.now();
        
        timers.forEach(timer => {
            const distance = timer.endTime - now;
            
            if (distance < 0) {
                timer.element.innerText = "SOLD TO THE HIGHEST BIDDER";
                timer.element.style.color = "#8a0000";
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timer.element.innerText = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        });
    }

    setInterval(updateTimers, 1000);
    updateTimers(); // Initial call

    // --- 3. THE AUCTIONEER (Bidding Logic) ---
    
    // Ghost Bidders Data
    const ghostBidders = [
        "Necromancer_X", "VoidWalker", "SilentHill", "LichLord_420", 
        "ShadowBroker", "CursedOne", "PhantomBidder", "SoulCollector"
    ];

    // Format currency
    const formatSouls = (num) => new Intl.NumberFormat('en-US').format(num);

    // Handle Bid Submission
    window.placeBid = (itemId) => {
        const card = document.querySelector(`.auction-card[data-id="${itemId}"]`);
        const input = card.querySelector('.bid-input');
        const currentBidEl = card.querySelector('.amount');
        const bidList = card.querySelector('.bid-list');
        
        let currentBid = parseInt(currentBidEl.innerText.replace(/,/g, ''));
        let userBid = parseInt(input.value);

        if (userBid > currentBid) {
            // Success Animation
            currentBidEl.style.color = '#00ff00';
            currentBidEl.style.textShadow = '0 0 15px #00ff00';
            currentBidEl.innerText = formatSouls(userBid);
            
            // Add to history
            const li = document.createElement('li');
            li.innerHTML = `<span class="bidder-name" style="color: #c5a059">YOU</span> bid ${formatSouls(userBid)}`;
            bidList.prepend(li);
            if(bidList.children.length > 3) bidList.lastChild.remove();

            // Trigger Notification
            showNotification(`Bid of ${formatSouls(userBid)} souls accepted.`);
            
            // Simulate Rival Bid after random time
            setTimeout(() => simulateRivalBid(itemId, userBid), Math.random() * 5000 + 3000);
        } else {
            // Fail Animation
            input.style.borderColor = '#8a0000';
            input.style.boxShadow = '0 0 10px #8a0000';
            showNotification("Your soul offering is insufficient.", "error");
            setTimeout(() => {
                input.style.borderColor = '#333';
                input.style.boxShadow = 'none';
            }, 1000);
        }
    };

    function simulateRivalBid(itemId, currentHighest) {
        const card = document.querySelector(`.auction-card[data-id="${itemId}"]`);
        if(!card) return;
        
        const currentBidEl = card.querySelector('.amount');
        const bidList = card.querySelector('.bid-list');
        const rivalName = ghostBidders[Math.floor(Math.random() * ghostBidders.length)];
        const rivalBid = currentHighest + Math.floor(Math.random() * 100) + 50;

        currentBidEl.style.color = '#c5a059';
        currentBidEl.style.textShadow = 'none';
        currentBidEl.innerText = formatSouls(rivalBid);

        const li = document.createElement('li');
        li.innerHTML = `<span class="bidder-name">${rivalName}</span> bid ${formatSouls(rivalBid)}`;
        bidList.prepend(li);
        if(bidList.children.length > 3) bidList.lastChild.remove();

        showNotification(`${rivalName} outbid you!`, "warning");
    }

    // --- 4. THE CURSE BREAKER (Locked Item Logic) ---
    const seal = document.getElementById('seal-003');
    if(seal) {
        seal.addEventListener('click', () => {
            seal.classList.add('broken');
            const card = seal.closest('.auction-card');
            const content = card.querySelector('.card-content');
            const title = card.querySelector('.item-title');
            const lore = card.querySelector('.item-lore');
            const bidSection = card.querySelector('.bid-section');
            const btn = card.querySelector('.bid-btn');

            // Reveal Content
            content.classList.remove('obscured');
            title.classList.remove('blur-text');
            title.innerText = "The Heart of Darkness";
            lore.classList.remove('blur-text');
            lore.innerText = "A pulsating organ of a forgotten titan. It grants immense power but demands a sacrifice every full moon.";
            
            bidSection.classList.remove('blur-text');
            btn.classList.remove('disabled');
            btn.innerText = "OFFER";
            btn.disabled = false;

            // Visual Flair
            document.body.style.boxShadow = "inset 0 0 100px rgba(138, 0, 0, 0.5)";
            setTimeout(() => {
                document.body.style.boxShadow = "none";
            }, 500);
            
            showNotification("The seal is broken. The auction begins.");
        });
    }

    // --- 5. ATMOSPHERE & UTILS ---

    // Custom Cursor Logic
    const cursor = document.getElementById('cursor-follower');
    const links = document.querySelectorAll('a, button, .auction-card, input');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Ember Generator
    const emberContainer = document.getElementById('ember-container');
    function createEmber() {
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.style.left = Math.random() * 100 + 'vw';
        ember.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
        emberContainer.appendChild(ember);

        setTimeout(() => {
            ember.remove();
        }, 10000);
    }
    setInterval(createEmber, 300);

    // Notification System
    window.showNotification = (message, type = 'info') => {
        const container = document.getElementById('notification-area');
        const note = document.createElement('div');
        note.classList.add('notification');
        if(type === 'error') note.style.borderLeftColor = '#8a0000';
        if(type === 'warning') note.style.borderLeftColor = '#ffaa00';
        
        note.innerText = message;
        container.appendChild(note);

        // Remove after animation
        setTimeout(() => {
            note.remove();
        }, 4000);
    };

    // Global Scroll Effect for Nav
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.main-nav');
        if(window.scrollY > 50) {
            nav.style.background = 'rgba(5, 5, 5, 0.95)';
            nav.style.borderBottom = '1px solid var(--primary-gold)';
        } else {
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
            nav.style.borderBottom = '1px solid rgba(197, 160, 89, 0.2)';
        }
    });
});