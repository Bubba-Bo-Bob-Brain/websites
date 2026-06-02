const state = {
  playing: false,
  currentTrack: 0,
  currentTime: 0,
  shuffle: false,
  repeat: false,
  volume: 75,
  muted: false,
  prevVolume: 75,
  seeking: false,
  playlist: [
    {
      title: 'リサ・フランク 420',
      artist: 'マックプラス',
      album: 'フローラル・ショップ',
      duration: '4:20',
      durationSecs: 260,
      year: '1 9 9 5'
    },
    {
      title: 'ショップの夢',
      artist: 'マックプラス',
      album: 'フローラル・ショップ',
      duration: '3:47',
      durationSecs: 227,
      year: '1 9 9 5'
    },
    {
      title: 'Eccojams Vol.1 — A1',
      artist: 'チャック・パーソン',
      album: 'Eccojams',
      duration: '6:12',
      durationSecs: 372,
      year: '1 9 9 0'
    },
    {
      title: '図書館 — Library',
      artist: 'ニュージェネ',
      album: '新しい人生',
      duration: '5:33',
      durationSecs: 333,
      year: '1 9 9 2'
    },
    {
      title: '海の夢 — Ocean Dream',
      artist: 'サーバー蕨',
      album: '仮想の波',
      duration: '7:01',
      durationSecs: 421,
      year: '1 9 9 3'
    },
    {
      title: '待合室 — Waiting Room',
      artist: 'バーチャル',
      album: '空港の音楽',
      duration: '4:55',
      durationSecs: 295,
      year: '1 9 9 4'
    },
    {
      title: 'ブロークン・ミラージュ',
      artist: 'サイバー・ガーデン',
      album: '退化',
      duration: '3:22',
      durationSecs: 202,
      year: '1 9 9 6'
    },
    {
      title: '最後の夏 — Last Summer',
      artist: '夕暮れ',
      album: '終わらない午後',
      duration: '5:18',
      durationSecs: 318,
      year: '1 9 9 1'
    }
  ]
};

const dom = {};

function cacheDom() {
  dom.parallaxBg = document.getElementById('parallaxBg');
  dom.starsLayer = document.getElementById('starsLayer');
  dom.palmFar = document.getElementById('palmFar');
  dom.palmMid = document.getElementById('palmMid');
  dom.palmNear = document.getElementById('palmNear');
  dom.vhsNoise = document.getElementById('vhsNoise');
  dom.headerGlitch = document.getElementById('headerGlitch');
  dom.bustContainer = document.getElementById('bustContainer');
  dom.marbleBust = document.getElementById('marbleBust');
  dom.trackDialog = document.getElementById('trackDialog');
  dom.dialogTitle = document.getElementById('dialogTitle');
  dom.dialogArtist = document.getElementById('dialogArtist');
  dom.dialogAlbum = document.getElementById('dialogAlbum');
  dom.dialogYear = document.getElementById('dialogYear');
  dom.win95ProgressFill = document.getElementById('win95ProgressFill');
  dom.waveformCanvas = document.getElementById('waveformCanvas');
  dom.timeCurrent = document.getElementById('timeCurrent');
  dom.timeTotal = document.getElementById('timeTotal');
  dom.vhsSeekBar = document.getElementById('vhsSeekBar');
  dom.vhsTrackingLines = document.getElementById('vhsTrackingLines');
  dom.vhsSeekFill = document.getElementById('vhsSeekFill');
  dom.vhsSeekHead = document.getElementById('vhsSeekHead');
  dom.vhsTrackingNoise = document.getElementById('vhsTrackingNoise');
  dom.vhsTrackingValue = document.getElementById('vhsTrackingValue');
  dom.btnShuffle = document.getElementById('btnShuffle');
  dom.btnPrev = document.getElementById('btnPrev');
  dom.btnPlay = document.getElementById('btnPlay');
  dom.playIcon = document.getElementById('playIcon');
  dom.btnNext = document.getElementById('btnNext');
  dom.btnRepeat = document.getElementById('btnRepeat');
  dom.btnMute = document.getElementById('btnMute');
  dom.volumeIcon = document.getElementById('volumeIcon');
  dom.volumeTrack = document.getElementById('volumeTrack');
  dom.volumeFill = document.getElementById('volumeFill');
  dom.volumeThumb = document.getElementById('volumeThumb');
  dom.volumeValue = document.getElementById('volumeValue');
  dom.playlistTracks = document.getElementById('playlistTracks');
  dom.playlistCount = document.getElementById('playlistCount');
  dom.btnAddTrack = document.getElementById('btnAddTrack');
  dom.btnClearPlaylist = document.getElementById('btnClearPlaylist');
  dom.addTrackDialog = document.getElementById('addTrackDialog');
  dom.btnCloseAddDialog = document.getElementById('btnCloseAddDialog');
  dom.inputTrackTitle = document.getElementById('inputTrackTitle');
  dom.inputTrackArtist = document.getElementById('inputTrackArtist');
  dom.inputTrackAlbum = document.getElementById('inputTrackAlbum');
  dom.inputTrackDuration = document.getElementById('inputTrackDuration');
  dom.inputTrackYear = document.getElementById('inputTrackYear');
  dom.btnSubmitTrack = document.getElementById('btnSubmitTrack');
  dom.statusDot = document.getElementById('statusDot');
  dom.statusText = document.getElementById('statusText');
  dom.glitchOverlay = document.getElementById('glitchOverlay');
}

