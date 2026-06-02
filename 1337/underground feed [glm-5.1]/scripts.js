const DECRYPT_HOVER_DELAY = 400;
const DECRYPT_ANIM_DURATION = 300;
const TRACE_WARNING_INTERVAL_MIN = 25000;
const TRACE_WARNING_INTERVAL_MAX = 60000;
const TRACE_COUNTDOWN_SECONDS = 10;
const NOTIFICATION_INTERVAL = 18000;
const NODE_UPDATE_INTERVAL = 5000;
const ACTIVITY_UPDATE_INTERVAL = 12000;
const CLOCK_UPDATE_INTERVAL = 1000;
const UPTIME_UPDATE_INTERVAL = 1000;

const notificationMessages = [
  { title: "NEW ENCRYPTION KEY", message: "Rotating cipher keys on subnet 7..." },
  { title: "PROXY ROTATED", message: "Relay node switched: proxy-19 -> proxy-27" },
  { title: "NODE JOINED", message: "New anonymous node connected to mesh" },
  { title: "ICE DETECTED", message: "KILLER-class ICE signature on port 8443" },
  { title: "DATA DUMP", message: "Intel package uploaded to dark archive" },
  { title: "CIPHER UPDATE", message: "AES-512 key rotation completed" },
  { title: "TRACE BLOCKED", message: "Countermeasure successful on subnet 4" },
  { title: "REP UPDATE", message: "Your reputation increased by +3" },
  { title: "ESCROW COMPLETE", message: "Dark credit transaction verified" },
  { title: "BREACH ALERT", message: "Honeypot signature detected on 4.2.x" }
];

const activityMessages = [
  "CIPHER_DAEMON posted intel leak",
  "V0IDWALKER accepted job #7742",
  "Trade completed: NEON_RAZOR -> anon",
  "Trace attempt blocked on subnet 4",
  "New node connected: proxy-relay-19",
  "ZERO_DAY posted encrypted job",
  "GHOST_PROTOCOL relayed intel packet",
  "CHROME_PHANTOM listed tech trade",
  "NEON_RAZOR completed contract #3319",
  "Anonymous operator joined subnet 7",
  "Arasaka ICE pattern updated on node 12",
  "Kang Tao shipment data exfiltrated",
  "Dark escrow transaction #8842 verified",
  "Biotechnica firewall breach attempted",
  "New zero-day exploit listed on market"
];

let traceWarningTimer = null;
let notificationTimer = null;
let uptimeSeconds = 147 * 3600 + 23 * 60 + 5;
let traceAttempts = 3;

function initEncryptedText() {
  const encryptedElements = document.querySelectorAll(".encrypted-text");

  encryptedElements.forEach(function (el) {
    const encryptedContent = el.getAttribute("data-encrypted");
    const realContent = el.getAttribute("data-real");

    if (!encryptedContent || !realContent) return;

    el.textContent = encryptedContent;
    el.classList.add("is-encrypted");
    el._encryptedContent = encryptedContent;
    el._realContent = realContent;
    el._hoverTimeout = null;
    el._isDecrypted = false;

    el.addEventListener("mouseenter", function () {
      el._hoverTimeout = setTimeout(function () {
        decryptElement(el);
      }, DECRYPT_HOVER_DELAY);
    });

    el.addEventListener("mouseleave", function () {
      if (el._hoverTimeout) {
        clearTimeout(el._hoverTimeout);
        el._hoverTimeout = null;
      }
      reEncryptElement(el);
    });
  });
}

function decryptElement(el) {
  if (el._isDecrypted) return;
  el._isDecrypted = true;

  el.classList.remove("is-encrypted");
  el.classList.add("is-decrypting");

  const realContent = el._realContent;
  const encryptedContent = el._encryptedContent;
  const totalSteps = 12;
  let currentStep = 0;

  const decryptInterval = setInterval(function () {
    currentStep++;
    const ratio = currentStep / totalSteps;
    const mixedContent = mixStrings(encryptedContent, realContent, ratio);
    el.textContent = mixedContent;

    if (currentStep >= totalSteps) {
      clearInterval(decryptInterval);
      el.textContent = realContent;
      el.classList.remove("is-decrypting");
    }
  }, DECRYPT_ANIM_DURATION / totalSteps);
}

