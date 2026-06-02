(function() {
    const BRIDGE_CONSOLE = {
        state: {
            shieldData: {
                front: 94,
                right: 91,
                rear: 68,
                left: 95
            },
            navigationData: {
                heading: 247.5,
                velocity: 7.2,
                eta: { hours: 4, minutes: 23 }
            },
            weaponsData: {
                phasers: {
                    forward: { charge: 100, ready: true },
                    port: { charge: 87, ready: true },
                    starboard: { charge: 92, ready: true }
                },
                torpedoes: 24,
                maxTorpedoes: 30
            },
            commsData: {
                signalStrength: -42,
                activeChannel: 0,
                channels: [
                    { freq: '147.35 MHz', name: 'FEDERATION RELAY', status: 'active' },
                    { freq: '298.12 MHz', name: 'SHIP-TO-SHIP', status: 'standby' },
                    { freq: '412.88 MHz', name: 'EMERGENCY BEACON', status: 'disabled' }
                ]
            },
            crewCount: 12,
            alertStatus: 'green',
            targetLock: false,
            currentPanel: 'navigation'
        },

        elements: {},

        init: function() {
            this.cacheElements();
            this.startClock();
            this.startStardate();
            this.initShieldAnimations();
            this.initNavigationUpdates();
            this.initWeaponSystems();
            this.initCommunications();
            this.initPanelNavigation();
            this.initParallaxStars();
            this.initGridScroll();
            this.initAlertSystem();
            this.startDataLoop();
            this.initKeyboardControls();
            this.initAudioVisualizer();
        },

        cacheElements: function() {
            this.elements = {
                timeDisplay: document.getElementById('timeDisplay'),
                stardate: document.getElementById('stardate'),
                shieldTotal: document.getElementById('shieldTotal'),
                shieldFront: document.getElementById('shieldFront'),
                shieldRight: document.getElementById('shieldRight'),
                shieldRear: document.getElementById('shieldRear'),
                shieldLeft: document.getElementById('shieldLeft'),
                shieldRing: document.getElementById('shieldRing'),
                headingValue: document.getElementById('headingValue'),
                velocityValue: document.getElementById('velocityValue'),
                etaValue: document.getElementById('etaValue'),
                currentCoords: document.getElementById('currentCoords'),
                targetCoords: document.getElementById('targetCoords'),
                signalMeter: document.getElementById('signalMeter'),
                signalValue: document.getElementById('signalValue'),
                spectrumWave: document.getElementById('spectrumWave'),
                targetReticle: document.getElementById('targetReticle'),
                targetInfo: document.getElementById('targetInfo'),
                alertIndicator: document.getElementById('alertIndicator'),
                crewCount: document.getElementById('crewCount'),
                powerLevel: document.getElementById('powerLevel'),
                chromeGrid: document.getElementById('chromeGrid'),
                starfield: document.getElementById('starfield'),
                audioVisualizer: document.getElementById('audioVisualizer'),
                navButtons: document.querySelectorAll('.nav-button'),
                panels: {
                    navigation: document.getElementById('panelNavigation'),
                    shields: document.getElementById('panelShields'),
                    weapons: document.getElementById('panelWeapons'),
                    comms: document.getElementById('panelComms')
                },
                shieldBtns: document.querySelectorAll('.shield-btn'),
                weaponBtns: document.querySelectorAll('.weapon-btn'),
                commsBtns: document.querySelectorAll('.comms-btn')
            };
        },

        startClock: function() {
            const updateTime = () => {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                this.elements.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
            };
            updateTime();
            setInterval(updateTime, 1000);
        },

        startStardate: function() {
            const baseStardate = 2284.127;
            let currentStardate = baseStardate;
            
            const updateStardate = () => {
                currentStardate += 0.001;
                if (currentStardate > 9999.999) {
                    currentStardate = 0;
                }
                this.elements.stardate.textContent = `STARDATE ${currentStardate.toFixed(3)}`;
            };
            setInterval(updateStardate, 5000);
        },

        initShieldAnimations: function() {
            this.updateShieldDisplay();
            
            this.elements.shieldBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.dataset.action;
                    if (action === 'rebalance') {
                        this.rebalanceShields();
                    } else if (action === 'boost') {
                        this.boostShields();
                    }
                });
            });

            setInterval(() => {
                this.fluctuateShields();
            }, 2000);
        },

        updateShieldDisplay: function() {
            const { front, right, rear, left } = this.state.shieldData;
            
            this.elements.shieldFront.textContent = `${front}%`;
            this.elements.shieldRight.textContent = `${right}%`;
            this.elements.shieldRear.textContent = `${rear}%`;
            this.elements.shieldLeft.textContent = `${left}%`;
            
            const total = Math.round((front + right + rear + left) / 4);
            this.elements.shieldTotal.textContent = `${total}%`;
            
            const segments = this.elements.shieldRing.querySelectorAll('.shield-segment');
            segments.forEach(seg => {
                const segmentName = seg.dataset.segment;
                const value = this.state.shieldData[segmentName];
                const maxDash = 820;
                const dashArray = (value / 100) * 204;
                seg.style.strokeDasharray = `${dashArray} ${maxDash - dashArray}`;
                
                if (value < 50) {
                    seg.style.stroke = '#ff0066';
                    seg.style.filter = 'url(#glowMagenta)';
                } else if (value < 75) {
                    seg.style.stroke = '#ffff00';
                } else {
                    seg.style.stroke = '#00ffff';
                    seg.style.filter = 'url(#glowCyan)';
                }
            });
        },

        fluctuateShields: function() {
            const keys = ['front', 'right', 'rear', 'left'];
            keys.forEach(key => {
                const current = this.state.shieldData[key];
                const fluctuation = (Math.random() - 0.5) * 4;
                this.state.shieldData[key] = Math.max(20, Math.min(100, current + fluctuation));
            });
            this.updateShieldDisplay();
        },

        rebalanceShields: function() {
            const keys = ['front', 'right', 'rear', 'left'];
            const total = keys.reduce((sum, key) => sum + this.state.shieldData[key], 0);
            const average = total / 4;
            
            keys.forEach(key => {
                this.state.shieldData[key] = average;
            });
            
            this.animateShieldChange();
            this.updateShieldDisplay();
        },

        boostShields: function() {
            const keys = ['front', 'right', 'rear', 'left'];
            keys.forEach(key => {
                this.state.shieldData[key] = Math.min(100, this.state.shieldData[key] + 15);
            });
            
            this.animateShieldChange();
            this.updateShieldDisplay();
        },

        animateShieldChange: function() {
            const shieldCenter = document.querySelector('.shield-center');
            shieldCenter.style.transform = 'translate(-50%, -50%) scale(1.1)';
            setTimeout(() => {
                shieldCenter.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        },

        initNavigationUpdates: function() {
            setInterval(() => {
                this.state.navigationData.heading = (this.state.navigationData.heading + 0.1) % 360;
                this.state.navigationData.velocity = Math.max(1, Math.min(9.9, 
                    this.state.navigationData.velocity + (Math.random() - 0.5) * 0.2));
                
                if (this.state.navigationData.eta.minutes > 0) {
                    this.state.navigationData.eta.minutes--;
                } else if (this.state.navigationData.eta.hours > 0) {
                    this.state.navigationData.eta.hours--;
                    this.state.navigationData.eta.minutes = 59;
                }
                
                this.updateNavigationDisplay();
            }, 1000);
        },

        updateNavigationDisplay: function() {
            const { heading, velocity, eta } = this.state.navigationData;
            
            this.elements.headingValue.textContent = `${heading.toFixed(1)}°`;
            this.elements.velocityValue.textContent = `WARP ${velocity.toFixed(1)}`;
            this.elements.etaValue.textContent = `${eta.hours}h ${eta.minutes}m`;
            
            this.elements.currentCoords.textContent = `X: ${(Math.random() * 300 - 150).toFixed(1)} | Y: ${(Math.random() * 200 - 100).toFixed(1)} | Z: ${(Math.random() * 100 - 50).toFixed(1)}`;
        },

        initWeaponSystems: function() {
            this.updateWeaponDisplay();
            
            const lockBtn = document.querySelector('.btn-lock');
            if (lockBtn) {
                lockBtn.addEventListener('click', () => {
                    this.toggleTargetLock();
                });
            }
            
            setInterval(() => {
                this.chargeWeapons();
            }, 500);
        },

        updateWeaponDisplay: function() {
            const phasers = this.state.weaponsData.phasers;
            const chargeBars = document.querySelectorAll('.charge-fill');
            const chargeValues = document.querySelectorAll('.charge-value');
            
            const charges = [phasers.forward.charge, phasers.port.charge, phasers.starboard.charge];
            charges.forEach((charge, index) => {
                if (chargeBars[index]) {
                    chargeBars[index].style.width = `${charge}%`;
                }
                if (chargeValues[index]) {
                    chargeValues[index].textContent = `${Math.round(charge)}%`;
                }
            });

            const torpedoAmmo = document.querySelector('.ammo-value');
            if (torpedoAmmo) {
                torpedoAmmo.textContent = this.state.weaponsData.torpedoes;
            }
        },

        chargeWeapons: function() {
            const phasers = this.state.weaponsData.phasers;
            Object.keys(phasers).forEach(key => {
                if (phasers[key].charge < 100) {
                    phasers[key].charge = Math.min(100, phasers[key].charge + Math.random() * 2);
                }
            });
            this.updateWeaponDisplay();
        },

        toggleTargetLock: function() {
            this.state.targetLock = !this.state.targetLock;
            const designation = this.elements.targetInfo.querySelector('.target-designation');
            const range = this.elements.targetInfo.querySelector('.target-range');
            const fireBtn = document.querySelector('.btn-fire');
            
            if (this.state.targetLock) {
                designation.textContent = 'KLINGON BIRD OF PREY';
                range.textContent = `${(Math.random() * 50 + 10).toFixed(1)} KM`;
                fireBtn.disabled = false;
                this.elements.targetReticle.classList.add('locked');
            } else {
                designation.textContent = 'NO TARGET LOCK';
                range.textContent = '---';
                fireBtn.disabled = true;
                this.elements.targetReticle.classList.remove('locked');
            }
        },

        initCommunications: function() {
            this.updateCommsDisplay();
            this.animateFrequencySpectrum();
            
            setInterval(() => {
                this.fluctuateSignal();
            }, 1000);
        },

        updateCommsDisplay: function() {
            const { signalStrength } = this.state.commsData;
            this.elements.signalValue.textContent = `${signalStrength} dBm`;
            
            const bars = this.elements.signalMeter.querySelectorAll('.meter-bar');
            const activeBars = Math.round((Math.abs(signalStrength) - 20) / 8);
            
            bars.forEach((bar, index) => {
                if (index < activeBars) {
                    bar.classList.add('active');
                } else {
                    bar.classList.remove('active');
                }
            });
        },

        fluctuateSignal: function() {
            this.state.commsData.signalStrength = Math.round(
                -30 - Math.random() * 40
            );
            this.updateCommsDisplay();
        },

        animateFrequencySpectrum: function() {
            const generateWavePath = () => {
                let path = 'M 0 90';
                const points = 20;
                for (let i = 0; i <= points; i++) {
                    const x = (i / points) * 400;
                    const y = 30 + Math.random() * 60;
                    path += ` L ${x} ${y}`;
                }
                path += ' L 400 90 L 400 100 L 0 100 Z';
                return path;
            };
            
            setInterval(() => {
                if (this.elements.spectrumWave) {
                    this.elements.spectrumWave.setAttribute('d', generateWavePath());
                }
            }, 100);
        },

        initPanelNavigation: function() {
            this.elements.navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const panel = btn.dataset.panel;
                    this.switchPanel(panel);
                });
            });
        },

        switchPanel: function(panelName) {
            this.elements.navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.panel === panelName) {
                    btn.classList.add('active');
                }
            });

            Object.keys(this.elements.panels).forEach(key => {
                const panel = this.elements.panels[key];
                if (key === panelName) {
                    panel.style.display = 'block';
                    panel.style.opacity = '1';
                } else if (key !== 'shields') {
                    panel.style.opacity = '0.5';
                }
            });
            
            this.state.currentPanel = panelName;
        },

        initParallaxStars: function() {
            const layers = document.querySelectorAll('.star-layer');
            
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                layers.forEach((layer, index) => {
                    const depth = (index + 1) * 0.5;
                    layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                });
            });
        },

        initGridScroll: function() {
            let offset = 0;
            
            const scrollGrid = () => {
                offset += 0.5;
                if (offset >= 40) offset = 0;
                
                const gridSurface = document.querySelector('.grid-surface');
                if (gridSurface) {
                    gridSurface.style.backgroundPosition = `${offset}px ${offset}px`;
                }
                
                requestAnimationFrame(scrollGrid);
            };
            
            scrollGrid();
        },

        initAlertSystem: function() {
            setInterval(() => {
                const random = Math.random();
                if (random < 0.05) {
                    this.triggerAlert('yellow');
                } else if (random < 0.02) {
                    this.triggerAlert('red');
                } else {
                    this.triggerAlert('green');
                }
            }, 10000);
        },

        triggerAlert: function(level) {
            const indicator = this.elements.alertIndicator;
            const icon = indicator.querySelector('.alert-icon');
            const text = indicator.querySelector('.alert-text');
            
            indicator.className = 'alert-indicator';
            
            switch(level) {
                case 'red':
                    indicator.style.background = 'rgba(255, 0, 0, 0.2)';
                    indicator.style.borderColor = '#ff0000';
                    icon.style.color = '#ff0000';
                    text.style.color = '#ff0000';
                    text.textContent = 'RED ALERT';
                    break;
                case 'yellow':
                    indicator.style.background = 'rgba(255, 255, 0, 0.2)';
                    indicator.style.borderColor = '#ffff00';
                    icon.style.color = '#ffff00';
                    text.style.color = '#ffff00';
                    text.textContent = 'YELLOW ALERT';
                    break;
                default:
                    indicator.style.background = 'rgba(0, 255, 102, 0.1)';
                    indicator.style.borderColor = '#00ff66';
                    icon.style.color = '#00ff66';
                    text.style.color = '#00ff66';
                    text.textContent = 'CONDITION GREEN';
            }
            
            this.state.alertStatus = level;
        },

        startDataLoop: function() {
            setInterval(() => {
                this.state.crewCount = Math.max(8, Math.min(15, 
                    this.state.crewCount + Math.round((Math.random() - 0.5) * 2)));
                this.elements.crewCount.textContent = this.state.crewCount;
            }, 30000);
        },

        initKeyboardControls: function() {
            document.addEventListener('keydown', (e) => {
                switch(e.key.toLowerCase()) {
                    case 'n':
                        this.switchPanel('navigation');
                        break;
                    case 's':
                        this.switchPanel('shields');
                        break;
                    case 'w':
                        this.switchPanel('weapons');
                        break;
                    case 'c':
                        this.switchPanel('comms');
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleTargetLock();
                        break;
                    case 'r':
                        this.rebalanceShields();
                        break;
                    case 'b':
                        this.boostShields();
                        break;
                }
            });
        },

        initAudioVisualizer: function() {
            const bars = this.elements.audioVisualizer.querySelectorAll('.viz-bar');
            
            const animateBars = () => {
                bars.forEach((bar, index) => {
                    const height = 20 + Math.random() * 80;
                    const delay = index * 50;
                    
                    setTimeout(() => {
                        bar.style.height = `${height}%`;
                    }, delay);
                });
            };
            
            setInterval(animateBars, 150);
        }
    };

    const waypointManager = {
        waypoints: [
            { name: 'PROXIMA CENTAURI', distance: 1.2 },
            { name: 'WOLF 359 RELAY', distance: 2.8 },
            { name: 'SIRIUS STATION', distance: 4.1 },
            { name: 'VEGA OUTPOST', distance: 6.7 }
        ],
        currentWaypoint: 0,

        init: function() {
            this.startProgress();
        },

        startProgress: function() {
            setInterval(() => {
                this.waypoints[this.currentWaypoint].distance -= 0.01;
                
                if (this.waypoints[this.currentWaypoint].distance <= 0) {
                    this.advanceWaypoint();
                }
                
                this.updateDisplay();
            }, 1000);
        },

        advanceWaypoint: function() {
            const items = document.querySelectorAll('.waypoint-item');
            items[this.currentWaypoint].classList.remove('active');
            
            this.currentWaypoint++;
            
            if (this.currentWaypoint >= this.waypoints.length) {
                this.currentWaypoint = 0;
            }
            
            items[this.currentWaypoint].classList.add('active');
        },

        updateDisplay: function() {
            const distances = document.querySelectorAll('.waypoint-dist');
            this.waypoints.forEach((wp, index) => {
                if (distances[index]) {
                    distances[index].textContent = `${wp.distance.toFixed(1)} PC`;
                }
            });
        }
    };

    const powerAllocation = {
        level: 65,
        isDragging: false,

        init: function() {
            this.setupSlider();
        },

        setupSlider: function() {
            const slider = document.querySelector('.slider-track');
            if (!slider) return;

            slider.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.updateLevel(e);
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.updateLevel(e);
                }
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });
        },

        updateLevel: function(e) {
            const slider = document.querySelector('.slider-track');
            const rect = slider.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            this.level = Math.round((x / rect.width) * 100);
            
            const fill = slider.querySelector('.slider-fill');
            const levelDisplay = document.getElementById('powerLevel');
            
            if (fill) fill.style.width = `${this.level}%`;
            if (levelDisplay) levelDisplay.textContent = `${this.level}%`;
        }
    };

    const systemSounds = {
        context: null,
        
        init: function() {
            this.createOscillators();
        },

        createOscillators: function() {
            document.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.playClick();
                });
            });
        },

        playClick: function() {
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        BRIDGE_CONSOLE.init();
        waypointManager.init();
        powerAllocation.init();
        systemSounds.init();
        
        console.log('%c★ USS SYNTHWAVE BRIDGE CONSOLE ONLINE ★', 
            'color: #00ffff; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
        console.log('%cKeyboard shortcuts: N=Nav, S=Shields, W=Weapons, C=Comms, Space=Lock Target, R=Rebalance, B=Boost', 
            'color: #ff00ff; font-size: 12px;');
    });

    window.BRIDGE_CONSOLE = BRIDGE_CONSOLE;
})();