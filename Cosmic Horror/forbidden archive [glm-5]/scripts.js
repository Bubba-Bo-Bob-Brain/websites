const archiveState = {
    sanity: 100,
    corruption: 0,
    visitedSections: new Set(),
    searchCount: 0,
    lastScrollY: 0,
    whispers: [
        "You were never meant to find this place.",
        "The text knows you're reading it.",
        "Some knowledge has weight.",
        "They can see you through the words.",
        "The stars remember what they saw.",
        "Your name has been recorded.",
        "The archive has been waiting for you.",
        "Understanding is the first step toward becoming.",
        "The void recognizes your curiosity.",
        "Close the page. It's not too late. It was never too late."
    ],
    glitchTexts: [
        "THEY SEE",
        "IT KNOWS",
        "TOO LATE",
        "YOU READ",
        "IT WAITS",
        "REMEMBER",
        "THE VOID",
        "BEFORE"
    ],
    disturbingResults: [
        {
            id: "RESULT-???",
            title: "Your True Name",
            excerpt: "We found it. We know what you are called in the language that predates light. Would you like to know?",
            relevance: "ABSOLUTE"
        },
        {
            id: "RESULT-∞",
            title: "What Watches From Behind",
            excerpt: "It has always been there. You have never turned around fast enough. You will never turn around fast enough.",
            relevance: "IMMEDIATE"
        },
        {
            id: "RESULT-NOW",
            title: "The Door That Opened",
            excerpt: "You opened it by searching. The search was the key. The key was always in your mind.",
            relevance: "ALREADY HAPPENED"
        },
        {
            id: "RESULT-END",
            title: "The Last Thing You Will See",
            excerpt: "We could tell you. But then you would see it. And then you would be ready. And then it would come.",
            relevance: "INEVITABLE"
        }
    ]
};

