// ============================================
// CHRONICLES OF THE LONG NIGHT - INTERACTIVE SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Element References ----
    const skyLayer = document.getElementById('skyLayer');
    const celestialBody = document.getElementById('celestialBody');
    const stars = document.getElementById('stars');
    const clouds = document.getElementById('clouds');
    const groundLayer = document.getElementById('groundLayer');
    const bell = document.getElementById('bell');
    const bellClapper = document.getElementById('bellClapper');
    const soundWaves = document.getElementById('soundWaves');
    const belfry = document.getElementById('belfry');
    const weatherVane = document.getElementById('weatherVane');
    const cursorTorch = document.getElementById('cursorTorch');
    const screenShake = document.getElementById('screenShake');
    const plagueDoctor = document.getElementById('plagueDoctor');
    const doctorHead = document.getElementById('doctorHead');
    const beakMask = document.getElementById('beakMask');
    const shineLeft = document.getElementById('shineLeft');
    const shineRight = document.getElementById('shineRight');
    const doctorStaff = document.getElementById('doctorStaff');
    const timeSlider = document.getElementById('timeSlider');
    const timeDisplay = document.getElementById('timeDisplay');
    const seasonButtons = document.querySelectorAll('.season-btn');
    const weatherButtons = document.querySelectorAll('.weather-btn');
    const btnTollBell = document.getElementById('btnTollBell');
    const btnVisitDoctor = document.getElementById('btnVisitDoctor');
    const btnSpring = document.getElementById('btnSpring');
    const btnSummer = document.getElementById('btnSummer');
    const btnAutumn = document.getElementById('btnAutumn');
    const btnWinter = document.getElementById('btnWinter');
    const btnClear = document.getElementById('btnClear');
    const btnRain = document.getElementById('btnRain');
    const btnFog = document.getElementById('btnFog');
    const mapOverlay = document.getElementById('mapOverlay');
    const mapPanel = document.getElementById('mapPanel');
    const mapPlayer = document.getElementById('mapPlayer');
    const mapLocations = document.querySelectorAll('.map-location');
    const mapClose = document.getElementById('mapClose');
    const infoPopup = document.getElementById('infoPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupText = document.getElementById('popupText');
    const popupClose = document.getElementById('popupClose');
    const narrativeText = document.getElementById('narrativeText');
    const fogLayer = document.getElementById('fogLayer');
    const rainLayer = document.getElementById('rainLayer');
    const light1 = document.getElementById('light1');
    const light2 = document.getElementById('light2');
    const light3 = document.getElementById('light3');
    const smoke1 = document.getElementById('smoke1');
    const smoke2 = document.getElementById('smoke2');
    const foliage1 = document.getElementById('foliage1');
    const foliage2 = document.getElementById('foliage2');
    const foliage3 = document.getElementById('foliage3');
    const wellBucket = document.getElementById('wellBucket');
    const bucketRope = document.getElementById('bucketRope');
    const crow1 = document.getElementById('crow1');
    const crow2 = document.getElementById('crow2');
    const crowWing1 = document.getElementById('crowWing1');
    const crowWing2 = document.getElementById('crowWing2');
    const mountains = document.getElementById('mountains');
    const forestBack = document.getElementById('forestBack');

    // ---- State Management ----
    let state = {
        time: 12,
        season: 'spring',
        weather: 'clear',
        isBellTolling: false,
        doctorActive: false,
        mapOpen: false,
        narrativeIndex: 0
    };

    const narratives = [
        'The year of our Lord 1348. The pestilence walks among us...',
        'Father Aldric tolls the bell, but none come to pray.',
        'The plague doctor moves through silent streets, beak filled with herbs.',
        'In the well, the water runs dark with fever dreams.',
        'Crows gather where the cart will pass at dawn.',
        'Winter comes. Will any see the spring?'
    ];

    const locationData = {
        church: {
            title: 'Church of St. Giles',
            text: 'The bells ring hollow now. Father Aldric keeps vigil alone, his prayers unanswered. The stained glass depicts saints with faces obscured by shadow.'
        },
        well: {
            title: 'Village Well',
            text: 'Once the heart of Ashmire, now whispered about in fearful tones. Some say the water tastes of iron and sorrow. The bucket hangs heavy with unseen weight.'
        },
        houses: {
            title: 'Crofters\' Row',
            text: 'Shutters nailed tight. Fires burn low behind wax-sealed windows. In the third house, a child sings to her doll while her mother prepares the linen shroud.'
        },
        forest: {
            title: 'Blackwood Edge',
            text: 'The pines have grown thick where the plague fires once raged. Travelers report seeing figures between the trees, watching, waiting, never approaching.'
        },
        doctor: {
            title: 'The Physician',
            text: 'He arrived with the frost, this raven in a leather beak. His cures are mysterious, his silence profound. None know if he heals or merely marks the dying.'
        }
    };

    // ---- Sky Gradient Definitions ----
    const skyGradients = {
        midnight: 'linear-gradient(180deg, #0a0e27 0%, #1a1a3a 50%, #2a1a3a 100%)',
        dawn: 'linear-gradient(180deg, #4a3a5a 0%, #7a5a6a 40%, #9a7a5a 100%)',
        sunrise: 'linear-gradient(180deg, #4a3050 0%, #8a5a4a 30%, #c4845a 60%, #e8a878 100%)',
        morning: 'linear-gradient(180deg, #4a7a9a 0%, #6aaab8 40%, #8ac8c8 100%)',
        noon: 'linear-gradient(180deg, #3a8ab8 0%, #5ab0d0 40%, #7ac8d8 100%)',
        afternoon: 'linear-gradient(180deg, #4a90a0 0%, #6ab0b8 40%, #8ac0a0 100%)',
        sunset: 'linear-gradient(180deg, #6a4048 0%, #a86040 30%, #d88838 60%, #f0a848 100%)',
        dusk: 'linear-gradient(180deg, #3a2848 0%, #5a3a58 40%, #7a4a48 100%)'
    };

    // ---- Initialize ----
    function init() {
        generateStars();
        generateClouds();
        generateRaindrops();
        updateTimeOfDay(12);
        setSeason('spring');
        startAmbientAnimations();
        setupEventListeners();
        startNarrativeCycle();
    }

    // ---- Star Generation ----
    function generateStars() {
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 60}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.style.width = `${Math.random() > 0.9 ? 3 : 2}px`;
            star.style.height = star.style.width;
            stars.appendChild(star);
        }
    }

    // ---- Cloud Generation ----
    function generateClouds() {
        for (let i = 0; i < 6; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            const width = 80 + Math.random() * 120;
            const height = 30 + Math.random() * 30;
            cloud.style.width = `${width}px`;
            cloud.style.height = `${height}px`;
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${5 + Math.random() * 25}%`;
            cloud.style.opacity = `${0.3 + Math.random() * 0.3}`;
            cloud.style.animation = `cloudDrift ${30 + Math.random() * 30}s linear infinite`;
            cloud.style.animationDelay = `${-Math.random() * 60}s`;
            clouds.appendChild(cloud);
        }
    }

    // ---- Rain Generation ----
    function generateRaindrops() {
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            rainLayer.appendChild(drop);
        }
    }

    // ---- Time of Day System ----
    function updateTimeOfDay(hour) {
        state.time = hour;
        timeDisplay.textContent = formatTime(hour);
        
        let skyGradient;
        let celestialClass;
        let celestialTop;
        let celestialLeft;
        let starsOpacity;
        let windowLights;
        
        if (hour >= 22 || hour < 4) {
            skyGradient = skyGradients.midnight;
            celestialClass = 'moon';
            celestialTop = '10%';
            celestialLeft = '70%';
            starsOpacity = '1';
            windowLights = true;
        } else if (hour >= 4 && hour < 6) {
            skyGradient = skyGradients.dawn;
            celestialClass = 'moon';
            celestialTop = '15%';
            celestialLeft = '85%';
            starsOpacity = '0.5';
            windowLights = true;
        } else if (hour >= 6 && hour < 8) {
            skyGradient = skyGradients.sunrise;
            celestialClass = 'sun';
            celestialTop = '20%';
            celestialLeft = '20%';
            starsOpacity = '0';
            windowLights = false;
        } else if (hour >= 8 && hour < 11) {
            skyGradient = skyGradients.morning;
            celestialClass = 'sun';
            celestialTop = '12%';
            celestialLeft = '35%';
            starsOpacity = '0';
            windowLights = false;
        } else if (hour >= 11 && hour < 14) {
            skyGradient = skyGradients.noon;
            celestialClass = 'sun';
            celestialTop = '8%';
            celestialLeft = '50%';
            starsOpacity = '0';
            windowLights = false;
        } else if (hour >= 14 && hour < 17) {
            skyGradient = skyGradients.afternoon;
            celestialClass = 'sun';
            celestialTop = '15%';
            celestialLeft = '65%';
            starsOpacity = '0';
            windowLights = false;
        } else if (hour >= 17 && hour < 19) {
            skyGradient = skyGradients.sunset;
            celestialClass = 'sun';
            celestialTop = '25%';
            celestialLeft = '80%';
            starsOpacity = '0';
            windowLights = true;
        } else {
            skyGradient = skyGradients.dusk;
            celestialClass = 'moon';
            celestialTop = '15%';
            celestialLeft = '50%';
            starsOpacity = '0.7';
            windowLights = true;
        }
        
        skyLayer.style.background = skyGradient;
        celestialBody.className = `celestial-body ${celestialClass}`;
        celestialBody.style.top = celestialTop;
        celestialBody.style.left = celestialLeft;
        stars.style.opacity = starsOpacity;
        
        toggleWindowLights(windowLights);
        updateGroundLighting(hour);
    }

    function formatTime(hour) {
        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    function toggleWindowLights(on) {
        const lights = [light1, light2, light3];
        lights.forEach(light => {
            light.classList.toggle('lit', on);
        });
    }

    function updateGroundLighting(hour) {
        let brightness;
        if (hour >= 6 && hour < 18) {
            brightness = 1;
        } else if (hour >= 4 && hour < 6) {
            brightness = 0.4 + (hour - 4) * 0.3;
        } else if (hour >= 18 && hour < 20) {
            brightness = 1 - (hour - 18) * 0.3;
        } else {
            brightness = 0.3;
        }
        groundLayer.style.filter = `brightness(${brightness})`;
    }

    // ---- Season System ----
    function setSeason(season) {
        state.season = season;
        const foliageElements = [foliage1, foliage2, foliage3];
        foliageElements.forEach(f => {
            f.className = `foliage ${season}`;
        });
        
        seasonButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.season === season);
        });
        
        const groundColors = {
            spring: 'linear-gradient(180deg, #4a6038 0%, #3a5028 30%, #2a4018 100%)',
            summer: 'linear-gradient(180deg, #3a7028 0%, #2a6018 30%, #1a5010 100%)',
            autumn: 'linear-gradient(180deg, #6a5830 0%, #5a4820 30%, #4a3810 100%)',
            winter: 'linear-gradient(180deg, #8a9ea8 0%, #7a8e98 30%, #6a7e88 100%)'
        };
        groundLayer.style.background = groundColors[season];
        
        const smokeElements = [smoke1, smoke2];
        smokeElements.forEach(s => {
            s.classList.toggle('puffing', season === 'winter' || season === 'autumn');
        });
    }

    // ---- Weather System ----
    function setWeather(weather) {
        state.weather = weather;
        weatherButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.weather === weather);
        });
        
        fogLayer.classList.toggle('active', weather === 'fog');
        rainLayer.classList.toggle('active', weather === 'rain');
        
        if (weather === 'rain') {
            clouds.style.opacity = '0.8';
        } else if (weather === 'fog') {
            clouds.style.opacity = '0.2';
        } else {
            clouds.style.opacity = '0.6';
        }
    }

    // ---- Bell Tolling System ----
    function tollBell() {
        if (state.isBellTolling) return;
        state.isBellTolling = true;
        
        let tolls = 0;
        const maxTolls = 3;
        
        function singleToll() {
            if (tolls >= maxTolls) {
                state.isBellTolling = false;
                return;
            }
            
            bell.style.animation = 'bellSwing 0.8s ease-in-out';
            bellClapper.style.animation = 'clapperSwing 0.8s ease-in-out';
            screenShake.classList.add('shaking');
            
            createSoundWave();
            
            setTimeout(() => {
                screenShake.classList.remove('shaking');
            }, 500);
            
            setTimeout(() => {
                bell.style.animation = '';
                bellClapper.style.animation = '';
                tolls++;
                setTimeout(singleToll, 400);
            }, 800);
        }
        
        singleToll();
        updateNarrative('The bell tolls across empty fields. Who remains to count the hours?');
    }

    function createSoundWave() {
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        soundWaves.appendChild(wave);
        setTimeout(() => wave.remove(), 2000);
    }

    // ---- Plague Doctor Interaction ----
    function activateDoctor() {
        state.doctorActive = true;
        plagueDoctor.style.transition = 'all 0.5s ease';
        plagueDoctor.style.transform = 'translateX(-20px) scale(1.1)';
        
        doctorHead.style.animation = 'doctorBreathe 2s ease-in-out infinite';
        
        setTimeout(() => {
            plagueDoctor.style.transform = '';
            doctorHead.style.animation = '';
            state.doctorActive = false;
        }, 3000);
        
        updateNarrative('The physician turns. Behind glass eyes, something ancient watches.');
    }

    function updateDoctorGaze(mouseX, mouseY) {
        const doctorRect = plagueDoctor.getBoundingClientRect();
        const doctorCenterX = doctorRect.left + doctorRect.width / 2;
        const doctorCenterY = doctorRect.top + doctorRect.height / 2;
        
        const angleX = (mouseX - doctorCenterX) / window.innerWidth;
        const angleY = (mouseY - doctorCenterY) / window.innerHeight;
        
        const rotateX = angleX * 15;
        const rotateY = angleY * 10;
        
        doctorHead.style.transform = `translateX(-50%) rotateY(${rotateX}deg) rotateX(${-rotateY}deg)`;
        
        const shineOffsetX = angleX * 6;
        const shineOffsetY = angleY * 4;
        
        shineLeft.style.transform = `translate(${shineOffsetX}px, ${shineOffsetY}px)`;
        shineRight.style.transform = `translate(${shineOffsetX + 1}px, ${shineOffsetY}px)`;
    }

    // ---- Map System ----
    function openMap() {
        state.mapOpen = true;
        mapOverlay.classList.add('active');
        mapPlayer.style.top = '50%';
        mapPlayer.style.left = '50%';
    }

    function closeMap() {
        state.mapOpen = false;
        mapOverlay.classList.remove('active');
    }

    function moveToLocation(locElement) {
        const rect = locElement.getBoundingClientRect();
        const mapRect = document.getElementById('pixelMap').getBoundingClientRect();
        
        const relativeTop = rect.top - mapRect.top + rect.height / 2 - 6;
        const relativeLeft = rect.left - mapRect.left + rect.width / 2 - 6;
        
        mapPlayer.style.top = `${relativeTop}px`;
        mapPlayer.style.left = `${relativeLeft}px`;
        
        setTimeout(() => {
            showLocationInfo(locElement.dataset.loc);
        }, 500);
    }

    function showLocationInfo(locKey) {
        const data = locationData[locKey];
        if (!data) return;
        
        popupTitle.textContent = data.title;
        popupText.textContent = data.text;
        infoPopup.classList.add('active');
    }

    function closePopup() {
        infoPopup.classList.remove('active');
    }

    // ---- Narrative System ----
    function startNarrativeCycle() {
        setInterval(() => {
            state.narrativeIndex = (state.narrativeIndex + 1) % narratives.length;
            narrativeText.style.opacity = '0';
            setTimeout(() => {
                narrativeText.textContent = narratives[state.narrativeIndex];
                narrativeText.style.opacity = '1';
            }, 500);
        }, 8000);
    }

    function updateNarrative(text) {
        narrativeText.textContent = text;
        narrativeText.style.animation = 'none';
        narrativeText.offsetHeight;
        narrativeText.style.animation = 'textFlicker 4s ease-in-out infinite';
    }

    // ---- Ambient Animations ----
    function startAmbientAnimations() {
        animateWeatherVane();
        animateCrows();
        animateWellBucket();
        animateParallax();
    }

    function animateWeatherVane() {
        let angle = 0;
        setInterval(() => {
            angle += (Math.random() - 0.5) * 20;
            angle = Math.max(-30, Math.min(30, angle));
            weatherVane.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }, 3000);
    }

    function animateCrows() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                crow1.style.transition = 'all 2s ease';
                crow1.style.left = `${10 + Math.random() * 30}%`;
                crow1.style.top = `${15 + Math.random() * 20}%`;
            }
            if (Math.random() > 0.7) {
                crow2.style.transition = 'all 2s ease';
                crow2.style.right = `${10 + Math.random() * 20}%`;
                crow2.style.top = `${10 + Math.random() * 15}%`;
            }
        }, 4000);
    }

    function animateWellBucket() {
        let down = true;
        setInterval(() => {
            if (Math.random() > 0.6) {
                bucketRope.style.height = down ? '55px' : '35px';
                down = !down;
            }
        }, 3000);
    }

    function animateParallax() {
        let mouseX = 0.5;
        let mouseY = 0.5;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });
        
        function updateParallax() {
            const mountainX = (mouseX - 0.5) * 20;
            const forestX = (mouseX - 0.5) * 40;
            
            mountains.style.transform = `translateX(${mountainX}px)`;
            forestBack.style.transform = `translateX(${forestX}px)`;
            
            requestAnimationFrame(updateParallax);
        }
        updateParallax();
    }

    // ---- Event Listeners ----
    function setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            cursorTorch.style.left = `${e.clientX}px`;
            cursorTorch.style.top = `${e.clientY}px`;
            updateDoctorGaze(e.clientX, e.clientY);
        });
        
        // Time slider
        timeSlider.addEventListener('input', (e) => {
            updateTimeOfDay(parseFloat(e.target.value));
        });
        
        // Season buttons
        btnSpring.addEventListener('click', () => setSeason('spring'));
        btnSummer.addEventListener('click', () => setSeason('summer'));
        btnAutumn.addEventListener('click', () => setSeason('autumn'));
        btnWinter.addEventListener('click', () => setSeason('winter'));
        
        // Weather buttons
        btnClear.addEventListener('click', () => setWeather('clear'));
        btnRain.addEventListener('click', () => setWeather('rain'));
        btnFog.addEventListener('click', () => setWeather('fog'));
        
        // Action buttons
        btnTollBell.addEventListener('click', tollBell);
        btnVisitDoctor.addEventListener('click', activateDoctor);
        
        // Plague doctor click
        plagueDoctor.addEventListener('click', activateDoctor);
        
        // Map
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                state.mapOpen ? closeMap() : openMap();
            }
            if (e.key === 'Escape') {
                closeMap();
                closePopup();
            }
        });
        
        mapLocations.forEach(loc => {
            loc.addEventListener('click', () => moveToLocation(loc));
        });
        
        mapClose.addEventListener('click', closeMap);
        popupClose.addEventListener('click', closePopup);
        
        // Building hovers
        document.querySelectorAll('.building').forEach(building => {
            building.addEventListener('mouseenter', () => {
                building.style.transform += ' scale(1.02)';
                building.style.transition = 'transform 0.2s ease';
            });
            building.addEventListener('mouseleave', () => {
                building.style.transform = building.style.transform.replace(' scale(1.02)', '');
            });
        });
        
        // Well interaction
        document.getElementById('well').addEventListener('click', () => {
            bucketRope.style.height = '60px';
            setTimeout(() => {
                bucketRope.style.height = '35px';
            }, 1000);
            updateNarrative('The bucket descends into darkness. Something stirs below.');
        });
    }

    // ---- Keyframe Animations (injected) ----
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes cloudDrift {
            from { transform: translateX(-200px); }
            to { transform: translateX(calc(100vw + 200px)); }
        }
        
        @keyframes bellSwing {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            25% { transform: translateX(-50%) rotate(25deg); }
            75% { transform: translateX(-50%) rotate(-25deg); }
        }
        
        @keyframes clapperSwing {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            20% { transform: translateX(-50%) rotate(35deg); }
            80% { transform: translateX(-50%) rotate(-35deg); }
        }
        
        @keyframes doctorBreathe {
            0%, 100% { transform: translateX(-50%) scaleY(1); }
            50% { transform: translateX(-50%) scaleY(1.03); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ---- Start ----
    init();
});