import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, X } from "lucide-react";

const DISMISS_KEY = "dalleo-install-dismissed-at";
const SNOOZE_DAYS = 30;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

const snoozed = () => {
  const at = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
  return at > 0 && Date.now() - at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
};

// "Add to Home Screen" prompt — Android/Chrome fires beforeinstallprompt and we
// offer a one-tap install; iOS Safari cannot be prompted programmatically, so we
// show short guidance instead. Dismissal snoozes for 30 days; never nags once installed.
export const InstallPrompt = () => {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || snoozed()) return undefined;
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(() => e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    let t;
    if (isIOS()) t = setTimeout(() => setVisible(true), 4000);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferred(null);
  };

  const ios = isIOS();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          data-testid="install-prompt-banner"
          role="dialog"
          aria-label="Add Dalleo Open to your home screen"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-3xl bg-forest-deep p-5 shadow-2xl ring-1 ring-gold/40 sm:bottom-6"
        >
          <button
            type="button"
            onClick={dismiss}
            data-testid="install-prompt-dismiss"
            aria-label="Dismiss install prompt"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-cream/60 transition-colors duration-200 hover:bg-cream/10 hover:text-cream"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-4">
            <img
              src="/apple-touch-icon.png"
              alt=""
              aria-hidden="true"
              className="h-14 w-14 shrink-0 rounded-2xl ring-2 ring-gold/60"
            />
            <div className="min-w-0">
              <p className="font-display text-base italic text-gold-soft">Your clubhouse, one tap away</p>
              <p className="mt-0.5 text-sm font-semibold text-cream/80">
                Add the Dalleo Open for results, tournament history, and future event updates.
              </p>
            </div>
          </div>
          {ios ? (
            <p data-testid="install-prompt-ios-steps" className="mt-4 flex items-center gap-2 rounded-2xl bg-cream/5 px-4 py-3 text-sm font-semibold text-cream/85">
              Tap <Share className="h-4 w-4 text-gold" aria-hidden="true" /> Share, then choose
              <span className="font-bold text-gold">&ldquo;Add to Home Screen&rdquo;</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={install}
              data-testid="install-prompt-action"
              className="mt-4 min-h-11 w-full rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-forest-deep shadow-md transition-[transform,background-color] duration-200 hover:bg-gold-soft active:scale-[0.98]"
            >
              Add to Home Screen
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
