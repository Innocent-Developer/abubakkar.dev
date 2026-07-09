/**
 * SEO pass  meta tags, Person schema, defer scripts, font preload, rel=me
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EMAIL = 'hello@abubakkar.dev';

const PERSON_JSON = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.abubakkar.dev/#person',
    name: 'Abubakkar Sajid',
    url: 'https://www.abubakkar.dev/',
    image: 'https://www.abubakkar.dev/assets/og-image.png',
    jobTitle: 'Full-Stack & Backend Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Triad Labz',
      url: 'https://www.triadlabz.com',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Lahore Leads University',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    email: `mailto:${EMAIL}`,
    telephone: '+92-324-1851476',
    sameAs: [
      'https://github.com/Innocent-Developer',
      'https://www.linkedin.com/in/mughal-abubakkar',
      'https://www.instagram.com/abubakkar.dev/',
    ],
    knowsAbout: [
      'Node.js',
      'TypeScript',
      'React',
      'Next.js',
      'FastAPI',
      'Python',
      'MongoDB',
      'Redis',
      'Docker',
      'Nginx',
      'Linux server administration',
      'WhatsApp Business API',
      'AI chatbots',
      'SaaS development',
      'REST APIs',
    ],
  },
  null,
  2
);

const PERSON_BLOCK = `  <script type="application/ld+json">\n${PERSON_JSON}\n  </script>\n`;

const PAGE_META = {
  'index.html': {
    title: 'Abubakkar Sajid  Full-Stack & Backend Developer in Lahore, Pakistan',
    description:
      'Abubakkar Sajid is a full-stack developer in Lahore, Pakistan with 3+ years shipping production SaaS, backend APIs & AI chatbots. Available for remote & freelance work.',
    canonical: 'https://www.abubakkar.dev/',
    ogType: 'website',
  },
  'about.html': {
    title: 'About Abubakkar Sajid | Full-Stack Developer & SaaS Builder',
    description:
      'Meet Abubakkar Sajid  full-stack developer from Lahore with 3+ years in production apps, certified in cyber security & AI engineering. BSCS at Lahore Leads University.',
    canonical: 'https://www.abubakkar.dev/about.html',
    ogType: 'profile',
  },
  'skills.html': {
    title: 'Skills & Tech Stack  Node.js, React, Next.js, FastAPI | Abubakkar Sajid',
    description:
      'Full tech stack of Abubakkar Sajid: TypeScript, Node.js, React, Next.js, FastAPI, MongoDB, Redis, Docker, Nginx & n8n automation  battle-tested in production.',
    canonical: 'https://www.abubakkar.dev/skills.html',
    ogType: 'website',
  },
  'projects.html': {
    title: 'Projects  SaaS, APIs & AI Chatbots Shipped Live | Abubakkar Sajid',
    description:
      '20+ shipped projects including ForiSay (AI WhatsApp chatbot), API Test Lab (SaaS) & Madadgaar marketplace. Real products, live in production, built end to end.',
    canonical: 'https://www.abubakkar.dev/projects.html',
    ogType: 'website',
  },
  'services.html': {
    title: 'Hire a Full-Stack Developer  Web, APIs & AI Chatbots | Abubakkar Sajid',
    description:
      'Hire Abubakkar Sajid for backend APIs, full SaaS builds, WhatsApp AI chatbots, and server/DevOps work. Remote & freelance worldwide from Lahore, Pakistan (UTC+5).',
    canonical: 'https://www.abubakkar.dev/services.html',
    ogType: 'website',
  },
  'experience.html': {
    title: 'Work Experience  3+ Years, 10 Roles in Production | Abubakkar Sajid',
    description:
      'Career history of Abubakkar Sajid: Product Developer at Triad Labz, Team Lead at Madadgaar, plus roles across SaaS, backend and frontend since 2022.',
    canonical: 'https://www.abubakkar.dev/experience.html',
    ogType: 'website',
  },
  'reviews.html': {
    title: 'Client Reviews & Testimonials | Abubakkar Sajid',
    description:
      'What clients and teams say about working with Abubakkar Sajid  communication, delivery, and production-ready code across SaaS, API and chatbot projects.',
    canonical: 'https://www.abubakkar.dev/reviews.html',
    ogType: 'website',
  },
  'contact.html': {
    title: 'Contact Abubakkar Sajid  Hire a Remote Full-Stack Developer',
    description:
      'Get in touch to hire Abubakkar Sajid for remote, freelance or contract work  backend APIs, SaaS products, AI chatbots. Based in Lahore, replies within 24 hours.',
    canonical: 'https://www.abubakkar.dev/contact.html',
    ogType: 'website',
  },
  'blog/index.html': {
    title: 'Blog  Node.js, SaaS & AI Chatbot Tutorials | Abubakkar Sajid',
    description:
      'Practical guides on Node.js backends, WhatsApp Business API chatbots, FastAPI, VPS deployment and shipping SaaS  written from real production experience.',
    canonical: 'https://www.abubakkar.dev/blog/index.html',
    ogType: 'website',
  },
};

const FONT_PRELOAD =
  '  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" as="style">\n';

function walkHtml(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== 'node_modules' && ent.name !== 'scripts') {
      walkHtml(p, files);
    } else if (ent.name.endsWith('.html') && ent.name !== 'og-template.html' && ent.name !== 'faq-section.html') {
      files.push(p);
    }
  }
  return files;
}

function relPath(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function updateMeta(html, meta) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.description}">`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${meta.canonical}">`
  );
  if (meta.ogType) {
    html = html.replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${meta.ogType}">`);
  }
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${meta.title}">`);
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${meta.description}">`
  );
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${meta.canonical}">`);
  if (html.includes('name="twitter:title"')) {
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${meta.title}">`);
  }
  if (html.includes('name="twitter:description"')) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*">/,
      `<meta name="twitter:description" content="${meta.description}">`
    );
  }
  return html;
}

function ensurePersonSchema(html, fileKey) {
  if (html.includes('"jobTitle": "Full-Stack & Backend Developer"')) {
    return html;
  }
  if (fileKey === 'index.html') {
    return html;
  }
  if (!html.includes(PERSON_JSON.split('\n')[2])) {
    html = html.replace('</head>', `${PERSON_BLOCK}</head>`);
  }
  return html;
}

function addFontPreload(html) {
  if (html.includes('rel="preload"') && html.includes('fonts.googleapis.com')) return html;
  return html.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/,
    `${FONT_PRELOAD}  <link rel="preconnect" href="https://fonts.googleapis.com">`
  );
}

function deferScripts(html) {
  return html.replace(/<script src="([^"]+\.js)"><\/script>/g, '<script src="$1" defer></script>');
}

function addRelMe(html) {
  html = html.replace(
    /(<a href="https:\/\/github\.com\/Innocent-Developer"[^>]*)(>)/g,
    '$1 rel="me noopener"$2'
  );
  html = html.replace(
    /(<a href="https:\/\/www\.linkedin\.com\/in\/mughal-abubakkar"[^>]*)(>)/g,
    (m, pre, end) => (pre.includes('rel=') ? m : `${pre} rel="me noopener"${end}`)
  );
  html = html.replace(
    /(<a href="https:\/\/www\.instagram\.com\/abubakkar\.dev\/"[^>]*)(>)/g,
    (m, pre, end) => (pre.includes('rel=') ? m : `${pre} rel="me noopener"${end}`)
  );
  html = html.replace(
    /(<a href="https:\/\/www\.instagram\.com\/dev_abubakkar\/"[^>]*)(>)/g,
    (m, pre, end) => (pre.includes('rel=') ? m : `${pre} rel="me noopener"${end}`)
  );
  return html;
}

function ensureNoopener(html) {
  return html.replace(
    /(<a [^>]*target="_blank")(?![^>]*rel=)/g,
    '$1 rel="noopener"'
  );
}

// Main pages
for (const [file, meta] of Object.entries(PAGE_META)) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  html = updateMeta(html, meta);
  if (file !== 'index.html') {
    html = ensurePersonSchema(html, file);
  }
  html = addFontPreload(html);
  html = deferScripts(html);
  html = addRelMe(html);
  html = ensureNoopener(html);
  fs.writeFileSync(full, html, 'utf8');
  console.log('Updated', file);
}

// Blog posts + 404
for (const file of walkHtml(ROOT)) {
  const rel = relPath(file);
  if (PAGE_META[rel]) continue;
  if (rel === 'index.html') continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('"jobTitle": "Full-Stack & Backend Developer"')) {
    html = ensurePersonSchema(html, rel);
  }
  html = addFontPreload(html);
  html = deferScripts(html);
  html = addRelMe(html);
  html = ensureNoopener(html);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Patched', rel);
}

console.log('Done.');
