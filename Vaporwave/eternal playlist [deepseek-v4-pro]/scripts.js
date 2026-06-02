const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let gainNode = null;
let analyser = null;
let isPlaying = false;
let currentTrackIndex = 0;
let animationFrameId = null;
let startTime = 0;
let pausedAt = 0;

const playlist = [
  { title: "Moonlight", artist: "S U R F I N G", album: "Deep Fantasy (2013)", duration: 272, file: null },
  { title: "リサフランク420 / 現代のコンピュー", artist: "MACINTOSH PLUS", album: "Floral Shoppe (2011)", duration: 440, file: null },
  { title: "Echoes in the Static", artist: "２８１４", album: "Birth of a New Day (2015)", duration: 372, file: null },
  { title: "Chrome Mist", artist: "BLANK BANSHEE", album: "Blank Banshee 0 (2012)", duration: 225, file: null },
  { title: "Sunset Boulevard", artist: "ESPRIT 空想", album: "Virtua.zip (2014)", duration: 308, file: null }
];

const elements = {
  playBtn: document.getElementById('playBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  stopBtn: document.getElementById('stopBtn'),
  seekSlider: document.getElementById('seekSlider'),
  volumeSlider: document.getElementById('volumeSlider'),
  currentTimeDisplay: document.getElementById('currentTime'),
  totalDurationDisplay: document.getElementById('totalDuration'),
  currentTrackDisplay: document.getElementById('currentTrackDisplay'),
  currentAlbumDisplay: document.getElementById('currentAlbumDisplay'),
  labelArtist: document.getElementById('labelArtist'),
  labelTrack: document.getElementById('labelTrack'),
  vinylRecord: document.getElementById('vinylRecord'),
  trackingFill: document.getElementById('trackingFill'),
  vhsHead: document.getElementById('vhsHead'),
  waveformCanvas: document.getElementById('waveformCanvas'),
  playlistContainer: document.getElementById('playlistContainer'),
  marbleBust: document.getElementById('marbleBust')
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  const track = playlist[currentTrackIndex];
  elements.currentTrackDisplay.textContent = `${track.artist} - ${track.title}`;
  elements.currentAlbumDisplay.textContent = track.album;
  elements.labelArtist.textContent = track.artist;
  elements.labelTrack.textContent = track.title;
  elements.totalDurationDisplay.textContent = formatTime(track.duration);
  elements.seekSlider.max = track.duration;
  
  document.querySelectorAll('.playlist-item').forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function generateAudioBuffer(durationSec) {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * durationSec;
  const buffer = audioContext.createBuffer(2, length, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 80 + (channel * 40) + Math.sin(t * 0.5) * 20;
      const envelope = Math.max(0, 1 - (i / length) * 0.3);
      data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.15 + (Math.random() * 0.1 - 0.05)) * envelope;
      
      if (i % (sampleRate / 4) < 100) {
        data[i] += Math.sin(2 * Math.PI * 1200 * t) * 0.05;
      }
    }
  }
  return buffer;
}

