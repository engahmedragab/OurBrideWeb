import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// App IDs
const APP_PACKAGE = "com.ourbride.app";
const IOS_APP_ID = "6747453812"; // OurBride App Store ID

// Domain configuration
const MAIN_DOMAIN = "our-bride.com";
const APP_SUBDOMAIN = "app.our-bride.com";

const ua = navigator.userAgent || "";
const isAndroid = /Android/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isMobile = isAndroid || isIOS;
const isFacebook = /\bFBAN|FBAV|FBIOS|FB_IAB\b/i.test(ua);
const isInstagram = /\bInstagram\b/i.test(ua);
const isTikTok = /\bTTWebView\b/i.test(ua);
const isInAppBrowser = isFacebook || isInstagram || isTikTok;

// Detect current subdomain
const getCurrentSubdomain = () => {
  const hostname = window.location.hostname;
  if (hostname === APP_SUBDOMAIN) return "app";
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) return "main";
  return "other";
};

function playStoreUrl(referrerParams) {
  const base = `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`;
  return referrerParams ? `${base}&referrer=${encodeURIComponent(referrerParams)}` : base;
}

function appStoreUrl() {
  return `https://apps.apple.com/app/id${IOS_APP_ID}`;
}

export default function DeepLinkHandler() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const fallbackTimer = useRef(null);
  const canceled = useRef(false);

  useEffect(() => {
    const onPageHide = () => {
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
      }
      canceled.current = true;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (fallbackTimer.current) {
          window.clearTimeout(fallbackTimer.current);
          fallbackTimer.current = null;
        }
        canceled.current = true;
      }
    };

    (async () => {
      try {
        const res = await axios.get(`/api/v1/deep-links/${shortCode}`, { withCredentials: true });
        const { fullUrl } = res.data;

        const url = new URL(fullUrl);
        const path = url.pathname;
        const qs = url.searchParams;
        const qsString = qs.toString();

        const referralCode = qs.get("referralCode");
        const source = qs.get("source");
        const sourceId = qs.get("sourceId");

        if (referralCode) localStorage.setItem("referralCode", referralCode);
        if (source) localStorage.setItem("referralSource", source);
        if (sourceId) localStorage.setItem("referralSourceId", sourceId);

        // Get current subdomain
        const currentSubdomain = getCurrentSubdomain();

        // SPA-owned routes
        const isSpa = path.startsWith("/app") || path.startsWith("/web");
        if (isSpa) {
          navigate(path + (qsString ? `?${qsString}` : ""), { replace: true });
          return;
        }

        // If we're on the app subdomain, handle differently
        if (currentSubdomain === "app") {
          // On app subdomain, prioritize app opening
          if (isMobile && !isInAppBrowser) {
            if (isAndroid) {
              window.location.href = fullUrl; // try Universal Link first
              fallbackTimer.current = window.setTimeout(() => {
                if (!canceled.current) window.location.href = playStoreUrl(qsString);
              }, 500); // shorter timeout for app subdomain
              return;
            }

            if (isIOS) {
              window.location.href = fullUrl; // try Universal Link
              fallbackTimer.current = window.setTimeout(() => {
                if (!canceled.current) window.location.href = appStoreUrl();
              }, 800); // shorter timeout for app subdomain
              return;
            }
          }

          // For desktop or in-app browsers on app subdomain, redirect to main domain
          const mainDomainUrl = `https://www.${MAIN_DOMAIN}${path}${qsString ? `?${qsString}` : ""}`;
          window.location.replace(mainDomainUrl);
          return;
        }

        // Main domain or other subdomain handling (original logic)
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("pagehide", onPageHide);

        if (!isMobile || isInAppBrowser) { // web landing in in-app browsers/desktop
          window.location.replace(fullUrl);
          return;
        }

        if (isAndroid) {
          window.location.href = fullUrl; // try Universal Link first
          fallbackTimer.current = window.setTimeout(() => {
            if (!canceled.current) window.location.href = playStoreUrl(qsString);
          }, 900);
          return;
        }

        if (isIOS) {
          window.location.href = fullUrl; // try Universal Link
          fallbackTimer.current = window.setTimeout(() => {
            if (!canceled.current) window.location.href = appStoreUrl();
          }, 1200);
          return;
        }

        window.location.replace(fullUrl);
      } catch (error) {
        // Deep link error handled silently
        navigate("/", { replace: true });
      }
    })();

    return () => {
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current);
      }
      // Clean up event listeners
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [shortCode, navigate]);

  return <p>Redirecting…</p>;
}
