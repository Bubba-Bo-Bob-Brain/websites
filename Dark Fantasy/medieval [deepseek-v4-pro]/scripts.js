(function() {
  const emberContainer = document.getElementById('emberContainer');
  const prophecyLine = document.getElementById('prophecyLine');
  const waxSeal = document.getElementById('waxSeal');
  const cursorFlame = document.getElementById('cursorFlame');
  const mapLocations = document.querySelectorAll('.map-location');
  const bestiaryCards = document.querySelectorAll('.bestiary-card');

  const prophecies = [
    "\"When the raven swallows the moon, the throne of bones shall crack...\"",
    "\"Beware the laughter of the Shadow King, for his mirth heralds the eclipse of hope.\"",
    "\"The dead shall march from the north, and the dragons of the peak shall stir from their molten slumber.\"",
    "\"Only the forgotten bloodline, marked by the sigil of the withered rose, can shatter the Obsidian Crown.\"",
    "\"In the thirteenth year of the Bleeding Moon, the veil between realms grows thin...\""
  ];

  let prophecyIndex = 0;

  function cycleProphecy() {
    prophecyLine.style.opacity = '0';
    setTimeout(() => {
      prophecyIndex = (prophecyIndex + 1) % prophecies.length;
      prophecyLine.textContent = prophecies[prophecyIndex];
      prophecyLine.style.opacity = '1';
    }, 400);
  }

  setInterval(cycleProphecy, 7500);

  function createEmber() {
    const ember = document.createElement('div');
    ember.classList.add('ember-particle');
    const size = Math.random() * 6 + 3;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.bottom = '-10px';
    const duration = Math.random() * 7 + 6;
    ember.style.animationDuration = `${duration}s`;
    const delay = Math.random() * 5;
    ember.style.animationDelay = `${delay}s`;
    emberContainer.appendChild(ember);

    setTimeout(() => {
      if (ember && ember.parentNode) {
        ember.remove();
      }
    }, (duration + delay) * 1000 + 500);
  }

  function spawnEmbers(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createEmber();
      }, i * 80);
    }
  }

  spawnEmbers(12);
  setInterval(() => {
    spawnEmbers(4);
  }, 2500);

  document.addEventListener('mousemove', (e) => {
    if (cursorFlame) {
      cursorFlame.style.left = e.clientX + 'px';
      cursorFlame.style.top = e.clientY + 'px';
      cursorFlame.style.opacity = '1';
    }
  });

  document.addEventListener('mouseleave', () => {
    if (cursorFlame) {
      cursorFlame.style.opacity = '0';
    }
  });

  document.addEventListener('mouseenter', () => {
    if (cursorFlame) {
      cursorFlame.style.opacity = '1';
    }
  });

  if (waxSeal) {
    waxSeal.addEventListener('click', () => {
      waxSeal.style.transform = 'scale(0.9)';
      setTimeout(() => {
        waxSeal.style.transform = '';
      }, 150);
      cycleProphecy();
      spawnEmbers(6);
    });
  }

  mapLocations.forEach(location => {
    location.addEventListener('click', () => {
      const name = location.getAttribute('data-name') || 'Unknown';
      const marker = location.querySelector('.location-marker');
      if (marker) {
        marker.style.transform = 'scale(1.8) rotate(-45deg)';
        marker.style.transition = 'transform 0.2s';
        setTimeout(() => {
          marker.style.transform = '';
        }, 300);
      }
      constdiv = document.createElement('div');
      div.textContent = name;
      div.style.position = 'fixed';
      div.style.bottom = '20px';
      div.style.left = '50%';
      div.style.transform = 'translateX(-50%)';
      div.style.background = 'rgba(0,0,0,0.9)';
      div.style.color = '#e6c06b';
      div.style.padding = '8px 24px';
      div.style.border = '1px solid #b22234';
      div.style.zIndex = '200';
      div.style.fontFamily = 'Cinzel, serif';
      div.style.letterSpacing = '2px';
      document.body.appendChild(div);
      setTimeout(() => {
        if (div.parentNode) div.remove();
      }, 2000);
    });
  });

  bestiaryCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  const mapDragon = document.getElementById('mapDragon');
  if (mapDragon) {
    let dragonAngle = 0;
    setInterval(() => {
      dragonAngle += 0.5;
      const offsetX = Math.sin(dragonAngle) * 6;
      const offsetY = Math.cos(dragonAngle * 0.7) * 4;
      mapDragon.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 50);
  }

  const torches = document.querySelectorAll('.torch-flame');
  torches.forEach(flame => {
    const core = flame.querySelector('.flame-core');
    const glow = flame.querySelector('.flame-glow');
    if (core && glow) {
      setInterval(() => {
        const scaleY = 0.8 + Math.random() * 0.4;
        const scaleX = 0.9 + Math.random() * 0.3;
        core.style.transform = `translateX(-50%) scaleY(${scaleY}) scaleX(${scaleX})`;
        glow.style.transform = `translateX(-50%) scale(${0.9 + Math.random() * 0.3})`;
      }, 120);
    }
  });

  const borderCorners = document.querySelectorAll('.border-corner');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    borderCorners.forEach(corner => {
      corner.style.transform = corner.style.transform.replace(/rotate\(.*?\)/, '') + ` rotate(${scrollY * 0.02}deg)`;
    });
  });

})();