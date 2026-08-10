/* WYZMIND site shell — cache-first app shell w/ network-first navigation */
const CACHE = "var-site-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.webmanifest",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/favicon-48x48.png",
  "/favicon.ico",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/images/label-art.jpg",
  "/images/freshly-squeezed.jpg",
  "/images/descent.jpg",
  "/images/grid-failure.jpg",
  "/images/deal-with-the-devil.jpg",
  "/images/ryan-turn-your-heart.jpg",
  "/images/ryan-used-to-be.jpg",
  "/images/sophia-used-to-be.jpg",
  "/images/therapy.jpg",
  "/images/sophia-what-you-mean-to-me.jpg",
  "/images/artist-lalimes.jpg",
  "/images/artist-dantes.jpg",
  "/images/artist-sophia.jpg",
  "/images/artist-ryan.jpg",
  "/images/artist-isaiah.jpg",
  "/images/label-banner.jpg",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  "https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js",
  "https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  // Navigation requests -> network first, fall back to shell
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }
  // Static GET (same-origin or cached CDN) -> cache first
  if (request.method === "GET") {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((resp) => {
          if (resp && resp.status === 200 && (resp.type === "basic" || resp.type === "cors")) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return resp;
          }
          return resp;
        }).catch(() => caches.match(request));
      })
    );
  }
});
