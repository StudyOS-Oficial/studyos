# IA fácil: ruta de acceso del curso nuevo

Esta rama prepara la ruta aislada `/ia-facil/curso-nuevo/`. Reutiliza el contenido del curso actual mediante rewrites; no copia ni altera las lecciones. La ruta antigua `/ia-facil/curso/` y el acceso actual de la clienta no se protegen ni cambian.

## Variables de entorno de Vercel

Añadirlas como variables server-only (nunca con prefijo `NEXT_PUBLIC_`) y como Secrets cuando corresponda. No guardarlas en el repositorio ni compartir sus valores por chat.

### Preview de esta rama (modo sandbox)

- `STRIPE_SECRET_KEY`: clave restringida o secreta de Stripe Test con permiso de lectura de Checkout Sessions.
- `STRIPE_COURSE_PAYMENT_LINK_ID`: ID `plink_...` del Payment Link Test del curso.
- `ACCESS_COOKIE_SECRET`: valor aleatorio de al menos 32 caracteres, distinto por entorno.
- `ENFORCE_NEW_COURSE_ACCESS`: `true`.

Limitar las variables de Preview a la rama `live/ia-facil-course-access` si Vercel permite seleccionar una rama. El endpoint rechaza claves `sk_live_` y sesiones `cs_live_` en Preview.

### Production (solo después de revisión y autorización de lanzamiento)

- `STRIPE_SECRET_KEY`: clave Live con permiso de lectura de Checkout Sessions.
- `STRIPE_COURSE_PAYMENT_LINK_ID`: ID `plink_...` del Payment Link Live del curso.
- `ACCESS_COOKIE_SECRET`: secreto aleatorio de al menos 32 caracteres, diferente al de Preview.
- `ENFORCE_NEW_COURSE_ACCESS`: `true`.

El endpoint rechaza claves `sk_test_` y sesiones `cs_test_` en Production. No habilitar estas variables en Production hasta revisar el candidato y acordar el cambio del destino de éxito del Payment Link.

## Validación del flujo

El Payment Link de cada entorno debe redirigir al completar el pago a:

`https://<dominio-del-entorno>/ia-facil/curso-nuevo/entrar?session_id={CHECKOUT_SESSION_ID}`

La validación requiere una Checkout Session pagada, `mode=payment`, `livemode` coherente con el entorno y coincidencia exacta de `payment_link`. La cookie dura 30 días, está firmada con HMAC-SHA256 y usa HttpOnly, Secure, SameSite=Lax y Path=/.

## Límite conocido

La ruta antigua sigue abierta por decisión de transición. Esta ruta protege el acceso nuevo ofrecido a compradores, pero el contenido también puede consultarse desde la URL antigua. No cambiar el Payment Link, precios, recetas ni la configuración de Production como parte de esta rama.
