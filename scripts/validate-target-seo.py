"""Validate the six SEO pages using Python's standard library.

Run from any directory: python scripts/validate-target-seo.py
This checks markup and repository evidence, not Google indexing or rankings.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import html
import json
import math
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://www.abubakkar.dev'
TARGETS = [
    'about.html', 'hire-best-software-developer-lahore.html', 'skills.html',
    'blog/ai-saas-credit-billing-system.html', 'hire-nodejs-developer-pakistan.html',
    'blog/backend-development-2025.html',
]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class Markup(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        names = [k for k,v in attrs]
        if len(names) != len(set(names)):
            self.errors.append('duplicate attribute on '+tag)
        attr = dict(attrs)
        if 'id' in attr:
            if attr['id'] in self.ids:
                self.errors.append('duplicate ID '+attr['id'])
            self.ids.add(attr['id'])
        if tag == 'img' and (not attr.get('alt') or not attr.get('width') or not attr.get('height')):
            self.errors.append('image needs alt, width and height')
        if tag not in VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append('invalid nesting at </'+tag+'>')
        else:
            self.stack.pop()

def text(source):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', source))).strip()

def resolve(file, url):
    parsed = urlsplit(html.unescape(url))
    if parsed.scheme or parsed.netloc:
        if parsed.netloc not in {'abubakkar.dev','www.abubakkar.dev'}:
            return None
        route = parsed.path
    else:
        route = parsed.path
    if not route:
        target = ROOT / file
    elif route.startswith('/'):
        target = ROOT / route.lstrip('/')
    else:
        target = ROOT / Path(file).parent / route
    if route.endswith('/'):
        target = target / 'index.html'
    target = target.resolve()
    return target, unquote(parsed.fragment)

def main():
    errors = []
    results = []
    sitemap = ET.parse(ROOT/'sitemap.xml').getroot()
    ns = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    sitemap_urls = [u.findtext('s:loc',namespaces=ns) for u in sitemap]
    if len(sitemap_urls) != len(set(sitemap_urls)):
        errors.append('duplicate sitemap URLs')
    titles = {}
    descriptions = {}
    canonicals = {}
    for file in TARGETS:
        source = (ROOT/file).read_text(encoding='utf-8')
        parser = Markup(); parser.feed(source)
        errors += [file+': '+e for e in parser.errors]
        if parser.stack:
            errors.append(file+': unclosed tags '+str(parser.stack))
        title = text(re.search(r'<title>(.*?)</title>',source,re.S)[1])
        description = html.unescape(re.search(r'<meta name="description" content="([^"]*)"',source)[1])
        canonical = re.findall(r'<link rel="canonical" href="([^"]*)"',source)
        if canonical != [BASE+'/'+file]:
            errors.append(file+': canonical mismatch')
        for label,value,seen in [('title',title,titles),('description',description,descriptions),('canonical',canonical[0],canonicals)]:
            if value in seen:
                errors.append(file+': duplicate '+label)
            seen[value] = file
        if re.search(r'<meta[^>]+(?:name="robots"|name="googlebot")[^>]+content="[^"]*(?:noindex|none)',source,re.I):
            errors.append(file+': noindex directive')
        main_html = re.search(r'<main\b[^>]*>(.*?)</main>',source,re.S)[1]
        headings = [(int(n),text(t)) for n,t in re.findall(r'<h([1-6])\b[^>]*>(.*?)</h\1>',main_html,re.S)]
        if sum(n==1 for n,t in headings) != 1:
            errors.append(file+': needs one H1')
        previous = 0
        for n,t in headings:
            if n > previous+1:
                errors.append(file+': heading level skipped at '+t)
            previous = n
        graphs=[]
        for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S):
            doc=json.loads(raw);graphs.extend(doc.get('@graph',[doc]))
        graph_ids=[g['@id'] for g in graphs if '@id' in g]
        if len(graph_ids)!=len(set(graph_ids)):
            errors.append(file+': duplicate JSON-LD entity IDs')
        if any(g.get('@type')=='FAQPage' for g in graphs):
            errors.append(file+': unnecessary FAQPage markup')
        if any(g.get('@type')=='BreadcrumbList' for g in graphs) != ('aria-label="Breadcrumb"' in source):
            errors.append(file+': visible and structured breadcrumbs differ')
        for prop in ['og:title','og:description','og:url','og:image']:
            if not re.search(r'<meta property="'+prop+r'" content="[^"]+"',source):
                errors.append(file+': missing '+prop)
        if BASE+'/'+file not in sitemap_urls:
            errors.append(file+': missing sitemap entry')
        # Resolve assets, pages and fragment IDs, including root-relative links.
        for url in re.findall(r'(?:href|src)="([^"]*)"',source):
            if url.startswith(('mailto:','tel:','data:','javascript:')):
                continue
            result=resolve(file,url)
            if result is None:
                continue
            target,fragment=result
            if not target.exists():
                errors.append(file+': missing '+url)
            elif fragment and target.suffix=='.html':
                ids=set(re.findall(r'id="([^"]+)"',target.read_text(encoding='utf-8')))
                if fragment not in ids:
                    errors.append(file+': missing anchor '+url)
        context=re.sub(r'<nav\b.*?</nav>|<footer\b.*?</footer>','',main_html,flags=re.S)
        destinations=set()
        for url in re.findall(r'href="([^"]+)"',context):
            result=resolve(file,url)
            if result and result[0].suffix=='.html' and result[0]!=(ROOT/file).resolve():
                destinations.add('/'+result[0].relative_to(ROOT).as_posix())
        if len(destinations)<5:
            errors.append(file+': fewer than five contextual HTML destinations')
        result={'page':'/'+file,'title':title,'description':description,'internalDestinations':sorted(destinations),'schemaTypes':[g.get('@type') for g in graphs]}
        if file.startswith('blog/'):
            prose=re.search(r'<div class="blog-prose">(.*?)</div>\s*<footer class="blog-article-actions">',source,re.S)[1]
            words=len(text(prose).split())
            minutes=math.ceil(words/200)
            shown=int(re.search(r'class="blog-read-time">(\d+)',source)[1])
            if minutes!=shown:
                errors.append(file+': stale reading time')
            result.update(words=words,readingMinutes=minutes)
        results.append(result)
    print(json.dumps({'pages':results,'errors':errors},indent=2,ensure_ascii=False))
    raise SystemExit(1 if errors else 0)

if __name__ == '__main__':
    main()
