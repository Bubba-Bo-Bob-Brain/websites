document.addEventListener('DOMContentLoaded', () => {
    // Warning Seal Interaction
    const warningSeal = document.getElementById('warningSeal');
    const sealBreakBtn = document.getElementById('sealBreakBtn');
    
    sealBreakBtn.addEventListener('click', () => {
        warningSeal.style.opacity = '0';
        setTimeout(() => {
            warningSeal.style.display = 'none';
        }, 500);
    });
    
    // Countdown Timers
    const timerDisplays = document.querySelectorAll('.timer-display');
    
    function updateTimers() {
        const now = Date.now();
        
        timerDisplays.forEach(timer => {
            const endTime = parseInt(timer.dataset.endTime);
            const distance = endTime - now;
            
            if (distance < 0) {
                timer.innerHTML = '<span class="timer-hours">00</span>:<span class="timer-minutes">00</span>:<span class="timer-seconds">00</span>';
                timer.classList.add('timer-expired');
                return;
            }
            
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timer.innerHTML = `
                <span class="timer-hours">${String(hours).padStart(2, '0')}</span>:<span class="timer-minutes">${String(minutes).padStart(2, '0')}</span>:<span class="timer-seconds">${String(seconds).padStart(2, '0')}</span>
            `;
            
            if (distance < 3600000) {
                timer.classList.add('timer-low');
            }
        });
    }
    
    updateTimers();
    setInterval(updateTimers, 1000);
    
    // Lore Toggle
    const loreToggles = document.querySelectorAll('.lore-toggle');
    
    loreToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const relicId = toggle.dataset.relic;
            const lorePanel = document.getElementById(`lore-${relicId}`);
            const isOpen = lorePanel.classList.contains('open');
            
            if (isOpen) {
                lorePanel.classList.remove('open');
                toggle.classList.remove('lore-open');
                toggle.innerHTML = '<i class="fa-solid fa-scroll"></i> View Forbidden Lore';
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                lorePanel.classList.add('open');
                toggle.classList.add('lore-open');
                toggle.innerHTML = '<i class="fa-solid fa-scroll"></i> Hide Forbidden Lore';
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // Bid Modal Logic
    const bidModal = document.getElementById('bidModal');
    const modalItemName = document.getElementById('modalItemName');
    const modalBidAmount = document.getElementById('modalBidAmount');
    const cancelBidBtn = document.getElementById('cancelBidBtn');
    const confirmBidBtn = document.getElementById('confirmBidBtn');
    const bidButtons = document.querySelectorAll('.bid-btn');
    const userBalanceElement = document.getElementById('userBalance');
    
    let currentBidItem = null;
    
    bidButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.itemName;
            const nextBid = button.dataset.nextBid;
            
            currentBidItem = {
                id: button.dataset.itemId,
                name: itemName,
                nextBid: parseInt(nextBid),
                currentBid: parseInt(button.dataset.currentBid),
                button: button
            };
            
            modalItemName.textContent = itemName;
            modalBidAmount.textContent = parseInt(nextBid).toLocaleString();
            bidModal.classList.add('active');
            bidModal.setAttribute('aria-hidden', 'false');
        });
    });
    
    function closeBidModal() {
        bidModal.classList.remove('active');
        bidModal.setAttribute('aria-hidden', 'true');
        currentBidItem = null;
    }
    
    cancelBidBtn.addEventListener('click', closeBidModal);
    
    bidModal.addEventListener('click', (e) => {
        if (e.target === bidModal) {
            closeBidModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bidModal.classList.contains('active')) {
            closeBidModal();
        }
    });
    
    confirmBidBtn.addEventListener('click', () => {
        if (!currentBidItem) return;
        
        let currentBalance = parseInt(userBalanceElement.textContent.replace(/,/g, ''));
        const bidAmount = currentBidItem.nextBid;
        
        if (currentBalance >= bidAmount) {
            // Deduct balance
            currentBalance -= bidAmount;
            userBalanceElement.textContent = currentBalance.toLocaleString();
            
            // Flash effect on balance
            userBalanceElement.style.color = '#ff0000';
            setTimeout(() => {
                userBalanceElement.style.color = '';
            }, 300);
            
            // Update bid amount on card
            const bidAmountElement = currentBidItem.button.parentElement.querySelector('.bid-amount');
            bidAmountElement.textContent = bidAmount.toLocaleString();
            bidAmountElement.dataset.currentBid = bidAmount;
            currentBidItem.button.dataset.currentBid = bidAmount;
            
            // Calculate next bid (minimum 250 increase or 10%)
            const nextBid = Math.max(bidAmount + 250, Math.floor(bidAmount * 1.1));
            currentBidItem.button.dataset.nextBid = nextBid;
            
            // Flash animation on bid amount
            bidAmountElement.classList.add('bid-updated');
            setTimeout(() => bidAmountElement.classList.remove('bid-updated'), 500);
            
            // Add to bid history
            const card = currentBidItem.button.closest('.relic-card');
            const bidHistory = card.querySelector('.history-list');
            const newBidEntry = document.createElement('li');
            newBidEntry.innerHTML = `
                <span class="bidder">You</span>
                <span class="amount">${bidAmount.toLocaleString()}</span>
                <span class="time">Just now</span>
            `;
            bidHistory.insertBefore(newBidEntry, bidHistory.firstChild);
            
            // Blood drip effect
            createBloodDrip(currentBidItem.button);
            
            closeBidModal();
        } else {
            // Shake modal to indicate error
            const modalContent = bidModal.querySelector('.modal-content');
            modalContent.style.animation = 'shake 0.5s';
            setTimeout(() => {
                modalContent.style.animation = '';
            }, 500);
        }
    });
    
    function createBloodDrip(element) {
        const drip = document.createElement('div');
        drip.style.cssText = `
            position: absolute;
            width: 4px;
            height: 20px;
            background: #8a0303;
            border-radius: 0 0 2px 2px;
            pointer-events: none;
            animation: drip 1s forwards;
            z-index: 100;
        `;
        
        const rect = element.getBoundingClientRect();
        drip.style.left = `${rect.left + rect.width / 2}px`;
        drip.style.top = `${rect.top}px`;
        
        document.body.appendChild(drip);
        
        setTimeout(() => drip.remove(), 1000);
    }
    
    // Notifications Bell
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', () => {
        const messages = [
            "Your bid on the Soul-Reaper's Oathblade has been surpassed by SpectralLord99",
            "The curse of the Drowned Queen's Amulet has intensified...",
            "New relic added to the auction: Crown of the Lich King",
            "Warning: The Forbidden Grimoire has claimed another victim"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        alert(`Spectral Message:\n\n${randomMessage}`);
    });
    
    // Candelabra Flicker Effect
    const candelabras = document.querySelectorAll('.candelabra');
    setInterval(() => {
        candelabras.forEach(candelabra => {
            const randomOpacity = 0.6 + Math.random() * 0.4;
            candelabra.style.opacity = randomOpacity;
        });
    }, 200);
    
    // Add shake animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});