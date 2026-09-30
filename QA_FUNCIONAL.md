# StudyOS+ · QA funcional

He reproduït el problema i l'he corregit.

## Causa principal
Les eines `Crea mi semana`, `¿Qué tengo en la nevera?` i `¿Qué como ahora?` cridaven `readyMinutes()` i `timeLabel()` des d'un mòdul JavaScript diferent. Aquestes funcions no existien en aquell àmbit i el navegador generava `ReferenceError: readyMinutes is not defined`.

## Correccions
- Helpers de temps definits dins del mòdul que els utilitza.
- Navegació corregida perquè Hoy / Explorar / Favoritas / Plan / eines no deixin dues vistes obertes alhora.
- `Crea mi semana`: 21 menjars generats correctament.
- El límit de temps del planificador ara és un filtre real.
- `Frutos secos / cacahuete` és coherent també al planificador.
- `Sorpréndeme` ja no ignora filtres o exclusions si no hi ha resultats.
- Correcció de 4 metadades d'al·lèrgens clarament falses.
- Accés a Plan set directament perquè no depengui d'un listener fràgil.

## Smoke test real en Chromium
- Quiz complet: OK
- Crea mi semana: 21 menjars: OK
- Llista de la compra: OK
- Canviar una recepta: OK
- Navegació a Hoy: OK
- Nevera: 8 resultats amb prova `salmón, quinoa`: OK
- ¿Qué como ahora?: 3 resultats: OK
- Explorar: 500 receptes: OK
- Filtre ≤15 min: 202 receptes: OK
- Plan setmanal: OK
- Menús / Lista / Batch / Sustituciones: OK
- Errors JavaScript durant el test: 0
