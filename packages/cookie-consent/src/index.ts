"use client";

export * from "./components/cookie-consent";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const COOKIE_CONSENT_KEY = "workspace_cookie_consent";

export type ConsentSettings = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function useCookieConsent(cookieKey = COOKIE_CONSENT_KEY) {
  const [consent, setConsent] = useState<ConsentSettings | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      const value = Cookies.get(cookieKey);
      if (value) {
        try {
          setConsent(JSON.parse(value));
        } catch (e) {
          setConsent(null);
        }
      }
    };

    checkConsent();
    
    // Check every time the cookie might change (e.g. on focus)
    window.addEventListener("focus", checkConsent);
    return () => window.removeEventListener("focus", checkConsent);
  }, [cookieKey]);

  return {
    consent,
    isAccepted: (type: keyof ConsentSettings) => consent?.[type] || false,
  };
}
