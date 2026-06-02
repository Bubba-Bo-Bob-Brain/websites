const characterData = {
    'brother-aldric': {
        name: 'Brother Aldric',
        title: 'The Plague Doctor',
        seal: '⚕️',
        backstory: [
            'Brother Aldric took his monastic vows at the age of eighteen, seeking refuge from a world he found chaotic and cruel. When the Black Death first ravaged his monastery, he was among the few who survived, witnessing brothers he had known for decades succumb to the pestilence within days.',
            'This trial forged in him an unshakeable faith, but also a dangerous obsession: to understand the plague that spared him. He abandoned his cloistered life to walk among the dying, offering what comfort he could while documenting every symptom, every pattern, every desperate prayer.',
            'His medical knowledge, gleaned from forbidden texts and practical experience, has saved dozens. Yet the Church watches him with suspicion, and whispers of heresy follow in his wake.'
        ],
        skills: [
            { icon: '🏥', name: 'Field Medicine', level: 'Expert' },
            { icon: '📚', name: 'Scholarly Knowledge', level: 'Master' },
            { icon: '🙏', name: 'Spiritual Comfort', level: 'Expert' },
            { icon: '💀', name: 'Plague Lore', level: 'Expert' },
            { icon: '🕯️', name: 'Last Rites', level: 'Master' },
            { icon: '🔍', name: 'Investigation', level: 'Journeyman' }
        ],
        relations: [
            { type: '⚔️', name: 'Father Benedict', bond: 'Rival' },
            { type: '🤝', name: 'Agnes', bond: 'Ally' },
            { type: '👫', name: 'Sister Beatrice', bond: 'Friend' }
        ],
        quote: "The plague is not God's punishment. It is a trial, and I shall not fail it."
    },
    'ysabel': {
        name: 'Ysabel',
        title: 'The Grieving Weaver',
        seal: '🧵',
        backstory: [
            'Ysabel\'s hands once wove the finest tapestries in the region, her loom singing songs of color and light. That was before the plague took her husband Thomas, her daughter Marie, and her newborn son in the span of a single harrowing week.',
            'Now she weaves only burial shrouds, her fingers moving with a mechanical precision that belies the emptiness in her eyes. The village children call her the Ghost-Weaver, for she seldom speaks and never smiles.',
            'Yet beneath her grief lies a core of unexpected steel. She has survived three outbreaks when others perished, and rumor spreads that her shrouds somehow protect the dead from rising as something... else.'
        ],
        skills: [
            { icon: '🧵', name: 'Textile Craft', level: 'Master' },
            { icon: '💔', name: 'Grief Endurance', level: 'Master' },
            { icon: '🏠', name: 'Home Management', level: 'Expert' },
            { icon: '🧹', name: 'Cleansing Rituals', level: 'Journeyman' },
            { icon: '👁️', name: 'Mourning Customs', level: 'Expert' },
            { icon: '💪', name: 'Quiet Strength', level: 'Expert' }
        ],
        relations: [
            { type: '👨‍👦', name: 'Little Thom', bond: 'Adopted Son' },
            { type: '🤝', name: 'Gunter', bond: 'Ally' },
            { type: '👫', name: 'Agnes', bond: 'Friend' }
        ],
        quote: "Every thread I weave is a prayer. Every shroud, a promise that death is not the end."
    },
    'sir-godfrey': {
        name: 'Sir Godfrey',
        title: 'The Disgraced Knight',
        seal: '🗡️',
        backstory: [
            'Once the champion of three tournaments and favored knight of the Duke himself, Sir Godfrey fell from grace when he refused to slaughter a village suspected of harboring plague victims. His mercy cost him his title, his lands, and his faith in the nobility he once served.',
            'Now he wanders as a fallen knight, his armor tarnished but his blade still deadly. He drinks to forget the faces of those he could not save, and fights to protect those the world has abandoned.',
            'His heart, long hardened against both God and men, has begun to crack in unexpected places—particularly around the mysterious seer Elara, whose prophecies he claims to despise yet secretly seeks out.'
        ],
        skills: [
            { icon: '⚔️', name: 'Sword Combat', level: 'Master' },
            { icon: '🛡️', name: 'Defense Tactics', level: 'Master' },
            { icon: '🐴', name: 'Horsemanship', level: 'Expert' },
            { icon: '🍷', name: 'Alcohol Tolerance', level: 'Master' },
            { icon: '😤', name: 'Intimidation', level: 'Expert' },
            { icon: '🎯', name: 'Strategy', level: 'Journeyman' }
        ],
        relations: [
            { type: '⚔️', name: 'Father Benedict', bond: 'Rival' },
            { type: '💕', name: 'Elara', bond: 'Love Interest' },
            { type: '👫', name: 'Gunter', bond: 'Friend' }
        ],
        quote: "Honor is not given by kings. It is forged in the choices we make when no one watches."
    },
    'mira': {
        name: 'Mira',
        title: 'The Outcast Herbalist',
        seal: '🌿',
        backstory: [
            'Mira learned the old ways from her grandmother, a cunning woman who healed with herbs and whispered incantations that predated the Church itself. When the plague came, Mira\'s remedies saved many—but her success bred suspicion.',
            'Accused of witchcraft by Father Benedict himself, she was driven from her village with torches and curses. She now lives in the forest depths, emerging only to trade remedies for supplies, her face hidden behind a veil of her own making.',
            'Those who seek her out find not a witch, but a healer whose knowledge surpasses any physician. The plague seems to flow around her like water around a stone, though she claims no magic—only wisdom the world has forgotten.'
        ],
        skills: [
            { icon: '🌿', name: 'Herbalism', level: 'Master' },
            { icon: '🔮', name: 'Folk Magic', level: 'Expert' },
            { icon: '🌙', name: 'Night Navigation', level: 'Expert' },
            { icon: '🏥', name: 'Natural Healing', level: 'Master' },
            { icon: '🎭', name: 'Disguise', level: 'Journeyman' },
            { icon: '🐺', name: 'Wilderness Survival', level: 'Expert' }
        ],
        relations: [
            { type: '🤝', name: 'Jasper', bond: 'Ally' },
            { type: '⚔️', name: 'Father Benedict', bond: 'Rival' },
            { type: '👫', name: 'Agnes', bond: 'Secret Friend' }
        ],
        quote: "They call me witch for knowing what grows beneath their feet. I call them fools for fearing knowledge."
    },
    'little-thom': {
        name: 'Little Thom',
        title: 'The Orphan Thief',
        seal: '🤏',
        backstory: [
            'Thom was eight when the plague orphaned him. By ten, he had learned to survive by his wits alone—stealing food, picking pockets, and slipping through windows that should have been too small for any child.',
            'He found an unlikely protector in Ysabel the Weaver, who caught him stealing bread and, instead of punishing him, offered him a place by her fire. He now considers her the mother the plague took from him.',
            'His small size and innocent face make him the perfect spy, and several factions have begun to notice. Thom must decide what kind of man he will become—thief, spy, or something unexpected.'
        ],
        skills: [
            { icon: '🗡️', name: 'Pickpocketing', level: 'Master' },
            { icon: '🏃', name: 'Sprinting', level: 'Expert' },
            { icon: '🎪', name: 'Deception', level: 'Expert' },
            { icon: '🔓', name: 'Lockpicking', level: 'Journeyman' },
            { icon: '👁️', name: 'Eavesdropping', level: 'Expert' },
            { icon: '🕳️', name: 'Hiding', level: 'Master' }
        ],
        relations: [
            { type: '👨‍👦', name: 'Ysabel', bond: 'Adoptive Mother' },
            { type: '👫', name: 'Elara', bond: 'Friend' },
            { type: '🤝', name: 'Jasper', bond: 'Ally' }
        ],
        quote: "They never see me coming. That's the advantage of being small and forgotten."
    },
    'father-benedict': {
        name: 'Father Benedict',
        title: 'The Corrupt Priest',
        seal: '📿',
        backstory: [
            'Father Benedict rose through the Church hierarchy not through piety, but through cunning. He learned early that fear fills pews faster than love, and that a well-placed accusation of heresy can eliminate any rival.',
            'When the plague came, he saw opportunity where others saw tragedy. He sells indulgences to the desperate, promising salvation for coin. Those who cannot pay receive only condemnation—and often, a swift trip to the plague pits.',
            'His list of enemies grows with each passing day: Brother Aldric whose righteousness shames him, Mira whose true healing exposes his fraud, Sir Godfrey whose honor he despises. Yet Benedict holds the power of the Church, and he wields it without mercy.'
        ],
        skills: [
            { icon: '💰', name: 'Corruption', level: 'Master' },
            { icon: '🎭', name: 'Deception', level: 'Master' },
            { icon: '📖', name: 'Religious Authority', level: 'Master' },
            { icon: '😈', name: 'Manipulation', level: 'Expert' },
            { icon: '⛓️', name: 'Intimidation', level: 'Expert' },
            { icon: '📜', name: 'Bureaucracy', level: 'Expert' }
        ],
        relations: [
            { type: '⚔️', name: 'Brother Aldric', bond: 'Rival' },
            { type: '⚔️', name: 'Mira', bond: 'Rival' },
            { type: '⚔️', name: 'Sir Godfrey', bond: 'Rival' },
            { type: '🤝', name: 'Rolf', bond: 'Ally' }
        ],
        quote: "God speaks through me. And He requires... compensation."
    },
    'agnes': {
        name: 'Agnes',
        title: 'The Life Bringer',
        seal: '👶',
        backstory: [
            'Agnes has delivered over three hundred children into this world, and her hands have closed the eyes of nearly as many dying. As the village midwife, she stands at both thresholds of human existence, guiding souls in and out with equal compassion.',
            'When the plague came, she did not flee. She walked door to door, tending to the sick regardless of their station or ability to pay. Her healing touch has saved countless lives, though she claims no credit—only that life itself moves through her.',
            'The village calls her a saint, though she dismisses such talk with a gentle smile. Her only wish is to ease suffering in a world determined to multiply it.'
        ],
        skills: [
            { icon: '👶', name: 'Midwifery', level: 'Master' },
            { icon: '🏥', name: 'Nursing', level: 'Master' },
            { icon: '❤️', name: 'Compassion', level: 'Master' },
            { icon: '🕯️', name: 'Death Vigil', level: 'Expert' },
            { icon: '🌱', name: 'Basic Herbalism', level: 'Journeyman' },
            { icon: '🙏', name: 'Prayer', level: 'Expert' }
        ],
        relations: [
            { type: '🤝', name: 'Brother Aldric', bond: 'Ally' },
            { type: '👫', name: 'Ysabel', bond: 'Friend' },
            { type: '👫', name: 'Sister Beatrice', bond: 'Friend' }
        ],
        quote: "Every life is precious. Every death, a sorrow. I honor both equally."
    },
    'gunter': {
        name: 'Gunter',
        title: 'The Iron Smith',
        seal: '🔨',
        backstory: [
            'Gunter\'s forge has never been cold, not even during the worst plague years. His hammers sing songs of strength and survival, and the tools he crafts are the backbone of the village\'s defense against both disease and desperation.',
            'A man of few words but absolute loyalty, he has pledged himself to protect those who cannot protect themselves. His friendship with Sir Godfrey gives him a connection to the old world of honor and duty, even as that world crumbles around them.',
            'His massive frame and unshakeable calm make him a natural protector, though he rarely raises his hammer in anger. Those who threaten his friends, however, learn that even the patient have limits.'
        ],
        skills: [
            { icon: '🔨', name: 'Blacksmithing', level: 'Master' },
            { icon: '💪', name: 'Strength', level: 'Master' },
            { icon: '🛡️', name: 'Protection', level: 'Expert' },
            { icon: '⚒️', name: 'Weapon Crafting', level: 'Expert' },
            { icon: '🔥', name: 'Fire Management', level: 'Expert' },
            { icon: '🗣️', name: 'Negotiation', level: 'Journeyman' }
        ],
        relations: [
            { type: '🤝', name: 'Ysabel', bond: 'Ally' },
            { type: '👫', name: 'Sir Godfrey', bond: 'Friend' },
            { type: '⚔️', name: 'Rolf', bond: 'Rival' }
        ],
        quote: "Iron bends to my will. So will any who threaten those under my protection."
    },
    'elara': {
        name: 'Elara',
        title: 'The Mystic Seer',
        seal: '🔮',
        backstory: [
            'Elara\'s visions began when she was twelve—fragments of futures that always came true. By fifteen, she had predicted three harvests, two marriages, and every death in her village for two years running. The same villagers who once feared her now seek her out with desperate hope.',
            'The plague has clouded her sight, making prophecies fragmentary and strange. She sees death everywhere, but also unexpected threads of survival—paths through the darkness that only she can perceive.',
            'Her madness, as some call it, draws Sir Godfrey like a moth to flame. She sees him in her visions more clearly than any other: a fallen knight who might yet rise to become something greater.'
        ],
        skills: [
            { icon: '👁️', name: 'Prophecy', level: 'Master' },
            { icon: '🌀', name: 'Maddening Insight', level: 'Expert' },
            { icon: '🌙', name: 'Dream Walking', level: 'Expert' },
            { icon: '🕯️', name: 'Ritual Magic', level: 'Journeyman' },
            { icon: '🎭', name: 'Cryptic Speech', level: 'Master' },
            { icon: '📿', name: 'Spiritual Connection', level: 'Expert' }
        ],
        relations: [
            { type: '💕', name: 'Sir Godfrey', bond: 'Love Interest' },
            { type: '👫', name: 'Little Thom', bond: 'Friend' },
            { type: '🤝', name: 'Mira', bond: 'Respect' }
        ],
        quote: "I see the threads of fate. They are tangled and bloodied, but not yet broken."
    },
    'rolf': {
        name: 'Rolf',
        title: 'The Greedy Miller',
        seal: '🌾',
        backstory: [
            'Rolf controls the grain, and in times of plague, grain is life itself. He has hoarded more than any man could eat in ten lifetimes, selling flour at prices that bankrupt families while his own storehouses overflow.',
            'His alliance with Father Benedict serves them both: the priest condemns, the miller starves, and both grow fat on the suffering of others. Yet Rolf\'s greed has made him powerful, and power draws desperate souls.',
            'Even as he counts his coins, Rolf knows that the hungry outnumber his guards. His storehouses are a target, and the darkness he has helped create may soon consume him.'
        ],
        skills: [
            { icon: '💰', name: 'Hoarding', level: 'Master' },
            { icon: '🎭', name: 'Scheming', level: 'Expert' },
            { icon: '🌾', name: 'Resource Control', level: 'Master' },
            { icon: '📊', name: 'Accounting', level: 'Expert' },
            { icon: '🤝', name: 'Corrupt Bargains', level: 'Expert' },
            { icon: '🏃', name: 'Escape Planning', level: 'Journeyman' }
        ],
        relations: [
            { type: '⚔️', name: 'Gunter', bond: 'Rival' },
            { type: '🤝', name: 'Father Benedict', bond: 'Ally' },
            { type: '⚔️', name: 'Little Thom', bond: 'Target' }
        ],
        quote: "In times of plenty, friends are many. In times of famine, only gold remains loyal."
    },
    'sister-beatrice': {
        name: 'Sister Beatrice',
        title: 'The Pious Nun',
        seal: '🕊️',
        backstory: [
            'Sister Beatrice entered the convent at sixteen and has rarely left its walls since. Her life is prayer—continuous, desperate, fervent prayer for a world she barely understands but loves with all her soul.',
            'Her faith is absolute, but her body is weak. She has survived three bouts of illness that should have killed her, each recovery attributed by her to divine intervention and by others to something else entirely.',
            'She copies holy texts with beautiful precision, preserving knowledge even as the world burns. Her illuminated manuscripts may be the only record that survives the darkness.'
        ],
        skills: [
            { icon: '🙏', name: 'Prayer', level: 'Master' },
            { icon: '📚', name: 'Scripture', level: 'Master' },
            { icon: '✍️', name: 'Illumination', level: 'Expert' },
            { icon: '🕯️', name: 'Monastic Rituals', level: 'Expert' },
            { icon: '💉', name: 'Self-Sacrifice', level: 'Master' },
            { icon: '📖', name: 'Scribing', level: 'Expert' }
        ],
        relations: [
            { type: '👫', name: 'Brother Aldric', bond: 'Friend' },
            { type: '👫', name: 'Agnes', bond: 'Friend' },
            { type: '⚔️', name: 'Father Benedict', bond: 'Suspicious' }
        ],
        quote: "My body is weak, but my faith is iron. The Lord will preserve what must be saved."
    },
    'jasper': {
        name: 'Jasper',
        title: 'The Undying Leper',
        seal: '🦠',
        backstory: [
            'Jasper was cast out five years ago when the white spots appeared on his skin. Leprosy, they called it—a mark of God\'s disfavor. He was forced to ring a bell and cry "Unclean!" before him, warning others to flee.',
            'But Jasper did not die. His spots spread, then stabilized. His nerve endings dulled, but his mind sharpened. He learned to survive in the leper colonies, and when the Black Death came, he watched it kill everyone around him while he remained untouched.',
            'Now he walks among the dying without fear, for the plague cannot touch what it has already claimed. Some say he is cursed; others, that he has been prepared for something yet to come.'
        ],
        skills: [
            { icon: '🦠', name: 'Disease Immunity', level: 'Master' },
            { icon: '⛓️', name: 'Outcast Survival', level: 'Master' },
            { icon: '👁️', name: 'Unnoticed Presence', level: 'Expert' },
            { icon: '🔥', name: 'Fire Handling', level: 'Expert' },
            { icon: '🕳️', name: 'Scavenging', level: 'Expert' },
            { icon: '💀', name: 'Death Acceptance', level: 'Master' }
        ],
        relations: [
            { type: '🤝', name: 'Mira', bond: 'Ally' },
            { type: '🤝', name: 'Little Thom', bond: 'Ally' }
        ],
        quote: "They cast me out as unclean. Now I am the cleanest thing in this pestilent world."
    }
};

