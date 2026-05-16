const CACHE = 'lasik-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

// ── Install ──────────────────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch (cache-first) ───────────────────────────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request)
        .catch(() => caches.match('./index.html'))
      )
  );
});

// ── Notification scheduling ──────────────────────────────────────────
const timers = new Map();

self.addEventListener('message', e => {
  const { type } = e.data || {};

  if (type === 'SCHEDULE') {
    const { doses, now } = e.data;
    // Clear existing scheduled timers
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();

    for (const dose of doses) {
      const delay = dose.ts - now - (5 * 60 * 1000); // 5 min early
      if (delay > 0 && delay < 86400000) {
        const tid = setTimeout(() => {
          timers.delete(dose.id);
          self.registration.showNotification(`💊 ${dose.name}`, {
            body: `Due at ${dose.time} · ${dose.type}`,
            icon: './icon.svg',
            badge: './icon.svg',
            tag: dose.id,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
            actions: [
              { action: 'taken', title: '✓ Taken' },
              { action: 'skip',  title: '✗ Skip'  },
            ],
            data: { id: dose.id },
          });
        }, delay);
        timers.set(dose.id, tid);
      }
    }
  }

  if (type === 'CANCEL') {
    const { id } = e.data;
    if (timers.has(id)) { clearTimeout(timers.get(id)); timers.delete(id); }
    self.registration.getNotifications({ tag: id })
      .then(ns => ns.forEach(n => n.close()));
  }
});

// ── Notification click ────────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  const { action } = e;
  const { id } = e.notification.data || {};
  e.notification.close();

  const msg = action === 'taken' ? { type: 'MARK', id, status: 'taken'   }
            : action === 'skip'  ? { type: 'MARK', id, status: 'skipped' }
            : { type: 'OPEN' };

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(async clients => {
        if (clients.length > 0) {
          await clients[0].focus();
          clients[0].postMessage(msg);
        } else {
          await self.clients.openWindow('./');
        }
      })
  );
});