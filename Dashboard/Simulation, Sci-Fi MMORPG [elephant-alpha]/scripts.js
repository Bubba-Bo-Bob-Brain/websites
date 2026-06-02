// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // Animate progress bars on load
  const progressBars = document.querySelectorAll('.progress-bar span, .tech-node .progress');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });

  // Sector hover effects
  const sectors = document.querySelectorAll('.sector');
  sectors.forEach(sector => {
    sector.addEventListener('mouseenter', () => {
      sector.style.transform = 'scale(1.1)';
      sector.style.zIndex = '10';
    });
    sector.addEventListener('mouseleave', () => {
      sector.style.transform = 'scale(1)';
      sector.style.zIndex = '1';
    });
  });

  // Simulate real-time updates (every 30 seconds)
  setInterval(() => {
    // Update random resource values
    const resourceValues = document.querySelectorAll('.resource-item .value');
    resourceValues.forEach(value => {
      const current = parseInt(value.textContent.replace(/,/g, ''));
      const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      const newValue = Math.max(0, current + variation);
      value.textContent = newValue.toLocaleString();
    });

    // Update war front progress slightly
    const warSpans = document.querySelectorAll('.war-fronts .progress-bar span');
    warSpans.forEach(span => {
      const currentWidth = parseInt(span.style.width);
      const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
      let newWidth = currentWidth + variation;
      newWidth = Math.max(0, Math.min(100, newWidth));
      span.style.width = newWidth + '%';
    });

    // Update tech progress slightly
    const techSpans = document.querySelectorAll('.tech-node .progress');
    techSpans.forEach(span => {
      const current = parseInt(span.textContent);
      const variation = Math.floor(Math.random() * 4) - 2; // -2 to +2
      let newProgress = current + variation;
      newProgress = Math.max(0, Math.min(100, newProgress));
      span.textContent = newProgress + '%';
    });
  }, 30000); // 30 seconds

  // Log status updates to console (simulated)
  console.log('🚀 Simulation active — Galactic Command Hub online.');
  setInterval(() => {
    const messages = [
      '📡 Long-range sensors active.',
      '⚔️ Engaging in tactical analysis.',
      '📊 Resource flow optimized.',
      '🔄 War front status recalculated.',
      '🧠 Neural network update complete.',
      '🌠 Scanning for anomalies...',
      '💬 Diplomatic channels monitored.',
      '⚙️ Simulation parameters stable.'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    console.log(randomMessage);
  }, 15000); // 15 seconds
});