const sanityBar = document.getElementById('sanityFill');
const sanityValue = document.getElementById('sanityValue');
const sanityWarning = document.getElementById('sanityWarning');
const sanityCorruption = document.getElementById('sanityCorruption');
const corruptionMeter = document.getElementById('corruptionMeter');
const corruptionLevel = document.getElementById('corruptionLevel');
const corruptionWarning = document.getElementById('corruptionWarning');
const corruptionLayer = document.querySelector('.corruption-layer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchStatus = document.getElementById('searchStatus');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.getElementById('searchSuggestions');
const whisperOverlay = document.getElementById('whisperOverlay');
const whisperText = document.getElementById('whisperText');
const glitchOverlay = document.getElementById('glitchOverlay');
const glitchText = document.getElementById('glitchText');
const cursorTendril = document.getElementById('cursorTendril');
const entryCount = document.getElementById('entryCount');
const visitorCount = document.getElementById('visitorCount');

let whisperTimeout = null;
let glitchTimeout = null;

function updateSanity(amount) {
    archiveState.sanity = Math.max(0, Math.min(100, archiveState.sanity + amount));
    archiveState.corruption = 100 - archiveState.sanity;
    
    document.documentElement.style.setProperty('--sanity-degradation', archiveState.sanity + '%');
    
    if (sanityBar) {
        sanityBar.style.width = archiveState.sanity + '%';
        
        if (archiveState.sanity <= 30) {
            sanityBar.style.background = 'linear-gradient(90deg, #8b0000, #6b2d2d)';
        } else if (archiveState.sanity <= 60) {
            sanityBar.style.background = 'linear-gradient(90deg, #6b2d2d, #4a7c59)';
        }
    }
    
    if (sanityValue) {
        sanityValue.textContent = archiveState.sanity + '%';
        sanityValue.classList.remove('degraded', 'critical');
        
        if (archiveState.sanity <= 30) {
            sanityValue.classList.add('critical');
        } else if (archiveState.sanity <= 60) {
            sanityValue.classList.add('degraded');
        }
    }
    
    if (sanityWarning) {
        if (archiveState.sanity <= 50) {
            sanityWarning.classList.add('active');
        } else {
            sanityWarning.classList.remove('active');
        }
    }
    
    if (sanityCorruption && sanityCorruption.parentElement) {
        if (archiveState.sanity <= 70) {
            sanityCorruption.parentElement.classList.add('degraded');
        }
    }
    
    if (corruptionMeter) {
        corruptionMeter.style.width = archiveState.corruption + '%';
    }
    
    if (corruptionLevel) {
        corruptionLevel.textContent = archiveState.corruption + '%';
    }
    
    if (corruptionWarning) {
        if (archiveState.corruption >= 70) {
            corruptionWarning.textContent = "You have seen too much. The archive knows your shape now.";
        } else if (archiveState.corruption >= 40) {
            corruptionWarning.textContent = "The texts you have read are reading you in return.";
        } else if (archiveState.corruption >= 20) {
            corruptionWarning.textContent = "Continue reading at your own risk. The archive is not responsible for what you become.";
        }
    }
    
    if (corruptionLayer) {
        if (archiveState.corruption >= 30) {
            corruptionLayer.classList.add('active');
        }
    }
    
    if (archiveState.corruption >= 50) {
        document.body.classList.add('high-corruption');
    }
    
    if (archiveState.corruption >= 70) {
        entryCount.textContent = 'TOO MANY';
        entryCount.classList.add('corrupted');
    }
    
    if (archiveState.corruption >= 80) {
        visitorCount.textContent = 'YOU ARE NOT ALONE';
        visitorCount.classList.add('corrupted');
    }
}

function showWhisper(text) {
    if (whisperTimeout) {
        clearTimeout(whisperTimeout);
    }
    
    if (whisperOverlay && whisperText) {
        whisperText.textContent = text;
        whisperOverlay.classList.add('active');
        
        whisperTimeout = setTimeout(() => {
            whisperOverlay.classList.remove('active');
        }, 3500);
    }
}

function triggerGlitch(text) {
    if (glitchTimeout) {
        clearTimeout(glitchTimeout);
    }
    
    if (glitchOverlay && glitchText) {
        glitchText.textContent = text;
        glitchOverlay.classList.add('active');
        
        glitchTimeout = setTimeout(() => {
            glitchOverlay.classList.remove('active');
        }, 300);
    }
}

function corruptText(element) {
    const originalText = element.textContent;
    const corruptionChars = '̷̴̵̶̸̡̢̧̨̛̖̗̘̙̜̝̞̟̠̣̤̥̦̩̪̫̬̭̮̰̲̳̹͔͖͕͗͆̿̾̽̿̾̿̀́̂̃̄̈́͆̈́̅̿̀́̈́̈́͆';
    
    let corruptedText = '';
    for (let i = 0; i < originalText.length; i++) {
        if (Math.random() > 0.7 && originalText[i] !== ' ') {
            corruptedText += corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
        } else {
            corruptedText += originalText[i];
        }
    }
    
    element.textContent = corruptedText;
    
    setTimeout(() => {
        element.textContent = originalText;
    }, 500 + Math.random() * 1000);
}

function handleScroll() {
    const scrollY = window.scrollY;
    const scrollDelta = Math.abs(scrollY - archiveState.lastScrollY);
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / documentHeight;
    
    if (scrollDelta > 50) {
        const sanityLoss = Math.floor(scrollDelta / 30);
        updateSanity(-sanityLoss);
    }
    
    if (scrollPercent > 0.3 && Math.random() > 0.95) {
        const randomWhisper = archiveState.whispers[Math.floor(Math.random() * archiveState.whispers.length)];
        showWhisper(randomWhisper);
    }
    
    if (scrollPercent > 0.5 && Math.random() > 0.97) {
        const randomGlitch = archiveState.glitchTexts[Math.floor(Math.random() * archiveState.glitchTexts.length)];
        triggerGlitch(randomGlitch);
    }
    
    if (scrollPercent > 0.7) {
        const corruptibleElements = document.querySelectorAll('[data-corrupt="true"]');
        if (corruptibleElements.length > 0 && Math.random() > 0.9) {
            const randomElement = corruptibleElements[Math.floor(Math.random() * corruptibleElements.length)];
            corruptText(randomElement);
        }
    }
    
    archiveState.lastScrollY = scrollY;
}

function performSearch(query) {
    if (!query || query.trim() === '') {
        return;
    }
    
    archiveState.searchCount++;
    
    if (searchStatus) {
        searchStatus.textContent = 'SEARCHING...';
        searchStatus.classList.add('searching');
    }
    
    updateSanity(-5);
    
    setTimeout(() => {
        if (searchStatus) {
            searchStatus.classList.remove('searching');
            searchStatus.classList.add('corrupted');
            searchStatus.textContent = 'RESULTS FOUND';
        }
        
        let resultsHTML = '';
        
        if (archiveState.searchCount <= 2) {
            const normalResults = [
                {
                    id: 'TX-' + Math.floor(Math.random() * 100),
                    title: 'Fragmentary Text ' + Math.floor(Math.random() * 50),
                    excerpt: 'A partially preserved manuscript containing references to "' + query + '". The text appears to be incomplete...',
                    relevance: 'HIGH'
                },
                {
                    id: 'SC-' + Math.floor(Math.random() * 50),
                    title: 'Stellar Chart Reference',
                    excerpt: 'Cartographic notation mentioning "' + query + '" in the context of extinct celestial bodies.',
                    relevance: 'MODERATE'
                }
            ];
            
            normalResults.forEach((result, index) => {
                resultsHTML += createResultHTML(result, index);
            });
        } else if (archiveState.searchCount === 3) {
            const unsettlingResult = {
                id: 'WT-???',
                title: 'Testimony Regarding "' + query + '"',
                excerpt: 'We found someone who searched for the same thing. They stopped searching eventually. They stopped doing many things eventually.',
                relevance: 'PERSONAL'
            };
            resultsHTML = createResultHTML(unsettlingResult, 0);
            
            setTimeout(() => {
                showWhisper("Someone else searched for that. They are no longer searching.");
            }, 1000);
        } else {
            const disturbingIndex = Math.min(archiveState.searchCount - 4, archiveState.disturbingResults.length - 1);
            const disturbingResult = archiveState.disturbingResults[disturbingIndex];
            disturbingResult.title = disturbingResult.title;
            
            resultsHTML = createDisturbingResultHTML(disturbingResult);
            
            updateSanity(-15);
            
            setTimeout(() => {
                triggerGlitch("FOUND YOU");
            }, 500);
            
            setTimeout(() => {
                const whisperIndex = Math.min(archiveState.searchCount - 4, archiveState.whispers.length - 1);
                showWhisper(archiveState.whispers[whisperIndex + 3]);
            }, 1500);
        }
        
        if (searchResults) {
            searchResults.innerHTML = resultsHTML;
        }
        
    }, 800 + Math.random() * 1200);
}

function createResultHTML(result, index) {
    return `
        <div class="result-item" style="animation-delay: ${index * 0.1}s">
            <div class="result-header">
                <span class="result-id">${result.id}</span>
                <span class="result-relevance">RELEVANCE: ${result.relevance}</span>
            </div>
            <h4 class="result-title">${result.title}</h4>
            <p class="result-excerpt">${result.excerpt}</p>
        </div>
    `;
}

function createDisturbingResultHTML(result) {
    return `
        <div class="result-item disturbing" style="animation-delay: 0s">
            <div class="result-header">
                <span class="result-id">${result.id}</span>
                <span class="result-relevance">${result.relevance}</span>
            </div>
            <h4 class="result-title corrupted">${result.title}</h4>
            <p class="result-excerpt disturbing">${result.excerpt}</p>
        </div>
    `;
}

function setupCorruptibleElements() {
    const corruptibleElements = document.querySelectorAll('[data-corrupt="true"]');
    
    corruptibleElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (Math.random() > 0.5) {
                corruptText(element);
                updateSanity(-2);
            }
        });
    });
}

