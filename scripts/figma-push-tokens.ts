/**
 * figma-push-tokens.ts
 *
 * Parses design tokens from src/app/globals.css (@theme block) and writes a
 * Figma Variables REST API-compatible JSON payload to
 * scripts/figma-tokens-output.json.
 *
 * Run with:
 *   npx ts-node --project tsconfig.node.json scripts/figma-push-tokens.ts
 *
 * If ts-node is unavailable, try:
 *   npx tsx scripts/figma-push-tokens.ts
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FigmaToken {
  name: string;
  collection: "Color" | "Spacing" | "Typography";
  value: string;
  type: "COLOR" | "FLOAT" | "STRING";
}

interface TokenOutput {
  Color: FigmaToken[];
  Spacing: FigmaToken[];
  Typography: FigmaToken[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a CSS custom-property name (after stripping the "--color-" prefix)
 * into a Figma variable name with group hierarchy.
 *
 * Rules:
 *   - The first hyphen separator becomes "/" to create a Figma group.
 *   - Subsequent hyphens inside the last segment are preserved as-is.
 *
 * Examples:
 *   grey-0        → grey/0
 *   blue-dark     → blue/dark
 *   brand-lime    → brand/lime
 *   text-primary  → text/primary
 *   surface-raised → surface/raised
 *   border-strong  → border/strong
 */
function toFigmaName(tokenKey: string): string {
  const firstHyphen = tokenKey.indexOf("-");
  if (firstHyphen === -1) return tokenKey;
  const group = tokenKey.slice(0, firstHyphen);
  const rest = tokenKey.slice(firstHyphen + 1);
  return `${group}/${rest}`;
}

// ---------------------------------------------------------------------------
// Parse globals.css
// ---------------------------------------------------------------------------

const CSS_PATH = path.resolve(__dirname, "../src/app/globals.css");
const OUTPUT_PATH = path.resolve(__dirname, "figma-tokens-output.json");

const cssContent = fs.readFileSync(CSS_PATH, "utf-8");

// Extract the @theme { ... } block (handles multi-line content)
const themeMatch = cssContent.match(/@theme\s*\{([\s\S]*?)\}/);
if (!themeMatch) {
  console.error("ERROR: Could not find @theme {} block in globals.css");
  process.exit(1);
}

const themeBlock = themeMatch[1];

// ---------------------------------------------------------------------------
// Extract color tokens
// ---------------------------------------------------------------------------

const colorTokens: FigmaToken[] = [];

// Match lines like:  --color-grey-0:   #FFFFFF;
const colorRegex = /--color-([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
let match: RegExpExecArray | null;

while ((match = colorRegex.exec(themeBlock)) !== null) {
  const rawKey = match[1]; // e.g. "grey-0", "blue-dark", "text-primary"
  const value = match[2].toLowerCase();
  colorTokens.push({
    name: toFigmaName(rawKey),
    collection: "Color",
    value,
    type: "COLOR",
  });
}

// ---------------------------------------------------------------------------
// Assemble output
// ---------------------------------------------------------------------------

const output: TokenOutput = {
  Color: colorTokens,
  Spacing: [],
  Typography: [],
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("Figma token export complete.");
console.log(`  Color    : ${output.Color.length} tokens`);
console.log(`  Spacing  : ${output.Spacing.length} tokens`);
console.log(`  Typography: ${output.Typography.length} tokens`);
console.log(`Output written to: ${OUTPUT_PATH}`);
