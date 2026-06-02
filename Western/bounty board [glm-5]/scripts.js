document.addEventListener('DOMContentLoaded', function() {
    const outlawData = {
        1: {
            name: 'Silas "Blackjack" Morrow',
            alias: 'Blackjack',
            age: 34,
            height: "6'1\"",
            weight: '180 lbs',
            hair: 'Black',
            eyes: 'Brown',
            crimes: ['Armed Robbery', 'First Degree Murder', 'Assault with Deadly Weapon', 'Horse Theft'],
            lastSeen: 'Dodge City, Kansas',
            reward: '$5,000',
            notes: 'Known to frequent saloons and gambling halls. Extremely dangerous - do not approach alone. Suspected of killing three lawmen. Has a distinctive scar across left cheek from a knife fight in Abilene.',
            associates: 'Unknown gang of 4-5 men',
            weapons: 'Colt Peacemaker, Winchester Rifle'
        },
        2: {
            name: 'Jack "Cactus" Dalton',
            alias: 'Cactus Jack',
            age: 29,
            height: "5'10\"",
            weight: '165 lbs',
            hair: 'Sandy',
            eyes: 'Blue',
            crimes: ['Cattle Rustling', 'Aggravated Assault', 'Fraud', 'Evading Arrest'],
            lastSeen: 'Abilene Trail',
            reward: '$3,500',
            notes: 'Former cowboy turned outlaw. Known to hide in canyons and abandoned mines. Often travels with a pack of wild dogs. Has family in Texas - may return there.',
            associates: 'Lone operator, sometimes hires help',
            weapons: 'Double-barrel shotgun, Bowie knife'
        },
        3: {
            name: 'Belle "Crimson" Star',
            alias: 'Crimson Belle',
            age: 28,
            height: "5'6\"",
            weight: '130 lbs',
            hair: 'Red',
            eyes: 'Green',
            crimes: ['Train Robbery', 'Horse Theft', 'Forgery', 'Jailbreak'],
            lastSeen: 'Tucson, Arizona',
            reward: '$7,500',
            notes: 'Highly intelligent and cunning. Uses disguises and false identities. Known to charm her way into places before robbing them. Never without a hidden derringer. Considered extremely dangerous despite appearance.',
            associates: 'The Starlight Gang (6 members)',
            weapons: 'Derringer, hidden knife, poison'
        },
        4: {
            name: 'Peter "Rattlesnake" Morrison',
            alias: 'Rattlesnake Pete',
            age: 41,
            height: "5'8\"",
            weight: '150 lbs',
            hair: 'Gray',
            eyes: 'Hazel',
            crimes: ['Bank Fraud', 'Forgery', 'Embezzlement', 'Conspiracy'],
            lastSeen: 'Denver, Colorado',
            reward: '$2,000',
            notes: 'Former bank clerk with knowledge of financial systems. Not violent but highly elusive. Has contacts throughout the banking industry. May be traveling under assumed identity.',
            associates: 'Unknown financial network',
            weapons: 'Small pistol (rarely armed)'
        },
        5: {
            name: 'Vance "The Gravedigger" Holt',
            alias: 'The Gravedigger',
            age: 42,
            height: "6'4\"",
            weight: '220 lbs',
            hair: 'Bald',
            eyes: 'Dark Brown',
            crimes: ['Mass Murder', 'Arson', 'Assault', 'Terrorism', 'Escaping Federal Custody'],
            lastSeen: 'Unknown',
            reward: '$10,000',
            notes: 'Most dangerous outlaw in the territory. Burned down an entire settlement, killing 23 men, women, and children. Former soldier. Has military training and shows no remorse. Shoot on sight authorized.',
            associates: 'Lone wolf, feared by other outlaws',
            weapons: 'Military revolver, explosives, knives'
        },
        6: {
            name: 'Jim "Whisper" Hawkins',
            alias: 'Whisper',
            age: 25,
            height: "5'7\"",
            weight: '140 lbs',
            hair: 'Brown',
            eyes: 'Gray',
            crimes: ['Pickpocketing', 'Escape from Custody', 'Petty Theft', 'Trespassing'],
            lastSeen: 'Santa Fe, New Mexico',
            reward: '$1,500',
            notes: 'Young and nimble. Known for escaping from locked cells. Not considered dangerous but slippery. May have information on bigger criminals. Reward offered for information leading to capture.',
            associates: 'Street informants and thieves',
            weapons: 'None known'
        }
    };

    const dustParticlesContainer = document.getElementById('dustParticles');
    const particleCount = 40;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        particle.style.left = Math.random() * -100 + 'px';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        dustParticlesContainer.appendChild(particle);
        particles.push(particle);
    }

    function animateParticles() {
        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            if (rect.left > window.innerWidth) {
                particle.style.left = Math.random() * -50 + 'px';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            }
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const tumbleweed = document.getElementById('tumbleweed');
    tumbleweed.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#5c4a3a" stroke-width="3" opacity="0.7"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="#5c4a3a" stroke-width="2" opacity="0.5"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="#5c4a3a" stroke-width="2" opacity="0.3"/>
            <line x1="15" y1="50" x2="85" y2="50" stroke="#5c4a3a" stroke-width="1.5" opacity="0.6"/>
            <line x1="50" y1="15" x2="50" y2="85" stroke="#5c4a3a" stroke-width="1.5" opacity="0.6"/>
            <line x1="25" y1="25" x2="75" y2="75" stroke="#5c4a3a" stroke-width="1" opacity="0.4"/>
            <line x1="75" y1="25" x2="25" y2="75" stroke="#5c4a3a" stroke-width="1" opacity="0.4"/>
        </svg>
    `;

    tumbleweed.style.opacity = '0.7';

    function createWindGust() {
        const gust = document.createElement('div');
        gust.style.cssText = `
            position: fixed;
            bottom: ${Math.random() * 30}%;
            left: -200px;
            width: 150px;
            height: 30px;
            background: linear-gradient(90deg, transparent, rgba(200, 180, 140, 0.3), transparent);
            pointer-events: none;
            z-index: 998;
            border-radius: 50%;
            animation: windGust 3s linear forwards;
        `;
        document.body.appendChild(gust);
        setTimeout(() => gust.remove(), 3000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes windGust {
            0% { transform: translateX(0) scaleX(1); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.3; }
            100% { transform: translateX(calc(100vw + 200px)) scaleX(2); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    setInterval(createWindGust, 5000);

    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            setTimeout(() => {
                targetSection.style.transition = 'all 0.5s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 100);
        });
    });

    const sortSelect = document.getElementById('sortBounty');
    const wantedGrid = document.getElementById('wantedGrid');

    sortSelect.addEventListener('change', function() {
        const posters = Array.from(wantedGrid.querySelectorAll('.wanted-poster'));
        const sortValue = this.value;

        posters.sort((a, b) => {
            switch(sortValue) {
                case 'reward-desc':
                    return parseInt(b.dataset.reward) - parseInt(a.dataset.reward);
                case 'reward-asc':
                    return parseInt(a.dataset.reward) - parseInt(b.dataset.reward);
                case 'name':
                    return a.dataset.name.localeCompare(b.dataset.name);
                case 'danger':
                    return parseInt(b.dataset.danger) - parseInt(a.dataset.danger);
                default:
                    return 0;
            }
        });

        wantedGrid.style.opacity = '0';
        wantedGrid.style.transform = 'scale(0.98)';

        setTimeout(() => {
            posters.forEach(poster => wantedGrid.appendChild(poster));
            wantedGrid.style.transition = 'all 0.4s ease';
            wantedGrid.style.opacity = '1';
            wantedGrid.style.transform = 'scale(1)';
        }, 200);
    });

    const profileModal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.view-profile-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const outlawId = this.dataset.id;
            const outlaw = outlawData[outlawId];

            if (outlaw) {
                modalBody.innerHTML = `
                    <div class="profile-header">
                        <h3>${outlaw.name}</h3>
                        <span class="alias">Alias: "${outlaw.alias}"</span>
                    </div>
                    <div class="profile-section">
                        <h4>Physical Description</h4>
                        <div class="profile-details">
                            <div class="detail-item">
                                <span class="detail-label">Age</span>
                                <span class="detail-value">${outlaw.age}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Height</span>
                                <span class="detail-value">${outlaw.height}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Weight</span>
                                <span class="detail-value">${outlaw.weight}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Hair</span>
                                <span class="detail-value">${outlaw.hair}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Eyes</span>
                                <span class="detail-value">${outlaw.eyes}</span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-section">
                        <h4>Known Crimes</h4>
                        <ul class="crime-list">
                            ${outlaw.crimes.map(crime => `<li>${crime}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="profile-section">
                        <h4>Additional Details</h4>
                        <p><strong>Last Seen:</strong> ${outlaw.lastSeen}</p>
                        <p><strong>Known Associates:</strong> ${outlaw.associates}</p>
                        <p><strong>Known Weapons:</strong> ${outlaw.weapons}</p>
                    </div>
                    <div class="profile-section">
                        <h4>Lawmen's Notes</h4>
                        <p>${outlaw.notes}</p>
                    </div>
                    <div class="profile-section" style="text-align: center; padding-top: 20px; border-top: 3px double #b89f72;">
                        <p style="font-family: 'Special Elite', monospace; font-size: 0.9rem; color: #8b2500;">REWARD: ${outlaw.reward}</p>
                    </div>
                `;
                profileModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modalClose.addEventListener('click', function() {
        profileModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    profileModal.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    const claimModal = document.getElementById('claimModal');
    const claimModalBody = document.getElementById('claimModalBody');
    const claimModalClose = document.getElementById('claimModalClose');

    document.querySelectorAll('.claim-bounty-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const outlawId = this.dataset.id;
            const outlaw = outlawData[outlawId];

            if (outlaw) {
                claimModalBody.innerHTML = `
                    <div class="claim-header">
                        <h3>Bounty Claim Form</h3>
                        <p class="claim-outlaw-name">${outlaw.name}</p>
                    </div>
                    <div class="claim-reward">
                        <span class="claim-reward-label">REWARD AMOUNT</span>
                        <span class="claim-reward-amount">${outlaw.reward}</span>
                    </div>
                    <form class="claim-form" id="claimForm">
                        <div class="form-group">
                            <label for="bountyHunterName">Bounty Hunter Name</label>
                            <input type="text" id="bountyHunterName" name="bountyHunterName" required placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label for="bountyHunterAddress">Current Address</label>
                            <input type="text" id="bountyHunterAddress" name="bountyHunterAddress" required placeholder="Town, Territory">
                        </div>
                        <div class="form-group">
                            <label for="captureDetails">Details of Capture</label>
                            <textarea id="captureDetails" name="captureDetails" required placeholder="Describe the circumstances of the capture..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="witnesses">Witnesses (if any)</label>
                            <input type="text" id="witnesses" name="witnesses" placeholder="Names of any witnesses">
                        </div>
                        <button type="submit" class="submit-claim-btn">Submit Claim</button>
                    </form>
                    <p class="claim-warning">Warning: False claims are punishable by law. All claims are investigated before payment.</p>
                `;
                claimModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                const claimForm = document.getElementById('claimForm');
                claimForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(claimForm);
                    const hunterName = formData.get('bountyHunterName');
                    
                    claimModalBody.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px;">
                            <div style="font-size: 4rem; margin-bottom: 20px;">✓</div>
                            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #2c1810; margin-bottom: 15px;">Claim Submitted</h3>
                            <p style="font-family: 'Special Elite', monospace; font-size: 1rem; color: #4a3728; margin-bottom: 25px;">
                                Thank you, ${hunterName}. Your bounty claim has been recorded.<br>
                                Present yourself to the Sheriff's Office within 48 hours<br>
                                with the captured outlaw to receive payment.
                            </p>
                            <div style="padding: 20px; background: rgba(255, 215, 0, 0.15); border: 2px dashed #c9a227; border-radius: 8px; margin-bottom: 20px;">
                                <p style="font-family: 'Special Elite', monospace; font-size: 0.85rem; color: #4a3728;">
                                    Claim Reference: #${Date.now().toString().slice(-6)}<br>
                                    Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <button onclick="claimModal.classList.remove('active'); document.body.style.overflow = '';" 
                                    style="padding: 12px 30px; font-family: 'Special Elite', monospace; font-size: 1rem; background: #3d2914; color: #f4e4c1; border: 2px solid #8b7355; border-radius: 4px; cursor: pointer; box-shadow: 3px 3px 0 #5c4a3a;">
                                Close
                            </button>
                        </div>
                    `;
                });
            }
        });
    });

    claimModalClose.addEventListener('click', function() {
        claimModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    claimModal.addEventListener('click', function(e) {
        if (e.target === claimModal) {
            claimModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (profileModal.classList.contains('active')) {
                profileModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (claimModal.classList.contains('active')) {
                claimModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(poster => {
        poster.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        poster.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });

        poster.addEventListener('click', function() {
            const outlawId = this.dataset.id;
            const viewBtn = this.querySelector('.view-profile-btn');
            if (viewBtn) {
                viewBtn.click();
            }
        });
    });

    function updateTierCounts() {
        const posters = document.querySelectorAll('.wanted-poster');
        let platinum = 0, gold = 0, silver = 0, bronze = 0;

        posters.forEach(poster => {
            const reward = parseInt(poster.dataset.reward);
            if (reward >= 10000) platinum++;
            else if (reward >= 5000) gold++;
            else if (reward >= 2000) silver++;
            else bronze++;
        });

        const tierCounts = document.querySelectorAll('.tier-count');
        if (tierCounts.length >= 4) {
            tierCounts[0].textContent = platinum;
            tierCounts[1].textContent = gold;
            tierCounts[2].textContent = silver;
            tierCounts[3].textContent = bronze;
        }
    }

    updateTierCounts();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 100);

    const dispatchEntries = document.querySelectorAll('.dispatch-entry');
    dispatchEntries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        entry.style.transitionDelay = (index * 0.1) + 's';
    });

    const dispatchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dispatchEntries.forEach((entry, index) => {
                    setTimeout(() => {
                        entry.style.opacity = '1';
                        entry.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });

    const dispatchSection = document.getElementById('dispatch');
    if (dispatchSection) {
        dispatchObserver.observe(dispatchSection);
    }

    console.log('🌾 Frontier Justice Bounty Board loaded successfully');
    console.log('📜 ' + posters.length + ' wanted posters displayed');
    console.log('🔫 Justice awaits the brave');
});