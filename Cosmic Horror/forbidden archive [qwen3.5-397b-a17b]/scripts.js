document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        sanity: 100,
        isSearching: false,
        scrollDepth: 0
    };

    const glyphs = ['†', '‡', 'Ø', '§', '¶', '¥', '€', '£', '©', '®', '™', 'µ', '¿', '¡', '∞', '∆', 'Ω', 'π', '∑', '√', '∫', '∂', '∇', '∈', '∉', '∩', '∪', '⊂', '⊃', '⊆', '⊇', '⊕', '⊗', '⊥', '⊤', '⊢', '⊣', '⊨', '⊩', '⊪', '⊫', '⊬', '⊭', '⊮', '⊯', '⊰', '⊱', '⊲', '⊳', '⊴', '⊵', '⊶', '⊷', '⊸', '⊹', '⊺', '⊻', '⊼', '⊽', '⊾', '⊿', '⋀', '⋁', '⋂', '⋃', '⋄', '⋅', '⋆', '⋇', '⋈', '⋉', '⋊', '⋋', '⋌', '⋍', '⋎', '⋏', '⋐', '⋑', '⋒', '⋓', '⋔', '⋕', '⋖', '⋗', '⋘', '⋙', '⋚', '⋛', '⋜', '⋝', '⋞', '⋟', '⋠', '⋡', '⋢', '⋣', '⋤', '⋥', '⋦', '⋧', '⋨', '⋩', '⋪', '⋫', '⋬', '⋭', '⋮', '⋯', '⋰', '⋱'];
    
    const disturbingMessages = [
        "THEY SEE YOU SCROLLING",
        "DON'T LOOK BEHIND YOU",
        "YOUR MIND IS FRAGILE",
        "DATA CORRUPTION DETECTED",
        "CONNECTION TO VOID LOST",
        "RUN WHILE YOU CAN",
        "IT IS TOO LATE",
        "THE ARCHIVE IS HUNGRY"
    ];

    // --- SANITY MANAGER ---
    class SanityManager {
        constructor() {
            this.fill = document.getElementById('sanity-fill');
            this.percent = document.getElementById('sanity-percent');
            this.container = document.getElementById('sanity-container');
            this.updateVisuals();
        }

        decrease(amount) {
            state.sanity = Math.max(0, state.sanity - amount);
            this.updateVisuals();
            this.triggerHallucinations();
        }

        updateVisuals() {
            if (!this.fill || !this.percent) return;
            
            this.fill.style.width = `${state.sanity}%`;
            this.percent.textContent = `${Math.floor(state.sanity)}%`;

            // Color shift based on sanity
            if (state.sanity > 60) {
                this.fill.style.backgroundColor = 'var(--eldritch-green)';
                this.fill.style.boxShadow = '0 0 5px var(--eldritch-green)';
            } else if (state.sanity > 30) {
                this.fill.style.backgroundColor = '#ffaa00';
                this.fill.style.boxShadow = '0 0 5px #ffaa00';
            } else {
                this.fill.style.backgroundColor = '#ff0000';
                this.fill.style.boxShadow = '0 0 10px #ff0000';
                if(this.container) this.container.style.borderColor = '#ff0000';
            }
        }

        triggerHallucinations() {
            if (!document.body) return;

            if (state.sanity < 50) {
                const hue = Math.random() * 40 - 20;
                const contrast = 1 + (50 - state.sanity) / 100;
                document.body.style.filter = `hue-rotate(${hue}deg) contrast(${contrast})`;
            } else {
                document.body.style.filter = 'none';
            }

            if (state.sanity < 20) {
                const rotate = Math.random() * 2 - 1;
                document.body.style.transform = `rotate(${rotate}deg)`;
            } else {
                document.body.style.transform = 'rotate(0deg)';
            }
        }
    }

    const sanityManager = new SanityManager();

    // --- TEXT CORRUPTOR ---
    class TextCorruptor {
        constructor() {
            this.elements = document.querySelectorAll('.corruptible, h1, h2, p, .subtitle');
            this.init();
        }

        init() {
            this.elements.forEach(el => {
                // Store original text immediately
                if (!el.dataset.original && el.innerText) {
                    el.dataset.original = el.innerText;
                }
                el.addEventListener('mouseenter', () => this.corruptElement(el));
                el.addEventListener('mouseleave', () => this.restoreElement(el));
            });
        }

        corruptElement(el) {
            const original = el.dataset.original || el.innerText;
            if (!original) return;

            let corrupted = '';
            for (let i = 0; i < original.length; i++) {
                if (Math.random() < 0.4) {
                    corrupted += glyphs[Math.floor(Math.random() * glyphs.length)];
                } else {
                    corrupted += original[i];
                }
            }
            el.innerText = corrupted;
            
            // Glitch effect on text color
            el.style.color = 'var(--alert-red)';
            el.style.textShadow = '2px 0 var(--eldritch-green), -2px 0 var(--alert-red)';
        }

        restoreElement(el) {
            const original = el.dataset.original;
            if (original) {
                el.innerText = original;
            }
            el.style.color = '';
            el.style.textShadow = '';
        }
    }

    const textCorruptor = new TextCorruptor();

    // --- SEARCH SIMULATION ---
    const searchInput = document.getElementById('query-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                performDisturbingSearch(searchInput.value);
            }
        });
    }

    function performDisturbingSearch(query) {
        state.isSearching = true;
        searchResults.classList.remove('hidden');
        searchResults.innerHTML = `<div class="searching">CONNECTING TO VOID...</div>`;
        
        // Drain sanity rapidly
        sanityManager.decrease(15);

        setTimeout(() => {
            const results = generateDisturbingResults(query);
            searchResults.innerHTML = results;
            state.isSearching = false;
        }, 2000);
    }

    function generateDisturbingResults(query) {
        const templates = [
            `ENTRY FOUND: "${query}" IS A LIE. THE TRUE NAME IS ${generateGlyphString(5)}.`,
            `WARNING: SEARCHING FOR "${query}" HAS ALERTED THE SLEEPERS.`,
            `DATA FRAGMENT: "${query}" WAS ERASED IN 1994. HOW DO YOU KNOW THIS?`,
            `CONNECTION ESTABLISHED. "${query}" IS WATCHING YOU THROUGH THE SCREEN.`,
            `FILE CORRUPTED. "${query}" CONTAINS COGNITOHAZARD MATERIAL.`
        ];
        return templates.map(t => `<div class="search-result-item" style="margin-bottom:10px; border-left: 2px solid var(--alert-red); padding-left: 10px;">${t}</div>`).join('');
    }

    function generateGlyphString(length) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        return str;
    }

    // --- SCROLL LISTENER ---
    window.addEventListener('scroll', () => {
        const scrollTotal = window.innerHeight + window.scrollY;
        const maxScroll = document.body.scrollHeight;
        const scrollPercent = (scrollTotal / maxScroll) * 100;

        // Drain sanity based on scroll depth
        if (scrollPercent > state.scrollDepth) {
            sanityManager.decrease(0.05);
        }
        state.scrollDepth = scrollPercent;

        // Random glitch triggers
        if (Math.random() < 0.02 && state.sanity < 80) {
            triggerRandomGlitch();
        }
    });

    function triggerRandomGlitch() {
        document.body.classList.add('glitch-active');
        setTimeout(() => {
            document.body.classList.remove('glitch-active');
        }, 100);
    }

    // --- AMBIENT DISTURBANCE ---
    setInterval(() => {
        if (Math.random() < 0.3 && state.sanity < 90) {
            // Randomly change title
            const msg = disturbingMessages[Math.floor(Math.random() * disturbingMessages.length)];
            document.title = msg;
            setTimeout(() => {
                document.title = "THE ARCHIVE // NULL_VOID";
            }, 2000);
        }
    }, 10000);

    // Initialize with a slight sanity drain to set the mood
    setTimeout(() => {
        sanityManager.decrease(5);
    }, 1000);
});