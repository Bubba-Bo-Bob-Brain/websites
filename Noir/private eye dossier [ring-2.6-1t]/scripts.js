// ==========================================================================
// CASE FILE NO. 1147 — BLACKWOOD INVESTIGATIONS
// Interactive JavaScript — Film Noir Detective Case File System
// ==========================================================================

(function () {
    'use strict';

    // =========================== UTILITY FUNCTIONS ===========================
    function $(selector) { return document.querySelector(selector); }
    function $$(selector) { return document.querySelectorAll(selector); }
    function rand(min, max) { return Math.random() * (max - min) + min; }
    function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
    function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

    // =========================== DATA ===========================
    var suspectDossiers = {
        riggs: {
            name: 'Mortimer J. Riggs',
            role: 'Business Partner — Voss Industries',
            initials: 'RM',
            priority: 'HIGH',
            details: [
                { label: 'Full Name', value: 'Mortimer James Riggs III' },
                { label: 'DOB', value: 'March 14, 1908' },
                { label: 'Address', value: '47 Ashworth Lane, New Avalon' },
                { label: 'Occupation', value: 'Co-Founder, Voss Industries' },
                { label: 'Known Aliases', value: 'None on file' },
                { label: 'Prior Record', value: 'None — clean record' },
                { label: 'Financial Standing', value: 'Net worth: $2.3M (pre-Voss Corp)' },
                { label: 'Last Seen', value: 'Oct 13, 9:47 PM — The Crimson Ledger' },
                { label: 'Vehicle', value: '1941 Packard Clipper (black, plate: NV-1147)' },
                { label: 'Associates', value: 'Arthur Voss (deceased partner), Thomas Wright' },
                { label: 'Motive', value: '74% share inheritance upon removal of both Vosses' },
                { label: 'Notes', value: 'Argued with Eleanor Voss at office Oct 7. Witness reports Riggs was "visibly agitated" in the days leading up to the disappearance. His alibi for Oct 9-11 collapsed when a restaurant owner confirmed seeing him alone.' }
            ],
            associations: ['Arthur Voss — Business Partner', 'Thomas Wright — Accountant', 'Eleanor Voss — Co-Beneficiary']
        },
        cole: {
            name: 'Vivian S. Cole',
            role: 'Secretary — The Crimson Ledger',
            initials: 'VC',
            priority: 'MEDIUM',
            details: [
                { label: 'Full Name', value: 'Vivian Suzanne Cole' },
                { label: 'DOB', value: 'August 22, 1922' },
                { label: 'Address', value: '12 Merritt Boarding House, Elm St.' },
                { label: 'Occupation', value: 'Secretary / Stenographer' },
                { label: 'Known Aliases', value: 'Vivian S. Hartley (maiden name)' },
                { label: 'Prior Record', value: 'None' },
                { label: 'Financial Standing', value: 'Modest savings, recently withdrew $2,000' },
                { label: 'Last Seen', value: 'Oct 11 — purchased train ticket to Portland' },
                { label: 'Vehicle', value: 'None — uses public transit' },
                { label: 'Associates', value: 'Arthur Voss (former lover), Margaret Cole (sister)' },
                { label: 'Motive', value: 'Romantic entanglement with Voss; access to safe combinations' },
                { label: 'Notes', value: 'Took unexplained two-week leave starting Oct 10. Left town by train Oct 12 morning. Handwriting sample obtained — partial match to anonymous letter pending full analysis. Claims she left to visit a sick aunt in Portland but has not yet provided documentation.' }
            ],
            associations: ['Arthur Voss — Former Lover', 'Margaret Cole — Sister', 'Arthur Voss — Access to Safes']
        },
        hargrove: {
            name: 'Detective Frank Hargrove',
            role: 'HPD — Vice Division',
            initials: 'FH',
            priority: 'MEDIUM',
            details: [
                { label: 'Full Name', value: 'Frank J. Hargrove' },
                { label: 'DOB', value: 'June 5, 1910' },
                { label: 'Address', value: 'Precinct residence — unknown personal address' },
                { label: 'Occupation', value: 'Detective, HPD Vice Division' },
                { label: 'Known Aliases', value: '"The Fixer" (underworld moniker)' },
                { label: 'Prior Record', value: '3 internal affairs complaints, 1 ongoing' },
                { label: 'Financial Standing', value: 'Salary: $4,200/yr. Unexplained deposits: $8,000 over 6 months' },
                { label: 'Last Seen', value: 'Oct 13, 11:30 PM — near Warehouse 14, docks' },
                { label: 'Vehicle', value: 'Unmarked sedan (department issue)' },
                { label: 'Associates', value: 'Sal Moretti (known racketeer), Arthur Voss (payroll)' },
                { label: 'Motive', value: 'On Voss payroll; would lose income stream if Vosses exposed' },
                { label: 'Notes', value: 'Suspended from active duty Oct 14 pending IA review. Two confidential informants independently confirmed Hargrove was receiving payments from Arthur Voss in exchange for protection. Sighted near docks 2 hours before our office was notified of Eleanor\u0027s disappearance. His name appears on the Warehouse 14 lease.' }
            ],
            associations: ['Sal Moretti — Racketeer Contact', 'Arthur Voss — Paymaster', 'Warehouse 14 — Lease Holder']
        },
        wright: {
            name: 'Thomas P. Wright',
            role: 'Private Accountant',
            initials: 'TW',
            priority: 'LOW',
            details: [
                { label: 'Full Name', value: 'Thomas Prescott Wright' },
                { label: 'DOB', value: 'November 3, 1915' },
                { label: 'Address', value: '210 Commerce Building, Suite 4B' },
                { label: 'Occupation', value: 'Independent Accountant / Bookkeeper' },
                { label: 'Known Aliases', value: 'None' },
                { label: 'Prior Record', value: 'Tax evasion (misdemeanor, 1941)' },
                { label: 'Financial Standing', value: 'Practicing accountant, moderate income' },
                { label: 'Last Seen', value: 'Oct 12 — his office, acting erratically' },
                { label: 'Vehicle', value: '1939 Ford Tudor' },
                { label: 'Associates', value: 'Arthur Voss (client), Mortimer Riggs (professional contact)' },
                { label: 'Motive', value: 'Managed off-the-books accounts; could redirect funds' },
                { label: 'Notes', value: 'Handled unlicensed financial accounts for Arthur Voss. During questioning, became visibly nervous and asked for a lawyer — then stopped talking. Known to boast about his ability to "make the numbers say anything." Partial fingerprints found on the safe in Voss\u0027s office.' }
            ],
            associations: ['Arthur Voss — Client', 'Mortimer Riggs — Professional Contact', 'Voss Corp — Off-Books Accounts']
        },
        langford: {
            name: 'Eleanor Langford',
            role: 'Socialite — Voss Family Friend',
            initials: 'EL',
            priority: 'LOW',
            details: [
                { label: 'Full Name', value: 'Eleanor Patricia Langford' },
                { label: 'DOB', value: 'February 18, 1912' },
                { label: 'Address', value: 'The Kensington, Suite 12A (hotel)' },
                { label: 'Occupation', value: 'Socialite / Philanthropist' },
                { label: 'Known Aliases', value: 'None' },
                { label: 'Prior Record', value: 'None' },
                { label: 'Financial Standing', value: 'Trust fund, approx $800K personal wealth' },
                { label: 'Last Seen', value: 'Oct 8 — Embarking on cruise from Pier 7' },
                { label: 'Vehicle', value: 'Private car service' },
                { label: 'Associates', value: 'Margaret Voss (friend), Arthur Voss (family friend)' },
                { label: 'Motive', value: 'Named in Voss will — inherits if both Vosses deceased' },
                { label: 'Notes', value: 'Longtime family friend of the Vosses. Claims to have been on a cruise since Oct 8 — tickets and passport confirm departure but cruise line cannot confirm she is currently aboard. Her cabin was found unoccupied for the first two nights of the voyage. A steward recalls seeing her disembark briefly at a port of call on Oct 11.' }
            ],
            associations: ['Arthur Voss — Family Friend', 'Margaret Voss — Close Confidante', 'Voss Will — Named Beneficiary']
        },
        john_doe: {
            name: 'Identity Unknown',
            role: 'Under Investigation',
            initials: '??',
            priority: 'UNKNOWN',
            details: [
                { label: 'Known Aliases', value: 'None confirmed' },
                { label: 'M.O.', value: 'Anonymous correspondence, payphone usage' },
                { label: 'Communication', value: 'Handwritten letter postmarked Portland, OR' },
                { label: 'Letter Content', value: 'Warned Eleanor Voss: "You know what he\u0027s done. Stop digging before you join Arthur."' },
                { label: 'Handwriting Analysis', value: 'Preliminary: possible match to Vivian Cole — awaiting confirmation' },
                { label: 'Notes', value: 'Sent the anonymous tip that led to the case opening. The letter\u0027s handwriting shows characteristics consistent with someone educated in a private school setting — possibly a secretary or administrative professional. The paper stock is common, purchased locally.' }
            ],
            associations: ['Anonymous — Letter Sender', 'Vivian Cole — Possible Handwriting Match', 'Crimson Ledger — Possible Connection']
        }
    };

    var testimonyTexts = {
        'typewriter-1': 'It was around 11 PM when I saw her through the window. She was pacing the study, talking on the phone — real agitated. I couldn\u0027t make out the words, but she kept saying "I can\u0027t go back to that." Then the light went off.\n\nThe next morning, I noticed mud on her back steps. Fresh mud. Like someone had come through the garden in a hurry. I didn\u0027t think much of it at the time. I wish I had.\n\nTwo days later, she was gone. Just... gone. The house was locked up tight, like nobody\u0027d been there in a week. But I saw the curtains move that night. I know someone was in there.',
        'typewriter-2': 'Arthur used to come in here every Thursday. Whiskey neat, three fingers. Sat in the corner booth like he owned the place. Always looked over his shoulder like he expected somebody.\n\nThat last Thursday — October 9th — he was different. Sweating. Kept checking his watch. Left a $50 tip on a $6 tab and told me, "Ray, if anything happens to me, check the ledger." Then he walked out into the rain and never came back.\n\nHis girl was in here too, a few nights earlier. Vivian. Crying. She wouldn\u0027t say what was wrong, but she had that look. The look of somebody who knows too much and wishes they didn\u0027t.',
        'typewriter-3': 'Preliminary examination of the Voss residence revealed several anomalies. The study floorboards in the northwest corner showed a chemical residue consistent with accelerated decomposition agents. I collected samples.\n\nThe victim\u0027s fingernails showed signs of defensive trauma — she grabbed at something, or someone. Trace evidence beneath the nails is being analyzed.\n\nMost peculiar: a set of fingerprints on the interior of the safe that do not match either Arthur or Eleanor Voss. They are partial but recoverable. I\u0027ve submitted them to the bureau for comparison.\n\nTime of death window: between 10 PM and 2 AM on the night of October 11th. Cause of death pending full autopsy.',
        'typewriter-4': 'I was Blackwood\u0027s partner for six years. I know how he thinks, how he works. And I\u0027ll tell you this — if Silas is on this case, somebody should be worried.\n\nI heard through the grapevine that he\u0027s been asking questions about the warehouse district. That\u0027s Hargrove\u0027s territory. Bad territory. Silas doesn\u0027t scare easy, but even he was careful about that.\n\nI can\u0027t say much more. You understand. I\u0027ve got my own reasons for keeping my head down these days. But if you\u0027re looking for the truth, start with the money. It\u0027s always the money. The Vosses had their fingers in a lot of pies — real estate, imports, things that don\u0027t show up on a balance sheet.'
    };

    var caseNotesTexts = {
        'note-1': 'October 7th. New client. Eleanor Voss — nervous, well-dressed, smelling of gardenias. She placed a photograph on my desk and said one word: "Run."\n\nBefore I could respond, she handed me a key and an envelope containing three hundred dollars in cash. Then she left without another word.\n\nThe photograph shows a man I don\u0027t recognize standing next to Arthur Voss in front of what appears to be a warehouse. Written on the back in Eleanor\u0027s hand: "The one they don\u0027t know about."\n\nI should have asked more questions. I should have kept her in the office. Instead I let her walk out into the rain. That may have been the last mistake I make on this case — or the first right one.',
        'note-2': 'October 10th. Visited the Voss residence. The housekeeper let me in — said she\u0027d been told to "wait downstairs."\n\nThe study is locked. I picked the lock. Inside: a clean desk, a half-empty bottle of brandy, and a ledger I didn\u0027t come for. The floorboards near the window are loose. Under the third board from the wall, I found a smear of something dark. Not dirt.\n\nTook photographs. Collected a sample. Sent it to the lab.\n\nCalled Arthur\u0027s office at The Crimson Ledger. They said he hadn\u0027t come in for two days. Nobody seemed concerned. That tells me something.\n\nVivian Cole — his secretary — claims she hasn\u0027t seen him since Friday. Her eyes said otherwise.',
        'note-3': 'October 12th. The anonymous letter arrived this morning. No return address. Postmark: Portland, Oregon.\n\nThe message was brief: "He said if I asked questions again, I\u0027d regret it. I\u0027m leaving this with you because you\u0027re the only one who might care."\n\nThe handwriting is slanted, rushed — written by someone under duress or with shaking hands. I sent it to my contact at the bureau for analysis.\n\nMeanwhile, Hargrove was spotted near the docks at an hour when decent folk are asleep. When I asked him about it at the precinct, he threatened to have me removed from the case. That tells me I\u0027m getting close.\n\nI need to find out what\u0027s in Warehouse 14 before Hargrove makes sure I never do.',
        'note-4': 'October 14th. Eleanor is gone.\n\nHer apartment was cleaned out — not recently, but methodically, like someone planned this for weeks. The remaining furniture was coated in dust except for one chair in the study. That chair was wiped down. Someone sat in it and waited.\n\nI found a hidden compartment behind the bookcase. Inside: a second key, a passport with a different name, and a train ticket to Tijuana dated for tomorrow.\n\nThis was planned. Whoever did this had resources, connections, and time. This isn\u0027t a disappearance — it\u0027s an extraction.\n\nAnd if Eleanor is still alive, she\u0027s not the victim. She\u0027s the one who ran.\n\nI\u0027m going to need a bigger bottle of brandy for this one.'
    };

    var evidenceDetails = [
        {
            id: 'EVD-001',
            title: 'Study Floor — Chemical Residue',
            date: 'Oct 11, 1947',
            location: 'Voss Residence — Study',
            category: 'residence',
            description: 'Preliminary analysis indicates an accelerant consistent with lye-based compounds. Pattern suggests deliberate application in a 4-foot radius near the northwest wall. Possible attempt to destroy biological evidence or mask chemical traces. Samples sent to the lab for full spectroscopic analysis.',
            chain: ['Collected by: Det. Blackwood', 'Lab analysis pending', 'Linked to: Possible decomposition attempt']
        },
        {
            id: 'EVD-002',
            title: 'Victim\u0027s Personal Key',
            date: 'Oct 8, 1947',
            location: 'Voss Residence — Under desk',
            category: 'personal',
            description: 'Brass key, standard residential cut. Does NOT match the front door lock. Recovered from under the partner\u0027s desk in the study. Key bow stamped with a partial serial number. Locksmith consultation required to determine what this key opens.',
            chain: ['Found: Under partner\u0027s desk', 'Does not match front door', 'Possible: hidden safe or secondary entry point']
        },
        {
            id: 'EVD-003',
            title: 'Ledger Pages — Redacted Entries',
            date: 'Oct 10, 1947',
            location: 'The Crimson Ledger — Back Office',
            category: 'office',
            description: 'Three pages removed from the business ledger covering transactions from August–October 1947. Removal was crude — pages torn rather than cut. Visible residue from adhesive tape on binding. Financial entries appear to reference coded transactions. UV light examination recommended.',
            chain: ['Removed from: Crimson Ledger binding', 'Timeframe: Aug–Oct 1947', 'Linked to: Thomas Wright\u0027s accounts']
        },
        {
            id: 'EVD-004',
            title: 'Warehouse 14 — Dock Worker\u0027s Log',
            date: 'Oct 13, 1947',
            location: 'Pier 9 — Warehouse 14',
            category: 'docks',
            description: 'Logbook records a late-night delivery on October 12th at 2:47 AM. No cargo manifest filed. Driver logged as "Staff Authorized." Warehouse lease is under the name of a shell corporation linked to Det. Frank Hargrove.',
            chain: ['Late-night delivery: 2:47 AM, Oct 12', 'No cargo manifest', 'Lease holder: Hargrove-linked entity']
        },
        {
            id: 'EVD-005',
            title: 'Lipstick on Victim\u0027s Collar',
            date: 'Oct 11, 1947',
            location: 'Voss Residence — Bedroom',
            category: 'residence',
            description: 'Deep red lipstick transfer on left collar of victim\u0027s shirt. DNA sample collected. Color and brand consistent with a high-end cosmetic — not a product Eleanor Voss was known to wear. Possible evidence of a third party present on the night in question.',
            chain: ['DNA sample collected', 'Brand: Elizabeth Arden "Victory Red"', 'Does not match victim\u0027s known cosmetics']
        },
        {
            id: 'EVD-006',
            title: 'Gold Cigarette Case — Monogrammed',
            date: 'Oct 9, 1947',
            location: 'Voss Residence — Entryway',
            category: 'personal',
            description: 'Men\u0027s gold cigarette case, monogrammed "A.V." Found in the entryway of the residence, partially hidden beneath a shoe rack. Engraving style consistent with a 1930s jeweler\u0027s catalog. Interior monogram matches Arthur Voss\u0027s known initials.',
            chain: ['Monogram: A.V. — Arthur Voss', 'Found: Hidden beneath shoe rack', '14K gold — not consistent with reported financial status']
        },
        {
            id: 'EVD-007',
            title: 'Safe — Tampered Lock Mechanism',
            date: 'Oct 12, 1947',
            location: 'Voss Residence — Study',
            category: 'office',
            description: 'The study safe shows signs of professional manipulation. Lock mechanism drilled with precision — consistent with tools used by licensed locksmiths or law enforcement. Combination may have been obtained through coercion or copied from impressions.',
            chain: ['Professional tampering — not amateur B&E', 'Linked to: Thomas Wright (partial prints)', 'Contents: Unknown — safe was empty upon discovery']
        },
        {
            id: 'EVD-008',
            title: 'Suspicious Vessel — 2:47 AM',
            date: 'Oct 13, 1947',
            location: 'Docks District — Pier 9',
            category: 'docks',
            description: 'A 42-foot cabin cruiser was observed moored at Warehouse 14\u0027s private dock at 2:47 AM. Vessel departed before dawn. No registration on file. Witness — a homeless man sleeping nearby — described "men in suits" loading cargo in complete silence.',
            chain: ['Observed: 2:47 AM dock worker log', 'Vessel: Unregistered cabin cruiser', 'Cargo: Unknown, loaded by unidentified parties']
        },
        {
            id: 'EVD-009',
            title: 'Hidden Compartment Behind Bookcase',
            date: 'Oct 11, 1947',
            location: 'Voss Residence — Study',
            category: 'residence',
            description: 'Mechanism discovered behind the study bookcase. Activated by pulling the third volume from the left on the second shelf. Compartment contained: a second passport, a one-way train ticket to Tijuana, and an unsigned letter written in English with instructions for departure.',
            chain: ['Compartment contained: passport, ticket, letter', 'Tijuana destination — Oct 15 departure', 'Suggests: premeditated flight or extraction']
        }
    ];

    // =========================== STATE ===========================
    var currentSection = 'dashboard';
    var activeTool = 'pointer';
    var drawnLines = [];
    var typewriterIntervals = {};

    // =========================== INIT ===========================
    document.addEventListener('DOMContentLoaded', function () {
        initLoadingScreen();
        initNavigation();
        initSplash();
        initTypewriters();
        initSuspectModals();
        initEvidenceGallery();
        initCorkboard();
        initCustomCursor();
        initSmokeTrail();
        initRainOverlay();
        initVenetianOverlay();
    });

    // =========================== LOADING SCREEN ===========================
    function initLoadingScreen() {
        var loadingText = document.getElementById('loading-text');
        var loadingBar = document.getElementById('loading-bar');
        var loadingScreen = document.getElementById('loading-screen');
        var loadingMessages = [
            'INITIALIZING CASE FILE...',
            'DECRYPTING EVIDENCE...',
            'CROSS-REFERENCING SUSPECTS...',
            'ESTABLISHING SURVEILLANCE FEED...',
            'LOADING CORKBOARD...',
            'SECURING CHANNELS...'
        ];

        var msgIndex = 0;
        var charIndex = 0;
        var barProgress = 0;

        function typeMessage() {
            if (msgIndex >= loadingMessages.length) {
                var fillInterval = setInterval(function () {
                    barProgress += 2;
                    loadingBar.style.width = barProgress + '%';
                    if (barProgress >= 100) {
                        clearInterval(fillInterval);
                        setTimeout(function () {
                            loadingScreen.classList.add('fade-out');
                            setTimeout(function () {
                                loadingScreen.style.display = 'none';
                                document.getElementById('splash').style.display = 'flex';
                            }, 800);
                        }, 300);
                    }
                }, 30);
                return;
            }

            var currentMsg = loadingMessages[msgIndex];
            if (charIndex <= currentMsg.length) {
                loadingText.textContent = currentMsg.substring(0, charIndex);
                barProgress = ((msgIndex * currentMsg.length + charIndex) / (loadingMessages.length * currentMsg.length)) * 90;
                loadingBar.style.width = barProgress + '%';
                charIndex++;
                setTimeout(typeMessage, randInt(30, 80));
            } else {
                charIndex = 0;
                msgIndex++;
                setTimeout(function () {
                    loadingText.textContent = '';
                    typeMessage();
                }, 400);
            }
        }

        setTimeout(typeMessage, 500);
    }

    // =========================== SPLASH ===========================
    function initSplash() {
        var enterBtn = document.getElementById('enter-case');
        enterBtn.addEventListener('click', function () {
            var splash = document.getElementById('splash');
            splash.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';

            var caseFile = document.getElementById('case-file');
            caseFile.classList.remove('hidden');
            caseFile.style.opacity = '0';
            caseFile.style.transition = 'opacity 1s ease';

            setTimeout(function () {
                caseFile.style.opacity = '1';
            }, 100);
        });
    }

    // =========================== NAVIGATION ===========================
    function initNavigation() {
        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var target = link.getAttribute('data-section');
                if (target === currentSection) return;

                navLinks.forEach(function (l) { return l.classList.remove('active'); });
                link.classList.add('active');

                document.querySelectorAll('.case-section').forEach(function (s) { return s.classList.remove('active'); });
                document.getElementById('section-' + target).classList.add('active');

                currentSection = target;
                document.getElementById('case-file').scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // =========================== TYPEWRITER ===========================
    function initTypewriters() {
        document.querySelectorAll('.typewriter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = btn.getAttribute('data-target');
                var speed = parseInt(btn.getAttribute('data-speed')) || 35;

                if (typewriterIntervals[targetId]) return;

                var el = document.getElementById(targetId);
                var textKey;

                if (targetId.indexOf('typewriter-') === 0) {
                    var index = targetId.split('-')[1];
                    textKey = 'typewriter-' + index;
                } else {
                    textKey = targetId;
                }

                var fullText = testimonyTexts[textKey] || caseNotesTexts[textKey];
                if (!fullText) return;

                el.textContent = '';
                el.classList.remove('finished');
                btn.classList.add('revealed');
                btn.innerHTML = '<span class="fas fa-spinner fa-spin"></span> Decrypting...';

                var i = 0;
                typewriterIntervals[targetId] = setInterval(function () {
                    el.textContent += fullText[i];
                    i++;
                    if (i >= fullText.length) {
                        clearInterval(typewriterIntervals[targetId]);
                        delete typewriterIntervals[targetId];
                        el.classList.add('finished');
                        el.classList.add('revealed');
                        btn.innerHTML = '<span class="fas fa-check-circle"></span> Statement Revealed';
                        btn.classList.add('revealed');
                    }
                }, speed);
            });
        });
    }

    // =========================== SUSPECT MODALS ===========================
    function initSuspectModals() {
        document.querySelectorAll('.suspect-expand-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var suspectId = btn.getAttribute('data-suspect');
                var dossier = suspectDossiers[suspectId];
                if (!dossier) return;

                var modal = document.getElementById('suspect-modal');
                var body = document.getElementById('modal-body');

                var detailsHtml = '';
                dossier.details.forEach(function (d) {
                    detailsHtml += '<div class="modal-detail-item"><label>' + d.label + '</label><span>' + d.value + '</span></div>';
                });

                var assocHtml = '';
                dossier.associations.forEach(function (a) {
                    var type;
                    if (a.indexOf('Lover') !== -1 || a.indexOf('Associate') !== -1 || a.indexOf('Partner') !== -1) {
                        type = 'connection';
                    } else if (a.indexOf('Alibi') !== -1 || a.indexOf('Friend') !== -1) {
                        type = 'alibi';
                    } else {
                        type = 'evidence';
                    }
                    assocHtml += '<span class="association-chip type-' + type + '">' + a + '</span>';
                });

                body.innerHTML = '<h3>' + dossier.name + '</h3>' +
                    '<p class="modal-role">' + dossier.role + ' — Priority: ' + dossier.priority + '</p>' +
                    '<div class="modal-detail-grid">' + detailsHtml + '</div>' +
                    '<div class="modal-description"><h4><span class="fas fa-file-alt"></span> Detective\'s Assessment</h4>' +
                    '<p>' + dossier.details[dossier.details.length - 1].value + '</p></div>' +
                    '<div class="modal-associations"><h4><span class="fas fa-link"></span> Known Associations</h4>' +
                    '<div class="association-list">' + assocHtml + '</div></div>';

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.querySelector('.modal-bg').addEventListener('click', closeModal);

        function closeModal() {
            document.getElementById('suspect-modal').classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // =========================== EVIDENCE GALLERY ===========================
    function initEvidenceGallery() {
        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(function (b) { return b.classList.remove('active'); });
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.evidence-item').forEach(function (item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });

        document.querySelectorAll('.polaroid').forEach(function (polaroid) {
            polaroid.addEventListener('click', function () {
                var evdNumEl = polaroid.querySelector('.evidence-number');
                var captionEl = polaroid.querySelector('.polaroid-caption p');
                var evdId = evdNumEl ? evdNumEl.textContent.replace('EVD-', '') : '';
                var detail = null;

                for (var i = 0; i < evidenceDetails.length; i++) {
                    if (evidenceDetails[i].id === 'EVD-' + evdId) {
                        detail = evidenceDetails[i];
                        break;
                    }
                }

                var lightbox = document.getElementById('evidence-lightbox');
                var inner = document.getElementById('lightbox-inner');

                if (detail) {
                    var chainHtml = '';
                    detail.chain.forEach(function (c) {
                        chainHtml += '<li>' + c + '</li>';
                    });

                    inner.innerHTML = '<div class="evidence-detail-image"><span class="fas fa-search-plus"></span></div>' +
                        '<h3>' + detail.title + '</h3>' +
                        '<div class="meta-info">' +
                        '<span><span class="fas fa-fingerprint"></span> ' + detail.id + '</span>' +
                        '<span><span class="fas fa-calendar-alt"></span> ' + detail.date + '</span>' +
                        '<span><span class="fas fa-map-marker-alt"></span> ' + detail.location + '</span>' +
                        '<span><span class="fas fa-folder"></span> ' + detail.category.charAt(0).toUpperCase() + detail.category.slice(1) + '</span>' +
                        '</div>' +
                        '<p class="detail-description">' + detail.description + '</p>' +
                        '<div class="evidence-chain"><h4><span class="fas fa-link"></span> Evidence Chain</h4>' +
                        '<ul class="chain-list">' + chainHtml + '</ul></div>';
                } else {
                    var imgBg = polaroid.querySelector('.polaroid-image').style.background;
                    inner.innerHTML = '<div class="evidence-detail-image" style="background: ' + imgBg + '">' +
                        '<div class="enlarged-placeholder"><span class="fas fa-image"></span><span>Evidence Photograph</span></div></div>' +
                        '<h3>' + (captionEl ? captionEl.textContent : 'Evidence Photo') + '</h3>' +
                        '<div class="meta-info"><span><span class="fas fa-fingerprint"></span> ' + (evdNumEl ? evdNumEl.textContent : 'N/A') + '</span></div>' +
                        '<p class="detail-description">Physical evidence photograph — high-resolution scan available upon request.</p>';
                }

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-bg').addEventListener('click', closeLightbox);

        function closeLightbox() {
            document.getElementById('evidence-lightbox').classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // =========================== CORKBOARD ===========================
    function initCorkboard() {
        var board = document.getElementById('corkboard');
        var linesSvg = document.getElementById('corkboard-lines');
        var lineStartItem = null;

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.tool-btn').forEach(function (b) { return b.classList.remove('active'); });
                btn.classList.add('active');
                activeTool = btn.id.replace('tool-', '');
            });
        });

        // Board click for adding items
        board.addEventListener('click', function (e) {
            if (e.target.closest('.cork-item')) return;

            var rect = board.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;

            if (activeTool === 'pin-red' || activeTool === 'pin-blue') {
                addPin(x, y, activeTool === 'pin-red' ? 'red' : 'blue');
            } else if (activeTool === 'note') {
                addNote(x, y);
            } else if (activeTool === 'photo') {
                addPhoto(x, y);
            }
        });

        function addPin(x, y, color) {
            var pin = document.createElement('div');
            pin.className = 'cork-pin cork-pin-' + color;
            pin.style.left = '50%';
            pin.style.top = '-6px';
            pin.style.transform = 'translateX(-50%)';
            pin.style.position = 'absolute';
            pin.style.zIndex = '3';
            pin.style.cursor = 'none';
            board.appendChild(pin);
        }

        function addNote(x, y) {
            var note = document.createElement('div');
            note.className = 'cork-item cork-note pinned';
            note.style.left = (x - 5) + '%';
            note.style.top = (y - 5) + '%';
            note.innerHTML = '<div class="cork-note-content"><p>New note — click to edit</p><small>— Field agent</small></div><div class="cork-pin cork-pin-red"></div>';
            note.style.cursor = 'none';
            board.appendChild(note);
            makeDraggable(note);
        }

        function addPhoto(x, y) {
            var photo = document.createElement('div');
            photo.className = 'cork-item cork-photo pinned';
            photo.style.left = (x - 5) + '%';
            photo.style.top = (y - 5) + '%';
            photo.innerHTML = '<div class="cork-photo-frame"><div class="cork-photo-placeholder" style="background: linear-gradient(145deg, #333, #222);"><span class="fas fa-camera"></span></div><span class="cork-caption">New photo</span></div><div class="cork-pin cork-pin-red"></div>';
            board.appendChild(photo);
            makeDraggable(photo);
        }

        // Drag existing items
        document.querySelectorAll('.cork-item').forEach(function (item) {
            makeDraggable(item);
        });

        function makeDraggable(item) {
            var isDragging = false;
            var startX, startY, origX, origY;
            var pin = item.querySelector('.cork-pin');

            var startDrag = function (e) {
                isDragging = true;
                item.classList.add('dragging');
                var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                var clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                var rect = item.getBoundingClientRect();
                startX = clientX - rect.left;
                startY = clientY - rect.top;
                origX = parseFloat(item.style.left);
                origY = parseFloat(item.style.top);
                e.preventDefault();
            };

            var moveDrag = function (e) {
                if (!isDragging) return;
                var boardRect = board.getBoundingClientRect();
                var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                var clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                var newX = ((clientX - boardRect.left - startX) / boardRect.width) * 100;
                var newY = ((clientY - boardRect.top - startY) / boardRect.height) * 100;
                item.style.left = clamp(newX, 0, 95) + '%';
                item.style.top = clamp(newY, 0, 95) + '%';
                updateLinesForItem(item);
            };

            var endDrag = function () {
                isDragging = false;
                item.classList.remove('dragging');
            };

            if (pin) {
                pin.addEventListener('mousedown', startDrag);
                pin.addEventListener('touchstart', startDrag, { passive: false });
            }
            document.addEventListener('mousemove', moveDrag);
            document.addEventListener('touchmove', moveDrag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);

            // Double-click to remove item
            item.addEventListener('dblclick', function () {
                item.style.transition = 'transform 0.3s, opacity 0.3s';
                item.style.transform = 'scale(0)';
                item.style.opacity = '0';
                var itemId = item.id;
                setTimeout(function () {
                    item.remove();
                    document.querySelectorAll('.cork-line.dynamic').forEach(function (line) {
                        if (line.getAttribute('data-from') === itemId || line.getAttribute('data-to') === itemId) {
                            line.remove();
                        }
                    });
                }, 300);
            });
        }

        function updateLinesForItem(movedItem) {
            var movedId = movedItem.id;
            document.querySelectorAll('.cork-line.dynamic').forEach(function (line) {
                if (line.getAttribute('data-from') === movedId || line.getAttribute('data-to') === movedId) {
                    var fromEl = document.getElementById(line.getAttribute('data-from'));
                    var toEl = document.getElementById(line.getAttribute('data-to'));
                    if (fromEl && toEl) {
                        updateLinePosition(line, fromEl, toEl);
                    }
                }
            });
        }

        function updateLinePosition(line, fromEl, toEl) {
            var boardRect = board.getBoundingClientRect();
            var fromRect = fromEl.getBoundingClientRect();
            var toRect = toEl.getBoundingClientRect();

            var x1 = ((fromRect.left + fromRect.width / 2 - boardRect.left) / boardRect.width) * 100;
            var y1 = ((fromRect.top + fromRect.height / 2 - boardRect.top) / boardRect.height) * 100;
            var x2 = ((toRect.left + toRect.width / 2 - boardRect.left) / boardRect.width) * 100;
            var y2 = ((toRect.top + toRect.height / 2 - boardRect.top) / boardRect.height) * 100;

            line.setAttribute('x1', x1 + '%');
            line.setAttribute('y1', y1 + '%');
            line.setAttribute('x2', x2 + '%');
            line.setAttribute('y2', y2 + '%');
        }

        // Draw new lines via shift+click on two items
        board.addEventListener('click', function (e) {
            if (e.shiftKey && e.target.closest('.cork-item')) {
                e.preventDefault();
                e.stopPropagation();

                var clickedItem = e.target.closest('.cork-item');

                if (!lineStartItem) {
                    lineStartItem = clickedItem;
                    clickedItem.style.outline = '2px dashed rgba(196, 163, 90, 0.8)';
                } else if (lineStartItem !== clickedItem) {
                    var fromId = lineStartItem.id || ('line-start-' + Date.now());
                    if (!lineStartItem.id) lineStartItem.id = fromId;
                    var toId = clickedItem.id || ('line-end-' + Date.now());
                    if (!clickedItem.id) clickedItem.id = toId;

                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('class', 'cork-line line-solid dynamic');
                    line.setAttribute('stroke', '#8b0000');
                    line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('data-from', fromId);
                    line.setAttribute('data-to', toId);
                    line.style.strokeDasharray = '6,3';

                    updateLinePosition(line, lineStartItem, clickedItem);
                    linesSvg.appendChild(line);
                    drawnLines.push(line);

                    lineStartItem.style.outline = '';
                    lineStartItem = null;
                }
            }
        });

        // Clear lines button
        document.getElementById('tool-clear-lines').addEventListener('click', function () {
            document.querySelectorAll('.cork-line.dynamic').forEach(function (l) { return l.remove(); });
            drawnLines = [];
            if (lineStartItem) {
                lineStartItem.style.outline = '';
                lineStartItem = null;
            }
        });

        // Print button (simulated)
        document.getElementById('tool-print').addEventListener('click', function () {
            alert('PRINT\n\nCase File No. 1147 — Corkboard Export\nConspiracy Board printed successfully.\n\nNote: Physical printout should be filed in evidence locker B-14.');
        });
    }

    // =========================== CUSTOM CURSOR ===========================
    function initCustomCursor() {
        var cursor = document.getElementById('custom-cursor');
        var ring = document.getElementById('custom-cursor-ring');
        var mouseX = 0, mouseY = 0;
        var cursorX = 0, cursorY = 0;
        var ringX = 0, ringY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            ringX += (mouseX - ringX) * 0.08;
            ringY += (mouseY - ringY) * 0.08;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        var hoverSelectors = 'button, a, .suspect-card, .polaroid, .filter-btn, .tool-btn, .typewriter-btn';
        document.querySelectorAll(hoverSelectors).forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('hover-active');
                ring.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('hover-active');
                ring.classList.remove('hover-active');
            });
        });
    }

    // =========================== SMOKE TRAIL ===========================
    function initSmokeTrail() {
        var container = document.getElementById('smoke-trail');
        var mouseX = 0, mouseY = 0;
        var lastSpawnX = 0, lastSpawnY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        setInterval(function () {
            var dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
            if (dist < 15) return;

            lastSpawnX = mouseX;
            lastSpawnY = mouseY;

            var count = randInt(1, 3);
            for (var i = 0; i < count; i++) {
                var particle = document.createElement('div');
                particle.className = 'smoke-particle';
                var offsetX = rand(-15, 15);
                var offsetY = rand(-15, 15);
                particle.style.left = (mouseX + offsetX) + 'px';
                particle.style.top = (mouseY + offsetY) + 'px';
                particle.style.width = rand(4, 12) + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDuration = rand(1, 2.5) + 's';
                container.appendChild(particle);

                setTimeout(function (p) {
                    return function () {
                        if (p.parentNode) {
                            p.parentNode.removeChild(p);
                        }
                    };
                }(particle), 3000);
            }
        }, 50);
    }

    // =========================== RAIN OVERLAY ===========================
    function initRainOverlay() {
        var canvas = document.getElementById('rain-overlay');
        var ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Raindrop() {
            this.reset();
        }
        Raindrop.prototype.reset = function () {
            this.x = rand(0, canvas.width);
            this.y = rand(-100, -10);
            this.speed = rand(4, 12);
            this.length = rand(10, 25);
            this.opacity = rand(0.05, 0.2);
            this.wind = rand(-0.5, 0.5);
        };
        Raindrop.prototype.update = function () {
            this.y += this.speed;
            this.x += this.wind;
            if (this.y > canvas.height) {
                this.reset();
                this.y = rand(-100, -10);
            }
        };
        Raindrop.prototype.draw = function () {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.wind * 2, this.y + this.length);
            ctx.strokeStyle = 'rgba(180, 190, 200, ' + this.opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        };

        var drops = [];
        var dropCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
        for (var i = 0; i < dropCount; i++) {
            drops.push(new Raindrop());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var j = 0; j < drops.length; j++) {
                drops[j].update();
                drops[j].draw();
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // =========================== VENETIAN OVERLAY ===========================
    function initVenetianOverlay() {
        var overlay = document.getElementById('venetian-overlay');
        var shadowAngle = 0;

        setInterval(function () {
            shadowAngle += 0.5;
            var opacityVal = 0.03 + Math.sin(shadowAngle * 0.02) * 0.02;
            overlay.style.background = 'repeating-linear-gradient(' +
                (shadowAngle * 0.1) + 'deg,' +
                'transparent,' +
                'transparent 3px,' +
                'rgba(0, 0, 0, ' + opacityVal + ') 3px,' +
                'rgba(0, 0, 0, ' + opacityVal + ') 4px' +
                ')';
        }, 50);
    }

})();