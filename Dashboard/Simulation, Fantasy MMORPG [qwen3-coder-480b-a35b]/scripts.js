// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initClock();
    initCountdownTimers();
    initMapInteractions();
    initProgressBars();
    initNotifications();
    initRaidProgress();
    
    // Set up periodic updates
    setInterval(updateClock, 1000);
    setInterval(updateCountdowns, 1000);
});

// 1. Real-time Clock
function initClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('realm-time').textContent = `${hours}:${minutes}:${seconds}`;
}

// 2. Countdown Timers
function initCountdownTimers() {
    updateCountdowns();
}

function updateCountdowns() {
    // Daily reset countdown (example: 24 hours from now)
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(24, 0, 0, 0); // Next midnight
    
    const diff = resetTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('reset-timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 3. Interactive Map
function initMapInteractions() {
    const territories = document.querySelectorAll('.territory');
    
    territories.forEach(territory => {
        territory.addEventListener('click', function() {
            // Remove active class from all territories
            territories.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked territory
            this.classList.add('active');
            
            // Show territory details in console (would be expanded in a real app)
            console.log(`Territory selected: ${this.textContent.trim()}`);
        });
        
        // Add hover effect enhancement
        territory.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });
        
        territory.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
}

// 4. Animated Progress Bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Reset widths to 0 for animation
    progressBars.forEach(bar => {
        const finalWidth = bar.style.width;
        bar.style.width = '0';
        
        // Animate to final width after a short delay
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
            bar.style.width = finalWidth;
        }, 300);
    });
}

// 5. Notifications System
function initNotifications() {
    const notifications = document.querySelectorAll('.notification');
    
    // Add click functionality to notifications
    notifications.forEach(notification => {
        notification.addEventListener('click', function() {
            this.style.opacity = '0.5';
            this.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        });
    });
    
    // Simulate new notifications periodically
    setInterval(addRandomNotification, 30000); // Every 30 seconds
}

function addRandomNotification() {
    const notificationsFeed = document.querySelector('.notifications-feed');
    const messages = [
        "New patch notes available!",
        "Weekly challenge rewards distributed",
        "Limited time event starting soon",
        "Server performance optimized",
        "New cosmetic items added to shop"
    ];
    
    const icons = ['📢', '🎉', '⏰', '⚙️', '🛍️'];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `
        <span class="icon">${randomIcon}</span>
        <span class="message">${randomMessage}</span>
        <span class="time">now</span>
    `;
    
    // Add to top of notifications
    notificationsFeed.insertBefore(notificationElement, notificationsFeed.firstChild);
    
    // Add click functionality
    notificationElement.addEventListener('click', function() {
        this.style.opacity = '0.5';
        this.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            this.style.display = 'none';
        }, 300);
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notificationElement.parentNode) {
            notificationElement.style.opacity = '0';
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.remove();
                }
            }, 300);
        }
    }, 10000);
}

// 6. Raid Progress Animation
function initRaidProgress() {
    const bosses = document.querySelectorAll('.boss:not(.defeated):not(.locked)');
    
    bosses.forEach(boss => {
        boss.addEventListener('click', function() {
            // Toggle defeated state
            if (this.classList.contains('defeated')) {
                this.classList.remove('defeated');
                this.style.textDecoration = '';
                this.style.color = '';
            } else {
                this.classList.add('defeated');
                this.style.textDecoration = 'line-through';
                this.style.color = 'var(--text-muted)';
                
                // Show celebration effect
                showCelebration(this);
            }
        });
    });
}

function showCelebration(element) {
    // Create celebration particles
    const particleCount = 30;
    const colors = ['#d4af37', '#ffd700', '#4d79ff', '#e63946', '#2a9d8f'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        // Position at element center
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const duration = 1000 + Math.random() * 1000;
        
        particle.animate([
            { 
                transform: `translate(0, 0) scale(1)`,
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}

// 7. Enhanced Button Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px)';
        this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

// 8. Smooth Scrolling for Event Details
document.querySelectorAll('.event-content h4').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        if (content.style.maxHeight && content.style.maxHeight !== '0px') {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.overflow = 'visible';
        }
    });
});

// 9. Weather Widget Animation
const weatherWidget = document.querySelector('.weather-widget');
if (weatherWidget) {
    setInterval(() => {
        weatherWidget.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            weatherWidget.style.transform = '';
        }, 500);
    }, 10000);
}

// 10. Territory Pulse Effect
setInterval(() => {
    const contestedTerritories = document.querySelectorAll('.territory.contested');
    contestedTerritories.forEach(territory => {
        territory.style.boxShadow = '0 0 15px rgba(230, 57, 70, 0.7)';
        setTimeout(() => {
            territory.style.boxShadow = '';
        }, 500);
    });
}, 2000);

console.log("Fantasy MMORPG Dashboard initialized!");