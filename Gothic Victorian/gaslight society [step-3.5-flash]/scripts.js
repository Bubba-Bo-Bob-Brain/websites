// Victorian Occult Society Member Directory - Interactive Script
// ============================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // DATA GENERATION
    // ============================================
    
    // Fixed member data (the 5 shown in HTML)
    const fixedMembers = [
        {
            id: 1,
            name: "Lord Mortimer Blackwood",
            title: "Supreme Arcane Magistrate",
            circle: "supreme",
            specialization: "necromancy",
            nextSeance: "Saturday, 11:00 PM",
            seanceHost: "Lord Blackwood",
            ritualFocus: "The Black Tome of Aldur",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&grayscale"
        },
        {
            id: 2,
            name: "Lady Evangeline Thorne",
            title: "Mistress of Alchemical Secrets",
            circle: "inner",
            specialization: "alchemy",
            nextSeance: "Wednesday, 9:00 PM",
            seanceHost: "Lady Thorne",
            ritualFocus: "Philosopher's Stone Research",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=250&fit=crop&grayscale"
        },
        {
            id: 3,
            name: "Professor Alistair Crowley",
            title: "Seer of the Astral Plane",
            circle: "inner",
            specialization: "divination",
            nextSeance: "Friday, 10:00 PM",
            seanceHost: "Lord Blackwood",
            ritualFocus: "Crystal Ball of Ammon",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&grayscale"
        },
        {
            id: 4,
            name: "Mistress Isabella Devereux",
            title: "Mistress of Wards & Glyphs",
            circle: "outer",
            specialization: "thaumaturgy",
            nextSeance: "Thursday, 8:00 PM",
            seanceHost: "Lady Thorne",
            ritualFocus: "Glyph of Aegis Maintenance",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop&grayscale"
        },
        {
            id: 5,
            name: "Brother Silas Grimshaw",
            title: "Astral Navigator",
            circle: "adept",
            specialization: "astral",
            nextSeance: "Sunday, 10:00 PM",
            seanceHost: "The Order",
            ritualFocus: "Silver Cord Preservation",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=250&fit=crop&grayscale"
        }
    ];

    // Data for generating additional members
    const firstNames = ["Alistair", "Evangeline", "Mortimer", "Isabella", "Silas", "Lucian", "Seraphina", "Thaddeus", 
                       "Genevieve", "Bartholomew", "Cecilia", "Reginald", "Morgana", "Percival", "Beatrix", 
                       "Cornelius", "Arabella", "Theodore", "Juliana", "Leander", "Victoire", "Montgomery", 
                       "Emmeline", "Cedric", "Althea", "Pandora", "Lysander", "Rosalind", "Cassius", "Elara"];
    
    const lastNames = ["Blackwood", "Thorne", "Crowley", "Devereux", "Grimshaw", "Alistair", "Crowley", "Thorne", 
                       "Blackwood", "Devereux", "Grimshaw", "Alistair", "Crowley", "Thorne", "Blackwood", 
                       "Devereux", "Grimshaw", "Alistair", "Crowley", "Thorne", "Montgomery", "Fairchild", 
                       "Winters", "Ashworth", "Sterling", "Vance", "Hawthorne", "Sterling", "Vance", "Hawthorne"];
    
    const titlesByCircle = {
        supreme: ["Supreme Arcane Magistrate", "Grand High Priest", "Lord of the Outer Darkness", 
                 "Archmage of the Abyss", "Keeper of the Black Seal", "Magus Primus"],
        inner: ["Mistress of Alchemical Secrets", "Seer of the Astral Plane", "Master of the Runes", 
               "Witch of the Winding Stair", "Sorcerer of the Silent Gate", "Oracle of the Veil"],
        outer: ["Mistress of Wards & Glyphs", "Keeper of the Tomes", "Warder of the Threshold", 
               "Guardian of the Outer Darkness", "Chronicler of the Forbidden", "Custodian of Relics"],
        adept: ["Astral Navigator", "Alchemical Apprentice", "Ritualist", "Summoner's Aid", 
               "Enchanter's Apprentice", "Elementalist"],
        neophyte: ["Initiate", "Student of the Occult", "Apprentice Seer", "Novice of the Black Arts", 
                  "Acolyte of the Crimson Veil", "Tentative Mystic"]
    };
    
    const specializations = ["necromancy", "alchemy", "divination", "thaumaturgy", "astral", 
                            "hermetic", "ritual", "summoning", "enchantment", "pyromancy", 
                            "cryomancy", "geomancy", "hydromancy", "aeromancy", "oneiromancy"];
    
    const ritualFocuses = [
        "The Black Tome of Aldur", "Philosopher's Stone Research", "Crystal Ball of Ammon",
        "Glyph of Aegis Maintenance", "Silver Cord Preservation", "Necronomicon Study",
        "Alchemical Elixir Brewing", "Summoning Circle Activation", "Enchanted Artifact Creation",
        "Astral Plane Mapping", "Ritual Dagger Blessing", "Candle Magic Mastery",
        "Talisman Charging", "Scrying Pool Maintenance", "Warding Sigil Drawing",
        "Elemental Binding", "Spirit Vessel Construction", "Ley Line Mapping",
        "Corpse Preservation", "Soul Jar Crafting", "Blood Magic Rituals",
        "Dream Walking", "Time Divination", "Familiar Bonding"
    ];
    
    const seanceDisplays = [
        "Full Moon • Midnight", "Wednesdays • 9 PM", "Saturdays • 11 PM",
        "New Moon • Dawn", "Equinoxes • 3 AM", "Solstices • Twilight",
        "Daily • 11 PM", "Weekends • 10 PM", "Thursdays • 8 PM"
    ];
    
    const seanceHosts = ["Lady Thorne", "Lord Blackwood", "The Order", "Professor Crowley", 
                        "Mistress Devereux", "Brother Grimshaw", "Sister Raven", "Doctor Mordecai"];
    
    const portraitImages = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=250&fit=crop&grayscale",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=250&fit=crop&grayscale"
    ];

    // Generate all members (94 total)
    function generateMembers() {
        const members = [...fixedMembers];
        let nextId = 6;
        
        // Distribution: 3 supreme, 7 inner, 12 outer, 24 adept, 48 neophyte
        // We already have: 1 supreme, 2 inner, 1 outer, 1 adept, 0 neophyte
        const distribution = {
            supreme: 2,    // 3 total - 1 fixed = 2
            inner: 5,      // 7 total - 2 fixed = 5
            outer: 11,     // 12 total - 1 fixed = 11
            adept: 23,     // 24 total - 1 fixed = 23
            neophyte: 48   // 48 total - 0 fixed = 48
        };
        
        const circles = ["supreme", "inner", "outer", "adept", "neophyte"];
        
        for (const circle of circles) {
            const count = distribution[circle];
            for (let i = 0; i < count; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const name = `${firstName} ${lastName}`;
                const title = titlesByCircle[circle][Math.floor(Math.random() * titlesByCircle[circle].length)];
                const specialization = specializations[Math.floor(Math.random() * specializations.length)];
                const seance = seanceDisplays[Math.floor(Math.random() * seanceDisplays.length)];
                const seanceHost = seanceHosts[Math.floor(Math.random() * seanceHosts.length)];
                const ritualFocus = ritualFocuses[Math.floor(Math.random() * ritualFocuses.length)];
                const image = portraitImages[(nextId - 6) % portraitImages.length];
                
                members.push({
                    id: nextId++,
                    name,
                    title,
                    circle,
                    specialization,
                    nextSeance: seance,
                    seanceHost,
                    ritualFocus,
                    image
                });
            }
        }
        
        return members;
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    let allMembers = generateMembers();
    let filteredMembers = [...allMembers];
    let currentPage = 1;
    const itemsPerPage = 12;
    let currentCircleFilter = 'all';
    let currentSpecFilter = 'all';
    let searchQuery = '';
    let currentView = 'grid';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const membersGrid = document.getElementById('membersGrid');
    const memberSearch = document.getElementById('memberSearch');
    const pagination = document.querySelector('.pagination');
    const invitationModal = document.getElementById('invitationModal');
    const closeModal = document.getElementById('closeModal');
    const acceptInvite = document.getElementById('acceptInvite');
    const declineInvite = document.getElementById('declineInvite');
    const recipientName = document.getElementById('recipientName');
    const inviteDate = document.getElementById('inviteDate');
    const inviteTime = document.getElementById('inviteTime');
    const viewButtons = document.querySelectorAll('.view-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const treeNodes = document.querySelectorAll('.tree-node');
    const specTags = document.querySelectorAll('.spec-tag');
    const grandfatherClock = document.getElementById('grandfatherClock');

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    
    function createMemberCard(member) {
        const card = document.createElement('article');
        card.className = `member-card ${member.circle}`;
        card.setAttribute('data-circle', member.circle);
        card.setAttribute('data-spec', member.specialization);
        card.setAttribute('data-id', member.id);
        
        // Determine circle badge class
        let circleBadgeClass = member.circle;
        if (member.circle === 'supreme') circleBadgeClass = 'supreme';
        else if (member.circle === 'inner') circleBadgeClass = 'inner';
        else if (member.circle === 'outer') circleBadgeClass = 'outer';
        else if (member.circle === 'adept') circleBadgeClass = 'adept';
        else circleBadgeClass = 'neophyte';
        
        card.innerHTML = `
            <div class="card-frame-ornate">
                <div class="portrait-frame">
                    <div class="daguerreotype">
                        <img src="${member.image}" alt="${member.name}">
                        <div class="daguerreotype-overlay"></div>
                        <div class="daguerreotype-scratches"></div>
                    </div>
                    <div class="frame-corner top-left"></div>
                    <div class="frame-corner top-right"></div>
                    <div class="frame-corner bottom-left"></div>
                    <div class="frame-corner bottom-right"></div>
                </div>
                <div class="card-details">
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-title">${member.title}</p>
                    <div class="member-attributes">
                        <div class="attribute">
                            <span class="attr-label">Specialization:</span>
                            <span class="attr-value">${capitalizeFirst(member.specialization)}</span>
                        </div>
                        <div class="attribute">
                            <span class="attr-label">Circle:</span>
                            <span class="attr-value circle-badge ${circleBadgeClass}">${capitalizeFirst(member.circle)}</span>
                        </div>
                        <div class="attribute">
                            <span class="attr-label">Next Seance:</span>
                            <span class="attr-value">${member.nextSeance}</span>
                        </div>
                        <div class="attribute">
                            <span class="attr-label">Ritual Focus:</span>
                            <span class="attr-value">${member.ritualFocus}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn invite-btn" data-member="${member.name}" data-title="${member.title}">
                            <span class="btn-icon">✉</span> Request Audience
                        </button>
                        <button class="action-btn profile-btn">
                            <span class="btn-icon">📜</span> View Profile
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    function renderMembers(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageMembers = filteredMembers.slice(start, end);
        
        membersGrid.innerHTML = '';
        
        if (pageMembers.length === 0) {
            membersGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--sepia);">
                    <h3 style="font-family: var(--font-display); color: var(--gold); margin-bottom: 1rem;">No Adepts Found</h3>
                    <p>Your search yielded no results from the Order's records.</p>
                    <button onclick="clearFilters()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--burgundy); color: var(--cream); border: 1px solid var(--gold); cursor: pointer;">Clear Filters</button>
                </div>
            `;
            return;
        }
        
        const fragment = document.createDocumentFragment();
        pageMembers.forEach(member => {
            fragment.appendChild(createMemberCard(member));
        });
        membersGrid.appendChild(fragment);
        
        updatePagination();
        updateStats();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
        const prevBtn = pagination.querySelector('.page-btn:first-child');
        const nextBtn = pagination.querySelector('.page-btn:last-child');
        const pageIndicator = pagination.querySelector('.page-indicator');
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    function updateStats() {
        const totalStat = document.querySelector('.directory-stats .stat:first-child strong');
        const activeStat = document.querySelector('.directory-stats .stat:nth-child(2) strong');
        
        if (totalStat) totalStat.textContent = filteredMembers.length;
        if (activeStat) activeStat.textContent = Math.min(filteredMembers.length, 3);
    }

    function filterMembers() {
        filteredMembers = allMembers.filter(member => {
            const circleMatch = currentCircleFilter === 'all' || member.circle === currentCircleFilter;
            const specMatch = currentSpecFilter === 'all' || member.specialization === currentSpecFilter;
            const searchMatch = searchQuery === '' || 
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.ritualFocus.toLowerCase().includes(searchQuery.toLowerCase());
            
            return circleMatch && specMatch && searchMatch;
        });
        
        currentPage = 1;
        renderMembers(currentPage);
        updateActiveFilters();
    }

    function updateActiveFilters() {
        // Update nav items
        navItems.forEach(item => {
            if (item.getAttribute('data-filter') === currentCircleFilter) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update tree nodes
        treeNodes.forEach(node => {
            const nodeCircle = getCircleFromLevel(node.getAttribute('data-level'));
            if (nodeCircle === currentCircleFilter) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });
        
        // Update spec tags
        specTags.forEach(tag => {
            if (tag.getAttribute('data-spec') === currentSpecFilter) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    }

    function getCircleFromLevel(level) {
        const levels = ['supreme', 'inner', 'outer', 'adept', 'neophyte'];
        return levels[parseInt(level)] || 'all';
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ============================================
    // MODAL FUNCTIONS
    // ============================================
    
    function showInvitationModal(memberName, memberTitle) {
        recipientName.textContent = memberName;
        
        // Generate a random future date (within 30 days)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        inviteDate.textContent = futureDate.toLocaleDateString('en-US', dateOptions);
        
        // Random time between 8 PM and 2 AM
        const hour = Math.floor(Math.random() * 6) + 20; // 8 PM to 2 AM
        const minute = Math.random() > 0.5 ? '00' : '30';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        inviteTime.textContent = `${displayHour}:${minute} ${ampm}`;
        
        invitationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Play parchment sound effect (if we had one)
        // const parchmentSound = new Audio('parchment.mp3');
        // parchmentSound.play().catch(() => {});
    }

    function hideInvitationModal() {
        invitationModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // GRANDFATHER CLOCK TICKING
    // ============================================
    
    function initGrandfatherClock() {
        if (!grandfatherClock) return;
        
        // Update clock hands to current time
        function updateClock() {
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            const hourDeg = (hours * 30) + (minutes * 0.5);
            const minuteDeg = (minutes * 6) + (seconds * 0.1);
            
            const hourHand = grandfatherClock.querySelector('.hour-hand');
            const minuteHand = grandfatherClock.querySelector('.minute-hand');
            
            if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
            if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        }
        
        // Update every second
        setInterval(updateClock, 1000);
        updateClock(); // Initial call
        
        // Add subtle random tick variations
        const pendulum = grandfatherClock.querySelector('.clock-pendulum');
        if (pendulum) {
            setInterval(() => {
                const variation = Math.random() * 0.2 - 0.1; // ±0.1s variation
                const duration = 2 + variation;
                pendulum.style.animationDuration = `${duration}s`;
            }, 5000);
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function setupEventListeners() {
        // Search functionality
        memberSearch.addEventListener('input', debounce(function(e) {
            searchQuery = e.target.value.trim();
            filterMembers();
        }, 300));
        
        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.getAttribute('data-view');
                membersGrid.className = `members-grid ${currentView}-view`;
            });
        });
        
        // Navigation filter
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentCircleFilter = this.getAttribute('data-filter');
                filterMembers();
            });
        });
        
        // Tree node filter
        treeNodes.forEach(node => {
            node.addEventListener('click', function() {
                const level = this.getAttribute('data-level');
                currentCircleFilter = getCircleFromLevel(level);
                filterMembers();
            });
        });
        
        // Specialization filter
        specTags.forEach(tag => {
            tag.addEventListener('click', function() {
                currentSpecFilter = this.getAttribute('data-spec');
                filterMembers();
            });
        });
        
        // Pagination
        pagination.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-btn') && !e.target.disabled) {
                if (e.target.textContent.includes('Previous')) {
                    currentPage--;
                } else {
                    currentPage++;
                }
                renderMembers(currentPage);
                window.scrollTo({ top: membersGrid.offsetTop - 100, behavior: 'smooth' });
            }
        });
        
        // Invite buttons (event delegation)
        membersGrid.addEventListener('click', function(e) {
            const inviteBtn = e.target.closest('.invite-btn');
            if (inviteBtn) {
                const memberName = inviteBtn.getAttribute('data-member');
                const memberTitle = inviteBtn.getAttribute('data-title');
                showInvitationModal(memberName, memberTitle);
            }
            
            const profileBtn = e.target.closest('.profile-btn');
            if (profileBtn) {
                const card = e.target.closest('.member-card');
                const memberId = card.getAttribute('data-id');
                const member = allMembers.find(m => m.id === parseInt(memberId));
                if (member) {
                    showMemberProfile(member);
                }
            }
        });
        
        // Modal controls
        closeModal.addEventListener('click', hideInvitationModal);
        acceptInvite.addEventListener('click', function() {
            hideInvitationModal();
            showNotification('Your summons has been accepted. The Black Chamber awaits.', 'success');
        });
        
        declineInvite.addEventListener('click', function() {
            hideInvitationModal();
            showNotification('You have declined the summons. May the shadows spare you.', 'warning');
        });
        
        invitationModal.addEventListener('click', function(e) {
            if (e.target === invitationModal) {
                hideInvitationModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && invitationModal.classList.contains('active')) {
                hideInvitationModal();
            }
        });
        
        // Initialize clock
        initGrandfatherClock();
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background: ${type === 'success' ? 'var(--burgundy)' : type === 'warning' ? 'var(--amber-dark)' : 'var(--burgundy-soft)'};
            color: var(--cream);
            padding: 1rem 1.5rem;
            border-radius: 4px;
            border: 2px solid var(--gold);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Add animation keyframes if not exists
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .notification-icon {
                    font-size: 1.2rem;
                }
                .notification-message {
                    flex: 1;
                    font-family: var(--font-body);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--cream);
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ============================================
    // MEMBER PROFILE MODAL (placeholder)
    // ============================================
    
    function showMemberProfile(member) {
        showNotification(`Viewing profile of ${member.name}. Full profiles are available only to Supreme Council members.`, 'info');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Make clearFilters available globally for the no-results button
    window.clearFilters = function() {
        currentCircleFilter = 'all';
        currentSpecFilter = 'all';
        searchQuery = '';
        memberSearch.value = '';
        filterMembers();
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Initial render
    filterMembers();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Add some ambient animations
    function addAmbientAnimations() {
        // Randomly flicker the gaslight effect
        setInterval(() => {
            const ambient = document.querySelector('.gaslight-ambient');
            if (ambient) {
                const intensity = 0.5 + Math.random() * 0.5;
                ambient.style.opacity = intensity;
            }
        }, 3000);
        
        // Randomly move the vignette slightly
        setInterval(() => {
            const vignette = document.querySelector('.vignette-overlay');
            if (vignette) {
                const x = Math.random() * 20 - 10;
                const y = Math.random() * 20 - 10;
                vignette.style.transform = `translate(${x}px, ${y}px)`;
            }
        }, 5000);
    }
    
    addAmbientAnimations();
    
    // Easter egg: Konami code for secret message
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('You have discovered the secret ritual. The Grand Ritual of Samhain will commence at midnight on October 31st. Your presence is mandatory.', 'warning');
            konamiCode = [];
        }
    });
    
    // Add hover sound effects to buttons (optional, commented out to avoid autoplay issues)
    /*
    const hoverSound = new Audio('data:audio/wav;base64,UklGRl9vT19...'); // Would need actual base64
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        });
    });
    */
});