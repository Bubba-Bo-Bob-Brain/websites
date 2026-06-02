/* ============================================
   DUSTY GULCH BOUNTY BOARD - JAVASCRIPT
   Immersive Old West Interactions
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤠 Dusty Gulch Bounty Board - Ready for Action!');
    
    // ============================================
    // INITIALIZATION
    // ============================================
    initBoard();
    
    // ============================================
    // MAIN INITIALIZATION FUNCTION
    // ============================================
    function initBoard() {
        // Initialize all components
        initSaloonDoors();
        initRevolverNav();
        initPosterCarousel();
        initDispatchLog();
        initRewardTiers();
        initDustEffects();
        initTumbleweed();
        initInteractiveEffects();
        
        // Play ambient sound (simulated)
        playAmbientSounds();
        
        // Add welcome message to dispatch log
        setTimeout(() => {
            addWelcomeDispatch();
        }, 1000);
    }
    
    // ============================================
    // SALOON DOORS INTERACTION
    // ============================================
    function initSaloonDoors() {
        const saloonDoors = document.querySelector('.saloon-doors');
        const leftDoor = document.querySelector('.left-door');
        const rightDoor = document.querySelector('.right-door');
        let isOpen = false;
        
        // Click to open/close doors
        saloonDoors.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isOpen) {
                // Close doors
                leftDoor.style.transform = 'rotateY(0deg)';
                rightDoor.style.transform = 'rotateY(0deg)';
                playDoorSound('close');
            } else {
                // Open doors
                leftDoor.style.transform = 'rotateY(-45deg)';
                rightDoor.style.transform = 'rotateY(45deg)';
                playDoorSound('open');
                
                // Add bullet hole effect randomly
                if (Math.random() > 0.7) {
                    addRandomBulletHole();
                }
            }
            
            isOpen = !isOpen;
        });
        
        // Door swinging sound effect
        function playDoorSound(action) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (action === 'open') {
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
            } else {
                oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.5);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        }
        
        // Add random bullet holes to header
        function addRandomBulletHole() {
            const headerDecoration = document.querySelector('.header-decoration');
            if (!headerDecoration) return;
            
            const bulletHole = document.createElement('div');
            bulletHole.className = 'bullet-hole';
            bulletHole.style.position = 'absolute';
            bulletHole.style.left = `${Math.random() * 80 + 10}%`;
            bulletHole.style.top = `${Math.random() * 80 + 10}%`;
            bulletHole.style.width = '8px';
            bulletHole.style.height = '8px';
            bulletHole.style.backgroundColor = 'transparent';
            bulletHole.style.background = 'radial-gradient(circle, #333 2px, transparent 3px)';
            bulletHole.style.borderRadius = '50%';
            bulletHole.style.zIndex = '10';
            
            headerDecoration.appendChild(bulletHole);
            
            // Remove after some time
            setTimeout(() => {
                bulletHole.style.opacity = '0';
                bulletHole.style.transition = 'opacity 2s';
                setTimeout(() => {
                    if (bulletHole.parentNode) {
                        bulletHole.parentNode.removeChild(bulletHole);
                    }
                }, 2000);
            }, 3000);
        }
    }
    
    // ============================================
    // REVOLVER NAVIGATION SYSTEM
    // ============================================
    function initRevolverNav() {
        const chambers = document.querySelectorAll('.cylinder-chamber');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentChamber = 0;
        
        // Initialize chambers
        chambers.forEach((chamber, index) => {
            chamber.addEventListener('click', () => {
                selectChamber(index);
            });
        });
        
        // Previous button
        prevBtn.addEventListener('click', () => {
            currentChamber = (currentChamber - 1 + chambers.length) % chambers.length;
            selectChamber(currentChamber);
            playRevolverClick();
        });
        
        // Next button
        nextBtn.addEventListener('click', () => {
            currentChamber = (currentChamber + 1) % chambers.length;
            selectChamber(currentChamber);
            playRevolverClick();
        });
        
        // Select chamber function
        function selectChamber(index) {
            // Remove active class from all chambers
            chambers.forEach(chamber => {
                chamber.classList.remove('active');
            });
            
            // Add active class to selected chamber
            chambers[index].classList.add('active');
            
            // Update poster display
            updatePosterDisplay(index);
            
            // Update current chamber
            currentChamber = index;
            
            // Add firing effect randomly
            if (Math.random() > 0.8) {
                addRevolverFireEffect();
            }
        }
        
        // Play revolver click sound
        function playRevolverClick() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
        
        // Add firing effect
        function addRevolverFireEffect() {
            const revolverNav = document.querySelector('.revolver-nav');
            const flash = document.createElement('div');
            
            flash.style.position = 'absolute';
            flash.style.top = '50%';
            flash.style.left = '50%';
            flash.style.transform = 'translate(-50%, -50%)';
            flash.style.width = '100px';
            flash.style.height = '100px';
            flash.style.background = 'radial-gradient(circle, rgba(255,200,0,0.8) 0%, rgba(255,100,0,0.6) 30%, transparent 70%)';
            flash.style.borderRadius = '50%';
            flash.style.zIndex = '100';
            flash.style.pointerEvents = 'none';
            flash.style.opacity = '0';
            
            revolverNav.appendChild(flash);
            
            // Animate flash
            flash.animate([
                { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
                { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            
            // Remove after animation
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 500);
            
            // Play gunshot sound
            playGunshotSound();
        }
        
        // Play gunshot sound
        function playGunshotSound() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create multiple oscillators for realistic gunshot
            for (let i = 0; i < 3; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Different frequencies for each oscillator
                oscillator.frequency.setValueAtTime(100 + (i * 50), audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
                
                // Different gain envelope for each
                gainNode.gain.setValueAtTime(0.1 * (1 - i * 0.3), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1 + i * 0.05);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            }
        }
    }
    
    // ============================================
    // WANTED POSTER CAROUSEL
    // ============================================
    function initPosterCarousel() {
        const posters = document.querySelectorAll('.poster-card');
        const claimBtn = document.querySelector('.claim-btn');
        const infoBtn = document.querySelector('.info-btn');
        
        // Initialize poster positions
        posters.forEach((poster, index) => {
            if (index > 0) {
                poster.style.opacity = '0';
                poster.style.visibility = 'hidden';
            }
        });
        
        // Claim bounty button
        claimBtn.addEventListener('click', function() {
            const activePoster = document.querySelector('.poster-card.active');
            const outlawName = activePoster.querySelector('.poster-title').textContent;
            
            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show confirmation
            showBountyClaimModal(outlawName);
            
            // Add to dispatch log
            addBountyClaimDispatch(outlawName);
        });
        
        // More info button
        infoBtn.addEventListener('click', function() {
            const activePoster = document.querySelector('.poster-card.active');
            const outlawName = activePoster.querySelector('.poster-title').textContent;
            const rewardAmount = activePoster.querySelector('.reward-badge').textContent;
            
            // Show detailed info
            showOutlawDetailsModal(outlawName, rewardAmount);
        });
        
        // Add hover effect to posters
        posters.forEach(poster => {
            poster.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(-50%) translateY(-5px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 0, 0, 0.2) inset';
                
                // Enhance curl effect
                const curl = this.querySelector('.curl-effect');
                if (curl) {
                    curl.style.transform = 'rotate(-5deg)';
                    curl.style.transition = 'transform 0.3s ease';
                }
            });
            
            poster.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(-50%) translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 50px rgba(139, 0, 0, 0.1) inset';
                
                // Reset curl effect
                const curl = this.querySelector('.curl-effect');
                if (curl) {
                    curl.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    // Update poster display based on selected chamber
    function updatePosterDisplay(index) {
        const posters = document.querySelectorAll('.poster-card');
        
        // Hide all posters
        posters.forEach(poster => {
            poster.classList.remove('active');
            poster.style.opacity = '0';
            poster.style.visibility = 'hidden';
            poster.style.zIndex = '1';
        });
        
        // Show selected poster
        if (posters[index]) {
            posters[index].classList.add('active');
            posters[index].style.opacity = '1';
            posters[index].style.visibility = 'visible';
            posters[index].style.zIndex = '2';
            
            // Add entrance animation
            posters[index].animate([
                { transform: 'translateX(-50%) scale(0.9)', opacity: 0 },
                { transform: 'translateX(-50%) scale(1)', opacity: 1 }
            ], {
                duration: 500,
                easing: 'ease-out'
            });
        }
    }
    
    // ============================================
    // SHERIFF'S DISPATCH LOG
    // ============================================
    function initDispatchLog() {
        const addLogBtn = document.querySelector('.add-log-btn');
        const logInput = document.querySelector('.parchment-input');
        const logEntries = document.querySelector('.log-entries');
        
        // Add new log entry
        addLogBtn.addEventListener('click', function() {
            const text = logInput.value.trim();
            
            if (text) {
                addNewLogEntry(text);
                logInput.value = '';
                
                // Animate button
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Play writing sound
                playWritingSound();
            } else {
                // Shake input to indicate error
                logInput.style.animation = 'none';
                setTimeout(() => {
                    logInput.style.animation = 'shake 0.5s ease';
                }, 10);
            }
        });
        
        // Enter key support
        logInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addLogBtn.click();
            }
        });
        
        // Add hover effect to log entries
        document.querySelectorAll('.log-entry').forEach(entry => {
            entry.addEventListener('click', function() {
                this.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    this.style.transform = 'translateX(0)';
                }, 300);
            });
        });
    }
    
    // Add new log entry
    function addNewLogEntry(text) {
        const logEntries = document.querySelector('.log-entries');
        const date = new Date();
        
        // Format date in Old West style
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }) + ' - ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create new entry
        const newEntry = document.createElement('div');
        newEntry.className = 'log-entry new';
        
        newEntry.innerHTML = `
            <div class="log-date">${formattedDate}</div>
            <div class="log-content">${text}</div>
        `;
        
        // Add to top of log
        logEntries.insertBefore(newEntry, logEntries.firstChild);
        
        // Limit to 10 entries
        const allEntries = logEntries.querySelectorAll('.log-entry');
        if (allEntries.length > 10) {
            logEntries.removeChild(allEntries[allEntries.length - 1]);
        }
        
        // Animate entry
        newEntry.animate([
            { opacity: 0, transform: 'translateY(-20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        
        // Remove 'new' class after a while
        setTimeout(() => {
            newEntry.classList.remove('new');
        }, 5000);
    }
    
    // Add welcome message to dispatch log
    function addWelcomeDispatch() {
        const welcomeMessages = [
            "Sheriff Hardstone has arrived at the Dusty Gulch office.",
            "Bounty hunters: Remember to verify targets before claiming rewards.",
            "New Wanted posters arriving daily. Check back often.",
            "Reward payments are made in gold at the Wells Fargo office.",
            "Report any suspicious activity immediately to the Sheriff."
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        addNewLogEntry(randomMessage);
    }
    
    // Add bounty claim to dispatch log
    function addBountyClaimDispatch(outlawName) {
        const messages = [
            `Bounty claim submitted for ${outlawName}. Awaiting verification.`,
            `${outlawName} bounty claim received. Investigation pending.`,
            `Reward for ${outlawName} has been claimed. Verification in progress.`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addNewLogEntry(randomMessage);
    }
    
    // Play writing sound
    function playWritingSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Scratchy quill sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // ============================================
    // REWARD TIERS INTERACTION
    // ============================================
    function initRewardTiers() {
        const tierCards = document.querySelectorAll('.tier-card');
        
        tierCards.forEach(card => {
            // Add click to expand details
            card.addEventListener('click', function() {
                // Toggle expanded state
                this.classList.toggle('expanded');
                
                if (this.classList.contains('expanded')) {
                    // Show more details
                    const description = this.querySelector('.tier-description');
                    const moreDetails = document.createElement('div');
                    moreDetails.className = 'more-details';
                    moreDetails.innerHTML = `
                        <p><strong>Payment Method:</strong> Gold coins or bank draft</p>
                        <p><strong>Verification Required:</strong> Proof of capture or death certificate</p>
                        <p><strong>Time Limit:</strong> 30 days from posting date</p>
                    `;
                    
                    description.appendChild(moreDetails);
                    
                    // Animate expansion
                    this.style.transform = 'translateY(-10px) scale(1.05)';
                } else {
                    // Remove more details
                    const moreDetails = this.querySelector('.more-details');
                    if (moreDetails) {
                        moreDetails.remove();
                    }
                    
                    // Reset animation
                    this.style.transform = 'translateY(-10px)';
                }
            });
            
            // Add coin jingle sound on hover
            card.addEventListener('mouseenter', function() {
                playCoinSound();
            });
        });
    }
    
    // Play coin sound
    function playCoinSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Metallic coin sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    // ============================================
    // ATMOSPHERIC EFFECTS
    // ============================================
    function initDustEffects() {
        // Add dynamic dust particles on mouse move
        document.addEventListener('mousemove', function(e) {
            // Only create particles occasionally
            if (Math.random() > 0.7) {
                createDustParticle(e.clientX, e.clientY);
            }
        });
        
        // Create dust particle
        function createDustParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.backgroundColor = 'rgba(255, 255, 220, 0.6)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const duration = 1000 + Math.random() * 2000;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'ease-out'
            });
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }
    
    function initTumbleweed() {
        // Randomize tumbleweed speed and direction
        const tumbleweed = document.querySelector('.tumbleweed');
        if (tumbleweed) {
            const speed = 30 + Math.random() * 30;
            tumbleweed.style.animationDuration = `${speed}s`;
            
            // Random start delay
            const delay = Math.random() * 10;
            tumbleweed.style.animationDelay = `${delay}s`;
        }
    }
    
    // ============================================
    // INTERACTIVE EFFECTS
    // ============================================
    function initInteractiveEffects() {
        // Add random wood creak sounds
        setInterval(() => {
            if (Math.random() > 0.8) {
                playWoodCreakSound();
            }
        }, 10000);
        
        // Add wind sound occasionally
        setInterval(() => {
            if (Math.random() > 0.9) {
                playWindSound();
            }
        }, 15000);
        
        // Add CSS animation for shake effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Play wood creak sound
    function playWoodCreakSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.6);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    }
    
    // Play wind sound
    function playWindSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 3);
        
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        gainNode.gain.exponentialRampToValueAtTime(0.03, audioContext.currentTime + 1.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 3);
    }
    
    // Play ambient sounds
    function playAmbientSounds() {
        // Start with a distant coyote sound
        setTimeout(() => {
            playCoyoteSound();
        }, 2000);
        
        // Periodic ambient sounds
        setInterval(() => {
            if (Math.random() > 0.7) {
                const sounds = [playCoyoteSound, playHorseSound, playDistantSound];
                const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
                randomSound();
            }
        }, 30000);
    }
    
    // Play coyote sound
    function playCoyoteSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.6);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.8);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    }
    
    // Play horse sound
    function playHorseSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Multiple oscillators for horse sound
        for (let i = 0; i < 2; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150 + i * 20, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(120 + i * 20, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
        }
    }
    
    // Play distant sound
    function playDistantSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    }
    
    // ============================================
    // MODAL WINDOWS
    // ============================================
    function showBountyClaimModal(outlawName) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'bounty-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--burnt-parchment); padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 10px solid transparent; border-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" rx=\"10\" ry=\"10\" fill=\"%23c9a87d\" stroke=\"%238b6b4d\" stroke-width=\"5\"/></svg>') 10 stretch;">
                <h2 style="font-family: var(--font-heading); color: var(--blood-red); margin-bottom: 1rem;">Bounty Claim Submitted</h2>
                <p style="margin-bottom: 1.5rem; color: var(--dark-wood);">Your claim for <strong>${outlawName}</strong> has been recorded.</p>
                <p style="margin-bottom: 1.5rem; color: var(--dark-wood);">Please bring proof of capture to the Dusty Gulch Sheriff's Office within 48 hours to collect your reward.</p>
                <button id="closeModal" style="background: var(--blood-red); color: white; border: none; padding: 0.8rem 2rem; font-family: var(--font-subheading); border-radius: 4px; cursor: pointer; display: block; margin: 0 auto;">Understood</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        document.getElementById('closeModal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Add to dispatch log
        addNewLogEntry(`Bounty claim form submitted for ${outlawName}.`);
    }
    
    function showOutlawDetailsModal(outlawName, rewardAmount) {
        // Get more details based on outlaw name
        let details = '';
        let crimes = '';
        let lastSeen = '';
        
        switch(outlawName) {
            case '"Lone Wolf" Malone':
                details = 'Leader of the "Canyon Wolves" gang. Known for meticulous planning and avoiding direct confrontation. Has a distinctive wolf-head tattoo on right forearm.';
                crimes = '12 confirmed bank robberies, 5 murders, extensive cattle rustling operations';
                lastSeen = 'Red Canyon region with 5 gang members';
                break;
            case 'Black Bart Cassidy':
                details = 'Former ranch hand turned outlaw. Fastest documented draw in the territory (0.3 seconds). Prefers stagecoach robberies over bank jobs.';
                crimes = '27 stagecoach robberies, 3 murders during robberies';
                lastSeen = 'Silverton saloon district, alone';
                break;
            case 'El Diablo':
                details = 'Mysterious figure operating along the border. Speaks both English and Spanish fluently. Known for brutal efficiency and leaving no witnesses.';
                crimes = 'Unknown number of murders, 4 train robberies, extensive extortion network';
                lastSeen = 'Border region near Mexico, possibly heading north';
                break;
            default:
                details = 'Notorious outlaw with multiple warrants across the territory. Considered armed and extremely dangerous.';
                crimes = 'Various felonies including robbery and murder';
                lastSeen = 'Territory-wide, mobile';
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'details-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--burnt-parchment); padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 10px solid transparent; border-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" rx=\"10\" ry=\"10\" fill=\"%23c9a87d\" stroke=\"%238b6b4d\" stroke-width=\"5\"/></svg>') 10 stretch;">
                <h2 style="font-family: var(--font-heading); color: var(--blood-red); margin-bottom: 1rem; border-bottom: 2px solid var(--rope-tan); padding-bottom: 0.5rem;">${outlawName}</h2>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                    <div style="font-size: 1.5rem; color: var(--reward-gold); font-weight: bold;">Reward: ${rewardAmount}</div>
                    <div style="font-family: var(--font-subheading); color: var(--dark-wood);">Dead or Alive</div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-family: var(--font-subheading); color: var(--dark-wood); margin-bottom: 0.5rem;">Known Details:</h3>
                    <p style="color: var(--bullet-lead); margin-bottom: 1rem;">${details}</p>
                    
                    <h3 style="font-family: var(--font-subheading); color: var(--dark-wood); margin-bottom: 0.5rem;">Confirmed Crimes:</h3>
                    <p style="color: var(--bullet-lead); margin-bottom: 1rem;">${crimes}</p>
                    
                    <h3 style="font-family: var(--font-subheading); color: var(--dark-wood); margin-bottom: 0.5rem;">Last Confirmed Sighting:</h3>
                    <p style="color: var(--bullet-lead); margin-bottom: 1rem;">${lastSeen}</p>
                </div>
                <button id="closeDetailsModal" style="background: var(--dark-wood); color: white; border: none; padding: 0.8rem 2rem; font-family: var(--font-subheading); border-radius: 4px; cursor: pointer; display: block; margin: 0 auto;">Close Dossier</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        document.getElementById('closeDetailsModal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // ============================================
    // FINAL INITIALIZATION
    // ============================================
    
    // Add CSS for modals
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal-content {
            animation: modalAppear 0.5s ease-out;
        }
        
        @keyframes modalAppear {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Initial poster selection
    updatePosterDisplay(0);
    
    // Log initialization complete
    console.log('✅ Dusty Gulch Bounty Board fully operational!');
});

// ============================================
// GLOBAL FUNCTIONS
// ============================================

// Function to simulate adding a new wanted poster (could be expanded)
function addNewWantedPoster(name, reward, crimes, lastSeen) {
    console.log(`New wanted poster added: ${name} - Reward: ${reward}`);
    // Implementation for dynamically adding posters would go here
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addNewWantedPoster,
        addNewLogEntry: function(text) {
            // This would need access to DOM elements
            console.log('Log entry added:', text);
        }
    };
}