/**
 * OPERATION IRON AEGIS - COMMAND CONTROL LOGIC
 * Version: 1.0.4 (Classified)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const INTERCEPT_MESSAGES = [
        "UNIDENTIFIED SIGNAL DETECTED: SECTOR 4",
        "REINFORCEMENTS DELAYED BY HEAVY WEATHER",
        "ENEMIES SPOTTED NEAR COASTAL DEFENSES",
        "SUPPLY LINE BREACHED - SECTOR 9",
        "ALL UNITS STAND BY FOR FURTHER ORDERS",
        "RADIO SILENCE IN EFFECT: SECTOR 1",
        "RECONNAISSANCE REPORT: GROUND MOVEMENTS DETECTED",
        "URGENT: REFUELING REQUIRED AT BASE ALPHA",
        "SIGNAL LOST: COMMAND POST BRAVO",
        "WEATHER UPDATE: STORM APPROACHING FROM WEST"
    ];

    const PROPAGANDA_SLOGANS = [
        "VICTORY IS WITHIN REACH",
        "STRENGTH THROUGH UNITY",
        "PRODUCTION IS OUR WEAPON",
        "THE FRONT LINE WAITS FOR YOU",
        "FOR THE MOTHERLAND!",
        "STAY VIGILANT, STAY READY"
    ];

    const UNIT_DESIGNATIONS = ["A-", "B-", "C-", "X-", "MK-"];

    // --- DOM Elements ---
    const elements = {
        interceptFeed: document.getElementById('intercept-feed'),
        propagandaDisplay: document.getElementById('propaganda-display'),
        clock: document.getElementById('clock'),
        unitLayer: document.getElementById('unit-layer'),
        btnDeploy: document.getElementById('btn-deploy'),
        btnReset: document.getElementById('btn-reset'),
        gaugeSteel: document.getElementById('gauge-steel'),
        gaugeFuel: document.getElementById('gauge-fuel'),
        gaugeAmmo: document.getElementById('gauge-ammo'),
        mapContainer: document.querySelector('.map-container')
    };

    // --- State Management ---
    let isDragging = false;
    let currentTarget = null;
    let offset = { x: 0, y: 0 };

    // --- Initialization ---
    function init() {
        startClock();
        startGauges();
        startPropagandaRotation();
        startRadioIntercepts();
        setupEventListeners();
        console.log("COMMAND SYSTEM: ONLINE");
    }

    // --- Core Systems ---

    /**
     * Real-time military clock
     */
    function startClock() {
        setInterval(() => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            elements.clock.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }

    /**
     * Simulates fluctuating resource levels via analog gauges
     */
    function startGauges() {
        const updateGauge = (el) => {
            const randomAngle = Math.floor(Math.random() * 240) - 120; // -120 to 120 deg
            el.style.transform = `rotate(${randomAngle}deg)`;
        };

        setInterval(() => {
            updateGauge(elements.gaugeSteel);
            updateGauge(elements.gaugeFuel);
            updateGauge(elements.gaugeAmmo);
        }, 3000);
    }

    /**
     * Rotates propaganda slides
     */
    function startPropagandaRotation() {
        let index = 0;
        const rotate = () => {
            elements.propagandaDisplay.textContent = PROPAGANDA_SLOGANS[index];
            elements.propagandaDisplay.style.opacity = 0;
            
            setTimeout(() => {
                index = (index + 1) % PROPAGANDA_SLOGANS.length;
                elements.propagandaDisplay.style.opacity = 1;
            }, 500);
        };

        rotate();
        setInterval(rotate, 8000);
    }

    /**
     * Simulates crackling teletype radio intercepts
     */
    function startRadioIntercepts() {
        const addMessage = () => {
            const msg = INTERCEPT_MESSAGES[Math.floor(Math.random() * INTERCEPT_MESSAGES.length)];
            const line = document.createElement('div');
            line.className = 'intercept-line';
            line.style.marginBottom = '8px';
            line.style.borderLeft = '2px solid var(--color-warning)';
            line.style.paddingLeft = '5px';
            line.textContent = `> ${msg}`;
            
            elements.interceptFeed.appendChild(line);

            // Auto-scroll
            elements.interceptFeed.scrollTop = elements.interceptFeed.scrollHeight;

            // Cleanup old messages to prevent DOM bloat
            if (elements.interceptFeed.children.length > 15) {
                elements.interceptFeed.removeChild(elements.interceptFeed.firstChild);
            }
        };

        // Random interval for "bursts" of radio traffic
        const loop = () => {
            const delay = Math.random() * 4000 + 2000;
            setTimeout(() => {
                addMessage();
                loop();
            }, delay);
        };
        loop();
    }

    // --- Tactical Map & Unit Management ---

    /**
     * Creates a new draggable unit token on the map
     */
    function createUnit() {
        const token = document.createElement('div');
        token.className = 'unit-token';
        
        // Random designation
        const prefix = UNIT_DESIGNATIONS[Math.floor(Math.random() * UNIT_DESIGNATIONS.length)];
        const num = Math.floor(Math.random() * 99);
        token.textContent = prefix + num;

        // Random starting position within the map
        const rect = elements.mapContainer.getBoundingClientRect();
        const startX = Math.random() * (rect.width - 40) + 20;
        const startY = Math.random() * (rect.height - 40) + 20;

        token.style.left = `${startX}px`;
        token.style.top = `${startY}px`;

        // Attach drag events
        token.addEventListener('mousedown', startDragging);
        
        elements.unitLayer.appendChild(token);
    }

    function clearMap() {
        elements.unitLayer.innerHTML = '';
    }

    // --- Drag & Drop Logic ---

    function startDragging(e) {
        isDragging = true;
        currentTarget = e.target;
        
        // Calculate offset so token doesn't "jump" to cursor center
        const rect = currentTarget.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        
        currentTarget.style.cursor = 'grabbing';
        currentTarget.style.zIndex = 1000;
    }

    function drag(e) {
        if (!isDragging || !currentTarget) return;

        const mapRect = elements.mapContainer.getBoundingClientRect();
        
        // Calculate new position relative to map container
        let newX = e.clientX - mapRect.left - offset.x;
        let newY = e.clientY - mapRect.top - offset.y;

        // Boundary Clamping
        const maxX = mapRect.width - currentTarget.offsetWidth;
        const maxY = mapRect.height - currentTarget.offsetHeight;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        currentTarget.style.left = `${newX}px`;
        currentTarget.style.top = `${newY}px`;
    }

    function stopDragging() {
        if (currentTarget) {
            currentTarget.style.cursor = 'grab';
            currentTarget.style.zIndex = 10;
        }
        isDragging = false;
        currentTarget = null;
    }

    // --- Event Listeners ---

    function setupEventListeners() {
        elements.btnDeploy.addEventListener('click', createUnit);
        elements.btnReset.addEventListener('click', clearMap);

        // Global mouse movements for dragging
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDragging);

        // Prevent default drag behavior on images/text
        elements.mapContainer.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // Start the engine
    init();
});