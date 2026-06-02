// scripts.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Curtain animation control
    const curtainReveal = document.querySelector('.curtain-reveal');
    const curtainCenter = document.querySelector('.curtain-center');
    
    // After curtain animation completes, remove it
    setTimeout(() => {
        curtainReveal.style.opacity = '0';
        setTimeout(() => {
            curtainReveal.style.display = 'none';
        }, 1000);
    }, 4000);
    
    // Enhanced chandelier effect
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        // Randomize animation delays for more natural effect
        candle.style.animationDelay = `${index * 0.2}s`;
        
        // Add mouse interaction
        candle.addEventListener('mouseenter', () => {
            candle.style.animation = 'none';
            candle.style.boxShadow = '0 0 30px gold, 0 0 60px gold';
            setTimeout(() => {
                candle.style.animation = 'flicker 3s infinite alternate';
            }, 100);
        });
    });
    
    // Spotlight effect for performer profiles
    const performerProfiles = document.querySelectorAll('.performer-profile');
    performerProfiles.forEach(profile => {
        profile.addEventListener('mousemove', (e) => {
            const rect = profile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            profile.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(212, 175, 55, 0.3) 0%,
                    rgba(0, 0, 0, 0.4) 70%
                )
            `;
        });
        
        profile.addEventListener('mouseleave', () => {
            profile.style.background = 'rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Interactive seating visualization
    const seats = document.querySelectorAll('.box');
    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            // Remove any existing selection
            seats.forEach(s => s.classList.remove('selected'));
            
            // Select this seat
            this.classList.add('selected');
            
            // Visual feedback
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 0 20px var(--gold-light)';
            
            // Reset after delay
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 10px var(--shadow-dark)';
            }, 1000);
        });
    });
    
    // Add subtle ambient sound indicators (visual representation)
    // In a real implementation, this would trigger actual sounds
    const ambientIndicators = document.createElement('div');
    ambientIndicators.className = 'ambient-indicators';
    document.body.appendChild(ambientIndicators);
    
    // Create floating musical notes
    for (let i = 0; i < 15; i++) {
        const note = document.createElement('div');
        note.className = 'musical-note';
        note.innerHTML = '♪';
        note.style.left = `${Math.random() * 100}%`;
        note.style.animationDelay = `${Math.random() * 5}s`;
        ambientIndicators.appendChild(note);
    }
    
    // Add date highlighting for upcoming events
    const today = new Date();
    const eventDates = document.querySelectorAll('.date');
    
    eventDates.forEach(dateElement => {
        const eventDate = new Date(dateElement.textContent);
        const timeDiff = eventDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff >= 0 && daysDiff <= 7) {
            dateElement.style.color = '#ffcc00';
            dateElement.style.fontWeight = 'bold';
            dateElement.title = 'Upcoming performance this week!';
        }
    });
    
    // Add decorative corner elements to event cards
    const eventCards = document.querySelectorAll('.gilded-frame');
    eventCards.forEach(card => {
        // Top-left decoration
        const topLeft = document.createElement('div');
        topLeft.className = 'corner-decoration tl';
        card.appendChild(topLeft);
        
        // Top-right decoration
        const topRight = document.createElement('div');
        topRight.className = 'corner-decoration tr';
        card.appendChild(topRight);
        
        // Bottom-left decoration
        const bottomLeft = document.createElement('div');
        bottomLeft.className = 'corner-decoration bl';
        card.appendChild(bottomLeft);
        
        // Bottom-right decoration
        const bottomRight = document.createElement('div');
        bottomRight.className = 'corner-decoration br';
        card.appendChild(bottomRight);
    });
});

// Add floating musical notes for ambient effect
window.addEventListener('load', function() {
    const style = document.createElement('style');
    style.textContent = `
        .ambient-indicators {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .musical-note {
            position: absolute;
            top: 100%;
            font-size: 1.5rem;
            color: rgba(212, 175, 55, 0.7);
            animation: floatUp 15s linear infinite;
            opacity: 0;
        }
        
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .corner-decoration {
            position: absolute;
            width: 30px;
            height: 30px;
            border: 2px solid var(--gold-light);
            pointer-events: none;
        }
        
        .tl {
            top: -2px;
            left: -2px;
            border-right: none;
            border-bottom: none;
        }
        
        .tr {
            top: -2px;
            right: -2px;
            border-left: none;
            border-bottom: none;
        }
        
        .bl {
            bottom: -2px;
            left: -2px;
            border-right: none;
            border-top: none;
        }
        
        .br {
            bottom: -2px;
            right: -2px;
            border-left: none;
            border-top: none;
        }
        
        .box.selected {
            background: var(--gold-light) !important;
            color: var(--crimson-dark) !important;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});