function reEncryptElement(el) {
  if (!el._isDecrypted) return;
  el._isDecrypted = false;

  const encryptedContent = el._encryptedContent;
  el.textContent = encryptedContent;
  el.classList.add("is-encrypted");
  el.classList.remove("is-decrypting");
}

function mixStrings(enc, real, ratio) {
  const maxLen = Math.max(enc.length, real.length);
  let result = "";
  const charsToReveal = Math.floor(maxLen * ratio);

  for (let i = 0; i < maxLen; i++) {
    if (i < charsToReveal && i < real.length) {
      if (real[i] === " ") {
        result += " ";
      } else if (Math.random() < ratio) {
        result += real[i];
      } else {
        result += pickRandomBlockChar();
      }
    } else if (i < enc.length) {
      result += enc[i];
    } else {
      result += pickRandomBlockChar();
    }
  }

  return result;
}

function pickRandomBlockChar() {
  const blocks = ["\u2591", "\u2592", "\u2593", "\u2588"];
  return blocks[Math.floor(Math.random() * blocks.length)];
}

function initSystemClock() {
  const clockEl = document.getElementById("systemClock");
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = hours + ":" + minutes + ":" + seconds;
  }

  updateClock();
  setInterval(updateClock, CLOCK_UPDATE_INTERVAL);
}

