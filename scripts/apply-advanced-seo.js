/**
 * Advanced SEO pass (~agency-grade):
 * - Sitewide footer Hire hub + llms.txt link
 * - Sitemap + robots upgrades
 * - Head: alternate llms, geo meta on key pages
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TODAY = '2026-07-29';

const HIRE_LINKS = `                <li><a href="hire-best-software-developer-lahore.html" class="no-arrow">best developer Lahore</a></li>
                <li><a href="hire-backend-developer-lahore.html" class="no-arrow">backend developer Lahore</a></li>
                <li><a href="hire-nodejs-developer-pakistan.html" class="no-arrow">Node.js developer Pakistan</a></li>`;

const HIRE_LINKS_BLOG = `                <li><a href="../hire-best-software-developer-lahore.html" class="no-arrow">best developer Lahore</a></li>
                <li><a href="../hire-backend-developer-lahore.html" class="no-arrow">backend developer Lahore</a></li>
                <li><a href="../hire-nodejs-developer-pakistan.html" class="no-arrow">Node.js developer Pakistan</a></li>`;

function walkHtml(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !['node_modules', 'scripts', 'assets', '.git'].includes(ent.name)) {
      walkHtml(p, files);
    } else if (ent.name.endsWith('.html') && !['og-template.html', 'faq-section.html'].includes(ent.name)) {
      files.push(p);
    }
  }
  return files;
}

function patchFooter(html, isBlog) {
  const links = isBlog ? HIRE_LINKS_BLOG : HIRE_LINKS;
  // Remove old single hire link variants
  html = html.replace(
    /\s*<li><a href="(?:\.\.\/)?hire-best-software-developer-lahore\.html"[^>]*>[^<]*<\/a><\/li>/g,
    ''
  );
  // Inject hire cluster before contact link in Pages list (or at end of Pages ul before </ul> of first footer nav)
  if (!html.includes('backend developer Lahore')) {
    html = html.replace(
      /(<nav class="footer-col" aria-label="Footer navigation">[\s\S]*?<ul class="footer-links">)([\s\S]*?)(<\/ul>\s*<\/nav>)/,
      (m, open, items, close) => {
        let cleaned = items
          .replace(/\s*<li><a href="(?:\.\.\/)?hire-best-software-developer-lahore\.html"[^>]*>[\s\S]*?<\/li>/g, '')
          .replace(/\s*<li><a href="(?:\.\.\/)?hire-backend-developer-lahore\.html"[^>]*>[\s\S]*?<\/li>/g, '')
          .replace(/\s*<li><a href="(?:\.\.\/)?hire-nodejs-developer-pakistan\.html"[^>]*>[\s\S]*?<\/li>/g, '');
        // insert hire links after contact if present, else before closing
        if (/contact\.html/.test(cleaned)) {
          cleaned = cleaned.replace(
            /(<li><a href="(?:\.\.\/)?contact\.html"[^>]*>[\s\S]*?<\/li>)/,
            `$1\n${links}`
          );
        } else {
          cleaned = cleaned.trimEnd() + '\n' + links + '\n';
        }
        return open + cleaned + close;
      }
    );
  }
  return html;
}

function ensureLlmsLink(html) {
  if (html.includes('href="/llms.txt"') || html.includes('href="https://www.abubakkar.dev/llms.txt"')) {
    return html;
  }
  return html.replace(
    /<link rel="canonical" href="[^"]*">/,
    (m) =>
      `${m}\n  <link rel="alternate" type="text/plain" href="https://www.abubakkar.dev/llms.txt" title="LLM context file">`
  );
}

function ensureGeo(html) {
  if (html.includes('name="geo.region"')) return html;
  if (!html.includes('<meta name="robots"')) return html;
  return html.replace(
    /<meta name="robots" content="[^"]*">/,
    (m) =>
      `${m}\n  <meta name="author" content="Abubakkar Sajid">\n  <meta name="geo.region" content="PK-PB">\n  <meta name="geo.placename" content="Lahore">`
  );
}

// Patch all HTML
for (const file of walkHtml(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const isBlog = rel.startsWith('blog/');
  let html = fs.readFileSync(file, 'utf8');
  html = patchFooter(html, isBlog);
  html = ensureLlmsLink(html);
  if (!isBlog || rel === 'blog/index.html') {
    html = ensureGeo(html);
  }
  fs.writeFileSync(file, html, 'utf8');
  console.log('Patched', rel);
}

// robots.txt
fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `# robots.txt - https://www.abubakkar.dev
User-agent: *
Allow: /
Disallow: /og-template.html
Disallow: /faq-section.html
Disallow: /scripts/

# AI assistants & answer engines
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bytespider
Allow: /
User-agent: CCBot
Allow: /

# Host hint for crawlers
Host: https://www.abubakkar.dev

Sitemap: https://www.abubakkar.dev/sitemap.xml
`
);
console.log('Updated robots.txt');

// humans.txt
fs.writeFileSync(
  path.join(ROOT, 'humans.txt'),
  `/* TEAM */
Developer: Abubakkar Sajid
Role: Full-Stack & Backend Developer
Location: Lahore, Punjab, Pakistan
Contact: hello@abubakkar.dev
Site: https://www.abubakkar.dev
GitHub: https://github.com/Innocent-Developer
LinkedIn: https://www.linkedin.com/in/mughal-abubakkar

/* SITE */
Standards: HTML5, CSS3, JavaScript
Components: Terminal-themed portfolio, SEO landings, FAQ schema
Last update: ${TODAY}
Language: English
`
);
console.log('Updated humans.txt');

// security.txt
const wellKnown = path.join(ROOT, '.well-known');
if (!fs.existsSync(wellKnown)) fs.mkdirSync(wellKnown);
fs.writeFileSync(
  path.join(wellKnown, 'security.txt'),
  `Contact: mailto:hello@abubakkar.dev
Expires: 2027-07-29T00:00:00.000Z
Preferred-Languages: en
Canonical: https://www.abubakkar.dev/.well-known/security.txt
`
);
console.log('Updated .well-known/security.txt');

console.log('Done advanced SEO pass.');
