# StudyOS · LP6b direct quiz + D6 tracking

## Què canvia
- La landing ja **no demana clicar “Empezar el test”**: la primera pantalla ja és la pregunta 1.
- Quiz de 4 passos: **moment → necessitat → temps → exclusió**.
- Després de P4 es mostra una **recomanació prèvia** amb un CTA explícit `VER RECETA GRATIS`.
- La fitxa completa de la recepta ja no salta directament a Stripe: el CTA porta a la vista **Hoy Como Bien · Completo**, mantenint la presentació visual de 500 receptes, setmana, nevera, rescat ràpid, etc.
- La resta de la landing i la presentació del producte complet es mantenen.

## Tracking D6
Nou namespace de Worker: `lp6d6`, de manera que els comptadors LP6b comencen nets sense esborrar LP5.

Events agregats:
- `visit`
- `visible_5s`
- `scroll_25`
- `first_action`
- `quiz_start`
- `quiz_q1`
- `quiz_q2`
- `quiz_q3`
- `quiz_q4`
- `recommendation_complete`
- `recommendation_no_match`
- `recipe_open`
- `plus_view`
- `checkout_click`
- `explore_click`
- `random_click`

El dashboard mostra el funnel:
`visita → P1 → P2 → P3 → P4 → recomanació → recepta → Completo → checkout`.

## Desplegament
1. A GitHub Pages, substitueix `index.html` i `tracking.js` pels d'aquesta carpeta.
2. `plus.html` i `gracias.html` són còpies de la versió actual; no cal canviar-les si ja tens exactament aquesta versió publicada.
3. A Cloudflare Worker, substitueix el codi actual pel contingut de `worker-lp6d6.js` i fes Deploy.
4. No cal reiniciar ni esborrar les claus LP5: `lp6d6` usa un namespace diferent.

## QA mínim abans de deixar córrer diners
Amb `?ad=hoycomobien`:
1. Carrega la landing → +1 visita.
2. Espera 5 s → +1 visible ≥5 s.
3. Respon P1 → +1 primera acció, +1 test iniciat, +1 P1.
4. Respon P2 → +1 P2.
5. Respon P3 → +1 P3.
6. Respon P4 → +1 P4 i +1 recomanació mostrada (o `sense coincidència` si la combinació no té match).
7. `VER RECETA GRATIS` → +1 recepta oberta.
8. `Ver Hoy Como Bien · Completo` → +1 Completo vist i s'ha de veure la presentació visual completa.
9. CTA Stripe → +1 checkout.
10. Repetir una vegada amb `?ad=whatsappstory` per validar atribució.

## Nota tècnica
D6 conserva l'arquitectura KV actual: una clau per anunci + event, sense `KV.list()`. Això evita que events diferents se sobreescriguin. L'increment d'una mateixa clau continua sent `GET → PUT`, per tant no és una operació atòmica si dues persones disparen exactament el mateix event al mateix instant. Amb el volum actual és una limitació poc probable, però no s'ha d'interpretar com un comptador matemàticament race-proof.


## LP6b visual
La landing ya no se presenta como una landing tradicional: Home es una experiencia de quiz a pantalla completa, una pregunta por pantalla, tarjetas verticales, barra de progreso y sin bloques promocionales debajo compitiendo con la primera accion. La presentacion visual de Hoy Como Bien Completo se conserva en la vista Completo.
