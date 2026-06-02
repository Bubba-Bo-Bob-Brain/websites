/**
 * THE SLAVIC GRIMOIRE - ENGINE
 * Handles creature data, dynamic content injection, and atmospheric interactions.
 */

const creatureData = {
    'leshy': {
        name: 'The Leshy',
        habitat: 'Ancient Taiga / Deep Forest',
        danger: 'ᛈ',
        image: 'https://images.unsplash.com/photo-1542273917363-357ed97a883c?auto=format&fit=crop&q=80&w=800',
        description: 'The sovereign of the woods, the Leshy is a shapeshifter of immense power. He can be as tall as the highest pine or as small as a blade of grass. He leads travelers astray, mimicking the voices of loved ones to lure them into the heart of the thicket where the paths vanish and the trees begin to whisper.',
        traits: ['Shapeshifting', 'Forest Mimicry', 'Animal Command', 'Height Manipulation'],
        warding: 'To break his spell, one must wear their clothes backward and put their shoes on the opposite feet. This confuses the Leshy and allows the traveler to find the path home.'
    },
    'rusalka': {
        name: 'The Rusalka',
        habitat: 'Dark Lakes / River Bends',
        danger: 'ᛊ',
        image: 'https://images.unsplash.com/photo-1518837695788-e71a36a89c3d?auto=format&fit=crop&q=80&w=800',
        description: 'Ghostly spirits of young women who died untimely deaths near water. They emerge during the "Green Week" to dance in the moonlight. With a song of heartbreaking beauty and a touch as cold as river ice, they lure unsuspecting men into the depths to drown them in a lethal embrace.',
        traits: ['Siren Song', 'Hydrokinesis', 'Ethereal Form', 'Mind Influence'],
        warding: 'Wormwood is the only defense; carrying a bundle of the bitter herb prevents the Rusalka from approaching or casting her song.'
    },
    'baba-yaga': {
        name: 'Baba Yaga',
        habitat: 'The Hut on Chicken Legs',
        danger: 'ᚦ',
        image: 'https://images.unsplash.com/photo-1509248961158-773635a3946a?auto=format&fit=crop&q=80&w=800',
        description: 'Neither fully human nor fully demon, Baba Yaga is the wild crone of the forest. She dwells in a house that walks on giant chicken legs, surrounded by a fence of human bones. She is a keeper of secrets and a weaver of fate, known to either devour the foolish or reward the brave with ancient wisdom.',
        traits: ['Mortar & Pestle Flight', 'Ancient Sorcery', 'Omniscience', 'Bone Magic'],
        warding: 'Approach with absolute humility and a gift of honey or salt. Never reveal your true name unless she grants you passage.'
    },
    'zmey': {
        name: 'The Zmey',
        habitat: 'Mountain Peaks / Fire Caves',
        danger: 'ᛗ',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
        description: 'A multi-headed dragon of immense scale and greed. Unlike the beasts of the west, the Zmey is often highly intelligent and capable of human speech. Each head possesses a different elemental power, and should one be severed, two more may sprout in its place if the wound is not cauterized.',
        traits: ['Pyrokinesis', 'Regenerative Heads', 'Weather Control', 'Hypnotic Gaze'],
        warding: 'The only way to slay a Zmey is to strike all heads simultaneously or use a blade forged in the blood of a mountain goat.'
    },
    'domovoy': {
        name: 'The Domovoy',
        habitat: 'Behind the Stove / Thresholds',
        danger: 'ᚱ',
        image: 'https://images.unsplash.com/photo-1513519245088-0e1292573a35?auto=format&fit=crop&q=80&w=800',
        description: 'The invisible guardian of the household. A small, hairy spirit who takes the form of the master of the house. If respected, he protects the livestock and warns the family of coming danger. If offended, he will break dishes, tangle the horses\' manes, and create a chaotic cacophony in the dead of night.',
        traits: ['Invisibility', 'Household Protection', 'Omens', 'Poltergeist Activity'],
        warding: 'Leave a bowl of milk and a piece of fresh bread behind the oven every Friday evening to keep him content.'
    },
    'vodyanoy': {
        name: 'The Vodyanoy',
        habitat: 'Deep Whirlpools / Mill Ponds',
        danger: 'ᚢ',
        image: 'https://images.unsplash.com/photo-1502134249126-9f375571f767?auto=format&fit=crop&q=80&w=800',
        description: 'The bloated, frog-like master of the waters. He is a grumpy and territorial spirit who hates those who pollute his ponds. He is known to drag swimmers and livestock into the muck, keeping them as servants in his underwater palace of mud and sunken ships.',
        traits: ['Aquatic Mastery', 'Shape-shifting (Fish)', 'Pressure Control', 'Tidal Manipulation'],
        warding: 'Toss a black rooster into the water as a sacrifice before crossing a deep pond; the Vodyanoy will be sated and allow safe passage.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const creatureList = document.getElementById('creature-list');
    const display = document.getElementById('creature-display');
    const cursor = document.querySelector('.custom-cursor');

    // 1. Custom Torch Cursor Logic
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Subtle dynamic lighting effect based on cursor position
        const glow = document.querySelector('.hearth-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 10%, var(--color-bg-deep) 40%)`;
        }
    });

    // 2. Content Injection Function
    const loadCreature = (id) => {
        const data = creatureData[id];
        if (!data) return;

        // Fade out effect
        display.style.opacity = '0';
        display.style.transform = 'translateY(10px)';

        setTimeout(() => {
            // Update text and images
            document.getElementById('creature-name').textContent = data.name;
            document.getElementById('creature-habitat').textContent = data.habitat;
            document.getElementById('creature-danger').textContent = data.danger;
            document.getElementById('creature-img').src = data.image;
            document.getElementById('creature-desc').textContent = data.description;
            document.getElementById('creature-warding').textContent = data.warding;

            // Update traits list
            const traitsList = document.getElementById('creature-traits');
            traitsList.innerHTML = '';
            data.traits.forEach(trait => {
                const li = document.createElement('li');
                li.textContent = trait;
                traitsList.appendChild(li);
            });

            // Fade back in
            display.style.opacity = '1';
            display.style.transform = 'translateY(0)';
        }, 400);
    };

    // 3. Navigation Logic
    creatureList.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;

        // UI Update
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        // Load Data
        const creatureId = item.getAttribute('data-creature');
        loadCreature(creatureId);
    });

    // 4. Initial Load
    loadCreature('leshy');

    // 5. Hover Interaction for Cursor
    document.querySelectorAll('.nav-item, .lore-block').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.borderColor = 'var(--color-blood)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--color-gold-oxidized)';
        });
    });
});