// Compatibilitat: les pàgines antigues del curs poden continuar important aquest mòdul.
import "../../../tracking.js";
import "../../track.js";

export function trackIaFacil(event, extra = {}) {
  return typeof window.iaFacilTrack === "function" ? window.iaFacilTrack(event, extra) : false;
}

window.iaFacilTrack = window.iaFacilTrack || trackIaFacil;
window.iaFacilHasAnalyticsConsent = () => {
  try { return localStorage.getItem("studyos_cookies") === "granted"; } catch { return false; }
};
