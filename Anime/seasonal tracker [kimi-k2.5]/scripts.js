/**
 * AniTrack - Anime Seasonal Tracker
 * Interactive functionality with mascot reactions and real-time updates
 */

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        currentFilter: 'all',
        currentGenre: null,
        animeData: new Map(),
        mascotMood: 'happy'
    };

    // Mascot dialogue database
    const mascotDialogues = {
        greeting: [
            "Ready to track some anime~! ✨",
            "Ganbatte! Let's watch together! 💪",
            "New episodes await! 🌟",
            "Your watchlist is calling! 📺"
        ],
        watching: [
            "Great choice! This one is amazing! ⭐",
            "The animation is so pretty! ✨",
            "Can't wait for the next episode! 🎌",
            "You're making great progress! 🏃‍♀️"
        ],
        completed: [
            "Amazing! Another series conquered! 🏆",
            "How was the ending? Tell me! 🗣️",
            "Ready for the next adventure? 🌈",
            "Completed already? You're on fire! 🔥"
        ],
        planned: [
            "Added to the list! So much to watch! 📋",
            "This one looks interesting! 🤔",
            "Planning ahead? Smart move! 🧠",
            "The anticipation is exciting! ⏳"
        ],
        episodeUp: [
            "Next episode! Getting intense! 🎭",
            "Plot thickens! Can't stop! 🍿",
            "One more down! Keep going! 🚀",
            "You're on a roll! 📈"
        ],
        episodeDown: [
            "Going back? Must've been good! 🔄",
            "Re-watching the best parts! 👀",
            "Taking it slow is fine too! 🐢",
            "Sometimes we need a recap! 📝"
        ],
        filter: [
            "Finding your favorites! 🔍",
            "Organizing your collection! 📚",
            "So many great shows! 🎨",
            "Discovery time! What will you watch? 🔮"
        ]
    };

    // Initialize anime data from DOM
    function initializeData() {
        document.querySelectorAll('.anime-card').forEach(card => {
            const id = card.dataset.id || Math.random().toString(36).substr(2, 9);
            card.dataset.id = id;
            
            const title = card.querySelector('.anime-title').textContent;
            const currentEp = parseInt(card.querySelector('.ep-counter').textContent);
            const totalEps = parseInt(card.querySelector('.episode-track').textContent.split('/')[1]);
            const status = card.dataset.status;
            
            state.animeData.set(id, {
                id,
                title,
                currentEp,
                totalEps,
                status,
                element: card
            });
        });
    }

    // Mascot Controller
    class MascotController {
        constructor() {
            this.mascot = document.getElementById('mascot');
            this.speechBubble = document.getElementById('mascotSpeech');
            this.eyes = document.querySelectorAll('.eye');
            this.isAnimating = false;
            
            this.init();
        }

        init() {
            // Random idle animations
            setInterval(() => this.idleAnimation(), 5000);
            
            // Click interaction
            this.mascot.addEventListener('click', () => this.interact());
            
            // Initial greeting
            setTimeout(() => this.say(mascotDialogues.greeting[0]), 1000);
        }

        idleAnimation() {
            if (Math.random() > 0.7) {
                this.mascot.style.transform = 'scale(1.05) rotate(-5deg)';
                setTimeout(() => {
                    this.mascot.style.transform = '';
                }, 300);
            }
        }

        interact() {
            this.mascot.classList.add('active');
            this.say(mascotDialogues.greeting[Math.floor(Math.random() * mascotDialogues.greeting.length)]);
            
            // Happy bounce
            this.mascot.style.animation = 'none';
            setTimeout(() => {
                this.mascot.style.animation = '';
            }, 10);
            
            setTimeout(() => this.mascot.classList.remove('active'), 3000);
        }

        say(text, duration = 3000) {
            this.speechBubble.textContent = text;
            this.mascot.classList.add('active');
            
            // Reset any existing timeout
            if (this.timeout) clearTimeout(this.timeout);
            
            this.timeout = setTimeout(() => {
                this.mascot.classList.remove('active');
            }, duration);
        }

        react(action) {
            const dialogues = mascotDialogues[action];
            if (dialogues) {
                const randomLine = dialogues[Math.floor(Math.random() * dialogues.length)];
                this.say(randomLine);
            }
            
            // Visual reaction
            this.mascot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.mascot.style.transform = '';
            }, 200);
        }

        celebrate() {
            this.say("Yatta! Goal reached! 🎉🎊", 4000);
            this.mascot.style.animation = 'mascot-bounce 0.5s ease 3';
            
            // Happy eyes
            this.eyes.forEach(eye => {
                eye.style.transform = 'scaleY(0.3)';
                setTimeout(() => {
                    eye.style.transform = '';
                }, 1000);
            });
        }
    }

    // Filter Controller
    class FilterController {
        constructor(mascot) {
            this.mascot = mascot;
            this.filterBtns = document.querySelectorAll('.filter-btn');
            this.genreTags = document.querySelectorAll('.genre-tag');
            this.cards = document.querySelectorAll('.anime-card');
            
            this.init();
        }

        init() {
            // Status filters
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filter = e.target.dataset.filter;
                    this.setFilter(filter);
                });
            });

            // Genre filters
            this.genreTags.forEach(tag => {
                tag.addEventListener('click', (e) => {
                    const genre = e.target.classList[1]; // genre-tag action -> action
                    this.filterByGenre(genre, e.target);
                });
            });
        }

        setFilter(filter) {
            state.currentFilter = filter;
            
            // Update buttons
            this.filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });

            // Filter cards with animation
            this.cards.forEach(card => {
                const cardStatus = card.dataset.status;
                const shouldShow = filter === 'all' || cardStatus === filter;
                
                if (shouldShow) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            if (filter !== 'all') {
                this.mascot.react('filter');
            }
        }

        filterByGenre(genre, element) {
            // Toggle active state on tags
            const isActive = element.classList.contains('active');
            
            // Reset all tags
            this.genreTags.forEach(tag => tag.classList.remove('active'));
            
            if (!isActive) {
                element.classList.add('active');
                state.currentGenre = genre;
                
                this.cards.forEach(card => {
                    const cardGenres = card.dataset.genres;
                    const shouldShow = cardGenres && cardGenres.includes(genre);
                    
                    if (shouldShow) {
                        card.style.display = '';
                        card.style.opacity = '1';
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            } else {
                state.currentGenre = null;
                this.setFilter(state.currentFilter);
            }
        }
    }

    // Episode & Status Controller
    class EpisodeController {
        constructor(mascot) {
            this.mascot = mascot;
            this.init();
        }

        init() {
            document.querySelectorAll('.anime-card').forEach(card => {
                const id = card.dataset.id;
                const data = state.animeData.get(id);
                
                // Status buttons
                const statusBtns = card.querySelectorAll('.status-btn');
                statusBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const newStatus = e.currentTarget.dataset.status;
                        this.updateStatus(card, data, newStatus, statusBtns);
                    });
                });

                // Episode controls
                const minusBtn = card.querySelector('.ep-btn.minus');
                const plusBtn = card.querySelector('.ep-btn.plus');
                const counter = card.querySelector('.ep-counter');

                minusBtn.addEventListener('click', () => {
                    if (data.currentEp > 0) {
                        data.currentEp--;
                        this.updateEpisode(card, data, -1);
                    }
                });

                plusBtn.addEventListener('click', () => {
                    if (data.currentEp < data.totalEps) {
                        data.currentEp++;
                        this.updateEpisode(card, data, 1);
                        
                        // Check completion
                        if (data.currentEp === data.totalEps) {
                            setTimeout(() => this.mascot.celebrate(), 500);
                        }
                    }
                });
            });
        }

        updateStatus(card, data, newStatus, buttons) {
            data.status = newStatus;
            card.dataset.status = newStatus;
            
            // Update UI
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.status === newStatus);
            });

            // Update progress display
            const track = card.querySelector('.episode-track');
            track.textContent = `${data.currentEp}/${data.totalEps} Episodes`;

            // Mascot reaction
            this.mascot.react(newStatus);
        }

        updateEpisode(card, data, delta) {
            const counter = card.querySelector('.ep-counter');
            const progressFill = card.querySelector('.progress-fill');
            const track = card.querySelector('.episode-track');
            
            // Update counter
            counter.textContent = data.currentEp;
            
            // Update progress bar
            const percentage = (data.currentEp / data.totalEps) * 100;
            progressFill.style.width = `${percentage}%`;
            
            // Update track text
            track.textContent = `${data.currentEp}/${data.totalEps} Episodes`;
            
            // Visual feedback
            counter.style.transform = 'scale(1.3)';
            setTimeout(() => {
                counter.style.transform = '';
            }, 200);
            
            // Mascot reaction
            this.mascot.react(delta > 0 ? 'episodeUp' : 'episodeDown');
            
            // Auto-update status if needed
            if (data.currentEp === data.totalEps && data.status !== 'completed') {
                const completeBtn = card.querySelector('.status-btn.completed');
                setTimeout(() => completeBtn.click(), 800);
            }
        }
    }

    // Countdown Timer
    class CountdownTimer {
        constructor() {
            this.updateIntervals = new Map();
            this.init();
        }

        init() {
            document.querySelectorAll('.countdown-container').forEach((container, index) => {
                this.startCountdown(container, index);
            });
        }

        startCountdown(container, index) {
            // Simulate different times for each anime
            const baseHours = [52, 12, 0.75, 32, 74, 97][index] || 24;
            let remainingSeconds = baseHours * 3600 + Math.random() * 3600;
            
            const ring = container.querySelector('.ring-progress');
            const subText = container.querySelector('.countdown-sub');
            const text = container.querySelector('.countdown-text');
            
            const update = () => {
                remainingSeconds -= 1;
                
                if (remainingSeconds <= 0) {
                    remainingSeconds = 7 * 24 * 3600; // Reset to 1 week
                    text.textContent = 'NEW!';
                    subText.textContent = 'Airing!';
                    container.classList.add('urgent');
                    return;
                }
                
                const days = Math.floor(remainingSeconds / 86400);
                const hours = Math.floor((remainingSeconds % 86400) / 3600);
                const minutes = Math.floor((remainingSeconds % 3600) / 60);
                
                // Update text
                if (days > 0) {
                    subText.textContent = `${days}d ${hours}h`;
                } else if (hours > 0) {
                    subText.textContent = `${hours}h ${minutes}m`;
                    container.classList.add('urgent');
                } else {
                    subText.textContent = `${minutes}m`;
                    container.classList.add('urgent');
                }
                
                // Update ring progress (simulated)
                const totalWeek = 7 * 24 * 3600;
                const progress = remainingSeconds / totalWeek;
                const offset = 283 - (283 * progress);
                ring.style.strokeDashoffset = offset;
            };
            
            update();
            setInterval(update, 60000); // Update every minute
        }
    }

    // Sparkline Animator
    class SparklineAnimator {
        constructor() {
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const path = entry.target.querySelector('.sparkline-path');
                        if (path) {
                            path.style.animation = 'none';
                            path.offsetHeight; // Trigger reflow
                            path.style.animation = 'draw-line 2s ease forwards';
                        }
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.sparkline').forEach(sparkline => {
                observer.observe(sparkline.parentElement);
            });
        }
    }

    // Particle Effects for interactions
    class ParticleSystem {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('.status-btn, .ep-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.createParticles(e));
            });
        }

        createParticles(e) {
            const rect = e.target.getBoundingClientRect();
            const colors = ['#ff2a6d', '#05d9e8', '#ffd60a', '#39ff14'];
            
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (Math.PI * 2 * i) / 8;
                const velocity = 60;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                }).onfinish = () => particle.remove();
            }
        }
    }

    // Initialize everything
    initializeData();
    const mascot = new MascotController();
    const filterController = new FilterController(mascot);
    const episodeController = new EpisodeController(mascot);
    const countdownTimer = new CountdownTimer();
    const sparklineAnimator = new SparklineAnimator();
    const particleSystem = new ParticleSystem();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            mascot.interact();
        }
    });

    // Save state before unload
    window.addEventListener('beforeunload', () => {
        // In a real app, save to localStorage here
        console.log('Saving watch progress...');
    });

    console.log('🌸 AniTrack initialized! Press "M" to interact with mascot.');
});