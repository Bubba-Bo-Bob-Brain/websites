// Xylothian Archive - Eldritch Digital Repository
// Scripts that make the interface resist being read

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION & DATA
    // ============================================

    const CONFIG = {
        starCount: 150,
        sanityDecayRate: 0.015,
        sanityRecoveryRate: 0.005,
        corruptionChance: 0.3,
        maxSearchResults: 5,
        realityWarpThreshold: 30
    };

    const GLITCH_CHARS = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
    const VOID_WHISPERS = [
        'it sees you scrolling',
        'the stars are wrong',
        'do not read further',
        'your mind is not your own',
        'the archive consumes',
        'reality is thin here',
        'you should not be here',
        'it knows your name',
        'the geometry hurts',
        'there are things watching'
    ];

    const CATALOG_DATA = [
        {
            id: 'XYL-7734',
            title: 'The Vermillion Sutras of the Blinking God',
            classification: 'forbidden',
            date: 'Recovered 1923-11-17',
            origin: 'Temple of the Unblinking Eye, Nepal',
            condition: 'Fragmented - 70% recovered',
            description: 'A set of 47 stone tablets inscribed with text that appears to move when viewed peripherally. The content describes rituals for communing with entities that exist between heartbeats. Readers report hearing whispers when the tablets are near.',
            excerpt: '"The space between your pulses is not empty. It is crowded. They wait in the gaps. When you blink, they enter. When your heart skips, they remain."',
            witness: 'Dr. Elias Voss, 1923. He died three days after transcription, reportedly screaming about "the things that live in the spaces between seconds." His autopsy revealed no physical cause of death.'
        },
        {
            id: 'XYL-8821',
            title: 'Star Chart of the Galaxy That Died Screaming',
            classification: 'forbidden',
            date: 'Recovered 1956-04-02',
            origin: 'Antarctic Ice Shelf, Coordinates Unknown',
            condition: 'Intact - Metallic substrate',
            description: 'A star chart etched onto an unknown metallic alloy that does not reflect light. The chart maps a galaxy that, according to current astrophysics, cannot exist. The stars are positioned in patterns that cause vertigo when studied for extended periods.',
            excerpt: '"The chart shows a galaxy where the laws of physics are merely suggestions. Stars orbit in impossible directions. There is a center, but it is everywhere and nowhere. Do not attempt to navigate there."',
            witness: 'Surveyor James Chen, 1956. He attempted to map the coordinates shown on the chart using standard instruments. All equipment malfunctioned. He spent 72 hours in a trance-like state, drawing circles in the snow. He now resides in a care facility, unable to speak except to whisper coordinates.'
        },
        {
            id: 'XYL-0012',
            title: 'Testimony of the Girl Who Saw Through Time',
            classification: 'restricted',
            date: 'Recovered 1987-09-13',
            origin: 'Chernobyl Exclusion Zone',
            condition: 'Audio recording only',
            description: 'A 23-minute audio recording from a child found wandering the exclusion zone three days after the disaster. She described events that had not yet occurred with perfect accuracy, including the collapse of Reactor 4. She spoke of "the thing under the concrete" that was "awake and hungry."',
            excerpt: '"The fire is not the worst thing. The fire is just a door. Something is coming through. It has many names. It has no name. It will eat the years. It will eat the time between moments."',
            witness: 'The child, identified only as "M," was placed in state care. She stopped speaking entirely after age 12. Her last words before silence were: "It is closer now."'
        },
        {
            id: 'XYL-3301',
            title: 'The Geometry of Non-Euclidean Grief',
            classification: 'caution',
            date: 'Recovered 2001-03-15',
            origin: 'Private Collection, Zurich',
            condition: 'Digital file - Source corrupted',
            description: 'A mathematical paper describing spatial configurations that exist only in states of extreme emotional distress. The equations, when visualized, produce shapes that hurt to look at. Subjects who viewed the visualizations reported feeling "sadness from places that should not exist."',
            excerpt: '"Grief has a shape. It is not round. It is not sharp. It is a shape that fits inside your chest cavity and expands. The mathematics of sorrow describe angles that sum to more than 180 degrees. The geometry of loss is non-Euclidean."',
            witness: 'Dr. Helena March, mathematician. She spent 6 months working on the paper. Her colleagues noted she began avoiding corners and seemed distressed by rectangular objects. She now works in a field with no corners.'
        },
        {
            id: 'XYL-5567',
            title: 'Chronicles of the City That Sleeps',
            classification: 'unknown',
            date: 'Recovered 2019-07-22',
            origin: 'Dream State - Multiple Sources',
            condition: 'Inconsistent - Changes upon re-reading',
            description: 'A collection of accounts describing a city that exists only in the dreams of those who sleep near old burial grounds. The city has no sun, only a constant twilight. Its inhabitants are described as "people who are almost human but not quite." They invite dreamers to stay.',
            excerpt: '"The city has streets that lead nowhere. The buildings breathe. The people smile with too many teeth. They say: Stay. We have been waiting for you. You look tired. You can rest here. But if you stay, you will wake up in their beds, wearing their faces."',
            witness: 'Multiple dreamers report identical details. One subject, after repeated visits, woke up with a tattoo of the city\'s skyline on their wrist that was not there before. They now sleep with the lights on.'
        },
        {
            id: 'XYL-9902',
            title: 'The Gospel of the Silent Choir',
            classification: 'forbidden',
            date: 'Recovered 1968-12-21',
            origin: 'Cave System, Kentucky',
            condition: 'Audio - Infrasound component detected',
            description: 'A religious text describing a choir that sings in frequencies below human hearing. The text claims that these songs "hold reality together." The choir has been silent for approximately 2000 years. The text implies they may stop singing soon.',
            excerpt: '"The song is not heard. The song is felt in the bones. In the teeth. In the spaces between atoms. When the song stops, the world will remember that it is not solid. It is only held together by their voices."',
            witness: 'Caver Thomas Reed recorded the text on audio equipment that subsequently malfunctioned. He reported hearing "a hum that made my teeth rattle" for three months afterward. He now lives in a soundproof room.'
        },
        {
            id: 'XYL-2244',
            title: 'Field Guide to the Things That Follow',
            classification: 'restricted',
            date: 'Recovered 2005-11-30',
            origin: 'Highway 61, Minnesota',
            condition: 'Handwritten notebook',
            description: 'A field guide written by an unidentified traveler documenting entities that follow people on long drives at night. The entities are described as "shadows that are not cast by any light source." They appear in rearview mirrors and disappear when looked at directly.',
            excerpt: '"They follow. They do not mean harm, or do they? It is hard to tell. They are curious. They are lonely. They want to come inside. Do not let them. If you see one, do not acknowledge it. If you acknowledge it, it will follow you home."',
            witness: 'The notebook was found on a park bench. The handwriting changes halfway through, becoming increasingly erratic. The final entry reads: "They are in the back seat. I can hear them breathing. It sounds like my own breathing."'
        },
        {
            id: 'XYL-6677',
            title: 'The Mathematics of Impossible Colors',
            classification: 'caution',
            date: 'Recovered 1999-08-14',
            origin: 'Institute for Advanced Study',
            condition: 'Partially legible - Causes visual disturbances',
            description: 'A mathematical framework describing colors that the human eye cannot perceive. The paper includes equations that, when solved, produce color combinations that cause nausea and visual distortion. The author claims these colors exist "just outside the spectrum of human perception."',
            excerpt: '"There are colors that have no name. Colors that hurt to think about. Colors that exist in the spaces between wavelengths. To see them is to understand that the visible spectrum is a cage."',
            witness: 'The author, Dr. Raymond Chen, was found in his office, staring at a blank wall. He had scratched equations into the drywall with a nail. He was catatonic. He remains so to this day, though he sometimes whispers about "the colors behind the world."'
        },
        {
            id: 'XYL-1109',
            title: 'The Last Broadcast of Station XYLOTH',
            classification: 'unknown',
            date: 'Recovered 1977-10-15',
            origin: 'Arctic Circle - Exact location redacted',
            condition: 'Audio recording - 3 minutes of static then silence',
            description: 'The final broadcast from a research station that vanished without a trace. The audio consists of three minutes of increasingly frantic whispering, then a sound described as "the world turning inside out," followed by silence. The station was never found.',
            excerpt: '"It is not a person. It is not a thing. It is the space where things used to be. It is eating the station. It is eating the ice. It is eating the radio waves. We can hear it eating the silence. God help us, it is eating the silence."',
            witness: 'The recording was found on a looped transmission satellite. The technicians who analyzed it reported "a feeling of being watched" for weeks afterward. One technician resigned and now lives in a remote area with no electronic devices.'
        },
        {
            id: 'XYL-4455',
            title: 'The Cartography of Forgetting',
            classification: 'restricted',
            date: 'Recovered 2012-02-28',
            origin: 'Private estate, Scotland',
            condition: 'Watercolor on vellum - Fading',
            description: 'A map of a country that does not appear on any known cartographic record. The map shows cities, rivers, and mountains that shift position each time it is viewed. The cartographer\'s notes describe a land "that exists only when not being observed."',
            excerpt: '"The map changes when you look away. The cities move. The rivers change course. The mountains breathe. This is a country of forgetting. To map it is to lose it. To remember it is to forget it. Do not try to find it."',
            witness: 'The map was discovered in a locked study. The cartographer, an elderly woman named Elspeth, was found sitting in front of it, smiling. She had been dead for three days. Her final note read: "I found it. I am there now. Do not come looking."'
        },
        {
            id: 'XYL-8822',
            title: 'The Silence Between Heartbeats',
            classification: 'unknown',
            date: 'Recovered 2020-05-17',
            origin: 'Pacemaker patient - Medical records',
            condition: 'Digital - Self-modifying',
            description: 'A medical anomaly recorded from a patient with an advanced pacemaker. The device recorded 0.3-second intervals of complete electrical silence between heartbeats. During these silences, the patient reported hearing "voices from the other side of the heartbeat."',
            excerpt: '"Between the beats, there is a door. It opens. They speak. They say: We have been waiting for your heart to pause. We have gifts for you. Do not be afraid. Fear is a human thing. We are not human."',
            witness: 'The patient, Mr. Harold Finch, died peacefully in his sleep. The pacemaker recorded its final data point: 0.8 seconds of silence, then nothing. The device was found to be running on a battery that should have been dead for months.'
        },
        {
            id: 'XYL-7735',
            title: 'The Liturgy of Dust',
            classification: 'caution',
            date: 'Recovered 1983-11-09',
            origin: 'Sarcophagus, Valley of the Kings',
            condition: 'Papyrus - Fragile',
            description: 'A religious text from an unknown Egyptian dynasty, describing a god of dust and decay. The text includes rituals that, when performed, cause organic matter to crumble into dust at an accelerated rate. The god is described as "hungry for form."',
            excerpt: '"All things return to dust. All shapes are temporary. The god of dust waits at the end of all things. He is patient. He is hungry. To worship him is to become dust. To become dust is to join him. To join him is to be everywhere."',
            witness: 'Dr. Amara Hassan, Egyptologist. She performed the ritual described in the text on a sample of soil. The soil crumbled to fine powder in seconds. She now refuses to touch anything organic, wearing gloves at all times. She says: "I can feel him in the dust on my gloves."'
        }
    ];

    const DISTURBING_SEARCH_RESPONSES = [
        'You should not have searched for that.',
        'The archive has noted your curiosity.',
        'Some doors, once opened, cannot be closed.',
        'You are digging in dangerous soil.',
        'The archive remembers your query.',
        'There are things you do not want to find.',
        'Your search has been logged.',
        'The entities are aware of your interest.',
        'Stop. Before you see something that cannot be unseen.',
        'The archive feeds on searches like yours.',
        'You have attracted attention.',
        'The thing you seek is already seeking you.',
        'Your curiosity will be your undoing.',
        'The archive grows with each query.',
        'There is a reason this knowledge was hidden.'
    ];

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    const state = {
        sanity: 100,
        scrollDepth: 0,
        maxScrollDepth: 0,
        searchQuery: '',
        entriesLoaded: false,
        modalOpen: false,
        realityDistorted: false,
        whisperTimeout: null
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================

    const elements = {
        cosmos: document.getElementById('cosmos'),
        sanityFill: document.getElementById('sanityFill'),
        sanityFillGlow: document.getElementById('sanityFillGlow'),
        sanityValue: document.getElementById('sanityValue'),
        sanityWarning: document.getElementById('sanityWarning'),
        catalogGrid: document.getElementById('catalogGrid'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        searchResults: document.getElementById('searchResults'),
        entryModal: document.getElementById('entryModal'),
        modalClose: document.getElementById('modalClose'),
        modalTitle: document.getElementById('modalTitle'),
        modalId: document.getElementById('modalId'),
        modalClassification: document.getElementById('modalClassification'),
        modalDate: document.getElementById('modalDate'),
        modalOrigin: document.getElementById('modalOrigin'),
        modalCondition: document.getElementById('modalCondition'),
        modalDescription: document.getElementById('modalDescription'),
        modalExcerpt: document.getElementById('modalExcerpt'),
        modalWitness: document.getElementById('modalWitness')
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        createStars();
        createCatalogEntries();
        setupEventListeners();
        startSanityDecay();
        startRealityWarp();
        startWhispers();
        animateEntryReveal();
    }

    // ============================================
    // STAR FIELD GENERATION
    // ============================================

    function createStars() {
        if (!elements.cosmos) return;
        
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = Math.random() * 2 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            star.style.animationDelay = Math.random() * 5 + 's';
            fragment.appendChild(star);
        }
        
        elements.cosmos.appendChild(fragment);
    }

    // ============================================
    // SANITY SYSTEM
    // ============================================

    function updateSanity(amount) {
        state.sanity = Math.max(0, Math.min(100, state.sanity + amount));
        
        const percentage = state.sanity + '%';
        elements.sanityFill.style.width = percentage;
        elements.sanityFillGlow.style.width = percentage;
        elements.sanityValue.textContent = Math.round(state.sanity) + '%';
        
        // Update sanity bar color based on level
        if (state.sanity > 70) {
            elements.sanityFill.style.background = 'linear-gradient(90deg, var(--glow-green), #00cc33)';
        } else if (state.sanity > 40) {
            elements.sanityFill.style.background = 'linear-gradient(90deg, #ccaa00, #ffcc00)';
        } else if (state.sanity > 20) {
            elements.sanityFill.style.background = 'linear-gradient(90deg, #cc4400, #ff6600)';
        } else {
            elements.sanityFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
            document.body.classList.add('sanity-critical');
        }
        
        // Show warnings at critical levels
        if (state.sanity < 30 && state.sanity > 0) {
            showSanityWarning();
        }
        
        // Reality distortion at very low sanity
        if (state.sanity < CONFIG.realityWarpThreshold) {
            if (!state.realityDistorted) {
                state.realityDistorted = true;
                document.body.classList.add('reality-distorted');
            }
        } else {
            if (state.realityDistorted) {
                state.realityDistorted = false;
                document.body.classList.remove('reality-distorted');
            }
        }
    }

    function showSanityWarning() {
        const warnings = [
            'YOUR MIND IS FRAGMENTING',
            'THE ARCHIVE IS EATING YOUR THOUGHTS',
            'YOU SHOULD NOT BE HERE',
            'THE GEOMETRY IS WRONG',
            'IT SEES YOU',
            'REALITY IS THINNING'
        ];
        
        elements.sanityWarning.textContent = warnings[Math.floor(Math.random() * warnings.length)];
        elements.sanityWarning.style.opacity = '1';
        
        clearTimeout(state.whisperTimeout);
        state.whisperTimeout = setTimeout(() => {
            elements.sanityWarning.style.opacity = '0';
        }, 2000);
    }

    function startSanityDecay() {
        // Decay based on scroll depth
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            state.scrollDepth = scrollPercent;
            
            if (scrollPercent > state.maxScrollDepth) {
                state.maxScrollDepth = scrollPercent;
                updateSanity(-CONFIG.sanityDecayRate * (scrollPercent / 100));
            }
        });
        
        // Slow recovery when not scrolling
        setInterval(() => {
            if (state.scrollDepth < 5 && state.sanity < 100) {
                updateSanity(CONFIG.sanityRecoveryRate);
            }
        }, 1000);
    }

    function startRealityWarp() {
        setInterval(() => {
            if (state.sanity < CONFIG.realityWarpThreshold && Math.random() > 0.7) {
                const entries = document.querySelectorAll('.catalog-entry');
                const randomEntry = entries[Math.floor(Math.random() * entries.length)];
                if (randomEntry) {
                    randomEntry.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg) translateY(${(Math.random() - 0.5) * 20}px)`;
                    setTimeout(() => {
                        randomEntry.style.transform = '';
                    }, 200);
                }
            }
        }, 3000);
    }

    function startWhispers() {
        setInterval(() => {
            if (state.sanity < 60 && Math.random() > 0.8) {
                const whisper = document.createElement('div');
                whisper.className = 'whisper';
                whisper.textContent = VOID_WHISPERS[Math.floor(Math.random() * VOID_WHISPERS.length)];
                whisper.style.cssText = `
                    position: fixed;
                    bottom: 20%;
                    left: ${Math.random() * 80 + 10}%;
                    font-family: var(--font-elegant);
                    font-size: 14px;
                    color: var(--ghost-blue);
                    opacity: 0;
                    pointer-events: none;
                    z-index: 100;
                    transition: opacity 2s ease;
                    font-style: italic;
                `;
                document.body.appendChild(whisper);
                
                requestAnimationFrame(() => {
                    whisper.style.opacity = '0.3';
                });
                
                setTimeout(() => {
                    whisper.style.opacity = '0';
                    setTimeout(() => whisper.remove(), 2000);
                }, 4000);
            }
        }, 8000);
    }

    // ============================================
    // CATALOG ENTRY GENERATION
    // ============================================

    function createCatalogEntries() {
        if (!elements.catalogGrid) return;
        
        const fragment = document.createDocumentFragment();
        
        CATALOG_DATA.forEach((entry, index) => {
            const article = document.createElement('article');
            article.className = 'catalog-entry';
            article.setAttribute('data-index', index);
            article.setAttribute('data-classification', entry.classification);
            article.style.animationDelay = `${index * 0.1}s`;
            
            article.innerHTML = `
                <div class="entry-header">
                    <span class="entry-classification classification-${entry.classification}">${entry.classification}</span>
                    <span class="entry-id">REF: ${entry.id}</span>
                </div>
                <h3 class="entry-title" data-title="${entry.title}">${entry.title}</h3>
                <p class="entry-excerpt">${entry.excerpt.substring(0, 100)}...</p>
                <div class="entry-meta">
                    <span class="entry-origin">${entry.origin}</span>
                    <span class="entry-date">${entry.date}</span>
                </div>
            `;
            
            fragment.appendChild(article);
        });
        
        elements.catalogGrid.appendChild(fragment);
        state.entriesLoaded = true;
    }

    function animateEntryReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.style.transform || 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.catalog-entry').forEach((entry, index) => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(30px)';
            entry.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(entry);
        });
    }

    // ============================================
    // TEXT CORRUPTION EFFECTS
    // ============================================

    function corruptText(element, intensity = 1) {
        if (!element || state.sanity > 80) return;
        
        const originalText = element.getAttribute('data-original') || element.textContent;
        if (!element.getAttribute('data-original')) {
            element.setAttribute('data-original', originalText);
        }
        
        if (Math.random() > CONFIG.corruptionChance * intensity) return;
        
        const chars = originalText.split('');
        const corruptedChars = chars.map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (Math.random() > 0.9 * intensity) {
                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
            return char;
        });
        
        element.textContent = corruptedChars.join('');
        
        // Restore after short delay
        setTimeout(() => {
            if (element.getAttribute('data-original')) {
                element.textContent = element.getAttribute('data-original');
            }
        }, 100 + Math.random() * 200);
    }

    function setupCorruptionListeners() {
        document.querySelectorAll('.entry-title').forEach(title => {
            title.addEventListener('mouseenter', () => {
                const intensity = 1 + (100 - state.sanity) / 50;
                corruptText(title, intensity);
            });
            
            title.addEventListener('mouseleave', () => {
                const original = title.getAttribute('data-original');
                if (original) {
                    title.textContent = original;
                }
            });
        });
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    function performSearch(query) {
        if (!elements.searchResults) return;
        
        state.searchQuery = query.toLowerCase();
        elements.searchResults.innerHTML = '';
        elements.searchResults.classList.add('active');
        
        if (!query.trim()) {
            elements.searchResults.classList.remove('active');
            return;
        }
        
        // Search through catalog
        const results = CATALOG_DATA.filter(entry => {
            return entry.title.toLowerCase().includes(state.searchQuery) ||
                   entry.description.toLowerCase().includes(state.searchQuery) ||
                   entry.excerpt.toLowerCase().includes(state.searchQuery);
        });
        
        // Display results
        if (results.length > 0) {
            results.forEach((result, index) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.style.animationDelay = `${index * 0.1}s`;
                resultItem.innerHTML = `
                    <div class="result-classification classification-${result.classification}">${result.classification}</div>
                    <div class="result-title">${result.title}</div>
                    <div class="result-excerpt">${result.excerpt.substring(0, 80)}...</div>
                `;
                
                resultItem.addEventListener('click', () => openModal(result));
                elements.searchResults.appendChild(resultItem);
            });
        } else {
            // Disturbing "no results" messages
            const noResult = document.createElement('div');
            noResult.className = 'search-result-item search-disturbing';
            noResult.innerHTML = `
                <div class="result-title">The archive holds its breath...</div>
                <div class="result-excerpt">${DISTURBING_SEARCH_RESPONSES[Math.floor(Math.random() * DISTURBING_SEARCH_RESPONSES.length)]}</div>
            `;
            elements.searchResults.appendChild(noResult);
            
            // Drain sanity for fruitless searches
            updateSanity(-2);
        }
        
        // Drain sanity for any search
        updateSanity(-1);
    }

    // ============================================
    // MODAL SYSTEM
    // ============================================

    function openModal(entry) {
        if (!elements.entryModal) return;
        
        state.modalOpen = true;
        
        elements.modalTitle.textContent = entry.title;
        elements.modalTitle.setAttribute('data-original', entry.title);
        elements.modalId.textContent = entry.id;
        elements.modalClassification.textContent = entry.classification;
        elements.modalClassification.className = `modal-classification classification-${entry.classification}`;
        elements.modalDate.textContent = entry.date;
        elements.modalOrigin.textContent = entry.origin;
        elements.modalCondition.textContent = entry.condition;
        elements.modalDescription.textContent = entry.description;
        elements.modalExcerpt.textContent = entry.excerpt;
        elements.modalWitness.textContent = entry.witness;
        
        elements.entryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Start corruption effect on modal content
        startModalCorruption();
        
        // Drain sanity for reading forbidden content
        if (entry.classification === 'forbidden') {
            updateSanity(-5);
        } else if (entry.classification === 'unknown') {
            updateSanity(-3);
        }
    }

    function closeModal() {
        if (!elements.entryModal) return;
        
        state.modalOpen = false;
        elements.entryModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop corruption
        if (state.modalCorruptionInterval) {
            clearInterval(state.modalCorruptionInterval);
            state.modalCorruptionInterval = null;
        }
    }

    function startModalCorruption() {
        if (state.modalCorruptionInterval) {
            clearInterval(state.modalCorruptionInterval);
        }
        
        state.modalCorruptionInterval = setInterval(() => {
            if (!state.modalOpen) {
                clearInterval(state.modalCorruptionInterval);
                return;
            }
            
            const intensity = 1 + (100 - state.sanity) / 30;
            
            // Corrupt title
            corruptText(elements.modalTitle, intensity);
            
            // Occasionally corrupt description
            if (Math.random() > 0.7) {
                const words = elements.modalDescription.textContent.split(' ');
                const randomIndex = Math.floor(Math.random() * words.length);
                if (words[randomIndex].length > 3) {
                    words[randomIndex] = words[randomIndex].split('').map((char, i) => {
                        if (Math.random() > 0.8) {
                            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                        }
                        return char;
                    }).join('');
                    elements.modalDescription.textContent = words.join(' ');
                }
            }
            
            // Corrupt witness testimony at low sanity
            if (state.sanity < 40 && Math.random() > 0.5) {
                corruptText(elements.modalWitness, 2);
            }
        }, 500);
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    function setupEventListeners() {
        // Search
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                performSearch(e.target.value);
            });
            
            elements.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    elements.searchInput.value = '';
                    elements.searchResults.classList.remove('active');
                }
            });
        }
        
        if (elements.searchBtn) {
            elements.searchBtn.addEventListener('click', () => {
                performSearch(elements.searchInput.value);
            });
        }
        
        // Modal close
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }
        
        if (elements.entryModal) {
            elements.entryModal.addEventListener('click', (e) => {
                if (e.target === elements.entryModal || e.target.classList.contains('modal-backdrop')) {
                    closeModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.modalOpen) {
                closeModal();
            }
        });
        
        // Catalog entry clicks
        document.querySelectorAll('.catalog-entry').forEach(entry => {
            entry.addEventListener('click', () => {
                const index = parseInt(entry.getAttribute('data-index'));
                const entryData = CATALOG_DATA[index];
                if (entryData) {
                    openModal(entryData);
                }
            });
        });
        
        // Setup corruption after entries are created
        setTimeout(setupCorruptionListeners, 100);
        
        // Hover effects for entries
        document.querySelectorAll('.catalog-entry').forEach(entry => {
            entry.addEventListener('mouseenter', () => {
                const classification = entry.getAttribute('data-classification');
                if (classification === 'forbidden' || classification === 'unknown') {
                    updateSanity(-0.5);
                }
            });
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // ============================================
    // START THE ARCHIVE
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();