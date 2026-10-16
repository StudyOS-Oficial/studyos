// Compatibilidad con páginas antiguas del curso.
// El curso usa únicamente la analítica de ia-facil/track.js, sin cookies ni identificadores.
import "../../track.js";

export function trackIaFacil(event, extra = {}) {
  return typeof window.iaFacilTrack === "function" ? window.iaFacilTrack(event, extra) : false;
}

window.iaFacilTrack = window.iaFacilTrack || trackIaFacil;
window.iaFacilHasAnalyticsConsent = () => true;
