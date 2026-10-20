/* Native Node.js/Chrome DevTools smoke checks; no npm dependencies.
 * Run: node scripts/check-seo-browser.cjs [results.json]
 * Set SEO_CHROME_PATH if Chrome is installed elsewhere. Requires Node with WebSocket.
 * Screenshots and the isolated browser profile are written to the OS temp directory.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const root = path.resolve(__dirname, '..');
const pages = ['about.html','hire-best-software-developer-lahore.html','skills.html',
  'blog/ai-saas-credit-billing-system.html','hire-nodejs-developer-pakistan.html',
  'blog/backend-development-2025.html'];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const chromePath = process.env.SEO_CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript',
  '.png':'image/png','.xml':'application/xml','.txt':'text/plain','.webmanifest':'application/manifest+json'};

class CDP {
  constructor(socket) {
    this.socket=socket; this.sequence=0; this.pending=new Map(); this.listeners=new Map();
    socket.addEventListener('message', event => {
      const message=JSON.parse(event.data);
      if(message.id) {
        const pending=this.pending.get(message.id);
        if(pending) { this.pending.delete(message.id); message.error ? pending.reject(new Error(JSON.stringify(message.error))) : pending.resolve(message.result); }
      } else {
        for(const listener of this.listeners.get(message.method)||[]) listener(message.params);
      }
    });
  }
  on(method, listener) { const list=this.listeners.get(method)||[];list.push(listener);this.listeners.set(method,list); }
  send(method, params={}) {
    const id=++this.sequence;
    return new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>{this.pending.delete(id);reject(new Error('CDP timeout: '+method));},20000);
      this.pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:error=>{clearTimeout(timeout);reject(error);}});
      this.socket.send(JSON.stringify({id,method,params}));
    });
  }
  async evaluate(expression) {
    const result=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
}

async function main() {
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'abubakkar-seo-'));
  const server=http.createServer((request,response)=>{
    let pathname;
    try { pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname); }
    catch { response.writeHead(400);response.end();return; }
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()) {response.writeHead(404);response.end();return;}
    response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=spawn(chromePath,['--headless=new','--remote-debugging-port=0',
    '--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','about:blank'],
    {windowsHide:true,stdio:'ignore'});
  let spawnError;
  browser.on('error',error=>{spawnError=error;});
  const results=[];
  try {
    const portFile=path.join(profile,'DevToolsActivePort');
    for(let i=0;i<100&&!fs.existsSync(portFile);i++){if(spawnError)throw spawnError;await delay(100);}
    if(!fs.existsSync(portFile))throw new Error('Chrome did not expose DevToolsActivePort');
    const port=fs.readFileSync(portFile,'utf8').split(/\r?\n/)[0];
    for(const viewport of [{width:1440,height:900,mobile:false},{width:390,height:844,mobile:true}]) {
      for(const page of pages) {
        const target=await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
        const socket=new WebSocket(target.webSocketDebuggerUrl);
        await once(socket,'open');
        const client=new CDP(socket);
        const runtimeErrors=[],consoleErrors=[],failedRequests=[];
        client.on('Runtime.exceptionThrown',event=>runtimeErrors.push(event.exceptionDetails.text+': '+(event.exceptionDetails.exception?.description||'')));
        client.on('Runtime.consoleAPICalled',event=>{if(event.type==='error')consoleErrors.push(event.args.map(a=>a.value||a.description||'').join(' '));});
        client.on('Network.responseReceived',event=>{if(event.response.status>=400)failedRequests.push({url:event.response.url,status:event.response.status});});
        await client.send('Page.enable');await client.send('Runtime.enable');await client.send('Network.enable');
        await client.send('Emulation.setDeviceMetricsOverride',{...viewport,deviceScaleFactor:1});
        await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:viewport.mobile?'reduce':'no-preference'}]});
        const loaded=new Promise(resolve=>client.on('Page.loadEventFired',resolve));
        await client.send('Page.navigate',{url:origin+'/'+page});
        await Promise.race([loaded,delay(12000)]);
        await client.evaluate('document.fonts.ready.then(()=>true)');
        await client.evaluate(`new Promise(resolve=>{
          let attempts=0;
          const timer=setInterval(()=>{
            const content=document.querySelector('main .page-content');
            if(!content || Number(getComputedStyle(content).opacity)>0.99 || ++attempts>80){clearInterval(timer);resolve(true);}
          },100);
        })`);
        await delay(200);
        const state=await client.evaluate(`(() => {
          const root=document.documentElement;
          const invisible=[...document.querySelectorAll('main .page-content')].some(e=>getComputedStyle(e).opacity==='0');
          const overflow=[...document.querySelectorAll('main *')].filter(e=>{
            const r=e.getBoundingClientRect();
            return r.width>0 && r.right>innerWidth+2 && !e.closest('pre,table');
          }).slice(0,12).map(e=>({tag:e.tagName,className:e.className,right:Math.round(e.getBoundingClientRect().right)}));
          return {title:document.title,h1Count:document.querySelectorAll('main h1').length,
            width:innerWidth,scrollWidth:root.scrollWidth,invisible,overflow,
            brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)};
        })()`);
        let menuPassed=true;
        if(viewport.mobile) {
          menuPassed=await client.evaluate(`(() => {
            const b=document.querySelector('.menu-toggle'),n=document.querySelector('.nav-mobile');
            b.click();const open=b.getAttribute('aria-expanded')==='true'&&n.classList.contains('open');
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
            return open&&b.getAttribute('aria-expanded')==='false'&&!n.classList.contains('open');
          })()`);
        }
        const screenshot=path.join(profile,page.replaceAll('/','_').replace('.html','')+'-'+viewport.width+'.png');
        const shot=await client.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        fs.writeFileSync(screenshot,Buffer.from(shot.data,'base64'));
        const localFailures=failedRequests.filter(r=>r.url.startsWith(origin));
        const passed=state.h1Count===1&&!state.invisible&&state.scrollWidth<=viewport.width+2&&
          !state.overflow.length&&!runtimeErrors.length&&!consoleErrors.length&&!localFailures.length&&menuPassed;
        results.push({page,viewport:viewport.width,passed,...state,menuPassed,runtimeErrors,consoleErrors,
          localFailures,externalFailures:failedRequests.filter(r=>!r.url.startsWith(origin)),screenshot});
        socket.close();await fetch('http://127.0.0.1:'+port+'/json/close/'+target.id);
        process.stderr.write(page+' '+viewport.width+': '+(passed?'PASS':'FAIL')+'\n');
      }
    }
    const report={mode:'local headless Chrome; normal desktop motion and reduced mobile motion',origin,results};
    if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
    if(results.some(r=>!r.passed))process.exitCode=1;
  } finally {
    browser.kill();server.close();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