function setupSearchFunctionality() {
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 5 && Math.random() > 0.9) {
                updateSanity(-1);
            }
        });
    }
    
    if (searchSuggestions) {
        const suggestionTags = searchSuggestions.querySelectorAll('.suggestion-tag');
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.getAttribute('data-query');
                if (query && searchInput) {
                    searchInput.value = query;
                    performSearch(query);
                    updateSanity(-3);
                }
            });
        });
    }
}

function setupScrollTracking() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function setupCursorTendril() {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTendril() {
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        
        currentX += dx * 0.1;
        currentY += dy * 0.1;
        
        if (cursorTendril) {
            cursorTendril.style.left = currentX + 'px';
            cursorTendril.style.top = currentY + 'px';
            
            if (archiveState.corruption >= 20) {
                cursorTendril.classList.add('active');
            }
        }
        
        requestAnimationFrame(animateTendril);
    }
    
    animateTendril();
}

function setupSectionTracking() {
    const sections = document.querySelectorAll('.catalog-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                if (!archiveState.visitedSections.has(sectionId)) {
                    archiveState.visitedSections.add(sectionId);
                    updateSanity(-5);
                    
                    if (archiveState.visitedSections.size >= 3) {
                        showWhisper("You have explored all sections. The archive has explored you in return.");
                    }
                }
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.catalog-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            updateSanity(-3);
            
            if (Math.random() > 0.7) {
                const glitchIndex = Math.floor(Math.random() * archiveState.glitchTexts.length);
                triggerGlitch(archiveState.glitchTexts[glitchIndex]);
            }
        });
        
        const actionButton = card.querySelector('.card-action');
        if (actionButton) {
            actionButton.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const originalText = actionButton.textContent;
                actionButton.textContent = 'ACCESS DENIED';
                actionButton.style.borderColor = '#8b0000';
                actionButton.style.color = '#8b0000';
                
                updateSanity(-5);
                
                setTimeout(() => {
                    actionButton.textContent = originalText;
                    actionButton.style.borderColor = '';
                    actionButton.style.color = '';
                }, 2000);
                
                showWhisper("Some knowledge is protected for your own safety.");
            });
        }
    });
}

