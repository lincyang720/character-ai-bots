# Domain migration checklist

The site brand is now **AI Character Guide** and no longer presents itself as a Character.AI-only property. The build accepts a canonical host without hard-coding a purchased replacement domain:

```bash
SITE_URL=https://www.your-new-domain.com NEWSLETTER_ACTION=https://your-provider.example/form npm run build
```

Before switching:

1. Register and verify the replacement domain.
2. Build and deploy with `SITE_URL` set to the verified HTTPS origin.
3. Change the host redirect in `vercel.json` so both `characteraibots.com` and `www.characteraibots.com` redirect each path to the new host with HTTP 301.
4. Verify canonical URLs, sitemap URLs, robots.txt, analytics, Search Console, and at least ten representative redirects.
5. Submit the new sitemap and use Search Console's Change of Address tool.
6. Keep the old domain and redirects active for at least one year.

Do not point redirects at a candidate domain until ownership and HTTPS are confirmed.
