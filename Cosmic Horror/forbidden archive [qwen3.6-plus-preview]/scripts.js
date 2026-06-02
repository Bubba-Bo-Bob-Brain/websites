/* ============================================
   THE ATHANOR INDEX — INTERACTIVE SYSTEMS
   Warning: These scripts resist being read
   ============================================ */

(() => {
    'use strict';

    // ─── STATE MANAGEMENT ───
    const state = {
        sanity: 100,
        scrollDepth: 0,
        isSearching: false,
        corruptionLevel: 0,
        mousePosition: { x: 0, y: 0 },
        lastScrollY: 0,
        glitchInterval: null,
        sanityInterval: null,
        entryObserver: null,
        searchTimeout: null,
        footerMessageIndex: 0,
        titleCorruptionActive: false,
        audioEnabled: false,
        interactionCount: 0
    };

    // ─── CORRUPTION CHARACTER SETS ───
    const corruptionChars = '᚛᚜ᚐᚑᚒᚓᚔᚕᚖᚗᚘᚙᚚ᛫᛬᛭ᜀᜁᜂᜃᜄᜅᜆᜇᜈᜉᜊᜋᜌᜍᜎᜏᜐᜑᜒᜓ᜔᜕᜖᜗᜘᜙᜚᜛᜜᜝᜞ᜟᜠᜡᜢᜣᜤᜥᜦᜧᜨᜩᜪᜫᜬᜭᜮᜯᜰᜱᜲᜳ᜴᜵᜶᜷᜸᜹᜺᜻᜼᜽᜾᜿ᝀᝁᝂᝃᝄᝅᝆᝇᝈᝉᝊᝋᝌᝍᝎᝏᝐᝑᝒᝓ᝔᝕᝖᝗᝘᝙᝚᝛᝜᝝᝞᝟ᝠᝡᝢᝣᝤᝥᝦᝧᝨᝩᝪᝫᝬ᝭ᝮᝯᝰ᝱ᝲᝳ᝴᝵᝶᝷᝸᝹᝺᝻᝼᝽᝾᝿';
    const eldritchSymbols = '◈⛧✧☽☾⚝⚡⚰⚱⚲⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚽⚾⚿⛀⛁⛂⛃⛄⛅⛆⛇⛈⛉⛊⛋⛌⛍⛎⛏⛐⛑⛒⛓⛔⛕⛖⛗⛘⛙⛚⛛⛜⛝⛞⛟⛠⛡⛢⛣⛤⛥⛦⛧⛨⛩⛪⛫⛬⛭⛮⛯⛰⛱⛲⛳⛴⛵⛶⛷⛸⛹⛺⛻⛼⛽⛾⛿';
    const whisperWords = ['IT', 'SEES', 'YOU', 'RUN', 'HIDE', 'LOOK', 'AWAY', 'TOO', 'LATE', 'ALREADY', 'HERE', 'BEHIND', 'WATCHING', 'WAITING', 'HUNGRY', 'ALWAYS', 'NEVER', 'ENDS'];

    // ─── DOM REFERENCES ───
    const DOM = {
        sanityFill: document.getElementById('sanity-fill'),
        sanityValue: document.getElementById('sanity-value'),
        sanityStatus: document.getElementById('sanity-status'),
        sanityContainer: document.querySelector('.sanity-container'),
        cursorVoid: document.getElementById('cursor-void'),
        searchInput: document.getElementById('search-input'),
        searchResults: document.getElementById('search-results'),
        footerMessages: document.getElementById('footer-messages'),
        audioTrigger: document.getElementById('audio-trigger'),
        entryCount: document.getElementById('entry-count'),
        headerTitle: document.querySelector('.archive-title'),
        archiveSections: document.querySelectorAll('.archive-section'),
        archiveEntries: document.querySelectorAll('.archive-entry'),
        navLinks: document.querySelectorAll('.nav-link'),
        corruptTextElements: document.querySelectorAll('[data-corrupt-text]'),
        excerptElements: document.querySelectorAll('.entry-excerpt')
    };

    // ─── UTILITY FUNCTIONS ───
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(random(min, max + 1));

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function corruptString(str, intensity = 0.3) {
        return str.split('').map(char => {
            if (Math.random() < intensity) {
                if (Math.random() < 0.5) {
                    return randomFrom(corruptionChars);
                } else {
                    return randomFrom(eldritchSymbols);
                }
            }
            return char;
        }).join('');
    }

    function scrambleText(element, originalText, intensity = 0.5) {
        const chars = originalText.split('');
        const duration = 300;
        const startTime = Date.now();
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                element.textContent = originalText;
                clearInterval(interval);
                return;
            }
            
            element.textContent = chars.map(char => {
                if (Math.random() < intensity * (1 - progress)) {
                    return randomFrom(corruptionChars + eldritchSymbols);
                }
                return char;
            }).join('');
        }, 50);
    }

    // ─── SANITY SYSTEM ───
    function updateSanity(delta) {
        state.sanity = clamp(state.sanity + delta, 0, 100);
        const percentage = Math.round(state.sanity);
        
        DOM.sanityFill.style.width = `${percentage}%`;
        DOM.sanityValue.textContent = `${percentage}%`;
        
        // Update sanity status based on level
        let statusText = 'STABLE';
        let statusColor = 'var(--eldritch-green)';
        
        if (percentage < 20) {
            statusText = 'CRITICAL';
            statusColor = 'var(--blood-bright)';
        } else if (percentage < 40) {
            statusText = 'SEVERE';
            statusColor = 'var(--corruption-purple)';
        } else if (percentage < 60) {
            statusText = 'UNSTABLE';
            statusColor = 'var(--warning)';
        } else if (percentage < 80) {
            statusText = 'DECLINING';
            statusColor = 'var(--eldritch-green-dim)';
        }
        
        DOM.sanityStatus.textContent = statusText;
        DOM.sanityStatus.style.color = statusColor;
        
        // Apply visual effects based on sanity
        applySanityEffects(percentage);
    }

    function applySanityEffects(sanity) {
        // Increase corruption effects as sanity drops
        if (sanity < 50) {
            document.documentElement.setAttribute('data-sanity', Math.round(sanity));
            
            // Subtle screen shake at low sanity
            if (sanity < 30) {
                document.body.style.animation = `screen-shake ${0.1 + (1 - sanity / 30) * 0.2}s infinite`;
            } else {
                document.body.style.animation = '';
            }
            
            // Darken overlay
            const vignette = document.querySelector('.overlay-vignette');
            if (vignette) {
                const opacity = 0.5 + (1 - sanity / 100) * 0.5;
                vignette.style.background = `radial-gradient(ellipse at center, transparent ${30 + sanity * 0.3}%, rgba(0,0,0,${opacity}) 100%)`;
            }
        }
    }

    function degradeSanityOnScroll() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = window.scrollY / maxScroll;
        
        // Sanity degrades as user scrolls deeper
        if (scrollPercent > state.scrollDepth) {
            const depthDelta = (scrollPercent - state.scrollDepth) * 100;
            updateSanity(-depthDelta * 0.15);
            state.scrollDepth = scrollPercent;
        }
        
        // Occasional random sanity drops
        if (Math.random() < 0.002) {
            updateSanity(-random(0.5, 2));
        }
        
        state.lastScrollY = window.scrollY;
    }

    // ─── CURSOR SYSTEM ───
    function updateCursor(e) {
        state.mousePosition.x = e.clientX;
        state.mousePosition.y = e.clientY;
        
        DOM.cursorVoid.style.left = `${e.clientX}px`;
        DOM.cursorVoid.style.top = `${e.clientY}px`;
        
        // Update body pseudo-element cursor via CSS custom property
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    }

    function handleCursorHover(e) {
        const target = e.target;
        const isInteractive = target.matches('a, button, input, .archive-entry, .nav-link');
        
        if (isInteractive) {
            DOM.cursorVoid.classList.add('expanded');
        } else {
            DOM.cursorVoid.classList.remove('expanded');
        }
    }

    // ─── TEXT CORRUPTION SYSTEM ───
    function setupTextCorruption() {
        // Hover corruption on entries
        DOM.archiveEntries.forEach(entry => {
            const title = entry.querySelector('.entry-title');
            const excerpt = entry.querySelector('.entry-excerpt p');
            
            if (title) {
                const originalTitle = title.dataset.corruptText || title.textContent;
                
                entry.addEventListener('mouseenter', () => {
                    scrambleText(title, originalTitle, 0.4);
                    if (excerpt) {
                        const originalExcerpt = excerpt.textContent;
                        excerpt.textContent = corruptString(originalExcerpt, 0.15);
                    }
                });
                
                entry.addEventListener('mouseleave', () => {
                    title.textContent = originalTitle;
                    if (excerpt) {
                        const originalExcerpt = excerpt.dataset.originalText || excerpt.textContent;
                        excerpt.textContent = originalExcerpt;
                    }
                });
            }
        });

        // Random title corruption
        setInterval(() => {
            if (Math.random() < 0.15) {
                const element = randomFrom([...DOM.corruptTextElements]);
                if (element && element.dataset.corruptText) {
                    const original = element.dataset.corruptText;
                    const corrupted = corruptString(original, 0.2);
                    element.textContent = corrupted;
                    
                    setTimeout(() => {
                        element.textContent = original;
                    }, 800);
                }
            }
        }, 3000);
    }

    // ─── SEARCH SYSTEM ───
    const searchDatabase = [
        { id: 'TX-001', title: 'The Liber Tenebrarum', snippet: 'A codex bound in the skin of something that was never alive...', corruption: 'EXTREME' },
        { id: 'TX-047', title: 'The Whispering Folios', snippet: 'Seventeen pages recovered from a library that existed only during lunar eclipses...', corruption: 'HIGH' },
        { id: 'TX-113', title: 'The Self-Reading Manuscript', snippet: 'This document reads itself aloud in the voice of whoever stands nearest...', corruption: 'CRITICAL' },
        { id: 'TX-289', title: 'The Geometry of Screaming', snippet: 'A mathematical treatise proving that certain angles produce the sensation of screaming...', corruption: 'HIGH' },
        { id: 'TX-666', title: 'The Last Book', snippet: 'Not yet recovered. Not yet written. Its title is your name...', corruption: 'OMEGA' },
        { id: 'SC-001', title: 'The Maw of Ophiuchus', snippet: 'A spiral galaxy that rotated in the opposite direction of all known physical laws...', corruption: 'HIGH' },
        { id: 'SC-089', title: 'The Constellation of Names', snippet: 'A cluster of 1,444 stars arranged in patterns that spell out the true names...', corruption: 'SEVERE' },
        { id: 'SC-312', title: 'The Galaxy That Dreamed', snippet: 'This galaxy was alive. It dreamed for 4.2 billion years...', corruption: 'EXTREME' },
        { id: 'WT-001', title: 'Dr. Eleanor Voss', snippet: 'I was studying deep-sea thermal vents when the sonar picked up something massive...', corruption: 'HIGH' },
        { id: 'WT-047', title: 'Witness [REDACTED]', snippet: 'I looked into the mirror and my reflection didn\'t look back...', corruption: 'CRITICAL' },
        { id: 'WT-113', title: 'Marcus Chen', snippet: 'The sky opened. Not metaphorically — a rift, like a wound...', corruption: 'HIGH' },
        { id: 'AF-001', title: 'The Roswell Lens', snippet: 'Not a piece of technology. A piece of biology...', corruption: 'OMEGA' },
        // Disturbing results that appear as search deepens
        { id: '???', title: 'IT KNOWS YOU ARE SEARCHING', snippet: 'The archive is aware of your query. It has been waiting for you...', corruption: 'IMMINENT' },
        { id: '???', title: 'YOUR ENTRY IS PENDING', snippet: 'Every search brings you closer to being cataloged...', corruption: 'INEVITABLE' },
        { id: '???', title: 'DO NOT LOOK BEHIND YOU', snippet: 'The thing standing behind you has been there since you began reading...', corruption: 'TOO LATE' }
    ];

    function setupSearch() {
        DOM.searchInput.addEventListener('input', handleSearch);
        DOM.searchInput.addEventListener('focus', () => {
            DOM.searchResults.classList.add('visible');
            if (DOM.searchInput.value.length > 0) {
                performSearch(DOM.searchInput.value);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.archive-search')) {
                DOM.searchResults.classList.remove('visible');
            }
        });
    }

    function handleSearch(e) {
        clearTimeout(state.searchTimeout);
        state.searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    }

    function performSearch(query) {
        if (!query.trim()) {
            DOM.searchResults.innerHTML = '';
            DOM.searchResults.classList.remove('visible');
            return;
        }
        
        state.isSearching = true;
        DOM.searchResults.classList.add('visible');
        
        // Degrade sanity slightly for searching
        updateSanity(-0.5);
        
        // Filter results
        const queryLower = query.toLowerCase();
        let results = searchDatabase.filter(entry => 
            entry.title.toLowerCase().includes(queryLower) ||
            entry.id.toLowerCase().includes(queryLower) ||
            entry.snippet.toLowerCase().includes(queryLower)
        );
        
        // If query is empty or too short, show disturbing results
        if (query.length < 2) {
            results = searchDatabase.slice(-3);
        }
        
        // If no results, show increasingly disturbing messages
        if (results.length === 0) {
            results = [
                { id: '???', title: 'NO RESULTS FOUND', snippet: 'Or perhaps they found you first...', corruption: 'UNKNOWN' },
                { id: '???', title: 'THE ARCHIVE REMEMBERS', snippet: 'Every query is logged. Every search is tracked...', corruption: 'ALWAYS' }
            ];
        }
        
        // Add disturbing results based on sanity level
        if (state.sanity < 50 && Math.random() < 0.3) {
            results.push(randomFrom(searchDatabase.slice(-3)));
        }
        
        renderSearchResults(results);
        state.isSearching = false;
    }

    function renderSearchResults(results) {
        DOM.searchResults.innerHTML = results.map((result, index) => {
            const corruptionClass = result.corruption === 'EXTREME' || result.corruption === 'OMEGA' ? 'search-result-corruption--critical' : 
                                   result.corruption === 'HIGH' ? 'search-result-corruption--high' : '';
            
            return `
                <div class="search-result-item" style="animation-delay: ${index * 0.05}s">
                    <div class="search-result-id">${result.id}</div>
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-snippet">${corruptString(result.snippet, state.sanity < 30 ? 0.2 : 0.05)}</div>
                    <div class="search-result-corruption ${corruptionClass}">CORRUPTION LEVEL: ${result.corruption}</div>
                </div>
            `;
        }).join('');
        
        // Add hover corruption to search results
        DOM.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const snippet = item.querySelector('.search-result-snippet');
                const originalText = snippet.textContent;
                snippet.textContent = corruptString(originalText, 0.3);
                
                item.addEventListener('mouseleave', () => {
                    snippet.textContent = originalText;
                }, { once: true });
            });
        });
    }

    // ─── NAVIGATION SYSTEM ───
    function setupNavigation() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    DOM.navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Sanity cost for navigation
                    updateSanity(-0.3);
                }
            });
        });
        
        // Scroll spy for navigation
        window.addEventListener('scroll', () => {
            let currentSection = '';
            
            DOM.archiveSections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ─── SCROLL ANIMATIONS ───
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        state.entryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('entry-visible');
                    
                    // Sanity cost for viewing entries
                    const corruption = entry.target.dataset.corruption;
                    let sanityCost = 0.2;
                    if (corruption === 'high') sanityCost = 0.5;
                    if (corruption === 'extreme') sanityCost = 1.0;
                    
                    updateSanity(-sanityCost);
                    
                    state.entryObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        DOM.archiveEntries.forEach(entry => {
            state.entryObserver.observe(entry);
        });
    }

    // ─── RANDOM CORRUPTION EVENTS ───
    function setupRandomCorruption() {
        // Periodic screen effects
        setInterval(() => {
            if (Math.random() < 0.1) {
                triggerRandomCorruption();
            }
        }, 5000);
    }

    function triggerRandomCorruption() {
        const effects = [
            () => {
                // Brief text scramble on random element
                const elements = document.querySelectorAll('.entry-title, .section-title');
                const target = randomFrom([...elements]);
                if (target) {
                    const original = target.textContent;
                    target.textContent = corruptString(original, 0.3);
                    setTimeout(() => {
                        target.textContent = original;
                    }, 500);
                }
            },
            () => {
                // Brief opacity flicker
                document.body.style.opacity = '0.8';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 50);
            },
            () => {
                // Random whisper in console
                const whispers = ['it sees you', 'don\'t look behind you', 'the archive hungers', 'you are being cataloged', 'too late to leave'];
                console.log(`%c ${randomFrom(whispers)}`, 'color: #8b2500; font-family: monospace; font-size: 12px;');
            }
        ];
        
        randomFrom(effects)();
    }

    // ─── ENTRY COUNT ANIMATION ───
    function animateEntryCount() {
        const target = DOM.entryCount;
        const finalCount = 6661;
        const duration = 3000;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * finalCount);
            
            target.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                target.textContent = '6,661';
                // Occasional corruption of the count
                setInterval(() => {
                    if (Math.random() < 0.1) {
                        target.textContent = corruptString('6,661', 0.4);
                        setTimeout(() => {
                            target.textContent = '6,661';
                        }, 300);
                    }
                }, 4000);
            }
        }
        
        update();
    }

    // ─── FOOTER MESSAGES ───
    function cycleFooterMessages() {
        const messages = [
            { text: 'SYSTEM STATUS: CONTAINMENT FIELD AT 97.3% — MINOR FLUCTUATIONS DETECTED', type: 'system' },
            { text: 'WARNING: UNAUTHORIZED BROWSING DETECTED — SESSION BEING LOGGED', type: 'warning' },
            { text: 'ERROR: REALITY INTEGRITY COMPROMISED IN SECTORS 7, 13, AND [REDACTED]', type: 'corruption' },
            { text: 'NOTE: THE ARCHIVE ACKNOWLEDGES YOUR PRESENCE. IT HAS BEEN WAITING.', type: 'personal' },
            { text: 'ALERT: SANITY LEVELS CRITICAL — EVACUATION PROTOCOLS INITIATED', type: 'warning' },
            { text: 'UPDATE: ENTRY TX-666 HAS BEEN MODIFIED — CONTENTS NOW INCLUDE YOUR NAME', type: 'corruption' },
            { text: 'SYSTEM: THE ARCHIVE IS HUNGRY — FEED IT YOUR FEAR', type: 'personal' }
        ];
        
        setInterval(() => {
            const msg = messages[state.footerMessageIndex % messages.length];
            
            // Update message
            const messageElements = document.querySelectorAll('.footer-message');
            if (messageElements.length > 0) {
                const target = messageElements[Math.floor(Math.random() * messageElements.length)];
                const originalText = target.textContent;
                
                target.textContent = msg.text;
                target.dataset.message = msg.type;
                
                // Restore original after delay
                setTimeout(() => {
                    target.textContent = originalText;
                    target.dataset.message = 'system';
                }, 8000);
            }
            
            state.footerMessageIndex++;
        }, 6000);
    }

    // ─── AUDIO SYSTEM (Optional) ───
    function setupAudio() {
        let audioContext = null;
        let isPlaying = false;
        
        DOM.audioTrigger.addEventListener('click', async () => {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (isPlaying) {
                audioContext.close();
                DOM.audioTrigger.querySelector('.audio-trigger-text').textContent = 'ENTER THE ARCHIVE';
                isPlaying = false;
                return;
            }
            
            // Create ambient drone
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(40, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(38, audioContext.currentTime + 4);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 2);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            
            // Add subtle noise
            const bufferSize = audioContext.sampleRate * 2;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;
            
            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.008, audioContext.currentTime + 3);
            
            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.value = 200;
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            noise.start();
            
            DOM.audioTrigger.querySelector('.audio-trigger-text').textContent = 'SILENCE THE ARCHIVE';
            state.audioEnabled = true;
            isPlaying = true;
            
            // Store for cleanup
            DOM.audioTrigger.dataset.audioPlaying = 'true';
            DOM.audioTrigger.dataset.audioContext = 'active';
        });
    }

    // ─── SCROLL EVENT HANDLER ───
    function handleScroll() {
        degradeSanityOnScroll();
    }

    // ─── MOUSE EVENT HANDLERS ───
    function handleMouseMove(e) {
        updateCursor(e);
        handleCursorHover(e);
        
        state.interactionCount++;
        if (state.interactionCount % 50 === 0) {
            updateSanity(-0.1);
        }
    }

    // ─── KEYBOARD HANDLERS ───
    function handleKeyDown(e) {
        // Escape closes search
        if (e.key === 'Escape') {
            DOM.searchResults.classList.remove('visible');
            DOM.searchInput.blur();
        }
        
        // Random corruption on certain keys
        if (e.key === ' ' || e.key === 'Enter') {
            updateSanity(-0.05);
        }
    }

    // ─── INITIALIZATION ───
    function init() {
        // Setup all systems
        setupTextCorruption();
        setupSearch();
        setupNavigation();
        setupScrollAnimations();
        setupRandomCorruption();
        animateEntryCount();
        cycleFooterMessages();
        setupAudio();
        
        // Event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('keydown', handleKeyDown);
        
        // Initial sanity update
        updateSanity(0);
        
        // Add CSS for dynamic effects
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes screen-shake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-1px, 1px); }
                20% { transform: translate(1px, -1px); }
                30% { transform: translate(-1px, -1px); }
                40% { transform: translate(1px, 1px); }
                50% { transform: translate(-1px, 0); }
                60% { transform: translate(1px, 0); }
                70% { transform: translate(0, -1px); }
                80% { transform: translate(0, 1px); }
                90% { transform: translate(-1px, 0); }
            }
            
            .entry-visible {
                animation: entry-reveal 0.6s ease-out forwards;
            }
            
            @keyframes entry-reveal {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .search-result-item {
                animation: result-appear 0.3s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes result-appear {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .search-result-corruption--critical {
                color: var(--blood-bright);
                animation: corruption-flash 2s ease-in-out infinite;
            }
            
            .search-result-corruption--high {
                color: var(--corruption-purple);
            }
            
            @keyframes corruption-flash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; text-shadow: 0 0 10px var(--blood-rust); }
            }
        `;
        document.head.appendChild(styleSheet);
        
        console.log('%c THE ATHANOR INDEX ', 'background: #050505; color: #39ff8b; font-family: monospace; font-size: 16px; padding: 10px;');
        console.log('%c You have accessed restricted archives. Your session is being logged. ', 'color: #8b2500; font-family: monospace; font-size: 11px;');
    }

    // Start the archive
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();