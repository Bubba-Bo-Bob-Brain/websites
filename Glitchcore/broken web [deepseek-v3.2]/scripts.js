// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('SYSTEM_ERROЯ://CORRUPTED_LABYRINTH initialized');
    
    // Audio elements
    const glitchSound = document.getElementById('glitch-sound');
    const terminalSound = document.getElementById('terminal-sound');
    const clickSound = document.getElementById('click-sound');
    
    // Play sound function with error handling
    function playSound(audioElement, volume = 0.3) {
        try {
            audioElement.volume = volume;
            audioElement.currentTime = 0;
            audioElement.play().catch(e => console.log('Audio play failed:', e.message));
        } catch (e) {
            console.log('Sound error:', e);
        }
    }
    
    // System time counter
    let systemTime = 0;
    const timeCounter = document.getElementById('time-counter');
    
    function updateSystemTime() {
        systemTime++;
        const minutes = Math.floor(systemTime / 60).toString().padStart(2, '0');
        const seconds = (systemTime % 60).toString().padStart(2, '0');
        timeCounter.textContent = `${minutes}:${seconds}`;
        
        // Random system events
        if (systemTime % 30 === 0) {
            triggerRandomGlitch();
        }
    }
    
    setInterval(updateSystemTime, 1000);
    
    // BSOD Screen Interaction
    const bsodScreen = document.getElementById('bsod');
    const skipBsodBtn = document.getElementById('skip-bsod');
    const bsodProgress = document.getElementById('bsod-progress');
    const bsodProgressPercent = document.querySelector('.progress-percentage');
    
    // Animate BSOD progress bar
    let bsodProgressValue = 0;
    const bsodInterval = setInterval(() => {
        bsodProgressValue += Math.random() * 5;
        if (bsodProgressValue > 100) bsodProgressValue = 100;
        
        bsodProgress.style.width = `${bsodProgressValue}%`;
        bsodProgressPercent.textContent = `${Math.floor(bsodProgressValue)}%`;
        
        // Random glitch effect on progress
        if (Math.random() < 0.1) {
            bsodProgress.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            setTimeout(() => {
                bsodProgress.style.transform = 'translateX(0)';
            }, 100);
        }
    }, 200);
    
    // Skip BSOD button
    skipBsodBtn.addEventListener('click', function() {
        playSound(clickSound);
        clearInterval(bsodInterval);
        
        // Add glitch effect before transition
        document.body.style.animation = 'glitch-1 0.5s';
        playSound(glitchSound);
        
        setTimeout(() => {
            bsodScreen.classList.remove('active');
            document.body.style.animation = '';
            
            // Show loading overlay
            showLoadingOverlay();
        }, 500);
    });
    
    // Loading Overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingFill = document.getElementById('loading-fill');
    const loadingText = document.getElementById('loading-text');
    
    function showLoadingOverlay() {
        loadingOverlay.style.display = 'flex';
        
        let loadingProgress = 0;
        const loadingInterval = setInterval(() => {
            loadingProgress += Math.random() * 3;
            if (loadingProgress > 100) loadingProgress = 100;
            
            loadingFill.style.width = `${loadingProgress}%`;
            loadingText.textContent = `${Math.floor(loadingProgress)}%`;
            
            // Random corruption at 47%
            if (Math.floor(loadingProgress) === 47) {
                loadingText.textContent = 'ERROR';
                loadingFill.style.background = 'linear-gradient(90deg, #000000, #ff0000)';
                playSound(glitchSound);
                
                setTimeout(() => {
                    loadingText.textContent = `${Math.floor(loadingProgress)}%`;
                    loadingFill.style.background = 'linear-gradient(90deg, #000000, #00ff00)';
                }, 500);
            }
            
            // Finish loading at 99.9% (never reaches 100%)
            if (loadingProgress >= 99.9) {
                clearInterval(loadingInterval);
                
                // Never completes - instead triggers error cascade
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    document.getElementById('labyrinth').style.opacity = '1';
                    
                    // Start error cascade
                    startErrorCascade();
                    
                    // Update terminal
                    updateTerminalOutput('SYSTEM> User entered labyrinth layer: 404_CASCADE');
                }, 1000);
            }
        }, 100);
    }
    
    // Navigation between layers
    const navItems = document.querySelectorAll('.nav-item');
    const contentLayers = document.querySelectorAll('.content-layer');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            if (targetId) {
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                contentLayers.forEach(layer => {
                    layer.classList.remove('active');
                    if (layer.id === targetId) {
                        setTimeout(() => layer.classList.add('active'), 50);
                    }
                });
                
                // Play sound and glitch effect
                playSound(clickSound);
                triggerElementGlitch(this);
                
                // Update terminal output
                updateTerminalOutput(`SYSTEM> User navigated to: ${targetId.toUpperCase()}`);
                
                // Special handling for mystery link
                if (this.id === 'mystery-link') {
                    setTimeout(() => {
                        showMysteryPortal();
                    }, 500);
                }
            }
        });
    });
    
    // Error Cascade functionality
    const errorPages = document.querySelectorAll('.error-page');
    const errorLinks = document.querySelectorAll('.error-link');
    const progressSteps = document.querySelectorAll('.progress-step');
    const errorCountElement = document.getElementById('error-count');
    
    let currentErrorIndex = 0;
    let errorCount = 127;
    
    function startErrorCascade() {
        // Show first error page
        errorPages[0].classList.remove('hidden');
        progressSteps[0].classList.add('active');
        
        // Animate error count
        const errorInterval = setInterval(() => {
            errorCount += Math.floor(Math.random() * 3);
            errorCountElement.textContent = errorCount;
            
            if (errorCount > 200) {
                clearInterval(errorInterval);
            }
        }, 500);
    }
    
    errorLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nextErrorId = this.getAttribute('data-next');
            
            if (nextErrorId) {
                // Hide current error
                errorPages[currentErrorIndex].classList.add('hidden');
                
                // Show next error
                const nextError = document.getElementById(nextErrorId);
                nextError.classList.remove('hidden');
                
                // Update progress steps
                progressSteps[currentErrorIndex].classList.remove('active');
                currentErrorIndex++;
                
                if (progressSteps[currentErrorIndex]) {
                    progressSteps[currentErrorIndex].classList.add('active');
                }
                
                // Play sound
                playSound(clickSound);
                
                // Trigger glitch effect
                triggerElementGlitch(this);
                
                // If cascade complete, reveal layer 1 fully
                if (this.id === 'cascade-complete') {
                    setTimeout(() => {
                        document.getElementById('layer1').style.opacity = '1';
                        updateTerminalOutput('SYSTEM> Error cascade complete. Layer 1 accessible.');
                    }, 500);
                }
            }
        });
    });
    
    // Database Leak functionality
    const dbExecuteBtn = document.getElementById('db-execute');
    const dbCommandInput = document.getElementById('db-command');
    const dbOutput = document.getElementById('db-output');
    const recordCountElement = document.getElementById('record-count');
    const decryptButtons = document.querySelectorAll('.decrypt-btn');
    
    let recordCount = 2847;
    
    // Animate record count
    const recordInterval = setInterval(() => {
        recordCount += Math.floor(Math.random() * 5);
        recordCountElement.textContent = recordCount.toLocaleString();
        
        if (recordCount > 3000) {
            clearInterval(recordInterval);
        }
    }, 1000);
    
    // Database query execution
    dbExecuteBtn.addEventListener('click', function() {
        const command = dbCommandInput.value.trim();
        
        if (command) {
            // Add query to output
            const queryLine = document.createElement('div');
            queryLine.className = 'db-line';
            queryLine.textContent = `> ${command}`;
            dbOutput.appendChild(queryLine);
            
            // Simulate processing
            setTimeout(() => {
                const resultLine = document.createElement('div');
                resultLine.className = 'db-line';
                
                // Random results based on command
                if (command.toLowerCase().includes('select')) {
                    resultLine.textContent = `> RESULT: ${Math.floor(Math.random() * 1000)} records found (${Math.floor(Math.random() * 50)}% corrupted)`;
                } else if (command.toLowerCase().includes('corrupt')) {
                    resultLine.textContent = '> ERROR: Cannot query corrupted data directly';
                    resultLine.style.color = '#ff5555';
                } else if (command.toLowerCase().includes('key')) {
                    resultLine.textContent = '> RESULT: Encryption key not found in database';
                } else {
                    resultLine.textContent = `> QUERY_EXECUTED: Syntax valid but data corrupted`;
                }
                
                dbOutput.appendChild(resultLine);
                dbOutput.scrollTop = dbOutput.scrollHeight;
                
                // Play sound
                playSound(terminalSound, 0.2);
                
                // Random chance to add corrupted data line
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        const corruptLine = document.createElement('div');
                        corruptLine.className = 'db-line';
                        corruptLine.style.color = '#ff5555';
                        corruptLine.textContent = '> WARNING: Data stream corruption detected';
                        dbOutput.appendChild(corruptLine);
                        dbOutput.scrollTop = dbOutput.scrollHeight;
                    }, 300);
                }
            }, 500);
            
            // Clear input
            dbCommandInput.value = '';
            
            // Trigger glitch
            triggerElementGlitch(this);
        }
    });
    
    // Allow Enter key to execute command
    dbCommandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            dbExecuteBtn.click();
        }
    });
    
    // Record decryption attempts
    decryptButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.getAttribute('data-record');
            
            // Show decryption attempt
            this.textContent = 'DECRYPTING...';
            this.disabled = true;
            
            // Simulate decryption process
            setTimeout(() => {
                // Always fail (for immersion)
                this.textContent = 'DECRYPTION_FAILED';
                this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                this.style.borderColor = '#ff5555';
                
                // Add to terminal output
                updateTerminalOutput(`SYSTEM> Decryption attempt failed for record ${recordId}`);
                
                // Play glitch sound
                playSound(glitchSound);
                
                // Trigger glitch on the record
                const record = this.closest('.record');
                triggerElementGlitch(record);
            }, 1500);
        });
    });
    
    // Web 1.0 Artifacts functionality
    const artifactCountElement = document.getElementById('artifact-count');
    const midiButtons = document.querySelectorAll('.midi-btn');
    const webringButtons = document.querySelectorAll('.webring-btn');
    const revealCoreBtn = document.getElementById('reveal-core');
    const hiddenArtifact = document.getElementById('hidden-artifact');
    
    let artifactCount = 12;
    
    // Simulate artifact discovery
    setTimeout(() => {
        artifactCount += 1;
        artifactCountElement.textContent = artifactCount;
        
        // Randomly reveal hidden artifact
        if (Math.random() < 0.5) {
            setTimeout(() => {
                hiddenArtifact.classList.remove('hidden');
                hiddenArtifact.style.animation = 'layer-appear 1s forwards';
                
                updateTerminalOutput('SYSTEM> Hidden artifact detected in Web 1.0 layer');
            }, 2000);
        }
    }, 5000);
    
    // MIDI player buttons
    midiButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playSound(clickSound);
            
            if (this.classList.contains('play')) {
                // Visualizer animation
                const visualizerBars = document.querySelectorAll('.visualizer-bar');
                visualizerBars.forEach(bar => {
                    bar.style.animationPlayState = 'running';
                });
                
                this.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
                this.classList.remove('play');
                this.classList.add('pause');
            } else if (this.classList.contains('stop')) {
                // Stop visualizer
                const visualizerBars = document.querySelectorAll('.visualizer-bar');
                visualizerBars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                    bar.style.height = '20%';
                });
                
                document.querySelector('.pause').innerHTML = '<i class="fas fa-play"></i> PLAY';
                document.querySelector('.pause').classList.remove('pause');
                document.querySelector('.pause').classList.add('play');
            } else if (this.classList.contains('pause')) {
                // Pause visualizer
                const visualizerBars = document.querySelectorAll('.visualizer-bar');
                visualizerBars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                });
                
                this.innerHTML = '<i class="fas fa-play"></i> PLAY';
                this.classList.remove('pause');
                this.classList.add('play');
            }
        });
    });
    
    // Webring navigation
    webringButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playSound(clickSound);
            
            const members = document.querySelectorAll('.member');
            const currentIndex = Array.from(members).findIndex(m => !m.classList.contains('corrupted'));
            
            if (this.classList.contains('next')) {
                // Move to next member
                members.forEach(m => m.classList.remove('corrupted'));
                const nextIndex = (currentIndex + 1) % members.length;
                members[nextIndex].classList.add('corrupted');
                
                // Update webring site counter
                const siteCounter = document.querySelector('.webring-site');
                const currentNum = parseInt(siteCounter.textContent.match(/\d+/)[0]);
                const nextNum = currentNum === 89 ? 7 : currentNum + 1;
                siteCounter.textContent = `Site ${nextNum} of 89`;
            } else if (this.classList.contains('prev')) {
                // Move to previous member
                members.forEach(m => m.classList.remove('corrupted'));
                const prevIndex = currentIndex === 0 ? members.length - 1 : currentIndex - 1;
                members[prevIndex].classList.add('corrupted');
                
                // Update webring site counter
                const siteCounter = document.querySelector('.webring-site');
                const currentNum = parseInt(siteCounter.textContent.match(/\d+/)[0]);
                const prevNum = currentNum === 7 ? 89 : currentNum - 1;
                siteCounter.textContent = `Site ${prevNum} of 89`;
            }
            
            // Trigger glitch
            triggerElementGlitch(this);
        });
    });
    
    // Reveal hidden core
    revealCoreBtn.addEventListener('click', function() {
        playSound(terminalSound, 0.5);
        
        // Glitch effect
        document.body.style.animation = 'glitch-1 0.3s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        
        // Hide current layer, show core
        document.getElementById('layer3').classList.remove('active');
        document.getElementById('layer4').classList.add('active');
        
        // Update navigation
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-target="layer4"]').classList.add('active');
        
        // Update terminal
        updateTerminalOutput('SYSTEM> Hidden core accessed. System integrity stabilizing.');
        
        // Update system status
        document.querySelector('.integrity').style.width = '85%';
        document.querySelector('.corruption').style.width = '15%';
        document.querySelector('.status-value.critical').textContent = '85%';
        document.querySelector('.status-value.high').textContent = '15%';
    });
    
    // Hidden Core functionality
    const resetLabyrinthBtn = document.getElementById('reset-labyrinth');
    const preserveCoreBtn = document.getElementById('preserve-core');
    
    resetLabyrinthBtn.addEventListener('click', function() {
        playSound(glitchSound, 0.5);
        
        // Confirm reset
        if (confirm('WARNING: This will restart the labyrinth from the beginning. All progress will be lost. Continue?')) {
            // Massive glitch effect
            document.body.style.animation = 'glitch-1 1s';
            
            setTimeout(() => {
                // Reload the page
                location.reload();
            }, 1000);
        }
    });
    
    preserveCoreBtn.addEventListener('click', function() {
        playSound(clickSound);
        
        // Create a "screenshot" effect
        document.body.style.filter = 'brightness(0.8)';
        
        // Show preservation message
        const preserveMsg = document.createElement('div');
        preserveMsg.style.position = 'fixed';
        preserveMsg.style.top = '50%';
        preserveMsg.style.left = '50%';
        preserveMsg.style.transform = 'translate(-50%, -50%)';
        preserveMsg.style.backgroundColor = 'rgba(0, 30, 0, 0.9)';
        preserveMsg.style.border = '2px solid #00ff00';
        preserveMsg.style.padding = '30px';
        preserveMsg.style.zIndex = '5000';
        preserveMsg.style.fontFamily = "'Silkscreen', cursive";
        preserveMsg.style.color = '#00ff00';
        preserveMsg.style.textAlign = 'center';
        preserveMsg.innerHTML = `
            <h2>MOMENT PRESERVED</h2>
            <p>The core has been saved to your consciousness.</p>
            <p>Remember: even in decay, beauty persists.</p>
            <button id="close-preserve" style="margin-top:20px; padding:10px 20px; background:rgba(0,255,0,0.3); color:white; border:1px solid #00ff00; cursor:pointer;">
                RETURN TO CORE
            </button>
        `;
        
        document.body.appendChild(preserveMsg);
        
        // Close button
        document.getElementById('close-preserve').addEventListener('click', function() {
            document.body.removeChild(preserveMsg);
            document.body.style.filter = '';
        });
    });
    
    // Mystery Portal functionality
    const mysteryPortal = document.getElementById('mystery-portal');
    const portalCloseBtn = document.getElementById('portal-close');
    const portalEnterBtn = document.getElementById('portal-enter');
    
    function showMysteryPortal() {
        mysteryPortal.classList.remove('hidden');
        playSound(glitchSound, 0.7);
        
        // Portal entry effect
        mysteryPortal.style.animation = 'layer-appear 0.5s forwards';
    }
    
    portalCloseBtn.addEventListener('click', function() {
        playSound(clickSound);
        mysteryPortal.classList.add('hidden');
        
        // Return to previous layer
        updateTerminalOutput('SYSTEM> Mystery portal closed. User returned to safety.');
    });
    
    portalEnterBtn.addEventListener('click', function() {
        playSound(glitchSound, 0.8);
        
        // Extreme glitch effect
        document.body.style.animation = 'glitch-1 0.2s';
        document.body.style.animationIterationCount = '10';
        
        // Corrupt the entire screen
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#f00; font-family:'Silkscreen', cursive; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px; z-index:9999;">
                    <div>
                        <h1 style="font-size:3rem; margin-bottom:30px;">VOID ENTERED</h1>
                        <p style="font-size:1.5rem; margin-bottom:20px;">Some pathways should not be taken.</p>
                        <p style="font-size:1.2rem; margin-bottom:30px;">The system cannot recover from this corruption.</p>
                        <p style="font-size:1rem; color:#888; margin-bottom:40px;">Error code: VOID_0xDEADEND</p>
                        <button id="void-return" style="padding:15px 30px; background:rgba(255,0,0,0.3); color:white; border:1px solid #f00; font-family:'Silkscreen', cursive; cursor:pointer;">
                            ATTEMPT RETURN
                        </button>
                    </div>
                </div>
            `;
            
            // Add return button functionality
            setTimeout(() => {
                document.getElementById('void-return').addEventListener('click', function() {
                    // Reload the entire labyrinth
                    location.reload();
                });
            }, 100);
        }, 2000);
    });
    
    // Terminal output updates
    function updateTerminalOutput(message) {
        const terminalOutput = document.querySelector('.terminal-output');
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.textContent = message;
        
        terminalOutput.appendChild(newLine);
        
        // Limit to 5 lines, remove oldest
        const lines = terminalOutput.querySelectorAll('.terminal-line');
        if (lines.length > 5) {
            terminalOutput.removeChild(lines[0]);
        }
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Random glitch effects
    function triggerRandomGlitch() {
        const glitchElements = document.querySelectorAll('.glitch-text, .error-page, .record, .artifact');
        if (glitchElements.length > 0) {
            const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
            triggerElementGlitch(randomElement);
            
            // Occasionally play sound
            if (Math.random() < 0.3) {
                playSound(glitchSound, 0.1);
            }
        }
    }
    
    function triggerElementGlitch(element) {
        if (!element) return;
        
        // Store original styles
        const originalTransform = element.style.transform;
        const originalFilter = element.style.filter;
        
        // Apply glitch effect
        element.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        element.style.filter = `hue-rotate(${Math.random() * 90}deg) brightness(${0.8 + Math.random() * 0.4})`;
        
        // Add glitch text effect if element has text
        if (element.textContent && element.textContent.trim().length > 0) {
            const originalText = element.textContent;
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
            
            // Temporarily replace some characters
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
            
            // Restore original text after delay
            setTimeout(() => {
                element.textContent = originalText;
            }, 100);
        }
        
        // Restore original styles after delay
        setTimeout(() => {
            element.style.transform = originalTransform;
            element.style.filter = originalFilter;
        }, 200);
    }
    
    // Live command text animation
    const liveCommand = document.getElementById('live-command');
    const commands = [
        'initiating_decay_protocol.exe',
        'scanning_for_corruption...',
        'accessing_hidden_layers...',
        'decrypting_archives...',
        'ERROR: memory_leak_detected',
        'system_integrity: 12%',
        'corruption_level: CRITICAL',
        'reticulating_splines...',
        'loading_web_1.0_artifacts...',
        'bypassing_firewall...',
        'establishing_secure_connection...',
        'connection_failed: retrying...'
    ];
    
    let commandIndex = 0;
    
    function rotateCommand() {
        liveCommand.textContent = commands[commandIndex];
        commandIndex = (commandIndex + 1) % commands.length;
        
        // Random glitch effect
        if (Math.random() < 0.3) {
            triggerElementGlitch(liveCommand);
        }
    }
    
    setInterval(rotateCommand, 3000);
    
    // Initialize with first command rotation
    setTimeout(rotateCommand, 1000);
    
    // Interactive background clicks
    document.body.addEventListener('click', function(e) {
        // Only trigger on background clicks (not interactive elements)
        if (e.target === document.body || e.target.classList.contains('container') || 
            e.target.classList.contains('crt-overlay') || e.target.classList.contains('scanlines') ||
            e.target.classList.contains('noise')) {
            
            // Small chance to trigger random glitch
            if (Math.random() < 0.1) {
                triggerRandomGlitch();
                playSound(clickSound, 0.1);
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Skip BSOD with any key
        if (bsodScreen.classList.contains('active') && e.key.length === 1) {
            skipBsodBtn.click();
        }
        
        // Secret code: CORRUPTION (debug shortcuts)
        switch(e.key) {
            case 'c':
                if (e.ctrlKey) {
                    // Ctrl+C: Trigger massive corruption
                    document.body.style.animation = 'glitch-1 0.5s';
                    document.body.style.animationIterationCount = '5';
                    playSound(glitchSound, 0.7);
                    
                    setTimeout(() => {
                        document.body.style.animation = '';
                        document.body.style.animationIterationCount = '';
                    }, 2500);
                }
                break;
            case 'r':
                if (e.ctrlKey) {
                    // Ctrl+R: Quick reset confirmation
                    if (confirm('Quick reset labyrinth?')) {
                        location.reload();
                    }
                }
                break;
            case 'm':
                if (e.ctrlKey) {
                    // Ctrl+M: Toggle mystery portal
                    if (mysteryPortal.classList.contains('hidden')) {
                        showMysteryPortal();
                    } else {
                        mysteryPortal.classList.add('hidden');
                    }
                }
                break;
        }
    });
    
    // Initial system message
    setTimeout(() => {
        updateTerminalOutput('SYSTEM> Corrupted labyrinth initialized. Welcome, user.');
        updateTerminalOutput('SYSTEM> Navigate through the decay to find what remains.');
    }, 1000);
    
    // Final initialization
    console.log('Corrupted labyrinth ready. Explore at your own risk...');
});