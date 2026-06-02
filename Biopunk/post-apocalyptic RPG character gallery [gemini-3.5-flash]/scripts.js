document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. CHARACTER DATABASE & PORTRAITS MAPPING
    // -------------------------------------------------------------
    const characterData = {
        "VECTOR-09": {
            codename: '"SPORESINGER"',
            faction: "MYCO-SYMBIOTE",
            genotype: "M-102 RECOMBINANT FUNGAL",
            threat: "HIGH_THREAT (BIOLOGICAL HAZARD)",
            bio: "Subject shows extreme biological synthesis with subterranean fungal spores. Epidermal tissue replaced by bioluminescent mycelium. Exhibits conscious control over localized spore clouds. Extreme hazard to un-shielded organic entities. Do not engage without bio-hazard filtration unit active.",
            colorClass: "badge-myco",
            symbol: "☣"
        },
        "SLEDGE": {
            codename: '"RUST-BREAKER"',
            faction: "RUST-SPLICER",
            genotype: "CYBERNETIC_HEAVY_SPLICER",
            threat: "MODERATE (HIGH PHYSICAL DAMAGE)",
            bio: "Former miner rebuilt with heavy scrap-salvage prosthetics. Upper torso fused directly with pneumatic excavation machinery. Neural interface powered by contaminated bio-fuel cells. Displays high cognitive resistance but suffers from systemic oil-rot contamination.",
            colorClass: "badge-rust",
            symbol: "⚙"
        },
        "XEN-7": {
            codename: '"GLOW-STALKER"',
            faction: "GLOW-CULTIST",
            genotype: "RAD-ADAPTED CHIMERIC X-1",
            threat: "LETHAL (HIGH-DOSAGE RADIATION)",
            bio: "Subject is in advanced state of nuclear mutation. Emits high levels of gamma radiation constantly. Cellular matrix is self-illuminating. Capable of bending light paths slightly around body. Direct physical contact causes immediate cell destruction in normal tissue.",
            colorClass: "badge-glow",
            symbol: "☢"
        },
        "DR. THORNE": {
            codename: '"THE PURIST"',
            faction: "PURE-BLOOD COALITION",
            genotype: "UNALTERED GENOME V.1.0",
            threat: "TACTICAL THREAT (MED-EQUIPPED)",
            bio: "Commanding officer of the Pure-Blood surgical division. Carries zero traces of environmental mutation. Heavily armed with automated chemical cleansing systems and micro-dosing bio-barriers. Dedicated to the eradication of all bio-altered genetic lines.",
            colorClass: "badge-pure",
            symbol: "✙"
        },
        "MYCOR-V": {
            codename: '"HYPHAE MAGE"',
            faction: "MYCO-SYMBIOTE",
            genotype: "M-409 COGNITIVE HYPHAE",
            threat: "CRITICAL (NEURAL SPORE CONTROL)",
            bio: "Central conduit unit of the underground spore web. Capable of injecting microscopic spore tendrils directly into the neural pathways of host organisms. Can override motor functions of target organisms within a 15-meter radius.",
            colorClass: "badge-myco",
            symbol: "☣"
        },
        "CYBER-SCRAP": {
            codename: '"PLAGUE MECHANIC"',
            faction: "RUST-SPLICER",
            genotype: "S-88 NANO-INFESTED",
            threat: "ELEVATED (BIO-MECHANICAL PLAGUE)",
            bio: "A scav-engineer who uses radioactive micro-welding techniques. Carries an active payload of bio-mechanical nanites that attack both metallic structures and flesh. Capable of building rudimentary automated defenses out of battlefield waste.",
            colorClass: "badge-rust",
            symbol: "⚙"
        }
    };

    // -------------------------------------------------------------
    // 2. LIVE CLOCK SYSTEM (FUTURISTIC / RETRO TIMELINE)
    // -------------------------------------------------------------
    function updateClock() {
        const clockElement = document.getElementById('live-clock');
        if (!clockElement) return;
        
        const now = new Date();
        const year = (now.getFullYear() + 200).toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockElement.textContent = `MUT-DATE: ${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`;
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // -------------------------------------------------------------
    // 3. SYSTEM LOG SIMULATOR (IMMERSIVE CONSOLE)
    // -------------------------------------------------------------
    const logBox = document.getElementById('log-box');
    const systemAlerts = [
        "Sensing mutation spike in Sector-7...",
        "Bio-scrubbers operating at 34% efficiency.",
        "Warning: Mycelium root network spreading near database mainframe.",
        "Pure-Blood surgical drone spotted in Grid-Delta.",
        "Scanners detecting high concentrations of mutagenic sludge.",
        "Rust-Splicer radio chatter intercepted: 'Sledge' is active.",
        "Glow-cultist prayer frequencies detected.",
        "Warning: Genotype database integrity compromised."
    ];

    function appendSystemLog() {
        if (!logBox) return;
        const randomAlert = systemAlerts[Math.floor(Math.random() * systemAlerts.length)];
        const p = document.createElement('p');
        p.textContent = `> ${randomAlert}`;
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight;

        // Keep log buffer to max 10 lines to prevent memory bloating
        if (logBox.children.length > 10) {
            logBox.removeChild(logBox.firstChild);
        }
    }

    setInterval(appendSystemLog, 6000);

    // -------------------------------------------------------------
    // 4. FILTERING & SORTING ENGINE
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const galleryGrid = document.getElementById('gallery-grid');
    const cards = Array.from(document.querySelectorAll('.char-card'));

    function filterAndSort() {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFaction = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        const sortValue = sortSelect ? sortSelect.value : 'default';

        // Filter Phase
        cards.forEach(card => {
            const cardFaction = card.getAttribute('data-faction');
            if (currentFaction === 'all' || cardFaction === currentFaction) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort Phase
        let sortedCards = [...cards];
        if (sortValue === 'mut-high') {
            sortedCards.sort((a, b) => {
                return parseInt(b.getAttribute('data-mutation')) - parseInt(a.getAttribute('data-mutation'));
            });
        } else if (sortValue === 'mut-low') {
            sortedCards.sort((a, b) => {
                return parseInt(a.getAttribute('data-mutation')) - parseInt(b.getAttribute('data-mutation'));
            });
        }

        // Re-append elements in sorted order
        sortedCards.forEach(card => {
            galleryGrid.appendChild(card);
        });
    }

    // Faction Filter Click Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSort();
        });
    });

    // Sort Dropdown Change Listener
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndSort);
    }

    // -------------------------------------------------------------
    // 5. DOSSIER MODAL INTERACTIVE CONTROLS
    // -------------------------------------------------------------
    const modal = document.getElementById('dossier-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const inspectButtons = document.querySelectorAll('.inspect-btn');
    const diagnosticBtn = document.getElementById('run-diagnostic-trigger');
    const diagnosticOutput = document.getElementById('diagnostic-output');
    const dnaBars = document.querySelectorAll('.dna-bar');

    // Modal DOM Target Elements
    const mPortrait = document.getElementById('modal-portrait-placeholder');
    const mName = document.getElementById('modal-char-name');
    const mCodename = document.getElementById('modal-char-codename');
    const mBio = document.getElementById('modal-bio-text');
    const mFaction = document.getElementById('modal-faction');
    const mGenotype = document.getElementById('modal-genotype');
    const mThreat = document.getElementById('modal-threat');

    function openDossier(charName) {
        const data = characterData[charName];
        if (!data) return;

        // Reset any leftover diagnostics simulations
        if (diagnosticOutput) {
            diagnosticOutput.textContent = "> System ready. Awaiting DNA sequence command...";
            diagnosticOutput.style.color = 'var(--text-dim)';
        }

        // Apply visual data
        mName.textContent = charName;
        mCodename.textContent = data.codename;
        mBio.textContent = data.bio;
        mFaction.textContent = data.faction;
        mGenotype.textContent = data.genotype;
        mThreat.textContent = data.threat;

        // Adjust portrait colors and faction matching
        mPortrait.className = "modal-portrait"; // Reset classes
        mPortrait.innerHTML = `
            <div class="bio-hazard-symbol">${data.symbol}</div>
            <div class="static-noise"></div>
        `;

        if (data.faction.includes("MYCO")) {
            mPortrait.classList.add("myco-portrait");
            mFaction.style.color = "var(--color-myco)";
            mThreat.style.color = "var(--color-myco)";
        } else if (data.faction.includes("RUST")) {
            mPortrait.classList.add("rust-portrait");
            mFaction.style.color = "var(--color-rust)";
            mThreat.style.color = "var(--color-rust)";
        } else if (data.faction.includes("GLOW")) {
            mPortrait.classList.add("glow-portrait");
            mFaction.style.color = "var(--color-glow)";
            mThreat.style.color = "var(--color-glow)";
        } else if (data.faction.includes("PURE")) {
            mPortrait.classList.add("pure-portrait");
            mFaction.style.color = "var(--color-pure)";
            mThreat.style.color = "var(--color-pure)";
        }

        // Display Modal
        modal.style.display = "flex";
    }

    // Assign Open Events
    inspectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.char-card');
            const name = card.querySelector('.char-name').textContent;
            openDossier(name);
        });
    });

    // Close Event
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    // Close when clicking outside content area
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // -------------------------------------------------------------
    // 6. GENOME DIAGNOSTIC SEQUENCE SIMULATOR
    // -------------------------------------------------------------
    if (diagnosticBtn) {
        diagnosticBtn.addEventListener('click', () => {
            diagnosticOutput.textContent = "> INITIALIZING SEQUENCING SEQUENCE...";
            diagnosticOutput.style.color = "var(--text-glowing)";
            
            let progress = 0;
            const sequenceInterval = setInterval(() => {
                // Jittering the DNA bars to simulate intensive processing
                dnaBars.forEach(bar => {
                    const randomHeight = Math.floor(Math.random() * 85) + 15;
                    bar.style.height = `${randomHeight}%`;
                });

                progress += 20;
                diagnosticOutput.textContent = `> READING GENOME STRANDS... ${progress}%`;

                if (progress >= 100) {
                    clearInterval(sequenceInterval);
                    finalizeDiagnostic();
                }
            }, 300);
        });
    }

    function finalizeDiagnostic() {
        const diagnosticOutcomes = [
            "MUTATION PROFILE DETECTED: UNSTABLE SPLICING. SUGGEST CONFINEMENT.",
            "GENE ALIGNMENT CRITICAL. CYBER-PLAGUE NANITES EXPANDING.",
            "DNA ENCODING COMPLETED: PURE HUMAN BASELINE RECORDED. NO ACTION REQUIRED.",
            "GAMMA RADIANCE DETECTED IN CELL NUCLEUS. HAZARD WARNING LEVEL 5.",
            "MYCELIUM CHAINS INTEGRATED. INTEGRATION FACTOR: OVER 80%."
        ];
        
        const randomOutcome = diagnosticOutcomes[Math.floor(Math.random() * diagnosticOutcomes.length)];
        diagnosticOutput.textContent = `> SEQUENCE SUCCESSFUL. \n> RESULT: ${randomOutcome}`;
        diagnosticOutput.style.color = "#39e684";
    }
});