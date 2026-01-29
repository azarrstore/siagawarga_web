import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "./firebase";

export function initAppCheck() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY as string | undefined;
  if (!siteKey) {
    // Biar dev tidak error kalau belum isi env
    console.warn("App Check: missing VITE_RECAPTCHA_V3_SITE_KEY (skip).");
    return;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true
  });
}
