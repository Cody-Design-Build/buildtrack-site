// Reads every BuildTrack theme's real colours from the running app (the public demo by
// default) and writes assets/themes.json for the look lab and the wall.
//
//   node scripts/extract-themes.mjs [path/to/BuildTrack] [app url]
//
// Needs playwright-core and a Chromium (PLAYWRIGHT_CORE, CHROMIUM env vars to override).
import { readFileSync, writeFileSync } from 'node:fs';
const [appDir = '../BuildTrack', base = 'https://demo.buildtrack.run'] = process.argv.slice(2);
const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? '/home/ductape/Work/CDB-Website/node_modules/playwright-core/index.mjs');

// Theme ids, names and notes from the app's packs.
const builtin = readFileSync(`${appDir}/src/theming/packs/builtin.ts`, 'utf8');
const omarchy = readFileSync(`${appDir}/src/theming/packs/omarchy-data.ts`, 'utf8');
const themes = [
  ...[...builtin.matchAll(/id: "([^"]+)",\n\s+name: "([^"]+)",\n\s+note: "([^"]+)"/g)].map(([, id, name, note]) => ({ id, name: JSON.parse(`"${name}"`), note: JSON.parse(`"${note}"`), pack: 'BuildTrack' })),
  ...[...omarchy.matchAll(/id: '([^']+)', name: "([^"]+)"/g)].map(([, id, name]) => ({ id, name, note: '', pack: 'Omarchy', font: 'jetbrains-mono' })),
];
const TOKENS = ['background', 'foreground', 'text', 'card', 'sidebar', 'muted', 'muted-foreground', 'faint', 'accent', 'primary', 'primary-foreground', 'destructive', 'border', 'border-strong', 'info', 'success', 'warning', 'c-red', 'c-orange', 'c-amber', 'c-green', 'c-teal', 'c-cyan', 'c-blue', 'c-purple', 'c-pink', 'c-gray'];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/usr/bin/chromium' });
const out = [];
for (const t of themes) {
  const modes = {};
  for (const mode of ['light', 'dark']) {
    const ctx = await browser.newContext();
    await ctx.addInitScript(([id, m]) => localStorage.setItem('bt-appearance', JSON.stringify({ look: { theme: id, mode: m, accent: 'theme', corners: 'standard', font: 'theme' }, updated: '', customized: true })), [t.id, mode]);
    const p = await ctx.newPage();
    await p.goto(base + '/'); await p.waitForTimeout(400);
    const r = await p.evaluate((tokens) => {
      const probe = document.createElement('div'); document.body.append(probe);
      const c = document.createElement('canvas'); c.width = c.height = 1; const x = c.getContext('2d', { willReadFrequently: true });
      const hex = (v) => { probe.style.color = `var(--${v})`; x.clearRect(0, 0, 1, 1); x.fillStyle = '#000'; x.fillStyle = getComputedStyle(probe).color; x.fillRect(0, 0, 1, 1); const [r, g, b] = x.getImageData(0, 0, 1, 1).data; return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join(''); };
      const root = getComputedStyle(document.documentElement);
      const px = document.createElement('div'); px.style.width = 'var(--radius)'; document.body.append(px);
      const radius = Math.round(parseFloat(getComputedStyle(px).width) || 0);
      const stack = root.getPropertyValue('--app-font');
      const font = /Nunito/.test(stack) ? 'nunito' : /JetBrains/.test(stack) ? 'jetbrains-mono' : /Plex/.test(stack) ? 'plex' : 'inter';
      return { mode: document.documentElement.dataset.mode, theme: document.documentElement.dataset.theme, font, radius, colors: Object.fromEntries(tokens.map((k) => [k, hex(k)])) };
    }, TOKENS);
    await ctx.close();
    if (r.theme !== t.id) throw new Error(`${t.id} did not load (got ${r.theme})`);
    modes[r.mode] ??= r.colors; // single-mode themes report their one mode twice
    t.font = r.font;
    t.radius = r.radius;
  }
  // The app groups themes by style (Settings → Appearance): mono is Terminal, rounded Nunito is Soft.
  const style = t.font === 'jetbrains-mono' ? 'Terminal' : t.font === 'nunito' ? 'Soft' : 'Clean';
  out.push({ ...t, style, ...modes });
  process.stdout.write(`${t.id}${modes.light && modes.dark ? '' : ' (one mode)'}  `);
}
await browser.close();
writeFileSync(new URL('../assets/themes.json', import.meta.url), JSON.stringify(out));
console.log(`\nWrote ${out.length} themes`);
