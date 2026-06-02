document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // ELDRITCH ARCHIVE - JAVASCRIPT
    // ============================================
    
    // State
    let currentSanity = 100;
    let scrollDepth = 0;
    let corruptionLevel = 0;
    let isSearchCorrupted = false;
    let glitchInterval;
    let tentacleInterval;
    
    // DOM Elements
    const sanityFill = document.querySelector('.sanity-fill');
    const sanityValue = document.querySelector('.sanity-value');
    const sanityCracks = document.querySelector('.sanity-cracks');
    const searchInput = document.querySelector('.cosmic-search');
    const archiveItems = document.querySelectorAll('.archive-item');
    const navButtons = document.querySelectorAll('.nav-button');
    const titleElements = document.querySelectorAll('.item-title');
    const previewElements = document.querySelectorAll('.item-preview');
    const realityRipple = document.querySelector('.reality-ripple');
    const dimensionalTear = document.querySelector('.dimensional-tear');
    const footerAnomalyCount = document.querySelector('.anomaly-count');
    
    // ============================================
    // SANITY METER SYSTEM
    // ============================================
    function initSanityMeter() {
        // Update sanity based on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollDepth = scrollTop / scrollHeight;
            
            // Decrease sanity as user scrolls (faster after 50% scroll)
            let sanityLoss = scrollDepth * 60; // Max 60% loss from scrolling
            if (scrollDepth > 0.7) sanityLoss += (scrollDepth - 0.7) * 100; // Accelerated loss in deep zones
            
            currentSanity = Math.max(0, 100 - sanityLoss);
            updateSanityDisplay();
            
            // Trigger effects based on sanity level
            if (currentSanity < 30 && !glitchInterval) {
                startGlitchEffects();
            }
            if (currentSanity < 10) {
                triggerExtremeDistortion();
            }
        });
        
        // Initial update
        updateSanityDisplay();
    }
    
    function updateSanityDisplay() {
        // Update bar width
        sanityFill.style.width = `${currentSanity}%`;
        
        // Update text
        sanityValue.textContent = `${Math.round(currentSanity)}%`;
        
        // Change color based on level
        if (currentSanity > 50) {
            sanityFill.style.background = 'linear-gradient(90deg, #00ff88 0%, #00ffff 50%, #00ff88 100%)';
            sanityValue.style.color = '#00ff88';
        } else if (currentSanity > 20) {
            sanityFill.style.background = 'linear-gradient(90deg, #ffaa00 0%, #ff6600 50%, #ffaa00 100%)';
            sanityValue.style.color = '#ffaa00';
        } else {
            sanityFill.style.background = 'linear-gradient(90deg, #ff0000 0%, #8b0000 50%, #ff0000 100%)';
            sanityValue.style.color = '#ff0000';
        }
        
        // Show cracks when sanity is critically low
        if (currentSanity < 25) {
            sanityCracks.style.opacity = (25 - currentSanity) / 25 * 0.8;
        } else {
            sanityCracks.style.opacity = 0;
        }
        
        // Update anomaly count (decreases as sanity drops)
        const baseAnomalies = 47;
        const currentAnomalies = Math.max(1, Math.round(baseAnomalies * (currentSanity / 100)));
        footerAnomalyCount.textContent = currentAnomalies;
    }
    
    // ============================================
    // TEXT CORRUPTION SYSTEM
    // ============================================
    function initTextCorruption() {
        // Title corruption on hover
        titleElements.forEach(title => {
            const originalText = title.querySelector('.title-original').textContent;
            const corruptText = title.getAttribute('data-corrupt') || originalText;
            
            title.addEventListener('mouseenter', () => {
                if (Math.random() > 0.3) { // 70% chance to corrupt
                    title.querySelector('.title-original').textContent = corruptText;
                    title.classList.add('corrupted');
                    
                    // Random glitch effect
                    if (Math.random() > 0.7) {
                        title.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                    }
                }
            });
            
            title.addEventListener('mouseleave', () => {
                title.querySelector('.title-original').textContent = originalText;
                title.classList.remove('corrupted');
                title.style.transform = '';
            });
        });
        
        // Preview text corruption
        previewElements.forEach(preview => {
            const fullText = preview.getAttribute('data-full');
            const partialText = preview.textContent;
            
            preview.addEventListener('mouseenter', () => {
                if (currentSanity < 70 && fullText) {
                    // Show more of the full text as sanity decreases
                    const revealLength = Math.floor(fullText.length * (1 - currentSanity/100));
                    preview.textContent = fullText.substring(0, revealLength) + '...';
                    preview.style.color = '#ff3366';
                }
            });
            
            preview.addEventListener('mouseleave', () => {
                preview.textContent = partialText;
                preview.style.color = '';
            });
        });
        
        // Random text corruption based on scroll depth
        window.addEventListener('scroll', () => {
            if (Math.random() < scrollDepth * 0.1) { // Chance increases with scroll
                corruptRandomText();
            }
        });
    }
    
    function corruptRandomText() {
        const allTexts = document.querySelectorAll('.item-title .title-original, .item-preview, .testimony-text');
        const randomText = allTexts[Math.floor(Math.random() * allTexts.length)];
        
        if (randomText && !randomText.matches(':hover')) {
            const original = randomText.textContent;
            const corrupted = scrambleText(original, 0.1);
            
            // Flash corrupted text
            randomText.style.opacity = '0.5';
            randomText.textContent = corrupted;
            
            setTimeout(() => {
                randomText.style.opacity = '1';
                randomText.textContent = original;
            }, 100);
        }
    }
    
    function scrambleText(text, intensity) {
        const chars = '�∞∑∏√≈≠≤≥±⊂⊃⊆⊇∈∉∩∪∖∆∇√∞∝∂∫∼∧∨¬∠∡∢∘√≅▽◆◇○●◐◑◒◓◔◕♠♣♥♦♪♫☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☔☕☖☗☘☙☚☛☜☝☞☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☮☯☰☱☲☳☴☵☶☷☸☹☺☻☼☽☾☿♀♁♂♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓♔♕♖♗♘♙♚♛♜♝♞♟♠♡♢♣♤♥♦♧♨♩♪♫♬♭♮♯♰♱♲♳♴♵♶♷♸♹♺♻♼♽♾♿⚀⚁⚂⚃⚄⚅⚆⚇⚈⚉⚊⚋⚌⚍⚎⚏⚐⚑⚒⚓⚔⚕⚖⚗⚘⚙⚚⚛⚜⚝⚞⚟⚠⚡⚢⚣⚤⚥⚦⚧⚨⚩⚪⚫⚬⚭⚮⚯⚰⚱⚲⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚽⚾⚿⛀⛁⛂⛃⛄⛅⛆⛇⛈⛉⛊⛋⛌⛍⛎⛏⛐⛑⛒⛓⛔⛕⛖⛗⛘⛙⛚⛛⛜⛝⛞⛟⛠⛡⛢⛣⛤⛥⛦⛧⛨⛩⛪⛫⛬⛭⛮⛯⛰⛱⛲⛳⛴⛵⛶⛷⛸⛹⛺⛻⛼⛽⛾⛿✀✁✂✃✄✅✆✇✈✉✊✋✌✍✎✏✐✑✒✓✔✕✖✗✘✙✚✛✜✝✞✟✠✡✢✣✤✥✦✧✨✩✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋❌❍❎❏❐❑❒❓❔❕❖❗❘❙❚❛❜❝❞❟❠❡❢❣❤❥❦❧❶❷❸❹❺❻❼❽❾❿ⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾⓿─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳╴╵╶╷╸╹╺╻╼╽╾╿▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯◰◱◲◳◴◵◶◷◸◹◺◻◼◽◾◿';
        const charsArray = chars.split('');
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < intensity) {
                result += charsArray[Math.floor(Math.random() * charsArray.length)];
            } else {
                result += text[i];
            }
        }
        return result;
    }
    
    // ============================================
    // SEARCH SYSTEM
    // ============================================
    function initSearch() {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.toLowerCase().trim();
            
            // Increase corruption as user types
            corruptionLevel = Math.min(1, query.length / 20);
            isSearchCorrupted = corruptionLevel > 0.3;
            
            // Corrupt search placeholder after certain length
            if (query.length > 10) {
                const placeholders = [
                    'Search the unsearchable...',
                    'Search the unknowable...',
                    'Search the forbidden...',
                    'Search while you still can...',
                    'Search. It\'s already watching.',
                    'Search. It knows what you seek.',
                    'Search. Reality thinning...'
                ];
                searchInput.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
                
                // Corrupt input text occasionally
                if (Math.random() < corruptionLevel) {
                    const cursorPos = searchInput.selectionStart;
                    const currentValue = searchInput.value;
                    const corrupted = scrambleText(currentValue, 0.05);
                    searchInput.value = corrupted;
                    searchInput.setSelectionRange(cursorPos, cursorPos);
                }
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Corrupt search on focus after delay
        searchInput.addEventListener('focus', () => {
            setTimeout(() => {
                if (searchInput.value.length > 5 && Math.random() < 0.2) {
                    searchInput.style.boxShadow = '0 0 30px rgba(255, 0, 102, 0.4)';
                }
            }, 2000);
        });
    }
    
    function performSearch(query) {
        if (!query) {
            // Show all items
            archiveItems.forEach(item => {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            });
            return;
        }
        
        let matchCount = 0;
        
        archiveItems.forEach(item => {
            const title = item.querySelector('.item-title .title-original').textContent.toLowerCase();
            const preview = item.querySelector('.item-preview').textContent.toLowerCase();
            const type = item.getAttribute('data-type').toLowerCase();
            const classification = item.querySelector('.item-classification').textContent.toLowerCase();
            
            // Basic matching
            const matches = title.includes(query) || 
                           preview.includes(query) || 
                           type.includes(query) ||
                           classification.includes(query);
            
            if (matches) {
                item.style.display = 'block';
                matchCount++;
                
                // Corrupt matching items based on query length
                if (query.length > 8) {
                    corruptSearchResult(item, query);
                }
                
                // Fade in with staggered delay
                const delay = matchCount * 50;
                setTimeout(() => {
                    item.style.opacity = '1';
                }, delay);
            } else {
                item.style.display = 'none';
            }
        });
        
        // If no matches, show disturbing "false positive" items
        if (matchCount === 0 && query.length > 3) {
            showFalsePositives(query);
        }
    }
    
    function corruptSearchResult(item, query) {
        // Randomly corrupt the title
        const title = item.querySelector('.item-title .title-original');
        const original = title.textContent;
        if (Math.random() < corruptionLevel) {
            title.textContent = scrambleText(original, 0.1);
            title.style.color = '#ff3366';
            
            // Reset after delay
            setTimeout(() => {
                title.textContent = original;
                title.style.color = '';
            }, 2000);
        }
        
        // Add visual distortion to item
        item.style.transform = `perspective(1000px) rotateX(${Math.random() * 4 - 2}deg) rotateY(${Math.random() * 4 - 2}deg)`;
        item.style.boxShadow = `0 0 ${10 + Math.random() * 20}px rgba(255, 0, 255, 0.3)`;
        
        // Reset after delay
        setTimeout(() => {
            item.style.transform = '';
            item.style.boxShadow = '';
        }, 1000);
    }
    
    function showFalsePositives(query) {
        // Show random items anyway, claiming they match
        const randomItems = Array.from(archiveItems).sort(() => 0.5 - Math.random()).slice(0, 3);
        
        randomItems.forEach((item, index) => {
            item.style.display = 'block';
            item.style.opacity = '0';
            
            // Add "false positive" indicator
            const meta = item.querySelector('.item-meta') || item;
            const originalMeta = meta.innerHTML;
            meta.innerHTML = `<span style="color: #ff3366; font-weight: bold;">[PROBABLE MATCH: ${query.toUpperCase()}]</span> ` + originalMeta;
            
            setTimeout(() => {
                item.style.opacity = '0.3'; // Dim them
            }, index * 200);
        });
        
        // After 3 seconds, hide the false positives
        setTimeout(() => {
            randomItems.forEach(item => {
                item.style.display = 'none';
                item.style.opacity = '';
                const meta = item.querySelector('.item-meta');
                if (meta && meta.innerHTML.includes('PROBABLE MATCH')) {
                    // Restore original meta (would need to store it, but for now just hide)
                }
            });
        }, 3000);
    }
    
    // ============================================
    // GLITCH EFFECTS
    // ============================================
    function startGlitchEffects() {
        glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) {
                triggerGlitch();
            }
        }, 2000);
    }
    
    function triggerGlitch(intensity = 0.5) {
        const glitchTypes = ['screen', 'text', 'color', 'distortion'];
        const type = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        
        switch(type) {
            case 'screen':
                glitchScreen();
                break;
            case 'text':
                glitchAllText();
                break;
            case 'color':
                invertColors();
                break;
            case 'distortion':
                distortElements();
                break;
        }
    }
    
    function glitchScreen() {
        // Create a temporary glitch overlay
        const glitch = document.createElement('div');
        glitch.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1),
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 99999;
            opacity: 0.8;
            animation: glitchFlicker 0.1s infinite;
        `;
        document.body.appendChild(glitch);
        
        // Add keyframes if not exists
        if (!document.getElementById('glitch-keyframes')) {
            const style = document.createElement('style');
            style.id = 'glitch-keyframes';
            style.textContent = `
                @keyframes glitchFlicker {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => glitch.remove(), 200);
    }
    
    function glitchAllText() {
        const allTextNodes = document.querySelectorAll('p, h1, h2, h3, span, div');
        const randomText = allTextNodes[Math.floor(Math.random() * allTextNodes.length)];
        
        if (randomText && randomText.textContent.length > 3) {
            const original = randomText.textContent;
            randomText.textContent = scrambleText(original, 0.15);
            randomText.style.color = '#ff3366';
            
            setTimeout(() => {
                randomText.textContent = original;
                randomText.style.color = '';
            }, 300);
        }
    }
    
    function invertColors() {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 50);
    }
    
    function distortElements() {
        const items = document.querySelectorAll('.archive-item');
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        randomItem.style.transform = `perspective(1000px) rotateX(${Math.random() * 10 - 5}deg) rotateY(${Math.random() * 10 - 5}deg) scale(${0.95 + Math.random() * 0.1})`;
        randomItem.style.filter = 'blur(1px)';
        
        setTimeout(() => {
            randomItem.style.transform = '';
            randomItem.style.filter = '';
        }, 300);
    }
    
    function triggerExtremeDistortion() {
        // When sanity is very low, trigger multiple effects
        for (let i = 0; i < 5; i++) {
            setTimeout(() => triggerGlitch(0.8), i * 100);
        }
        
        // Add a permanent crack to sanity bar
        sanityCracks.style.background = `
            repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                rgba(139, 0, 0, 0.3) 5px,
                rgba(139, 0, 0, 0.3) 10px
            )
        `;
    }
    
    // ============================================
    // TENTACLE DYNAMICS
    // ============================================
    function initTentacles() {
        const tendrils = document.querySelectorAll('.tendril');
        
        // Make tentacles follow mouse slightly
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            tendrils.forEach((tendril, index) => {
                const speed = 0.02 + index * 0.005;
                const xOffset = (mouseX - 0.5) * 100 * speed;
                const yOffset = (mouseY - 0.5) * 100 * speed;
                
                tendril.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${Math.random() * 10 - 5}deg)`;
            });
        });
        
        // Tentacles react to scroll depth
        window.addEventListener('scroll', () => {
            const intensity = scrollDepth;
            tendrils.forEach((tendril, index) => {
                if (Math.random() < intensity * 0.1) {
                    tendril.style.opacity = 0.2 + Math.random() * 0.4;
                    tendril.style.height = (parseFloat(tendril.style.height) || 2) + (Math.random() * 4 - 2) + 'px';
                }
            });
        });
    }
    
    // ============================================
    // ITEM INTERACTIONS
    // ============================================
    function initItemInteractions() {
        archiveItems.forEach(item => {
            // Click to show details (would need modal, but for now just intensify effects)
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const id = item.getAttribute('data-id');
                
                // Log interaction (in a real app, would open detail view)
                console.log(`Accessing artifact ${id} of type ${type} at sanity ${currentSanity}%`);
                
                // Sanity loss from viewing
                currentSanity = Math.max(0, currentSanity - 5);
                updateSanityDisplay();
                
                // Visual feedback
                item.style.borderColor = '#ff3366';
                item.style.boxShadow = '0 0 30px rgba(255, 51, 102, 0.5)';
                
                setTimeout(() => {
                    item.style.borderColor = '';
                    item.style.boxShadow = '';
                }, 1000);
            });
            
            // Hover effect: reveal full preview based on sanity
            item.addEventListener('mouseenter', () => {
                const preview = item.querySelector('.item-preview');
                const fullText = preview.getAttribute('data-full');
                if (fullText && currentSanity < 80) {
                    // Gradually reveal more as sanity drops
                    const revealPercent = 1 - (currentSanity / 100);
                    const revealLength = Math.floor(fullText.length * revealPercent);
                    preview.textContent = fullText.substring(0, revealLength) + (revealLength < fullText.length ? '...' : '');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const preview = item.querySelector('.item-preview');
                const partialText = preview.getAttribute('data-full').substring(0, 150) + '...';
                preview.textContent = partialText;
            });
        });
    }
    
    // ============================================
    // NAVIGATION FILTERING
    // ============================================
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            archiveItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-type') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Slight sanity fluctuation when changing filters
            currentSanity = Math.max(0, currentSanity - 2);
            updateSanityDisplay();
        });
    });
    
    // ============================================
    // REALITY DISTORTION ON SCROLL
    // ============================================
    let lastScrollY = window.pageYOffset;
    let scrollVelocity = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        scrollVelocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;
        
        // Apply subtle distortion based on scroll velocity
        if (scrollVelocity > 50) {
            const distortion = Math.min(2, scrollVelocity / 100);
            document.querySelector('.non-euclidean-grid').style.transform = 
                `perspective(1000px) rotateX(${2 + distortion}deg) rotateZ(${Math.random() * 2 - 1}deg)`;
            
            // Reset after delay
            setTimeout(() => {
                document.querySelector('.non-euclidean-grid').style.transform = 
                    'perspective(1000px) rotateX(2deg)';
            }, 300);
        }
        
        // Update reality ripple position
        if (realityRipple) {
            realityRipple.style.setProperty('--x', `${(currentScrollY / 10) % 100}%`);
            realityRipple.style.setProperty('--y', `${(currentScrollY / 7) % 100}%`);
        }
    });
    
    // ============================================
    // RANDOM EVENTS
    // ============================================
    // Occasionally increment anomaly count
    setInterval(() => {
        if (Math.random() < 0.1) {
            const current = parseInt(footerAnomalyCount.textContent);
            const change = Math.random() > 0.7 ? 1 : -1;
            const newValue = Math.max(1, current + change);
            footerAnomalyCount.textContent = newValue;
            
            // Flash effect
            footerAnomalyCount.style.color = '#ff3366';
            setTimeout(() => {
                footerAnomalyCount.style.color = '';
            }, 200);
        }
    }, 5000);
    
    // Random dimensional tear expansion
    setInterval(() => {
        if (dimensionalTear && Math.random() < 0.2) {
            const currentSize = Math.random() * 200 + 100;
            dimensionalTear.style.width = `${currentSize}px`;
            dimensionalTear.style.height = `${currentSize}px`;
            
            setTimeout(() => {
                dimensionalTear.style.width = '0';
                dimensionalTear.style.height = '0';
            }, 300);
        }
    }, 8000);
    
    // ============================================
    // KEYBOARD SHORTCUTS (Easter Eggs)
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Press 'R' for reality shift (if sanity > 10)
        if (e.key.toLowerCase() === 'r' && currentSanity > 10) {
            currentSanity -= 15;
            updateSanityDisplay();
            triggerGlitch(0.9);
            
            // Visual feedback
            document.body.style.filter = 'hue-rotate(90deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 300);
        }
        
        // Press 'C' for corruption surge
        if (e.key.toLowerCase() === 'c') {
            corruptionLevel = Math.min(1, corruptionLevel + 0.2);
            for (let i = 0; i < 10; i++) {
                setTimeout(() => corruptRandomText(), i * 100);
            }
        }
    });
    
    // ============================================
    // INITIALIZATION COMPLETE
    // ============================================
    console.log('%c THE NAMELESS ARCHIVE ', 
        'background: #0a0014; color: #ff00ff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c WARNING: Cognitive hazards detected. Proceed with caution. ',
        'color: #ff3366; font-style: italic;');
    
    // Initial sanity animation
    setTimeout(() => {
        let targetSanity = 85; // Start slightly degraded
        const animate = () => {
            if (currentSanity > targetSanity) {
                currentSanity -= 0.5;
                updateSanityDisplay();
                requestAnimationFrame(animate);
            }
        };
        animate();
    }, 3000);
});