const initialProducts = [
    { id: 'carpet-crescent', name: 'Sari of the Crescent Moon', price: 1200 },
    { id: 'djinn-crimson', name: 'Essence of the Crimson Sun', price: 3500 },
    { id: 'curio-astrolabe', name: 'The Obsidian Astrolabe', price: 850 },
    { id: 'spice-saffron', name: 'Saffron of the Seventh Eclipse', price: 450 },
    { id: 'djinn-marid', name: 'Tears of the Azure Abyss', price: 4800 },
    { id: 'carpet-royal', name: 'The Shah\'s Crimson Loom', price: 2900 }
];

const oracleResponses = [
    "A journey of three moons will bring you wealth beyond gold.",
    "The blue djinn whispers of a betrayal in the oasis garden.",
    "Heed the shadow under the palace archway at twilight.",
    "A chest of buried copper holds the keys to your destiny.",
    "The carpet you choose carries the weight of a forgotten crown.",
    "A stranger with golden rings will offer you an impossible spice.",
    "Silence is your greatest armor in the courts of Damascus."
];

const oracleFortunes = [
    "Fortuna smiles. Take this key code: BAZAAR786 for 10% off your astral journeys.",
    "The Marid grants you safe passage across the Empty Quarter.",
    "A celestial blessing has lowered the veil. You see paths others miss.",
    "The stars indicate immense prosperity in your next caravan trade."
];

let cart = [];
let audioCtx = null;
let ambientDrone = null;
let droneGain = null;
let filterNode = null;
let isAudioPlaying = false;

let lastMouseX = 0;
let lastMouseY = 0;
let rubProgressValue = 0;
let isRubbing = false;

const smokeParticles = [];
const lampSparks = [];

const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

function initializeBazaar() {
    setupGradients();
    setupEventListeners();
    setupSmokeCanvas();
    animateSmoke();
}

function setupGradients() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgDefs = document.createElementNS(svgNS, "svg");
    svgDefs.setAttribute("id", "gradientContainer");
    svgDefs.style.position = "absolute";
    svgDefs.style.width = "0";
    svgDefs.style.height = "0";

    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "goldGradient");
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "100%");
    linearGradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#ffd700");

    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "50%");
    stop2.setAttribute("stop-color", "#d4af37");

    const stop3 = document.createElementNS(svgNS, "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#8a6d1c");

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    linearGradient.appendChild(stop3);
    defs.appendChild(linearGradient);
    svgDefs.appendChild(defs);
    document.body.appendChild(svgDefs);
}

function setupEventListeners() {
    document.addEventListener('mousemove', handleCursorGlow);

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterMarketplace(button.getAttribute('data-filter'));
        });
    });

    const satchelTrigger = document.getElementById('satchelTrigger');
    const satchelSidebar = document.getElementById('satchelSidebar');
    const satchelClose = document.getElementById('satchelClose');

    satchelTrigger.addEventListener('click', () => {
        satchelSidebar.classList.add('open');
    });

    satchelClose.addEventListener('click', () => {
        satchelSidebar.classList.remove('open');
    });

    const productGrid = document.getElementById('productGrid');
    productGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart-btn');
        if (button) {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            addToSatchel(productId, productName, productPrice);
            animateButtonSuccess(button);
        }
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', processCheckout);

    const ambientToggle = document.getElementById('ambientToggle');
    ambientToggle.addEventListener('click', toggleMysticalAmbientAudio);

    const consultOracleBtn = document.getElementById('consultOracleBtn');
    consultOracleBtn.addEventListener('click', consultTheOasisOracle);

    const magicLamp = document.getElementById('magicLamp');
    magicLamp.addEventListener('mousedown', startRubbing);
    document.addEventListener('mouseup', stopRubbing);
    document.addEventListener('mousemove', performRubbing);

    magicLamp.addEventListener('touchstart', (e) => startRubbing(e.touches[0]));
    document.addEventListener('touchend', stopRubbing);
    document.addEventListener('touchmove', (e) => performRubbing(e.touches[0]));
}

function handleCursorGlow(event) {
    const cursorGlow = document.getElementById('cursorGlow');
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
}