function initUptimeCounter() {
  const uptimeEl = document.getElementById("systemUptime");
  if (!uptimeEl) return;

  function updateUptime() {
    uptimeSeconds++;
    const h = Math.floor(uptimeSeconds / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = uptimeSeconds % 60;
    uptimeEl.textContent =
      String(h).padStart(3, "0") +
      ":" +
      String(m).padStart(2, "0") +
      ":" +
      String(s).padStart(2, "0");
  }

  setInterval(updateUptime, UPTIME_UPDATE_INTERVAL);
}

function initNodeCount() {
  const nodeEl = document.getElementById("nodeCount");
  if (!nodeEl) return;

  function updateNodeCount() {
    const base = 2847;
    const variance = Math.floor(Math.random() * 200) - 100;
    const count = base + variance;
    nodeEl.textContent = count.toLocaleString();
  }

  setInterval(updateNodeCount, NODE_UPDATE_INTERVAL);
}

function initTraceWarning() {
  scheduleNextTrace();

  const scrambleBtn = document.getElementById("traceScrambleBtn");
  const dismissBtn = document.getElementById("traceDismissBtn");

  if (scrambleBtn) {
    scrambleBtn.addEventListener("click", function () {
      closeTraceWarning(true);
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener("click", function () {
      closeTraceWarning(false);
    });
  }
}

function scheduleNextTrace() {
  const delay =
    TRACE_WARNING_INTERVAL_MIN +
    Math.random() * (TRACE_WARNING_INTERVAL_MAX - TRACE_WARNING_INTERVAL_MIN);

  traceWarningTimer = setTimeout(function () {
    triggerTraceWarning();
  }, delay);
}

function triggerTraceWarning() {
  const warningEl = document.getElementById("traceWarning");
  const countdownEl = document.getElementById("traceCountdown");
  const progressBarEl = document.getElementById("traceProgressBar");
  const traceCountEl = document.getElementById("traceCount");

  if (!warningEl) return;

  warningEl.classList.add("trace-warning--active");

  let timeLeft = TRACE_COUNTDOWN_SECONDS;
  const totalTime = TRACE_COUNTDOWN_SECONDS;
  const updateInterval = 50;

  if (countdownEl) {
    countdownEl.textContent = timeLeft.toFixed(2);
  }

  if (progressBarEl) {
    progressBarEl.style.width = "0%";
  }

  const countdownInterval = setInterval(function () {
    timeLeft -= updateInterval / 1000;

    if (timeLeft <= 0) {
      timeLeft = 0;
      clearInterval(countdownInterval);
      closeTraceWarning(true);
    }

    if (countdownEl) {
      countdownEl.textContent = timeLeft.toFixed(2);
    }

    if (progressBarEl) {
      const progress = ((totalTime - timeLeft) / totalTime) * 100;
      progressBarEl.style.width = progress + "%";
    }
  }, updateInterval);

  warningEl._countdownInterval = countdownInterval;
}

function closeTraceWarning(scrambled) {
  const warningEl = document.getElementById("traceWarning");
  const traceCountEl = document.getElementById("traceCount");

  if (!warningEl) return;

  if (warningEl._countdownInterval) {
    clearInterval(warningEl._countdownInterval);
  }

  warningEl.classList.remove("trace-warning--active");

  if (scrambled) {
    traceAttempts++;
    if (traceCountEl) {
      traceCountEl.textContent = traceAttempts + " ATTEMPTS";
    }
    showNotification("IDENTITY SCRAMBLED", "Proxy chain rotated. New relay active.");
  } else {
    showNotification("DISMISS RISKY", "Trace signal may have logged your node.");
  }

  scheduleNextTrace();
}

function initNotifications() {
  showNotification("SYSTEM ONLINE", "Darknet feed connected. Encryption active.");

  notificationTimer = setInterval(function () {
    const msg =
      notificationMessages[
        Math.floor(Math.random() * notificationMessages.length)
      ];
    showNotification(msg.title, msg.message);
  }, NOTIFICATION_INTERVAL);
}

function showNotification(title, message) {
  const toastEl = document.getElementById("notifToast");
  const titleEl = document.getElementById("notifTitle");
  const messageEl = document.getElementById("notifMessage");
  const timerEl = document.getElementById("notifTimer");

  if (!toastEl || !titleEl || !messageEl || !timerEl) return;

  titleEl.textContent = title;
  messageEl.textContent = message;

  timerEl.style.transition = "none";
  timerEl.style.width = "100%";

  void timerEl.offsetWidth;

  toastEl.classList.add("notification-toast--visible");

  const displayDuration = 4000;
  timerEl.style.transition = "width " + displayDuration + "ms linear";
  timerEl.style.width = "0%";

  setTimeout(function () {
    toastEl.classList.remove("notification-toast--visible");
  }, displayDuration);
}

function initFeedTabs() {
  const tabs = document.querySelectorAll(".feed__tab");
  const posts = document.querySelectorAll(".post");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("feed__tab--active");
      });
      tab.classList.add("feed__tab--active");

      const filter = tab.getAttribute("data-filter");

      posts.forEach(function (post) {
        if (filter === "all") {
          post.classList.remove("post--hidden");
        } else {
          if (post.getAttribute("data-type") === filter) {
            post.classList.remove("post--hidden");
          } else {
            post.classList.add("post--hidden");
          }
        }
      });
    });
  });
}

function initActivityFeed() {
  const feedEl = document.getElementById("activityFeed");
  if (!feedEl) return;

  setInterval(function () {
    const now = new Date();
    const timeStr =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    const msg =
      activityMessages[Math.floor(Math.random() * activityMessages.length)];

    const newItem = document.createElement("li");
    newItem.className = "activity-item";
    newItem.style.opacity = "0";
    newItem.style.transform = "translateY(-8px)";
    newItem.style.transition = "opacity 0.4s, transform 0.4s";
    newItem.innerHTML =
      '<span class="activity-item__time">' +
      timeStr +
      "</span>" +
      '<span class="activity-item__text">' +
      msg +
      "</span>";

    feedEl.insertBefore(newItem, feedEl.firstChild);

    void newItem.offsetWidth;
    newItem.style.opacity = "1";
    newItem.style.transform = "translateY(0)";

    const items = feedEl.querySelectorAll(".activity-item");
    if (items.length > 8) {
      const lastItem = items[items.length - 1];
      lastItem.style.opacity = "0";
      setTimeout(function () {
        if (lastItem.parentNode) {
          lastItem.parentNode.removeChild(lastItem);
        }
      }, 400);
    }
  }, ACTIVITY_UPDATE_INTERVAL);
}

