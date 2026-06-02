// ============================================
// The Obsidian Crucible — Interactive Scripts
// ============================================

(function() {

    // --- STATE ---
    let currentBid = 12400;
    let currentBidder = "The Pale Collector";
    let currentBidderIcon = "👁";
    let countdownSeconds = 9933; // 2:45:33
    let sealBroken = false;
    let whisperTimeout = null;
    let whisperTexts = [
        "Do you dare bid on what was never meant to be owned?",
        "The veil already knows your name...",
        "Every relic sold here claims a price beyond gold.",
        "Listen closely... can you hear them whispering?",
        "Once you bid, there is no turning back.",
        "The candles burn shorter with each passing hour.",
        "Something stirs beneath the lot numbers...",
        "Your soul is the true currency here.",
        "The previous owner still haunts this item.",
        "Bid now... before the silence claims you."
    ];

    // --- PARTICLES ---
    function createParticles() {
        const container = document.getElementById("particles");
        if (!container) return;
        container.innerHTML = "";
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDuration = (8 + Math.random() * 15) + "s";
            particle.style.animationDelay = (Math.random() * 10) + "s";
            particle.style.width = (1 + Math.random() * 2) + "px";
            particle.style.height = particle.style.width;
            const colors = ["var(--gold)", "var(--blood)", "var(--spectral)", "var(--venom)"];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(particle);
        }
    }

    // --- COUNTDOWN TIMER ---
    function updateCountdown() {
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (!hoursEl || !minutesEl || !secondsEl) return;

        countdownSeconds--;
        if (countdownSeconds <= 0) countdownSeconds = 0;

        const h = Math.floor(countdownSeconds / 3600);
        const m = Math.floor((countdownSeconds % 3600) / 60);
        const s = countdownSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, "0");
        minutesEl.textContent = String(m).padStart(2, "0");
        secondsEl.textContent = String(s).padStart(2, "0");

        // Flicker intensity increases as time runs low
        if (countdownSeconds < 300) {
            document.querySelectorAll(".flame").forEach(flame => {
                flame.style.animationDuration = "0.3s";
            });
        }

        // Pulse the timer when under 60 seconds
        if (countdownSeconds < 60) {
            const timer = document.getElementById("countdown");
            timer.style.animation = "none";
            timer.offsetHeight; // trigger reflow
            timer.style.animation = "timerPulse 0.5s ease-in-out infinite";
        }
    }

    // --- BID PLACEMENT ---
    function placeBid(increment) {
        if (sealBroken) {
            showWhisper("The seal is broken. No more bids are accepted.");
            return;
        }

        const bidAmount = increment === 0 ? currentBid : currentBid + increment;

        // Update bid
        currentBid = bidAmount;
        document.getElementById("currentBid").querySelector(".amount").textContent =
            currentBid.toLocaleString();

        // Rotate bidder
        const bidders = [
            { name: "The Pale Collector", icon: "👁" },
            { name: "Nightmare Syndicate", icon: "🩸" },
            { name: "Velmara Mortician", icon: "💀" },
            { name: "The Hollow Priest", icon: "🌑" },
            { name: "Web of Black Silk", icon: "🕷" },
            { name: "Chain-Breaker Noctis", icon: "⛓" },
            { name: "Candlewick", icon: "🕯" }
        ];

        const newBidder = bidders[Math.floor(Math.random() * bidders.length)];
        currentBidder = newBidder.name;
        currentBidderIcon = newBidder.icon;

        const bidderEl = document.getElementById("currentBidder");
        bidderEl.querySelector(".bidder-icon").textContent = currentBidderIcon;
        bidderEl.querySelector(".bidder-name").textContent = currentBidder;

        // Blood drip animation
        spawnBloodDrip();

        // Whispers
        showWhisper(getRandomWhisper());

        // Update bid history
        addBidHistoryEntry(currentBidder, currentBidderIcon, currentBid);

        // Button feedback
        const btn = event.target.closest("button");
        if (btn) {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "", 150);
        }
    }

    function getRandomWhisper() {
        return whisperTexts[Math.floor(Math.random() * whisperTexts.length)];
    }

    // --- BLOOD DRIP ANIMATION ---
    function spawnBloodDrip() {
        const container = document.getElementById("bidBlood");
        if (!container) return;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const drop = document.createElement("div");
                drop.classList.add("blood-drop");
                drop.style.left = (10 + Math.random() * 80) + "%";
                drop.style.top = "0";
                drop.style.width = (3 + Math.random() * 4) + "px";
                drop.style.height = drop.style.width;
                drop.style.opacity = (0.6 + Math.random() * 0.4);
                document.body.appendChild(drop);

                setTimeout(() => drop.remove(), 1500);
            }, i * 100);
        }

        // Also spawn from bid amount
        const amountEl = document.getElementById("currentBid").querySelector(".amount");
        amountEl.style.color = "var(--blood-light)";
        amountEl.style.textShadow = "0 0 20px rgba(139, 0, 0, 0.6)";
        setTimeout(() => {
            amountEl.style.color = "";
            amountEl.style.textShadow = "";
        }, 800);
    }

    // --- WHISPER EFFECT ---
    function showWhisper(text) {
        const overlay = document.getElementById("whisperOverlay");
        if (!overlay) return;

        clearTimeout(whisperTimeout);

        overlay.textContent = `"${text}"`;
        overlay.classList.add("visible");

        whisperTimeout = setTimeout(() => {
            overlay.classList.remove("visible");
        }, 4000);
    }

    // --- LORE PANEL TOGGLE ---
    function setupLoreToggle() {
        const toggle = document.getElementById("loreToggle");
        const panel = document.getElementById("lorePanel");

        if (!toggle || !panel) return;

        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active");
            panel.classList.toggle("visible");

            if (panel.classList.contains("visible")) {
                showWhisper("You should not have read that...");
            }
        });
    }

    // --- SEAL BREAKING ---
    function setupSealBreaking() {
        const seal = document.getElementById("mainSeal");

        if (!seal) return;

        seal.addEventListener("click", () => {
            if (sealBroken) return;

            seal.classList.add("broken");

            setTimeout(() => {
                sealBroken = true;
                showWhisper("The seal is broken. The Crucible stirs...");
                spawnSealShards();
            }, 800);
        });
    }

    function spawnSealShards() {
        for (let i = 0; i < 12; i++) {
            const shard = document.createElement("div");
            shard.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: var(--blood);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: shardFly 1s ease-out forwards;
            `;

            const angle = (i / 12) * Math.PI * 2;
            const distance = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            shard.style.setProperty("--tx", tx + "px");
            shard.style.setProperty("--ty", ty + "px");

            document.body.appendChild(shard);
            setTimeout(() => shard.remove(), 1000);
        }

        // Add shard animation dynamically
        if (!document.getElementById("shardStyles")) {
            const style = document.createElement("style");
            style.id = "shardStyles";
            style.textContent = `
                @keyframes shardFly {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
                }
                @keyframes timerPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // --- BID HISTORY ---
    function addBidHistoryEntry(name, icon, amount) {
        const container = document.getElementById("history");
        if (!container) return;

        const entries = container.querySelectorAll(".history-entry");
        if (entries.length >= 7) {
            entries[entries.length - 1].remove();
        }

        const newEntry = document.createElement("div");
        newEntry.classList.add("history-entry");
        newEntry.setAttribute("data-time", "just now");
        newEntry.style.animation = "historyFadeIn 0.6s ease-out backwards";

        const rank = entries.length > 0 ? (entries.length + 1) : 1;
        const rankSuffix = rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";

        newEntry.innerHTML = `
            <div class="history-rank">${rank}${rankSuffix}</div>
            <div class="history-bidder">
                <span class="spectral-icon">${icon}</span>
                <span class="spectral-name">${name}</span>
            </div>
            <div class="history-amount">${amount.toLocaleString()} souls</div>
            <div class="history-arrow">↑</div>
        `;

        container.insertBefore(newEntry, container.firstChild);

        // Update existing entries ranks
        container.querySelectorAll(".history-entry").forEach((entry, i) => {
            const rankEl = entry.querySelector(".history-rank");
            const num = i + 1;
            const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
            rankEl.textContent = num + suffix;
        });
    }

    // --- SPECTRAL BIDDER FADE ---
    function setupSpectralFaders() {
        const cards = document.querySelectorAll(".bidder-card");
        cards.forEach(card => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.style.animationPlayState = "running";
                    } else {
                        card.style.animationPlayState = "paused";
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(card);
        });
    }

    // --- CARD SEAL INSPECTION ---
    function setupCardSeals() {
        const seals = document.querySelectorAll(".card-seal");
        seals.forEach(seal => {
            seal.addEventListener("click", (e) => {
                e.stopPropagation();
                const card = seal.closest(".item-card");
                const name = card.querySelector(".card-name").textContent;

                // Shake effect
                seal.style.animation = "sealShake 0.5s ease";
                setTimeout(() => seal.style.animation = "", 500);

                showWhisper(`"${name}"... even the name carries a weight you cannot fathom.`);
            });
        });
    }

    // --- NAVIGATION ACTIVE STATE ---
    function setupNavigation() {
        const links = document.querySelectorAll(".nav-link");
        links.forEach(link => {
            link.addEventListener("click", () => {
                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            });
        });
    }

    // --- HOVER WHISPER ON BIDDER CARDS ---
    function setupBidderWhispers() {
        const bidderCards = document.querySelectorAll(".bidder-card");
        bidderCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                const title = card.querySelector(".bidder-title").textContent;
                const whispers = [
                    `Do not trust ${title}...`,
                    `${title} has bartered with things best left unknown.`,
                    `I have seen ${title} bid on things that should never be bid upon.`,
                    `Even ${title} fears what lies in the lower lots.`
                ];
                showWhisper(whispers[Math.floor(Math.random() * whispers.length)]);
            });
        });
    }

    // --- AUTO WHISPER CYCLE ---
    function startWhisperCycle() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                showWhisper(getRandomWhisper());
            }
        }, 15000);
    }

    // --- ITEM CARD CLICK ---
    function setupItemCardClicks() {
        const cards = document.querySelectorAll(".item-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const name = card.querySelector(".card-name").textContent;
                const desc = card.querySelector(".card-desc").textContent;

                // Scroll to featured with a dramatic reveal
                const featured = document.getElementById("featured");
                featured.scrollIntoView({ behavior: "smooth" });

                showWhisper(`You reach for ${name}... ${desc}`);
            });
        });
    }

    // --- COUNTDOWN LOW WARNING ---
    function setupLowWarning() {
        setInterval(() => {
            if (countdownSeconds > 0 && countdownSeconds < 60 && countdownSeconds % 10 === 0) {
                document.body.style.animation = "none";
                document.body.offsetHeight;
                document.body.style.boxShadow = "inset 0 0 100px rgba(139, 0, 0, 0.3)";
                setTimeout(() => {
                    document.body.style.boxShadow = "";
                }, 2000);
            }
        }, 1000);
    }

    // --- RANDOM BIDDER ACTIVITY ---
    function simulateBidderActivity() {
        setInterval(() => {
            if (Math.random() < 0.2) {
                const bidders = [
                    { name: "Nightmare Syndicate", icon: "🩸" },
                    { name: "Velmara Mortician", icon: "💀" },
                    { name: "The Hollow Priest", icon: "🌑" },
                    { name: "Web of Black Silk", icon: "🕷" },
                    { name: "Chain-Breaker Noctis", icon: "⛓" },
                    { name: "Candlewick", icon: "🕯" }
                ];
                const bidder = bidders[Math.floor(Math.random() * bidders.length)];
                addBidHistoryEntry(bidder.name, bidder.icon, currentBid - Math.floor(Math.random() * 500 + 100));
                showWhisper(`${bidder.name} has made a move...`);
            }
        }, 20000);
    }

    // --- CURSOR EFFECT ---
    function setupCustomCursor() {
        let cursor = document.createElement("div");
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1px solid var(--blood);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.15s ease, opacity 0.15s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener("mousemove", (e) => {
            cursor.style.left = (e.clientX - 10) + "px";
            cursor.style.top = (e.clientY - 10) + "px";
        });

        document.addEventListener("mousedown", () => {
            cursor.style.transform = "scale(1.5)";
            cursor.style.borderColor = "var(--gold)";
        });

        document.addEventListener("mouseup", () => {
            cursor.style.transform = "scale(1)";
            cursor.style.borderColor = "var(--blood)";
        });
    }

    // --- INIT ---
    function init() {
        createParticles();
        setupLoreToggle();
        setupSealBreaking();
        setupNavigation();
        setupSpectralFaders();
        setupCardSeals();
        setupBidderWhispers();
        setupItemCardClicks();
        setupCustomCursor();
        startWhisperCycle();
        simulateBidderActivity();
        setupLowWarning();

        // Start countdown
        setInterval(updateCountdown, 1000);

        // Initial whisper
        setTimeout(() => {
            showWhisper("Welcome to the Obsidian Crucible. Choose wisely... or not.");
        }, 2000);

        // Add initial history animation delays
        document.querySelectorAll(".history-entry").forEach((entry, i) => {
            entry.style.animationDelay = (0.1 + i * 0.1) + "s";
        });
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();