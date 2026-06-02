/* NEXUS://UNDERGROUND - Cyberpunk Social Network Feed Scripts */

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initTraceWarning();
    initDataStream();
    initCounters();
    initFeedFilters();
    initEncryptedMessages();
    initGlitchAvatars();
    initHoverEffects();
    initCopyButtons();
    initSearchInput();
    initNavHighlight();
    initThreatSimulation();
    initPostInteractions();
    initComposeBox();
    initAnimations();
    console.log('[NEXUS://UNDERGROUND] System initialized successfully');
}

function initTraceWarning() {
    var traceBtn = document.querySelector('.trace-btn');
    if (traceBtn) {
        traceBtn.addEventListener('click', triggerTrace);
    }
    setInterval(function() {
        if (Math.random() > 0.998 && !window.traceActive) {
            triggerTrace();
        }
    }, 10000);
}

var traceActive = false;
var traceTimer = null;

function triggerTrace() {
    if (traceActive) return;
    traceActive = true;
    var traceWarning = document.getElementById('trace-warning');
    var traceTimerEl = document.getElementById('trace-timer');
    if (!traceWarning || !traceTimerEl) return;
    traceWarning.classList.remove('hidden');
    var seconds = 12;
    traceTimerEl.textContent = seconds;
    document.body.classList.add('shake');
    traceTimer = setInterval(function() {
        seconds--;
        traceTimerEl.textContent = seconds;
        if (seconds <= 0) {
            dismissTrace();
        }
    }, 1000);
}

function dismissTrace() {
    if (!traceActive) return;
    clearInterval(traceTimer);
    traceActive = false;
    var traceWarning = document.getElementById('trace-warning');
    if (traceWarning) {
        traceWarning.classList.add('hidden');
    }
    document.body.classList.remove('shake');
}

function initDataStream() {
    var streamElement = document.getElementById('data-stream');
    if (!streamElement) return;
    var chars = '01';
    var additionalChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    chars += additionalChars + '░▒▓█▓▒░';
    function generateStream() {
        var result = '';
        var length = 40 + Math.floor(Math.random() * 20);
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    function updateStream() {
        streamElement.textContent = generateStream();
        if (Math.random() > 0.9) {
            streamElement.style.color = '#ff0040';
            setTimeout(function() {
                streamElement.style.color = '#00ff9f';
            }, 100);
        }
    }
    updateStream();
    setInterval(updateStream, 200);
}

function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function(counter) {
        var target = parseInt(counter.dataset.count, 10);
        var duration = 2000;
        var startTime = performance.now();
        function animate(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easeOutQuart = 1 - Math.pow(1 - progress, 4);
            var current = Math.floor(easeOutQuart * target);
            counter.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(animate);
    });
}

function initFeedFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var filter = btn.dataset.filter;
            filterPosts(filter);
        });
    });
}

function filterPosts(filter) {
    var posts = document.querySelectorAll('.post-card');
    posts.forEach(function(post) {
        if (filter === 'all') {
            post.style.display = 'block';
            post.style.animation = 'none';
            post.offsetHeight;
            post.style.animation = 'fade-in-up 0.4s ease-out';
        } else {
            var postType = post.dataset.type;
            if (postType === filter) {
                post.style.display = 'block';
                post.style.animation = 'none';
                post.offsetHeight;
                post.style.animation = 'fade-in-up 0.4s ease-out';
            } else {
                post.style.display = 'none';
            }
        }
    });
}

function initEncryptedMessages() {
    var encryptedBlocks = document.querySelectorAll('.encrypted-block, .encrypted-post, .full-encrypted-message');
    encryptedBlocks.forEach(function(block) {
        block.addEventListener('mouseenter', function() {
            decryptContent(block);
        });
    });
}

var isDecrypting = false;

function decryptContent(block) {
    if (isDecrypting) return;
    isDecrypting = true;
    var fullContent = block.querySelector('.encrypted-full, .message-decrypted, .decrypted-content');
    if (!fullContent) {
        isDecrypting = false;
        return;
    }
    if (fullContent.classList.contains('message-decrypted')) {
        var content = fullContent.querySelector('.decrypted-content');
        if (content) {
            setTimeout(function() {
                content.classList.remove('hidden');
                isDecrypting = false;
            }, 1500);
        }
    } else {
        fullContent.classList.remove('hidden');
        setTimeout(function() {
            isDecrypting = false;
        }, 500);
    }
}

function initGlitchAvatars() {
    var glitchAvatars = document.querySelectorAll('.glitch-avatar');
    glitchAvatars.forEach(function(avatar) {
        avatar.addEventListener('mouseenter', function() {
            avatar.classList.add('glitching');
        });
        avatar.addEventListener('mouseleave', function() {
            avatar.classList.remove('glitching');
        });
    });
}

