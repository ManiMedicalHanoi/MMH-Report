/* MMH CRM USER GUIDE (English) — full system, latest changes included. For all CRM users incl. the Thailand team.
   Shots: English UI (Thailand team mode) with mock Thai data: tools/guide/shots/en_*.jpg (+ .json).
   Run: node tools/guide/buildcrm_en.js → PDF=1 node tools/guide/render.js → copy out.pdf to MMH-CRM/docs/HDSD_MMH_CRM_vXX.Y.pdf
   VER=v30.5 node buildcrm_en.js để đổi số phiên bản. */
const { a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
const VER = process.env.VER || 'v30.4';
KIT.ver = VER; KIT.app = 'MMH CRM'; KIT.host = 'manimedicalhanoi.github.io/MMH-CRM'; KIT.foot = 'User guide'; KIT.when = '10/2026';
const APP = 'https://manimedicalhanoi.github.io/MMH-CRM/';
const ph = (img, w, crop) => fig({ img, w: w || 250, frame: 'phone', crop });
const br = (img, w, crop, maxH) => fig({ img, w, frame: 'browser', crop, maxH });
const NA = require('fs').existsSync(__dirname + '/newacc_en.js') ? require('./newacc_en.js') : null;   /* các trang Mở mới (New accounts) */

slide({ bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">USER GUIDE · MMH CRM ${VER}</div>
    <h1>MMH CRM<br><span>Customers · field visits · trips · KPI</span></h1>
    <p class="cv-p">The complete guide to the whole system, including the latest changes: clean design, mobile field work, the Today view, new accounts &amp; approvals, KPI and Total KPI, the private calendar, reminders and the quarterly self-assessment.</p>
    <div class="cv-chips"><span>📱 Mobile</span><span>📍 Field visits</span><span>✈️ Trips</span><span>📊 KPI</span></div>
    <div class="cv-link">Open the app: ${a(APP)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${br('en_cal', 760, [0, 0, 1, 0.9])}</div>` });

slide({ sec: 'GETTING STARTED', kick: 'SIGN IN', acc: '#3A5CAA', title: 'Sign in with your company email', sub: 'Same account as MMH Report Hub', body: `
  <div class="two"><div class="col-t">${steps([
    [1, `Open ${a(APP)} → enter your <b>@manimedicalhanoi.com</b> or <b>@mani.inc</b> email → <b>Send sign-in code</b>.`],
    [2, 'Open your mailbox, type the <b>6-digit code</b> → <b>Sign in</b>. The session lasts 30 days on that device.'],
    [3, 'The app opens your team (Dental / Surgical / Eyeless / Thailand Surgical) with the right access. The Thailand team sees everything in English.'],
  ])}${tip('Works even when Chrome is signed in to another Gmail account. No code? Check the <b>Junk / Spam</b> folder.')}</div>
  <div class="col-f">${ph('en_login', 250)}</div></div>` });

slide({ sec: 'LAYOUT', kick: 'DESKTOP', acc: '#3A5CAA', title: 'Main screen', sub: 'The app opens on this week\'s Work calendar', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Top bar</b>: MMH Calendar · Quick search (Ctrl + K) · Links · FY · What\'s new · colour theme · your name.'],
    [2, '<b>Side menu</b>: Dashboard, KPI &amp; Targets, Customers, Key stakeholders, Updates, New accounts, Orders… Managers also get <b>Current group</b>.'],
    [3, '<b>Work calendar</b>: field visits · other tasks · business trips · training. Click a card to update it; click an empty day or <b>＋ Add task</b> to add one.'],
  ])}${tip('Card colour = task type; the small dot = status. Overdue tasks are grouped in the red button above the calendar.')}</div>
  <div class="col-f">${br('en_cal', 700)}</div></div>` });

slide({ sec: 'MOBILE', kick: 'FOR SALES IN THE FIELD', acc: '#2F6B4A', title: 'Bottom bar · Today · ＋ Quick add', sub: 'Everything within thumb reach', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Bottom bar: <b>Calendar</b> · <b>Customers</b> · <b>Today</b> · <b>New accounts</b> · <b>More</b> (all other functions, feed, colours, FY…).'],
    [2, '<b>Today</b>: today\'s tasks, overdue and upcoming ones — the number on the button = tasks not done yet.'],
    [3, 'The floating <b>＋</b> at the bottom right: add a Field visit · Other task · Business trip request.'],
  ])}${tip('The weekly calendar scrolls to today automatically; scroll up to see past days.')}</div>
  <div class="col-f row">${ph('en_m_cal', 230)}${ph('en_m_today', 230)}</div></div>` });

slide({ sec: 'FIELD VISITS', kick: 'ON THE SPOT', acc: '#0E8A7E', title: 'Photo & result in two taps', sub: 'Today\'s open field-visit cards have two buttons', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Take photo</b> → opens the camera; GPS location and time are attached automatically.'],
    [2, '<b>Report result</b> → the form opens with status <b>Completed</b>; fill in <b>Contact met</b> (CBC), the result, next action and customer feedback.'],
    [3, '<b>Save to Sheet</b>: shown in the app immediately and saved to Google Sheet in the background (re-sent automatically on weak networks).'],
  ])}${tip('Visiting tasks require a photo taken on the spot — gallery photos are not accepted.')}</div>
  <div class="col-f row">${ph('en_m_cal', 230, [0, 0.35, 1, 0.65])}${ph('en_m_result', 230)}</div></div>` });

