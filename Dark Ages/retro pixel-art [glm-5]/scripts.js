document.addEventListener('DOMContentLoaded', function() {

    const dayNightCycle = document.querySelector('.day-night-cycle');
    const currentTimeDisplay = document.getElementById('currentTime');
    const timeIconDisplay = document.querySelector('.sun-icon-display');

    const timeStates = ['dawn', 'day', 'dusk', 'night'];
    const timeLabels = ['Dawn', 'Day', 'Dusk', 'Night'];
    let currentTimeIndex = 0;

    function updateTimeOfDay() {
        const hour = new Date().getHours();
        let newIndex;
        
        if (hour >= 5 && hour < 8) {
            newIndex = 0;
        } else if (hour >= 8 && hour < 17) {
            newIndex = 1;
        } else if (hour >= 17 && hour < 20) {
            newIndex = 2;
        } else {
            newIndex = 3;
        }

        if (currentTimeIndex !== newIndex) {
            currentTimeIndex = newIndex;
            applyTimeState(timeStates[currentTimeIndex]);
        }
    }

    function applyTimeState(state) {
        dayNightCycle.className = 'day-night-cycle ' + state;
        currentTimeDisplay.textContent = timeLabels[timeStates.indexOf(state)];
        
        updateParchmentTheme(state);
    }

    function updateParchmentTheme(state) {
        const body = document.body;
        const sections = document.querySelectorAll('.section-frame:not(.dark-frame)');
        
        if (state === 'night') {
            body.style.background = '#2d2418';
            sections.forEach(section => {
                section.style.background = 'linear-gradient(135deg, #3d3428 0%, #2d2418 50%, #1d1408 100%)';
            });
            document.querySelectorAll('.manuscript-text, .paragraph').forEach(el => {
                el.style.color = '#d4c4a8';
            });
        } else {
            body.style.background = '';
            sections.forEach(section => {
                section.style.background = '';
            });
            document.querySelectorAll('.manuscript-text, .paragraph').forEach(el => {
                el.style.color = '';
            });
        }
    }

    updateTimeOfDay();
    setInterval(updateTimeOfDay, 60000);

    function cycleTimeOfDay() {
        currentTimeIndex = (currentTimeIndex + 1) % timeStates.length;
        applyTimeState(timeStates[currentTimeIndex]);
    }

    const timeDisplay = document.querySelector('.time-display');
    if (timeDisplay) {
        timeDisplay.style.cursor = 'pointer';
        timeDisplay.addEventListener('click', cycleTimeOfDay);
        timeDisplay.title = 'Click to change time of day';
    }

    const mainBell = document.getElementById('mainBell');
    const bellRinger = document.getElementById('bellRinger');
    const bellCountDisplay = document.getElementById('bellCount');
    const soundWaves = document.getElementById('soundWaves');
    let bellCount = 0;

    function playBellSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const frequencies = [220, 277.18, 329.63, 440];
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (index * 0.15);
            const duration = 2 - (index * 0.3);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    function tollBell() {
        mainBell.classList.add('ringing');
        
        soundWaves.classList.add('active');
        
        bellCount++;
        bellCountDisplay.textContent = bellCount;
        bellCountDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            bellCountDisplay.style.transform = 'scale(1)';
        }, 200);
        
        playBellSound();
        
        setTimeout(() => {
            mainBell.classList.remove('ringing');
        }, 300);
        
        setTimeout(() => {
            soundWaves.classList.remove('active');
        }, 1200);
    }

    bellRinger.addEventListener('click', tollBell);
    mainBell.addEventListener('click', tollBell);

    const buildingInfo = {
        castle: {
            title: "Lord's Keep",
            description: "The seat of feudal power, where the local lord resides and administers justice. From these walls, knights ride forth to battle, and taxes are collected from the surrounding peasantry."
        },
        church: {
            title: "The Abbey",
            description: "A sacred place of worship and learning. Monks here preserve ancient texts, copy manuscripts by candlelight, and offer what medical knowledge remains from Roman times."
        },
        tavern: {
            title: "The Rustic Hearth",
            description: "Where travelers and villagers gather to share news, ale, and tales of distant lands. The innkeeper knows all that passes within the shire."
        },
        blacksmith: {
            title: "Smithy",
            description: "The forge burns bright day and night. Here, plowshares become swords, and horseshoes are crafted. The blacksmith's hammer rings like a smaller bell across the village."
        },
        mill: {
            title: "Miller's Mill",
            description: "Grain is ground into flour here, essential for daily bread. The miller takes his portion - one bag in twelve - for the service rendered."
        },
        well: {
            title: "Village Well",
            description: "The source of fresh water for all villagers. It is said to have been blessed by a passing saint, and its waters never run dry, even in the hottest summer."
        }
    };

    const infoPanel = document.querySelector('.map-info-panel');
    const infoTitle = infoPanel.querySelector('.info-title');
    const infoDescription = infoPanel.querySelector('.info-description');

    const villageBuildings = document.querySelectorAll('.village-building');

    villageBuildings.forEach(building => {
        building.addEventListener('click', function() {
            const buildingType = this.dataset.building;
            const info = buildingInfo[buildingType];
            
            if (info) {
                infoTitle.textContent = info.title;
                infoDescription.textContent = info.description;
                
                infoPanel.style.background = 'rgba(139, 26, 26, 0.2)';
                infoPanel.style.borderColor = '#8b1a1a';
                
                this.style.filter = 'brightness(1.3)';
                setTimeout(() => {
                    this.style.filter = '';
                }, 300);
            }
        });

        building.addEventListener('mouseenter', function() {
            const buildingType = this.dataset.building;
            const info = buildingInfo[buildingType];
            
            if (info) {
                infoTitle.style.color = '#8b1a1a';
            }
        });

        building.addEventListener('mouseleave', function() {
            infoTitle.style.color = '';
        });
    });

    const cursorFollower = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-ember';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(201, 162, 39, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            left: ${Math.random() * window.innerWidth}px;
            bottom: -10px;
            animation: ember-rise 8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes ember-rise {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.8;
            }
            50% {
                transform: translateY(-${window.innerHeight / 2}px) rotate(180deg);
                opacity: 0.4;
            }
            100% {
                transform: translateY(-${window.innerHeight}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    setInterval(createFloatingParticle, 3000);

    const paragraphs = document.querySelectorAll('.paragraph');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const paragraphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    paragraphs.forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        paragraphObserver.observe(p);
    });

    const plagueDoctor = document.querySelector('.plague-doctor');
    
    if (plagueDoctor) {
        document.addEventListener('mousemove', function(e) {
            const plagueSection = document.querySelector('.plague-section');
            if (!plagueSection) return;
            
            const rect = plagueSection.getBoundingClientRect();
            
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const centerX = rect.left + rect.width / 2;
                const offsetX = (e.clientX - centerX) / rect.width;
                
                const doctorBody = plagueDoctor.querySelector('.doctor-body');
                if (doctorBody) {
                    doctorBody.style.transform = `translateX(${offsetX * 10}px)`;
                }
            }
        });
    }

    function createStars() {
        const starsLayer = document.querySelector('.stars-layer');
        if (!starsLayer) return;

        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: #f0e6d8;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 60}%;
                animation: star-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            starsLayer.appendChild(star);
        }
    }

    const starStyleSheet = document.createElement('style');
    starStyleSheet.textContent = `
        @keyframes star-twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.8); }
        }
    `;
    document.head.appendChild(starStyleSheet);

    createStars();

    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => {
        setInterval(() => {
            const flames = candle.querySelectorAll('.flame');
            flames.forEach(flame => {
                const randomScale = 0.9 + Math.random() * 0.2;
                const randomRotate = -5 + Math.random() * 10;
                flame.style.transform = `translateX(-50%) scale(${randomScale}) rotate(${randomRotate}deg)`;
            });
        }, 100);
    });

    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach((event, index) => {
        event.style.animationDelay = `${index * 0.2}s`;
    });

    const compass = document.querySelector('.map-compass');
    if (compass) {
        compass.addEventListener('click', function() {
            const needle = this.querySelector('.compass-needle');
            if (needle) {
                needle.style.transition = 'transform 1s ease';
                needle.style.transform = 'translate(-50%, -50%) rotate(360deg)';
                
                setTimeout(() => {
                    needle.style.transition = 'none';
                    needle.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                }, 1000);
            }
        });
    }

    console.log('🏰 The Dark Ages website has been illuminated.');
    console.log('📜 Click the time display to cycle through day/night.');
    console.log('🔔 Click the bell or button to toll the church bell.');
    console.log('🏘️ Click village buildings to learn their history.');

});