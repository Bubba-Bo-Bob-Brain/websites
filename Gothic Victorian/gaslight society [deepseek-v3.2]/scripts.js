// ===========================================
// SOCIETY OF THE VEILED LANTERN - SCRIPTS
// Interactive Directory Functionality
// ===========================================

// ===== DOM ELEMENTS =====
const invitationContainer = document.getElementById('invitationContainer');
const invitationLetter = document.getElementById('invitationLetter');
const acceptInvitationBtn = document.getElementById('acceptInvitation');
const mainInterface = document.getElementById('mainInterface');
const memberSearch = document.getElementById('memberSearch');
const gridViewBtn = document.getElementById('gridViewBtn');
const hierarchyViewBtn = document.getElementById('hierarchyViewBtn');
const seanceViewBtn = document.getElementById('seanceViewBtn');
const gridView = document.getElementById('gridView');
const hierarchyView = document.getElementById('hierarchyView');
const seanceView = document.getElementById('seanceView');
const membersContainer = document.getElementById('membersContainer');
const memberModal = document.getElementById('memberModal');
const modalClose = document.getElementById('modalClose');
const circleFilters = document.querySelectorAll('.circle-filter');
const memberCount = document.getElementById('memberCount');

// Clock elements
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const clockTick = document.getElementById('clockTick');

// Audio elements
const pageTurnAudio = document.getElementById('pageTurnAudio');
const sealBreakAudio = document.getElementById('sealBreakAudio');
const clockTickAudio = document.getElementById('clockTickAudio');

