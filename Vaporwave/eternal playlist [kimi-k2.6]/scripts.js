// ============================================
// VAPORWAVE MIDNIGHT ARCADE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // DOM ELEMENTS
  // ============================================
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  
  const vhsBar = document.getElementById('vhsBar');
  const vhsProgress = document.getElementById('vhsProgress');
  const vhsGlitch = document.getElementById('vhsGlitch');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  
  const volumeBar = document.getElementById('volumeBar');
  const volumeFill = document.getElementById('volumeFill');
  const volValue = document.getElementById('volValue');
  
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const trackAlbum = document.getElementById('trackAlbum');
  const albumPlaceholder = document.getElementById('albumPlaceholder');
  
  const playlist = document.getElementById('playlist');
  const playlistItems = document.querySelectorAll('.playlist-item');
  const addTrackBtn = document.getElementById('addTrackBtn');
  const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
  
  const addTrackModal = document.getElementById('addTrackModal');
  const closeModal = document.getElementById('closeModal');
  const confirmAddTrack = document.getElementById('confirmAddTrack');
  const cancelAddTrack = document.getElementById('cancelAddTrack');
  const newTrackTitle = document.getElementById('newTrackTitle');
  const newTrackArtist = document.getElementById('newTrackArtist');
  const newTrackDuration = document.getElementById('newTrackDuration');
  
  const headerTime = document.getElementById('headerTime');
  const chromaticAb = document.querySelector('.chromatic-aberration');
  
  // ============================================
  // STATE
  // ============================================
  
  let isPlaying = false;
  let currentTrackIndex = 0;
  let currentTime = 0;
  let duration = 260;
  let playbackInterval = null;
  let isShuffle = false;
  let isRepeat = false;
  let volume = 0.8;
  
  const tracks = [
    {
      title: "Midnight Cruiser '84",
      artist: "ＮＥＯＮ ＤＲＥＡＭＳ",
      album: "〜 Tokyo After Dark 〜",
      duration: 260,
      placeholderText: "夕暮れ",
      gradient: "linear-gradient(180deg, #ff5cad 0%, #bc13fe 60%, #4a1a6e 100%)"
    },
    {
      title: "Macintoshè Ｍａｉｄ",
      artist: "デジタル ラブ",
      album: "〜 Cyber Romance 〜",
      duration: 225,
      placeholderText: "恋愛",
      gradient: "linear-gradient(180deg, #00f0ff 0%, #bc13fe 60%, #ff2a6d 100%)"
    },
    {
      title: "Palm Trees & Pixel Dreams",
      artist: "ＳＵＮＳＥＴ ＣＬＵＢ",
      album: "〜 Eternal Summer 〜",
      duration: 312,
      placeholderText: "夏夜",
      gradient: "linear-gradient(180deg, #ffd700 0%, #ff5cad 60%, #bc13fe 100%)"
    },
    {
      title: "ＳＨＯＰＰＩＮＧ  ＭＡＬＬ  ９５",
      artist: "エレベーター ミュージック",
      album: "〜 Consumer Paradise 〜",
      duration: 188,
      placeholderText: "消費",
      gradient: "linear-gradient(180deg, #05ffa1 0%, #00f0ff 60%, #bc13fe 100%)"
    },
    {
      title: "Crying in the Lamborghini",
      artist: "ＳＡＤ ＢＯＹ ＳＡＴＵＲＤＡＹ",
      album: "〜 Luxury Tears 〜",
      duration: 295,
      placeholderText: "涙",
      gradient: "linear-gradient(180deg, #ff2a6d 0%, #ff5cad 40%, #ffd700 100%)"
    },
    {
      title: "Fuji at Dusk (feat. 夢見)",
      artist: "ＡＥＳＴＨＥＴＩＣ ＳＯＵＮＤ",
      album: "〜 Purple Skies 〜",
      duration: 393,
      placeholderText: "富士",
      gradient: "linear-gradient(180deg, #bc13fe 0%, #ff2a6d 60%, #ffd700 100%)"
    }
  ];
  
  // ============================================
  // WAVEFORM VISUALIZER
  // ============================================
  
  const canvas = document.getElementById('waveformCanvas');
  const ctx = canvas.getContext('2d');
  let animationId = null;
  let waveOffset = 0;
  
  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  
  function drawWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    if (!isPlaying) {
      // Flat line when paused
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      return;
    }
    
    waveOffset += 0.08;
    
    // Multiple wave layers
    const waves = [
      { color: 'rgba(255, 42, 109, 0.6)', amp: 30, freq: 0.02, speed: 1 },
      { color: 'rgba(188, 19, 254, 0.5)', amp: 25, freq: 0.015, speed: 1.5 },
      { color: 'rgba(0, 240, 255, 0.4)', amp: 20, freq: 0.025, speed: 0.8 },
      { color: 'rgba(255, 92, 173, 0.3)', amp: 35, freq: 0.018, speed: 2 }
    ];
    
    waves.forEach((wave, index) => {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 2 - index * 0.3;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const y = centerY + 
          Math.sin(x * wave.freq + waveOffset * wave.speed + index) * wave.amp +
          Math.sin(x * wave.freq * 2 + waveOffset * wave.speed * 1.5) * (wave.amp * 0.3) +
          (Math.random() - 0.5) * (isPlaying ? 5 : 0);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    });
    
    // Fill area under main wave
    ctx.fillStyle = 'rgba(255, 42, 109, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x < width; x++) {
      const y = centerY + 
        Math.sin(x * 0.02 + waveOffset) * 30 +
        Math.sin(x * 0.015 + waveOffset * 1.5) * 25;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    
    animationId = requestAnimationFrame(drawWaveform);
  }
  
  // ============================================
  // PLAYBACK CONTROLS
  // ============================================
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  function parseTime(timeStr) {
    const [mins, secs] = timeStr.split(':').map(Number);
    return mins * 60 + secs;
  }
  
  function updateTrackInfo() {
    const track = tracks[currentTrackIndex];
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    trackAlbum.textContent = track.album;
    totalTimeEl.textContent = formatTime(track.duration);
    duration = track.duration;
    
    // Update placeholder
    const placeholderText = albumPlaceholder.querySelector('.placeholder-text');
    placeholderText.textContent = track.placeholderText;
    albumPlaceholder.style.background = track.gradient;
    
    // Update playlist highlighting
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
      item.classList.toggle('playing', index === currentTrackIndex);
    });
  }
  
  function play() {
    isPlaying = true;
    playIcon.hidden = true;
    pauseIcon.hidden = false;
    
    if (playbackInterval) clearInterval(playbackInterval);
    
    playbackInterval = setInterval(() => {
      currentTime += 1;
      
      if (currentTime >= duration) {
        if (isRepeat) {
          currentTime = 0;
        } else if (isShuffle) {
          currentTrackIndex = Math.floor(Math.random() * tracks.length);
          currentTime = 0;
          updateTrackInfo();
        } else {
          nextTrack();
          return;
        }
      }
      
      updateProgress();
    }, 1000);
    
    if (!animationId) {
      drawWaveform();
    }
  }
  
  function pause() {
    isPlaying = false;
    playIcon.hidden = false;
    pauseIcon.hidden = true;
    
    clearInterval(playbackInterval);
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    // Draw flat line
    drawWaveform();
  }
  
  function updateProgress() {
    const progress = (currentTime / duration) * 100;
    vhsProgress.style.width = `${progress}%`;
    vhsGlitch.style.left = `${progress}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }
  
  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  
  function nextTrack() {
    currentTime = 0;
    if (isShuffle) {
      currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    updateTrackInfo();
    updateProgress();
    if (isPlaying) {
      clearInterval(playbackInterval);
      play();
    }
  }
  
  function prevTrack() {
    currentTime = 0;
    if (isShuffle) {
      currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
      currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    updateTrackInfo();
    updateProgress();
    if (isPlaying) {
      clearInterval(playbackInterval);
      play();
    }
  }
  
  // ============================================
  // VHS SEEK BAR
  // ============================================
  
  function handleVHSBarClick(e) {
    const rect = vhsBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    currentTime = Math.floor(percentage * duration);
    updateProgress();
  }
  
  // ============================================
  // VOLUME CONTROL
  // ============================================
  
  function handleVolumeClick(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    volume = percentage;
    volumeFill.style.width = `${percentage * 100}%`;
    volValue.textContent = `${Math.round(percentage * 100)}%`;
  }
  
  // ============================================
  // PLAYLIST MANAGEMENT
  // ============================================
  
  let draggedItem = null;
  
  function initPlaylistDragDrop() {
    const items = document.querySelectorAll('.playlist-item');
    
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        document.querySelectorAll('.playlist-item').forEach(i => {
          i.classList.remove('drag-over');
        });
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (item !== draggedItem) {
          item.classList.add('drag-over');
        }
      });
      
      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });
      
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');
        
        if (item !== draggedItem) {
          const allItems = [...playlist.querySelectorAll('.playlist-item')];
          const draggedIdx = allItems.indexOf(draggedItem);
          const targetIdx = allItems.indexOf(item);
          
          if (draggedIdx < targetIdx) {
            item.after(draggedItem);
          } else {
            item.before(draggedItem);
          }
          
          renumberTracks();
        }
      });
      
      // Click to play
      item.addEventListener('click', (e) => {
        if (e.target.closest('.track-remove')) return;
        
        const index = parseInt(item.dataset.track);
        currentTrackIndex = index;
        currentTime = 0;
        updateTrackInfo();
        updateProgress();
        if (!isPlaying) {
          play();
        }
      });
      
      // Remove button
      const removeBtn = item.querySelector('.track-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (document.querySelectorAll('.playlist-item').length <= 1) {
            return;
          }
          item.remove();
          renumberTracks();
        });
      }
    });
  }
  
  function renumberTracks() {
    const items = playlist.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      item.dataset.track = index;
      const numEl = item.querySelector('.track-number');
      if (numEl) {
        numEl.textContent = (index + 1).toString().padStart(2, '0');
      }
    });
  }
  
  function showAddTrackModal() {
    addTrackModal.classList.add('active');
    newTrackTitle.focus();
  }
  
  function hideAddTrackModal() {
    addTrackModal.classList.remove('active');
    newTrackTitle.value = '';
    newTrackArtist.value = '';
    newTrackDuration.value = '03:00';
  }
  
  function addNewTrack() {
    const title = newTrackTitle.value.trim();
    const artist = newTrackArtist.value.trim();
    const durationStr = newTrackDuration.value.trim() || '03:00';
    
    if (!title || !artist) return;
    
    const durationSec = parseTime(durationStr);
    const newTrack = {
      title,
      artist,
      album: "〜 Unknown Album 〜",
      duration: durationSec,
      placeholderText: "新曲",
      gradient: "linear-gradient(180deg, #ff2a6d 0%, #bc13fe 60%, #4a1a6e 100%)"
    };
    
    tracks.push(newTrack);
    
    const itemCount = playlist.querySelectorAll('.playlist-item').length;
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.dataset.track = itemCount;
    li.draggable = true;
    li.innerHTML = `
      <div class="column-divider"></div>
      <div class="track-number">${(itemCount + 1).toString().padStart(2, '0')}</div>
      <div class="track-info">
        <span class="track-name">${title}</span>
        <span class="track-artist-small">${artist}</span>
      </div>
      <div class="track-duration">${durationStr}</div>
      <div class="track-visual">
        <div class="eq-bar"></div>
        <div class="eq-bar"></div>
        <div class="eq-bar"></div>
        <div class="eq-bar"></div>
      </div>
      <button class="track-remove" title="Remove">×</button>
    `;
    
    playlist.appendChild(li);
    initPlaylistDragDrop();
    hideAddTrackModal();
  }
  
  function clearPlaylist() {
    const items = playlist.querySelectorAll('.playlist-item');
    if (items.length <= 1) return;
    
    // Keep first item, remove rest
    for (let i = 1; i < items.length; i++) {
      items[i].remove();
    }
    
    currentTrackIndex = 0;
    currentTime = 0;
    updateTrackInfo();
    updateProgress();
    if (isPlaying) pause();
  }
  
  // ============================================
  // CHROMATIC ABERRATION EFFECT
  // ============================================
  
  function triggerChromaticGlitch() {
    chromaticAb.style.opacity = '1';
    setTimeout(() => {
      chromaticAb.style.opacity = '0';
    }, 100);
  }
  
  // ============================================
  // PARALLAX SCROLL
  // ============================================
  
  function handleParallax() {
    const layers = document.querySelectorAll('.palm-layer');
    const scrolled = window.scrollY;
    
    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 0.5;
      const yPos = scrolled * speed;
      layer.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  // ============================================
  // CLOCK
  // ============================================
  
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    headerTime.textContent = `${hours}:${minutes}`;
  }
  
  // ============================================
  // GLITCH EFFECTS
  // ============================================
  
  function randomGlitch() {
    if (Math.random() > 0.95) {
      triggerChromaticGlitch();
    }
  }
  
  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  playPauseBtn.addEventListener('click', togglePlayPause);
  prevBtn.addEventListener('click', () => {
    prevTrack();
    triggerChromaticGlitch();
  });
  nextBtn.addEventListener('click', () => {
    nextTrack();
    triggerChromaticGlitch();
  });
  
  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
  });
  
  repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
  });
  
  vhsBar.addEventListener('click', handleVHSBarClick);
  
  volumeBar.addEventListener('click', handleVolumeClick);
  
  addTrackBtn.addEventListener('click', showAddTrackModal);
  clearPlaylistBtn.addEventListener('click', clearPlaylist);
  closeModal.addEventListener('click', hideAddTrackModal);
  cancelAddTrack.addEventListener('click', hideAddTrackModal);
  confirmAddTrack.addEventListener('click', addNewTrack);
  
  // Modal overlay click to close
  addTrackModal.addEventListener('click', (e) => {
    if (e.target === addTrackModal) {
      hideAddTrackModal();
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      togglePlayPause();
    }
    if (e.code === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      prevTrack();
    }
    if (e.code === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      nextTrack();
    }
  });
  
  window.addEventListener('scroll', handleParallax);
  window.addEventListener('resize', resizeCanvas);
  
  // Random glitch interval
  setInterval(randomGlitch, 2000);
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  resizeCanvas();
  initPlaylistDragDrop();
  updateTrackInfo();
  updateProgress();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Start with flat waveform
  drawWaveform();
});