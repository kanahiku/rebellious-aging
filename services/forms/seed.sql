-- Shared Cloudflare Worker form service. One row per client site.
-- notify_email  → where lead notifications land (athenaclinic@gmail.com)
-- from_email    → Resend sending address (kanahiku.com domain — must stay verified on Resend)
-- allowed_origins → includes wildcard *.vercel.app for preview deployments + production URLs
INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
VALUES (
  'rebellious-aging',
  'Rebellious Aging',
  'athenaclinic@gmail.com',
  'Rebellious Aging <hello@rebelliousaging.org>',
  'Rebellious Aging',
  '["http://localhost:4321","https://*.vercel.app","https://rebellious-aging.vercel.app","https://rebelliousaging.org","https://www.rebelliousaging.org"]'
);
