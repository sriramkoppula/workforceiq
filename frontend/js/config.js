/**
 * WorkforceIQ — API Configuration
 *
 * This file is loaded FIRST on every HTML page (before any other JS).
 * It detects whether the app is running locally or on the production
 * Cloudflare Pages host, and sets the API base URL accordingly.
 *
 * HOW TO UPDATE FOR PRODUCTION:
 *   Replace the PRODUCTION_API_URL value with your Render backend URL
 *   after deployment (e.g., "https://workforceiq-backend.onrender.com").
 *
 * LOCAL DEV:
 *   When you open any page on localhost / 127.0.0.1 / file://, it
 *   automatically falls back to http://localhost:8080.
 */

(function () {
  "use strict";

  // ── Production backend URL (update this after Render deployment) ────────────

  var PRODUCTION_API_URL = "https://workforceiq-0r6o.onrender.com";

  // ── Local dev fallback ──────────────────────────────────────────────────────
  var LOCAL_API_URL = "http://localhost:8080";

  // ── Detection: is this running locally? ────────────────────────────────────
  var hostname = window.location.hostname;
  var isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "" ||          // file:// protocol
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.");

  // ── Set global so every page's JS can read it ──────────────────────────────
  window.WIQ_API = isLocal ? LOCAL_API_URL : PRODUCTION_API_URL;

  // Backwards-compat alias used by some older page scripts
  window.API_URL  = window.WIQ_API + "/api";
  window.API_BASE = window.WIQ_API + "/api";

  if (isLocal) {
    console.info("[WorkforceIQ] Using LOCAL backend:", window.WIQ_API);
  } else {
    console.info("[WorkforceIQ] Using PRODUCTION backend:", window.WIQ_API);
  }
})();
