// Anime Tracking Calendar JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const mascot = document.getElementById('mascot');
    const animeCards = document.querySelectorAll('.anime-card');
    const statusButtons = document.querySelectorAll('.status-btn');
    const tags = document.querySelectorAll('.tag:not(.filter-tags .tag)');
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    const searchBox = document.querySelector('.search-box input');
    
    // Initialize sparklines
    initializeSparklines();
    
    // Set up event listeners
    setupEventListeners();
    
    // Animate mascot on page load
    animateMascot();
    
    // Update countdown timers
    updateCountdowns();
    setInterval(updateCountdowns, 60000); // Update every minute
    
    // Initialize chibi mascot reactions
    initMascotReactions();
});

// Initialize sparklines for rating graphs
function initializeSparklines() {
    const sparklines = document.querySelectorAll('.sparkline');
    
    sparklines.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Sample data points for rating trend (1-10 scale)
        const dataPoints = [6.5, 7.0, 7.2, 7.8, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1];
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 1; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw sparkline
        ctx.beginPath();
        ctx.moveTo(0, height - (dataPoints[0] / 10) * height);
        
        for (let i = 1; i < dataPoints.length; i++) {
            const x = (width / (dataPoints.length - 1)) * i;
            const y = height - (dataPoints[i] / 10) * height;
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#FF6B6B';
        dataPoints.forEach((point, i) => {
            const x = (width / (dataPoints.length - 1)) * i;
            const y = height - (point / 10) * height;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Status button functionality
    document.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.anime-card');
            const statusGroup = this.closest('.watch-status');
            
            // Remove active class from all buttons in this group
            statusGroup.querySelectorAll('.status-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update status indicator
            updateStatusIndicator(card, this.classList[1]);
            
            // Trigger mascot reaction
            triggerMascotReaction(this.classList[1]);
        });
    });
    
    // Tag filtering
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.filter-tags .tag').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // In a real app, this would filter the anime cards
            console.log(`Filtering by: ${this.textContent}`);
        });
    });
    
    // Search functionality
    const searchBox = document.querySelector('.search-box input');
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        // In a real app, this would filter the anime cards
        console.log(`Searching for: ${searchTerm}`);
    });
    
    // Card hover effects
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Update status indicator based on button clicked
function updateStatusIndicator(card, statusClass) {
    const indicator = card.querySelector('.status-indicator');
    indicator.className = 'status-indicator';
    
    switch(statusClass) {
        case 'watching':
            indicator.classList.add('watching');
            indicator.innerHTML = '<i class="fas fa-play-circle"></i>';
            break;
        case 'completed':
            indicator.classList.add('completed');
            indicator.innerHTML = '<i class="fas fa-trophy"></i>';
            break;
        case 'planning':
            indicator.classList.add('planned');
            indicator.innerHTML = '<i class="fas fa-clock"></i>';
            break;
        case 'dropped':
            indicator.classList.add('dropped');
            indicator.innerHTML = '<i class="fas fa-times-circle"></i>';
            break;
        case 'rewatching':
            indicator.classList.add('watching');
            indicator.innerHTML = '<i class="fas fa-redo"></i>';
            break;
    }
}

// Animate mascot on page load
function animateMascot() {
    const mascot = document.getElementById('mascot');
    mascot.style.animation = 'float 3s ease-in-out infinite';
}

// Initialize mascot reactions to user actions
function initMascotReactions() {
    // Add reaction classes for different actions
    const reactions = {
        watching: 'happy',
        completed: 'excited',
        planning: 'curious',
        dropped: 'sad',
        rewatching: 'excited'
    };
    
    window.mascotReactions = reactions;
}

// Trigger mascot reaction based on user action
function triggerMascotReaction(action) {
    const mascot = document.getElementById('mascot');
    const reaction = window.mascotReactions[action] || 'neutral';
    
    // Reset animation
    mascot.style.animation = 'none';
    void mascot.offsetWidth; // Trigger reflow
    
    // Apply reaction-specific animation
    switch(reaction) {
        case 'happy':
            mascot.style.animation = 'bounce 0.5s ease';
            break;
        case 'excited':
            mascot.style.animation = 'jump 0.6s ease';
            break;
        case 'curious':
            mascot.style.animation = 'tilt 0.8s ease';
            break;
        case 'sad':
            mascot.style.animation = 'slump 0.7s ease';
            break;
        default:
            mascot.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Return to floating after reaction
    setTimeout(() => {
        mascot.style.animation = 'float 3s ease-in-out infinite';
    }, 1000);
}

// Update countdown timers
function updateCountdowns() {
    const countdowns = document.querySelectorAll('.countdown-text');
    
    countdowns.forEach(countdown => {
        // In a real app, this would calculate actual time until next episode
        // For demo purposes, we'll just simulate updating
        const days = Math.floor(Math.random() * 7);
        const hours = Math.floor(Math.random() * 24);
        countdown.textContent = `${days}d ${hours}h`;
    });
    
    // Update progress rings
    updateProgressRings();
}

// Update progress rings based on time remaining
function updateProgressRings() {
    const rings = document.querySelectorAll('.ring-progress');
    
    rings.forEach(ring => {
        // Generate random progress for demo (in a real app, this would be calculated)
        const progress = Math.floor(Math.random() * 100);
        ring.style.strokeDasharray = `${progress}, 100`;
    });
}

// Add CSS animations for mascot reactions
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes jump {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.1); }
        100% { transform: translateY(0) scale(1); }
    }
    
    @keyframes tilt {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
    
    @keyframes slump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
    }
`;
document.head.appendChild(style);

// Simulate loading animations
window.addEventListener('load', function() {
    // Add staggered entrance animation to cards
    const cards = document.querySelectorAll('.anime-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
});