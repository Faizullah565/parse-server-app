// Listen for the install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed');
  // Force waiting SW to become active immediately
  self.skipWaiting();
});
// Listen for the activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
  return self.clients.claim();
});

// Listen for fetch events (optional, useful for caching later)
self.addEventListener('fetch', (event) => {
  // You can handle caching or custom responses here
  // console.log('[Service Worker] Fetching:', event.request.url);
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  let data = { title: 'New Notification', body: 'You have a new message!', url: '/' };

  if (event.data) {
    data = event.data.json(); // Receive payload from backend
  }

  const options = {
    body: data.body,
    icon: '/icon.png', // optional: add your app icon in public folder
    badge: '/badge.png', // optional: small badge
    data: { url: data.url }, // pass a URL to open when clicked
  };
  console.log("🚀 ~ options:", options)

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  const url = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});