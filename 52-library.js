/* PUSTAKA: halaman penuh (bukan panel melayang). Pedoman, SE/Permen, dan video resmi Ditjen Bina Marga.
   Data: 50-library-data.js (PK, VID, CHN). Dibuka dari dok bawah; reader.js memanggil window.__LIB.mount(host, tab).
   Fitur: cari lintas pedoman+video, tab kategori dengan jumlah, filter tahun, urutan, pratinjau PDF, salin nomor. */
(()=>{
const KAT={J:'Jembatan',R:'Jalan',N:'SE / Permen'},MON={Jan:0,Feb:1,Mar:2,Apr:3,Mei:4,Jun:5,Jul:6,Agu:7,Sep:8,Okt:9,Nov:10,Des:11};
const ea=s=>esc(String(s==null?'':s)).replace(/"/g,'&quot;');
const safe=u=>/^https:\/\//.test(u||'')?u:'';
const ts=p=>{const x=String(p.tg||'').match(/(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/);return x&&x[2] in MON?Date.UTC(+x[3],MON[x[2]],+x[1]):Date.UTC(p.y||2000,0,1)};
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');

const css=document.createElement('style');
css.textContent=`
.lbhd h2{margin:0 0 2px;font-size:22px;line-height:1.25}
.lbhd p{margin:0 0 14px;color:var(--mut);font-size:13.5px}
.lbsr input{width:100%;padding:13px 20px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink);box-shadow:var(--sh,none)}
.lbtb{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 10px}
.lbtb button{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-size:13px}
.lbtb button small{opacity:.7;font-weight:600;font-size:11.5px}
.lbtb button.on{background:linear-gradient(135deg,var(--acc),var(--acc2,var(--acc)));color:#04141c;border-color:transparent;font-weight:700}
.lbfl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
.lbfl select{padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-size:13px}
.lbct{color:var(--mut);font-size:12.5px;margin:0 0 8px}
.lbc{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px 18px;margin-bottom:12px;box-shadow:var(--sh,none)}
.lbc1{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;font:600 12px var(--mono,ui-monospace,Consolas,monospace)}
.lbn{color:var(--acc)}.lby{color:var(--mut)}
.lbk,.lbst{padding:2px 10px;border-radius:999px;background:var(--chip);border:1px solid var(--line);font-family:inherit}
.lbst{color:var(--acc)}
.lbc h3{margin:0 0 6px;font-size:16px;line-height:1.4}
.lbd{margin:0;opacity:.88;font-size:13.5px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.lbd.open{display:block}
.lbmore{background:none;border:0;box-shadow:none;padding:2px 0;color:var(--acc);font-size:12.5px;font-weight:600}
.lbm{margin:8px 0 12px;color:var(--mut);font-size:12px}
.lba{display:flex;flex-wrap:wrap;gap:8px}
.lbb{display:inline-flex;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:600 12.5px inherit;font-family:inherit;text-decoration:none;cursor:pointer}
.lbb:hover{border-color:var(--acc)}
.lbb.pri{background:linear-gradient(135deg,var(--acc),var(--acc2,var(--acc)));color:#04141c;border-color:transparent}
/* pratinjau multi-mesin */
.pvx{margin-top:10px;border:1px solid var(--line);border-radius:14px;background:var(--card);overflow:hidden}
.pvt,.pvc{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--line)}
.pvc[hidden],.pvbar[hidden]{display:none}
.pvg{flex:1}
.pvk{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:4px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:600 12px inherit;font-family:inherit;text-decoration:none;cursor:pointer;box-shadow:none}
.pvk:hover{border-color:var(--acc)}
.pvk.on{background:linear-gradient(135deg,var(--acc),var(--acc2,var(--acc)));color:#04141c;border-color:transparent}
.pvi{width:58px;padding:5px 6px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:600 13px inherit;text-align:center}
.pvtot{font-size:12.5px;color:var(--mut)}
.pvs{padding:6px 12px;font-size:12px;color:var(--mut);min-height:18px}
.pvbar{height:3px;background:var(--line)}.pvbar i{display:block;height:100%;width:0;background:var(--acc);transition:width .2s}
.pvb{position:relative;height:min(72vh,640px);background:#8a949c33}
.pvb iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.pvsc{position:absolute;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;outline:none}
.pvpg{display:flex;flex-direction:column;align-items:center;gap:10px;width:max-content;min-width:100%;padding:10px;box-sizing:border-box}
.pvp{background:#fff;box-shadow:0 1px 6px #0005;flex:none}.pvp canvas{display:block}
.pvl{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;text-align:center;gap:8px;padding:16px;color:var(--mut);font-size:13px}
.pvsp{width:30px;height:30px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--acc);animation:pvsp .8s linear infinite}
@keyframes pvsp{to{transform:rotate(360deg)}}
.pvf{padding:8px 12px 10px!important;margin:0!important}
.pvx.pvfs{position:fixed;inset:0;z-index:2000000;border-radius:0;border:0;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px)}
.pvx.pvfs .pvb{flex:1;height:auto;min-height:0}
@media(prefers-reduced-motion:reduce){.pvsp{animation-duration:2s}}
.lbpf{font-size:12px;color:var(--mut);margin-top:6px}.lbpf a,.lbft a{color:var(--acc)}
.lbgr{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-bottom:12px}
.lbv{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--sh,none)}
.lbth{position:relative;aspect-ratio:16/9;background:#0b2230 center/cover;cursor:pointer;display:grid;place-items:center}
.lbth b{width:52px;height:52px;border-radius:50%;background:#000a;color:#fff;display:grid;place-items:center;font-size:20px}
.lbth:focus-visible{outline:2px solid var(--acc);outline-offset:-2px}
.lbpl{position:absolute;left:8px;top:8px;padding:2px 10px;border-radius:999px;background:#000b;color:#fff;font-size:11px;font-weight:600}
.lbv iframe{width:100%;aspect-ratio:16/9;border:0;display:block}
.lbv p{margin:0;padding:10px 12px 4px;font-size:13.5px;line-height:1.45}
.lbv a{display:inline-block;padding:0 12px 11px;color:var(--mut);font-size:12px}
.lbsh{margin:18px 0 8px;color:var(--mut);font:700 11.5px var(--mono,ui-monospace,monospace);letter-spacing:.1em;text-transform:uppercase}
.lbem{text-align:center;color:var(--mut);padding:28px 10px}
.lbft{margin:18px 2px 0;color:var(--mut);font-size:12.5px;line-height:1.6}`;
document.head.appendChild(css);

const S=Object.assign({tab:'all',yr:'',so:'new'},LS.get('sun_lib',{}));let Q='',host=null,tmr=0;
const idx=PK.map((p,i)=>Object.assign({},p,{i}));
const years=[...new Set(PK.map(p=>p.y))].sort((a,b)=>b-a);
const mixed=PK.some(p=>p.a)&&PK.some(p=>!p.a);
const VALL=[...CHN.map(c=>({id:c[0],t:c[1],u:c[2],pl:1})),...VID.map(v=>({id:v[0],t:v[1],u:'https://www.youtube.com/watch?v='+v[0]}))];
const TABS=[['all','Semua',PK.length],['J','Jembatan',PK.filter(p=>p.k==='J').length],['R','Jalan',PK.filter(p=>p.k==='R').length],['N','SE / Permen',PK.filter(p=>p.k==='N').length]]
  .concat(mixed?[['new','Belum ada di dokumen',PK.filter(p=>!p.a).length]]:[],[['v','Video',VALL.length]]);
const words=()=>Q.toLowerCase().split(/\s+/).filter(Boolean);
const hay=p=>(p.no+' '+p.t+' '+(p.d||'')+' '+(p.kt||'')+' '+p.y).toLowerCase();
const hl=s=>{s=String(s||'');const w=words();if(!w.length)return esc(s);
  const re=new RegExp('('+w.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gi');
  return s.split(re).map((t,i)=>i%2?'<mark>'+esc(t)+'</mark>':esc(t)).join('')};
const pedoman=()=>{const w=words();
  const L=idx.filter(p=>(S.tab==='all'||(S.tab==='new'?!p.a:p.k===S.tab))&&(!S.yr||String(p.y)===String(S.yr))&&w.every(x=>hay(p).includes(x)));
  L.sort(S.so==='old'?(a,b)=>ts(a)-ts(b)||b.i-a.i:S.so==='vw'?(a,b)=>(b.vw||0)-(a.vw||0)||a.i-b.i:(a,b)=>ts(b)-ts(a)||a.i-b.i);return L};
const videos=()=>{const w=words();return VALL.filter(v=>w.every(x=>v.t.toLowerCase().includes(x)))};

const pcard=p=>{const pdf=safe(p.pdf),u=safe(p.u),long=(p.d||'').length>190;
  const meta=[p.tg?'Terbit '+esc(p.tg):'',p.fs?esc(p.fs):'',p.vw?fmt(p.vw)+'× dilihat':''].filter(Boolean).join(' · ');
  return `<article class="lbc"><div class="lbc1"><span class="lbn">${hl(p.no)}</span><span class="lbk">${esc(KAT[p.k]||p.kt||'')}</span><span class="lby">${p.y}</span>${p.st?`<span class="lbst">${esc(p.st)}</span>`:''}</div>
<h3>${hl(p.t)}</h3>${p.d?`<p class="lbd">${hl(p.d)}</p>${long?'<button type="button" class="lbmore" data-more>Selengkapnya</button>':''}`:''}
${meta?`<div class="lbm">${meta}</div>`:''}
<div class="lba">${pdf?`<a class="lbb pri" href="${ea(pdf)}" target="_blank" rel="noopener noreferrer">Buka PDF</a><button type="button" class="lbb" data-pv data-src="${ea(pdf)}">Pratinjau</button>`:''}${u?`<a class="lbb" href="${ea(u)}" target="_blank" rel="noopener noreferrer">Halaman resmi</a>`:''}<button type="button" class="lbb" data-cp="${ea(p.no)}">Salin nomor</button></div>
<div class="lbpv" hidden></div></article>`};
const vcard=v=>`<div class="lbv"><div class="lbth" role="button" tabindex="0" data-vid="${ea(v.id)}" data-pl="${v.pl?1:0}" aria-label="Putar: ${ea(v.t)}" style="${v.pl?'':'background-image:url(https://img.youtube.com/vi/'+ea(v.id)+'/mqdefault.jpg)'}">${v.pl?'<span class="lbpl">Daftar putar</span>':''}<b>&#9654;</b></div><p>${hl(v.t)}</p><a href="${ea(safe(v.u))}" target="_blank" rel="noopener noreferrer">Buka di YouTube &#8599;</a></div>`;

function list(){const box=host&&host.querySelector('#lbl');if(!box)return;box.querySelectorAll('.lbpv').forEach(w=>PDFV.close(w));
  const fl=host.querySelector('#lbfl'),onV=S.tab==='v',ct=host.querySelector('.lbct');fl.hidden=onV;
  let h='';
  if(onV){const V=videos();h=V.length?`<div class="lbgr">${V.map(vcard).join('')}</div>`:'<p class="lbem">Tidak ada video yang cocok.</p>';ct.textContent=V.length+' video'}
  else{const L=pedoman(),V=Q?videos():[];ct.textContent=L.length+' pedoman';
    h=L.length?L.map(pcard).join(''):(V.length?'':'<p class="lbem">Tidak ada pedoman yang cocok.<br><button type="button" class="lbb" data-reset style="margin-top:10px">Atur ulang filter</button></p>');
    if(V.length&&S.tab==='all')h+=`<div class="lbsh">Video terkait (${V.length})</div><div class="lbgr">${V.map(vcard).join('')}</div>`}
  box.innerHTML=h}
const tabs=()=>TABS.map(([k,l,n])=>`<button type="button" role="tab" aria-selected="${k===S.tab}" class="${k===S.tab?'on':''}" data-t="${k}">${esc(l)} <small>${n}</small></button>`).join('');
const save=()=>LS.set('sun_lib',{tab:S.tab,yr:S.yr,so:S.so});
function mount(h,tab){if(host&&host.isConnected)host.querySelectorAll('.lbpv').forEach(w=>PDFV.close(w));host=h;if(tab&&TABS.some(t=>t[0]===tab))S.tab=tab;Q='';
  host.innerHTML=`<div class="lbp"><div class="lbhd"><h2>Pustaka</h2><p>${PK.length} pedoman &amp; SE/Permen &middot; ${VALL.length} video resmi Ditjen Bina Marga</p></div>
<div class="lbsr"><input id="lbq" type="search" placeholder="Cari pedoman atau video, mis. beton, jembatan, AI..." autocomplete="off" aria-label="Cari di Pustaka"></div>
<div class="lbtb" role="tablist">${tabs()}</div>
<div class="lbfl" id="lbfl"><select id="lbyr" aria-label="Tahun"><option value="">Semua tahun</option>${years.map(y=>`<option value="${y}"${String(S.yr)===String(y)?' selected':''}>${y}</option>`).join('')}</select><select id="lbso" aria-label="Urutkan"><option value="new"${S.so==='new'?' selected':''}>Terbaru</option><option value="old"${S.so==='old'?' selected':''}>Terlama</option><option value="vw"${S.so==='vw'?' selected':''}>Paling banyak dilihat</option></select></div>
<div class="lbct"></div><div id="lbl" aria-live="polite"></div>
<p class="lbft">Sumber resmi: <a href="https://binamarga.pu.go.id/index.php/nspk/pedoman-teknis-bidang-jt" target="_blank" rel="noopener noreferrer">Pedoman Jembatan &amp; Terowongan</a> &middot; <a href="https://binamarga.pu.go.id/index.php/nspk/pedoman-teknis-bidang-jalan" target="_blank" rel="noopener noreferrer">Pedoman Jalan</a>. Data dapat tertinggal dari situs resmi; periksa status berlaku sebelum dipakai.</p></div>`;
  list()}

document.addEventListener('input',e=>{if(!host||!host.isConnected||e.target.id!=='lbq')return;clearTimeout(tmr);tmr=setTimeout(()=>{Q=e.target.value.trim();list()},120)});
document.addEventListener('change',e=>{if(!host||!host.contains(e.target))return;
  if(e.target.id==='lbyr'){S.yr=e.target.value;save();list()}else if(e.target.id==='lbso'){S.so=e.target.value;save();list()}});
function play(el){const id=el.dataset.vid,pl=el.dataset.pl==='1',f=document.createElement('iframe');
  if(location.protocol==='file:'){const n=document.createElement('div');n.style.cssText='padding:14px;font-size:13px';n.textContent='Pemutar video butuh alamat web (https). Gunakan tautan "Buka di YouTube" di bawahnya.';el.replaceWith(n);return}
  f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';f.allowFullscreen=true;f.title='Video';
  f.src=pl?`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(id)}&playsinline=1&origin=${encodeURIComponent(location.origin)}`:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
  el.replaceWith(f)}
/* ===== MESIN PRATINJAU PDF (multi-mesin, pilih otomatis) =====
   Urutan "Otomatis":
     1. Ambil byte PDF: langsung -> bila diblokir CORS, balapan beberapa proxy (+ proxy pribadi bila diset).
     2. Render sendiri dengan pdf.js (kanvas, malas-muat, zoom, lompat halaman, layar penuh). Jalan di HP & desktop.
     3. Gagal? Penampil bawaan browser (blob), lalu Google Viewer, lalu Mozilla pdf.js.
   Rute yang pernah berhasil diingat (sun_pv_route) dan dicoba lebih dulu pada pratinjau berikutnya.
   Proxy pribadi: simpan alamat di LS 'sun_pdfproxy' (contoh https://x.workers.dev/?url={url}) atau window.__PDF_PROXY. */
const PDFV=(()=>{
const PJ=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/'];
const enc=encodeURIComponent,MB=n=>(n/1048576).toFixed(1).replace('.',',')+' MB';
const ORDER=['pdfjs','native','gview','moz'];
const NAMA={auto:'Otomatis',pdfjs:'pdf.js',native:'Bawaan',gview:'Google',moz:'Mozilla'};
const proxies=()=>{
  const L=[],own=(LS.get('sun_pdfproxy','')||window.__PDF_PROXY||'').trim();
  if(/^https:\/\//.test(own))L.push({n:'proxy pribadi',f:u=>own.includes('{url}')?own.replace('{url}',enc(u)):own+enc(u)});
  L.push({n:'corsproxy',f:u=>'https://corsproxy.io/?url='+enc(u)},
         {n:'allorigins',f:u=>'https://api.allorigins.win/raw?url='+enc(u)},
         {n:'codetabs',f:u=>'https://api.codetabs.com/v1/proxy/?quest='+enc(u)},
         {n:'thingproxy',f:u=>'https://thingproxy.freeboard.io/fetch/'+u});
  return L};
/* --- cache byte (maks 3 PDF) --- */
const CACHE=new Map();
const cput=(u,b)=>{CACHE.delete(u);CACHE.set(u,b);while(CACHE.size>3)CACHE.delete(CACHE.keys().next().value)};
const isPdf=b=>{if(!b||b.length<1024)return false;let s='';for(let i=0;i<Math.min(1024,b.length);i++)s+=String.fromCharCode(b[i]);return s.indexOf('%PDF')>=0};
/* --- unduh satu jalur, dengan progres + batas macet 25 dtk --- */
async function attempt(u,c,prog){
  let tm;const arm=()=>{clearTimeout(tm);tm=setTimeout(()=>c.abort(),25000)};arm();
  try{
    const r=await fetch(u,{signal:c.signal,credentials:'omit',referrerPolicy:'no-referrer'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const tot=+r.headers.get('content-length')||0;let out;
    if(r.body&&r.body.getReader){
      const rd=r.body.getReader(),parts=[];let n=0;
      for(;;){const x=await rd.read();if(x.done)break;parts.push(x.value);n+=x.value.length;prog(n,tot);arm()}
      out=new Uint8Array(n);let o=0;for(const p of parts){out.set(p,o);o+=p.length}
    }else out=new Uint8Array(await r.arrayBuffer());
    if(!isPdf(out))throw new Error('bukan PDF');
    return out;
  }finally{clearTimeout(tm)}}
/* --- ambil byte: langsung dulu, lalu proxy berjenjang (tiap 3,5 dtk atau segera saat jalur sebelumnya gagal) --- */
function getBytes(url,st){
  if(CACHE.has(url)){const b=CACHE.get(url);cput(url,b);return Promise.resolve({b,via:'cache'})}
  const mem=LS.get('sun_pv_route',null),fresh=mem&&Date.now()-mem.t<864e5?mem:null;
  let src=[{n:'langsung',u:url}].concat(proxies().map(p=>({n:p.n,u:p.f(url)})));
  if(fresh){ // jalur yang terakhir berhasil maju ke depan; "langsung" yang dulu gagal dilewati
    src=src.filter(s=>!(s.n==='langsung'&&fresh.n!=='langsung'));
    src.sort((a,b)=>(b.n===fresh.n)-(a.n===fresh.n))}
  return new Promise((res,rej)=>{
    let next=0,fails=0,done=false;const ctl=[],seen=[];
    const stop=()=>{ctl.forEach(c=>{try{c.abort()}catch(e){}})};
    st.onDead(()=>{if(!done){done=true;stop();rej(new Error('dibatalkan'))}});
    const launch=()=>{
      if(done||next>=src.length)return;
      const i=next++,s=src[i],c=new AbortController();ctl.push(c);
      st.say(i===0?'Mengunduh PDF ('+s.n+')\u2026':'Mencoba jalur '+s.n+' ('+(i+1)+'/'+src.length+')\u2026');
      const t=setTimeout(launch,3500);
      attempt(s.u,c,(n,tot)=>{seen[i]=n;if(!done)st.prog(Math.max.apply(null,seen.filter(Boolean)),tot)})
        .then(b=>{clearTimeout(t);if(done)return;done=true;
          ctl.forEach((x,j)=>j!==i&&x.abort());
          cput(url,b);LS.set('sun_pv_route',{n:s.n,t:Date.now()});res({b,via:s.n})})
        .catch(e=>{clearTimeout(t);if(done)return;
          if(++fails>=src.length){done=true;rej(new Error('semua jalur gagal'))}else launch()});
    };
    launch();
  })}
/* --- muat pdf.js dari CDN (cdnjs, lalu jsDelivr) --- */
let LIBP=null;
const loadScript=src=>new Promise((ok,no)=>{const s=document.createElement('script');let t=setTimeout(()=>{s.remove();no(new Error('timeout'))},15000);
  s.src=src;s.async=true;s.onload=()=>{clearTimeout(t);ok()};s.onerror=()=>{clearTimeout(t);s.remove();no(new Error('gagal'))};document.head.appendChild(s)});
function loadLib(){
  if(window.pdfjsLib&&window.pdfjsLib.getDocument)return Promise.resolve(window.pdfjsLib);
  if(LIBP)return LIBP;
  LIBP=(async()=>{
    for(const b of PJ){
      try{await loadScript(b+'pdf.min.js');const L=window.pdfjsLib;if(!L)throw 0;
        L.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob(['importScripts("'+new URL(b+'pdf.worker.min.js',location.href).href+'");'],{type:'text/javascript'}));
        return L}catch(e){}
    }
    LIBP=null;throw new Error('pdf.js gagal dimuat')})();
  return LIBP}

const UI=`<div class="pvx"><div class="pvt" role="tablist" aria-label="Mesin pratinjau">
${['auto','pdfjs','native','gview','moz'].map(k=>`<button type="button" class="pvk" role="tab" data-pe="${k}">${NAMA[k]}</button>`).join('')}
<span class="pvg"></span><button type="button" class="pvk" data-pn title="Coba mesin berikutnya">Mesin lain \u25b8</button><button type="button" class="pvk" data-pf title="Layar penuh" aria-label="Layar penuh">\u26f6</button></div>
<div class="pvc" hidden><button type="button" class="pvk" data-pp aria-label="Halaman sebelumnya">\u25c0</button><input class="pvi" type="number" min="1" value="1" aria-label="Nomor halaman"><span class="pvtot">/ 1</span><button type="button" class="pvk" data-px aria-label="Halaman berikutnya">\u25b6</button><span class="pvg"></span><button type="button" class="pvk" data-pz="-" aria-label="Perkecil">\u2212</button><button type="button" class="pvk pvzl" data-pz="0" title="Pas lebar">100%</button><button type="button" class="pvk" data-pz="+" aria-label="Perbesar">+</button></div>
<div class="pvs" role="status" aria-live="polite"></div><div class="pvbar" hidden><i></i></div>
<div class="pvb"></div>
<div class="lbpf pvf"></div></div>`;

function open(w,url,title){
  if(w._pv)w._pv.destroy();
  w.innerHTML=UI;
  const $=q=>w.querySelector(q),bd=$('.pvb'),stl=$('.pvs'),bar=$('.pvbar'),bi=bar.firstChild,ft=$('.pvf'),tools=$('.pvc'),root=$('.pvx');
  const S={dead:false,rid:0,bytes:null,via:'',blobs:[],doc:null,cleanups:[],deadCbs:[],mode:LS.get('sun_pv_eng','auto'),cur:'pdfjs'};
  if(!NAMA[S.mode])S.mode='auto';
  w._pv=S;
  S.onDead=f=>S.deadCbs.push(f);
  S.destroy=()=>{if(S.dead)return;S.dead=true;S.deadCbs.forEach(f=>{try{f()}catch(e){}});S.cleanups.forEach(f=>{try{f()}catch(e){}});
    try{S.doc&&S.doc.destroy()}catch(e){}S.blobs.forEach(u=>URL.revokeObjectURL(u));document.documentElement.style.overflow='';w._pv=null};
  const say=m=>{stl.textContent=m};
  const prog=(n,t)=>{bar.hidden=false;bi.style.width=(t?Math.min(100,n/t*100):35)+'%';say('Mengunduh '+MB(n)+(t?' / '+MB(t)+' ('+Math.round(n/t*100)+'%)':'')+'\u2026')};
  const stBox=()=>({say,prog,onDead:S.onDead});
  const spin=m=>{bd.innerHTML='<div class="pvl"><i class="pvsp"></i></div>';tools.hidden=true;say(m||'')};
  const mark=()=>w.querySelectorAll('[data-pe]').forEach(b=>{const on=b.dataset.pe===S.mode;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  const footer=()=>{ft.innerHTML=`Mesin aktif: <b>${NAMA[S.cur]||S.cur}</b>${S.via?' (via '+esc(S.via)+')':''}. Kosong atau gagal? Klik <b>Mesin lain \u25b8</b>, <a href="${ea(url)}" target="_blank" rel="noopener noreferrer">buka PDF di tab baru</a>${S.bytes?' \u00b7 <a href="#" data-ps>simpan PDF</a>':''} \u00b7 <a href="#" data-pc>atur proxy pribadi</a>.`};
  const frame=(src,t)=>{bd.innerHTML='';tools.hidden=true;const f=document.createElement('iframe');f.title=t||'Pratinjau PDF';f.referrerPolicy='no-referrer';f.src=src;bd.appendChild(f);return f};
  const bytes=()=>{
    if(S.bytes)return Promise.resolve(S.bytes);
    if(!S.bp)S.bp=getBytes(url,stBox()).then(r=>{bar.hidden=true;S.bytes=r.b;S.via=r.via;return r.b},e=>{S.bp=null;bar.hidden=true;throw e});
    return S.bp};

  /* ---- mesin 1: pdf.js kanvas ---- */
  async function eCanvas(live){
    spin('Menyiapkan penampil\u2026');
    const [b,L]=await Promise.all([bytes(),loadLib()]);
    if(!live())return;
    say('Membuka dokumen\u2026');bar.hidden=true;
    const task=L.getDocument({data:b.slice(0),isEvalSupported:false});
    const doc=await task.promise;
    if(!live()){try{doc.destroy()}catch(e){}return}
    S.doc=doc;const N=doc.numPages,p1=await doc.getPage(1),v1=p1.getViewport({scale:1});
    let ar=v1.height/v1.width,zoom=1,gen=0,raf=0;
    bd.innerHTML='<div class="pvsc" tabindex="0"><div class="pvpg"></div></div>';
    const sc=bd.firstChild,pg=sc.firstChild,pages=[];
    for(let i=1;i<=N;i++){const el=document.createElement('div');el.className='pvp';el.dataset.n=i;{const cv=document.createElement('canvas');cv.width=cv.height=0;el.appendChild(cv)}pg.appendChild(el);pages.push(el)}
    const baseW=()=>Math.max(180,sc.clientWidth-20),size=el=>{const x=baseW()*zoom;el.style.width=Math.round(x)+'px';el.style.height=Math.round(x*(el._ar||ar))+'px'};
    const cancel=el=>{if(el._t){try{el._t.cancel()}catch(e){}el._t=null}};
    const blank=el=>{cancel(el);el._r=0;const c=el.firstChild;c.width=c.height=0};
    const inp=$('.pvi'),tot=$('.pvtot'),zl=$('.pvzl');tot.textContent='/ '+N;inp.max=N;
    const setCur=n=>{if(document.activeElement!==inp)inp.value=n};
    async function paint(el){
      if(el._r||el._b||S.dead)return;el._b=1;const g=gen;
      try{
        const p=await doc.getPage(+el.dataset.n);if(g!==gen||S.dead)return;
        const v=p.getViewport({scale:1});el._ar=v.height/v.width;
        const cw=Math.round(baseW()*zoom),dpr=Math.min(window.devicePixelRatio||1,2);
        let s=cw/v.width*dpr;if(v.width*s*v.height*s>16e6)s=Math.sqrt(16e6/(v.width*v.height));
        const vp=p.getViewport({scale:s}),c=el.firstChild;
        c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);c.style.width=cw+'px';c.style.height=Math.round(cw*el._ar)+'px';el.style.width=cw+'px';el.style.height=Math.round(cw*el._ar)+'px';
        const t=p.render({canvasContext:c.getContext('2d',{alpha:false}),viewport:vp,background:'#ffffff'});el._t=t;await t.promise;el._t=null;if(g===gen)el._r=1;p.cleanup();
      }catch(e){if(!(e&&e.name==='RenderingCancelledException'))el._r=0}
      finally{el._b=0}}
    const Q=[];let run=0;
    const pump=()=>{while(run<2&&Q.length){const el=Q.shift();el._q=0;run++;paint(el).finally(()=>{run--;pump()})}};
    const enq=el=>{if(el._q)return;el._q=1;Q.push(el);pump()};
    const check=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      if(S.dead)return;const top=sc.scrollTop,h=sc.clientHeight,lo=top-h*1.2,hi=top+h*2.2,flo=top-h*4,fhi=top+h*5,pos=top+h/3;let cur=0;const need=[];
      for(let i=0;i<N;i++){const el=pages[i],t=el.offsetTop,b=t+el.offsetHeight;if(t<=pos)cur=i;
        if(b>=lo&&t<=hi){if(!el._r&&!el._b)need.push(el)}else if((el._r||el._b)&&(b<flo||t>fhi))blank(el)}
      need.sort((a,b)=>Math.abs(a.offsetTop-top)-Math.abs(b.offsetTop-top));Q.length=0;pages.forEach(e=>e._q=0);need.forEach(enq);setCur(cur+1)})};
    const relayout=()=>{const r=sc.scrollTop/Math.max(1,sc.scrollHeight);gen++;pages.forEach(el=>{blank(el);size(el)});sc.scrollTop=r*sc.scrollHeight;zl.textContent=Math.round(zoom*100)+'%';check()};
    const go=n=>{n=Math.max(1,Math.min(N,n|0||1));sc.scrollTop=pages[n-1].offsetTop-6;inp.value=n};
    pages.forEach(size);tools.hidden=false;
    sc.addEventListener('scroll',check,{passive:true});
    let lw=sc.clientWidth,rt=0;
    if(window.ResizeObserver){const ro=new ResizeObserver(()=>{if(Math.abs(sc.clientWidth-lw)>8){lw=sc.clientWidth;clearTimeout(rt);rt=setTimeout(relayout,150)}});ro.observe(sc);S.cleanups.push(()=>ro.disconnect())}
    const clk=e=>{const z=e.target.closest('[data-pz]'),pp=e.target.closest('[data-pp]'),px=e.target.closest('[data-px]');
      if(z){const k=z.dataset.pz;zoom=k==='0'?1:Math.max(.5,Math.min(3,zoom*(k==='+'?1.25:.8)));relayout()}
      else if(pp)go((+inp.value||1)-1);else if(px)go((+inp.value||1)+1)};
    const chg=e=>{if(e.target===inp)go(+inp.value)};
    const kd=e=>{if(e.target===inp&&e.key==='Enter'){e.preventDefault();go(+inp.value)}};
    tools.addEventListener('click',clk);tools.addEventListener('change',chg);tools.addEventListener('keydown',kd);
    S.cleanups.push(()=>{cancelAnimationFrame(raf);clearTimeout(rt);pages.forEach(cancel);Q.length=0});
    say(N+' halaman \u00b7 '+(S.via==='cache'?'dari memori':'via '+S.via));check();footer();
  }
  /* ---- mesin 2: penampil bawaan browser (blob, atau langsung bila byte gagal) ---- */
  async function eNative(live,strict){
    spin('Menyiapkan penampil bawaan\u2026');
    let b=null;try{b=await bytes()}catch(e){if(strict)throw e}
    if(!live())return;
    if(b){const u=URL.createObjectURL(new Blob([b],{type:'application/pdf'}));S.blobs.push(u);frame(u+'#toolbar=1&navpanes=0');say('Penampil PDF bawaan browser.')}
    else{frame(url);say('Byte PDF tidak bisa diambil; mencoba membuka langsung (tergantung izin situs).')}
    if(navigator.pdfViewerEnabled===false)say('Browser ini tidak punya penampil PDF bawaan (umum di HP). Pakai mesin pdf.js atau Google.');
    footer()}
  /* ---- mesin 3: Google Viewer ---- */
  async function eGview(live){
    spin('Memuat Google Viewer\u2026');
    frame('https://docs.google.com/gview?embedded=true&url='+enc(url),'Google Viewer');
    say('Google Viewer \u2014 bisa lambat; bila kosong setelah beberapa detik, klik \u201cMesin lain\u201d.');footer()}
  /* ---- mesin 4: pdf.js resmi Mozilla (butuh proxy CORS) ---- */
  async function eMoz(live){
    spin('Memuat penampil Mozilla\u2026');
    const rt=LS.get('sun_pv_route',null),ps=proxies(),p=(rt&&ps.find(x=>x.n===rt.n))||ps[0];
    frame('https://mozilla.github.io/pdf.js/web/viewer.html?file='+enc(p.f(url)),'Mozilla pdf.js');
    say('Penampil resmi pdf.js (Mozilla) lewat '+p.n+'.');footer()}
  const E={pdfjs:eCanvas,native:eNative,gview:eGview,moz:eMoz};

  async function start(mode,keepMode){
    const my=++S.rid,live=()=>!S.dead&&S.rid===my;
    if(!keepMode){S.mode=mode;LS.set('sun_pv_eng',mode)}
    mark();bar.hidden=true;
    if(S.doc){try{S.doc.destroy()}catch(e){}S.doc=null}
    S.cleanups.forEach(f=>{try{f()}catch(e){}});S.cleanups.length=0;
    try{
      if(mode==='auto'){
        S.cur='pdfjs';
        try{await eCanvas(live);return}catch(e){if(!live())return}
        let order=S.bytes?(navigator.pdfViewerEnabled===false?['gview','moz']:['native','gview','moz']):['gview','native','moz'];
        for(const n of order){if(!live())return;S.cur=n;
          try{await E[n](live,true);if(live())say('Otomatis: pdf.js tidak bisa dipakai, beralih ke '+NAMA[n]+'. '+stl.textContent);return}catch(e){}}
        throw new Error('gagal');
      }
      S.cur=mode;await E[mode](live);
    }catch(e){
      if(!live())return;
      bd.innerHTML='<div class="pvl pvx2">Pratinjau belum berhasil dimuat.<br><small>Situs sumber memblokir pengambilan langsung dan semua proxy gratis gagal/penuh.</small><br><button type="button" class="pvk" data-pr>Coba lagi</button> <a class="pvk" href="'+ea(url)+'" target="_blank" rel="noopener noreferrer">Buka di tab baru</a></div>';
      tools.hidden=true;bar.hidden=true;say('Gagal: '+(e&&e.message||'tidak diketahui')+'. Tips: pasang proxy pribadi (lihat \u201catur proxy pribadi\u201d).');S.bytes=null;S.bp=null;footer()}
  }
  root.addEventListener('click',e=>{const t=e.target;
    const pe=t.closest('[data-pe]');if(pe){start(pe.dataset.pe);return}
    if(t.closest('[data-pn]')){const i=ORDER.indexOf(S.cur);start(ORDER[(i+1)%ORDER.length],true);S.mode=ORDER[(i+1)%ORDER.length];mark();return}
    if(t.closest('[data-pr]')){CACHE.delete(url);LS.set('sun_pv_route',null);start(S.mode);return}
    if(t.closest('[data-pf]')){const on=root.classList.toggle('pvfs');document.documentElement.style.overflow=on?'hidden':'';return}
    const sv=t.closest('[data-ps]');if(sv){e.preventDefault();const u=URL.createObjectURL(new Blob([S.bytes],{type:'application/pdf'})),a=document.createElement('a');
      a.href=u;a.download=(decodeURIComponent(url.split('?')[0].split('/').pop()||'dokumen.pdf')||'dokumen.pdf').replace(/[^\w.\-() ]+/g,'_');document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3e4);return}
    if(t.closest('[data-pc]')){e.preventDefault();const cur=LS.get('sun_pdfproxy','');
      const v=prompt('Alamat proxy pribadi (https), pakai {url} sebagai tempat alamat PDF.\nContoh: https://nama.workers.dev/?url={url}\nKosongkan untuk menghapus.',cur||'');
      if(v===null)return;LS.set('sun_pdfproxy',v.trim());LS.set('sun_pv_route',null);CACHE.delete(url);start(S.mode)}});
  const esck=e=>{if(e.key==='Escape'&&root.classList.contains('pvfs')){root.classList.remove('pvfs');document.documentElement.style.overflow=''}};
  document.addEventListener('keydown',esck);
  const origDestroy=S.destroy;S.destroy=()=>{document.removeEventListener('keydown',esck);origDestroy()};
  start(S.mode,true);
}
const close=w=>{if(w&&w._pv)w._pv.destroy();if(w)w.innerHTML=''};
return {open,close,_t:{getBytes,isPdf,proxies,CACHE}};
})();

document.addEventListener('click',e=>{if(!host||!host.isConnected||!host.contains(e.target))return;const t=e.target;
  const tb=t.closest('[data-t]');if(tb){S.tab=tb.dataset.t;save();host.querySelector('.lbtb').innerHTML=tabs();list();return}
  const th=t.closest('.lbth');if(th){play(th);return}
  const mo=t.closest('[data-more]');if(mo){const d=mo.previousElementSibling,o=d.classList.toggle('open');mo.textContent=o?'Lebih sedikit':'Selengkapnya';return}
  const cp=t.closest('[data-cp]');if(cp){try{navigator.clipboard.writeText(cp.dataset.cp)}catch(x){}cp.textContent='Tersalin';setTimeout(()=>cp.textContent='Salin nomor',1500);return}
  if(t.closest('[data-reset]')){S.yr='';S.so='new';S.tab='all';save();mount(host);return}
  const pv=t.closest('[data-pv]');if(pv){const w=pv.closest('.lbc').querySelector('.lbpv'),s=pv.dataset.src;
    if(!w.hidden){PDFV.close(w);w.hidden=true;pv.textContent='Pratinjau';return}
    w.hidden=false;pv.textContent='Tutup pratinjau';PDFV.open(w,s,pv.closest('.lbc').querySelector('h3').textContent);
    setTimeout(()=>{try{w.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(x){}},60)}});
document.addEventListener('keydown',e=>{if(host&&host.isConnected&&(e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.lbth')){e.preventDefault();play(e.target)}});

window.__LIB={mount};
mk('📚 Pustaka',()=>{ai.style.display='none';if(window.__libGo)window.__libGo()});
})();