// ===== DATA & CONFIGURATION =====
const societyMembers = [
    {
        id: 1,
        name: "Lord Alistair Blackwood",
        circle: "inner-sanctum",
        specialization: "Necromancy & Spirit Communion",
        initiationDate: "14th October, 1872",
        seanceRole: "Medium",
        associates: ["Lady Eleanor Vance", "Professor Alistair Finch"],
        sigil: "⚰",
        portrait: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "A distinguished practitioner of the arcane arts with particular expertise in communing with ancestral spirits. Noted for his unwavering discretion and mastery of protective wards. Current head of the Inner Sanctum."
    },
    {
        id: 2,
        name: "Lady Seraphina Vale",
        circle: "inner-sanctum",
        specialization: "Divination & Prophetic Arts",
        initiationDate: "3rd March, 1865",
        seanceRole: "Scryer",
        associates: ["Lord Alistair Blackwood", "Dr. Elias Thorne"],
        sigil: "🔮",
        portrait: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Renowned for her uncanny accuracy in reading the etheric currents. Maintains the Society's collection of scrying mirrors and crystal spheres. Has accurately predicted three lunar eclipses to the minute."
    },
    {
        id: 3,
        name: "Professor Alistair Finch",
        circle: "keepers-of-the-seal",
        specialization: "Cryptography & Cipher Breaking",
        initiationDate: "22nd November, 1868",
        seanceRole: "Recorder",
        associates: ["Lord Alistair Blackwood", "Madame Isolde"],
        sigil: "✍",
        portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Former Oxford don who left academia to pursue esoteric knowledge full-time. Maintains the Society's extensive archive of coded manuscripts. Designed the current rotational cipher system."
    },
    {
        id: 4,
        name: "Madame Isolde",
        circle: "keepers-of-the-seal",
        specialization: "Warding & Protective Magicks",
        initiationDate: "Unknown (circa 1850)",
        seanceRole: "Guardian",
        associates: ["Professor Alistair Finch", "Brother Silas"],
        sigil: "🛡",
        portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286d2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "The Society's eldest living member. Her true name and origins are unknown. Specializes in creating and maintaining protective barriers around meeting places. Rumored to have once turned back a poltergeist manifestation single-handedly."
    },
    {
        id: 5,
        name: "Brother Silas",
        circle: "whispering-chapter",
        specialization: "Herbalism & Alchemical Preparations",
        initiationDate: "7th June, 1875",
        seanceRole: "Preparator",
        associates: ["Madame Isolde", "Miss Eleanor Grey"],
        sigil: "🌿",
        portrait: "https://images.unsplash.com/photo-1507591064344-4c6ce005-1288.jpg?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Former monastery herbalist who brings practical knowledge of medicinal and ritual plants. Maintains the Society's greenhouse of rare botanical specimens. Known for his exceptional memory and quiet demeanor."
    },
    {
        id: 6,
        name: "Miss Eleanor Grey",
        circle: "whispering-chapter",
        specialization: "Oneiromancy & Dreamweaving",
        initiationDate: "19th September, 1878",
        seanceRole: "Dream Interpreter",
        associates: ["Brother Silas", "Mr. Percival Thorne"],
        sigil: "💤",
        portrait: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "A natural sensitive who can navigate the dream realms with unusual precision. Records her prophetic dreams in a series of coded journals. Recently prevented a potential breach by warning of an astral intrusion weeks in advance."
    },
    {
        id: 7,
        name: "Mr. Percival Thorne",
        circle: "apprentices",
        specialization: "Astral Navigation",
        initiationDate: "2nd May, 1880",
        seanceRole: "Assistant",
        associates: ["Miss Eleanor Grey", "Ms. Beatrice Crowe"],
        sigil: "⭐",
        portrait: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Young but promising apprentice showing particular aptitude for celestial mapping and astral projection. Currently assisting Professor Finch with cataloging star charts. Has demonstrated remarkable resilience during séances."
    },
    {
        id: 8,
        name: "Ms. Beatrice Crowe",
        circle: "apprentices",
        specialization: "Sympathetic Magick",
        initiationDate: "11th November, 1881",
        seanceRole: "Observer",
        associates: ["Mr. Percival Thorne", "Dr. Elias Thorne"],
        sigil: "🕊",
        portrait: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Recent initiate showing promising talent for creating connections between objects and their owners. Granddaughter of a founding member. Currently studying under Madame Isolde's tutelage for warding techniques."
    },
    {
        id: 9,
        name: "Dr. Elias Thorne",
        circle: "keepers-of-the-seal",
        specialization: "Ectoplasmic Manifestation",
        initiationDate: "30th July, 1869",
        seanceRole: "Conductor",
        associates: ["Lady Seraphina Vale", "Ms. Beatrice Crowe"],
        sigil: "👻",
        portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        bio: "Medical doctor turned paranormal researcher. His scientific background brings methodological rigor to the Society's investigations. Has documented over 47 distinct types of ectoplasmic residue."
    },
    {
        id: 10,
        name: "Lady Eleanor Vance",
        circle: "inner-sanctum",
        specialization: "Artifact Authentication",
        initiationDate: "9th April, 1863",
        seanceRole: "Artifact Handler",
        associates: ["Lord Alistair Blackwood", "Professor Alistair Finch"],
        sigil: "🏺",
        portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&rop&w=400&q=80",
        bio: "Expert in authenticating historical artifacts and detecting forgeries. Maintains the Society's collection of ritual objects. Her family has been involved with the Society since its founding generation."
    }
];

const seanceEvents = [
    {
        id: 1,
        title: "Full Moon Séance",
        date: "15th October, 1883",
        time: "11:47 PM",
        circle: "All Circles",
        location: "Grand Hall",
        purpose: "Communion with ancestral spirits under the Hunter's Moon"
    },
    {
        id: 2,
        title: "Astral Mapping Session",
        date: "22nd October, 1883",
        time: "9:30 PM",
        circle: "Whispering Chapter & Apprentices",
        location: "Observatory",
        purpose: "Charting the autumn constellations for ritual alignment"
    },
    {
        id: 3,
        title: "Cipher Rotation Ceremony",
        date: "1st November, 1883",
        time: "Midnight",
        circle: "Keepers of the Seal",
        location: "Archive Vault",
        purpose: "Implementing the new seasonal encryption keys"
    },
    {
        id: 4,
        title: "Waning Moon Ritual",
        date: "5th November, 1883",
        time: "10:15 PM",
        circle: "Inner Sanctum",
        location: "Private Chamber",
        purpose: "Banishing negative energies before the new cycle"
    },
    {
        id: 5,
        title: "New Moon Initiation",
        date: "13th November, 1883",
        time: "8:00 PM",
        circle: "All Circles",
        location: "Ceremonial Hall",
        purpose: "Welcoming new apprentices under the dark moon"
    }
];

