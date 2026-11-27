# buildtrack.run

The public website for [BuildTrack](https://github.com/Cody-Design-Build/BuildTrack): what it is, who it's for, and a link to the code.

Plain HTML and CSS, no build step. Open `index.html` through any static server to preview:

```
python3 -m http.server 4180
```

Pushing to `main` deploys to https://buildtrack.run (Vercel project `buildtrack-site`, team CDB Team). Pull requests get a preview link.

## The live parts

The hero, the look lab, the theme wall and the agent demo aren't screenshots: `app.js` builds a miniature BuildTrack in HTML and styles it with each theme's real colours from `assets/themes.json`. When the app gains or changes themes, regenerate that file from the live demo:

```
node scripts/extract-themes.mjs ../BuildTrack https://demo.buildtrack.run
```

(It needs playwright-core and Chromium; see the top of the script.) Motion stops for visitors who prefer reduced motion.

Screenshots in `assets/shots/` are taken from the app's sample data. Retake them when the app changes noticeably, and keep the copy honest: only describe features the app actually has.
