# PAS 3 · Funnel de compra — QA

## Flux revisat
Landing → oferta completa → Stripe → `gracias.html` → `plus.html`.

## Coherència comercial
- Preu: **5 €**.
- Model: **pagament únic, sense subscripció**.
- Producte públic: **Hoy Como Bien · Completo**.
- Catàleg interactiu: **500 receptes**.
- USD/US$ a la landing: **0**.
- La postcompra ja no diu 100 receptes ni presenta el PDF com el producte principal.

## Postcompra
El CTA principal és ara **Abrir Hoy Como Bien** → `plus.html`.
El PDF queda com a complement secundari.
La pàgina mostra les funcions reals: 500 receptes, recomanador, setmana, llista orientativa, ingredients i opció ràpida.

## Tracking
- `begin_checkout` continua disparant-se abans d'anar a Stripe.
- `purchase` es dispara a `gracias.html` només si hi ha un `session_id` amb prefix `cs_`, consentiment i no s'havia enviat ja al navegador.
- El paràmetre `ad=` ara també es conserva en l'atribució consentida. Per exemple `ad=whatsappstory` pot arribar a `client_reference_id=ad-whatsappstory` i mantenir-se als paràmetres d'analítica.
- L'identificador intern del producte es manté com `studyos-plus` per continuïtat de dades; el nom públic passa a `Hoy Como Bien · Completo`.

## Configuració necessària a Stripe
El codi no pot configurar el Payment Link des de GitHub. A Stripe, la redirecció després del pagament ha d'apuntar exactament a:

`https://studyos-oficial.github.io/studyos/gracias.html?session_id={CHECKOUT_SESSION_ID}`

Això és necessari perquè el navegador tingui el `session_id` que usa el tracking de compra.

## Limitació coneguda
Com que GitHub Pages és estàtic, `plus.html` continua sent una URL pública si algú la coneix. `session_id` serveix per tracking de postcompra; **no és un control d'accés ni valida el pagament al servidor**.

## Smoke test en navegador (sense tocar analítica real)
He executat el funnel en Chromium amb les crides externes neutralitzades:
- Landing → secció completa: **OK**.
- Clic de checkout: **OK**.
- Amb `ad=whatsappstory`, l'enllaç de Stripe queda com `...?client_reference_id=ad-whatsappstory`: **OK**.
- `gracias.html`: CTA principal `Abrir Hoy Como Bien` → `plus.html`: **OK**.
- Càrrega del premium: **OK**.
- Errors JavaScript durant la prova: **0**.
