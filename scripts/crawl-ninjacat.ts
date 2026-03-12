import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const EMAIL    = process.env.NINJACAT_EMAIL;
const PASSWORD = process.env.NINJACAT_PASSWORD;
const BASE_URL = "https://app.ninjacat.io";
const OUT_DIR  = join(process.cwd(), "audit");

if (!EMAIL || !PASSWORD) {
  console.error("Missing NINJACAT_EMAIL or NINJACAT_PASSWORD in .env.local");
  process.exit(1);
}

// Seed routes — script also auto-discovers from sidebar nav
const SEED_ROUTES = [
  { path: "/",                      name: "overview"               },
  { path: "/dashboard",             name: "dashboard"              },
  { path: "/reports",               name: "reports"                },
  { path: "/clients",               name: "clients"                },
  { path: "/campaigns",             name: "campaigns"              },
  { path: "/settings",              name: "settings"               },
  { path: "/settings/profile",      name: "settings-profile"       },
  { path: "/settings/team",         name: "settings-team"          },
  { path: "/settings/integrations", name: "settings-integrations"  },
  { path: "/settings/billing",      name: "settings-billing"       },
];

async function main() {
  mkdirSync(join(OUT_DIR, "screenshots"), { recursive: true });
  mkdirSync(join(OUT_DIR, "html"),        { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page    = await context.newPage();

  // --- Login ---
  console.log("Logging in...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.fill("input[type='email']",    EMAIL!);
  await page.fill("input[type='password']", PASSWORD!);
  await page.click("button[type='submit']");
  await page.waitForURL((url) => !url.toString().includes("/login"), { timeout: 15000 });
  console.log("Authenticated ✓\n");

  // --- Discover extra routes from sidebar ---
  const discovered = new Set<string>(SEED_ROUTES.map((r) => r.path));
  const hrefs = await page.$$eval("nav a[href], aside a[href]", (els) =>
    els
      .map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/") && !h.includes("#"))
  );
  hrefs.forEach((h) => discovered.add(h));

  // Merge seed with discovered, preserving names for seed routes
  const seedMap = new Map(SEED_ROUTES.map((r) => [r.path, r.name]));
  const allRoutes = [...discovered].map((path) => ({
    path,
    name: seedMap.get(path) ?? path.replace(/\//g, "-").replace(/^-/, ""),
  }));

  console.log(`Crawling ${allRoutes.length} routes...\n`);

  for (const route of allRoutes) {
    process.stdout.write(`  ${route.path} ... `);
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(600);

      await page.screenshot({
        path: join(OUT_DIR, "screenshots", `${route.name}.png`),
        fullPage: true,
      });

      const html = await page.content();
      writeFileSync(join(OUT_DIR, "html", `${route.name}.html`), html, "utf-8");

      console.log("✓");
    } catch (err) {
      console.log(`✗ (${(err as Error).message.split("\n")[0]})`);
    }
  }

  await browser.close();
  console.log(`\nDone → audit/ (${allRoutes.length} routes)`);
  console.log("  audit/screenshots/  — full-page PNGs");
  console.log("  audit/html/         — HTML snapshots");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
