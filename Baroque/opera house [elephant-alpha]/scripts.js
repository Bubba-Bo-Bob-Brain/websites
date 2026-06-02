// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Baroque Opera House experience
    initCurtainReveal();
    initChandelier();
    initSpotlight();
    initPerformanceCards();
    initSeatingChart();
    initGildedFrames();
    initHoverEffects();
});

// Curtain Reveal Animation
function initCurtainReveal() {
    const curtain = document.getElementById('curtain');
    const revealButton = document.getElementById('curtain-reveal');
    
    if (revealButton && curtain) {
        revealButton.addEventListener('click', function() {
            curtain.style.animation = 'curtainReveal 1.5s ease-in forwards';
            
            // Add subtle sound effect simulation
            createAudioVisualizer();
            
            // Remove button after reveal
            setTimeout(() => {
                revealButton.style.opacity = '0';
                revealButton.style.transition = 'opacity 1s ease';
            }, 1500);
        });
    }
}

// Create audio visualizer effect
function createAudioVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'audio-visualizer';
    visualizer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
        background: radial-gradient(ellipse at center, 
            rgba(212, 175, 55, 0.1) 0%, 
            transparent 70%);
    `;
    document.body.appendChild(visualizer);
    
    // Animate the visualizer
    let opacity = 1;
    const interval = setInterval(() => {
        opacity -= 0.02;
        visualizer.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(interval);
            visualizer.remove();
        }
    }, 50);
}

// Animated Chandelier
function initChandelier() {
    const chandelier = document.querySelector('.chandelier');
    if (!chandelier) return;
    
    const crystals = chandelier.querySelectorAll('.crystal');
    
    crystals.forEach((crystal, index) => {
        // Randomize animation delays for natural effect
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;
        
        crystal.style.animation = `sparkle ${duration}s ${delay}s ease-in-out infinite`;
        crystal.style.opacity = Math.random();
    });
    
    // Gentle swinging motion
    chandelier.style.animation = 'chandelier-swing 4s ease-in-out infinite';
}

// Spotlight Effect
function initSpotlight() {
    const spotlight = document.getElementById('spotlight');
    const heroSection = document.querySelector('.hero-section');
    
    if (!spotlight || !heroSection) return;
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        spotlight.style.left = `${x - 150}px`;
        spotlight.style.top = `${y - 150}px`;
    });
}

// Performance Card Animations
function initPerformanceCards() {
    const cards = document.querySelectorAll('.performance-card');
    
    cards.forEach((card, index) => {
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = `fadeInUp 0.8s ease-out forwards`;
        card.style.opacity = '0';
        
        // Add composer-specific glow effect
        const composer = card.getAttribute('data-performer');
        if (composer) {
            card.style.borderLeft = `4px solid ${getComposerColor(composer)}`;
        }
    });
}

// Get composer-specific colors
function getComposerColor(composer) {
    const colors = {
        'Verdi': 'var(--crimson)',
        'Mozart': 'var(--gold-primary)',
        'Puccini': 'var(--crimson-dark)',
        'Rossini': 'var(--gold-dark)',
        'Bellini': 'var(--gold-light)',
        'Donizetti': 'var(--crimson-light)'
    };
    return colors[composer] || 'var(--gold-primary)';
}

// Interactive Seating Chart
function initSeatingChart() {
    const orchestraSeats = document.getElementById('orchestra-seats');
    const mezzanineSeats = document.getElementById('mezzanine-seats');
    const gallerySeats = document.getElementById('gallery-seats');
    
    createSeats(orchestraSeats, 12, 'orchestra');
    createSeats(mezzanineSeats, 10, 'mezzanine');
    createSeats(gallerySeats, 8, 'gallery');
    
    // Add seating legend
    addSeatingLegend();
}

// Create seat elements
function createSeats(container, count, tier) {
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat available';
        seat.dataset.tier = tier;
        seat.dataset.number = i + 1;
        
        // Add hover tooltip
        seat.title = `${tier.charAt(0).toUpperCase() + tier.slice(1)} Seat ${i + 1}`;
        
        // Add click interaction
        seat.addEventListener('click', function() {
            toggleSeatSelection(this);
        });
        
        container.appendChild(seat);
    }
}

// Toggle seat selection
function toggleSeatSelection(seat) {
    if (seat.classList.contains('occupied')) return;
    
    seat.classList.toggle('available');
    seat.classList.toggle('selected');
    
    if (seat.classList.contains('selected')) {
        seat.style.background = 'var(--gold-primary)';
        seat.style.boxShadow = '0 0 15px var(--shadow-crimson)';
    } else {
        seat.style.background = '';
        seat.style.boxShadow = '';
    }
}

// Add seating legend
function addSeatingLegend() {
    const legend = document.createElement('div');
    legend.className = 'seating-legend';
    legend.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    `;
    
    const legendItems = [
        { class: 'available', text: 'Available', color: 'var(--cream)' },
        { class: 'selected', text: 'Selected', color: 'var(--gold-primary)' },
        { class: 'occupied', text: 'Occupied', color: 'var(--crimson-dark)' },
        { class: 'vip', text: 'VIP', color: 'var(--gold-primary)' }
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
        `;
        
        const colorBox = document.createElement('div');
        colorBox.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 3px;
            background: ${item.color};
            border: 1px solid var(--gold-dark);
        `;
        
        const label = document.createElement('span');
        label.textContent = item.text;
        label.style.color = 'var(--gold-light)';
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
    
    // Insert legend before seating chart
    const seatingSection = document.querySelector('.seating-section');
    if (seatingSection) {
        seatingSection.appendChild(legend);
    }
}