function stopPlayback() {
  if (audioSource) {
    try { audioSource.stop(); } catch(e) {}
    audioSource.disconnect();
    audioSource = null;
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isPlaying = false;
  elements.playBtn.textContent = '▶';
  elements.vinylRecord.classList.remove('playing');
}

function startPlayback(offset = 0) {
  stopPlayback();
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const track = playlist[currentTrackIndex];
  const buffer = generateAudioBuffer(track.duration);
  
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = buffer;
  
  if (!gainNode) {
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
  }
  
  if (!analyser) {
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(gainNode);
  }
  
  audioSource.connect(analyser);
  gainNode.gain.value = parseFloat(elements.volumeSlider.value);
  
  startTime = audioContext.currentTime - offset;
  audioSource.start(0, offset);
  isPlaying = true;
  elements.playBtn.textContent = '⏸';
  elements.vinylRecord.classList.add('playing');
  
  audioSource.onended = () => {
    if (isPlaying) {
      handleNext();
    }
  };
  
  drawWaveform();
}

function handlePlayPause() {
  if (isPlaying) {
    pausedAt = audioContext.currentTime - startTime;
    stopPlayback();
    isPlaying = false;
  } else {
    startPlayback(pausedAt % playlist[currentTrackIndex].duration);
  }
}

function handleStop() {
  stopPlayback();
  pausedAt = 0;
  elements.seekSlider.value = 0;
  elements.currentTimeDisplay.textContent = '00:00';
  elements.trackingFill.style.width = '0%';
  elements.vhsHead.style.left = '0%';
}

function handleNext() {
  stopPlayback();
  pausedAt = 0;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  updateDisplay();
  startPlayback(0);
}

function handlePrev() {
  stopPlayback();
  pausedAt = 0;
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  updateDisplay();
  startPlayback(0);
}

function drawWaveform() {
  if (!isPlaying || !analyser) return;
  
  const canvas = elements.waveformCanvas;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.clientWidth;
  const height = canvas.height = canvas.clientHeight;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  ctx.clearRect(0, 0, width, height);
  
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#ff6ec7');
  gradient.addColorStop(0.5, '#c77dff');
  gradient.addColorStop(1, '#00f0ff');
  
  ctx.fillStyle = gradient;
  const barWidth = (width / bufferLength) * 2.5;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * height * 0.8;
    const y = height - barHeight;
    ctx.fillRect(x, y, barWidth - 1, barHeight);
    x += barWidth;
  }
  
  const timeDomainData = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(timeDomainData);
  
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#ff6ec7';
  ctx.shadowBlur = 10;
  
  const sliceWidth = width / bufferLength;
  x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    const v = timeDomainData[i] / 128.0;
    const y = v * height / 2;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  animationFrameId = requestAnimationFrame(drawWaveform);
}

function updateSeekUI() {
  if (!isPlaying) return;
  const currentTime = audioContext.currentTime - startTime;
  const duration = playlist[currentTrackIndex].duration;
  const progress = Math.min(currentTime / duration, 1);
  
  elements.seekSlider.value = currentTime;
  elements.currentTimeDisplay.textContent = formatTime(currentTime);
  elements.trackingFill.style.width = `${progress * 100}%`;
  elements.vhsHead.style.left = `${progress * 100}%`;
  
  if (elements.marbleBust) {
    const rotate = Math.sin(currentTime * 2) * 3;
    elements.marbleBust.style.transform = `rotate(${rotate}deg)`;
  }
  
  if (currentTime >= duration) {
    handleNext();
  }
}

setInterval(updateSeekUI, 100);

elements.playBtn.addEventListener('click', handlePlayPause);
elements.stopBtn.addEventListener('click', handleStop);
elements.nextBtn.addEventListener('click', handleNext);
elements.prevBtn.addEventListener('click', handlePrev);

elements.seekSlider.addEventListener('input', (e) => {
  const seekTime = parseFloat(e.target.value);
  elements.currentTimeDisplay.textContent = formatTime(seekTime);
  const progress = seekTime / playlist[currentTrackIndex].duration;
  elements.trackingFill.style.width = `${progress * 100}%`;
  elements.vhsHead.style.left = `${progress * 100}%`;
  
  if (isPlaying) {
    stopPlayback();
    pausedAt = seekTime;
    startPlayback(seekTime);
  } else {
    pausedAt = seekTime;
  }
});

elements.volumeSlider.addEventListener('input', (e) => {
  if (gainNode) {
    gainNode.gain.value = parseFloat(e.target.value);
  }
});

elements.playlistContainer.addEventListener('click', (e) => {
  const item = e.target.closest('.playlist-item');
  if (!item) return;
  const index = parseInt(item.dataset.index);
  if (index === currentTrackIndex && isPlaying) return;
  
  stopPlayback();
  pausedAt = 0;
  currentTrackIndex = index;
  updateDisplay();
  startPlayback(0);
});

window.addEventListener('load', () => {
  updateDisplay();
  elements.volumeSlider.value = 0.7;
  if (gainNode) gainNode.gain.value = 0.7;
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handlePlayPause();
  } else if (e.code === 'ArrowRight') {
    handleNext();
  } else if (e.code === 'ArrowLeft') {
    handlePrev();
  }
});