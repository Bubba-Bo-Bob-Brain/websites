/**
 * THE OBSIDIAN COVENANT
 * Victorian Occult Society Directory
 * Gaslit Amber & Deep Burgundy Theme
 */

// ============================================
// MEMBER DATA
// ============================================
const membersData = [
    {
        id: 1,
        name: "Lady Morgana Vane",
        rank: "archon",
        title: "The Archon Supreme",
        fullTitle: "Archon of the Obsidian Flame",
        specialization: "Necromantic Divination & Spirit Evocation",
        abilities: ["Spirit Communion", "Death Vision", "Astral Projection", "Bone Reading"],
        seances: "First Saturday of each month",
        portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        description: "Descended from the ancient Vane bloodline, Lady Morgana has led the Covenant for thirty-seven years."
    },
    {
        id: 2,
        name: "Prof. Cornelius Blackwood",
        rank: "master",
        title: "Master of the Arcanum",
        fullTitle: "Grandmaster of Forbidden Lore",
        specialization: "Alchemical Transmutation & Hermetic Philosophy",
        abilities: ["Philosopher's Stone Research", "Elemental Transmutation", "Aetheric Manipulation", "Golden Dawn Rituals"],
        seances: "Third Thursday of each month",
        portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        description: "Formerly of Oxford's hidden chambers, Blackwood brings scholarly rigor to the mystical arts."
    },
    {
        id: 3,
        name: "Madame Celeste Roux",
        rank: "master",
        title: "Mistress of Shadows",
        fullTitle: "Keeper of the Veil Between Worlds",
        specialization: "Clairvoyance & Scrying Mirrors",
        abilities: ["Crystal Gazing", "Past-Life Regression", "Ethereal Sight", "Prophecy"],
        seances: "Every Wednesday at midnight",
        portrait: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
        description: "Born in the foggy lanes of Paris, Roux sees what others dare not imagine."
    },
    {
        id: 4,
        name: "Reverend Edmund Thorne",
        rank: "master",
        title: "The Exorcist",
        fullTitle: "High Exorcist of the Covenant",
        specialization: "Demonic Banishment & Holy Warfare",
        abilities: ["Ritual Exorcism", "Daemonology", "Sacred Geometry", "Protective Wards"],
        seances: "As needed for possessions",
        portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        description: "A man of faith who walks the razor edge between the divine and the damned."
    },
    {
        id: 5,
        name: "Dr. Helena Ashworth",
        rank: "master",
        title: "The Cryptographer",
        fullTitle: "Master of Esoteric Languages",
        specialization: "Ancient Runes & Lost Tongues",
        abilities: ["Thaumic Scripting", "Runic Decryption", "Dead Language Translation", "Symbolic Magic"],
        seances: "Second Friday of each month",
        portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        description: "Her mind holds secrets older than the Covenant itself."
    },
    {
        id: 6,
        name: "Sir Geoffrey Wentworth",
        rank: "adept",
        title: "Knight of the Circle",
        fullTitle: "Adept of the Middle Chamber",
        specialization: "Astral Combat & Psychic Defense",
        abilities: ["Mind Shielding", "Psychic Strike", "Astral Sword", "Telepathic Bonds"],
        seances: "Bi-weekly on Tuesdays",
        portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        description: "A decorated veteran who turned from war to wage battle on unseen fronts."
    },
    {
        id: 7,
        name: "Sister Margaret Pearce",
        rank: "adept",
        title: "The Healer",
        fullTitle: "Adept of Vital Essences",
        specialization: "Medical Thaumaturgy & Herbal Cures",
        abilities: ["Life Force Manipulation", "Herbal Symbiosis", "Wound Mending", "Ailment Divination"],
        seances: "Weekly on Sundays",
        portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        description: "Where others see death, she sees only transformation."
    },
    {
        id: 8,
        name: "Mr. Silas Nightshade",
        rank: "adept",
        title: "The Shadow",
        fullTitle: "Adept of Darkness Arts",
        specialization: "Umbral Manipulation & Shadow Walking",
        abilities: ["Shadow Meld", "Darkness Weaving", "Eclipse Magic", "Void Touch"],
        seances: "New moon evenings",
        portrait: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        description: "A man who exists between the cracks of reality."
    },
    {
        id: 9,
        name: "Miss Arabella Frost",
        rank: "adept",
        title: "The Oracle",
        fullTitle: "Adept of Frozen Prophecy",
        specialization: "Ice Divination & Winter Magic",
        abilities: ["Frost Sight", "Winter Prophecy", "Ice Cryomancy", "Frozen Time"],
        seances: "During winter solstice",
        portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
        description: "Her visions come wrapped in the cold embrace of eternity."
    },
    {
        id: 10,
        name: "Father Thomas Brennan",
        rank: "adept",
        title: "The Confessor",
        fullTitle: "Adept of Soul Work",
        specialization: "Soul Binding & Karmic Reading",
        abilities: ["Soul Reading", "Karmic Analysis", "Spirit Binding", "Last Rites"],
        seances: "As called upon",
        portrait: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
        description: "He hears the whispered confessions of the dying."
    },
    {
        id: 11,
        name: "Miss Daphne Holloway",
        rank: "adept",
        title: "The Dreamer",
        fullTitle: "Adept of Oneiros",
        specialization: "Lucid Dreaming & Dream Walking",
        abilities: ["Dream Scrying", "Nightmare Exorcism", "Sleep Realm", "Dream Harvesting"],
        seances: "Every full moon",
        portrait: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400&h=400&fit=crop&crop=face",
        description: "In dreams, she walks paths forbidden to waking feet."
    },
    {
        id: 12,
        name: "Mr. Reginald Ash",
        rank: "adept",
        title: "The Summoner",
        fullTitle: "Adept of the Lower Planes",
        specialization: "Demonology & Binding Contracts",
        abilities: ["Lesser Summoning", "Contract Wording", "Entity Negotiation", "Planar Doors"],
        seances: "Carefully scheduled rituals",
        portrait: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
        description: "Bargains with beings that would devour lesser souls."
    },
    {
        id: 13,
        name: "Lady Victoria Crane",
        rank: "adept",
        title: "The Blood Witch",
        fullTitle: "Adept of Vital Magics",
        specialization: "Hemomancy & Blood Rites",
        abilities: ["Blood Magic", "Life Syphon", "Blood Tracking", "Vital Binding"],
        seances: "Monthly blood moons",
        portrait: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        description: "Blood is thicker than water, and far more powerful."
    },
    {
        id: 14,
        name: "Mr. Oliver Cross",
        rank: "seeker",
        title: "The Student",
        fullTitle: "Seeker of the Outer Circle",
        specialization: "Novice Divination",
        abilities: ["Tarot Reading", "Pendulum Dowsing", "Basic Warding", "Meditation"],
        seances: "Learning phase",
        portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&sat=-100",
        description: "A promising initiate with latent abilities."
    },
    {
        id: 15,
        name: "Miss Catherine Marsh",
        rank: "seeker",
        title: "The Seeker",
        fullTitle: "Seeker of the Outer Circle",
        specialization: "Candle Magic",
        abilities: ["Candle Rituals", "Simple Conjurations", "Charm Work", "Intuition"],
        seances: "Observing",
        portrait: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
        description: "Her candles burn with secrets yet unrevealed."
    },
    {
        id: 16,
        name: "Mr. Benjamin Cole",
        rank: "seeker",
        title: "The Apprentice",
        fullTitle: "Seeker of the Outer Circle",
        specialization: "Herbalism & Nature Spirits",
        abilities: ["Herb Lore", "Fey Communication", "Nature Offerings", "Seasonal Magic"],
        seances: "Attending rituals",
        portrait: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
        description: "Hears the whisper of leaves and the songs of streams."
    },
    {
        id: 17,
        name: "Miss Eleanor Vance",
        rank: "seeker",
        title: "The Initiate",
        fullTitle: "Seeker of the Outer Circle",
        specialization: "Spirit Communication",
        abilities: ["Table Rapping", "Automatic Writing", "Spirit Messages", "Ouija Converse"],
        seances: "Beginning training",
        portrait: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
        description: "The veil thins around her like morning mist."
    },
    {
        id: 18,
        name: "Mr. Harrison Blake",
        rank: "seeker",
        title: "The Probationer",
        fullTitle: "Seeker of the Outer Circle",
        specialization: "Elemental Attunement",
        abilities: ["Fire Tending", "Water Reading", "Air Sensing", "Earth Grounding"],
        seances: "Elemental focus",
        portrait: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        description: "Feels the pulse of the elements in his blood."
    }
];

