const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');
const seekSlider = document.getElementById('seekSlider');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const playlistItems = document.querySelectorAll('.playlist-item');
const albumArt = document.getElementById('albumArt');
const trackTitle = document.getElementById('currentTrackTitle');
const trackArtist = document.getElementById('currentTrackArtist');
const trackAlbum = document.getElementById('currentTrackAlbum');
const waveformCanvas = document.getElementById('waveform');
const canvasCtx = waveformCanvas.getContext('2d');
const marbleBust = document.getElementById('marbleBust');
const dialogClose = document.querySelector('.dialog-close');
const dialogError = document.querySelector('.dialog-error');
const floatingKana = document.querySelectorAll('.floating-kana span');
const palmLayers = document.querySelectorAll('.parallax-layer');

const tracks = [
  {
    title: 'Neo Tokyo Drive',
    artist: 'Vaporwave Collective',
    album: 'Midnight Mall 1999',
    art: 'https://placehold.co/300x300/2a003b/ff9de0?text=vaporwave%0Aalbum%0Aart%0A♡',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:45'
  },
  {
    title: 'Mall Softness',
    artist: 'Lofi Vapor',
    album: 'Shopping Center Dreams',
    art: 'https://placehold.co/300x300/4a0080/00e5ff?text=mall%0Asoftness%0A♡',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:12'
  },
  {
    title: 'Palm Tree Sunset',
    artist: 'Retro Dreams',
    album: 'Tropical VHS',
    art: 'https://placehold.co/300x300/9c27b0/ffd700?text=palm%0Atree%0Asunset%0A♡',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '3:58'
  },
  {
    title: 'Windows 96 Error',
    artist: 'Glitch Master',
    album: 'System Failure',
    art: 'https://placehold.co/300x300/2a003b/ff00ff?text=windows%0A96%0Aerror%0A♡',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '5:01'
  },
  {
    title: 'Marble Bust Lullaby',
    artist: 'Aesthetic Void',
    album: 'Ancient Synths',
    art: 'https://placehold.co/300x300/4a0080/ff9de0?text=marble%0Abust%0Alullaby%0A♡',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '4:30'
  }
];

let currentTrackIndex = 0;
let audioContext, analyser, source;
let visualizerRunning = false;

const style = document.createElement('style');
style.textContent = `
  @keyframes crtOn {
    0% { transform: scaleY(0.01) scaleX(0); opacity: 1; }
    50% { transform: scaleY(0.01) scaleX(1); opacity: 1; }
    100% { transform: scaleY(1) scaleX(1); opacity: 0; }
  }
  @keyframes vhsShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes randomGlitch {
    0% { transform: translate(0); filter: hue-rotate(0deg); }
    25% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
    50% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
    75% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
    100% { transform: translate(0); filter: hue-rotate(0deg); }
  }
  @keyframes rgbShiftImg {
    0% { transform: translate(0); filter: none; }
    25% { transform: translate(-3px, 0); filter: drop-shadow(3px 0 #ff0000) drop-shadow(-3px 0 #00ffff); }
    50% { transform: translate(3px, 0); filter: drop-shadow(-3px 0 #ff0000) drop-shadow(3px 0 #00ffff); }
    75% { transform: translate(-1px, 0); filter: drop-shadow(1px 0 #ff0000) drop-shadow(-1px 0 #00ffff); }
    100% { transform: translate(0); filter: none; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .vhs-glitch {
    animation: vhsShake 0.3s ease-in-out;
  }
  .random-glitch {
    animation: randomGlitch 0.2s ease-in-out;
  }
  .rgb-shift img {
    animation: rgbShiftImg 0.3s ease-in-out;
  }
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  .seek-wrapper.seeking .vhs-tracking-bar::before {
    animation-duration: 0.5s;
    opacity: 1;
    background: linear-gradient(90deg, transparent, #ff00ff, transparent);
  }
  .playlist-item:not(.active):hover::after {
    content: '▶';
    position: absolute;
    right: 1rem;
    color: #ff9de0;
    font-size: 1rem;
    text-shadow: 0 0 5px #ff9de0;
  }
`;
document.head.appendChild(style);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function togglePlay() {
  initAudioContext();
  playPauseBtn.classList.add('pulse');
  setTimeout(() => playPauseBtn.classList.remove('pulse'), 200);
  if (audio.paused) {
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    marbleBust.querySelector('.bust-svg').style.animationDuration = '10s';
    if (!visualizerRunning) startVisualizer();
  } else {
    audio.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    marbleBust.querySelector('.bust-svg').style.animationDuration = '20s';
  }
}

function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackAlbum.textContent = track.album;
  albumArt.src = track.art;
  durationEl.textContent = track.duration;
  playlistItems.forEach(item => item.classList.remove('active'));
  playlistItems[index].classList.add('active');
  triggerGlitch();
}

function triggerGlitch() {
  const targets = ['.glitch-title', '.album-art-frame', '.track-info-dialog'];
  const target = document.querySelector(targets[Math.floor(Math.random() * targets.length)]);
  target.classList.add('random-glitch');
  setTimeout(() => target.classList.remove('random-glitch'), 200);
}