function initCodeCopy() {
  const copyButtons = document.querySelectorAll(".code-paste__copy");

  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const pasteContainer = btn.closest(".code-paste");
      if (!pasteContainer) return;

      const codeEl = pasteContainer.querySelector("code");
      if (!codeEl) return;

      const text = codeEl.textContent;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          flashCopyButton(btn);
        });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          flashCopyButton(btn);
        } catch (e) {
          // silent fail
        }
        document.body.removeChild(textarea);
      }
    });
  });
}

function flashCopyButton(btn) {
  const originalText = btn.textContent;
  btn.textContent = "COPIED";
  btn.style.color = "#39ff14";
  btn.style.borderColor = "rgba(57, 255, 20, 0.3)";

  setTimeout(function () {
    btn.textContent = originalText;
    btn.style.color = "";
    btn.style.borderColor = "";
  }, 1500);
}

function initPostActions() {
  const acceptButtons = document.querySelectorAll(
    ".post__action--accept, .post__action--buy, .post__action--download"
  );

  acceptButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const post = btn.closest(".post");
      if (!post) return;

      if (btn.classList.contains("post__action--accept")) {
        btn.textContent = "\u25B6 ACCEPTED";
        btn.style.color = "#39ff14";
        btn.style.borderColor = "rgba(57, 255, 20, 0.3)";
        btn.style.background = "rgba(57, 255, 20, 0.08)";
        btn.disabled = true;
        showNotification("JOB ACCEPTED", "Encrypted contact channel opening...");
      } else if (btn.classList.contains("post__action--buy")) {
        btn.textContent = "\u20AC TRADE INITIATED";
        btn.style.color = "#ffaa00";
        btn.style.borderColor = "rgba(255, 170, 0, 0.3)";
        btn.style.background = "rgba(255, 170, 0, 0.08)";
        btn.disabled = true;
        showNotification("ESCROW INITIATED", "Dark credit hold placed. Awaiting confirmation.");
      } else if (btn.classList.contains("post__action--download")) {
        btn.textContent = "\u21E3 DOWNLOADING...";
        btn.style.color = "#00fff0";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = "\u21E3 DOWNLOADED";
          btn.style.color = "#39ff14";
          btn.style.borderColor = "rgba(57, 255, 20, 0.3)";
          showNotification("DOWNLOAD COMPLETE", "Archive decrypted. Data ready.");
        }, 2000);
      }
    });
  });

  const saveButtons = document.querySelectorAll(".post__action--save");
  saveButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.textContent.includes("SAVED")) {
        btn.textContent = "\u2606 SAVE";
        btn.style.color = "";
        btn.style.borderColor = "";
      } else {
        btn.textContent = "\u2605 SAVED";
        btn.style.color = "#ffaa00";
        btn.style.borderColor = "rgba(255, 170, 0, 0.2)";
      }
    });
  });

  const relayButtons = document.querySelectorAll(".post__action--relay");
  relayButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.style.color = "#00fff0";
      btn.style.borderColor = "rgba(0, 255, 240, 0.3)";
      setTimeout(function () {
        btn.style.color = "";
        btn.style.borderColor = "";
      }, 1000);
      showNotification("RELAY SENT", "Intel packet forwarded to trusted nodes.");
    });
  });
}

function initReputationBadges() {
  const badges = document.querySelectorAll(".rep-badge");
  badges.forEach(function (badge) {
    badge.addEventListener("mouseenter", function () {
      badge.style.transform = "scale(1.05)";
      badge.style.transition = "transform 0.2s ease";
    });
    badge.addEventListener("mouseleave", function () {
      badge.style.transform = "scale(1)";
    });
  });
}

function initGlitchAvatars() {
  const avatars = document.querySelectorAll(".avatar--glitch");
  avatars.forEach(function (avatar) {
    const baseDuration = 6;
    const offset = Math.random() * baseDuration;
    avatar.style.animationDelay = "-" + offset + "s";

    const glitchLayer = avatar.querySelector(".avatar__glitch-layer");
    if (glitchLayer) {
      glitchLayer.style.animationDelay = "-" + offset + "s";
    }
  });
}

