/* ============================================================
   HUGINN & MUNINN — The Allfather's Message Web
   Interactive JavaScript
   ============================================================ */

(() => {
  'use strict';

  // ===== STATE =====
  const state = {
    currentRealm: 'asgard',
    runicMode: false,
    glowIntensity: 70,
    soundEnabled: true,
    atmosphereEnabled: true,
    crownStyle: 'iron',
    isRecording: false,
    messages: {},
    typingUsers: [],
    unreadCounts: {
      asgard: 0, midgard: 0, helheim: 0, jotunheim: 0,
      vanaheim: 0, alfheim: 0, muspelheim: 0, niflheim: 0
    }
  };

  // ===== RUNE TRANSLITERATION MAP =====
  const runeMap = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚳ', 'd': 'ᛞ', 'e': 'ᛖ',
    'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚻ', 'i': 'ᛁ', 'j': 'ᛃ',
    'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᚮ',
    'p': 'ᛈ', 'q': 'ᕴ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ',
    'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛉ', 'y': 'ᚣ',
    'z': 'ᛉ',
    'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᚳ', 'D': 'ᛞ', 'E': 'ᛖ',
    'F': 'ᚠ', 'G': 'ᚷ', 'H': 'ᚻ', 'I': 'ᛁ', 'J': 'ᛃ',
    'K': 'ᚲ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᚮ',
    'P': 'ᛈ', 'Q': 'ᕴ', 'R': 'ᚱ', 'S': 'ᛊ', 'T': 'ᛏ',
    'U': 'ᚢ', 'V': 'ᚹ', 'W': 'ᚹ', 'X': 'ᛉ', 'Y': 'ᚣ',
    'Z': 'ᛉ',
    ' ': ' ᚷ', '.': ' ᛫', ',': ' ᚸ', '!': ' ᛜ', '?': ' ᛝ',
    ':': ' ᛝ', ';': ' ᛞ', '-': ' ᚾ', '—': ' ᛞᚾ', '\n': '\n'
  };

  const reverseRuneMap = {};
  Object.keys(runeMap).forEach(k => {
    if (k.length === 1 && k !== ' ' && k !== '\n') {
      reverseRuneMap[runeMap[k]] = k;
    }
  });

  // ===== MESSAGE DATA FOR EACH REALM =====
  const realmMessages = {
    asgard: [
      {
        sender: 'odin', name: 'Odin — Allfather', avatar: '👁️',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 3',
        text: 'Huginn returns with tidings from Midgard. The mortals gather at the great hall of digital discourse. What wisdom shall we impart?',
        runic: 'ᚻᚢᚴᛁᚾᚾ ᚱᛖᛏᚢᚱᚾᛋ ᚹᛁᚦ ᛏᛁᛞᛁᚾᚷᛋ ᚠᚱᚩᛗ ᛗᛁᚦᚴᚨᚱᚦ.',
        reactions: { '🍻': 8, 'ᚱ': 12, '🕊️': 12 },
        bgClass: 'message-asgard'
      },
      {
        sender: 'thor', name: 'Thor — Thunderer', avatar: '🔨',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 7',
        text: 'By the forge of Eitri! Someone has been meddling with the Bifrost again. The colors are all wrong — there\'s a faint smell of Jotun magic in the rainbow.',
        runic: 'ᛖᛁᚾᛁ ᚼᚠᛏ ᛘᛖᚦᛚᛁ ᚢᛁᚦ ᛒᛁᚠᚱᚮᛋᛏ ᛁᚾᚾ ᚠᚱᚨ.',
        reactions: { '⚡': 15, 'ᚱ': 29, '🕊️': 29 },
        bgClass: 'message-asgard'
      },
      {
        sender: 'freyja', name: 'Freyja — Vanadis', avatar: '🌹',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 12',
        text: 'Father, your ravens whisper too loudly in the gardens. I have chosen three more fallen warriors for my hall. Sessrúmnir grows crowded with heroes.',
        runic: 'ᚠᚨᚦᛖᚱ, ᚣᚱ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ ᛁᚾ ᚵᚢᚱᛏᚢᛗ? ᛋᛖᛋᚱᚢᛘᚾᛁᚱ ᚵᛖᚻᚱᛁᛁᛏ ᛋᚢᚱ ᚻᛖᚱᛁᚨ.',
        reactions: { '🌸': 7, 'ᚱ': 18, '🕊️': 18 },
        bgClass: 'message-asgard freyja-bubble'
      },
      {
        sender: 'loki', name: 'Loki — Trickster', avatar: '🔱',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 15',
        text: 'I assure you, Thor, I had nothing to do with the Bifrost discoloration. Must be the dwarves. Those lads always leave their mark — literally.\n\n…I may have borrowed the forge key. For research.',
        runic: 'ᛖᚴ ᚲᚨᚾ ᚼᚨᚠᛖ ᚠᛁᛚᛁ ᚠᛁᚾᚾ ᚠᚠᚱᚨ ᚴᛚᛁᚢ. ᚠᚢᚱ ᚱᚢᚾᚨᚱ.',
        reactions: { '🕵️': 19, 'ᚱ': 47, '🕊️': 47 },
        bgClass: 'message-asgard loki-bubble'
      },
      {
        sender: 'tyr', name: 'Tyr — the Bold', avatar: '⚔️',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 18',
        text: 'Ragnarök draws closer with each cycle. I say we prepare the Einherjar. What use are prophecies if we do not act upon them?',
        runic: 'ᚻᚢᚴ ᛁᛋ ᚱᚨᛞ ᚷᛖᚾᛏᚮ ᚦᚪᛗ ᚢᚠᛏᛁᚱ ᚦᚢᛗ ᚠᛁᚦᚱᛁ?',
        reactions: { '🗡️': 4, 'ᚱ': 7, '🕊️': 7 },
        bgClass: 'message-asgard'
      }
    ],
    midgard: [
      {
        sender: 'beowulf', name: 'Beowulf — Slayer', avatar: '⚔️',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 2',
        text: 'We have felled the beast in the marsh. Its bones shall make a fine trophy for the mead hall. Send ravens to Odin — we feast tonight!',
        runic: '᛹ ᚢᚱᚦᛖ ᛏᛖᚾ ᚠᛖᛚᛚ ᚦᚨᛗ ᛒᛠᛋᛏ ᛁᚾ ᚦᛖ ᛗᚨᚱᛋᚺ. ᚢᚱ ᛑᚩᚲᚺᚱᛖ ᚱᚨᚢᚾᚱ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '🍻': 22, '⚔️': 14, '🕊️': 10 },
        bgClass: 'message-midgard'
      },
      {
        sender: 'sigurd', name: 'Sigurd — Dragon-Slayer', avatar: '🐉',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 5',
        text: 'The dragon\'s hoard is mine. Its fire could not touch Fáfnir\'s blade. Beware, Loki — gold cursed is gold that burns the hand.',
        runic: 'ᚦᛖ ᚴᚱᚨᚷᛖᚾᛋ ᚲᚩᛁᚾ ᛁᛋ ᛗᛁᚾᛖ. ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '🔥': 11, 'ᚱ': 8, '🕊️': 8 },
        bgClass: 'message-midgard'
      },
      {
        sender: 'odin', name: 'Odin — Allfather', avatar: '👁️',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 9',
        text: 'Midgard grows restless. The kingdoms shift like sand. I see a great wyrm rising from the east. Prepare, sons of men.',
        runic: 'ᛗᛁᚦᚲᚨᚱᛏ ᚷᛖᚹᛟᚱᛞᛖᛏ. ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '🍻': 16, 'ᚱ': 21, '🕊️': 20 },
        bgClass: 'message-midgard'
      }
    ],
    helheim: [
      {
        sender: 'hel', name: 'Hel — Queen of the Dead', avatar: '💀',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 1',
        text: 'The gates grow heavy. Another century of souls weighs upon my hall. Even death tires of its own abundance. Send fewer, living ones.',
        runic: 'ᚺᛖᛚ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '💀': 6, 'ᚱ': 3, '🕊️': 2 },
        bgClass: 'message-helheim'
      },
      {
        sender: 'eirikr', name: 'Eiríkr — Halfdan\'s Son', avatar: '🧟',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 4',
        text: 'I remember the cold. I remember the light. Now I remember neither. Is this peace? Or merely forgetting?',
        runic: 'ᛖᛁᚱᛁᚴᚱ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '💀': 2, 'ᚱ': 1, '🕊️': 3 },
        bgClass: 'message-helheim'
      }
    ],
    jotunheim: [
      {
        sender: 'thrym', name: 'Thrym — Frost Giant King', avatar: '🧊',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 6',
        text: 'Your precious rainbow bridge trembles when the frost deepens. We remember when the ice was unbroken. We remember everything.',
        runic: 'ᚦᚱᚣᛗ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '🧊': 9, 'ᚱ': 4, '🕊️': 1 },
        bgClass: 'message-jotunheim'
      },
      {
        sender: 'angrboda', name: 'Angrboða — Loki\'s Kin', avatar: '🌑',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 11',
        text: 'The children are restless. The world serpent stirs in the deep places. Ragnarök is not a prophecy — it is a promise we made to the void.',
        runic: 'ᚨᚾᚴᚱᛒᚩᛞᚨ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '🐍': 7, '🔥': 5, 'ᚱ': 3 },
        bgClass: 'message-jotunheim'
      }
    ],
    vanaheim: [
      {
        sender: 'nerthus', name: 'Nerthus — Earth Mother', avatar: '🌿',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 3',
        text: 'The Vanir remember what the Æsir have forgotten. Fertility is not given — it is exchanged. Every harvest demands a promise.',
        runic: 'ᚾᛖᚱᚦᚢᛋ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '🌿': 10, 'ᚱ': 5, '🕊️': 4 },
        bgClass: 'message-vanaheim'
      },
      {
        sender: 'frey', name: 'Frey — Lord of Light Elves', avatar: '☀️',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 8',
        text: 'Álfheim shines eternal. We do not need your Midgard sun. Our light comes from within, as it always has for the Van.',
        runic: 'ᚨᛚᚠᚼᛁᛗ ᚻᛁᛘᛁᚱ ᛖᚠᛏᛖᚱ ᚢᛏ.',
        reactions: { '✨': 12, 'ᚱ': 6, '🕊️': 5 },
        bgClass: 'message-vanaheim'
      }
    ],
    alfheim: [
      {
        sender: 'fey', name: 'Fey — Light Elf Elder', avatar: '🌟',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 4',
        text: 'Our crystal spires sing in the aurora. You call it Alfheim — we call it home. The light here has memory, you know.',
        runic: 'ᚠᛖᚢ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ.',
        reactions: { '✨': 15, '🌟': 8, 'ᚱ': 3 },
        bgClass: 'message-alfheim'
      },
      {
        sender: 'luminous', name: 'Luminous — Star Weaver', avatar: '💫',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 10',
        text: 'I have woven a new constellation in the shape of a great boar. May it guide the wanderers of all realms.',
        runic: 'ᛚᚢᛗᛁᚾᛟᚢᛋ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '💫': 9, '🌟': 7, 'ᚱ': 4 },
        bgClass: 'message-alfheim'
      }
    ],
    muspelheim: [
      {
        sender: 'surtur', name: 'Surtur — Fire Giant Lord', avatar: '🔥',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 1',
        text: 'The forge never rests. Every ember carries a memory of Ragnarök. When the time comes, my fire will touch even the roots of Yggdrasil.',
        runic: 'ᛋᚢᚱᛏᚢᚱ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '🔥': 18, '💀': 3, 'ᚱ': 6 },
        bgClass: 'message-muspelheim'
      },
      {
        sender: 'sinmara', name: 'Sinmara — Keeper of Lævateinn', avatar: '🔮',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 7',
        text: 'The Lævateinn hums with old power. Surtur\'s fire alone is not enough. We need the spark of prophecy to ignite the final flame.',
        runic: 'ᛋᛁᚾᛘᚨᚱᚨ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '🔮': 5, '🔥': 8, 'ᚱ': 2 },
        bgClass: 'message-muspelheim'
      }
    ],
    niflheim: [
      {
        sender: 'nidhogg', name: 'Níðhöggr — The Malice Striker', avatar: '🐉',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 1',
        text: 'I chew upon the roots from below. The world tree groans. Even Yggdrasil knows fear — it is only a matter of time before the roots give way.',
        runic: 'ᚾᛁᚦᚺᚩᚲᚴᚱ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '🐉': 6, '💀': 4, 'ᚱ': 2 },
        bgClass: 'message-niflheim'
      },
      {
        sender: 'audhumbla', name: 'Auðumbla — The Primeval Cow', avatar: '🐄',
        time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ 2',
        text: 'Before the gods, before the ice, there was only me and the salt. I remember the first drops of milk falling into the void. Simplicity was beautiful.',
        runic: 'ᚨᚢᚦᚢᛗᛒᛚᚨ ᚱᚢᚾᛁᚾ ᚱᚢᚾ.',
        reactions: { '🐄': 4, '❄️': 7, 'ᚱ': 1 },
        bgClass: 'message-niflheim'
      }
    ]
  };

  // DM Messages
  const dmMessages = {
    'dm-odin': [
      { sender: 'odin', name: 'Odin — Allfather', avatar: '👁️', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', text: 'I see all things, child. Speak freely — the ravens carry every whisper to my throne.', runic: 'ᚩᛞᛁᚾ ᚱᚢᚾᛁᚾ ᚱᚢᚾ', bgClass: 'message-asgard' },
      { sender: 'user', name: 'You', avatar: '🧑', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', text: 'Allfather, what counsel do you offer in these troubled times?', runic: 'ᚦᚢ ᚱᚢᚾᛁᚾ ᚱᚢᚾ', bgClass: 'message-user' }
    ],
    'dm-thor': [
      { sender: 'thor', name: 'Thor — Thunderer', avatar: '🔨', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', text: 'Bring me your enemies\' skulls and I will make a goblet for each of you. Do not test my patience — Mjölnir is always hungry.', runic: 'ᚦᚩᚱ ᚱᚢᚾᛁᚾ ᚱᚢᚾ', bgClass: 'message-asgard' }
    ],
    'dm-freyja': [
      { sender: 'freyja', name: 'Freyja — Vanadis', avatar: '🌹', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', text: 'The Brísingamen catches the starlight beautifully tonight. Come, walk with me through the gardens of Fólkvangr.', runic: 'ᚠᚱᛖᚣᚠᚨ ᚱᚢᚾᛁᚾ ᚱᚢᚾ', bgClass: 'message-freyja-bubble' }
    ],
    'dm-loki': [
      { sender: 'loki', name: 'Loki — Trickster', avatar: '🔱', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', text: 'Between you and me, child... I know things. Terrible, wonderful things. But secrets are more fun shared, aren\'t they?', runic: 'ᛚᚩᚴᛁ ᚱᚢᚾᛁᚾ ᚱᚢᚾ', bgClass: 'message-loki-bubble' }
    ]
  };

  // ===== DOM REFERENCES =====
  const dom = {
    bifrostOverlay: document.getElementById('bifrost-overlay'),
    ravenContainer: document.getElementById('raven-container'),
    raven1: document.getElementById('raven-1'),
    raven2: document.getElementById('raven-2'),
    channelButtons: document.querySelectorAll('.channel-btn'),
    messagesContainer: document.getElementById('messages-container'),
    chatHeader: document.getElementById('chat-header'),
    realmBadge: document.getElementById('realm-badge'),
    chatHeaderTitle: document.querySelector('.chat-header-title'),
    activeCount: document.querySelector('.active-count'),
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('btn-send'),
    voiceBtn: document.getElementById('btn-voice'),
    runicToggle: document.getElementById('btn-runic-toggle'),
    runicIndicator: document.getElementById('runic-indicator'),
    runicToggleSetting: document.getElementById('runic-toggle-setting'),
    atmosphereToggle: document.getElementById('atmosphere-toggle'),
    glowIntensity: document.getElementById('glow-intensity'),
    glowValue: document.getElementById('glow-value'),
    soundToggle: document.getElementById('sound-toggle'),
    settingsModal: document.getElementById('settings-modal'),
    searchModal: document.getElementById('search-modal'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    typingIndicator: document.getElementById('typing-indicator'),
    realmInfoContent: document.getElementById('realm-info-content'),
    notifList: document.getElementById('notif-list'),
    btnSearch: document.getElementById('btn-search'),
    btnNotifications: document.getElementById('btn-notifications'),
    btnSettings: document.getElementById('btn-settings'),
    modalClose: document.getElementById('modal-close'),
    searchModalClose: document.getElementById('search-modal-close'),
    modalSave: document.getElementById('modal-save'),
    modalCancel: document.getElementById('modal-cancel'),
    btnNewMessage: document.getElementById('btn-new-message'),
    btnAttach: document.getElementById('btn-attach'),
    userList: document.getElementById('user-list')
  };

  // ===== REALM CONFIGURATION =====
  const realmConfig = {
    asgard: {
      name: 'Asgard', subtitle: 'Hall of the Æsir', icon: '⚡',
      users: ['odin', 'thor', 'freyja', 'loki', 'tyr', 'heimdall', 'bragi'],
      activeCount: 7, colorClass: 'realm-asgard',
      channelClass: 'realm-asgard', emptyEmoji: '⚡'
    },
    midgard: {
      name: 'Midgard', subtitle: 'Realm of Mortals', icon: '🌍',
      users: ['beowulf', 'sigurd', 'ragnar'],
      activeCount: 12, colorClass: 'realm-midgard',
      channelClass: 'realm-midgard', emptyEmoji: '🌍'
    },
    helheim: {
      name: 'Helheim', subtitle: 'Hall of the Dishonored Dead', icon: '💀',
      users: ['hel', 'eirikr'],
      activeCount: 3, colorClass: 'realm-helheim',
      channelClass: 'realm-helheim', emptyEmoji: '💀'
    },
    jotunheim: {
      name: 'Jotunheim', subtitle: 'Land of the Frost Giants', icon: '🧊',
      users: ['thrym', 'angrboda'],
      activeCount: 5, colorClass: 'realm-jotunheim',
      channelClass: 'realm-jotunheim', emptyEmoji: '🧊'
    },
    vanaheim: {
      name: 'Vanaheim', subtitle: 'Home of the Vanir', icon: '🌊',
      users: ['nerthus', 'frey', 'fjorn'],
      activeCount: 4, colorClass: 'realm-vanaheim',
      channelClass: 'realm-vanaheim', emptyEmoji: '🌊'
    },
    alfheim: {
      name: 'Alfheim', subtitle: 'Land of the Light Elves', icon: '✨',
      users: ['fey', 'luminous', 'aurora'],
      activeCount: 6, colorClass: 'realm-alfheim',
      channelClass: 'realm-alfheim', emptyEmoji: '✨'
    },
    muspelheim: {
      name: 'Muspelheim', subtitle: 'Realm of Fire', icon: '🔥',
      users: ['surtur', 'sinmara'],
      activeCount: 8, colorClass: 'realm-muspelheim',
      channelClass: 'realm-muspelheim', emptyEmoji: '🔥'
    },
    niflheim: {
      name: 'Niflheim', subtitle: 'The Primordial Frost', icon: '🌫️',
      users: ['nidhogg', 'audhumbla'],
      activeCount: 2, colorClass: 'realm-niflheim',
      channelClass: 'realm-niflheim', emptyEmoji: '🌫️'
    }
  };

  // ===== UTILITY: Latin to Runic Transliteration =====
  function toRunic(text) {
    return text.split('').map(char => runeMap[char] || char).join('');
  }

  function fromRunic(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (reverseRuneMap[char]) {
        result += reverseRuneMap[char];
      } else if (char === 'ᚷ') {
        result += ' ';  // word separator rune
      } else {
        result += char;
      }
    }
    return result;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== SOUND ENGINE (Web Audio) =====
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playRavenWingSound() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) { /* ignore */ }
  }

  function playBifrostSound() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) { /* ignore */ }
  }

  function playMessageReceiveSound() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* ignore */ }
  }

  // ===== BIFROST ANIMATION =====
  function triggerBifrost(callback) {
    initAudio();
    playBifrostSound();
    dom.bifrostOverlay.classList.add('active');
    setTimeout(() => {
      dom.bifrostOverlay.classList.remove('active');
      if (callback) callback();
    }, 1000);
  }

  // ===== RAVEN FLIGHT ANIMATION =====
  function launchRavenFlight(onComplete) {
    const raven = state.currentRealm === 'helheim' || state.currentRealm === 'niflheim' ? dom.raven2 : dom.raven1;

    raven.classList.add('active');

    const svg = raven.querySelector('.raven-svg');
    svg.style.filter = 'drop-shadow(0 0 6px rgba(184, 134, 11, 0.6))';

    playRavenWingSound();

    setTimeout(() => {
      raven.classList.remove('active');
      svg.style.filter = '';
      if (onComplete) onComplete();
    }, 4000);
  }

  // ===== CHANNEL SWITCHING =====
  function switchRealm(realmId) {
    if (state.currentRealm === realmId) return;

    const prevBtn = dom.channelButtons.find(btn => btn.dataset.channel === state.currentRealm);
    const newBtn = dom.channelButtons.find(btn => btn.dataset.channel === realmId);

    if (prevBtn) {
      prevBtn.classList.remove('active');
      prevBtn.setAttribute('aria-pressed', 'false');
    }
    if (newBtn) {
      newBtn.classList.add('active');
      newBtn.setAttribute('aria-pressed', 'true');
    }

    // Update body class for realm theme
    document.body.classList.remove(`realm-${state.currentRealm}`);
    document.body.classList.add(`realm-${realmId}`);

    const config = realmConfig[realmId];
    if (!config) return;

    triggerBifrost(() => {
      state.currentRealm = realmId;

      // Update header
      dom.realmBadge.textContent = config.name;
      dom.realmBadge.className = 'realm-badge ' + config.channelClass;
      dom.chatHeaderTitle.textContent = `${config.name} — ${config.subtitle}`;
      dom.activeCount.textContent = `${config.activeCount} ravens circling`;

      // Update chat header accent
      updateChatHeaderStyle();

      // Render messages
      renderMessages(realmId);

      // Update user panel for this realm
      updateUserPanel(realmId);

      // Update realm stats
      updateRealmStats(realmId);

      // Update unread count
      state.unreadCounts[realmId] = 0;
      updateChannelCounts();

      // Auto-scroll
      requestAnimationFrame(() => {
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
      });

      // Trigger ambient effects
      triggerRealmParticles(realmId);
    });
  }

  function updateChatHeaderStyle() {
    const realm = state.currentRealm;
    const configs = {
      asgard: { accent: 'var(--asgard-gold)', bg: 'rgba(212,184,74,0.08)' },
      midgard: { accent: 'var(--midgard-green)', bg: 'rgba(74,140,63,0.08)' },
      helheim: { accent: 'var(--helheim-purple)', bg: 'rgba(107,63,160,0.08)' },
      jotunheim: { accent: 'var(--jotunheim-blue)', bg: 'rgba(43,108,176,0.08)' },
      vanaheim: { accent: 'var(--vanaheim-teal)', bg: 'rgba(45,138,124,0.08)' },
      alfheim: { accent: 'var(--alfheim-cream)', bg: 'rgba(200,168,110,0.08)' },
      muspelheim: { accent: 'var(--muspelheim-red)', bg: 'rgba(184,69,42,0.08)' },
      niflheim: { accent: 'var(--niflheim-gray)', bg: 'rgba(90,106,122,0.08)' }
    };
    const c = configs[realm] || configs.asgard;
    dom.chatHeader.style.borderBottomColor = c.accent;
    dom.chatHeader.style.background = `linear-gradient(180deg, ${c.bg}, var(--wood-mid))`;
  }

  function renderMessages(realmId) {
    // Determine message source
    let messages;
    if (realmId.startsWith('dm-')) {
      messages = dmMessages[realmId] || [];
    } else {
      messages = realmMessages[realmId] || [];
    }

    dom.messagesContainer.innerHTML = '';

    // System message
    const config = realmConfig[realmId] || { name: realmId, icon: 'ᚱ' };
    const systemHTML = `
      <div class="message system-message">
        <div class="system-text">
          <span class="rune-small">ᚱ</span>
          The thread of fate connects you to <strong>${config.name}</strong>. ${config.activeCount} ravens watch from the high boughs.
          <span class="rune-small">ᛗ</span>
        </div>
      </div>
    `;

    // Date separator
    const dateHTML = `<div class="date-separator"><span>— ᚱᚢᚾ ᛞᚨᚷ — Today, 9th of Sólmánuðr — ᚱᚢᚾ ᛞᚨᚷ —</span></div>`;

    dom.messagesContainer.innerHTML = systemHTML + dateHTML;

    // Render each message with staggered animation
    messages.forEach((msg, idx) => {
      const runicContent = msg.runic || toRunic(msg.text);
      const messageEl = createMessageElement(msg, runicContent, idx);
      dom.messagesContainer.appendChild(messageEl);
    });

    // Add some ambient runic decorations at the bottom
    const decoration = document.createElement('div');
    decoration.className = 'date-separator';
    decoration.innerHTML = `<span>ᚱᚢᚾᛁᚾ ᚱᚢᚾᛁ ᚱᚢᚾᚢ — ${config.icon} — ᚱᚢᚾᛁᚾ ᚱᚢᚾᚢ</span>`;
    dom.messagesContainer.appendChild(decoration);
  }

  function createMessageElement(msg, runicContent, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    wrapper.dataset.sender = msg.sender;
    wrapper.dataset.index = index;

    const isUser = msg.sender === 'user';
    const runicId = 'runic-' + Date.now() + '-' + index;

    const reactionsHTML = Object.entries(msg.reactions || {}).map(([emoji, count]) =>
      `<button class="reaction-btn" title="${emoji}">${emoji}</button>`
    ).join('');

    const totalReactions = Object.values(msg.reactions || {}).reduce((a, b) => a + b, 0);

    wrapper.innerHTML = `
      <div class="message-avatar ${msg.bgClass.replace('message-', '').replace('-bg', '')}-avatar">
        <span class="avatar-symbol">${msg.avatar}</span>
      </div>
      <div class="message-bubble ${msg.bgClass || ''}">
        <div class="message-sender-info">
          <span class="sender-name ${'sender-' + msg.sender}">${escapeHtml(msg.name)}</span>
          <span class="message-time">${msg.time || 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ'}</span>
        </div>
        <div class="message-content">
          <p>${escapeHtml(msg.text)}</p>
          <div class="runic-transliteration" id="${runicId}" data-original="${escapeHtml(msg.text)}">${runicContent}</div>
        </div>
        <div class="message-meta">
          <span class="message-reaction-btns">${reactionsHTML}</span>
          <span class="reaction-count">${totalReactions || 0} ravens delivered</span>
        </div>
      </div>
    `;

    return wrapper;
  }

  // ===== USER PANEL UPDATES =====
  function updateUserPanel(realmId) {
    // We keep the full user list but highlight active realm
    dom.userList.querySelectorAll('.user-group-label').forEach(label => {
      label.style.opacity = '0.4';
    });
    // In a full app, this would filter by realm
  }

  function updateRealmStats(realmId) {
    const config = realmConfig[realmId];
    if (!config) return;

    const statMessages = dom.realmInfoContent.querySelector('#stat-messages');
    const statRavens = dom.realmInfoContent.querySelector('#stat-ravens');

    if (statMessages) statMessages.textContent = 100 + Math.floor(Math.random() * 200);
    if (statRavens) statRavens.textContent = config.activeCount * 6;
  }

  // ===== CHANNEL BUTTON HANDLERS =====
  dom.channelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const channel = btn.dataset.channel;
      if (channel) {
        switchRealm(channel);
      }
    });
  });

  // ===== SEND MESSAGE =====
  function sendMessage() {
    const text = dom.messageInput.value.trim();
    if (!text) return;

    initAudio();

    const runicText = state.runicMode ? toRunic(text) : '';

    const newMsg = {
      sender: 'user',
      name: 'You — Wanderer',
      avatar: '🧑',
      time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ',
      text: text,
      runic: runicText,
      reactions: {},
      bgClass: 'message-user'
    };

    // Append to local messages array
    if (!state.messages[state.currentRealm]) {
      state.messages[state.currentRealm] = [];
    }
    state.messages[state.currentRealm].push(newMsg);

    // Clear input
    dom.messageInput.value = '';
    dom.messageInput.style.height = 'auto';

    // Create message element
    const messageEl = createMessageElement(newMsg, runicText || toRunic(text), 0);
    dom.messagesContainer.appendChild(messageEl);

    // Scroll to bottom
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;

    // Launch raven
    launchRavenFlight();

    // Simulate typing indicator from a random sender
    simulateTyping();

    // Simulate reply after delay
    setTimeout(() => {
      if (state.currentRealm === 'asgard') {
        simulateReply();
      }
    }, 3000 + Math.random() * 4000);
  }

  function simulateReply() {
    const replies = [
      { sender: 'odin', name: 'Odin — Allfather', avatar: '👁️', text: 'Well spoken, wanderer. The Norns have taken note of your words. Your thread is woven into the tapestry.', runic: 'ᚹᛖᛚᛚ ᛋᛈᚮᚲᛖᚾ, ᚹᚨᚾᛞᛖᚱᛖᚱ. ᚦᛖ ᚾᚩᚱᚾᛋ ᚼᚨᚡᛖ ᛏᚨᚲᚲᚾ ᚾᚩᛏᛖ ᚩᚠ ᚣᚩᚢᚱ ᚹᚩᚱᛞᛊ.' },
      { sender: 'freyja', name: 'Freyja — Vanadis', avatar: '🌹', text: 'A new voice rises in Asgard! I shall watch over your fate with great interest, mortal... or god.', runic: 'ᚨ ᚾᛖᚹ ᚹᚩᛁᛊᛖ ᚱᛁᛋᛖᛋ ᛁᚾ ᚨᛋᚴᛁ! ᛁ ᛋᚻᚨᛚᛚ ᚹᚨᛏᚳᚻ ᚩᚢᚱ ᚠᚨᛏᛖ ᚹᛁᚦ ᚷᚱᛖᚨᛏ ᛁᚾᛏᛖᚱᛖᛥ.' },
      { sender: 'loki', name: 'Loki — Trickster', avatar: '🔱', text: 'Oh how delightful, a new plaything! Do be careful — not everything is as it seems in the halls of the gods.', runic: 'ᚦᚢ ᚱᚢᚾᛁᚾ ᚱᚢᚾ ᚱᚢᚾ.' }
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];
    const runicReply = toRunic(reply.text);
    const replyEl = createMessageElement(
      { ...reply, runic: runicReply, bgClass: reply.sender === 'loki' ? 'message-asgard loki-bubble' : 'message-asgard', time: 'ᚱᚢᚾᛖᚱ ᚱᚢᚾ', reactions: {} },
      runicReply,
      0
    );

    dom.messagesContainer.appendChild(replyEl);
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    playMessageReceiveSound();
  }

  function simulateTyping() {
    const typers = ['Thor is typing...', 'Freyja is composing a verse...', 'Loki is thinking of something mischievous...'];
    const typer = typers[Math.floor(Math.random() * typers.length)];

    dom.typingIndicator.textContent = typer;
    setTimeout(() => {
      dom.typingIndicator.textContent = '';
    }, 3000);
  }

  dom.sendBtn.addEventListener('click', sendMessage);

  dom.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  dom.messageInput.addEventListener('input', () => {
    dom.messageInput.style.height = 'auto';
    dom.messageInput.style.height = Math.min(dom.messageInput.scrollHeight, 120) + 'px';
  });

  // ===== RUNIC TRANSLITERATION TOGGLE =====
  function toggleRunicMode(forceState) {
    state.runicMode = typeof forceState === 'boolean' ? forceState : !state.runicMode;

    dom.runicToggle.classList.toggle('active', state.runicMode);
    dom.runicToggleSetting.checked = state.runicMode;

    if (state.runicMode) {
      dom.runicIndicator.style.display = 'block';
      // Show all runic transliterations
      document.querySelectorAll('.runic-transliteration').forEach(el => {
        el.classList.add('visible');
      });
    } else {
      dom.runicIndicator.style.display = 'none';
      document.querySelectorAll('.runic-transliteration').forEach(el => {
        el.classList.remove('visible');
      });
    }

    // Update glow intensity
    updateGlowIntensity();
  }

  dom.runicToggle.addEventListener('click', () => toggleRunicMode());
  dom.runicToggleSetting.addEventListener('change', (e) => toggleRunicMode(e.target.checked));

  // ===== REACTION HANDLER =====
  dom.messagesContainer.addEventListener('click', (e) => {
    const reactionBtn = e.target.closest('.reaction-btn');
    if (!reactionBtn) return;

    const emoji = reactionBtn.textContent;
    const meta = reactionBtn.closest('.message-meta');
    const countEl = meta.querySelector('.reaction-count');

    let count = parseInt(countEl.textContent) || 0;
    count++;
    countEl.textContent = count + ' ravens delivered';

    // Brief pulse animation
    reactionBtn.style.transform = 'scale(1.4)';
    reactionBtn.style.background = 'rgba(184, 134, 11, 0.3)';
    setTimeout(() => {
      reactionBtn.style.transform = '';
      reactionBtn.style.background = '';
    }, 200);

    playRavenWingSound();
  });

  // ===== SEARCH MODAL =====
  dom.btnSearch.addEventListener('click', () => {
    dom.searchModal.style.display = 'flex';
    setTimeout(() => dom.searchInput.focus(), 100);
  });

  dom.searchModalClose.addEventListener('click', () => {
    dom.searchModal.style.display = 'none';
  });

  dom.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const results = dom.searchResults;

    if (query.length < 2) {
      results.innerHTML = '<p style="font-family: MedievalSharp; color: var(--text-muted); padding: 12px; text-align: center;">ᚠᚢᚦᚩᚱ ᚹᚩᚱᛞ — Type more runes to search...</p>';
      return;
    }

    // Search through all messages
    let found = [];
    Object.entries(realmMessages).forEach(([realm, msgs]) => {
      msgs.forEach(msg => {
        if (msg.text.toLowerCase().includes(query)) {
          found.push({ realm, text: msg.text, sender: msg.name, time: msg.time });
        }
      });
    });

    if (found.length === 0) {
      results.innerHTML = '<p style="font-family: MedievalSharp; color: var(--text-muted); padding: 12px; text-align: center;">No glyphs found matching your query.</p>';
      return;
    }

    results.innerHTML = found.map(item => `
      <div class="search-result-item" data-realm="${item.realm}">
        <span class="search-realm-badge ${realmConfig[item.realm]?.channelClass || 'realm-asgard'}">${realmConfig[item.realm]?.name || item.realm}</span>
        <p>${escapeHtml(item.text).replace(new RegExp(escapeHtml(query), 'gi'), m => `<mark style="background: rgba(184,134,11,0.4); color: var(--gold-bright); padding: 0 2px; border-radius: 2px;">${m}</mark>`)}</p>
        <small>${item.sender} · ${item.time || 'recent'}</small>
      </div>
    `).join('');

    // Click to switch realm
    results.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const realm = el.dataset.realm;
        dom.searchModal.style.display = 'none';
        dom.searchInput.value = '';
        switchRealm(realm);
      });
    });
  });

  // ===== SETTINGS MODAL =====
  dom.btnSettings.addEventListener('click', () => {
    dom.settingsModal.style.display = 'flex';
  });

  dom.modalClose.addEventListener('click', () => {
    dom.settingsModal.style.display = 'none';
  });

  dom.modalCancel.addEventListener('click', () => {
    dom.settingsModal.style.display = 'none';
  });

  dom.modalSave.addEventListener('click', () => {
    state.runicMode = dom.runicToggleSetting.checked;
    state.atmosphereEnabled = dom.atmosphereToggle.checked;
    state.soundEnabled = dom.soundToggle.checked;
    state.glowIntensity = parseInt(dom.glowIntensity.value);

    toggleRunicMode(state.runicMode);
    updateGlowIntensity();

    dom.settingsModal.style.display = 'none';

    // Show save confirmation
    dom.modalSave.textContent = '✓ ᛋᚨᚢᚦᛖ — Saved';
    setTimeout(() => {
      dom.modalSave.textContent = 'Save — ᛋᚨᚢᚦᛖ';
    }, 1500);
  });

  // Glow intensity slider
  function updateGlowIntensity() {
    const val = state.glowIntensity;
    document.documentElement.style.setProperty('--glow-opacity', val / 100);
    dom.glowValue.textContent = val + '%';

    // Update all glow effects
    const glowElements = document.querySelectorAll('.glow-ring, .message-bubble, .sender-name');
    glowElements.forEach(el => {
      el.style.setProperty('--glow-factor', val / 100);
    });
  }

  dom.glowIntensity.addEventListener('input', (e) => {
    state.glowIntensity = parseInt(e.target.value);
    dom.glowValue.textContent = state.glowIntensity + '%';
    updateGlowIntensity();
  });

  // Crown selector
  document.querySelectorAll('.crown-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.crown-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.crownStyle = btn.dataset.crown;
      applyCrownStyle();
    });
  });

  function applyCrownStyle() {
    document.querySelectorAll('.sender-name').forEach(el => {
      el.classList.remove('crown-iron', 'crown-gold', 'crown-runic');
      switch (state.crownStyle) {
        case 'gold':
          el.classList.add('crown-gold');
          el.style.textShadow = '0 0 10px rgba(212,184,74,0.5), 0 2px 0 var(--gold-dark)';
          break;
        case 'runic':
          el.classList.add('crown-runic');
          el.style.textShadow = '0 0 12px rgba(184,134,11,0.6)';
          el.style.fontFamily = "'UnifrakturMaguntia', 'Cinzel', serif";
          break;
        case 'none':
          el.style.textShadow = 'none';
          break;
        case 'iron':
        default:
          el.classList.add('crown-iron');
          el.style.textShadow = '1px 1px 0 var(--iron-dark), 0 0 6px rgba(138,138,122,0.3)';
          break;
      }
    });
  }

  // ===== VOICE BUTTON =====
  dom.voiceBtn.addEventListener('click', () => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  function startRecording() {
    state.isRecording = true;
    dom.voiceBtn.classList.add('recording');
    dom.voiceBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    dom.voiceBtn.title = 'Release to send';
    simulateTyping();

    // Show audio waveform visualization
    showVoiceVisualization();
  }

  function stopRecording() {
    state.isRecording = false;
    dom.voiceBtn.classList.remove('recording');
    dom.voiceBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    dom.voiceBtn.title = 'Speak the ancient tongue';
    hideVoiceVisualization();
  }

  function showVoiceVisualization() {
    // Create a waveform visual beneath the input
    let viz = document.getElementById('voice-viz');
    if (!viz) {
      viz = document.createElement('div');
      viz.id = 'voice-viz';
      viz.style.cssText = 'height:30px;display:flex;align-items:flex-end;justify-content:center;gap:2px;padding:4px 20px;';
      const inputRow = dom.inputRow;
      inputRow.parentNode.insertBefore(viz, inputRow.nextSibling);

      for (let i = 0; i < 24; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = 'width:3px;background:var(--gold-dark);border-radius:1px;transition:height 0.1s;min-height:2px;';
        bar.style.height = '2px';
        viz.appendChild(bar);
      }
    }
    viz.style.display = 'flex';

    // Animate bars
    if (window._voiceInterval) clearInterval(window._voiceInterval);
    window._voiceInterval = setInterval(() => {
      const bars = viz.children;
      for (let i = 0; i < bars.length; i++) {
        const h = Math.random() * 24 + 2;
        bars[i].style.height = h + 'px';
        bars[i].style.background = `hsl(${36 + Math.random() * 10}, ${60 + Math.random() * 30}%, ${50 + Math.random() * 30}%)`;
      }
    }, 100);
  }

  function hideVoiceVisualization() {
    const viz = document.getElementById('voice-viz');
    if (viz) viz.style.display = 'none';
    if (window._voiceInterval) clearInterval(window._voiceInterval);
  }

  // ===== NEW MESSAGE (Quick action) =====
  dom.btnNewMessage.addEventListener('click', () => {
    dom.messageInput.focus();
    dom.messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // ===== ATTACH BUTTON (demo) =====
  dom.btnAttach.addEventListener('click', () => {
    alert('ᚱᚢᚾᛁᚳ ᚻᚢᚴᛁᚾᚾ — Attach a rune scroll (coming soon)');
  });

  // ===== NOTIFICATIONS BUTTON =====
  dom.btnNotifications.addEventListener('click', () => {
    const notifs = dom.notifList.querySelectorAll('.notif-item');
    let count = notifs.length;
    let msgs = ['The All-Seeing Eye watches over the realms:'];
    notifs.forEach((n, i) => {
      msgs.push(`${i + 1}. ${n.querySelector('.notif-text').textContent}`);
    });
    msgs.push(`\n— ${count} omens recorded`);
    alert(msgs.join('\n'));
  });

  // ===== AMBIENT PARTICLES =====
  function triggerRealmParticles(realmId) {
    if (!state.atmosphereEnabled) return;

    const particles = document.createElement('div');
    particles.className = 'realm-particles';
    particles.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 5000;
      overflow: hidden;
    `;
    document.body.appendChild(particles);

    const colors = {
      asgard: ['rgba(212,184,74,0.4)', 'rgba(255,215,0,0.2)'],
      midgard: ['rgba(74,140,63,0.3)', 'rgba(34,139,34,0.2)'],
      helheim: ['rgba(107,63,160,0.3)', 'rgba(148,103,211,0.15)'],
      jotunheim: ['rgba(43,108,176,0.3)', 'rgba(59,130,246,0.15)'],
      vanaheim: ['rgba(45,138,124,0.3)', 'rgba(34,211,138,0.15)'],
      alfheim: ['rgba(200,168,110,0.3)', 'rgba(250,204,21,0.15)'],
      muspelheim: ['rgba(184,69,42,0.35)', 'rgba(239,68,68,0.2)'],
      niflheim: ['rgba(90,106,122,0.25)', 'rgba(150,180,200,0.15)']
    };

    const [c1, c2] = colors[realmId] || colors.asgard;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${Math.random() > 0.5 ? c1 : c2};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
        pointer-events: none;
      `;
      particles.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 150;
      const duration = 1500 + Math.random() * 2000;

      p.animate([
        { opacity: 0.8, transform: 'translate(0, 0) scale(1)' },
        { opacity: 0.6, transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 30}px) scale(0.5)` },
        { opacity: 0, transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5 - 60}px) scale(0)` }
      ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
      });
    }

    setTimeout(() => {
      if (particles.parentNode) particles.parentNode.removeChild(particles);
    }, 3000);
  }

  // ===== RANDOM RAVEN VISITS =====
  function randomRavenVisit() {
    if (Math.random() < 0.15) return; // 85% chance of a visit

    const raven = Math.random() > 0.5 ? dom.raven1 : dom.raven2;
    const top = 10 + Math.random() * 80;
    raven.style.top = top + '%';

    raven.classList.add('active');
    setTimeout(() => raven.classList.remove('active'), 3500);
  }

  // Periodic raven visits on the current channel
  setInterval(randomRavenVisit, 15000);

  // ===== REALM CLOCK / TIMER =====
  function updateRealmClock() {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();

    // Update Ragnarök timer (joke counter)
    const ragnarokEl = document.getElementById('stat-ragnarok');
    if (ragnarokEl) {
      const days = Math.floor((1000 - (hours * 3600 + mins * 60 + secs)) / 86400);
      ragnarokEl.textContent = days > 0 ? `${days} cycles` : 'imminent ⚡';
    }
  }

  setInterval(updateRealmClock, 1000);

  // ===== WINDOW-LEVEL CLICK OUTSIDE MODALS =====
  document.addEventListener('click', (e) => {
    // Close settings modal if clicked outside
    if (e.target === dom.settingsModal) {
      dom.settingsModal.style.display = 'none';
    }
    if (e.target === dom.searchModal) {
      dom.searchModal.style.display = 'none';
    }
  });

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener('keydown', (e) => {
    // Ctrl+K = Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      dom.btnSearch.click();
    }
    // Ctrl+R = Runic toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      toggleRunicMode();
    }
    // Escape = Close modals
    if (e.key === 'Escape') {
      dom.settingsModal.style.display = 'none';
      dom.searchModal.style.display = 'none';
    }
    // Ctrl+/ = Settings
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      dom.btnSettings.click();
    }
  });

  // ===== INITIALIZATION =====
  function init() {
    // Set initial realm
    switchRealm('asgard');

    // Set initial runic mode from toggle state
    toggleRunicMode(false);

    // Set initial glow
    updateGlowIntensity();

    // Auto-focus input on load
    setTimeout(() => dom.messageInput.focus(), 500);

    // Scroll to bottom
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;

    // Play initial ambient sound
    initAudio();

    // Start initial raven flight
    setTimeout(() => {
      launchRavenFlight();
    }, 800);

    console.log(
      '%cᚱᚢᚾᚾ ᚱᚢᚾ — Huginn & Muninn is online ᚱᚢᚾᚾᛖᚱ ᚱᚢᚾ',
      'color: #d4b84a; font-family: monospace; font-size: 14px; background: #1e1308; padding: 8px;'
    );
  }

  // ===== POLYFILL: animate on load if needed =====
  if (!Element.prototype.animate) {
    // Basic fallback for very old browsers
    console.warn('Web Animations API not supported — some effects disabled.');
  }

  // Start the app
  init();

})();