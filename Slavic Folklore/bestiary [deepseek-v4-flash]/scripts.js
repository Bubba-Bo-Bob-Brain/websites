// Bestiary of Slavic Folklore - Interactive Creature Browser
// Handles filtering, search, and atmospheric effects

document.addEventListener('DOMContentLoaded', function() {
    // Creature data
    const creatures = [
        {
            id: 1,
            name: "Leshy",
            danger: 9,
            type: "Woodland Spirit",
            description: "Master of the forest who can change his size from a blade of grass to the tallest tree. He leads travelers astray and mimics voices to confuse his prey.",
            symbol: "🌲"
        },
        {
            id: 2,
            name: "Rusalka",
            danger: 7,
            type: "Water Nymph",
            description: "Spirit of a drowned maiden who haunts lakes and rivers. She appears as a beautiful young woman with pale skin and flowing green hair, luring travelers to watery graves.",
            symbol: "💧"
        },
        {
            id: 3,
            name: "Baba Yaga",
            danger: 9,
            type: "Witch / Crone",
            description: "Ancient crone witch who dwells in a hut that stands on chicken legs. She flies through the air in a mortar, wielding a pestle, and devours the unwary.",
            symbol: "🏚️"
        },
        {
            id: 4,
            name: "Vodyanoy",
            danger: 7,
            type: "Water Spirit",
            description: "Male water spirit who dwells in rivers and lakes. He appears as a naked old man with green hair and a fish-like body, drowning those who venture too deep.",
            symbol: "🌊"
        },
        {
            id: 5,
            name: "Kikimora",
            danger: 2,
            type: "House Spirit",
            description: "A female house spirit who may help or hinder a household. She appears as a small woman and is known to spin thread at night.",
            symbol: "🏡"
        },
        {
            id: 6,
            name: "Zmey Gorynych",
            danger: 10,
            type: "Dragon",
            description: "Three-headed dragon of Slavic legend. Each head breathes fire and possesses its own personality. It demands maidens as tribute and hoards gold.",
            symbol: "🐉"
        },
        {
            id: 7,
            name: "Domovoy",
            danger: 1,
            type: "House Spirit",
            description: "A protective household spirit who lives behind the stove. He appears as a small, bearded man covered in soft fur who ensures the family's prosperity.",
            symbol: "🔥"
        },
        {
            id: 8,
            name: "Koschei",
            danger: 9,
            type: "Immortal Sorcerer",
            description: "An emaciated old man with a long beard who cannot die. His soul is hidden in a needle, inside an egg, inside a duck, inside a hare, inside an iron chest.",
            symbol: "💀"
        }
    ];

    // Function to render creatures
    function renderCreatures(creaturesToRender) {
        const grid = document.querySelector('.creatures-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        creaturesToRender.forEach(function(creature) {
            const card = document.createElement('div');
            card.className = 'creature-card';
            card.dataset.danger = creature.danger;
            card.innerHTML = `
                <div class="creature-icon">${creature.symbol}</div>
                <h3 class="creature-name">${creature.name}</h3>
                <span class="creature-type">${creature.type}</span>
                <div class="danger-meter">
                    <div class="danger-fill" style="width: ${creature.danger * 10}%"></div>
                </div>
                <p class="creature-description">${creature.description}</p>
            `;
            grid.appendChild(card);
        });
    }

    // Initial render
    renderCreatures(creatures);

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filtered = creatures.filter(function(creature) {
                return creature.name.toLowerCase().includes(query) || creature.type.toLowerCase().includes(query);
            });
            renderCreatures(filtered);
        });
    }

    // Filter buttons
    var filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            var filter = event.target.dataset.filter;
            var filtered;
            
            if (filter === 'safe') {
                filtered = creatures.filter(function(c) { return c.danger <= 3; });
            } else if (filter === 'dangerous') {
                filtered = creatures.filter(function(c) { return c.danger >= 4 && c.danger <= 7; });
            } else if (filter === 'deadly') {
                filtered = creatures.filter(function(c) { return c.danger >= 8; });
            } else {
                filtered = creatures;
            }
            
            renderCreatures(filtered);
            
            filterButtons.forEach(function(button) {
                button.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Fire glow animation
    var fireGlow = document.querySelector('.fire-glow');
    if (fireGlow) {
        function flicker() {
            var intensity = 0.6 + Math.random() * 0.4;
            fireGlow.style.opacity = intensity;
            setTimeout(flicker, 200 + Math.random() * 300);
        }
        flicker();
    }
});