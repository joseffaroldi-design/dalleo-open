// Minimal service worker — satisfies PWA install criteria so browsers offer
// "Add to Home Screen". It performs NO caching: every request goes straight
// to the network, so live tournament data is always fresh.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
