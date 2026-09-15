/* Service worker sencillo: red primero, caché de respaldo.
   Así la web funciona sin conexión pero siempre se actualiza si hay red. */
const CACHE = 'matemagicas-v3';
const ASSETS = [
  './',
  'index.html',
  'assets/css/app.css',
  'assets/icon.svg',
  'assets/js/core/core.js',
  'assets/js/core/store.js',
  'assets/js/core/i18n.js',
  'assets/js/content/lessons-1.js',
  'assets/js/content/lessons-2.js',
  'assets/js/content/lessons-3.js',
  'assets/js/content/gen-numbers.js',
  'assets/js/content/gen-proportion.js',
  'assets/js/content/gen-data-lang.js',
  'assets/js/content/gen-geometry.js',
  'assets/js/content/gen-problems.js',
  'assets/js/content/topics.js',
  'assets/js/content/plan.js',
  'assets/js/content/glossary.js',
  'assets/js/app/engine.js',
  'assets/js/app/views.js',
  'assets/js/app/exam.js',
  'assets/js/app/game.js',
  'assets/js/app/game-extra.js',
  'assets/js/app/main.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
