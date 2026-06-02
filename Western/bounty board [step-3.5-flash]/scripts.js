document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CORE COMPONENTS
    // ============================================
    
    // DOM Elements
    const dustOverlay = document.getElementById('dustOverlay');
    const tumbleweedContainer = document.getElementById('tumbleweedContainer');
    const saloonDoors = document.getElementById('saloonDoors');
    const revolverNav = document.getElementById('revolverNav');
    const cylinder = document.getElementById('cylinder');
    const hammer = document.getElementById('hammer');
    const chambers = document.querySelectorAll('.chamber');
    const contentSections = document.querySelectorAll('.content-section');
    const wantedPosters = document.querySelectorAll('.wanted-poster');
    const profileModal = document.getElementById('profileModal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.querySelector('.modal-content');
    
    // Outlaw Profiles Data
    const outlawProfiles = {
        'black-bart': {
            name: 'Black Bart',
            realName: 'Charles E. Boles',
            alias: '"The Gentleman Bandit"',
            photo: 'linear-gradient(135deg, #8B7355 0%, #5D4E37 100%)',
            stats: {
                age: '42',
                height: "6'2\"",
                wantedSince: '1878',
                bounty: '$5,000'
            },
            bio: `Black Bart was a Wells Fargo stagecoach robber who operated in Northern California and southern Oregon. Despite his criminal activities, he was known for his politeness and his poetry, which he sometimes left behind after robberies. He was last seen near the Sacramento Trail and is believed to be hiding in the Sierra Nevada foothills.`,
            notes: `Known to wear a long black overcoat, derby hat, and carry a sawed-off shotgun. Leaves poems at crime scenes. Non-violent unless cornered.`,
            crimes: ['Stagecoach Robbery', 'Murder', 'Assault'],
            lastSeen: 'Sacramento Trail',
            gang: 'None (Solo Operator)'
        },
        'lily-langtry': {
            name: 'Lily Langtry',
            realName: 'Unknown (Alias)',
            alias: '"The Crimson Rose"',
            photo: 'linear-gradient(135deg, #9B8A7A 0%, #6B5B4B 100%)',
            stats: {
                age: '28',
                height: "5'7\"",
                wantedSince: '1885',
                bounty: '$7,500'
            },
            bio: `Lily Langtry is a cunning and charismatic outlaw known for using her charm to rob banks and stagecoaches across Arizona Territory. She leads a gang of female outlaws called the "Crimson Roses." Last spotted in Tombstone, Arizona. Believed to have connections with the Cochise County Sheriff's Office through bribery.`,
            notes: `Extremely dangerous. Uses poisoned knives and derringer pistols. Always travels with 2-3 female accomplices. Reward increased for information leading to arrest.`,
            crimes: ['Bank Heist', 'Conspiracy', 'Murder'],
            lastSeen: 'Tombstone, Arizona',
            gang: 'The Crimson Roses'
        },
        'dutch-meyer': {
            name: 'Dutch Meyer',
            realName: 'Herman "Dutch" Meyer',
            alias: '"The Snake"',
            photo: 'linear-gradient(135deg, #7A6B5A 0%, #4B3E2F 100%)',
            stats: {
                age: '35',
                height: "5'10\"",
                wantedSince: '1886',
                bounty: '$3,000'
            },
            bio: `Dutch Meyer is a ruthless cattle rustler and occasional stagecoach robber. Known for his cold demeanor and quick draw. Operates primarily in the Dusty Gulch area with a small gang of cutthroats. Responsible for at least 12 confirmed deaths.`,
            notes: `Carries twin Colt Peacemakers. Known to shoot first and ask questions never. Has a distinctive scar across his left cheek from a bar fight in Abilene.`,
            crimes: ['Cattle Rustling', 'Murder', 'Armed Robbery'],
            lastSeen: 'Dusty Gulch',
            gang: 'Meyer\'s Marauders'
        },
        'kid-curry': {
            name: 'Kid Curry',
            realName: 'Harvey Logan',
            alias: '"The Devil\'s Own"',
            photo: 'linear-gradient(135deg, #8A7B6A 0%, #5A4D3C 100%)',
            stats: {
                age: '31',
                height: "5'6\"",
                wantedSince: '1883',
                bounty: '$10,000'
            },
            bio: `Kid Curry is arguably the most dangerous outlaw in the territory. A member of Butch Cassidy's Wild Bunch, he's responsible for more lawmen deaths than any other outlaw. A crack shot with both pistol and rifle, he's been shot multiple times but always recovers. Last seen heading toward Rattlesnake Ridge with a large posse in pursuit.`,
            notes: `Extremely volatile. Will kill without hesitation. Carries two .45 Colt Peacemakers and a Winchester lever-action. Has a $10,000 dead or alive bounty - the highest in the territory.`,
            crimes: ['Train Robbery', 'Killing Deputy', 'Murder', 'Bank Robbery'],
            lastSeen: 'Rattlesnake Ridge',
            gang: 'Wild Bunch'
        }
    };

    // Current active section
    let currentSection = 'wanted';
    let isAnimating = false;

    // ============================================
    // REVOLVER NAVIGATION SYSTEM
    // ============================================
    
    const sectionMap = {
        'bounties': 0,
        'rewards': 1,
        'outlaws': 2,
        'dispatch': 3,
        'wanted': 4
    };

    const reverseSectionMap = {
        0: 'bounties',
        1: 'rewards',
        2: 'outlaws',
        3: 'dispatch',
        4: 'wanted'
    };

    function spinCylinder(targetChamber) {
        if (isAnimating) return;
        isAnimating = true;

        const targetRotation = -targetChamber * 72; // 360/5 = 72 degrees per chamber
        
        // Add hammer animation
        hammer.style.animation = 'hammer-cock 0.3s ease';
        setTimeout(() => {
            hammer.style.animation = '';
        }, 300);

        cylinder.style.transform = `rotate(${targetRotation}deg)`;
        
        // Update active chamber visual
        chambers.forEach((chamber, index) => {
            chamber.classList.toggle('active', index === targetChamber);
        });

        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }

    function navigateToSection(sectionId) {
        if (isAnimating || sectionId === currentSection) return;

        // Show saloon doors
        saloonDoors.classList.add('active');
        saloonDoors.classList.add('open');

        setTimeout(() => {
            // Switch sections while doors are open
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            currentSection = sectionId;

            // Update cylinder position
            const chamberIndex = sectionMap[sectionId];
            spinCylinder(chamberIndex);

            // Close saloon doors
            saloonDoors.classList.remove('open');
            
            setTimeout(() => {
                saloonDoors.classList.remove('active');
            }, 1000);
        }, 600);
    }

    // Chamber click handlers
    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            const sectionId = reverseSectionMap[index];
            navigateToSection(sectionId);
        });
    });

    // Hammer click - random navigation
    hammer.addEventListener('click', () => {
        if (isAnimating) return;
        
        const sections = Object.keys(sectionMap);
        const randomSection = sections[Math.floor(Math.random() * sections.length)];
        navigateToSection(randomSection);
    });

    // ============================================
    // TUMBLEWEED ANIMATION
    // ============================================
    
    function createTumbleweed() {
        const tumbleweed = document.createElement('div');
        tumbleweed.className = 'tumbleweed';
        
        // Random starting position and size
        const startX = Math.random() * window.innerWidth;
        const size = 40 + Math.random() * 40;
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 10;
        
        tumbleweed.style.cssText = `
            left: ${startX}px;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        tumbleweedContainer.appendChild(tumbleweed);
        
        // Remove after animation completes
        setTimeout(() => {
            if (tumbleweed.parentNode) {
                tumbleweed.parentNode.removeChild(tumbleweed);
            }
        }, (duration + delay) * 1000);
    }

    // Create tumbleweeds periodically
    function startTumbleweedAnimation() {
        // Initial tumbleweeds
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createTumbleweed(), i * 2000);
        }
        
        // Continue creating tumbleweeds
        setInterval(createTumbleweed, 8000);
    }

    // ============================================
    // DUST PARTICLE SYSTEM
    // ============================================
    
    function createDustParticle() {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        const size = 2 + Math.random() * 4;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: ${startY}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        dustOverlay.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }

    function startDustAnimation() {
        // Create initial batch
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createDustParticle(), i * 300);
        }
        
        // Continue creating dust
        setInterval(createDustParticle, 500);
    }

    // ============================================
    // WANTED POSTER INTERACTIONS
    // ============================================
    
    wantedPosters.forEach(poster => {
        poster.addEventListener('click', () => {
            const outlawId = poster.dataset.outlaw;
            if (outlawProfiles[outlawId]) {
                openProfileModal(outlawId);
            }
        });
        
        // Add keyboard accessibility
        poster.setAttribute('tabindex', '0');
        poster.setAttribute('role', 'button');
        poster.setAttribute('aria-label', `View ${poster.querySelector('.outlaw-name').textContent} profile`);
        
        poster.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const outlawId = poster.dataset.outlaw;
                if (outlawProfiles[outlawId]) {
                    openProfileModal(outlawId);
                }
            }
        });
    });

    // ============================================
    // PROFILE MODAL
    // ============================================
    
    function openProfileModal(outlawId) {
        const profile = outlawProfiles[outlawId];
        if (!profile) return;

        // Build modal content
        modalContent.innerHTML = `
            <div class="modal-profile-header">
                <div class="modal-photo" style="background: ${profile.photo};">
                    <i class="fas fa-user-secret"></i>
                </div>
                <div class="modal-header-info">
                    <h2>${profile.name}</h2>
                    <p class="modal-real-name">${profile.realName}</p>
                    <p class="modal-alias">${profile.alias}</p>
                    <div class="modal-bounty">
                        <span class="bounty-label">BOUNTY</span>
                        <span class="bounty-amount">${profile.stats.bounty}</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="modal-stats-grid">
                    <div class="modal-stat">
                        <span class="stat-label">Age</span>
                        <span class="stat-value">${profile.stats.age}</span>
                    </div>
                    <div class="modal-stat">
                        <span class="stat-label">Height</span>
                        <span class="stat-value">${profile.stats.height}</span>
                    </div>
                    <div class="modal-stat">
                        <span class="stat-label">Wanted Since</span>
                        <span class="stat-value">${profile.stats.wantedSince}</span>
                    </div>
                    <div class="modal-stat">
                        <span class="stat-label">Gang</span>
                        <span class="stat-value">${profile.gang}</span>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-book"></i> Criminal Record</h3>
                    <div class="crimes-list">
                        ${profile.crimes.map(crime => `<span class="crime-tag">${crime}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Last Known Location</h3>
                    <p>${profile.lastSeen}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-file-alt"></i> Sheriff's Bio</h3>
                    <p>${profile.bio}</p>
                </div>
                
                <div class="modal-section sheriff-notes">
                    <h3><i class="fas fa-clipboard-check"></i> Sheriff's Notes</h3>
                    <p>${profile.notes}</p>
                </div>
            </div>
            
            <div class="modal-footer">
                <div class="warning-stamp">
                    <i class="fas fa-exclamation-triangle"></i>
                    ARMED AND DANGEROUS
                </div>
                <div class="modal-id">File #${outlawId.split('-')[0].toUpperCase()}-${profile.stats.wantedSince}</div>
            </div>
        `;

        // Show modal with animation
        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProfileModal() {
        profileModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeProfileModal);

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal || e.target.classList.contains('modal-overlay')) {
            closeProfileModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.classList.contains('active')) {
            closeProfileModal();
        }
    });

    // ============================================
    // ADDITIONAL INTERACTIONS & EFFECTS
    // ============================================
    
    // Add CSS for hammer animation and modal styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes hammer-cock {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(-30deg); }
            100% { transform: rotate(0deg); }
        }
        
        .modal-profile-header {
            display: flex;
            gap: 30px;
            padding: 30px;
            background: rgba(139, 107, 76, 0.1);
            border-bottom: 3px double var(--rope);
        }
        
        .modal-photo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 6px solid var(--gold-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px var(--shadow-medium);
            flex-shrink: 0;
        }
        
        .modal-photo i {
            font-size: 3rem;
            color: var(--parchment);
            opacity: 0.6;
        }
        
        .modal-header-info {
            flex: 1;
        }
        
        .modal-header-info h2 {
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--ink);
            margin-bottom: 5px;
        }
        
        .modal-real-name {
            font-family: var(--font-mono);
            color: var(--ink-faded);
            margin-bottom: 5px;
        }
        
        .modal-alias {
            font-family: var(--font-handwritten);
            color: var(--rust);
            font-size: 1.2rem;
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .modal-bounty {
            background: var(--blood-red);
            color: var(--parchment);
            padding: 10px 20px;
            border-radius: 4px;
            display: inline-block;
            border: 2px solid var(--gold);
        }
        
        .bounty-label {
            display: block;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            letter-spacing: 2px;
        }
        
        .bounty-amount {
            font-family: var(--font-display);
            font-size: 1.5rem;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .modal-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .modal-stat {
            background: rgba(139, 107, 76, 0.15);
            padding: 15px;
            border-radius: 4px;
            border: 1px solid var(--rope);
            text-align: center;
        }
        
        .modal-stat .stat-label {
            display: block;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--ink-faded);
            margin-bottom: 5px;
        }
        
        .modal-stat .stat-value {
            font-family: var(--font-display);
            font-size: 1.1rem;
            color: var(--ink);
        }
        
        .modal-section {
            margin-bottom: 25px;
        }
        
        .modal-section h3 {
            font-family: var(--font-display);
            color: var(--blood-red);
            font-size: 1.3rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .crimes-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .crime-tag {
            background: rgba(139, 0, 0, 0.1);
            color: var(--blood-red);
            padding: 5px 12px;
            border-radius: 20px;
            font-family: var(--font-mono);
            font-size: 0.85rem;
            border: 1px solid rgba(139, 0, 0, 0.3);
        }
        
        .sheriff-notes {
            background: rgba(139, 107, 76, 0.2);
            padding: 20px;
            border-left: 4px solid var(--blood-red);
            border-radius: 4px;
        }
        
        .modal-footer {
            padding: 20px 30px;
            background: rgba(139, 107, 76, 0.1);
            border-top: 3px double var(--rope);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .warning-stamp {
            font-family: var(--font-display);
            color: var(--blood-red);
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 2px;
        }
        
        .modal-id {
            font-family: var(--font-mono);
            color: var(--ink-faded);
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .modal-profile-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .modal-stats-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // PARALLAX EFFECT ON SCROLL
    // ============================================
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.board-header, .dispatch-paper');
                
                parallaxElements.forEach(el => {
                    const speed = el.classList.contains('board-header') ? 0.3 : 0.1;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR DISPATCH ENTRIES
    // ============================================
    
    const dispatchEntries = document.querySelectorAll('.dispatch-entry');
    dispatchEntries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        entry.style.transition = 'all 0.5s ease';
        
        // Staggered animation on load
        setTimeout(() => {
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        }, index * 100);
    });

    // ============================================
    // POSTER HOVER SOUND EFFECT (OPTIONAL)
    // ============================================
    
    // Create audio context for subtle creaking sounds
    let audioContext = null;
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    function playCreakSound() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Add subtle creak on poster hover
    wantedPosters.forEach(poster => {
        poster.addEventListener('mouseenter', () => {
            if (Math.random() > 0.7) { // Only sometimes for subtlety
                initAudio();
                playCreakSound();
            }
        });
    });

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    
    // Start environmental animations
    startTumbleweedAnimation();
    startDustAnimation();

    // Set initial active chamber
    spinCylinder(sectionMap[currentSection]);

    // Add some randomness to initial state
    console.log('%c🤠 Deadwood Bounty Board Loaded', 
                'color: #8B4513; font-size: 20px; font-weight: bold;');
    console.log('%cSheriff Clayborne is watching...', 
                'color: #5C3D1E; font-style: italic;');

    // Easter egg: Konami code for special effect
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Trigger special effect: all tumbleweeds at once!
                for (let i = 0; i < 10; i++) {
                    setTimeout(createTumbleweed, i * 200);
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});