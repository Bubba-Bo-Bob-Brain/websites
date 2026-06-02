/* Kawaii Manga Kingdom - Magical JavaScript Made with love! */
document.addEventListener("DOMContentLoaded", function() {
    initApp();

    function initApp() {
        createSparkles();
        createFloatingHearts();
        createFloatingBubbles();
        createFloatingStars();
        initCursorFollower();
        initMascot();
        initNavigation();
        initCounters();
        initGacha();
        initGallery();
        initContactForm();
        initScrollEffects();
    }

    function createSparkles() {
        var container = document.getElementById("sparkleContainer");
        var sparkleCount = 30;
        for (var i = 0; i < sparkleCount; i++) {
            var sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            sparkle.style.left = Math.random() * 100 + "%";
            sparkle.style.top = Math.random() * 100 + "%";
            sparkle.style.animationDelay = Math.random() * 4 + "s";
            sparkle.style.animationDuration = (3 + Math.random() * 2) + "s";
            container.appendChild(sparkle);
        }
    }

    function createFloatingHearts() {
        var container = document.getElementById("heartContainer");
        var heartSymbols = ["💗", "💖", "💕", "💓", "💞", "💘", "💝"];
        setInterval(function() {
            var heart = document.createElement("div");
            heart.className = "heart";
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + "%";
            heart.style.fontSize = (15 + Math.random() * 15) + "px";
            heart.style.animationDuration = (6 + Math.random() * 4) + "s";
            container.appendChild(heart);
            setTimeout(function() { heart.remove(); }, 10000);
        }, 800);
    }

    function createFloatingBubbles() {
        var container = document.getElementById("bubbleContainer");
        setInterval(function() {
            var bubble = document.createElement("div");
            bubble.className = "bubble";
            var size = 20 + Math.random() * 40;
            bubble.style.width = size + "px";
            bubble.style.height = size + "px";
            bubble.style.left = Math.random() * 100 + "%";
            bubble.style.animationDuration = (10 + Math.random() * 8) + "s";
            container.appendChild(bubble);
            setTimeout(function() { bubble.remove(); }, 18000);
        }, 1500);
    }

    function createFloatingStars() {
        var container = document.getElementById("starContainer");
        var starSymbols = ["✦", "★", "☆", "✧", "⋆"];
        setInterval(function() {
            var star = document.createElement("div");
            star.className = "star";
            star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            star.style.animationDelay = Math.random() * 3 + "s";
            star.style.fontSize = (12 + Math.random() * 12) + "px";
            container.appendChild(star);
            setTimeout(function() { star.remove(); }, 5000);
        }, 600);
    }

    function initCursorFollower() {
        var cursor = document.getElementById("cursorOrb");
        var mouseX = 0, mouseY = 0;
        var cursorX = 0, cursorY = 0;
        document.addEventListener("mousemove", function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = (cursorX - 20) + "px";
            cursor.style.top = (cursorY - 20) + "px";
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        var interactiveElements = document.querySelectorAll("a, button, .character-card, .gallery-item");
        interactiveElements.forEach(function(el) {
            el.addEventListener("mouseenter", function() {
                cursor.style.transform = "scale(1.5)";
            });
            el.addEventListener("mouseleave", function() {
                cursor.style.transform = "scale(1)";
            });
        });
    }

    function initMascot() {
        var mascot = document.getElementById("mascot");
        var speech = document.getElementById("mascotSpeech");
        var speeches = [
            "Hai! Welcome to the kingdom! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "Click the button to explore! ✨",
            "Try the gacha machine! 🎰",
            "Hope you're having a kawaii day! 💕",
            "New characters just dropped! 🌸",
            "Don't forget to smile today! ☺️",
            "You're doing great, senpai! 💖",
            "Magic awaits you! ✨🌟"
        ];
        var speechIndex = 0;
        setInterval(function() {
            speech.style.opacity = "0";
            setTimeout(function() {
                speechIndex = (speechIndex + 1) % speeches.length;
                speech.textContent = speeches[speechIndex];
                speech.style.opacity = "1";
            }, 300);
        }, 5000);
        mascot.addEventListener("click", function() {
            createMascotSparkles();
            speakRandomSpeech();
        });
        function createMascotSparkles() {
            var container = document.getElementById("mascotSparkles");
            var sparkleSymbols = ["✨", "💖", "⭐", "💕", "🌸"];
            for (var i = 0; i < 8; i++) {
                var sparkle = document.createElement("div");
                sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
                sparkle.style.cssText = "position: absolute; font-size: 20px; left: 50%; top: 50%; animation: sparkle-burst 0.8s ease-out forwards; --angle: " + (i * 45) + "deg;";
                container.appendChild(sparkle);
                setTimeout(function() { sparkle.remove(); }, 800);
            }
        }
        var style = document.createElement("style");
        style.textContent = "@keyframes sparkle-burst { 0% { transform: translate(-50%, -50%) rotate(var(--angle)) scale(0); opacity: 1; } 100% { transform: translate(calc(-50% + cos(var(--angle)) * 100px), calc(-50% + sin(var(--angle)) * 100px)) scale(1.5); opacity: 0; } }";
        document.head.appendChild(style);
        function speakRandomSpeech() {
            speech.style.opacity = "0";
            setTimeout(function() {
                speech.textContent = speeches[Math.floor(Math.random() * speeches.length)];
                speech.style.opacity = "1";
            }, 300);
        }
        var exploreBtn = document.getElementById("exploreBtn");
        if (exploreBtn) {
            exploreBtn.addEventListener("click", function() {
                mascot.classList.add("excited");
                speech.textContent = "Yay! Let's go on an adventure! (≧◡≦)";
                createMascotSparkles();
                setTimeout(function() { mascot.classList.remove("excited"); }, 1000);
            });
        }
    }

    function initNavigation() {
        var navToggle = document.getElementById("navToggle");
        var navLinks = document.querySelector(".nav-links");
        var navItems = document.querySelectorAll(".nav-item");
        navToggle.addEventListener("click", function() {
            navToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
        navItems.forEach(function(item) {
            item.addEventListener("click", function(e) {
                e.preventDefault();
                var targetId = item.getAttribute("data-target");
                var targetSection = document.getElementById(targetId);
                if (targetSection) {
                    navToggle.classList.remove("active");
                    navLinks.classList.remove("active");
                    setTimeout(function() {
                        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 300);
                    navItems.forEach(function(nav) { nav.classList.remove("active"); });
                    item.classList.add("active");
                }
            });
        });
        window.addEventListener("scroll", function() {
            var navbar = document.querySelector(".main-nav");
            if (window.scrollY > 100) {
                navbar.style.background = "rgba(255, 245, 245, 0.98)";
                navbar.style.boxShadow = "0 4px 20px rgba(255, 105, 180, 0.3)";
            } else {
                navbar.style.background = "linear-gradient(180deg, rgba(255, 245, 245, 0.95) 0%, rgba(255, 245, 245, 0.8) 100%)";
                navbar.style.boxShadow = "0 4px 15px rgba(255, 105, 180, 0.15)";
            }
        });
    }

    function initCounters() {
        var counters = document.querySelectorAll(".stat-number");
        var countersAnimated = false;
        function animateCounters() {
            if (countersAnimated) return;
            counters.forEach(function(counter) {
                var target = parseInt(counter.getAttribute("data-count"));
                var duration = 2000;
                var step = target / (duration / 16);
                var current = 0;
                function updateCounter() {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + "+";
                    }
                }
                updateCounter();
            });
            countersAnimated = true;
        }
        var statsSection = document.querySelector(".hero-stats");
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    function initGacha() {
        var singlePullBtn = document.getElementById("singlePull");
        var multiPullBtn = document.getElementById("multiPull");
        var crank = document.getElementById("gachaCrank");
        var capsuleContainer = document.getElementById("capsuleContainer");
        var resultMessage = document.getElementById("pullResult").querySelector(".result-message");
        var isPulling = false;
        var characters = [
            { id: "sakura", name: "Sakura-chan", rarity: "SSR", emoji: "🔮", quote: "Believe in the magic!" },
            { id: "kenji", name: "Kenji-kun", rarity: "SSR", emoji: "⚔️", quote: "My blade protects!" },
            { id: "yuki", name: "Yuki-chan", rarity: "SR", emoji: "❄️", quote: "Let it snow!" },
            { id: "hana", name: "Hana-chan", rarity: "SR", emoji: "🌸", quote: "Bloom with me!" },
            { id: "mochi", name: "Mochi-chan", rarity: "SR", emoji: "🐱", quote: "Nyan~!" },
            { id: "kaito", name: "Kaito-kun", rarity: "R", emoji: "🎸", quote: "Rock on!" },
            { id: "miku", name: "Miku-chan", rarity: "R", emoji: "🎤", quote: "Vocaloid power!" },
            { id: "yuto", name: "Yuto-kun", rarity: "R", emoji: "🏀", quote: "Slam dunk!" },
            { id: "sora", name: "Sora-chan", rarity: "R", emoji: "🌙", quote: "Dreams come true!" },
            { id: "ren", name: "Ren-kun", rarity: "R", emoji: "📚", quote: "Study hard!" }
        ];
        function getRandomCharacter() {
            var rand = Math.random() * 100;
            var rarity;
            if (rand < 3) rarity = "SSR";
            else if (rand < 15) rarity = "SR";
            else rarity = "R";
            var filtered = characters.filter(function(c) { return c.rarity === rarity; });
            return filtered[Math.floor(Math.random() * filtered.length)];
        }
        function pullGacha(count) {
            if (isPulling) return;
            isPulling = true;
            if (crank) {
                crank.style.transform = "translateY(-50%) rotate(720deg)";
                setTimeout(function() { crank.style.transform = "translateY(-50%) rotate(0deg)"; }, 1000);
            }
            capsuleContainer.innerHTML = "";
            singlePullBtn.disabled = true;
            multiPullBtn.disabled = true;
            var pulledCharacters = [];
            for (var i = 0; i < count; i++) {
                var char = getRandomCharacter();
                pulledCharacters.push(char);
            }
            var delay = 0;
            pulledCharacters.forEach(function(char, index) {
                setTimeout(function() {
                    var capsule = document.createElement("div");
                    capsule.className = "gacha-capsule " + char.rarity.toLowerCase();
                    capsule.textContent = char.emoji;
                    capsuleContainer.appendChild(capsule);
                    if (char.rarity === "SSR") {
                        createSSRburst();
                    }
                }, delay);
                delay += 200;
            });
            setTimeout(function() {
                var ssrCount = pulledCharacters.filter(function(c) { return c.rarity === "SSR"; }).length;
                var srCount = pulledCharacters.filter(function(c) { return c.rarity === "SR"; }).length;
                var message = "";
                if (ssrCount > 0) {
                    message = "✨ WOW! " + ssrCount + " SSR character" + (ssrCount > 1 ? "s" : "") + "! ✨";
                } else if (srCount >= 3) {
                    message = "⭐ Amazing! " + srCount + " SR characters!";
                } else {
                    message = "💕 You got " + pulledCharacters.length + " characters!";
                }
                resultMessage.textContent = message;
                var bestPull = pulledCharacters.find(function(c) { return c.rarity === "SSR"; });
                if (bestPull) {
                    showToast("SSR: " + bestPull.name + "! 🌟", "ssr");
                } else {
                    var bestSR = pulledCharacters.find(function(c) { return c.rarity === "SR"; });
                    if (bestSR) {
                        showToast("SR: " + bestSR.name + "! ⭐", "sr");
                    }
                }
                isPulling = false;
                singlePullBtn.disabled = false;
                multiPullBtn.disabled = false;
            }, count * 200 + 500);
        }
        function createSSRburst() {
            var container = document.getElementById("gachaDisplay");
            for (var i = 0; i < 20; i++) {
                var burst = document.createElement("div");
                burst.style.cssText = "position: absolute; width: 10px; height: 10px; background: #FFD700; border-radius: 50%; left: 50%; top: 50%; animation: ssr-burst 1s ease-out forwards; --angle: " + (Math.random() * 360) + "deg; --distance: " + (100 + Math.random() * 100) + "px;";
                container.appendChild(burst);
                setTimeout(function() { burst.remove(); }, 1000);
            }
        }
        if (!document.querySelector("#ssrBurstStyle")) {
            var ssrStyle = document.createElement("style");
            ssrStyle.id = "ssrBurstStyle";
            ssrStyle.textContent = "@keyframes ssr-burst { 0% { transform: translate(-50%, -50%) rotate(var(--angle)) scale(1); opacity: 1; } 100% { transform: translate(calc(-50% + cos(var(--angle)) * var(--distance)), calc(-50% + sin(var(--angle)) * var(--distance))) scale(0); opacity: 0; } }";
            document.head.appendChild(ssrStyle);
        }
        singlePullBtn.addEventListener("click", function() { pullGacha(1); });
        multiPullBtn.addEventListener("click", function() { pullGacha(10); });
        if (crank) {
            crank.addEventListener("click", function() { pullGacha(1); });
        }
    }

    function initGallery() {
        var galleryItems = document.querySelectorAll(".gallery-item");
        galleryItems.forEach(function(item) {
            item.addEventListener("mouseenter", function() {
                item.style.transform = "scale(1.05) rotate(2deg)";
            });
            item.addEventListener("mouseleave", function() {
                item.style.transform = "scale(1) rotate(0deg)";
            });
            item.addEventListener("click", function() {
                var title = item.querySelector(".gallery-title");
                if (title) {
                    showToast("Viewing: " + title.textContent + " 🖼️");
                }
            });
        });
    }

    function initContactForm() {
        var form = document.getElementById("contactForm");
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            var inputs = form.querySelectorAll("input, textarea");
            var message = "Thank you, ";
            if (inputs[0].value) {
                message += inputs[0].value;
            }
            message += "! 💕 Your message has been sent with love!";
            showToast(message);
            inputs.forEach(function(input) { input.value = ""; });
        });
        var formInputs = form.querySelectorAll("input, textarea");
        formInputs.forEach(function(input) {
            input.addEventListener("focus", function() {
                input.style.borderColor = "#FF69B4";
                input.style.boxShadow = "0 0 15px rgba(255, 105, 180, 0.3)";
            });
            input.addEventListener("blur", function() {
                input.style.borderColor = "";
                input.style.boxShadow = "";
            });
        });
    }

    function showToast(message, type) {
        type = type || "default";
        var container = document.getElementById("toastContainer");
        var toast = document.createElement("div");
        toast.className = "toast " + type;
        var icon = type === "ssr" ? "🌟" : type === "sr" ? "⭐" : "💖";
        toast.innerHTML = "<span class=\"toast-icon\">" + icon + "</span><span class=\"toast-message\">" + message + "</span>";
        container.appendChild(toast);
        setTimeout(function() {
            toast.classList.add("hide");
            setTimeout(function() { toast.remove(); }, 500);
        }, 3000);
    }

    function initScrollEffects() {
        var clouds = document.querySelectorAll(".cloud");
        window.addEventListener("scroll", function() {
            var scrollY = window.scrollY;
            clouds.forEach(function(cloud, index) {
                cloud.style.transform = "translateY(" + (scrollY * (0.1 + index * 0.05)) + "px)";
            });
        });
        var sections = document.querySelectorAll("section");
        var sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(function(section) {
            section.style.opacity = "0";
            section.style.transform = "translateY(30px)";
            section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            sectionObserver.observe(section);
        });
        var cards = document.querySelectorAll(".character-card");
        var cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0) scale(1)";
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });
        cards.forEach(function(card) {
            card.style.opacity = "0";
            card.style.transform = "translateY(50px) scale(0.9)";
            card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            cardObserver.observe(card);
        });
    }

    var konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var konamiIndex = 0;
    document.addEventListener("keydown", function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showToast("🎉 SECRET MODE ACTIVATED! 🎉");
                konamiIndex = 0;
                document.body.style.animation = "rainbow-bg 5s linear infinite";
                var rainbowStyle = document.createElement("style");
                rainbowStyle.textContent = "@keyframes rainbow-bg { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }";
                document.head.appendChild(rainbowStyle);
            }
        } else {
            konamiIndex = 0;
        }
    });

    document.addEventListener("dblclick", function(e) {
        var sparkle = document.createElement("div");
        sparkle.style.cssText = "position: fixed; left: " + e.clientX + "px; top: " + e.clientY + "px; font-size: 30px; pointer-events: none; animation: double-sparkle 1s ease-out forwards; z-index: 10000;";
        sparkle.textContent = "✨";
        document.body.appendChild(sparkle);
        setTimeout(function() { sparkle.remove(); }, 1000);
    });

    var doubleStyle = document.createElement("style");
    doubleStyle.textContent = "@keyframes double-sparkle { 0% { transform: scale(0) rotate(0deg); opacity: 1; } 50% { transform: scale(1.5) rotate(180deg); opacity: 1; } 100% { transform: scale(0) rotate(360deg) translateY(-50px); opacity: 0; } }";
    document.head.appendChild(doubleStyle);

    console.log("%c✨ Kawaii Manga Kingdom loaded with love! 💕", "font-size: 20px; color: #FF69B4;");
    console.log("%cMo mo kyun! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "font-size: 16px; color: #FFB6C1;");
});