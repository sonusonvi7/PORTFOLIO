# Sonvi Assis Noronha — Portfolio

A scroll-animated, parallax portfolio. Plain HTML, CSS and JavaScript — no build step, no framework.

- Smooth scrolling: [Lenis](https://github.com/darkroomengineering/lenis)
- Scroll animation: [GSAP](https://gsap.com) + ScrollTrigger (both are included locally in `js/vendor/`, so the site works offline)
- Fonts: Bricolage Grotesque and Instrument Sans (loaded from Google Fonts)

## Run it on your computer

Open `index.html` in a browser, or run a tiny local server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Where to edit things

| What | File |
| --- | --- |
| Text, projects, links, certifications | `index.html` |
| Colours, fonts, spacing | `css/style.css` (colours are the variables at the top) |
| Animations | `js/main.js` |
| Photos, résumé, social preview | `assets/` |

To change the photo, replace `assets/sonvi-portrait.jpg` and `assets/sonvi-portrait.webp` (keep the 3:4 shape).
The face-detection overlay is drawn for the current photo; if you swap the picture, the box and dots in the
`<svg class="detect">` block of `index.html` need new coordinates.

## Deploy

1. Push to GitHub (see the steps in the chat reply, or):
   ```bash
   git init
   git add .
   git commit -m "Add portfolio website"
   git branch -M main
   git remote add origin https://github.com/sonusonvi7/portfolio.git
   git push -u origin main
   ```
2. On https://vercel.com, choose **Add New → Project**, import the repository, and click **Deploy**.
   Leave Framework Preset as **Other** and keep every build setting empty.
3. After the first deploy, replace `https://YOUR-SITE.vercel.app` in the three `og:` lines of `index.html`
   with your real address, commit and push. This makes the LinkedIn preview card show your photo.
