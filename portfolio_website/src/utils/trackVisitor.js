/**
 * Silent Portfolio Visitor Tracker
 * 
 * - Tracks visits completely silently in the background (no popups, alerts, or sounds).
 * - Invisible to the visitor.
 * - Deduplicates per session (sessionStorage) so page refreshes/navigation don't spam.
 * - Ignores localhost visits by default so editing code locally doesn't send emails.
 *   (To test locally, add ?testVisit=true to the URL: http://localhost:3000/?testVisit=true)
 * - Gathers detailed visitor context: Location (Country/City), Device, Browser, OS, 
 *   Screen size, Referrer, and Timestamp.
 * - Delivers to your email (tobygrey216@gmail.com) via your backend or direct fallback.
 */

const SESSION_TRACK_KEY = "portfolio_visitor_session_logged";
const VISITOR_ALERT_EMAIL = "tobygrey216@gmail.com";
const DEFAULT_BACKEND_URL = "https://portfolio-cwjm.onrender.com";

// Detect device category
const getDeviceType = () => {
  const ua = navigator.userAgent || "";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
};

// Detect Operating System
const getOS = () => {
  const ua = navigator.userAgent || "";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown OS";
};

// Detect Browser
const getBrowser = () => {
  const ua = navigator.userAgent || "";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera\//i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return "Browser";
};

/**
 * Main tracking function
 */
export const trackVisitor = async () => {
  try {
    // 1. Session deduplication - only notify once per visitor session
    if (sessionStorage.getItem(SESSION_TRACK_KEY)) {
      return;
    }

    // 2. Check if running on localhost / development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";
    const isTestMode =
      new URLSearchParams(window.location.search).get("testVisit") === "true";

    if (isLocalhost && !isTestMode) {
      // In dev mode, keep inbox clean. To test on localhost, use ?testVisit=true
      return;
    }

    // Mark session as tracked right away to prevent race conditions
    sessionStorage.setItem(SESSION_TRACK_KEY, new Date().toISOString());

    // 3. Collect client-side metadata
    const deviceType = getDeviceType();
    const os = getOS();
    const browser = getBrowser();
    const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
    const viewport = `${window.innerWidth || 0}x${window.innerHeight || 0}`;
    const referrer = document.referrer ? document.referrer : "Direct visit / Bookmark";
    const pageUrl = window.location.href;
    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Timezone";
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    // 4. Fetch silent geolocation (with a quick 1.8s timeout so it never hangs)
    let geo = {
      ip: "Unknown",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      countryCode: "",
      isp: "",
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const geoRes = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (geoRes.ok) {
        const data = await geoRes.json();
        geo = {
          ip: data.ip || "Unknown",
          city: data.city || "Unknown City",
          region: data.region || "",
          country: data.country_name || "Unknown Country",
          countryCode: data.country_code || "",
          isp: data.org || "",
        };
      }
    } catch (_) {
      // Geolocation lookup blocked or timed out; proceed with available data
    }

    const payload = {
      city: geo.city,
      country: geo.country,
      region: geo.region,
      countryCode: geo.countryCode,
      ip: geo.ip,
      isp: geo.isp,
      deviceType,
      os,
      browser,
      screenResolution,
      viewport,
      referrer,
      pageUrl,
      timeZone,
      timestamp,
    };

    // 5. Try custom backend first (/visit)
    let backendUrl = process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL;
    // Normalize backend URL to hit /visit endpoint
    if (backendUrl.endsWith("/send")) {
      backendUrl = backendUrl.replace(/\/send$/, "/visit");
    } else if (!backendUrl.endsWith("/visit")) {
      backendUrl = backendUrl.replace(/\/$/, "") + "/visit";
    }

    let sentViaBackend = false;
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json();
        // Check if backend successfully sent email or merely logged
        if (resData && resData.success && !resData.note) {
          sentViaBackend = true;
        }
      }
    } catch (_) {
      sentViaBackend = false;
    }

    // 6. Direct fallback via FormSubmit if backend is sleeping or credentials not set
    // This guarantees you ALWAYS receive an email at tobygrey216@gmail.com
    if (!sentViaBackend) {
      const locationSummary = [geo.city, geo.region, geo.country]
        .filter(Boolean)
        .join(", ");
      const flagOrMarker = geo.countryCode ? `[${geo.countryCode}] ` : "";

      await fetch(`https://formsubmit.co/ajax/${VISITOR_ALERT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `🔔 [Portfolio Visit] ${flagOrMarker}${locationSummary || "New Visitor"} (${deviceType})`,
          "Visitor Location": locationSummary || "Not detected",
          "Device Info": `${deviceType} • ${os} • ${browser}`,
          "Screen & Viewport": `${screenResolution} (Viewport: ${viewport})`,
          "Referrer Source": referrer,
          "Page Visited": pageUrl,
          "Time & Timezone": `${timestamp} (${timeZone})`,
          "IP & Provider": `${geo.ip} ${geo.isp ? `(${geo.isp})` : ""}`,
          _template: "table",
          _captcha: "false",
        }),
      });
    }
  } catch (_) {
    // Total silence: never throw, never show anything in UI
  }
};
