# Pancho PFP Forge (Next.js)

A premium-style Next.js app that generates Pancho PFPs using your local transparent Pancho assets and procedural scene backgrounds.

## 1) What is already done for you

- Next.js app scaffolded
- UI redesigned to feel premium
- Pancho assets auto-load from `public/assets/rotations`
- 45 existing Pancho PNGs copied in from your previous folder
- Generation, rarity-style seeds, and download limits wired up
- Platform export sizes: Telegram, X.com, TikTok, Instagram, Master

## 2) If you have more than 45 images

Copy additional images into:

`public/assets/rotations`

Use names like: `image46.png`, `image47.png`, etc.

## 3) Run it locally

```bash
cd "/Users/dirdiebirdies/Documents/New project"
npm install
npm run dev
```

Then open:

`http://localhost:3000`

## 4) Use it

1. Choose how many PFPs to generate.
2. Set download cap (for originality).
3. Toggle vibe themes.
4. Click `Generate Set`.
5. Pick platform size and download.

## 5) Main project files

- `app/page.js` - loads Pancho assets from disk
- `components/ForgeApp.jsx` - generator logic and UI
- `app/globals.css` - premium visual design

## 6) Optional next upgrades

- AI photoreal backgrounds (API-powered)
- Wallet connect + mint selected editions
- Admin panel to set rarity weights and event themes
