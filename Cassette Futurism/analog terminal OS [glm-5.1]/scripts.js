const MeridianOS = {
    state: {
        booted: false,
        palette: 'amber',
        currentPath: ['SYS'],
        selectedFile: null,
        tapeMode: 'stop',
        tapeCounter: 0,
        tapeIps: 0,
        dialChannel: 0,
        dialRotation: 0,
        switches: {
            write: true,
            sync: false,
            echo: true,
            lock: false,
            bell: true,
            trace: false
        },
        gaugeValues: {
            mem: 0,
            cpu: 0,
            dsk: 0,
            spd: 0
        },
        gaugeTargets: {
            mem: 45,
            cpu: 30,
            dsk: 52,
            spd: 300
        },
        commandHistory: [],
        historyIndex: -1,
        powerOn: true,
        knobAngles: {
            brightness: -30,
            contrast: 0,
            focus: 15
        }
    },

    fileSystem: {
        'SYS': {
            type: 'dir',
            children: {
                'BOOT': { ext: 'BIN', size: 4096, locked: false },
                'KERNEL': { ext: 'SYS', size: 16384, locked: true },
                'CONFIG': { ext: 'DAT', size: 2048, locked: false },
                'TELEMETRY': { ext: 'LOG', size: 8192, locked: false },
                'DRIVERS': {
                    ext: 'DIR', size: 0, locked: false, children: {
                        'DISPLAY': { ext: 'DRV', size: 6144, locked: false },
                        'INPUT': { ext: 'DRV', size: 3072, locked: false },
                        'COMM': { ext: 'DRV', size: 4096, locked: false },
                        'AUDIO': { ext: 'DRV', size: 2048, locked: false }
                    }
                }
            }
        },
        'DATA': {
            type: 'dir',
            children: {
                'STARMPC': { ext: 'DAT', size: 65536, locked: true },
                'NAVLOG': { ext: 'LOG', size: 32768, locked: false },
                'CREWLOG': { ext: 'TXT', size: 12288, locked: false },
                'SENSORS': {
                    ext: 'DIR', size: 0, locked: false, children: {
                        'THERMAL': { ext: 'DAT', size: 8192, locked: false },
                        'PRESSURE': { ext: 'DAT', size: 4096, locked: false },
                        'RADIATION': { ext: 'DAT', size: 16384, locked: true }
                    }
                },
                'ARCHIVE': {
                    ext: 'DIR', size: 0, locked: false, children: {
                        'MISSION01': { ext: 'REC', size: 131072, locked: false },
                        'MISSION02': { ext: 'REC', size: 98304, locked: false }
                    }
                }
            }
        },
        'PROG': {
            type: 'dir',
            children: {
                'NAVIGATE': { ext: 'PRG', size: 12288, locked: false },
                'LIFESUP': { ext: 'BIN', size: 32768, locked: true },
                'COMPUTE': { ext: 'PRG', size: 20480, locked: false },
                'DIAGNOST': { ext: 'PRG', size: 8192, locked: false },
                'UTILITY': {
                    ext: 'DIR', size: 0, locked: false, children: {
                        'FORMAT': { ext: 'PRG', size: 4096, locked: false },
                        'BACKUP': { ext: 'PRG', size: 6144, locked: false },
                        'RESTORE': { ext: 'PRG', size: 6144, locked: false }
                    }
                }
            }
        },
        'COMM': {
            type: 'dir',
            children: {
                'COMMAND': { ext: 'TXT', size: 1024, locked: true },
                'UPLINK': { ext: 'CFG', size: 2048, locked: true },
                'DOWNLINK': { ext: 'CFG', size: 2048, locked: false },
                'FREQLIST': { ext: 'DAT', size: 4096, locked: false },
                'PROTOCOL': {
                    ext: 'DIR', size: 0, locked: false, children: {
                        'HANDSHAKE': { ext: 'BIN', size: 2048, locked: false },
                        'ENCRYPT': { ext: 'BIN', size: 8192, locked: true }
                    }
                }
            }
        }
    },

    bootMessages: [
        'MERIDIAN OS v3.7.2 — MAGNETIC SYSTEMS CORP.',
        '═══════════════════════════════════════════════',
        '',
        'INITIALIZING HARDWARE SUBSYSTEMS...',
        '  ▸ CORE MEMORY CHECK.......... 262144 BYTES OK',
        '  ▸ MAGNETIC TAPE UNIT......... ONLINE',
        '  ▸ CRT PHOSPHOR WARMUP....... NOMINAL',
        '  ▸ ROTARY CHANNEL SELECTOR.... CALIBRATED',
        '  ▸ ANALOG INSTRUMENT CLUSTER.. OPERATIONAL',
        '',
        'LOADING KERNEL MODULES...',
        '  ▸ KERNEL.SYS................ LOADED @ 0x0000',
        '  ▸ DISPLAY.DRV............... LOADED @ 0x4000',
        '  ▸ INPUT.DRV................. LOADED @ 0x5800',
        '  ▸ COMM.DRV.................. LOADED @ 0x6000',
        '  ▸ AUDIO.DRV................. LOADED @ 0x7000',
        '',
        'MOUNTING FILE SYSTEMS...',
        '  ▸ DSK0: /SYS................ MOUNTED RW',
        '  ▸ DSK0: /DATA............... MOUNTED RW',
        '  ▸ DSK0: /PROG............... MOUNTED RO',
        '  ▸ DSK0: /COMM............... MOUNTED RO',
        '',
        'SYSTEM INTEGRITY CHECK........ PASSED',
        'ALL SUBSYSTEMS NOMINAL',
        '',
        '═══════════════════════════════════════════════',
        'MERIDIAN OS READY — TERMINAL ACTIVE',
        ''
    ],

    init: function() {
        this.cacheElements();
        this.runBootSequence();
    },

    cacheElements: function() {
        this.el = {
            bootOverlay: document.getElementById('bootOverlay'),
            bootText: document.getElementById('bootText'),
            bootCursor: document.getElementById('bootCursor'),
            osInterface: document.getElementById('osInterface'),
            sysClock: document.getElementById('sysClock'),
            currentPath: document.getElementById('currentPath'),
            fileList: document.getElementById('fileList'),
            fileCount: document.getElementById('fileCount'),
            diskUsage: document.getElementById('diskUsage'),
            diskFree: document.getElementById('diskFree'),
            tapeStatus: document.getElementById('tapeStatus'),
            reelLeft: document.getElementById('reelLeft'),
            reelRight: document.getElementById('reelRight'),
            tapeStrand: document.getElementById('tapeStrand'),
            headGap: document.getElementById('headGap'),
            headSolenoid: document.getElementById('headSolenoid'),
            tapeCounter: document.getElementById('tapeCounter'),
            tapeIps: document.getElementById('tapeIps'),
            tapeReelPos: document.getElementById('tapeReelPos'),
            rotaryDial: document.getElementById('rotaryDial'),
            dialReadout: document.getElementById('dialReadout'),
            tickerPaper: document.getElementById('tickerPaper'),
            tickerClear: document.getElementById('tickerClear'),
            commandInput: document.getElementById('commandInput'),
            commandCursor: document.getElementById('commandCursor'),
            promptPath: document.getElementById('promptPath'),
            powerSwitch: document.getElementById('powerSwitch'),
            powerLed: document.getElementById('powerLed'),
            resetBtn: document.getElementById('resetBtn'),
            ledOnline: document.getElementById('ledOnline'),
            ledLink: document.getElementById('ledLink'),
            ledError: document.getElementById('ledError'),
            ledTape: document.getElementById('ledTape'),
            knobBrightness: document.getElementById('knobBrightness'),
            knobContrast: document.getElementById('knobContrast'),
            knobFocus: document.getElementById('knobFocus')
        };
    },

    runBootSequence: function() {
        var self = this;
        var textEl = this.el.bootText;
        var cursorEl = this.el.bootCursor;
        var messages = this.bootMessages;
        var currentLine = 0;
        var currentChar = 0;
        var fullText = '';

        function typeLine() {
            if (currentLine >= messages.length) {
                setTimeout(function() {
                    self.el.bootOverlay.classList.add('fade-out');
                    setTimeout(function() {
                        self.el.bootOverlay.style.display = 'none';
                        self.state.booted = true;
                        self.startSystem();
                    }, 800);
                }, 400);
                return;
            }

            var line = messages[currentLine];

            if (currentChar < line.length) {
                fullText += line[currentChar];
                textEl.textContent = fullText;
                currentChar++;
                var delay = line[currentChar - 1] === '═' ? 15 : 
                           line[currentChar - 1] === '.' ? 30 : 
                           line[currentChar - 1] === '▸' ? 60 : 18;
                setTimeout(typeLine, delay);
            } else {
                fullText += '\n';
                textEl.textContent = fullText;
                currentLine++;
                currentChar = 0;
                var lineDelay = messages[currentLine - 1] === '' ? 80 : 
                               messages[currentLine - 1].startsWith('  ▸') ? 60 : 120;
                setTimeout(typeLine, lineDelay);
            }

            cursorEl.style.top = (textEl.offsetHeight - 10) + 'px';
            cursorEl.style.left = 'auto';
        }

        setTimeout(typeLine, 600);
    },

    startSystem: function() {
        this.startClock();
        this.initGauges();
        this.startGaugeSimulation();
        this.renderFileList();
        this.bindFileEvents();
        this.bindTapeControls();
        this.bindRotaryDial();
        this.bindToggleSwitches();
        this.bindPaletteSwitcher();
        this.bindCommandLine();
        this.bindPowerControls();
        this.bindMonitorKnobs();
        this.bindToolbarActions();
        this.bindTickerClear();
        this.addTickerEntry('SYSTEM BOOT COMPLETE — ALL SUBSYSTEMS NOMINAL', 'success');
        this.addTickerEntry('FILE SYSTEM MOUNTED: DSK0:', 'info');
        this.addTickerEntry('MAGNETIC TAPE UNIT ONLINE', 'info');
        this.addTickerEntry('AWAITING OPERATOR INPUT...', 'info');
        this.applyKnobEffects();
        this.startLinkPulse();
        this.el.powerLed.classList.add('on');
        this.focusCommandLine();
    },

    startClock: function() {
        var self = this;
        function updateClock() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var s = String(now.getSeconds()).padStart(2, '0');
            self.el.sysClock.textContent = h + ':' + m + ':' + s;
        }
        updateClock();
        setInterval(updateClock, 1000);
    },

    startLinkPulse: function() {
        var self = this;
        var linkLed = self.el.ledLink.querySelector('.led-bulb');
        setInterval(function() {
            linkLed.classList.add('on');
            setTimeout(function() {
                linkLed.classList.remove('on');
            }, 200);
        }, 3000 + Math.random() * 2000);
    },

    getCurrentDirectory: function() {
        var path = this.state.currentPath;
        var current = this.fileSystem;
        for (var i = 0; i < path.length; i++) {
            if (current[path[i]] && current[path[i]].children) {
                current = current[path[i]].children;
            } else if (current[path[i]]) {
                return null;
            }
        }
        return current;
    },

    renderFileList: function() {
        var dir = this.getCurrentDirectory();
        if (!dir) return;

        var fileList = this.el.fileList;
        fileList.innerHTML = '';

        var entries = Object.keys(dir);
        var totalSize = 0;
        var count = 0;

        if (this.state.currentPath.length > 1) {
            var upEntry = document.createElement('div');
            upEntry.className = 'file-entry directory';
            upEntry.dataset.name = '..';
            upEntry.dataset.type = 'dir';
            upEntry.dataset.size = '0';
            upEntry.innerHTML = '<span class="file-icon">▣</span>' +
                '<span class="file-name">..</span>' +
                '<span class="file-ext">DIR</span>' +
                '<span class="file-size">──</span>';
            fileList.appendChild(upEntry);
        }

        var dirs = [];
        var files = [];

        for (var i = 0; i < entries.length; i++) {
            var name = entries[i];
            var entry = dir[name];
            if (entry.children || entry.ext === 'DIR') {
                dirs.push(name);
            } else {
                files.push(name);
            }
        }

        dirs.sort();
        files.sort();

        for (var i = 0; i < dirs.length; i++) {
            var name = dirs[i];
            var entry = dir[name];
            this.createFileEntry(name, entry, 'dir', fileList);
            count++;
        }

        for (var i = 0; i < files.length; i++) {
            var name = files[i];
            var entry = dir[name];
            totalSize += entry.size || 0;
            count++;
            this.createFileEntry(name, entry, 'file', fileList);
        }

        this.el.fileCount.textContent = count + ' ITEMS';
        this.el.diskUsage.textContent = 'USED: ' + this.formatSize(totalSize);
        this.el.diskFree.textContent = 'FREE: 128K';

        var pathStr = this.state.currentPath.join('/');
        this.el.currentPath.textContent = pathStr;
        this.el.promptPath.textContent = 'DSK0:/' + pathStr;
    },

    createFileEntry: function(name, entry, type, container) {
        var div = document.createElement('div');
        var isDir = type === 'dir';
        var isLocked = entry.locked === true;

        div.className = 'file-entry ' + (isDir ? 'directory' : 'file') + (isLocked ? ' locked' : '');
        div.dataset.name = name;
        div.dataset.type = isDir ? 'dir' : 'file';
        div.dataset.ext = entry.ext || '';
        div.dataset.size = String(entry.size || 0);

        var icon = isDir ? '▣' : (isLocked ? '▦' : '▤');
        var ext = isDir ? 'DIR' : entry.ext;
        var size = isDir ? '──' : this.formatSize(entry.size);

        div.innerHTML = '<span class="file-icon">' + icon + '</span>' +
            '<span class="file-name">' + name + '</span>' +
            '<span class="file-ext">' + ext + '</span>' +
            '<span class="file-size">' + size + '</span>';

        container.appendChild(div);
    },

    formatSize: function(bytes) {
        if (!bytes || bytes === 0) return '0';
        if (bytes >= 1024 && bytes < 1048576) return Math.round(bytes / 1024) + 'K';
        if (bytes >= 1048576) return Math.round(bytes / 1024 / 1024) + 'M';
        return String(bytes);
    },

    bindFileEvents: function() {
        var self = this;
        var fileList = this.el.fileList;

        fileList.addEventListener('click', function(e) {
            var entry = e.target.closest('.file-entry');
            if (!entry) return;

            var allEntries = fileList.querySelectorAll('.file-entry');
            for (var i = 0; i < allEntries.length; i++) {
                allEntries[i].classList.remove('selected');
            }
            entry.classList.add('selected');
            self.state.selectedFile = entry.dataset.name;
        });

        fileList.addEventListener('dblclick', function(e) {
            var entry = e.target.closest('.file-entry');
            if (!entry) return;

            if (entry.dataset.type === 'dir') {
                var name = entry.dataset.name;
                if (name === '..') {
                    self.navigateUp();
                } else {
                    self.navigateInto(name);
                }
            } else {
                self.openFile(entry.dataset.name, entry.dataset.ext);
            }
        });
    },

    navigateInto: function(dirName) {
        this.state.currentPath.push(dirName);
        this.state.selectedFile = null;
        this.renderFileList();
        this.addTickerEntry('CHDIR → DSK0:/' + this.state.currentPath.join('/'), 'info');
        this.simulateDiskActivity();
    },

    navigateUp: function() {
        if (this.state.currentPath.length > 1) {
            this.state.currentPath.pop();
            this.state.selectedFile = null;
            this.renderFileList();
            this.addTickerEntry('CHDIR → DSK0:/' + this.state.currentPath.join('/'), 'info');
        }
    },

    openFile: function(name, ext) {
        var isLocked = this.isFileLocked(name);
        if (isLocked) {
            this.addTickerEntry('ACCESS DENIED: ' + name + '.' + ext + ' — FILE LOCKED', 'error');
            this.flashErrorLed();
            return;
        }
        this.addTickerEntry('LOADING: ' + name + '.' + ext, 'info');
        this.simulateTapeOperation('play', 2000);
    },

    isFileLocked: function(name) {
        var dir = this.getCurrentDirectory();
        if (dir[name]) {
            return dir[name].locked === true;
        }
        return false;
    },

    flashErrorLed: function() {
        var self = this;
        var errLed = this.el.ledError.querySelector('.led-bulb');
        errLed.classList.add('on-red');
        setTimeout(function() {
            errLed.classList.remove('on-red');
        }, 1500);
    },

    bindToolbarActions: function() {
        var self = this;
        var toolbar = document.querySelector('.file-toolbar');

        toolbar.addEventListener('click', function(e) {
            var btn = e.target.closest('.toolbar-btn');
            if (!btn) return;

            var action = btn.dataset.action;

            switch(action) {
                case 'up':
                    self.navigateUp();
                    break;
                case 'refresh':
                    self.renderFileList();
                    self.addTickerEntry('DIRECTORY SYNC COMPLETE', 'success');
                    self.simulateDiskActivity();
                    break;
                case 'copy':
                    if (self.state.selectedFile) {
                        self.addTickerEntry('COPY: ' + self.state.selectedFile + ' → TAPE BUFFER', 'info');
                        self.simulateTapeOperation('record', 1500);
                    } else {
                        self.addTickerEntry('NO FILE SELECTED FOR COPY', 'warning');
                    }
                    break;
                case 'delete':
                    if (self.state.selectedFile) {
                        if (self.isFileLocked(self.state.selectedFile)) {
                            self.addTickerEntry('CANNOT DELETE: FILE LOCKED', 'error');
                            self.flashErrorLed();
                        } else {
                            self.addTickerEntry('DELETE: ' + self.state.selectedFile + ' — CONFIRM REQUIRED', 'warning');
                            self.simulateTapeOperation('rewind', 800);
                        }
                    } else {
                        self.addTickerEntry('NO FILE SELECTED FOR DELETION', 'warning');
                    }
                    break;
                case 'eject':
                    self.addTickerEntry('TAPE UNIT EJECTED — REMOVE REEL', 'warning');
                    self.simulateTapeOperation('stop', 500);
                    break;
            }
        });
    },

    bindTapeControls: function() {
        var self = this;
        var controls = document.querySelector('.tape-controls');

        controls.addEventListener('click', function(e) {
            var btn = e.target.closest('.tape-btn');
            if (!btn) return;

            var mode = btn.dataset.tape;
            self.setTapeMode(mode);
        });
    },

    setTapeMode: function(mode) {
        var prevMode = this.state.tapeMode;
        this.state.tapeMode = mode;

        var allBtns = document.querySelectorAll('.tape-btn');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].classList.remove('active');
            if (allBtns[i].dataset.tape === mode) {
                allBtns[i].classList.add('active');
            }
        }

        var reelSpeed;
        var ipsValue;
        var statusText;

        switch(mode) {
            case 'play':
                reelSpeed = '1.5s';
                ipsValue = '7.5';
                statusText = 'PLAY';
                break;
            case 'rewind':
                reelSpeed = '0.4s';
                ipsValue = '30.0';
                statusText = 'REWIND';
                break;
            case 'stop':
                reelSpeed = '0s';
                ipsValue = '0.0';
                statusText = 'IDLE';
                break;
            case 'fastforward':
                reelSpeed = '0.3s';
                ipsValue = '45.0';
                statusText = 'FAST FWD';
                break;
            case 'record':
                reelSpeed = '1.5s';
                ipsValue = '7.5';
                statusText = 'RECORD';
                break;
            default:
                reelSpeed = '0s';
                ipsValue = '0.0';
                statusText = 'IDLE';
        }

        document.documentElement.style.setProperty('--reel-speed', reelSpeed);
        this.el.tapeIps.textContent = ipsValue;
        this.el.tapeStatus.textContent = statusText;

        if (mode !== 'stop') {
            this.el.tapeStatus.classList.add('active');
            this.el.tapeStrand.classList.add('active');
            this.el.headGap.classList.add('active');
            this.el.headSolenoid.classList.add('active');
            var tapeLed = this.el.ledTape.querySelector('.led-bulb');
            tapeLed.classList.add('on');
        } else {
            this.el.tapeStatus.classList.remove('active');
            this.el.tapeStrand.classList.remove('active');
            this.el.headGap.classList.remove('active');
            this.el.headSolenoid.classList.remove('active');
            var tapeLed = this.el.ledTape.querySelector('.led-bulb');
            tapeLed.classList.remove('on');
        }

        var direction = (mode === 'rewind') ? 'reverse' : 'normal';
        if (mode === 'rewind') {
            this.el.reelLeft.style.animationDirection = 'reverse';
            this.el.reelRight.style.animationDirection = 'reverse';
            this.el.tapeReelPos.textContent = 'R:FF';
        } else if (mode === 'fastforward') {
            this.el.reelLeft.style.animationDirection = 'normal';
            this.el.reelRight.style.animationDirection = 'normal';
            this.el.tapeReelPos.textContent = 'L:FF';
        } else if (mode === 'play' || mode === 'record') {
            this.el.reelLeft.style.animationDirection = 'normal';
            this.el.reelRight.style.animationDirection = 'normal';
            this.el.tapeReelPos.textContent = 'L:PL';
        } else {
            this.el.tapeReelPos.textContent = '──';
        }

        if (prevMode === 'stop' && mode !== 'stop') {
            this.addTickerEntry('TAPE UNIT: ' + statusText + ' ENGAGED', 'info');
        } else if (mode === 'stop' && prevMode !== 'stop') {
            this.addTickerEntry('TAPE UNIT: STOPPED', 'info');
        }
    },

    simulateTapeOperation: function(mode, duration) {
        var self = this;
        this.setTapeMode(mode);
        setTimeout(function() {
            self.setTapeMode('stop');
            self.addTickerEntry('TAPE OPERATION COMPLETE', 'success');
        }, duration);
    },

    simulateDiskActivity: function() {
        var self = this;
        this.state.gaugeTargets.dsk = 70 + Math.random() * 25;
        setTimeout(function() {
            self.state.gaugeTargets.dsk = 30 + Math.random() * 30;
        }, 1500);
    },

    startTapeCounter: function() {
        var self = this;
        setInterval(function() {
            if (self.state.tapeMode === 'stop') return;

            var increment = 0;
            switch(self.state.tapeMode) {
                case 'play':
                case 'record':
                    increment = 3;
                    break;
                case 'rewind':
                    increment = -8;
                    break;
                case 'fastforward':
                    increment = 12;
                    break;
            }

            self.state.tapeCounter += increment;
            if (self.state.tapeCounter < 0) self.state.tapeCounter = 9999;
            if (self.state.tapeCounter > 9999) self.state.tapeCounter = 0;

            self.el.tapeCounter.textContent = String(self.state.tapeCounter).padStart(4, '0');
        }, 200);
    },

    initGauges: function() {
        var gauges = ['gaugeMem', 'gaugeCpu', 'gaugeDsk', 'gaugeSpd'];
        for (var i = 0; i < gauges.length; i++) {
            var gaugeId = gauges[i];
            var svg = document.getElementById(gaugeId).querySelector('.gauge-svg');

            var startAngle = -135;
            var endAngle = 135;
            var radius = 50;
            var cx = 70;
            var cy = 70;

            var trackStart = this.polarToCartesian(cx, cy, radius, startAngle);
            var trackEnd = this.polarToCartesian(cx, cy, radius, endAngle);
            var trackLargeArc = endAngle - startAngle > 180 ? 1 : 0;

            var trackD = 'M ' + trackStart.x + ' ' + trackStart.y + ' ' +
                'A ' + radius + ' ' + radius + ' 0 ' + trackLargeArc + ' 1 ' + trackEnd.x + ' ' + trackEnd.y;

            var trackArc = svg.querySelector('.gauge-track-arc');
            trackArc.setAttribute('d', trackD);

            var fillArc = svg.querySelector('.gauge-fill-arc');
            fillArc.setAttribute('d', trackD);

            var needle = svg.querySelector('.gauge-needle');
            needle.style.transformOrigin = '70px 70px';
            needle.style.transform = 'rotate(' + startAngle + 'deg)';
        }
    },

    polarToCartesian: function(cx, cy, radius, angleDeg) {
        var angleRad = (angleDeg - 90) * Math.PI / 180;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad)
        };
    },

    startGaugeSimulation: function() {
        var self = this;

        setInterval(function() {
            self.state.gaugeTargets.mem = 35 + Math.random() * 45;
            self.state.gaugeTargets.cpu = 15 + Math.random() * 60;
            self.state.gaugeTargets.spd = 150 + Math.random() * 850;

            if (self.state.tapeMode !== 'stop') {
                self.state.gaugeTargets.cpu += 20;
            }
        }, 3000);

        function animateGauges() {
            var keys = ['mem', 'cpu', 'dsk', 'spd'];
            var gaugeIds = ['gaugeMem', 'gaugeCpu', 'gaugeDsk', 'gaugeSpd'];
            var maxVals = [100, 100, 100, 1200];

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var current = self.state.gaugeValues[key];
                var target = self.state.gaugeTargets[key];
                var diff = target - current;
                self.state.gaugeValues[key] += diff * 0.08;

                var value = self.state.gaugeValues[key];
                var maxVal = maxVals[i];
                var percent = Math.max(0, Math.min(1, value / maxVal));

                var startAngle = -135;
                var totalAngle = 270;
                var needleAngle = startAngle + percent * totalAngle;

                var gaugeEl = document.getElementById(gaugeIds[i]);
                var needle = gaugeEl.querySelector('.gauge-needle');
                needle.style.transform = 'rotate(' + needleAngle + 'deg)';

                var fillArc = gaugeEl.querySelector('.gauge-fill-arc');
                var fillAngle = startAngle + percent * totalAngle;
                var cx = 70;
                var cy = 70;
                var radius = 50;

                var fillStart = self.polarToCartesian(cx, cy, radius, startAngle);
                var fillEnd = self.polarToCartesian(cx, cy, radius, fillAngle);
                var fillLargeArc = (fillAngle - startAngle) > 180 ? 1 : 0;

                var fillD = 'M ' + fillStart.x + ' ' + fillStart.y + ' ' +
                    'A ' + radius + ' ' + radius + ' 0 ' + fillLargeArc + ' 1 ' + fillEnd.x + ' ' + fillEnd.y;
                fillArc.setAttribute('d', fillD);

                var valueText = gaugeEl.querySelector('.gauge-value-text');
                if (key === 'spd') {
                    valueText.textContent = Math.round(value);
                } else {
                    valueText.textContent = Math.round(value) + '%';
                }
            }

            requestAnimationFrame(animateGauges);
        }

        animateGauges();
        this.startTapeCounter();
    },

    bindRotaryDial: function() {
        var self = this;
        var dialHoles = document.querySelectorAll('.dial-hole');
        var dial = this.el.rotaryDial;

        for (var i = 0; i < dialHoles.length; i++) {
            dialHoles[i].addEventListener('click', function() {
                var channel = parseInt(this.dataset.channel);
                self.dialChannel(channel);
            });
        }
    },

    dialChannel: function(channel) {
        var self = this;
        var dial = this.el.rotaryDial;
        var rotation = channel * 30;

        dial.style.transform = 'rotate(' + rotation + 'deg)';

        this.el.dialReadout.textContent = 'CH: ' + String(channel).padStart(2, '0');
        this.state.dialChannel = channel;

        this.addTickerEntry('CHANNEL SELECTED: ' + channel, 'info');

        this.state.gaugeTargets.spd = 100 + channel * 100;

        if (channel > 0) {
            this.state.gaugeTargets.cpu = Math.min(95, 30 + channel * 8);
        }

        var linkLed = this.el.ledLink.querySelector('.led-bulb');
        linkLed.classList.add('on');
        setTimeout(function() {
            linkLed.classList.remove('on');
        }, 800);
    },

    bindToggleSwitches: function() {
        var self = this;

        document.querySelector('.toggle-bank').addEventListener('click', function(e) {
            var toggle = e.target.closest('.toggle-switch');
            if (!toggle) return;

            var switchName = toggle.dataset.switch;
            var isOn = toggle.classList.contains('on');

            toggle.classList.toggle('on');
            self.state.switches[switchName] = !isOn;

            var newState = !isOn;
            var labelBottom = toggle.querySelector('.toggle-label-bottom');
            labelBottom.textContent = newState ? 'ON' : 'OFF';

            self.addTickerEntry('SWITCH ' + switchName.toUpperCase() + ': ' + (newState ? 'ENGAGED' : 'DISENGAGED'), newState ? 'success' : 'info');

            if (switchName === 'lock') {
                if (newState) {
                    self.addTickerEntry('FILE LOCK ACTIVE — WRITE OPERATIONS BLOCKED', 'warning');
                } else {
                    self.addTickerEntry('FILE LOCK RELEASED', 'info');
                }
            }

            if (switchName === 'sync') {
                if (newState) {
                    self.addTickerEntry('SYNC MODE ENABLED — DIRECTORY AUTO-REFRESH ON', 'success');
                    self.simulateDiskActivity();
                } else {
                    self.addTickerEntry('SYNC MODE DISABLED', 'info');
                }
            }

            if (switchName === 'trace') {
                if (newState) {
                    self.addTickerEntry('TRACE LOGGING ENABLED — VERBOSE OUTPUT ACTIVE', 'warning');
                } else {
                    self.addTickerEntry('TRACE LOGGING DISABLED', 'info');
                }
            }

            if (switchName === 'bell' && newState) {
                self.addTickerEntry('♪ BELL TEST — AUDIBLE ALERT ACTIVE', 'success');
            }
        });
    },

    bindPaletteSwitcher: function() {
        var self = this;
        var btns = document.querySelectorAll('.palette-btn');

        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function() {
                var palette = this.dataset.palette;
                self.setPalette(palette);
            });
        }
    },

    setPalette: function(palette) {
        this.state.palette = palette;

        if (palette === 'green') {
            document.body.classList.add('green-palette');
        } else {
            document.body.classList.remove('green-palette');
        }

        var btns = document.querySelectorAll('.palette-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.toggle('active', btns[i].dataset.palette === palette);
        }

        this.addTickerEntry('PHOSPHOR MODE: ' + palette.toUpperCase(), 'info');
    },

    bindCommandLine: function() {
        var self = this;
        var input = this.el.commandInput;

        document.querySelector('.command-section').addEventListener('click', function() {
            input.focus();
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                var cmd = input.value.trim().toUpperCase();
                if (cmd) {
                    self.executeCommand(cmd);
                    self.state.commandHistory.push(cmd);
                    self.state.historyIndex = self.state.commandHistory.length;
                    input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (self.state.historyIndex > 0) {
                    self.state.historyIndex--;
                    input.value = self.state.commandHistory[self.state.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (self.state.historyIndex < self.state.commandHistory.length - 1) {
                    self.state.historyIndex++;
                    input.value = self.state.commandHistory[self.state.historyIndex];
                } else {
                    self.state.historyIndex = self.state.commandHistory.length;
                    input.value = '';
                }
            }
        });

        this.focusCommandLine();
    },

    focusCommandLine: function() {
        this.el.commandInput.focus();
    },

    executeCommand: function(cmd) {
        var parts = cmd.split(/\s+/);
        var command = parts[0];
        var args = parts.slice(1);

        this.addTickerEntry('CMD: ' + cmd, 'info');

        switch(command) {
            case 'DIR':
            case 'LS':
                this.renderFileList();
                this.addTickerEntry('DIRECTORY LISTED: ' + this.state.currentPath.join('/'), 'success');
                this.simulateDiskActivity();
                break;

            case 'CD':
            case 'CHDIR':
                if (args.length === 0) {
                    this.addTickerEntry('CURRENT: DSK0:/' + this.state.currentPath.join('/'), 'info');
                } else if (args[0] === '..' || args[0] === '\\') {
                    this.navigateUp();
                } else {
                    var target = args[0];
                    var dir = this.getCurrentDirectory();
                    if (dir[target] && (dir[target].children || dir[target].ext === 'DIR')) {
                        this.navigateInto(target);
                    } else {
                        this.addTickerEntry('DIRECTORY NOT FOUND: ' + target, 'error');
                        this.flashErrorLed();
                    }
                }
                break;

            case 'VER':
            case 'VERSION':
                this.addTickerEntry('MERIDIAN OS VERSION 3.7.2 — BUILD 4851', 'info');
                this.addTickerEntry('MAGNETIC SYSTEMS CORP. — ALL RIGHTS RESERVED', 'info');
                break;

            case 'HELP':
                this.addTickerEntry('AVAILABLE COMMANDS:', 'info');
                this.addTickerEntry('  DIR       — LIST DIRECTORY CONTENTS', 'info');
                this.addTickerEntry('  CD <DIR>  — CHANGE DIRECTORY', 'info');
                this.addTickerEntry('  VER       — DISPLAY OS VERSION', 'info');
                this.addTickerEntry('  CLR       — CLEAR LOG', 'info');
                this.addTickerEntry('  MEM       — MEMORY STATUS', 'info');
                this.addTickerEntry('  TYPE<F>   — DISPLAY FILE CONTENTS', 'info');
                this.addTickerEntry('  TAPE<MODE>— SET TAPE MODE (PLAY/STOP/REW)', 'info');
                this.addTickerEntry('  PAL<MODE> — PHOSPHOR (AMBER/GREEN)', 'info');
                this.addTickerEntry('  CH<N>     — SELECT CHANNEL (0-9)', 'info');
                this.addTickerEntry('  HELP      — THIS HELP SCREEN', 'info');
                break;

            case 'CLR':
            case 'CLEAR':
                this.el.tickerPaper.innerHTML = '';
                this.addTickerEntry('LOG CLEARED', 'success');
                break;

            case 'MEM':
            case 'MEMORY':
                this.addTickerEntry('CORE MEMORY: 262144 BYTES', 'info');
                this.addTickerEntry('  USED: ' + Math.round(this.state.gaugeValues.mem * 2621) + ' BYTES', 'info');
                this.addTickerEntry('  FREE: ' + Math.round((100 - this.state.gaugeValues.mem) * 2621) + ' BYTES', 'info');
                break;

            case 'TYPE':
                if (args.length === 0) {
                    this.addTickerEntry('USAGE: TYPE <FILENAME>', 'warning');
                } else {
                    var fileName = args[0];
                    var dir = this.getCurrentDirectory();
                    if (dir[fileName]) {
                        if (dir[fileName].locked) {
                            this.addTickerEntry('ACCESS DENIED: ' + fileName + ' — FILE LOCKED', 'error');
                            this.flashErrorLed();
                        } else {
                            this.addTickerEntry('READING: ' + fileName + '.' + dir[fileName].ext, 'info');
                            this.simulateTapeOperation('play', 2000);
                            var self = this;
                            setTimeout(function() {
                                self.addTickerEntry('FILE CONTENT DISPLAYED ON OUTPUT BUFFER', 'success');
                            }, 2200);
                        }
                    } else {
                        this.addTickerEntry('FILE NOT FOUND: ' + fileName, 'error');
                        this.flashErrorLed();
                    }
                }
                break;

            case 'TAPE':
                if (args.length === 0) {
                    this.addTickerEntry('USAGE: TAPE <PLAY|STOP|REW|FF|REC>', 'warning');
                } else {
                    var mode = args[0].toLowerCase();
                    if (['play', 'stop', 'rewind', 'fastforward', 'record'].indexOf(mode) !== -1) {
                        if (mode === 'rew') mode = 'rewind';
                        if (mode === 'ff') mode = 'fastforward';
                        if (mode === 'rec') mode = 'record';
                        this.setTapeMode(mode);
                    } else {
                        this.addTickerEntry('UNKNOWN TAPE MODE: ' + args[0], 'error');
                    }
                }
                break;

            case 'PAL':
                if (args.length === 0) {
                    this.addTickerEntry('USAGE: PAL <AMBER|GREEN>', 'warning');
                } else {
                    this.setPalette(args[0].toLowerCase());
                }
                break;

            case 'CH':
                if (args.length === 0) {
                    this.addTickerEntry('CURRENT CHANNEL: ' + this.state.dialChannel, 'info');
                } else {
                    var ch = parseInt(args[0]);
                    if (!isNaN(ch) && ch >= 0 && ch <= 9) {
                        this.dialChannel(ch);
                    } else {
                        this.addTickerEntry('INVALID CHANNEL (0-9)', 'error');
                    }
                }
                break;

            default:
                this.addTickerEntry('UNKNOWN COMMAND: ' + command, 'error');
                this.flashErrorLed();
                this.addTickerEntry('TYPE "HELP" FOR AVAILABLE COMMANDS', 'warning');
        }
    },

    addTickerEntry: function(message, type) {
        var paper = this.el.tickerPaper;
        var entry = document.createElement('div');
        entry.className = 'ticker-entry' + (type ? ' ' + type : '');

        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        var timestamp = h + ':' + m + ':' + s;

        entry.innerHTML = '<span class="timestamp">[' + timestamp + ']</span><span class="message">' + message + '</span>';
        paper.appendChild(entry);
        paper.scrollTop = paper.scrollHeight;

        while (paper.children.length > 50) {
            paper.removeChild(paper.firstChild);
        }
    },

    bindTickerClear: function() {
        var self = this;
        this.el.tickerClear.addEventListener('click', function() {
            self.el.tickerPaper.innerHTML = '';
            self.addTickerEntry('HARDCOPY LOG CLEARED', 'success');
        });
    },

    bindPowerControls: function() {
        var self = this;

        this.el.powerSwitch.addEventListener('click', function() {
            self.state.powerOn = !self.state.powerOn;
            if (self.state.powerOn) {
                self.el.powerLed.classList.add('on');
                self.el.osInterface.style.opacity = '1';
                self.el.osInterface.style.filter = 'none';
                self.addTickerEntry('POWER ON — SYSTEM RESTORED', 'success');
            } else {
                self.el.powerLed.classList.remove('on');
                self.el.osInterface.style.opacity = '0.05';
                self.el.osInterface.style.filter = 'brightness(0.05)';
                self.setTapeMode('stop');
            }
        });

        this.el.resetBtn.addEventListener('click', function() {
            self.addTickerEntry('SYSTEM RESET INITIATED...', 'warning');
            self.el.osInterface.style.opacity = '0.2';

            setTimeout(function() {
                self.el.osInterface.style.opacity = '0.5';
            }, 300);

            setTimeout(function() {
                self.el.osInterface.style.opacity = '0.8';
            }, 600);

            setTimeout(function() {
                self.el.osInterface.style.opacity = '1';
                self.addTickerEntry('SYSTEM RESET COMPLETE', 'success');
                self.state.gaugeTargets.mem = 20;
                self.state.gaugeTargets.cpu = 5;
                self.state.gaugeTargets.dsk = 10;
                self.state.gaugeTargets.spd = 0;
                self.setTapeMode('stop');
                self.state.currentPath = ['SYS'];
                self.state.selectedFile = null;
                self.renderFileList();
            }, 1000);
        });
    },

    bindMonitorKnobs: function() {
        var self = this;
        var knobs = [
            { el: this.el.knobBrightness, key: 'brightness', min: -60, max: 60 },
            { el: this.el.knobContrast, key: 'contrast', min: -60, max: 60 },
            { el: this.el.knobFocus, key: 'focus', min: -60, max: 60 }
        ];

        for (var i = 0; i < knobs.length; i++) {
            (function(knob) {
                var isDragging = false;
                var startY = 0;
                var startAngle = self.state.knobAngles[knob.key];

                knob.el.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    startY = e.clientY;
                    startAngle = self.state.knobAngles[knob.key];
                    e.preventDefault();
                });

                document.addEventListener('mousemove', function(e) {
                    if (!isDragging) return;
                    var deltaY = startY - e.clientY;
                    var newAngle = startAngle + deltaY * 0.8;
                    newAngle = Math.max(knob.min, Math.min(knob.max, newAngle));
                    self.state.knobAngles[knob.key] = newAngle;
                    knob.el.querySelector('.knob-pointer').style.transform = 'translateX(-50%) rotate(' + newAngle + 'deg)';
                    self.applyKnobEffects();
                });

                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });
            })(knobs[i]);
        }
    },

    applyKnobEffects: function() {
        var brightness = this.state.knobAngles.brightness;
        var contrast = this.state.knobAngles.contrast;
        var focus = this.state.knobAngles.focus;

        var brightnessValue = 1 + (brightness / 100);
        var contrastValue = 1 + (contrast / 150);
        var blurValue = Math.abs(focus) / 120;

        brightnessValue = Math.max(0.2, Math.min(1.8, brightnessValue));
        contrastValue = Math.max(0.5, Math.min(1.5, contrastValue));
        blurValue = Math.max(0, Math.min(2, blurValue));

        this.el.osInterface.style.filter =
            'brightness(' + brightnessValue + ') ' +
            'contrast(' + contrastValue + ') ' +
            'blur(' + blurValue + 'px)';

        var screen = document.querySelector('.crt-screen');
        var bloomIntensity = Math.max(0, (brightness + 60) / 120);
        screen.style.boxShadow =
            'inset 0 0 60px rgba(0,0,0,0.5), ' +
            '0 0 ' + Math.round(bloomIntensity * 30) + 'px rgba(255,170,0,' + (bloomIntensity * 0.15) + '), ' +
            '0 0 ' + Math.round(bloomIntensity * 60) + 'px rgba(255,170,0,' + (bloomIntensity * 0.05) + ')';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    MeridianOS.init();
});