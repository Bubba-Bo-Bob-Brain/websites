/* ============================================================
   OBSIDIAN VEIL — Auction House of the Forbidden & the Cursed
   Script: scripts.js
   ============================================================ */

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        whisperIntervalMin: 8000,
        whisperIntervalMax: 20000,
        emberCount: 25,
        spectralBidderCount: 12,
        bloodDripRate: 3500,
        candleBurnRate: 1, // ms per percent
    };

    const WHISPERS = [
        "You shouldn't have come here...",
        "The price is your soul... you just don't know it yet.",
        "They see you. They've always seen you.",
        "Bid higher. Bid faster. Or be forgotten.",
        "The blade remembers every hand that held it.",
        "Something stirs in the shadows behind you.",
        "You smell of mortality. How... appetizing.",
        "The chalice is never truly empty.",
        "We are the ones who bid in the dark.",
        "Your heartbeat is so... distractingly loud.",
        "The crown awaits a willing skull.",
        "Every relic has a hunger. Will you feed it?",
        "Three seekers came before you. None returned.",
        "The ink is warm. Too warm.",
        "Do you hear them? The ones who lost.",
        "Time is a currency you're spending fast, mortal.",
        "The Veil remembers every name... especially yours.",
        "Look behind you. No — look closer. Closer still.",
        "The auctioneer never blinks. Have you noticed?",
    ];

    const CONSEQUENCES = [
        "The stars have gone out. You are alone in the dark now.",
        "You feel a presence slip behind you — cold, patient, eternal.",
        "Your reflection no longer matches your movements.",
        "A name appears on your skin, written in a language that hurts to read.",
        "The room smells of grave soil and forgotten prayers.",
        "You remember a life you never lived — and it remembers you.",
        "Your shadow now moves independently. It is not your friend.",
        "A clock begins ticking somewhere inside your chest.",
        "The whispers have stopped. That is worse.",
        "You now know the true name of one thing. You wish you didn't.",
    ];

    const BIDDER_NAMES = [
        "Vex_Nocturne", "GraveWhisper", "Necrosa", "Ashborn",
        "VeilWalker", "BoneArbiter", "SeerBlind", "FaceHunter",
        "ArchonPriest", "CryptDweller", "HollowVoice", "Nightmaw",
        "AbyssalTongue", "PaleCollector", "HereticMark",
        "RedemptionSeeker", "LadyOfAsh", "ThornWeaver",
        "DuskCaller", "WraithMonger", "ShadeBinder", "FleshReverie",
    ];

    const BIDDER_AVATARS = ["👻", "💀", "🌑", "🖤", "👤", "🦴", "👁️", "😶", "✝", "🕯️", "🌀", "🩸", "🕷️", "🔮", "🗡️", "🪬", "⚱️", "🫧"];

    // ==================== AUCTION STATE ====================
    const auctionItems = [
        {
            id: 1, name: "The Mourning Blade of Kael'thas",
            currentBid: 8450, bidCount: 27, endTime: null, duration: 4 * 3600 + 23 * 60 + 47,
            increment: 100, rarity: "legendary", ended: false
        },
        {
            id: 2, name: "The Wailing Chalice of Morr'ethis",
            currentBid: 14200, bidCount: 43, endTime: null, duration: 1 * 3600 + 58 * 60 + 12,
            increment: 200, rarity: "ancient", ended: false
        },
        {
            id: 3, name: "The Crown of the Hollow King",
            currentBid: 21750, bidCount: 68, endTime: null, duration: 6 * 3600 + 11 * 60 + 55,
            increment: 500, rarity: "mythic", ended: false
        },
        {
            id: 4, name: "The Grimoire of Eyeless Seers",
            currentBid: 33100, bidCount: 91, endTime: null, duration: 2 * 3600 + 44 * 60 + 9,
            increment: 1000, rarity: "legendary", ended: false
        },
        {
            id: 5, name: "The Shroud of Forgotten Faces",
            currentBid: 5800, bidCount: 12, endTime: null, duration: 9 * 3600 + 3 * 60 + 31,
            increment: 75, rarity: "ancient", ended: false
        },
        {
            id: 6, name: "The Nail of Saint Uzziel",
            currentBid: 47300, bidCount: 156, endTime: null, duration: 12 * 3600 + 47 * 60 + 22,
            increment: 500, rarity: "mythic", ended: false
        },
    ];

    const bidHistories = {};
    auctionItems.forEach(item => {
        bidHistories[item.id] = [];
    });

    // Pre-populate some bid history
    addBidHistory(1, "Vex_Nocturne", 8450, "3m ago");
    addBidHistory(1, "GraveWhisper", 7900, "8m ago");
    addBidHistory(1, "Ashborn", 6200, "17m ago");
    addBidHistory(2, "Necrosa", 14200, "1m ago");
    addBidHistory(2, "VeilWalker", 13800, "5m ago");
    addBidHistory(2, "CryptDweller", 12500, "12m ago");
    addBidHistory(3, "BoneArbiter", 21750, "2m ago");
    addBidHistory(3, "LadyOfAsh", 20900, "6m ago");
    addBidHistory(3, "HollowVoice", 19400, "14m ago");
    addBidHistory(4, "SeerBlind", 33100, "30s ago");
    addBidHistory(4, "Nightmaw", 32400, "4m ago");
    addBidHistory(4, "AbyssalTongue", 31000, "9m ago");
    addBidHistory(5, "FaceHunter", 5800, "6m ago");
    addBidHistory(5, "PaleCollector", 5200, "18m ago");
    addBidHistory(6, "ArchonPriest", 47300, "1m ago");
    addBidHistory(6, "HereticMark", 46000, "4m ago");
    addBidHistory(6, "RedemptionSeeker", 44800, "11m ago");

    function addBidHistory(itemId, bidder, amount, timeAgo) {
        bidHistories[itemId].push({ bidder, amount, timeAgo });
    }

    // ==================== COUNTDOWN TIMERS ====================
    function initCountdowns() {
        auctionItems.forEach(item => {
            item.endTime = Date.now() + item.duration * 1000;
            updateCountdown(item);
        });
        setInterval(tickCountdowns, 1000);
    }

    function tickCountdowns() {
        auctionItems.forEach(item => {
            if (item.ended) return;
            updateCountdown(item);
        });
    }

    function updateCountdown(item) {
        const remaining = Math.max(0, item.endTime - Date.now());
        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hEl = document.getElementById(`hours-${item.id}`);
        const mEl = document.getElementById(`minutes-${item.id}`);
        const sEl = document.getElementById(`seconds-${item.id}`);

        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');

        // Warning state
        const segments = [hEl?.parentElement, mEl?.parentElement, sEl?.parentElement].filter(Boolean);
        if (totalSeconds <= 30) {
            segments.forEach(s => s.classList.add('warning'));
        } else if (totalSeconds <= 120) {
            segments.forEach(s => {
                if (s.querySelector('.time-value') === sEl?.parentElement?.querySelector('.time-value') ||
                    s.querySelector('.time-value') === mEl?.parentElement?.querySelector('.time-value')) {
                    s.classList.add('warning');
                }
            });
        } else {
            segments.forEach(s => s.classList.remove('warning'));
        }

        // Candle burn effect
        const candle = document.querySelector(`#countdown-${item.id}`)?.closest('.countdown-wrapper')?.querySelector('.candelabra-icon');
        if (candle && totalSeconds > 0) {
            const progress = 1 - (totalSeconds / item.duration);
            const flicker = 0.7 + Math.random() * 0.3;
            candle.style.opacity = 0.4 + progress * 0.5 * flicker;
        }

        if (remaining <= 0 && !item.ended) {
            item.ended = true;
            endAuction(item);
        }
    }

    function endAuction(item) {
        const card = document.querySelector(`.auction-card[data-item-id="${item.id}"]`);
        if (card) {
            const btn = card.querySelector('.btn-bid');
            btn.textContent = '⚰ AUCTION ENDED';
            btn.disabled = true;
            btn.style.background = 'linear-gradient(135deg, #2a2035, #1a1522)';
            btn.style.borderColor = 'var(--color-stone)';
            btn.style.cursor = 'default';
            btn.style.boxShadow = 'none';

            const timerEl = document.getElementById(`countdown-${item.id}`);
            if (timerEl) {
                timerEl.innerHTML = `
                    <span class="time-segment">
                        <span class="time-value" style="color: var(--color-stone);">ENDED</span>
                        <span class="time-label"></span>
                    </span>`;
            }

            const statusCell = document.querySelector(`.amount-cell:has(span:contains("${item.currentBid}"))`);
            if (statusCell) {
                const row = statusCell.closest('tr');
                if (row) {
                    const statusTd = row.querySelector('td:last-child');
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="status-outbid" style="color: var(--color-stone);">SOLD</span>';
                    }
                }
            }

            triggerBidFlash(`${item.name} — Sold for ${item.currentBid.toLocaleString()} 🩸`);
        }
    }

    // ==================== BID SYSTEM ====================
    let currentBidItem = null;

    function initBidButtons() {
        document.querySelectorAll('.btn-bid').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.item);
                const item = auctionItems.find(i => i.id === itemId);
                if (!item || item.ended) return;

                currentBidItem = item;
                openBidModal(item);
            });
        });
    }

    function openBidModal(item) {
        const modal = document.getElementById('bid-modal');
        document.getElementById('modal-item-name').textContent = `Bid on: ${item.name}`;
        document.getElementById('modal-current-bid').innerHTML =
            `Current Bid: <span>${item.currentBid.toLocaleString()} 🩸</span>`;
        document.getElementById('modal-min-increment').textContent = item.increment;

        const input = document.getElementById('bid-input-amount');
        input.value = '';
        input.min = item.currentBid + item.increment;
        input.placeholder = `Min: ${(item.currentBid + item.increment).toLocaleString()}`;

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10);

        input.focus();
    }

    function closeModal() {
        const modal = document.getElementById('bid-modal');
        modal.style.display = 'none';
        modal.classList.remove('visible');
        currentBidItem = null;
    }

    function confirmBid() {
        if (!currentBidItem) return;

        const input = document.getElementById('bid-input-amount');
        const amount = parseInt(input.value);

        if (!amount || amount < currentBidItem.currentBid + currentBidItem.increment) {
            triggerBidFlash(`Minimum bid: ${(currentBidItem.currentBid + currentBidItem.increment).toLocaleString()} 🩸`);
            input.style.borderColor = 'var(--color-bright-blood)';
            input.style.animation = 'none';
            input.offsetHeight; // Trigger reflow
            input.style.animation = 'shake 0.4s ease';
            return;
        }

        // Process the bid
        currentBidItem.currentBid = amount;
        currentBidItem.bidCount++;

        // Generate random bidder name
        const bidderIdx = Math.floor(Math.random() * BIDDER_NAMES.length);
        const bidderName = BIDDER_NAMES[bidderIdx];
        const avatar = BIDDER_AVATARS[bidderIdx];

        const timeAgo = 'just now';
        addBidHistory(currentBidItem.id, bidderName, amount, timeAgo);

        // Update UI
        updateBidDisplay(currentBidItem);
        updateBidHistory(currentBidItem.id);
        updateLedger();
        updateSpectralBidder(currentBidItem.id, bidderName, avatar);

        // Blood drip animation on bid
        triggerBloodSplash();
        triggerBidFlash(`Bid placed: ${amount.toLocaleString()} 🩸`);

        // Visual feedback on card
        const card = document.querySelector(`.auction-card[data-item-id="${currentBidItem.id}"]`);
        if (card) {
            card.style.borderColor = 'var(--color-bright-blood)';
            card.style.boxShadow = '0 0 40px var(--color-glow-crimson)';
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 2000);
        }

        closeModal();
    }

    function updateBidDisplay(item) {
        const amountEl = document.getElementById(`bid-amount-${item.id}`);
        const countEl = document.getElementById(`bid-count-${item.id}`);

        if (amountEl) {
            amountEl.innerHTML = `${item.currentBid.toLocaleString()} <span class="currency">🩸</span>`;
            amountEl.style.color = 'var(--color-bright-blood)';
            setTimeout(() => { amountEl.style.color = ''; }, 1000);
        }

        if (countEl) {
            countEl.textContent = item.bidCount;
        }
    }

    function updateBidHistory(itemId) {
        const container = document.getElementById(`bid-history-mini-${itemId}`);
        if (!container) return;

        const history = bidHistories[itemId].slice(-5).reverse();
        container.innerHTML = history.map(bid => `
            <div class="bid-entry">
                <span class="bidder">${bid.bidder}</span>
                <span class="amount">${bid.amount.toLocaleString()} 🩸</span>
                <span class="time">${bid.timeAgo}</span>
            </div>
        `).join('');

        // Animate entries
        container.querySelectorAll('.bid-entry').forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
        });
    }

    // ==================== MODAL CLOSE HANDLERS ====================
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('bid-modal');
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    document.querySelector('.modal-close').addEventListener('click', closeModal);

    // ==================== CURSED SEAL ====================
    let sealClicks = 0;
    const maxSealClicks = 3;
    let sealBroken = false;

    function initSeal() {
        const seal = document.getElementById('cursed-seal-main');
        seal.addEventListener('click', () => {
            if (sealBroken) return;
            sealClicks++;

            const cracks = document.getElementById('seal-crack-overlay');
            const status = document.getElementById('seal-status');
            const sealEl = document.getElementById('master-seal');

            if (sealClicks === 1) {
                status.textContent = "The seal groans... faint cracks appear.";
                status.classList.add('shattered');
                cracks.innerHTML = `
                    <div class="crack" style="top:30%;left:45%;width:2px;height:60px;transform:rotate(8deg);"></div>
                `;
                cracks.classList.add('active');
                sealEl.querySelector('.seal-cracks').classList.add('visible');
            } else if (sealClicks === 2) {
                status.textContent = "The seal splinters! A voice echoes from within...";
                cracks.innerHTML = `
                    <div class="crack" style="top:20%;left:40%;width:2px;height:80px;transform:rotate(-5deg);"></div>
                    <div class="crack" style="top:30%;left:60%;width:2px;height:70px;transform:rotate(25deg);"></div>
                `;
                sealEl.querySelector('.seal-cracks').classList.add('visible');
                document.querySelector('.seal-outer-circle').style.borderColor = 'var(--color-bright-blood)';
                document.querySelector('.seal-outer-circle').style.boxShadow = '0 0 40px var(--color-glow-crimson)';
            } else if (sealClicks >= 3) {
                breakSeal(status);
            }
        });
    }

    function breakSeal(statusEl) {
        sealBroken = true;

        statusEl.textContent = "⟡ THE SEAL IS BROKEN ⟡";
        statusEl.classList.add('shattered');

        // Show consequence
        const consequence = document.getElementById('seal-consequence');
        const whisper = document.getElementById('consequence-whisper');
        const rewardText = document.getElementById('seal-reward-text');

        const consequenceText = CONSEQUENCES[Math.floor(Math.random() * CONSEQUENCES.length)];
        whisper.textContent = `"${consequenceText}"`;
        rewardText.textContent = `The knowledge of ${BIDDER_NAMES[Math.floor(Math.random() * BIDDER_NAMES.length)]}'s true name`;

        consequence.style.display = 'block';

        // Visual explosion effect
        const seal = document.getElementById('cursed-seal-main');
        seal.style.animation = 'none';
        seal.innerHTML = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3em;">💥</div>
        `;

        // Update master seal
        const masterSeal = document.getElementById('master-seal');
        masterSeal.style.animation = 'none';
        masterSeal.style.opacity = '0.5';
        const cracksEl = document.getElementById('seal-cracks');
        cracksEl.style.opacity = '1';

        triggerBidFlash('⟡ THE SEAL IS BROKEN ⟡');
        document.getElementById('seal-attempts').textContent = '0';

        // Trigger ambient effects
        spawnAmbientEmbers(30);
    }

    // ==================== SPECTRAL BIDDER LIST ====================
    function initSpectralBidders() {
        const list = document.getElementById('spectral-bidder-list');

        // Periodically update bidder statuses
        setInterval(() => {
            document.querySelectorAll('.spectral-bidder').forEach(bidder => {
                const statuses = [
                    "Watching Lot #001", "Watching Lot #002", "Watching Lot #003",
                    "Watching Lot #004", "Watching Lot #005", "Watching Lot #006",
                    "Bidding on Lot #001", "Bidding on Lot #003", "Bidding on Lot #004",
                    "Contemplating...", "Listening...", "Whispering..."
                ];
                const statusEl = bidder.querySelector('.ghost-status');
                if (statusEl) {
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    statusEl.textContent = newStatus;
                }

                // Randomly flicker visibility
                if (Math.random() < 0.1) {
                    bidder.style.opacity = '0.2';
                    setTimeout(() => { bidder.style.opacity = ''; }, 2000);
                }
            });
        }, 5000);
    }

    function updateSpectralBidder(itemId, bidderName, avatar) {
        const list = document.getElementById('spectral-bidder-list');
        const items = list.querySelectorAll('.spectral-bidder');
        const randomIdx = Math.floor(Math.random() * items.length);
        const target = items[randomIdx];

        if (target) {
            const nameEl = target.querySelector('.ghost-name');
            const avatarEl = target.querySelector('.ghost-avatar');
            const statusEl = target.querySelector('.ghost-status');

            if (nameEl) nameEl.textContent = bidderName;
            if (avatarEl) avatarEl.textContent = avatar;
            if (statusEl) statusEl.textContent = `Bidding on Lot #00${itemId}`;

            target.style.opacity = '1';
            setTimeout(() => {
                if (Math.random() < 0.5) {
                    target.style.opacity = '0.3';
                }
            }, 10000);
        }
    }

    // ==================== FLOATING EMBERS ====================
    function initEmbers() {
        const container = document.getElementById('floating-embers');
        container.innerHTML = '';

        for (let i = 0; i < CONFIG.emberCount; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember-particle';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.bottom = `${Math.random() * 20}%`;
            ember.style.setProperty('--ember-duration', `${8 + Math.random() * 12}s`);
            ember.style.animationDelay = `${Math.random() * 15}s`;
            ember.style.width = `${2 + Math.random() * 3}px`;
            ember.style.height = ember.style.width;
            container.appendChild(ember);
        }
    }

    // ==================== AMBIENT EMBER SPAWN ====================
    function spawnAmbientEmbers(count) {
        const container = document.getElementById('floating-embers');
        for (let i = 0; i < count; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember-particle';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.bottom = '0%';
            ember.style.setProperty('--ember-duration', `${4 + Math.random() * 6}s`);
            ember.style.animationDelay = '0s';
            ember.style.width = `${3 + Math.random() * 4}px`;
            ember.style.height = ember.style.width;
            container.appendChild(ember);

            setTimeout(() => ember.remove(), 10000);
        }
    }

    // ==================== WHISPER SYSTEM ====================
    let whisperTimeout = null;

    function initWhispers() {
        scheduleWhisper();
    }

    function scheduleWhisper() {
        const delay = CONFIG.whisperIntervalMin + Math.random() * (CONFIG.whisperIntervalMax - CONFIG.whisperIntervalMin);
        whisperTimeout = setTimeout(() => {
            showWhisper();
            scheduleWhisper();
        }, delay);
    }

    function showWhisper() {
        const popup = document.getElementById('whisper-popup');
        const text = document.getElementById('whisper-text');
        const whisperText = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
        text.textContent = whisperText;
        popup.classList.add('visible');

        setTimeout(() => {
            popup.classList.remove('visible');
        }, 5000);
    }

    // ==================== BLOOD DRIP ON WEAPONS ====================
    function initBloodDrips() {
        const dripContainer = document.getElementById('blood-drip-1');
        if (!dripContainer) return;

        setInterval(() => {
            if (Math.random() < 0.4) {
                createBloodDrip(dripContainer);
            }
        }, CONFIG.bloodDripRate);
    }

    function createBloodDrip(container) {
        const drip = document.createElement('div');
        drip.className = 'blood-drip';
        drip.style.left = `${10 + Math.random() * 40}px`;
        drip.style.animationDuration = `${1 + Math.random() * 2}s`;
        drip.style.height = `${20 + Math.random() * 50}px`;
        container.appendChild(drip);

        setTimeout(() => drip.remove(), 3000);
    }

    // ==================== BLOOD SPLASH ON BID ====================
    function triggerBloodSplash() {
        const colors = ['var(--color-bright-blood)', 'var(--color-crimson)', 'var(--color-ember)', 'var(--color-gold)'];

        for (let i = 0; i < 8; i++) {
            const splash = document.createElement('div');
            splash.className = 'bid-blood-splash';
            const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
            const distance = 60 + Math.random() * 100;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            splash.style.setProperty('--dx', `${dx}px`);
            splash.style.setProperty('--dy', `${dy}px`);
            splash.style.left = `calc(50% + ${dx * 0.3}px)`;
            splash.style.top = `calc(50% + ${dy * 0.3}px)`;
            splash.style.color = colors[Math.floor(Math.random() * colors.length)];
            splash.style.fontSize = `${1 + Math.random() * 1.5}em`;
            splash.textContent = '🩸';

            document.body.appendChild(splash);
            setTimeout(() => splash.remove(), 1500);
        }
    }

    // ==================== BID FLASH NOTIFICATION ====================
    function triggerBidFlash(message) {
        const flash = document.createElement('div');
        flash.className = 'bid-success-flash';
        flash.textContent = message;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 2200);
    }

    // ==================== WHISPER ON HOVER ====================
    function initWhisperHover() {
        const auctionCards = document.querySelectorAll('.auction-card');
        const whispers = [
            "Touch it... if you dare.",
            "Others have touched this. They wept.",
            "The weight of it... you can feel it, can't you?",
            "Be careful. It knows you're here.",
            "This one has a history... with teeth.",
            "Someone is watching you look at this.",
            "Do you feel that? The pull?",
            "The last one who held it... didn't let go.",
        ];

        auctionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const whisper = whispers[Math.floor(Math.random() * whispers.length)];
                const popup = document.getElementById('whisper-popup');
                const text = document.getElementById('whisper-text');
                text.textContent = whisper;
                popup.classList.add('visible');

                setTimeout(() => {
                    popup.classList.remove('visible');
                }, 3500);
            });
        });
    }

    // ==================== LORE TOGGLE ====================
    window.toggleLore = function(element) {
        const lorePanel = element.nextElementSibling;
        const expandText = element.querySelector('.expand-text');

        if (lorePanel.style.display === 'block') {
            lorePanel.style.display = 'none';
            expandText.textContent = '[ Reveal Lore ]';
        } else {
            lorePanel.style.display = 'block';
            expandText.textContent = '[ Conceal Lore ]';

            // Auto-hide after 30 seconds
            setTimeout(() => {
                if (lorePanel.style.display === 'block') {
                    lorePanel.style.display = 'none';
                    expandText.textContent = '[ Reveal Lore ]';
                }
            }, 30000);
        }
    };

    // ==================== LEDGER FILTERING ====================
    function initLedgerFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const rows = document.querySelectorAll('#ledger-body tr');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                rows.forEach(row => {
                    if (filter === 'all') {
                        row.style.display = '';
                    } else {
                        const rarity = row.dataset.rarity;
                        row.style.display = (rarity === filter) ? '' : 'none';
                    }
                });
            });
        });
    }

    // ==================== SPECTRAL BIDDER COUNT FLUCTUATION ====================
    function initSpecterCount() {
        const countEl = document.getElementById('specter-count-num');
        setInterval(() => {
            const base = 13;
            const variation = Math.floor(Math.random() * 7) - 3; // -3 to +3
            countEl.textContent = base + variation;
        }, 8000);
    }

    // ==================== PERIODIC BID ACTIVITY ====================
    function simulateBidActivity() {
        setInterval(() => {
            const randomItem = auctionItems[Math.floor(Math.random() * auctionItems.length)];
            if (randomItem.ended) return;

            const bidderIdx = Math.floor(Math.random() * BIDDER_NAMES.length);
            const bidderName = BIDDER_NAMES[bidderIdx];
            const avatar = BIDDER_AVATARS[bidderIdx];

            randomItem.currentBid += randomItem.increment * (1 + Math.floor(Math.random() * 3));
            randomItem.bidCount++;

            addBidHistory(randomItem.id, bidderName, randomItem.currentBid, 'just now');

            updateBidDisplay(randomItem);
            updateBidHistory(randomItem.id);
            updateSpectralBidder(randomItem.id, bidderName, avatar);
        }, 15000);
    }

    // ==================== SHAKE ANIMATION ====================
    const shakeKeyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = shakeKeyframes;
    document.head.appendChild(shakeStyle);

    // ==================== INITIALIZATION ====================
    function init() {
        initCountdowns();
        initBidButtons();
        initSeal();
        initSpectralBidders();
        initEmbers();
        initBloodDrips();
        initWhispers();
        initWhisperHover();
        initLedgerFilters();
        initSpecterCount();
        simulateBidActivity();
    }

    // Start everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();