const circleHierarchy = {
    "inner-sanctum": {
        level: 1,
        color: "#6d2135",
        members: [1, 2, 10],
        leadsTo: ["keepers-of-the-seal"],
        description: "The innermost circle of leadership. Makes final decisions on all Society matters."
    },
    "keepers-of-the-seal": {
        level: 2,
        color: "#8b5a2b",
        members: [3, 4, 9],
        leadsTo: ["whispering-chapter"],
        receivesFrom: ["inner-sanctum"],
        description: "Guardians of knowledge and security. Maintain archives and protective wards."
    },
    "whispering-chapter": {
        level: 3,
        color: "#3d2811",
        members: [5, 6],
        leadsTo: ["apprentices"],
        receivesFrom: ["keepers-of-the-seal"],
        description: "Researchers and specialists. Conduct experiments and develop new techniques."
    },
    "apprentices": {
        level: 4,
        color: "#d4a76a",
        members: [7, 8],
        receivesFrom: ["whispering-chapter"],
        description: "New initiates undergoing training and proving their dedication."
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSocietyDirectory();
});

function initializeSocietyDirectory() {
    // Initialize the clock
    initializeGrandfatherClock();
    
    // Load members into the grid
    renderMemberCards();
    
    // Load seance events
    renderSeanceEvents();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update member count
    updateMemberCount();
    
    // Start ambient audio (muted by default)
    startAmbientAudio();
    
    // Set next gathering date
    setNextGathering();
}

// ===== INVITATION MECHANIC =====
// Wax seal click opens the invitation
document.querySelector('.wax-seal').addEventListener('click', function() {
    playAudio(sealBreakAudio);
    invitationLetter.classList.add('show');
    
    // Animate wax seal breaking
    this.style.transform = 'translate(-50%, -50%) scale(1.1)';
    this.style.opacity = '0.7';
    
    setTimeout(() => {
        this.style.display = 'none';
    }, 500);
});

// Accept invitation button
acceptInvitationBtn.addEventListener('click', function() {
    playAudio(pageTurnAudio);
    
    // Hide invitation container
    invitationContainer.style.opacity = '0';
    invitationContainer.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        invitationContainer.style.display = 'none';
        
        // Show main interface
        mainInterface.classList.add('show');
        
        // Start clock ticking sound
        clockTickAudio.play().catch(e => console.log("Audio play failed:", e));
        clockTickAudio.volume = 0.3;
        
        // Start pendulum animation
        startPendulumAnimation();
        
        // Trigger ambient flicker
        triggerAmbientFlicker();
    }, 1000);
});

// ===== GRANDFATHER CLOCK FUNCTIONALITY =====
function initializeGrandfatherClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = (minutes * 6) + (seconds * 0.1);
    const secondDeg = seconds * 6;
    
    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    
    // Add subtle ticking sound effect randomly
    if (seconds % 2 === 0) {
        clockTick.style.animation = 'none';
        setTimeout(() => {
            clockTick.style.animation = 'clockTick 0.5s';
        }, 10);
    }
}

function startPendulumAnimation() {
    const pendulumRod = document.querySelector('.pendulum-rod');
    pendulumRod.style.animation = 'pendulumSwing 2s infinite alternate ease-in-out';
    
    // Define the animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pendulumSwing {
            0% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
        }
        @keyframes clockTick {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== MEMBER CARDS RENDERING =====
function renderMemberCards(filterCircle = 'all') {
    membersContainer.innerHTML = '';
    
    const filteredMembers = societyMembers.filter(member => {
        if (filterCircle === 'all') return true;
        return member.circle === filterCircle;
    });
    
    filteredMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.dataset.id = member.id;
        memberCard.dataset.circle = member.circle;
        
        // Format circle name for display
        const circleName = formatCircleName(member.circle);
        
        memberCard.innerHTML = `
            <div class="member-portrait-container">
                <div class="member-portrait-frame">
                    <img class="member-portrait" src="${member.portrait}" alt="Portrait of ${member.name}">
                    <div class="daguerreotype-filter"></div>
                </div>
            </div>
            <div class="member-info">
                <h3 class="member-name">
                    <span>${member.name}</span>
                    <span class="member-circle">${circleName}</span>
                </h3>
                <p class="member-specialization">${member.specialization}</p>
                <div class="member-details">
                    <div class="member-detail">
                        <span class="detail-label">Initiated:</span>
                        <span class="detail-value">${member.initiationDate}</span>
                    </div>
                    <div class="member-detail">
                        <span class="detail-label">Séance Role:</span>
                        <span class="detail-value">${member.seanceRole}</span>
                    </div>
                </div>
            </div>
        `;
        
        memberCard.addEventListener('click', () => openMemberModal(member.id));
        membersContainer.appendChild(memberCard);
    });
    
    updateMemberCount(filteredMembers.length);
}

