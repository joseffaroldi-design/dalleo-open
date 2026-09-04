// Minimal service worker — presence satisfies PWA install criteria so browsers
// offer "Add to Home Screen". It intentionally has NO fetch handler: an empty
// fetch listener hijacks navigation requests in some browsers and can blank the
// page on repeat visits. Without one, every request goes straight to the network,
// so live tournament data is always fresh.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
