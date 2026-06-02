// Solarpunk Wiki JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sunlight intensity meter
    updateSunlightMeter();
    setInterval(updateSunlightMeter, 60000); // Update every minute
    
    // Initialize photosynthesis loader animation
    initPhotosynthesisLoader();
    
    // Handle sidebar toggle on mobile
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Set active navigation item
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Wiki card hover effects
    const wikiCards = document.querySelectorAll('.wiki-card');
    wikiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Seed bank category interaction
    const seedLinks = document.querySelectorAll('.seed-category a');
    seedLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would navigate to the seed detail page
            alert(`Navigating to: ${this.textContent}`);
        });
    });
    
    // Button interactions
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would navigate to the relevant section
            alert('Exploring sustainable technologies...');
        });
    });
    
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    secondaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would open a community join form
            alert('Joining the community...');
        });
    });
});

// Update sunlight intensity meter based on time of day
function updateSunlightMeter() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Format time display
    const timeDisplay = document.querySelector('.time-display');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    timeDisplay.textContent = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    // Calculate sunlight intensity (simplified model)
    let intensity = 0;
    if (hours >= 6 && hours < 18) {
        // Daytime: peak at noon
        const noonDistance = Math.abs(hours - 12);
        intensity = Math.max(0, 100 - (noonDistance * 10));
    }
    
    // Update meter visually
    const intensityLevel = document.querySelector('.intensity-level');
    intensityLevel.style.width = `${intensity}%`;
    
    // Change color based on intensity
    if (intensity > 70) {
        intensityLevel.style.background = 'linear-gradient(to right, #FFEB3B, #8BC34A)';
    } else if (intensity > 30) {
        intensityLevel.style.background = 'linear-gradient(to right, #FFC107, #CDDC39)';
    } else {
        intensityLevel.style.background = 'linear-gradient(to right, #FF9800, #FFEB3B)';
    }
    
    // Update body background based on sunlight
    updatePagePalette(intensity);
}

// Update page palette based on sunlight intensity
function updatePagePalette(intensity) {
    const body = document.body;
    
    if (intensity > 70) {
        // Bright daylight
        body.style.setProperty('--light-bg', '#F1F8E9');
        body.style.setProperty('--text-dark', '#2E7D32');
    } else if (intensity > 30) {
        // Dim daylight
        body.style.setProperty('--light-bg', '#E8F5E9');
        body.style.setProperty('--text-dark', '#1B5E20');
    } else {
        // Low light
        body.style.setProperty('--light-bg', '#E0F2F1');
        body.style.setProperty('--text-dark', '#00695C');
    }
}

// Initialize photosynthesis loader animation
function initPhotosynthesisLoader() {
    const loader = document.querySelector('.photosynthesis-loader');
    const chloroplast = document.querySelector('.chloroplast');
    const glucose = document.querySelector('.glucose-molecule');
    const oxygen = document.querySelector('.oxygen-bubble');
    
    // Animate chloroplast
    let chloroplastAngle = 0;
    setInterval(() => {
        chloroplastAngle += 0.5;
        chloroplast.style.transform = `translate(-50%, -50%) rotate(${chloroplastAngle}deg)`;
    }, 50);
    
    // Animate glucose molecule
    let glucoseAngle = 0;
    setInterval(() => {
        glucoseAngle += 2;
        const x = 40 * Math.cos(glucoseAngle * Math.PI / 180);
        const y = 40 * Math.sin(glucoseAngle * Math.PI / 180);
        glucose.style.transform = `translate(${x}px, ${y}px)`;
    }, 100);
    
    // Animate oxygen bubbles
    setInterval(() => {
        const bubbles = document.querySelectorAll('.oxygen-bubble');
        bubbles.forEach(bubble => {
            bubble.style.animation = 'none';
            setTimeout(() => {
                bubble.style.animation = 'bubble 5s ease-in-out infinite';
            }, 10);
        });
    }, 5000);
}

// Simulate contribution updates
function simulateContributions() {
    const contributors = [
        { name: "Kai Nakamura", action: "added new section on mycelial networks" },
        { name: "Zara Okafor", action: "updated vertical farming techniques" },
        { name: "Elias Svensson", action: "created article on regenerative aquaculture" },
        { name: "Maya Patel", action: "improved seed preservation methods" },
        { name: "Amara Johnson", action: "documented urban beekeeping practices" }
    ];
    
    const contributionList = document.querySelector('.contribution-list');
    
    // Clear existing items
    contributionList.innerHTML = '';
    
    // Add new items
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * contributors.length);
        const contributor = contributors[randomIndex];
        
        const contributionItem = document.createElement('div');
        contributionItem.className = 'contribution-item';
        
        const timeAgo = Math.floor(Math.random() * 24) + 1;
        const timeUnit = timeAgo === 1 ? 'hour' : 'hours';
        
        contributionItem.innerHTML = `
            <div class="contributor">
                <img src="https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg" alt="Contributor">
                <div>
                    <h4>${contributor.name}</h4>
                    <p>${contributor.action}</p>
                </div>
            </div>
            <div class="contribution-time">${timeAgo} ${timeUnit} ago</div>
        `;
        
        contributionList.appendChild(contributionItem);
    }
}

// Update contributions every 30 seconds
setInterval(simulateContributions, 30000);

// Initial contribution simulation
simulateContributions();

// Search functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (this.value.trim() !== '') {
            alert(`Searching for: ${this.value}`);
            this.value = '';
        }
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}