import { useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

// App IDs
const APP_PACKAGE = "com.ourbride.app";
const IOS_APP_ID = "6747453812";
const APP_SUBDOMAIN = "app.our-bride.com";
const MAIN_DOMAIN = "our-bride.com";

const ua = navigator.userAgent || "";
const isAndroid = /Android/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isMobile = isAndroid || isIOS;
const isFacebook = /\bFBAN|FBAV|FBIOS|FB_IAB\b/i.test(ua);
const isInstagram = /\bInstagram\b/i.test(ua);
const isTikTok = /\bTTWebView\b/i.test(ua);
const isInAppBrowser = isFacebook || isInstagram || isTikTok;

function playStoreUrl() {
    return `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`;
}

function appStoreUrl() {
    return `https://apps.apple.com/app/id${IOS_APP_ID}`;
}

export default function DeepLinkRedirect() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const fallbackTimer = useRef(null);
    const canceled = useRef(false);

    useEffect(() => {
        canceled.current = false;

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

        const cleanup = () => {
            if (fallbackTimer.current) {
                window.clearTimeout(fallbackTimer.current);
                fallbackTimer.current = null;
            }
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("pagehide", onPageHide);
        };

        // Get current path and build full URL
        const currentPath = window.location.pathname;
        const queryString = searchParams.toString();

        // Build URL on app subdomain for universal links (iOS requires exact domain match)
        const fullUrl = `https://${APP_SUBDOMAIN}${currentPath}${queryString ? `?${queryString}` : ""}`;
        const attemptKeySuffix = `${currentPath}${queryString ? `?${queryString}` : ""}`;
        const attemptKey = `deeplink:lastAttempt:${attemptKeySuffix}`;
        const attemptCooldownMs = 2000;
        let lastAttempt = 0;

        try {
            lastAttempt = Number(sessionStorage.getItem(attemptKey) || 0);
        } catch {
            lastAttempt = 0;
        }

        const shouldAttemptUniversalLink = Date.now() - lastAttempt > attemptCooldownMs;
        const recordAttempt = () => {
            try {
                sessionStorage.setItem(attemptKey, String(Date.now()));
            } catch {
                // sessionStorage might be unavailable (Safari private mode), ignore
            }
        };

        // Detect current subdomain
        const currentSubdomain = window.location.hostname;
        const isAppSubdomain = currentSubdomain === APP_SUBDOMAIN;

        // If we're on the app subdomain, handle differently
        if (isAppSubdomain) {
            // On app subdomain, prioritize app opening
            if (isMobile && !isInAppBrowser) {
                document.addEventListener("visibilitychange", onVisibilityChange);
                window.addEventListener("pagehide", onPageHide);

                if (isAndroid) {
                    if (shouldAttemptUniversalLink) {
                        recordAttempt();
                        window.location.href = fullUrl; // try Universal Link first
                    }
                    fallbackTimer.current = window.setTimeout(() => {
                        if (!canceled.current) window.location.href = playStoreUrl();
                    }, 800); // Fast timeout for Android
                    return cleanup;
                }

                if (isIOS) {
                    if (shouldAttemptUniversalLink) {
                        recordAttempt();
                        // Try to open app via Universal Link
                        window.location.href = fullUrl;
                    }

                    // iOS Universal Links - quick redirect if app doesn't open
                    fallbackTimer.current = window.setTimeout(() => {
                        if (!canceled.current) {
                            // If we're still visible, app didn't open
                            if (document.visibilityState === 'visible') {
                                window.location.href = appStoreUrl();
                            }
                        }
                    }, 1000); // Fast timeout for iOS (was 1500ms)
                    return cleanup;
                }
            }

            // For desktop or in-app browsers on app subdomain, redirect to main domain
            const mainDomainUrl = `https://www.${MAIN_DOMAIN}${currentPath}${queryString ? `?${queryString}` : ""}`;
            window.location.replace(mainDomainUrl);
            return cleanup;
        }

        // Main domain or other subdomain handling
        // Redirect to app subdomain for Universal Links to work
        if (isMobile && !isInAppBrowser) {
            document.addEventListener("visibilitychange", onVisibilityChange);
            window.addEventListener("pagehide", onPageHide);

            if (isAndroid) {
                // Redirect to app subdomain first, then try Universal Link
                window.location.href = fullUrl;
                fallbackTimer.current = window.setTimeout(() => {
                    if (!canceled.current) {
                        window.location.href = playStoreUrl();
                    }
                }, 800); // Fast timeout for Android (was 1200ms)
                return cleanup;
            }

            if (isIOS) {
                // Redirect to app subdomain for Universal Links
                window.location.href = fullUrl;
                fallbackTimer.current = window.setTimeout(() => {
                    if (!canceled.current) {
                        // If still visible, redirect to App Store
                        if (document.visibilityState === 'visible') {
                            window.location.href = appStoreUrl();
                        }
                    }
                }, 1000); // Fast timeout for iOS from main domain (was 1500ms)
                return cleanup;
            }
        }

        // Desktop or in-app browser - redirect to main domain
        if (!isMobile || isInAppBrowser) {
            navigate("/", { replace: true });
            return cleanup;
        }

        navigate("/", { replace: true });

        return cleanup;
    }, [params, searchParams, navigate]);

    return (
        <div className="deeplink-loading">
            <div className="deeplink-loading-background">
                <div className="deeplink-loading-gradient"></div>
                <div className="deeplink-loading-particles">
                    <div className="deeplink-particle deeplink-particle-1"></div>
                    <div className="deeplink-particle deeplink-particle-2"></div>
                    <div className="deeplink-particle deeplink-particle-3"></div>
                    <div className="deeplink-particle deeplink-particle-4"></div>
                    <div className="deeplink-particle deeplink-particle-5"></div>
                </div>
            </div>
            <div className="deeplink-loading-content">
                <div className="deeplink-loading-logo">
                    <i className="fas fa-heart"></i>
                </div>
                <div className="deeplink-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <h2 className="deeplink-loading-title">
                    Opening <span className="deeplink-text-gradient">OurBride</span>
                </h2>
                <p className="deeplink-loading-text">Please wait while we open the app...</p>
            </div>
            <style>{`
                .deeplink-loading {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    overflow: hidden;
                }

                .deeplink-loading-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
                    z-index: 1;
                }

                .deeplink-loading-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 30% 20%, rgba(241, 72, 54, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(241, 72, 54, 0.1) 0%, transparent 50%);
                }

                .deeplink-loading-particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .deeplink-particle {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(241, 72, 54, 0.3) 0%, rgba(241, 72, 54, 0.1) 100%);
                    animation: deeplink-float 8s ease-in-out infinite;
                }

                .deeplink-particle-1 {
                    width: 120px;
                    height: 120px;
                    top: 15%;
                    right: 15%;
                    animation-delay: 0s;
                }

                .deeplink-particle-2 {
                    width: 80px;
                    height: 80px;
                    top: 60%;
                    left: 10%;
                    animation-delay: 2s;
                }

                .deeplink-particle-3 {
                    width: 100px;
                    height: 100px;
                    bottom: 20%;
                    right: 30%;
                    animation-delay: 4s;
                }

                .deeplink-particle-4 {
                    width: 60px;
                    height: 60px;
                    top: 30%;
                    left: 50%;
                    animation-delay: 1s;
                }

                .deeplink-particle-5 {
                    width: 90px;
                    height: 90px;
                    bottom: 30%;
                    left: 20%;
                    animation-delay: 3s;
                }

                @keyframes deeplink-float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateY(-30px) translateX(20px);
                        opacity: 0.8;
                    }
                }

                .deeplink-loading-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    padding: 40px;
                }

                .deeplink-loading-logo {
                    font-size: 64px;
                    color: var(--main);
                    margin-bottom: 30px;
                    animation: deeplink-pulse 2s ease-in-out infinite;
                }

                @keyframes deeplink-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }

                .deeplink-loading-spinner {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 30px;
                }

                .spinner-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 4px solid transparent;
                    border-top-color: var(--main);
                    border-radius: 50%;
                    animation: deeplink-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                }

                .spinner-ring:nth-child(1) {
                    animation-delay: -0.45s;
                    border-top-color: #ff6b6b;
                }

                .spinner-ring:nth-child(2) {
                    animation-delay: -0.3s;
                    border-top-color: var(--main);
                    width: 70%;
                    height: 70%;
                    top: 15%;
                    left: 15%;
                }

                .spinner-ring:nth-child(3) {
                    animation-delay: -0.15s;
                    border-top-color: #d63d2e;
                    width: 40%;
                    height: 40%;
                    top: 30%;
                    left: 30%;
                }

                @keyframes deeplink-spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                .deeplink-loading-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 16px;
                    line-height: 1.2;
                    letter-spacing: -1px;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    font-family: 'Nunito', sans-serif;
                }

                .deeplink-text-gradient {
                    background: linear-gradient(135deg, #ff6b6b 0%, #f14836 50%, #d63d2e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                    display: inline-block;
                }

                .deeplink-text-gradient::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(135deg, #ff6b6b 0%, #f14836 50%, #d63d2e 100%);
                    border-radius: 2px;
                }

                .deeplink-loading-text {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 400;
                    margin-top: 10px;
                    font-family: 'Nunito', sans-serif;
                }

                @media (max-width: 768px) {
                    .deeplink-loading-title {
                        font-size: 2rem;
                    }

                    .deeplink-loading-logo {
                        font-size: 48px;
                        margin-bottom: 20px;
                    }

                    .deeplink-loading-spinner {
                        width: 60px;
                        height: 60px;
                        margin-bottom: 20px;
                    }

                    .deeplink-loading-text {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
