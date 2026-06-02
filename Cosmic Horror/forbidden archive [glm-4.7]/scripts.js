document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. STATE MANAGEMENT --- */
    const state = {
        sanity: 100,
        isCorrupted: false
    };

    /* --- 2. DOM ELEMENTS --- */
    const body = document.body;
    const sanityBar = document.getElementById('sanity-bar');
    const sanityText = document.getElementById('sanity-text');
    const searchInput = document.getElementById('void-search');
    const searchFeedback = document.getElementById('search-feedback');
    const corruptibleTexts = document.querySelectorAll('.corruptible');
    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');
    const examineBtns = document.querySelectorAll('.examine-btn');
    const innerEye = document.querySelector('.inner-eye');

    /* --- 3. EYE TRACKING (The Header) --- */
    // Moves the pupil of the sigil based on mouse position
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate percentage from center (-1 to 1)
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;
        
        // Limit movement range
        const moveRange = 15; 
        const xMove = xPos * moveRange;
        const yMove = yPos * moveRange;

        if(innerEye) {
            innerEye.style.transform = `translate(${xMove}px, ${yMove}px) scale(${1 + Math.abs(xPos + yPos) * 0.1})`;
        }
    });

    /* --- 4. SANITY METER SYSTEM --- */
    // Degrades sanity as the user scrolls down into the "deep"
    function updateSanity() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        
        // Calculate sanity: Starts at 100, drops to 0
        let currentSanity = Math.max(0, Math.floor(100 - (scrollPercent * 100)));
        
        // Add some randomness/jitter if sanity is low
        if (currentSanity < 30) {
            currentSanity -= Math.random() * 5;
        }

        state.sanity = Math.max(0, currentSanity);
        
        // Update UI
        sanityBar.style.width = `${state.sanity}%`;
        sanityText.innerText = `${Math.floor(state.sanity)}%`;

        // Visual feedback based on sanity thresholds
        if (state.sanity < 80) sanityBar.style.background = 'linear-gradient(90deg, #5e0b0b, #2a0a2e)';
        if (state.sanity < 40) sanityBar.style.background = '#000';
        if (state.sanity < 40) sanityBar.style.border = '1px solid #5e0b0b';
        
        // Global Body Class for deep effects
        if (state.sanity < 50) {
            body.classList.add('void-depth-2');
        } else {
            body.classList.remove('void-depth-2');
        }
    }

    window.addEventListener('scroll', updateSanity);

    /* --- 5. TEXT CORRUPTION ENGINE --- */
    // Scrambles text characters on hover
    const eldritchChars = 'ÆØΩΨΣΠΔΘΞΓß∂ƒ©®†‡µ¶•ªº¢€£¥¤';
    
    corruptibleTexts.forEach(textEl => {
        const originalText = textEl.innerText;
        let interval = null;

        textEl.addEventListener('mouseenter', () => {
            let iteration = 0;
            
            clearInterval(interval);
            
            interval = setInterval(() => {
                textEl.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return eldritchChars[Math.floor(Math.random() * eldritchChars.length)];
                    })
                    .join('');
                
                if (iteration >= originalText.length) { 
                    clearInterval(interval);
                }
                
                iteration += 1 / 2; // Speed of decoding
            }, 30);
        });

        textEl.addEventListener('mouseleave', () => {
            clearInterval(interval);
            // Optional: Leave it slightly scrambled if sanity is low
            if (state.sanity > 50) {
                textEl.innerText = originalText;
            }
        });
    });

    /* --- 6. SEARCH RITUAL --- */
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        clearTimeout(searchTimeout);
        searchFeedback.innerText = "CONSULTING THE VOID...";
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            if (query.length > 2) {
                performSearch(query);
            } else {
                searchFeedback.innerText = "";
            }
        }, 800);
    });

    function performSearch(query) {
        // Disturbing results that don't necessarily match
        const disturbingResults = [
            "ERROR: FRAGMENT TOO HORRIFIC TO RENDER",
            "FOUND: 1 TESTIMONY MATCHING [DEATH]",
            "WARNING: YOU HAVE SUMMONED SOMETHING",
            "RESULT: THE COLOR OUT OF SPACE",
            "NO MATCH FOUND IN YOUR TIMELINE",
            "QUERY REJECTED BY ARCHIVE KEEPER"
        ];

        // If sanity is low, results are more aggressive
        const resultIndex = state.sanity < 40 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * disturbingResults.length);
        
        searchFeedback.innerText = disturbingResults[resultIndex];
        
        // Flash effect on the feedback
        searchFeedback.style.color = '#5e0b0b';
        setTimeout(() => {
            searchFeedback.style.color = 'var(--color-sick-green)';
        }, 200);
    }

    /* --- 7. MODAL INTERACTION --- */
    examineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.artifact-card');
            const title = card.querySelector('h3').innerText;
            const ref = card.querySelector('.ref-id').innerText;
            const corruption = card.dataset.corruptionLevel;

            // Generate disturbing content based on corruption level
            let extraContent = '';
            if(corruption === 'high' || corruption === 'critical') {
                extraContent = `<br><br><span class="warning-text">CAUTION: PERCEPTION FILTER FAILING. DO NOT READ ALOUD.</span>`;
            }

            modalBody.innerHTML = `
                <h2 style="color:var(--color-bone); margin-bottom:0.5rem">${title}</h2>
                <span style="color:var(--color-rust); font-family:var(--font-terminal)">${ref}</span>
                <hr style="border:0; border-top:1px solid #333; margin:1rem 0;">
                <p style="font-size:1.1rem; line-height:1.8">
                    The fragment unfurls before you. The ink seems to writhe across the page. 
                    Concepts that have no name in human language press against the glass of your understanding. 
                    ${extraContent}
                </p>
                <p style="margin-top:1rem; opacity:0.6">[TRANSCRIPT CORRUPTED - SANITY LOSS DETECTED]</p>
            `;

            modal.classList.add('active');
            
            // Opening modal damages sanity
            state.sanity = Math.max(0, state.sanity - 10);
            updateSanity();
        });
    });

    function closeModal() {
        modal.classList.remove('active');
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    /* --- 8. RANDOM GLITCHES --- */
    // Occasionally causes a visual disturbance on the page
    function randomGlitch() {
        if (Math.random() > 0.95 && state.sanity < 70) {
            body.style.transform = `skewX(${Math.random() * 2 - 1}deg)`;
            setTimeout(() => {
                body.style.transform = 'skewX(0)';
            }, 100);
        }
    }

    setInterval(randomGlitch, 1000);

});