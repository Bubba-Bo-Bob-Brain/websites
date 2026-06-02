(function() {
  "use strict";

  const countdownDigits = document.getElementById("countdownDigits");
  const currentBidElement = document.getElementById("currentBid");
  const bidButton = document.getElementById("bidButton");
  const bidInput = document.getElementById("bidInput");
  const bidderList = document.getElementById("bidderList");
  const historyList = document.getElementById("historyList");
  const curseSeal = document.getElementById("curseSeal");
  const breakSealBtn = document.getElementById("breakSealBtn");
  const warningSeal = document.getElementById("warningSeal");
  const whisperOverlay = document.getElementById("whisperOverlay");
  const whisperText = document.getElementById("whisperText");
  const bidIncrementEffect = document.getElementById("bidIncrementEffect");
  const loreWhisper = document.getElementById("loreWhisper");
  const itemName = document.getElementById("itemName");
  const itemFlavor = document.getElementById("itemFlavor");
  const itemDescription = document.getElementById("itemDescription");

  let currentBid = 1666;
  let countdownSeconds = 19 * 60 + 47;
  let countdownInterval;
  let whisperTimer;

  const spectralNames = [
    "The Ashen King", "Coven of Dusk", "Lord Malachar", "Lady Vex",
    "The Silent Choir", "Baron of Rust", "Widow Sorrow", "The Hollow Prince",
    "Mother of Moths", "Knight of Embers"
  ];

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateCountdownDisplay() {
    if (countdownDigits) {
      countdownDigits.textContent = formatTime(countdownSeconds);
    }
  }

  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      if (countdownSeconds > 0) {
        countdownSeconds--;
        updateCountdownDisplay();
        if (countdownSeconds <= 60 && countdownSeconds % 5 === 0) {
          triggerWhisper("The seal weakens...");
        }
      } else {
        clearInterval(countdownInterval);
        if (countdownDigits) countdownDigits.textContent = "00:00:00";
        triggerWhisper("THE SEAL IS BROKEN. FLEE IF YOU CAN.");
      }
    }, 1000);
  }

  function updateCurrentBidDisplay() {
    if (currentBidElement) {
      currentBidElement.textContent = currentBid.toLocaleString();
    }
  }

  function showBidIncrement(amount) {
    if (!bidIncrementEffect) return;
    const incrementValue = bidIncrementEffect.querySelector(".increment-value");
    if (incrementValue) {
      incrementValue.textContent = `+${amount}`;
    }
    bidIncrementEffect.style.opacity = "1";
    bidIncrementEffect.style.transition = "none";
    bidIncrementEffect.style.transform = "translateY(0)";
    void bidIncrementEffect.offsetWidth;
    bidIncrementEffect.style.transition = "opacity 0.4s ease, transform 0.6s ease";
    bidIncrementEffect.style.opacity = "0";
    bidIncrementEffect.style.transform = "translateY(-12px)";
  }

  function addBidToHistory(bidder, amount) {
    if (!historyList) return;
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `<span class="history-bidder">${bidder}</span><span class="history-amount">${amount.toLocaleString()}</span><span class="history-time">just now</span>`;
    historyList.insertBefore(li, historyList.firstChild);
    if (historyList.children.length > 8) {
      historyList.removeChild(historyList.lastChild);
    }
  }

  function updateSpectralBidders(newBidder, amount) {
    if (!bidderList) return;
    const currentItems = bidderList.querySelectorAll("li");
    const existingNames = Array.from(currentItems).map(li => li.textContent.replace(/⛓\s*/, "").split(" — ")[0].trim());

    if (existingNames.length >= 4) {
      const lastItem = bidderList.lastElementChild;
      if (lastItem) lastItem.remove();
    }

    const li = document.createElement("li");
    li.className = "bidder fade-in";
    li.textContent = `⛓ ${newBidder} — ${amount.toLocaleString()}`;
    bidderList.insertBefore(li, bidderList.firstChild);

    const allBidders = bidderList.querySelectorAll("li");
    allBidders.forEach((bidder, index) => {
      if (index > 0) {
        bidder.classList.remove("fade-in");
        bidder.classList.add("fade-out");
      }
    });
  }

  function triggerWhisper(message) {
    if (!whisperOverlay || !whisperText) return;
    whisperText.textContent = message;
    whisperOverlay.style.opacity = "1";
    whisperOverlay.style.transition = "opacity 0.2s ease";
    clearTimeout(whisperTimer);
    whisperTimer = setTimeout(() => {
      whisperOverlay.style.opacity = "0";
    }, 2500);
  }

  function handleBid() {
    const inputValue = parseInt(bidInput.value, 10);
    if (isNaN(inputValue) || inputValue <= currentBid) {
      triggerWhisper("Your offering is insufficient...");
      return;
    }
    const increment = inputValue - currentBid;
    currentBid = inputValue;
    updateCurrentBidDisplay();
    showBidIncrement(increment);

    const randomBidder = spectralNames[Math.floor(Math.random() * spectralNames.length)];
    addBidToHistory(randomBidder, currentBid);
    updateSpectralBidders(randomBidder, currentBid);

    triggerWhisper(`The ${randomBidder} speaks...`);

    countdownSeconds += 12;
    updateCountdownDisplay();
    bidInput.value = currentBid + Math.floor(Math.random() * 40 + 20);
  }

  function breakCurseSeal() {
    if (curseSeal) {
      curseSeal.style.transition = "transform 0.3s, opacity 0.3s";
      curseSeal.style.transform = "scale(1.2)";
      curseSeal.style.opacity = "0";
      setTimeout(() => {
        if (curseSeal) curseSeal.remove();
      }, 300);
    }
    triggerWhisper("You have been marked by the Inquisition...");
    document.body.style.transition = "background-color 0.5s";
    document.body.style.backgroundColor = "#0d0406";
    setTimeout(() => {
      document.body.style.backgroundColor = "";
    }, 600);
  }

  function acknowledgeDoom() {
    if (warningSeal) {
      warningSeal.style.transition = "transform 0.4s, opacity 0.4s";
      warningSeal.style.transform = "rotate(5deg) scale(0.95)";
      warningSeal.style.opacity = "0.3";
      setTimeout(() => {
        if (warningSeal) {
          warningSeal.style.transform = "";
          warningSeal.style.opacity = "1";
        }
      }, 500);
    }
    triggerWhisper("So be it. The contract is sealed in shadow.");
  }

  function setupWhisperOnHover() {
    const relicLore = document.querySelector(".relic-lore");
    if (relicLore && loreWhisper) {
      relicLore.addEventListener("mouseenter", () => {
        const whispers = [
          "it remembers your name...",
          "so cold...",
          "the heart still beats for you",
          "closer... let me whisper",
          "you will be the next owner"
        ];
        const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
        loreWhisper.textContent = `"${randomWhisper}"`;
      });
      relicLore.addEventListener("mouseleave", () => {
        loreWhisper.textContent = `"...closer..."`;
      });
    }
  }

  function randomSpectralActivity() {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const randomGhost = spectralNames[Math.floor(Math.random() * spectralNames.length)];
        const fakeBid = currentBid - Math.floor(Math.random() * 80 + 10);
        updateSpectralBidders(randomGhost, fakeBid);
      }
    }, 9000);
  }

  function initialize() {
    updateCountdownDisplay();
    updateCurrentBidDisplay();
    startCountdown();
    setupWhisperOnHover();
    randomSpectralActivity();

    if (bidButton) {
      bidButton.addEventListener("click", handleBid);
    }
    if (bidInput) {
      bidInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleBid();
        }
      });
    }
    if (curseSeal) {
      curseSeal.addEventListener("click", breakCurseSeal);
    }
    if (breakSealBtn) {
      breakSealBtn.addEventListener("click", acknowledgeDoom);
    }
  }

  window.addEventListener("DOMContentLoaded", initialize);
})();