document.addEventListener('DOMContentLoaded', function() {

    const cursorTrail = document.getElementById('cursorTrail');
    const sparkles = ['✨', '💖', '⭐', '💫', '🌟', '✧', '♥', '★'];
    const sparkleColors = ['#FF1493', '#00FFFF', '#FFFF00', '#FF69B4', '#00FF00', '#CC00FF'];
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (Math.random() > 0.7) {
            createCursorSparkle(e.clientX, e.clientY);
        }
    });

    function createCursorSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        sparkle.style.textShadow = '0 0 5px ' + sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        cursorTrail.appendChild(sparkle);

        setTimeout(function() {
            sparkle.remove();
        }, 1000);
    }

    const floatingHeartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '♥', '❤️', '💜', '💛', '💚'];

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        floatingHeartsContainer.appendChild(heart);

        setTimeout(function() {
            heart.remove();
        }, 10000);
    }

    setInterval(createFloatingHeart, 800);
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 200);
    }

    const playBtn = document.getElementById('playBtn');
    const equalizer = document.getElementById('equalizer');
    const eqBars = equalizer.querySelectorAll('.eq-bar');
    let isPlaying = true;

    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = '▶';
            eqBars.forEach(function(bar) {
                bar.style.animationPlayState = 'running';
            });
        } else {
            playBtn.textContent = '⏸';
            eqBars.forEach(function(bar) {
                bar.style.animationPlayState = 'paused';
            });
        }
    });

    const quizQuestion = document.getElementById('quizQuestion');
    const quizResult = document.getElementById('quizResult');
    const resultImage = document.getElementById('resultImage');
    const resultText = document.getElementById('resultText');
    const retakeBtn = document.getElementById('retakeQuiz');
    const quizOptions = document.querySelectorAll('.quiz-option');

    const quizResults = {
        avril: {
            icon: '🎸',
            text: 'OMG ur AVRIL LAVIGNE!! Ur totally punk rock and don\'t care what anyone thinks!! Sk8er boi 4eva!! 🤘'
        },
        paris: {
            icon: '👛',
            text: 'UR PARIS HILTON!! That\'s hot!! 💕 Ur a total fashionista and everyone wants 2 be ur BFF!!'
        },
        britney: {
            icon: '🎤',
            text: 'UR BRITNEY SPEARS!! Ur the PRINCESS OF POP!! 💃 Everyone knows ur songs by heart!! Hit me baby one more time!!'
        },
        lindsay: {
            icon: '📱',
            text: 'UR LINDSAY LOHAN!! Mean Girls is literally ur life!! 💋 Ur so fetch and everyone wants 2 sit with u at lunch!!'
        }
    };

    quizOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            const result = this.getAttribute('data-result');
            const data = quizResults[result];

            quizQuestion.classList.add('hidden');
            quizResult.classList.remove('hidden');

            resultImage.textContent = data.icon;
            resultText.textContent = data.text;

            resultImage.style.animation = 'none';
            resultImage.offsetHeight;
            resultImage.style.animation = 'float 1s ease-in-out infinite';

            for (let i = 0; i < 20; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        resultImage.getBoundingClientRect().left + resultImage.offsetWidth / 2 + (Math.random() - 0.5) * 100,
                        resultImage.getBoundingClientRect().top + resultImage.offsetHeight / 2 + (Math.random() - 0.5) * 100
                    );
                }, i * 50);
            }
        });
    });

    retakeBtn.addEventListener('click', function() {
        quizResult.classList.add('hidden');
        quizQuestion.classList.remove('hidden');
    });

    const guestbookEntries = document.getElementById('guestbookEntries');
    const guestNameInput = document.getElementById('guestName');
    const guestMessageInput = document.getElementById('guestMessage');
    const submitGuestbook = document.getElementById('submitGuestbook');

    function getCurrentDate() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const now = new Date();
        return months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    }

    function createGuestbookEntry(name, message) {
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';
        entry.style.animation = 'none';
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(20px)';

        entry.innerHTML = 
            '<div class="entry-header">' +
                '<span class="entry-name">' + escapeHtml(name) + '</span>' +
                '<span class="entry-date">' + getCurrentDate() + '</span>' +
            '</div>' +
            '<p class="entry-message">' + escapeHtml(message) + '</p>' +
            '<div class="entry-signoff">~*~thanx 4 visiting!!~*~</div>';

        guestbookEntries.insertBefore(entry, guestbookEntries.firstChild);

        setTimeout(function() {
            entry.style.transition = 'all 0.5s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateY(0)';
        }, 10);

        for (let i = 0; i < 10; i++) {
            setTimeout(function() {
                createCursorSparkle(
                    entry.getBoundingClientRect().left + Math.random() * entry.offsetWidth,
                    entry.getBoundingClientRect().top + Math.random() * entry.offsetHeight
                );
            }, i * 100);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    submitGuestbook.addEventListener('click', function() {
        const name = guestNameInput.value.trim();
        const message = guestMessageInput.value.trim();

        if (name && message) {
            createGuestbookEntry(name, message);
            guestNameInput.value = '';
            guestMessageInput.value = '';

            alert('thanx 4 signing my guestbook!! <3 <3 <3');
        } else {
            alert('plz fill out both fields!! :P');
        }
    });

    guestMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitGuestbook.click();
        }
    });

    const counterDigits = document.querySelectorAll('.counter-digit');
    let currentCount = [0, 0, 1, 3, 3, 7];

    function updateCounter() {
        currentCount[5]++;
        if (currentCount[5] > 9) {
            currentCount[5] = 0;
            currentCount[4]++;
        }
        if (currentCount[4] > 9) {
            currentCount[4] = 0;
            currentCount[3]++;
        }
        if (currentCount[3] > 9) {
            currentCount[3] = 0;
            currentCount[2]++;
        }
        if (currentCount[2] > 9) {
            currentCount[2] = 0;
            currentCount[1]++;
        }
        if (currentCount[1] > 9) {
            currentCount[1] = 0;
            currentCount[0]++;
        }

        counterDigits.forEach(function(digit, index) {
            digit.textContent = currentCount[index];
            digit.style.color = '#FF0000';
            setTimeout(function() {
                digit.style.color = '#00FF00';
            }, 200);
        });
    }

    if (Math.random() > 0.5) {
        setTimeout(updateCounter, 3000);
    }

    const friendCards = document.querySelectorAll('.friend-card');
    friendCards.forEach(function(card, index) {
        card.addEventListener('mouseenter', function() {
            for (let i = 0; i < 5; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        card.getBoundingClientRect().left + Math.random() * card.offsetWidth,
                        card.getBoundingClientRect().top + Math.random() * card.offsetHeight
                    );
                }, i * 50);
            }
        });
    });

    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            for (let i = 0; i < 10; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        link.getBoundingClientRect().left + Math.random() * link.offsetWidth,
                        link.getBoundingClientRect().top + Math.random() * link.offsetHeight
                    );
                }, i * 30);
            }
        });
    });

    const moodFaces = ['😇', '😊', '🥰', '😎', '🤩', '💕', '✨', '🌟'];
    const moodTexts = [
        'feeling ~*supa happy*~ today!!',
        'having the BEST day ever!!',
        'in luv with life rn <3',
        'feeling cool as ice ~',
        'OMG so excited 4 today!!',
        'spreading luv everywhere!!',
        'feeling sparkly n magical!!',
        'on cloud 9 rn!!'
    ];
    const moodFace = document.querySelector('.mood-face');
    const moodText = document.querySelector('.mood-text');

    function changeMood() {
        const randomIndex = Math.floor(Math.random() * moodFaces.length);
        moodFace.style.transform = 'scale(0)';
        setTimeout(function() {
            moodFace.textContent = moodFaces[randomIndex];
            moodText.textContent = moodTexts[randomIndex];
            moodFace.style.transform = 'scale(1)';
        }, 300);
    }

    setInterval(changeMood, 5000);

    const blinkies = document.querySelectorAll('.blinkie');
    blinkies.forEach(function(blinkie) {
        blinkie.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.2) rotate(5deg)';
            this.style.boxShadow = '0 0 30px ' + sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            
            for (let i = 0; i < 8; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        blinkie.getBoundingClientRect().left + Math.random() * blinkie.offsetWidth,
                        blinkie.getBoundingClientRect().top + Math.random() * blinkie.offsetHeight
                    );
                }, i * 50);
            }

            const originalBlinkie = this;
            setTimeout(function() {
                originalBlinkie.style.transform = '';
                originalBlinkie.style.boxShadow = '';
                originalBlinkie.style.animation = '';
            }, 500);
        });
    });

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', function() {
            for (let i = 0; i < 15; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        profileCard.getBoundingClientRect().left + Math.random() * profileCard.offsetWidth,
                        profileCard.getBoundingClientRect().top + Math.random() * profileCard.offsetHeight
                    );
                }, i * 30);
            }
        });
    }

    const visitorDots = document.querySelectorAll('.visitor-dot');
    visitorDots.forEach(function(dot) {
        dot.style.animationDelay = Math.random() * 2 + 's';
    });

    const webring = document.querySelector('.webring');
    if (webring) {
        webring.addEventListener('click', function() {
            for (let i = 0; i < 15; i++) {
                setTimeout(function() {
                    createCursorSparkle(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        window.innerHeight / 2 + (Math.random() - 0.5) * 200
                    );
                }, i * 50);
            }
        });
    }

    console.log('%c★彡 Welcome to SparklePrincess2005\'s page! 彡★', 
        'color: #FF1493; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00FFFF;');
    console.log('%cDon\'t forget to sign my guestbook!! <3', 
        'color: #00FFFF; font-size: 14px;');
});