// Gilded Frame Effects
function initGildedFrames() {
    const frames = document.querySelectorAll('.card-frame');
    
    frames.forEach(frame => {
        // Add subtle dust particles effect
        frame.addEventListener('mouseenter', function() {
            createDustParticles(this);
        });
    });
}

// Create dust particle effects
function createDustParticles(element) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: var(--gold-primary);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle 2s ease-out forwards;
        `;
        
        // Random position within frame
        const posX = Math.random() * 80 + 10;
        const posY = Math.random() * 80 + 10;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        element.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Hover Effects for Performer Profiles
function initHoverEffects() {
    const cards = document.querySelectorAll('.performance-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add floating note effect
    addFloatingNotes();
}

// Add floating musical note decorations
function addFloatingNotes() {
    const notes = ['♪', '♫', '♬', '🎵'];
    
    setInterval(() => {
        const note = document.createElement('div');
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            color: var(--gold-primary);
            opacity: 0.3;
            pointer-events: none;
            z-index: 999;
            animation: floatNote 4s ease-out forwards;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
        `;
        
        document.body.appendChild(note);
        
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 4000);
    }, 3000);
}

// Add floating note animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatNote {
        0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
        }
        10% {
            opacity: 0.5;
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize seating selection counter
let selectedSeats = 0;
const maxSeats = 4;

// Enhanced seat selection with capacity limit
function toggleSeatSelection(seat) {
    if (seat.classList.contains('occupied')) return;
    
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        seat.style.background = '';
        seat.style.boxShadow = '';
        selectedSeats--;
    } else {
        if (selectedSeats >= maxSeats) {
            alert(`Maximum of ${maxSeats} seats selected. Please proceed to booking.`);
            return;
        }
        seat.classList.add('selected');
        seat.style.background = 'var(--gold-primary)';
        seat.style.boxShadow = '0 0 15px var(--shadow-crimson)';
        selectedSeats++;
    }
}

// Add responsive adjustments
function handleResize() {
    const seatsGrid = document.querySelector('.seats-grid');
    if (seatsGrid) {
        const width = window.innerWidth;
        let columns = 12;
        
        if (width < 768) columns = 6;
        if (width < 480) columns = 4;
        
        seatsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }
}

window.addEventListener('resize', handleResize);

// Initialize responsive layout
handleResize();