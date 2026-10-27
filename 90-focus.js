/* Tata letak "fokus baca": halaman dokumen jadi pusat layar.
   - header ramping; kolom cari menyingkat saat membaca; header & dok bawah menyingkir saat menggulir ke bawah
   - panel (Asisten, Pustaka, Teknik, Unduh, Catatan) tampil BERDAMPINGAN di layar lebar, bukan menimpa teks; hanya satu panel terbuka
   - lembar baca bertipografi serif, nyaman untuk teks panjang; penunjuk halaman + persen terbaca di header
   Hanya tampilan; tidak mengubah logika pembaca. */
(()=>{
const d=document,B=d.body,R=d.documentElement,g=id=>d.getElementById(id);
const hdr=d.querySelector('body>header'),mn=g('m'),qi=g('q'),h1=g('ti'),stb=g('st'),row=hdr&&hdr.querySelector('.row');
if(!hdr||!mn||!qi||!h1||!row)return;

/* ---------- gaya ---------- */
const css=d.createElement('style');
css.textContent=`
:root{--serif:"Source Serif 4","Literata",Georgia,"Times New Roman",serif;--sans:"Space Grotesk","Segoe UI",system-ui,sans-serif;--pw:clamp(390px,32vw,520px)}
html{scroll-padding-top:76px}
body{transition:padding-right .24s cubic-bezier(.2,.8,.2,1)}

/* header ramping */
body>header{padding:8px 14px!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .2s}
body>header .row{margin:0 auto!important;max-width:1100px;gap:6px}
body>header .ttl{flex:1;min-width:0}
body>header h1{margin:0!important;font-size:17px;line-height:1.25}
#pgi{display:none;gap:12px;font:500 11.5px var(--mono);color:var(--mut);margin-top:1px;white-space:nowrap}
body.is-read #pgi{display:flex}
@media(min-width:601px){#pgi span:last-child::after{content:" terbaca"}}
#hb,#fs,#st,#bk,#sb{width:40px;height:40px;padding:0;display:grid;place-items:center}
#bk{width:auto;padding:0 14px}
#sb{display:none}#sb svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}
body.is-read #sb{display:grid}
body>header #q{margin:8px auto 0!important;padding:10px 18px!important;font-size:15px;box-shadow:none}
body.is-read:not(.sq)>header #q{display:none}
body.is-read>header .row,body.is-read>header #q{max-width:860px}
body.hid>header{transform:translateY(calc(-100% + 4px));box-shadow:none}

/* lembar baca */
body.is-read main{max-width:820px;margin:18px auto 130px;padding:clamp(18px,4.2vw,54px) clamp(16px,4.6vw,60px) clamp(20px,3vw,36px);background:var(--cards);border:1px solid var(--line);border-radius:18px;box-shadow:var(--sh)}
body.is-read .txt{font-family:var(--serif);line-height:1.8;font-kerning:normal;hyphens:auto;-webkit-hyphens:auto;text-align:left}
body.is-read .txt .h{font-family:var(--sans);color:var(--acc);margin:1.5em 0 .5em;line-height:1.35}
body.is-read .pgh{display:flex;align-items:center;gap:14px;margin:38px 0 16px;padding:0;border:0;font:600 12px var(--mono);letter-spacing:.02em;text-transform:none;color:var(--mut)}
body.is-read .pgh::before,body.is-read .pgh::after{content:"";flex:1;height:1px;background:var(--line)}
body.is-read .pgh:first-child{margin-top:0}
body.is-read .fg img{width:auto;max-width:100%;max-height:78vh;height:auto;object-fit:contain}
body.is-read .sn{margin-top:44px;padding-top:22px;border-top:1px solid var(--line)}
body.is-read .up{margin:0 auto}

/* ketenangan: kurangi gerak melompat */
html body details:hover,html body .r:hover,html body button:hover{transform:none}

/* lapisan: menu, lightbox di atas header */
#dr{z-index:100002}#lb{z-index:100003}#lbx{z-index:100004}

/* dok bawah */
html body .fab{transition:transform .28s cubic-bezier(.2,.8,.2,1),left .24s cubic-bezier(.2,.8,.2,1)!important;z-index:100000;gap:2px!important;padding:5px!important}
html body .fab button{min-width:58px;padding:6px 8px!important;font-size:10.5px!important;position:relative}
html body .fab button[aria-pressed=true]{background:var(--chip)!important;color:var(--acc)!important}
html body .fab button[aria-pressed=true]::after{content:"";position:absolute;left:30%;right:30%;bottom:2px;height:2px;border-radius:2px;background:var(--acc)}
html body.hid .fab{transform:translate(-50%,calc(100% + 30px))!important}
html body #rp{left:50%;transform:translateX(-50%);bottom:calc(var(--dk,64px) + 26px)}

/* panel: bentuk dasar */
#ai,#pk,#tk,#dp,#np{z-index:99998!important;display:none;flex-direction:column;background:var(--pkbg)!important;color:var(--pkfg)}
#np{display:flex;padding:0!important}
#np>header{background:linear-gradient(90deg,var(--chip),transparent)!important;border-bottom:1px solid var(--line)!important}
#ai>header,#pk>header,#tk>header,#dp>header,#np>header{display:flex;align-items:center;gap:10px;position:static!important;padding:12px 14px 12px 18px!important;font-size:15px!important;box-shadow:none!important;flex:none}
#ai>header span,#pk>header span,#tk>header span,#dp>header span,#np>header span{flex:1;font-weight:700}
#ai>header button,#pk .x,#tk .x,#dp .x,#np .x{width:36px;height:36px;min-width:0!important;min-height:0!important;padding:0!important;display:grid;place-items:center;border-radius:50%!important;border:0!important;background:transparent!important;font-size:16px!important}
#ai>header button:hover,#pk .x:hover,#tk .x:hover,#dp .x:hover,#np .x:hover{background:var(--chip)!important}
#np textarea{flex:1;height:auto!important;width:calc(100% - 36px);margin:0 18px;resize:none;font:15px/1.6 var(--serif);padding:12px 14px;border-radius:12px;background:var(--chip);border:1px solid var(--line);color:inherit}
#np textarea:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--glow)}
#np small{margin:4px 18px 8px!important;font-size:12px;color:var(--mut);opacity:1!important}
#np>button{margin:10px 18px 18px!important}

/* form Teknik: dua kolom sama lebar */
.tkf{grid-template-columns:repeat(2,minmax(0,1fr))!important}
.tkf label{min-width:0}.tkf input,.tkf select,.tkf textarea{min-width:0;width:100%}

/* tab Teknik & Pustaka: rapi, tidak terpotong */
#tk nav,#pk nav{padding:4px 16px 10px!important;gap:6px!important;flex-wrap:wrap!important;overflow:visible!important}
#tk nav button,#pk nav button{min-height:34px!important;padding:6px 12px!important;font-size:13px!important}
#tkb,#pkb{padding-left:18px!important;padding-right:14px!important}

/* ---------- layar lebar: panel di samping, halaman tetap terlihat penuh ---------- */
@media(min-width:1000px){
  body.pnl{padding-right:var(--pw)}
  html body #ai,html body #pk,html body #tk,html body #dp,html body #np{position:fixed!important;top:0!important;right:0!important;bottom:0!important;left:auto!important;width:var(--pw)!important;max-width:none!important;height:auto!important;max-height:none!important;border-radius:0!important;border-width:0 0 0 1px!important;box-shadow:-16px 0 48px #0b223020!important;animation:fslide .24s cubic-bezier(.2,.8,.2,1)!important}
  html body.pnl .fab{left:calc((100% - var(--pw))/2)!important}
  html body #rp{left:calc((100% - var(--pw))/2)}
  body.pnl #rp{left:calc((100% - var(--pw))/2)}
}
@keyframes fslide{from{opacity:0;transform:translateX(28px)}}

/* ---------- layar sedang & HP: lembar di bawah header, halaman tetap terlihat di atasnya ---------- */
@media(max-width:999px){
  html body #ai,html body #pk,html body #tk,html body #dp,html body #np{position:fixed!important;top:calc(var(--hh,56px) + 8px)!important;bottom:calc(var(--dk,64px) + 26px + env(safe-area-inset-bottom,0px))!important;left:12px!important;right:12px!important;width:auto!important;max-width:660px;margin:0 auto!important;height:auto!important;max-height:none!important;border-radius:18px!important}
}
@media(max-width:600px){
  html body #ai,html body #pk,html body #tk,html body #dp,html body #np{top:calc(var(--hh,56px) + 6px)!important;bottom:var(--dk,64px)!important;left:0!important;right:0!important;max-width:none;border-radius:18px 18px 0 0!important}
  html body.hid .fab{transform:translateY(105%)!important}
  html body .fab button{min-width:0;flex:1 1 0!important;padding:6px 1px!important}
  html body .fab button span{max-width:100%;overflow:hidden;text-overflow:clip}
  #bk{font-size:0;padding:0;width:40px}#bk::before{content:"\\2039";font-size:28px;line-height:1;transform:translateY(-2px)}
  body.is-read main{margin:0 0 110px;border-radius:0;border-width:1px 0;box-shadow:none}
  body.is-read .txt{hyphens:auto}
  #tk nav{flex-wrap:nowrap!important;overflow-x:auto!important;scroll-snap-type:x proximity;scrollbar-width:none}
  #tk nav::-webkit-scrollbar{display:none}
  #tk nav button{scroll-snap-align:center;flex:none}
  #tk nav.er:not(.el){-webkit-mask-image:linear-gradient(90deg,#000 86%,transparent);mask-image:linear-gradient(90deg,#000 86%,transparent)}
  #tk nav.el:not(.er){-webkit-mask-image:linear-gradient(270deg,#000 86%,transparent);mask-image:linear-gradient(270deg,#000 86%,transparent)}
  #tk nav.el.er{-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
}
@media print{body>header,.fab{display:none!important}body.is-read main{box-shadow:none;border:0;margin:0;padding:0}}
`;
d.head.appendChild(css);

/* ---------- header: judul + penunjuk halaman, tombol cari ---------- */
const ttl=d.createElement('div');ttl.className='ttl';h1.parentNode.insertBefore(ttl,h1);ttl.appendChild(h1);
const pgi=d.createElement('div');pgi.id='pgi';pgi.innerHTML='<span></span><span></span>';ttl.appendChild(pgi);
const sb=d.createElement('button');sb.id='sb';sb.type='button';sb.setAttribute('aria-label','Cari di dokumen');sb.setAttribute('aria-expanded','false');
sb.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>';
row.insertBefore(sb,stb);
const setSq=on=>{B.classList.toggle('sq',on);sb.setAttribute('aria-expanded',on)};
sb.onclick=()=>{const on=!B.classList.contains('sq');setSq(on);if(on){qi.focus();qi.select()}};
qi.addEventListener('focus',()=>setSq(true));
qi.addEventListener('blur',()=>setTimeout(()=>{if(B.classList.contains('is-read')&&!qi.value&&d.activeElement!==qi)setSq(false)},180));
addEventListener('keydown',e=>{ // "/" harus menampilkan kolom cari lebih dulu, baru difokuskan oleh pembaca
  if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((d.activeElement||{}).tagName||''))setSq(true)},true);

if(matchMedia('(max-width:600px)').matches)qi.placeholder='Cari isi dokumen...';

/* ---------- mode baca vs beranda/hasil cari ---------- */
const isRead=()=>B.classList.contains('is-read');
const pgs=()=>mn.querySelectorAll('.pgh');
const mode=()=>{const rd=!!mn.querySelector('.pgh');B.classList.toggle('is-read',rd);
  if(!rd){B.classList.remove('hid');setSq(false)}else if(d.activeElement!==qi)setSq(false);
  ly=scrollY;upd()};
let ly=0;
const upd=()=>{const s=pgi.children;if(!isRead()){s[0].textContent=s[1].textContent='';return}
  let p=null;for(const e of pgs()){if(e.getBoundingClientRect().top<=170)p=e;else break}if(!p)p=pgs()[0];
  const h=R.scrollHeight-innerHeight;s[0].textContent=p?p.textContent:'';s[1].textContent=(h>0?Math.round(Math.min(1,Math.max(0,scrollY/h))*100):0)+'%'};
new MutationObserver(mode).observe(mn,{childList:true});

/* ---------- header & dok menyingkir saat menggulir ke bawah ---------- */
const rpEl=()=>g('rp'),dr=g('dr');
const menuOpen=()=>dr&&!dr.hidden;
new MutationObserver(()=>{B.classList.toggle('menu',menuOpen());B.classList.remove('hid')}).observe(dr,{attributes:true,attributeFilter:['hidden']});
let tick=0;
const sync=()=>{tick=0;upd();
  const y=scrollY,dy=y-ly,h=R.scrollHeight-innerHeight,rp=rpEl();
  const lock=!isRead()||B.classList.contains('pnl')||menuOpen()||B.classList.contains('sq')||y<90||h-y<260||(rp&&getComputedStyle(rp).display!=='none');
  if(lock)B.classList.remove('hid');else if(dy>8)B.classList.add('hid');else if(dy<-8)B.classList.remove('hid');
  if(lock||Math.abs(dy)>8)ly=y};
addEventListener('scroll',()=>{if(!tick)tick=requestAnimationFrame(sync)},{passive:true});
addEventListener('resize',()=>{if(!tick)tick=requestAnimationFrame(sync)});

/* ---------- panel: hanya satu terbuka; tandai tombol dok yang aktif ---------- */
const PN={ai:'Asisten',pk:'Pustaka',tk:'Teknik',dp:'Unduh',np:'Catatan'};
const open=id=>{const e=g(id);return !!e&&e.isConnected&&getComputedStyle(e).display!=='none'};
const fb=l=>[...d.querySelectorAll('.fab button')].find(b=>(b.getAttribute('aria-label')||b.textContent).trim().replace(/^\S+\s/,'')===l||(b.getAttribute('aria-label')||'').trim()===l);
const shut=id=>{const e=g(id);if(!e)return;if(id==='np'){const b=fb('Catatan');if(b)b.click()}else{const x=e.querySelector('#aix,.x');if(x)x.click();else e.style.display='none'}};
let prev=[],busy=0;
const syncP=()=>{if(busy)return;busy=1;
  try{const ids=Object.keys(PN);let on=ids.filter(open);
    if(on.length>1){const fresh=on.filter(i=>!prev.includes(i)),keep=fresh.length?fresh[fresh.length-1]:on[on.length-1];on.filter(i=>i!==keep).forEach(shut);on=ids.filter(open)}
    prev=on;B.classList.toggle('pnl',on.length>0);B.dataset.pnl=on[0]||'';
    ids.forEach(id=>{const b=fb(PN[id]);if(b)b.setAttribute('aria-pressed',on.includes(id))});
    if(on.length)B.classList.remove('hid');
    const np=g('np');if(np&&!np.querySelector(':scope>header')){
      const h=d.createElement('header');h.innerHTML='<span>\u{1F4DD} Catatan</span><button class="x" type="button" aria-label="Tutup">\u2715</button>';
      np.prepend(h);h.querySelector('.x').onclick=()=>shut('np');const ta=np.querySelector('textarea');if(ta)ta.focus()}
  }finally{busy=0}
  if(!tick)tick=requestAnimationFrame(sync)};
const po=new MutationObserver(syncP);
['ai','pk','tk','dp'].forEach(id=>{const e=g(id);if(e)po.observe(e,{attributes:true,attributeFilter:['style','class']})});
po.observe(B,{childList:true});
syncP();

/* ---------- tab Teknik: bayangan tepi saat bisa digeser (HP) ---------- */
const tn=g('tk')&&g('tk').querySelector('nav');
if(tn){const edge=()=>{tn.classList.toggle('el',tn.scrollLeft>4);tn.classList.toggle('er',tn.scrollLeft+tn.clientWidth<tn.scrollWidth-4)};
  tn.addEventListener('scroll',edge,{passive:true});new MutationObserver(edge).observe(tn,{childList:true});
  if(window.ResizeObserver)new ResizeObserver(edge).observe(tn);edge()}

mode();
})();