function triggerGlitch(img) {
    var parent = img.parentElement;
    if (parent) {
        parent.classList.add('glitch');
        var colors = ['#00f0ff', '#ff00ff', '#00ff9f', '#ff0040'];
        var randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        var randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        parent.style.background = 'linear-gradient(135deg, ' + randomColor1 + ', ' + randomColor2 + ')';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.innerHTML = '<span style="font-family: monospace; font-size: 12px; color: #ff0040;">ERR</span>';
    }
}

function initHoverEffects() {
    var posts = document.querySelectorAll('.post-card');
    posts.forEach(function(post) {
        post.addEventListener('mouseenter', function() {
            post.style.borderColor = 'rgba(0, 240, 255, 0.6)';
        });
        post.addEventListener('mouseleave', function() {
            post.style.borderColor = 'rgba(0, 240, 255, 0.3)';
        });
    });
    var widgets = document.querySelectorAll('.widget');
    widgets.forEach(function(widget) {
        widget.addEventListener('mouseenter', function() {
            widget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.1)';
        });
        widget.addEventListener('mouseleave', function() {
            widget.style.boxShadow = 'none';
        });
    });
    var tags = document.querySelectorAll('.tag-item, .post-tag');
    tags.forEach(function(tag) {
        tag.addEventListener('mouseenter', function() {
            tag.style.transform = 'translateX(4px)';
        });
        tag.addEventListener('mouseleave', function() {
            tag.style.transform = 'translateX(0)';
        });
    });
}

function initCopyButtons() {
    var copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            copyCode(btn);
        });
    });
}

function copyCode(btn) {
    var codeBlock = btn.closest('.code-paste-block');
    if (!codeBlock) return;
    var codeElement = codeBlock.querySelector('.code-content code');
    if (!codeElement) return;
    var code = codeElement.textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() {
            var originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg> COPIED!';
            btn.style.color = '#00ff9f';
            btn.style.borderColor = '#00ff9f';
            setTimeout(function() {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        }).catch(function() {
            btn.innerHTML = 'ERROR';
            setTimeout(function() {
                btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> COPY';
            }, 2000);
        });
    }
}

function initSearchInput() {
    var searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
    searchInput.addEventListener('input', function() {
        if (searchInput.value.length > 0) {
            searchInput.style.borderColor = '#00f0ff';
        } else {
            searchInput.style.borderColor = '';
        }
    });
}

function performSearch(query) {
    var posts = document.querySelectorAll('.post-card');
    var matchCount = 0;
    posts.forEach(function(post) {
        var content = post.textContent.toLowerCase();
        if (content.indexOf(query.toLowerCase()) !== -1) {
            post.style.display = 'block';
            matchCount++;
            setTimeout(function() {
                post.style.boxShadow = '0 0 30px rgba(240, 255, 0, 0.3)';
                setTimeout(function() {
                    post.style.boxShadow = '';
                }, 2000);
            }, 100);
        } else {
            post.style.display = 'none';
        }
    });
    showNotification('Found ' + matchCount + ' result(s) for "' + query + '"', 'info');
}

function initNavHighlight() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(function(i) {
                i.classList.remove('active');
            });
            item.classList.add('active');
        });
    });
}

function initThreatSimulation() {
    setInterval(function() {
        var threatIndicators = document.querySelectorAll('.threat-indicator');
        threatIndicators.forEach(function(indicator) {
            if (Math.random() > 0.7) {
                indicator.classList.toggle('active');
            }
        });
    }, 8000);
    setInterval(function() {
        var runnerStatuses = document.querySelectorAll('.runner-status');
        runnerStatuses.forEach(function(status) {
            var parent = status.closest('.runner-item');
            if (parent && Math.random() > 0.8) {
                var activities = ['IN_NET', 'RUNNING', 'DEALING', 'WATCHING', 'SLEEPING'];
                var activitySpan = parent.querySelector('.runner-activity');
                if (activitySpan) {
                    var randomActivity = activities[Math.floor(Math.random() * activities.length)];
                    activitySpan.textContent = randomActivity;
                }
            }
        });
    }, 12000);
}

function initPostInteractions() {
    var likeButtons = document.querySelectorAll('.action-btn');
    likeButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var svg = btn.querySelector('svg');
            if (!svg) return;
            var pathD = svg.getAttribute('d') || '';
            if (pathD.indexOf('M20.84') !== -1) {
                animateLike(btn);
            }
            if (pathD.indexOf('M17') !== -1 && pathD.indexOf('M3') !== -1) {
                animateBoost(btn);
            }
        });
    });
}

