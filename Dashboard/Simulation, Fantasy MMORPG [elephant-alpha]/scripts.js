// scripts.js

class MMORPGDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.updateTime();
        this.startRealtimeUpdates();
        this.setupAnimations();
        this.simulateEvents();
    }

    // Real-time clock with dramatic updates
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        const timeElement = document.querySelector('.current-time');
        if (timeElement) {
            timeElement.textContent = `🕐 ${timeString}`;
            
            // Add dramatic second update effect
            if (now.getSeconds() % 10 === 0) {
                timeElement.style.animation = 'none';
                setTimeout(() => {
                    timeElement.style.animation = 'pulse 0.5s ease-in-out';
                }, 10);
            }
        }
    }

    // Simulate real-time server metrics
    startRealtimeUpdates() {
        setInterval(() => {
            this.updateMetrics();
            this.updateActivePlayers();
            this.updateWeatherCycle();
        }, 1000);
    }

    // Dynamic metric updates
    updateMetrics() {
        // Update server load with variation
        const loadElement = document.querySelector('.server-load');
        if (loadElement) {
            const currentLoad = parseInt(document.querySelector('.server-load')?.textContent?.match(/\d+/)?.[0] || '87');
            const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const newLoad = Math.max(70, Math.min(95, currentLoad + variation));
            loadElement.textContent = `⚡ ${newLoad}% LOAD`;
            
            // Color change based on load
            if (newLoad > 90) loadElement.style.color = '#ff4444';
            else if (newLoad > 80) loadElement.style.color = '#ff8800';
            else loadElement.style.color = '#44ff44';
        }

        // Update player count
        const playersElement = document.querySelector('.active-players');
        if (playersElement) {
            const currentPlayers = parseInt(playersElement.textContent?.match(/\d+/)?.[0] || '12000');
            const variation = Math.floor(Math.random() * 20) - 10;
            const newPlayers = Math.max(10000, Math.min(15000, currentPlayers + variation));
            playersElement.textContent = `👥 ${newPlayers.toLocaleString()} ONLINE`;
        }
    }

    // Dynamic player counter
    updateActivePlayers() {
        // Simulate player activity
        if (Math.random() < 0.1) {
            const playersElement = document.querySelector('.active-players');
            if (playersElement) {
                const current = parseInt(playersElement.textContent?.match(/\d+/)?.[0] || '0');
                const change = Math.random() > 0.5 ? 1 : -1;
                playersElement.textContent = `👥 ${Math.max(10000, current + change)} ONLINE`;
            }
        }
    }

    // Weather and seasonal cycle simulation
    updateWeatherCycle() {
        const weatherTypes = ['🌤️ Clear Skies', '⛈️ Stormy', '🌧️ Rainy', '❄️ Snowy', '🌫️ Misty'];
        const elements = document.querySelectorAll('.current-weather');
        elements.forEach(el => {
            if (el && Math.random() < 0.01) {
                el.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                el.style.color = this.getWeatherColor(el.textContent);
            }
        });
    }

    getWeatherColor(weather) {
        const colors = {
            'Clear Skies': '#4488ff',
            'Stormy': '#666688',
            'Rainy': '#4466aa',
            'Snowy': '#ccccdd',
            'Misty': '#8888aa'
        };
        return colors[weather] || '#4488ff';
    }

    // Setup entrance animations
    setupAnimations() {
        const cards = document.querySelectorAll('.metric-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Simulate dynamic world events
    simulateEvents() {
        const events = [
            { element: '.event-active', messages: ['🔴 Dragon Attack!', '⚔️ Siege Ongoing', '🛡️ Defending', '💥 Battle Intense'], interval: 3000 },
            { element: '.event-announcement', messages: ['⚠️ Maintenance Tonight', '🎉 New Patch Released', '📅 Tournament Announced', '🔥 Double XP Weekend'], interval: 5000 }
        ];

        events.forEach(event => {
            setInterval(() => {
                const el = document.querySelector(event.element);
                if (el) {
                    const messages = event.messages;
                    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                    el.textContent = randomMsg;
                    
                    // Add animation effect
                    el.style.animation = 'none';
                    setTimeout(() => {
                        el.style.animation = 'pulse 0.3s ease-in-out';
                    }, 10);
                }
            }, event.interval);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MMORPGDashboard();
});

// Add keyboard shortcuts for quick actions
document.addEventListener('keydown', (e) => {
    const shortcuts = {
        'c': () => window.location.href = '#combat',
        'm': () => window.location.href = '#market',
        'q': () => window.location.href = '#quests',
        'p': () => window.location.href = '#party',
        's': () => window.location.href = '#skills'
    };
    
    if (shortcuts[e.key]) {
        shortcuts[e.key]();
    }
});

// Add some random ambient effects
setInterval(() => {
    const particles = document.querySelector('.dashboard-container');
    if (particles && Math.random() < 0.3) {
        // Create floating particle effect
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            pointer-events: none;
            font-size: 0.5em;
            opacity: 0.3;
            animation: floatUp 2s ease-out forwards;
            z-index: 9999;
        `;
        particle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100vh';
        
        // Add keyframe for float animation
        if (!document.getElementById('floatKeyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'floatKeyframes';
            keyframes.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.3; }
                    100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
                }
            `;
            document.head.appendChild(keyframes);
        }
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }
}, 3000);