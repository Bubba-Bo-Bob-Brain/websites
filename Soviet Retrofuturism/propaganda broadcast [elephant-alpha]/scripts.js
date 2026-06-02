// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initBroadcast();
    initTicker();
    initProgressBars();
    initNewsCards();
    initHeaderAnimation();
});

// Initialize main broadcast functionality
function initBroadcast() {
    // Add broadcast screen flicker effect
    setInterval(() => {
        const staticOverlay = document.querySelector('.static-overlay');
        if (staticOverlay) {
            const intensity = Math.random() * 0.05;
            staticOverlay.style.opacity = intensity;
        }
    }, 200);

    // Add emergency broadcast simulation
    setTimeout(() => {
        simulateEmergencyBroadcast();
    }, 15000);
}

// Initialize ticker functionality
function initTicker() {
    const tickerText = document.querySelector('.ticker-text');
    if (tickerText) {
        // Add new ticker items periodically
        setInterval(() => {
            addTickerItem(tickerText);
        }, 8000);
    }
}

// Add new ticker item
function addTickerItem(tickerElement) {
    const newItems = [
        'КОСМОНАВТЫ УСТАНОВИЛИ НОВЫЙ РЕКОРД ПО ТЕЛЕПАТИИ • ',
        'НАУЧНАЯ ЭКСПЕДИЦИЯ ОБНАРУЖИЛА ДРЕВНЕЕ ЦИВИЛИЗАЦИЮ • ',
        'ПРОИЗВОДСТВО РАКЕТ ДОСТИГЛО 100% ПРОЦЕССА • ',
        'ГРАЖДАНЕ ПОЛУЧИЛИ ПРАВО НА КОЛОНИЗАЦИЮ ЛУНЫ • ',
        'СОВЕТСКИЙ ФЛОТ ПОБЕДИЛ ВСЕ ПРОБНЫЕ ЗАПУСКИ • '
    ];

    const randomItem = newItems[Math.floor(Math.random() * newItems.length)];
    const newSpan = document.createElement('span');
    newSpan.className = 'ticker-item';
    newSpan.textContent = randomItem;
    
    tickerElement.appendChild(newSpan);
    
    // Remove old items to prevent overflow
    const items = tickerElement.querySelectorAll('.ticker-item');
    if (items.length > 10) {
        items[0].remove();
    }
}

// Initialize progress bars with animation
function initProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach((fill, index) => {
        // Animate progress bars on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBar(fill);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(fill);
    });
}

// Animate progress bar fill
function animateProgressBar(element) {
    const targetWidth = element.style.width;
    element.style.width = '0%';
    
    let currentWidth = 0;
    const targetValue = parseInt(targetWidth);
    const increment = targetValue / 50;
    
    const interval = setInterval(() => {
        currentWidth += increment;
        if (currentWidth >= targetValue) {
            currentWidth = targetValue;
            clearInterval(interval);
        }
        element.style.width = currentWidth + '%';
    }, 50);
}

// Initialize news card interactions
function initNewsCards() {
    const cards = document.querySelectorAll('.news-card');
    
    cards.forEach((card, index) => {
        // Stagger animation on page load
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 * index);
        
        // Add click interaction
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
}

// Initialize header animation
function initHeaderAnimation() {
    const header = document.querySelector('.broadcast-header');
    if (header) {
        // Add subtle floating effect to header
        let floatOffset = 0;
        setInterval(() => {
            floatOffset = Math.sin(Date.now() / 3000) * 5;
            header.style.transform = `translateY(${floatOffset}px)`;
        }, 50);
    }
}

// Simulate emergency broadcast
function simulateEmergencyBroadcast() {
    const ticker = document.querySelector('.ticker-text');
    if (!ticker) return;

    // Add emergency alert
    const emergencyAlert = document.createElement('span');
    emergencyAlert.className = 'ticker-item';
    emergencyAlert.style.color = '#ff4444';
    emergencyAlert.style.fontWeight = '900';
    emergencyAlert.style.textShadow = '0 0 10px #ff0000';
    emergencyAlert.textContent = '⚠️ ЧРЕЗВАЙНАЯ СИТУАЦИЯ: ЗАЩИЩАЕМ ГРАЖДАН • ';
    
    ticker.insertBefore(emergencyAlert, ticker.firstChild);
    
    // Remove after 10 seconds
    setTimeout(() => {
        if (emergencyAlert.parentNode) {
            emergencyAlert.remove();
        }
    }, 10000);
}

// Add parallax effect to hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroFigure = document.querySelector('.cosmonaut-figure');
        
        if (heroFigure) {
            const speed = scrolled * 0.5;
            heroFigure.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Initialize parallax
initParallax();

// Add keyboard shortcuts for broadcast control
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 't':
            // Toggle ticker speed
            const ticker = document.querySelector('.ticker-text');
            if (ticker) {
                ticker.style.animationDuration = 
                    ticker.style.animationDuration === '5s' ? '30s' : '5s';
            }
            break;
        case 'e':
            // Simulate emergency
            simulateEmergencyBroadcast();
            break;
        case 'r':
            // Refresh progress bars
            document.querySelectorAll('.progress-fill').forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => animateProgressBar(fill), 100);
            });
            break;
    }
});

// Add service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Broadcast status updater
function updateBroadcastStatus() {
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        const isOnline = navigator.onLine;
        statusDot.style.background = isOnline ? '#00ff00' : '#ff0000';
        statusDot.style.boxShadow = isOnline 
            ? '0 0 10px #00ff00, 0 0 20px var(--glow-gold)' 
            : '0 0 10px #ff0000';
    }
}

// Monitor connection status
window.addEventListener('online', updateBroadcastStatus);
window.addEventListener('offline', updateBroadcastStatus);

// Initialize status
updateBroadcastStatus();