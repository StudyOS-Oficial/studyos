# IA Fácil — Stable Backup — 2026-10-23

## Purpose

This folder records the last verified stable state of IA Fácil.

This is a **recovery record**, not a replacement for Git history. The exact complete repository state is preserved by Git at commit:

- Stable commit: `f4c22a7e6214001dceec2915ee1123cb51dcbe41`
- Backup branch: `backup/stable-2026-10-23`

If a future change breaks the product, this commit is the first recovery point.

## Verified state

- Spanish course protection: working.
- Spanish course password: operationally verified as `IAfacil2026`.
- English course protection: working.
- English course password: operationally verified as `easyAIcourse`.
- English password change was isolated to `ia-facil-en/curso/index.html`.
- Spanish encrypted protection is a matched system: `index.html` + `lock.js` + `lock.json` must be treated as one unit.
- Stripe Payment Link was not changed.
- Cloudflare Workers were not modified by the GitHub changes recorded in this stabilization cycle.

## Recovery rule

Do not overwrite a working protection file with an older/newer version unless the complete protection set has been checked for compatibility.

For Spanish, treat these as an inseparable set:

`ia-facil/curso/index.html`
`ia-facil/curso/lock.js`
`ia-facil/curso/lock.json`

## Next backup rule

After a change is made and the live system is tested successfully:

1. Record the new commit SHA.
2. Create a new dated backup branch.
3. Add a new dated backup folder with the manifest and incident log update.
4. Only then consider the new state the stable baseline.
