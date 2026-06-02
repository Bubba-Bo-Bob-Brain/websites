// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const bootDuration = 2500; // ms
    const statTargets = document.querySelectorAll('.stat-value');
    const statBars = document.querySelectorAll('.stat-fill');
    const clockElement = document.getElementById('clock');
    const bootProgress = document.getElementById('boot-progress');
    const loadPercentText = document.getElementById('load-percent');
    const bootSequence = document.getElementById('boot-sequence');
    const mainInterface = document.getElementById('main-interface');
    const headlines = document.querySelectorAll('.headline-massive, .sub-headline');

    // --- 1. Boot Sequence ---
    let startTime = null;

    function animateBoot(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / bootDuration, 1);
        const percent = Math.floor(progress * 100);

        // Update visual progress bar
        bootProgress.style.width = `${percent}%`;
        loadPercentText.textContent = `${percent}%`;

        if (progress < 1) {
            requestAnimationFrame(animateBoot);
        } else {
            // Boot complete
            setTimeout(() => {
                bootSequence.classList.add('hidden');
                mainInterface.style.opacity = '1';
                initStats();
                startGlitchEffect();
                updateClock(); // Start clock immediately
                setInterval(updateClock, 1000);
                setInterval(injectRandomTickerItem, 15000); // Add news every 15s
            }, 500);
        }
    }

    requestAnimationFrame(animateBoot);

    // --- 2. Live Clock ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        if (clockElement) {
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // --- 3. Stat Counters Animation ---
    function initStats() {
        statTargets.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            const bar = statBars[index];
            let current = 0;
            const increment = target / 50; // Speed of count

            const countUp = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    stat.textContent = Math.floor(current);
                    if (bar) bar.style.width = `${Math.min(current, 100)}%`;
                    requestAnimationFrame(countUp);
                } else {
                    stat.textContent = target;
                    if (bar) bar.style.width = `${Math.min(target, 100)}%`;
                }
            };
            // Stagger the start slightly
            setTimeout(countUp, index * 300);
        });
    }

    // --- 4. Glitch Text Effect ---
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    function startGlitchEffect() {
        headlines.forEach(headline => {
            const originalText = headline.textContent;
            let iterations = 0;
            
            // Trigger glitch randomly or on hover
            headline.addEventListener('mouseover', () => {
                let iterationCount = 0;
                const maxIterations = 10;
                
                const interval = setInterval(() => {
                    headline.textContent = headline.textContent
                        .split('')
                        .map((char, index) => {
                            if (index < iterationCount) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    iterationCount += 1/3; // Speed of reveal
                    
                    if (iterationCount >= originalText.length) {
                        clearInterval(interval);
                        headline.textContent = originalText;
                    }
                }, 30);
            });
        });
    }

    // --- 5. Dynamic Ticker Injection ---
    const extraNews = [
        "AUTOMATED HARVESTERS DEPLOYED TO SECTOR 9",
        "NEW FUSION REACTOR ONLINE: EFFICIENCY 102%",
        "CITIZEN MORALE AT ALL-TIME HIGH",
        "ATMOSPHERIC SCRUBBERS OPERATING AT MAX CAPACITY",
        "TRANSPORT TUBES CLEARED FOR INTER-CITY TRAVEL",
        "ROBOTICS DIVISION REPORTS ZERO DOWNTIME",
        "STATE ARCHIVES UPDATED WITH NEW DISCOVERIES"
    ];

    function injectRandomTickerItem() {
        const tickerContainer = document.querySelector('.ticker');
        if (!tickerContainer) return;

        const newItem = document.createElement('div');
        newItem.className = 'ticker-item';
        const randomNews = extraNews[Math.floor(Math.random() * extraNews.length)];
        newItem.textContent = `+++ ${randomNews} +++`;
        
        // Add a highlight effect
        newItem.style.color = 'var(--gold-leaf)';
        
        tickerContainer.appendChild(newItem);

        // Remove old items to prevent memory leaks if running long
        if (tickerContainer.children.length > 20) {
            tickerContainer.removeChild(tickerContainer.firstChild);
        }
    }

    // --- 6. Interactive Elements ---
    // Add sound effect placeholder (commented out for browser policy compliance)
    /*
    function playSound() {
        const audio = new Audio('path/to/click.mp3');
        audio.play();
    }
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('click', playSound);
    });
    */
});