# 💰 PayDrop

**Elegant payday countdown dashboard** — visualize how close you are to payday with a beautiful progress ring, live countdown, and daily pay calculator.

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=fff)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a84c.svg)](LICENSE)

[中文](README_zh.md)

> Every month has *that one day* you look forward to — PayDrop makes the wait a little more fun.

## Features

| Feature | Description |
|---|---|
| **Live Countdown** | Days, hours, minutes & seconds until your next payday, with smooth flip animations |
| **Progress Ring** | Animated gold-gradient arc showing how far through the pay cycle you are |
| **Actual Working Days** | Daily average salary calculated using real working days (China public holiday API) |
| **Compensation Calculator** | Layoff compensation estimator supporting N / N+1 / 2N schemes per PRC labor law |
| **Salary Ledger** | Record & review monthly salary history, stored locally |
| **Spring Toy** | Interactive canvas-based spring physics simulation — drag it for stress relief |
| **Light / Dark Theme** | One-click toggle between *Vault Noir* and *Ivory Dial* themes, persisted in localStorage |
| **Responsive** | Mobile-first layout with a centered floating card on desktop |
| **Privacy First** | All data stored in `localStorage` — nothing leaves your browser |

## Preview

| Dark — *Vault Noir* | Light — *Ivory Dial* |
|---|---|
| ![dark](assets/preview-dark.png) | ![light](assets/preview-light.png) |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` and click **开始设置** to configure your payday.

## Tech Stack

| Technology | Role |
|---|---|
| **Vue 3** | Reactive UI framework with Composition API (`<script setup>`) |
| **Vite** | Lightning-fast dev server and build tool |
| **TailwindCSS** | Utility-first styling with CSS-variable-driven theming |
| **VueUse** | Composables — `useLocalStorage`, `useWindowSize` |
| **Canvas API** | Spring physics simulation rendering |
| **Holiday API** | [holiday-cn](https://github.com/NateScarlet/holiday-cn) via jsDelivr CDN for accurate workday data |

## Project Structure

```
paydrop/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CompensationModal.vue   # Layoff compensation calculator
│   │   ├── CountdownBlock.vue      # Flip-style countdown digits
│   │   ├── ProgressRing.vue        # SVG progress ring with gradient
│   │   ├── SalaryHistory.vue       # Salary ledger list
│   │   ├── SetupModal.vue          # Payday & salary configuration
│   │   └── SpringToy.vue           # Canvas spring physics toy
│   ├── composables/
│   │   ├── useHoliday.js           # Holiday API fetch & caching
│   │   ├── usePayday.js            # Core countdown & salary logic
│   │   └── useTheme.js             # Light/dark theme toggle
│   ├── App.vue                     # Root layout & orchestration
│   ├── main.js                     # App entry point
│   └── style.css                   # Theme variables & global styles
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## How It Works

1. **Set your payday** — pick the day of month (1–28) and optionally enter your salary
2. **Watch the countdown** — the progress ring and timer update every second
3. **Check daily pay** — calculated from actual working days in the current month, excluding weekends and Chinese public holidays
4. **Explore tools** — open the compensation calculator or salary ledger from the header icons
5. **Switch themes** — click the sun/moon icon to toggle between dark and light

## License

[MIT](LICENSE)
