/**
 * THE ARCHIVE OF THE VOID - JAVASCRIPT LOGIC
 * Handles: Sanity Degradation, Text Corruption, Scroll Animations, and Glitch Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SANITY_DECAY_RATE = 0.05; // Sanity lost per scroll tick
    const SANITY_REGEN_RATE = 0.02; // Sanity regained when still
    const MAX_SANITY = 100;
    const CRITICAL_THRESHOLD = 30;
    const WARNING_THRESHOLD = 60;

    // --- STATE ---
    let currentSanity = MAX_SANITY;
    let isScrolling = false;
    let scrollTimeout;
    let sanityInterval;

    // --- DOM ELEMENTS ---
    const sanityFill = document.getElementById('sanity-fill');
    const sanityLog = document.getElementById('sanity-log');
    const sanityStatus = document.querySelector('.status-indicator');
    const archiveItems = document.querySelectorAll('.archive-item');
    const searchInput = document.getElementById('corrupt-search');
    const searchBtn = document.querySelector('.search-btn');
    const modal = document.getElementById('corruption-modal');
    const modalContent = document.querySelector('.modal-content');

    // --- SANITY SYSTEM ---

    function updateSanityUI() {
        // Clamp value
        if (currentSanity < 0) currentSanity = 0;
        if (currentSanity > MAX_SANITY) currentSanity = MAX_SANITY;

        // Update Bar
        sanityFill.style.width = `${currentSanity}%`;

        // Update Color & Status
        sanityFill.style.background = getSanityColor(currentSanity);
        sanityFill.style.boxShadow = `0 0 ${currentSanity / 5}px ${getSanityColor(currentSanity)}`;

        // Update Status Text
        sanityStatus.className = 'status-indicator';
        if (currentSanity > WARNING_THRESHOLD) {
            sanityStatus.classList.add('status-stable');
            sanityStatus.textContent = 'STABLE';
        } else if (currentSanity > CRITICAL_THRESHOLD) {
            sanityStatus.classList.add('status-warn');
            sanityStatus.textContent = 'WARNING';
        } else {
            sanityStatus.classList.add('status-crit');
            sanityStatus.textContent = 'CRITICAL';
        }

        // Trigger visual glitches if critical
        if (currentSanity < CRITICAL_THRESHOLD) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(1.2)`;
            if (Math.random() > 0.95) triggerScreenGlitch();
        } else {
            document.body.style.filter = 'none';
        }
    }

    function getSanityColor(sanity) {
        if (sanity > WARNING_THRESHOLD) return '#a8ff60'; // Green
        if (sanity > CRITICAL_THRESHOLD) return '#ffcc00'; // Yellow
        return '#ff003c'; // Red
    }

    function logSanityEvent(message) {
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        sanityLog.prepend(p);
        if (sanityLog.children.length > 6) {
            sanityLog.lastElementChild.remove();
        }
    }

    // --- TEXT CORRUPTION ENGINE ---

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/';
    
    function corruptText(element, intensity = 1) {
        const originalText = element.dataset.original || element.textContent;
        if (!element.dataset.original) element.dataset.original = originalText;
        
        let iterations = 0;
        const maxIterations = 10;
        
        const interval = setInterval(() => {
            element.textContent = originalText.split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');
            
            iterations += 1 / intensity;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.textContent = originalText; // Reset to original or leave corrupted? Let's reset for readability unless critical
            }
        }, 30);
    }

    // --- SCROLL OBSERVER (Intersection Observer) ---

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Calculate sanity impact based on item data
                const impact = parseInt(entry.target.dataset.sanityImpact) || 0;
                if (impact > 0 && currentSanity > 0) {
                    currentSanity -= impact;
                    updateSanityUI();
                    logSanityEvent(`EXPOSURE DETECTED: -${impact}% INTEGRITY`);
                    
                    // Corrupt the title of the item viewed
                    const title = entry.target.querySelector('.item-title');
                    if (title) corruptText(title, 2);
                }
            }
        });
    }, observerOptions);

    archiveItems.forEach(item => observer.observe(item));

    // --- SCROLL HANDLER (Continuous Decay) ---

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                currentSanity -= SANITY_DECAY_RATE;
                updateSanityUI();
                isScrolling = false;
            });
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Regenerate sanity when user stops scrolling
            currentSanity += SANITY_REGEN_RATE;
            updateSanityUI();
        }, 100);
    });

    // --- SEARCH CORRUPTION ---

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        // Randomly swap characters for effect
        if (Math.random() > 0.8) {
            e.target.value = val.split('').map(char => Math.random() > 0.9 ? CHARS[Math.floor(Math.random() * CHARS.length)] : char).join('');
        }
    });

    searchBtn.addEventListener('click', () => {
        if (currentSanity < CRITICAL_THRESHOLD) {
            // Trigger Modal if sanity is low
            modal.classList.add('active');
            logSanityEvent('ATTEMPTED ACCESS: DENIED');
        } else {
            // Simulate search
            const originalPlaceholder = searchInput.placeholder;
            searchInput.placeholder = "SEARCHING THE VOID...";
            setTimeout(() => {
                searchInput.value = "";
                searchInput.placeholder = "NO RESULTS FOUND IN THIS DIMENSION";
                logSanityEvent('QUERY FAILED: ENTITY NOT FOUND');
                setTimeout(() => {
                    searchInput.placeholder = originalPlaceholder;
                }, 3000);
            }, 1500);
        }
    });

    // --- SCREEN GLITCH EFFECT ---

    function triggerScreenGlitch() {
        document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        setTimeout(() => {
            document.body.style.transform = 'none';
        }, 50);
    }

    // --- MODAL INTERACTION ---

    modal.addEventListener('click', () => {
        modal.classList.remove('active');
        // Penalty for trying to bypass
        currentSanity -= 10;
        updateSanityUI();
        logSanityEvent('FORCED CLOSURE: SANITY DRAIN');
    });

    // --- INITIAL LOG ---
    setTimeout(() => logSanityEvent('ARCHIVE SYSTEM ONLINE'), 500);
    setTimeout(() => logSanityEvent('WARNING: REALITY STABILITY AT 98%'), 1200);

    // --- RANDOM BACKGROUND AMBIENCE ---
    setInterval(() => {
        if (Math.random() > 0.9) {
            const overlay = document.querySelector('.overlay-noise');
            overlay.style.opacity = Math.random() * 0.2 + 0.1;
            setTimeout(() => {
                overlay.style.opacity = '0.08';
            }, 100);
        }
    }, 2000);

    // --- MOUSE TRACKING (Subtle parallax on cards) ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        archiveItems.forEach(item => {
            // Only apply if visible
            if (item.classList.contains('visible')) {
                item.style.transform = `perspective(1000px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
            }
        });
    });
});