// ============================================
// SEANCE DATA
// ============================================
const seanceData = [
    {
        id: 1,
        title: "The All-Saints Communion",
        day: "Saturday",
        date: "March 1st",
        time: "11:00 PM",
        conductor: "Lady Morgana Vane",
        description: "Annual ceremony to honor the departed spirits of the Covenant."
    },
    {
        id: 2,
        title: "Lunar Divination Circle",
        day: "Wednesday",
        date: "March 5th",
        time: "12:00 AM",
        conductor: "Madame Celeste Roux",
        description: "Monthly divination ritual guided by the moon's celestial influence."
    },
    {
        id: 3,
        title: "The Alchemical Awakening",
        day: "Friday",
        date: "March 7th",
        time: "10:00 PM",
        conductor: "Prof. Cornelius Blackwood",
        description: "Group meditation on the transformation of base consciousness."
    },
    {
        id: 4,
        title: "Protective Wards Renewal",
        day: "Sunday",
        date: "March 9th",
        time: "9:00 PM",
        conductor: "Sister Margaret Pearce",
        description: "Strengthening the mystical barriers around the Sanctum."
    },
    {
        id: 5,
        title: "The Shadow Convocation",
        day: "Wednesday",
        date: "March 12th",
        time: "3:00 AM",
        conductor: "Mr. Silas Nightshade",
        description: "For advanced practitioners only - walking in the void."
    },
    {
        id: 6,
        title: "Blood Moon Binding",
        day: "Friday",
        date: "March 14th",
        time: "11:30 PM",
        conductor: "Lady Victoria Crane",
        description: "Powerful rite performed only during blood moon eclipses."
    },
    {
        id: 7,
        title: "The Dream Assembly",
        day: "Monday",
        date: "March 17th",
        time: "In Dreams",
        conductor: "Miss Daphne Holloway",
        description: "Group dream-walking to the collective unconscious."
    },
    {
        id: 8,
        title: "Forgotten Tongues Reading",
        day: "Friday",
        date: "March 21st",
        time: "8:00 PM",
        conductor: "Dr. Helena Ashworth",
        description: "Translating messages from ancient texts and spirits."
    }
];

