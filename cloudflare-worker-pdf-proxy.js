/* Proxy PDF pribadi (Cloudflare Workers, gratis 100.000 permintaan/hari).
   Fungsi: mengambil PDF dari situs resmi lalu menambahkan header CORS, sehingga pratinjau
   pdf.js di aibook bisa membacanya. Hanya domain di ALLOW_HOSTS dan hanya dari ORIGINS yang dilayani.

   Pasang: dash.cloudflare.com -> Workers & Pages -> Create -> Hello World -> Edit code -> tempel berkas ini -> Deploy.
   Lalu di aibook: Pustaka -> Pratinjau -> "atur proxy pribadi" -> isi
       https://NAMA-ANDA.workers.dev/?url={url}                                                    */
const ALLOW_HOSTS = ['pu.go.id'];                         // domain (dan subdomainnya) yang boleh diambil
const ORIGINS = ['https://petaaipro-source.github.io', 'https://aibook.my.id'];

export default {
  async fetch(req) {
    const origin = req.headers.get('Origin') || '';
    const okOrigin = ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Metode tidak didukung', { status: 405, headers: cors });
    if (origin && !okOrigin) return new Response('Origin tidak diizinkan', { status: 403, headers: cors });

    let target;
    try { target = new URL(new URL(req.url).searchParams.get('url')); } catch { return new Response('Parameter url tidak valid', { status: 400, headers: cors }); }
    const h = target.hostname.toLowerCase();
    if (target.protocol !== 'https:' || !ALLOW_HOSTS.some(d => h === d || h.endsWith('.' + d)))
      return new Response('Domain tidak diizinkan', { status: 403, headers: cors });

    const up = await fetch(target.href, {
      headers: { 'User-Agent': 'Mozilla/5.0 (aibook pdf proxy)', ...(req.headers.get('Range') ? { Range: req.headers.get('Range') } : {}) },
      redirect: 'follow',
      cf: { cacheEverything: true, cacheTtl: 86400 },
    });
    const out = new Headers(cors);
    for (const k of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'ETag', 'Last-Modified'])
      if (up.headers.get(k)) out.set(k, up.headers.get(k));
    out.set('Content-Type', 'application/pdf');
    out.set('Cache-Control', 'public, max-age=86400');
    return new Response(up.body, { status: up.status, headers: out });
  },
};
