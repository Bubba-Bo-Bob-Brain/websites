/* 
    THE MORTUARY ARCHIVES - SCRIPTS
    Logic for character data, immersive interactions, and custom cursor.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- CHARACTER DATA DATABASE ---
    const characterData = {
        1: {
            name: "Alaric the Blind",
            class: "The Defrocked Priest",
            bio: "Once a high cardinal in the capital, Alaric was cast out after claiming he could see the 'Pale Rider' walking the streets. He now guides the desperate through the slums, claiming the darkness is the only truth left.",
            skills: ["📜 Forbidden Liturgies", "🕯️ Spirit Guidance", "👂 Acute Hearing", "🍷 Penance Brew"],
            bonds: ["Sister Beatrice (Tense)", "The Nameless One (Curious)"],
            alignment: 70, // Percentage towards Saint
            resistance: "Low"
        },
        2: {
            name: "Elara Thorne",
            class: "The Apothecary's Apprentice",
            bio: "Elara spent years studying the chemistry of death. When her master succumbed to the plague, she discovered a tincture that slows the infection, though the cost to her own sanity is steep.",
            skills: ["🧪 Plague Tinctures", "🌿 Herbal Lore", "🔪 Surgical Precision", "🧪 Toxins"],
            bonds: ["Margot the Mute (Protective)", "Cillian (Professional)"],
            alignment: 50,
            resistance: "High"
        },
        3: {
            name: "Bartholomew",
            class: "The City Watchman",
            bio: "A man of iron duty in a world of melting morals. Bartholomew still wears his rusted armor, patrolling streets where there is nothing left to guard but corpses.",
            skills: ["🛡️ Shield Wall", "⚔️ Heavy Strike", "🔦 Urban Navigation", "⛓️ Restraints"],
            bonds: ["Father Julian (Conflict)", "Cillian (Old Allies)"],
            alignment: 60,
            resistance: "Mid"
        },
        4: {
            name: "Sister Beatrice",
            class: "The Penitent",
            bio: "Beatrice believes the plague is a divine cleansing. She walks barefoot through the filth, tending to the dying with a smile that borders on the manic.",
            skills: ["🙏 Holy Radiance", "🩹 Field Dressing", "🕊️ Moral Support", "🕯️ Vigils"],
            bonds: ["Alaric (Mutual Respect)", "Lady Genevieve (Pity)"],
            alignment: 90,
            resistance: "Low"
        },
        5: {
            name: "Kaelen the Rat",
            class: "The Sewer Scavenger",
            bio: "Born in the gutters and raised by the vermin. Kaelen knows every hidden tunnel in Europe. He doesn't care for gods or kings, only for the shine of stolen gold.",
            skills: ["🐀 Vermin Tongue", "🗝️ Lockpicking", "🌑 Stealth", "🧤 Scavenging"],
            bonds: ["Old Man Silas (Business)"],
            alignment: 20,
            resistance: "Extreme"
        },
        6: {
            name: "Lady Genevieve",
            class: "The Fallen Noble",
            bio: "Her estate was burned by a mob of frightened peasants. Now, she uses the remnants of her jewelry to buy survival, learning that silk is useless against the cold.",
            skills: ["💎 Appraisal", "🎭 Manipulation", "🍷 Etiquette", "🗡️ Hidden Dagger"],
            bonds: ["Sister Beatrice (Dependence)", "Lady Genevieve (Lonely)"],
            alignment: 40,
            resistance: "Low"
        },
        7: {
            name: "Old Man Silas",
            class: "The Grave Digger",
            bio: "Silas has buried more people than he has spoken to. He has developed a morbid kinship with the dead and a profound distrust of the living.",
            skills: ["⚰️ Rapid Burial", "⛏️ Heavy Lifting", "💀 Death Sense", "🍂 Soil Analysis"],
            bonds: ["Kaelen (Tolerated)"],
            alignment: 30,
            resistance: "High"
        },
        8: {
            name: "Margot the Mute",
            class: "The Herbalist",
            bio: "Margot lost her voice to a childhood fever. She communicates through gestures and the scents of the plants she carries, possessing a deep connection to the wild.",
            skills: ["🍃 Nature's Breath", "🍵 Healing Teas", "🤫 Silence", "🍄 Fungal Lore"],
            bonds: ["Elara (Mentor)"],
            alignment: 80,
            resistance: "High"
        },
        9: {
            name: "Father Julian",
            class: "The Inquisitor",
            bio: "Julian believes that the only way to stop the plague is to burn the 'impurity' out of the people. His faith is a weapon, and his mercy is non-existent.",
            skills: ["🔥 Purifying Flame", "⚖️ Interrogation", "📖 Doctrine", "⚔️ Mace Combat"],
            bonds: ["Bartholomew (Tense)"],
            alignment: 10,
            resistance: "Mid"
        },
        10: {
            name: "Cillian",
            class: "The Mercenary",
            bio: "A sword for hire who has seen the fall of three cities. He fights not for a cause, but for the next meal and a warm bed, however fleeting.",
            skills: ["🗡️ Dual Wielding", "⛺ Survivalist", "💰 Negotiation", "🩸 Blood Tracking"],
            bonds: ["Bartholomew (Old Allies)", "Elara (Acquaintance)"],
            alignment: 45,
            resistance: "Mid"
        },
        11: {
            name: "Ursula",
            class: "The Midwife",
            bio: "Bringing life into a world obsessed with death. Ursula is the backbone of the community, balancing the joy of birth with the grief of the plague.",
            skills: ["👶 Neonatal Care", "🧘 Patience", "🥣 Nutrition", "🕯️ Comfort"],
            bonds: ["Margot (Friendship)"],
            alignment: 85,
            resistance: "Mid"
        },
        12: {
            name: "The Nameless One",
            class: "The Plague Doctor",
            bio: "Hidden behind a leather mask and a wide-brimmed hat. No one knows who they are, only that they arrive when hope is gone and leave when the bodies are counted.",
            skills: ["🎭 Masked Presence", "🧪 Chemical Warfare", "💀 Autopsy", "📜 Ancient Texts"],
            bonds: ["Alaric (Intrigued)"],
            alignment: 50,
            resistance: "Immune"
        }
    };

    // --- CUSTOM CURSOR LOGIC ---
    const cursor = document.getElementById('cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor interaction with buttons
    const interactables = document.querySelectorAll('button, .character-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.background = 'var(--blood-red)';
            cursor.style.boxShadow = '0 0 20px var(--blood-red)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--accent-gold)';
            cursor.style.boxShadow = '0 0 15px var(--accent-gold)';
        });
    });

    // --- GALLERY ANIMATION ---
    const cards = document.querySelectorAll('.character-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        
        // Trigger animation after a short delay
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(' + (Math.random() * 4 - 2) + 'deg)';
        }, 100);
    });

    // --- MODAL LOGIC ---
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-modal');
    const revealBtns = document.querySelectorAll('.reveal-btn');

    const openModal = (id) => {
        const char = characterData[id];
        if (!char) return;

        // Populate data
        document.getElementById('modal-name').innerText = char.name;
        document.getElementById('modal-class').innerText = char.class;
        document.getElementById('modal-bio').innerText = char.bio;
        
        // Skills
        const skillList = document.getElementById('modal-skills');
        skillList.innerHTML = '';
        char.skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerText = skill;
            skillList.appendChild(li);
        });

        // Bonds
        const bondTags = document.getElementById('modal-bonds');
        bondTags.innerHTML = '';
        char.bonds.forEach(bond => {
            const span = document.createElement('span');
            span.className = 'bond-tag';
            span.innerText = bond;
            bondTags.appendChild(span);
        });

        // Alignment Meter
        const fill = document.querySelector('.meter-bar .fill');
        fill.style.width = char.alignment + '%';

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    revealBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.character-card');
            const id = card.getAttribute('data-id');
            openModal(id);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    
    // Close modal on clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});