slide({ sec: 'ADD TASKS', kick: 'QUICK ADD · TRIPS', acc: '#7A4FD6', title: 'Add tasks & request business trips', sub: 'Forms open instantly', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Tap <b>＋</b> (mobile) or <b>＋ Add task</b> (desktop) → <b>Field visit</b>, <b>Other task</b> or <b>Business trip request</b>.'],
    [2, '<b>Business trip request</b>: dates, destinations, co-travellers, purpose, expected result, <b>estimated costs</b> (one line per item — Air ticket, Per diem, Hotel…), schedule, equipment → <b>Send proposal</b>. It is written to the Business Trip file and an approval email goes to your manager.'],
    [3, 'Approved trip: click the trip card ▸ <b>Trip report</b> → Key activities · Key findings · Follow-up → save (a Google Doc is created, the trip becomes Completed).'],
  ])}</div>
  <div class="col-f row">${ph('en_m_add', 220)}${br('en_trip', 430, [0.02, 0, 0.96, 1])}</div></div>` });

slide({ sec: 'CUSTOMERS', acc: '#3A5CAA', title: 'Customers & contacts', sub: 'Search by name, code, province or PIC', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Customers</b>: account list, filter by type / area / ADP group, Not met in FY, sort by sales.'],
    [2, 'Click an account → <b>360° profile</b>: visits, contacts (CBC), orders, sales.'],
    [3, '<b>＋ New account</b> and <b>Contacts / event guests</b> (Key stakeholders) can be added right in the app.'],
  ])}${tip('On phones the list is shown as cards: name · type · province · PIC · number of activities.')}</div>
  <div class="col-f row">${br('en_cust', 520, [0, 0, 1, 0.85])}${ph('en_m_cust', 200)}</div></div>` });

if (NA) NA.slides({ slide, steps, tip, br, ph, fig, a });
else slide({ sec: 'NEW ACCOUNTS', kick: 'KPI', acc: '#B06A1F', title: 'New accounts & new SKUs', sub: 'Record a new dealer / SKU with evidence and ask your manager to approve', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>＋ Add a case</b> → choose the account, type (new account / new SKU), distributor and first order date.'],
    [2, 'Drop the evidence (photos, PDF) → <b>Send for approval</b> — your manager receives an email.'],
    [3, 'Only <b>Approved</b> cases count for the KPI. Filter by month / status at the top.'],
  ])}</div>
  <div class="col-f">${br('en_newacc', 690)}</div></div>` });

slide({ sec: 'KPI', kick: 'KPI & TARGETS', acc: '#2E5C8A', title: 'Your KPI and your team\'s', sub: 'From the MMH KPI FY68 file · view only', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Choose <b>Month / Quarter / FY</b>. Top tiles: KPI of the month, quarter to date, year to date, KPIs achieved.'],
    [2, 'Team leaders: the <b>Viewing KPI of</b> bar highlights the selected person; the comparison chart marks them (◀ viewing).'],
    [3, 'Details: weight, target, actual, % achieved. Sales not yet closed by accounting show <b>Not closed</b>.'],
  ])}${tip('Colours follow the KPI file: <b>&lt; 90%</b> grey · <b>90–100%</b> blue · <b>100–120%</b> yellow · <b>&gt; 120%</b> green.')}</div>
  <div class="col-f">${br('en_kpi2', 690)}</div></div>` });