function formatCircleName(circleId) {
    const nameMap = {
        'inner-sanctum': 'Inner Sanctum',
        'keepers-of-the-seal': 'Keepers of the Seal',
        'whispering-chapter': 'Whispering Chapter',
        'apprentices': 'Apprentice'
    };
    return nameMap[circleId] || circleId;
}

// ===== MEMBER MODAL FUNCTIONALITY =====
function openMemberModal(memberId) {
    playAudio(pageTurnAudio);
    
    const member = societyMembers.find(m => m.id === memberId);
    if (!member) return;
    
    // Update modal content
    document.getElementById('modalMemberName').textContent = member.name;
    document.getElementById('modalPortrait').src = member.portrait;
    document.getElementById('modalPortrait').alt = `Portrait of ${member.name}`;
    document.getElementById('modalCircleBadge').innerHTML = `<span class="circle-name">${formatCircleName(member.circle)}</span>`;
    document.getElementById('modalSpecialization').textContent = member.specialization;
    document.getElementById('modalInitiation').textContent = member.initiationDate;
    document.getElementById('modalAssociates').textContent = member.associates.join(', ');
    document.getElementById('modalRole').textContent = member.seanceRole;
    document.getElementById('modalSigil').textContent = member.sigil;
    document.getElementById('modalBio').textContent = member.bio;
    
    // Show modal
    memberModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
modalClose.addEventListener('click', () => {
    memberModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking backdrop
memberModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        memberModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ===== SEANCE EVENTS RENDERING =====
function renderSeanceEvents() {
    const seanceTimeline = document.querySelector('.seance-timeline');
    seanceTimeline.innerHTML = '';
    
    seanceEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'seance-event';
        eventElement.innerHTML = `
            <div class="event-header">
                <h4 class="event-title">${event.title}</h4>
                <span class="event-circle">${event.circle}</span>
            </div>
            <div class="event-details">
                <div class="event-date">
                    <i class="fas fa-calendar-day"></i>
                    <span>${event.date}</span>
                </div>
                <div class="event-time">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
            <p class="event-purpose">${event.purpose}</p>
        `;
        
        // Add styling for the event element
        eventElement.style.cssText = `
            background: linear-gradient(145deg, rgba(61, 40, 17, 0.8), rgba(45, 10, 26, 0.8));
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(139, 90, 43, 0.3);
            box-shadow: 0 4px 16px rgba(20, 10, 5, 0.7);
            transition: transform 0.3s ease;
        `;
        
        eventElement.addEventListener('mouseenter', () => {
            eventElement.style.transform = 'translateY(-3px)';
        });
        
        eventElement.addEventListener('mouseleave', () => {
            eventElement.style.transform = 'translateY(0)';
        });
        
        seanceTimeline.appendChild(eventElement);
    });
}

// ===== VIEW TOGGLE FUNCTIONALITY =====
function switchView(view) {
    // Hide all views
    gridView.classList.remove('active-view');
    hierarchyView.classList.remove('active-view');
    seanceView.classList.remove('active-view');
    
    // Remove active class from all view buttons
    gridViewBtn.classList.remove('active');
    hierarchyViewBtn.classList.remove('active');
    seanceViewBtn.classList.remove('active');
    
    // Show selected view and activate button
    if (view === 'grid') {
        gridView.classList.add('active-view');
        gridViewBtn.classList.add('active');
    } else if (view === 'hierarchy') {
        hierarchyView.classList.add('active-view');
        hierarchyViewBtn.classList.add('active');
        renderHierarchyView();
    } else if (view === 'seance') {
        seanceView.classList.add('active-view');
        seanceViewBtn.classList.add('active');
    }
}

// ===== HIERARCHY VIEW RENDERING =====
function renderHierarchyView() {
    const hierarchyContainer = document.getElementById('hierarchyContainer');
    hierarchyContainer.innerHTML = '';
    
    // Create the hierarchy visualization
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "500");
    svg.setAttribute("viewBox", "0 0 800 500");
    
    // Draw connecting lines between circles
    const connections = [
        { from: "inner-sanctum", to: "keepers-of-the-seal" },
        { from: "keepers-of-the-seal", to: "whispering-chapter" },
        { from: "whispering-chapter", to: "apprentices" }
    ];
    
    const circlePositions = {
        "inner-sanctum": { x: 200, y: 100 },
        "keepers-of-the-seal": { x: 400, y: 200 },
        "whispering-chapter": { x: 600, y: 300 },
        "apprentices": { x: 400, y: 400 }
    };
    
    // Draw connections
    connections.forEach(conn => {
        const fromPos = circlePositions[conn.from];
        const toPos = circlePositions[conn.to];
        
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", fromPos.x);
        line.setAttribute("y1", fromPos.y);
        line.setAttribute("x2", toPos.x);
        line.setAttribute("y2", toPos.y);
        line.setAttribute("stroke", "#8b5a2b");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "5,5");
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
        
        // Add arrowhead
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const arrowSize = 10;
        
        const arrowX = toPos.x - arrowSize * Math.cos(angle);
        const arrowY = toPos.y - arrowSize * Math.sin(angle);
        
        const arrow = document.createElementNS(svgNS, "polygon");
        const points = `
            ${arrowX},${arrowY}
            ${arrowX - arrowSize * Math.cos(angle - Math.PI/6)},${arrowY - arrowSize * Math.sin(angle - Math.PI/6)}
            ${arrowX - arrowSize * Math.cos(angle + Math.PI/6)},${arrowY - arrowSize * Math.sin(angle + Math.PI/6)}
        `;
        arrow.setAttribute("points", points);
        arrow.setAttribute("fill", "#8b5a2b");
        arrow.setAttribute("opacity", "0.6");
        
        svg.appendChild(arrow);
    });
    
    // Draw circles
    Object.keys(circlePositions).forEach(circleId => {
        const pos = circlePositions[circleId];
        const circle = circleHierarchy[circleId];
        
        // Draw circle background
        const circleGroup = document.createElementNS(svgNS, "g");
        
        const circleBg = document.createElementNS(svgNS, "circle");
        circleBg.setAttribute("cx", pos.x);
        circleBg.setAttribute("cy", pos.y);
        circleBg.setAttribute("r", 60);
        circleBg.setAttribute("fill", circle.color);
        circleBg.setAttribute("opacity", "0.8");
        circleBg.setAttribute("stroke", "#d4a76a");
        circleBg.setAttribute("stroke-width", "2");
        
        circleGroup.appendChild(circleBg);
        
        // Add circle title
        const title = document.createElementNS(svgNS, "text");
        title.setAttribute("x", pos.x);
        title.setAttribute("y", pos.y - 40);
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("fill", "#f5e9d6");
        title.setAttribute("font-family", "'Cinzel', serif");
        title.setAttribute("font-size", "16");
        title.setAttribute("font-weight", "bold");
        title.textContent = formatCircleName(circleId);
        
        circleGroup.appendChild(title);
        
        // Add member count
        const memberCountText = document.createElementNS(svgNS, "text");
        memberCountText.setAttribute("x", pos.x);
        memberCountText.setAttribute("y", pos.y + 5);
        memberCountText.setAttribute("text-anchor", "middle");
        memberCountText.setAttribute("fill", "#d4a76a");
        memberCountText.setAttribute("font-family", "'Crimson Text', serif");
        memberCountText.setAttribute("font-size", "14");
        memberCountText.textContent = `${circle.members.length} Members`;
        
        circleGroup.appendChild(memberCountText);
        
        // Add description on hover (tooltip)
        const titleElement = document.createElementNS(svgNS, "title");
        titleElement.textContent = circle.description;
        circleGroup.appendChild(titleElement);
        
        // Make circle interactive
        circleGroup.style.cursor = "pointer";
        circleGroup.addEventListener("mouseenter", function() {
            circleBg.setAttribute("stroke-width", "4");
            circleBg.setAttribute("filter", "url(#glow)");
        });
        
        circleGroup.addEventListener("mouseleave", function() {
            circleBg.setAttribute("stroke-width", "2");
            circleBg.removeAttribute("filter");
        });
        
        circleGroup.addEventListener("click", function() {
            // Filter members by this circle
            switchView('grid');
            
            // Update circle filter buttons
            circleFilters.forEach(btn => btn.classList.remove('active'));
            const correspondingBtn = document.querySelector(`.circle-filter[data-circle="${circleId}"]`);
            if (correspondingBtn) {
                correspondingBtn.classList.add('active');
            }
            
            // Render members for this circle
            renderMemberCards(circleId);
        });
        
        svg.appendChild(circleGroup);
    });
    
    // Add glow filter for hover effect
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    
    const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "4");
    feGaussianBlur.setAttribute("result", "coloredBlur");
    
    const feMerge = document.createElementNS(svgNS, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);
    
    hierarchyContainer.appendChild(svg);
}

