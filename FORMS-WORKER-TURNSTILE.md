# Shared forms Worker — required frontend changes

This repo is **Rebellious Aging only**. Do not copy R&C Roofing pages, components, or Worker source here.

The contact / PDF-email API is a **shared Cloudflare Worker** already deployed at:

`https://massic-forms.kanahiku.workers.dev`

That Worker is **not** maintained in this repository. Do **not** run `wrangler deploy` from `services/forms/` against the production worker name `massic-forms`. A deploy from here can overwrite the live API for other sites.

---

## What the live Worker now requires

Every `/email-summary` (and `/submit`) request must:

1. Send `site: "rebellious-aging"` (same as `PUBLIC_SITE_SLUG` / `site.formSlug`).
2. Send a fresh Cloudflare Turnstile token.
3. Render Turnstile with **`action` set to that same slug** (`rebellious-aging`). The Worker rejects the token if `action` does not match the site.
4. Use a **dedicated** Turnstile widget whose hostnames include the live domains. Do not reuse another website’s site key.

The Worker already has the matching secret binding `TURNSTILE_SECRET_REBELLIOUS_AGING`. You only update **this** repo’s public key and widget render options.

---

## 1. Public Turnstile site key

Use this public key in production (it is not a secret):

```
0x4AAAAAAFCB6A3BPGXLSKha
```

Widget hostnames already allowed:

- `rebelliousaging.org`
- `www.rebelliousaging.org`
- `rebellious-aging.vercel.app`

### In code — `src/lib/forms.ts`

```ts
export const TURNSTILE_SITE_KEY =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ||
  (import.meta.env.PROD ? '0x4AAAAAAFCB6A3BPGXLSKha' : '1x00000000000000000000AA');
```

Local / dummy key stays `1x00000000000000000000AA`.

### On Vercel

Set **Production**:

| Variable | Value |
|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAFCB6A3BPGXLSKha` |
| `PUBLIC_SITE_SLUG` | `rebellious-aging` |
| `PUBLIC_FORM_ENDPOINT` | `https://massic-forms.kanahiku.workers.dev/submit` |

Never put a Turnstile **secret** or `RESEND_API_KEY` on Vercel.

Redeploy after changing env vars.

---

## 2. Pass `action` when rendering Turnstile

In `src/pages/form/index.astro`, `renderHandoffTurnstile` must include `action: config.site` (the slug `rebellious-aging`).

```js
handoffTurnstileId = api.render(slot, {
  sitekey,
  action: config.site,
  size: 'flexible',
  appearance: 'interaction-only',
  'refresh-expired': 'auto',
});
```

`#quiz-mail-config` must still expose:

- `data-endpoint` → `…/email-summary`
- `data-site` → `rebellious-aging`
- `data-turnstile-sitekey` → the public key above

Reset the widget after a failed or successful send. Tokens are single-use and expire after about 5 minutes.

---

## 3. Do not overwrite the production Worker

If this repo keeps a local copy of `services/forms/` for `wrangler dev` only:

1. Change `name` in `services/forms/wrangler.toml` to something unique, for example `massic-forms-rebellious-aging-dev`.
2. Never `wrangler deploy` that config to production.
3. Local `.dev.vars` can use Cloudflare’s dummy secret `1x0000000000000000000000000000000AA` as `TURNSTILE_SECRET_REBELLIOUS_AGING`.

Point local site env at `http://localhost:8787` only when you are running a **local** Worker. Pointing local/preview at the live Worker writes to production D1 and can send real mail.

---

## 4. Do not change these from this repo

Leave these on the shared Worker / D1 (already configured):

- Secret `TURNSTILE_SECRET_REBELLIOUS_AGING`
- D1 `sites` row slug `rebellious-aging`
- `from_email` / `notify_email` for this site
- Allowed origins for `rebelliousaging.org` and `www.rebelliousaging.org`

If a hostname is missing on the Turnstile widget, add it in the **Cloudflare Turnstile dashboard** for this widget only. Do not share one widget with another client site.

---

## 5. Verify

1. Open `https://www.rebelliousaging.org/form`.
2. Confirm the page’s `#quiz-mail-config` `data-turnstile-sitekey` is `0x4AAAAAAFCB6A3BPGXLSKha`.
3. Complete the check-up far enough to email the PDF.
4. Complete the spam check, send to your own inbox (not a client test dump unless intended).
5. Success response is `{ "ok": true }`. Missing token returns `Spam check is required`. Wrong/old key returns `Spam check failed`.

A request **without** a token to `/email-summary` should not send mail.

---

## If you must create a new widget later

Create a **new** Managed widget in Cloudflare → Turnstile named for this site only. Add this site’s hostnames. Then:

1. Put the **public** site key in Vercel `PUBLIC_TURNSTILE_SITE_KEY` and in `src/lib/forms.ts` production fallback.
2. Have whoever deploys the **shared** Worker store the secret as `TURNSTILE_SECRET_REBELLIOUS_AGING` (`wrangler secret put`). Do not put that secret in this repo.

Do not reuse another site’s site key / secret pair.
