## Atlas UI Figma File (Standalone Visual Reference)

Figma file: `iB6n4nWmITMqkasBinHBlW`
URL: https://www.figma.com/design/iB6n4nWmITMqkasBinHBlW
Created: 2026-03-12
Purpose: Visual documentation for the Atlas UI component showcase.
         Code Connect node IDs remain in the Bento section below.

---

# Atlas UI — Figma Component Node IDs

Figma file: `AjwZJsf64tNSbbSSLF234H` (Bento Component Library)

These node IDs are used by `@figma/code-connect` to link Atlas UI components
to their Figma counterparts. Each ID points to the primary default-state symbol
for that component.

| Component | Import path | Figma node ID | Notes |
|-----------|-------------|---------------|-------|
| Button | `@/components/ui/button` | `318:1088` | Button / Primary / Default (within Buttons frame `451:91`) |
| Input | `@/components/ui/input` | `318:1162` | Text Field / Default (within Forms frame `2913:2280`) |
| Textarea | `@/components/ui/textarea` | `2913:1944` | Large Text Field / Default (within Forms frame `2913:2283`) |
| Select | `@/components/ui/select` | `318:1189` | Dropdown Field / Default (within Forms frame `2913:2281`) |
| Checkbox | `@/components/ui/checkbox` | `371:636` | Form / Elements / Checkbox frame |
| Switch | `@/components/ui/switch` | `371:637` | Form / Elements / Toggle frame |
| Badge | `@/components/ui/badge` | `552:28` | Elements / Status Tag frame |
| Avatar | `@/components/ui/avatar` | `353:1349` | User Avatar frame |
| Card | `@/components/ui/card` | `318:1376` | Elements / Page / Card symbol |

## Parent Frames (for navigation reference)

| Frame | Node ID | Contents |
|-------|---------|----------|
| Buttons | `451:91` | All button variants |
| Forms | `451:93` | Input, Textarea, Select, Checkbox, Toggle |
| Elements | `451:92` | Avatar, Status Tag, Card |

## Usage

These IDs are consumed by `scripts/figma-push-tokens.ts` and the `.figma.tsx`
Code Connect files in `src/components/ui/`. See Task 18–19 of the implementation
plan for details.
