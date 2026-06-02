/* VOID-SCRIPT: THE COGNITIVE DECAY ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let state = {
        sanity: 100,
        isDecaying: false,
        searchAttempts: 0,
        glitchInterval: null
    };

    const sanityFill = document.getElementById('sanity-fill');
    const sanityStatus = document.getElementById('sanity-status');
    const archiveMain = document.getElementById('archive-main');
    const searchInput = document.getElementById('archive-search');
    const searchBtn = document.getElementById('search-btn');
    const searchFeedback = document.getElementById('search-feedback');
    const tendrils = document.querySelectorAll('.tendril');

    // Forbidden glyphs for text corruption
    const voidGlyphs = ['Ϛ', 'Ѫ', '҂', '☿', '⚝', '♾', '⚙', '☠', '🕀', '🕁', '🕂', '🕃', '🕄', '🕅', '🕇', '🕈', '🕉', '🕊', '🕋', '🕌', '🕍', '🕎', '🕏', '⩔', '⩕', '⩖', '⩗'];

    // --- Sanity Logic ---
    const updateSanity = (amount) => {
        state.sanity = Math.max(0, state.sanity + amount);
        
        // Update UI
        sanityFill.style.width = `${state.sanity}%`;
        
        if (state.sanity > 70) {
            sanityStatus.innerText = "STABLE";
            sanityStatus.style.color = "var(--text-color)";
            archiveMain.className = "";
        } else if (state.sanity > 30) {
            sanityStatus.innerText = "FRAGMENTING";
            sanityStatus.style.color = "orange";
            archiveMain.className = "decay-1";
        } else if (state.sanity > 0) {
            sanityStatus.innerText = "CRITICAL";
            sanityStatus.style.color = "var(--warning-color)";
            archiveMain.className = "decay-2";
        } else {
            sanityStatus.innerText = "VOID-TOUCHED";
            sanityStatus.style.color = "white";
            archiveMain.className = "decay-3";
            triggerTotalCollapse();
        }

        // Tendrils grow inward as sanity drops
        const growth = (100 - state.sanity) / 5;
        tendrils.forEach(t => {
            t.style.transform = `scale(${1 + growth/10})`;
        });
    };

    // --- Text Corruption Effect ---
    const corruptText = (element) => {
        const originalText = element.innerText;
        const chars = originalText.split('');
        
        // Probability of corruption increases as sanity drops
        const corruptionChance = (100 - state.sanity) / 100;
        
        const corrupted = chars.map(char => {
            if (char === ' ' ) return char;
            return Math.random() < corruptionChance 
                ? voidGlyphs[Math.floor(Math.random() * voidGlyphs.length)] 
                : char;
        }).join('');

        element.innerText = corrupted;
    };

    // Apply corruption to all .corrupt-text elements periodically
    const startCorruptionCycle = () => {
        if (state.glitchInterval) return;
        state.glitchInterval = setInterval(() => {
            document.querySelectorAll('.corrupt-text').forEach(el => {
                corruptText(el);
            });
        }, 150);
    };

    // --- The Forbidden Search ---
    const voidResponses = [
        "The archive does not recognize that query.",
        "Searching for that is... unwise.",
        "The words you seek have been eaten.",
        "I can hear you breathing through the screen.",
        "STOP ASKING.",
        "THERE IS NOTHING LEFT HERE BUT THE HUM.",
        "Your curiosity is a beacon for things that hunger."
    ];

    searchBtn.addEventListener('click', () => {
        state.searchAttempts++;
        updateSanity(-5);
        
        const query = searchInput.value.trim();
        if (!query) return;

        // Mimic "processing"
        searchFeedback.innerText = "Querying the Void...";
        
        setTimeout(() => {
            const responseIndex = Math.min(state.searchAttempts - 1, voidResponses.length - 1);
            searchFeedback.innerText = voidResponses[responseIndex];
            searchInput.value = "";
            
            // Shake the screen on "aggressive" responses
            if (state.searchAttempts > 3) {
                archiveMain.style.animation = "shake 0.2s 3";
                setTimeout(() => archiveMain.style.animation = "", 600);
            }
        }, 800);
    });

    // --- Interaction Listeners ---
    
    // Sanity cost for interacting with entries
    document.querySelectorAll('.archive-entry').forEach(entry => {
        entry.addEventListener('mouseenter', () => {
            const cost = parseInt(entry.getAttribute('data-sanity-cost'));
            updateSanity(-cost / 10); // Slight decay on hover
            
            // Visual jitter on hover
            entry.style.transform = `rotate(${Math.random() * 2 - 1}deg) scale(1.02)`;
        });
    });

    // Eye Tracking Logic
    document.addEventListener('mousemove', (e) => {
        const pupil = document.querySelector('.eye-pupil');
        if (!pupil) return;

        const rect = pupil.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = Math.min(15, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 10);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });

    // Scroll-based decay
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        updateSanity(-scrollPercent * 0.1); // Slow decay as they go deeper
    });

    // --- End Game: Total Collapse ---
    const triggerTotalCollapse = () => {
        document.body.style.transition = "all 5s ease";
        document.body.style.filter = "invert(1) contrast(2)";
        
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="display:flex; justify-content:center; align-items:center; height:100vh; color:white; font-family:monospace; text-align:center; padding: 20px;">
                    <div>
                        <h1 style="font-size: 3rem; margin-bottom: 20px;">COGNITIVE COLLAPSE COMPLETE</h1>
                        <p>You have seen too much. The Void now sees you.</p>
                        <button onclick="location.reload()" style="margin-top: 30px; background:none; border: 1px solid white; color: white; padding: 10px 20px; cursor: pointer;">RECONSTRUCT MIND</button>
                    </div>
                </div>
            `;
        }, 3000);
    };

    // Initiate corruption if sanity drops below 50
    setInterval(() => {
        if (state.sanity < 50) {
            startCorruptionCycle();
        }
    }, 1000);
});