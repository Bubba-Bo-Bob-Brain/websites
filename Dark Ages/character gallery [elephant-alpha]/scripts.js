// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Character data with detailed properties
    const characters = [
        {
            name: "Brother Malachite",
            stats: {
                plagueResistance: "+15%",
                faith: "+20%",
                combat: "-10%",
                deathResistance: "-5%"
            },
            details: {
                occupation: "🕊️ Monk",
                class: "🧙 Cleric",
                alignment: "⚖️ Lawful Good"
            }
        },
        {
            name: "Isolde the Grave Robber",
            stats: {
                plagueResistance: "+5%",
                combat: "+25%",
                stealth: "+15%",
                deathResistance: "+10%"
            },
            details: {
                occupation: "⚰️ Grave Robber",
                class: "👁️ Rogue",
                alignment: "⚖️ Chaotic Neutral"
            }
        },
        {
            name: "Lord Alistair Blackwood",
            stats: {
                plagueResistance: "+20%",
                wealth: "+30%",
                combat: "+10%",
                defense: "+15%"
            },
            details: {
                occupation: "🏰 Lord",
                class: "🛡️ Knight",
                alignment: "⚖️ Lawful Neutral"
            }
        },
        {
            name: "Seraphina the Plague Doctor",
            stats: {
                plagueResistance: "+30%",
                healing: "+20%",
                knowledge: "+15%",
                combat: "-5%"
            },
            details: {
                occupation: "🦠 Plague Doctor",
                class: "🏥 Medic",
                alignment: "⚖️ Neutral Good"
            }
        },
        {
            name: "Cassandra the Witch",
            stats: {
                plagueResistance: "+20%",
                perception: "+25%",
                defense: "+10%",
                deathResistance: "-10%"
            },
            details: {
                occupation: "🔮 Witch",
                class: "✨ Mage",
                alignment: "⚖️ Neutral Evil"
            }
        },
        {
            name: "Grimm the Berserker",
            stats: {
                combat: "+35%",
                defense: "+10%",
                intellect: "-15%",
                bloodlust: "+5%"
            },
            details: {
                occupation: "💪 Berserker",
                class: "🗡️ Fighter",
                alignment: "⚖️ Chaotic Neutral"
            }
        },
        {
            name: "Elara the Seer",
            stats: {
                perception: "+25%",
                prophecy: "+30%",
                defense: "+10%",
                deathResistance: "-5%"
            },
            details: {
                occupation: "🌟 Seer",
                class: "🔮 Mystic",
                alignment: "⚖️ Lawful Good"
            }
        },
        {
            name: "Viktor the Bandit",
            stats: {
                combat: "+20%",
                aim: "+15%",
                stealth: "+25%",
                deathResistance: "+5%"
            },
            details: {
                occupation: "💣 Bandit",
                class: "🎯 Archer",
                alignment: "⚖️ Chaotic Evil"
            }
        },
        {
            name: "Father Benedict",
            stats: {
                faith: "+30%",
                compassion: "+20%",
                combat: "-10%",
                deathResistance: "-15%"
            },
            details: {
                occupation: "✝️ Priest",
                class: "🙏 Cleric",
                alignment: "⚖️ Lawful Good"
            }
        },
        {
            name: "Mikhail the Alchemist",
            stats: {
                knowledge: "+15%",
                research: "+25%",
                defense: "+10%",
                deathResistance: "+10%"
            },
            details: {
                occupation: "⚗️ Alchemist",
                class: "🔬 Scholar",
                alignment: "⚖️ Neutral"
            }
        },
        {
            name: "Nadia the Huntress",
            stats: {
                aim: "+30%",
                wilderness: "+15%",
                defense: "+10%",
                deathResistance: "-5%"
            },
            details: {
                occupation: "🏹 Huntress",
                class: "🌲 Survivalist",
                alignment: "⚖️ Neutral Good"
            }
        },
        {
            name: "Rasputin the Mystic",
            stats: {
                perception: "+35%",
                mysticism: "+20%",
                knowledge: "+10%",
                deathResistance: "+10%"
            },
            details: {
                occupation: "👁️ Oracle",
                class: "🧠 Seer",
                alignment: "⚖️ Chaotic Neutral"
            }
        }
    ];

    const modal = document.getElementById('characterModal');
    const closeBtn = document.querySelector('.close');
    const modalName = document.getElementById('modalName');
    const modalStats = document.getElementById('modalStats');
    const modalDetails = document.getElementById('modalDetails');

    // Create character cards
    const galleryGrid = document.querySelector('.gallery-grid');
    
    characters.forEach((character, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.name = character.name;
        card.innerHTML = `
            <div class="character-image-placeholder">
                <span class="emoji-placeholder">🤔</span>
                <div class="character-overlay">
                    <span class="character-name">${character.name}</span>
                    <span class="character-status">Click to view details</span>
                </div>
            </div>
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <div class="character-stats">
                    ${Object.entries(character.stats).map(([key, value]) => `
                        <div class="stat-item">
                            <span class="stat-icon">${getStatIcon(key)}</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="character-details">
                    ${Object.values(character.details).map(detail => 
                        `<span class="${detail.includes('🕊️') ? 'occupation' : detail.includes('🧙') || detail.includes('🏥') || detail.includes('🔮') ? 'class-badge' : 'alignment'}">${detail}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Add click event to open modal
        card.addEventListener('click', () => openModal(character, index));
        
        // Add mouse enter/leave effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        galleryGrid.appendChild(card);
    });

    // Helper function to get stat icons
    function getStatIcon(statName) {
        const icons = {
            plagueResistance: '🦠',
            faith: '🙏',
            combat: '⚔️',
            deathResistance: '💀',
            wealth: '💰',
            stealth: '🤫',
            healing: '🏥',
            knowledge: '📚',
            perception: '👁️',
            bloodlust: '🩸',
            aim: '🎯',
            wilderness: '🌲',
            mysticism: '🔮',
            research: '🔬',
            compassion: '💖',
            intellect: '🧠'
        };
        return icons[statName] || '📊';
    }

    // Modal functions
    function openModal(character, index) {
        modalName.textContent = character.name;
        modalStats.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                ${Object.entries(character.stats).map(([key, value]) => `
                    <div style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--border-gold);">
                        <div style="color: var(--accent-gold); font-weight: bold; margin-bottom: 5px;">${getStatIcon(key)} ${key}</div>
                        <div style="color: var(--text-primary);">${value}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        modalDetails.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                ${Object.values(character.details).map(detail => `
                    <span style="padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; ${
                        detail.includes('🕊️') ? 'background: rgba(139, 0, 0, 0.3); color: var(--accent-red); border: 1px solid var(--accent-red)' :
                        detail.includes('🧙') || detail.includes('🏥') || detail.includes('🔮') ? 'background: rgba(106, 13, 173, 0.3); color: var(--accent-purple); border: 1px solid var(--accent-purple)' :
                        'background: rgba(212, 160, 23, 0.3); color: var(--accent-gold); border: 1px solid var(--accent-gold)'
                    }">${detail}</span>
                `).join('')}
            </div>
            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
                ${getCharacterDescription(character.name)}
            </p>
        `;
        
        modal.style.display = 'block';
        modal.style.animation = 'none';
        setTimeout(() => modal.style.animation = 'fadeIn 0.3s ease', 10);
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // Character descriptions
    function getCharacterDescription(name) {
        const descriptions = {
            "Brother Malachite": "A devoted monk who has devoted his life to serving the divine. Despite the plague's ravages, his faith remains unshaken, offering solace to those in despair.",
            "Isolde the Grave Robber": "A cunning thief who has learned to survive in the darkest of times. Her knowledge of the dead and dying makes her both feared and respected.",
            "Lord Alistair Blackwood": "A noble lord who has lost much but retains his wealth and influence. His knights protect the last bastions of civilization.",
            "Seraphina the Plague Doctor": "The most renowned healer in the land, specializing in combating the plague. Her knowledge of medicine is both a blessing and a curse.",
            "Cassandra the Witch": "A mysterious sorceress who practices forbidden arts. Her powers are both feared and sought after by desperate survivors.",
            "Grimm the Berserker": "A warrior consumed by battlelust. His strength is unmatched, but his sanity hangs by a thread in this dark age.",
            "Elara the Seer": "A prophet who claims to see visions of the future. Her prophecies are cryptic but often prove accurate.",
            "Viktor the Bandit": "A ruthless outlaw who preys on the weak. His skills with a bow are legendary among those who have survived encounters with him.",
            "Father Benedict": "A gentle priest who brings comfort to the dying. His compassion is both his strength and his weakness.",
            "Mikhail the Alchemist": "A scholar obsessed with understanding the plague. His experiments walk the line between science and sorcery.",
            "Nadia the Huntress": "An expert tracker who knows the wilderness like the back of her hand. She provides food and protection for those who can pay.",
            "Rasputin the Mystic": "An enigmatic figure with deep connections to the spiritual realm. His insights into the plague are unsettlingly accurate."
        };
        return descriptions[name] || "A survivor in a world ravaged by the Black Death.";
    }

    // Close modal when clicking X
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Add fade-in animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Add subtle entrance animations for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all character cards
    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });

    // Add periodic subtle animations to emojis
    setInterval(() => {
        const emojis = document.querySelectorAll('.emoji-placeholder');
        emojis.forEach(emoji => {
            if (Math.random() > 0.8) {
                emoji.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    emoji.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }, 3000);
});