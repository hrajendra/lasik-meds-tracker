const CACHE = 'lasik-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-96.png'];

// ── Install: cache shell ──────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first ────────────────────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// ── Messages from main thread ─────────────────────────────────
self.addEventListener('message', e => {
  if (e.data.type === 'SHOW_NOTIFICATION') {
    const { medName, timeStr, tag, isWarning } = e.data;
    const title = isWarning ? `⏰ ${medName} in 5 min` : `💧 Time for ${medName}`;
    const body  = isWarning ? `Upcoming: ${timeStr} dose` : `${timeStr} · Both eyes`;
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: 'icon-192.png',
        badge: 'icon-96.png',
        tag,
        requireInteraction: !isWarning,
        actions: isWarning ? [] : [
          { action: 'taken', title: '✓ Taken' },
          { action: 'snooze', title: '⏰ +5 min' }
        ],
        data: e.data
      })
    );
  }
});

// ── Notification click ────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  const notif = e.notification;
  notif.close();

  if (e.action === 'snooze') {
    // Re-show in 5 minutes
    e.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification(notif.title, {
            body: notif.body,
            icon: 'icon-192.png',
            badge: 'icon-96.png',
            tag: notif.tag + '_snoozed',
            requireInteraction: true,
            data: notif.data
          });
          resolve();
        }, 5 * 60 * 1000);
      })
    );
  } else {
    // Open or focus the app
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        for (const c of list) {
          if (c.url.includes('lasik-meds-tracker') && 'focus' in c) return c.focus();
        }
        return clients.openWindow('./');
      })
    );
  }
});