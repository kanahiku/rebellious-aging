-- Shared Cloudflare Worker form service. One row per client site.
-- from_email uses Resend's test sender until the client domain is verified.
-- After DNS is verified, update from_email to: hello@rebelliousaging.org
INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
VALUES (
  'rebellious-aging',
  'Rebellious Aging',
  'hello@rebelliousaging.org',
  'Rebellious Aging <hello@rebelliousaging.org>',
  'Rebellious Aging',
  '["http://localhost:4321","https://*.vercel.app","https://rebelliousaging.org","https://www.rebelliousaging.org"]'
);
