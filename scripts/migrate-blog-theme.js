const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');
const site = 'https://www.abubakkar.dev';

function header(prefix) {
  const p = prefix || '';
  return `  <header class="site-header">
    <div class="header-inner">
      <a href="${p}index.html" class="logo no-arrow">➜ ~/abubakkar</a>
      <nav class="nav-desktop" aria-label="Main navigation">
        <a href="${p}about.html" class="nav-link no-arrow">/about</a>
        <a href="${p}skills.html" class="nav-link no-arrow">/skills</a>
        <a href="${p}projects.html" class="nav-link no-arrow">/projects</a>
        <a href="${p}services.html" class="nav-link no-arrow">/services</a>
        <a href="${p}experience.html" class="nav-link no-arrow">/experience</a>
        <a href="${p}reviews.html" class="nav-link no-arrow">/reviews</a>
        <a href="${p}blog/index.html" class="nav-link no-arrow">/blog</a>
        <a href="${p}contact.html" class="nav-link no-arrow">/contact</a>
      </nav>
      <div class="header-actions">
        <a href="${p}contact.html" class="btn-cmd btn-cmd--primary btn-cmd--hire no-arrow">$ ./hire_me.sh<span class="btn-cursor">▊</span></a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">[≡]</button>
      </div>
    </div>
    <nav class="nav-mobile" aria-label="Mobile navigation">
      <div class="nav-mobile-prompt">➜ ~ ls ~/pages</div>
      <a href="${p}about.html">about.html</a>
      <a href="${p}skills.html">skills.html</a>
      <a href="${p}projects.html">projects.html</a>
      <a href="${p}services.html">services.html</a>
      <a href="${p}experience.html">experience.html</a>
      <a href="${p}reviews.html">reviews.html</a>
      <a href="${p}blog/index.html">blog/index.html</a>
      <a href="${p}contact.html">contact.html</a>
    </nav>
  </header>`;
}

