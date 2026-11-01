# Stable Manifest — 2026-10-23

## Repository

- Repository: `StudyOS-Oficial/studyos`
- Stable commit: `f4c22a7e6214001dceec2915ee1123cb51dcbe41`
- Backup branch: `backup/stable-2026-10-23`

## Critical IA Fácil paths

### Spanish

- `ia-facil/index.html`
- `ia-facil/track.js`
- `ia-facil/gracias/index.html`
- `ia-facil/curso/index.html`
- `ia-facil/curso/lock.js`
- `ia-facil/curso/lock.json`
- `ia-facil/curso/acceso/`
- `ia-facil/curso/modulo-1/` through `modulo-10/`
- `ia-facil/curso/introduccion/`
- `ia-facil/curso/ahora-que/`
- `ia-facil/curso/herramientas/`
- `ia-facil/curso/kit-prompts/`
- `ia-facil/curso/practica/`
- `ia-facil/curso/repte-final/`
- `ia-facil/curso/certificado/`

### English

- `ia-facil-en/index.html`
- `ia-facil-en/curso/index.html`
- `ia-facil-en/curso/acceso/`
- `ia-facil-en/curso/modulo-1/` through `modulo-10/`

## External dependencies to audit separately

- Stripe live checkout/payment configuration
- Cloudflare payment-verification Worker
- Cloudflare analytics Worker
- Any Vercel/Supabase configuration still used by IA Fácil

These are not fully represented by the Git repository and therefore require an external configuration inventory.

## Security note

Operational passwords and secret values are intentionally not duplicated in this manifest. Recovery documentation should identify where a secret is configured without publishing the secret itself.
