// buildtrack.run: the live mini-app, the look lab, the wall and the agent demo.
// Every BuildTrack you see on the page is this HTML styled by a theme's colours
// (assets/themes.json, read from the real app by scripts/extract-themes.mjs).
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FONTS = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  system: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  plex: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  'jetbrains-mono': "'JetBrains Mono', ui-monospace, monospace",
};
const SLOTS = ['red', 'orange', 'amber', 'green', 'teal', 'cyan', 'blue', 'purple', 'pink', 'gray'];

// ---------- colour helpers ----------
const lum = (hex) => {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const readable = (bgHex, a, b) => {
  const ratio = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  return ratio(lum(bgHex), lum(a)) >= ratio(lum(bgHex), lum(b)) ? a : b;
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
const JOBS = [
  ['Rivera Household', 'Oak Avenue Bathrooms', 'In progress', 'blue', '$65,465'],
  ['Patel Household', '87th St. ADU', 'In progress', 'blue', '$219,050'],
  ['Kim & Lee', '1448 Elm · Full remodel', 'Approved', 'green', '$535,255'],
  ['Northgate Homes', '2200 Mesa · ADU', 'Bidding', 'amber', '$105,950'],
  ['Brooks Family', '77 Juniper · Addition', 'Lead', 'purple', '$42,000'],
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
  const stats = [
    ['Active contracts', '$1,672,957', '6 jobs underway'],
    ['Open invoices', '$83,340', '5 awaiting payment'],
    ['Pipeline', '$45,800', '5 leads & estimates'],
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
      <div class="m-brand"><span class="m-logo">T</span>BuildTrack</div>
      <div class="m-group">Work</div>${nav}
      <div class="m-user"><span class="m-avatar">DC</span><span><b>Dana Cole</b><small>Acme Design Build Co.</small></span></div>
    </aside>
    <div class="m-main">
      <div class="m-top"><span class="m-search">⌕&nbsp; Search Acme Design Build Co…</span><span class="m-btn">Calendar</span><span class="m-btn primary">+ New</span></div>
      <div class="m-page">
        <div class="m-crumb">Acme Design Build Co. · Lic# 123456</div>
        <div class="m-title">Good morning, Dana</div>
        <div class="m-stats">${stats}</div>
        <div class="m-cols">
          <div class="m-card"><div class="m-head">Active jobs <span class="m-count">5</span></div>${rows}<div class="m-row m-total"><span>Total</span><span></span><span></span><span class="num">$967,720</span></div></div>
          ${compact ? '' : `<div class="m-card"><div class="m-head">Schedule · 2243 Lincoln</div>${gantt}<div class="m-actions"><span class="m-btn danger">Void</span><span class="m-btn">Send</span><span class="m-btn primary">Approve</span></div></div>`}
        </div>
      </div>
    </div>`;
}

function makeMini(el, opts) {
  el.classList.add('mini');
  el.innerHTML = miniHTML(opts);
  return el;
}

/** Styles a mini app with a theme and a look ({mode, accent, font, radius, numbers, overrides}). */
function paint(el, theme, look = {}) {
  const mode = look.mode === 'dark' ? (theme.dark ? 'dark' : 'light') : theme.light ? 'light' : 'dark';
  const c = { ...theme[mode], ...(look.overrides ?? {}) };
  const s = el.style;
  for (const [k, v] of Object.entries(c)) s.setProperty(`--${k}`, v);
  if (look.accent && look.accent !== 'theme') {
    const p = c[`c-${look.accent}`];
    s.setProperty('--primary', p);
    s.setProperty('--primary-foreground', readable(p, '#ffffff', c.background));
    s.setProperty('--accent', `color-mix(in oklab, ${p} 12%, ${c.card})`);
  }
  if (look.overrides?.primary && !look.overrides['primary-foreground']) s.setProperty('--primary-foreground', readable(look.overrides.primary, '#ffffff', '#111111'));
  s.setProperty('--font', FONTS[look.font && look.font !== 'theme' ? look.font : theme.font ?? 'inter']);
  s.setProperty('--r', `${look.radius ?? 6}px`);
  el.dataset.mode = mode;
  el.classList.toggle('mono-num', look.numbers === 'mono');
  return mode;
}

// ---------- page ----------
const themes = await (await fetch('/assets/themes.json')).json();
const byId = Object.fromEntries(themes.map((t) => [t.id, t]));
// Same name in both packs (Catppuccin, Nord…): say which one on the wall.
const themeLabel = (t) => (t.pack === 'Omarchy' && themes.some((x) => x !== t && x.name === t.name) ? `${t.name} · Omarchy` : t.name);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Hero: a live BuildTrack that cycles through themes.
const hero = makeMini(document.getElementById('hero-mini'));
const heroLabel = document.getElementById('hero-theme');
const heroOrder = ['buildtrack', 'omarchy-kanagawa', 'nord', 'omarchy-everforest', 'tokyo-night', 'omarchy-retro-82', 'gruvbox', 'omarchy-matte-black', 'rose-pine', 'omarchy-osaka-jade', 'catppuccin', 'omarchy-lumon'];
let heroI = 0;
let heroPaused = false;
const heroShow = () => {
  const t = byId[heroOrder[heroI % heroOrder.length]];
  const darkFirst = heroI % 2 === 1;
  const mode = paint(hero, t, { mode: darkFirst ? 'dark' : 'light' });
  heroLabel.textContent = `${themeLabel(t)} · ${mode}`;
};
heroShow();
hero.addEventListener('mouseenter', () => (heroPaused = true));
hero.addEventListener('mouseleave', () => (heroPaused = false));
if (!reduced) setInterval(() => !heroPaused && (heroI++, heroShow()), 2600);

// The look lab.
const lab = makeMini(document.getElementById('lab-mini'));
const state = { theme: 'buildtrack', mode: 'light', accent: 'theme', font: 'theme', radius: 6, numbers: 'proportional', overrides: {} };
const $ = (id) => document.getElementById(id);

const themeList = $('lab-themes');
for (const pack of ['BuildTrack', 'Omarchy']) {
  const h = document.createElement('div');
  h.className = 'lab-pack';
  h.textContent = pack === 'BuildTrack' ? 'BuildTrack themes' : 'Omarchy themes';
  themeList.append(h);
  const wrap = document.createElement('div');
  wrap.className = 'lab-chips';
  for (const t of themes.filter((x) => x.pack === pack)) {
    const c = t.light ?? t.dark;
    const d = t.dark ?? t.light;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.id = t.id;
    b.innerHTML = `<span class="sw" style="background:linear-gradient(135deg, ${c.background} 50%, ${d.background} 50%)"><i style="background:${c.primary}"></i></span>${t.name}`;
    b.onclick = () => setLab({ theme: t.id, overrides: {} });
    wrap.append(b);
  }
  themeList.append(wrap);
}

const accents = $('lab-accents');
for (const a of ['theme', ...SLOTS]) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'dot';
  b.dataset.accent = a;
  b.title = a === 'theme' ? "Theme's own" : a[0].toUpperCase() + a.slice(1);
  b.onclick = () => setLab({ accent: a, overrides: { ...state.overrides, primary: undefined } });
  accents.append(b);
}

const seg = (id, key) =>
  $(id).querySelectorAll('button').forEach((b) => (b.onclick = () => setLab({ [key]: b.dataset.v })));
seg('lab-mode', 'mode');
seg('lab-font', 'font');
$('lab-radius').oninput = (e) => setLab({ radius: Number(e.target.value) });
$('lab-mono').onchange = (e) => setLab({ numbers: e.target.checked ? 'mono' : 'proportional' });
for (const inp of document.querySelectorAll('[data-color]')) inp.oninput = () => setLab({ overrides: { ...state.overrides, [inp.dataset.color]: inp.value }, ...(inp.dataset.color === 'primary' ? { accent: 'theme' } : {}) });
$('lab-surprise').onclick = () => {
  const t = pick(themes);
  setLab({ theme: t.id, mode: pick(['light', 'dark']), accent: Math.random() < 0.5 ? 'theme' : pick(SLOTS), font: pick(['theme', 'inter', 'plex', 'jetbrains-mono', 'system']), radius: pick([0, 2, 4, 6, 8, 12, 16]), numbers: Math.random() < 0.35 ? 'mono' : 'proportional', overrides: {} });
};
$('lab-reset').onclick = () => setLab({ theme: 'buildtrack', mode: 'light', accent: 'theme', font: 'theme', radius: 6, numbers: 'proportional', overrides: {} });

function setLab(next) {
  Object.assign(state, next);
  for (const k of Object.keys(state.overrides)) if (state.overrides[k] === undefined) delete state.overrides[k];
  const t = byId[state.theme];
  const mode = paint(lab, t, state);
  const c = { ...t[mode], ...state.overrides };
  themeList.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', b.dataset.id === state.theme));
  accents.querySelectorAll('.dot').forEach((b) => {
    b.classList.toggle('on', b.dataset.accent === state.accent);
    b.style.background = b.dataset.accent === 'theme' ? t[mode].primary : t[mode][`c-${b.dataset.accent}`];
  });
  document.querySelectorAll('#lab-mode button').forEach((b) => b.classList.toggle('on', b.dataset.v === state.mode));
  document.querySelectorAll('#lab-font button').forEach((b) => b.classList.toggle('on', b.dataset.v === state.font));
  $('lab-radius').value = state.radius;
  $('lab-radius-v').textContent = `${state.radius}px`;
  $('lab-mono').checked = state.numbers === 'mono';
  for (const inp of document.querySelectorAll('[data-color]')) {
    const key = inp.dataset.color;
    inp.value = key === 'primary' && state.accent !== 'theme' && !state.overrides.primary ? c[`c-${state.accent}`] : c[key];
  }
  $('lab-note').textContent = t.light && t.dark ? '' : `${t.name} is a ${mode}-only theme, so it stays ${mode}.`;
  const primary = state.overrides.primary ?? (state.accent === 'theme' ? c.primary : c[`c-${state.accent}`]);
  const changed = Object.keys(state.overrides).length;
  const font = state.font === 'theme' ? t.font ?? 'inter' : state.font;
  $('lab-code').innerHTML = [
    `<span class="k">// Settings → Appearance → Download this theme</span>`,
    `{`,
    `  <span class="p">"name"</span>: <span class="s">"${t.name}${changed || state.accent !== 'theme' ? ' (yours)' : ''}"</span>,`,
    `  <span class="p">"${mode}"</span>: {`,
    `    <span class="p">"background"</span>: <span class="s">"${c.background}"</span><i class="sw2" style="background:${c.background}"></i>,`,
    `    <span class="p">"foreground"</span>: <span class="s">"${c.foreground}"</span><i class="sw2" style="background:${c.foreground}"></i>,`,
    `    <span class="p">"primary"</span>: <span class="s">"${primary}"</span><i class="sw2" style="background:${primary}"></i>,`,
    `    <span class="p">"card"</span>: <span class="s">"${c.card}"</span><i class="sw2" style="background:${c.card}"></i>`,
    `    <span class="k">// …everything else is worked out from these</span>`,
    `  },`,
    `  <span class="p">"font"</span>: <span class="s">"${font}"</span>,`,
    `  <span class="p">"corners"</span>: <span class="n">${state.radius}</span>${state.numbers === 'mono' ? `,\n  <span class="p">"numbers"</span>: <span class="s">"mono"</span>` : ''}`,
    `}`,
  ].join('\n');
}
setLab({});

// The wall: every theme, live, drifting by. Click one to try it in the lab.
const rows = [themes.filter((_, i) => i % 2 === 0), themes.filter((_, i) => i % 2 === 1)];
document.querySelectorAll('.wall-track').forEach((track, r) => {
  const list = rows[r];
  for (const copy of [0, 1]) {
    for (const t of list) {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      if (copy) tile.setAttribute('aria-hidden', 'true'), (tile.tabIndex = -1);
      const m = document.createElement('div');
      makeMini(m, { compact: true });
      paint(m, t, { mode: r === 0 ? 'light' : 'dark' });
      tile.append(m);
      const label = document.createElement('span');
      label.className = 'tile-name';
      label.textContent = themeLabel(t);
      tile.append(label);
      tile.onclick = () => {
        setLab({ theme: t.id, mode: r === 0 ? 'light' : 'dark', overrides: {} });
        document.getElementById('look-lab').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      };
      track.append(tile);
    }
  }
});

// One sentence in, a different look out.
const LOOKS = {
  blueprint: {
    ask: 'Make BuildTrack look like a blueprint.',
    file: 'blueprint',
    theme: { name: 'Blueprint', font: 'jetbrains-mono', dark: { background: '#0d3b78', foreground: '#f2f7ff', text: '#dbe8ff', card: '#114488', sidebar: '#0a3166', muted: '#174f96', 'muted-foreground': '#a9c4ec', faint: '#7fa3d6', accent: '#1d5aa6', primary: '#ffffff', 'primary-foreground': '#0d3b78', border: '#4d7fc0', 'border-strong': '#86aee0', info: '#9fd0ff', success: '#9ff0c4', warning: '#ffe08a', destructive: '#ff9b9b' } },
    look: { radius: 0, numbers: 'mono', mode: 'dark' },
    code: ["background: '#0d3b78'", "foreground: '#f2f7ff'", "primary: '#ffffff'", "border: '#4d7fc0'", "font: 'jetbrains-mono', corners: 0"],
  },
  brand: {
    ask: 'Our brand: navy and safety orange. Make it ours.',
    file: 'acme-brand',
    theme: { name: 'Acme', font: 'plex', light: { background: '#f4f6f9', foreground: '#0f1b2d', text: '#24324a', card: '#ffffff', sidebar: '#0f1b2d', muted: '#e9edf3', 'muted-foreground': '#5b6b84', faint: '#93a0b5', accent: '#fff0e6', primary: '#ff6b1a', 'primary-foreground': '#ffffff', border: '#dde3ec', 'border-strong': '#c6cfdc', info: '#2c6bd6', success: '#1f9d55', warning: '#e0a100', destructive: '#d64545' } },
    look: { radius: 4, mode: 'light', sidebarDark: true },
    code: ["background: '#f4f6f9'", "foreground: '#0f1b2d'", "primary: '#ff6b1a'  // safety orange", "sidebar: '#0f1b2d'  // navy", "font: 'plex', corners: 4"],
  },
  night: {
    ask: "Night shift: easy on the eyes after dark, nothing bright.",
    file: 'night-shift',
    theme: { name: 'Night shift', font: 'inter', dark: { background: '#120d0a', foreground: '#e8c9a6', text: '#cfb08f', card: '#1a130e', sidebar: '#0e0a08', muted: '#241a13', 'muted-foreground': '#9c806a', faint: '#6e5a4a', accent: '#2b1d12', primary: '#e0913a', 'primary-foreground': '#120d0a', border: '#2c2118', 'border-strong': '#3d2d20', info: '#b58b5e', success: '#9aa36a', warning: '#d9a441', destructive: '#c46a55' } },
    look: { radius: 8, mode: 'dark' },
    code: ["background: '#120d0a'", "foreground: '#e8c9a6'  // warm, no blue", "primary: '#e0913a'", "info: '#b58b5e'", "corners: 8"],
  },
  y1998: {
    ask: 'Make it look like it shipped on a CD-ROM in 1998.',
    file: 'nineteen-98',
    theme: { name: '1998', font: 'system', light: { background: '#008080', foreground: '#000000', text: '#000000', card: '#c0c0c0', sidebar: '#c0c0c0', muted: '#d4d0c8', 'muted-foreground': '#404040', faint: '#808080', accent: '#dcdcdc', primary: '#000080', 'primary-foreground': '#ffffff', border: '#808080', 'border-strong': '#404040', info: '#000080', success: '#008000', warning: '#808000', destructive: '#800000' } },
    look: { radius: 0, mode: 'light' },
    code: ["background: '#008080'  // desktop teal", "card: '#c0c0c0'", "primary: '#000080'", "font: 'system', corners: 0"],
  },
};
for (const l of Object.values(LOOKS)) {
  const base = l.theme.light ?? l.theme.dark;
  for (const s of SLOTS) base[`c-${s}`] ??= base[s === 'red' ? 'destructive' : s === 'green' ? 'success' : s === 'amber' ? 'warning' : s === 'blue' ? 'info' : 'muted-foreground'];
}
const agentMini = makeMini(document.getElementById('agent-mini'));
paint(agentMini, byId.buildtrack, {});
const term = document.getElementById('agent-term');
let run = 0;
async function play(key, btn) {
  const me = ++run;
  document.querySelectorAll('.ask').forEach((b) => b.classList.toggle('on', b === btn));
  const l = LOOKS[key];
  const lines = [
    ['you', `› ${l.ask}`],
    ['dim', ''],
    ['ag', '● Reading AGENTS.md and docs/development.md → Appearance'],
    ['ag', `● Writing src/theming/packs/${l.file}.ts`],
    ...l.code.map((c) => ['code', `    ${c},`]),
    ['ag', '● npm run check  <ok>✓ type check · ✓ build</ok>'],
    ['ag', `● Opened a pull request. Preview: <u>buildtrack-git-${l.file}.vercel.app</u>`],
    ['done', `Done. “${l.theme.name}” is in Settings → Appearance.`],
  ];
  term.innerHTML = '';
  for (const [cls, text] of lines) {
    if (me !== run) return;
    const div = document.createElement('div');
    div.className = `t-${cls}`;
    term.append(div);
    const html = text.replace('<ok>', '<span class="t-ok">').replace('</ok>', '</span>');
    if (reduced || cls !== 'you') {
      div.innerHTML = html;
      await sleep(reduced ? 0 : cls === 'code' ? 90 : 320);
    } else {
      for (let i = 1; i <= text.length; i++) {
        if (me !== run) return;
        div.textContent = text.slice(0, i);
        await sleep(18);
      }
    }
    if (cls === 'done') {
      agentMini.classList.toggle('side-dark', !!l.look.sidebarDark);
      paint(agentMini, l.theme, l.look);
    }
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
document.querySelectorAll('.ask').forEach((b) => (b.onclick = () => play(b.dataset.look, b)));
// Start the first one when the section comes into view.
new IntersectionObserver((entries, obs) => {
  if (entries.some((e) => e.isIntersecting)) {
    obs.disconnect();
    play('blueprint', document.querySelector('.ask[data-look="blueprint"]'));
  }
}, { threshold: 0.35 }).observe(document.getElementById('agent-demo'));

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
