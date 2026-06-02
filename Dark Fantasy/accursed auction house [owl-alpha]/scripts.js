/* =============================================
   THE OBSidian EXCHANGE — Scripts
   Occult Auction House Interactivity
   ============================================= */

(function () {
    'use strict';

    /* === Auction Item Data === */
    const auctionItems = {
        1: {
            id: 1,
            title: "Malachar's Hungering Blade",
            subtitle: "Soul-Bound Greatsword, Age Unknown",
            category: "weapons",
            curseTier: "Catastrophic",
            curseClass: "",
            currentBid: 47500,
            bidIncrement: 2500,
            bidCount: 24,
            endTime: Date.now() + (11 * 3600 + 42 * 60 + 17) * 1000,
            iconType: "sword",
            iconColor: "#8b0000",
            whisper: "...it sings to me in the voices of the consumed...",
            lore: "Forged in the dying breath of the lich-king Malachar, this blade does not merely cut flesh — it devours the essence of those it strikes. Each kill adds a new voice to the chorus that eternally sings from its edge. The blade cannot be sheathed while a living soul remains within earshot, and it is said that those who wield it for more than seven days begin to crave not food, but the warmth of others' terror.",
            provenance: [
                "Crafted in the Obsidian Forge beneath the Screaming Mountains, circa Age of Ash",
                "Wielded by Malachar the Undying during the Siege of Lumenfell",
                "Lost for three centuries in the Crypt of Echoing Regret",
                "Recovered by the Expedition of the Damned, 1273 P.B.S.",
                "Passed through fourteen hands, none of whom survived a fortnight"
            ],
            warnings: [
                "Previous owners have reported hearing whispers during sleep",
                "The blade cannot be willingly released once drawn",
                "Prolonged contact may result in irreversible soul-binding",
                "Not recommended for use near mirrors or reflective surfaces"
            ],
            bidHistory: [
                { bidder: "xXDarkLord99Xx", amount: 47500, time: "2m ago" },
                { bidder: "NecroMancer42", amount: 45000, time: "5m ago" },
                { bidder: "soul_collector", amount: 42000, time: "8m ago" },
                { bidder: "Grimoire_7th", amount: 38500, time: "14m ago" },
                { bidder: "void_walker", amount: 35000, time: "22m ago" }
            ]
        },
        2: {
            id: 2,
            title: "The Oculus of Endless Sight",
            subtitle: "Cursed Eye Relic, Recovered from the Vault of Whispers",
            category: "relics",
            curseTier: "Severe",
            curseClass: "tier-severe",
            currentBid: 32200,
            bidIncrement: 1500,
            bidCount: 18,
            endTime: Date.now() + (6 * 3600 + 18 * 60 + 53) * 1000,
            iconType: "eye",
            iconColor: "#cc4400",
            whisper: "...I see what watches from behind the stars...",
            lore: "This disembodied eye, suspended in a cage of blackened silver, grants its bearer the ability to see through any barrier, across any distance, and into dimensions that mortal minds were never meant to perceive. The knowledge it imparts is invaluable — and unbearable. Those who gaze through it too long report seeing something gazing back, something that exists in the spaces between stars and has been waiting, with infinite patience, to be noticed.",
            provenance: [
                "Excavated from the Temple of the Unblinking God, Deep Deserts",
                "Once the left eye of the Oracle of Drowned Visions",
                "Sealed in the Vault of Whispers after the Incident of 842",
                "Stolen during the Night of Unraveling",
                "Recovered by Exchange agents from a collapsed pocket dimension"
            ],
            warnings: [
                "Extended use may cause permanent alterations to visual perception",
                "The eye has been observed moving independently of its cage",
                "Users report difficulty distinguishing between seen and remembered",
                "Do not look through the eye during astronomical events"
            ],
            bidHistory: [
                { bidder: "OcularProphet", amount: 32200, time: "1m ago" },
                { bidder: "xXDarkLord99Xx", amount: 30700, time: "4m ago" },
                { bidder: "ThirdEye_Blind", amount: 28000, time: "9m ago" }
            ]
        },
        3: {
            id: 3,
            title: "Codex of the Hollow King",
            subtitle: "Forbidden Grimoire, Written in Unknown Blood",
            category: "artifacts",
            curseTier: "Existential",
            curseClass: "tier-extreme",
            currentBid: 89000,
            bidIncrement: 5000,
            bidCount: 41,
            endTime: Date.now() + (23 * 3600 + 59 * 60 + 48) * 1000,
            iconType: "tome",
            iconColor: "#8b008b",
            whisper: "...the words rearrange themselves when unobserved...",
            lore: "This massive tome, bound in leather that is warm to the touch, contains the collected writings of the Hollow King — a being who exists simultaneously in all moments of time. The text shifts and rewrites itself, offering different knowledge to different readers. Some have found within its pages the secrets of immortality. Others have found only the date and manner of their own death. The Exchange has confirmed that the ink used in its composition is, in fact, blood — but of no known species.",
            provenance: [
                "Authored by the Hollow King across multiple timelines",
                "Original copy destroyed; this is the Seventh Iteration",
                "Previous six iterations have all been consumed by their readers",
                "Recovered from the Library at the End of All Things",
                "Currently housed in a lead-lined case within the Exchange vault"
            ],
            warnings: [
                "Reading more than three pages consecutively is strongly discouraged",
                "The book has been known to add new chapters spontaneously",
                "Previous readers have experienced temporal displacement",
                "Do not read aloud. Do not read aloud. Do not read aloud.",
                "The Exchange is not responsible for ontological paradoxes"
            ],
            bidHistory: [
                { bidder: "Archivist_Doom", amount: 89000, time: "30s ago" },
                { bidder: "LexiconMortem", amount: 84000, time: "3m ago" },
                { bidder: "Grimoire_7th", amount: 78500, time: "7m ago" }
            ]
        },
        4: {
            id: 4,
            title: "The Weeping Crown of Ashara",
            subtitle: "Cursed Royal Diadem, Pre-Imperial Era",
            category: "artifacts",
            curseTier: "Severe",
            curseClass: "tier-severe",
            currentBid: 21800,
            bidIncrement: 1000,
            bidCount: 15,
            endTime: Date.now() + (4 * 3600 + 12 * 60 + 30) * 1000,
            iconType: "crown",
            iconColor: "#cc8800",
            whisper: "...she still weeps for the kingdom she burned...",
            lore: "This tarnished silver circlet is perpetually damp with tears that manifest from nothing. Once worn by Queen Ashara, who chose to immolate her entire kingdom rather than see it fall to invaders. The crown grants its wearer the ability to command absolute loyalty — and the crushing weight of every life their decisions have ever cost.",
            provenance: [
                "Forged for Queen Ashara of the Ember Throne",
                "Worn during the Burning of the Thousand Spires",
                "Recovered from the Ash Fields by relic hunters",
                "Owned by seven monarchs, all of whom died by fire"
            ],
            warnings: [
                "Wearer may experience spontaneous weeping",
                "The crown cannot be removed without Exchange assistance",
                "Prolonged wear causes temperature sensitivity"
            ],
            bidHistory: [
                { bidder: "AshenMonarch", amount: 21800, time: "3m ago" },
                { bidder: "CrownCollector", amount: 20800, time: "8m ago" },
                { bidder: "RoyalRemains", amount: 19000, time: "15m ago" }
            ]
        },
        5: {
            id: 5,
            title: "Vellithar's Chains of Binding",
            subtitle: "Soul-Bound Restraints, Demonic Origin",
            category: "weapons",
            curseTier: "Catastrophic",
            curseClass: "",
            currentBid: 56300,
            bidIncrement: 2500,
            bidCount: 31,
            endTime: Date.now() + (8 * 3600 + 45 * 60 + 10) * 1000,
            iconType: "chains",
            iconColor: "#cc2222",
            whisper: "...they remember every soul they've ever held...",
            lore: "These black iron chains, each link inscribed with a different true name, were forged by the demon Vellithar to imprison entities far more powerful than any mortal. The chains adjust to any size, any form, and cannot be broken by any physical means. Those bound by them report hearing the whispered memories of every soul the chains have ever restrained — a chorus numbering in the thousands.",
            provenance: [
                "Forged in the Seventh Hell by the demon Vellithar",
                "Used to bind the Titan of the Eastern Wastes",
                "Lost during the Celestial Uprising",
                "Recovered from a collapsed temple in the Blighted Marshes"
            ],
            warnings: [
                "The chains may attempt to bind the wielder",
                "Audible whispering intensifies near celestial beings",
                "Do not use on entities of royal or divine blood"
            ],
            bidHistory: [
                { bidder: "ChainBreaker99", amount: 56300, time: "1m ago" },
                { bidder: "DemonBinder", amount: 53800, time: "6m ago" },
                { bidder: "soul_collector", amount: 51000, time: "11m ago" }
            ]
        },
        6: {
            id: 6,
            title: "The Mirror of Forsaken Selves",
            subtitle: "Dimensional Artifact, Unknown Origin",
            category: "relics",
            curseTier: "Existential",
            curseClass: "tier-extreme",
            currentBid: 73400,
            bidIncrement: 3000,
            bidCount: 28,
            endTime: Date.now() + (15 * 3600 + 30 * 60 + 0) * 1000,
            iconType: "mirror",
            iconColor: "#8b008b",
            whisper: "...every version of you that could have been is watching...",
            lore: "This ornate hand mirror does not reflect the person who holds it. Instead, it shows the viewer as they would have become had they made different choices — every fork in the road, every path not taken. Some reflections are inspiring. Others are monstrous. A few do not appear to be human at all. The Exchange has received reports of reflections stepping out of the glass.",
            provenance: [
                "Origin unknown; predates all recorded civilizations",
                "Found in the ruins of a city that exists in no known geography",
                "Previous owners include three archmages and one god",
                "Currently shows only static to Exchange appraisers"
            ],
            warnings: [
                "Staring into the mirror for extended periods is forbidden",
                "Reflections have been observed moving when unobserved",
                "The mirror may show things that have not yet occurred",
                "Breaking the mirror is inadvisable and likely impossible"
            ],
            bidHistory: [
                { bidder: "ReflectionSeeker", amount: 73400, time: "2m ago" },
                { bidder: "OcularProphet", amount: 70400, time: "5m ago" },
                { bidder: "NecroMancer42", amount: 67000, time: "12m ago" }
            ]
        },
        7: {
            id: 7,
            title: "Ashbone Flute of the Pale Piper",
            subtitle: "Cursed Instrument, Necromantic",
            category: "artifacts",
            curseTier: "Severe",
            curseClass: "tier-severe",
            currentBid: 18700,
            bidIncrement: 1000,
            bidCount: 12,
            endTime: Date.now() + (2 * 3600 + 55 * 60 + 20) * 1000,
            iconType: "flute",
            iconColor: "#cc8800",
            whisper: "...the dead do not rest when the piper plays...",
            lore: "Carved from the finger bone of an unnamed necromancer, this flute produces music that transcends the boundary between life and death. The dead rise — not as mindless undead, but as they were in life, with all their memories and sorrows intact. The Pale Piper, its original owner, is said to still walk the world, playing eternally, with an ever-growing orchestra of the lamenting dead.",
            provenance: [
                "Carved from the remains of the Archmage Pale",
                "Played during the Funeral March of the Last Dynasty",
                "Sealed in the Mausoleum of Silent Songs",
                "Stolen by an unknown agent during the Wailing Eclipse"
            ],
            warnings: [
                "Playing the flute near graveyards is extremely dangerous",
                "The dead summoned by the flute may refuse to return",
                "Prolonged playing may attract the Pale Piper's attention"
            ],
            bidHistory: [
                { bidder: "BoneMusician", amount: 18700, time: "4m ago" },
                { bidder: "DeathSerenade", amount: 17700, time: "9m ago" }
            ]
        },
        8: {
            id: 8,
            title: "The Lantern of Wandering Souls",
            subtitle: "Forbidden Relic, Spirit Vessel",
            category: "relics",
            curseTier: "Catastrophic",
            curseClass: "",
            currentBid: 42100,
            bidIncrement: 2000,
            bidCount: 22,
            endTime: Date.now() + (19 * 3600 + 15 * 60 + 45) * 1000,
            iconType: "lantern",
            iconColor: "#cc2222",
            whisper: "...light a candle for the forgotten, and they will find you...",
            lore: "This battered iron lantern burns with a cold, pale flame that requires no fuel. The light it casts reveals things that are normally invisible — spirits, ghosts, and the lingering echoes of the violently deceased. The lantern's flame is fueled by captured souls, and it hungers constantly. Those who carry it report that the dead no longer fear them. They are something far worse.",
            provenance: [
                "Created by the Order of the Veil Between",
                "Used during the Great Spirit Census of 666",
                "Lost in the Catacombs of Unnumbered Dead",
                "Recovered by a grave robber who wished he hadn't"
            ],
            warnings: [
                "The lantern's flame cannot be extinguished by natural means",
                "Carrying the lantern attracts unwanted spiritual attention",
                "The souls within the lantern are aware and communicative",
                "Do not carry near consecrated ground"
            ],
            bidHistory: [
                { bidder: "SpiritTender", amount: 42100, time: "1m ago" },
                { bidder: "void_walker", amount: 40100, time: "7m ago" },
                { bidder: "Grimoire_7th", amount: 38000, time: "14m ago" }
            ]
        }
    };

    /* === Spectral Bidder Data === */
    const spectralBidders = [
        { name: "xXDarkLord99Xx", status: "Active — bidding feverishly", totalSpent: 156200, initial: "X", delay: 0 },
        { name: "NecroMancer42", status: "Lurking in the shadows", totalSpent: 98700, initial: "N", delay: 1 },
        { name: "Archivist_Doom", status: "Studying the Codex intently", totalSpent: 203400, initial: "A", delay: 2 },
        { name: "OcularProphet", status: "Sees all, bids on more", totalSpent: 87600, initial: "O", delay: 3 },
        { name: "Grimoire_7th", status: "The seventh seal watches", totalSpent: 134500, initial: "G", delay: 4 },
        { name: "soul_collector", status: "Harvesting more than souls", totalSpent: 67800, initial: "S", delay: 5 },
        { name: "void_walker", status: "Between spaces, between bids", totalSpent: 112300, initial: "V", delay: 6 },
        { name: "LexiconMortem", status: "Words have power. So do bids.", totalSpent: 45600, initial: "L", delay: 7 },
        { name: "ChainBreaker99", status: "Bound by nothing, not even reason", totalSpent: 78900, initial: "C", delay: 8 },
        { name: "ThirdEye_Blind", status: "Blind but all-seeing", totalSpent: 54200, initial: "T", delay: 9 },
        { name: "AshenMonarch", status: "Ruling from the ashes", totalSpent: 91400, initial: "A", delay: 10 },
        { name: "ReflectionSeeker", status: "Searching for the true self", totalSpent: 38700, initial: "R", delay: 11 }
    ];

    /* === State === */
    let activeFilter = 'all';
    let sortMethod = 'ending-soon';
    let currentModalItem = null;
    let userBids = {};
    let totalUserSpent = 0;
    let timerInterval = null;

    /* === Initialization === */
    function init() {
        createEmbers();
        populateAuctionGrid();
        populateSpectralBidders();
        startTimers();
        bindEvents();
        simulateLiveBidding();
    }

    /* === Embers === */
    function createEmbers() {
        const container = document.getElementById('embers');
        for (let i = 0; i < 25; i++) {
            const ember = document.createElement('div');
            ember.classList.add('ember');
            ember.style.left = Math.random() * 100 + '%';
            ember.style.bottom = '-10px';
            ember.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
            ember.style.animationDuration = (8 + Math.random() * 12) + 's';
            ember.style.animationDelay = Math.random() * 15 + 's';
            ember.style.width = (2 + Math.random() * 3) + 'px';
            ember.style.height = ember.style.width;
            container.appendChild(ember);
        }
    }

    /* === Auction Grid === */
    function populateAuctionGrid() {
        const grid = document.getElementById('auction-grid');
        grid.innerHTML = '';

        const items = Object.values(auctionItems)
            .filter(item => activeFilter === 'all' || item.category === activeFilter)
            .sort(getSortFunction());

        items.forEach(item => {
            grid.appendChild(createLotCard(item));
        });
    }

    function getSortFunction() {
        switch (sortMethod) {
            case 'price-high':
                return (a, b) => b.currentBid - a.currentBid;
            case 'price-low':
                return (a, b) => a.currentBid - b.currentBid;
            case 'most-bids':
                return (a, b) => b.bidCount - a.bidCount;
            case 'ending-soon':
            default:
                return (a, b) => a.endTime - b.endTime;
        }
    }

    function createLotCard(item) {
        const card = document.createElement('div');
        card.classList.add('lot-card');
        card.dataset.itemId = item.id;

        const timeLeft = item.endTime - Date.now();
        const hours = Math.max(0, Math.floor(timeLeft / 3600000));
        const minutes = Math.max(0, Math.floor((timeLeft % 3600000) / 60000));
        const seconds = Math.max(0, Math.floor((timeLeft % 60000) / 1000));
        const isUrgent = timeLeft < 3600000;

        card.innerHTML = `
            <div class="lot-image">
                ${getLotIconSvg(item.iconType, item.iconColor)}
            </div>
            <div class="lot-category">${getCategoryLabel(item.category)}</div>
            <h3 class="lot-title">${item.title}</h3>
            <p class="lot-subtitle">${item.subtitle}</p>
            <div class="lot-bid-row">
                <span class="lot-bid-label">Current Bid</span>
                <span class="lot-bid-value" id="lot-bid-${item.id}">⬡ ${formatNumber(item.currentBid)}</span>
            </div>
            <div class="lot-timer ${isUrgent ? 'urgent' : ''}" id="lot-timer-${item.id}">
                ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
            </div>
            <div class="lot-bid-count">${item.bidCount} bids placed</div>
            <div class="lot-actions">
                <button class="btn-lot-bid" data-item="${item.id}" data-increment="${item.bidIncrement}">
                    Bid +${formatNumber(item.bidIncrement)}
                </button>
                <button class="btn-lot-lore" data-item="${item.id}">Lore</button>
            </div>
        `;

        return card;
    }

    function getCategoryLabel(category) {
        const labels = {
            weapons: "Soul-Bound Weapon",
            artifacts: "Cursed Artifact",
            relics: "Forbidden Relic"
        };
        return labels[category] || "Unknown";
    }

    function getLotIconSvg(type, color) {
        const svgs = {
            crown: `<svg viewBox="0 0 200 200" class="lot-icon-svg"><path d="M40 140 L60 60 L100 100 L140 60 L160 140 Z" fill="none" stroke="${color}" stroke-width="2"/><rect x="40" y="140" width="120" height="20" fill="none" stroke="${color}" stroke-width="2"/><circle cx="60" cy="60" r="5" fill="${color}" opacity="0.5"/><circle cx="100" cy="45" r="6" fill="${color}" opacity="0.5"/><circle cx="140" cy="60" r="5" fill="${color}" opacity="0.5"/></svg>`,
            chains: `<svg viewBox="0 0 200 200" class="lot-icon-svg"><ellipse cx="70" cy="60" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3"/><ellipse cx="130" cy="100" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3"/><ellipse cx="70" cy="140" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3"/><ellipse cx="130" cy="60" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/><ellipse cx="70" cy="100" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/></svg>`,
            mirror: `<svg viewBox="0 0 200 200" class="lot-icon-svg"><rect x="60" y="40" width="80" height="120" rx="10" fill="none" stroke="${color}" stroke-width="2"/><rect x="70" y="50" width="60" height="100" rx="6" fill="none" stroke="${color}" stroke-width="1" opacity="0.5"/><ellipse cx="100" cy="100" rx="20" ry="25" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/><circle cx="100" cy="85" r="5" fill="${color}" opacity="0.2"/></svg>`,
            flute: `<svg viewBox="0 0 200 200" class="lot-icon-svg"><rect x="40" y="90" width="120" height="12" rx="6" fill="none" stroke="${color}" stroke-width="2"/><circle cx="70" cy="96" r="3" fill="${color}" opacity="0.4"/><circle cx="90" cy="96" r="3" fill="${color}" opacity="0.4"/><circle cx="110" cy="96" r="3" fill="${color}" opacity="0.4"/><circle cx="130" cy="96" r="3" fill="${color}" opacity="0.4"/><circle cx="150" cy="96" r="3" fill="${color}" opacity="0.4"/></svg>`,
            lantern: `<svg viewBox="0 0 200 200" class="lot-icon-svg"><rect x="75" y="50" width="50" height="80" rx="4" fill="none" stroke="${color}" stroke-width="2"/><rect x="85" y="130" width="30" height="8" fill="none" stroke="${color}" stroke-width="1.5"/><line x1="100" y1="30" x2="100" y2="50" stroke="${color}" stroke-width="1.5"/><circle cx="100" cy="90" r="12" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/><circle cx="100" cy="90" r="6" fill="${color}" opacity="0.3"/></svg>`
        };
        return svgs[type] || svgs.chains;
    }

    /* === Spectral Bidders === */
    function populateSpectralBidders() {
        const grid = document.getElementById('spectral-grid');
        grid.innerHTML = '';

        spectralBidders.forEach((bidder, index) => {
            const el = document.createElement('div');
            el.classList.add('spectral-bidder');
            el.style.animationDelay = (bidder.delay * 0.7) + 's';
            el.innerHTML = `
                <div class="spectral-avatar">${bidder.initial}</div>
                <div class="spectral-info">
                    <div class="spectral-name">${bidder.name}</div>
                    <div class="spectral-status">${bidder.status}</div>
                </div>
                <div class="spectral-total">
                    <div class="spectral-label">Total Spent</div>
                    ⬡ ${formatNumber(bidder.totalSpent)}
                </div>
            `;
            grid.appendChild(el);
        });
    }

    /* === Timers === */
    function startTimers() {
        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            Object.values(auctionItems).forEach(item => {
                updateTimerDisplay(item);
            });
        }, 1000);
    }

    function updateTimerDisplay(item) {
        const timeLeft = Math.max(0, item.endTime - Date.now());
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const isUrgent = timeLeft < 3600000;

        const timerStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const featuredTimer = document.getElementById(`timer-${item.id}`);
        if (featuredTimer) {
            featuredTimer.innerHTML = `
                <span class="timer-hours">${String(hours).padStart(2, '0')}</span><span class="timer-sep">:</span>
                <span class="timer-minutes">${String(minutes).padStart(2, '0')}</span><span class="timer-sep">:</span>
                <span class="timer-seconds">${String(seconds).padStart(2, '0')}</span>
            `;
            if (isUrgent) {
                featuredTimer.classList.add('urgent');
            }
        }

        const lotTimer = document.getElementById(`lot-timer-${item.id}`);
        if (lotTimer) {
            lotTimer.textContent = timerStr;
            if (isUrgent) {
                lotTimer.classList.add('urgent');
            } else {
                lotTimer.classList.remove('urgent');
            }
        }

        if (timeLeft <= 0) {
            item.endTime = 0;
        }
    }

    /* === Bid Handling === */
    function placeBid(itemId, increment) {
        const item = auctionItems[itemId];
        if (!item) return;

        const previousBid = item.currentBid;
        item.currentBid += increment;
        item.bidCount++;

        if (!userBids[itemId]) {
            userBids[itemId] = [];
        }
        userBids[itemId].push(item.currentBid);
        totalUserSpent += increment;

        animateBidAmount(itemId, previousBid, item.currentBid);
        addBidToHistory(itemId, item.currentBid);
        updateLotBidDisplay(itemId, item.currentBid);
        showToast('Bid Placed', `Your bid of ⬡ ${formatNumber(item.currentBid)} has been placed on "${item.title}"`);
        updateUserAcquisitions(itemId, item.currentBid);

        const card = document.querySelector(`.featured-card[data-item-id="${itemId}"] .btn-bid`);
        if (card) {
            createBloodDrip(card);
        }
    }

    function animateBidAmount(itemId, fromValue, toValue) {
        const bidEl = document.getElementById(`bid-amount-${itemId}`);
        if (!bidEl) return;

        const coinValue = bidEl.querySelector('.coin-value');
        if (!coinValue) return;

        coinValue.textContent = formatNumber(toValue);
        coinValue.classList.remove('bid-up');
        void coinValue.offsetWidth;
        coinValue.classList.add('bid-up');
    }

    function updateLotBidDisplay(itemId, value) {
        const lotBid = document.getElementById(`lot-bid-${itemId}`);
        if (lotBid) {
            lotBid.textContent = `⬡ ${formatNumber(value)}`;
        }
    }

    function addBidToHistory(itemId, amount) {
        const historyList = document.querySelector(`#history-${itemId} .history-list`);
        if (!historyList) return;

        const entry = document.createElement('li');
        entry.classList.add('history-entry', 'new-entry');
        entry.innerHTML = `
            <span class="history-bidder">You</span>
            <span class="history-amount">⬡ ${formatNumber(amount)}</span>
            <span class="history-time">just now</span>
        `;

        historyList.insertBefore(entry, historyList.firstChild);

        while (historyList.children.length > 6) {
            historyList.removeChild(historyList.lastChild);
        }

        setTimeout(() => {
            entry.classList.remove('new-entry');
        }, 1000);

        const bidCount = document.querySelector(`.lot-card[data-item-id="${itemId}"] .lot-bid-count`);
        if (bidCount) {
            bidCount.textContent = `${auctionItems[itemId].bidCount} bids placed`;
        }
    }

    function updateUserAcquisitions(itemId, amount) {
        const emptyState = document.getElementById('acquisitions-empty');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /* === Seal Breaking === */
    function breakSeal(itemId) {
        const seal = document.getElementById(`seal-${itemId}`);
        if (!seal || seal.classList.contains('broken')) return;

        seal.classList.add('broken');

        const whisper = document.getElementById(`whisper-${itemId}`);
        if (whisper) {
            setTimeout(() => {
                whisper.classList.add('visible');
            }, 400);
        }
    }

    /* === Lore Modal === */
    function openLoreModal(itemId) {
        const item = auctionItems[itemId];
        if (!item) return;

        currentModalItem = itemId;

        const modalImage = document.getElementById('modal-item-image');
        modalImage.innerHTML = getModalIconSvg(item.iconType, item.iconColor);

        const modalCurse = document.getElementById('modal-item-curse');
        modalCurse.innerHTML = `
            <span class="curse-icon">⛧</span>
            <span class="curse-level">Curse Tier: ${item.curseTier}</span>
        `;
        modalCurse.className = 'modal-item-curse card-curse-badge ' + item.curseClass;

        document.getElementById('modal-item-title').textContent = item.title;
        document.getElementById('modal-item-subtitle').textContent = item.subtitle;
        document.getElementById('modal-lore-text').textContent = item.lore;

        const provenanceList = document.getElementById('provenance-list');
        provenanceList.innerHTML = '';
        item.provenance.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            provenanceList.appendChild(li);
        });

        const warningsList = document.getElementById('warnings-list');
        warningsList.innerHTML = '';
        item.warnings.forEach(warning => {
            const li = document.createElement('li');
            li.textContent = warning;
            warningsList.appendChild(li);
        });

        document.getElementById('lore-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLoreModal() {
        document.getElementById('lore-modal').classList.remove('open');
        document.body.style.overflow = '';
        currentModalItem = null;
    }

    function getModalIconSvg(type, color) {
        const svgs = {
            sword: `<svg viewBox="0 0 200 200" class="relic-icon"><defs><linearGradient id="mSwordGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b6914;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#1a0a2e;stop-opacity:1"/></linearGradient></defs><rect x="95" y="30" width="10" height="100" fill="url(#mSwordGrad)" rx="1"/><rect x="75" y="125" width="50" height="8" fill="#3d2b1f" rx="2"/><rect x="90" y="133" width="20" height="40" fill="#2a1a0e" rx="2"/><circle cx="100" cy="175" r="6" fill="#4a3728"/><circle cx="100" cy="25" r="4" fill="#8b0000" opacity="0.8"/><path d="M95 130 Q100 125 105 130" fill="none" stroke="#8b0000" stroke-width="1" opacity="0.5"/></svg>`,
            eye: `<svg viewBox="0 0 200 200" class="relic-icon"><defs><radialGradient id="mEyeGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#ff0000;stop-opacity:0.6"/><stop offset="60%" style="stop-color:#4a0000;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1"/></radialGradient></defs><ellipse cx="100" cy="100" rx="70" ry="40" fill="none" stroke="#4a0000" stroke-width="2"/><circle cx="100" cy="100" r="25" fill="url(#mEyeGrad)"/><circle cx="100" cy="100" r="10" fill="#000"/><circle cx="94" cy="94" r="4" fill="#ff0000" opacity="0.6"/><path d="M30 100 Q100 50 170 100" fill="none" stroke="#2a0000" stroke-width="1"/><path d="M30 100 Q100 150 170 100" fill="none" stroke="#2a0000" stroke-width="1"/></svg>`,
            tome: `<svg viewBox="0 0 200 200" class="relic-icon"><defs><linearGradient id="mTomeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2a1a0e;stop-opacity:1"/><stop offset="100%" style="stop-color:#1a0a05;stop-opacity:1"/></linearGradient></defs><rect x="50" y="30" width="100" height="140" rx="3" fill="url(#mTomeGrad)" stroke="#4a3728" stroke-width="2"/><rect x="55" y="35" width="90" height="130" rx="2" fill="none" stroke="#3d2b1f" stroke-width="1"/><line x1="100" y1="35" x2="100" y2="165" stroke="#3d2b1f" stroke-width="1"/><text x="70" y="85" fill="#8b0000" font-size="20" font-family="serif" opacity="0.6">Abra</text><text x="70" y="115" fill="#8b0000" font-size="20" font-family="serif" opacity="0.6">Cadav</text><text x="70" y="145" fill="#8b0000" font-size="20" font-family="serif" opacity="0.6">Eryx</text></svg>`,
            crown: `<svg viewBox="0 0 200 200" class="relic-icon"><path d="M40 140 L60 60 L100 100 L140 60 L160 140 Z" fill="none" stroke="${color}" stroke-width="3"/><rect x="40" y="140" width="120" height="20" fill="none" stroke="${color}" stroke-width="2.5"/><circle cx="60" cy="60" r="6" fill="${color}" opacity="0.5"/><circle cx="100" cy="45" r="7" fill="${color}" opacity="0.5"/><circle cx="140" cy="60" r="6" fill="${color}" opacity="0.5"/><circle cx="100" cy="150" r="4" fill="${color}" opacity="0.3"/></svg>`,
            chains: `<svg viewBox="0 0 200 200" class="relic-icon"><ellipse cx="70" cy="60" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3.5"/><ellipse cx="130" cy="100" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3.5"/><ellipse cx="70" cy="140" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="3.5"/><ellipse cx="130" cy="60" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/><ellipse cx="70" cy="100" rx="30" ry="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/></svg>`,
            mirror: `<svg viewBox="0 0 200 200" class="relic-icon"><rect x="60" y="40" width="80" height="120" rx="10" fill="none" stroke="${color}" stroke-width="3"/><rect x="70" y="50" width="60" height="100" rx="6" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/><ellipse cx="100" cy="100" rx="20" ry="25" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/><circle cx="100" cy="85" r="5" fill="${color}" opacity="0.2"/></svg>`,
            flute: `<svg viewBox="0 0 200 200" class="relic-icon"><rect x="40" y="90" width="120" height="12" rx="6" fill="none" stroke="${color}" stroke-width="3"/><circle cx="70" cy="96" r="4" fill="${color}" opacity="0.4"/><circle cx="90" cy="96" r="4" fill="${color}" opacity="0.4"/><circle cx="110" cy="96" r="4" fill="${color}" opacity="0.4"/><circle cx="130" cy="96" r="4" fill="${color}" opacity="0.4"/><circle cx="150" cy="96" r="4" fill="${color}" opacity="0.4"/></svg>`,
            lantern: `<svg viewBox="0 0 200 200" class="relic-icon"><rect x="75" y="50" width="50" height="80" rx="4" fill="none" stroke="${color}" stroke-width="3"/><rect x="85" y="130" width="30" height="10" fill="none" stroke="${color}" stroke-width="2"/><line x1="100" y1="30" x2="100" y2="50" stroke="${color}" stroke-width="2"/><circle cx="100" cy="90" r="14" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.4"/><circle cx="100" cy="90" r="7" fill="${color}" opacity="0.3"/></svg>`
        };
        return svgs[type] || svgs.sword;
    }

    /* === Toast Notifications === */
    function showToast(title, message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4000);
    }

    /* === Blood Drip Effect === */
    function createBloodDrip(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const drip = document.createElement('div');
            drip.classList.add('blood-drip');
            drip.style.position = 'fixed';
            drip.style.left = (rect.left + Math.random() * rect.width) + 'px';
            drip.style.top = (rect.top + rect.height / 2) + 'px';
            drip.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
            document.body.appendChild(drip);

            setTimeout(() => {
                if (drip.parentNode) {
                    drip.parentNode.removeChild(drip);
                }
            }, 1000);
        }
    }

    /* === Live Bidding Simulation === */
    function simulateLiveBidding() {
        setInterval(() => {
            const itemIds = Object.keys(auctionItems);
            const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
            const item = auctionItems[randomItemId];

            if (Math.random() > 0.6) {
                const npcNames = [
                    "ShadowBroker", "EldritchBid", "VoidPatron", "CryptKeeper",
                    "RuneMaster", "DeathDealer", "SoulMerchant", "NightCollector",
                    "GrimWarden", "AbyssSeeker", "DreadCollector", "HexLord"
                ];
                const npcName = npcNames[Math.floor(Math.random() * npcNames.length)];
                const increment = item.bidIncrement;

                item.currentBid += increment;
                item.bidCount++;

                animateBidAmount(randomItemId, item.currentBid - increment, item.currentBid);
                updateLotBidDisplay(randomItemId, item.currentBid);

                const historyList = document.querySelector(`#history-${randomItemId} .history-list`);
                if (historyList) {
                    const entry = document.createElement('li');
                    entry.classList.add('history-entry', 'new-entry');
                    entry.innerHTML = `
                        <span class="history-bidder">${npcName}</span>
                        <span class="history-amount">⬡ ${formatNumber(item.currentBid)}</span>
                        <span class="history-time">just now</span>
                    `;
                    historyList.insertBefore(entry, historyList.firstChild);

                    while (historyList.children.length > 6) {
                        historyList.removeChild(historyList.lastChild);
                    }

                    setTimeout(() => {
                        entry.classList.remove('new-entry');
                    }, 1000);
                }

                const bidCount = document.querySelector(`.lot-card[data-item-id="${randomItemId}"] .lot-bid-count`);
                if (bidCount) {
                    bidCount.textContent = `${item.bidCount} bids placed`;
                }
            }
        }, 8000);
    }

    /* === Event Binding === */
    function bindEvents() {
        document.querySelectorAll('.btn-bid').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(this.dataset.item);
                const increment = parseInt(this.dataset.increment);
                placeBid(itemId, increment);
            });
        });

        document.querySelectorAll('.btn-lore').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(this.dataset.item);
                openLoreModal(itemId);
            });
        });

        document.querySelectorAll('.btn-lot-bid').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(this.dataset.item);
                const increment = parseInt(this.dataset.increment);
                placeBid(itemId, increment);
                createBloodDrip(this);
            });
        });

        document.querySelectorAll('.btn-lot-lore').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = this.closest('.lot-card');
                const itemId = parseInt(card.dataset.itemId);
                openLoreModal(itemId);
            });
        });

        document.getElementById('modal-close').addEventListener('click', closeLoreModal);
        document.getElementById('btn-modal-dismiss').addEventListener('click', closeLoreModal);
        document.getElementById('btn-modal-bid').addEventListener('click', function () {
            if (currentModalItem) {
                const item = auctionItems[currentModalItem];
                placeBid(currentModalItem, item.bidIncrement);
                closeLoreModal();
            }
        });

        document.querySelector('.modal-overlay').addEventListener('click', closeLoreModal);

        document.querySelectorAll('.card-seal').forEach(seal => {
            seal.addEventListener('click', function () {
                const itemId = parseInt(this.id.replace('seal-', ''));
                breakSeal(itemId);
            });
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFilter = this.dataset.filter;
                populateAuctionGrid();
                bindLotCardEvents();
            });
        });

        document.getElementById('sort-select').addEventListener('change', function () {
            sortMethod = this.value;
            populateAuctionGrid();
            bindLotCardEvents();
        });

        document.getElementById('btn-browse-lots').addEventListener('click', function () {
            document.getElementById('auction-floor').scrollIntoView({ behavior: 'smooth' });
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const section = this.dataset.section;
                const target = document.getElementById(section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeLoreModal();
            }
        });
    }

    function bindLotCardEvents() {
        document.querySelectorAll('.btn-lot-bid').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(this.dataset.item);
                const increment = parseInt(this.dataset.increment);
                placeBid(itemId, increment);
                createBloodDrip(this);
            });
        });

        document.querySelectorAll('.btn-lot-lore').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = this.closest('.lot-card');
                const itemId = parseInt(card.dataset.itemId);
                openLoreModal(itemId);
            });
        });
    }

    /* === Utility === */
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    /* === Start === */
    document.addEventListener('DOMContentLoaded', init);
})();