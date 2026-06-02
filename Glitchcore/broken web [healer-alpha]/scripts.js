/* ============================================
   4RCH1V3_D3CAY - Digital Archaeology
   Interactive corruption engine
   ============================================ */

(function() {
    'use strict';

    // === STATE MANAGEMENT ===
    const state = {
        currentLayer: 0,
        totalLayers: 6,
        discoveredLayers: new Set([0]),
        clickCount: 0,
        startTime: Date.now(),
        isTransitioning: false,
        bsodSequence: 0,
        meltingInterval: null,
        integrityLevel: 100,
        audioEnabled: false
    };

    // === DOM REFERENCES ===
    const dom = {
        statusBar: document.getElementById('statusBar'),
        statusText: document.getElementById('statusText'),
        statusTimestamp: document.getElementById('statusTimestamp'),
        decayNav: document.getElementById('decayNav'),
        navList: document.getElementById('navList'),
        pixelDust: document.getElementById('pixelDust'),
        cursorTrail: document.getElementById('cursorTrail'),
        
        // Layer 0: Crash
        layerCrash: document.getElementById('layer-crash'),
        crashMemory: document.getElementById('crashMemory'),
        crashDismiss: document.getElementById('crashDismiss'),
        crashParticles: document.getElementById('crashParticles'),
        crashAddress: document.getElementById('crashAddress'),
        
        // Layer 1: 404
        layer404: document.getElementById('layer-404'),
        addressBar: document.getElementById('addressBar'),
        visitorCounter: document.getElementById('visitorCounter'),
        hiddenArchiveLink: document.getElementById('hiddenArchiveLink'),
        geoTypewriter: document.getElementById('geoTypewriter'),
        glitchImg: document.getElementById('glitchImg'),
        deadLinkParticles: document.getElementById('deadLinkParticles'),
        hiddenRow: document.getElementById('hiddenRow'),
        
        // Layer 2: Archive
        layerArchive: document.getElementById('layer-archive'),
        fileExplorer: document.getElementById('fileExplorer'),
        fileViewer: document.getElementById('fileViewer'),
        viewerTitle: document.getElementById('viewerTitle'),
        viewerBody: document.getElementById('viewerBody'),
        viewerClose: document.getElementById('viewerClose'),
        diskFill: document.getElementById('diskFill'),
        advanceToBSOD: document.getElementById('advanceToBSOD'),
        
        // Layer 3: BSOD
        layerBSOD: document.getElementById('layer-bsod'),
        bsodContainer: document.getElementById('bsodContainer'),
        bsod1: document.getElementById('bsod1'),
        bsod2: document.getElementById('bsod2'),
        bsod3: document.getElementById('bsod3'),
        bsod4: document.getElementById('bsod4'),
        bsod5: document.getElementById('bsod5'),
        restartFill1: document.getElementById('restartFill1'),
        restartPercent: document.getElementById('restartPercent'),
        restartFill2: document.getElementById('restartFill2'),
        restartPercent2: document.getElementById('restartPercent2'),
        bootText: document.getElementById('bootText'),
        biosText: document.getElementById('biosText'),
        biosMemCount: document.getElementById('biosMemCount'),
        dosText: document.getElementById('dosText'),
        crashCount: document.getElementById('crashCount'),
        
        // Layer 4: Melting
        layerMelting: document.getElementById('layer-melting'),
        meltingTitle: document.getElementById('meltingTitle'),
        meltingContent: document.getElementById('meltingContent'),
        integrityMeter: document.getElementById('integrityMeter'),
        integrityValue: document.getElementById('integrityValue'),
        shufflingText: document.getElementById('shufflingText'),
        advanceToRestore: document.getElementById('advanceToRestore'),
        hiddenSignal: document.getElementById('hiddenSignal'),
        
        // Layer 5: Restored
        layerRestored: document.getElementById('layer-restored'),
        restoredAmbient: document.getElementById('restoredAmbient'),
        restoredMessage: document.getElementById('restoredMessage'),
        statClicks: document.getElementById('statClicks'),
        statTime: document.getElementById('statTime'),
        statLayers: document.getElementById('statLayers'),
        btnRestart: document.getElementById('btnRestart'),
        btnSource: document.getElementById('btnSource'),
        sourceViewer: document.getElementById('sourceViewer'),
        sourceCode: document.getElementById('sourceCode'),
        sourceClose: document.getElementById('sourceClose'),
        linkCredits: document.getElementById('linkCredits'),
        linkEaster: document.getElementById('linkEaster'),
        finalEasterEgg: document.getElementById('finalEasterEgg'),
        
        // Audio
        audioToggle: document.getElementById('audioToggle')
    };

    // === UTILITY FUNCTIONS ===
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomHex(length) {
        let result = '';
        const chars = '0123456789ABCDEF';
        for (let i = 0; i < length; i++) {
            result += chars[randomInt(0, chars.length - 1)];
        }
        return result;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // === LAYER NAVIGATION ===
    function navigateToLayer(layerIndex) {
        if (state.isTransitioning || layerIndex === state.currentLayer) return;
        if (layerIndex < 0 || layerIndex >= state.totalLayers) return;
        
        state.isTransitioning = true;
        state.discoveredLayers.add(layerIndex);
        
        // Update status
        updateStatusBar(layerIndex);
        updateNavigation();
        
        // Fade out current layer
        const currentLayerEl = document.querySelector('.layer.active');
        if (currentLayerEl) {
            currentLayerEl.style.opacity = '0';
            setTimeout(() => {
                currentLayerEl.classList.remove('active');
                currentLayerEl.style.display = 'none';
                
                // Show new layer
                const newLayerEl = document.querySelector(`[data-layer="${layerIndex}"]`);
                if (newLayerEl) {
                    newLayerEl.style.display = 'flex';
                    newLayerEl.offsetHeight; // Force reflow
                    newLayerEl.classList.add('active');
                    newLayerEl.style.opacity = '1';
                    
                    state.currentLayer = layerIndex;
                    onLayerEnter(layerIndex);
                }
                
                state.isTransitioning = false;
            }, 500);
        }
    }

    function onLayerEnter(layerIndex) {
        switch(layerIndex) {
            case 0:
                initCrashLayer();
                break;
            case 1:
                init404Layer();
                break;
            case 2:
                initArchiveLayer();
                break;
            case 3:
                initBSODLayer();
                break;
            case 4:
                initMeltingLayer();
                break;
            case 5:
                initRestoredLayer();
                break;
        }
    }

    function updateStatusBar(layerIndex) {
        const layerNames = [
            'CRASH DETECTED',
            '404 GATEWAY',
            'CORRUPTED ARCHIVE',
            'SYSTEM DEATH',
            'DATA DECAY',
            'SIGNAL FOUND'
        ];
        dom.statusText.textContent = `SYS::${layerNames[layerIndex]} — LAYER ${layerIndex}/${state.totalLayers - 1}`;
    }

    function updateNavigation() {
        const layerNames = ['CRASH', '404', 'ARCHIVE', 'BSOD', 'MELT', 'RESTORE'];
        
        dom.navList.innerHTML = '';
        state.discoveredLayers.forEach(layer => {
            const li = document.createElement('li');
            li.textContent = `[${layer}] ${layerNames[layer]}`;
            li.addEventListener('click', () => navigateToLayer(layer));
            dom.navList.appendChild(li);
        });
        
        if (state.discoveredLayers.size > 1) {
            dom.decayNav.classList.add('visible');
        }
    }

    // === TIMESTAMP UPDATE ===
    function updateTimestamp() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        dom.statusTimestamp.textContent = timeStr;
    }

    // === PIXEL DUST EFFECT ===
    function initPixelDust() {
        for (let i = 0; i < 30; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.left = randomInt(0, 100) + '%';
            pixel.style.animationDelay = randomInt(0, 10) + 's';
            pixel.style.animationDuration = randomInt(8, 15) + 's';
            
            const colors = ['#00ff41', '#00ffff', '#ffb000', '#ff0040'];
            pixel.style.background = colors[randomInt(0, colors.length - 1)];
            
            dom.pixelDust.appendChild(pixel);
        }
    }

    // === CURSOR TRAIL ===
    function initCursorTrail() {
        let trailCount = 0;
        const maxTrail = 15;
        
        document.addEventListener('mousemove', (e) => {
            trailCount++;
            if (trailCount % 3 !== 0) return;
            
            const trail = document.createElement('div');
            trail.className = 'trail-pixel';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            
            const colors = ['#00ff41', '#00ff4180', '#00ff4140'];
            trail.style.background = colors[randomInt(0, colors.length - 1)];
            
            dom.cursorTrail.appendChild(trail);
            
            setTimeout(() => {
                trail.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                trail.remove();
            }, 500);
        });
    }

    // === LAYER 0: CRASH SCREEN ===
    function initCrashLayer() {
        generateMemoryDump();
        randomizeCrashAddress();
        createCrashParticles();
    }

    function generateMemoryDump() {
        let dump = '';
        for (let i = 0; i < 8; i++) {
            let line = '';
            for (let j = 0; j < 16; j++) {
                line += randomHex(2) + ' ';
            }
            dump += line.trim() + '\n';
        }
        dom.crashMemory.textContent = dump;
        
        // Animate memory corruption
        setInterval(() => {
            if (state.currentLayer !== 0) return;
            const lines = dom.crashMemory.textContent.split('\n');
            const lineIdx = randomInt(0, lines.length - 1);
            const chars = lines[lineIdx].split('');
            const charIdx = randomInt(0, chars.length - 1);
            chars[charIdx] = randomHex(1);
            lines[lineIdx] = chars.join('');
            dom.crashMemory.textContent = lines.join('\n');
        }, 200);
    }

    function randomizeCrashAddress() {
        dom.crashAddress.textContent = '0x' + randomHex(8);
    }

    function createCrashParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${randomInt(2, 6)}px;
                height: ${randomInt(2, 6)}px;
                background: ${['#00ff41', '#ff0040', '#ffb000', '#00ffff'][randomInt(0, 3)]};
                left: ${randomInt(0, 100)}%;
                top: ${randomInt(0, 100)}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: pixel-float ${randomInt(5, 15)}s linear infinite;
                animation-delay: ${randomInt(0, 5)}s;
            `;
            dom.crashParticles.appendChild(particle);
        }
    }

    // === LAYER 1: 404 / GEOCITIES ===
    function init404Layer() {
        animateVisitorCounter();
        startTypewriter();
        revealHiddenElements();
        initDeadLinkHandlers();
        animateAddressBar();
    }

    function animateVisitorCounter() {
        let count = 0;
        const target = randomInt(1337, 99999);
        const duration = 3000;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            count = Math.floor(target * easeOutQuart(progress));
            dom.visitorCounter.textContent = count.toString().padStart(6, '0');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    }

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function startTypewriter() {
        const messages = [
            "This page has been here since 1997...",
            "Under construction forever...",
            "Sign my guestbook! (if it still works)",
            "Best viewed with Netscape Navigator",
            "You are visitor #" + dom.visitorCounter.textContent,
            "Last updated: sometime in the 90s",
            "Email me! (email probably bounces)"
        ];
        
        let msgIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            if (state.currentLayer !== 1) {
                setTimeout(type, 500);
                return;
            }
            
            const currentMsg = messages[msgIndex];
            
            if (!isDeleting) {
                dom.geoTypewriter.textContent = currentMsg.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentMsg.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                dom.geoTypewriter.textContent = currentMsg.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    msgIndex = (msgIndex + 1) % messages.length;
                }
            }
            
            setTimeout(type, isDeleting ? 30 : 80);
        }
        
        type();
    }

    function revealHiddenElements() {
        // Reveal hidden nav link after clicking multiple dead links
        let deadClicks = 0;
        
        document.querySelectorAll('.dead-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                state.clickCount++;
                deadClicks++;
                
                // Create error popup effect
                createDeadLinkEffect(e);
                
                if (deadClicks >= 3) {
                    dom.hiddenArchiveLink.parentElement.classList.add('revealed');
                }
            });
        });
        
        // Hidden archive link
        if (dom.hiddenArchiveLink) {
            dom.hiddenArchiveLink.addEventListener('click', (e) => {
                e.preventDefault();
                state.clickCount++;
                navigateToLayer(2);
            });
        }
    }

    function createDeadLinkEffect(e) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: #ffffcc;
            border: 2px solid #000;
            padding: 8px 12px;
            font-family: 'Trebuchet MS', sans-serif;
            font-size: 12px;
            color: #000;
            z-index: 10000;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
            animation: crash-shake 0.3s ease-out;
            max-width: 200px;
        `;
        popup.innerHTML = '<strong>Error</strong><br>The page cannot be displayed.<br>The document has moved.<br><br><span style="color:#666; font-size:10px;">ERROR 404</span>';
        document.body.appendChild(popup);
        
        setTimeout(() => popup.remove(), 1500);
    }

    function animateAddressBar() {
        const addresses = [
            'www.geocities.com/~digital_graveyard/index.html',
            'www.geocities.com/~digital_graveyard/guestbook.html',
            'www.geocities.com/~digital_graveyard/links.html',
            'www.angelfire.com/mystery/lost_page/',
            'www.tripod.com/~forgotten_site/',
            'www.geocities.com/~digital_graveyard/ERROR_PAGE_404'
        ];
        
        let addrIndex = 0;
        
        setInterval(() => {
            if (state.currentLayer !== 1) return;
            addrIndex = (addrIndex + 1) % addresses.length;
            
            // Glitch effect during change
            dom.addressBar.style.opacity = '0.5';
            setTimeout(() => {
                dom.addressBar.textContent = addresses[addrIndex];
                dom.addressBar.style.opacity = '1';
            }, 100);
        }, 5000);
    }

    // === LAYER 2: ARCHIVE ===
    function initArchiveLayer() {
        initFileExplorer();
        animateDiskUsage();
    }

    function initFileExplorer() {
        const clickableEntries = document.querySelectorAll('.tree-entry--clickable');
        
        clickableEntries.forEach(entry => {
            entry.addEventListener('click', () => {
                state.clickCount++;
                const target = entry.dataset.target;
                openFileViewer(target);
            });
        });
        
        dom.viewerClose.addEventListener('click', closeFileViewer);
        dom.fileViewer.addEventListener('click', (e) => {
            if (e.target === dom.fileViewer) closeFileViewer();
        });
    }

    function openFileViewer(fileType) {
        const fileContents = {
            'file-melting': {
                title: 'mem0ries.txt',
                content: `========================================
MEMORIES.TXT - Personal Notes
Last Modified: 1998-07-23
========================================

Dear Diary,

Today I learned how to make text blink
on my webpage! <blink>SO COOL!</blink>

I also added a visitor counter. Currently
at 47 visitors! Mom says she's been
visiting every day to help it go up.

The webring I joined has 200 sites now.
I found so many cool pages about
astronomy and cats and MIDI music.

I wonder if anyone will read this in
the future. If you're reading this...
hello from 1998!

The internet is going to change everything.
I just know it.

- Sarah

PS: If anyone knows how to make the
background stars stop spinning, please
email me! My computer is making weird
noises when I visit my own page.`
            },
            'file-database': {
                title: 'users_leaked.db',
                content: `========================================
CORRUPTED DATABASE DUMP
users_leaked.db - PARTIAL RECOVERY
========================================

[WARNING: Data integrity compromised]
[Sectors 4451-4489: UNREADABLE]

--- RECOVERED RECORDS ---

ID  | USERNAME        | EMAIL              
--- | --------------- | ------------------
001 | webmaster_99    | bob@geocities.███
002 | cool_dude_2000  | ███@hotmail.com
003 | ~*AnGeL*~       | angel98@yah██.com
004 | MatrixFan1999   | neo@███.net
005 | soccer_star_12  | ██@aol.com
006 | DigitalDreamer  | dream@███.com
007 | sk8er_boi_420   | ███@geocities
008 | MoonlightSonata | ███@prodigy.net
009 | CryptoKid2001   | ███@excite.com
010 | xX_DarkLord_Xx  | ███@netscape.net

[... 847 MORE RECORDS CORRUPTED ...]

========================================
DUMP COMPLETE - CHECKSUM MISMATCH
========================================`
            },
            'file-email': {
                title: 'email_archive.eml',
                content: `========================================
EMAIL ARCHIVE - Recovered Messages
========================================

From: webmaster@geocities.com
To: digital_graveyard@hotmail.com
Date: 2000-01-15
Subject: Your GeoCities page

Your page "Digital Graveyard" has been
flagged for review. Please ensure all
content complies with our terms of
service. Animated backgrounds are
limited to 3 per page.

---

From: mom@aol.com  
To: sweetie@geocities.com
Date: 1999-12-28
Subject: Re: My webpage

Hi honey! I showed your website to
everyone at work. They were very
impressed! Your uncle Jerry said
it looked "like the future." 

Don't forget to update your
homework page before school.

Love, Mom

---

From: stranger_442@yahoo.com
To: webmaster@geocities.com
Date: 1999-06-12
Subject: cool site!!!

hey dude awesome page!!! check out
my site its got even more gifs
www.geocities.com/~gif_paradise/

we should trade links!!!

=== END OF RECOVERABLE MESSAGES ===
[Remainder of file corrupted]`
            },
            'file-hidden': {
                title: '.secret_vault',
                content: `========================================
          ACCESS GRANTED
        .secret_vault opened
========================================

You found the hidden file.

Most people never see this.
They click the dead links,
read the broken pages,
and move on.

But you stayed.
You explored.
You looked deeper.

This is for you.

========================================

    The internet remembers
    what we try to forget.
    
    Every 404 page is a grave.
    Every dead link is a door
    that closed.
    
    But in the spaces between,
    in the corrupted sectors,
    in the memory leaks...
    
    something persists.
    
    Not data. Not code.
    But the ghost of intention.
    The echo of someone who
    cared enough to put their
    thoughts on a page and
    send them out into the void.
    
    You are now part of that
    tradition. Explorer.
    Archaeologist. Witness.

========================================

    >> You are the signal. <<

========================================`
            }
        };

        const file = fileContents[fileType];
        if (file) {
            dom.viewerTitle.textContent = file.title;
            dom.viewerBody.textContent = file.content;
            dom.fileViewer.classList.add('open');
        }
    }

    function closeFileViewer() {
        dom.fileViewer.classList.remove('open');
    }

    function animateDiskUsage() {
        let usage = 94.7;
        setInterval(() => {
            if (state.currentLayer !== 2) return;
            usage = 94.7 + (Math.random() - 0.5) * 0.5;
            dom.diskFill.style.width = usage + '%';
        }, 2000);
    }

    // === LAYER 3: BSOD CASCADE ===
    function initBSODLayer() {
        state.bsodSequence = 0;
        startBSODSequence();
    }

    async function startBSODSequence() {
        // BSOD 1: Classic blue screen with restart bar
        await animateProgress(dom.restartFill1, dom.restartPercent, 3000);
        await sleep(500);
        
        showBSODScreen(2);
        state.crashCount.textContent = ++state.clickCount;
        
        // BSOD 2: Chkdsk
        await animateProgress(dom.restartFill2, dom.restartPercent2, 3000);
        await sleep(500);
        
        // BSOD 3: Black boot screen
        showBSODScreen(3);
        await typeBootSequence();
        await sleep(500);
        
        // BSOD 4: BIOS screen
        showBSODScreen(4);
        await animateBIOSMemory();
        await sleep(500);
        
        // BSOD 5: DOS prompt
        showBSODScreen(5);
        await typeDOSCommands();
        await sleep(1000);
        
        // Advance button becomes clickable
        createBSODAdvanceButton();
    }

    function showBSODScreen(index) {
        document.querySelectorAll('.bsod-screen').forEach(screen => {
            screen.classList.remove('bsod-screen--active');
        });
        document.getElementById('bsod' + index).classList.add('bsod-screen--active');
    }

    async function animateProgress(fillEl, percentEl, duration) {
        const steps = 100;
        const stepTime = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            // Sometimes go backwards for realism
            let progress = i;
            if (i > 20 && i < 30 && Math.random() > 0.7) {
                progress = i - randomInt(1, 5);
            }
            if (i > 70 && i < 80 && Math.random() > 0.8) {
                progress = i - randomInt(1, 3);
            }
            
            progress = Math.max(0, Math.min(100, progress));
            fillEl.style.width = progress + '%';
            percentEl.textContent = progress + '%';
            
            await sleep(stepTime);
        }
        
        fillEl.style.width = '100%';
        percentEl.textContent = '100%';
    }

    async function typeBootSequence() {
        const bootLines = [
            'BIOS Version 2.10.1999',
            'Copyright (C) 1999 Award Software, Inc.',
            '',
            'Pentium(R) III Processor  -  800MHz',
            'Memory Test:    ',
        ];
        
        let fullText = '';
        for (const line of bootLines) {
            for (const char of line) {
                fullText += char;
                dom.bootText.textContent = fullText;
                await sleep(20);
            }
            fullText += '\n';
            dom.bootText.textContent = fullText;
            await sleep(100);
        }
        
        // Memory count animation
        let memCount = 0;
        const targetMem = 524288;
        while (memCount < targetMem) {
            memCount += randomInt(1000, 5000);
            memCount = Math.min(memCount, targetMem);
            const lastLine = fullText.split('\n');
            lastLine[lastLine.length - 1] = `Memory Test: ${memCount}`;
            dom.bootText.textContent = lastLine.join('\n');
            await sleep(5);
        }
        
        fullText += '\n\nStarting Windows...\n';
        dom.bootText.textContent = fullText;
    }

    async function animateBIOSMemory() {
        let count = 0;
        const target = 262144;
        
        while (count < target) {
            count += randomInt(2048, 8192);
            count = Math.min(count, target);
            dom.biosMemCount.textContent = count;
            await sleep(10);
        }
    }

    async function typeDOSCommands() {
        const commands = [
            { prompt: 'C:\\> ', cmd: 'DIR /A', wait: 500 },
            { prompt: '', cmd: '\n Volume in drive C is SYSTEM\n Directory of C:\\\n', wait: 200 },
            { prompt: '', cmd: '03/12/1997  <DIR>     WINDOWS\n', wait: 100 },
            { prompt: '', cmd: '03/12/1997  <DIR>     PROGRAM FILES\n', wait: 100 },
            { prompt: '', cmd: '03/15/1999  <DIR>     MY DOCUMENTS\n', wait: 100 },
            { prompt: '', cmd: '03/15/1999       0    CONFIG.SYS\n', wait: 100 },
            { prompt: '', cmd: '03/15/1999  <DIR>     RECYCLED\n', wait: 200 },
            { prompt: '\nC:\\> ', cmd: 'DEL *.*', wait: 800 },
            { prompt: '', cmd: '\nAll files in directory will be deleted!\nAre you sure (Y/N)? ', wait: 300 },
            { prompt: '', cmd: 'Y', wait: 500 },
            { prompt: '', cmd: '\n\nDELETING...\n', wait: 300 },
            { prompt: '', cmd: '..............\n', wait: 500 },
            { prompt: '', cmd: '\nSYSTEM HALTED.\n', wait: 200 },
            { prompt: '\nC:\\> ', cmd: '_', wait: 0 }
        ];
        
        let fullText = '';
        
        for (const line of commands) {
            if (line.prompt) {
                fullText += line.prompt;
                dom.dosText.textContent = fullText;
            }
            
            for (const char of line.cmd) {
                fullText += char;
                dom.dosText.textContent = fullText;
                await sleep(30);
            }
            
            await sleep(line.wait);
        }
    }

    function createBSODAdvanceButton() {
        const existingBtn = document.querySelector('.bsod-advance-btn');
        if (existingBtn) return;
        
        const btn = document.createElement('button');
        btn.className = 'layer-advance-btn bsod-advance-btn';
        btn.innerHTML = '<span>CONTINUE DECAY →</span><span class="btn-sub">data_loss_imminent()</span>';
        btn.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff41;
            color: #00ff41;
            font-family: 'VT323', monospace;
            font-size: 16px;
            padding: 12px 24px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            animation: pulse-green 2s infinite;
        `;
        
        btn.addEventListener('click', () => {
            btn.remove();
            navigateToLayer(4);
        });
        
        document.getElementById('bsod5').appendChild(btn);
    }

    // === LAYER 4: MELTING ===
    function initMeltingLayer() {
        startMeltingEffect();
        startIntegrityDecay();
        initShufflingText();
        initHiddenSignal();
    }

    function startMeltingEffect() {
        const blocks = document.querySelectorAll('.melting-block');
        
        blocks.forEach((block, index) => {
            const text = block.querySelector('.melting-text');
            const speed = text.dataset.meltSpeed;
            
            const delays = { slow: 3000, medium: 2000, fast: 1000 };
            const delay = delays[speed] || 2000;
            
            setTimeout(() => {
                text.classList.add('melting');
            }, delay + index * 800);
            
            setTimeout(() => {
                text.classList.add('melted');
            }, delay * 2 + index * 800);
            
            setTimeout(() => {
                text.classList.add('decayed');
            }, delay * 3 + index * 800);
        });
    }

    function startIntegrityDecay() {
        let integrity = 100;
        
        state.meltingInterval = setInterval(() => {
            if (state.currentLayer !== 4) {
                clearInterval(state.meltingInterval);
                return;
            }
            
            integrity -= randomInt(0, 2);
            integrity = Math.max(0, integrity);
            
            dom.integrityMeter.style.width = integrity + '%';
            dom.integrityValue.textContent = integrity + '%';
            
            // Color changes as integrity drops
            if (integrity < 30) {
                dom.integrityValue.style.color = '#ff0040';
            } else if (integrity < 60) {
                dom.integrityValue.style.color = '#ffb000';
            }
            
            if (integrity <= 0) {
                clearInterval(state.meltingInterval);
            }
        }, 500);
    }

    function initShufflingText() {
        const letters = dom.shufflingText.querySelectorAll('span');
        const originalChars = Array.from(letters).map(l => l.textContent);
        
        setInterval(() => {
            if (state.currentLayer !== 4) return;
            
            // Randomly shuffle a few letters
            const indices = [];
            for (let i = 0; i < 3; i++) {
                indices.push(randomInt(0, letters.length - 1));
            }
            
            indices.forEach(idx => {
                if (originalChars[idx] !== ' ') {
                    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
                    letters[idx].textContent = glitchChars[randomInt(0, glitchChars.length - 1)];
                    
                    setTimeout(() => {
                        letters[idx].textContent = originalChars[idx];
                    }, 150);
                }
            });
        }, 300);
    }

    function initHiddenSignal() {
        let hoverCount = 0;
        
        document.addEventListener('mousemove', (e) => {
            if (state.currentLayer !== 4) return;
            
            // Show signal when mouse is in specific area
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const dist = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + 
                Math.pow(e.clientY - centerY, 2)
            );
            
            if (dist < 100) {
                hoverCount++;
                if (hoverCount > 20) {
                    dom.hiddenSignal.classList.add('revealed');
                    setTimeout(() => {
                        dom.hiddenSignal.classList.remove('revealed');
                        hoverCount = 0;
                    }, 3000);
                }
            }
        });
    }

    // === LAYER 5: RESTORED ===
    function initRestoredLayer() {
        updateStats();
        initSourceViewer();
        initEasterEgg();
    }

    function updateStats() {
        const elapsed = Date.now() - state.startTime;
        
        dom.statClicks.textContent = state.clickCount;
        dom.statTime.textContent = formatTime(elapsed);
        dom.statLayers.textContent = `${state.discoveredLayers.size}/${state.totalLayers}`;
        
        // Update time every second
        setInterval(() => {
            if (state.currentLayer === 5) {
                const elapsed = Date.now() - state.startTime;
                dom.statTime.textContent = formatTime(elapsed);
            }
        }, 1000);
    }

    function initSourceViewer() {
        dom.btnSource.addEventListener('click', () => {
            state.clickCount++;
            showSourceCode();
        });
        
        dom.sourceClose.addEventListener('click', () => {
            dom.sourceViewer.classList.remove('open');
        });
    }

    function showSourceCode() {
        const fakeSource = `<!-- 
    4RCH1V3_D3CAY - Digital Archaeology
    A meditation on digital decay and
    the ghosts of the early web.
    
    You found the source.
    You looked behind the curtain.
    
    This is what's real.
-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>4RCH1V3_D3CAY</title>
    <style>
        /* The corruption is not a bug.
           It's a feature of memory.
           Digital entropy. */
        
        :root {
            --decay-green: #00ff41;
            --decay-red: #ff0040;
            --decay-amber: #ffb000;
            /* Colors of the old terminal.
               Colors of phosphor screens.
               Colors we remember. */
        }
        
        /* Every animation is a funeral
           for a page that once was. */
           
        @keyframes glitch {
            /* Corruption as art.
               Error as aesthetic.
               Breakage as beauty. */
        }
    </style>
</head>
<body>
    <!-- You navigated through layers.
         Through crashes and BSODs.
         Through broken images and dead links.
         Through melting text and decaying data.
         
         You are here now.
         
         In the spaces between ones and zeros,
         between memory and forgetting,
         between the page that was
         and the page that is...
         
         you found the signal.
         
         Thank you for exploring.
         Thank you for remembering.
         
         The web remembers you. -->
</body>
</html>`;

        dom.sourceCode.textContent = fakeSource;
        dom.sourceViewer.classList.add('open');
    }

    function initEasterEgg() {
        let clickPattern = [];
        const secretPattern = [1, 2, 3, 1];
        
        dom.linkEaster.addEventListener('click', (e) => {
            e.preventDefault();
            state.clickCount++;
            
            clickPattern.push(1);
            if (clickPattern.length > 4) {
                clickPattern.shift();
            }
            
            // Always show something
            dom.finalEasterEgg.classList.toggle('revealed');
        });
        
        dom.linkCredits.addEventListener('click', (e) => {
            e.preventDefault();
            state.clickCount++;
            showCredits();
        });
        
        dom.btnRestart.addEventListener('click', () => {
            restartExperience();
        });
    }

    function showCredits() {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid #00ffff;
            padding: 32px;
            z-index: 1000;
            max-width: 500px;
            text-align: center;
            font-family: 'VT323', monospace;
            color: #00ffff;
            animation: viewer-open 0.3s ease-out;
        `;
        
        popup.innerHTML = `
            <h2 style="font-family: 'Press Start 2P', cursive; font-size: 14px; margin-bottom: 20px; color: #00ffff;">
                CREDITS
            </h2>
            <p style="margin-bottom: 16px; font-size: 16px; color: #c0c0c0;">
                4RCH1V3_D3CAY
            </p>
            <p style="margin-bottom: 16px; font-size: 14px; color: #666;">
                A digital archaeology experience
            </p>
            <p style="margin-bottom: 16px; font-size: 14px; color: #666;">
                Built as a love letter to the early web.<br>
                To GeoCities and Angelfire.<br>
                To personal pages and guestbooks.<br>
                To webrings and hit counters.<br>
                To the internet that was.
            </p>
            <p style="margin-bottom: 24px; font-size: 12px; color: #444;">
                The corruption is intentional.<br>
                The decay is the art.
            </p>
            <button onclick="this.parentElement.remove()" 
                    style="background: transparent; border: 1px solid #00ffff; color: #00ffff; 
                           padding: 8px 24px; cursor: pointer; font-family: 'VT323', monospace; font-size: 14px;">
                CLOSE
            </button>
        `;
        
        document.body.appendChild(popup);
    }

    function restartExperience() {
        // Reset state
        state.currentLayer = 0;
        state.clickCount = 0;
        state.startTime = Date.now();
        state.discoveredLayers = new Set([0]);
        state.bsodSequence = 0;
        state.integrityLevel = 100;
        
        // Reset all layers
        document.querySelectorAll('.layer').forEach(layer => {
            layer.classList.remove('active');
            layer.style.display = 'none';
            layer.style.opacity = '0';
        });
        
        // Reset melting texts
        document.querySelectorAll('.melting-text').forEach(text => {
            text.classList.remove('melting', 'melted', 'decayed');
        });
        
        // Reset BSOD screens
        document.querySelectorAll('.bsod-screen').forEach((screen, i) => {
            screen.classList.remove('bsod-screen--active');
            if (i === 0) screen.classList.add('bsod-screen--active');
        });
        
        // Reset progress bars
        if (dom.restartFill1) dom.restartFill1.style.width = '0%';
        if (dom.restartPercent) dom.restartPercent.textContent = '0%';
        if (dom.restartFill2) dom.restartFill2.style.width = '0%';
        if (dom.restartPercent2) dom.restartPercent2.textContent = '0%';
        
        // Reset integrity meter
        if (dom.integrityMeter) dom.integrityMeter.style.width = '100%';
        if (dom.integrityValue) {
            dom.integrityValue.textContent = '100%';
            dom.integrityValue.style.color = '#00ff41';
        }
        
        // Hide easter egg
        if (dom.finalEasterEgg) dom.finalEasterEgg.classList.remove('revealed');
        
        // Navigate to layer 0
        navigateToLayer(0);
    }

    // === BSOD CLICK HANDLER ===
    function initBSODClickHandler() {
        document.querySelectorAll('.bsod-screen').forEach(screen => {
            screen.addEventListener('click', (e) => {
                if (e.target.closest('.layer-advance-btn')) return;
                state.clickCount++;
                
                // Random crash effect
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${Math.random() > 0.5 ? '#fff' : '#000'};
                    z-index: 9999;
                    pointer-events: none;
                    animation: flash 0.1s ease-out;
                `;
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 100);
            });
        });
    }

    // === ADVANCE BUTTON HANDLERS ===
    function initAdvanceButtons() {
        dom.advanceToBSOD.addEventListener('click', () => {
            state.clickCount++;
            navigateToLayer(3);
        });
        
        dom.advanceToRestore.addEventListener('click', () => {
            state.clickCount++;
            navigateToLayer(5);
        });
    }

    // === CRASH DISMISS HANDLER ===
    function initCrashDismiss() {
        dom.crashDismiss.addEventListener('click', () => {
            state.clickCount++;
            navigateToLayer(1);
        });
        
        // Also dismiss on click anywhere in crash layer
        dom.layerCrash.addEventListener('click', (e) => {
            if (e.target === dom.layerCrash || e.target.closest('.crash-particles')) {
                state.clickCount++;
                navigateToLayer(1);
            }
        });
    }

    // === AUDIO TOGGLE (Visual Only) ===
    function initAudioToggle() {
        dom.audioToggle.addEventListener('click', () => {
            state.audioEnabled = !state.audioEnabled;
            const icon = dom.audioToggle.querySelector('.audio-icon');
            const label = dom.audioToggle.querySelector('.audio-label');
            
            if (state.audioEnabled) {
                icon.textContent = '🔊';
                label.textContent = 'SOUND ON';
            } else {
                icon.textContent = '🔇';
                label.textContent = 'SOUND OFF';
            }
        });
    }

    // === GLOBAL EVENT HANDLERS ===
    function initGlobalHandlers() {
        // Track all clicks
        document.addEventListener('click', () => {
            state.clickCount++;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (state.currentLayer < state.totalLayers - 1) {
                    navigateToLayer(state.currentLayer + 1);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (state.currentLayer > 0) {
                    navigateToLayer(state.currentLayer - 1);
                }
            }
            
            // Secret: Press 'D' for decay
            if (e.key === 'd' || e.key === 'D') {
                document.body.style.filter = `hue-rotate(${randomInt(0, 360)}deg)`;
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 200);
            }
            
            // Secret: Press 'G' for glitch
            if (e.key === 'g' || e.key === 'G') {
                document.body.style.transform = `translate(${randomInt(-5, 5)}px, ${randomInt(-5, 5)}px)`;
                setTimeout(() => {
                    document.body.style.transform = 'none';
                }, 100);
            }
        });
        
        // Random glitch effect
        setInterval(() => {
            if (Math.random() > 0.95) {
                document.body.style.filter = `hue-rotate(${randomInt(0, 30)}deg)`;
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 50);
            }
        }, 1000);
    }

    // === INITIALIZATION ===
    function init() {
        // Start atmospheric effects
        initPixelDust();
        initCursorTrail();
        
        // Initialize all layer handlers
        initCrashDismiss();
        initAdvanceButtons();
        initBSODClickHandler();
        initAudioToggle();
        initGlobalHandlers();
        
        // Initialize first layer
        initCrashLayer();
        updateStatusBar(0);
        
        // Start timestamp updates
        updateTimestamp();
        setInterval(updateTimestamp, 1000);
        
        // Initial navigation update
        updateNavigation();
        
        console.log('%c4RCH1V3_D3CAY', 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
        console.log('%cDigital Archaeology Experience', 'color: #666; font-size: 12px;');
        console.log('%cNavigate with arrow keys. Press D or G for secrets.', 'color: #999; font-size: 10px;');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();