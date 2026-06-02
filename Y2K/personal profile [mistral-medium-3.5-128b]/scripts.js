// ===== Music Player =====
const musicPlayer = document.getElementById('musicPlayer');
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const stopBtn = document.querySelector('.stop-btn');

// Play music on page load (Y2K style: auto-play!)
window.addEventListener('load', () => {
    musicPlayer.volume = 0.5;
    musicPlayer.play().catch(e => console.log("Audio play failed:", e));
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
});

// Play button
playBtn.addEventListener('click', () => {
    musicPlayer.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
});

// Pause button
pauseBtn.addEventListener('click', () => {
    musicPlayer.pause();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline-block';
});

// Stop button
stopBtn.addEventListener('click', () => {
    musicPlayer.pause();
    musicPlayer.currentTime = 0;
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline-block';
});

// ===== Sparkly Trailing Cursor =====
const sparkleTrail = document.querySelector('.sparkle-trail');
const colors = ['#ff69b4', '#00ffff', '#7cfc00', '#8a2be2', '#ffd700'];

document.addEventListener('mousemove', (e) => {
    // Create a new sparkle
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.position = 'absolute';
    sparkle.style.width = '8px';
    sparkle.style.height = '8px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.boxShadow = '0 0 5px currentColor';
    sparkle.style.animation = 'sparkleFade 1s forwards';

    sparkleTrail.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
});

// Add sparkle animation to stylesheet
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(sparkleStyle);

// ===== Hit Counter =====
const hitCount = document.getElementById('hitCount');
let count = parseInt(hitCount.textContent);

// Increment hit counter on page load
window.addEventListener('load', () => {
    count += 1;
    hitCount.textContent = count;
});

// ===== Quiz Functionality =====
const quizSubmit = document.querySelector('.quiz-submit');
const quizOptions = document.querySelectorAll('.quiz-options input');
const quizWidget = document.querySelector('.quiz-widget');

quizSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let score = 0;

    // Check answers (Y2K logic: pink = Britney, blue = Christina, glitter = Paris)
    quizOptions.forEach(option => {
        if (option.checked) {
            if (option.value === 'pink' || option.value === 'lipgloss') score += 2;
            if (option.value === 'blue' || option.value === 'choker') score += 1;
            if (option.value === 'glitter' || option.value === 'juicy') score += 3;
        }
    });

    // Determine result
    let result;
    if (score >= 4) {
        result = "PARIS HILTON! 💎 You're a total Y2K icon with a love for glitter and luxury!";
    } else if (score >= 2) {
        result = "BRITNEY SPEARS! 🎤 You're the pop princess of the 2000s!";
    } else {
        result = "CHRISTINA AGUILERA! 🎶 You're the edgy, soulful diva!";
    }

    // Display result
    const resultElement = document.createElement('div');
    resultElement.classList.add('quiz-result');
    resultElement.style.marginTop = '15px';
    resultElement.style.padding = '10px';
    resultElement.style.backgroundColor = 'rgba(255, 105, 180, 0.3)';
    resultElement.style.border = '2px solid #ff69b4';
    resultElement.style.color = '#ffffff';
    resultElement.style.fontFamily = "'Comic Sans MS', cursive";
    resultElement.style.textAlign = 'center';
    resultElement.style.fontWeight = 'bold';
    resultElement.textContent = result;

    quizWidget.appendChild(resultElement);
    quizSubmit.style.display = 'none';
});

// ===== Guestbook Form Submission =====
const guestbookForm = document.querySelector('.guestbook-form');
const guestbookComments = document.querySelector('.guestbook-comments');

guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = guestbookForm.querySelector('.form-input');
    const commentInput = guestbookForm.querySelector('.form-textarea');

    if (nameInput.value.trim() === '' || commentInput.value.trim() === '') {
        alert('PLEASE FILL OUT ALL FIELDS!!!');
        return;
    }

    // Create new comment
    const newComment = document.createElement('div');
    newComment.classList.add('comment');

    const nameElement = document.createElement('p');
    nameElement.innerHTML = `<strong>~*~ ${nameInput.value} ~*~</strong> (${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })})`;

    const commentElement = document.createElement('p');
    commentElement.textContent = commentInput.value;

    newComment.appendChild(nameElement);
    newComment.appendChild(commentElement);

    // Insert new comment at the top
    guestbookComments.insertBefore(newComment, guestbookComments.firstChild);

    // Reset form
    nameInput.value = '';
    commentInput.value = '';

    // Y2K effect: blink the new comment
    newComment.style.animation = 'blink 0.5s 3';
});

// Add blink animation to stylesheet
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(blinkStyle);

// ===== Random Blinkie Animation =====
const blinkies = document.querySelectorAll('.blinkie');

setInterval(() => {
    blinkies.forEach(blinkie => {
        if (Math.random() > 0.7) {
            blinkie.style.animation = 'none';
            setTimeout(() => {
                blinkie.style.animation = 'blink 0.5s infinite';
            }, 100);
        }
    });
}, 1000);

// ===== Under Construction GIF Animation =====
const constructionGif = document.querySelector('.construction-gif');
setInterval(() => {
    constructionGif.style.opacity = constructionGif.style.opacity === '0.5' ? '1' : '0.5';
}, 500);