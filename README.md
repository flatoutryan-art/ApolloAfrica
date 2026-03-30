# Apollo Africa — Wheeling Mini-Audit Calculator

A production-grade React/Tailwind SPA for qualifying Eskom-Direct customers for grid-wheeling savings, built for **Apollo Africa** (a Reuert Company).

---

## Features

- **3-step Mini-Audit flow** — Eligibility → Facility Data → Feasibility Scorecard
- **Live Feasibility Scorecard** — A/B/C/D grade across 5 scored dimensions
- **Live SVG dial gauges** — animate in real-time as sliders are adjusted
- **NMD slider + quick-presets** — 100 kVA / 500 kVA / 1 MVA / 2.5 MVA
- **Municipal wheeling pathway** — municipality selector + usage profile
- **Lead capture form** — substation pinpointing, 3-month account upload, 2c/kWh survey discount
- **2025–2026 Eskom tariffs** — Megaflex, Miniflex, Ruraflex (NERSA 11 March 2025)
- **Apollo Africa branding** — #0B2B26 green, #C9A84C gold, Syne + DM Sans

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/apollo-wheeling-calculator.git
cd apollo-wheeling-calculator

# 2. Install dependencies
npm install

# 3. Run dev server (http://localhost:5173)
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## Project Structure

```
apollo-wheeling-calculator/
├── public/
│   └── favicon.svg              # Apollo-branded SVG favicon
├── src/
│   ├── index.css                # Global styles + CSS variables
│   ├── main.jsx                 # React entry point
│   └── WheelingCalculator.jsx   # Main calculator (self-contained)
├── index.html                   # Vite HTML shell
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                  # Vercel SPA routing + cache headers
├── .gitignore
└── README.md
```

---

## Deploy to Vercel (Recommended)

**Option A — Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

**Option B — GitHub Integration:**
1. Push repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repo → Vercel auto-detects Vite, no config needed
4. Every push to `main` auto-deploys

---

## Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://<username>.github.io/<repo>",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Also add `base: '/<repo>/'` to `vite.config.js` → `defineConfig({ base: '/<repo>/' })`.

```bash
npm run deploy
```

---

## Calculation Methodology

All figures are indicative only, based on published 2025/26 Eskom tariffs.

| Parameter | Value | Source |
|---|---|---|
| Apollo PPA Rate | 165 c/kWh | Apollo Africa (fully inclusive) |
| WEPS Wheeling Credit | 195 c/kWh | Eskom Gen-Wheeling tariff |
| Eskom Admin Fee | R3 500/month | Gen-Wheeling POD charge |
| SA Grid Emission Factor | 0.93 kg CO₂/kWh | DFFE 2023 |
| Megaflex Blended Rate | 315 c/kWh | NERSA 2025/26 |
| Miniflex Blended Rate | 295 c/kWh | NERSA 2025/26 |
| Ruraflex Blended Rate | 285 c/kWh | NERSA 2025/26 |

**Net Savings Formula:**
```
Monthly Saving = Eskom Variable Energy Cost
              − (Apollo PPA Cost + Admin Fee − WEPS Credit)
```

**Feasibility Scorecard Weights:**
```
NMD Adequacy       25%
Load Factor        20%
TOU Peak Exposure  20%
Tariff Fit         15%
Savings Rate       20%
```

> ⚠️ Fixed Eskom charges (GCC + Network capacity charges) are **not avoided** by wheeling and are excluded from all savings calculations. Apollo Africa does not guarantee specific savings outcomes. Calculations should be verified with a formal site audit.

---

## License

Proprietary — Apollo Africa / Reuert Group. All rights reserved.
