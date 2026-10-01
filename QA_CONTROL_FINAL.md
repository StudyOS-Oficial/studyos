# Hoy Como Bien / StudyOS — CONTROL FINAL LANDING + PREMIUM

## Errors importants detectats i corregits

### 1. El recomanador de la landing podia ignorar el moment triat
El moment del dia formava part de la puntuació, però no era una restricció. Això podia acabar recomanant una recepta d'un altre moment del dia.

Ara el moment és una restricció dura: si l'usuari tria Cena, només competeixen receptes etiquetades com a cena. Les exclusions també continuen sent dures.

QA actual: **0 recomanacions que violin moment/exclusió**.

Amb només 10 receptes hi ha algunes combinacions sense resultat (sobretot Snack + exclusió de fruits secs). En aquests casos la landing mostra que no hi ha una coincidència segura en lloc de forçar una recepta incompatible.

### 2. El premium tenia el mateix problema conceptual
Ara el recomanador principal del premium també filtra el moment abans de puntuar la resta de criteris.

QA amb fase × necessitat × moment × exclusions individuals:
- violacions de moment/exclusió: **0**
- combinacions sense cap recepta premium: **0**

### 3. La landing i el premium no tenien exactament el mateix contingut
Les 10 receptes gratuïtes encara conservaven bios i noms antics. Les he sincronitzat amb les versions revisades del premium.

També:
- `El porqué biológico` → `Qué aporta esta receta`
- s'han eliminat els textos antics amb promeses fisiològiques massa fortes
- la classificació per etapa queda presentada com a orientativa

### 4. El resultat podia mostrar un moment diferent del triat
Una recepta etiquetada com Comida + Cena podia aparèixer com “Comida” encara que l'usuari hagués triat Cena. Ara el resultat reflecteix el moment seleccionat.

### 5. Tracking
`Primera acció` comptava també clics del banner de cookies. A més, el botó intern del quiz podia provocar risc de doble comptatge.

Ara:
- cookies no compten com `first_action`
- només les interaccions reals amb el producte compten
- els clics sintètics no compten
- l'inici del test queda registrat una sola vegada

Prova directa: càrrega → `visit`; acceptar cookies → cap `first_action`; triar Cena → `first_action` + un únic inici del test.

### 6. EUR / USD
- USD / US$: **0**
- preu: **5 €**
- pagament únic / sense subscripció: mantingut

## Integritat del premium
- receptes: **500**
- IDs únics: **500**
- títols únics: **500**
- mínim de passos a les receptes 101–500: **4**
- longitud mitjana preparació 101–500: **563.2 caràcters**

## Smoke test real en Chromium

### Landing
- home: OK
- 4 botons inicials: OK
- qüestionari inline: OK
- resultat: OK
- exemple de resultat: `Tartar de Atún, Mango y Aguacate`
- meta del resultat: `Cena | 10 min | Media | 420 kcal aprox.`
- Explorar: 10 receptes
- cerca `salmón`: 1 resultat
- errors JS: 0

### Premium
- home: OK
- qüestionari: OK
- resultat: OK
- la recepta respecta Cena: True
- Ingredients / Preparación: OK
- Favoritas: OK
- ¿Qué como ahora?: 3 resultats
- Nevera: 8 resultats en la prova
- Crea mi semana: 21 menjars
- lista de la compra: OK
- canviar recepta: OK
- Explorar: 500 receptes
- sopars filtrats: 193
- sopars ≤15 min: 46
- Menús / Lista / Batch / Sustituciones: OK
- errors JS: 0

## Límit que continua existint
GitHub Pages és estàtic. `plus.html` continua sent una URL pública si algú la coneix; aquest control no crea una autorització real de compra.

## Desplegament recomanat
1. `index.html`
2. `plus.html`
3. `tracking.js`
4. `worker-lp4d3-reset.js` per començar una sèrie neta, ja que ha canviat la definició de `first_action`.

Les dades antigues no s'esborren: el Worker nou utilitza el prefix `lp4d3`.
