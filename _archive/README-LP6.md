# LP6d · Autoritat inicial + D8

Aquesta versió manté intacte el funnel LP6c i afegeix **una única modificació visible abans de P1**: una pantalla inicial d’autoritat/prova social basada en dades reals de StudyOS.

## Què canvia
- +200 descàrregues de recursos gratuïts.
- Centenars de converses reals per missatge sobre alimentació i menopausa.
- +100 dones han passat per la comunitat.
- 500 receptes organitzades a Hoy Como Bien.
- CTA únic: `DESCUBRIR QUÉ COMER HOY →`.

La resta es manté: P1–P5, pantalla científica després de P2, recomanació, recepta i presentació de Hoy Como Bien · Completo.

## Tracking nou
El dashboard afegeix `Autoritat → continuar` (`authority_entry_continue`). El funnel queda:

`visit → visible_5s → authority_entry_continue → P1 → P2 → ciència → P3 → P4 → P5 → recommendation → recipe_open → plus_view → checkout`

El Worker usa `const EXPERIMENT = "lp6d_authority_clean";`, de manera que les dades comencen netes i no es barregen amb LP6c.

## Desplegament
1. Substitueix `index.html` i `tracking.js` al GitHub Pages.
2. Desplega `worker-lp6d-d8.js` al mateix Worker actual.
3. Obre `/stats` i comprova que apareix `LP6d · autoritat inicial + quiz · D8`.
4. Fes una prova **sense etiqueta d’anunci** per verificar `Autoritat → continuar`, P1, P2, etc.
5. Quan el QA sigui correcte, deixa el trànsit real.

## Important
No s'han modificat les 10 receptes, la lògica de recomanació, el preu, Stripe ni la presentació visual del producte Completo. Això permet atribuir qualsevol canvi inicial sobretot a la nova pantalla d'autoritat.
