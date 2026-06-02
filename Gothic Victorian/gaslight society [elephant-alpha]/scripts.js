// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const envelope = document.getElementById('envelope');
    const invitationText = document.querySelector('.invitation-text');
    const membersGrid = document.getElementById('membersGrid');
    const circleItems = document.querySelectorAll('.circle-item');
    const secHand = document.querySelector('.sec-hand');
    const minuteHand = document.querySelector('.min-hand');
    const hourHand = document.querySelector('.hour-hand');

    // --- Member Data ---
    const members = [
        {
            name: "Lord Malphas D'Argent",
            specialty: "Necromancy & Soul Binding",
            seance: "Every Tuesday at Midnight",
            imageTint: "hue-rotate(10deg) saturate(1.5) contrast(1.1)",
        },
        {
            name: "Arachne Blackwood",
            specialty: "Illusion Weaving & Glamour",
            seance: "Every Thursday at Dusk",
            imageTint: "hue-rotate(-30deg) saturate(1.2) contrast(1.05)",
        },
        {
            name: "Ignatius Pyre",
            specialty: "Infernal Conjuration",
            seance: "Every Friday the 13th",
            imageTint: "hue-rotate(-10deg) saturate(1.8) contrast(1.2)",
        },
        {
            name: "Seraphina Vesper",
            specialty: "Celestial Divination",
            seance: "Every Solstice",
            imageTint: "hue-rotate(20deg) saturate(1.3) contrast(1.1)",
        },
        {
            name: "Caspian Thorn",
            specialty: "Shadow Manipulation",
            seance: "Every New Moon",
            imageTint: "hue-rotate(-20deg) saturate(1.6) contrast(1.15)",
        },
        {
            name: "Morticia Fallow",
            specialty: "Herbalism & Poisoncraft",
            seance: "Every Sunday at Dawn",
            imageTint: "hue-rotate(5deg) saturate(1.4) contrast(1.08)",
        },
        {
            name: "Valerius Nocturne",
            specialty: "Blood Magic & Alchemy",
            seance: "Every Equinox",
            imageTint: "hue-rotate(-15deg) saturate(1.7) contrast(1.12)",
        },
        {
            name: "Elowen Fairwind",
            specialty: "Elemental Calling",
            seance: "Randomly, in the wind",
            imageTint: "hue-rotate(15deg) saturate(1.3) contrast(1.05)",
        }
    ];

    // --- Functions ---

    /**
     * Animates the grandfather clock hands.
     */
    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secDeg = `${(seconds / 60) * 360 + 90}deg`;
        const minDeg = `${((minutes + seconds / 60) / 60) * 360 + 90}deg`;
        const hourDeg = `${((hours % 12 + minutes / 60) / 12) * 360 + 90}deg`;

        if (secHand) secHand.style.transform = `translate(-50%, 0) rotate(${secDeg})`;
        if (minuteHand) minuteHand.style.transform = `translate(-50%, 0) rotate(${minDeg})`;
        if (hourHand) hourHand.style.transform = `translate(-50%, 0) rotate(${hourDeg})`;
    }

    /**
     * Creates the daguerreotype image filter effect.
     * @param {HTMLElement} card - The member card element.
     * @param {string} filter - The CSS filter string.
     */
    function createDaguerreotypeEffect(card, filter) {
        const frame = card.querySelector('.daguerreotype-frame');
        if (!frame) return;

        // Create the shimmer layer
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: 0.5s;
            pointer-events: none;
        `;
        frame.appendChild(shimmer);

        // Animate the shimmer on hover
        card.addEventListener('mouseenter', () => {
            shimmer.style.left = '100%';
        });
        card.addEventListener('mouseleave', () => {
            shimmer.style.left = '-100%';
        });
    }

    /**
     * Renders the members into the DOM.
     */
    function renderMembers() {
        membersGrid.innerHTML = '';
        members.forEach((member, index) => {
            const card = document.createElement('article');
            card.className = 'member-card';
            card.style.transitionDelay = `${index * 0.05}s`;

            const filterStrength = Math.random() * 0.4 + 0.8; // Randomize filter a bit
            
            card.innerHTML = `
                <div class="daguerreotype-frame">
                    <img src="https://placehold.co/250x300/2e0b14/d4a762?text=Portrait&font=mono" alt="${member.name}" class="daguerreotype-img" style="filter: ${member.imageTint} contrast(${filterStrength});">
                </div>
                <h2 class="member-name">${member.name}</h2>
                <div class="member-specialty">${member.specialty}</div>
                <div class="seance-schedule">${member.seance}</div>
            `;
            membersGrid.appendChild(card);
            
            // Trigger shimmer effect creation
            setTimeout(() => createDaguerreotypeEffect(card, member.imageTint), 100);
        });

        // Animate cards in
        setTimeout(() => {
            const cards = document.querySelectorAll('.member-card');
            cards.forEach(card => card.classList.add('visible'));
        }, 300);
    }

    /**
     * Handles the circle switching logic.
     */
    function setupCircleNavigation() {
        circleItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update UI state
                circleItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const circle = item.dataset.circle;
                
                // Filter members based on circle logic
                // For this demo, we just re-render all members but could filter based on a property.
                // The 'reveal' animation handles the transition.
                const cards = document.querySelectorAll('.member-card');
                cards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                });

                setTimeout(renderMembers, 300);
                
                invitationText.textContent = `"The ${circle.replace(' Circle', '')} is now revealed."`;
            });
        });
    }

    /**
     * Opens the sealed envelope.
     */
    function setupEnvelope() {
        envelope.addEventListener('click', () => {
            envelope.classList.add('open');
            invitationText.textContent = "The seal has been broken. Welcome, Initiate.";
        });
    }

    // --- Initialization ---
    function init() {
        updateClock();
        setInterval(updateClock, 1000);
        
        renderMembers();
        setupCircleNavigation();
        setupEnvelope();
    }

    init();
});