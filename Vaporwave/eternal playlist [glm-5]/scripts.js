document.addEventListener('DOMContentLoaded', function() {
    const state = {
        isPlaying: false,
        currentTrack: 0,
        volume: 78,
        currentTime: 154,
        totalTime: 261,
        shuffle: false,
        repeat: false,
        tracks: [
            {
                id: 0,
                title: 'マクロス 82-99',
                artist: 'VAPORWAVE COLLECTIVE',
                album: '『 霊長類の夕べ 』',
                duration: '4:21',
                durationSeconds: 261
            },
            {
                id: 1,
                title: 'リサフランク420 / 現代のコンピュー',
                artist: 'MACROSS 82-99',
                album: '『 PRIVATE CALLER 』',
                duration: '3:58',
                durationSeconds: 238
            },
            {
                id: 2,
                title: 'ブートレグ',
                artist: 'SAINT PEPSI',
                album: '『 NEW BEACH 』',
                duration: '5:12',
                durationSeconds: 312
            },
            {
                id: 3,
                title: '海で見た夢',
                artist: 'TANUKI',
                album: '『 OCEAN DREAMS 』',
                duration: '4:45',
                durationSeconds: 285
            },
            {
                id: 4,
                title: '夜のドライブ',
                artist: 'HOME',
                album: '『 ODYSSEY 』',
                duration: '3:33',
                durationSeconds: 213
            },
            {
                id: 5,
                title: '桜花爛漫',
                artist: 'LUXURY ELITE',
                album: '『 CHERRY BLOSSOM 』',
                duration: '6:02',
                durationSeconds: 362
            },
            {
                id: 6,
                title: 'ネオ東京',
                artist: 'GRICC',
                album: '『 CYBER CITY 』',
                duration: '4:17',
                durationSeconds: 257
            },
            {
                id: 7,
                title: '幻覚',
                artist: 'FRIENDZONE',
                album: '『 DX 』',
                duration: '5:44',
                durationSeconds: 344
            }
        ]
    };

    const elements = {
        playPauseBtn: document.querySelector('.play-pause'),
        prevBtn: document.querySelector('.prev'),
        nextBtn: document.querySelector('.next'),
        shuffleBtn: document.querySelector('.shuffle'),
        repeatBtn: document.querySelector('.repeat'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        trackTitle: document.getElementById('track-title'),
        volumeSlider: document.querySelector('.volume-slider'),
        volumeFill: document.querySelector('.volume-fill'),
        volumeHandle: document.querySelector('.volume-handle'),
        volumePercentage: document.querySelector('.volume-percentage'),
        vhsTrackingBar: document.querySelector('.vhs-tracking-bar'),
        trackingLine: document.querySelector('.tracking-line'),
        vhsHead: document.querySelector('.vhs-head'),
        currentTimeDisplay: document.querySelector('.current-time'),
        totalTimeDisplay: document.querySelector('.total-time'),
        waveformBars: document.querySelectorAll('.waveform-bar'),
        addTrackBtn: document.querySelector('.add-track'),
        shufflePlaylistBtn: document.querySelector('.shuffle-playlist'),
        dialogClose: document.querySelector('.dialog-btn.close'),
        dialogMinimize: document.querySelector('.dialog-btn.minimize'),
        dialogMaximize: document.querySelector('.dialog-btn.maximize'),
        dialogError: document.querySelector('.dialog-error'),
        marbleBust: document.querySelector('.marble-bust')
    };

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTrackInfo() {
        const track = state.tracks[state.currentTrack];
        if (elements.trackTitle) {
            elements.trackTitle.textContent = track.title;
        }
        const artistEl = document.querySelector('.track-artist');
        if (artistEl) {
            artistEl.textContent = `- ${track.artist} -`;
        }
        const albumEl = document.querySelector('.track-album');
        if (albumEl) {
            albumEl.textContent = track.album;
        }
        state.totalTime = track.durationSeconds;
        if (elements.totalTimeDisplay) {
            elements.totalTimeDisplay.textContent = formatTime(state.totalTime);
        }
    }

    function updatePlaylistHighlight() {
        elements.playlistItems.forEach(function(item) {
            const trackIndex = parseInt(item.dataset.track);
            if (trackIndex === state.currentTrack) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function togglePlayPause() {
        state.isPlaying = !state.isPlaying;
        if (elements.playPauseBtn) {
            elements.playPauseBtn.classList.toggle('playing', state.isPlaying);
        }
        if (state.isPlaying) {
            startPlaybackSimulation();
        } else {
            stopPlaybackSimulation();
        }
    }

    let playbackInterval = null;

    function startPlaybackSimulation() {
        if (playbackInterval) {
            clearInterval(playbackInterval);
        }
        playbackInterval = setInterval(function() {
            if (state.isPlaying && state.currentTime < state.totalTime) {
                state.currentTime += 1;
                updateTimeDisplay();
                updateWaveformIntensity();
            } else if (state.currentTime >= state.totalTime) {
                if (state.repeat) {
                    state.currentTime = 0;
                } else {
                    nextTrack();
                }
            }
        }, 1000);
    }

    function stopPlaybackSimulation() {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
    }

    function updateTimeDisplay() {
        if (elements.currentTimeDisplay) {
            elements.currentTimeDisplay.textContent = formatTime(state.currentTime);
        }
        const progress = (state.currentTime / state.totalTime) * 100;
        if (elements.trackingLine) {
            elements.trackingLine.style.width = `${progress}%`;
        }
        if (elements.vhsHead) {
            elements.vhsHead.style.left = `calc(${progress}% - 15px)`;
        }
    }

    function updateWaveformIntensity() {
        const intensity = state.isPlaying ? 1 : 0.3;
        elements.waveformBars.forEach(function(bar) {
            bar.style.opacity = intensity;
        });
    }

    function prevTrack() {
        if (state.currentTrack > 0) {
            state.currentTrack = state.currentTrack - 1;
        } else {
            state.currentTrack = state.tracks.length - 1;
        }
        state.currentTime = 0;
        updateTrackInfo();
        updatePlaylistHighlight();
        updateTimeDisplay();
    }

    function nextTrack() {
        if (state.shuffle) {
            let newTrack;
            do {
                newTrack = Math.floor(Math.random() * state.tracks.length);
            } while (newTrack === state.currentTrack && state.tracks.length > 1);
            state.currentTrack = newTrack;
        } else {
            state.currentTrack = (state.currentTrack + 1) % state.tracks.length;
        }
        state.currentTime = 0;
        updateTrackInfo();
        updatePlaylistHighlight();
        updateTimeDisplay();
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        if (elements.shuffleBtn) {
            elements.shuffleBtn.classList.toggle('active', state.shuffle);
        }
    }

    function toggleRepeat() {
        state.repeat = !state.repeat;
        if (elements.repeatBtn) {
            elements.repeatBtn.classList.toggle('active', state.repeat);
        }
    }

    function handleSeek(e) {
        const rect = elements.vhsTrackingBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        state.currentTime = Math.floor(percentage * state.totalTime);
        updateTimeDisplay();
        triggerVHSGlitch();
    }

    function triggerVHSGlitch() {
        const overlay = document.querySelector('.vhs-tracking-overlay');
        if (overlay) {
            overlay.style.animation = 'none';
            overlay.offsetHeight;
            overlay.style.animation = 'vhsGlitch 0.3s ease-out';
        }
        setTimeout(function() {
            if (overlay) {
                overlay.style.animation = 'vhsFlicker 0.15s infinite';
            }
        }, 300);
    }

    function handleVolumeChange(e) {
        const rect = elements.volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        state.volume = Math.round(percentage);
        if (elements.volumeFill) {
            elements.volumeFill.style.width = `${state.volume}%`;
        }
        if (elements.volumeHandle) {
            elements.volumeHandle.style.left = `${state.volume}%`;
        }
        if (elements.volumePercentage) {
            elements.volumePercentage.textContent = `${state.volume}%`;
        }
    }

    function handlePlaylistClick(e) {
        const item = e.currentTarget;
        const trackIndex = parseInt(item.dataset.track);
        if (!isNaN(trackIndex)) {
            state.currentTrack = trackIndex;
            state.currentTime = 0;
            updateTrackInfo();
            updatePlaylistHighlight();
            updateTimeDisplay();
            if (!state.isPlaying) {
                togglePlayPause();
            }
        }
    }

    function initDraggableDialog() {
        const dialog = document.querySelector('.track-info-dialog');
        if (!dialog) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialX = 0;
        let initialY = 0;

        dialog.addEventListener('mousedown', function(ev) {
            if (ev.target.closest('.dialog-btn')) return;
            isDragging = true;
            startX = ev.clientX;
            startY = ev.clientY;
            const transform = window.getComputedStyle(dialog).transform;
            if (transform !== 'none') {
                const matrixValues = transform.match(/matrix.*\((.+)\)/);
                if (matrixValues) {
                    const values = matrixValues[1].split(', ');
                    initialX = parseFloat(values[4]);
                    initialY = parseFloat(values[5]);
                }
            } else {
                initialX = 0;
                initialY = 0;
            }
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        });

        function drag(ev) {
            if (!isDragging) return;
            const deltaX = ev.clientX - startX;
            const deltaY = ev.clientY - startY;
            dialog.style.transform = `translate(${initialX + deltaX}px, ${initialY + deltaY}px) rotate(-2deg)`;
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    function initVHSEffects() {
        setInterval(function() {
            if (Math.random() > 0.95) {
                triggerVHSGlitch();
            }
        }, 2000);

        const errorEl = elements.dialogError;
        if (errorEl) {
            setInterval(function() {
                if (errorEl.style.display === 'none') {
                    errorEl.style.display = 'flex';
                } else {
                    errorEl.style.display = 'none';
                }
            }, 8000);
        }
    }

    function initParallax() {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        function animate() {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            const palmBack = document.querySelector('.palm-back');
            const palmMid = document.querySelector('.palm-mid');
            const palmFront = document.querySelector('.palm-front');
            const gridFloor = document.querySelector('.grid-floor');

            if (palmBack) {
                palmBack.style.transform = `translateX(${targetX * 0.5}px) translateY(${targetY * 0.3}px)`;
            }
            if (palmMid) {
                palmMid.style.transform = `translateX(${targetX * 0.8}px) translateY(${targetY * 0.5}px)`;
            }
            if (palmFront) {
                palmFront.style.transform = `translateX(${targetX}px) translateY(${targetY * 0.7}px)`;
            }
            if (gridFloor) {
                gridFloor.style.transform = `perspective(500px) rotateX(60deg) translateX(${targetX * 0.3}px)`;
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initFloatingKanji() {
        const kanjis = document.querySelectorAll('.kanji');
        kanjis.forEach(function(kanji, index) {
            const randomDelay = Math.random() * 10;
            const randomDuration = 15 + Math.random() * 10;
            kanji.style.animationDelay = `${randomDelay}s`;
            kanji.style.animationDuration = `${randomDuration}s`;
        });
    }

    function initWaveformVariation() {
        elements.waveformBars.forEach(function(bar, index) {
            const randomHeight = 40 + Math.random() * 50;
            bar.style.height = `${randomHeight}px`;

            setInterval(function() {
                if (state.isPlaying) {
                    const newHeight = 30 + Math.random() * 70;
                    bar.style.height = `${newHeight}px`;
                }
            }, 100 + index * 20);
        });
    }

    function handleDialogControls() {
        if (elements.dialogClose) {
            elements.dialogClose.addEventListener('click', function() {
                const dialog = document.querySelector('.track-info-dialog');
                if (dialog) {
                    dialog.style.display = 'none';
                    setTimeout(function() {
                        dialog.style.display = 'block';
                        dialog.style.transform = 'rotate(-2deg)';
                    }, 3000);
                }
            });
        }

        if (elements.dialogMinimize) {
            elements.dialogMinimize.addEventListener('click', function() {
                const content = document.querySelector('.dialog-content');
                const error = document.querySelector('.dialog-error');
                if (content) {
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                }
                if (error) {
                    error.style.display = 'none';
                }
            });
        }

        if (elements.dialogMaximize) {
            elements.dialogMaximize.addEventListener('click', function() {
                const dialog = document.querySelector('.track-info-dialog');
                if (dialog) {
                    if (dialog.style.width === '90%') {
                        dialog.style.width = '320px';
                        dialog.style.transform = 'rotate(-2deg)';
                    } else {
                        dialog.style.width = '90%';
                        dialog.style.maxWidth = '500px';
                        dialog.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    }

    function initMarbleBustInteraction() {
        const bustContainer = document.querySelector('.marble-bust-container');
        if (bustContainer) {
            bustContainer.addEventListener('mouseenter', function() {
                if (elements.marbleBust) {
                    elements.marbleBust.style.animationPlayState = 'paused';
                }
            });
            bustContainer.addEventListener('mouseleave', function() {
                if (elements.marbleBust) {
                    elements.marbleBust.style.animationPlayState = 'running';
                }
            });
        }
    }

    function initKeyboardControls() {
        document.addEventListener('keydown', function(e) {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowLeft':
                    prevTrack();
                    break;
                case 'ArrowRight':
                    nextTrack();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    state.volume = Math.min(100, state.volume + 5);
                    updateVolumeUI();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    state.volume = Math.max(0, state.volume - 5);
                    updateVolumeUI();
                    break;
                case 'KeyM':
                    state.volume = state.volume > 0 ? 0 : 78;
                    updateVolumeUI();
                    break;
            }
        });
    }

    function updateVolumeUI() {
        if (elements.volumeFill) {
            elements.volumeFill.style.width = `${state.volume}%`;
        }
        if (elements.volumeHandle) {
            elements.volumeHandle.style.left = `${state.volume}%`;
        }
        if (elements.volumePercentage) {
            elements.volumePercentage.textContent = `${state.volume}%`;
        }
    }

    function init() {
        updateTrackInfo();
        updatePlaylistHighlight();
        updateTimeDisplay();

        if (elements.playPauseBtn) {
            elements.playPauseBtn.addEventListener('click', togglePlayPause);
        }
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', prevTrack);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', nextTrack);
        }
        if (elements.shuffleBtn) {
            elements.shuffleBtn.addEventListener('click', toggleShuffle);
        }
        if (elements.repeatBtn) {
            elements.repeatBtn.addEventListener('click', toggleRepeat);
        }
        if (elements.vhsTrackingBar) {
            elements.vhsTrackingBar.addEventListener('click', handleSeek);
        }
        if (elements.volumeSlider) {
            elements.volumeSlider.addEventListener('click', handleVolumeChange);
        }

        elements.playlistItems.forEach(function(item) {
            item.addEventListener('click', handlePlaylistClick);
        });

        initDraggableDialog();
        initVHSEffects();
        initParallax();
        initFloatingKanji();
        initWaveformVariation();
        handleDialogControls();
        initMarbleBustInteraction();
        initKeyboardControls();

        console.log('🎵 深夜音楽 Player Initialized');
        console.log('✨ Press SPACE to play/pause');
        console.log('⌨️ Use arrow keys for navigation');
    }

    init();
});