function footer(prefix) {
  const p = prefix || '';
  return `  <footer class="site-footer">
    <div class="container">
      <div class="terminal footer-terminal">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot-red"></span>
            <span class="dot-amber"></span>
            <span class="dot-green"></span>
          </div>
          <span class="terminal-title">footer.sh  ~/abubakkar</span>
        </div>
        <div class="terminal-body footer-body">
          <div class="footer-grid">
            <div class="footer-col footer-brand">
              <p class="footer-logo">➜ ~/abubakkar</p>
              <p class="footer-tagline">Full-stack developer building SaaS, APIs &amp; AI products from Lahore, Pakistan.</p>
              <p class="footer-meta"><span class="footer-status">●</span> Open to remote &amp; freelance</p>
            </div>
            <nav class="footer-col" aria-label="Footer navigation">
              <h3 class="footer-heading">Pages</h3>
              <ul class="footer-links">
                <li><a href="${p}index.html" class="no-arrow">home</a></li>
                <li><a href="${p}about.html" class="no-arrow">about</a></li>
                <li><a href="${p}skills.html" class="no-arrow">skills</a></li>
                <li><a href="${p}projects.html" class="no-arrow">projects</a></li>
                <li><a href="${p}services.html" class="no-arrow">services</a></li>
                <li><a href="${p}experience.html" class="no-arrow">experience</a></li>
                <li><a href="${p}reviews.html" class="no-arrow">reviews</a></li>
                <li><a href="${p}blog/index.html" class="no-arrow">blog</a></li>
                <li><a href="${p}contact.html" class="no-arrow">contact</a></li>
              </ul>
            </nav>
            <div class="footer-col">
              <h3 class="footer-heading">Contact</h3>
              <ul class="footer-links">
                <li><a href="mailto:hello@abubakkar.dev" class="no-arrow">hello@abubakkar.dev</a></li>
                <li><a href="tel:+923241851476" class="no-arrow">+92 324 1851476</a></li>
                <li><a href="${p}contact.html" class="no-arrow">Get in touch →</a></li>
                <li><a href="${p}assets/cv.pdf" class="no-arrow" target="_blank" rel="noopener">Download CV</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3 class="footer-heading">Connect</h3>
              <div class="footer-socials">
                <a href="https://github.com/Innocent-Developer" class="footer-social-chip no-arrow" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
                <a href="https://www.linkedin.com/in/mughal-abubakkar" class="footer-social-chip no-arrow" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
                <a href="https://www.instagram.com/dev_abubakkar/" class="footer-social-chip no-arrow" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
                <a href="mailto:hello@abubakkar.dev" class="footer-social-chip no-arrow" aria-label="Email">Email</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p class="footer-copy">© 2026 Abubakkar Sajid · Built with HTML, CSS &amp; JS</p>
            <a href="#" class="back-to-top no-arrow">▲ back to top</a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;
}

function transformArticleContent(html) {
  return html
    .replace(/class="article-breadcrumb"/g, 'class="blog-breadcrumb"')
    .replace(/class="article-header reveal"/g, 'class="blog-article-header"')
    .replace(/class="article-header"/g, 'class="blog-article-header"')
    .replace(/class="article-meta-row"/g, 'class="blog-meta-row"')
    .replace(/class="article-meta"/g, 'class="blog-meta"')
    .replace(/class="article-read-time"/g, 'class="blog-read-time"')
    .replace(/class="article-title"/g, 'class="blog-article-title"')
    .replace(/class="article-excerpt"/g, 'class="blog-excerpt"')
    .replace(/class="article-author"/g, 'class="blog-author"')
    .replace(/class="article-body article-body-read reveal"/g, 'class="blog-prose"')
    .replace(/class="article-body article-body-read"/g, 'class="blog-prose"')
    .replace(/class="article-body"/g, 'class="blog-prose"')
    .replace(/class="article-footer reveal"/g, 'class="blog-article-actions"')
    .replace(/class="article-footer"/g, 'class="blog-article-actions"')
    .replace(/class="btn btn-secondary"/g, 'class="btn-cmd no-arrow"')
    .replace(/class="btn btn-primary"/g, 'class="btn-cmd btn-cmd--primary no-arrow"')
    .replace(/ reveal/g, '')
    .replace(/abubakkar\.online/g, 'www.abubakkar.dev');
}

function migrateArticle(file) {
  const name = path.basename(file);
  const raw = fs.readFileSync(file, 'utf8');

  const titleMatch = raw.match(/<title>([^<]+)<\/title>/i);
  const descMatch = raw.match(/<meta name="description" content="([^"]*)"/i);
  const ldMatch = raw.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);

  const title = titleMatch ? titleMatch[1] : 'Blog Article';
  const description = descMatch ? descMatch[1] : '';
  const canonical = `${site}/blog/${name}`;
  const ldJson = ldMatch
    ? ldMatch[1].trim().replace(/abubakkar\.online/g, 'www.abubakkar.dev')
    : '';

  const contentMatch = raw.match(
    /<nav class="article-breadcrumb"[\s\S]*?<footer class="article-footer[\s\S]*?<\/footer>/i
  );
  if (!contentMatch) {
    console.warn('Skip (no article content):', name);
    return;
  }

  const articleInner = transformArticleContent(contentMatch[0]);

  const out = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="Abubakkar Sajid">
  <meta name="theme-color" content="#0A0E0D">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Abubakkar Sajid  Portfolio">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230A0E0D'/%3E%3Ctext x='50' y='72' font-size='64' text-anchor='middle' fill='%2322C55E' font-family='monospace'%3E%E2%96%8A%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  ${ldJson ? `<script type="application/ld+json">\n${ldJson}\n  </script>` : ''}
</head>
<body>
${header('../')}
  <main class="container page-main blog-article-main">
    <section class="section" data-reveal>
      <h2 class="section-heading">▤ blog <span class="comment">// Article</span></h2>
      <div class="terminal blog-article-terminal">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot-red"></span>
            <span class="dot-amber"></span>
            <span class="dot-green"></span>
          </div>
          <span class="terminal-title">cat article.md</span>
        </div>
        <div class="terminal-body blog-article-body">
${articleInner}
        </div>
      </div>
    </section>
  </main>
${footer('../')}
  <div class="toast" data-toast role="status" aria-live="polite">
    <span class="toast-message" data-toast-message></span>
    <button type="button" class="toast-dismiss">[dismiss]</button>
  </div>
  <script src="../js/terminal.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;

  fs.writeFileSync(file, out, 'utf8');
  console.log('Migrated:', name);
}

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.html') && f !== 'index.html');
files.forEach((f) => migrateArticle(path.join(blogDir, f)));
