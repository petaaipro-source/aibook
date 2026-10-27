/* Pembaca dokumen: muat data, menu, navigasi, pencarian kata, penanda */
const $=id=>document.getElementById(id);
const m=$('m'),q=$('q'),bk=$('bk'),ti=$('ti'),hb=$('hb'),st=$('st'),dr=$('dr'),nv=$('nv'),pb=$('pb');
let IM=JSON.parse(document.getElementById('im').textContent),D,P,S,keys,fz=16,HL='',cur={k:'home'},stack=[],curSec=null,PM={},SM={};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const bms=()=>LS.get('sun_bm',[]);
async function load(){
  const b=Uint8Array.from(atob(Z),c=>c.charCodeAt(0));
  const s=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate'));
  const j=JSON.parse(await new Response(s).text());D=j.D;P=j.P;keys=Object.keys(P).map(Number).sort((a,b)=>a-b);S={};
  for(const p of keys){S[p]=P[p].map(b=>b[b.length-1]).join('\n');for(const b of P[p])if(b[0]==='h'){const mm=b[1].match(/^(\d+(?:\.\d+)+)\s/);if(mm&&!(mm[1] in PM))PM[mm[1]]=p}}
  for(const v of D)for(const s of v.secs)SM[s.k]=s.p;
  setFz(LS.get('sun_fz',16));buildMenu();setTheme(LS.get('sun_theme','auto'));
  const hm=location.hash.match(/^#hlm-(\d{1,4})$/);if(hm&&P[+hm[1]])cur={k:'read',p:+hm[1],t:+hm[1]};
  render(cur);
}
function resolve(ref){if(PM[ref])return PM[ref];if(SM[ref])return SM[ref];const a=ref.split('.');while(a.length>2){a.pop();const r=a.join('.');if(PM[r])return PM[r];if(SM[r])return SM[r]}return SM[a.join('.')]||null}
function lk(h){h=h.replace(/§(\d{1,4})§/g,(a,n)=>P[n]?`<a href="#" class="x" data-pg="${n}">${n}</a>`:n);return h.replace(/\b((?:[Ss]eksi|[Pp]asal)\s+)(\d{1,2}(?:\.\d{1,2})+)/g,(a,pre,ref)=>resolve(ref)?`${pre}<a href="#" class="x" data-ref="${ref}">${ref}</a>`:a)}
function hx(t){if(!HL)return lk(esc(t));const re=new RegExp('('+HL.split(/\s+/).map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+')+')','gi');return t.split(re).map((s,i)=>i%2?'<mark><b>'+esc(s)+'</b></mark>':lk(esc(s))).join('')}
function fig(id){const f=IM[id];if(!f)return'';return `<figure class="fg"><img data-fig="${id}" loading="lazy" decoding="async" width="${f[1]}" height="${f[2]}" alt="${esc(f[3]||'Gambar')}" src="${f[0]}"><figcaption>${esc(f[3]||'')} &middot; ketuk untuk memperbesar</figcaption></figure>`}
function rb(a){return a.map(b=>b[0]==='i'?fig(b[1]):b[0]==='h'?`<div class="h">${hx(b[1])}</div>`:b[0]==='t'?`<pre class="tb">${hx(b[1])}</pre>`:`<div class="b" style="padding-left:${b[1]*14}px">${hx(b[2])}</div>`).join('')}
function secOf(p){for(const v of D)for(const s of v.secs)if(p>=s.p&&p<=s.e)return[v,s];return[null,null]}
const KK=k=>k==='Lamp.'?'Lampiran':k==='L.Pel'?'Lampiran Pelengkap':/^L\.\d/.test(k)?'Lampiran '+k.slice(2):k==='Pbk'?'Pembuka':/^R\.\d/.test(k)?'Indeks '+k:'Seksi '+k;
const label=(v,s)=>KK(s.k)+' - '+s.t;
const baseUrl=()=>location.pathname+location.search;
function go(s){cur.y=scrollY;stack.push(cur);cur=s;render(s);try{history.pushState({n:stack.length},'',s.k==='read'?'#hlm-'+s.p:baseUrl())}catch(e){}}
function popBack(){const s=stack.pop();if(!s){cur={k:'home'};render(cur);try{history.replaceState(null,'',baseUrl())}catch(e){}return}cur=s;render(s);if(s.y!=null)setTimeout(()=>scrollTo(0,s.y),0)}
function back(){if(stack.length&&history.state&&history.state.n){history.back();return}popBack()}
addEventListener('popstate',()=>{if(stack.length)popBack();else if(cur.k!=='home'){cur={k:'home'};render(cur)}});
function render(s){
  pb.style.transform='scaleX(0)';bk.hidden=s.k==='home';st.hidden=s.k!=='read';
  if(s.k!=='tech'&&window.__TKUI)window.__TKUI.unmount();
  if(s.k==='home'){HL='';q.value='';home()}
  else if(s.k==='search'){q.value=s.q;search(s.q)}
  else if(s.k==='tech'){HL='';q.value='';curSec=null;ti.textContent='Teknik';scrollTo(0,0);
    if(window.__TKUI)window.__TKUI.mount(m,s.id);else m.innerHTML='<p class="empty">Memuat modul teknik...</p>'}
  else if(s.k==='lib'){HL='';q.value='';curSec=null;ti.textContent='Pustaka';scrollTo(0,0);
    if(window.__LIB)window.__LIB.mount(m,s.tab);else m.innerHTML='<p class="empty">Memuat pustaka...</p>'}
  else{HL=s.hl||'';q.value=s.qv||'';open_(s.p,s.t)}
}
window.__libGo=tab=>{if(cur.k==='lib'){scrollTo(0,0);return}go({k:'lib',tab})};
window.__techGo=id=>{if(cur.k==='tech'){cur.id=id;render(cur);return}go({k:'tech',id})};
function divCards(){let h='';
  for(const v of D){
    h+=`<details><summary><span class="no">${v.n}</span><span class="nm">${esc(v.name)}<small>${v.secs.length} ${v.n==='L'?'lampiran':'seksi'}${v.n==='R'?' - tambahan':' - hlm. '+v.a+'-'+v.b}</small></span></summary>`;
    for(const s of v.secs)h+=`<div class="s" tabindex="0" role="button" data-p="${s.p}"><span class="k${v.n==='L'?' kl':''}">${s.k}</span><span class="t">${esc(s.t)}<span class="pg">${v.n==='R'?'indeks tambahan':'hlm. '+s.p+'-'+s.e}</span></span></div>`;
    h+='</details>'}
  return h}
function home(){
  ti.textContent='Spesifikasi Umum 2025';curSec=null;let h='';
  const l=LS.get('sun_last',null);
  if(l&&P[l.p]){const [v,s]=secOf(l.p);if(s)h+=`<div class="r" tabindex="0" role="button" data-p="${l.p}"><b>Lanjutkan membaca</b><br>${esc(label(v,s))}${l.p>=2000?'':' - hlm. '+l.p}</div>`}
  const b=bms().filter(x=>P[x.p]);
  if(b.length){h+='<p class="pg">Penanda</p>';for(const x of b)h+=`<div class="r" tabindex="0" role="button" data-p="${x.p}">&#9733; ${esc(KK(x.k))} - ${esc(x.t)}</div>`}
  if(h)h+='<p class="pg">Semua divisi</p>';
  h+=divCards();
  m.innerHTML=lyHead('home','sp',D.length+' bagian dokumen',h)+lyHead('home','tk','kalkulator teknik',techCards());
  fillTk();scrollTo(0,0);
}
function updStar(){const on=!!curSec&&bms().some(b=>b.p===curSec.p);st.textContent=on?'\u2605':'\u2606';st.setAttribute('aria-pressed',on);st.setAttribute('aria-label',on?'Hapus penanda':'Tandai seksi ini')}
function renderBm(){} /* Penanda hanya tampil di beranda (tidak diulang di hamburger) */
st.onclick=()=>{if(!curSec)return;const b=bms(),i=b.findIndex(x=>x.p===curSec.p);i>=0?b.splice(i,1):b.push({p:curSec.p,k:curSec.k,t:curSec.t});LS.set('sun_bm',b);updStar();renderBm()};
function open_(p,target){
  const [v,s]=secOf(p);if(!s){home();return}curSec=s;
  ti.textContent=(v.n==='P'?'':v.n==='L'?KK(s.k)+' - ':v.n==='R'?'Indeks '+s.k+' - ':'Seksi '+s.k+' - ')+s.t;
  let h='';for(let i=s.p;i<=s.e;i++)if(P[i])h+=`<div class="pgh" id="p${i}">${i>=2000?'Indeks - bagian '+(i-2000):'Halaman '+i}</div><div class="txt">${rb(P[i])}</div>`;
  const all=D.flatMap(x=>x.secs.map(y=>[x,y])),ix=all.findIndex(a=>a[1]===s),pv=all[ix-1],nx=all[ix+1];
  h+='<nav class="sn" aria-label="Navigasi seksi">'+(pv?`<button type="button" data-p="${pv[1].p}"><small>&#8249; Sebelumnya</small><span>${esc(label(pv[0],pv[1]))}</span></button>`:'<span></span>')+(nx?`<button type="button" data-p="${nx[1].p}"><small>Berikutnya &#8250;</small><span>${esc(label(nx[0],nx[1]))}</span></button>`:'<span></span>')+'</nav><button type="button" id="up" class="up">&#8593; Kembali ke atas</button>';
  m.innerHTML=h;m.querySelectorAll('.txt').forEach(e=>e.style.fontSize=fz+'px');updStar();
  const t=target||p;LS.set('sun_last',{p:t});
  const el=$('p'+t),mk=el&&el.nextElementSibling&&el.nextElementSibling.querySelector('mark');
  if(mk)mk.scrollIntoView({block:'center'});else if(el)el.scrollIntoView();else scrollTo(0,0);
}
function search(t){
  const w=t.toLowerCase();let res=[],tot=0;ti.textContent='Hasil pencarian';curSec=null;
  for(const p of keys){const x=S[p],i=x.toLowerCase().indexOf(w);if(i<0)continue;tot++;
    if(res.length<50){const a=Math.max(0,i-70),sn=x.slice(a,i+w.length+110);res.push([p,esc(sn.slice(0,i-a))+'<mark><b>'+esc(sn.slice(i-a,i-a+w.length))+'</b></mark>'+esc(sn.slice(i-a+w.length))])}}
  let h=`<p class="pg">${tot} halaman cocok${tot>50?' (50 pertama)':''}</p>`;
  for(const [p,sn] of res){const [v,s]=secOf(p);h+=`<div class="r" tabindex="0" role="button" data-p="${p}"><b>${s?KK(s.k):''}</b>${p>=2000?'':' - hlm. '+p}<br>${sn}</div>`}
  m.innerHTML=tot?h:'<p class="empty">Tidak ada yang cocok. Coba kata kunci lain.</p>';scrollTo(0,0);
}
function menu(o){dr.hidden=!o;hb.setAttribute('aria-expanded',o);if(o)nv.focus();else if(document.activeElement&&nv.contains(document.activeElement))hb.focus()}
function setFz(n){fz=Math.max(14,Math.min(26,n));LS.set('sun_fz',fz);document.querySelectorAll('.txt').forEach(e=>e.style.fontSize=fz+'px');const f=$('fzv');if(f)f.textContent=fz}
function setTheme(t){const r=document.documentElement;t==='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',t);LS.set('sun_theme',t);nv.querySelectorAll('[data-th]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.th===t))}
const LY={sp:{t:'Spesifikasi Umum 2025',i:'\u{1F4D8}'},tk:{t:'Teknik',i:'\u{1F3D7}\uFE0F'}};
const LYK={nv:'sun_ly',home:'sun_lyh'},LYD={nv:{sp:true,tk:false},home:{sp:true,tk:true}};
const lyState=c=>Object.assign({},LYD[c],LS.get(LYK[c],{}));
function lyHead(c,k,sub,body){const o=!!lyState(c)[k];return `<section class="ly" data-c="${c}" data-ly="${k}" data-open="${o?1:0}"><button type="button" class="lyh" aria-expanded="${o}" aria-controls="lyb-${c}-${k}"><span class="lyi" aria-hidden="true">${LY[k].i}</span><span class="lyt">${LY[k].t}<small>${sub}</small></span><span class="lyc" aria-hidden="true"></span></button><div class="lyb" id="lyb-${c}-${k}"><div class="lyx"${o?'':' inert'}>${body}</div></div></section>`}
function setLy(el,o){const c=el.dataset.c,k=el.dataset.ly;el.dataset.open=o?1:0;el.querySelector('.lyh').setAttribute('aria-expanded',o);const x=el.querySelector('.lyx');o?x.removeAttribute('inert'):x.setAttribute('inert','');const v=lyState(c);v[k]=o;LS.set(LYK[c],v)}
function techCards(){const T=window.__TKUI;
  if(!T)return '<p class="pg">Memuat modul teknik...</p>';
  const cur=T.isOpen()?T.cur():'';
  return T.tools.map(t=>`<div class="tc${t.id===cur?' on':''}" tabindex="0" role="button" data-tech="${t.id}"><span class="no">${t.i}</span><span class="nm">${esc(t.n)}<small>${esc(t.d||'')}</small></span></div>`).join('')+'<p class="pg tkn">Hasil berupa estimasi awal; wajib diverifikasi ahli dan gambar kerja.</p>'}
function fillTk(){const T=window.__TKUI;document.querySelectorAll('.ly[data-ly="tk"]').forEach(el=>{el.querySelector('.lyx').innerHTML=techCards();if(T)el.querySelector('.lyt small').textContent=(T.tools.length-1)+' kalkulator + katalog'})}
function markNv(){try{nv.querySelectorAll('.s.on').forEach(x=>x.classList.remove('on'));if(!curSec)return;
  const el=nv.querySelector('.s[data-m="'+curSec.p+'"]');if(!el)return;el.classList.add('on');
  const d=el.closest('details');if(d)d.open=true;
  const ly=el.closest('.ly');if(ly&&ly.dataset.open==='1')requestAnimationFrame(()=>el.scrollIntoView({block:'center'}))}catch(e){}}
function buildMenu(){
  let sp='';
  for(const v of D){sp+=`<details class="dv"><summary><span class="no">${v.n}</span><span class="nm">${esc(v.name)}</span></summary>`;
    for(const s of v.secs)sp+=`<div class="s" tabindex="0" role="button" data-m="${s.p}"><span class="k${v.n==='L'?' kl':''}">${s.k}</span><span class="t">${esc(s.t)}</span></div>`;sp+='</details>'}
  const top='<div class="nvt"><span class="nvb"><i aria-hidden="true">\u{1F4D8}</i>Spek Umum 2025</span><button type="button" id="nhm" aria-label="Ke beranda" title="Beranda">&#8962;</button><button type="button" id="nvx" aria-label="Tutup menu">&#10005;</button></div>';
  const foot='<div class="nvf"><div class="seg"><button id="fm" aria-label="Kecilkan huruf">A-</button><button disabled id="fzv">'+fz+'</button><button id="fp" aria-label="Besarkan huruf">A+</button></div><div class="seg"><button data-th="auto">Otomatis</button><button data-th="light">Terang</button><button data-th="dark">Gelap</button></div></div>';
  nv.innerHTML=top+lyHead('nv','sp',D.length+' bagian dokumen',sp)+lyHead('nv','tk','kalkulator teknik',techCards())+foot;
  fillTk();
  $('nhm').onclick=()=>{menu(false);stack=[];cur={k:'home'};render(cur)};
  $('nvx').onclick=()=>menu(false);
  $('fm').onclick=()=>setFz(fz-2);$('fp').onclick=()=>setFz(fz+2);
  nv.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
  setTheme(LS.get('sun_theme','auto'));
}
if(!window.__nvBound){window.__nvBound=1;
  nv.addEventListener('click',e=>{
    const h=e.target.closest('.lyh');if(h){const el=h.parentNode;setLy(el,el.dataset.open!=='1');return}
    const t=e.target.closest('[data-m]');if(t){menu(false);const p=+t.dataset.m;go({k:'read',p,t:p});return}
    const k=e.target.closest('[data-tech]');if(k&&window.__techGo){menu(false);window.__techGo(k.dataset.tech)}});
  addEventListener('tk-ready',fillTk);
  new MutationObserver(()=>{if(!dr.hidden){markNv();fillTk()}}).observe(dr,{attributes:true,attributeFilter:['hidden']})}
m.addEventListener('click',e=>{
  const lh=e.target.closest('.lyh');if(lh){const el=lh.parentNode;setLy(el,el.dataset.open!=='1');return}
  const tc=e.target.closest('[data-tech]');if(tc){if(window.__techGo)window.__techGo(tc.dataset.tech);return}
  const a=e.target.closest('a.x');
  if(a){e.preventDefault();const p=a.dataset.pg?+a.dataset.pg:resolve(a.dataset.ref);if(p)go({k:'read',p,t:p});return}
  const t=e.target.closest('[data-p]');if(!t)return;const p=+t.dataset.p;
  const fromS=cur.k==='search'&&t.classList.contains('r');
  go({k:'read',p,t:p,hl:fromS?q.value.trim().replace(/\s+/g,' '):'',qv:fromS?q.value:''});
});
bk.onclick=back;hb.onclick=()=>menu(dr.hidden);$('ov').onclick=()=>menu(false);
addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
$('fs').onclick=()=>setFz(fz>=26?14:fz+2);
let tm;q.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(()=>{const t=q.value.trim();
  if(t.length>=3){if(cur.k==='search'){cur={k:'search',q:t};search(t)}else go({k:'search',q:t})}
  else if(t.length===0&&cur.k==='search'){stack=[];cur={k:'home'};render(cur)}},250)});
let stt;addEventListener('scroll',()=>{if(cur.k!=='read')return;clearTimeout(stt);stt=setTimeout(()=>{let pg=null;for(const e of m.querySelectorAll('.pgh')){if(e.getBoundingClientRect().top<=140)pg=+e.id.slice(1);else break}if(pg)LS.set('sun_last',{p:pg})},400)},{passive:true});
const lb=$('lb'),lbi=$('lbi');
function lbOpen(src){lbi.src=src;lb.hidden=false;lb.scrollTop=0;lb.scrollLeft=0}
function lbClose(){lb.hidden=true;lbi.removeAttribute('src')}
m.addEventListener('click',e=>{const im=e.target.closest('img[data-fig]');if(im)lbOpen(im.src)});
$('lbx').onclick=lbClose;lb.addEventListener('click',e=>{if(e.target===lb)lbClose()});
addEventListener('keydown',e=>{if(e.key==='Escape')lbClose()});
m.addEventListener('click',e=>{if(e.target.closest('#up'))scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role=button][data-p],[role=button][data-m],[role=button][data-tech]')){e.preventDefault();e.target.click()}});
let pr=0;addEventListener('scroll',()=>{if(pr)return;pr=requestAnimationFrame(()=>{pr=0;const h=document.documentElement.scrollHeight-innerHeight;pb.style.transform='scaleX('+(cur.k==='read'&&h>0?Math.min(1,scrollY/h):0).toFixed(4)+')'})},{passive:true});
addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||'')){e.preventDefault();q.focus();q.select()}});
load().catch(()=>{m.innerHTML='<p class="empty">Browser ini tidak mendukung dekompresi. Perbarui browser Anda.</p>'});
