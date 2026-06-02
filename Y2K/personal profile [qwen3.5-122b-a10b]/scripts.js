document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sparkle Cursor Trail Effect ---
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.life = 100;
      this.rotation = Math.random() * 360;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= 2;
      this.rotation += 5;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      // Draw a star shape
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size, Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 2), Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 2));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    handleParticles();
    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', (e) => {
    // Limit particle creation rate for performance
    if (Math.random() < 0.3) return;
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(e.x, e.y));
    }
  });

  animate();

  // --- 2. WinAmp Equalizer Simulation ---
  const bars = document.querySelectorAll('.equalizer .bar');
  bars.forEach(bar => {
    // Randomize animation speed slightly for realism
    bar.style.animationDuration = (0.3 + Math.random() * 0.4) + 's';
  });

  // --- 3. Hit Counter Logic ---
  const counterElement = document.getElementById('counter');
  let count = 1337; // Starting number

  function updateCounter() {
    count += Math.floor(Math.random() * 3); // Add random amount
    counterElement.innerText = count.toString().padStart(6, '0');
    if (count < 1500) {
      requestAnimationFrame(updateCounter);
    }
  }
  updateCounter();

  // --- 4. Interactive Quiz ---
  const quizBtn = document.getElementById('quiz-btn');
  const quizResult = document.getElementById('quiz-result');
  const quizForm = document.getElementById('quiz-form');

  quizBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="quiz"]:checked');
    if (!selected) {
      alert('You must choose an option!');
      return;
    }

    quizResult.classList.remove('hidden');
    quizResult.innerHTML = 'Calculating...';

    // Fake loading delay
    setTimeout(() => {
      const val = selected.value;
      if (val === 'brat') {
        quizResult.innerHTML = `<span style="color: #ccff00; font-weight: bold;">Result: You are a BRAT! ✨</span><br><small>Wear Juicy, drink Sprite, listen to Britney.</small>`;
      } else {
        quizResult.innerHTML = `<span style="color: #ff00ff; font-weight: bold;">Result: You are a GOTH! 🖤</span><br><small>Wear black, listen to Marilyn Manson, cry in the rain.</small>`;
      }
    }, 1000);
  });

  // --- 5. Guestbook "Sign Me" Alert ---
  const signLink = document.querySelector('.sign-link');
  signLink.addEventListener('click', (e) => {
    e.preventDefault();
    const name = prompt("Enter your name for the guestbook:");
    if (name) {
      alert(`Thanks ${name}! Your signature has been digitally etched into the matrix.`);
    }
  });

  // --- 6. Marquee Pause on Hover (Accessibility/UX touch) ---
  const marquee = document.querySelector('marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.stop();
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.start();
    });
  }

  console.log("%c Welcome to my homepage! ", "background: #ff00ff; color: #fff; font-size: 20px; padding: 10px;");
  console.log("Don't forget to sign the guestbook!");
});