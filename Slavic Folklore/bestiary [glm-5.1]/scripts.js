const enterBtn = document.getElementById('enterBtn');
const coverPage = document.getElementById('coverPage');
const bookContent = document.getElementById('bookContent');
const floatingNav = document.getElementById('floatingNav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const scrollTopBtn = document.getElementById('scrollTop');

const creatureEntries = document.querySelectorAll('.creature-entry');
const navLinks = document.querySelectorAll('.floating-nav-link');
const tocLinks = document.querySelectorAll('.toc-link');

let isBookOpen = false;
let isNavMenuOpen = false;

function openBook() {
  coverPage.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
  coverPage.style.opacity = '0';
  coverPage.style.transform = 'scale(0.96) translateY(-20px)';

  setTimeout(function() {
    coverPage.style.display = 'none';
    bookContent.style.display = 'block';
    bookContent.style.opacity = '0';

    requestAnimationFrame(function() {
      bookContent.style.transition = 'opacity 1.2s ease';
      bookContent.style.opacity = '1';
      isBookOpen = true;
      initScrollObserver();
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, 800);
}

enterBtn.addEventListener('click', openBook);

function initScrollObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  creatureEntries.forEach(function(entry, index) {
    entry.style.transitionDelay = (index % 3) * 0.12 + 's';
    observer.observe(entry);
  });
}

function checkFloatingNavVisibility() {
  if (!isBookOpen) return;
  if (window.scrollY > 400) {
    floatingNav.classList.add('visible');
  } else {
    floatingNav.classList.remove('visible');
    if (isNavMenuOpen) {
      closeNavMenu();
    }
  }
}

function checkScrollTopVisibility() {
  if (window.scrollY > 600) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

function updateActiveNavLink() {
  if (!isBookOpen) return;

  let currentCreatureId = null;
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;

  creatureEntries.forEach(function(entry) {
    const rect = entry.getBoundingClientRect();
    const entryTop = rect.top + window.scrollY;
    const entryBottom = entryTop + rect.height;

    if (scrollPosition >= entryTop && scrollPosition <= entryBottom + 100) {
      currentCreatureId = entry.id;
    }
  });

  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === '#' + currentCreatureId) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
    }
  });
}

function toggleNavMenu() {
  if (isNavMenuOpen) {
    closeNavMenu();
  } else {
    openNavMenu();
  }
}

function openNavMenu() {
  navMenu.classList.add('open');
  isNavMenuOpen = true;
}

function closeNavMenu() {
  navMenu.classList.remove('open');
  isNavMenuOpen = false;
}

navToggle.addEventListener('click', toggleNavMenu);

navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      closeNavMenu();
    }
  });
});

tocLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

scrollTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

