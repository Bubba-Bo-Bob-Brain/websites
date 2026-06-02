// ===== CURTAIN REVEAL =====
document.addEventListener('DOMContentLoaded', () => {
  // Animate curtains on load
  gsap.to('.curtain-left', {
    x: '-100%',
    duration: 2,
    ease: 'power4.out'
  });
  gsap.to('.curtain-right', {
    x: '100%',
    duration: 2,
    ease: 'power4.out'
  });

  // Chandelier flicker
  const chandelier = document.querySelector('.chandelier-svg');
  const candles = chandelier.querySelectorAll('circle');
  let flickerInterval;

  function flickerCandles() {
    flickerInterval = setInterval(() => {
      candles.forEach((candle, index) => {
        const randomDelay = Math.random() * 2000;
        setTimeout(() => {
          const flickerIntensity = 0.7 + Math.random() * 0.3;
          candle.style.opacity = flickerIntensity;
        }, randomDelay);
      });
    }, 3000);
  }

  flickerCandles();

  // Spotlight effect
  const portraits = document.querySelectorAll('.event-portrait');
  portraits.forEach(portrait => {
    const spotlight = portrait.querySelector('.spotlight');
    portrait.addEventListener('mouseenter', () => {
      gsap.to(spotlight, {
        opacity: 1,
        scale: 1.2,
        duration: 0.5
      });
    });
    portrait.addEventListener('mouseleave', () => {
      gsap.to(spotlight, {
        opacity: 0,
        scale: 1,
        duration: 0.5
      });
    });
  });

  // Wax-seal animation
  const tickets = document.querySelectorAll('.event-ticket');
  tickets.forEach(ticket => {
    const waxSeal = ticket.nextElementSibling;
    ticket.addEventListener('click', () => {
      gsap.fromTo(waxSeal, {
        scale: 1,
        opacity: 1
      }, {
        scale: 1.5,
        opacity: 0.7,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    });
  });

  // Seating chart tooltips
  const seatingSections = document.querySelectorAll('.seating-section');
  const tooltip = document.createElement('div');
  tooltip.className = 'seating-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'rgba(26, 18, 11, 0.9)';
  tooltip.style.border = '1px solid var(--gold-dark)';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.color = 'var(--parchment)';
  tooltip.style.fontFamily = 'var(--font-body)';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.zIndex = '100';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(tooltip);

  const sectionDetails = {
    'Orchestra': { price: '60 Livres', capacity: '200 seats' },
    'Royal Box': { price: '120 Livres', capacity: 'Exclusive' },
    'Noble Boxes': { price: '90 Livres', capacity: '4 per box' },
    'Gentlemen\'s Boxes': { price: '70 Livres', capacity: '6 per box' },
    'Upper Gallery': { price: '30 Livres', capacity: '150 seats' },
    'Peasant\'s Stand': { price: '10 Livres', capacity: 'Standing room' }
  };

  seatingSections.forEach(section => {
    const sectionName = section.getAttribute('data-section');
    section.addEventListener('mouseenter', (e) => {
      const rect = section.getBoundingClientRect();
      const details = sectionDetails[sectionName];
      tooltip.innerHTML = `
        <strong>${sectionName}</strong><br>
        Price: ${details.price}<br>
        Capacity: ${details.capacity}
      `;
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.top + window.scrollY - 60}px`;
      tooltip.style.opacity = '1';
    });
    section.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    section.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.pageX - 100}px`;
      tooltip.style.top = `${e.pageY - 70}px`;
    });
  });

  // Parallax scrolling
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    const chandelier = document.querySelector('.chandelier');
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    chandelier.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
  });
});

// Load GSAP for animations
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
script.onload = () => {
  console.log('GSAP loaded');
};
document.head.appendChild(script);