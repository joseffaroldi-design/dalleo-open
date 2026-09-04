// Minimal GA4 integration (V1 scope) — loads only when REACT_APP_GA_MEASUREMENT_ID
// is set; otherwise every function is a no-op. SPA page views are sent manually
// (send_page_view disabled) so client-side navigation records exactly one view
// per route. NEVER include PINs, tokens, player names, or form input in params.

const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

let ready = false;

export const initAnalytics = () => {
  if (!MEASUREMENT_ID || ready) return;
  ready = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
};

export const trackPageView = (path) => {
  if (!ready || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
  });
};

export const trackEvent = (name, params = {}) => {
  if (!ready || !window.gtag) return;
  window.gtag("event", name, params);
};
