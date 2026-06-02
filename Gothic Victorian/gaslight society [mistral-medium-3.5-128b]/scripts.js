// ===== DOM Elements =====
const envelope = document.getElementById('envelope');
const rankFilter = document.getElementById('rank-filter');
const specializationFilter = document.getElementById('specialization-filter');
const searchInput = document.getElementById('search-member');
const memberCards = document.querySelectorAll('.member-card');
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.directory-section');
const clockHands = document.querySelectorAll('.clock-hands > div');
const flickerOverlay = document.querySelector('.flicker-overlay');

// ===== Sealed Envelope =====
envelope.addEventListener('click', () => {
  envelope.classList.toggle('open');
});

// ===== Member Filtering =====
function filterMembers() {
  const rankValue = rankFilter.value;
  const specializationValue = specializationFilter.value;
  const searchValue = searchInput.value.toLowerCase();

  memberCards.forEach(card => {
    const rankMatch = rankValue === 'all' || card.dataset.rank === rankValue;
    const specializationMatch = specializationValue === 'all' || card.dataset.specialization === specializationValue;
    const name = card.querySelector('.member-name').textContent.toLowerCase();
    const searchMatch = name.includes(searchValue);

    if (rankMatch && specializationMatch && searchMatch) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.5s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

rankFilter.addEventListener('change', filterMembers);
specializationFilter.addEventListener('change', filterMembers);
searchInput.addEventListener('input', filterMembers);

// ===== Navigation =====
navTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all tabs
    navTabs.forEach(t => t.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');

    // Scroll to section
    const targetId = tab.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Grandfather Clock =====
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate degrees for each hand
  const hourDegrees = (hours * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  // Apply rotation
  clockHands[0].style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
  clockHands[1].style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
  clockHands[2].style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initialize immediately

// ===== Gaslight Flicker Randomization =====
function randomizeFlicker() {
  const flickerIntensity = Math.random() * 0.2 + 0.1;
  flickerOverlay.style.opacity = flickerIntensity;
}

// Randomize flicker every 100-300ms
setInterval(() => {
  randomizeFlicker();
  const nextFlicker = Math.random() * 200 + 100;
  setTimeout(randomizeFlicker, nextFlicker);
}, 100);

// ===== Member Card Hover Effects =====
memberCards.forEach(card => {
  const portrait = card.querySelector('.daguerreotype');
  const bio = card.querySelector('.member-bio');

  card.addEventListener('mouseenter', () => {
    portrait.style.filter = 'sepia(100%) brightness(1.1) contrast(1.5) grain(0.3px)';
    bio.style.maxHeight = bio.scrollHeight + 'px';
    bio.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    portrait.style.filter = 'sepia(100%) brightness(0.8) contrast(1.2) grain(0.5px)';
    bio.style.maxHeight = '0';
    bio.style.opacity = '0';
  });
});

// ===== Parallax Effect for Background =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.parchment-overlay');
  const speed = scrolled * 0.5;
  parallax.style.transform = `translateY(${speed}px)`;
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 1s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections and member cards
sections.forEach(section => observer.observe(section));
memberCards.forEach(card => observer.observe(card));

// ===== Add CSS Animations Dynamically =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ===== Initialize =====
filterMembers(); // Apply initial filters
updateClock(); // Set initial clock time
randomizeFlicker(); // Start flicker effect