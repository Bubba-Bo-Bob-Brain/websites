// ============================================
// VAPORWAVE MUSIC PLAYER - SCRIPTS
// Late-night interactive experience with
// audio visualization and immersive effects
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // GLOBAL STATE & CONFIGURATION
    // ============================================
    const state = {
        isPlaying: false,
        currentTrack: 0,
        volume: 0.8,
        progress: 0.35, // 35% of track played
        playlist: [
            {
                title: 'リサフランク420 / 現代のコンピュー',
                artist: 'ＭＡＣＩＮＴＯＳＨ　ＰＬＵＳ',
                duration: '4:32',
                bpm: 128,
                key: 'F#m',
                energy: 87
            },
            {
                title: 'ＳＵＮＤＡＹ　ＳＨＯＰＰＩＮＧ',
                artist: 'VAPERROR',
                duration: '3:45',
                bpm: 122,
                key: 'Am',
                energy: 76
            },
            {
                title: 'ＥＮＪＯＹ　ＹＯＵＲＳＥＬＦ',
                artist: 'ＳＡＩＮＴ　ＰＥＰＳＩ',
                duration: '5:21',
                bpm: 115,
                key: 'Dm',
                energy: 82
            },
            {
                title: 'ＢＡＣＫＤＲＯＰ',
                artist: '18 Carat Affair',
                duration: '3:18',
                bpm: 135,
                key: 'G#m',
                energy: 91
            },
            {
                title: 'ＨＯＭＥ　ＲＥＳＯＮＡＮＣＥ',
                artist: 'Blank Banshee',
                duration: '4:09',
                bpm: 125,
                key: 'Em',
                energy: 79
            }
        ],
        isShuffle: false,
        isRepeat: false
    };

    // ============================================
    // DOM ELEMENT REFERENCES
    // ============================================
    const elements = {
        // Player controls
        playBtn: document.querySelector('.play-btn'),
        prevBtn: document.querySelector('.prev-btn'),
        nextBtn: document.querySelector('.next-btn'),
        repeatBtn: document.querySelector('.repeat-btn'),
        shuffleBtn: document.querySelector('.shuffle-btn'),
        
        // Progress and volume
        vhsProgress: document.querySelector('.vhs-progress'),
        vhsThumb: document.querySelector('.vhs-thumb'),
        vhsTrack: document.querySelector('.vhs-track'),
        vhsTrackingBar: document.querySelector('.vhs-tracking-bar'),
        volumeProgress: document.querySelector('.volume-progress'),
        volumeSlider: document.querySelector('.volume-slider'),
        
        // Time displays
        currentTime: document.querySelector('.current-time'),
        trackDuration: document.querySelector('.track-duration'),
        
        // Visualizer
        waveformCanvas: document.getElementById('waveformCanvas'),
        marbleBust: document.querySelector('.marble-bust'),
        
        // Track info
        win95Dialog: document.querySelector('.win95-dialog'),
        win95CloseBtn: document.querySelector('.win95-btn.close'),
        win95MinimizeBtn: document.querySelector('.win95-btn.minimize'),
        win95MaximizeBtn: document.querySelector('.win95-btn.maximize'),
        
        // Playlist
        playlistTracks: document.querySelectorAll('.playlist-track'),
        addTrackBtn: document.querySelector('.add-track-btn'),
        
        // Stats
        bpmValue: document.querySelector('.stat:nth-child(1) .stat-value'),
        keyValue: document.querySelector('.stat:nth-child(2) .stat-value'),
        energyValue: document.querySelector('.stat:nth-child(3) .stat-value'),
        
        // Album info
        albumTitle: document.querySelector('.album-title'),
        albumArtist: document.querySelector('.album-artist'),
        
        // Equalizer
        eqBars: document.querySelectorAll('.eq-bar'),
        
        // Time display
        timeDisplay: document.querySelector('.time'),
        amPmDisplay: document.querySelector('.am-pm')
    };

    // ============================================
    // AUDIO CONTEXT & VISUALIZATION
    // ============================================
    let audioContext;
    let analyser;
    let dataArray;
    let bufferLength;
    let canvasContext;
    
    // Initialize audio visualization
    function initAudioVisualization() {
        // Create fake audio context for visualization (since we don't have real audio)
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            // Set up canvas for waveform
            canvasContext = elements.waveformCanvas.getContext('2d');
            elements.waveformCanvas.width = elements.waveformCanvas.clientWidth;
            elements.waveformCanvas.height = elements.waveformCanvas.clientHeight;
            
            // Start visualization loop
            drawWaveform();
        } catch (e) {
            console.log('Audio context not supported, using simulated visualization');
            simulateWaveform();
        }
    }
    
    // Draw waveform visualization
    function drawWaveform() {
        if (!canvasContext) return;
        
        // Clear canvas
        canvasContext.fillStyle = 'rgba(10, 0, 20, 0.1)';
        canvasContext.fillRect(0, 0, elements.waveformCanvas.width, elements.waveformCanvas.height);
        
        // Get frequency data
        analyser.getByteFrequencyData(dataArray);
        
        // Draw waveform bars
        const barWidth = (elements.waveformCanvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        // Create gradient for bars
        const gradient = canvasContext.createLinearGradient(0, 0, elements.waveformCanvas.width, 0);
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(0.5, '#00ffff');
        gradient.addColorStop(1, '#9d00ff');
        
        canvasContext.fillStyle = gradient;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            // Draw bar with rounded top
            canvasContext.beginPath();
            canvasContext.roundRect(x, elements.waveformCanvas.height - barHeight, barWidth, barHeight, 2);
            canvasContext.fill();
            
            x += barWidth + 1;
        }
        
        // Add glow effect
        canvasContext.shadowBlur = 15;
        canvasContext.shadowColor = '#ff00ff';
        
        // Draw smooth waveform line
        canvasContext.beginPath();
        canvasContext.lineWidth = 3;
        canvasContext.strokeStyle = gradient;
        
        for (let i = 0; i < bufferLength; i++) {
            const y = elements.waveformCanvas.height - (dataArray[i] / 2);
            
            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
            
            x += barWidth + 1;
        }
        
        canvasContext.stroke();
        canvasContext.shadowBlur = 0;
        
        // Continue animation
        requestAnimationFrame(drawWaveform);
    }
    
    // Simulate waveform if audio context fails
    function simulateWaveform() {
        if (!elements.waveformCanvas) return;
        
        canvasContext = elements.waveformCanvas.getContext('2d');
        elements.waveformCanvas.width = elements.waveformCanvas.clientWidth;
        elements.waveformCanvas.height = elements.waveformCanvas.clientHeight;
        
        // Create simulated data array
        dataArray = new Uint8Array(64);
        for (let i = 0; i < dataArray.length; i++) {
            // Create interesting waveform pattern
            dataArray[i] = Math.sin(i * 0.3) * 80 + 
                          Math.sin(i * 0.1) * 40 + 
                          Math.random() * 30 + 50;
        }
        
        // Start simulated visualization
        function drawSimulatedWaveform() {
            if (!canvasContext) return;
            
            // Clear with fade effect
            canvasContext.fillStyle = 'rgba(10, 0, 20, 0.1)';
            canvasContext.fillRect(0, 0, elements.waveformCanvas.width, elements.waveformCanvas.height);
            
            // Animate the data array
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] += (Math.random() - 0.5) * 10;
                dataArray[i] = Math.max(30, Math.min(150, dataArray[i]));
            }
            
            // Draw bars
            const barWidth = (elements.waveformCanvas.width / dataArray.length) * 2;
            let x = 0;
            
            // Create gradient
            const gradient = canvasContext.createLinearGradient(0, 0, elements.waveformCanvas.width, 0);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(0.5, '#00ffff');
            gradient.addColorStop(1, '#9d00ff');
            
            canvasContext.fillStyle = gradient;
            
            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = dataArray[i];
                
                // Draw bar
                canvasContext.beginPath();
                canvasContext.roundRect(
                    x, 
                    elements.waveformCanvas.height - barHeight, 
                    barWidth, 
                    barHeight, 
                    2
                );
                canvasContext.fill();
                
                x += barWidth + 1;
            }
            
            // Add pulsing effect to marble bust based on audio
            const avgAmplitude = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const pulseScale = 1 + (avgAmplitude / 200) * 0.1;
            
            if (elements.marbleBust) {
                elements.marbleBust.style.transform = `rotateY(${Date.now() / 30 % 360}deg) scale(${pulseScale})`;
            }
            
            // Update equalizer bars
            updateEqualizer(dataArray);
            
            requestAnimationFrame(drawSimulatedWaveform);
        }
        
        drawSimulatedWaveform();
    }
    
    // ============================================
    // PLAYER CONTROLS & INTERACTIVITY
    // ============================================
    
    // Toggle play/pause
    function togglePlay() {
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            elements.playBtn.classList.add('playing');
            // Start time progression
            startTimeProgress();
            // Add playing animation to marble bust
            elements.marbleBust.style.animationDuration = '20s';
        } else {
            elements.playBtn.classList.remove('playing');
            // Stop time progression
            stopTimeProgress();
            // Slow down marble bust
            elements.marbleBust.style.animationDuration = '60s';
        }
        
        // Update active track status
        updateActiveTrack();
        
        // Add click feedback
        elements.playBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            elements.playBtn.style.transform = '';
        }, 100);
    }
    
    // Navigate to next track
    function nextTrack() {
        if (state.isShuffle) {
            state.currentTrack = Math.floor(Math.random() * state.playlist.length);
        } else {
            state.currentTrack = (state.currentTrack + 1) % state.playlist.length;
        }
        
        loadTrack(state.currentTrack);
        updateActiveTrack();
        
        // Add navigation effect
        elements.nextBtn.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            elements.nextBtn.style.transform = '';
        }, 300);
    }
    
    // Navigate to previous track
    function prevTrack() {
        if (state.isShuffle) {
            state.currentTrack = Math.floor(Math.random() * state.playlist.length);
        } else {
            state.currentTrack = (state.currentTrack - 1 + state.playlist.length) % state.playlist.length;
        }
        
        loadTrack(state.currentTrack);
        updateActiveTrack();
        
        // Add navigation effect
        elements.prevBtn.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            elements.prevBtn.style.transform = '';
        }, 300);
    }
    
    // Toggle shuffle mode
    function toggleShuffle() {
        state.isShuffle = !state.isShuffle;
        elements.shuffleBtn.classList.toggle('active', state.isShuffle);
        
        // Add visual feedback
        elements.shuffleBtn.style.color = state.isShuffle ? '#00ffff' : 'white';
        elements.shuffleBtn.style.boxShadow = state.isShuffle ? '0 0 20px #00ffff' : '';
    }
    
    // Toggle repeat mode
    function toggleRepeat() {
        state.isRepeat = !state.isRepeat;
        elements.repeatBtn.classList.toggle('active', state.isRepeat);
        
        // Add visual feedback
        elements.repeatBtn.style.color = state.isRepeat ? '#ff00ff' : 'white';
        elements.repeatBtn.style.boxShadow = state.isRepeat ? '0 0 20px #ff00ff' : '';
    }
    
    // Load track data
    function loadTrack(index) {
        const track = state.playlist[index];
        
        // Update track info in Windows 95 dialog
        updateWin95TrackInfo(track);
        
        // Update visualizer stats
        if (elements.bpmValue) elements.bpmValue.textContent = track.bpm;
        if (elements.keyValue) elements.keyValue.textContent = track.key;
        if (elements.energyValue) elements.energyValue.textContent = `${track.energy}%`;
        
        // Update time display
        if (elements.trackDuration) elements.trackDuration.textContent = track.duration;
        
        // Reset progress
        state.progress = 0;
        updateProgressDisplay();
        
        // Update album info (simulate different albums)
        if (elements.albumTitle) {
            const albumTitles = ['ＡＥＳＴＨＥＴＩＣＳ　ＶＯＬ．１', 'ＮＯＳＴＡＬＧＩＡ　ＵＬＴＲＡ', 'ＦＬＯＷＥＲ　ＳＨＯＰ'];
            elements.albumTitle.textContent = albumTitles[index % albumTitles.length];
        }
        
        if (elements.albumArtist) {
            elements.albumArtist.textContent = track.artist;
        }
    }
    
    // Update Windows 95 dialog track info
    function updateWin95TrackInfo(track) {
        const dialogRows = document.querySelectorAll('.win95-row');
        if (dialogRows.length >= 5) {
            // Update title
            const titleValue = dialogRows[0].querySelector('.win95-value');
            if (titleValue) titleValue.textContent = track.title;
            
            // Update artist
            const artistValue = dialogRows[1].querySelector('.win95-value');
            if (artistValue) artistValue.textContent = track.artist;
            
            // Update album based on track index
            const albumValue = dialogRows[2].querySelector('.win95-value');
            if (albumValue) {
                const albums = ['フローラルの専門店', 'ＳＬＯＷ　ＤＥＡＴＨ', 'ＨＥＡＶＥＮＳＧＡＴＥ'];
                albumValue.textContent = albums[state.currentTrack % albums.length];
            }
            
            // Add glitch effect to dialog
            elements.win95Dialog.style.transform = 'rotate(-1deg) translateX(3px)';
            setTimeout(() => {
                elements.win95Dialog.style.transform = 'rotate(-1deg) translateX(-3px)';
                setTimeout(() => {
                    elements.win95Dialog.style.transform = 'rotate(-1deg)';
                }, 50);
            }, 50);
        }
    }
    
    // Update active track in playlist
    function updateActiveTrack() {
        elements.playlistTracks.forEach((trackEl, index) => {
            if (index === state.currentTrack && state.isPlaying) {
                trackEl.classList.add('active');
                // Update play icon
                const statusIcon = trackEl.querySelector('.track-status i');
                if (statusIcon) {
                    statusIcon.className = 'fas fa-play';
                }
            } else if (index === state.currentTrack) {
                trackEl.classList.add('active');
                const statusIcon = trackEl.querySelector('.track-status i');
                if (statusIcon) {
                    statusIcon.className = 'fas fa-pause';
                }
            } else {
                trackEl.classList.remove('active');
                const statusIcon = trackEl.querySelector('.track-status i');
                if (statusIcon) {
                    statusIcon.className = 'far fa-circle';
                }
            }
        });
    }
    
    // ============================================
    // PROGRESS & VOLUME CONTROLS
    // ============================================
    
    // Update progress display
    function updateProgressDisplay() {
        const progressPercent = state.progress * 100;
        
        // Update progress bar
        if (elements.vhsProgress) {
            elements.vhsProgress.style.width = `${progressPercent}%`;
        }
        
        if (elements.vhsThumb) {
            elements.vhsThumb.style.left = `${progressPercent}%`;
        }
        
        if (elements.vhsTrackingBar) {
            elements.vhsTrackingBar.style.left = `${progressPercent}%`;
        }
        
        // Update time display
        if (elements.currentTime) {
            const track = state.playlist[state.currentTrack];
            const totalSeconds = timeToSeconds(track.duration);
            const currentSeconds = Math.floor(totalSeconds * state.progress);
            elements.currentTime.textContent = secondsToTime(currentSeconds);
        }
    }
    
    // Handle progress bar interaction
    function setupProgressControls() {
        if (!elements.vhsTrack || !elements.vhsThumb) return;
        
        let isDragging = false;
        
        // Mouse/touch events for progress bar
        const startDrag = (e) => {
            isDragging = true;
            updateProgressFromEvent(e);
            elements.vhsThumb.style.cursor = 'grabbing';
        };
        
        const doDrag = (e) => {
            if (!isDragging) return;
            updateProgressFromEvent(e);
        };
        
        const stopDrag = () => {
            isDragging = false;
            elements.vhsThumb.style.cursor = 'grab';
        };
        
        // Update progress from mouse/touch event
        const updateProgressFromEvent = (e) => {
            const rect = elements.vhsTrack.getBoundingClientRect();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            let percent = (clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            
            state.progress = percent;
            updateProgressDisplay();
            
            // Add VHS tracking glitch effect
            elements.vhsTrackingBar.style.animation = 'none';
            setTimeout(() => {
                elements.vhsTrackingBar.style.animation = 'trackingGlitch 0.5s infinite';
            }, 10);
        };
        
        // Event listeners
        elements.vhsTrack.addEventListener('mousedown', startDrag);
        elements.vhsThumb.addEventListener('mousedown', startDrag);
        
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        elements.vhsTrack.addEventListener('touchstart', startDrag);
        elements.vhsThumb.addEventListener('touchstart', startDrag);
        
        document.addEventListener('touchmove', doDrag);
        document.addEventListener('touchend', stopDrag);
        
        // Click to seek
        elements.vhsTrack.addEventListener('click', (e) => {
            updateProgressFromEvent(e);
        });
    }
    
    // Handle volume controls
    function setupVolumeControls() {
        if (!elements.volumeSlider || !elements.volumeProgress) return;
        
        elements.volumeSlider.addEventListener('click', (e) => {
            const rect = elements.volumeSlider.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            state.volume = Math.max(0, Math.min(1, percent));
            updateVolumeDisplay();
        });
        
        updateVolumeDisplay();
    }
    
    // Update volume display
    function updateVolumeDisplay() {
        if (elements.volumeProgress) {
            elements.volumeProgress.style.width = `${state.volume * 100}%`;
        }
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon) {
            if (state.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute volume-icon';
            } else if (state.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down volume-icon';
            } else {
                volumeIcon.className = 'fas fa-volume-up volume-icon';
            }
        }
    }
    
    // ============================================
    // TIME PROGRESSION SIMULATION
    // ============================================
    let timeInterval;
    
    function startTimeProgress() {
        clearInterval(timeInterval);
        
        timeInterval = setInterval(() => {
            if (state.isPlaying) {
                // Increment progress
                const track = state.playlist[state.currentTrack];
                const totalSeconds = timeToSeconds(track.duration);
                const increment = 1 / (totalSeconds * 10); // Complete track in 10 seconds for demo
                
                state.progress += increment;
                
                if (state.progress >= 1) {
                    state.progress = 0;
                    if (state.isRepeat) {
                        // Repeat current track
                        loadTrack(state.currentTrack);
                    } else {
                        // Move to next track
                        nextTrack();
                    }
                }
                
                updateProgressDisplay();
            }
        }, 100);
    }
    
    function stopTimeProgress() {
        clearInterval(timeInterval);
    }
    
    // ============================================
    // WIN95 DIALOG INTERACTIONS
    // ============================================
    
    function setupWin95Dialog() {
        if (!elements.win95Dialog) return;
        
        // Close button
        if (elements.win95CloseBtn) {
            elements.win95CloseBtn.addEventListener('click', () => {
                elements.win95Dialog.style.transform = 'translateY(-100%) rotate(-1deg)';
                elements.win95Dialog.style.opacity = '0';
                
                setTimeout(() => {
                    elements.win95Dialog.style.display = 'none';
                }, 300);
            });
        }
        
        // Minimize button
        if (elements.win95MinimizeBtn) {
            elements.win95MinimizeBtn.addEventListener('click', () => {
                elements.win95Dialog.style.transform = 'scale(0.8) rotate(-1deg)';
                elements.win95Dialog.style.opacity = '0.5';
                
                setTimeout(() => {
                    elements.win95Dialog.style.transform = 'scale(1) rotate(-1deg)';
                    elements.win95Dialog.style.opacity = '1';
                }, 1000);
            });
        }
        
        // Maximize button
        if (elements.win95MaximizeBtn) {
            elements.win95MaximizeBtn.addEventListener('click', () => {
                elements.win95Dialog.classList.toggle('maximized');
                
                if (elements.win95Dialog.classList.contains('maximized')) {
                    elements.win95Dialog.style.width = '100%';
                    elements.win95Dialog.style.height = '300px';
                    elements.win95MaximizeBtn.textContent = '❐';
                } else {
                    elements.win95Dialog.style.width = '';
                    elements.win95Dialog.style.height = '';
                    elements.win95MaximizeBtn.textContent = '□';
                }
            });
        }
        
        // Make dialog draggable
        let isDraggingDialog = false;
        let dragOffset = { x: 0, y: 0 };
        
        elements.win95Titlebar.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('win95-btn')) return;
            
            isDraggingDialog = true;
            const rect = elements.win95Dialog.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            elements.win95Dialog.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDraggingDialog) return;
            
            elements.win95Dialog.style.position = 'absolute';
            elements.win95Dialog.style.left = `${e.clientX - dragOffset.x}px`;
            elements.win95Dialog.style.top = `${e.clientY - dragOffset.y}px`;
            elements.win95Dialog.style.zIndex = '1000';
        });
        
        document.addEventListener('mouseup', () => {
            isDraggingDialog = false;
            elements.win95Dialog.style.cursor = '';
        });
    }
    
    // ============================================
    // PLAYLIST INTERACTIONS
    // ============================================
    
    function setupPlaylistInteractions() {
        // Track click events
        elements.playlistTracks.forEach((trackEl, index) => {
            trackEl.addEventListener('click', () => {
                state.currentTrack = index;
                loadTrack(index);
                updateActiveTrack();
                
                // If not playing, start playback
                if (!state.isPlaying) {
                    togglePlay();
                }
                
                // Add click effect
                trackEl.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    trackEl.style.transform = '';
                }, 200);
            });
        });
        
        // Add track button
        if (elements.addTrackBtn) {
            elements.addTrackBtn.addEventListener('click', () => {
                // Create new track entry
                const newTrack = {
                    title: `ＮＥＷ　ＴＲＡＣＫ　${state.playlist.length + 1}`,
                    artist: 'ＵＮＫＮＯＷＮ　ＡＲＴＩＳＴ',
                    duration: '3:00',
                    bpm: 120 + Math.floor(Math.random() * 20),
                    key: ['Am', 'F#m', 'Dm', 'G#m', 'Em'][Math.floor(Math.random() * 5)],
                    energy: 70 + Math.floor(Math.random() * 30)
                };
                
                state.playlist.push(newTrack);
                
                // Add to playlist UI
                const playlistTracksContainer = document.querySelector('.playlist-tracks');
                const romanNumeral = numberToRoman(state.playlist.length);
                
                const newTrackEl = document.createElement('div');
                newTrackEl.className = 'playlist-track';
                newTrackEl.innerHTML = `
                    <div class="track-number">${romanNumeral}</div>
                    <div class="track-info">
                        <div class="track-title">${newTrack.title}</div>
                        <div class="track-artist">${newTrack.artist}</div>
                    </div>
                    <div class="track-duration">${newTrack.duration}</div>
                    <div class="track-status">
                        <i class="far fa-circle"></i>
                    </div>
                `;
                
                // Add click event to new track
                newTrackEl.addEventListener('click', () => {
                    state.currentTrack = state.playlist.length - 1;
                    loadTrack(state.currentTrack);
                    updateActiveTrack();
                    
                    // Update all track elements
                    elements.playlistTracks = document.querySelectorAll('.playlist-track');
                    updateActiveTrack();
                });
                
                playlistTracksContainer.appendChild(newTrackEl);
                
                // Update playlist count
                const playlistCount = document.querySelector('.playlist-count');
                if (playlistCount) {
                    playlistCount.textContent = `(${state.playlist.length} TRACKS)`;
                }
                
                // Add visual feedback
                elements.addTrackBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    elements.addTrackBtn.style.transform = '';
                }, 200);
                
                // Show notification
                showNotification(`Track "${newTrack.title}" added to playlist`);
            });
        }
    }
    
    // ============================================
    // EQUALIZER ANIMATION
    // ============================================
    
    function updateEqualizer(dataArray) {
        if (!elements.eqBars.length || !dataArray) return;
        
        elements.eqBars.forEach((bar, index) => {
            // Map data array indices to bars
            const dataIndex = Math.floor((index / elements.eqBars.length) * dataArray.length);
            const amplitude = dataArray[dataIndex] || 50;
            
            // Calculate height (20px to 40px range)
            const height = 20 + (amplitude / 255) * 20;
            bar.style.height = `${height}px`;
            
            // Add color variation based on amplitude
            const intensity = amplitude / 255;
            bar.style.background = `linear-gradient(to top, 
                hsl(${300 + intensity * 60}, 100%, 50%), 
                hsl(${270 + intensity * 30}, 100%, 50%))`;
        });
    }
    
    // ============================================
    // REAL-TIME CLOCK
    // ============================================
    
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        if (elements.timeDisplay) {
            elements.timeDisplay.textContent = `${hours}:${minutes}`;
        }
        
        if (elements.amPmDisplay) {
            elements.amPmDisplay.textContent = ampm;
        }
        
        // Update status indicator pulse based on seconds
        const seconds = now.getSeconds();
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            const pulseIntensity = Math.sin(seconds * Math.PI / 30) * 0.5 + 0.5;
            statusIndicator.style.opacity = 0.5 + pulseIntensity * 0.5;
        }
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'vapor-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff00ff, #9d00ff);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: var(--font-heading);
            font-size: 0.9rem;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 10px 30px rgba(255, 0, 255, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function timeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    function secondsToTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function numberToRoman(num) {
        const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'];
        return romanNumerals[Math.min(num - 1, romanNumerals.length - 1)] || num.toString();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        // Initialize audio visualization
        initAudioVisualization();
        
        // Set up event listeners
        if (elements.playBtn) {
            elements.playBtn.addEventListener('click', togglePlay);
        }
        
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', nextTrack);
        }
        
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', prevTrack);
        }
        
        if (elements.repeatBtn) {
            elements.repeatBtn.addEventListener('click', toggleRepeat);
        }
        
        if (elements.shuffleBtn) {
            elements.shuffleBtn.addEventListener('click', toggleShuffle);
        }
        
        // Set up controls
        setupProgressControls();
        setupVolumeControls();
        setupWin95Dialog();
        setupPlaylistInteractions();
        
        // Load initial track
        loadTrack(state.currentTrack);
        updateActiveTrack();
        
        // Start clock
        updateClock();
        setInterval(updateClock, 1000);
        
        // Add initial time progress for demo
        startTimeProgress();
        
        // Add glitch effects periodically
        setInterval(() => {
            // Random VHS glitch effect
            if (Math.random() > 0.7) {
                const glitchOverlay = document.querySelector('.vhs-glitch-overlay');
                if (glitchOverlay) {
                    glitchOverlay.style.background = `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent ${Math.random() * 3}px,
                        rgba(255, 0, 255, ${Math.random() * 0.3}) ${Math.random() * 3}px,
                        rgba(255, 0, 255, ${Math.random() * 0.3}) ${Math.random() * 5}px
                    )`;
                    
                    setTimeout(() => {
                        glitchOverlay.style.background = '';
                    }, 100);
                }
            }
            
            // Random marble bust speed variation
            if (Math.random() > 0.8 && elements.marbleBust) {
                const speed = 20 + Math.random() * 40;
                elements.marbleBust.style.animationDuration = `${speed}s`;
            }
        }, 3000);
        
        // Add parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Move palm trees slightly
            const palmTrees = document.querySelectorAll('.palm-tree');
            palmTrees.forEach((tree, index) => {
                const speed = 0.5 + index * 0.2;
                tree.style.transform = `translate(${(x - 0.5) * 20 * speed}px, ${(y - 0.5) * 20 * speed}px) scale(${0.6 + index * 0.2})`;
            });
            
            // Move floating geometry
            const shapes = document.querySelectorAll('.geom');
            shapes.forEach((shape, index) => {
                const speed = 0.3 + index * 0.1;
                const currentTransform = shape.style.transform || '';
                const newX = (x - 0.5) * 50 * speed;
                const newY = (y - 0.5) * 50 * speed;
                
                // Preserve existing animation transforms
                shape.style.transform = `translate(${newX}px, ${newY}px) ${currentTransform.replace(/translate\([^)]*\)/g, '').trim()}`;
            });
        });
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('ＷＥＬＣＯＭＥ　ＴＯ　ＮＥＯＮ　ＤＲＥＡＭＳ');
        }, 1000);
        
        console.log('Vaporwave Music Player initialized successfully');
    }
    
    // Start everything
    init();
});