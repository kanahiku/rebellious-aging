# Page Build Prompt — Reusable Template

Copy the relevant block below, fill in the blanks, paste into Cursor Agent mode.

---

## Single Page Build

```
Build [Page Name] from Figma.

Figma page node: [NODE_ID]
Output: src/pages/[route]/index.astro

Follow the page-build rule exactly:

1. Call Figma MCP on node [NODE_ID] — get ALL direct children in one call.
2. Screenshot the full page.
3. Write the section map (match to components.json pattern IDs, flag gaps ⚠️).
4. Build any missing widgets + register them in components.json.
5. Compose the complete index.astro in one shot — no pausing between sections.

Image rule: every image in Figma = grey <div> placeholder with correct aspect-ratio and rounded corners. No real images, no Figma localhost URLs.

Do not ask for per-section approval. Build the whole page.
```

---

## Full Site Build (20–30 pages)

```
Build the full site from Figma.

Pages (in order):
- /                    → Figma node [ID] → src/pages/index.astro
- /about               → Figma node [ID] → src/pages/about/index.astro
- /services            → Figma node [ID] → src/pages/services/index.astro
- /contact             → Figma node [ID] → src/pages/contact/index.astro
[add all pages here]

Follow the page-build rule for EACH page:
- Phase A: scan all sections (one Figma MCP call per page)
- Phase B: build missing widgets + register in components.json
- Phase C: compose full index.astro in one shot

Rules:
- Do not pause between pages for approval.
- Reuse widgets built for earlier pages — do not rebuild the same pattern.
- Every image = grey <div> placeholder (correct aspect-ratio from Figma, bg-section-grey, rounded corners).
- Run npm run build ONCE after all pages are done, fix all errors together.
```

---

## Design System First (new client / new Figma file)

Run this BEFORE any page builds when starting a new project.

```
Extract the design system from Figma file [FILE_ID].

1. Get Variables / Design System frame from Figma MCP.
2. Update src/brand.ts:
   - colors (sectionDark, accent, cta, card, etc.)
   - fonts (family, weights — desktop AND mobile sizes)
   - radius
3. Update src/config/site.ts (name, URL, description, GTM, GSC).
4. Update src/config/contact.ts (phone, email, address).
5. Restyle atoms to match Figma:
   - src/components/ui/Button.astro
   - src/components/ui/Heading.astro (all variants)
   - src/components/ui/Text.astro
   - src/components/ui/Card.astro (all variants)
6. Do NOT build any pages yet. Stop after atoms are confirmed.
```

---

## Add a Missing Section to an Existing Page

```
Add [Section Name] to src/pages/[route]/index.astro.

Figma node for this section: [NODE_ID]

1. Screenshot the section from Figma.
2. Check components.json — does a matching pattern exist?
   - YES: use it, pass the right props.
   - NO: build src/components/widgets/[Name].astro, register in components.json, then use it.
3. Insert the widget in the correct position in index.astro.
4. Image slots: grey <div> placeholder with aspect-ratio from Figma.
5. Do not touch any other sections in the page.
```

---

## How to Find Figma Node IDs

In Figma:
1. Right-click any frame → "Copy link to selection"
2. The URL contains `node-id=X-Y` — that is your node ID (use `X:Y` format for MCP calls)

Or: select the frame → inspect panel → the node ID is shown at the top.

---

## Tips

- Always run the **Design System** prompt before the first page build on a new project.
- For a 20-page site: fill in all page node IDs in the Full Site Build prompt, fire once, walk away.
- If Figma MCP needs auth, the agent will call `mcp_auth` automatically — let it.
- After the build run: review grey boxes and swap in real images one by one in a separate pass.
