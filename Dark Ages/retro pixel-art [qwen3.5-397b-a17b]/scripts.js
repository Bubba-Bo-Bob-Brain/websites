/**
 * THE DARK AGES: DIGITAL CHRONICLE
 * Step 3: JavaScript Implementation
 * 
 * Features:
 * 1. Web Audio API Bell Synthesis (No external assets)
 * 2. Day/Night Cycle Logic
 * 3. Interactive Map Navigation
 * 4. Scroll Progress Indicator
 * 5. Retro Typewriter Effect for headers
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const config = {
        dayDuration: 60000, // Full cycle in ms (1 minute for demo purposes)
        bellDecay: 2.5,     // How long the bell rings
        bellFrequency: 220, // Base frequency (A3)
    };

    // --- STATE MANAGEMENT ---
    const state = {
        isNight: false,
        scrollProgress: 0
    };

    // --- DOM ELEMENTS ---
    const elements = {
        bellBtn: document.getElementById('bell-btn'),
        body: document.body,
        mapCells: document.querySelectorAll('.map-cell'),
        heroTitle: document.querySelector('.pixel-title'),
        nav: document.querySelector('.retro-nav')
    };

    // ==========================================
    // 1. AUDIO SYSTEM (Web Audio API)
    // ==========================================
    // We synthesize the sound to avoid external dependencies and ensure it works instantly.
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playBellSound = () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const t = audioCtx.currentTime;
        
        // Oscillator 1: Fundamental tone
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(config.bellFrequency, t);
        osc1.frequency.exponentialRampToValueAtTime(config.bellFrequency * 0.5, t + config.bellDecay);

        // Oscillator 2: Harmonic richness
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(config.bellFrequency * 2, t);
        osc2.frequency.exponentialRampToValueAtTime(config.bellFrequency, t + config.bellDecay);

        // Gain Node: Envelope (Attack, Decay, Sustain, Release)
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.8, t + 0.1); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + config.bellDecay); // Long decay

        // Connect graph
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Start/Stop
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + config.bellDecay);
        osc2.stop(t + config.bellDecay);

        // Visual Feedback
        triggerBellAnimation();
    };

    const triggerBellAnimation = () => {
        const bellIcon = elements.bellBtn.querySelector('.bell-icon');
        bellIcon.style.transform = 'rotate(20deg)';
        setTimeout(() => {
            bellIcon.style.transform = 'rotate(-20deg)';
            setTimeout(() => {
                bellIcon.style.transform = 'rotate(0deg)';
            }, 100);
        }, 100);
        
        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';
        flash.style.transition = 'opacity 0.5s';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 50);
    };

    // Event Listener for Bell
    if (elements.bellBtn) {
        elements.bellBtn.addEventListener('click', playBellSound);
    }

    // ==========================================
    // 2. DAY / NIGHT CYCLE
    // ==========================================
    const updateDayNightCycle = () => {
        const now = Date.now();
        const cyclePosition = (now % config.dayDuration) / config.dayDuration;
        
        // Determine if night (e.g., between 0.6 and 0.9 of the cycle)
        const isNightTime = cyclePosition > 0.6 && cyclePosition < 0.9;

        if (isNightTime && !state.isNight) {
            state.isNight = true;
            document.documentElement.style.setProperty('--bg-color', '#0a0a0a');
            document.documentElement.style.setProperty('--parchment', '#2a2a2a');
            document.documentElement.style.setProperty('--ink-black', '#e0e0e0');
            elements.heroTitle.style.textShadow = '0 0 10px #fff, 2px 2px 0px #333';
        } else if (!isNightTime && state.isNight) {
            state.isNight = false;
            document.documentElement.style.setProperty('--bg-color', '#1a1815');
            document.documentElement.style.setProperty('--parchment', '#d4c5a3');
            document.documentElement.style.setProperty('--ink-black', '#0f0f0f');
            elements.heroTitle.style.textShadow = '2px 2px 0px var(--royal-gold)';
        }
    };

    setInterval(updateDayNightCycle, 1000);

    // ==========================================
    // 3. INTERACTIVE MAP LOGIC
    // ==========================================
    elements.mapCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const tooltip = cell.getAttribute('data-tooltip');
            const locationName = cell.querySelector('span').innerText;
            
            // RPG Style Alert
            console.log(`Traveling to ${locationName}...`);
            
            // Visual feedback on the cell
            cell.style.backgroundColor = 'var(--blood-red)';
            setTimeout(() => {
                cell.style.backgroundColor = '';
                
                // Smooth scroll to a relevant section (mock logic for demo)
                // In a real app, this would map IDs to sections
                const targetId = locationName.toLowerCase() === 'castle' ? 'map' : 'life';
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    });

    // ==========================================
    // 4. SCROLL PROGRESS BAR
    // ==========================================
    const createProgressBar = () => {
        const bar = document.createElement('div');
        bar.id = 'progress-bar';
        bar.style.position = 'fixed';
        bar.style.top = '0';
        bar.style.left = '0';
        bar.style.height = '4px';
        bar.style.background = 'var(--blood-red)';
        bar.style.width = '0%';
        bar.style.zIndex = '10000';
        bar.style.transition = 'width 0.1s';
        bar.style.boxShadow = '0 0 10px var(--blood-red)';
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            bar.style.width = scrolled + "%";
        });
    };

    createProgressBar();

    // ==========================================
    // 5. TYPEWRITER EFFECT FOR TITLE
    // ==========================================
    const titleText = elements.heroTitle.innerText;
    elements.heroTitle.innerText = '';
    
    let charIndex = 0;
    const typeWriter = () => {
        if (charIndex < titleText.length) {
            elements.heroTitle.innerHTML += titleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100); // Speed of typing
        }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 500);

    // ==========================================
    // 6. DYNAMIC TAB TITLE
    // ==========================================
    const titles = ["THE DARK AGES", "BEWARE THE PLAGUE", "YEAR 1348", "PRAY FOR MERCY"];
    let titleIndex = 0;
    
    setInterval(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        document.title = titles[titleIndex];
    }, 3000);

});