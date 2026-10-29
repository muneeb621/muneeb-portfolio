/* MUNEEB.DEV — AI chatbot
   AI answers come from Puter.js (no API key, visitor pays via their Puter
   account). If Puter is blocked/offline the bot falls back to a local
   knowledge base so basic portfolio questions still get answered. */
(function () {
    'use strict';

    var MODEL = 'gpt-5.4-nano';

    /* Curated facts about the portfolio owner. Sent to the model together
       with the rendered page text so answers stay grounded.

       >>> KEEP IN SYNC: whenever projects, skills, services, education,
       availability or contact details change in index.html, update this
       BRIEF and the FALLBACK answers below, or the bot will confidently
       give visitors outdated information. See AGENTS.md. */
    var BRIEF = [
        'SITE: personal portfolio of Muhammad Muneeb, brand "MUNEEB.DEV".',
        'ROLE: fresher Full Stack Developer and Flutter Developer.',
        'SERVICES offered: Full Stack Web Development, Frontend Development, PHP & Laravel Development, REST API Development & Integration, Flutter Mobile App Development, Responsive Website Improvements.',
        'SKILLS: Laravel, PHP, MySQL, HTML, CSS, JavaScript, Tailwind CSS, REST APIs, Flutter, Dart.',
        'FEATURED PROJECTS: (1) Vaccination Management System — web system for vaccination records, PHP/Laravel/MySQL/REST APIs. (2) Valencia Dial — E-commerce — product listings, cart, responsive UI, Laravel/MySQL/Tailwind CSS/JavaScript. (3) Laravel E-commerce — MVC, Eloquent ORM, Blade templating. Each card has a working Live Demo button that opens an interactive demo page; GitHub buttons show "Coming soon" because the repositories are not public yet.',
        'EDUCATION: Diploma in Software Engineering at Aptech (2024–Present, in progress), Intermediate (2024), Matriculation before that.',
        'AVAILABILITY: open to internships, freelance projects and collaboration.',
        'CONTACT: email ladlamuneeb242@gmail.com, phone +92 370 0144052, WhatsApp button on the site (same number), GitHub github.com/muneeb621, plus a contact form in the Contact section that emails him through Web3Forms.',
        'CV: download button points at assets/cv/Muhammad-Muneeb-CV.pdf.',
        'GREETING: when the visitor says hi or opens the chat, greet them briefly and ask what they want to know about Muneeb. Do not dump the page content.',
        'STYLE: reply in the language the visitor used (English, Urdu or Roman Urdu). Plain text only, no markdown, no lists, no asterisks, no headings. Keep it short and conversational. If the answer is not on this page, say so in one line and offer to help with something else.'
    ].join('\n');

    /* Offline / blocked-network fallback: keyword-scored local answers. */
    var FALLBACK = [
        { k: ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa'], a: 'Hello! Ask me anything about Muhammad Muneeb — his skills, projects, education or how to get in touch.' },
        { k: ['who', 'about', 'yourself', 'intro', 'profile', 'kaun', 'kon', '介绍'], a: 'Muhammad Muneeb is a fresher full stack developer and Flutter developer. He builds web apps with Laravel and PHP and cross-platform mobile apps with Flutter.' },
        { k: ['skill', 'tech', 'stack', 'know', 'expertise', 'kaam'], a: 'His main stack is Laravel, PHP, MySQL, HTML, CSS, JavaScript and Tailwind CSS, plus Flutter and Dart for mobile. He also builds and consumes REST APIs.' },
        { k: ['project', 'work', 'portfolio', 'built', 'made', 'kaam kiya'], a: 'Three featured projects: Vaccination Management System (PHP, Laravel, MySQL, REST APIs), Valencia Dial — E-commerce (Laravel, MySQL, Tailwind CSS, JavaScript) and Laravel E-commerce (MVC, Eloquent ORM, Blade). Click the Live Demo button on any project card to open an interactive demo. The GitHub repos are not public yet.' },
        { k: ['service', 'offer', 'hire', 'provide', 'kya kar'], a: 'He offers full stack web development, frontend development, PHP and Laravel development, REST API development and integration, Flutter mobile app development, and responsive website improvements.' },
        { k: ['contact', 'reach', 'email', 'phone', 'number', 'call', 'whatsapp', 'raabta'], a: 'Email ladlamuneeb242@gmail.com, phone +92 370 0144052, WhatsApp (green button, same number), GitHub github.com/muneeb621. There is also a contact form in the Contact section that sends a message straight to him.' },
        { k: ['email', 'mail'], a: 'His email address is ladlamuneeb242@gmail.com.' },
        { k: ['phone', 'number', 'mobile', 'call'], a: 'His phone number is +92 370 0144052.' },
        { k: ['github', 'repo', 'repository', 'code'], a: 'His GitHub profile is github.com/muneeb621. The project repositories are not public yet.' },
        { k: ['education', 'degree', 'study', 'qualification', 'university', 'matric', 'inter'], a: 'He is pursuing a Diploma in Software Engineering at Aptech (2024–Present), and completed Intermediate in 2024 and Matriculation before that.' },
        { k: ['available', 'availability', 'hire', 'internship', 'freelance', 'job', 'open'], a: 'Yes — he is open to internships, freelance projects and collaboration.' },
        { k: ['cv', 'resume', 'download'], a: 'Use the Download CV button in the hero or the resume section; it opens assets/cv/Muhammad-Muneeb-CV.pdf.' },
        { k: ['price', 'cost', 'rate', 'charge'], a: 'Rates depend on the scope of the work. Send him a message through the contact form or email and he will reply with a quote.' },
        { k: ['location', 'city', 'where', 'from'], a: 'He is based in Pakistan and works with clients remotely.' },
        { k: ['flutter', 'mobile', 'app'], a: 'For mobile he uses Flutter with Dart to build cross-platform apps that feel native on both Android and iOS.' },
        { k: ['laravel', 'php'], a: 'Laravel and PHP are his core backend tools — MVC architecture, Eloquent ORM and Blade templating.' }
    ];

    var style = document.createElement('style');
    style.textContent = [
        '#mc-chat-fab{position:fixed;right:24px;bottom:24px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#8B5CF6 0%,#38BDF8 100%);color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.08);transition:transform .2s ease,box-shadow .2s ease}',
        '#mc-chat-fab:hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.16)}',
        '#mc-chat-fab:focus-visible{outline:2px solid #38BDF8;outline-offset:3px}',
        '#mc-chat-fab svg{width:24px;height:24px;display:block}',
        '#mc-chat-fab .mc-fab-dot{position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:#22c55e;border:2px solid #09090F}',
        '#mc-chat-panel{position:fixed;right:24px;bottom:96px;width:376px;max-width:calc(100vw - 24px);height:min(560px,calc(100vh - 140px));display:none;flex-direction:column;overflow:hidden;border-radius:16px;background:#101019;border:1px solid rgba(255,255,255,.10);box-shadow:0 30px 70px rgba(0,0,0,.6);z-index:2147483000;font-family:Inter,system-ui,sans-serif;font-size:14.5px;line-height:1.55;color:#F5F5F7}',
        '#mc-chat-panel.open{display:flex}',
        '#mc-chat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:linear-gradient(135deg,rgba(139,92,246,.20),rgba(56,189,248,.12));border-bottom:1px solid rgba(255,255,255,.10)}',
        '#mc-chat-title{display:flex;align-items:center;gap:10px;font-family:"Space Grotesk",Inter,sans-serif;font-weight:600;font-size:15px}',
        '.mc-chat-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#8B5CF6,#38BDF8);color:#fff;flex-shrink:0}',
        '.mc-chat-avatar svg{width:15px;height:15px}',        '#mc-chat-sub{display:block;font-family:Inter,sans-serif;font-size:11.5px;font-weight:400;color:#A1A1B5;margin-top:1px}',
        '#mc-chat-close,#mc-chat-clear{background:transparent;border:none;cursor:pointer;color:#A1A1B5;padding:5px;border-radius:6px;line-height:0;transition:color .15s,background .15s}',
        '#mc-chat-close:hover,#mc-chat-clear:hover{color:#F5F5F7;background:rgba(255,255,255,.07)}',
        '#mc-chat-close svg,#mc-chat-clear svg{width:16px;height:16px;display:block}',
        '#mc-chat-head-actions{display:flex;align-items:center;gap:2px}',
        '#mc-chat-body{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;background:#0d0d15;scroll-behavior:smooth}',
        '#mc-chat-body::-webkit-scrollbar{width:6px}',
        '#mc-chat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:3px}',
        '.mc-msg{padding:9px 13px;border-radius:14px;max-width:86%;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere}',
        '.mc-msg.user{align-self:flex-end;background:linear-gradient(135deg,#8B5CF6,#6d4ee0);color:#fff;border-bottom-right-radius:4px;box-shadow:0 6px 18px rgba(139,92,246,.28)}',
        '.mc-msg.bot{align-self:flex-start;background:#151522;color:#F5F5F7;border:1px solid rgba(255,255,255,.10);border-bottom-left-radius:4px}',
        '.mc-msg.bot.error{border-color:rgba(248,113,113,.45);color:#fecaca}',
        '.mc-msg a{color:#38BDF8;word-break:break-all}',
        '.mc-typing{display:inline-flex;gap:5px;align-items:center;padding:3px 0}',
        '.mc-typing i{width:6px;height:6px;border-radius:50%;background:#A1A1B5;display:block;animation:mcBounce 1.2s ease-in-out infinite}',
        '.mc-typing i:nth-child(2){animation-delay:.15s}',
        '.mc-typing i:nth-child(3){animation-delay:.3s}',
        '@keyframes mcBounce{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}',
        '#mc-chat-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 4px}',
        '#mc-chat-chips button{font:inherit;font-size:12.5px;padding:6px 11px;border-radius:999px;cursor:pointer;color:#C9C9DD;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);transition:background .15s,border-color .15s,color .15s}',
        '#mc-chat-chips button:hover{background:rgba(139,92,246,.18);border-color:rgba(139,92,246,.5);color:#F5F5F7}',
        '#mc-chat-foot{display:flex;align-items:center;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.10);background:#101019}',
        '#mc-chat-input{flex:1;border:1px solid rgba(255,255,255,.14);background:#0d0d15;color:#F5F5F7;padding:10px 12px;border-radius:10px;font:inherit;font-size:14px;outline:none;min-width:0}',
        '#mc-chat-input::placeholder{color:#6b6b85}',
        '#mc-chat-input:focus{border-color:rgba(139,92,246,.65);box-shadow:0 0 0 3px rgba(139,92,246,.15)}',
        '#mc-chat-send{border:none;cursor:pointer;background:linear-gradient(135deg,#8B5CF6,#38BDF8);color:#fff;padding:10px 14px;border-radius:10px;font:inherit;font-size:13.5px;font-weight:600;transition:opacity .15s}',
        '#mc-chat-send:hover{opacity:.88}',
        '#mc-chat-send:disabled{opacity:.45;cursor:not-allowed}',
        '@media (max-width:560px){#mc-chat-fab{right:14px;bottom:14px}#mc-chat-panel{right:12px;left:12px;bottom:80px;width:auto;height:min(520px,calc(100vh - 110px))}.mc-msg{max-width:92%}}',
        '@media (max-width:1280px){.footer-bottom{padding-right:84px}}'
    ].join('\n');
    document.head.appendChild(style);

    /* Capture the rendered page text BEFORE the chat UI is added. */
    var pageContent = (document.body.innerText || '').replace(/\n{3,}/g, '\n\n').slice(0, 9000);
    var conversation = [{ role: 'system', content: BRIEF + '\n\nPAGE CONTENT:\n' + pageContent }];

    function svg(paths, size) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="' + (size || 22) + '" height="' + (size || 22) + '">' + paths + '</svg>';
    }
    var ICON_CHAT = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
    var ICON_CLOSE = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    var ICON_CLEAR = '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>';

    var fab = document.createElement('button');
    fab.id = 'mc-chat-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open chat assistant');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = svg(ICON_CHAT) + '<span class="mc-fab-dot"></span>';
    document.body.appendChild(fab);

    var panel = document.createElement('div');
    panel.id = 'mc-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat assistant');
    panel.innerHTML = [
        '<div id="mc-chat-head">',
        '  <div id="mc-chat-title"><span class="mc-chat-avatar">' + svg('<path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4z"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>', 15) + '</span>',
        '    <span>Muneeb Assistant<span id="mc-chat-sub">Ask me anything about this portfolio</span></span></div>',
        '  <div id="mc-chat-head-actions">',
        '    <button id="mc-chat-clear" type="button" aria-label="Clear conversation">' + svg(ICON_CLEAR, 16) + '</button>',
        '    <button id="mc-chat-close" type="button" aria-label="Close chat">' + svg(ICON_CLOSE, 16) + '</button>',
        '  </div>',
        '</div>',
        '<div id="mc-chat-body" role="log" aria-live="polite"></div>',
        '<div id="mc-chat-chips"></div>',
        '<form id="mc-chat-foot" autocomplete="off">',
        '  <input id="mc-chat-input" type="text" placeholder="Ask about skills, projects, contact..." aria-label="Your question" />',
        '  <button id="mc-chat-send" type="submit">Send</button>',
        '</form>'
    ].join('');
    document.body.appendChild(panel);

    var body = panel.querySelector('#mc-chat-body');
    var chips = panel.querySelector('#mc-chat-chips');
    var form = panel.querySelector('#mc-chat-foot');
    var input = panel.querySelector('#mc-chat-input');
    var send = panel.querySelector('#mc-chat-send');
    var close = panel.querySelector('#mc-chat-close');
    var clear = panel.querySelector('#mc-chat-clear');
    var busy = false;

    var QUICK = [
        'Who is Muneeb?',
        'What are his skills?',
        'What projects has he built?',
        'How can I contact him?'
    ];

    function add(role, text, isError) {
        var el = document.createElement('div');
        el.className = 'mc-msg ' + role + (isError ? ' error' : '');
        el.textContent = text;
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
        return el;
    }

    function linkify(el) {
        el.innerHTML = '';
        var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
        el.innerHTML = esc(el.dataset.raw || '').replace(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+|github\.com\/[\w-]+)/gi, function (m) {
            var href = m.indexOf('http') === 0 ? m : (m.indexOf('@') > -1 ? 'mailto:' + m : 'https://' + m);
            return '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + m + '</a>';
        });
    }

    function renderChips() {
        chips.innerHTML = '';
        QUICK.forEach(function (q) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = q;
            b.addEventListener('click', function () { input.value = q; form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); });
            chips.appendChild(b);
        });
    }

    function normalise(s) { return (s || '').toLowerCase().replace(/[^a-z0-9\s@.+]/g, ' ').replace(/\s+/g, ' ').trim(); }

    function localAnswer(question) {
        var q = normalise(question);
        if (!q) return null;
        var best = null, bestScore = 0;
        FALLBACK.forEach(function (entry) {
            var score = 0;
            entry.k.forEach(function (kw) { if (q.indexOf(kw) > -1) score += kw.length > 4 ? 2 : 1; });
            if (score > bestScore) { bestScore = score; best = entry; }
        });
        if (best && bestScore >= 1) return best.a;
        return 'I do not have that on this page. You can reach Muneeb directly at ladlamuneeb242@gmail.com or +92 370 0144052 and he will answer.';
    }

    function puterReady() {
        return typeof window.puter === 'object' && window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function';
    }

    var TYPING = '<span class="mc-typing"><i></i><i></i><i></i></span>';
    var SIGNIN_NOTE = '\n\n(The AI assistant is waiting for a free Puter sign-in. Sign in once in the popup and it will answer with full AI. This reply came from the offline knowledge base.)';
    var aiHealthy = true;

    function setRaw(el, text) {
        el.dataset.raw = text;
        linkify(el);
        body.scrollTop = body.scrollHeight;
    }

    async function ask(question, done) {
        var release = function () { if (done) { var d = done; done = null; d(); } };

        if (!puterReady() || !aiHealthy) { add('bot', localAnswer(question)); release(); return; }

        var el = add('bot', '');
        el.innerHTML = TYPING;
        conversation.push({ role: 'user', content: question });

        var timedOut = false;
        var answer = '';
        var timer = null;

        var stopTimer = function () {
            if (timer) { clearTimeout(timer); timer = null; }
        };

        /* Arm a 20s window. Re-armed every time a chunk arrives so a
           streaming reply is given 20s of silence (not the whole call)
           before falling back. First chunk never arriving (e.g. the
           Puter sign-in popup was never completed) keeps the original
           behaviour: local answer + AI disabled for the session. */
        var armTimer = function () {
            stopTimer();
            timer = setTimeout(function () {
                timedOut = true;
                if (!answer) {
                    aiHealthy = false;
                    setRaw(el, localAnswer(question) + SIGNIN_NOTE);
                } else {
                    setRaw(el, answer + '\n\n(Reply cut off — ask again to continue.)');
                    conversation.push({ role: 'assistant', content: answer });
                }
                release();
            }, 20000);
        };

        armTimer();

        try {
            var response = await window.puter.ai.chat(conversation, false, { model: MODEL, stream: true });
            for await (var part of response) {
                if (timedOut) break;
                if (part && part.text) {
                    answer += part.text;
                    setRaw(el, answer);
                    armTimer();
                }
            }
            stopTimer();
            if (timedOut) return;
            if (!answer) throw new Error('empty response');
            aiHealthy = true;
            conversation.push({ role: 'assistant', content: answer });
            release();
        } catch (err) {
            stopTimer();
            if (timedOut) return;
            conversation.pop();
            setRaw(el, localAnswer(question));
            release();
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var question = input.value.trim();
        if (!question || busy) return;
        input.value = '';
        chips.innerHTML = '';
        add('user', question);
        busy = true;
        send.disabled = true;
        ask(question, function () {
            busy = false;
            send.disabled = false;
            input.focus();
        });
    });

    function toggle(force) {
        var open = force !== undefined ? force : !panel.classList.contains('open');
        panel.classList.toggle('open', open);
        fab.setAttribute('aria-expanded', String(open));
        if (open) input.focus();
    }

    fab.addEventListener('click', function () { toggle(); });
    close.addEventListener('click', function () { toggle(false); fab.focus(); });
    clear.addEventListener('click', function () {
        conversation = [{ role: 'system', content: conversation[0].content }];
        body.innerHTML = '';
        renderChips();
        add('bot', 'Conversation cleared. What would you like to know about Muneeb?');
        input.focus();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) { toggle(false); fab.focus(); }
    });

    renderChips();
    add('bot', 'Hi! I can answer questions about Muhammad Muneeb — his skills, projects, services, education and how to get in touch.');
})();