slide({ sec: 'KPI', kick: 'MONTHLY REPORT · QUARTERLY REVIEW', acc: '#2E5C8A', title: 'Monthly KPI report & self-assessment', sub: 'Buttons at the top of KPI & Targets', body: `
  <div class="pair">
    <div>${br('en_kr', 545, [0, 0, 1, 1], 360)}<div class="cap"><b>Monthly KPI report</b>: choose the month, check To / CC (from the organisation chart), write analysis and highlights → <b>Send me a test</b> → <b>Send KPI report</b>. Due on the <b>2nd</b> before 16:00.</div></div>
    <div>${br('en_se', 545, [0, 0, 1, 1], 360)}<div class="cap"><b>Setting Expectation</b>: your quarter KPIs are filled in; write your self-assessment (scores 1–5, strengths, areas to improve) → <b>Download Word file</b>. Due on the <b>9th</b> of the first month of each quarter, 17:00.</div></div>
  </div>` });

slide({ sec: 'KPI', kick: 'ADMIN · DIRECTOR · MANAGERS', acc: '#2E5C8A', title: 'Company Total KPI', sub: 'KPI & Targets ▸ Company Total KPI', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Overview</b>: company sales, the four perspectives and each strategic objective (click to see the linked KPIs).'],
    [2, '<b>Company KPI</b>: click ▸ to open sub-KPIs. <b>Members</b>: each person\'s % by year / quarter / month.'],
    [3, 'Choose <b>Month · Year to date · Full year</b>; <b>How KPI is calculated</b> follows sheet 4. Rule.'],
  ])}</div>
  <div class="col-f">${br('en_kt', 690)}</div></div>` });

slide({ sec: 'REMINDERS', kick: 'SHOWN AT SIGN-IN', acc: '#B04F4B', title: 'Reminders & update notices', sub: 'Shown one after another, never stacked', body: `
  <div class="pair">
    <div>${br('en_dl', 545, [0.1, 0.03, 0.8, 0.97], 380)}<div class="cap"><b>Accounting document deadlines</b> (14th, 15th, 28th, 29th and the due day) · <b>Monthly KPI report</b> on the 2nd (before 16:00) · <b>Quarterly self-assessment</b> on the 9th of the first month of the quarter (before 17:00).</div></div>
    <div>${br('en_upd', 545, [0.18, 0.12, 0.64, 0.78], 380)}<div class="cap"><b>What's new</b>: shown for 7 days after each update; click <b>What's new</b> on the top bar to see all updates again.</div></div>
  </div>` });

slide({ sec: 'MANAGERS', kick: 'VISIBILITY', acc: '#2F6B4A', title: 'Current group · other people\'s trips', sub: 'Management switches groups · team leaders see their team · PICs see their own tasks', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Current group</b> (side menu; on phones: More ▸ Current group): Dental · Surgical · Eyeless · Thailand Surgical.'],
    [2, 'The calendar shows only <b>training</b> where you are the trainer / invited, and <b>your own business trips</b>.'],
    [3, 'Managers click <b>Other people\'s trips: Hidden</b> on the filter bar to show them.'],
  ])}</div>
  <div class="col-f row">${br('en_mgr_cal', 470, [0, 0, 0.62, 0.7])}${ph('en_m_more', 200)}</div></div>` });

slide({ sec: 'HELP', acc: '#3A5CAA', title: 'Need help?', sub: 'Product Team · MANI Medical Hanoi', body: `
  <ul class="dl" style="font-size:17px">
    <li><b>Open the app</b>: ${a(APP)} — add it to your phone home screen (Chrome ▸ ⋮ ▸ Add to Home screen).</li>
    <li><b>Data</b> is stored in each team's Google Sheet; edits on the Sheet appear in the app within seconds.</li>
    <li><b>Weak network</b>: your actions show immediately and are re-sent automatically (status chip at the bottom).</li>
    <li><b>Feedback / issues</b>: contact the Product Team (Giang).</li>
  </ul>` });

writeDeck('MMH CRM User Guide ' + VER);
