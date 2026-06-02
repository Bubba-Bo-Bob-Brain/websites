/**
 * THE HERMETIC CONCLAVE OF THE AMBER DAWN
 * Interactive Scripting & Clockwork Automations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE & DATA ---
    const memberRegistry = {
        vance: {
            name: "Lady Genevieve Vance",
            rank: "I. High Archon",
            title: "The Astral Oracle",
            circle: "The Sovereign Crown",
            specialization: "Dream-Weaving & Somnambulism",
            age: "142 Solar Cycles",
            status: "In Astral Transit",
            portraitUrl: "https://picsum.photos/id/64/400/400",
            bio: "First of the inner circle to voluntarily transcend the physical barrier. Genevieve has existed in a suspended somnambulistic sleep since 1881. Her physical form is preserved in an amber-lined glass sarcophagus, while her conscious mind wanders the outer realms of the dream plane, reporting on future alignments and cosmic shifts.",
            relic: "The Obsidian Monocle of Truth",
            lastSeen: "The Dreamscape of Neo-London"
        },
        pendelton: {
            name: "Dr. Arthur Pendelton",
            rank: "III. Grand Alchemist",
            title: "Master of the Crucible",
            circle: "The Crucible of Fire",
            specialization: "Chymical Transmutation & Elixirs",
            age: "68 Solar Cycles",
            status: "Present in Flesh",
            portraitUrl: "https://picsum.photos/id/338/400/400",
            bio: "A brilliant, albeit unstable scholar who was expelled from the Royal Society in 1876 for 'unorthodox experiments into physical transformation.' Pendelton succeeded in synthesizing the Elixir of Amber, which halts cellular decay. He oversees the furnace of the lower chambers where elements are refined to their cosmic forms.",
            relic: "The Philosopher's Crucible",
            lastSeen: "The Steam Chambers, Lower Level"
        },
        sterling: {
            name: "Lord Byron Sterling",
            rank: "II. High Medium",
            title: "The Shadow Speaker",
            circle: "The Eye of Providence",
            specialization: "Chthonic Invocations & Seance",
            age: "Unknown",
            status: "Present in Flesh",
            portraitUrl: "https://picsum.photos/id/342/400/400",
            bio: "Byron claims to be a direct channel for the primordial architects of our reality. His seances are legendary, held only under the dark moon. Witnesses report that when Byron is speaking, the temperature drops drastically and the gaslights within the chamber flare a deep, blood-red crimson.",
            relic: "The Silver Bell of Whispers",
            lastSeen: "The Chthonic Chamber"
        },
        blackwood: {
            name: "Sister Beatrix Blackwood",
            rank: "IV. Archival Scribe",
            title: "The Umbral Librarian",
            circle: "The Whispering Shadow",
            specialization: "Forbidden Grimoires & Runes",
            age: "39 Solar Cycles",
            status: "Lost in the Aether",
            portraitUrl: "https://picsum.photos/id/447/400/400",
            bio: "The sole curator of the Forbidden Library. Beatrix specializes in reading and deciphering manuscripts written in lost languages. She was last seen on the eve of the winter solstice inside the vault, attempting to translate a freshly unearthed tablet. Only her silver fountain pen and a scent of ozone remained.",
            relic: "The Key of Seven Gates",
            lastSeen: "The Void between the Pages"
        },
        faceless: {
            name: "The Faceless Scholar",
            rank: "III. Flesh-Wright",
            title: "The Clockwork Alchemist",
            circle: "The Crucible of Fire",
            specialization: "Biomechanical Automata",
            age: "210 Solar Cycles",
            status: "Artificially Preserved",
            portraitUrl: "https://picsum.photos/id/177/400/400",
            bio: "A legendary figure whose true name has been erased from all earthly registers. His body is a marvel of clockwork gears and pneumatic tubes, sustained by a pressurized amber oil circulation system. He exists purely to build the vessels that will house astral travelers upon their return to our sphere.",
            relic: "The Golden Gear of Perpetual Motion",
            lastSeen: "The Mechanical Forge"
        },
        lestrange: {
            name: "Madame Zoe L'Estrange",
            rank: "II. Somnambulist",
            title: "The Mesmeric Siren",
            circle: "The Eye of Providence",
            specialization: "Animal Magnetism & Trances",
            age: "82 Solar Cycles",
            status: "Present in Flesh",
            portraitUrl: "https://picsum.photos/id/1062/400/400",
            bio: "Zoe possesses an extraordinary talent for alignment and mind control. With a simple motion of her lace-wrapped hand, she can induce complete mesmeric sleep in entire rooms of subjects. Her primary duty is to ensure the silence of local authorities and potential interlopers.",
            relic: "The Amber Talisman of Hypnos",
            lastSeen: "The Salon of Trances"
        }
    };

    let currentGasIntensity = 1.0;

    // --- DOM SELECTIONS ---
    const customCursor = document.getElementById('customCursor');
    const customCursorDot = document.getElementById('customCursorDot');
    
    const waxSeal = document.getElementById('waxSeal');
    const envelope = document.querySelector('.envelope');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const appContainer = document.getElementById('appContainer');

    const valveKnob = document.getElementById('valveKnob');
    const gasStatus = document.getElementById('gasStatus');
    const rootStyle = document.documentElement;

    const digitalClock = document.getElementById('digitalClock');
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');

    const searchInput = document.getElementById('memberSearch');
    const filterButtons = document.querySelectorAll('.nav-btn');
    const memberGrid = document.getElementById('memberGrid');
    const displayedCount = document.getElementById('displayedCount');

    const ledgerModal = document.getElementById('ledgerModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');


    // --- CUSTOM CURSOR ---
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
        customCursorDot.style.left = `${e.clientX}px`;
        customCursorDot.style.top = `${e.clientY}px`;
    });

    const addCursorHover = () => {
        customCursor.style.width = '45px';
        customCursor.style.height = '45px';
        customCursor.style.backgroundColor = 'rgba(255, 157, 35, 0.1)';
        customCursor.style.borderColor = 'var(--gold-pale)';
    };

    const removeCursorHover = () => {
        customCursor.style.width = '30px';
        customCursor.style.height = '30px';
        customCursor.style.backgroundColor = 'transparent';
        customCursor.style.borderColor = 'var(--gold-antique)';
    };

    const registerInteractiveElements = () => {
        const interactives = document.querySelectorAll('button, input, .wax-seal, .nav-btn, .valve-knob');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', addCursorHover);
            el.addEventListener('mouseleave', removeCursorHover);
        });
    };
    registerInteractiveElements();


    // --- ENVELOPE SEED INVITATION MECHANIC ---
    waxSeal.addEventListener('click', () => {
        envelope.classList.add('open');
        
        // Play subtle sound feedback via synthesis
        playEtherealSound(220, 'sine', 0.5);
        setTimeout(() => {
            playEtherealSound(440, 'triangle', 0.8);
        }, 300);

        setTimeout(() => {
            envelopeOverlay.classList.add('fade-out');
            appContainer.classList.remove('hidden');
            
            // Re-run interactive register for elements inside the app
            registerInteractiveElements();
        }, 1800);
    });


    // --- GASLIGHT VALVE ROTATOR & INTENSITY ---
    let isRotating = false;
    let rotationDegrees = 0;

    valveKnob.addEventListener('click', () => {
        rotationDegrees += 90;
        valveKnob.style.transform = `rotate(${rotationDegrees}deg)`;
        
        // Rotate through 4 intensities
        if (currentGasIntensity === 1.0) {
            currentGasIntensity = 0.6;
            gasStatus.textContent = "DIMMED";
            gasStatus.style.color = "var(--burgundy-bright)";
            playEtherealSound(150, 'sine', 0.1);
        } else if (currentGasIntensity === 0.6) {
            currentGasIntensity = 0.2;
            gasStatus.textContent = "FLICKERING";
            gasStatus.style.color = "#3a0505";
            playEtherealSound(100, 'sawtooth', 0.05);
        } else if (currentGasIntensity === 0.2) {
            currentGasIntensity = 0.0;
            gasStatus.textContent = "EXTINGUISHED";
            gasStatus.style.color = "#111";
            playEtherealSound(80, 'sine', 0.01);
        } else {
            currentGasIntensity = 1.0;
            gasStatus.textContent = "LUMINOUS";
            gasStatus.style.color = "var(--amber-gaslight)";
            playEtherealSound(300, 'triangle', 0.2);
        }

        rootStyle.style.setProperty('--gaslight-intensity', currentGasIntensity);
    });


    // --- GRANDFATHER CLOCK ---
    const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

    const updateClock = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Degrees calculation
        const secDeg = (seconds / 60) * 360;
        const minDeg = ((minutes + seconds / 60) / 60) * 360;
        const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

        secondHand.style.transform = `rotate(${secDeg}deg)`;
        minuteHand.style.transform = `rotate(${minDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;

        // Digital display in Roman Numerals (Hour) + standard minutes/seconds
        const romanHour = romanNumerals[hours % 12];
        const formattedMin = minutes.toString().padStart(2, '0');
        const formattedSec = seconds.toString().padStart(2, '0');
        
        digitalClock.textContent = `${romanHour}:${formattedMin}:${formattedSec}`;

        // Tick sound simulation (extremely quiet, retro sound)
        if (appContainer.classList.contains('hidden') === false) {
            playTickSound();
        }
    };

    setInterval(updateClock, 1000);
    updateClock(); // Initialize


    // --- SEARCH & DIRECTORY FILTERS ---
    const cards = document.querySelectorAll('.member-card');

    const filterRegistry = () => {
        const query = searchInput.value.toLowerCase();
        const activeFilterBtn = document.querySelector('.nav-btn.active');
        const targetCircle = activeFilterBtn.getAttribute('data-filter');
        let counter = 0;

        cards.forEach(card => {
            const name = card.querySelector('.member-name').textContent.toLowerCase();
            const spec = card.querySelector('.detail-value').textContent.toLowerCase();
            const rank = card.querySelector('.member-rank').textContent.toLowerCase();
            const cardCircle = card.getAttribute('data-circle');

            const matchesSearch = name.includes(query) || spec.includes(query) || rank.includes(query);
            const matchesFilter = targetCircle === 'all' || cardCircle === targetCircle;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                counter++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        displayedCount.textContent = counter;
    };

    searchInput.addEventListener('input', filterRegistry);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playEtherealSound(180, 'sine', 0.1);
            filterRegistry();
        });
    });


    // --- MODAL INSPECTOR MECHANIC ---
    const showLedger = (memberKey) => {
        const member = memberRegistry[memberKey];
        if (!member) return;

        // Populate details with historic typography
        modalContent.innerHTML = `
            <div class="ledger-header">
                <div class="ledger-seal">🜚</div>
                <h2>${member.name}</h2>
                <p class="ledger-title">${member.rank} • ${member.circle}</p>
            </div>
            <div class="ledger-body">
                <div class="ledger-portrait">
                    <img src="${member.portraitUrl}" alt="${member.name}">
                    <div class="daguerreotype-filter"></div>
                </div>
                <div class="ledger-bio">
                    <h4>The Archival Dossier</h4>
                    <p>${member.bio}</p>
                    
                    <h4>Registry Metadata</h4>
                    <table class="ledger-stats-table">
                        <tr>
                            <td>Current Plane</td>
                            <td>${member.status}</td>
                        </tr>
                        <tr>
                            <td>Aetheric Age</td>
                            <td>${member.age}</td>
                        </tr>
                        <tr>
                            <td>Primary Specialization</td>
                            <td>${member.specialization}</td>
                        </tr>
                        <tr>
                            <td>Bound Relic</td>
                            <td>${member.relic}</td>
                        </tr>
                        <tr>
                            <td>Last Known Alignment</td>
                            <td>${member.lastSeen}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;

        ledgerModal.classList.remove('hidden');
        playEtherealSound(350, 'triangle', 0.25);
    };

    const closeLedger = () => {
        ledgerModal.classList.add('hidden');
    };

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-inspect')) {
            const memberKey = e.target.getAttribute('data-member');
            showLedger(memberKey);
        }
    });

    modalClose.addEventListener('click', closeLedger);
    
    // Close modal when clicking outside container
    ledgerModal.addEventListener('click', (e) => {
        if (e.target === ledgerModal) {
            closeLedger();
        }
    });


    // --- SOUND GENERATORS (Web Audio API) ---
    let audioCtx = null;

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playEtherealSound = (frequency, type, volume) => {
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = type || 'sine';
            osc.frequency.value = frequency;

            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.3);
        } catch (e) {
            // Audio context blocked or unsupported
        }
    };

    const playTickSound = () => {
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(60, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.05);

            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch (e) {
            // Audio context blocked
        }
    };

    // Global listener to initialize Audio Context on first click
    document.addEventListener('click', () => {
        initAudio();
    }, { once: true });

});