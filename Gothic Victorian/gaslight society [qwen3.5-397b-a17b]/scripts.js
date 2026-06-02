document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const PASSPHRASE = "lumos";
    const SANCTUM = document.getElementById('sanctum');
    const VEIL = document.getElementById('veil');
    const ENTRY_FORM = document.getElementById('entry-form');
    const PASS_INPUT = document.getElementById('passphrase');
    const CLOCK_ELEMENT = document.getElementById('clock-time');
    const NAV_ITEMS = document.querySelectorAll('.nav-item');
    const MEMBER_CARDS = document.querySelectorAll('.member-card');

    // --- 1. The Veil (Entry Mechanism) ---
    if (ENTRY_FORM) {
        ENTRY_FORM.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = PASS_INPUT.value.trim().toLowerCase();
            
            if (input === PASSPHRASE) {
                unlockSanctum();
            } else {
                shakeEnvelope();
            }
        });
    }

    function unlockSanctum() {
        // Visual feedback for success
        PASS_INPUT.style.borderColor = '#4a0404';
        PASS_INPUT.style.color = '#4a0404';

        // Fade out veil
        VEIL.classList.add('hidden');

        // Reveal Sanctum with delay
        SANCTUM.classList.remove('hidden');
        
        setTimeout(() => {
            SANCTUM.classList.add('visible');
            startClock();
            initScrollReveal();
        }, 1500);
    }

    function shakeEnvelope() {
        const envelope = document.querySelector('.envelope');
        if (!envelope) return;

        envelope.style.transform = 'rotate(-1deg) translateX(-10px)';
        setTimeout(() => { envelope.style.transform = 'rotate(-1deg) translateX(10px)'; }, 100);
        setTimeout(() => { envelope.style.transform = 'rotate(-1deg) translateX(-5px)'; }, 200);
        setTimeout(() => { envelope.style.transform = 'rotate(-1deg) translateX(0)'; }, 300);

        // Clear input and update placeholder
        PASS_INPUT.value = '';
        PASS_INPUT.placeholder = "Incorrect. Try again.";
        
        // Reset placeholder after a moment
        setTimeout(() => {
            PASS_INPUT.placeholder = "Enter Passphrase...";
        }, 2000);
    }

    // --- 2. The Grandfather Clock ---
    function startClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (CLOCK_ELEMENT) {
            CLOCK_ELEMENT.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // --- 3. Navigation & Hierarchy ---
    NAV_ITEMS.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            NAV_ITEMS.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked item
            item.classList.add('active');
            
            // Simulate content filtering (Visual only for this demo)
            const target = item.getAttribute('href').substring(1);
            console.log(`Navigating to Circle: ${target}`);
            
            // In a full implementation, this would filter the grid or load new content
            // For now, we just log the action to maintain the "mystery"
        });
    });

    // --- 4. Scroll Reveal Animation (The "Mist" lifting) ---
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        MEMBER_CARDS.forEach((card, index) => {
            // Set initial state for animation via JS to ensure no flash of unstyled content
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            // Staggered transition delay
            card.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
            
            observer.observe(card);
        });
    }

    // --- 5. Ambient Console Message ---
    console.log("%c The Order of the Gilded Aether awaits... ", "background: #2a0a0a; color: #d4af37; font-size: 14px; padding: 10px; border: 1px solid #d4af37;");
    console.log("Passphrase hint: lumos");
});