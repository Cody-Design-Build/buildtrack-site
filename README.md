# buildtrack.run

The public website for [BuildTrack](https://github.com/Cody-Design-Build/BuildTrack): what it is, who it's for, and a link to the code.

Plain HTML and CSS, no build step. Open `index.html` through any static server to preview:

```
python3 -m http.server 4180
```

Pushing to `main` deploys to https://buildtrack.run (Vercel project `buildtrack-site`, team CDB Team). Pull requests get a preview link.

Screenshots in `assets/shots/` are taken from the app's sample data. Retake them when the app changes noticeably, and keep the copy honest: only describe features the app actually has.