function triggerVHSGlitch() {
  const player = document.querySelector('.player-container');
  const albumFrame = document.querySelector('.album-art-frame');
  player.classList.add('vhs-glitch');
  albumFrame.classList.add('rgb-shift');
  setTimeout(() => {
    player.classList.remove('vhs-glitch');
    albumFrame.classList.remove('rgb-shift');
  }, 300);
}

function startVisualizer() {
  visualizerRunning = true;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  waveformCanvas.width = waveformCanvas.offsetWidth;
  waveformCanvas.height = waveformCanvas.offsetHeight;

  function draw() {
    if (!visualizerRunning || audio.paused) return;
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    const barWidth = (waveformCanvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      const gradient = canvasCtx.createLinearGradient(0, waveformCanvas.height - barHeight, 0, waveformCanvas.height);
      gradient.addColorStop(0, '#ff9de0');
      gradient.addColorStop(0.5, '#9c27b0');
      gradient.addColorStop(1, '#00e5ff');
      canvasCtx.fillStyle = gradient;
      canvasCtx.shadowBlur = 10;
      canvasCtx.shadowColor = '#ff9de0';
      canvasCtx.fillRect(x, waveformCanvas.height - barHeight, barWidth, barHeight);
      canvasCtx.fillRect(x, 0, barWidth, barHeight * 0.3);
      x += barWidth + 1;
    }
  }
  draw();
}

function crtTurnOn() {
  const crtOverlay = document.createElement('div');
  crtOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 10000;
    animation: crtOn 1s ease-out forwards;
    pointer-events: none;
  `;
  document.body.appendChild(crtOverlay);
  setTimeout(() => crtOverlay.remove(), 1000);
}

const errorMessages = [
  '⚠ エラー: 感情が読み込めません (Error: Emotions could not be loaded)',
  '⚠ エラー: 1999年のメモリ不足 (Error: Insufficient memory from 1999)',
  '⚠ エラー: Synthwaveドライバが応答しません (Error: Synthwave driver not responding)',
  '⚠ エラー: ヤシの木が見つかりません (Error: Palm tree not found)',
  '⚠ エラー: ヴァポールウェイブレベルが低すぎます (Error: Vaporwave levels too low)',
  '⚠ エラー: 大理石の胸像が休憩中です (Error: Marble bust is on break)'
];

playPauseBtn.addEventListener('click', togglePlay);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  }
});

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  seekSlider.value = progress;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  loadTrack((currentTrackIndex + 1) % tracks.length);
  togglePlay();
});

seekSlider.addEventListener('input', () => {
  const seekTime = (seekSlider.value / 100) * audio.duration;
  audio.currentTime = seekTime;
  triggerVHSGlitch();
});

seekSlider.addEventListener('mousedown', () => {
  document.querySelector('.seek-wrapper').classList.add('seeking');
});
seekSlider.addEventListener('mouseup', () => {
  document.querySelector('.seek-wrapper').classList.remove('seeking');
});
seekSlider.addEventListener('touchstart', () => {
  document.querySelector('.seek-wrapper').classList.add('seeking');
});
seekSlider.addEventListener('touchend', () => {
  document.querySelector('.seek-wrapper').classList.remove('seeking');
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
});

playlistItems.forEach(item => {
  item.addEventListener('click', () => {
    const trackIndex = parseInt(item.dataset.track);
    if (trackIndex === currentTrackIndex) {
      togglePlay();
    } else {
      loadTrack(trackIndex);
      togglePlay();
    }
  });
});

dialogClose.addEventListener('click', () => {
  const dialog = document.querySelector('.track-info-dialog');
  dialogError.textContent = '⚠ エラー: このダイアログは閉じられません (Error: This dialog cannot be closed)';
  dialogError.style.color = '#ff9de0';
  dialog.classList.add('shake');
  triggerGlitch();
  setTimeout(() => {
    dialogError.textContent = '⚠ エラー: 感情が読み込めません (Error: Emotions could not be loaded)';
    dialogError.style.color = '#ff6666';
    dialog.classList.remove('shake');
  }, 2000);
});

setInterval(() => {
  if (Math.random() > 0.5 && !audio.paused) {
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    dialogError.textContent = randomError;
    dialogError.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
    dialogError.style.textShadow = `${Math.random() * 4 - 2}px 0 #ff00ff, ${Math.random() * 4 - 2}px 0 #00e5ff`;
    setTimeout(() => {
      dialogError.style.transform = 'none';
      dialogError.style.textShadow = 'none';
    }, 100);
  }
}, 10000);

setInterval(triggerGlitch, 4000);

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  palmLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed);
    const xOffset = x * 50 * speed;
    const yOffset = y * 20 * speed;
    layer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  });
  floatingKana.forEach((kana, index) => {
    const speed = (index + 1) * 0.5;
    const xOffset = x * 30 * speed;
    const yOffset = y * 15 * speed;
    kana.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  });
});

window.addEventListener('resize', () => {
  waveformCanvas.width = waveformCanvas.offsetWidth;
  waveformCanvas.height = waveformCanvas.offsetHeight;
});

window.addEventListener('load', () => {
  waveformCanvas.width = waveformCanvas.offsetWidth;
  waveformCanvas.height = waveformCanvas.offsetHeight;
  crtTurnOn();
});