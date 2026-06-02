// scripts.js

class OSD70Interface {
    constructor() {
        this.currentSection = 'file-manager';
        this.tapePlaying = false;
        this.brightnessHigh = true;
        this.linesEnabled = true;
        this.distortionActive = true;
        this.audioOn = true;
        this.tapePosition = 0;
        this.tapeInterval = null;
        this.systemMessages = [
            'SYSTEM INITIALIZED - 1973-10-23 08:00:00',
            'MEMORY TEST PASSED - 64K BYTES AVAILABLE',
            'DISK DRIVE ONLINE - READY FOR OPERATIONS',
            'BACKUP PROCEDURE COMPLETED SUCCESSFULLY',
            'SECURITY CHECK: ALL SYSTEMS NOMINAL',
            'USER SESSION TERMINATED NORMALLY',
            'POWER CYCLE DETECTED - REBOOTING SYSTEM',
            'NETWORK INTERFACE CONFIGURED SUCCESSFULLY',
            'NEW FILE DETECTED: SYSTEM_UPDATE.PAT',
            'PROCESSOR THERMAL THRESHOLD EXCEEDED',
            'DATA INTEGRITY VERIFICATION COMPLETE',
            'SCHEDULED MAINTENANCE WINDOW ACTIVE',
            'TERMINAL SESSION ESTABLISHED: USER_001',
            'ENCRYPTION KEY ROTATED SUCCESSFULLY',
            'SYSTEM PERFORMANCE OPTIMIZATION COMPLETE'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startSystemClock();
        this.updateTicker();
        this.simulateSystemActivity();
        this.setupRotaryDial();
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
                this.playAudio('navigate');
            });
        });
        
        // Toggle switches
        this.setupToggle('toggleMount', 'MOUNT');
        this.setupToggle('toggleLock', 'LOCK');
        this.setupToggle('tapePlay', 'PLAY');
        this.setupToggle('tapeStop', 'STOP');
        this.setupToggle('tapeRewind', 'REWIND');
        this.setupToggle('logClear', 'CLEAR');
        this.setupToggle('brightnessToggle', 'BRIGHTNESS');
        this.setupToggle('linesToggle', 'SCAN_LINES');
        this.setupToggle('distortionToggle', 'DISTORTION');
        this.setupToggle('audioToggle', 'AUDIO');
        
        // File items
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const fileName = e.currentTarget.dataset.file;
                this.selectFile(fileName);
                this.playAudio('select');
            });
        });
        
        // Console buttons
        document.querySelectorAll('.console-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent;
                if (action === '▶') {
                    this.resumeTicker();
                    this.playAudio('start');
                } else if (action === '■') {
                    this.pauseTicker();
                    this.playAudio('stop');
                }
            });
        });
        
        // Log clear button
        document.getElementById('logClear').addEventListener('click', () => {
            const ticker = document.getElementById('tickerContent');
            ticker.innerHTML = '';
            this.addSystemMessage('LOG CLEARED BY USER');
        });
    }
    
    setupToggle(id, actionName) {
        const toggle = document.getElementById(id);
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const isActive = toggle.classList.contains('active');
            
            switch(actionName) {
                case 'PLAY':
                    this.tapePlaying = isActive;
                    if (isActive) this.startTapeAnimation();
                    else this.stopTapeAnimation();
                    break;
                case 'STOP':
                    this.tapePlaying = false;
                    this.stopTapeAnimation();
                    toggle.classList.remove('active');
                    break;
                case 'REWIND':
                    this.rewindTape();
                    break;
                case 'CLEAR':
                    const ticker = document.getElementById('tickerContent');
                    ticker.innerHTML = '';
                    break;
                case 'BRIGHTNESS':
                    this.brightnessHigh = isActive;
                    this.updateCRTShader();
                    break;
                case 'SCAN_LINES':
                    this.linesEnabled = isActive;
                    document.querySelector('.scanlines').style.opacity = isActive ? '0.04' : '0';
                    break;
                case 'DISTORTION':
                    this.distortionActive = isActive;
                    this.updateCRTShader();
                    break;
                case 'AUDIO':
                    this.audioOn = isActive;
                    break;
            }
            
            this.playAudio(actionName.toLowerCase());
        });
    }
    
    setupRotaryDial() {
        const dial = document.querySelector('.rotary-dial');
        let startAngle = 45;
        
        dial.addEventListener('mousedown', (e) => this.handleDialStart(e, startAngle));
        dial.addEventListener('touchstart', (e) => this.handleDialStart(e, startAngle));
        
        document.addEventListener('mousemove', (e) => this.handleDialMove(e, startAngle));
        document.addEventListener('touchmove', (e) => this.handleDialMove(e, startAngle));
        
        document.addEventListener('mouseup', () => this.handleDialEnd());
        document.addEventListener('touchend', () => this.handleDialEnd());
    }
    
    handleDialStart(e, startAngle) {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
        startAngle = angle;
    }
    
    handleDialMove(e, startAngle) {
        if (!this.dialActive) return;
        e.preventDefault();
        
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
        const delta = angle - startAngle;
        
        if (Math.abs(delta) > 15) {
            this.rotateNavigation(delta > 0);
            startAngle = angle;
        }
    }
    
    handleDialEnd() {
        this.dialActive = false;
    }
    
    rotateNavigation(direction) {
        const sections = ['file-manager', 'tape-drive', 'system-log', 'settings'];
        const currentIndex = sections.indexOf(this.currentSection);
        const nextIndex = direction > 0 
            ? (currentIndex + 1) % sections.length
            : (currentIndex - 1 + sections.length) % sections.length;
        
        this.switchSection(sections[nextIndex]);
        this.playAudio('navigate');
    }
    
    switchSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        this.currentSection = sectionId;
        this.updateStatusIndicator();
    }
    
    selectFile(fileName) {
        const icons = ['📄', '📊', '🔧', '⚡', '💾', '📦'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        this.addSystemMessage(`FILE SELECTED: ${fileName} ${randomIcon}`);
        
        // Animate file selection
        const fileItem = document.querySelector(`[data-file="${fileName}"]`);
        if (fileItem) {
            fileItem.style.transform = 'scale(1.05)';
            setTimeout(() => {
                fileItem.style.transform = '';
            }, 300);
        }
    }
    
    startTapeAnimation() {
        if (this.tapeInterval) return;
        
        this.tapeInterval = setInterval(() => {
            if (this.tapePosition >= 100) {
                this.tapePosition = 0;
                this.addSystemMessage('TAPE REACHED END - REWINDING');
            }
            this.tapePosition += 0.5;
            document.getElementById('tapePosition').textContent = 
                `00:00:${String(Math.floor(this.tapePosition)).padStart(2, '0')}`;
        }, 100);
    }
    
    stopTapeAnimation() {
        if (this.tapeInterval) {
            clearInterval(this.tapeInterval);
            this.tapeInterval = null;
        }
    }
    
    rewindTape() {
        this.tapePosition = 0;
        document.getElementById('tapePosition').textContent = '00:00:00';
        this.addSystemMessage('TAPE REWINDING...');
        this.playAudio('rewind');
    }
    
    updateTicker() {
        const ticker = document.getElementById('tickerContent');
        const randomMessage = this.systemMessages[Math.floor(Math.random() * this.systemMessages.length)];
        
        const newItem = document.createElement('span');
        newItem.className = 'ticker-item';
        newItem.textContent = randomMessage;
        ticker.appendChild(newItem);
        
        // Remove old items to prevent overflow
        while (ticker.children.length > 10) {
            ticker.removeChild(ticker.firstChild);
        }
        
        // Schedule next update
        setTimeout(() => this.updateTicker(), 3000);
    }
    
    addSystemMessage(message) {
        const ticker = document.getElementById('tickerContent');
        const newItem = document.createElement('span');
        newItem.className = 'ticker-item';
        newItem.textContent = message;
        ticker.appendChild(newItem);
        
        while (ticker.children.length > 10) {
            ticker.removeChild(ticker.firstChild);
        }
    }
    
    startSystemClock() {
        const timeElement = document.getElementById('systemTime');
        
        const updateTime = () => {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    simulateSystemActivity() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const messages = [
                    'CPU CYCLE COMPLETED',
                    'MEMORY REFRESH CYCLE',
                    'DISK SEEK OPERATION',
                    'BUFFER FLUSH COMPLETE',
                    'INTERRUPT HANDLER EXECUTED'
                ];
                this.addSystemMessage(messages[Math.floor(Math.random() * messages.length)]);
            }
        }, 5000);
    }
    
    updateStatusIndicator() {
        const indicator = document.getElementById('statusIndicator');
        indicator.classList.remove('active');
        
        setTimeout(() => {
            indicator.classList.add('active');
        }, 100);
    }
    
    playAudio(action) {
        if (!this.audioOn) return;
        
        // Create audio context for authentic 70s sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(action) {
                case 'navigate':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'select':
                    oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;
                case 'stop':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'rewind':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
            }
        } catch (e) {
            console.log('Audio simulation skipped');
        }
    }
    
    updateCRTShader() {
        const overlay = document.querySelector('.crt-overlay');
        const scanlines = document.querySelector('.scanlines');
        
        if (this.brightnessHigh && this.distortionActive) {
            scanlines.style.opacity = '0.06';
            overlay.style.opacity = '0.3';
        } else if (this.brightnessHigh) {
            scanlines.style.opacity = '0.03';
            overlay.style.opacity = '0.15';
        } else if (this.distortionActive) {
            scanlines.style.opacity = '0.04';
            overlay.style.opacity = '0.2';
        } else {
            scanlines.style.opacity = '0.01';
            overlay.style.opacity = '0.05';
        }
    }
}

// Initialize the interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OSD70Interface();
    
    // Add some random file system activity
    setInterval(() => {
        const files = ['SYSTEM.DAT', 'USER.PROF', 'CONFIG.SYS', 'AUTOEXEC.BAT'];
        const randomFile = files[Math.floor(Math.random() * files.length)];
        document.querySelector(`[data-file="${randomFile}"]`)?.click();
    }, 15000);
});

// Handle visibility change to prevent audio spam
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not active
        const ticker = document.getElementById('tickerContent');
        if (ticker) {
            ticker.style.animationPlayState = 'paused';
        }
    } else {
        // Resume when tab becomes active
        const ticker = document.getElementById('tickerContent');
        if (ticker) {
            ticker.style.animationPlayState = 'running';
        }
    }
});