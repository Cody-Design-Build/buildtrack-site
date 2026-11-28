// buildtrack.run: the live mini-app in the hero.
// Every BuildTrack you see on the page is this HTML styled by a theme's colours
// (assets/themes.json, read from the real app by scripts/extract-themes.mjs).
const FONTS = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  system: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  plex: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  'jetbrains-mono': "'JetBrains Mono', ui-monospace, monospace",
};

// ---------- the mini app ----------
const ICON = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const NAV = [
  ['Home', 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z'],
  ['Jobs', 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z'],
  ['Tasks', 'M4 4h16v16H4zM8 12l3 3 5-6'],
  ['Schedule', 'M4 6h16v14H4zM4 10h16M9 3v5M15 3v5'],
  ['Budgets', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h3'],
  ['Bids', 'M8 4h8v4H8zM5 6h3M16 6h3M5 6v15h14V6'],
  ['Invoices', 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6'],
  ['Bills', 'M5 5h14v14H5zM12 8v8M9.5 10a2.5 2 0 0 1 5 0M14.5 14a2.5 2 0 0 1-5 0'],
];
const RECORDS = [
  ['Documents', 'M6 3h9l3 3v15H6zM9 11h6M9 15h6'],
  ['People', 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4a3.5 3.5 0 0 1 0 7M18 14c2 .7 3 2.8 3 6'],
  ['Accounts', 'M4 21V8l8-5 8 5v13M9 21v-6h6v6M8 11h2M14 11h2'],
];
const INVOICES = [
  ['Invoice 12-2', 'Harper Household', 'Overdue', 'red', '$15,139'],
  ['Invoice 8-2', 'Sam Ortiz', 'Sent', 'amber', '$15,776'],
  ['Invoice 11-5', 'Kim & Lee', 'Paid', 'green', '$34,792'],
];
const TASKS = [
  ['Walk 2200 Mesa with the clients', 'Today', false],
  ['Order tile samples · 87th St. ADU', 'Dec 4', false],
  ['Send change order 12-4', 'Done', true],
];
const JOBS = [
  ['Rivera Household', 'Oak Avenue Bathrooms', 'In progress', 'blue', '$85,520'],
  ['Patel Household', '87th St. ADU', 'In progress', 'blue', '$284,795'],
  ['Kim & Lee', '1448 Elm · Full remodel', 'Approved', 'green', '$696,419'],
  ['Northgate Homes', '2200 Mesa · ADU', 'Bidding', 'amber', '$137,845'],
  ['Brooks Family', '77 Juniper · Addition', 'Lead', 'purple', '$54,600'],
];
const GANTT = [
  ['Demolition', 4, 18, 100],
  ['Framing', 16, 34, 70],
  ['Rough plumbing', 30, 22, 35],
  ['Drywall', 48, 26, 0],
  ['Tile', 66, 20, 0],
];

function miniHTML({ compact = false } = {}) {
  const nav = NAV.map(([n, d], i) => `<span class="m-nav${i === 0 ? ' on' : ''}">${ICON(d)}<i>${n}</i></span>`).join('');
  const records = RECORDS.map(([n, d]) => `<span class="m-nav">${ICON(d)}<i>${n}</i></span>`).join('');
  const invoices = INVOICES.map(([n, who, st, slot, t]) => `<div class="m-row m-row3"><span class="m-strong">${n}</span><span class="m-dim">${who}</span><span class="m-pill" style="--c: var(--c-${slot})">${st}</span><span class="num">${t}</span></div>`).join('');
  const tasks = TASKS.map(([t, when, done]) => `<div class="m-task${done ? ' done' : ''}"><span class="m-check"></span><span class="m-strong">${t}</span><span class="m-dim">${when}</span></div>`).join('');
  const stats = [
    ['Active contracts', '$2,178,255', '6 jobs underway'],
    ['Open invoices', '$108,327', '5 awaiting payment'],
    ['Pipeline', '$59,550', '5 leads & estimates'],
    ['Margin', '15.2%', 'across approved work'],
  ]
    .slice(0, compact ? 3 : 4)
    .map(([l, v, s]) => `<div class="m-card m-stat"><span class="m-label">${l}</span><b class="num">${v}</b><small>${s}</small></div>`)
    .join('');
  const rows = JOBS.slice(0, compact ? 4 : 5)
    .map(([c, j, st, slot, t]) => `<div class="m-row"><span class="m-strong">${c}</span><span class="m-dim">${j}</span><span class="m-pill" style="--c: var(--c-${slot})">${st}</span><span class="num">${t}</span></div>`)
    .join('');
  const gantt = GANTT.map(([n, x, w, p]) => `<div class="m-g"><span class="m-dim">${n}</span><span class="m-track"><span class="m-bar" style="left:${x}%;width:${w}%"><span style="width:${p}%"></span></span></span></div>`).join('');
  return `
    <aside class="m-side">
      <div class="m-brand"><svg class="m-logo" viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="41" width="30" height="13" rx="3.5" fill="currentColor"/><rect x="17" y="25.5" width="30" height="13" rx="3.5" fill="currentColor"/><rect x="29" y="10" width="30" height="13" rx="3.5" fill="var(--primary)"/></svg>BuildTrack</div>
      <div class="m-group">Work</div>${nav}${compact ? '' : `<div class="m-group">Records</div>${records}`}
      <div class="m-user"><span class="m-avatar">DC</span><span><b>Dana Cole</b><small>Acme Design Build Co.</small></span></div>
    </aside>
    <div class="m-main">
      <div class="m-top"><span class="m-search">⌕&nbsp; Search Acme Design Build Co…</span><span class="m-btn">Calendar</span><span class="m-btn primary">+ New</span></div>
      <div class="m-page">
        <div class="m-crumb">Acme Design Build Co. · Lic# 123456</div>
        <div class="m-title">Good morning, Dana</div>
        <div class="m-stats">${stats}</div>
        <div class="m-cols">
          <div class="m-card"><div class="m-head">Active jobs <span class="m-count">5</span></div>${rows}<div class="m-row m-total"><span>Total</span><span></span><span></span><span class="num">$1,259,179</span></div></div>
          ${compact ? '' : `<div class="m-card"><div class="m-head">Schedule · 2243 Lincoln</div>${gantt}<div class="m-actions"><span class="m-btn danger">Void</span><span class="m-btn">Send</span><span class="m-btn primary">Approve</span></div></div>`}
        </div>
        ${compact ? '' : `<div class="m-cols">
          <div class="m-card"><div class="m-head">Open invoices <span class="m-count">3</span></div>${invoices}</div>
          <div class="m-card"><div class="m-head">My tasks <span class="m-count">2</span></div>${tasks}</div>
        </div>`}
      </div>
    </div>`;
}

// The host is a size container, so the app inside scales with its own width
// (cqi units), like a picture: nothing reflows or overflows at any size.
function makeMini(el, opts) {
  el.classList.add('mini-host');
  el.innerHTML = `<div class="mini">${miniHTML(opts)}</div>`;
  return el;
}

/** Styles a mini app with a theme's colours, plus optional changes ({mode, colors, font, radius}). */
function paint(el, theme, { mode = 'light', colors = {}, font, radius = 6 } = {}) {
  const m = mode === 'dark' && theme.dark ? 'dark' : theme.light ? 'light' : 'dark';
  for (const [k, v] of Object.entries({ ...theme[m], ...colors })) el.style.setProperty(`--${k}`, v);
  el.style.setProperty('--font', FONTS[font ?? theme.font ?? 'inter']);
  el.style.setProperty('--r', `${radius}px`);
  el.dataset.mode = m;
}

// ---------- page ----------
const themes = await (await fetch('/assets/themes.json?v=3')).json();
const byId = Object.fromEntries(themes.map((t) => [t.id, t]));

// Hero: a live BuildTrack in its own look, light or dark to match the visitor.
const hero = makeMini(document.getElementById('hero-mini'));
const dark = matchMedia('(prefers-color-scheme: dark)');
const heroShow = () => paint(hero, byId.buildtrack, { mode: dark.matches ? 'dark' : 'light' });
heroShow();
dark.addEventListener('change', heroShow);

// Looks: the same BuildTrack in a few very different themes.
const LOOKS = [
  { id: 'blueprint', mode: 'dark', big: true },
  { id: 'kraft', mode: 'light' },
  { id: 'hi-vis', mode: 'dark' },
  { id: 'sage', mode: 'light' },
  { id: 'walnut', mode: 'dark' },
  // Somebody's own brand: Graphite with a teal accent, rounder corners and IBM Plex.
  { id: 'graphite', mode: 'light', label: 'Your brand', colors: { primary: '#0f766e', 'primary-foreground': '#ffffff', accent: '#e6f2f0' }, font: 'plex', radius: 12 },
];
const grid = document.getElementById('looks-grid');
for (const look of LOOKS) {
  const t = byId[look.id];
  if (!t) continue;
  const fig = document.createElement('figure');
  fig.className = `look${look.big ? ' big' : ''}`;
  const host = document.createElement('div');
  fig.append(host);
  makeMini(host);
  paint(host, t, look);
  const cap = document.createElement('figcaption');
  cap.innerHTML = look.label ? `<b>${look.label}</b> <span class="cap-more">your colours, font and corners</span>` : `<b>${t.name}</b> ${look.mode}`;
  fig.append(cap);
  grid.append(fig);
}

// Copy buttons.
document.querySelectorAll('[data-copy]').forEach((b) => {
  b.onclick = async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent.trim());
      b.textContent = 'Copied';
      setTimeout(() => (b.textContent = 'Copy'), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
});

// Theme count in the copy.
document.querySelectorAll('[data-theme-count]').forEach((el) => (el.textContent = themes.length));
