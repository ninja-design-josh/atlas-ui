# Figma Push Runbook

## Prerequisites

- Figma personal access token with "File content" read scope and "Code Connect" write scope
- Token obtained from: Figma → Account Settings → Personal access tokens

## Push Code Connect

```bash
FIGMA_TOKEN=<your-token> npm run figma:push
```

This publishes all 9 component mappings in `src/components/ui/*.figma.tsx` to the
Bento file (`AjwZJsf64tNSbbSSLF234H`). After publishing, the code snippets will
appear in Figma Dev Mode when a mapped component is selected.

## Export Design Tokens

```bash
npm run figma:export-tokens
```

Writes `scripts/figma-tokens-output.json` with 59 color tokens in Figma Variables format.
Import this JSON manually via Figma → Plugins → Variables or the Variables REST API.

## Verify Before Pushing

```bash
npx figma connect parse --skip-update-check
```

Parses all Code Connect files without publishing. Confirms syntax and structure are valid.

## Files

| File | Purpose |
|------|---------|
| `src/components/ui/*.figma.tsx` | Code Connect mappings (9 components) |
| `.figmarc.json` | Code Connect config |
| `scripts/figma-push-tokens.ts` | Token export script |
| `scripts/figma-tokens-output.json` | Generated token JSON (gitignored or committed) |
| `docs/atlas-figma-nodes.md` | Figma node IDs reference |
