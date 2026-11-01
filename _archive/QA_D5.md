# QA · LP5 + Tracking D5

## Objectiu
Fer inequívoc que el camí principal de la landing és començar el test, sense perdre la resta de mètriques diagnòstiques.

## Landing
- Primer impacte: `¿No sabes qué comer hoy?`
- Promesa: 4 preguntes → una recepta concreta per avui.
- CTA únic i molt visible: `EMPEZAR EL TEST GRATIS →`.
- Abans del clic no es mostra cap pregunta.
- En clicar el CTA apareix la pregunta 1 de 4 al mateix bloc.
- `Ver las 10 recetas` i `Sorpréndeme` continuen disponibles, però queden com a vies secundàries.
- Un únic element amb `id="startQuiz"`.

## Tracking corregit
Es mantenen:
- `visit`
- `visible_5s`
- `scroll_25`
- `first_action`
- `quiz_start`
- `explore_click`
- `random_click`
- `recommendation_complete`
- `recipe_open`
- `plus_view`
- `checkout_click`

Correccions:
1. `visible_5s`, `scroll_25`, `first_action`, `explore_click` i `random_click` només s'activen a la landing (`#inlineRecommender`). Això evita que Plus o gràcies contaminin les mètriques de landing.
2. `ad=original`, `ad=hoycomobien`, `ad=whatsappstory` i `ad=soso` es conserven a `sessionStorage` durant la navegació, de manera que events posteriors no passen a `unknown` només per haver canviat de pàgina.
3. `ad=` també entra a l'atribució amb consentiment i pot alimentar `client_reference_id` al checkout.
4. El CTA visible registra `first_action` i l'embedded tracking envia un únic `quiz_start`; s'ha eliminat el mecanisme que podia duplicar l'inici.
5. El prefix de sessió de la landing és nou (`studyos_lp5d5_m_`) perquè les proves D4 no bloquegin events D5.

## Worker D5
- Prefix nou: `lp5d5`.
- Una clau KV independent per `dia + anunci + event`.
- Això evita que dos events diferents disparats gairebé alhora (p. ex. `first_action` + `quiz_start`) comparteixin el mateix JSON i se sobreescriguin.
- `/stats` no utilitza `KV.list()`.
- Els 55 comptadors del dashboard es recuperen amb un únic bulk `KV.get(keys)`.
- Dashboard mostra totes les mètriques de funnel i també les accions secundàries.

### Limitació coneguda
Workers KV no és un comptador transaccional/atòmic. Amb trànsit alt, dos increments exactament simultanis del mateix `ad + event` encara podrien col·lidir. A l'escala actual, separar les claus elimina la col·lisió que ens preocupava entre events diferents disparats junts.

## QA executada
- `tracking.js`: sintaxi JS correcta.
- `worker-lp5d5.js`: sintaxi JS correcta.
- 4 scripts inline d'`index.html`: 0 errors de sintaxi.
- 6 scripts inline de `plus.html`: 0 errors de sintaxi.
- 1 script inline de `gracias.html`: 0 errors de sintaxi.
- Worker provat amb KV simulat: `visit`, `visible_5s`, `first_action`, `quiz_start`, `recommendation_complete`, `recipe_open`, `plus_view` i `checkout_click` queden en claus separades i `/stats` els recupera correctament.
- `index.html`, `plus.html` i `gracias.html`: sense referències visibles a PDF ni USD.
