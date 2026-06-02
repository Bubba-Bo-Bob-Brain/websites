// scripts.js

class Dashboard {
    constructor() {
        this.currentTimeElement = document.getElementById('current-time');
        this.seismicFeedElement = document.getElementById('seismic-feed');
        this.magmaBars = document.querySelectorAll('.magma-bar');
        this.climateBars = document.querySelectorAll('.chart-bar');
        this.continentBars = document.querySelectorAll('.bar');
        this.regionFills = document.querySelectorAll('.fill');
        this.statusElements = document.querySelectorAll('.status');
        
        this.init();
    }

    init() {
        this.updateTime();
        this.startSeismicFeed();
        this.animateMagmaBars();
        this.animateClimateBars();
        this.animateContinentBars();
        this.simulateEarthquakes();
        this.simulateVolcanicActivity();
        this.simulateDataUpdates();
        
        // Add hover effects to interactive elements
        this.addInteractiveEffects();
    }

    // Update current time
    updateTime() {
        const now = new Date();
        const timeString = now.toUTCString().match(/(\d{2}:\d{2}:\d{2})/)[0];
        this.currentTimeElement.textContent = timeString;
        
        // Update every second
        setInterval(() => {
            const now = new Date();
            const timeString = now.toUTCString().match(/(\d{2}:\d{2}:\d{2})/)[0];
            this.currentTimeElement.textContent = timeString;
        }, 1000);
    }