let scrollTicking = false;
window.addEventListener('scroll', function() {
  if (!scrollTicking) {
    requestAnimationFrame(function() {
      checkFloatingNavVisibility();
      checkScrollTopVisibility();
      updateActiveNavLink();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

document.addEventListener('click', function(e) {
  if (isNavMenuOpen && !floatingNav.contains(e.target)) {
    closeNavMenu();
  }
});

const woodcutFrames = document.querySelectorAll('.entry-woodcut-frame');
woodcutFrames.forEach(function(frame) {
  frame.addEventListener('mouseenter', function() {
    const glyph = this.querySelector('.woodcut-glyph');
    const icon = this.querySelector('.woodcut-icon');
    if (glyph) {
      glyph.style.transition = 'text-shadow 0.5s ease, transform 0.5s ease';
      glyph.style.textShadow = '0 0 25px rgba(196, 148, 58, 0.6)';
      glyph.style.transform = 'scale(1.08)';
    }
    if (icon) {
      icon.style.transition = 'transform 0.5s ease, filter 0.5s ease';
      icon.style.transform = 'scale(1.05)';
      icon.style.filter = 'grayscale(0.3) contrast(1.3)';
    }
  });

  frame.addEventListener('mouseleave', function() {
    const glyph = this.querySelector('.woodcut-glyph');
    const icon = this.querySelector('.woodcut-icon');
    if (glyph) {
      glyph.style.textShadow = '0 0 15px rgba(196, 148, 58, 0.3)';
      glyph.style.transform = 'scale(1)';
    }
    if (icon) {
      icon.style.transform = 'scale(1)';
      icon.style.filter = 'grayscale(0.6) contrast(1.2)';
    }
  });
});

const dangerRatings = document.querySelectorAll('.danger-rating');
dangerRatings.forEach(function(rating) {
  const activeRunes = rating.querySelectorAll('.danger-rune.active');
  activeRunes.forEach(function(rune, index) {
    rune.style.animationDelay = index * 0.15 + 's';
  });
});

function addDangerPulse() {
  const style = document.createElement('style');
  style.textContent = 
    '@keyframes danger-pulse {' +
    '  0%, 100% { text-shadow: 0 0 6px rgba(139, 45, 45, 0.3); }' +
    '  50% { text-shadow: 0 0 12px rgba(139, 45, 45, 0.6); }' +
    '}' +
    '.creature-entry.revealed .danger-rune.active {' +
    '  animation: danger-pulse 3s ease-in-out infinite;' +
    '}';
  document.head.appendChild(style);
}

addDangerPulse();

function addCreatureEntryHoverEffect() {
  creatureEntries.forEach(function(entry) {
    entry.addEventListener('mouseenter', function() {
      const lore = this.querySelector('.entry-lore');
      if (lore) {
        lore.style.transition = 'border-color 0.4s ease, background 0.4s ease';
        lore.style.borderColor = 'rgba(196, 148, 58, 0.3)';
        lore.style.background = 'rgba(196, 148, 58, 0.05)';
      }
    });

    entry.addEventListener('mouseleave', function() {
      const lore = this.querySelector('.entry-lore');
      if (lore) {
        lore.style.borderColor = 'rgba(106, 90, 68, 0.2)';
        lore.style.background = 'rgba(42, 31, 20, 0.03)';
      }
    });
  });
}

addCreatureEntryHoverEffect();

function enhanceHearthGlow() {
  const hearthGlow = document.querySelector('.hearth-glow');
  if (!hearthGlow) return;

  let time = 0;
  let animating = true;

  function animateGlow() {
    if (!animating) return;

    time += 0.02;
    const flickerIntensity = Math.sin(time * 1.3) * 0.08 +
      Math.sin(time * 2.7) * 0.05 +
      Math.sin(time * 0.7) * 0.06 +
      Math.random() * 0.03;

    const baseOpacity = 0.65;
    const newOpacity = baseOpacity + flickerIntensity;

    hearthGlow.style.opacity = Math.max(0.4, Math.min(1.0, newOpacity));

    const spreadX = 60 + Math.sin(time * 1.8) * 15;
    const spreadY = 70 + Math.sin(time * 2.2) * 20;
    const redIntensity1 = Math.round(166 + Math.sin(time * 1.5) * 20);
    const redIntensity2 = Math.round(196 + Math.sin(time * 2.0) * 15);
    const alpha1 = (0.06 + Math.sin(time * 1.1) * 0.03).toFixed(3);
    const alpha2 = (0.03 + Math.sin(time * 1.6) * 0.02).toFixed(3);

    hearthGlow.style.boxShadow = 
      'inset 0 0 ' + spreadY + 'px rgba(' + redIntensity1 + ', 61, 45, ' + alpha1 + '), ' +
      'inset 0 0 ' + (spreadY + 60) + 'px rgba(' + redIntensity2 + ', 100, 30, ' + alpha2 + '), ' +
      'inset 0 -20px 60px rgba(' + redIntensity1 + ', 61, 45, ' + (parseFloat(alpha1) + 0.01).toFixed(3) + '), ' +
      'inset 40px 0 ' + spreadX + 'px rgba(' + redIntensity2 + ', 100, 30, ' + alpha2 + '), ' +
      'inset -40px 0 ' + spreadX + 'px rgba(' + redIntensity2 + ', 100, 30, ' + alpha2 + ')';

    requestAnimationFrame(animateGlow);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReducedMotion.matches) {
    animateGlow();
  }

  prefersReducedMotion.addEventListener('change', function(e) {
    if (e.matches) {
      animating = false;
      hearthGlow.style.opacity = '0.65';
      hearthGlow.style.boxShadow = '';
    } else {
      animating = true;
      animateGlow();
    }
  });
}

enhanceHearthGlow();

function addCanopyDepth() {
  const canopy = document.querySelector('.canopy-overlay');
  if (!canopy) return;

  let lastScrollY = 0;

  function updateCanopy() {
    const scrollDelta = window.scrollY - lastScrollY;
    const currentTransform = canopy.style.transform || 'translateX(0px)';
    const match = currentTransform.match(/translateX\((-?\d+\.?\d*)px\)/);
    let currentX = match ? parseFloat(match[1]) : 0;

    currentX += scrollDelta * -0.02;
    currentX = Math.max(-8, Math.min(8, currentX));

    canopy.style.transform = 'translateX(' + currentX.toFixed(2) + 'px)';
    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(updateCanopy);
  }, { passive: true });
}

addCanopyDepth();

function addPageCurlEffect() {
  const bookContentEl = document.getElementById('bookContent');

  document.addEventListener('mousemove', function(e) {
    if (!isBookOpen) return;

    const rect = bookContentEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const xRatio = mouseX / width;
    const yRatio = mouseY / height;

    const shadowLeft = Math.max(0, (1 - xRatio) * 8);
    const shadowTop = Math.max(0, (1 - yRatio) * 4);

    bookContentEl.style.boxShadow = 
      (-4 - shadowLeft) + 'px 0 12px rgba(0, 0, 0, 0.3), ' +
      '4px 0 12px rgba(0, 0, 0, 0.1), ' +
      '0 0 40px rgba(0, 0, 0, 0.2), ' +
      'inset ' + (shadowLeft * 3) + 'px 0 ' + (shadowLeft * 8) + 'px rgba(0, 0, 0, 0.04), ' +
      'inset 0 ' + (shadowTop * 2) + 'px ' + (shadowTop * 6) + 'px rgba(0, 0, 0, 0.02)';
  });
}

addPageCurlEffect();

function addLegendRuneHover() {
  const legendRunes = document.querySelectorAll('.legend-rune');
  legendRunes.forEach(function(rune) {
    rune.style.cursor = 'default';
    rune.style.transition = 'text-shadow 0.4s ease, transform 0.4s ease';

    rune.addEventListener('mouseenter', function() {
      this.style.textShadow = '0 0 20px rgba(139, 45, 45, 0.5), 0 0 40px rgba(139, 45, 45, 0.2)';
      this.style.transform = 'scale(1.15)';
    });

    rune.addEventListener('mouseleave', function() {
      this.style.textShadow = '0 0 8px rgba(139, 45, 45, 0.2)';
      this.style.transform = 'scale(1)';
    });
  });
}

addLegendRuneHover();

function addCoverParallax() {
  const coverFrame = document.querySelector('.cover-frame');
  const coverRunes = document.querySelector('.cover-runes');

  document.addEventListener('mousemove', function(e) {
    if (isBookOpen) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    if (coverFrame) {
      coverFrame.style.transform = 
        'perspective(800px) rotateY(' + (deltaX * 2) + 'deg) rotateX(' + (deltaY * -1.5) + 'deg)';
      coverFrame.style.transition = 'transform 0.15s ease-out';
    }

    if (coverRunes) {
      coverRunes.style.transform = 'translateX(' + (deltaX * 5) + 'px) translateY(' + (deltaY * 3) + 'px)';
      coverRunes.style.transition = 'transform 0.15s ease-out';
    }
  });
}

addCoverParallax();

function addKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isNavMenuOpen) {
      closeNavMenu();
      navToggle.focus();
    }

    if (!isBookOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBook();
      }
    }
  });
}

addKeyboardNavigation();

function addTocLinkAnimation() {
  tocLinks.forEach(function(link) {
    link.addEventListener('mouseenter', function() {
      const slavicName = this.closest('.toc-chapter').querySelector('.toc-chapter-numeral');
      if (slavicName) {
        slavicName.style.transition = 'color 0.3s ease';
        slavicName.style.color = 'var(--gold)';
      }
    });

    link.addEventListener('mouseleave', function() {
      const slavicName = this.closest('.toc-chapter').querySelector('.toc-chapter-numeral');
      if (slavicName) {
        slavicName.style.color = 'var(--gold-dim)';
      }
    });
  });
}

addTocLinkAnimation();