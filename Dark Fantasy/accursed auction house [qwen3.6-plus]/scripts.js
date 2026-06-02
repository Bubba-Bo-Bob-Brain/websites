/* ============================================
   THE OBSIDIAN AUCTION — JavaScript
   Dark Fantasy Auction House
   ============================================ */

(function() {
    'use strict';

    // --- Configuration & State ---
    const CONFIG = {
        timers: {
            crown: { hours: 2, minutes: 47, seconds: 33 },
            blade: { hours: 5, minutes: 12, seconds: 8 },
            mirror: { hours: 8, minutes: 34, seconds: 51 },
            tome: { hours: 12, minutes: 15, seconds: 42 },
            ring: { hours: 3, minutes: 48, seconds: 19 },
            orb: { hours: 1, minutes: 22, seconds: 7 },
            mask: { hours: 6, minutes: 55, seconds: 33 },
            key: { hours: 23, minutes: 59, seconds: 59 },
            chalice: { hours: 18, minutes: 44, seconds: 11 }
        },
        cursedItems: ['crown', 'blade', 'tome', 'orb', 'key'],
        bloodDripInterval: 3000,
        bidderRefreshInterval: 8000,
        toastDuration: 4000
    };

    const state = {
        bids: {},
        activeBidItem: null,
        bidHistory: {},
        cursedAcknowledged: {},
        isModalOpen: false
    };

    // --- Utility Functions ---
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- DOM Elements ---
    const elements = {
        header: document.getElementById('siteHeader'),
        bloodDrips: document.getElementById('bloodDrips'),
        biddersList: document.getElementById('biddersList'),
        loreModal: document.getElementById('loreModal'),
        loreModalClose: document.getElementById('loreModalClose'),
        loreModalImage: document.getElementById('loreModalImage'),
        loreModalMeta: document.getElementById('loreModalMeta'),
        loreModalTitle: document.getElementById('loreModalTitle'),
        loreModalLore: document.getElementById('loreModalLore'),
        loreModalAttributes: document.getElementById('loreModalAttributes'),
        loreModalBidHistory: document.getElementById('loreModalBidHistory'),
        bidHistoryList: document.getElementById('bidHistoryList'),
        warningModal: document.getElementById('warningModal'),
        warningSeal: document.getElementById('warningSeal'),
        warningMessage: document.getElementById('warningMessage'),
        warningAccept: document.getElementById('warningAccept'),
        warningRetreat: document.getElementById('warningRetreat'),
        bidModal: document.getElementById('bidModal'),
        bidModalClose: document.getElementById('bidModalClose'),
        bidAmount: document.getElementById('bidAmount'),
        bidderName: document.getElementById('bidderName'),
        bidNote: document.getElementById('bidNote'),
        submitBid: document.getElementById('submitBid'),
        bidToast: document.getElementById('bidToast'),
        toastTitle: document.getElementById('toastTitle'),
        toastMessage: document.getElementById('toastMessage')
    };

    // --- Item Data ---
    const itemData = {
        crown: {
            title: 'The Crown of Whispers',
            category: 'Regalia of the Damned',
            rarity: 'legendary',
            imageBg: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 40%, #0a0a1a 100%)',
            lore: `<p>Forged in the 7th circle of the Sunken Citadel, this crown once belonged to King Aldric the Hollow. It grants its wearer the ability to hear the thoughts of the dead — but the dead do not always speak kindly, and they never stop speaking.</p>
                   <p><em>Three previous owners have been found with their ears sewn shut.</em></p>
                   <p>The crown was recovered from the ruins of Castle Vorthain by our Curator, who lost two assistants in the process. It pulses with a faint warmth, and those who stand near it report hearing distant weeping.</p>`,
            attributes: [
                { label: 'Origin', value: 'Sunken Citadel, 7th Circle' },
                { label: 'Age', value: '~3,000 years' },
                { label: 'Curse Level', value: 'Severe' },
                { label: 'Previous Owners', value: '4 (3 deceased)' },
                { label: 'Power', value: 'Necrotic Communication' },
                { label: 'Containment', value: 'Lead-lined vault' }
            ]
        },
        blade: {
            title: 'Vorpalis, the Hungering Edge',
            category: 'Soul-Bound Weaponry',
            rarity: 'mythic',
            imageBg: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2d 50%, #0a1a0a 100%)',
            lore: `<p>This blade does not cut flesh — it severs the soul from the body. Bound to the spirit of its creator, the assassin-saint Vexia, it hungers eternally.</p>
                   <p><em>She speaks through it at midnight.</em></p>
                   <p>Vorpalis was forged in the heart of a dying star, quenched in the tears of a thousand widows. Its edge never dulls, for it feeds on the essence of those it strikes. The sword has been known to guide its wielder's hand, choosing victims of its own.</p>`,
            attributes: [
                { label: 'Origin', value: 'Forge of the Dying Star' },
                { label: 'Bound Spirit', value: 'Vexia, Assassin-Saint' },
                { label: 'Curse Level', value: 'Eternal' },
                { label: 'Soul Count', value: '1,247 confirmed' },
                { label: 'Power', value: 'Soul Severance' },
                { label: 'Containment', value: 'Salt circle, iron sheath' }
            ]
        },
        mirror: {
            title: 'The Mirror of Elsewhen',
            category: 'Scrying & Divination',
            rarity: 'epic',
            imageBg: 'linear-gradient(135deg, #0a1a1a 0%, #1a2a2a 40%, #0a0a1a 100%)',
            lore: `<p>Peer into this glass and see not your reflection, but the life you might have lived — in a world where you made different choices.</p>
                   <p><em>Some who looked too long tried to step through. They are still trapped on the other side.</em></p>
                   <p>The Mirror was crafted by the Blind Artificers of Yth, who ground their own eyes into the glass to give it sight. It shows not the future, but the infinite branching paths of what could have been. A beautiful, terrible window.</p>`,
            attributes: [
                { label: 'Origin', value: 'Workshops of Yth' },
                { label: 'Artificers', value: 'The Blind Seven' },
                { label: 'Curse Level', value: 'Moderate' },
                { label: 'Trapped Souls', value: 'Unknown' },
                { label: 'Power', value: 'Alternate Reality Scrying' },
                { label: 'Containment', value: 'Cloth of unseeing' }
            ]
        },
        tome: {
            title: 'Codex of the Ninth Gate',
            category: 'Forbidden Tomes',
            rarity: 'cursed',
            imageBg: 'linear-gradient(160deg, #1a0a0a 0%, #2d1515 60%, #0a0a0a 100%)',
            lore: `<p>A grimoire containing the true names of seven archdemons. Reading aloud opens a door that cannot be closed.</p>
                   <p><em>The last person to read from it is still reading.</em></p>
                   <p>Bound in what appears to be human skin — testing inconclusive — the Codex is written in a language that predates human speech. Scholars who have studied it report that the text rearranges itself when unobserved.</p>`,
            attributes: [
                { label: 'Origin', value: 'Unknown, pre-human' },
                { label: 'Binding', value: 'Organic (inconclusive)' },
                { label: 'Curse Level', value: 'Apocalyptic' },
                { label: 'Demons Named', value: '7 Archdemons' },
                { label: 'Power', value: 'Planar Breach' },
                { label: 'Containment', value: 'Sealed chamber, silence ward' }
            ]
        },
        ring: {
            title: 'The Ring of Unseeing',
            category: 'Enchanted Jewelry',
            rarity: 'rare',
            imageBg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2d 50%, #0a0a1a 100%)',
            lore: `<p>When worn, the bearer becomes invisible to all living things. Unfortunately, the dead can see you perfectly — and they find you fascinating.</p>
                   <p><em>It is not solitude you will find in this ring, but the attention of things that should not notice you.</em></p>
                   <p>Crafted from star-metal and set with a stone that was never part of this world, the Ring grants perfect invisibility to the living. But the dead... the dead gather. They watch. They follow. And they remember what it was to be alive.</p>`,
            attributes: [
                { label: 'Origin', value: 'Star-metal forge' },
                { label: 'Gem', value: 'Extraterrestrial' },
                { label: 'Curse Level', value: 'Mild to Moderate' },
                { label: 'Spirit Attention', value: 'High' },
                { label: 'Power', value: 'Invisibility to the Living' },
                { label: 'Containment', value: 'Velvet pouch' }
            ]
        },
        orb: {
            title: 'The Verdant Eye',
            category: 'Divination Orbs',
            rarity: 'cursed',
            imageBg: 'linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 50%, #0a0a0a 100%)',
            lore: `<p>A scrying orb grown, not crafted, from the petrified heart of an ancient forest spirit. It shows the future — but only the terrible parts.</p>
                   <p><em>It has never shown a happy ending.</em></p>
                   <p>The Verdant Eye pulses faintly, like a heartbeat. When touched, it shows visions of disaster: wars yet to come, plagues yet to spread, the slow death of everything you love. It has driven every previous owner to madness or despair.</p>`,
            attributes: [
                { label: 'Origin', value: 'Ancient Forest, Heartwood' },
                { label: 'Nature', value: 'Grown, not made' },
                { label: 'Curse Level', value: 'Psychological' },
                { label: 'Vision Type', value: 'Catastrophic Only' },
                { label: 'Power', value: 'Precognition (Negative)' },
                { label: 'Containment', value: 'Earth burial, monthly' }
            ]
        },
        mask: {
            title: "The Mourner's Visage",
            category: 'Cursed Artifacts',
            rarity: 'epic',
            imageBg: 'linear-gradient(200deg, #1a0a1a 0%, #2a1a2a 50%, #0a0a1a 100%)',
            lore: `<p>This porcelain mask weeps blood when worn. It belonged to the last priestess of the Weeping Temple. She never took it off — even in death.</p>
                   <p><em>The tears are not metaphorical.</em></p>
                   <p>Crafted from the finest porcelain by artisans who went blind upon completing it, the Mourner's Visage channels the grief of a thousand funerals. Those who wear it experience the sorrow of every death that has ever occurred, simultaneously.</p>`,
            attributes: [
                { label: 'Origin', value: 'Weeping Temple' },
                { label: 'Material', value: 'Blind-crafted porcelain' },
                { label: 'Curse Level', value: 'Severe' },
                { label: 'Emotional Load', value: 'Infinite grief' },
                { label: 'Power', value: 'Empathic Overload' },
                { label: 'Containment', value: 'Silk wrapping, no mirrors' }
            ]
        },
        key: {
            title: 'The Skeleton Key of Ygg',
            category: 'Keys & Locks',
            rarity: 'mythic',
            imageBg: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            lore: `<p>Opens any lock — physical, magical, or metaphysical. Including the locks on doors that should remain closed. <em>Especially those.</em></p>
                   <p><em>The key has a will of its own, and it prefers doors that were sealed for good reason.</em></p>
                   <p>Forged in the depths of Ygg, the underworld prison, this key can open anything: a simple door, a sealed vault, a bound demon's cage, the gates between worlds. It hums with anticipation when near anything locked, and grows warm when near things that should stay sealed.</p>`,
            attributes: [
                { label: 'Origin', value: 'Ygg, the Underworld Prison' },
                { label: 'Material', value: 'Underworld iron' },
                { label: 'Curse Level', value: 'Autonomous' },
                { label: 'Key Sentience', value: 'High' },
                { label: 'Power', value: 'Universal Unlocking' },
                { label: 'Containment', value: 'Sealed in wax, buried' }
            ]
        },
        chalice: {
            title: 'The Crimson Chalice',
            category: 'Ritual Objects',
            rarity: 'legendary',
            imageBg: 'linear-gradient(170deg, #1a0a0a 0%, #2a1a0a 50%, #0a0a0a 100%)',
            lore: `<p>Any liquid poured into this chalice becomes a potent elixir of vitality. The catch: the chalice refills only with the blood of the one who drinks from it.</p>
                   <p><em>Immortality at the cost of an eternal tithe.</em></p>
                   <p>The Crimson Chalice was the centerpiece of the Blood Court, a cabal of immortals who sustained themselves through an endless cycle of self-harm and renewal. Each sip grants a decade of perfect health, but demands a pint of blood in return within the lunar cycle. Fail to pay, and the chalice takes what it is owed.</p>`,
            attributes: [
                { label: 'Origin', value: 'The Blood Court' },
                { label: 'Material', value: 'Unknown alloy' },
                { label: 'Curse Level', value: 'Parasitic' },
                { label: 'Vitality Grant', value: '10 years per sip' },
                { label: 'Power', value: 'Elixir Transformation' },
                { label: 'Containment', value: 'Empty, inverted' }
            ]
        }
    };

    // --- Spectral Bidders Data ---
    const spectralBidders = [
        { name: 'Lord Malachar the Undying', symbol: '👑', item: 'The Crown of Whispers', amount: 6660, time: '2m ago' },
        { name: 'The Widow of House Vex', symbol: '🕷️', item: 'Vorpalis, the Hungering Edge', amount: 12400, time: '5m ago' },
        { name: 'Sister Mercy of the Hollow', symbol: '⚰️', item: 'The Mirror of Elsewhen', amount: 8900, time: '12m ago' },
        { name: 'The Nameless One', symbol: '👁️', item: 'Codex of the Ninth Gate', amount: 3330, time: '18m ago' },
        { name: 'Baron Ashford, Deceased', symbol: '💀', item: 'The Ring of Unseeing', amount: 5100, time: '23m ago' },
        { name: 'The Green Walker', symbol: '🌿', item: 'The Verdant Eye', amount: 7777, time: '31m ago' },
        { name: 'Mother of Weeping', symbol: '😢', item: "The Mourner's Visage", amount: 4200, time: '45m ago' },
        { name: 'The Gatekeeper', symbol: '🗝️', item: 'The Skeleton Key of Ygg', amount: 15000, time: '1h ago' },
        { name: 'The Blood Count', symbol: '🩸', item: 'The Crimson Chalice', amount: 9999, time: '1h ago' },
        { name: 'The Hollow Knight', symbol: '⚔️', item: 'Vorpalis, the Hungering Edge', amount: 12100, time: '1h ago' },
        { name: 'Oracle of the Deep', symbol: '🔮', item: 'The Mirror of Elsewhen', amount: 8500, time: '2h ago' },
        { name: 'The Forgotten King', symbol: '👻', item: 'The Crown of Whispers', amount: 6200, time: '2h ago' }
    ];

    // --- Countdown Timers ---
    function initTimers() {
        const timers = document.querySelectorAll('.item-timer, .card-timer');
        
        timers.forEach(timerEl => {
            const timerKey = timerEl.dataset.timer;
            const timeData = CONFIG.timers[timerKey];
            
            if (!timeData) return;
            
            let totalSeconds = timeData.hours * 3600 + timeData.minutes * 60 + timeData.seconds;
            
            function updateTimer() {
                if (totalSeconds <= 0) {
                    timerEl.classList.add('expired');
                    const nums = timerEl.querySelectorAll('.timer-num');
                    nums.forEach(num => num.textContent = '00');
                    return;
                }
                
                totalSeconds--;
                
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                const hourNums = timerEl.querySelectorAll('.timer-num[data-unit="hours"]');
                const minNums = timerEl.querySelectorAll('.timer-num[data-unit="minutes"]');
                const secNums = timerEl.querySelectorAll('.timer-num[data-unit="seconds"]');
                
                hourNums.forEach(el => el.textContent = padZero(hours));
                minNums.forEach(el => el.textContent = padZero(minutes));
                secNums.forEach(el => el.textContent = padZero(seconds));
                
                // Add urgency effect when under 5 minutes
                if (totalSeconds < 300) {
                    timerEl.classList.add('urgent');
                }
            }
            
            setInterval(updateTimer, 1000);
        });
    }

    // --- Blood Drip Effect ---
    function createBloodDrip() {
        if (!elements.bloodDrips) return;
        
        const drip = document.createElement('div');
        drip.className = 'blood-drip';
        
        const leftPos = randomFloat(5, 95);
        const height = randomFloat(50, 200);
        const duration = randomFloat(2, 5);
        const delay = randomFloat(0, 2);
        
        drip.style.left = `${leftPos}%`;
        drip.style.setProperty('--drip-height', `${height}px`);
        drip.style.animationDuration = `${duration}s`;
        drip.style.animationDelay = `${delay}s`;
        drip.style.opacity = randomFloat(0.3, 0.7);
        
        elements.bloodDrips.appendChild(drip);
        
        setTimeout(() => {
            if (drip.parentNode) {
                drip.parentNode.removeChild(drip);
            }
        }, (duration + delay) * 1000);
    }

    function initBloodDrips() {
        // Initial drips
        for (let i = 0; i < 3; i++) {
            setTimeout(createBloodDrip, i * 1000);
        }
        
        // Ongoing drips
        setInterval(createBloodDrip, CONFIG.bloodDripInterval);
    }

    // --- Spectral Bidders ---
    function renderBidders() {
        if (!elements.biddersList) return;
        
        elements.biddersList.innerHTML = '';
        
        spectralBidders.forEach((bidder, index) => {
            const entry = document.createElement('div');
            entry.className = 'bidder-entry';
            entry.style.animationDelay = `${index * 0.1}s`;
            
            entry.innerHTML = `
                <div class="bidder-avatar">${bidder.symbol}</div>
                <div class="bidder-info">
                    <div class="bidder-name">${bidder.name}</div>
                    <div class="bidder-item">bid on ${bidder.item}</div>
                </div>
                <div>
                    <div class="bidder-amount">${bidder.amount.toLocaleString()} SC</div>
                    <div class="bidder-time">${bidder.time}</div>
                </div>
            `;
            
            // Whispering effect on hover
            entry.addEventListener('mouseenter', () => {
                entry.style.transform = 'translateX(4px)';
                entry.style.transition = 'transform 0.3s ease';
            });
            
            entry.addEventListener('mouseleave', () => {
                entry.style.transform = 'translateX(0)';
            });
            
            elements.biddersList.appendChild(entry);
        });
    }

    function initSpectralBidders() {
        renderBidders();
        
        // Periodically update bidder list with new entries
        setInterval(() => {
            // Add a new random bid
            const items = Object.keys(itemData);
            const randomItem = items[randomInt(0, items.length - 1)];
            const bidderNames = [
                'The Shadow Broker', 'Lady Ashworth', 'The Drowned Priest',
                'Count Morvain', 'The Bone Collector', 'Sister Silence',
                'The Pale Horseman', 'Widow Blackwood', 'The Crypt Keeper'
            ];
            const symbols = ['🌑', '🦇', '⚗️', '🕯️', '📜', '🗡️', '💎', '🌙', '🔥'];
            
            const newBidder = {
                name: bidderNames[randomInt(0, bidderNames.length - 1)],
                symbol: symbols[randomInt(0, symbols.length - 1)],
                item: itemData[randomItem].title,
                amount: randomInt(1000, 20000),
                time: 'Just now'
            };
            
            spectralBidders.unshift(newBidder);
            if (spectralBidders.length > 15) {
                spectralBidders.pop();
            }
            
            renderBidders();
        }, CONFIG.bidderRefreshInterval);
    }

    // --- Modal System ---
    function openModal(modal) {
        if (!modal) return;
        state.isModalOpen = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        state.isModalOpen = false;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initModals() {
        // Close buttons
        [elements.loreModalClose, elements.bidModalClose].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    closeModal(btn.closest('.modal-overlay'));
                });
            }
        });
        
        // Close on overlay click
        [elements.loreModal, elements.warningModal, elements.bidModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            }
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isModalOpen) {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    // --- Lore Modal ---
    function openLoreModal(itemId) {
        const data = itemData[itemId];
        if (!data) return;
        
        // Set image background
        elements.loreModalImage.style.background = data.imageBg;
        elements.loreModalImage.innerHTML = '';
        
        // Copy the SVG from the card
        const originalArt = document.querySelector(`[data-item="${itemId}"] .artifact-svg`);
        if (originalArt) {
            const clone = originalArt.cloneNode(true);
            clone.style.width = '50%';
            clone.style.maxWidth = '200px';
            clone.style.animation = 'artifactFloat 6s ease-in-out infinite';
            elements.loreModalImage.appendChild(clone);
        }
        
        // Set meta
        elements.loreModalMeta.innerHTML = `
            <span class="item-category">${data.category}</span>
            <span class="item-rarity rarity-${data.rarity}">${data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)}</span>
        `;
        
        // Set title
        elements.loreModalTitle.textContent = data.title;
        
        // Set lore
        elements.loreModalLore.innerHTML = data.lore;
        
        // Set attributes
        elements.loreModalAttributes.innerHTML = data.attributes.map(attr => `
            <div class="attribute">
                <span class="attribute-label">${attr.label}</span>
                <span class="attribute-value">${attr.value}</span>
            </div>
        `).join('');
        
        // Generate bid history
        const bidHistory = generateBidHistory(itemId);
        elements.bidHistoryList.innerHTML = bidHistory.map(bid => `
            <div class="bid-history-entry">
                <span class="bid-history-bidder">${bid.bidder}</span>
                <span class="bid-history-amount">${bid.amount.toLocaleString()} SC</span>
                <span class="bid-history-time">${bid.time}</span>
            </div>
        `).join('');
        
        openModal(elements.loreModal);
    }

    function generateBidHistory(itemId) {
        const baseBid = parseInt(elements.bidAmount?.value) || randomInt(3000, 15000);
        const bidders = [
            'Lord Malachar', 'The Widow Vex', 'Sister Mercy',
            'Baron Ashford', 'The Nameless One', 'The Green Walker',
            'Mother of Weeping', 'The Gatekeeper'
        ];
        
        const history = [];
        let currentBid = baseBid - randomInt(500, 2000);
        
        for (let i = 0; i < 6; i++) {
            currentBid += randomInt(100, 500);
            history.push({
                bidder: bidders[randomInt(0, bidders.length - 1)],
                amount: currentBid,
                time: `${randomInt(1, 60)}m ago`
            });
        }
        
        return history.reverse();
    }

    // --- Warning Modal ---
    function openWarningModal(itemId, callback) {
        state.activeBidItem = itemId;
        elements.warningMessage.textContent = `This item carries a curse. By placing a bid on "${itemData[itemId]?.title || 'this artifact'}", you acknowledge that you understand the risks and accept full responsibility for any supernatural consequences, including but not limited to: possession, temporal displacement, soul fragmentation, or eternal damnation.`;
        
        // Reset seal animation
        elements.warningSeal.classList.remove('broken');
        
        // Handle seal click
        const sealClickHandler = () => {
            elements.warningSeal.classList.add('broken');
            setTimeout(() => {
                elements.warningAccept.style.opacity = '1';
                elements.warningAccept.style.transform = 'translateY(0)';
            }, 500);
        };
        
        elements.warningSeal.addEventListener('click', sealClickHandler, { once: true });
        
        // Handle accept
        const acceptHandler = () => {
            state.cursedAcknowledged[itemId] = true;
            closeModal(elements.warningModal);
            elements.warningSeal.removeEventListener('click', sealClickHandler);
            elements.warningAccept.removeEventListener('click', acceptHandler);
            elements.warningRetreat.removeEventListener('click', retreatHandler);
            
            // Reset for next time
            elements.warningAccept.style.opacity = '0';
            elements.warningAccept.style.transform = 'translateY(10px)';
            
            if (callback) callback();
        };
        
        // Handle retreat
        const retreatHandler = () => {
            closeModal(elements.warningModal);
            elements.warningSeal.removeEventListener('click', sealClickHandler);
            elements.warningAccept.removeEventListener('click', acceptHandler);
            elements.warningRetreat.removeEventListener('click', retreatHandler);
            elements.warningAccept.style.opacity = '0';
            elements.warningAccept.style.transform = 'translateY(10px)';
            showToast('Wisdom Prevails', 'You have chosen to step back from the abyss. For now.');
        };
        
        elements.warningAccept.addEventListener('click', acceptHandler, { once: true });
        elements.warningRetreat.addEventListener('click', retreatHandler, { once: true });
        
        openModal(elements.warningModal);
    }

    // --- Bid Modal ---
    function openBidModal(itemId) {
        state.activeBidItem = itemId;
        
        // Reset form
        elements.bidAmount.value = '';
        elements.bidderName.value = '';
        elements.bidNote.value = '';
        
        openModal(elements.bidModal);
    }

    function submitBid() {
        const itemId = state.activeBidItem;
        const amount = parseInt(elements.bidAmount.value);
        const name = elements.bidderName.value.trim() || 'Anonymous Soul';
        const note = elements.bidNote.value.trim();
        
        if (!amount || amount <= 0) {
            showToast('Invalid Bid', 'The void does not accept empty offers.');
            return;
        }
        
        // Update bid display
        const bidElements = document.querySelectorAll(`[data-bid="${itemId}"]`);
        bidElements.forEach(el => {
            el.innerHTML = `${amount.toLocaleString()} <span class="currency">SC</span>`;
            el.style.animation = 'bidFlash 0.5s ease-out';
            setTimeout(() => {
                el.style.animation = '';
            }, 500);
        });
        
        // Store bid
        state.bids[itemId] = {
            amount,
            bidder: name,
            time: new Date().toISOString(),
            note
        };
        
        // Update bid count
        const bidCountEl = document.querySelector(`[data-item="${itemId}"] .bid-count`);
        if (bidCountEl) {
            const currentCount = parseInt(bidCountEl.textContent) || 0;
            bidCountEl.textContent = `${currentCount + 1} bids`;
        }
        
        closeModal(elements.bidModal);
        showToast('Bid Sealed', `Your offering of ${amount.toLocaleString()} SC has been recorded. ${name}, the auctioneer notes your commitment.`);
        
        // Create blood drip effect for dramatic effect
        for (let i = 0; i < 5; i++) {
            setTimeout(createBloodDrip, i * 200);
        }
    }

    // --- Toast Notifications ---
    function showToast(title, message) {
        elements.toastTitle.textContent = title;
        elements.toastMessage.textContent = message;
        elements.bidToast.classList.add('visible');
        
        // Reset progress animation
        const progress = elements.bidToast.querySelector('.toast-progress');
        if (progress) {
            progress.style.animation = 'none';
            progress.offsetHeight; // Trigger reflow
            progress.style.animation = `toastProgress ${CONFIG.toastDuration}ms linear forwards`;
        }
        
        setTimeout(() => {
            elements.bidToast.classList.remove('visible');
        }, CONFIG.toastDuration);
    }

    // --- Scroll Effects ---
    function initScrollEffects() {
        // Header scroll effect
        const handleScroll = debounce(() => {
            if (window.scrollY > 100) {
                elements.header?.classList.add('scrolled');
            } else {
                elements.header?.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Reveal animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('.section, .featured-item, .auction-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    // --- Bid Button Handlers ---
    function initBidButtons() {
        document.querySelectorAll('.btn-bid').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = btn.dataset.item;
                const isCursed = btn.dataset.cursed === 'true';
                
                if (isCursed && !state.cursedAcknowledged[itemId]) {
                    openWarningModal(itemId, () => {
                        openBidModal(itemId);
                    });
                } else {
                    openBidModal(itemId);
                }
            });
        });
        
        // Lore buttons
        document.querySelectorAll('.btn-lore').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = btn.dataset.item;
                openLoreModal(itemId);
            });
        });
        
        // Submit bid
        elements.submitBid?.addEventListener('click', submitBid);
    }

    // --- Whispering Hover Effect ---
    function initWhisperingEffect() {
        const whisperTexts = [
            'Do you hear them?',
            'They know you\'re here.',
            'The price is never just coin.',
            'Some doors should stay closed.',
            'It watches you.',
            'You shouldn\'t have come.',
            'The dead remember.',
            'Turn back while you can.'
        ];
        
        document.querySelectorAll('.item-lore, .card-lore-brief').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const whisper = whisperTexts[randomInt(0, whisperTexts.length - 1)];
                el.style.fontStyle = 'italic';
                el.style.color = 'var(--color-blood-light)';
                el.style.transition = 'color 0.5s ease';
                
                // Create whisper element
                const whisperEl = document.createElement('span');
                whisperEl.className = 'whisper-text';
                whisperEl.textContent = whisper;
                whisperEl.style.cssText = `
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-family: var(--font-body);
                    font-size: 0.7rem;
                    color: var(--color-text-dim);
                    font-style: italic;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                `;
                
                el.style.position = 'relative';
                el.appendChild(whisperEl);
                
                setTimeout(() => {
                    whisperEl.style.opacity = '0.6';
                }, 100);
                
                setTimeout(() => {
                    whisperEl.style.opacity = '0';
                    setTimeout(() => {
                        if (whisperEl.parentNode) {
                            whisperEl.parentNode.removeChild(whisperEl);
                        }
                    }, 500);
                }, 2000);
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.fontStyle = '';
                el.style.color = '';
            });
        });
    }

    // --- Cursed Seal Interactions ---
    function initCursedSeals() {
        document.querySelectorAll('.cursed-seal').forEach(seal => {
            seal.addEventListener('click', () => {
                seal.classList.add('broken');
                
                // Play a subtle sound effect (visual only in this case)
                seal.style.filter = 'brightness(2)';
                setTimeout(() => {
                    seal.style.filter = '';
                }, 300);
                
                showToast('Seal Broken', 'The warning has been acknowledged. Proceed with caution.');
            });
        });
    }

    // --- Flickering Candle Effect ---
    function initCandleEffects() {
        document.querySelectorAll('.candle').forEach((candle, index) => {
            const flame = candle.querySelector('.flame');
            if (!flame) return;
            
            // Randomize flame animation for each candle
            const duration = randomFloat(0.3, 0.7);
            const delay = randomFloat(0, 1);
            flame.style.animationDuration = `${duration}s`;
            flame.style.animationDelay = `${delay}s`;
        });
    }

    // --- Blood Flash Animation ---
    function addBidFlashAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bidFlash {
                0% { color: var(--color-gold); text-shadow: 0 0 20px rgba(212, 168, 67, 0.8); }
                50% { color: var(--color-blood-bright); text-shadow: 0 0 30px rgba(196, 30, 30, 0.8); }
                100% { color: var(--color-gold); text-shadow: none; }
            }
            
            .urgent .timer-num {
                color: var(--color-blood-bright) !important;
                animation: urgentPulse 1s ease-in-out infinite;
            }
            
            @keyframes urgentPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .section.revealed,
            .featured-item.revealed,
            .auction-card.revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .warning-seal-container .btn-accept {
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // --- Smooth Scroll for Navigation ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --- Parallax Effect for Hero ---
    function initParallax() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallax = scrolled * 0.3;
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${parallax}px)`;
                    heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
                }
            }
        }, { passive: true });
    }

    // --- Initialize Everything ---
    function init() {
        // Add CSS animations
        addBidFlashAnimation();
        
        // Initialize all systems
        initTimers();
        initBloodDrips();
        initSpectralBidders();
        initModals();
        initBidButtons();
        initWhisperingEffect();
        initCursedSeals();
        initCandleEffects();
        initScrollEffects();
        initSmoothScroll();
        initParallax();
        
        console.log('%c⚠ The Obsidian Auction ⚠', 'color: #8B0000; font-size: 20px; font-weight: bold;');
        console.log('%cYou have entered a place of forbidden things. Tread carefully.', 'color: #D4A843; font-style: italic;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();