// Compatibilidad: páginas antiguas del curso.
// El curso usa exclusivamente la analítica anónima de IA fácil, sin cookies.
import "../../track.js";

export function trackIaFacil(event, extra = {}) {
  return typeof window.iaFacilTrack === "function" ? window.iaFacilTrack(event, extra) : false;
}

window.iaFacilTrack = window.iaFacilTrack || trackIaFacil;
window.iaFacilHasAnalyticsConsent = () => true;
