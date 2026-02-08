self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  self.clients.claim();
});
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Notification', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'BCVWorld';
  const body = data.body || '';
  const icon = data.icon || '/assets/images/icon-192x192.webp';
  const badge = data.badge || '/assets/images/favicon-96x96.webp';
  const tag = data.tag || 'bcvworld';
  const url = data.url || '/';
  const actions = data.actions || [{ action: 'open', title: 'Open' }];
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
      actions,
      requireInteraction: data.requireInteraction || false,
      silent: !!data.silent
    })
  );
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url.includes(url) && 'focus' in client) {
          client.focus();
          return true;
        }
        return false;
      });
      if (!hadWindow && self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