// ============================================
// DOM ELEMENTS
// ============================================
var invitationContainer = document.getElementById('invitation');
var openInvitationBtn = document.getElementById('openInvitation');
var mainContent = document.getElementById('mainContent');
var membersGrid = document.getElementById('membersGrid');
var seanceList = document.getElementById('seanceList');
var filterBtns = document.querySelectorAll('.filter-btn');
var memberModal = document.getElementById('memberModal');
var closeModalBtn = document.getElementById('closeModal');

// ============================================
// INVITATION MECHANIC
// ============================================
openInvitationBtn.addEventListener('click', function() {
    var envelope = document.querySelector('.envelope');
    var flap = document.querySelector('.envelope-flap');
    var invitationText = document.querySelector('.invitation-text');
    var openBtn = document.querySelector('.open-invitation');
    
    // Animate the flap opening
    flap.style.transform = 'rotateX(180deg)';
    
    // Fade out invitation elements with delay
    invitationText.style.transition = 'opacity 0.5s ease';
    invitationText.style.opacity = '0';
    openBtn.style.transition = 'opacity 0.5s ease';
    openBtn.style.opacity = '0';
    
    // After animation, show main content
    setTimeout(function() {
        invitationContainer.style.transition = 'opacity 1s ease';
        invitationContainer.style.opacity = '0';
        setTimeout(function() {
            invitationContainer.style.display = 'none';
            mainContent.style.display = 'block';
            // Trigger reflow
            mainContent.offsetHeight;
            mainContent.classList.add('visible');
            // Initialize components after content is visible
            initializeComponents();
        }, 1000);
    }, 500);
});