// ===== FILTERING & SEARCH FUNCTIONALITY =====
function setupEventListeners() {
    // View toggle buttons
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    hierarchyViewBtn.addEventListener('click', () => switchView('hierarchy'));
    seanceViewBtn.addEventListener('click', () => switchView('seance'));
    
    // Circle filter buttons
    circleFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            circleFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter members
            const circle = this.dataset.circle;
            renderMemberCards(circle);
            
            // Switch to grid view if not already
            if (!gridView.classList.contains('active-view')) {
                switchView('grid');
            }
        });
    });
    
    // Member search
    memberSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Filter members based on search
        const filteredMembers = societyMembers.filter(member => {
            return member.name.toLowerCase().includes(searchTerm) ||
                   member.specialization.toLowerCase().includes(searchTerm) ||
                   member.circle.toLowerCase().includes(searchTerm);
        });
        
        // Update member count
        updateMemberCount(filteredMembers.length);
        
        // Get active circle filter
        const activeCircle = document.querySelector('.circle-filter.active').dataset.circle;
        
        // Re-render cards with search filter
        renderFilteredCards(filteredMembers, activeCircle);
    });
    
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && memberModal.classList.contains('show')) {
            memberModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

function renderFilteredCards(filteredMembers, activeCircle) {
    membersContainer.innerHTML = '';
    
    // Apply circle filter if not 'all'
    let membersToShow = filteredMembers;
    if (activeCircle !== 'all') {
        membersToShow = filteredMembers.filter(member => member.circle === activeCircle);
    }
    
    // Render cards
    membersToShow.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.dataset.id = member.id;
        memberCard.dataset.circle = member.circle;
        
        const circleName = formatCircleName(member.circle);
        
        memberCard.innerHTML = `
            <div class="member-portrait-container">
                <div class="member-portrait-frame">
                    <img class="member-portrait" src="${member.portrait}" alt="Portrait of ${member.name}">
                    <div class="daguerreotype-filter"></div>
                </div>
            </div>
            <div class="member-info">
                <h3 class="member-name">
                    <span>${member.name}</span>
                    <span class="member-circle">${circleName}</span>
                </h3>
                <p class="member-specialization">${member.specialization}</p>
                <div class="member-details">
                    <div class="member-detail">
                        <span class="detail-label">Initiated:</span>
                        <span class="detail-value">${member.initiationDate}</span>
                    </div>
                    <div class="member-detail">
                        <span class="detail-label">Séance Role:</span>
                        <span class="detail-value">${member.seanceRole}</span>
                    </div>
                </div>
            </div>
        `;
        
        memberCard.addEventListener('click', () => openMemberModal(member.id));
        membersContainer.appendChild(memberCard);
    });
    
    // If no members match search, show message
    if (membersToShow.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #d4a76a;">
                <i class="fas fa-eye-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3 style="font-family: 'Cinzel', serif; margin-bottom: 0.5rem;">No Members Found</h3>
                <p style="font-style: italic;">The ether reveals no matches for your query.</p>
            </div>
        `;
        membersContainer.appendChild(noResults);
    }
}

// ===== HELPER FUNCTIONS =====
function updateMemberCount(count = societyMembers.length) {
    memberCount.textContent = count;
}

function playAudio(audioElement) {
    // Reset audio and play
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("Audio play failed:", e));
}

function startAmbientAudio() {
    // Set initial volume low
    clockTickAudio.volume = 0.2;
    
    // Try to play (might be blocked by browser autoplay policies)
    clockTickAudio.play().catch(e => {
        console.log("Ambient audio blocked by browser policy");
    });
}

function triggerAmbientFlicker() {
    const ambientFlicker = document.querySelector('.ambient-flicker');
    
    // Random flicker intervals
    setInterval(() => {
        const randomOpacity = 0.4 + Math.random() * 0.4;
        ambientFlicker.style.opacity = randomOpacity;
    }, 800 + Math.random() * 1200);
}

function setNextGathering() {
    const nextGatheringElement = document.getElementById('nextGathering');
    if (seanceEvents.length > 0) {
        const nextEvent = seanceEvents[0];
        nextGatheringElement.textContent = `${nextEvent.title} - ${nextEvent.date}`;
    }
}

// ===== PAGE TRANSITIONS & EFFECTS =====
// Add page turn effect when switching views
let lastView = 'grid';

function animateViewTransition(newView) {
    if (lastView === newView) return;
    
    // Play page turn sound
    playAudio(pageTurnAudio);
    
    lastView = newView;
}

// Modify switchView to include animation
const originalSwitchView = switchView;
switchView = function(view) {
    animateViewTransition(view);
    originalSwitchView(view);
};

// ===== ADDITIONAL AMBIENT EFFECTS =====
// Random candle flicker
setInterval(() => {
    const candleFlame = document.querySelector('.candle-flame');
    if (candleFlame) {
        const randomScale = 0.9 + Math.random() * 0.3;
        const randomX = -50 + Math.random() * 10;
        candleFlame.style.transform = `translateX(${randomX}%) scale(${randomScale})`;
    }
}, 300);

// Gaslamp random flicker
setInterval(() => {
    const gaslampFlame = document.querySelector('.gaslamp-flame');
    if (gaslampFlame) {
        const randomScale = 0.8 + Math.random() * 0.4;
        gaslampFlame.style.transform = `translate(-50%, -50%) scale(${randomScale})`;
    }
}, 500);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        memberSearch.focus();
    }
    
    // Ctrl/Cmd + H shows hierarchy view
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        switchView('hierarchy');
    }
    
    // Ctrl/Cmd + G shows grid view
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        switchView('grid');
    }
    
    // Ctrl/Cmd + S shows seance view
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        switchView('seance');
    }
});

// ===== MOON PHASE SIMULATION =====
function updateMoonPhase() {
    const moonPhaseElement = document.querySelector('.phase-text');
    const moonIcons = document.querySelectorAll('.moon-icon i');
    
    const phases = [
        "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
        "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
    ];
    
    // Simulate moon cycle based on current date
    const now = new Date();
    const dayOfMonth = now.getDate();
    const phaseIndex = Math.floor((dayOfMonth % 30) / 30 * phases.length);
    
    const currentPhase = phases[phaseIndex];
    moonPhaseElement.textContent = currentPhase;
    
    // Update moon icon based on phase
    const opacity = phaseIndex < 4 ? 0.3 + (phaseIndex * 0.2) : 1 - ((phaseIndex - 4) * 0.2);
    moonIcons[1].style.opacity = Math.max(0.1, Math.min(1, opacity));
}

// Initialize moon phase
updateMoonPhase();
setInterval(updateMoonPhase, 60000); // Update every minute

// ===== FINAL INITIALIZATION =====
// Add some CSS for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
    }
    
    .seance-event:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(20, 10, 5, 0.8);
    }
    
    .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .event-title {
        font-family: 'Cinzel', serif;
        color: #d4a76a;
        font-size: 1.2rem;
        margin: 0;
    }
    
    .event-circle {
        background-color: rgba(109, 33, 53, 0.7);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.85rem;
        color: #f5e9d6;
    }
    
    .event-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.75rem;
        flex-wrap: wrap;
    }
    
    .event-date, .event-time, .event-location {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #d4a76a;
    }
    
    .event-purpose {
        color: #e8d9c0;
        font-style: italic;
        margin: 0;
        font-size: 0.95rem;
    }
    
    .member-card:hover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, transparent, rgba(255, 216, 166, 0.1));
        pointer-events: none;
    }
    
    @keyframes gentlePulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.9; }
    }
`;
document.head.appendChild(dynamicStyles);

console.log("Society of the Veiled Lantern directory initialized.");