function initTagCloud() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach(function (tag) {
    tag.addEventListener("click", function () {
      const activeTags = document.querySelectorAll(".tag.tag--active");
      const wasActive = tag.classList.contains("tag--active");

      activeTags.forEach(function (t) {
        t.classList.remove("tag--active");
        t.style.borderColor = "";
        t.style.color = "";
        t.style.background = "";
      });

      if (!wasActive) {
        tag.classList.add("tag--active");
        tag.style.borderColor = "rgba(0, 255, 240, 0.4)";
        tag.style.color = "#00fff0";
        tag.style.background = "rgba(0, 255, 240, 0.08)";
      }
    });
  });
}

function initStatusMemoryFlicker() {
  const statusItems = document.querySelectorAll(
    ".status-bar__item:not(.status-bar__item--secure)"
  );

  setInterval(function () {
    const randomIndex = Math.floor(Math.random() * statusItems.length);
    const item = statusItems[randomIndex];
    if (!item) return;

    const originalOpacity = item.style.opacity || "1";
    item.style.opacity = "0.3";
    item.style.transition = "opacity 0.1s";

    setTimeout(function () {
      item.style.opacity = "1";
      item.style.transition = "opacity 0.3s";
    }, 100);
  }, 8000);
}

function initSignalBars() {
  const bars = document.querySelectorAll(".signal-strength__bar:not(.signal-strength__bar--dead)");

  setInterval(function () {
    const randomIndex = Math.floor(Math.random() * bars.length);
    const bar = bars[randomIndex];
    if (!bar) return;

    const originalOpacity = bar.style.opacity || "1";
    bar.style.opacity = "0.2";
    bar.style.transition = "opacity 0.15s";

    setTimeout(function () {
      bar.style.opacity = "1";
      bar.style.transition = "opacity 0.3s";
    }, 200);
  }, 5000);
}

function initCpuMemFlicker() {
  const statusRight = document.querySelector(".status-bar__right");
  if (!statusRight) return;

  const items = statusRight.querySelectorAll(".status-bar__item");

  setInterval(function () {
    const memItem = items[0];
    const cpuItem = items[1];

    if (memItem) {
      const memBase = 847;
      const memVariation = Math.floor(Math.random() * 60) - 30;
      const memValue = memBase + memVariation;
      memItem.textContent = "MEM: " + memValue + "/1024 MB";
    }

    if (cpuItem) {
      const cpuBase = 34;
      const cpuVariation = Math.floor(Math.random() * 20) - 10;
      const cpuValue = Math.max(10, cpuBase + cpuVariation);
      cpuItem.textContent = "CPU: " + cpuValue + "%";
    }
  }, 4000);
}

function initEncryptionStatusFlicker() {
  const encSub = document.querySelector(".encryption-status__sub");
  if (!encSub) return;

  const states = ["ACTIVE", "ROTATING", "ACTIVE", "ACTIVE", "REFRESH"];
  let currentIndex = 0;

  setInterval(function () {
    currentIndex = (currentIndex + 1) % states.length;
    encSub.textContent = states[currentIndex];

    if (states[currentIndex] !== "ACTIVE") {
      encSub.style.color = "#ffaa00";
      setTimeout(function () {
        encSub.style.color = "";
      }, 1500);
    }
  }, 10000);
}

function init() {
  initEncryptedText();
  initSystemClock();
  initUptimeCounter();
  initNodeCount();
  initTraceWarning();
  initNotifications();
  initFeedTabs();
  initActivityFeed();
  initCodeCopy();
  initPostActions();
  initReputationBadges();
  initGlitchAvatars();
  initTagCloud();
  initStatusMemoryFlicker();
  initSignalBars();
  initCpuMemFlicker();
  initEncryptionStatusFlicker();
}

document.addEventListener("DOMContentLoaded", init);