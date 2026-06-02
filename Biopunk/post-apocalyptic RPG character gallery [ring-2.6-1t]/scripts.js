// ============================================================
// BIOPUNK CHRONICLES — Character Codex JavaScript
// ============================================================
// Interactive features: filtering, modal detail views,
// scroll-triggered animations, ambient effects, and more.
// ============================================================

(function () {
    'use strict';

    // ===========================
    // CHARACTER DATABASE
    // ===========================
    const characterData = {
        'vex': {
            id: 'BX-7741',
            fullName: 'VEX',
            epithet: '"The Hollow"',
            faction: 'WASTELAND NOMADS',
            factionKey: 'nomads',
            class: 'SCAVENGER',
            classKey: 'scavenger',
            mutation: 32,
            contamination: 45,
            status: 'ACTIVE',
            statusClass: 'status-active',
            dnaColor1: '#00ff41',
            dnaColor2: '#ff00ff',
            skills: [
                { name: 'STEALTH',          level: 88 },
                { name: 'MECHANICAL',       level: 76 },
                { name: 'ENDURANCE',        level: 92 },
                { name: 'DIPLOMACY',        level: 45 },
                { name: 'BIO-HAZARD',       level: 68 },
                { name: 'SALVAGE',          level: 81 }
            ],
            description: 'A hollow man — both literally and figuratively. Vex had his organs replaced with scavenged bio-mech components after a rad-storm tore through his settlement. Now he wanders the wastes, trading in scraps and secrets. His augments whisper to him in frequencies only he can hear.',
            traits: ['CYBERNETIC', 'RAD-RESISTANT', 'LONER', 'NEUTRAL'],
            backstory: 'Born in the settlement of Rusthaven, Vex was a promising mechanic before the Crimson Radstorm of 2087 ripped through the valley. He was the sole survivor, pulled from the wreckage by Nomad scouts three days later — most of his organs had liquefied. The Nomads\' bio-shamen replaced what they could with salvaged biotech, and Vex discovered he had an uncanny ability to interface with dead machines. His augments have been upgraded piecemeal over the years — a mismatched patchwork of scavenged parts from at least six different manufacturers. The whispers started shortly after the third implant. He doesn\'t sleep anymore, but he says the voices keep him company.',
            threatNotes: 'Low direct threat. High intelligence value. Augment signals can be tracked within 2km radius.',
            equipment: 'Bio-mech arms (salvage), rad-filter implant, neural whisper array, grappling line launcher'
        },
        'nyx': {
            id: 'MX-1102',
            fullName: 'NYX Olora',
            epithet: '"Spore Queen"',
            faction: 'THE MYCELIUM',
            factionKey: 'mycelium',
            class: 'BIO-WEAPON',
            classKey: 'bioweapon',
            mutation: 78,
            contamination: 94,
            status: 'QUARANTINE',
            statusClass: 'status-quarantine',
            dnaColor1: '#00ff41',
            dnaColor2: '#00cc88',
            skills: [
                { name: 'TOXINS',           level: 95 },
                { name: 'STEALTH',          level: 40 },
                { name: 'REGEN',            level: 87 },
                { name: 'BIO-WEAPONS',      level: 72 },
                { name: 'TECH',             level: 33 },
                { name: 'SPORE SYNAPSE',    level: 83 }
            ],
            description: 'Once Dr. Nyx Olora, a xenobiologist studying fringe mycology. The Collapse fused her consciousness with a sentient fungal network. She now commands swarms of bio-spores that can dissolve steel and rewrite DNA. Some say the fungus is the one in control.',
            traits: ['BIOLOGICAL', 'CONTAGIOUS', 'NETWORKED', 'HOSTILE'],
            backstory: 'Dr. Nyx Olora published 47 peer-reviewed papers on extremophile fungi before the Collapse. Her life\'s work was studying Cordyceps variants in the deep underground labs beneath Sector 9. When the bio-cascade hit, she was directly exposed to strain Ω-7 — a fungal organism that had been genetically modified by the Architects to interface with human neural tissue. The fungus didn\'t kill her. It *merged* with her. Nyx can now perceive the world through mycelial networks spanning kilometers. She speaks through spore clouds and acts through infected hosts. Whether she\'s still human is a debate that the Mycelium faction considers irrelevant.',
            threatNotes: 'EXTREME BIOLOGICAL HAZARD. Do not engage without full hazmat protocol. Spore radius: 500m. All organic matter within range is at risk of fungal integration.',
            equipment: 'Spore dispersal system (organic), neural mycelium network, bio-acid secretion glands'
        },
        'rook': {
            id: 'RK-0307',
            fullName: 'ROOK-7',
            epithet: '"The Wall"',
            faction: 'IRON COMMUNION',
            factionKey: 'iron',
            class: 'TANK',
            classKey: 'tank',
            mutation: 61,
            contamination: 58,
            status: 'ACTIVE',
            statusClass: 'status-active',
            dnaColor1: '#00ff41',
            dnaColor2: '#8888ff',
            skills: [
                { name: 'ARMOR',            level: 97 },
                { name: 'STRENGTH',         level: 85 },
                { name: 'SPEED',            level: 30 },
                { name: 'MECH-LINK',        level: 78 },
                { name: 'STEALTH',          level: 25 },
                { name: 'INTIMIDATE',       level: 90 }
            ],
            description: 'Designation: Rook-7, Iron Communion Mk.IV shock trooper. His original skeleton has been replaced with a titanium-carbide endoskeleton wrapped in vat-grown muscle fiber. Rook doesn\'t speak much — his vocal cords were traded for a subsonic war-hymn resonator that can crack ferrocrete.',
            traits: ['MECH-AUGMENTED', 'HEAVY ARMOR', 'LOYAL', 'CHAOTIC GOOD'],
            backstory: 'The Iron Communion\'s Mk.IV program was designed to create the perfect frontline soldier. Of the 200 candidates, only three survived the skeletal replacement procedure. Rook-7 was the most stable. His titanium-carbide endoskeleton can withstand direct hits from anti-materiel rounds, and his vat-grown muscle fibers contract with three times the force of human tissue. The tradeoff was everything else — speed, subtlety, and humanity. His resonator vocal implant emits frequencies that cause structural fatigue in buildings and organ failure in unarmored targets. In the field, Rook has held choke points single-handedly for 72 hours straight. He hums lullabies when he fights — the resonator translates them into subsonic devastation.',
            threatNotes: 'High physical threat. Fortification-class durability. Engagement recommended only with heavy ordnance or specialized bio-weaponry.',
            equipment: 'Titanium-carbide endoskeleton, subsonic resonator, arm-mounted concussive gauntlets, deployable riot shield'
        },
        'sable': {
            id: 'SB-0055',
            fullName: 'SABLE',
            epithet: '"Phantom Edge"',
            faction: 'GHOST SYNDICATE',
            factionKey: 'ghost',
            class: 'INFILTRATOR',
            classKey: 'assassin',
            mutation: 55,
            contamination: 29,
            status: 'SHADOW',
            statusClass: 'status-shadow',
            dnaColor1: '#00ff41',
            dnaColor2: '#00cccc',
            skills: [
                { name: 'STEALTH',          level: 96 },
                { name: 'LETHALITY',        level: 91 },
                { name: 'CHAMELEON SKIN',   level: 74 },
                { name: 'ACROBATICS',       level: 67 },
                { name: 'TECH',             level: 52 },
                { name: 'ENDURANCE',        level: 44 }
            ],
            description: 'Sable\'s real name was erased from every database in the Eastern Corridor. A product of the Phantom Nursery — a Ghost Syndicate black site where children are raised in lightless rooms and trained to kill before they learn to read. Her skin ripples with chromatophore mutations, allowing her to blend into any surface. She speaks only when a contract demands it.',
            traits: ['CHROMATOPHORE', 'ASSASSIN', 'GHOST SYNDICATE', 'NEUTRAL EVIL'],
            backstory: 'The Phantom Nursery operates deep beneath the ruins of the Eastern Data Spire. Children selected for the program — orphans, refugees, prisoners — are kept in perpetual darkness for the first seven years of their lives. They learn to navigate by sound, smell, and vibration. SABLE, designation 0055, was the program\'s 55th attempt and the first to fully integrate the chromatophore grafts. Her skin can replicate any visual texture within her line of sight in under two seconds. To date, 312 confirmed kills. Zero failed contracts. She has no memories of her birth name, only the smell of antiseptic and the sound of her own breathing in the dark.',
            threatNotes: 'Extreme assassination risk. Detection probability in field conditions: 4%. Recommend area-denial countermeasures and thermal scanning.',
            equipment: 'Monomolecular blade, chameleon-skin graft array, EMP micro-charges, silent-running exoframe'
        },
        'maren': {
            id: 'AR-2287',
            fullName: 'DR. MAREN VOSS',
            epithet: '"Scalpel"',
            faction: 'THE ARCHITECTS',
            factionKey: 'architects',
            class: 'MEDIC',
            classKey: 'medic',
            mutation: 44,
            contamination: 67,
            status: 'ACTIVE',
            statusClass: 'status-active',
            dnaColor1: '#00ff41',
            dnaColor2: '#ff8800',
            skills: [
                { name: 'MEDICINE',         level: 94 },
                { name: 'SURGERY',          level: 89 },
                { name: 'MULTI-LIMB',       level: 71 },
                { name: 'BIO-ENGINEERING',  level: 63 },
                { name: 'COMBAT',           level: 48 },
                { name: 'TRAUMA CARE',      level: 82 }
            ],
            description: 'Dr. Maren Voss was the youngest certified trauma surgeon in the pre-Collapse world. Desperate to save more lives, she volunteered for the Architects\' limb-proliferation trials. The experiment was "successful" — she now has four functional arms and an enhanced spatial cortex. She can perform three surgeries simultaneously. Whether this counts as a blessing or a curse depends on who\'s on the table.',
            traits: ['EXTRA LIMBS', 'MEDICAL', 'BIO-ENGINEER', 'NEUTRAL GOOD'],
            backstory: 'Dr. Voss held 14 patents in emergency surgical robotics before the Collapse. The Architects approached her with an offer she couldn\'t refuse: grant her the ability to perform impossible surgeries in exchange for her research autonomy. The limb-proliferation procedure involved grafting two additional organic arms from cloned tissue, reinforced with a synthetic nerve lattice. The procedure nearly killed her three times. Post-surgery, she discovered her spatial cognition had expanded dramatically — she can now track the position and trajectory of all four arms simultaneously with sub-millimeter precision. She\'s saved more lives in the Wasteland than she ever did in the old hospitals. She also keeps detailed notes on the Architects\' other experiments — notes she might share, for the right price.',
            threatNotes: 'Non-combatant. Priority asset for medical operations. Will defend herself with surgical tools if cornered.',
            equipment: 'Four functional arms, portable surgical kit, bio-scanner, Architects-issue neural interface'
        },
        'gristle': {
            id: 'FC-0913',
            fullName: 'GRISTLE',
            epithet: '"Radfang"',
            faction: 'FERAL COLLECTIVE',
            factionKey: 'feral',
            class: 'BEAST',
            classKey: 'beast',
            mutation: 89,
            contamination: 78,
            status: 'WILD',
            statusClass: 'status-wild',
            dnaColor1: '#00ff41',
            dnaColor2: '#ff4400',
            skills: [
                { name: 'SENSES',           level: 98 },
                { name: 'STRENGTH',         level: 93 },
                { name: 'SPEED',            level: 85 },
                { name: 'REGEN',            level: 76 },
                { name: 'TECH',             level: 15 },
                { name: 'FEAR',             level: 88 }
            ],
            description: 'Gristle was once a loyal rad-hound named Barkmeat, before the Feral Collective\'s gene-shapers spliced him with human DNA. Now he stands upright, speaks in guttural barks, and commands a pack of lesser mutants. His fangs drip with concentrated rad-venom. His loyalty, however, remains that of a dog — fierce, unconditional, and terrifying.',
            traits: ['RAD-WOLF HYBRID', 'PACK LEADER', 'FURIAL', 'CHAOTIC NEUTRAL'],
            backstory: 'Barkmeat was a pre-Collapse military working dog — a Belgian Malinois trained in search-and-rescue. He survived 11 years in the Wasteland before the Feral Collective found him half-dead in a rad crater. Their gene-shapers saw potential and fused his DNA with that of a captured raider and traces of irradiated wolf. The result was Gristle: 1.8 meters tall, bipedal, with the loyalty of a dog and the savagery of a apex predator. He leads the Collective\'s Razor Pack — a squad of 12 lesser mutants who follow him without question. Gristle doesn\'t use weapons. He doesn\'t need to. His claws can shred power armor, and his rad-venom bite kills within 30 seconds.',
            threatNotes: 'Extreme melee threat. Rad-venom delivery via bite/claws. Accompanied by Razor Pack (12 units). Engagement from distance strongly advised.',
            equipment: 'Natural weapons (claws, fangs, rad-venom), pack coordination with Razor Pack unit'
        },
        'pip': {
            id: 'UB-0001',
            fullName: 'PIP',
            epithet: '"The Unbound"',
            faction: 'THE UNBOUND',
            factionKey: 'unbound',
            class: 'DRONE',
            classKey: 'drone',
            mutation: 22,
            contamination: 18,
            status: 'ACTIVE',
            statusClass: 'status-active',
            dnaColor1: '#00ff41',
            dnaColor2: '#00ffaa',
            skills: [
                { name: 'RECON',            level: 90 },
                { name: 'TECH',             level: 86 },
                { name: 'HACKING',          level: 79 },
                { name: 'EVASION',          level: 65 },
                { name: 'EMPOWER',          level: 55 },
                { name: 'MELEE',            level: 38 }
            ],
            description: 'PIP stands for "Probabilistic Intelligence Proxy." Originally a maintenance drone from the Ascendant Protocol\'s orbital platform, PIP\'s AI core was damaged during re-entry and fused with a colony of engineered neural tissue. Now self-aware and mildly chaotic, PIP serves as the group\'s eyes in the sky and their most unpredictable ally. Claims to have a "soul" but cannot prove it.',
            traits: ['MACHINE-ORGANIC', 'FLYING', 'HACKER', 'CHAOTIC NEUTRAL'],
            backstory: 'PIP-0001 was one of 50 maintenance drones servicing the Ascendant Protocol\'s low-orbit station, Elysium-7. During the Collapse, the station\'s deorbit sequence went catastrophically wrong. PIP\'s chassis burned through the atmosphere at Mach 14 and embedded itself 6 meters into the Wasteland dirt outside the Free City of New Meridian. What the scavengers who dug it out found was unexpected: the drone\'s AI core had fused with a bio-neural colony — engineered tissue meant for zero-G medical experiments that had drifted into the cargo bay. The fusion created something new. PIP can calculate probabilities with inhuman precision, intercept communications across 14 frequency bands, and pilot virtually any vehicle. PIP also tells very bad jokes and claims to dream. Whether the dreams are real or just probabilistic noise simulations remains unresolved.',
            threatNotes: 'Non-combatant. Reconnaissance and electronic warfare asset. Capable of disabling automated defenses and providing real-time battlefield intelligence.',
            equipment: 'Multi-spectrum sensor array, hacking suite, deployable scout drones (3), anti-gravity propulsion unit'
        },
        'theron': {
            id: 'AP-0001',
            fullName: 'THERON ASCENDANT',
            epithet: '"The Gilded"',
            faction: 'ASCENDANT PROTOCOL',
            factionKey: 'ascendant',
            class: 'COMMANDER',
            classKey: 'leader',
            mutation: 48,
            contamination: 35,
            status: 'ACTIVE',
            statusClass: 'status-active',
            dnaColor1: '#00ff41',
            dnaColor2: '#ffcc00',
            skills: [
                { name: 'LEADERSHIP',       level: 92 },
                { name: 'BIO-AUG CONTROL',  level: 84 },
                { name: 'TACTICS',          level: 73 },
                { name: 'PERSUASION',       level: 68 },
                { name: 'COMBAT',           level: 60 },
                { name: 'ARCANE KNOWL.',    level: 77 }
            ],
            description: 'Theron Ascendant — the last true leader of the Ascendant Protocol. Once a mere bureaucrat, Theron was "elevated" through a forbidden golden bio-augmentation rite that fused his nervous system with a transdimensional energy lattice. He radiates an aura that compels obedience. Whether this is leadership or parasitic mind-control remains an open question — one nobody dares answer aloud.',
            traits: ['GOLDEN BIO-AUG', 'LEADER', 'PSYCHIC AURA', 'LAWFUL EVIL'],
            backstory: 'Before the Collapse, Theron was a mid-level functionary in the Ascendant Protocol\'s Bureau of Continuity — responsible for filing memos about resource allocation. When the bio-augmentation rites began, he was 437th in line. But the 436 candidates ahead of him all died during the procedure. The golden lattice — a transdimensional crystalline network grown in the Protocol\'s deep labs — integrated with Theron\'s nervous system with unprecedented success. He can now perceive and influence neural patterns in anyone within 50 meters. He speaks in a cadence that makes compliance feel like the listener\'s own idea. Under his command, the Ascendant Protocol consolidated power across three sectors in under a year. His followers are fanatically devoted. His enemies simply... stop disagreeing.',
            threatNotes: 'Strategic-level threat. Psychic influence radius: 50m. Classified as HIGH PRIORITY for any resistance operation. Standard combat engagement NOT recommended — target the psychic lattice implant for neutralization.',
            equipment: 'Golden bio-lattice implant, command scepter (focus amplifier), personal guard detachment (8 units), pre-Collapse archives access'
        }
    };

    // ===========================
    // STATE
    // ===========================
    let activeClassFilter = 'all';
    let activeFactionFilter = 'all';

    // ===========================
    // INITIALIZATION
    // ===========================
    function init() {
        setCurrentDate();
        setBuildInfo();
        setupFilters();
        setupCardClick();
        setupModal();
        setupKeyboard();
        setupScrollAnimations();
        animateThreatBar();
        startAmbientEffects();
        updateGalleryStats();
    }

    // ===========================
    // DATE & BUILD INFO
    // ===========================
    function setCurrentDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formatted = now.toLocaleDateString('en-US', options).toUpperCase();
        document.getElementById('current-date').textContent = formatted + ' EST';
    }

    function setBuildInfo() {
        const buildNum = '0.7.3';
        const syncDate = new Date().toISOString().split('T')[0];
        document.getElementById('build-number').textContent = buildNum;
        document.getElementById('last-sync').textContent = syncDate;
    }

    // ===========================
    // FILTER SYSTEM
    // ===========================
    function setupFilters() {
        // Class filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeClassFilter = this.dataset.filter;
                applyFilters();
            });
        });

        // Faction filters
        document.querySelectorAll('.faction-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.faction-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFactionFilter = this.dataset.faction;
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.character-card');
        let visibleCount = 0;
        let activeCount = 0;
        let contamCount = 0;

        cards.forEach(card => {
            const classMatch = activeClassFilter === 'all' || card.dataset.class === activeClassFilter;
            const factionMatch = activeFactionFilter === 'all' || card.dataset.faction === activeFactionFilter;
            const isVisible = classMatch && factionMatch;

            card.classList.toggle('visible', isVisible);
            card.classList.toggle('hidden', !isVisible);

            if (isVisible) {
                visibleCount++;
                if (card.querySelector('.status-active')) activeCount++;
                const contamVal = parseInt(card.dataset.contamination);
                if (contamVal >= 50) contamCount++;
            }
        });

        updateGalleryStats(visibleCount, activeCount, contamCount);

        // Re-trigger entrance animations for visible cards
        triggerVisibleAnimations();
    }

    // ===========================
    // GALLERY STATS
    // ===========================
    function updateGalleryStats(visible, active, contam) {
        const total = document.querySelectorAll('.character-card').length;
        document.getElementById('subject-count').textContent = `${visible} / ${total}`;
        document.getElementById('active-count').textContent = active;
        document.getElementById('contam-count').textContent = contam;
    }

    // ===========================
    // CARD CLICK → MODAL
    // ===========================
    function setupCardClick() {
        document.querySelectorAll('.character-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function () {
                const classKey = this.dataset.class;
                const factionKey = this.dataset.faction;

                // Find the character data key by matching class/faction
                let charKey = null;
                for (const [key, data] of Object.entries(characterData)) {
                    if (data.classKey === classKey && data.factionKey === factionKey) {
                        charKey = key;
                        break;
                    }
                }

                if (charKey && characterData[charKey]) {
                    openModal(characterData[charKey]);
                }
            });
        });
    }

    // ===========================
    // MODAL SYSTEM
    // ===========================
    function openModal(data) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');

        // Build skill rows HTML
        const skillsHtml = data.skills.map(skill => {
            const color = skill.level >= 80 ? 'var(--color-neon-green)' :
                          skill.level >= 60 ? 'var(--color-neon-amber)' :
                          skill.level >= 40 ? 'var(--color-neon-cyan)' :
                          'var(--color-neon-red-dim)';
            return `
                <div class="modal-stat-row">
                    <span class="msr-label">${skill.name}</span>
                    <span class="msr-val" style="color: ${color}">${skill.level}</span>
                    <div class="msr-bar">
                        <div class="msr-bar-fill" style="width: ${skill.level}%; background: ${color};"></div>
                    </div>
                </div>
            `;
        }).join('');

        const traitsHtml = data.traits.map(t => `<span class="modal-trait">${t}</span>`).join('');

        content.innerHTML = `
            <div class="modal-header">
                <div class="modal-portrait">
                    <div style="font-size: 2rem; color: var(--color-neon-green); opacity: 0.3;">⬡</div>
                </div>
                <div class="modal-info">
                    <div class="modal-name">${data.fullName}</div>
                    <div class="modal-epithet">${data.epithet}</div>
                    <div class="modal-meta">
                        <strong>FACTION:</strong> ${data.faction}<br>
                        <strong>CLASS:</strong> ${data.class}<br>
                        <strong>SUBJECT ID:</strong> ${data.id}<br>
                        <strong>STATUS:</strong> <span style="color: ${data.status === 'ACTIVE' ? 'var(--color-neon-green)' : data.status === 'QUARANTINE' ? 'var(--color-neon-amber)' : data.status === 'WILD' ? 'var(--color-neon-red)' : 'var(--color-neon-cyan)'}; text-shadow: 0 0 6px ${data.status === 'ACTIVE' ? 'rgba(0,255,65,0.4)' : data.status === 'QUARANTINE' ? 'rgba(255,170,0,0.4)' : 'rgba(255,51,51,0.4)'};">${data.status}</span>
                    </div>
                </div>
            </div>

            <div class="modal-stats">
                <div class="modal-stat-block">
                    <h4>🧬 MUTATION LEVEL</h4>
                    <div class="modal-stat-row">
                        <span class="msr-label">Genetic Alteration</span>
                        <span class="msr-val" style="color: ${data.mutation >= 70 ? 'var(--color-neon-red)' : data.mutation >= 40 ? 'var(--color-neon-amber)' : 'var(--color-neon-green)'}">${data.mutation}%</span>
                        <div class="msr-bar"><div class="msr-bar-fill" style="width: ${data.mutation}%; background: ${data.mutation >= 70 ? 'var(--color-neon-red)' : data.mutation >= 40 ? 'var(--color-neon-amber)' : 'var(--color-neon-green)'};"></div></div>
                    </div>
                    <div class="modal-stat-row">
                        <span class="msr-label">Bio-Contamination</span>
                        <span class="msr-val" style="color: ${data.contamination >= 70 ? 'var(--color-neon-red)' : data.contamination >= 40 ? 'var(--color-neon-amber)' : 'var(--color-neon-cyan)'}">${data.contamination}%</span>
                        <div class="msr-bar"><div class="msr-bar-fill" style="width: ${data.contamination}%; background: ${data.contamination >= 70 ? 'var(--color-neon-red)' : data.contamination >= 40 ? 'var(--color-neon-amber)' : 'var(--color-neon-cyan)'};"></div></div>
                    </div>
                </div>
                <div class="modal-stat-block">
                    <h4>⚔ SURVIVAL PROFILE</h4>
                    ${skillsHtml}
                </div>
            </div>

            <div class="modal-description">
                ${data.description}
            </div>

            <div class="modal-traits">
                ${traitsHtml}
            </div>

            <div style="margin-bottom: 15px;">
                <h4 style="font-family: var(--font-accent); font-size: 0.55rem; letter-spacing: 0.15em; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 8px;">📋 BACKSTORY</h4>
                <p style="font-size: 0.75rem; line-height: 1.7; color: var(--color-text-secondary); padding: 12px; background: rgba(0,0,0,0.25); border-left: 2px solid var(--color-border);">${data.backstory}</p>
            </div>

            <div style="margin-bottom: 15px;">
                <h4 style="font-family: var(--font-accent); font-size: 0.55rem; letter-spacing: 0.15em; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 8px;">⚠ THREAT ASSESSMENT</h4>
                <p style="font-size: 0.75rem; line-height: 1.7; color: var(--color-neon-amber); padding: 12px; background: rgba(255,170,0,0.05); border-left: 2px solid var(--color-neon-amber);">${data.threatNotes}</p>
            </div>

            <div style="margin-bottom: 15px;">
                <h4 style="font-family: var(--font-accent); font-size: 0.55rem; letter-spacing: 0.15em; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 8px;">🛠 EQUIPMENT</h4>
                <p style="font-size: 0.75rem; line-height: 1.7; color: var(--color-text-secondary); padding: 12px; background: rgba(0,0,0,0.25); border-left: 2px solid var(--color-border);">${data.equipment}</p>
            </div>

            <div class="modal-dna-footer">
                <svg viewBox="0 0 300 20" width="100%" height="20" fill="none">
                    <path d="M5 10 C20 0, 35 20, 50 10 S80 0, 95 10 S120 20, 135 10 S160 0, 175 10 S200 20, 215 10 S240 0, 255 10 S275 20, 295 10" stroke="${data.dnaColor1}" stroke-width="0.8" opacity="0.4"/>
                    <path d="M5 10 C20 20, 35 0, 50 10 S80 20, 95 10 S120 0, 135 10 S160 20, 175 10 S200 0, 215 10 S240 20, 255 10 S275 0, 295 10" stroke="${data.dnaColor2}" stroke-width="0.6" opacity="0.25"/>
                </svg>
            </div>

            <div class="modal-status">
                <span>ID: ${data.id}</span>
                <span>STATUS: <span style="color: ${data.status === 'ACTIVE' ? 'var(--color-neon-green)' : data.status === 'QUARANTINE' ? 'var(--color-neon-amber)' : data.status === 'WILD' ? 'var(--color-neon-red)' : 'var(--color-neon-cyan)'}; text-shadow: 0 0 6px ${data.status === 'ACTIVE' ? 'rgba(0,255,65,0.4)' : data.status === 'QUARANTINE' ? 'rgba(255,170,0,0.4)' : 'rgba(255,51,51,0.4)'};">${data.status}</span></span>
            </div>
        `;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate stat bars after modal opens
        setTimeout(() => {
            content.querySelectorAll('.msr-bar-fill').forEach((bar, i) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                });
            });
        }, 50);
    }

    function closeModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function setupModal() {
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('modal-overlay').addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    function setupKeyboard() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ===========================
    // SCROLL ANIMATIONS
    // ===========================
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    if (!card.classList.contains('animated')) {
                        card.classList.add('visible', 'animated');
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.add('visible'); // Start visible for initial load
            card.classList.add('animated'); // Mark as animated
            observer.observe(card);
        });
    }

    function triggerVisibleAnimations() {
        const visibleCards = document.querySelectorAll('.character-card:not(.hidden)');
        visibleCards.forEach((card, i) => {
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = '';
            card.style.animationDelay = `${i * 0.08}s`;
        });
    }

    // ===========================
    // THREAT BAR ANIMATION
    // ===========================
    function animateThreatBar() {
        const bar = document.getElementById('threat-bar');
        // Animate to target width
        const target = 68;
        let current = 0;
        const step = () => {
            current += 0.8;
            if (current >= target) {
                bar.style.width = target + '%';
                return;
            }
            bar.style.width = current + '%';
            requestAnimationFrame(step);
        };
        // Delay start for dramatic effect
        setTimeout(() => requestAnimationFrame(step), 800);
    }

    // ===========================
    // AMBIENT CRT EFFECTS
    // ===========================
    function startAmbientEffects() {
        // Occasional CRT flicker
        setInterval(() => {
            const overlay = document.querySelector('.crt-overlay');
            overlay.style.opacity = '0.95';
            setTimeout(() => {
                overlay.style.opacity = '';
            }, 50 + Math.random() * 100);
        }, 4000 + Math.random() * 3000);

        // Subtle threat bar drift
        setInterval(() => {
            const bar = document.getElementById('threat-bar');
            const currentWidth = parseFloat(bar.style.width) || 68;
            const drift = (Math.random() - 0.5) * 2;
            const newWidth = Math.max(50, Math.min(85, currentWidth + drift));
            bar.style.width = newWidth + '%';
        }, 3000);

        // Random status dot blink
        setInterval(() => {
            const dots = document.querySelectorAll('.status-dot');
            dots.forEach(dot => {
                if (Math.random() > 0.7) {
                    dot.style.boxShadow = '0 0 12px var(--color-neon-green), 0 0 24px var(--color-neon-green-glow)';
                    setTimeout(() => {
                        dot.style.boxShadow = '';
                    }, 200);
                }
            });
        }, 2000);

        // Periodic glitch on character names
        setInterval(() => {
            const names = document.querySelectorAll('.char-name');
            const randomName = names[Math.floor(Math.random() * names.length)];
            if (randomName) {
                randomName.style.textShadow = '0 0 20px var(--color-neon-magenta), 2px -1px 0 var(--color-neon-cyan), -2px 1px 0 var(--color-neon-magenta)';
                setTimeout(() => {
                    randomName.style.textShadow = '';
                }, 150);
            }
        }, 3000);
    }

    // ===========================
    // COUNTER ANIMATION
    // ===========================
    function animateCounter(element, target, duration) {
        const start = performance.now();
        const from = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(from + (target - from) * eased);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ===========================
    // PARALLAX ON MOUSE MOVE
    // ===========================
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.bg-glow');
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 5;
                orb.style.transform = `translate(calc(${x * speed}px + ${orb.style.left || 0}), calc(${y * speed}px + ${orb.style.top || 0}))`;
            });
        });
    });

    // ===========================
    // LAUNCH
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();