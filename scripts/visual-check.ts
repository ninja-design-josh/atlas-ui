import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE_URL   = "http://localhost:3000";
const OUT_DIR    = join(process.cwd(), "scripts", "screenshots");

// Update this array whenever a docs route is added, removed, or renamed.
const ROUTES = [
  { path: "/",          name: "home"      },
  { path: "/button",    name: "button"    },
  { path: "/input",     name: "input"     },
  { path: "/textarea",  name: "textarea"  },
  { path: "/select",    name: "select"    },
  { path: "/checkbox",  name: "checkbox"  },
  { path: "/switch",    name: "switch"    },
  { path: "/badge",     name: "badge"     },
  { path: "/avatar",    name: "avatar"    },
  { path: "/card",      name: "card"      },
];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page    = await context.newPage();

  console.log(`Screenshotting ${ROUTES.length} Atlas UI routes on ${BASE_URL}...\n`);

  for (const route of ROUTES) {
    process.stdout.write(`  ${route.path} ... `);
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle", timeout: 15000 });
      // Wait for Next.js to inject and load its CSS (App Router injects <link> via JS)
      await page.waitForFunction(() => {
        const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
        return links.length > 0 && links.every((l) => l.sheet !== null);
      }, { timeout: 10000 });
      await page.waitForTimeout(200);

      await page.screenshot({
        path: join(OUT_DIR, `${route.name}.png`),
        fullPage: true,
      });

      console.log("✓");
    } catch (err) {
      console.log(`✗ (${(err as Error).message.split("\n")[0]})`);
    }
  }

  await browser.close();
  console.log(`\nDone → scripts/screenshots/ (${ROUTES.length} routes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
