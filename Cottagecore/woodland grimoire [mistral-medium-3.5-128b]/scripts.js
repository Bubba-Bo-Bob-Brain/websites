// ===== DOM Elements =====
const nightModeToggle = document.getElementById('night-mode');
const body = document.body;
const seasonalWheel = document.querySelector('.seasonal-wheel');
const wheelPointer = document.querySelector('.wheel-pointer');
const wheelCenter = document.querySelector('.wheel-center');
const ingredientLists = document.querySelectorAll('.ingredient-list');
const navTabs = document.querySelectorAll('.nav-tab');
const recipeCards = document.querySelectorAll('.recipe-card');
const pressedFlowerBorder = document.querySelector('.pressed-flower-border');
const flowers = document.querySelectorAll('.flower');

// ===== Night Mode Toggle =====
nightModeToggle.addEventListener('change', () => {
    body.classList.toggle('night-mode');

    // Add a smooth transition for theme changes
    document.documentElement.style.setProperty('--transition-slow', '0.8s ease');
    setTimeout(() => {
        document.documentElement.style.removeProperty('--transition-slow');
    }, 800);

    // Animate the moth and candle in the toggle
    const moth = document.querySelector('.moth');
    const candle = document.querySelector('.candle');

    if (nightModeToggle.checked) {
        // Night mode: moth flutters in
        moth.style.transform = 'translateY(0) scale(1.1)';
        candle.style.transform = 'translateY(5px) scale(0.9)';
    } else {
        // Day mode: candle glows
        moth.style.transform = 'translateY(-5px) scale(0.9)';
        candle.style.transform = 'translateY(0) scale(1.1)';
    }

    // Reset after animation
    setTimeout(() => {
        moth.style.transform = nightModeToggle.checked ? 'translateY(0)' : 'translateY(-5px)';
        candle.style.transform = nightModeToggle.checked ? 'translateY(5px)' : 'translateY(0)';
    }, 300);
});

// ===== Seasonal Wheel Interactivity =====
let isSpinning = false;
let currentSeason = 'spring';

// Rotate the wheel and update ingredients
seasonalWheel.addEventListener('click', (e) => {
    if (isSpinning) return;

    isSpinning = true;
    const rect = seasonalWheel.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(clickY - centerY, clickX - centerX) * (180 / Math.PI);

    // Determine which season was clicked
    let targetSeason;
    if (angle >= -45 && angle < 45) {
        targetSeason = 'summer';
    } else if (angle >= 45 && angle < 135) {
        targetSeason = 'autumn';
    } else if (angle >= -135 && angle < -45) {
        targetSeason = 'winter';
    } else {
        targetSeason = 'spring';
    }

    // Rotate the wheel to the target season
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const currentIndex = seasons.indexOf(currentSeason);
    const targetIndex = seasons.indexOf(targetSeason);
    const rotationAngle = (targetIndex - currentIndex) * 90;

    seasonalWheel.style.transition = 'transform 1.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    seasonalWheel.style.transform = `rotate(${rotationAngle}deg)`;

    // Update the pointer
    wheelPointer.style.transition = 'transform 0.5s ease';
    wheelPointer.style.transform = `rotate(${rotationAngle + 90 * targetIndex}deg)`;

    // Hide all ingredient lists
    ingredientLists.forEach(list => {
        list.classList.add('hidden');
    });

    // Show the target season's ingredients
    setTimeout(() => {
        document.getElementById(`${targetSeason}-ingredients`).classList.remove('hidden');
        currentSeason = targetSeason;
        isSpinning = false;
    }, 1500);

    // Reset transition after animation
    setTimeout(() => {
        seasonalWheel.style.transition = '';
    }, 1500);
});

// Initialize the seasonal wheel
document.getElementById('spring-ingredients').classList.remove('hidden');

