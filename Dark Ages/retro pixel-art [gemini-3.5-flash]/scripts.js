/* ==========================================================================
   THE BLACK CHRONICLE — INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Variables ---
    let isNight = false;
    let audioContext = null;
    let isMuted = true;
    let population = 1240;
    let miasmaLevel = 66;

    // --- DOM Elements ---
    const body = document.body;
    const cycleBtn = document.getElementById('cycle-btn');
    const cycleBtnText = cycleBtn.querySelector('.btn-text');
    const bellBtn = document.getElementById('bell-btn');
    const bellOverlay = document.getElementById('bell-overlay');
    const soundToggle = document.getElementById('sound-toggle');
    const gameWrapper = document.querySelector('.game-wrapper');
    
    // Map & Location Elements
    const mapLocations = document.querySelectorAll('.map-location');
    const locTitle = document.getElementById('loc-title');
    const locDesc = document.getElementById('loc-desc');
    const manuscriptEntries = document.querySelectorAll('.manuscript-entry');
    const chronicleScroll = document.getElementById('chronicle-scroll');

    // Doctor Elements
    const doctorAvatar = document.getElementById('doctor-avatar');
    const doctorText = document.getElementById('doctor-text');
    const doctorButtons = document.querySelectorAll('.doctor-action');

    // HUD Elements
    const populationCounter = document.getElementById('population-counter');
    const miasmaIndicator = document.getElementById('miasma-indicator');

    // --- Location Data ---
    const locationData = {
        monastery: {
            title: "SAINT JUDE'S MONASTERY",
            desc: "The monks chant solemn hymns. They offer shelter but fear the outside plague is divine punishment.",
            entry: "entry-monastery"
        },
        castle: {
            title: "THE OBSIDIAN KEEP",
            desc: "The baron has barred the gates. Heavy iron portcullises block entry, yet rumors of internal fever grow.",
            entry: "entry-castle"
        },
        village: {
            title: "STRICKEN HAMLET",
            desc: "Peasants burn aromatic herbs and paint red crosses on wooden doors to ward off the noxious miasma.",
            entry: "entry-village"
        },
        cemetery: {
            title: "THE PLAGUE PIT",
            desc: "Mass graves dug under the cover of cold mist. The smell of sulphur and damp earth hangs heavily in the air.",
            entry: "entry-cemetery"
        }
    };

    // --- Doctor Dialogue Trees ---
    const doctorResponses = {
        cure: [
            "Take dry rosemary and burn it inside your chambers! Avoid bathhouses, for they open the pores of the flesh to pestilence.",
            "Wear a pouch of dried toad and nutmeg upon your neck. It draws the black vapors out of your vital blood.",
            "Drink fine vinegar mixed with crushed pearls before the rooster crows, and isolate your household."
        ],
        diagnose: [
            "If your skin shows dark spots like fleabites, or great swellings under the armpits, you have been touched by the great mortality.",
            "A heavy fever accompanied by spitting of dark blood means your humors are completely out of balance. Repent immediately!",
            "Chills and a heavy head indicate your lungs are filled with noxious wind. Retrace your steps and pray."
        ],
        bleed: [
            "Ah, a wise choice. The bad blood must flow! Sit comfortably while I apply the leeches to your left arm.",
            "We shall open the vein of your inner elbow. It will restore the balance of phlegm and yellow bile.",
            "Let the dark humors run out into this brass bowl. You will feel lighter, or you will meet your Maker shortly."
        ]
    };

    // --- Sound Synthesis (Web Audio API) ---
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSynthTone(freq, type, duration, gainStart) {
        if (isMuted || !audioContext) return;
        
        try {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(gainStart, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            osc.start();
            osc.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Audio context protection block
        }
    }

    function playDoomBellSound() {
        initAudio();
        // Complex metallic tone simulation (overlapping dark square and saw waves)
        playSynthTone(110, 'sawtooth', 2.5, 0.4);
        playSynthTone(111.5, 'square', 2.5, 0.3);
        playSynthTone(220, 'triangle', 2.0, 0.2);
        playSynthTone(55, 'sine', 3.0, 0.5);
    }

    function playSelectSound() {
        initAudio();
        // High pitch retro pixel click
        playSynthTone(880, 'sine', 0.1, 0.15);
        setTimeout(() => {
            playSynthTone(1200, 'sine', 0.05, 0.1);
        }, 50);
    }

    function playDoctorSound() {
        initAudio();
        // Low raspy murmur synthetic effect
        playSynthTone(140, 'triangle', 0.15, 0.2);
        setTimeout(() => {
            playSynthTone(110, 'triangle', 0.2, 0.2);
        }, 80);
    }

    // --- Interactive Mechanics ---

    // 1. Day & Night Cycle
    cycleBtn.addEventListener('click', () => {
        isNight = !isNight;
        playSelectSound();

        if (isNight) {
            body.classList.remove('day-mode');
            body.classList.add('night-mode');
            cycleBtnText.textContent = "NIGHT";
            miasmaLevel = Math.min(100, miasmaLevel + 15);
        } else {
            body.classList.remove('night-mode');
            body.classList.add('day-mode');
            cycleBtnText.textContent = "DAY";
            miasmaLevel = Math.max(10, miasmaLevel - 10);
        }

        updateHUD();
    });

    // 2. Doom Bell Toll
    bellBtn.addEventListener('click', () => {
        playDoomBellSound();
        
        // Trigger Visual FX
        bellOverlay.classList.remove('active');
        void bellOverlay.offsetWidth; // Force CSS reflow
        bellOverlay.classList.add('active');

        gameWrapper.classList.remove('bell-shaking');
        void gameWrapper.offsetWidth; // Force CSS reflow
        gameWrapper.classList.add('bell-shaking');

        // Dark age simulation mechanics: bell tolling reduces population and increases panic
        population = Math.max(0, population - Math.floor(Math.random() * 8) - 2);
        miasmaLevel = Math.min(100, miasmaLevel + 5);
        updateHUD();

        // Doctor reacts to the doom bell
        doctorText.textContent = "Hearken! The toll of doom sounds. The air grows thick with pestilence. Repent!";
        doctorAvatar.style.transform = "scaleY(1.2)";
        setTimeout(() => {
            doctorAvatar.style.transform = "scaleY(1)";
        }, 600);
    });

    // 3. Map Location Hover & Selection
    mapLocations.forEach(loc => {
        loc.addEventListener('mouseenter', () => {
            const locKey = loc.getAttribute('data-location');
            if (locationData[locKey]) {
                locTitle.textContent = locationData[locKey].title;
                locDesc.textContent = locationData[locKey].desc;
            }
        });

        loc.addEventListener('click', () => {
            playSelectSound();
            const locKey = loc.getAttribute('data-location');
            
            // Toggle active visual class on pin
            mapLocations.forEach(pin => pin.classList.remove('active-pin'));
            loc.classList.add('active-pin');

            // Switch current active chronicle manuscript entry
            const targetEntryId = locationData[locKey].entry;
            manuscriptEntries.forEach(entry => {
                entry.classList.add('hidden');
                entry.classList.remove('active');
            });

            const targetEntry = document.getElementById(targetEntryId);
            if (targetEntry) {
                targetEntry.classList.remove('hidden');
                targetEntry.classList.add('active');
                chronicleScroll.scrollTop = 0;
            }
        });
    });

    // Reset map hover description if cursor leaves map wrapper completely
    document.getElementById('fief-map').addEventListener('mouseleave', () => {
        const activePin = document.querySelector('.map-location.active-pin');
        if (activePin) {
            const locKey = activePin.getAttribute('data-location');
            locTitle.textContent = locationData[locKey].title;
            locDesc.textContent = locationData[locKey].desc;
        } else {
            locTitle.textContent = "OAKHAVEN FIEF";
            locDesc.textContent = "Hover over or select a location on the map to inspect the realm.";
        }
    });

    // 4. Doctor Actions
    doctorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playDoctorSound();
            const action = btn.getAttribute('data-action');
            const responses = doctorResponses[action];
            const randomIndex = Math.floor(Math.random() * responses.length);
            
            doctorText.textContent = responses[randomIndex];

            // Subtle doctor head animation
            doctorAvatar.style.transform = "translateY(-4px)";
            setTimeout(() => {
                doctorAvatar.style.transform = "translateY(0)";
            }, 200);
        });
    });

    // 5. Sound Mute Control
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            soundToggle.textContent = "MUTED";
            soundToggle.classList.remove('active');
        } else {
            soundToggle.textContent = "ENABLED";
            soundToggle.classList.add('active');
            initAudio();
            playSelectSound();
        }
    });

    // 6. Update HUD Stats
    function updateHUD() {
        populationCounter.textContent = population.toLocaleString();
        miasmaIndicator.style.width = `${miasmaLevel}%`;

        // Color shifts according to miasma severity levels
        if (miasmaLevel < 40) {
            miasmaIndicator.style.backgroundColor = '#2ca05a';
        } else if (miasmaLevel < 75) {
            miasmaIndicator.style.backgroundColor = '#a06a2c';
        } else {
            miasmaIndicator.style.backgroundColor = '#a02c2c';
        }
    }

    // Initialize display values
    updateHUD();
});