function generateStars() {
  const container = dom.starsLayer;
  const count = 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 3) + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    if (size > 1.5) {
      star.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(255,255,255,0.3)';
    }
    container.appendChild(star);
  }
}

function generateTrackingLines() {
  const container = dom.vhsTrackingLines;
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'tracking-line';
    line.style.top = (Math.random() * 100) + '%';
    line.style.opacity = (Math.random() * 0.3 + 0.05).toString();
    container.appendChild(line);
  }
}

function setupParallax() {
  document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (dom.palmFar) dom.palmFar.style.transform = 'translateX(' + (x * 5) + 'px)';
    if (dom.palmMid) dom.palmMid.style.transform = 'translateX(' + (x * 12) + 'px)';
    if (dom.palmNear) dom.palmNear.style.transform = 'translateX(' + (x * 20) + 'px)';
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateTrackDisplay() {
  const track = state.playlist[state.currentTrack];
  if (!track) return;
  dom.dialogTitle.textContent = track.title;
  dom.dialogArtist.textContent = track.artist;
  dom.dialogAlbum.textContent = track.album;
  dom.dialogYear.textContent = track.year;
  dom.timeTotal.textContent = track.duration;
  updateTimeDisplay();
  updateSeekBar();
  updatePlaylistHighlight();
}

function updateTimeDisplay() {
  dom.timeCurrent.textContent = formatTime(state.currentTime);
}

function updateSeekBar() {
  const track = state.playlist[state.currentTrack];
  if (!track) return;
  const pct = (state.currentTime / track.durationSecs) * 100;
  dom.vhsSeekFill.style.width = pct + '%';
  dom.vhsSeekHead.style.left = pct + '%';
  dom.win95ProgressFill.style.width = pct + '%';
}

function updatePlaylistHighlight() {
  const tracks = dom.playlistTracks.querySelectorAll('.playlist-track');
  tracks.forEach(function(el, i) {
    el.classList.toggle('active', parseInt(el.dataset.index) === state.currentTrack);
  });
}

function updatePlaylistCount() {
  dom.playlistCount.textContent = state.playlist.length + ' トラック';
}

function togglePlay() {
  state.playing = !state.playing;
  dom.playIcon.textContent = state.playing ? '❚❚' : '▶';
  dom.btnPlay.classList.toggle('playing', state.playing);
  dom.marbleBust.classList.toggle('playing', state.playing);
  dom.statusDot.classList.toggle('playing', state.playing);
  dom.statusText.textContent = state.playing ? '再生中 — 再生中' : '一時停止 — PAUSED';
  if (state.playing) {
    triggerGlitch();
  }
}

function nextTrack() {
  if (state.shuffle) {
    let next;
    do {
      next = Math.floor(Math.random() * state.playlist.length);
    } while (next === state.currentTrack && state.playlist.length > 1);
    state.currentTrack = next;
  } else {
    state.currentTrack = (state.currentTrack + 1) % state.playlist.length;
  }
  state.currentTime = 0;
  updateTrackDisplay();
  triggerGlitch();
}

function prevTrack() {
  if (state.currentTime > 3) {
    state.currentTime = 0;
    updateSeekBar();
    updateTimeDisplay();
    return;
  }
  if (state.shuffle) {
    let prev;
    do {
      prev = Math.floor(Math.random() * state.playlist.length);
    } while (prev === state.currentTrack && state.playlist.length > 1);
    state.currentTrack = prev;
  } else {
    state.currentTrack = (state.currentTrack - 1 + state.playlist.length) % state.playlist.length;
  }
  state.currentTime = 0;
  updateTrackDisplay();
  triggerGlitch();
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  dom.btnShuffle.classList.toggle('active', state.shuffle);
}

function toggleRepeat() {
  state.repeat = !state.repeat;
  dom.btnRepeat.classList.toggle('active', state.repeat);
}

function tickPlayback() {
  if (!state.playing) return;
  const track = state.playlist[state.currentTrack];
  if (!track) return;
  state.currentTime += 0.25;
  if (state.currentTime >= track.durationSecs) {
    if (state.repeat) {
      state.currentTime = 0;
    } else {
      nextTrack();
    }
  }
  updateTimeDisplay();
  updateSeekBar();
}

function triggerGlitch() {
  dom.glitchOverlay.classList.add('active');
  setTimeout(function() {
    dom.glitchOverlay.classList.remove('active');
  }, 200);
}

function scheduleRandomGlitch() {
  const delay = Math.random() * 12000 + 5000;
  setTimeout(function() {
    triggerGlitch();
    scheduleRandomGlitch();
  }, delay);
}

function scheduleVhsNoise() {
  const delay = Math.random() * 8000 + 3000;
  setTimeout(function() {
    dom.vhsNoise.style.opacity = '1';
    dom.vhsNoise.style.transform = 'translateY(' + (Math.random() * 4 - 2) + 'px)';
    setTimeout(function() {
      dom.vhsNoise.style.opacity = '0';
    }, 150);
    scheduleVhsNoise();
  }, delay);
}

function scheduleTrackingWobble() {
  const delay = Math.random() * 6000 + 2000;
  setTimeout(function() {
    const offset = (Math.random() * 1.2 - 0.6).toFixed(1);
    const sign = offset >= 0 ? '+' : '';
    dom.vhsTrackingValue.textContent = sign + offset;
    dom.vhsTrackingLines.style.transform = 'translateY(' + (offset * 2) + 'px)';
    setTimeout(function() {
      dom.vhsTrackingValue.textContent = '+0.3';
      dom.vhsTrackingLines.style.transform = 'translateY(0)';
    }, 800);
    scheduleTrackingWobble();
  }, delay);
}

function setupSeekBar() {
  dom.vhsSeekBar.addEventListener('mousedown', function(e) {
    state.seeking = true;
    dom.vhsSeekBar.classList.add('seeking');
    seekToPosition(e);
  });
  document.addEventListener('mousemove', function(e) {
    if (state.seeking) {
      seekToPosition(e);
    }
  });
  document.addEventListener('mouseup', function() {
    if (state.seeking) {
      state.seeking = false;
      dom.vhsSeekBar.classList.remove('seeking');
    }
  });
  dom.vhsSeekBar.addEventListener('touchstart', function(e) {
    state.seeking = true;
    dom.vhsSeekBar.classList.add('seeking');
    seekToPosition(e.touches[0]);
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (state.seeking && e.touches.length > 0) {
      seekToPosition(e.touches[0]);
    }
  }, { passive: true });
  document.addEventListener('touchend', function() {
    if (state.seeking) {
      state.seeking = false;
      dom.vhsSeekBar.classList.remove('seeking');
    }
  });
}

function seekToPosition(e) {
  const rect = dom.vhsSeekBar.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  const track = state.playlist[state.currentTrack];
  if (track) {
    state.currentTime = pct * track.durationSecs;
    updateTimeDisplay();
    updateSeekBar();
  }
}

function setupVolumeSlider() {
  dom.volumeTrack.addEventListener('mousedown', function(e) {
    setVolumeFromPosition(e);
    const onMove = function(ev) { setVolumeFromPosition(ev); };
    const onUp = function() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  dom.volumeTrack.addEventListener('touchstart', function(e) {
    if (e.touches.length > 0) setVolumeFromPosition(e.touches[0]);
    const onMove = function(ev) {
      if (ev.touches.length > 0) setVolumeFromPosition(ev.touches[0]);
    };
    const onUp = function() {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onUp);
  }, { passive: true });
}

function setVolumeFromPosition(e) {
  const rect = dom.volumeTrack.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  state.volume = Math.round(pct * 100);
  state.muted = false;
  updateVolumeDisplay();
}

function updateVolumeDisplay() {
  const vol = state.muted ? 0 : state.volume;
  dom.volumeFill.style.width = vol + '%';
  dom.volumeThumb.style.left = vol + '%';
  dom.volumeValue.textContent = vol + '%';
  if (vol === 0) {
    dom.volumeIcon.textContent = '✕';
  } else if (vol < 40) {
    dom.volumeIcon.textContent = '♪';
  } else {
    dom.volumeIcon.textContent = '♫';
  }
}

function toggleMute() {
  if (state.muted) {
    state.muted = false;
    state.volume = state.prevVolume || 75;
  } else {
    state.prevVolume = state.volume;
    state.muted = true;
  }
  updateVolumeDisplay();
}

function setupWaveform() {
  const canvas = dom.waveformCanvas;
  const ctx = canvas.getContext('2d');
  let animFrame;
  const barCount = 80;
  const bars = [];
  const targets = [];
  for (let i = 0; i < barCount; i++) {
    bars.push(0.1);
    targets.push(0.1);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 80;
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / barCount;
    const gap = 2;
    const maxH = canvas.height * 0.85;

    for (let i = 0; i < barCount; i++) {
      if (state.playing) {
        const centerWeight = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
        const base = 0.15 + centerWeight * 0.3;
        targets[i] = base + Math.random() * (0.55 + centerWeight * 0.3);
      } else {
        targets[i] = 0.05 + Math.sin(Date.now() * 0.001 + i * 0.3) * 0.03;
      }
      bars[i] += (targets[i] - bars[i]) * 0.12;
      const h = bars[i] * maxH;
      const x = i * barWidth + gap / 2;
      const y = (canvas.height - h) / 2;
      const w = barWidth - gap;

      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, 'rgba(1, 205, 254, 0.9)');
      grad.addColorStop(0.3, 'rgba(185, 103, 255, 0.8)');
      grad.addColorStop(0.6, 'rgba(255, 113, 206, 0.9)');
      grad.addColorStop(1, 'rgba(185, 103, 255, 0.7)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);

      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(255, 113, 206, 0.3)';
      ctx.fillRect(x, y, w, 1);
      ctx.fillRect(x, y + h - 1, w, 1);
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = 'rgba(1, 205, 254, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animFrame = requestAnimationFrame(draw);
  }

  draw();
}

function buildPlaylistDOM() {
  dom.playlistTracks.innerHTML = '';
  state.playlist.forEach(function(track, i) {
    const el = document.createElement('div');
    el.className = 'playlist-track' + (i === state.currentTrack ? ' active' : '');
    el.dataset.index = i;
    el.innerHTML =
      '<div class="track-number"><span class="track-num-text">' +
      (i < 9 ? '0' : '') + (i + 1) + '</span></div>' +
      '<div class="track-info">' +
      '<div class="track-name">' + escapeHtml(track.title) + '</div>' +
      '<div class="track-meta">' + escapeHtml(track.artist) + ' — ' + escapeHtml(track.album) + '</div>' +
      '</div>' +
      '<div class="track-duration">' + track.duration + '</div>' +
      '<button class="track-remove" aria-label="Remove track">✕</button>';
    el.addEventListener('click', function(e) {
      if (e.target.closest('.track-remove')) return;
      state.currentTrack = i;
      state.currentTime = 0;
      if (!state.playing) togglePlay();
      updateTrackDisplay();
    });
    el.querySelector('.track-remove').addEventListener('click', function(e) {
      e.stopPropagation();
      removeTrack(i);
    });
    dom.playlistTracks.appendChild(el);
  });
  updatePlaylistCount();
}

function removeTrack(index) {
  if (state.playlist.length <= 1) return;
  const wasActive = index === state.currentTrack;
  state.playlist.splice(index, 1);
  if (wasActive) {
    if (state.currentTrack >= state.playlist.length) {
      state.currentTrack = 0;
    }
    state.currentTime = 0;
    updateTrackDisplay();
  } else if (index < state.currentTrack) {
    state.currentTrack--;
  }
  buildPlaylistDOM();
}

function clearPlaylist() {
  if (state.playlist.length <= 1) return;
  const keepTrack = state.playlist[state.currentTrack];
  state.playlist = [keepTrack];
  state.currentTrack = 0;
  state.currentTime = 0;
  buildPlaylistDOM();
  updateTrackDisplay();
  triggerGlitch();
}

function showAddDialog() {
  dom.addTrackDialog.classList.add('visible');
  dom.inputTrackTitle.focus();
}

function hideAddDialog() {
  dom.addTrackDialog.classList.remove('visible');
  dom.inputTrackTitle.value = '';
  dom.inputTrackArtist.value = '';
  dom.inputTrackAlbum.value = '';
  dom.inputTrackDuration.value = '';
  dom.inputTrackYear.value = '';
}

function parseDuration(str) {
  const parts = str.split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return { formatted: m + ':' + (s < 10 ? '0' : '') + s, secs: m * 60 + s };
  }
  return { formatted: '3:00', secs: 180 };
}

function addTrack() {
  const title = dom.inputTrackTitle.value.trim() || '無題 — Untitled';
  const artist = dom.inputTrackArtist.value.trim() || '未知 — Unknown';
  const album = dom.inputTrackAlbum.value.trim() || '未分類 — Misc';
  const durationStr = dom.inputTrackDuration.value.trim() || '3:00';
  const yearStr = dom.inputTrackYear.value.trim() || '1 9 9 5';
  const dur = parseDuration(durationStr);

  state.playlist.push({
    title: title,
    artist: artist,
    album: album,
    duration: dur.formatted,
    durationSecs: dur.secs,
    year: yearStr.replace(/(\d)/g, '$1 ').trim() || '1 9 9 5'
  });

  buildPlaylistDOM();
  hideAddDialog();
  triggerGlitch();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupWin95Buttons() {
  const closeBtn = dom.trackDialog.querySelector('.win95-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      dom.trackDialog.style.display = dom.trackDialog.style.display === 'none' ? 'flex' : 'none';
      triggerGlitch();
    });
  }
}

function setupKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (e.shiftKey) {
          nextTrack();
        } else {
          state.currentTime = Math.min(state.currentTime + 5, state.playlist[state.currentTrack].durationSecs);
          updateTimeDisplay();
          updateSeekBar();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (e.shiftKey) {
          prevTrack();
        } else {
          state.currentTime = Math.max(state.currentTime - 5, 0);
          updateTimeDisplay();
          updateSeekBar();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        state.volume = Math.min(state.volume + 5, 100);
        state.muted = false;
        updateVolumeDisplay();
        break;
      case 'ArrowDown':
        e.preventDefault();
        state.volume = Math.max(state.volume - 5, 0);
        state.muted = false;
        updateVolumeDisplay();
        break;
      case 'KeyM':
        toggleMute();
        break;
      case 'KeyS':
        toggleShuffle();
        break;
      case 'KeyR':
        toggleRepeat();
        break;
    }
  });
}