// ===== Smooth Scrolling for Navigation Tabs =====
navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Remove active class from all tabs
        navTabs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Scroll to the target section
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for sticky nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update active tab on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100; // Offset for sticky nav

    navTabs.forEach(tab => {
        const targetId = tab.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionBottom = sectionTop + targetSection.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            }
        }
    });
});

// ===== Cauldron Animation Enhancement =====
const cauldron = document.querySelector('.cauldron');

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.width = `${Math.random() * 15 + 5}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.left = `${Math.random() * 120 + 15}px`;
    bubble.style.bottom = '10px';
    bubble.style.animationDuration = `${Math.random() * 2 + 1}s`;
    bubble.style.animationDelay = `${Math.random() * 1}s`;

    cauldron.appendChild(bubble);

    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, 3000);
}

function createSteam() {
    const steam = document.createElement('div');
    steam.className = 'steam';
    steam.style.width = `${Math.random() * 20 + 15}px`;
    steam.style.height = steam.style.width;
    steam.style.left = `${Math.random() * 100 + 20}px`;
    steam.style.bottom = '110px';
    steam.style.animationDuration = `${Math.random() * 2 + 2}s`;
    steam.style.animationDelay = `${Math.random() * 1}s`;

    cauldron.appendChild(steam);

    // Remove steam after animation
    setTimeout(() => {
        steam.remove();
    }, 4000);
}

// Create bubbles and steam periodically
setInterval(createBubble, 800);
setInterval(createSteam, 1500);

// ===== Recipe Card Micro-Interactions =====
recipeCards.forEach(card => {
    // Tilt effect on hover
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (y - centerY) / 10;
        const tiltY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });

    // Parallax effect for recipe images
    const image = card.querySelector('.recipe-image');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x - rect.width / 2) / 20;
        const moveY = (y - rect.height / 2) / 20;

        image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        image.style.transform = 'translate(0, 0) scale(1)';
    });
});

// ===== Pressed Flower Border Animation =====
function animateFlowers() {
    flowers.forEach(flower => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomScale = 0.9 + Math.random() * 0.2;

        flower.style.transition = 'transform 3s ease-in-out';
        flower.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale}) rotate(${Math.random() * 30 - 15}deg)`;

        setTimeout(() => {
            flower.style.transition = '';
        }, 3000);
    });
}

// Animate flowers periodically
setInterval(animateFlowers, 4000);

// Initialize flower positions
animateFlowers();

// ===== Dynamic Ingredient Display =====
// Function to show ingredients for a specific season
function showSeasonIngredients(season) {
    ingredientLists.forEach(list => {
        list.classList.add('hidden');
    });
    document.getElementById(`${season}-ingredients`).classList.remove('hidden');
    currentSeason = season;
}

// Allow keyboard navigation for the seasonal wheel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(currentSeason);
        const nextIndex = (currentIndex + 1) % seasons.length;
        showSeasonIngredients(seasons[nextIndex]);

        // Rotate the wheel
        seasonalWheel.style.transition = 'transform 1s ease';
        seasonalWheel.style.transform = `rotate(${nextIndex * 90}deg)`;
        wheelPointer.style.transform = `rotate(${nextIndex * 90 + 90}deg)`;

        setTimeout(() => {
            seasonalWheel.style.transition = '';
        }, 1000);
    } else if (e.key === 'ArrowLeft') {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(currentSeason);
        const prevIndex = (currentIndex - 1 + seasons.length) % seasons.length;
        showSeasonIngredients(seasons[prevIndex]);

        // Rotate the wheel
        seasonalWheel.style.transition = 'transform 1s ease';
        seasonalWheel.style.transform = `rotate(${prevIndex * 90}deg)`;
        wheelPointer.style.transform = `rotate(${prevIndex * 90 + 90}deg)`;

        setTimeout(() => {
            seasonalWheel.style.transition = '';
        }, 1000);
    }
});

// ===== Initialize =====
// Set the initial active tab based on the first section
navTabs[0].classList.add('active');