function animateLike(btn) {
    var footer = btn.closest('.post-footer');
    if (!footer) return;
    var stat = footer.querySelector('.stat:first-child');
    if (stat) {
        var countEl = stat.childNodes[2];
        if (countEl && countEl.textContent) {
            var countText = countEl.textContent.trim();
            var count = parseInt(countText, 10);
            if (!isNaN(count)) {
                countEl.textContent = ' ' + (count + 1);
                stat.style.color = '#ff0040';
                setTimeout(function() {
                    stat.style.color = '';
                }, 500);
            }
        }
    }
    btn.style.color = '#ff0040';
    btn.style.transform = 'scale(1.2)';
    setTimeout(function() {
        btn.style.transform = '';
    }, 200);
}

function animateBoost(btn) {
    btn.style.color = '#f0ff00';
    btn.style.transform = 'scale(1.2) rotate(15deg)';
    setTimeout(function() {
        btn.style.transform = '';
        btn.style.color = '';
    }, 500);
    showNotification('Signal boosted!', 'success');
}

function initComposeBox() {
    var composeInput = document.querySelector('.compose-input');
    var transmitBtn = document.querySelector('.transmit-btn');
    if (!composeInput || !transmitBtn) return;
    composeInput.addEventListener('focus', function() {
        composeInput.style.borderColor = '#00f0ff';
        composeInput.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
    });
    composeInput.addEventListener('blur', function() {
        composeInput.style.borderColor = '';
        composeInput.style.boxShadow = '';
    });
    transmitBtn.addEventListener('click', function() {
        var content = composeInput.value.trim();
        if (content) {
            transmitPost(content);
            composeInput.value = '';
        } else {
            showNotification('Cannot transmit empty message', 'error');
        }
    });
}

function transmitPost(content) {
    showNotification('Transmission sent successfully!', 'success');
    var transmitBtn = document.querySelector('.transmit-btn');
    if (transmitBtn) {
        transmitBtn.style.transform = 'scale(0.95)';
        setTimeout(function() {
            transmitBtn.style.transform = '';
        }, 150);
    }
}

function showNotification(message, type) {
    var colors = {
        success: '#00ff9f',
        error: '#ff0040',
        warning: '#f0ff00',
        info: '#00f0ff'
    };
    var color = colors[type] || colors.info;
    var notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 24px;background:#0d0d14;border:1px solid ' + color + ';color:' + color + ';font-family:Share Tech Mono,monospace;font-size:14px;z-index:10000;animation:slide-in 0.3s ease-out;box-shadow:0 0 20px ' + color + '40;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function() {
        notification.style.animation = 'slide-out 0.3s ease-out forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

function initAnimations() {
    var styleSheet = document.createElement('style');
    styleSheet.textContent = [
        '@keyframes slide-in {',
        '  from { transform: translateX(100%); opacity: 0; }',
        '  to { transform: translateX(0); opacity: 1; }',
        '}',
        '@keyframes slide-out {',
        '  from { transform: translateX(0); opacity: 1; }',
        '  to { transform: translateX(100%); opacity: 0; }',
        '}',
        '@keyframes fade-in-up {',
        '  from { opacity: 0; transform: translateY(20px); }',
        '  to { opacity: 1; transform: translateY(0); }',
        '}',
        '@keyframes status-blink {',
        '  0%, 100% { opacity: 1; }',
        '  50% { opacity: 0.4; }',
        '}',
        '.shake {',
        '  animation: screen-shake 0.1s ease-in-out infinite;',
        '}',
        '@keyframes screen-shake {',
        '  0%, 100% { transform: translate(0); }',
        '  10% { transform: translate(-2px, -2px); }',
        '  20% { transform: translate(2px, 2px); }',
        '  30% { transform: translate(-2px, 2px); }',
        '  40% { transform: translate(2px, -2px); }',
        '  50% { transform: translate(-2px, 2px); }',
        '  60% { transform: translate(2px, -2px); }',
        '  70% { transform: translate(-2px, -2px); }',
        '  80% { transform: translate(2px, 2px); }',
        '  90% { transform: translate(-2px, 2px); }',
        '}'
    ].join('');
    document.head.appendChild(styleSheet);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && traceActive) {
        dismissTrace();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        var transmitBtn = document.querySelector('.transmit-btn');
        if (transmitBtn) {
            transmitBtn.click();
        }
    }
    if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        var searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    if (e.key === 'n' && !e.target.matches('input, textarea')) {
        var composeInput = document.querySelector('.compose-input');
        if (composeInput) {
            composeInput.focus();
        }
    }
    if (e.key === 't' && !e.target.matches('input, textarea')) {
        triggerTrace();
    }
});

window.triggerGlitch = triggerGlitch;
window.copyCode = copyCode;
window.dismissTrace = dismissTrace;
window.triggerTrace = triggerTrace;