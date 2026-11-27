// buildtrack.run: the live mini-app in the hero and the look lab.
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
      <div class="m-brand"><svg class="m-logo" viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="41" width="30" height="13" rx="3.5" fill="currentColor"/><rect x="17" y="25.5" width="30" height="13" rx="3.5" fill="currentColor"/><rect x="29" y="10" width="30" height="13" rx="3.5" fill="var(--primary)"/></svg>BuildTrack</div>
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

// Hero: a live BuildTrack that cycles through themes.
const hero = makeMini(document.getElementById('hero-mini'));
const heroLabel = document.getElementById('hero-theme');
// Deliberately varied: [theme, mode].
const heroOrder = [['buildtrack', 'light'], ['blueprint', 'dark'], ['kraft', 'light'], ['hi-vis', 'dark'], ['sage', 'light'], ['walnut', 'dark'], ['concrete', 'light'], ['omarchy-tokyo-night', 'dark'], ['graphite', 'light'], ['concrete', 'dark']];
let heroI = 0;
let heroPaused = false;
const heroShow = () => {
  const [id, wanted] = heroOrder[heroI % heroOrder.length];
  const t = byId[id];
  const mode = paint(hero, t, { mode: wanted });
  heroLabel.textContent = `${t.name} · ${mode}`;
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
  h.textContent = pack === 'BuildTrack' ? 'BuildTrack' : 'Omarchy basics';
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
$('lab-reset').onclick = () => setLab({ theme: 'buildtrack', mode: 'light', accent: 'theme', font: 'theme', radius: 6, numbers: 'proportional', overrides: {} });

function setLab(next) {
  Object.assign(state, next);
  for (const k of Object.keys(state.overrides)) if (state.overrides[k] === undefined) delete state.overrides[k];
  const t = byId[state.theme];
  const mode = paint(lab, t, state);
  themeList.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', b.dataset.id === state.theme));
  accents.querySelectorAll('.dot').forEach((b) => {
    b.classList.toggle('on', b.dataset.accent === state.accent);
    b.style.background = b.dataset.accent === 'theme' ? t[mode].primary : t[mode][`c-${b.dataset.accent}`];
  });
  document.querySelectorAll('#lab-mode button').forEach((b) => b.classList.toggle('on', b.dataset.v === state.mode));
  document.querySelectorAll('#lab-font button').forEach((b) => b.classList.toggle('on', b.dataset.v === state.font));
  $('lab-radius').value = state.radius;
  $('lab-radius-v').textContent = `${state.radius}px`;
  $('lab-note').textContent = t.light && t.dark ? '' : `${t.name} is a ${mode}-only theme, so it stays ${mode}.`;
}
setLab({});

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
