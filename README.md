# julianglobal.com.br: how to publish

The `site/` folder is the whole website. No build step, no server code. Drop it on any static host.

## 1. Photo and CV (both included)

- Photo: already included at `site/assets/julian.jpg` (960 x 1200, 4:5 crop). To swap it later, replace that file with another 4:5 image of the same name.
- CV: included at `site/assets/Julian_Montgomery_Consulting_CV.pdf`. To update it, replace that file and keep the same name; both "Download CV" links point here.
- Optional: replace `site/assets/og-image.png` (1200 x 630) with your own share image. The current one is a clean text placeholder.

## 2. Publish (pick one, all free)

- **Cloudflare Pages** (recommended: fast in Brazil, free SSL): Will add to Github repo, commmit and Push  Already added custom domains > add `julianglobal.com.br`.
<!-- We chose Cloudflare  -->
- **Netlify**: app.netlify.com/drop > drag the `site` folder. Then Domain settings > add custom domain.
- **GitHub Pages**: upload the contents of `site/` to a repo, enable Pages, add the custom domain.

Domain setup happens at Registro.br (DNS) plus the host's domain screen. Set `julianmontgomery.com.br` as a 301 redirect to `julianglobal.com.br` in the host's redirect settings (Netlify/Cloudflare both support this).

## 3. Everyday edits

- **Email or WhatsApp change**: open `site/assets/js/main.js`, edit the three lines at the top (`CONTACT_EMAIL`, `WHATSAPP_NUMBER`, `SITE_URL`). Every button updates. Also replace the address in the two footer lines of `index.html` if you want the no-JavaScript version to match.
- **Any wording**: `site/assets/js/i18n.js` holds all copy in `pt`, `en`, `es`. Edit the text between quotes. The page reads it on load.
  - `index.html` also contains the Portuguese text, baked in for Google and visitors without JavaScript. If you change Portuguese copy that matters for search (headlines, section titles), mirror it there too.
- **Share a language directly**: `https://julianglobal.com.br/?lang=pt` (or `en`, `es`). Useful on WhatsApp.

## What's included

- One page, three languages (browser language on first visit, visitor choice remembered).
- Light and dark theme (follows the device, manual toggle overrides).
- Email buttons open a prefilled, localized message; WhatsApp buttons open a localized chat.
- SEO: Portuguese title/description/Open Graph, canonical, hreflang, `robots.txt`, `sitemap.xml`, structured data.
- Self-hosted fonts, no cookies, no analytics, no trackers (no LGPD consent banner needed).
- Total weight ~560 KB including the photo and CV.

## Before going live: quick checklist

- [ ] Test each email button on phone and desktop
- [ ] Test WhatsApp button on phone
- [ ] Open the site with `?lang=en` and `?lang=es` and read through once
- [ ] Update `lastmod` in `sitemap.xml` when you make major changes
- [ ] Submit the sitemap in Google Search Console