const particlesContainer = document.getElementById('particles');
const filterButtons = document.querySelectorAll('.filter-btn:not(.resistance-btn)');
const resistanceButtons = document.querySelectorAll('.resistance-btn');
const moralSlider = document.getElementById('moralSlider');
const characterCards = document.querySelectorAll('.character-card');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const expandButtons = document.querySelectorAll('.expand-btn');
const bondIcons = document.querySelectorAll('.bond-icon');

function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = 0.1 + Math.random() * 0.2;
        particlesContainer.appendChild(particle);
    }
}

function getCurrentFilters() {
    const activeFilterBtn = document.querySelector('.filter-btn:not(.resistance-btn).active');
    const activeResistanceBtn = document.querySelector('.resistance-btn.active');
    
    return {
        classFilter: activeFilterBtn ? activeFilterBtn.dataset.filter : 'all',
        resistanceFilter: activeResistanceBtn ? activeResistanceBtn.dataset.resistance : null,
        moralThreshold: parseInt(moralSlider.value)
    };
}

function filterCharacters() {
    const filters = getCurrentFilters();
    
    characterCards.forEach(card => {
        const cardClass = card.dataset.class;
        const cardResistance = card.dataset.resistance;
        const cardMoral = parseInt(card.dataset.moral);
        
        let showCard = true;
        
        if (filters.classFilter !== 'all' && cardClass !== filters.classFilter) {
            showCard = false;
        }
        
        if (filters.resistanceFilter && cardResistance !== filters.resistanceFilter) {
            showCard = false;
        }
        
        const moralRange = 20;
        const lowerBound = filters.moralThreshold - moralRange;
        const upperBound = filters.moralThreshold + moralRange;
        
        if (cardMoral < lowerBound || cardMoral > upperBound) {
            showCard = false;
        }
        
        if (showCard) {
            card.classList.remove('hidden');
            card.classList.add('filter-highlight');
            setTimeout(() => {
                card.classList.remove('filter-highlight');
            }, 400);
        } else {
            card.classList.add('hidden');
        }
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCharacters();
    });
});

resistanceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
        } else {
            resistanceButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        filterCharacters();
    });
});

moralSlider.addEventListener('input', filterCharacters);

function openModal(characterId) {
    const data = characterData[characterId];
    if (!data) return;
    
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalTitle').textContent = data.title;
    
    const backstoryContainer = document.getElementById('modalBackstory');
    backstoryContainer.innerHTML = data.backstory.map(p => `<p>${p}</p>`).join('');
    
    const skillsGrid = document.getElementById('modalSkills');
    skillsGrid.innerHTML = data.skills.map(skill => `
        <div class="skill-item">
            <span class="skill-icon">${skill.icon}</span>
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}</span>
            </div>
        </div>
    `).join('');
    
    const relationsList = document.getElementById('modalRelations');
    relationsList.innerHTML = data.relations.map(rel => `
        <div class="relation-item">
            <span class="relation-type">${rel.type}</span>
            <div>
                <span class="relation-name">${rel.name}</span>
                <span class="relation-bond">${rel.bond}</span>
            </div>
        </div>
    `).join('');
    
    document.querySelector('.modal-quote blockquote').textContent = `"${data.quote}"`;
    document.querySelector('.modal-seal-display').textContent = data.seal;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

expandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const characterId = btn.dataset.character;
        openModal(characterId);
    });
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

bondIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetName = icon.dataset.target;
        const bondType = icon.dataset.bond;
        
        const characterId = targetName.toLowerCase().replace(/\s+/g, '-').replace(/^(brother|father|sister|sir)\s+/, (match) => {
            if (match === 'brother ') return 'brother-';
            if (match === 'father ') return 'father-';
            if (match === 'sister ') return 'sister-';
            if (match === 'sir ') return 'sir-';
            return match;
        });
        
        openModal(characterId);
    });
});

function animateStatBars() {
    const statFills = document.querySelectorAll('.stat-fill');
    
    statFills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 100);
    });
}

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            
            const statFills = entry.target.querySelectorAll('.stat-fill');
            statFills.forEach(fill => {
                const targetWidth = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 300);
            });
            
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

characterCards.forEach(card => {
    cardObserver.observe(card);
});

function init() {
    createParticles();
    
    characterCards.forEach(card => {
        card.style.animationPlayState = 'paused';
    });
}

document.addEventListener('DOMContentLoaded', init);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.querySelectorAll('.particle').forEach(p => p.remove());
    document.querySelectorAll('.character-card').forEach(card => {
        card.style.animation = 'none';
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
}