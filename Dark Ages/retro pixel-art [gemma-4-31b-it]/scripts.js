/**
 * CHRONICLES OF THE IRON AGE - INTERACTIVE ENGINE
 * Logic for atmospheric lighting, time cycles, and world exploration.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        isDay: true,
        currentSection: 'lore',
        lastToll: Date.now()
    };

    // --- DOM Elements ---
    const body = document.body;
    const torch = document.querySelector('.torch-light');
    const timeLabel = document.getElementById('time-label');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const mapMarkers = document.querySelectorAll('.map-marker');
    const regionName = document.getElementById('region-name');
    const regionDesc = document.getElementById('region-desc');
    const bell = document.getElementById('toll-bell');

    // --- Lore Data for Map ---
    const regionData = {
        'black-forest': {
            name: "The Whispering Weald",
            desc: "A dense, suffocating forest where the trees are said to feed on the memories of lost travelers. Legends speak of a hidden druid circle that still guards the Old Tongue."
        },
        'plague-city': {
            name: "Oubliette of the Damned",
            desc: "Once a thriving trade hub, now a silent necropolis. The air is thick with the scent of vinegar and burnt sage. Only the Masked Ones dare enter the inner walls."
        },
        'iron-keep': {
            name: "The Bastion of Iron",
            desc: "The last stronghold of the Northern Kings. Its walls are forged from star-fallen ore, making it impervious to both siege engines and sorcery."
        }
    };

    // --- 1. Torchlight Effect ---
    // The light follows the cursor, creating a dynamic spotlight effect
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        torch.style.background = `radial-gradient(circle 300px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.7) 100%)`;
    });

    // --- 2. Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active state
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            state.currentSection = targetId;
        });
    });

    // --- 3. Map Interaction ---
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const regionId = marker.getAttribute('data-region');
            const data = regionData[regionId];
            
            // Animation for the info panel
            const infoPanel = document.getElementById('map-info');
            infoPanel.style.animation = 'none';
            infoPanel.offsetHeight; // Trigger reflow
            infoPanel.style.animation = 'fadeIn 0.5s ease';

            regionName.textContent = data.name;
            regionDesc.textContent = data.desc;
        });
    });

    // --- 4. Day/Night Cycle System ---
    const toggleCycle = () => {
        state.isDay = !state.isDay;
        
        if (state.isDay) {
            body.classList.remove('cycle-night');
            body.classList.add('cycle-day');
            timeLabel.textContent = "The Sun Rises";
        } else {
            body.classList.remove('cycle-day');
            body.classList.add('cycle-night');
            timeLabel.textContent = "The Shadows Lengthen";
        }
    };

    // Automatically change cycle every 60 seconds for atmospheric effect
    setInterval(toggleCycle, 60000);

    // --- 5. The Toll of Fate (Bell Animation) ---
    const tollBell = () => {
        bell.classList.add('bell-ringing');
        
        // Screen shake effect
        body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        setTimeout(() => {
            bell.classList.remove('bell-ringing');
            body.style.animation = '';
        }, 2000);
    };

    bell.addEventListener('click', tollBell);

    // Randomly trigger the bell every few minutes to surprise the user
    const randomToll = () => {
        const nextToll = Math.random() * (300000 - 120000) + 120000; // Between 2 and 5 mins
        setTimeout(() => {
            tollBell();
            randomToll();
        }, nextToll);
    };
    randomToll();

    // --- 6. Custom Shake Animation Injection ---
    // Injecting a keyframe dynamically since it's a specific event trigger
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(style);
});