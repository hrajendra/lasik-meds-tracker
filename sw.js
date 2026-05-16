const CACHE = 'lasik-v2'; // bumped — forces SW update on all clients
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-96.png'];

// ── Install ───────────────────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // take control immediately
});

// ── Activate ──────────────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // claim all open tabs
  );
});

// ── Fetch (cache-first) ───────────────────────────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// ── Scheduling — timers live HERE in the SW, not the main thread ──────
const timers = new Map(); // doseId -> timerId

self.addEventListener('message', e => {
  const { type } = e.data || {};

  // Main thread sends full dose list with Unix timestamps on every load
  if (type === 'SCHEDULE') {
    const { doses } = e.data;
    const now = Date.now();

    // Clear all pending timers first
    for (const tid of timers.values()) clearTimeout(tid);
    timers.clear();

    for (const dose of doses) {
      if (dose.ts <= now) continue; // already past

      // Fire 5 min before the dose; if < 5 min away fire in 1s so it's not missed
      const fireAt  = dose.ts - 5 * 60 * 1000;
      const delay   = Math.max(1000, fireAt - now);

      const tid = setTimeout(() => {
        timers.delete(dose.id);
        self.registration.showNotification(`💧 ${dose.name}`, {
          body:             `Due at ${dose.time} · Both eyes`,
          icon:             './icon-192.png',
          badge:            './icon-96.png',
          tag:              dose.id,
          requireInteraction: true,
          vibrate:          [200, 100, 200],
          actions: [
            { action: 'taken',  title: '✓ Taken'   },
            { action: 'snooze', title: '⏰ +5 min'  },
          ],
          data: { id: dose.id, name: dose.name, time: dose.time },
        });
      }, delay);

      timers.set(dose.id, tid);
    }
  }

  // Cancel a single dose notification (e.g. user marked it taken)
  if (type === 'CANCEL') {
    const { id } = e.data;
    if (timers.has(id)) { clearTimeout(timers.get(id)); timers.delete(id); }
    self.registration.getNotifications({ tag: id }).then(ns => ns.forEach(n => n.close()));
  }

  // Cancel everything (notifications disabled)
  if (type === 'CANCEL_ALL') {
    for (const tid of timers.values()) clearTimeout(tid);
    timers.clear();
  }
});

// ── Notification interactions ─────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  const { id, name, time } = e.notification.data || {};
  e.notification.close();

  if (e.action === 'snooze') {
    e.waitUntil(new Promise(resolve => {
      setTimeout(() => {
        self.registration.showNotification(`💧 ${name}`, {
          body:             `Snoozed · ${time} dose (overdue)`,
          icon:             './icon-192.png',
          badge:            './icon-96.png',
          tag:              id + '_snoozed',
          requireInteraction: true,
          vibrate:          [200, 100, 200],
          actions:          [{ action: 'taken', title: '✓ Taken' }],
          data:             { id, name, time },
        });
        resolve();
      }, 5 * 60 * 1000);
    }));
    return;
  }

  // Tap or "Taken" — open/focus the app
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('lasik-meds-tracker') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('./');
    })
  );
});