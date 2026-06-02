// ===== GLOBAL VARIABLES =====
const body = document.body;
const parchment = document.querySelector('.parchment-container');
const bell = document.getElementById('bell');
const bellAudio = document.getElementById('bell-audio');
const ambianceAudio = document.getElementById('ambiance-audio');
const toggleCycle = document.getElementById('toggle-cycle');
const map = document.getElementById('map');
const mapLocations = document.querySelectorAll('.map-location');
const plagueDoctors = document.querySelectorAll('.plague-doctor');
const seasonalDecor = document.getElementById('seasonal-decor');
const currentYear = document.getElementById('current-year');

// Dark Ages timeline (random year between 800–1400)
const darkAgesYear = Math.floor(Math.random() * 600) + 800;
currentYear.textContent = darkAgesYear;

// ===== DAY/NIGHT CYCLE =====
let isDay = true;
toggleCycle.addEventListener('click', () => {
    isDay = !isDay;
    body.setAttribute('data-theme', isDay ? 'light' : 'dark');

    // Seasonal effects
    updateSeasonalDecor();

    // Play ambiance sound (louder at night)
    ambianceAudio.volume = isDay ? 0.2 : 0.5;
    if (!isDay && ambianceAudio.paused) ambianceAudio.play();
    if (isDay) ambianceAudio.pause();
});

// ===== SEASONAL DECORATIONS =====
function updateSeasonalDecor() {
    // Clear existing decorations
    seasonalDecor.innerHTML = '';

    // "Month" based on scroll position (0–11)
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const month = Math.floor(scrollPercent * 12);

    // Autumn (September–November): Falling leaves
    if (month >= 8 && month <= 10) {
        for (let i = 0; i < 50; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.style.left = `${Math.random() * 100}%`;
            leaf.style.animationDuration = `${5 + Math.random() * 10}s`;
            leaf.style.animationDelay = `${Math.random() * 5}s`;
            leaf.style.opacity = Math.random() * 0.7 + 0.3;
            seasonalDecor.appendChild(leaf);
        }
    }
    // Winter (December–February): Snowflakes
    else if (month >= 11 || month <= 1) {
        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.width = `${Math.random() * 5 + 2}px`;
            snowflake.style.height = snowflake.style.width;
            snowflake.style.animationDuration = `${10 + Math.random() * 10}s`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            snowflake.style.opacity = Math.random() * 0.8;
            seasonalDecor.appendChild(snowflake);
        }
    }
}

// ===== TOLLING BELL =====
bell.addEventListener('click', () => {
    // Bell animation
    bell.style.transform = 'rotate(-20deg)';
    setTimeout(() => bell.style.transform = 'rotate(20deg)', 100);
    setTimeout(() => bell.style.transform = 'rotate(0)', 200);

    // Clapper animation
    const clapper = document.querySelector('.bell-clapper');
    clapper.style.transform = 'translateX(-50%) rotate(30deg)';
    setTimeout(() => clapper.style.transform = 'translateX(-50%) rotate(-30deg)', 100);
    setTimeout(() => clapper.style.transform = 'translateX(-50%)', 200);

    // Sound effect
    bellAudio.currentTime = 0;
    bellAudio.play();

    // Plague doctors react
    plagueDoctors.forEach(doctor => {
        doctor.style.transform = 'scale(1.2)';
        setTimeout(() => doctor.style.transform = 'scale(1)', 300);
    });
});

// ===== PLAGUE DOCTOR AI =====
plagueDoctors.forEach((doctor, index) => {
    // Initial position
    let posX = Math.random() * 80 + 10;
    let posY = Math.random() * 80 + 10;
    doctor.style.left = `${posX}%`;
    doctor.style.top = `${posY}%`;

    // Wander behavior
    setInterval(() => {
        if (!doctor.classList.contains('following')) {
            posX += (Math.random() - 0.5) * 10;
            posY += (Math.random() - 0.5) * 10;
            posX = Math.max(10, Math.min(90, posX));
            posY = Math.max(10, Math.min(90, posY));
            doctor.style.left = `${posX}%`;
            doctor.style.top = `${posY}%`;
        }
    }, 2000);

    // Click interaction
    doctor.addEventListener('click', () => {
        doctor.classList.toggle('following');
        if (doctor.classList.contains('following')) {
            doctor.style.zIndex = '100';
            doctor.querySelector('.doctor-robe').style.backgroundColor = '#5a3e2b';
        } else {
            doctor.style.zIndex = '10';
            doctor.querySelector('.doctor-robe').style.backgroundColor = '';
        }
    });
});

// ===== KINGDOM MAP INTERACTIONS =====
// Tooltips
mapLocations.forEach(location => {
    const tooltip = document.createElement('div');
    tooltip.classList.add('map-tooltip');
    tooltip.textContent = `${location.dataset.name} (${location.dataset.type})`;
    location.appendChild(tooltip);

    location.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });
    location.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
});

// Plague doctor follows map path
function updatePlagueDoctorPaths() {
    plagueDoctors.forEach((doctor, index) => {
        if (!doctor.classList.contains('following')) return;

        const locations = Array.from(mapLocations);
        const target = locations[index % locations.length];
        const rect = target.getBoundingClientRect();
        const mapRect = map.getBoundingClientRect();

        const targetX = (rect.left + rect.width / 2 - mapRect.left) / mapRect.width * 100;
        const targetY = (rect.top + rect.height / 2 - mapRect.top) / mapRect.height * 100;

        doctor.style.left = `${targetX}%`;
        doctor.style.top = `${targetY}%`;
    });
    requestAnimationFrame(updatePlagueDoctorPaths);
}
updatePlagueDoctorPaths();

// ===== INITIAL SETUP =====
// Set initial theme based on time of day
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
    toggleCycle.click();
}

// Load seasonal decorations
updateSeasonalDecor();

// Listen for scroll to update seasonal effects
window.addEventListener('scroll', updateSeasonalDecor);

// ===== EASTER EGG =====
// Konami code (↑↑↓↓←→←→BA) to summon a dragon
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) konamiCode.shift();
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        alert('A dragon appears! The village burns...');
        // Add a dragon sprite to the map
        const dragon = document.createElement('div');
        dragon.classList.add('dragon');
        dragon.style.position = 'absolute';
        dragon.style.width = '100px';
        dragon.style.height = '60px';
        dragon.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 60\"><path d=\"M20 30 L40 20 L60 30 L80 10 L90 25 L70 35 L90 45 L80 55 L60 40 L40 50 L20 30 Z\" fill=\"%238B0000\"/><circle cx=\"85\" cy=\"20\" r=\"3\" fill=\"%23FF4500\"/></svg>')";
        dragon.style.backgroundSize = 'contain';
        dragon.style.top = '20%';
        dragon.style.left = '20%';
        dragon.style.zIndex = '100';
        dragon.style.animation = 'dragonFly 5s linear infinite';
        map.appendChild(dragon);
    }
});

// Add CSS for easter egg dragon
const style = document.createElement('style');
style.textContent = `
    @keyframes dragonFly {
        0% { transform: translateX(-100px); }
        100% { transform: translateX(1000px); }
    }
    .dragon {
        pointer-events: none;
    }
`;
document.head.appendChild(style);