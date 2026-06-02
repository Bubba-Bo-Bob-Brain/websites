// === FLIP CLOCK ANIMATION ===
document.addEventListener('DOMContentLoaded', () => {
  // Initialize flip clocks with their initial values
  const flipClocks = document.querySelectorAll('.flip-clock');

  flipClocks.forEach(clock => {
    const flipCards = clock.querySelectorAll('.flip-card');
    flipCards.forEach((card, index) => {
      const value = card.dataset.value;
      // Trigger the flip animation on page load for a "starting" effect
      setTimeout(() => {
        card.classList.add('flip');
      }, index * 200); // Staggered delay for each digit
    });
  });

  // For demo purposes: Update flip clocks every minute to simulate a countdown
  // In a real app, this would be tied to actual departure times
  setInterval(() => {
    flipClocks.forEach(clock => {
      const flipCards = clock.querySelectorAll('.flip-card');
      flipCards.forEach(card => {
        const currentValue = parseInt(card.dataset.value);
        const newValue = currentValue > 0 ? currentValue - 1 : 9;
        card.dataset.value = newValue;

        // Trigger the flip animation
        card.classList.remove('flip');
        setTimeout(() => {
          card.querySelector('.flip-card__front').textContent = newValue;
          card.querySelector('.flip-card__back').textContent = newValue;
          card.classList.add('flip');
        }, 50);
      });
    });
  }, 60000); // Update every minute
});

// === PARALLAX SCROLLING ===
window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  const parallaxLayers = document.querySelectorAll('.parallax__layer');

  parallaxLayers.forEach(layer => {
    const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
    const yPos = -(scrollPosition * speed);
    layer.style.transform = `translateZ(${layer.style.transform.match(/translateZ\(([^)]+)\)/)?.[1] || '0'}) translateY(${yPos}px)`;
  });
});

// Assign speeds to parallax layers for the effect
document.querySelector('.parallax__layer--planet-1').setAttribute('data-speed', '0.2');
document.querySelector('.parallax__layer--planet-2').setAttribute('data-speed', '0.4');
document.querySelector('.parallax__layer--planet-3').setAttribute('data-speed', '0.6');

// === DESTINATION CARD INTERACTIVITY ===
const destinationCards = document.querySelectorAll('.destination-card');

destinationCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// === BOOKING FORM VALIDATION ===
const bookingForm = document.querySelector('.booking__form');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const destination = document.getElementById('destination').value;
  const departure = document.getElementById('departure').value;
  const passengers = document.getElementById('passengers').value;
  const terms = document.querySelector('.form-checkbox').checked;

  if (!name || !email || !destination || !departure || !passengers || !terms) {
    alert('⚠️ Please fill in all fields and accept the terms to blast off!');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('⚠️ Please enter a valid email address!');
    return;
  }

  // Playful success message
  alert(`🚀 Blast Off! Your journey to ${destination.toUpperCase()} is confirmed, ${name}!`);
  bookingForm.reset();
});

// === DYNAMIC COPYRIGHT YEAR ===
const currentYear = new Date().getFullYear();
const copyrightText = document.querySelector('.footer__copyright p:first-child');
copyrightText.textContent = `© 1965-${currentYear} Cosmic Getaways Inc. All Rights Reserved.`;

// === ADD GRAIN OVERLAY FOR TEXTURE (OPTIONAL) ===
// Create a grainy overlay for added retro texture
const grainOverlay = document.createElement('div');
grainOverlay.style.position = 'fixed';
grainOverlay.style.top = '0';
grainOverlay.style.left = '0';
grainOverlay.style.width = '100%';
grainOverlay.style.height = '100%';
grainOverlay.style.pointerEvents = 'none';
grainOverlay.style.zIndex = '100';
grainOverlay.style.opacity = '0.05';
grainOverlay.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';
document.body.appendChild(grainOverlay);