function filterMarketplace(category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

function addToSatchel(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateSatchelUI();
}

function removeFromSatchel(id) {
    cart = cart.filter(item => item.id !== id);
    updateSatchelUI();
}

function updateSatchelUI() {
    const satchelItemsContainer = document.getElementById('satchelItems');
    const cartCountElement = document.getElementById('cartCount');
    const satchelTotalElement = document.getElementById('satchelTotal');

    satchelItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        satchelItemsContainer.innerHTML = `
            <div class="satchel-empty-state">
                <p>Your satchel is empty. Wander the bazaar and gather rare relics.</p>
            </div>`;
        cartCountElement.textContent = '0';
        satchelTotalElement.textContent = '0 Dinars';
        return;
    }

    let grandTotal = 0;
    let totalItemsCount = 0;

    cart.forEach(item => {
        grandTotal += item.price * item.quantity;
        totalItemsCount += item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <h5 class="cart-item-title">${item.name} (${item.quantity})</h5>
                <span class="cart-item-price">${item.price * item.quantity} Dinars</span>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">&times;</button>
        `;
        satchelItemsContainer.appendChild(cartItemDiv);
    });

    cartCountElement.textContent = totalItemsCount;
    satchelTotalElement.textContent = `${grandTotal.toLocaleString()} Dinars`;

    const removeButtons = satchelItemsContainer.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            removeFromSatchel(id);
        });
    });
}

function animateButtonSuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Added to Satchel ✦</span>';
    button.style.background = 'linear-gradient(135deg, #00e5ff, #00838f)';
    button.style.color = '#05080c';
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.color = '';
    }, 2000);
}

function processCheckout() {
    if (cart.length === 0) {
        alert("Your satchel is empty. Gather mystical goods before processing transaction.");
        return;
    }
    alert("The merchant nods and whispers a quiet blessing. Your transaction is complete. Your relics will manifest in your sanctuary shortly.");
    cart = [];
    updateSatchelUI();
    document.getElementById('satchelSidebar').classList.remove('open');
}

function consultTheOasisOracle() {
    const questionInput = document.getElementById('oracleQuestion');
    const mirrorVision = document.getElementById('mirrorVision');
    const mirrorSurface = document.getElementById('mirrorSurface');

    if (!questionInput.value.trim()) {
        mirrorVision.textContent = "You must offer words to the mirror...";
        return;
    }

    mirrorVision.style.opacity = '0';
    mirrorSurface.style.boxShadow = 'inset 0 0 50px rgba(0, 229, 255, 0.8)';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * oracleResponses.length);
        mirrorVision.textContent = `"${oracleResponses[randomIndex]}"`;
        mirrorVision.style.opacity = '1';
        mirrorSurface.style.boxShadow = '';
        questionInput.value = '';
    }, 1500);
}

function startRubbing(event) {
    isRubbing = true;
    lastMouseX = event.clientX || event.pageX;
    lastMouseY = event.clientY || event.pageY;
    const magicLamp = document.getElementById('magicLamp');
    magicLamp.style.transform = 'scale(1.05)';
}

function stopRubbing() {
    isRubbing = false;
    const magicLamp = document.getElementById('magicLamp');
    magicLamp.style.transform = 'scale(1)';
}

function performRubbing(event) {
    if (!isRubbing) return;

    const currentX = event.clientX || event.pageX;
    const currentY = event.clientY || event.pageY;

    const distance = Math.sqrt(Math.pow(currentX - lastMouseX, 2) + Math.pow(currentY - lastMouseY, 2));

    if (distance > 5) {
        rubProgressValue += distance * 0.15;
        if (rubProgressValue > 100) rubProgressValue = 100;

        document.getElementById('rubProgress').style.width = `${rubProgressValue}%`;
        spawnSparks(currentX, currentY);

        lastMouseX = currentX;
        lastMouseY = currentY;

        if (rubProgressValue >= 100) {
            triggerLampSummoning();
        }
    }
}

function spawnSparks(x, y) {
    const lampSmokeEmitter = document.getElementById('lampSmokeEmitter');
    const rect = lampSmokeEmitter.getBoundingClientRect();
    const emitX = rect.left + window.scrollX;
    const emitY = rect.top + window.scrollY;

    for (let i = 0; i < 3; i++) {
        lampSparks.push({
            x: emitX,
            y: emitY,
            vx: (Math.random() - 0.5) * 4 - 2,
            vy: -Math.random() * 3 - 1,
            alpha: 1,
            size: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#ffd700' : '#00e5ff'
        });
    }
}

function triggerLampSummoning() {
    isRubbing = false;
    rubProgressValue = 0;
    document.getElementById('rubProgress').style.width = '0%';

    const oracleResponse = document.getElementById('oracleResponse');
    const oracleText = oracleResponse.querySelector('.oracle-text');
    const oracleReward = oracleResponse.querySelector('.oracle-reward');

    oracleText.textContent = '"Greetings, mortal... Your touch releases the winds of fortune."';
    oracleReward.textContent = oracleFortunes[Math.floor(Math.random() * oracleFortunes.length)];

    oracleResponse.classList.add('visible');

    for (let i = 0; i < 40; i++) {
        smokeParticles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 + 100,
            vx: (Math.random() - 0.5) * 10,
            vy: -Math.random() * 8 - 4,
            alpha: 1,
            size: Math.random() * 20 + 10,
            color: 'rgba(0, 229, 255, 0.4)',
            life: 0,
            maxLife: 100
        });
    }

    setTimeout(() => {
        oracleResponse.classList.remove('visible');
    }, 10000);
}

function setupSmokeCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.15) {
        smokeParticles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 1,
            vy: -Math.random() * 1.5 - 0.5,
            alpha: 0.35,
            size: Math.random() * 40 + 20,
            color: 'rgba(212, 175, 55, 0.08)',
            life: 0,
            maxLife: 400 + Math.random() * 200
        });
    }

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life / 30) * 0.4;
        p.y += p.vy;
        p.alpha = (1 - p.life / p.maxLife) * 0.35;

        if (p.life >= p.maxLife || p.x < 0 || p.x > canvas.width) {
            smokeParticles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(5, 8, 12, 0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = lampSparks.length - 1; i >= 0; i--) {
        const s = lampSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.02;

        if (s.alpha <= 0) {
            lampSparks.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    requestAnimationFrame(animateSmoke);
}

function toggleMysticalAmbientAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!isAudioPlaying) {
        audioCtx.resume();
        startSynthDrone();
        document.getElementById('ambientToggle').classList.add('active');
        document.getElementById('ambientToggle').style.boxShadow = '0 0 15px #00e5ff';
        isAudioPlaying = true;
    } else {
        stopSynthDrone();
        document.getElementById('ambientToggle').classList.remove('active');
        document.getElementById('ambientToggle').style.boxShadow = '';
        isAudioPlaying = false;
    }
}

function startSynthDrone() {
    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 2.0);

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(300, audioCtx.currentTime);

    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110.2, audioCtx.currentTime);

    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(165, audioCtx.currentTime);

    osc1.connect(filterNode);
    osc2.connect(filterNode);
    osc3.connect(filterNode);

    filterNode.connect(droneGain);
    droneGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    ambientDrone = { osc1, osc2, osc3 };

    simulateResonanceModulation();
}

function simulateResonanceModulation() {
    if (!isAudioPlaying || !filterNode) return;
    const baseFreq = 250;
    const modulationRange = 150;
    const targetFreq = baseFreq + Math.sin(audioCtx.currentTime * 0.5) * modulationRange;
    filterNode.frequency.linearRampToValueAtTime(targetFreq, audioCtx.currentTime + 0.1);
    setTimeout(simulateResonanceModulation, 100);
}

function stopSynthDrone() {
    if (droneGain) {
        droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
        setTimeout(() => {
            if (ambientDrone) {
                ambientDrone.osc1.stop();
                ambientDrone.osc2.stop();
                ambientDrone.osc3.stop();
            }
        }, 1100);
    }
}

window.addEventListener('DOMContentLoaded', initializeBazaar);