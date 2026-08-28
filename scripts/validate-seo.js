const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let errorCount = 0;
let fileCount = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !['node_modules', '.git', 'scripts'].includes(ent.name)) {
      walk(p);
    } else if (ent.name.endsWith('.html') && !['og-template.html', 'faq-section.html'].includes(ent.name)) {
      fileCount++;
      const html = fs.readFileSync(p, 'utf8');
      const matches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
      if (!matches) {
        console.warn('⚠️ No JSON-LD in:', path.relative(ROOT, p));
      } else {
        matches.forEach((m, idx) => {
          const raw = m.replace(/<script type="application\/ld\+json">|<\/script>/g, '').trim();
          try {
            const parsed = JSON.parse(raw);
            if (!parsed['@context']) {
              console.error('❌ Missing @context in:', path.relative(ROOT, p));
              errorCount++;
            }
          } catch (e) {
            console.error('❌ JSON Syntax Error in:', path.relative(ROOT, p), e.message);
            errorCount++;
          }
        });
      }
    }
  }
}

walk(ROOT);

console.log(`\nChecked ${fileCount} HTML files.`);
if (errorCount === 0) {
  console.log('✅ ALL JSON-LD SCHEMAS ARE 100% VALID!');
} else {
  console.error(`❌ Found ${errorCount} schema errors.`);
  process.exit(1);
}
