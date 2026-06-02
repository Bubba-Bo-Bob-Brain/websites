/**
 * CODEX TENEBRIS - Interactive Scripts
 * Medieval Dark Fantasy Grimoire Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // STATE & CONFIGURATION
    // ==========================================
    const state = {
        currentTab: 'prophecy',
        torchIntensity: 0.15,
        isModalOpen: false,
        particlesCount: 0,
        maxParticles: 40,
        mouseX: 0,
        mouseY: 0
    };

    const creatureLore = {
        draugr: {
            fullName: "Draugr - The Deathless Warrior",
            origin: "Ancient burial grounds of the Northern Wastes",
            description: "When a warrior of great pride dies with unfinished business, their body may refuse death's call. The Draugr retains the intelligence and skills of its former life, combined with supernatural strength and an insatiable hatred for the living.",
            abilities: ["Supernatural Strength", "Immunity to Frost", "Paralyzing Touch", "Wall of Gloom"],
            weaknessDetail: "Only fire consecrated by the High Priestesses of the Dawn can truly destroy a Draugr. Decapitation temporarily disables them, but they reform within three nights.",
            dangerLevel: "EXTREME"
        },
        basilisk: {
            fullName: "Basilisk - Crown of Serpents",
            origin: "Hatched by cockerel from serpent's egg under a cursed moon",
            description: "The King of All Serpents moves with deliberate grace, its golden crown marking it as nobility among monsters. Its breath withers vegetation and shatters stone, while its gaze transforms living tissue to marble.",
            abilities: ["Petrifying Gaze", "Venomous Breath", "Regeneration", "Hypnotic Movement"],
            weaknessDetail: "Weasels are immune to its poison. A mirror or polished shield can reflect its gaze, turning the creature to stone. The crow of a rooster causes it immediate pain.",
            dangerLevel: "HIGH"
        },
        wraith: {
            fullName: "Shadow Wraith - Echo of Sorrow",
            origin: "Manifestations of collective grief from battlefields",
            description: "Formless entities that exist partially in the ethereal plane. They feed not on flesh but on hope, leaving victims as hollow shells. Their whispers carry the secrets of the dead, driving listeners to madness.",
            abilities: ["Intangibility", "Soul Drain", "Memory Theft", "Shadow Travel"],
            weaknessDetail: "Sunlight burns them, though they can endure brief exposure. Silver weapons can strike their semi-corporeal forms. Laughter and joy cause them physical pain.",
            dangerLevel: "MODERATE"
        },
        lich: {
            fullName: "Arch-Lich - Transcendent Necromancer",
            origin: "Sorcerers who achieved immortality through the Ritual of Endless Night",
            description: "The pinnacle of necromantic arts. These beings have transcended death by hiding their souls in phylacteries. They command armies of undead and reshape reality with thought alone.",
            abilities: ["Reality Warping", "Undead Legion", "Infinite Knowledge", "Phylactery Immortality"],
            weaknessDetail: "Destruction of the phylactery is the only true death. They cannot enter consecrated ground. Their connection to the negative plane can be severed by the Starlight Blade.",
            dangerLevel: "APOCALYPTIC"
        }
    };

    const regionDescriptions = {
        ashfall: "A desolate wasteland where the sky rains volcanic glass. Nothing grows, yet things persist here—hollow-eyed wanderers and ash-wraiths.",
        thornveil: "Ancient forest where the trees drink blood and the paths shift when unobserved. The Thornveil Dryads guard secrets older than mankind.",
        citadel: "Once a seat of learning, now a tomb. The Citadel of Sorrows sank into the earth after the Cataclysm, taking ten thousand souls with it."
    };

    // ==========================================
    // TORCH & ATMOSPHERE EFFECTS
    // ==========================================
    
    // Dynamic torch following cursor
    const torchCursor = document.getElementById('torch-cursor');
    const flickerOverlay = document.getElementById('flicker-overlay');
    
    document.addEventListener('mousemove', (e) => {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        
        // Update CSS variables for torch gradient position
        const xPercent = (e.clientX / window.innerWidth) * 100;
        const yPercent = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
        document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
        
        // Parallax effect on manuscript container (subtle)
        const container = document.querySelector('.codex-container');
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        container.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Random flicker intensity
    function randomFlicker() {
        const intensity = Math.random() > 0.7 ? 0.15 : 0.05;
        flickerOverlay.style.opacity = intensity;
        
        // Random timing for organic feel
        const nextFlicker = Math.random() * 3000 + 1000;
        setTimeout(randomFlicker, nextFlicker);
    }
    randomFlicker();

    // ==========================================
    // PARTICLE SYSTEM
    // ==========================================
    
    const dustContainer = document.getElementById('dust-particles');
    
    function createParticle() {
        if (state.particlesCount >= state.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 15 + 20; // 20-35s
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}vw;
            top: 100vh;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: float-dust ${duration}s linear ${delay}s forwards;
        `;
        
        dustContainer.appendChild(particle);
        state.particlesCount++;
        
        // Cleanup
        setTimeout(() => {
            particle.remove();
            state.particlesCount--;
        }, (duration + delay) * 1000);
    }

    // Initialize particles
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 300);
    }
    setInterval(createParticle, 2000);

    // ==========================================
    // NAVIGATION TABS
    // ==========================================
    
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.content-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            if (state.currentTab === targetTab) return;
            
            // Update tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '0');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Update panels with fade transition
            panels.forEach(panel => {
                if (panel.id === `${targetTab}-panel`) {
                    panel.hidden = false;
                    // Small delay to allow display:block to apply before adding active class
                    requestAnimationFrame(() => {
                        panel.classList.add('active');
                    });
                } else {
                    panel.classList.remove('active');
                    setTimeout(() => {
                        if (!panel.classList.contains('active')) {
                            panel.hidden = true;
                        }
                    }, 300);
                }
            });
            
            state.currentTab = targetTab;
            
            // Play subtle sound effect (if audio context available)
            playClickSound();
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });

    // ==========================================
    // BESTIARY INTERACTIONS
    // ==========================================
    
    const creatureCards = document.querySelectorAll('.creature-card');
    const modal = document.getElementById('creature-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    creatureCards.forEach(card => {
        const creatureType = card.dataset.creature;
        const loreButton = card.querySelector('.lore-button');
        
        // Hover effect - slight rotation based on mouse position
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const border = card.querySelector('.card-border');
            border.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            const border = card.querySelector('.card-border');
            border.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Open modal
        loreButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openCreatureModal(creatureType);
        });
    });
    
    function openCreatureModal(creatureType) {
        const data = creatureLore[creatureType];
        if (!data) return;
        
        modalTitle.textContent = data.fullName;
        modalBody.innerHTML = `
            <div class="creature-detail-header">
                <span class="origin-tag">${data.origin}</span>
                <span class="danger-badge ${data.dangerLevel.toLowerCase()}">${data.dangerLevel}</span>
            </div>
            <p class="detail-description">${data.description}</p>
            <div class="abilities-section">
                <h4>Known Abilities</h4>
                <ul class="abilities-list">
                    ${data.abilities.map(ability => `<li>${ability}</li>`).join('')}
                </ul>
            </div>
            <div class="weakness-section">
                <h4>Defensive Measures</h4>
                <p>${data.weaknessDetail}</p>
            </div>
        `;
        
        modal.hidden = false;
        state.isModalOpen = true;
        
        // Focus trap for accessibility
        modalClose.focus();
        
        // Entrance animation
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }
    
    function closeModal() {
        modal.hidden = true;
        state.isModalOpen = false;
        
        // Return focus to triggering element
        const activeCard = document.querySelector(`[data-creature="${state.currentTab}"]`);
        if (activeCard) {
            activeCard.querySelector('.lore-button').focus();
        }
    }
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            closeModal();
        }
    });

    // ==========================================
    // MAP INTERACTIVITY
    // ==========================================
    
    const mapRegions = document.querySelectorAll('.map-region');
    const mapTooltip = document.getElementById('map-tooltip');
    
    mapRegions.forEach(region => {
        const regionId = region.dataset.region;
        
        region.addEventListener('mouseenter', () => {
            const label = region.querySelector('.region-label').textContent;
            const description = regionDescriptions[regionId] || "Unknown territories. Proceed with caution.";
            
            mapTooltip.querySelector('h4').textContent = label;
            mapTooltip.querySelector('p').textContent = description;
            mapTooltip.hidden = false;
            
            // Pulse animation on region
            const area = region.querySelector('.region-area');
            area.style.fill = '#8b0000';
            area.style.opacity = '0.6';
        });
        
        region.addEventListener('mousemove', (e) => {
            const tooltipWidth = mapTooltip.offsetWidth;
            const tooltipHeight = mapTooltip.offsetHeight;
            
            // Prevent tooltip from going off screen
            let left = e.pageX + 15;
            let top = e.pageY + 15;
            
            if (left + tooltipWidth > window.innerWidth) {
                left = e.pageX - tooltipWidth - 15;
            }
            if (top + tooltipHeight > window.innerHeight) {
                top = e.pageY - tooltipHeight - 15;
            }
            
            mapTooltip.style.left = `${left}px`;
            mapTooltip.style.top = `${top}px`;
        });
        
        region.addEventListener('mouseleave', () => {
            mapTooltip.hidden = true;
            const area = region.querySelector('.region-area');
            area.style.fill = '';
            area.style.opacity = '';
        });
        
        // Keyboard accessibility
        region.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                region.dispatchEvent(new Event('mouseenter'));
            }
        });
    });

    // ==========================================
    // TEXT SCRAMBLE EFFECT (Ominous Text)
    // ==========================================
    
    const ominousTexts = document.querySelectorAll('.ominous-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜÆÐØÞß';
    
    ominousTexts.forEach(text => {
        const originalText = text.dataset.text || text.textContent;
        
        text.addEventListener('mouseenter', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                text.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    text.textContent = originalText;
                }
                
                iterations += 1/3;
            }, 30);
        });
    });

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe creature cards and spell pages
    document.querySelectorAll('.creature-card, .spell-page').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ==========================================
    // AMBIENT SOUNDS (Simulated)
    // ==========================================
    
    // Since we can't auto-play audio, we prepare the function for user interaction
    function playClickSound() {
        // Create a subtle "page turn" or "stone click" sound using Web Audio API
        // Only if user has interacted with page
        if (document.documentElement.classList.contains('audio-enabled')) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    // Enable audio on first interaction
    document.addEventListener('click', () => {
        document.documentElement.classList.add('audio-enabled');
    }, { once: true });

    // ==========================================
    // BLOOD DRIP ANIMATION (Random)
    // ==========================================
    
    const bloodStain = document.querySelector('.blood-stain');
    if (bloodStain) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                bloodStain.style.transform = 'rotate(-15deg) scaleY(1.2)';
                setTimeout(() => {
                    bloodStain.style.transform = 'rotate(-15deg) scaleY(1)';
                }, 2000);
            }
        }, 8000);
    }

    // ==========================================
    // SPELL PAGE INTERACTIONS
    // ==========================================
    
    const lockedPages = document.querySelectorAll('.spell-page.locked');
    lockedPages.forEach(page => {
        page.addEventListener('click', () => {
            page.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                page.style.animation = '';
            }, 500);
        });
    });

    // Add shake keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    console.log('⚔️ Codex Tenebris initialized. The grimoire awaits...');
});