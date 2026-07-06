# SEO Package  abubakkar.dev
## What's in this folder & exactly what to do with it

| File | Where it goes | What to do |
|---|---|---|
| `seo-head-blocks.html` |  | Copy each page's block into that page's `<head>`, replacing old title/meta tags |
| `sitemap.xml` | site root `/sitemap.xml` | Upload as-is |
| `robots.txt` | site root `/robots.txt` | Upload as-is |
| `llms.txt` | site root `/llms.txt` | Upload as-is |
| `humans.txt` | site root `/humans.txt` | Upload as-is |
| `404.html` | site root | Upload; configure hosting to serve it for 404s |
| `faq-section.html` |  | Paste the FAQ `<section>` before the footer on index.html; move the CSS into style.css; paste each `.page-intro` paragraph under its page's h1 |
| `og-template.html` |  | Optional: re-screenshot at 1200×630 if you want a fancier image |
| `assets/og-image.png` | `/assets/og-image.png` | Upload  already referenced by every head block |

## One find-and-replace before uploading
Search all files for `[LINKEDIN-SLUG]` and replace with AbuBakkar's real LinkedIn username.

## Code fixes to make in the existing site (5 items)

1. **Crawler-visible hero text (critical).** The typed terminal text must exist in the HTML source. Pattern: render the full text in the HTML, then in JS grab `el.textContent`, clear it, and re-type it. With JS off or `prefers-reduced-motion`, the text just shows.
2. **One `<h1>` per page** containing the entity + keyword (index: "Abubakkar Sajid  Full-Stack Developer & Backend Engineer in Lahore, Pakistan"). It can live inside the terminal visually.
3. **Descriptive anchors.** Replace bare "Visit"/"Code" with "View ForiSay live", "ForiSay source on GitHub", etc.
4. **In-content internal links.** Each page should link to ≥3 others inside body copy, not just the nav (the FAQ answers already do this for index).
5. **Footer additions:** the four profile links (GitHub, Instagram, Facebook, Threads) with the person's name in each `aria-label`, plus a "last updated 2026-07" line.

## Launch sequence (in order)

1. Upload everything; do the find-replace; make the 5 code fixes.
2. **Google Search Console** → verify `abubakkar.dev` (DNS TXT is cleanest) → Sitemaps → submit `sitemap.xml` → URL Inspection → Request Indexing for `/`, `/projects.html`, `/services.html`.
3. **Bing Webmaster Tools** → "Import from Google Search Console" (one click). Bing feeds ChatGPT search  this is the highest-leverage GEO step.
4. Validate: run every page through Google's Rich Results Test and the Schema.org validator. Fix anything flagged.
5. **Close the entity loop:** edit the bios on GitHub, Instagram, Facebook, and Threads so each one links to `https://www.abubakkar.dev`. The schema `sameAs` points out; the bios must point back.
6. GitHub profile README (`Innocent-Developer/Innocent-Developer` repo): first line = "Full-Stack Developer in Lahore, Pakistan  https://www.abubakkar.dev". GitHub profiles rank fast and LLMs read them heavily.

## Ranking plan  what actually moves the needle after launch

**Weeks 1–2 (indexing):** pages appear for "Abubakkar Sajid". Branded queries should be fully owned  site, GitHub, Instagram, Facebook, Threads filling page 1.

**Weeks 2–6 (authority):** on-page alone won't rank "full stack developer Lahore"  third-party signals will:
- Create profiles that allow a website link: **Dev.to, Peerlist, Hashnode, Stack Overflow, ProductHunt** (launch API Test Lab there  a launch page is a strong permanent backlink), **Crunchbase person profile**.
- Publish 2–3 technical posts on Dev.to/Hashnode with canonical links back to the site (e.g., "How I built an AI WhatsApp chatbot with the WhatsApp Business API"  this can rank on its own and funnels authority).
- Get listed on Triad Labz's team page with a link  an employer link is a strong trust signal.

**Ongoing (GEO):** after indexing, test monthly: ask ChatGPT/Perplexity/Claude "who is Abubakkar Sajid" and "full stack developer in Lahore for WhatsApp AI chatbot". When citations appear, note which pages get cited and expand those.

**Freshness:** bump `lastmod` in sitemap.xml and the footer date whenever a project ships. A static portfolio decays; a monthly project/changelog update keeps recrawl frequency high.

## What NOT to do
- Don't add Review/AggregateRating schema for the testimonials  self-serving review markup on your own site violates Google's guidelines and risks a manual action (the visible testimonials are fine and still help GEO).
- Don't stuff "Lahore" / "Pakistan" into every heading  it's in the title, h1, intro, and schema; that's enough.
- Don't buy backlinks or use link farms  one Dev.to article outperforms 100 spam links and carries zero risk.
