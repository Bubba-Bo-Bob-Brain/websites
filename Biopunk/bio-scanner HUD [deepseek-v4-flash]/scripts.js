document.addEventListener('DOMContentLoaded', () => {
  // Heart rate baseline that drives layout rhythm
  let bpm = 88;
  let beatInterval = 60000 / bpm;
  let lastBeat = 0;
  let phase = 0;

  // Utility function for canvas setup
  function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    return { ctx, width: rect.width, height: rect.height };
  }

  // EKG / Heartbeat visualization
  const ekgCanvas = document.getElementById('ekgCanvas');
  let ekgCtx, ekgW, ekgH;
  const ekgData = [];
  const ekgLength = 200;
  for (let i = 0; i < ekgLength; i++) ekgData.push(0);

  function initEKG() {
    const setup = setupCanvas(ekgCanvas);
    ekgCtx = setup.ctx;
    ekgW = setup.width;
    ekgH = setup.height;
  }

  function drawEKG(time) {
    if (!ekgCtx) return;
    ekgCtx.clearRect(0, 0, ekgW, ekgH);

    // Generate heartbeat waveform
    const heartbeatPhase = (time % beatInterval) / beatInterval;
    let sample = 0;
    
    // P-wave (atrial contraction)
    if (heartbeatPhase > 0.05 && heartbeatPhase < 0.15) {
      sample = Math.sin((heartbeatPhase - 0.05) / 0.1 * Math.PI) * 0.3;
    }
    // QRS complex (ventricular contraction)
    if (heartbeatPhase > 0.2 && heartbeatPhase < 0.35) {
      const qrsPhase = (heartbeatPhase - 0.2) / 0.15;
      sample = -0.5 + Math.sin(qrsPhase * Math.PI * 2) * 1.5;
      if (qrsPhase < 0.1) sample = -0.5 + qrsPhase * 15;
      else if (qrsPhase > 0.9) sample = -0.5 + (1 - qrsPhase) * 15;
    }
    // T-wave (ventricular repolarization)
    if (heartbeatPhase > 0.4 && heartbeatPhase < 0.6) {
      sample = Math.sin((heartbeatPhase - 0.4) / 0.2 * Math.PI) * 0.4;
    }
    // U-wave (rare, subtle)
    if (heartbeatPhase > 0.65 && heartbeatPhase < 0.75) {
      sample = Math.sin((heartbeatPhase - 0.65) / 0.1 * Math.PI) * 0.1;
    }

    // Add noise and baseline wander
    sample += (Math.random() - 0.5) * 0.05;
    sample += Math.sin(time * 0.0003) * 0.1;

    ekgData.push(sample);
    ekgData.shift();

    // Draw the EKG
    ekgCtx.strokeStyle = '#00ff8c';
    ekgCtx.lineWidth = 1.5;
    ekgCtx.shadowColor = '#00ff8c';
    ekgCtx.shadowBlur = 8;
    ekgCtx.beginPath();

    const stepX = ekgW / ekgLength;
    for (let i = 0; i < ekgData.length; i++) {
      const x = i * stepX;
      const y = ekgH / 2 - (ekgData[i] * (ekgH / 3));
      if (i === 0) ekgCtx.moveTo(x, y);
      else ekgCtx.lineTo(x, y);
    }
    ekgCtx.stroke();

    // Grid lines
    ekgCtx.shadowBlur = 0;
    ekgCtx.strokeStyle = 'rgba(0, 255, 140, 0.05)';
    ekgCtx.lineWidth = 0.5;
    for (let i = 0; i < ekgW; i += 20) {
      ekgCtx.beginPath();
      ekgCtx.moveTo(i, 0);
      ekgCtx.lineTo(i, ekgH);
      ekgCtx.stroke();
    }
    for (let i = 0; i < ekgH; i += 10) {
      ekgCtx.beginPath();
      ekgCtx.moveTo(0, i);
      ekgCtx.lineTo(ekgW, i);
      ekgCtx.stroke();
    }
  }

  // Anatomical wireframe
  const anatCanvas = document.getElementById('anatomicalCanvas');
  let anatCtx, anatW, anatH;

  function initAnatomical() {
    const setup = setupCanvas(anatCanvas);
    anatCtx = setup.ctx;
    anatW = setup.width;
    anatH = setup.height;
  }

  function drawAnatomical(time) {
    if (!anatCtx) return;
    anatCtx.clearRect(0, 0, anatW, anatH);

    const cx = anatW / 2;
    const cy = anatH / 2;
    const scale = Math.min(anatW, anatH) / 500;
    const breathPhase = Math.sin(time * 0.002) * 5 * scale;
    const heartPhase = Math.sin(time * 0.008) * 3 * scale;

    // Body outline
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.3)';
    anatCtx.lineWidth = 1;
    anatCtx.shadowColor = 'rgba(0, 255, 140, 0.2)';
    anatCtx.shadowBlur = 5;

    // Head
    anatCtx.beginPath();
    anatCtx.ellipse(cx, cy - 180 * scale, 40 * scale, 50 * scale, 0, 0, Math.PI * 2);
    anatCtx.stroke();

    // Neck
    anatCtx.beginPath();
    anatCtx.moveTo(cx - 15 * scale, cy - 130 * scale);
    anatCtx.lineTo(cx + 15 * scale, cy - 130 * scale);
    anatCtx.lineTo(cx + 20 * scale, cy - 90 * scale);
    anatCtx.lineTo(cx - 20 * scale, cy - 90 * scale);
    anatCtx.closePath();
    anatCtx.stroke();

    // Torso with breathing animation
    const torsoWidth = 80 * scale + breathPhase;
    const torsoHeight = 160 * scale;
    anatCtx.beginPath();
    anatCtx.moveTo(cx - torsoWidth, cy - 80 * scale);
    anatCtx.quadraticCurveTo(cx - torsoWidth - 10 * scale, cy, cx - torsoWidth, cy + 80 * scale);
    anatCtx.lineTo(cx + torsoWidth, cy + 80 * scale);
    anatCtx.quadraticCurveTo(cx + torsoWidth + 10 * scale, cy, cx + torsoWidth, cy - 80 * scale);
    anatCtx.closePath();
    anatCtx.stroke();

    // Heart with beating animation
    const heartX = cx + 15 * scale;
    const heartY = cy - 25 * scale + heartPhase;
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.6)';
    anatCtx.lineWidth = 1.5;
    anatCtx.shadowBlur = 10;
    anatCtx.beginPath();
    anatCtx.moveTo(heartX, heartY + 5 * scale);
    anatCtx.bezierCurveTo(
      heartX - 15 * scale, heartY - 10 * scale,
      heartX - 20 * scale, heartY + 15 * scale,
      heartX, heartY + 20 * scale
    );
    anatCtx.bezierCurveTo(
      heartX + 20 * scale, heartY + 15 * scale,
      heartX + 15 * scale, heartY - 10 * scale,
      heartX, heartY + 5 * scale
    );
    anatCtx.stroke();

    // Lungs
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.25)';
    anatCtx.shadowBlur = 5;
    const lungBreath = breathPhase * 0.5;
    // Left lung
    anatCtx.beginPath();
    anatCtx.ellipse(cx - 30 * scale, cy - 15 * scale, 20 * scale + lungBreath, 35 * scale, -0.2, 0, Math.PI * 2);
    anatCtx.stroke();
    // Right lung
    anatCtx.beginPath();
    anatCtx.ellipse(cx + 30 * scale, cy - 15 * scale, 20 * scale + lungBreath, 35 * scale, 0.2, 0, Math.PI * 2);
    anatCtx.stroke();

    // Liver
    anatCtx.strokeStyle = 'rgba(255, 179, 0, 0.3)';
    anatCtx.shadowColor = 'rgba(255, 179, 0, 0.2)';
    anatCtx.beginPath();
    anatCtx.ellipse(cx + 20 * scale, cy + 30 * scale, 25 * scale, 15 * scale, 0.3, 0, Math.PI * 2);
    anatCtx.stroke();

    // Kidneys
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.2)';
    anatCtx.shadowColor = 'rgba(0, 255, 140, 0.1)';
    // Left kidney
    anatCtx.beginPath();
    anatCtx.ellipse(cx - 40 * scale, cy + 30 * scale, 12 * scale, 18 * scale, 0.5, 0, Math.PI * 2);
    anatCtx.stroke();
    // Right kidney
    anatCtx.beginPath();
    anatCtx.ellipse(cx + 40 * scale, cy + 30 * scale, 12 * scale, 18 * scale, -0.5, 0, Math.PI * 2);
    anatCtx.stroke();

    // Spine
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.2)';
    anatCtx.shadowBlur = 3;
    for (let i = 0; i < 12; i++) {
      const y = cy - 70 * scale + i * 15 * scale;
      anatCtx.beginPath();
      anatCtx.ellipse(cx, y, 8 * scale, 5 * scale, 0, 0, Math.PI * 2);
      anatCtx.stroke();
    }

    // Arms
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.15)';
    anatCtx.shadowBlur = 2;
    // Left arm
    anatCtx.beginPath();
    anatCtx.moveTo(cx - torsoWidth, cy - 60 * scale);
    anatCtx.lineTo(cx - torsoWidth - 60 * scale, cy + 20 * scale);
    anatCtx.lineTo(cx - torsoWidth - 55 * scale, cy + 100 * scale);
    anatCtx.stroke();
    // Right arm
    anatCtx.beginPath();
    anatCtx.moveTo(cx + torsoWidth, cy - 60 * scale);
    anatCtx.lineTo(cx + torsoWidth + 60 * scale, cy + 20 * scale);
    anatCtx.lineTo(cx + torsoWidth + 55 * scale, cy + 100 * scale);
    anatCtx.stroke();

    // Legs
    anatCtx.beginPath();
    anatCtx.moveTo(cx - 25 * scale, cy + 80 * scale);
    anatCtx.lineTo(cx - 30 * scale, cy + 180 * scale);
    anatCtx.lineTo(cx - 25 * scale, cy + 240 * scale);
    anatCtx.stroke();
    anatCtx.beginPath();
    anatCtx.moveTo(cx + 25 * scale, cy + 80 * scale);
    anatCtx.lineTo(cx + 30 * scale, cy + 180 * scale);
    anatCtx.lineTo(cx + 25 * scale, cy + 240 * scale);
    anatCtx.stroke();

    // Neural nodes along spine
    anatCtx.fillStyle = 'rgba(0, 255, 140, 0.4)';
    anatCtx.shadowBlur = 8;
    for (let i = 0; i < 8; i++) {
      const angle = time * 0.001 + i * 0.8;
      const nodeY = cy - 60 * scale + i * 20 * scale;
      const nodeX = cx + Math.sin(angle) * 15 * scale;
      anatCtx.beginPath();
      anatCtx.arc(nodeX, nodeY, 2 * scale, 0, Math.PI * 2);
      anatCtx.fill();
    }

    // Scan lines overlay
    anatCtx.shadowBlur = 0;
    const scanY = (time * 0.05) % anatH;
    anatCtx.strokeStyle = 'rgba(0, 255, 140, 0.1)';
    anatCtx.lineWidth = 1;
    anatCtx.beginPath();
    anatCtx.moveTo(0, scanY);
    anatCtx.lineTo(anatW, scanY);
    anatCtx.stroke();
  }

  // Neural link visualization
  const neuralCanvas = document.getElementById('neuralCanvas');
  let neuralCtx, neuralW, neuralH;
  const neurons = [];
  const numNeurons = 30;

  function initNeural() {
    const setup = setupCanvas(neuralCanvas);
    neuralCtx = setup.ctx;
    neuralW = setup.width;
    neuralH = setup.height;

    for (let i = 0; i < numNeurons; i++) {
      neurons.push({
        x: Math.random() * neuralW,
        y: Math.random() * neuralH,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawNeural(time) {
    if (!neuralCtx) return;
    neuralCtx.clearRect(0, 0, neuralW, neuralH);

    // Update neuron positions
    neurons.forEach(n => {
      n.x += n.vx + Math.sin(time * 0.001 + n.phase) * 0.3;
      n.y += n.vy + Math.cos(time * 0.001 + n.phase) * 0.3;
      if (n.x < 0) n.x = neuralW;
      if (n.x > neuralW) n.x = 0;
      if (n.y < 0) n.y = neuralH;
      if (n.y > neuralH) n.y = 0;
    });

    // Draw connections
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const dx = neurons[i].x - neurons[j].x;
        const dy = neurons[i].y - neurons[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          const alpha = (1 - dist / 60) * 0.3;
          const signalPhase = Math.sin(time * 0.003 + i + j) > 0.5 ? 1 : 0.3;
          neuralCtx.strokeStyle = `rgba(0, 255, 140, ${alpha * signalPhase})`;
          neuralCtx.lineWidth = 0.5;
          neuralCtx.shadowColor = 'rgba(0, 255, 140, 0.1)';
          neuralCtx.shadowBlur = 3;
          neuralCtx.beginPath();
          neuralCtx.moveTo(neurons[i].x, neurons[i].y);
          neuralCtx.lineTo(neurons[j].x, neurons[j].y);
          neuralCtx.stroke();
        }
      }
    }

    // Draw neurons
    neurons.forEach(n => {
      const pulse = Math.sin(time * 0.005 + n.phase) * 0.3 + 0.7;
      neuralCtx.fillStyle = `rgba(0, 255, 140, ${pulse * 0.8})`;
      neuralCtx.shadowColor = 'rgba(0, 255, 140, 0.4)';
      neuralCtx.shadowBlur = 10;
      neuralCtx.beginPath();
      neuralCtx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
      neuralCtx.fill();
    });

    // Signal bursts
    if (Math.random() < 0.05) {
      const source = neurons[Math.floor(Math.random() * neurons.length)];
      neuralCtx.fillStyle = 'rgba(0, 255, 140, 0.8)';
      neuralCtx.shadowBlur = 20;
      neuralCtx.beginPath();
      neuralCtx.arc(source.x, source.y, 4, 0, Math.PI * 2);
      neuralCtx.fill();
    }
  }

  // Mutation progression visualization
  const mutationCanvas = document.getElementById('mutationCanvas');
  let mutationCtx, mutationW, mutationH;
  const mutationCells = [];

  function initMutation() {
    const setup = setupCanvas(mutationCanvas);
    mutationCtx = setup.ctx;
    mutationW = setup.width;
    mutationH = setup.height;

    for (let i = 0; i < 50; i++) {
      mutationCells.push({
        x: Math.random() * mutationW,
        y: Math.random() * mutationH,
        size: Math.random() * 8 + 3,
        phase: Math.random() * Math.PI * 2,
        mutationLevel: Math.random(),
        type: Math.random() > 0.7 ? 'mutated' : 'normal'
      });
    }
  }

  function drawMutation(time) {
    if (!mutationCtx) return;
    mutationCtx.clearRect(0, 0, mutationW, mutationH);

    // Background cellular grid
    mutationCtx.strokeStyle = 'rgba(255, 23, 68, 0.05)';
    mutationCtx.lineWidth = 0.5;
    for (let i = 0; i < mutationW; i += 20) {
      mutationCtx.beginPath();
      mutationCtx.moveTo(i, 0);
      mutationCtx.lineTo(i, mutationH);
      mutationCtx.stroke();
    }
    for (let i = 0; i < mutationH; i += 20) {
      mutationCtx.beginPath();
      mutationCtx.moveTo(0, i);
      mutationCtx.lineTo(mutationW, i);
      mutationCtx.stroke();
    }

    // Draw cells
    mutationCells.forEach(cell => {
      const growth = Math.sin(time * 0.002 + cell.phase) * 0.2 + 1;
      const x = cell.x + Math.sin(time * 0.001 + cell.phase) * 5;
      const y = cell.y + Math.cos(time * 0.001 + cell.phase) * 5;

      if (cell.type === 'mutated') {
        // Mutated cells - irregular, angry
        const points = 8;
        mutationCtx.fillStyle = `rgba(255, 23, 68, ${0.3 + cell.mutationLevel * 0.5})`;
        mutationCtx.strokeStyle = `rgba(255, 23, 68, ${0.5 + cell.mutationLevel * 0.3})`;
        mutationCtx.lineWidth = 1;
        mutationCtx.shadowColor = 'rgba(255, 23, 68, 0.3)';
        mutationCtx.shadowBlur = 5;
        mutationCtx.beginPath();
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radius = cell.size * growth * (0.8 + Math.sin(angle * 3 + time * 0.003 + cell.phase) * 0.3);
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          if (i === 0) mutationCtx.moveTo(px, py);
          else mutationCtx.lineTo(px, py);
        }
        mutationCtx.closePath();
        mutationCtx.fill();
        mutationCtx.stroke();

        // Inner nucleus
        mutationCtx.fillStyle = `rgba(255, 23, 68, 0.6)`;
        mutationCtx.shadowBlur = 8;
        mutationCtx.beginPath();
        mutationCtx.arc(x, y, cell.size * 0.3 * growth, 0, Math.PI * 2);
        mutationCtx.fill();
      } else {
        // Normal cells - round, green
        mutationCtx.fillStyle = 'rgba(0, 255, 140, 0.15)';
        mutationCtx.strokeStyle = 'rgba(0, 255, 140, 0.3)';
        mutationCtx.lineWidth = 1;
        mutationCtx.shadowColor = 'rgba(0, 255, 140, 0.1)';
        mutationCtx.shadowBlur = 3;
        mutationCtx.beginPath();
        mutationCtx.arc(x, y, cell.size * growth, 0, Math.PI * 2);
        mutationCtx.fill();
        mutationCtx.stroke();

        // Inner structure
        mutationCtx.fillStyle = 'rgba(0, 255, 140, 0.2)';
        mutationCtx.beginPath();
        mutationCtx.arc(x, y, cell.size * 0.4 * growth, 0, Math.PI * 2);
        mutationCtx.fill();
      }
    });

    // Mutation spread effect
    const spreadX = mutationW / 2 + Math.sin(time * 0.001) * 30;
    const spreadY = mutationH / 2 + Math.cos(time * 0.0015) * 20;
    mutationCtx.fillStyle = 'rgba(255, 23, 68, 0.03)';
    mutationCtx.shadowBlur = 0;
    mutationCtx.beginPath();
    mutationCtx.arc(spreadX, spreadY, 40 + Math.sin(time * 0.002) * 10, 0, Math.PI * 2);
    mutationCtx.fill();
  }

  // Nanomachine swarm visualization
  const nanoCanvas = document.getElementById('nanoCanvas');
  let nanoCtx, nanoW, nanoH;
  const nanoParticles = [];
  const numNano = 60;

  function initNano() {
    const setup = setupCanvas(nanoCanvas);
    nanoCtx = setup.ctx;
    nanoW = setup.width;
    nanoH = setup.height;

    for (let i = 0; i < numNano; i++) {
      nanoParticles.push({
        x: Math.random() * nanoW,
        y: Math.random() * nanoH,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        targetX: Math.random() * nanoW,
        targetY: Math.random() * nanoH
      });
    }
  }

  function drawNano(time) {
    if (!nanoCtx) return;
    nanoCtx.clearRect(0, 0, nanoW, nanoH);

    // Update and draw nanomachines
    nanoParticles.forEach(nano => {
      // Move toward target
      const dx = nano.targetX - nano.x;
      const dy = nano.targetY - nano.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 5) {
        nano.targetX = Math.random() * nanoW;
        nano.targetY = Math.random() * nanoH;
      }

      const speed = 0.02;
      nano.vx += dx * speed;
      nano.vy += dy * speed;
      nano.vx *= 0.95;
      nano.vy *= 0.95;
      nano.x += nano.vx;
      nano.y += nano.vy;

      // Swarm clustering effect
      const pulse = Math.sin(time * 0.005 + nano.phase) * 0.5 + 0.5;
      const trail = 3;

      // Draw trail
      nanoCtx.strokeStyle = `rgba(0, 255, 140, ${pulse * 0.1})`;
      nanoCtx.lineWidth = 0.5;
      nanoCtx.shadowBlur = 0;
      nanoCtx.beginPath();
      nanoCtx.moveTo(nano.x, nano.y);
      nanoCtx.lineTo(nano.x - nano.vx * trail, nano.y - nano.vy * trail);
      nanoCtx.stroke();

      // Draw particle
      nanoCtx.fillStyle = `rgba(0, 255, 140, ${pulse * 0.8})`;
      nanoCtx.shadowColor = 'rgba(0, 255, 140, 0.5)';
      nanoCtx.shadowBlur = 6;
      nanoCtx.beginPath();
      nanoCtx.arc(nano.x, nano.y, nano.size * (0.5 + pulse * 0.5), 0, Math.PI * 2);
      nanoCtx.fill();

      // Glow core
      nanoCtx.fillStyle = `rgba(0, 255, 140, ${pulse * 0.3})`;
      nanoCtx.shadowBlur = 10;
      nanoCtx.beginPath();
      nanoCtx.arc(nano.x, nano.y, nano.size * 2, 0, Math.PI * 2);
      nanoCtx.fill();
    });

    // Swarm density heatmap
    const densityGradient = nanoCtx.createRadialGradient(
      nanoW / 2, nanoH / 2, 0,
      nanoW / 2, nanoH / 2, nanoW / 2
    );
    densityGradient.addColorStop(0, 'rgba(0, 255, 140, 0.05)');
    densityGradient.addColorStop(1, 'rgba(0, 255, 140, 0)');
    nanoCtx.fillStyle = densityGradient;
    nanoCtx.shadowBlur = 0;
    nanoCtx.fillRect(0, 0, nanoW, nanoH);

    // Update active count display
    const activeCount = Math.floor(12000 + Math.sin(time * 0.001) * 1000);
    document.getElementById('nanoActive').textContent = activeCount.toLocaleString();
  }

  // Gene-splice compatibility matrix
  const geneCanvas = document.getElementById('geneCanvas');
  let geneCtx, geneW, geneH;
  const geneData = [];

  function initGene() {
    const setup = setupCanvas(geneCanvas);
    geneCtx = setup.ctx;
    geneW = setup.width;
    geneH = setup.height;

    for (let i = 0; i < 8; i++) {
      geneData[i] = [];
      for (let j = 0; j < 8; j++) {
        geneData[i][j] = Math.random();
      }
    }
  }

  function drawGene(time) {
    if (!geneCtx) return;
    geneCtx.clearRect(0, 0, geneW, geneH);

    const cellSize = geneW / 8;
    const gap = 2;

    // Slowly mutate gene data
    if (Math.random() < 0.01) {
      const i = Math.floor(Math.random() * 8);
      const j = Math.floor(Math.random() * 8);
      geneData[i][j] += (Math.random() - 0.5) * 0.1;
      geneData[i][j] = Math.max(0, Math.min(1, geneData[i][j]));
    }

    // Draw matrix
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const x = j * cellSize + gap;
        const y = i * cellSize + gap;
        const w = cellSize - gap * 2;
        const h = cellSize - gap * 2;

        const value = geneData[i][j];
        const pulse = Math.sin(time * 0.002 + i + j) * 0.1 + 0.9;

        // Color based on compatibility
        let color;
        if (value > 0.7) {
          color = `rgba(0, 255, 140, ${value * pulse * 0.6})`;
        } else if (value > 0.4) {
          color = `rgba(255, 179, 0, ${value * pulse * 0.6})`;
        } else {
          color = `rgba(255, 23, 68, ${value * pulse * 0.6})`;
        }

        geneCtx.fillStyle = color;
        geneCtx.shadowColor = color;
        geneCtx.shadowBlur = 5;
        geneCtx.fillRect(x, y, w, h);

        // Border
        geneCtx.strokeStyle = `rgba(0, 255, 140, ${0.1 + value * 0.2})`;
        geneCtx.lineWidth = 0.5;
        geneCtx.shadowBlur = 0;
        geneCtx.strokeRect(x, y, w, h);

        // DNA strand overlay for high compatibility
        if (value > 0.8) {
          geneCtx.strokeStyle = 'rgba(0, 255, 140, 0.2)';
          geneCtx.lineWidth = 0.5;
          geneCtx.beginPath();
          for (let k = 0; k < 1; k += 0.1) {
            const sx = x + k * w;
            const sy = y + Math.sin(k * Math.PI * 4 + time * 0.005) * h * 0.3 + h / 2;
            if (k === 0) geneCtx.moveTo(sx, sy);
            else geneCtx.lineTo(sx, sy);
          }
          geneCtx.stroke();
        }
      }
    }

    // Matrix label overlay
    geneCtx.fillStyle = 'rgba(0, 255, 140, 0.3)';
    geneCtx.font = '8px "Share Tech Mono"';
    geneCtx.shadowBlur = 0;
    for (let i = 0; i < 8; i++) {
      geneCtx.fillText(String.fromCharCode(65 + i), i * cellSize + 3, 10);
      geneCtx.fillText(i + 1, 3, i * cellSize + 10);
    }
  }

  // Update heart rate display
  function updateHeartRate(time) {
    const hrElement = document.getElementById('heartRate');
    if (hrElement) {
      const variation = Math.sin(time * 0.003) * 3;
      const displayHR = Math.round(bpm + variation);
      hrElement.textContent = displayHR;
    }
    const ekgBpm = document.getElementById('ekgBpm');
    if (ekgBpm) {
      ekgBpm.textContent = `${Math.round(bpm)} BPM`;
    }
  }

  // Scan cycle counter
  let scanCycle = 7;
  function updateScanCycle() {
    scanCycle = (scanCycle % 24) + 1;
    document.getElementById('scanCycle').textContent = String(scanCycle).padStart(2, '0');
  }

  // Main animation loop
  function animate(time) {
    // Update heartbeat timing
    beatInterval = 60000 / bpm;
    bpm = 88 + Math.sin(time * 0.0005) * 5;

    drawEKG(time);
    drawAnatomical(time);
    drawNeural(time);
    drawMutation(time);
    drawNano(time);
    drawGene(time);
    updateHeartRate(time);

    requestAnimationFrame(animate);
  }

  // Initialize everything
  initEKG();
  initAnatomical();
  initNeural();
  initMutation();
  initNano();
  initGene();

  // Start scan cycle updates
  setInterval(updateScanCycle, 3000);

  // Start animation
  requestAnimationFrame(animate);

  // Handle window resize
  window.addEventListener('resize', () => {
    initEKG();
    initAnatomical();
    initNeural();
    initMutation();
    initNano();
    initGene();
  });

  // Mouse interaction - subtle parallax on anatomical
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    const anatContainer = document.querySelector('.anatomical-container canvas');
    if (anatContainer) {
      anatContainer.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
    }
  });

  // Keyboard shortcuts for diagnostic simulation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      // Trigger mutation spike
      mutationCells.forEach(cell => {
        if (Math.random() > 0.5) cell.mutationLevel = Math.min(1, cell.mutationLevel + 0.2);
      });
    }
    if (e.key === 'n' || e.key === 'N') {
      // Deploy nanomachine swarm
      nanoParticles.forEach(nano => {
        nano.targetX = Math.random() * nanoW;
        nano.targetY = Math.random() * nanoH;
        nano.vx *= 3;
        nano.vy *= 3;
      });
    }
    if (e.key === 'h' || e.key === 'H') {
      // Simulate heart rate change
      bpm = 120 + Math.random() * 40;
      setTimeout(() => { bpm = 88; }, 3000);
    }
  });

  console.log('BIOSCAN v2.7 - Cybernetic Patient HUD initialized');
  console.log('Keyboard shortcuts: [M]utation spike, [N]ano deploy, [H]eart rate spike');
});