# IA Fácil — Incident & Learning Log

This log records failures, root causes, fixes and prevention rules. It is intended to prevent repeating the same mistake.

---

## 2026-10-23 — Spanish course stopped unlocking

### Symptom

The Spanish IA Fácil course stopped unlocking with the known password after protection files had been changed.

### Root cause

The encrypted course payload and the `lock.json` protection data were no longer cryptographically compatible. The payload itself was not the problem; the lock/key material had been changed independently.

### Diagnosis

The known-good Spanish protection set from the stable history was cryptographically checked. The known-good `lock.json` decrypted successfully with the operational password and produced the expected course key. The later lock did not.

### Fix

The compatible Spanish protection state was restored:

- `ia-facil/curso/index.html`
- `ia-facil/curso/lock.js`
- `ia-facil/curso/lock.json`

The current course was then tested and confirmed working.

### Prevention rule

**Never change `lock.json`, `lock.js` or the encrypted payload independently.** Any regeneration of the Spanish protection must regenerate and validate the complete set together.

---

## 2026-10-23 — English course password

### Symptom

The English course used a different password hash from the intended English password.

### Root cause

The gate compared the SHA-256 hash of the old password.

### Fix

Only the expected hash in `ia-facil-en/curso/index.html` was replaced with the SHA-256 hash of the intended English password.

### Verification

The English course was tested and confirmed working.

### Prevention rule

For the English gate, password changes must be made only after calculating the exact SHA-256 value and verifying the live gate afterwards. Case matters.

---

## 2026-10-23 — Thanks-page delivery dependency

### Observation

The Spanish thanks page obtains the course password from the external payment-verification Worker rather than hardcoding it in the repository. The English thanks page currently does not have the same automated delivery page.

### Decision

Do not modify the working payment/protection infrastructure merely to make the documentation symmetrical. If automated delivery fails, manual password delivery remains the fallback while the automated flow can be repaired separately.

### Prevention rule

Keep payment verification, course protection and analytics as separate systems. A change in one must not be assumed to modify or repair another.

---

## General operating rule

**Stable first, change second.**

Every future functional change should follow:

1. Inspect current state.
2. Create/confirm a recoverable baseline.
3. Make the smallest possible change.
4. Test the affected path.
5. Test the complete critical flow.
6. Commit.
7. Record the result here.
8. Create the next stable backup only after successful verification.
