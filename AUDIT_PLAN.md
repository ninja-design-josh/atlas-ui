# NinjaCat App Audit Plan

## Purpose

Crawl the live NinjaCat app (`app.ninjacat.io`), capture full-page screenshots and HTML snapshots of every route, and store them in `audit/`. These become the **reference library** for building Atlas UI components that match the real product.

---

## Setup

### 1. Add credentials to `.env.local` (never commit)

```
NINJACAT_EMAIL=your@email.com
NINJACAT_PASSWORD=yourpassword
```

### 2. Install dependencies (one-time)

```bash
npm install -D playwright dotenv
npx playwright install chromium
```

### 3. Run the crawler

```bash
npm run crawl
```

---

## Base URL

```
https://app.ninjacat.io
```

Login page: `https://app.ninjacat.io/login`

---

## Known Routes (seed list)

These are crawled first. The script also auto-discovers additional routes from the left sidebar nav.

| Path | Name |
|------|------|
| `/` | overview |
| `/dashboard` | dashboard |
| `/reports` | reports |
| `/clients` | clients |
| `/campaigns` | campaigns |
| `/settings` | settings |
| `/settings/profile` | settings-profile |
| `/settings/team` | settings-team |
| `/settings/integrations` | settings-integrations |
| `/settings/billing` | settings-billing |

To add a new route: add an entry to `SEED_ROUTES` in `scripts/crawl-ninjacat.ts` and add a row to the table above.

---

## Output

```
audit/
  screenshots/    ← full-page PNGs (1440×900 viewport)
  html/           ← raw HTML snapshots
```

Both directories are gitignored.

---

## Atlas UI Visual Check

After any CSS or layout change to the Atlas UI docs, run:

```bash
npm run check:ui
```

This screenshots all 10 docs routes on `localhost:3000` and saves them to `scripts/screenshots/`. Read any PNG to verify the layout before declaring done.

**Rule:** Any task that adds/removes/renames a docs route must also update the `ROUTES` array in `scripts/visual-check.ts`.
