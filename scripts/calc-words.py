import re, math, html, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def check_file(rel_path):
    path = ROOT / rel_path
    if not path.exists():
        print(f"File {rel_path} does not exist")
        return
    s = path.read_text(encoding='utf-8')
    m = re.search(r'<div class="blog-prose">(.*?)</div>\s*<footer class="blog-article-actions">', s, re.S)
    if not m:
        print(f"{rel_path}: No blog-prose matched")
        return
    p = m[1]
    t = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', p))).strip()
    words = len(t.split())
    minutes = math.ceil(words / 200)
    time_match = re.search(r'class="blog-read-time">(\d+)', s)
    shown = int(time_match[1]) if time_match else None
    print(f"{rel_path} -> Words: {words}, Calculated Minutes: {minutes}, Shown: {shown}, Match: {minutes == shown}")

if __name__ == '__main__':
    files = sys.argv[1:] if len(sys.argv) > 1 else [
        'blog/build-mcp-server-nodejs-typescript.html',
        'blog/rag-architecture-production-guide.html',
        'blog/redis-caching-nodejs-guide.html',
        'blog/ai-agent-architecture-production.html',
        'blog/reliable-webhooks-nodejs.html'
    ]
    for f in files:
        check_file(f)
