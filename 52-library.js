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
.lbpv iframe{display:block;width:100%;height:min(70vh,560px);border:1px solid var(--line);border-radius:12px;margin-top:10px;background:#fff}
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

function list(){const box=host&&host.querySelector('#lbl');if(!box)return;
  const fl=host.querySelector('#lbfl'),onV=S.tab==='v',ct=host.querySelector('.lbct');fl.hidden=onV;
  let h='';
  if(onV){const V=videos();h=V.length?`<div class="lbgr">${V.map(vcard).join('')}</div>`:'<p class="lbem">Tidak ada video yang cocok.</p>';ct.textContent=V.length+' video'}
  else{const L=pedoman(),V=Q?videos():[];ct.textContent=L.length+' pedoman';
    h=L.length?L.map(pcard).join(''):(V.length?'':'<p class="lbem">Tidak ada pedoman yang cocok.<br><button type="button" class="lbb" data-reset style="margin-top:10px">Atur ulang filter</button></p>');
    if(V.length&&S.tab==='all')h+=`<div class="lbsh">Video terkait (${V.length})</div><div class="lbgr">${V.map(vcard).join('')}</div>`}
  box.innerHTML=h}
const tabs=()=>TABS.map(([k,l,n])=>`<button type="button" role="tab" aria-selected="${k===S.tab}" class="${k===S.tab?'on':''}" data-t="${k}">${esc(l)} <small>${n}</small></button>`).join('');
const save=()=>LS.set('sun_lib',{tab:S.tab,yr:S.yr,so:S.so});
function mount(h,tab){host=h;if(tab&&TABS.some(t=>t[0]===tab))S.tab=tab;Q='';
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
document.addEventListener('click',e=>{if(!host||!host.isConnected||!host.contains(e.target))return;const t=e.target;
  const tb=t.closest('[data-t]');if(tb){S.tab=tb.dataset.t;save();host.querySelector('.lbtb').innerHTML=tabs();list();return}
  const th=t.closest('.lbth');if(th){play(th);return}
  const mo=t.closest('[data-more]');if(mo){const d=mo.previousElementSibling,o=d.classList.toggle('open');mo.textContent=o?'Lebih sedikit':'Selengkapnya';return}
  const cp=t.closest('[data-cp]');if(cp){try{navigator.clipboard.writeText(cp.dataset.cp)}catch(x){}cp.textContent='Tersalin';setTimeout(()=>cp.textContent='Salin nomor',1500);return}
  if(t.closest('[data-reset]')){S.yr='';S.so='new';S.tab='all';save();mount(host);return}
  const pv=t.closest('[data-pv]');if(pv){const w=pv.closest('.lbc').querySelector('.lbpv'),s=pv.dataset.src;
    if(!w.hidden){w.hidden=true;w.innerHTML='';pv.textContent='Pratinjau';return}
    const g='https://docs.google.com/gview?embedded=true&url='+encodeURIComponent(s);w.hidden=false;
    w.innerHTML=`<iframe src="${ea(g)}" title="Pratinjau PDF" loading="lazy"></iframe><div class="lbpf">Pratinjau lewat penampil Google; tunggu beberapa detik. Kosong atau gagal? <a href="${ea(s)}" target="_blank" rel="noopener noreferrer">Buka PDF di tab baru</a>.</div>`;pv.textContent='Tutup pratinjau'}});
document.addEventListener('keydown',e=>{if(host&&host.isConnected&&(e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.lbth')){e.preventDefault();play(e.target)}});

window.__LIB={mount};
mk('📚 Pustaka',()=>{ai.style.display='none';if(window.__libGo)window.__libGo()});
})();