    // Generate random seismic activity data
    generateSeismicEvent() {
        const magnitudes = ['2.1', '3.5', '4.2', '5.8', '6.3', '7.1'];
        const locations = [
            '🇯🇵 Japan Trench', '🇨🇭 Alps', '🇨🇱 Chile', 
            '🇮🇩 Indonesia', '🇵🇬 Papua New Guinea', '🇲🇽 Mexico'
        ];
        const depths = ['15km', '30km', '45km', '60km', '80km', '100km'];
        const types = ['Strike-Slip', 'Normal', 'Reverse', 'Oblique'];
        
        return {
            magnitude: magnitudes[Math.floor(Math.random() * magnitudes.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            depth: depths[Math.floor(Math.random() * depths.length)],
            type: types[Math.floor(Math.random() * types.length)],
            time: new Date().toLocaleTimeString()
        };
    }

    // Start seismic feed
    startSeismicFeed() {
        // Add initial events
        this.addSeismicEvent(this.generateSeismicEvent());
        this.addSeismicEvent(this.generateSeismicEvent());
        this.addSeismicEvent(this.generateSeismicEvent());
        
        // Add new events every 3-8 seconds
        setInterval(() => {
            this.addSeismicEvent(this.generateSeismicEvent());
            
            // Keep only last 10 events
            const events = this.seismicFeedElement.querySelectorAll('.feed-item');
            if (events.length > 10) {
                events[0].remove();
            }
        }, 3000 + Math.random() * 5000);
    }

    // Add seismic event to feed
    addSeismicEvent(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'feed-item';
        eventElement.style.animation = 'none';
        eventElement.style.opacity = '0';
        
        eventElement.innerHTML = `
            <div>${event.magnitude}M ${event.location}</div>
            <div style="font-size:0.45vmin;color:var(--text-dim)">${event.depth} | ${event.type}</div>
            <div style="font-size:0.4vmin;color:var(--accent-red)">${event.time}</div>
        `;
        
        this.seismicFeedElement.insertBefore(eventElement, this.seismicFeedElement.firstChild);
        
        // Trigger animation
        setTimeout(() => {
            eventElement.style.transition = 'all 0.3s ease';
            eventElement.style.opacity = '1';
        }, 10);
    }

    // Animate magma bars
    animateMagmaBars() {
        const animateBar = (bar) => {
            const randomHeight = 15 + Math.random() * 70;
            bar.style.height = randomHeight + '%';
            
            // Update label if it exists
            const label = bar.previousElementSibling;
            if (label) {
                label.textContent = randomHeight.toFixed(0) + '%';
            }
        };
        
        // Animate each bar with random intervals
        this.magmaBars.forEach((bar, index) => {
            setInterval(() => {
                animateBar(bar);
            }, 2000 + index * 1000);
            
            // Initial animation
            animateBar(bar);
        });
    }

    // Animate climate bars
    animateClimateBars() {
        const animateClimateBar = (bar) => {
            const randomWidth = 10 + Math.random() * 80;
            bar.style.width = randomWidth + '%';
        };
        
        this.climateBars.forEach((bar, index) => {
            setInterval(() => {
                animateClimateBar(bar);
            }, 3000 + index * 1500);
            
            // Initial animation
            animateClimateBar(bar);
        });
    }

    // Animate continent population bars
    animateContinentBars() {
        const animateContinentBar = (bar) => {
            const randomWidth = 1 + Math.random() * 20;
            bar.style.width = randomWidth + '%';
        };
        
        this.continentBars.forEach((bar, index) => {
            setInterval(() => {
                animateContinentBar(bar);
            }, 4000 + index * 2000);
            
            // Initial animation
            animateContinentBar(bar);
        });
    }

    // Simulate volcanic activity
    simulateVolcanicActivity() {
        const volcanoes = document.querySelectorAll('.volcano-item');
        
        setInterval(() => {
            // Randomly change volcano status
            volcanoes.forEach(volcano => {
                if (Math.random() < 0.1) { // 10% chance to change status
                    const statuses = ['active', ''];
                    const currentStatus = volcano.classList.contains('active') ? '' : 'active';
                    
                    if (currentStatus) {
                        volcano.classList.add('active');
                        const statusEl = volcano.querySelector('.status');
                        statusEl.style.animation = 'pulse 1s ease-in-out infinite';
                    } else {
                        volcano.classList.remove('active');
                        const statusEl = volcano.querySelector('.status');
                        statusEl.style.animation = 'none';
                    }
                }
            });
        }, 5000);
    }

    // Simulate earthquakes
    simulateEarthquakes() {
        setInterval(() => {
            if (Math.random() < 0.15) { // 15% chance every 5 seconds
                const earthquakeMessages = [
                    '🌍 Minor tremor detected',
                    '⚠️ Seismic activity detected',
                    '🔴 Earthquake alert in region',
                    '📊 Seismic monitoring update'
                ];
                
                const feedHeader = document.querySelector('.feed-header');
                const originalText = feedHeader.textContent;
                feedHeader.textContent = earthquakeMessages[Math.floor(Math.random() * earthquakeMessages.length)];
                
                setTimeout(() => {
                    feedHeader.textContent = originalText;
                }, 2000);
            }
        }, 5000);
    }

    // Simulate data updates
    simulateDataUpdates() {
        // Update global metrics periodically
        setInterval(() => {
            const tempElement = document.getElementById('global-temp');
            if (tempElement) {
                const temp = (14 + Math.random() * 2).toFixed(1);
                tempElement.textContent = temp + '°C';
            }
        }, 10000);
        
        // Update population count
        setInterval(() => {
            const popElement = document.querySelector('.continent .pop');
            if (popElement) {
                // Simulate population growth
                const currentPop = parseInt(popElement.textContent.replace(/,/g, ''));
                const growth = Math.floor(Math.random() * 1000);
                popElement.textContent = (currentPop + growth).toLocaleString();
            }
        }, 15000);
    }

    // Add interactive hover effects
    addInteractiveEffects() {
        const interactiveElements = document.querySelectorAll('.card, .plate, .region, .resource-item, .aqi-zone');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-0.3vmin)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Add keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        // Refresh data
        location.reload();
    }
    
    if (e.key === 'f' || e.key === 'F') {
        // Focus search (if implemented)
        console.log('Search functionality would be here');
    }
});

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not active
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is active
        document.body.style.animationPlayState = 'running';
    }
});