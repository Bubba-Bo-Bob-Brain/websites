// DOM Elements
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.society-nav a');
const memberCards = document.querySelectorAll('.member-card');
const envelope = document.querySelector('.sealed-envelope');
const initiationForm = document.getElementById('initiation-form');
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');

// Set active section based on navigation
function setActiveSection(targetId) {
    // Update navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show target section
    sections.forEach(section => {
        if (section.id === targetId) {
            section.classList.add('section-active');
        } else {
            section.classList.remove('section-active');
        }
    });
}

// Navigation click handlers
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        setActiveSection(targetId);
        
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Member card interactions
memberCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active class from all cards
        memberCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        card.classList.add('active');
        
        // Add a subtle animation
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    });
});

// Envelope interaction
envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
});

// Form submission
initiationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('applicant-name').value;
    const specialty = document.getElementById('applicant-specialty').value;
    const experience = document.getElementById('applicant-experience').value;
    const motive = document.getElementById('applicant-motive').value;
    
    // Validate form
    if (!name || !specialty || !experience || !motive) {
        alert('Please complete all fields before submitting.');
        return;
    }
    
    // Show success message
    const button = initiationForm.querySelector('.submit-button');
    const originalText = button.textContent;
    button.textContent = 'Application Submitted...';
    button.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        button.textContent = 'Submitted!';
        button.style.background = 'linear-gradient(to bottom, #4CAF50, #2E7D32)';
        
        // Reset after delay
        setTimeout(() => {
            initiationForm.reset();
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 3000);
    }, 1500);
});

// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Calculate rotations
    const hourRotation = (hours % 12) * 30 + minutes * 0.5;
    const minuteRotation = minutes * 6 + seconds * 0.1;
    const secondRotation = seconds * 6;
    
    // Apply rotations
    hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

// Initialize clock and update every second
updateClock();
setInterval(updateClock, 1000);

// Add ambient sound effects (simulated)
function playAmbientSounds() {
    // In a real implementation, this would play actual sounds
    console.log("Ambient gaslight flickering...");
    console.log("Grandfather clock ticking...");
    
    // Randomly simulate sound events
    setInterval(() => {
        const sounds = [
            "轻微的煤气灯爆裂声...",
            "远处的脚步声...",
            "纸张翻动的声音...",
            "钟摆滴答作响..."
        ];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        console.log(randomSound);
    }, 15000);
}

// Initialize ambient effects
playAmbientSounds();

// Add subtle animations on page load
window.addEventListener('DOMContentLoaded', () => {
    // Fade in header
    const header = document.querySelector('.society-header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        header.style.transition = 'opacity 1s ease, transform 1s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 300);
    
    // Staggered reveal for member cards
    memberCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
    
    // Animate section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach((header, index) => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 800 + (index * 300));
    });
});

// Add a subtle parallax effect to gaslight overlay
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 50;
    const y = (window.innerHeight - e.pageY * 2) / 50;
    document.querySelector('.gaslight-overlay').style.transform = `translate(${x}px, ${y}px)`;
});