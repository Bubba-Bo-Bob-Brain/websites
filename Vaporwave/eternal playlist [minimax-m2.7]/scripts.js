/* ============================================
DEEP SLUMBER - Vaporwave Music Player JavaScript v1.0
============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext;
  var analyser;
  var dataArray;
  var frequencyData;
  var canvas;
  var canvasCtx;
  var isAudioInitialized = false;
  var isPlaying = false;
  var currentTrackIndex = 0;
  var volume = 0.75;
  var progress = 35;
  var progressInterval;
  var currentTime = 94;
  var totalTime = 260;
  var repeatMode = 0;
  var isShuffleOn = false;

  var frequencyBarsContainer = document.getElementById('frequencyBars');
  var numBars = 64;
  
  for (var i = 0; i < numBars; i++) {
    var bar = document.createElement('div');
    bar.className = 'freq-bar';
    bar.style.height = '5px';
    frequencyBarsContainer.appendChild(bar);
  }
  
  var freqBars = document.querySelectorAll('.freq-bar');

  function initAudio() {
    if (isAudioInitialized) return;
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    frequencyData = new Uint8Array(bufferLength);
    canvas = document.getElementById('waveformCanvas');
    canvasCtx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    isAudioInitialized = true;
    animateVisualizer();
  }

  function resizeCanvas() {
    if (!canvas) return;
    var container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  function animateVisualizer() {
    requestAnimationFrame(animateVisualizer);
    if (!analyser) return;

    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgba(10, 10, 15, 0.3)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.strokeStyle = 'rgba(0, 255, 247, 0.05)';
    canvasCtx.lineWidth = 1;
    
    for (var gx = 0; gx < canvas.width; gx += 20) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(gx, 0);
      canvasCtx.lineTo(gx, canvas.height);
      canvasCtx.stroke();
    }
    
    for (var gy = 0; gy < canvas.height; gy += 20) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, gy);
      canvasCtx.lineTo(canvas.width, gy);
      canvasCtx.stroke();
    }

    canvasCtx.strokeStyle = 'rgba(0, 255, 247, 0.1)';
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvas.height / 2);
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    canvasCtx.strokeStyle = '#ff6b9d';
    canvasCtx.lineWidth = 2;
    canvasCtx.shadowBlur = 15;
    canvasCtx.shadowColor = '#ff6b9d';
    canvasCtx.beginPath();
    
    var bufferLength = dataArray.length;
    var sliceWidth = canvas.width / bufferLength;
    var x = 0;
    
    for (var vi = 0; vi < bufferLength; vi++) {
      var v = dataArray[vi] / 128.0;
      var y = (v * canvas.height) / 2;
      if (vi === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    
    canvasCtx.stroke();
    canvasCtx.shadowBlur = 0;

    var barCount = freqBars.length;
    for (var bi = 0; bi < barCount; bi++) {
      var freqIndex = Math.floor(bi * (bufferLength / barCount));
      var value = frequencyData[freqIndex];
      var barHeight = (value / 255) * (canvas.height - 20);
      freqBars[bi].style.height = Math.max(5, barHeight) + 'px';
      var hue = 320 - (bi / barCount) * 120;
      freqBars[bi].style.background = 'linear-gradient(180deg, hsl(' + hue + ', 100%, 70%) 0%, hsl(' + hue + ', 100%, 50%) 50%, hsl(' + hue + ', 100%, 40%) 100%)';
      freqBars[bi].style.boxShadow = '0 0 5px hsl(' + hue + ', 100%, 50%)';
    }
  }

  var playBtn = document.getElementById('playBtn');
  playBtn.addEventListener('click', togglePlay);

  function togglePlay() {
    initAudio();
    isPlaying = !isPlaying;
    playBtn.classList.toggle('playing', isPlaying);
    
    if (isPlaying) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      startProgressSimulation();
    } else {
      stopProgressSimulation();
    }
    updateTrackDisplay();
  }

  function startProgressSimulation() {
    progressInterval = setInterval(function() {
      if (!isPlaying) return;
      currentTime += 1;
      if (currentTime > totalTime) {
        currentTime = 0;
        nextTrack();
      }
      var progressPercent = (currentTime / totalTime) * 100;
      updateProgress(progressPercent);
      updateTimeDisplay();
    }, 1000);
  }

  function stopProgressSimulation() {
    clearInterval(progressInterval);
  }

  function updateProgress(percent) {
    progress = percent;
    var seekSlider = document.getElementById('seekSlider');
    var seekProgress = document.querySelector('.seek-progress');
    seekSlider.value = percent;
    seekProgress.style.width = percent + '%';
    
    var progressFill = document.querySelector('.progress-fill-win95');
    if (progressFill) {
      progressFill.style.width = percent + '%';
    }
    
    var vhsGlitchBar = document.getElementById('vhsGlitchBar');
    if (vhsGlitchBar) {
      vhsGlitchBar.style.left = 'calc(' + percent + '% - 10px)';
      if (Math.random() > 0.95) {
        vhsGlitchBar.style.display = 'block';
        setTimeout(function() {
          vhsGlitchBar.style.display = 'none';
        }, 200);
      }
    }
  }

  function updateTimeDisplay() {
    var currentMin = Math.floor(currentTime / 60);
    var currentSec = currentTime % 60;
    var totalMin = Math.floor(totalTime / 60);
    var totalSec = totalTime % 60;
    
    var timeCurrent = document.querySelector('.time-current');
    var timeTotal = document.querySelector('.time-total');
    var vizTime = document.querySelector('.viz-time');
    var trackingNum = document.querySelector('.vhs-time-display .tracking-num');
    
    if (timeCurrent) timeCurrent.textContent = currentMin + ':' + (currentSec < 10 ? '0' : '') + currentSec;
    if (timeTotal) timeTotal.textContent = totalMin + ':' + (totalSec < 10 ? '0' : '') + totalSec;
    if (vizTime) vizTime.textContent = (currentMin < 10 ? '0' : '') + currentMin + ':' + (currentSec < 10 ? '0' : '') + currentSec + ' / ' + (totalMin < 10 ? '0' : '') + totalMin + ':' + (totalSec < 10 ? '0' : '') + totalSec;
    if (trackingNum) trackingNum.textContent = (currentMin < 10 ? '0' : '') + currentMin + ':' + (currentSec < 10 ? '0' : '') + currentSec;
  }

  var seekSlider = document.getElementById('seekSlider');
  seekSlider.addEventListener('input', function(e) {
    var value = e.target.value;
    currentTime = Math.floor((value / 100) * totalTime);
    updateProgress(value);
    updateTimeDisplay();
  });

  var volumeSlider = document.getElementById('volumeSlider');
  var volumeFill = document.querySelector('.volume-fill');
  var volValue = document.querySelector('.vol-value');

  volumeSlider.addEventListener('input', function(e) {
    volume = e.target.value / 100;
    volumeFill.style.width = (volume * 100) + '%';
    volValue.textContent = Math.round(volume * 100) + '%';
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    var volBtn = document.getElementById('volBtn');
    if (volume === 0) {
      volBtn.innerHTML = '<span class="vol-icon">X</span>';
    } else if (volume < 0.5) {
      volBtn.innerHTML = '<span class="vol-icon">-</span>';
    } else {
      volBtn.innerHTML = '<span class="vol-icon">+</span>';
    }
  }

  var tracks = [
    { name: 'リサフランク420 / 現代のコンピュ', artist: 'MACINTOSH PLUS', album: 'Floral Shoppe', duration: '4:20' },
    { name: '梦喰い白黒杰', artist: 'Uyama Hiroto', album: 'Freeform Jazz', duration: '5:12' },
    { name: 'Fuji Grid Signal', artist: 'Saint Pepsi', album: 'Skylight', duration: '3:45' },
    { name: 'Cryptiles', artist: 'LONE', album: 'Mekong Delta', duration: '6:33' },
    { name: 'Mortal Kombat', artist: 'Windows 96', album: 'My House', duration: '4:08' },
    { name: 'Lagoon', artist: 'Fever Ray', album: 'Plunge', duration: '5:55' },
    { name: 'Nightcall (Remix)', artist: 'Various Artists', album: 'Synthwave Dreams', duration: '7:00' },
    { name: 'Days of Thunder', artist: 'Macross 82-99', album: 'A Million Nights', duration: '3:22' },
    { name: 'Tennis Court Remix', artist: 'Lorde', album: 'Remixes', duration: '4:15' },
    { name: '唇有病', artist: '羲和使用禁止', album: 'Forbidden Tracks', duration: '2:58' },
    { name: 'Afterworld', artist: 'Panda Kamino', album: 'Desert Dreams', duration: '5:42' },
    { name: 'Aesthetic Death', artist: 'Eternity', album: 'Void', duration: '8:88' }
  ];

  var playlistTracks = document.querySelectorAll('.playlist-track');
  
  playlistTracks.forEach(function(track, index) {
    track.addEventListener('click', function() {
      selectTrack(index);
    });
  });

  function selectTrack(index) {
    currentTrackIndex = index;
    currentTime = 0;
    updateProgress(0);
    updateTimeDisplay();

    playlistTracks.forEach(function(t, i) {
      if (i === index) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    
    updateTrackDisplay();

    if (!isPlaying) {
      togglePlay();
    }
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    selectTrack(currentTrackIndex);
  }

  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    selectTrack(currentTrackIndex);
  }

  var nextBtn = document.querySelector('.ctrl-next');
  var prevBtn = document.querySelector('.ctrl-prev');
  var shuffleBtn = document.querySelector('.ctrl-shuffle');
  var repeatBtn = document.querySelector('.ctrl-repeat');

  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function() {
      isShuffleOn = !isShuffleOn;
      if (isShuffleOn) {
        shuffleBtn.classList.add('active');
        shuffleBtn.style.borderColor = 'var(--cyan-glow)';
        shuffleBtn.style.boxShadow = '0 0 15px rgba(0,255,247,0.3)';
      } else {
        shuffleBtn.classList.remove('active');
        shuffleBtn.style.borderColor = '';
        shuffleBtn.style.boxShadow = '';
      }
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener('click', function() {
      repeatMode = (repeatMode + 1) % 3;
      if (repeatMode > 0) {
        repeatBtn.classList.add('active');
      } else {
        repeatBtn.classList.remove('active');
      }
      var icons = ['?', '?', '?'];
      var btnIcon = repeatBtn.querySelector('.btn-icon');
      if (btnIcon) btnIcon.textContent = icons[repeatMode];
    });
  }

  function updateTrackDisplay() {
    var track = tracks[currentTrackIndex];
    var infoValues = document.querySelectorAll('.info-value');
    if (infoValues.length >= 5) {
      infoValues[0].textContent = track.name;
      infoValues[1].textContent = track.artist;
      infoValues[2].textContent = track.album;
      infoValues[3].textContent = '2011';
      infoValues[4].textContent = track.duration;
    }
    var albumName = document.querySelector('.album-name');
    if (albumName) albumName.textContent = track.album;
  }

  var bustHead = document.querySelector('.bust-head');
  var bustGlow = document.querySelector('.bust-glow');

  function animateBust() {
    var time = Date.now() * 0.001;
    var swayAmount = Math.sin(time * 0.5) * 2;
    if (bustHead) {
      bustHead.style.transform = 'rotate(' + swayAmount + 'deg)';
    }
    if (bustGlow) {
      var glowScale = 1 + Math.sin(time) * 0.2;
      bustGlow.style.transform = 'translate(-50%, -50%) scale(' + glowScale + ')';
    }
    requestAnimationFrame(animateBust);
  }
  animateBust();

  var glitchText = document.querySelector('.glitch-text');
  if (glitchText) {
    var originalText = glitchText.textContent;
    var glitchChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    
    setInterval(function() {
      if (Math.random() > 0.9) {
        var glitchedText = '';
        for (var gi = 0; gi < originalText.length; gi++) {
          if (Math.random() > 0.8) {
            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            glitchedText += originalText[gi];
          }
        }
        glitchText.setAttribute('data-text', glitchedText);
        setTimeout(function() {
          glitchText.setAttribute('data-text', originalText);
        }, 100);
      }
    }, 100);
  }

  var vhsTrackingLines = document.querySelector('.vhs-tracking-lines');
  if (vhsTrackingLines) {
    setInterval(function() {
      if (Math.random() > 0.95) {
        vhsTrackingLines.style.opacity = Math.random() * 0.3;
        setTimeout(function() {
          vhsTrackingLines.style.opacity = '1';
        }, 50);
      }
    }, 100);
  }

  var floatingOrbs = document.querySelectorAll('.floating-orb');
  floatingOrbs.forEach(function(orb) {
    orb.addEventListener('mouseenter', function() {
      orb.style.transform = 'scale(1.5)';
      orb.style.transition = 'transform 0.5s ease';
    });
    orb.addEventListener('mouseleave', function() {
      orb.style.transform = 'scale(1)';
    });
  });

  var parallaxBg = document.querySelector('.parallax-bg');
  var palmTrees = document.querySelectorAll('.palm-tree');
  var floatingKanji = document.querySelectorAll('.floating-kanji');
  var mouseX = 0;
  var mouseY = 0;
  var targetX = 0;
  var targetY = 0;
  var smoothing = 0.05;

  document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
  });

  function updateParallax() {
    targetX += (mouseX - targetX) * smoothing;
    targetY += (mouseY - targetY) * smoothing;
    
    if (parallaxBg) {
      parallaxBg.style.transform = 'translate(' + (targetX * 0.2) + 'px, ' + (targetY * 0.2) + 'px)';
    }
    
    palmTrees.forEach(function(palm, index) {
      var direction = index % 2 === 0 ? 1 : -1;
      palm.style.transform = 'translateX(' + (targetX * 0.5 * direction) + 'px) translateY(' + (targetY * 0.3) + 'px)';
    });
    
    floatingKanji.forEach(function(kanji, index) {
      var depth = (index + 1) * 0.5;
      kanji.style.transform = 'translate(' + (targetX * depth) + 'px, ' + (targetY * depth) + 'px)';
    });
    
    requestAnimationFrame(updateParallax);
  }
  updateParallax();

  var albumDisc = document.querySelector('.album-disc');
  
  function spinAlbumDisc() {
    if (isPlaying && albumDisc) {
      albumDisc.style.animationPlayState = 'running';
    } else if (albumDisc) {
      albumDisc.style.animationPlayState = 'paused';
    }
    requestAnimationFrame(spinAlbumDisc);
  }
  spinAlbumDisc();

  var miniArts = document.querySelectorAll('.track-mini-art');
  
  function spinMiniDiscs() {
    miniArts.forEach(function(miniArt, index) {
      if (index === currentTrackIndex && isPlaying) {
        miniArt.style.animationPlayState = 'running';
      } else {
        miniArt.style.animationPlayState = 'paused';
      }
    });
    requestAnimationFrame(spinMiniDiscs);
  }
  spinMiniDiscs();

  document.addEventListener('keydown', function(e) {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        currentTime = Math.min(currentTime + 10, totalTime);
        updateProgress((currentTime / totalTime) * 100);
        updateTimeDisplay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        currentTime = Math.max(currentTime - 10, 0);
        updateProgress((currentTime / totalTime) * 100);
        updateTimeDisplay();
        break;
      case 'ArrowUp':
        e.preventDefault();
        volume = Math.min(volume + 0.1, 1);
        volumeSlider.value = volume * 100;
        volumeFill.style.width = (volume * 100) + '%';
        volValue.textContent = Math.round(volume * 100) + '%';
        updateVolumeIcon();
        break;
      case 'ArrowDown':
        e.preventDefault();
        volume = Math.max(volume - 0.1, 0);
        volumeSlider.value = volume * 100;
        volumeFill.style.width = (volume * 100) + '%';
        volValue.textContent = Math.round(volume * 100) + '%';
        updateVolumeIcon();
        break;
      case 'KeyN':
        nextTrack();
        break;
      case 'KeyP':
        prevTrack();
        break;
    }
  });

  var win95Close = document.querySelector('.btn-close');
  var win95Dialog = document.querySelector('.win95-dialog');
  
  if (win95Close && win95Dialog) {
    win95Close.addEventListener('click', function() {
      win95Dialog.style.display = 'none';
      setTimeout(function() {
        win95Dialog.style.display = 'block';
      }, 5000);
    });
  }

  updateTimeDisplay();
  updateProgress(progress);
  updateTrackDisplay();
  updateVolumeIcon();
  
  if (playlistTracks.length > 0) {
    playlistTracks[0].classList.add('active');
  }

  console.log('DEEP SLUMBER - Vaporwave Music Player Initialized');
  console.log('Press Space to Play/Pause');
  console.log('Use Arrow Keys to Control');
  
});