// ============================================
// INITIALIZE COMPONENTS
// ============================================
function initializeComponents() {
    renderMembers(membersData);
    renderSeances();
    startClock();
}

// ============================================
// CLOCK FUNCTIONALITY
// ============================================
function startClock() {
    var hourHand = document.querySelector('.clock-hour-hand');
    var minuteHand = document.querySelector('.clock-minute-hand');
    var secondHand = document.querySelector('.clock-second-hand');
    
    function updateClock() {
        var now = new Date();
        var hours = now.getHours() % 12;
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var hourDeg = (hours * 30) + (minutes * 0.5);
        var minuteDeg = minutes * 6;
        var secondDeg = seconds * 6;
        
        hourHand.style.setProperty('--hour-deg', hourDeg + 'deg');
        minuteHand.style.setProperty('--minute-deg', minuteDeg + 'deg');
        secondHand.style.setProperty('--second-deg', secondDeg + 'deg');
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// RENDER MEMBERS
// ============================================
function renderMembers(members) {
    membersGrid.innerHTML = '';
    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        var card = createMemberCard(member);
        membersGrid.appendChild(card);
    }
}

function createMemberCard(member) {
    var card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.rank = member.rank;
    
    var rankSymbol = getRankSymbol(member.rank);
    
    card.innerHTML = 
        '<span class="rank-indicator rank-' + member.rank + '">' + rankSymbol + '</span>' +
        '<div class="daguerreotype-container">' +
            '<div class="daguerreotype-frame"></div>' +
            '<div class="portrait-inner">' +
                '<img src="' + member.portrait + '" alt="' + member.name + '" loading="lazy">' +
                '<div class="daguerreotype-overlay"></div>' +
                '<div class="daguerreotype-scratches"></div>' +
            '</div>' +
        '</div>' +
        '<div class="member-info">' +
            '<h3 class="member-name">' + member.name + '</h3>' +
            '<p class="member-rank">' + member.title + '</p>' +
            '<p class="member-title">' + member.fullTitle + '</p>' +
            '<p class="member-specialization">' + member.specialization + '</p>' +
        '</div>';
    
    card.addEventListener('click', function() {
        openMemberModal(member);
    });
    
    return card;
}

function getRankSymbol(rank) {
    switch(rank) {
        case 'archon':
            return '👑';
        case 'master':
            return '⚜';
        case 'adept':
            return '◆';
        case 'seeker':
            return '◇';
        default:
            return '●';
    }
}

// ============================================
// RENDER SEANCES
// ============================================
function renderSeances() {
    seanceList.innerHTML = '';
    for (var i = 0; i < seanceData.length; i++) {
        var seance = seanceData[i];
        var item = createSeanceItem(seance);
        seanceList.appendChild(item);
    }
}

function createSeanceItem(seance) {
    var item = document.createElement('div');
    item.className = 'seance-item';
    item.innerHTML = 
        '<div class="seance-date">' +
            '<span class="seance-day">' + seance.day + '</span>' +
            '<span class="seance-time">' + seance.date + ' • ' + seance.time + '</span>' +
        '</div>' +
        '<div class="seance-details">' +
            '<h4 class="seance-title">' + seance.title + '</h4>' +
            '<p class="seance-conductor">Conducted by <span>' + seance.conductor + '</span></p>' +
        '</div>';
    return item;
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
for (var i = 0; i < filterBtns.length; i++) {
    (function(btn) {
        btn.addEventListener('click', function() {
            // Update active state
            for (var j = 0; j < filterBtns.length; j++) {
                filterBtns[j].classList.remove('active');
            }
            btn.classList.add('active');
            
            // Filter members
            var filter = btn.dataset.filter;
            var filteredMembers;
            
            if (filter === 'all') {
                filteredMembers = membersData;
            } else {
                filteredMembers = membersData.filter(function(m) {
                    return m.rank === filter;
                });
            }
            
            // Re-render with animation
            membersGrid.style.opacity = '0';
            setTimeout(function() {
                renderMembers(filteredMembers);
                membersGrid.style.transition = 'opacity 0.3s ease';
                membersGrid.style.opacity = '1';
            }, 300);
        });
    })(filterBtns[i]);
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
function openMemberModal(member) {
    var modalPortrait = document.getElementById('modalPortrait');
    var modalImage = document.getElementById('modalImage');
    var modalName = document.getElementById('modalName');
    var modalRank = document.getElementById('modalRank');
    var modalTitle = document.getElementById('modalTitle');
    var modalSpecialization = document.getElementById('modalSpecialization');
    var modalAbilities = document.getElementById('modalAbilities');
    var modalSeances = document.getElementById('modalSeances');
    
    // Set content
    modalImage.src = member.portrait;
    modalImage.alt = member.name;
    modalName.textContent = member.name;
    modalRank.textContent = member.title;
    modalTitle.textContent = member.fullTitle;
    modalSpecialization.textContent = member.specialization;
    modalSeances.textContent = member.seances;
    
    // Set abilities
    modalAbilities.innerHTML = '';
    for (var i = 0; i < member.abilities.length; i++) {
        var li = document.createElement('li');
        li.textContent = member.abilities[i];
        modalAbilities.appendChild(li);
    }
    
    // Show modal
    memberModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

closeModalBtn.addEventListener('click', closeMemberModal);

memberModal.addEventListener('click', function(e) {
    if (e.target === memberModal) {
        closeMemberModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && memberModal.classList.contains('visible')) {
        closeMemberModal();
    }
});

function closeMemberModal() {
    memberModal.classList.remove('visible');
    document.body.style.overflow = '';
}

// ============================================
// AMBIENT LIGHTING VARIATION
// ============================================
function adjustGaslight() {
    var overlay = document.querySelector('.gaslight-overlay');
    var intensity = 0.92 + Math.random() * 0.08;
    overlay.style.opacity = intensity;
}

setInterval(adjustGaslight, 5000);

// ============================================
// SMOOTH SCROLL FOR ANCHORS
// ============================================
var anchors = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ============================================
// PARALLAX EFFECT ON HIERARCHY
// ============================================
var hierarchySection = document.querySelector('.hierarchy-section');

window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var circles = document.querySelectorAll('.circle');
    for (var i = 0; i < circles.length; i++) {
        var speed = 0.02 + (i * 0.01);
        circles[i].style.transform = 'translateX(-50%) translateY(' + (scrolled * speed) + 'px)';
    }
});

// ============================================
// TYPEWRITER EFFECT FOR INTRO
// ============================================
function typeWriter(element, text, speed) {
    var i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ============================================
// INITIALIZATION
// ============================================
// Check if we're coming from an invitation or page refresh
// If main content is visible from start (page refresh), initialize components
if (mainContent.classList.contains('visible')) {
    initializeComponents();
}

// Add entrance animations after page load
window.addEventListener('load', function() {
    // Add subtle floating animation to clock pendulum
    var pendulum = document.querySelector('.clock-pendulum');
    if (pendulum) {
        pendulum.style.animationDelay = (Math.random() * 2) + 's';
    }
});