function setupHeaderGlitchHover() {
  dom.headerGlitch.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    void this.offsetWidth;
    this.style.animation = 'glitchText 0.3s steps(4) 3';
    const self = this;
    setTimeout(function() {
      self.style.animation = 'glitchText 4s ease-in-out infinite';
    }, 900);
  });
}

function init() {
  cacheDom();
  generateStars();
  generateTrackingLines();
  setupParallax();
  setupSeekBar();
  setupVolumeSlider();
  setupWaveform();
  buildPlaylistDOM();
  updateTrackDisplay();
  updateVolumeDisplay();
  setupWin95Buttons();
  setupKeyboard();
  setupHeaderGlitchHover();

  dom.btnPlay.addEventListener('click', togglePlay);
  dom.btnNext.addEventListener('click', nextTrack);
  dom.btnPrev.addEventListener('click', prevTrack);
  dom.btnShuffle.addEventListener('click', toggleShuffle);
  dom.btnRepeat.addEventListener('click', toggleRepeat);
  dom.btnMute.addEventListener('click', toggleMute);

  dom.btnAddTrack.addEventListener('click', showAddDialog);
  dom.btnCloseAddDialog.addEventListener('click', hideAddDialog);
  dom.btnSubmitTrack.addEventListener('click', addTrack);
  dom.btnClearPlaylist.addEventListener('click', clearPlaylist);

  dom.inputTrackTitle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTrack();
  });

  setInterval(tickPlayback, 250);

  scheduleRandomGlitch();
  scheduleVhsNoise();
  scheduleTrackingWobble();

  dom.statusText.textContent = 'READY — 準備完了';
}

document.addEventListener('DOMContentLoaded', init);