function setupTestimonyInteractions() {
    const testimonies = document.querySelectorAll('.testimony-card');
    
    testimonies.forEach(testimony => {
        testimony.addEventListener('mouseenter', () => {
            updateSanity(-2);
        });
        
        const quoteText = testimony.querySelector('.quote-text');
        if (quoteText) {
            quoteText.addEventListener('click', () => {
                corruptText(quoteText);
                updateSanity(-5);
            });
        }
    });
}

function initializePeriodicEffects() {
    setInterval(() => {
        if (archiveState.corruption >= 30 && Math.random() > 0.8) {
            const randomWhisper = archiveState.whispers[Math.floor(Math.random() * archiveState.whispers.length)];
            showWhisper(randomWhisper);
        }
    }, 15000);
    
    setInterval(() => {
        if (archiveState.corruption >= 50 && Math.random() > 0.7) {
            const randomGlitch = archiveState.glitchTexts[Math.floor(Math.random() * archiveState.glitchTexts.length)];
            triggerGlitch(randomGlitch);
        }
    }, 20000);
    
    setInterval(() => {
        if (archiveState.corruption >= 40) {
            const statusValues = document.querySelectorAll('.status-value');
            statusValues.forEach(value => {
                if (Math.random() > 0.5) {
                    value.classList.add('corrupted');
                    setTimeout(() => {
                        value.classList.remove('corrupted');
                    }, 2000);
                }
            });
        }
    }, 10000);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            showWhisper("There is no escape from knowledge once learned.");
            updateSanity(-3);
        }
        
        if (e.key === '?' && archiveState.corruption >= 60) {
            showWhisper("Questions only lead to more questions. The archive has infinite patience.");
        }
    });
}

function initializeArchive() {
    console.log('The Archive initializes. Your presence has been noted.');
    
    setupScrollTracking();
    setupCorruptibleElements();
    setupSearchFunctionality();
    setupCursorTendril();
    setupSectionTracking();
    setupCardInteractions();
    setupTestimonyInteractions();
    setupKeyboardShortcuts();
    initializePeriodicEffects();
    
    setTimeout(() => {
        showWhisper("Welcome to the Archive. We have been expecting you.");
    }, 2000);
    
    setTimeout(() => {
        updateSanity(-2);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initializeArchive);