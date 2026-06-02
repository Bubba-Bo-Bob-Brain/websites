// Slavic Folklore Bestiary JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const openBookBtn = document.getElementById('openBook');
    const bookCover = document.querySelector('.book-cover');
    const pagesContainer = document.querySelector('.pages-container');
    const tocEntries = document.querySelectorAll('.toc-entry');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const soundToggle = document.querySelector('.sound-toggle');
    const soundIcon = document.querySelector('.sound-icon');
    const hearthGlow = document.querySelector('.hearth-glow');
    
    // State variables
    let currentPageIndex = 0;
    let soundEnabled = false;
    let currentPageId = 'toc-page';
    
    // Initialize the bestiary
    function initBestiary() {
        // Set up event listeners
        setupEventListeners();
        
        // Initialize ambient effects
        initAmbientEffects();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Open book button
        openBookBtn.addEventListener('click', openBook);
        
        // Table of contents entries
        tocEntries.forEach(entry => {
            entry.addEventListener('click', () => {
                const targetPageId = entry.dataset.target;
                navigateToPage(targetPageId);
            });
        });
        
        // Navigation buttons
        prevBtn.addEventListener('click', goToPrevPage);
        nextBtn.addEventListener('click', goToNextPage);
        
        // Sound toggle
        soundToggle.addEventListener('click', toggleSound);
    }
    
    // Initialize ambient effects
    function initAmbientEffects() {
        // Create fire particles for hearth glow
        createFireParticles();
        
        // Add page curl effect on mouse move
        document.addEventListener('mousemove', handleMouseMove);
    }
    
    // Handle mouse movement for page effects
    function handleMouseMove(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Subtle page tilt effect
        pagesContainer.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(0.5 - y) * 5}deg)`;
    }
    
    // Create fire particles for hearth glow
    function createFireParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('fire-particle');
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            hearthGlow.appendChild(particle);
        }
    }
    
    // Open the book to reveal contents
    function openBook() {
        // Animate book cover
        bookCover.style.transform = 'rotateY(-120deg)';
        bookCover.style.opacity = '0';
        
        // Show pages container after a delay
        setTimeout(() => {
            pagesContainer.style.display = 'block';
            pagesContainer.classList.add('opened');
            
            // Show table of contents initially
            document.getElementById('toc-page').classList.add('active');
        }, 800);
        
        // Enable sound if previously enabled
        if (soundEnabled) {
            playAmbientSound();
        }
    }
    
    // Navigate to a specific page
    function navigateToPage(pageId) {
        // Hide current page
        document.getElementById(currentPageId).classList.remove('active');
        
        // Show target page
        document.getElementById(pageId).classList.add('active');
        
        // Update current page tracking
        currentPageId = pageId;
        
        // Update navigation buttons state
        updateNavigationState();
    }
    
    // Go to previous page
    function goToPrevPage() {
        const pageIds = Array.from(pages).map(page => page.id);
        const currentIndex = pageIds.indexOf(currentPageId);
        
        if (currentIndex > 0) {
            navigateToPage(pageIds[currentIndex - 1]);
        }
    }
    
    // Go to next page
    function goToNextPage() {
        const pageIds = Array.from(pages).map(page => page.id);
        const currentIndex = pageIds.indexOf(currentPageId);
        
        if (currentIndex < pageIds.length - 1) {
            navigateToPage(pageIds[currentIndex + 1]);
        }
    }
    
    // Update navigation buttons based on current page
    function updateNavigationState() {
        const pageIds = Array.from(pages).map(page => page.id);
        const currentIndex = pageIds.indexOf(currentPageId);
        
        // Disable previous button on first page
        prevBtn.disabled = (currentIndex === 0);
        
        // Disable next button on last page
        nextBtn.disabled = (currentIndex === pageIds.length - 1);
    }
    
    // Toggle ambient sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            soundIcon.textContent = '🔊';
            playAmbientSound();
        } else {
            soundIcon.textContent = '🔇';
            stopAmbientSound();
        }
    }
    
    // Play ambient forest sounds
    function playAmbientSound() {
        // In a real implementation, we would play actual audio
        // For this demo, we'll just add a visual indicator
        document.body.classList.add('sound-playing');
    }
    
    // Stop ambient sounds
    function stopAmbientSound() {
        document.body.classList.remove('sound-playing');
    }
    
    // Add page turning effect
    function addPageTurnEffect() {
        // Create page turn effect element
        const pageTurn = document.createElement('div');
        pageTurn.classList.add('page-turn-effect');
        document.body.appendChild(pageTurn);
        
        // Remove after animation completes
        setTimeout(() => {
            pageTurn.remove();
        }, 1000);
    }
    
    // Initialize the bestiary when page loads
    initBestiary();
});

// Add fire particle styling dynamically
const fireParticleStyle = document.createElement('style');
fireParticleStyle.textContent = `
    .fire-particle {
        position: absolute;
        bottom: 0;
        background: radial-gradient(circle, rgba(255, 165, 0, 0.8) 0%, rgba(255, 69, 0, 0.5) 70%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        animation: riseUp 4s infinite ease-in;
    }
    
    @keyframes riseUp {
        0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) translateX(20px) scale(1.5);
            opacity: 0;
        }
    }
    
    .page-turn-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.3) 100%);
        pointer-events: none;
        z-index: 1000;
        animation: pageTurnFlash 0.8s ease-out;
    }
    
    @keyframes pageTurnFlash {
        0% { opacity: 0.7; }
        100% { opacity: 0; }
    }
    
    body.sound-playing::after {
        content: "🎵 Forest sounds playing";
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(46, 32, 15, 0.8);
        color: #f5e9d2;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: fadeInOut 3s ease;
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

document.head.appendChild(fireParticleStyle);